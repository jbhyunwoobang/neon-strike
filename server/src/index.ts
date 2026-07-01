/**
 * index.ts — NEON STRIKE authoritative game server.
 *
 * Responsibilities:
 *   - HTTP: health check + serves the built client in production (single origin).
 *   - Socket.IO: strongly-typed realtime events (see protocol.ts).
 *   - Fixed-rate simulation loops that broadcast player transforms, enemy state
 *     (co-op) and drive wave progression.
 *
 * Run:   npm run dev     (tsx watch)
 * Build: npm run build   (tsc -> dist)
 * Start: npm start       (node dist/index.js)
 */

import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs';
import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { RoomManager } from './RoomManager';
import {
  ClientToServer, ServerToClient, TRANSFORM_HZ, ENEMY_HZ, GameMode,
} from './protocol';

const PORT = Number(process.env.PORT ?? 8080);
const ORIGIN = process.env.CLIENT_ORIGIN ?? '*';

const app = express();
app.use(cors({ origin: ORIGIN }));

// Health check for Render/Railway/Fly probes.
app.get('/health', (_req, res) => res.json({ ok: true, rooms: manager.count, up: process.uptime() }));

// In production the built client can be served from the same origin.
const clientDist = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  // SPA fallback so /room/CODE deep links resolve to index.html.
  app.get('*', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

const server = http.createServer(app);
const io = new Server<ClientToServer, ServerToClient>(server, {
  cors: { origin: ORIGIN, methods: ['GET', 'POST'] },
});

const manager = new RoomManager();

/** Reverse index: socket id -> room code, so disconnects are O(1). */
const socketRoom = new Map<string, string>();

/* ----------------------------- socket wiring ---------------------------- */

io.on('connection', (socket) => {
  socket.data.name = 'Operator';

  const currentRoom = () => {
    const code = socketRoom.get(socket.id);
    return code ? manager.get(code) : undefined;
  };

  const broadcastSnapshot = () => {
    const room = currentRoom();
    if (room) io.to(room.code).emit('room:snapshot', room.snapshot());
  };

  socket.on('room:create', ({ name, mode }, ack) => {
    leaveCurrent();
    const room = manager.create();
    room.setMode(sanitizeMode(mode));
    socket.data.name = name;
    room.addPlayer(socket.id, name);
    socket.join(room.code);
    socketRoom.set(socket.id, room.code);
    ack({ code: room.code });
    broadcastSnapshot();
  });

  socket.on('room:join', ({ name, code }, ack) => {
    const room = manager.get(code);
    if (!room) return ack({ error: 'Room not found' });
    if (room.inGame && room.mode === 'coop') return ack({ error: 'Match already in progress' });
    if (room.size >= 12) return ack({ error: 'Room is full' });
    leaveCurrent();
    socket.data.name = name;
    room.addPlayer(socket.id, name);
    socket.join(room.code);
    socketRoom.set(socket.id, room.code);
    ack({ ok: true, snapshot: room.snapshot() });
    broadcastSnapshot();
  });

  socket.on('room:leave', () => { leaveCurrent(); });

  socket.on('lobby:ready', (ready) => {
    currentRoom()?.setReady(socket.id, !!ready);
    broadcastSnapshot();
  });

  socket.on('lobby:setMode', (mode) => {
    const room = currentRoom();
    if (room && room.hostId === socket.id) { room.setMode(sanitizeMode(mode)); broadcastSnapshot(); }
  });

  socket.on('lobby:setTeam', (team) => {
    currentRoom()?.setTeam(socket.id, team);
    broadcastSnapshot();
  });

  socket.on('game:start', () => {
    const room = currentRoom();
    if (!room || room.hostId !== socket.id || room.inGame) return;
    const seed = (Math.random() * 0xffffffff) >>> 0;
    const spawn = room.start(seed);
    io.to(room.code).emit('game:started', { mode: room.mode, seed, spawn });
    io.to(room.code).emit('wave:changed', { wave: room.wave, enemies: room.enemyCount });
    broadcastSnapshot();
  });

  socket.on('player:transform', (t) => {
    currentRoom()?.updateTransform(socket.id, t);
  });

  socket.on('player:fire', (p) => {
    const room = currentRoom();
    if (!room) return;
    // Relay tracer/muzzle info to everyone else for visual sync.
    socket.to(room.code).emit('player:fired', { id: socket.id, ...p });
  });

  socket.on('player:hitEnemy', ({ enemyId, dmg, headshot }) => {
    const room = currentRoom();
    if (!room || room.mode !== 'coop') return;
    const res = room.damageEnemy(enemyId, dmg, headshot, socket.id);
    if (res?.killed) {
      const killer = room.getPlayer(socket.id);
      io.to(room.code).emit('player:killed', {
        killer: killer?.name ?? '', victim: `${res.type}`, weapon: 'kill', headshot, t: Date.now(),
      });
      broadcastSnapshot();
    }
  });

  socket.on('player:hitPlayer', ({ targetId, dmg, headshot, weapon }) => {
    const room = currentRoom();
    if (!room || room.mode === 'coop') return;
    const target = io.sockets.sockets.get(targetId);
    if (!target || !socketRoom.get(targetId) || socketRoom.get(targetId) !== room.code) return;
    // Friendly-fire off in TDM.
    if (room.mode === 'tdm') {
      const a = room.getPlayer(socket.id), b = room.getPlayer(targetId);
      if (a && b && a.team === b.team) return;
    }
    target.emit('player:damaged', { hp: Math.max(0, dmg), by: socket.id });
  });

  socket.on('player:died', ({ killerId }) => {
    const room = currentRoom();
    if (!room) return;
    const weapon = 'weapon';
    const ev = room.registerKill(killerId, socket.id, weapon, false);
    io.to(room.code).emit('player:killed', ev);
    broadcastSnapshot();
    if (room.allDown) endMatch(room.code, 'Squad eliminated');
  });

  socket.on('player:respawn', () => {
    const room = currentRoom();
    if (!room) return;
    const pos = room.respawn(socket.id);
    io.to(room.code).emit('player:respawned', { id: socket.id, ...pos });
    broadcastSnapshot();
  });

  socket.on('chat:send', (text) => {
    const room = currentRoom();
    if (!room) return;
    const line = { from: socket.data.name as string, text: String(text).slice(0, 200), t: Date.now() };
    io.to(room.code).emit('chat:line', line);
  });

  socket.on('net:ping', (t, ack) => {
    currentRoom()?.setPing(socket.id, Math.max(0, Date.now() - t));
    ack(t);
  });

  socket.on('disconnect', () => { leaveCurrent(); });

  function leaveCurrent() {
    const code = socketRoom.get(socket.id);
    if (!code) return;
    const room = manager.get(code);
    socket.leave(code);
    socketRoom.delete(socket.id);
    if (!room) return;
    room.removePlayer(socket.id);
    if (room.isEmpty) manager.dispose(code);
    else io.to(code).emit('room:snapshot', room.snapshot());
  }
});

function sanitizeMode(m: GameMode): GameMode {
  return m === 'ffa' || m === 'tdm' || m === 'coop' ? m : 'coop';
}

function endMatch(code: string, reason: string) {
  const room = manager.get(code);
  if (!room) return;
  room.end();
  io.to(code).emit('game:over', { reason, snapshot: room.snapshot() });
}

/* --------------------------- simulation loops --------------------------- */

// Player transform relay.
setInterval(() => {
  for (const room of manager.all()) {
    if (!room.inGame) continue;
    const list = room.transforms();
    if (list.length) io.to(room.code).emit('players:transforms', list);
  }
}, 1000 / TRANSFORM_HZ);

// Co-op enemy simulation + wave progression.
let lastEnemyTick = Date.now();
setInterval(() => {
  const now = Date.now();
  const dt = Math.min(0.25, (now - lastEnemyTick) / 1000);
  lastEnemyTick = now;
  for (const room of manager.all()) {
    if (!room.inGame || room.mode !== 'coop') continue;
    const prevWave = room.wave;
    const { } = room.tickEnemies(dt);
    // Apply enemy melee damage to players.
    if (room.pendingDamage.length) {
      for (const d of room.pendingDamage) {
        io.to(d.to).emit('player:damaged', { hp: d.dmg, by: 'enemy' });
      }
      room.pendingDamage.length = 0;
    }
    io.to(room.code).emit('enemies:state', room.enemyStates());
    if (room.wave !== prevWave) {
      io.to(room.code).emit('wave:changed', { wave: room.wave, enemies: room.enemyCount });
    }
    if (room.allDown) endMatch(room.code, 'Squad eliminated');
  }
}, 1000 / ENEMY_HZ);

// Janitor: drop empty rooms every 30s.
setInterval(() => manager.reap(), 30_000);

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[neon-strike] server listening on :${PORT}  (origin=${ORIGIN})`);
});
