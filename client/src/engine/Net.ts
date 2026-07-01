/**
 * Net.ts — Socket.IO transport wrapper.
 *
 * Thin, strongly-typed layer over socket.io-client. It owns the connection
 * lifecycle, room create/join (promise-wrapped acks), a periodic ping
 * heartbeat, and typed emit helpers. Game subscribes to server events through
 * `on(...)` and renders remote players/enemies itself.
 *
 * All event names/payloads come from the shared protocol, so a change on the
 * server surfaces as a compile error here.
 */

import { io, Socket } from 'socket.io-client';
import type {
  ClientToServer, ServerToClient, GameMode, RoomSnapshot, PlayerTransform,
} from '../shared/protocol';
import { store } from '../store';

type ServerEvent = keyof ServerToClient;

export class Net {
  socket: Socket<ServerToClient, ClientToServer> | null = null;
  private url: string;
  private pingTimer: number | null = null;

  constructor(url: string) { this.url = url; }

  get id() { return this.socket?.id ?? null; }
  get connected() { return !!this.socket?.connected; }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) return resolve();
      this.socket = io(this.url, { transports: ['websocket'], reconnection: true, timeout: 8000 });
      this.socket.on('connect', () => {
        store.get().setMp({ connected: true, selfId: this.socket!.id ?? null, error: null });
        this.startPing();
        resolve();
      });
      this.socket.on('connect_error', (err) => {
        store.get().setMp({ connected: false, error: `Cannot reach server (${err.message})` });
        reject(err);
      });
      this.socket.on('disconnect', () => store.get().setMp({ connected: false }));
    });
  }

  private startPing() {
    if (this.pingTimer) window.clearInterval(this.pingTimer);
    this.pingTimer = window.setInterval(() => {
      const t = Date.now();
      this.socket?.emit('net:ping', t, (echo) => {
        store.get().setMp({ ping: Math.max(0, Date.now() - echo) });
      });
    }, 2000);
  }

  createRoom(name: string, mode: GameMode): Promise<string> {
    return new Promise((resolve, reject) => {
      this.socket?.emit('room:create', { name, mode }, (r) => {
        if ('code' in r) resolve(r.code); else reject(new Error(r.error));
      });
    });
  }

  joinRoom(name: string, code: string): Promise<RoomSnapshot> {
    return new Promise((resolve, reject) => {
      this.socket?.emit('room:join', { name, code: code.toUpperCase() }, (r) => {
        if ('ok' in r) resolve(r.snapshot); else reject(new Error(r.error));
      });
    });
  }

  leaveRoom() { this.socket?.emit('room:leave'); }
  setReady(ready: boolean) { this.socket?.emit('lobby:ready', ready); }
  setMode(mode: GameMode) { this.socket?.emit('lobby:setMode', mode); }
  startGame() { this.socket?.emit('game:start'); }
  sendTransform(t: PlayerTransform) { this.socket?.emit('player:transform', t); }
  sendFire(p: { ox: number; oy: number; oz: number; dx: number; dy: number; dz: number; weapon: number }) { this.socket?.emit('player:fire', p); }
  hitEnemy(enemyId: number, dmg: number, headshot: boolean) { this.socket?.emit('player:hitEnemy', { enemyId, dmg, headshot }); }
  hitPlayer(targetId: string, dmg: number, headshot: boolean, weapon: string) { this.socket?.emit('player:hitPlayer', { targetId, dmg, headshot, weapon }); }
  reportDeath(killerId: string | null) { this.socket?.emit('player:died', { killerId }); }
  requestRespawn() { this.socket?.emit('player:respawn'); }
  chat(text: string) { this.socket?.emit('chat:send', text); }

  on<K extends ServerEvent>(event: K, handler: ServerToClient[K]) {
    // socket.io's typed .on wants the exact listener signature; this wrapper
    // simply forwards, keeping Game's subscription code compact.
    this.socket?.on(event, handler as any);
  }
  off<K extends ServerEvent>(event: K) { this.socket?.off(event); }

  dispose() {
    if (this.pingTimer) window.clearInterval(this.pingTimer);
    this.socket?.disconnect();
    this.socket = null;
  }
}
