/**
 * content/proving/ProvingGame.ts — the covenant grey-box, playable (Sprint 002 C2/C3).
 *
 * SEQUENCES layer: wires the five tested cores (locomotion, weapon, damage,
 * Wardenry AI, covenant director) into the Acre. Owns NO rules — every number
 * and law lives in core/ and data/ (three-layer law, Book X).
 *
 * The loop this proves: explore (ridge read) → discover (the acre) → interact
 * (start the green unit, hold-verb) → fight (covenant waves) → win (the charge
 * banks) → reward (the sapling stands; the ledger writes) → continue.
 */

import * as THREE from 'three';
import { Engine } from '../../engine/Engine';
import { Input } from '../../engine/Input';
import { store } from '../../store';
import { Locomotion } from '../../core/locomotion/locomotion';
import { Weapon } from '../../core/combat/weapon';
import { C9 } from '../../data/weapons/c9';
import { PlayerVitals, route, DamageClass, HitZone } from '../../core/combat/damage';
import { CovenantDirector, ACRE_PROVING, type CovenantConfig } from '../../core/covenant/director';
import { buildAcre, type AcreWorld } from './acre';
import { WardenRig } from './WardenRig';

/** Fast config for smoke tests (?fast=1): short bank, one small wave. */
const FAST: CovenantConfig = {
  bankTarget: 8, bankRatePerS: 1, pressureFactor: 0.35,
  waves: [{ orders: [{ unit: 'line-warden', route: 'N' }], breathS: 0 }],
};

const EYE_STAND = 1.7;
const EYE_CROUCH = 1.05;
const PLAYER_RADIUS = 0.35;

export class ProvingGame {
  paused = false;
  private engine: Engine;
  private input: Input;
  private world!: AcreWorld;
  private loco = new Locomotion();
  private weapon = new Weapon(C9, 72);
  private vitals = new PlayerVitals(2);
  private director: CovenantDirector;
  private wardens: WardenRig[] = [];
  private pos = new THREE.Vector3();
  private yaw = Math.PI; // face the arena from the S ridge
  private pitch = 0;
  private running = false;
  private started = false;
  private plantHold = 0;
  private endT = -1;
  private greyFade = 0;
  private lastNoisePos: THREE.Vector3 | null = null;
  private tracers: Array<{ line: THREE.Line; t: number }> = [];
  private radioOsc: { osc: OscillatorNode; ctx: AudioContext } | null = null;
  private onEnd?: () => void;
  private banks25 = new Set<number>();
  private raycaster = new THREE.Raycaster();
  private fallStartY = 0;
  private wasGrounded = true;

  constructor(canvas: HTMLCanvasElement) {
    const s = store.get().settings;
    this.engine = new Engine(canvas, s.quality, 70);
    this.input = new Input(canvas);
    const fast = new URLSearchParams(location.search).get('fast') === '1';
    this.director = new CovenantDirector(fast ? FAST : ACRE_PROVING);
  }

  start(onEnd?: () => void) {
    this.onEnd = onEnd;
    store.get().resetHud();
    this.world = buildAcre(this.engine.scene);
    this.pos.copy(this.world.spawnPoint);
    this.weapon.on((e) => { if (e.type === 'fire') this.playerShoot(); });
    this.weapon.draw();
    store.get().setHud({
      weapon: C9.name, fireMode: 'SEMI', ammo: C9.magazine, reserve: this.weapon.reserve,
      health: 100, armor: 100, wave: 0, enemiesLeft: 0, mapName: '',
      toast: 'THE ACRE (PROVING) — START THE GREEN UNIT [F]',
    });
    this.input.enabled = true;
    this.input.requestLock();
    this.engine.onUpdate(this.update);
    this.engine.start();
    this.running = true;

    if ((import.meta as any).env?.DEV) {
      (window as any).__eoe = {
        game: this,
        state: () => ({
          pos: this.pos.toArray(), started: this.started,
          phase: this.director.phaseNow, bank: this.director.bankNow,
          wardens: this.wardens.map((w) => ({ st: w.ai.state, dead: w.dead })),
          vitals: this.vitals.sample(), weapon: this.weapon.state, mag: this.weapon.mag,
        }),
        plant: () => { this.started = true; this.director.start(); },
        step: (dt: number) => this.update(dt, performance.now() / 1000),
        render: () => this.engine.composer.render(),
        lookAt: (x: number, y: number, z: number) => {
          this.engine.camera.lookAt(x, y, z);
          this.engine.scene.updateMatrixWorld(true);
          this.engine.composer.render();
        },
        hurt: (n: number) => this.vitals.apply({ breath: n, binding: 0 }),
        killAll: () => { for (const w of this.wardens) if (!w.dead) w.takeHit(HitZone.Join, 999, 5); },
      };
    }
  }

