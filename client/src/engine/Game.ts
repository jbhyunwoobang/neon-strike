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
import { Arena, MAP_THEMES, MAP_NAMES, type MapTheme } from './Arena';
import { Player } from './Player';
import { Effects } from './Effects';
import { WeaponController, WEAPONS, type ShotResult } from './Weapons';
import { EnemyManager } from './Enemies';
import { WaveManager } from './WaveManager';
import { Net } from './Net';
import { Physics } from './Physics';
import { RapierWorld } from './RapierWorld';
import { store } from '../store';
import type { GrenadeType } from '../store';
import type { GameMode, PlayerTransform, PlayerInfo } from '../shared/protocol';

export interface StartOptions {
  mode: GameMode;
  seed?: number;
  spawn?: { x: number; y: number; z: number };
  net?: Net;                    // provided for multiplayer
  spawnPoints?: THREE.Vector3[];
  startWeapon?: number;         // roster index chosen in the loadout
  grenade?: string;             // grenade type chosen in the loadout
  theme?: string;               // map chosen in the loadout ('random' → seed-derived)
}

interface Pickup { mesh: THREE.Mesh; kind: 'health' | 'ammo'; }

export class Game {
  private engine: Engine;
  private input: Input;
  private audio: Audio;
  private effects: Effects;
  private physics!: Physics;
  private rapier!: RapierWorld;
  private driving = false;
  private driveExitLatch = false;
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

  // Loadout.
  private grenadeType = 'frag';
  private grenadeCount = 3;
  private grenadeAiming = false;
  private arcLine: THREE.Line | null = null;

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

    // Build the world. Solo rolls a fresh seed each match; MP uses the server's
    // shared seed so every client generates the identical map. The theme is
    // derived from the seed → same map type for the whole room, and a random
    // one of the five themes every new match.
    const seed = (opts.seed ?? Math.floor(Math.random() * 0xffffffff)) >>> 0;
    let theme = MAP_THEMES[seed % MAP_THEMES.length];
    // Loadout map pick overrides the seed roll ('random' keeps it).
    if (opts.theme && MAP_THEMES.includes(opts.theme as MapTheme)) theme = opts.theme as MapTheme;
    if ((import.meta as any).env?.DEV) {  // dev-only override for testing specific maps
      const o = localStorage.getItem('NS_THEME') as MapTheme | null;
      if (o && MAP_THEMES.includes(o)) theme = o;
    }
    this.arena = new Arena(this.engine, seed, theme);
    // Drives the pre-match horizontal map roulette in the HUD. The seed suffix
    // makes the value unique per match so the roulette re-runs on repeat maps.
    store.get().setHud({ mapName: `${MAP_NAMES[theme]}#${seed}` });
    this.player = new Player(this.engine.camera, this.arena.colliders, this.input);
    this.player.onFootstep = (metal) => this.audio.footstep(metal);
    // Spawn on the open plaza — NOT at the origin, which is inside the central
    // pillar (would trap the player). Nudge out of any collider as a safety net.
    let spawn = opts.spawn ?? { x: 0, y: 1.7, z: 42 };
    if (Math.hypot(spawn.x, spawn.z) < 8) spawn = { x: 0, y: 1.7, z: 42 };
    spawn = this.findClearSpawn(spawn.x, spawn.z);
    this.player.reset(spawn.x, 0, spawn.z);

    this.physics = new Physics({
      scene: this.engine.scene, effects: this.effects, audio: this.audio,
      onExplosion: (pos, radius, dmg) => {
        this.enemies.damageArea(pos, radius, dmg);
        this.rapier.explode(pos, radius, 14);      // shove crates
        if (pos.distanceTo(this.player.pos) < radius) this.damagePlayer(dmg * (1 - pos.distanceTo(this.player.pos) / radius), null);
      },
      onFlash: () => store.get().setHud({ flash: performance.now() }),
      onEmp: (pos, radius) => this.enemies.empStun(pos, radius),
    });

    // Real rigid-body world (async WASM). Populated once it initialises; the
    // game runs regardless (graceful fallback to the custom Physics layer).
    this.rapier = new RapierWorld(this.engine.scene);
    if (this.mode === 'coop' && !this.net) {
      let s = seed;
      const rng = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
      this.rapier.init().then(() => {
        if (!this.running) return;
        this.rapier.addGround();
        this.rapier.addStatics(this.arena.colliders);
        this.rapier.spawnCrates(rng, 16);
        this.rapier.spawnVehicle(-24, 14);
      });
    }

