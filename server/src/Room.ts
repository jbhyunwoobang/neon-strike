/**
 * Room.ts — One authoritative game room.
 *
 * A Room owns:
 *   - the roster of connected players (PlayerInfo + last reported transform),
 *   - lobby state (mode, ready flags, host),
 *   - the live match: scores, wave counter, kill feed,
 *   - in co-op mode, a lightweight server-side enemy simulation.
 *
 * The Room does not touch Socket.IO directly. It exposes plain methods and a
 * small event surface; RoomManager wires it to sockets. This keeps the game
 * logic testable and transport-agnostic.
 */

import {
  GameMode, PlayerInfo, PlayerTransform, RoomSnapshot, EnemyState,
  RoomCode, Team, KillEvent,
} from './protocol';

/** Internal per-player record. */
interface Member {
  info: PlayerInfo;
  transform: PlayerTransform | null;
  lastSeen: number;
}

/** Tunables for the co-op director. */
const COOP = {
  baseCount: 4,
  perWave: 2,
  spawnRadius: 90,
  arenaHalf: 96,
  enemyBaseHp: 100,   // grunt = unarmoured-player baseline (matches client)
  enemyHpPerWave: 12,
  enemySpeed: 3.2,
  enemyDamage: 12,
  attackRange: 2.4,
  attackCooldown: 1.0,
};

// On-brand but distinguishable operator colors (ember/bone/gold/teal/oxblood/olive).
const PALETTE = [0xd9552b, 0xe7e0d2, 0xc2a44e, 0x4a7d78, 0x8a2f28, 0x8fa36a];

export class Room {
  readonly code: RoomCode;
  mode: GameMode = 'coop';
  hostId = '';
  inGame = false;
  seed = 1;

  wave = 0;
  teamScore = { red: 0, blue: 0 };

  private members = new Map<string, Member>();
  private enemies: (EnemyState & { target: string | null; atk: number })[] = [];
  private enemySeq = 1;
  private pendingSpawns = 0;
  private spawnTimer = 0;
  private waveBreak = 0;

  constructor(code: RoomCode) {
    this.code = code;
  }

  /* ----------------------------- membership ----------------------------- */

  get size() { return this.members.size; }
  get isEmpty() { return this.members.size === 0; }

  hasPlayer(id: string) { return this.members.has(id); }

  addPlayer(id: string, name: string): PlayerInfo {
    const idx = this.members.size;
    const info: PlayerInfo = {
      id, name: name.slice(0, 16) || `Op-${idx + 1}`,
      team: this.mode === 'tdm' ? (idx % 2 === 0 ? 'red' : 'blue') : 'none',
      color: PALETTE[idx % PALETTE.length],
      ready: false, kills: 0, deaths: 0, score: 0, ping: 0, alive: true,
    };
    this.members.set(id, { info, transform: null, lastSeen: Date.now() });
    if (!this.hostId) this.hostId = id;
    return info;
  }

  removePlayer(id: string) {
    this.members.delete(id);
    // Reassign host to the earliest remaining member.
    if (this.hostId === id) {
      const first = this.members.keys().next();
      this.hostId = first.done ? '' : first.value;
    }
  }

  getPlayer(id: string) { return this.members.get(id)?.info; }
  players(): PlayerInfo[] { return [...this.members.values()].map(m => m.info); }

  setReady(id: string, ready: boolean) { const m = this.members.get(id); if (m) m.info.ready = ready; }
  setTeam(id: string, team: Team) { const m = this.members.get(id); if (m && this.mode === 'tdm') m.info.team = team; }
  setPing(id: string, ping: number) { const m = this.members.get(id); if (m) m.info.ping = ping; }

  setMode(mode: GameMode) {
    if (this.inGame) return;
    this.mode = mode;
    // Re-team players when switching in/out of TDM.
    let i = 0;
    for (const m of this.members.values()) {
      m.info.team = mode === 'tdm' ? (i % 2 === 0 ? 'red' : 'blue') : 'none';
      i++;
    }
  }

  /* ------------------------------- match -------------------------------- */

