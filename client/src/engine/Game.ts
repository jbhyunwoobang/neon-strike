/**
 * Game.ts — Top-level orchestrator.
 *
 * Instantiates the engine + every gameplay system and wires them together, then
 * runs one `update(dt)` per frame. It is the single place that:
 *   - drives the player controller, weapon and enemies,
 *   - resolves shots into damage / score / HUD,
 *   - manages health/armor, pickups, death & respawn,
 *   - in multiplayer: sends the local transform, renders remote players/enemies
 *     from server snapshots, and reports hits authoritatively-lite.
 *
 * React only ever calls: `new Game(canvas)`, `start(mode, opts)`, `pause()`,
 * `resume()`, `dispose()`. Everything else flows through the Zustand store.
 */

import * as THREE from 'three';
import { Engine } from './Engine';
import { Input } from './Input';
import { Audio } from './Audio';
import { Arena } from './Arena';
import { Player } from './Player';
import { Effects } from './Effects';
import { WeaponController, WEAPONS, type ShotResult } from './Weapons';
import { EnemyManager } from './Enemies';
import { WaveManager } from './WaveManager';
import { Net } from './Net';
import { store } from '../store';
import type { GameMode, PlayerTransform, PlayerInfo } from '../shared/protocol';

export interface StartOptions {
  mode: GameMode;
  seed?: number;
  spawn?: { x: number; y: number; z: number };
  net?: Net;                    // provided for multiplayer
  spawnPoints?: THREE.Vector3[];
}

interface Pickup { mesh: THREE.Mesh; kind: 'health' | 'ammo'; }

export class Game {
  private engine: Engine;
  private input: Input;
  private audio: Audio;
  private effects: Effects;
  private arena!: Arena;
  private player!: Player;
  private weapon!: WeaponController;
  private enemies!: EnemyManager;
  private waves!: WaveManager;

  private net: Net | null = null;
  private mode: GameMode = 'coop';
  private running = false;
  paused = false;

  // Player vitals.
  private health = 100;
  private armor = 0;
  private maxHealth = 100;
  private score = 0;
  private kills = 0;
  private respawnTimer = 0;
  private dead = false;

  // Pickups.
  private pickups: Pickup[] = [];
  private pickupTimer = 10;

  // Multiplayer.
  private remotePlayers = new Map<string, { group: THREE.Group; body: THREE.Mesh; head: THREE.Mesh; tx: number; ty: number; tz: number; ry: number }>();
  private netSendTimer = 0;

  private lastLook = { dx: 0, dy: 0 };
  private onGameOver?: (won: boolean) => void;

  constructor(canvas: HTMLCanvasElement) {
    const s = store.get().settings;
    this.engine = new Engine(canvas, s.quality, s.fov);
    this.input = new Input(canvas);
    this.audio = new Audio();
    this.effects = new Effects(this.engine.scene);
  }

  /* ------------------------------- lifecycle ----------------------------- */

  start(opts: StartOptions, onGameOver?: (won: boolean) => void) {
    this.mode = opts.mode;
    this.net = opts.net ?? null;
    this.onGameOver = onGameOver;
    this.audio.resume();
    store.get().resetHud();

    // Build the world.
    this.arena = new Arena(this.engine, opts.seed ?? 1);
    this.player = new Player(this.engine.camera, this.arena.colliders, this.input);
    this.player.onFootstep = (metal) => this.audio.footstep(metal);
    const spawn = opts.spawn ?? { x: 0, y: 1.7, z: 0 };
    this.player.reset(spawn.x, 0, spawn.z);

    this.enemies = new EnemyManager({
      scene: this.engine.scene,
      colliders: this.arena.colliders,
      effects: this.effects,
      audio: this.audio,
      getPlayerPos: () => this.player.pos,
      onPlayerDamage: (d) => this.damagePlayer(d, null),
      onKill: (sc, type, head) => this.onEnemyKilled(sc, type, head),
    });

    this.weapon = new WeaponController({
      camera: this.engine.camera,
      effects: this.effects,
      audio: this.audio,
      worldTargets: this.arena.raycastTargets,
      getEnemyMeshes: () => this.mode === 'coop' || this.mode === 'ffa' || this.mode === 'tdm'
        ? [...this.enemies.meshes(), ...this.pvpTargets()]
        : this.enemies.meshes(),
      applyRecoil: (p, y) => { this.player.pitch = Math.min(Math.PI / 2 - 0.05, this.player.pitch + p); this.player.yaw += y; },
      onShot: (r) => this.onShot(r),
      onFire: (o, d, wi) => this.onFire(o, d, wi),
      setFov: (fov) => this.engine.setFov(fov),
      baseFov: store.get().settings.fov,
    });

    this.waves = new WaveManager({
      enemies: this.enemies,
      getPlayerPos: () => this.player.pos,
      onWaveChange: (w, c) => store.get().setHud({ wave: w, enemiesLeft: c }),
      onToast: (m) => this.toast(m),
      onWaveHorn: () => this.audio.waveHorn(),
    });

    // Reset vitals.
    this.health = this.maxHealth = 100;
    this.armor = this.mode === 'ffa' || this.mode === 'tdm' ? 25 : 0;
    this.score = 0; this.kills = 0; this.dead = false; this.respawnTimer = 0;

    // Mode-specific setup.
    if (this.mode === 'coop') this.enemies.networked = !!this.net;
    if (!this.net && this.mode === 'coop') this.waves.start();      // solo waves
    if (this.mode === 'coop' && !this.net === false) { /* net waves via server */ }

    if (this.net) this.bindNet();

    this.input.enabled = true;
    this.input.requestLock();

    // Debug handle for automated tests — stripped from production builds.
    if ((import.meta as any).env?.DEV) {
      (window as any).__ns = {
        game: this, player: this.player, enemies: this.enemies,
        nearestEnemyDist: () => {
          let best = Infinity;
          for (const m of this.enemies.meshes()) {
            const d = Math.hypot(m.parent!.position.x - this.player.pos.x, m.parent!.position.z - this.player.pos.z);
            if (d < best) best = d;
          }
          return best;
        },
        health: () => this.health,
      };
    }

    this.engine.onUpdate(this.update);
    this.engine.start();
    this.running = true;
    this.syncHud();
  }