  pause() { this.paused = true; this.input.enabled = false; this.input.exitLock(); }
  resume() { this.paused = false; this.input.enabled = true; this.input.resetLook(); this.input.requestLock(); }

  dispose() {
    this.running = false;
    this.engine.offUpdate(this.update);
    this.input.enabled = false;
    this.input.dispose();
    this.stopRadioTone();
    this.engine.dispose();
  }

  /* ------------------------------ helpers ------------------------------ */

  private moveAxis(axis: 'x' | 'z', delta: number) {
    if (delta === 0) return;
    this.pos[axis] += delta;
    for (const b of this.world.colliders) {
      if (
        this.pos.x > b.min.x - PLAYER_RADIUS && this.pos.x < b.max.x + PLAYER_RADIUS &&
        this.pos.z > b.min.z - PLAYER_RADIUS && this.pos.z < b.max.z + PLAYER_RADIUS &&
        this.pos.y < b.max.y && this.pos.y + 1.6 > b.min.y
      ) {
        if (axis === 'x') this.pos.x = delta > 0 ? b.min.x - PLAYER_RADIUS : b.max.x + PLAYER_RADIUS;
        else this.pos.z = delta > 0 ? b.min.z - PLAYER_RADIUS : b.max.z + PLAYER_RADIUS;
      }
    }
  }

  private groundHeight(): number {
    // Ridge + ramp steps: sample collider tops under the player (grey-box honest).
    let g = 0;
    for (const b of this.world.colliders) {
      if (
        this.pos.x > b.min.x - 0.2 && this.pos.x < b.max.x + 0.2 &&
        this.pos.z > b.min.z - 0.2 && this.pos.z < b.max.z + 0.2 &&
        b.max.y <= this.pos.y + 0.6 && b.max.y > g
      ) g = b.max.y;
    }
    return g;
  }