  start(seed: number): { x: number; y: number; z: number } {
    this.inGame = true;
    this.seed = seed;
    this.wave = 0;
    this.teamScore = { red: 0, blue: 0 };
    this.enemies = [];
    for (const m of this.members.values()) {
      m.info.kills = 0; m.info.deaths = 0; m.info.score = 0; m.info.alive = true;
    }
    if (this.mode === 'coop') this.beginWave(1);
    return { x: 0, y: 1.7, z: 42 }; // open plaza, clear of the central pillar
  }

  end() {
    this.inGame = false;
    this.enemies = [];
    for (const m of this.members.values()) m.info.ready = false;
  }

  updateTransform(id: string, t: PlayerTransform) {
    const m = this.members.get(id);
    if (!m) return;
    m.transform = t;
    m.lastSeen = Date.now();
  }

  /** Transforms for everyone with a known position (for the relay broadcast). */
  transforms(): (PlayerTransform & { id: string })[] {
    const out: (PlayerTransform & { id: string })[] = [];
    for (const [id, m] of this.members) if (m.transform) out.push({ ...m.transform, id });
    return out;
  }

  /* --------------------------- PvP scoring ------------------------------ */

  registerKill(killerId: string | null, victimId: string, weapon: string, headshot: boolean): KillEvent {
    const victim = this.members.get(victimId)?.info;
    const killer = killerId ? this.members.get(killerId)?.info : undefined;
    if (victim) { victim.deaths++; victim.alive = false; }
    if (killer && killer.id !== victimId) {
      killer.kills++;
      killer.score += headshot ? 150 : 100;
      if (this.mode === 'tdm' && killer.team !== 'none') this.teamScore[killer.team] += 1;
    }
    return {
      killer: killer && killer.id !== victimId ? killer.name : '',
      victim: victim?.name ?? '???',
      weapon, headshot, t: Date.now(),
    };
  }

  respawn(id: string): { x: number; y: number; z: number } {
    const m = this.members.get(id);
    if (m) m.info.alive = true;
    // Scatter spawns across the arena so players don't stack.
    const a = this.rand() * Math.PI * 2;
    const r = 30 + this.rand() * 50;
    return { x: Math.cos(a) * r, y: 1.7, z: Math.sin(a) * r };
  }

  /* ----------------------- co-op enemy simulation ----------------------- */

  private beginWave(n: number) {
    this.wave = n;
    this.pendingSpawns = COOP.baseCount + Math.floor(n * COOP.perWave) + (this.members.size - 1) * 2;
    this.spawnTimer = 0;
    this.waveBreak = 0;
  }

  /** Advance the co-op director. Returns true if a wave transition happened. */
  tickEnemies(dt: number): { waveChanged: boolean; killsByPlayer: Record<string, number> } {
    const killsByPlayer: Record<string, number> = {};
    let waveChanged = false;
    if (this.mode !== 'coop' || !this.inGame) return { waveChanged, killsByPlayer };

    // Between-wave breather.
    if (this.waveBreak > 0) {
      this.waveBreak -= dt;
      if (this.waveBreak <= 0) { this.beginWave(this.wave + 1); waveChanged = true; }
      return { waveChanged, killsByPlayer };
    }

    // Spawn drip.
    if (this.pendingSpawns > 0) {
      this.spawnTimer -= dt;
      if (this.spawnTimer <= 0) {
        this.spawnEnemy();
        this.pendingSpawns--;
        this.spawnTimer = Math.max(0.3, 1.3 - this.wave * 0.04);
      }
    }

    const alivePlayers = [...this.members.values()].filter(m => m.info.alive && m.transform);

    // Move + attack.
    for (const e of this.enemies) {
      const target = this.nearestPlayer(e, alivePlayers);
      e.target = target?.info.id ?? null;
      if (target && target.transform) {
        const dx = target.transform.x - e.x;
        const dz = target.transform.z - e.z;
        const d = Math.hypot(dx, dz) || 1;
        const speed = COOP.enemySpeed + this.wave * 0.08;
        if (d > COOP.attackRange) {
          e.x += (dx / d) * speed * dt;
          e.z += (dz / d) * speed * dt;
        }
        e.ry = Math.atan2(dx, dz);
        e.atk -= dt;
        if (d <= COOP.attackRange && e.atk <= 0) {
          e.atk = COOP.attackCooldown;
          // Damage is applied client-side authoritatively-lite: we emit via manager.
          this.pendingDamage.push({ to: target.info.id, dmg: COOP.enemyDamage });
        }
      }
    }

    // Wave clear check.
    if (this.pendingSpawns === 0 && this.enemies.length === 0) {
      this.waveBreak = 4; // seconds before next wave
    }

    return { waveChanged, killsByPlayer };
  }