  pause() { this.paused = true; this.input.enabled = false; this.input.exitLock(); }
  resume() { this.paused = false; this.input.enabled = true; this.input.resetLook(); this.input.requestLock(); }

  requestLock() { this.input.requestLock(); }

  dispose() {
    this.running = false;
    this.engine.offUpdate(this.update);
    this.input.enabled = false;
    this.input.dispose();
    this.audio.dispose();
    this.enemies?.clear();
    this.remotePlayers.forEach((r) => this.engine.scene.remove(r.group));
    this.remotePlayers.clear();
    this.engine.dispose();
  }

  /* ------------------------------- net wiring ---------------------------- */

  private selfId(): string | null { return this.net?.id ?? null; }

  private bindNet() {
    const net = this.net!;
    net.on('players:transforms', (list) => {
      for (const t of list) {
        if (t.id === this.selfId()) continue;
        this.updateRemotePlayer(t);
      }
    });
    net.on('player:fired', (p) => {
      if (p.id === this.selfId()) return;
      const from = new THREE.Vector3(p.ox, p.oy, p.oz);
      const to = from.clone().add(new THREE.Vector3(p.dx, p.dy, p.dz).multiplyScalar(60));
      this.effects.tracer(from, to, 0xff8a4a);
    });
    net.on('enemies:state', (list) => { if (this.mode === 'coop') this.enemies.syncNet(list); });
    net.on('wave:changed', (p) => store.get().setHud({ wave: p.wave, enemiesLeft: p.enemies }));
    net.on('player:damaged', (p) => { this.damagePlayer(p.hp, p.by === 'enemy' ? null : p.by); });
    net.on('player:respawned', (p) => {
      if (p.id === this.selfId()) { this.player.reset(p.x, 0, p.z); this.dead = false; this.health = 100; this.armor = 25; this.syncHud(); }
    });
    net.on('player:killed', (e) => {
      const txt = e.killer ? `${e.killer} ▸ ${e.victim}` : `${e.victim} was eliminated`;
      store.get().pushKill(txt + (e.headshot ? '  ⊙' : ''));
    });
    net.on('game:over', ({ snapshot }) => { store.get().setMp({ snapshot, players: snapshot.players }); this.endMatch(false); });
  }

  private pvpTargets(): THREE.Object3D[] {
    if (this.mode !== 'ffa' && this.mode !== 'tdm') return [];
    const out: THREE.Object3D[] = [];
    this.remotePlayers.forEach((r) => out.push(r.body, r.head));
    return out;
  }

