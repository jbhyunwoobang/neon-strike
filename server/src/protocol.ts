/**
 * protocol.ts — Shared network contract between client and server.
 *
 * This file is the single source of truth for every Socket.IO event name and
 * payload shape. A byte-identical copy lives at `client/src/shared/protocol.ts`
 * so the browser bundle can import the same types without a build-time monorepo
 * link. Keep the two files in sync (see docs/NETWORKING.md).
 *
 * Design notes:
 *  - The server is authoritative for room membership, scores, kills, deaths,
 *    respawns, the wave counter and (in co-op) enemy simulation.
 *  - Player transforms are relayed by the server at a fixed broadcast rate.
 *    We trust clients for their own position (this is a friendly web game, not
 *    a competitive title — anti-cheat is explicitly out of scope, see README).
 */

/** Supported game modes. */
export type GameMode = 'coop' | 'ffa' | 'tdm';

/** A short human-shareable room code, e.g. "AB29KD". */
export type RoomCode = string;

/** Team assignment. FFA players are all on team 'none'. */
export type Team = 'none' | 'red' | 'blue';

/** Lightweight description of a connected player, safe to broadcast to everyone. */
export interface PlayerInfo {
  id: string;          // socket id
  name: string;        // display name
  team: Team;
  color: number;       // 0xRRGGBB avatar tint
  ready: boolean;
  kills: number;
  deaths: number;
  score: number;
  ping: number;        // ms, updated from heartbeat
  alive: boolean;
}

/** Per-tick transform a client reports for itself. */
export interface PlayerTransform {
  x: number; y: number; z: number; // world position (feet)
  ry: number;                       // yaw (radians)
  rx: number;                       // pitch (radians)
  vx: number; vy: number; vz: number; // velocity (for interpolation hints)
  state: number;                    // packed movement flags (see MoveFlags)
  weapon: number;                   // weapon index currently held
  t: number;                        // client timestamp (ms)
}

/** Packed movement flags shared so remote avatars can animate correctly. */
export enum MoveFlags {
  None = 0,
  Crouch = 1 << 0,
  Sprint = 1 << 1,
  Firing = 1 << 2,
  Reloading = 1 << 3,
  Airborne = 1 << 4,
  Sliding = 1 << 5,
}

/** Server-simulated enemy (co-op). */
export interface EnemyState {
  id: number;
  type: string;   // matches a key in the client ENEMY_TYPES table
  x: number; y: number; z: number;
  ry: number;
  hp: number;
  maxHp: number;
}

/** Snapshot of a room's public lobby/game state. */
export interface RoomSnapshot {
  code: RoomCode;
  mode: GameMode;
  hostId: string;
  inGame: boolean;
  wave: number;
  teamScore: { red: number; blue: number };
  players: PlayerInfo[];
}

/** One entry in the rolling kill feed. */
export interface KillEvent {
  killer: string;   // display name ('' for environment/suicide)
  victim: string;
  weapon: string;
  headshot: boolean;
  t: number;
}

/** Chat line. */
export interface ChatLine {
  from: string;
  text: string;
  t: number;
}

/* ------------------------------------------------------------------ *
 *  Socket.IO event maps. Typed both directions for end-to-end safety.
 * ------------------------------------------------------------------ */

/** Events the CLIENT emits to the SERVER. */
export interface ClientToServer {
  'room:create': (p: { name: string; mode: GameMode }, ack: (r: { code: RoomCode } | { error: string }) => void) => void;
  'room:join': (p: { name: string; code: RoomCode }, ack: (r: { ok: true; snapshot: RoomSnapshot } | { error: string }) => void) => void;
  'room:leave': () => void;
  'lobby:ready': (ready: boolean) => void;
  'lobby:setMode': (mode: GameMode) => void;
  'lobby:setTeam': (team: Team) => void;
  'game:start': () => void;
  'player:transform': (t: PlayerTransform) => void;
  'player:fire': (p: { ox: number; oy: number; oz: number; dx: number; dy: number; dz: number; weapon: number }) => void;
  'player:hitEnemy': (p: { enemyId: number; dmg: number; headshot: boolean }) => void;
  'player:hitPlayer': (p: { targetId: string; dmg: number; headshot: boolean; weapon: string }) => void;
  'player:died': (p: { killerId: string | null }) => void;
  'player:respawn': () => void;
  'chat:send': (text: string) => void;
  'net:ping': (t: number, ack: (t: number) => void) => void;
}

/** Events the SERVER emits to the CLIENT. */
export interface ServerToClient {
  'room:snapshot': (s: RoomSnapshot) => void;
  'room:closed': (reason: string) => void;
  'game:started': (p: { mode: GameMode; seed: number; spawn: { x: number; y: number; z: number } }) => void;
  'game:over': (p: { reason: string; snapshot: RoomSnapshot }) => void;
  'players:transforms': (list: (PlayerTransform & { id: string })[]) => void;
  'player:fired': (p: { id: string; ox: number; oy: number; oz: number; dx: number; dy: number; dz: number; weapon: number }) => void;
  'player:damaged': (p: { hp: number; by: string }) => void;
  'player:killed': (e: KillEvent) => void;
  'player:respawned': (p: { id: string; x: number; y: number; z: number }) => void;
  'enemies:state': (list: EnemyState[]) => void;
  'wave:changed': (p: { wave: number; enemies: number }) => void;
  'chat:line': (line: ChatLine) => void;
}

/** On-brand operator identity colors (ember/bone/gold/teal/oxblood/olive). */
export const PLAYER_COLORS = [0xd9552b, 0xe7e0d2, 0xc2a44e, 0x4a7d78, 0x8a2f28, 0x8fa36a];

/** Room codes use an unambiguous alphabet (no O/0, I/1). */
export const ROOM_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const ROOM_CODE_LEN = 6;

/** Server broadcast cadence for player transforms (Hz). */
export const TRANSFORM_HZ = 20;
/** Server enemy simulation + broadcast cadence (Hz). */
export const ENEMY_HZ = 15;