  /** Damage the enemy sim wants to deal to players this tick (drained by manager). */
  pendingDamage: { to: string; dmg: number }[] = [];

  private spawnEnemy() {
    const wave = this.wave;
    let type = 'grunt';
    const r = this.rand();
    if (wave >= 10 && r < 0.12) type = 'heavy';
    else if (wave >= 7 && r < 0.28) type = 'drone';
    else if (wave >= 6 && r < 0.4) type = 'bomber';
    else if (wave >= 4 && r < 0.56) type = this.rand() > 0.5 ? 'soldier' : 'wraith';
    else if (wave >= 2 && r < 0.75 && this.rand() < 0.45) type = 'hound';
    if (wave % 3 === 0 && this.enemies.length === 0 && this.pendingSpawns > 0) type = 'boss';

    // Type multipliers mirror the client table (grunt 100 / soldier 150 /
    // drone 70 / hound 80 / wraith 130 / bomber 120 / heavy 450 / boss 2600).
    const hpMul = type === 'boss' ? 26 : type === 'heavy' ? 4.5 : type === 'soldier' ? 1.5
      : type === 'drone' ? 0.7 : type === 'hound' ? 0.8 : type === 'wraith' ? 1.3 : type === 'bomber' ? 1.2 : 1;
    const maxHp = Math.round((COOP.enemyBaseHp + wave * COOP.enemyHpPerWave) * hpMul);

    const a = this.rand() * Math.PI * 2;
    const r2 = COOP.spawnRadius * (0.7 + this.rand() * 0.3);
    this.enemies.push({
      id: this.enemySeq++, type,
      x: Math.max(-COOP.arenaHalf, Math.min(COOP.arenaHalf, Math.cos(a) * r2)),
      y: type === 'drone' ? 4 : 1,
      z: Math.max(-COOP.arenaHalf, Math.min(COOP.arenaHalf, Math.sin(a) * r2)),
      ry: 0, hp: maxHp, maxHp, target: null, atk: 0,
    });
  }

  private nearestPlayer(e: { x: number; z: number }, players: Member[]): Member | null {
    let best: Member | null = null, bd = Infinity;
    for (const p of players) {
      if (!p.transform) continue;
      const d = (p.transform.x - e.x) ** 2 + (p.transform.z - e.z) ** 2;
      if (d < bd) { bd = d; best = p; }
    }
    return best;
  }

  /** Apply a client-reported hit to a server enemy. Returns kill info if it died. */
  damageEnemy(enemyId: number, dmg: number, headshot: boolean, byId: string):
    { killed: boolean; type: string } | null {
    const e = this.enemies.find(x => x.id === enemyId);
    if (!e) return null;
    e.hp -= headshot ? dmg * 2.5 : dmg;
    if (e.hp <= 0) {
      this.enemies = this.enemies.filter(x => x !== e);
      const killer = this.members.get(byId)?.info;
      if (killer) {
        killer.kills++;
        killer.score += (e.type === 'boss' ? 1000 : e.type === 'heavy' ? 250 : 100) + this.wave * 10;
      }
      return { killed: true, type: e.type };
    }
    return { killed: false, type: e.type };
  }

  enemyStates(): EnemyState[] {
    return this.enemies.map(({ target, atk, ...s }) => s);
  }
  get enemyCount() { return this.enemies.length + this.pendingSpawns; }

  /** All players are down → co-op loss. */
  get allDown() {
    if (this.mode !== 'coop') return false;
    const alive = [...this.members.values()].some(m => m.info.alive);
    return this.inGame && !alive && this.members.size > 0;
  }

  snapshot(): RoomSnapshot {
    return {
      code: this.code, mode: this.mode, hostId: this.hostId, inGame: this.inGame,
      wave: this.wave, teamScore: this.teamScore, players: this.players(),
    };
  }

  /* Deterministic PRNG (mulberry32) so co-op spawns are reproducible per room. */
  private rngState = 0x9e3779b9;
  private rand(): number {
    let t = (this.rngState += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}