  private playerShoot() {
    const cam = this.engine.camera;
    const stance = { crouched: this.input.action('crouch'), moving: false };
    const coneRad = (this.weapon.cone(stance) * Math.PI) / 180;
    const dir = new THREE.Vector3();
    cam.getWorldDirection(dir);
    dir.applyAxisAngle(new THREE.Vector3(0, 1, 0), (Math.random() - 0.5) * coneRad);
    dir.applyAxisAngle(new THREE.Vector3(1, 0, 0), (Math.random() - 0.5) * coneRad);

    this.raycaster.set(cam.position, dir.normalize());
    const targets: THREE.Object3D[] = [];
    for (const w of this.wardens) if (!w.dead) targets.push(w.zones.plate, w.zones.helmet, w.zones.join);
    targets.push(this.world.sapling.getObjectByName('sapling-crown')!);
    const hits = this.raycaster.intersectObjects(targets, false);
    const end = hits[0]?.point ?? cam.position.clone().addScaledVector(dir, 120);

    // Tracer (one particle idea per frame — a fading line).
    const geo = new THREE.BufferGeometry().setFromPoints([cam.position.clone().addScaledVector(dir, 0.6), end]);
    const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0xcfc9ba, transparent: true, opacity: 0.7 }));
    this.engine.scene.add(line);
    this.tracers.push({ line, t: 0.12 });

    // Recoil: pattern + settle handled simply (camera-space rise).
    this.pitch = Math.min(Math.PI / 2 - 0.05, this.pitch + (C9.recoil.riseDeg * Math.PI) / 180 / 3);

    const hit = hits[0];
    if (!hit) return;
    if (hit.object.name === 'sapling-crown') {
      // LAW 4-D: possible, catastrophic, and 100% the player's.
      (this.world.sapling.getObjectByName('sapling-crown') as THREE.Mesh).visible = false;
      this.failCovenant('THE SAPLING IS GONE.');
      return;
    }
    const rig = hit.object.userData.rig as WardenRig | undefined;
    const zone = hit.object.userData.zone as HitZone | undefined;
    if (rig && zone) {
      const r = rig.takeHit(zone, 20, hit.distance);
      store.get().setHud({ hitmarker: performance.now(), headshot: r.feedback.includes('thud-join') });
    }
  }

  private wardenShoot(from: THREE.Vector3) {
    // LOS check, then doctrine-calm accuracy: pressure, not execution.
    const eye = this.engine.camera.position;
    const dir = eye.clone().sub(from).normalize();
    this.raycaster.set(from, dir);
    const walls = this.raycaster.intersectObjects(this.world.root.children, false);
    const dist = from.distanceTo(eye);
    if (walls[0] && walls[0].distance < dist - 0.5) return; // covered — cover works
    const hitChance = Math.max(0.15, 0.55 - dist / 60);
    if (Math.random() < hitChance) {
      const d = route({ cls: DamageClass.BallLong, zone: HitZone.Unarmored, base: 9, distanceM: dist });
      this.vitals.apply({ breath: d.breath, binding: d.binding });
      store.get().setHud({ damageFlash: performance.now() });
    }
    const end = eye.clone().add(new THREE.Vector3((Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8, 0));
    const geo = new THREE.BufferGeometry().setFromPoints([from, end]);
    const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0xd9a226, transparent: true, opacity: 0.6 }));
    this.engine.scene.add(line);
    this.tracers.push({ line, t: 0.1 });
  }

  private spawnWarden(unit: string, routeKey: string) {
    const lane = this.world.lanes[(routeKey as 'N' | 'SW' | 'SE') ?? 'N'] ?? this.world.lanes.N;
    const slotA = (this.wardens.length % 6) * ((Math.PI * 2) / 6) + 0.9;
    const cover = new THREE.Vector3(Math.cos(slotA) * 11, 0, Math.sin(slotA) * 11);
    const rig = new WardenRig(lane.spawn, cover, unit === 'first-class', {
      onLedger: () => {
        try { localStorage.setItem('eoe:ledger:acre-proving', JSON.stringify({ cordon: true, t: Date.now() })); } catch { /* private mode */ }
        this.toast('FILED. THE WORLD REMEMBERS.');
      },
      onShoot: (from) => this.wardenShoot(from),
      onBark: (t) => this.toast(t),
      onRadioTone: (on) => (on ? this.startRadioTone() : this.stopRadioTone()),
    });
    this.engine.scene.add(rig.group);
    this.wardens.push(rig);
  }

  private startRadioTone() {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      gain.gain.value = 0.02 * store.get().settings.masterVolume;
      osc.frequency.value = 1180;
      osc.type = 'square';
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      this.radioOsc = { osc, ctx };
    } catch { /* no audio context (headless) */ }
  }
  private stopRadioTone() {
    try { this.radioOsc?.osc.stop(); this.radioOsc?.ctx.close(); } catch { /* already closed */ }
    this.radioOsc = null;
  }

  private toast(msg: string) {
    store.get().setHud({ toast: msg });
    window.setTimeout(() => { if (store.get().hud.toast === msg) store.get().setHud({ toast: '' }); }, 2400);
  }

  private failCovenant(reason: string) {
    if (this.endT >= 0) return;
    this.toast(reason);
    this.endT = 2.0; // cut-to-grey, then restart at the covenant checkpoint
  }

  private restart() {
    // Checkpoint = covenant start (Sprint plan §12 save-at-wave-boundary v1).
    for (const w of this.wardens) this.engine.scene.remove(w.group);
    this.wardens = [];
    this.stopRadioTone();
    const fast = new URLSearchParams(location.search).get('fast') === '1';
    this.director = new CovenantDirector(fast ? FAST : ACRE_PROVING);
    this.vitals = new PlayerVitals(2);
    this.weapon = new Weapon(C9, 72);
    this.weapon.on((e) => { if (e.type === 'fire') this.playerShoot(); });
    this.weapon.draw();
    this.started = false;
    this.endT = -1;
    this.greyFade = 0;
    (this.world.sapling.getObjectByName('sapling-crown') as THREE.Mesh).visible = true;
    this.pos.copy(this.world.spawnPoint);
    this.banks25.clear();
    this.toast('THE COVENANT RESETS. START THE GREEN UNIT [F]');
  }

  /* ------------------------------- update ------------------------------- */

  private update = (dt: number, _elapsed: number) => {
    if (!this.running || this.paused) return;

    // End handling: won → exit; failed/dead → grey → restart.
    if (this.endT >= 0) {
      this.endT -= dt;
      this.greyFade = Math.min(1, this.greyFade + dt);
      if (this.endT <= 0) {
        if (this.director.phaseNow === 'won') { this.onEnd?.(); return; }
        this.restart();
      }
      return;
    }

    // --- look
    const look = this.input.consumeLook();
    this.yaw += look.dx;
    this.pitch = THREE.MathUtils.clamp(this.pitch + look.dy, -Math.PI / 2 + 0.05, Math.PI / 2 - 0.05);

    // --- locomotion (the tested core drives the body)
    const f = (this.input.action('forward') ? 1 : 0) - (this.input.action('back') ? 1 : 0);
    const r = (this.input.action('right') ? 1 : 0) - (this.input.action('left') ? 1 : 0);
    const mag = Math.min(1, Math.hypot(f, r));
    if (this.input.action('jump')) this.loco.requestJump();
    const s = this.loco.tick(dt, {
      move: mag, sprint: this.input.action('sprint'), crouch: this.input.action('crouch'), jump: false,
    });
    if (mag > 0) {
      const inv = 1 / (Math.hypot(f, r) || 1);
      const dx = (-Math.sin(this.yaw) * f + Math.cos(this.yaw) * r) * inv;
      const dz = (-Math.cos(this.yaw) * f - Math.sin(this.yaw) * r) * inv;
      this.moveAxis('x', dx * s.speed * dt);
      this.moveAxis('z', dz * s.speed * dt);
    }
    // Vertical: loco owns vy; grey-box ground snap with honest drop tracking.
    const g = this.groundHeight();
    const grounded = this.pos.y <= g + 0.01 && this.loco.vy <= 0;
    if (this.wasGrounded && !grounded) this.fallStartY = this.pos.y;
    if (!grounded) {
      this.pos.y += this.loco.vy * dt;
      if (this.pos.y <= g) {
        this.loco.land(Math.max(0, this.fallStartY - g));
        this.pos.y = g;
      }
    } else {
      this.pos.y = g;
      if (this.loco.vy > 0) this.pos.y += this.loco.vy * dt; // jump launch
    }
    this.wasGrounded = grounded || this.pos.y <= g + 0.01;

    const eyeTarget = this.input.action('crouch') ? EYE_CROUCH : EYE_STAND;
    const settleDip = s.settle * 0.4;
    const cam = this.engine.camera;
    cam.position.set(this.pos.x, this.pos.y + eyeTarget - settleDip, this.pos.z);
    cam.rotation.set(this.pitch, this.yaw, 0, 'YXZ');
    this.engine.setFov(s.fov);

    // Noise for the AI hearing bus.
    this.lastNoisePos = s.noise >= 2 ? this.pos.clone() : null;

    // --- weapon
    this.weapon.tick(dt);
    if (this.input.wantReload) { this.weapon.reload(); this.input.wantReload = false; }
    if (this.input.isDown('KeyV')) this.weapon.toggleMode();
    if (this.input.firing) {
      const began = this.weapon.trigger(s.canFire);
      if (began && this.weapon.mode === 'semi') this.input.firing = false; // semi: one per click
    }
    // --- interact: start the green unit (hold-verb, 1.5 s — the plant).
    const nearUnit = this.pos.distanceTo(this.world.greenUnit.position) < 2.4;
    if (!this.started && nearUnit) {
      store.get().setHud({ interactHint: 'HOLD [F] — START THE GREEN UNIT' });
      if (this.input.wantInteract) {
        this.plantHold += dt;
        if (this.plantHold >= 1.5) {
          this.started = true;
          this.director.start();
          ((this.world.greenUnit.children[0] as THREE.Mesh).material as THREE.MeshStandardMaterial).emissiveIntensity = 0.8;
          this.toast('THE CHARGE BANKS. HOLD THE ACRE.');
          store.get().setHud({ interactHint: '' });
        }
      } else this.plantHold = 0;
    } else if (!this.started) {
      store.get().setHud({ interactHint: '' });
    }

    // --- covenant
    const crown = this.world.sapling.getObjectByName('sapling-crown') as THREE.Mesh;
    const alive = this.wardens.filter((w) => !w.dead);
    const sample = this.director.tick(dt, {
      hostilesAlive: alive.length,
      hostilesInAcre: alive.filter((w) => w.group.position.distanceTo(this.world.center) < 20).length,
      saplingAlive: crown.visible,
    });
    for (const o of sample.spawns) this.spawnWarden(o.unit, o.route);
    if (this.started) {
      const pct = Math.floor((sample.bank / this.director.bankTarget) * 100);
      for (const q of [25, 50, 75]) {
        if (pct >= q && !this.banks25.has(q)) { this.banks25.add(q); this.toast(`CHARGE ${q}% — THE ACRE HOLDS`); }
      }
      if (sample.phase === 'won') {
        this.toast("THE CHARGE BANKS. THE ACRE STANDS. — 'STILL HERE.'");
        try { localStorage.setItem('eoe:ledger:acre-banked', JSON.stringify({ banked: true, t: Date.now() })); } catch { /* ok */ }
        this.endT = 6.0;
      }
      if (sample.phase === 'failed') this.failCovenant('THE COVENANT FAILS.');
    }

    // --- wardens: senses computed honestly (cone + LOS; torch pools later).
    for (const w of this.wardens) {
      let sight = 0;
      if (!w.dead) {
        const toPlayer = cam.position.clone().sub(w.group.position.clone().setY(1.6));
        const dist = toPlayer.length();
        if (dist < 30) {
          const fwd = new THREE.Vector3(0, 0, 1).applyQuaternion(w.group.quaternion);
          const ang = fwd.angleTo(toPlayer.clone().setY(0).normalize());
          if (ang < Math.PI * 0.55) {
            this.raycaster.set(w.group.position.clone().setY(1.6), toPlayer.normalize());
            const occ = this.raycaster.intersectObjects(this.world.root.children, false);
            if (!occ[0] || occ[0].distance > dist - 0.4) sight = dist < 22 ? 1 : 0.5;
          }
        }
      }
      w.tick(dt, this.pos, sight, this.lastNoisePos);
    }

    // --- vitals
    const v = this.vitals.tick(dt);
    if (this.input.isDown('KeyQ')) this.vitals.startDressing();
    if (v.dead) this.failCovenant('');

    // --- tracers fade
    for (let i = this.tracers.length - 1; i >= 0; i--) {
      const t = this.tracers[i];
      t.t -= dt;
      (t.line.material as THREE.LineBasicMaterial).opacity = Math.max(0, t.t / 0.12) * 0.7;
      if (t.t <= 0) { this.engine.scene.remove(t.line); this.tracers.splice(i, 1); }
    }

    // --- HUD (the double rule mapped onto the legacy bars for grey-box v1)
    store.get().setHud({
      health: Math.round(v.breath),
      armor: v.bindingSegments * 25,
      ammo: this.weapon.mag + (this.weapon.chambered ? 1 : 0),
      reserve: this.weapon.reserve,
      fireMode: this.weapon.mode.toUpperCase(),
      reloading: this.weapon.state === 'reloading',
      wave: sample.waveIndex + 1,
      enemiesLeft: alive.length,
      alive: !v.dead,
      fps: this.engine.fps,
      flash: this.greyFade > 0 ? performance.now() : 0,
    });
  };
}