    this.enemies = new EnemyManager({
      scene: this.engine.scene,
      colliders: this.arena.colliders,
      effects: this.effects,
      audio: this.audio,
      getPlayerPos: () => this.player.pos,
      onPlayerDamage: (d) => this.damagePlayer(d, null),
      onKill: (sc, type, head) => this.onEnemyKilled(sc, type, head),
      onRagdoll: (group, hitDir) => {
        if (this.rapier.ready) this.rapier.ragdoll(group, hitDir);   // real physics tumble
        else this.physics.ragdoll(group, hitDir);                    // scripted fallback flop
      },
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
      onScope: (on) => store.get().setHud({ scope: on }),
    });

    this.waves = new WaveManager({
      enemies: this.enemies,
      getPlayerPos: () => this.player.pos,
      onWaveChange: (w, c) => store.get().setHud({ wave: w, enemiesLeft: c }),
      onToast: (m) => this.toast(m),
      onWaveHorn: () => this.audio.waveHorn(),
    });

    // Apply chosen loadout.
    if (opts.startWeapon != null) this.weapon.switchTo(opts.startWeapon);
    if (opts.grenade) this.grenadeType = opts.grenade;
    this.grenadeCount = 3; this.grenadeAiming = false;
    store.get().setHud({ grenade: this.grenadeType, grenades: this.grenadeCount });

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
        game: this, player: this.player, enemies: this.enemies, engine: this.engine, physics: this.physics,
        render: () => this.engine.composer.render(),
        step: (dt: number) => this.update(dt, performance.now() / 1000),
        input: this.input,
        aimGrenade: () => this.updateGrenadeArc(),
        inspect: () => this.weapon.inspect(),
        // Force a deterministic render (for screenshots when rAF is throttled):
        // aim the camera, refresh matrices, draw one frame.
        renderAt: (x: number, y: number, z: number, yaw: number, pitch: number) => {
          const cam = this.engine.camera;
          cam.position.set(x, y, z);
          cam.rotation.set(pitch, yaw, 0, 'YXZ');
          this.engine.scene.updateMatrixWorld(true);
          this.engine.composer.render();
        },
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
    this.physics?.clear();
    this.rapier?.clear();
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
    } else if (r.material === 'glass') {
      // Shot glass shatters into falling shards.
      this.physics.shatter(r.point, r.dir.clone().negate(), 7);
    }
  }

  /** Simulate + draw the predicted grenade trajectory while aiming. */
  private updateGrenadeArc() {
    const o = new THREE.Vector3(); this.engine.camera.getWorldPosition(o);
    const d = new THREE.Vector3(); this.engine.camera.getWorldDirection(d);
    const p = o.clone().addScaledVector(d, 0.5);
    const v = d.clone().multiplyScalar(16).add(new THREE.Vector3(0, 3, 0));
    const pts: THREE.Vector3[] = [p.clone()];
    const step = 0.03;
    for (let i = 0; i < 60; i++) {
      v.y -= 22 * step; p.addScaledVector(v, step); pts.push(p.clone());
      if (p.y <= 0.08) break;
    }
    if (!this.arcLine) {
      const col = this.grenadeType === 'emp' ? 0x4aa0ff : 0xff7a3c;
      const mat = new THREE.LineDashedMaterial({ color: col, dashSize: 0.35, gapSize: 0.25, transparent: true, opacity: 0.85 });
      this.arcLine = new THREE.Line(new THREE.BufferGeometry(), mat);
      this.engine.scene.add(this.arcLine);
    }
    this.arcLine.geometry.setFromPoints(pts);
    this.arcLine.computeLineDistances();
    this.arcLine.geometry.computeBoundingSphere();
    // A small marker sphere at the landing point.
    this.arcLine.visible = true;
  }

  /** Find a spawn point not embedded in a collider (spiral outward if blocked). */
  private findClearSpawn(x: number, z: number): { x: number; y: number; z: number } {
    const blocked = (px: number, pz: number) => this.arena.colliders.some((c) => {
      const b = c.box;
      return px > b.min.x - 0.6 && px < b.max.x + 0.6 && pz > b.min.z - 0.6 && pz < b.max.z + 0.6 && b.max.y > 0.5;
    });
    if (!blocked(x, z)) return { x, y: 1.7, z };
    for (let r = 4; r <= 60; r += 4) {
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
        const nx = x + Math.cos(a) * r, nz = z + Math.sin(a) * r;
        if (Math.hypot(nx, nz) < 95 && !blocked(nx, nz)) return { x: nx, y: 1.7, z: nz };
      }
    }
    return { x: 0, y: 1.7, z: 46 };
  }

  private onFire(origin: THREE.Vector3, dir: THREE.Vector3, weaponIndex: number) {
    // Eject a brass casing to the right of the weapon (skip melee).
    if (!WEAPONS[weaponIndex]?.melee) {
      const worldUp = new THREE.Vector3(0, 1, 0);
      const right = new THREE.Vector3().crossVectors(dir, worldUp).normalize();
      const up = new THREE.Vector3().crossVectors(right, dir).normalize();
      const port = origin.clone().addScaledVector(dir, 0.35).addScaledVector(right, 0.16).addScaledVector(up, -0.06);
      this.physics.ejectCasing(port, right, up);
      this.rapier.shoot(origin, dir, 7);   // bullets shove pushable crates
    }
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

    // Vehicle enter / exit (interact key) when near.
    const vpos = this.rapier.vehiclePos();
    if (this.input.wantInteract && !this.driveExitLatch) {
      this.driveExitLatch = true;
      if (this.driving) {
        this.driving = false;
        if (vpos) this.player.reset(vpos.x + 3, 0, vpos.z);
        this.weapon.setVisible(true);
        this.toast('DISMOUNTED');
      } else if (vpos && vpos.distanceTo(this.player.pos) < 5) {
        this.driving = true;
        this.weapon.setVisible(false);
        this.toast('DRIVING · [F] EXIT');
      }
    }
    if (!this.input.wantInteract) this.driveExitLatch = false;

    if (this.driving && vpos) {
      // Drive with WASD + chase camera; the weapon/on-foot systems are skipped.
      const thr = (this.input.action('forward') ? 1 : 0) - (this.input.action('back') ? 1 : 0);
      const steer = (this.input.action('right') ? 1 : 0) - (this.input.action('left') ? 1 : 0);
      const pose = this.rapier.driveVehicle(thr, steer);
      if (pose) {
        const fwd = new THREE.Vector3(0, 0, 1).applyQuaternion(pose.quat);
        const cam = pose.pos.clone().addScaledVector(fwd, -8).add(new THREE.Vector3(0, 4.5, 0));
        this.engine.camera.position.copy(cam);
        this.engine.camera.lookAt(pose.pos.x, pose.pos.y + 1.2, pose.pos.z);
        this.player.pos.set(pose.pos.x, 0, pose.pos.z); // keep player near for enemy AI
      }
    } else {
      // ---- on-foot ----
      // Weapon switching (number keys + wheel).
      for (let i = 1; i <= 9; i++) if (this.input.isDown(`Digit${i}`)) this.weapon.switchTo(i - 1);
      if (this.input.wheel !== 0) { this.weapon.cycle(this.input.wheel > 0 ? 1 : -1); this.input.wheel = 0; }
      if (this.input.wantReload) { this.weapon.reload(); this.input.wantReload = false; }
      if (this.input.isDown('KeyV')) this.weapon.toggleFireMode();
      if (this.input.isDown('KeyH')) this.weapon.inspect();

      // Grenade: hold G to aim (shows predicted arc), release to throw.
      if (this.input.isDown('KeyG') && this.grenadeCount > 0 && !this.dead) {
        this.grenadeAiming = true;
        this.updateGrenadeArc();
      } else {
        if (this.grenadeAiming && this.grenadeCount > 0) {
          this.grenadeCount--;
          const o = new THREE.Vector3(); this.engine.camera.getWorldPosition(o);
          const d = new THREE.Vector3(); this.engine.camera.getWorldDirection(d);
          this.physics.throwGrenade(o.addScaledVector(d, 0.5), d, this.grenadeType as GrenadeType);
          this.weapon.playThrow(this.grenadeType);          // visible throw-arm gesture
          this.audio.reload();
          this.toast(`${this.grenadeType.toUpperCase()} OUT · ${this.grenadeCount} LEFT`);
          store.get().setHud({ grenades: this.grenadeCount });
        }
        this.grenadeAiming = false;
        if (this.arcLine) this.arcLine.visible = false;
      }

      // Player movement.
      const beforeYaw = this.player.yaw, beforePitch = this.player.pitch;
      this.player.update(dt);
      this.lastLook = { dx: this.player.yaw - beforeYaw, dy: this.player.pitch - beforePitch };

      // Weapon (trigger + ADS from input).
      const moveSpeed = Math.hypot(this.player.vel.x, this.player.vel.z);
      this.weapon.update(dt, this.input.firing, this.input.aiming, this.lastLook, moveSpeed);
    }

    // Enemies.
    if (this.enemies.networked) this.enemies.updateNet(dt);
    else this.enemies.updateLocal(dt, elapsed);
    if (!this.net && this.mode === 'coop') this.waves.update(dt);

    // Pickups + world.
    this.updatePickups(dt, elapsed);
    this.arena.update(dt, elapsed, this.engine.camera.position);
    this.effects.update(dt);
    this.physics.update(dt);
    this.rapier.step(dt);

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