  private ensureRemote(id: string) {
    let r = this.remotePlayers.get(id);
    if (!r) {
      const info = store.get().mp.players.find((p) => p.id === id);
      const color = info?.color ?? 0x38ff9c;
      const group = new THREE.Group();
      const body = new THREE.Mesh(
        new THREE.CapsuleGeometry ? new THREE.CapsuleGeometry(0.35, 1.0, 4, 8) : new THREE.CylinderGeometry(0.35, 0.35, 1.7, 8),
        new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.3, roughness: 0.5, metalness: 0.3 }),
      );
      body.position.y = 1.0; body.castShadow = true;
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: color, emissiveIntensity: 0.3 }));
      head.position.y = 1.85;
      body.userData.playerId = id; head.userData.playerId = id; head.userData.headY = 1.7;
      body.userData.headY = 1.7;
      group.add(body, head);
      this.engine.scene.add(group);
      r = { group, body, head, tx: 0, ty: 0, tz: 0, ry: 0 };
      this.remotePlayers.set(id, r);
    }
    return r;
  }

  private updateRemotePlayer(t: PlayerTransform & { id: string }) {
    const r = this.ensureRemote(t.id);
    r.tx = t.x; r.ty = t.y; r.tz = t.z; r.ry = t.ry;
  }

  removeRemote(id: string) {
    const r = this.remotePlayers.get(id);
    if (r) { this.engine.scene.remove(r.group); this.remotePlayers.delete(id); }
  }

  /* ------------------------------- combat -------------------------------- */

  private onShot(r: ShotResult) {
    if (r.enemyId !== undefined) {
      store.get().setHud({ hitmarker: performance.now(), headshot: r.headshot });
      this.audio.hitmarker(r.headshot);
      if (this.mode === 'coop' && this.net) {
        this.net.hitEnemy(r.enemyId, r.dmg, r.headshot);          // server adjudicates
      } else {
        this.enemies.damageLocal(r.enemyId, r.dmg, r.headshot);   // single-player
      }
    } else if (r.playerId !== undefined && this.net) {
      store.get().setHud({ hitmarker: performance.now(), headshot: r.headshot });
      this.audio.hitmarker(r.headshot);
      this.net.hitPlayer(r.playerId, r.dmg, r.headshot, this.weapon.def.id);
    }
  }

  private onFire(origin: THREE.Vector3, dir: THREE.Vector3, weaponIndex: number) {
    if (this.net) {
      this.net.sendFire({ ox: origin.x, oy: origin.y, oz: origin.z, dx: dir.x, dy: dir.y, dz: dir.z, weapon: weaponIndex });
    }
  }

  private onEnemyKilled(scoreGain: number, _type: string, headshot: boolean) {
    this.score += scoreGain + (headshot ? 50 : 0);
    this.kills += 1;
    this.audio.kill();
    store.get().setHud({ score: this.score, kills: this.kills, enemiesLeft: this.waves?.enemyCount ?? this.enemies.count });
  }

  private damagePlayer(dmg: number, by: string | null) {
    if (this.dead || dmg <= 0) return;
    // Armor absorbs 60% until depleted.
    if (this.armor > 0) {
      const absorbed = Math.min(this.armor, dmg * 0.6);
      this.armor -= absorbed;
      dmg -= absorbed;
    }
    this.health -= dmg;
    this.audio.hurt();
    store.get().setHud({ damageFlash: performance.now(), health: Math.max(0, this.health), armor: Math.max(0, this.armor) });
    if (this.health <= 0) this.onDeath(by);
  }

  private onDeath(by: string | null) {
    this.dead = true;
    this.health = 0;
    store.get().setHud({ alive: false, health: 0 });
    if (this.net) {
      this.net.reportDeath(by);
      // Respawn in PvP / co-op after a delay.
      this.respawnTimer = this.mode === 'coop' ? 6 : 3;
    } else {
      // Single-player: game over.
      this.endMatch(false);
    }
  }

  /* ------------------------------- pickups ------------------------------- */

  private spawnPickup() {
    if (this.pickups.length >= 3 || this.mode === 'ffa' || this.mode === 'tdm') return;
    const kind: 'health' | 'ammo' = Math.random() < 0.5 ? 'health' : 'ammo';
    const color = kind === 'health' ? 0x8fa36a : 0xd9552b;
    const mesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.4), new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.9, metalness: 0.3, roughness: 0.3 }));
    const a = Math.random() * Math.PI * 2, r = 10 + Math.random() * 50;
    mesh.position.set(Math.cos(a) * r, 1.1, Math.sin(a) * r);
    mesh.add(new THREE.PointLight(color, 1.0, 5));
    this.engine.scene.add(mesh);
    this.pickups.push({ mesh, kind });
  }

  private updatePickups(dt: number, elapsed: number) {
    this.pickupTimer -= dt;
    if (this.pickupTimer <= 0) { this.spawnPickup(); this.pickupTimer = 12 + Math.random() * 6; }
    for (const p of [...this.pickups]) {
      p.mesh.rotation.y += dt * 2;
      p.mesh.position.y = 1.1 + Math.sin(elapsed * 2) * 0.12;
      if (p.mesh.position.distanceTo(this.player.pos) < 1.6) {
        if (p.kind === 'health') { this.health = Math.min(this.maxHealth, this.health + 35); this.toast('+35 HEALTH'); }
        else { this.weapon.addReserve(0.5); this.toast('AMMO RESUPPLY'); }
        this.audio.pickup();
        this.engine.scene.remove(p.mesh);
        this.pickups.splice(this.pickups.indexOf(p), 1);
        this.syncHud();
      }
    }
  }

  /* -------------------------------- update ------------------------------- */

  private update = (dt: number, elapsed: number) => {
    if (!this.running || this.paused) return;

    // Death / respawn handling (MP).
    if (this.dead && this.net) {
      this.respawnTimer -= dt;
      store.get().setHud({ toast: `RESPAWN IN ${Math.ceil(this.respawnTimer)}` });
      if (this.respawnTimer <= 0) { this.net.requestRespawn(); this.respawnTimer = 999; }
      this.engine.setFov(store.get().settings.fov);
      this.arena.update(dt, elapsed, this.engine.camera.position);
      this.effects.update(dt);
      return;
    }

    // Weapon switching (number keys + wheel).
    for (let i = 1; i <= 9; i++) if (this.input.isDown(`Digit${i}`)) this.weapon.switchTo(i - 1);
    if (this.input.wheel !== 0) { this.weapon.cycle(this.input.wheel > 0 ? 1 : -1); this.input.wheel = 0; }
    if (this.input.wantReload) { this.weapon.reload(); this.input.wantReload = false; }
    if (this.input.isDown('KeyV')) this.weapon.toggleFireMode();

    // Player movement.
    const beforeYaw = this.player.yaw, beforePitch = this.player.pitch;
    this.player.update(dt);
    this.lastLook = { dx: this.player.yaw - beforeYaw, dy: this.player.pitch - beforePitch };

    // Weapon (trigger + ADS from input).
    const moveSpeed = Math.hypot(this.player.vel.x, this.player.vel.z);
    this.weapon.update(dt, this.input.firing, this.input.aiming, this.lastLook, moveSpeed);

    // Enemies.
    if (this.enemies.networked) this.enemies.updateNet(dt);
    else this.enemies.updateLocal(dt, elapsed);
    if (!this.net && this.mode === 'coop') this.waves.update(dt);

    // Pickups + world.
    this.updatePickups(dt, elapsed);
    this.arena.update(dt, elapsed, this.engine.camera.position);
    this.effects.update(dt);

    // Interpolate remote players.
    this.remotePlayers.forEach((r) => {
      r.group.position.x += (r.tx - r.group.position.x) * Math.min(1, dt * 12);
      r.group.position.y += (r.tz !== undefined ? (r.ty - r.group.position.y) : 0) * Math.min(1, dt * 12);
      r.group.position.z += (r.tz - r.group.position.z) * Math.min(1, dt * 12);
      r.group.rotation.y = r.ry;
    });

    // Network: send our transform at a fixed rate.
    if (this.net) {
      this.netSendTimer -= dt;
      if (this.netSendTimer <= 0) {
        this.netSendTimer = 1 / 20;
        const t: PlayerTransform = {
          x: this.player.pos.x, y: this.player.pos.y, z: this.player.pos.z,
          ry: this.player.yaw, rx: this.player.pitch,
          vx: this.player.vel.x, vy: this.player.vel.y, vz: this.player.vel.z,
          state: this.player.flags, weapon: this.weapon.index, t: Date.now(),
        };
        this.net.sendTransform(t);
      }
    }

    // HUD refresh (cheap fields every frame).
    store.get().setHud({
      ammo: this.weapon.ammo[this.weapon.index],
      reserve: this.weapon.reserve[this.weapon.index],
      weapon: this.weapon.def.name,
      fireMode: this.weapon.fireModeLabel,
      reloading: this.weapon.reloading,
      fps: this.engine.fps,
      health: Math.max(0, Math.round(this.health)),
      armor: Math.max(0, Math.round(this.armor)),
      alive: !this.dead,
    });
  };

  private syncHud() {
    store.get().setHud({
      health: Math.round(this.health), armor: Math.round(this.armor),
      ammo: this.weapon?.ammo[this.weapon.index] ?? 30,
      reserve: this.weapon?.reserve[this.weapon.index] ?? 120,
      weapon: this.weapon?.def.name ?? 'RIFLE',
      score: this.score, kills: this.kills, alive: !this.dead,
    });
  }

  private toast(msg: string) {
    store.get().setHud({ toast: msg });
    window.setTimeout(() => { if (store.get().hud.toast === msg) store.get().setHud({ toast: '' }); }, 2200);
  }

  private endMatch(won: boolean) {
    this.running = false;
    this.paused = true;
    this.input.enabled = false;
    this.input.exitLock();
    store.get().recordScore(this.score);
    this.onGameOver?.(won);
  }

  /** Public getters for the game-over screen. */
  get finalScore() { return this.score; }
  get finalKills() { return this.kills; }
  get finalWave() { return this.waves?.wave ?? store.get().hud.wave; }
}
