/**
 * Weapons.ts — Data-driven weapon system.
 *
 * WEAPONS is a table of stat blocks (damage, RPM, recoil, spread, magazine,
 * fire modes, ADS zoom …). WeaponController owns the equipped weapon, ammo
 * bookkeeping, recoil accumulation, ADS, reload timing and a procedural
 * view-model that sways/bobs/kicks. Firing is hitscan: a spread-jittered ray
 * per pellet against the arena + enemies, spawning tracers, muzzle flash and
 * material-aware impacts, and reporting hits through callbacks.
 */

import * as THREE from 'three';
import type { Effects } from './Effects';
import type { Audio } from './Audio';
import type { SurfaceMat } from './Arena';

export type Caliber = 'light' | 'heavy' | 'shotgun';
export type FireMode = 'auto' | 'semi' | 'burst';

export interface WeaponDef {
  id: string;
  name: string;
  caliber: Caliber;
  damage: number;
  headMult: number;
  rpm: number;
  mag: number;
  reserve: number;
  reloadTime: number;
  pellets: number;
  spread: number;       // radians of cone (hip)
  adsSpreadMul: number;
  modes: FireMode[];
  adsFov: number;       // fov when aiming
  recoilV: number;      // upward kick per shot (rad)
  recoilH: number;      // horizontal kick per shot (rad)
  melee?: boolean;
}

/** The full loadout. Order defines slots 1..9. */
export const WEAPONS: WeaponDef[] = [
  { id: 'pistol',  name: 'SIDEARM',    caliber: 'light',   damage: 26, headMult: 2.0, rpm: 320, mag: 15, reserve: 90,  reloadTime: 1.0, pellets: 1, spread: 0.012, adsSpreadMul: 0.4, modes: ['semi'], adsFov: 68, recoilV: 0.010, recoilH: 0.006 },
  { id: 'smg',     name: 'SMG-9',      caliber: 'light',   damage: 18, headMult: 1.8, rpm: 820, mag: 30, reserve: 210, reloadTime: 1.3, pellets: 1, spread: 0.028, adsSpreadMul: 0.45, modes: ['auto'], adsFov: 74, recoilV: 0.008, recoilH: 0.007 },
  { id: 'rifle',   name: 'AR-14',      caliber: 'light',   damage: 24, headMult: 2.0, rpm: 640, mag: 30, reserve: 210, reloadTime: 1.4, pellets: 1, spread: 0.016, adsSpreadMul: 0.35, modes: ['auto', 'semi'], adsFov: 70, recoilV: 0.011, recoilH: 0.006 },
  { id: 'battle',  name: 'BR-55',      caliber: 'heavy',   damage: 34, headMult: 2.0, rpm: 400, mag: 20, reserve: 140, reloadTime: 1.5, pellets: 1, spread: 0.013, adsSpreadMul: 0.3, modes: ['auto', 'burst'], adsFov: 66, recoilV: 0.015, recoilH: 0.007 },
  { id: 'dmr',     name: 'DMR-7',      caliber: 'heavy',   damage: 55, headMult: 2.2, rpm: 260, mag: 12, reserve: 84,  reloadTime: 1.6, pellets: 1, spread: 0.008, adsSpreadMul: 0.2, modes: ['semi'], adsFov: 55, recoilV: 0.02, recoilH: 0.006 },
  { id: 'sniper',  name: 'RAIL-X',     caliber: 'heavy',   damage: 130, headMult: 2.5, rpm: 45, mag: 5, reserve: 35,  reloadTime: 2.4, pellets: 1, spread: 0.004, adsSpreadMul: 0.05, modes: ['semi'], adsFov: 32, recoilV: 0.05, recoilH: 0.01 },
  { id: 'lmg',     name: 'LMG-40',     caliber: 'heavy',   damage: 26, headMult: 1.7, rpm: 720, mag: 80, reserve: 320, reloadTime: 3.0, pellets: 1, spread: 0.03, adsSpreadMul: 0.5, modes: ['auto'], adsFov: 76, recoilV: 0.012, recoilH: 0.01 },
  { id: 'shotgun', name: 'BREACH-12',  caliber: 'shotgun', damage: 13, headMult: 1.5, rpm: 90, mag: 7, reserve: 49,  reloadTime: 2.2, pellets: 9, spread: 0.09, adsSpreadMul: 0.7, modes: ['semi'], adsFov: 78, recoilV: 0.03, recoilH: 0.012 },
  { id: 'knife',   name: 'COMBAT KNIFE', caliber: 'light', damage: 80, headMult: 1.2, rpm: 120, mag: 1, reserve: 0, reloadTime: 0, pellets: 1, spread: 0, adsSpreadMul: 1, modes: ['semi'], adsFov: 90, recoilV: 0, recoilH: 0, melee: true },
];

/** Result of a resolved shot, surfaced so Game can update score/net. */
export interface ShotResult {
  enemyId?: number;
  playerId?: string;   // PvP: a remote player was hit
  dmg: number;
  headshot: boolean;
  point: THREE.Vector3;
  material?: SurfaceMat;
  origin: THREE.Vector3;
  dir: THREE.Vector3;
}

interface Ctx {
  camera: THREE.PerspectiveCamera;
  effects: Effects;
  audio: Audio;
  worldTargets: THREE.Object3D[];
  getEnemyMeshes: () => THREE.Object3D[];
  applyRecoil: (pitch: number, yaw: number) => void;
  onShot: (r: ShotResult) => void;
  onFire: (origin: THREE.Vector3, dir: THREE.Vector3, weaponIndex: number) => void;
  setFov: (fov: number) => void;
  baseFov: number;
}

export class WeaponController {
  private ctx: Ctx;
  private ray = new THREE.Raycaster();
  private group = new THREE.Group();
  private modelParts: THREE.Object3D[] = [];

  index = 2;                 // start on the AR
  ammo: number[] = [];
  reserve: number[] = [];
  private mode: FireMode[] = [];
  private cooldown = 0;
  private burstLeft = 0;
  reloading = false;
  private reloadT = 0;
  aiming = false;
  private adsBlend = 0;      // 0 hip .. 1 ads

  // View-model motion + procedural animations.
  private sway = new THREE.Vector2();
  private recoilKick = 0;
  private raiseT = 0;        // weapon-switch raise (counts down)
  private inspectT = 0;      // inspect animation (counts down)
  private inspectDur = 2.4;
  private basePos = new THREE.Vector3(0.25, -0.24, -0.5);
  private adsPos = new THREE.Vector3(0, -0.14, -0.34);

  constructor(ctx: Ctx) {
    this.ctx = ctx;
    WEAPONS.forEach((w) => { this.ammo.push(w.mag); this.reserve.push(w.reserve); this.mode.push(w.modes[0]); });
    this.buildViewModel();
    this.group.scale.setScalar(0.88);
    ctx.camera.add(this.group);
    // Dedicated short-range viewmodel light so the weapon + hands read clearly
    // in dark areas (standard FPS technique); its tiny range barely touches the world.
    const vmLight = new THREE.PointLight(0xc6ccd6, 1.4, 2.2, 2);
    vmLight.position.set(0.2, 0.02, -0.32);
    ctx.camera.add(vmLight);
  }

  get def() { return WEAPONS[this.index]; }
  get fireModeLabel() { return this.mode[this.index].toUpperCase(); }

  /** World position of the muzzle tip (for casing/tracer origin), updated after build. */
  ejectPortLocal = new THREE.Vector3(0.06, 0.02, -0.05);

  private buildViewModel() {
    // Rebuild a detailed procedural weapon + gloved hands for the current gun.
    this.modelParts.forEach((p) => { this.group.remove(p); });
    this.modelParts = [];

    // Shared materials.
    const gun = new THREE.MeshStandardMaterial({ color: 0x2a2c33, roughness: 0.5, metalness: 0.72 });
    const poly = new THREE.MeshStandardMaterial({ color: 0x15161b, roughness: 0.72, metalness: 0.2 });
    const steel = new THREE.MeshStandardMaterial({ color: 0x3c3f47, roughness: 0.32, metalness: 0.92 });
    const glove = new THREE.MeshStandardMaterial({ color: 0x1b1b20, roughness: 0.82, metalness: 0.12 });
    const emberDot = new THREE.MeshBasicMaterial({ color: 0xd9552b });
    const lens = new THREE.MeshStandardMaterial({ color: 0x3a5a7a, roughness: 0.1, metalness: 0.3, emissive: 0x14324a, emissiveIntensity: 0.6 });

    const add = (mesh: THREE.Mesh, x: number, y: number, z: number, rx = 0, ry = 0, rz = 0) => {
      mesh.position.set(x, y, z); mesh.rotation.set(rx, ry, rz);
      this.modelParts.push(mesh); this.group.add(mesh); return mesh;
    };
    const box = (w: number, h: number, dp: number, m: THREE.Material) => new THREE.Mesh(new THREE.BoxGeometry(w, h, dp), m);
    const cyl = (rt: number, rb: number, len: number, m: THREE.Material, seg = 10) => new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, len, seg), m);

    const id = this.def.id;

    if (this.def.melee) {
      // Combat knife: handle + guard + blade.
      add(box(0.03, 0.035, 0.14, poly), 0.0, -0.02, 0.02);
      add(box(0.06, 0.012, 0.02, steel), 0.0, -0.02, -0.06);
      const blade = box(0.008, 0.05, 0.28, steel); add(blade, 0.0, -0.01, -0.22, 0, 0, 0);
      this.buildHands(add, box, cyl, glove, 'knife');
      this.group.position.copy(this.basePos);
      return;
    }

    // ---- common rifle/SMG core ----
    const long = id === 'sniper' || id === 'dmr' || id === 'lmg';
    const compact = id === 'smg' || id === 'pistol';
    const barrelLen = id === 'pistol' ? 0.16 : long ? 0.5 : id === 'smg' ? 0.24 : 0.34;
    const muzzleZ = -0.28 - barrelLen;

    // lower receiver / frame
    add(box(0.05, 0.09, 0.26, poly), 0, -0.01, -0.05);
    // upper receiver
    add(box(0.052, 0.06, 0.3, gun), 0, 0.045, -0.1);
    // charging handle
    add(box(0.022, 0.022, 0.05, gun), 0, 0.085, 0.02);
    // ejection port cover (right side)
    add(box(0.006, 0.03, 0.06, steel), 0.028, 0.05, -0.04);

    if (id !== 'pistol') {
      // stock + buffer tube
      add(cyl(0.017, 0.017, 0.14, gun, 8), 0, 0.04, 0.1, Math.PI / 2, 0, 0);
      add(box(0.05, 0.085, 0.16, poly), 0, 0.02, 0.2);
      add(box(0.055, 0.03, 0.04, poly), 0, -0.01, 0.28); // butt pad
      // pistol grip
      add(box(0.045, 0.14, 0.06, poly), 0, -0.11, 0.05, 0.34, 0, 0);
      // magazine (curved)
      add(box(0.05, 0.24, 0.09, poly), 0, -0.17, -0.03, -0.12, 0, 0);
      // handguard with rail
      add(box(0.062, 0.07, barrelLen + 0.06, poly), 0, 0.03, -0.3 - barrelLen / 2);
      // top picatinny rail ribs
      const railZ0 = -0.02;
      for (let i = 0; i < 9; i++) add(box(0.03, 0.008, 0.014, gun), 0, 0.088, railZ0 - i * 0.05);
    } else {
      // pistol: slide + grip + trigger guard
      add(box(0.05, 0.06, 0.22, gun), 0, 0.045, -0.14);
      add(box(0.045, 0.13, 0.055, poly), 0, -0.08, 0.04, 0.28, 0, 0);
      add(box(0.05, 0.2, 0.09, poly), 0, -0.16, 0.02, -0.05, 0, 0); // magazine in grip line
    }

    // barrel + gas block + flash hider
    add(cyl(0.014, 0.014, barrelLen, steel, 12), 0, 0.045, -0.28 - barrelLen / 2, Math.PI / 2, 0, 0);
    if (id !== 'pistol') add(box(0.03, 0.05, 0.04, gun), 0, 0.07, -0.42);
    add(cyl(0.022, 0.02, 0.05, steel, 10), 0, 0.045, muzzleZ, Math.PI / 2, 0, 0); // muzzle device

    // sights / optic
    if (id === 'sniper' || id === 'dmr') {
      // scope: tube + bells + lens
      add(cyl(0.03, 0.03, 0.24, gun, 14), 0, 0.12, -0.18, Math.PI / 2, 0, 0);
      add(cyl(0.038, 0.038, 0.05, gun, 14), 0, 0.12, -0.06, Math.PI / 2, 0, 0);
      add(cyl(0.038, 0.038, 0.05, gun, 14), 0, 0.12, -0.3, Math.PI / 2, 0, 0);
      const l = cyl(0.03, 0.03, 0.006, lens, 14); add(l, 0, 0.12, -0.055, Math.PI / 2, 0, 0);
      add(box(0.03, 0.05, 0.03, gun), 0, 0.085, -0.18); // mount
    } else if (id === 'pistol') {
      add(box(0.008, 0.015, 0.01, gun), 0, 0.085, -0.24); // front post
      add(box(0.03, 0.015, 0.01, gun), 0, 0.085, 0.0);    // rear notch
    } else {
      // red-dot optic
      add(box(0.05, 0.05, 0.07, gun), 0, 0.105, -0.12);
      const l = box(0.038, 0.038, 0.004, lens); add(l, 0, 0.115, -0.155);
      add(box(0.004, 0.004, 0.004, emberDot), 0, 0.115, -0.152);
      // flip front sight
      add(box(0.01, 0.05, 0.01, gun), 0, 0.11, -0.5);
    }

    // charging handle accent + lmg drum/box mag
    if (id === 'lmg') add(box(0.11, 0.14, 0.12, poly), 0, -0.16, -0.02);

    this.buildHands(add, box, cyl, glove, id === 'pistol' ? 'pistol' : 'rifle');
    this.ejectPortLocal.set(0.05, 0.05, -0.04);
    this.group.position.copy(this.basePos);
  }

  /** Gloved forearms + fists gripping the weapon (added to the view group). */
  private buildHands(
    add: (m: THREE.Mesh, x: number, y: number, z: number, rx?: number, ry?: number, rz?: number) => THREE.Mesh,
    box: (w: number, h: number, dp: number, m: THREE.Material) => THREE.Mesh,
    cyl: (rt: number, rb: number, len: number, m: THREE.Material, seg?: number) => THREE.Mesh,
    glove: THREE.Material, kind: 'rifle' | 'pistol' | 'knife',
  ) {
    const gripZ = kind === 'pistol' ? 0.04 : 0.05;
    // Right hand on the grip + forearm angling to the lower-right of the frame.
    add(box(0.055, 0.06, 0.075, glove), 0.005, -0.14, gripZ);            // fist
    for (let i = 0; i < 4; i++) add(box(0.015, 0.02, 0.055, glove), -0.02 + i * 0.013, -0.115, gripZ - 0.03, 0.5, 0, 0); // fingers
    add(box(0.02, 0.045, 0.05, glove), 0.028, -0.13, gripZ + 0.01);      // thumb side
    add(cyl(0.032, 0.04, 0.34, glove, 8), 0.075, -0.26, gripZ + 0.16, 1.15, 0, 0.35); // forearm

    if (kind !== 'pistol') {
      // Left hand on the handguard + forearm to the lower-left.
      const fgZ = -0.42;
      add(box(0.06, 0.06, 0.09, glove), 0, -0.11, fgZ);                  // fist
      for (let i = 0; i < 4; i++) add(box(0.016, 0.05, 0.02, glove), -0.03 + i * 0.02, -0.075, fgZ, -0.3, 0, 0); // fingers over top
      add(box(0.022, 0.05, 0.05, glove), -0.04, -0.1, fgZ + 0.02);       // thumb
      add(cyl(0.032, 0.042, 0.36, glove, 8), -0.11, -0.24, fgZ - 0.14, 1.1, 0, -0.5); // forearm
    }
  }

  switchTo(i: number) {
    if (i < 0 || i >= WEAPONS.length || i === this.index || this.reloading) return;
    this.index = i;
    this.buildViewModel();
    this.cooldown = 0.25;
    this.raiseT = 0.4;        // play a raise-in animation
    this.inspectT = 0;
  }

  /** Manual inspect animation (rotate the weapon to examine it). */
  inspect() { if (!this.reloading && this.inspectT <= 0) this.inspectT = this.inspectDur; }

  cycle(dir: number) {
    let i = (this.index + dir + WEAPONS.length) % WEAPONS.length;
    this.switchTo(i);
  }

  toggleFireMode() {
    const modes = this.def.modes;
    const cur = modes.indexOf(this.mode[this.index]);
    this.mode[this.index] = modes[(cur + 1) % modes.length];
  }

  reload() {
    const d = this.def;
    if (this.reloading || d.melee || this.ammo[this.index] >= d.mag || this.reserve[this.index] <= 0) return;
    this.reloading = true;
    this.reloadT = d.reloadTime;
    this.ctx.audio.reload();
  }

  /** Grant ammo (pickup). Returns true if any was needed. */
  addReserve(fraction = 1): boolean {
    const d = this.def;
    if (d.melee) return false;
    const add = Math.ceil(d.reserve * fraction);
    this.reserve[this.index] = Math.min(d.reserve, this.reserve[this.index] + add);
    return true;
  }

  private canFire() { return this.cooldown <= 0 && !this.reloading; }

  /** Called every frame with trigger state. */
  update(dt: number, triggerHeld: boolean, aiming: boolean, lookDelta: { dx: number; dy: number }, moveSpeed: number) {
    this.cooldown -= dt;
    this.aiming = aiming && !this.def.melee;

    // Reload timer.
    if (this.reloading) {
      this.reloadT -= dt;
      if (this.reloadT <= 0) {
        const d = this.def;
        const need = d.mag - this.ammo[this.index];
        const take = Math.min(need, this.reserve[this.index]);
        this.ammo[this.index] += take;
        this.reserve[this.index] -= take;
        this.reloading = false;
      }
    }

    // ADS fov blend.
    this.adsBlend += ((this.aiming ? 1 : 0) - this.adsBlend) * Math.min(1, dt * 12);
    const fov = THREE.MathUtils.lerp(this.ctx.baseFov, this.def.adsFov, this.adsBlend);
    this.ctx.setFov(fov);

    // Firing logic per mode.
    const d = this.def;
    if (triggerHeld && this.canFire()) {
      const m = this.mode[this.index];
      if (m === 'auto') this.fire();
      else if (m === 'semi') { if (!this.semiLatch) { this.fire(); this.semiLatch = true; } }
      else if (m === 'burst') { if (!this.semiLatch) { this.burstLeft = 3; this.semiLatch = true; } }
    }
    if (!triggerHeld) this.semiLatch = false;

    // Burst pump.
    if (this.burstLeft > 0 && this.cooldown <= 0) { this.fire(); this.burstLeft--; }

    // Animation timers.
    if (this.raiseT > 0) this.raiseT -= dt;
    if (this.inspectT > 0) this.inspectT -= dt;

    // View-model sway + recoil recovery + ADS position.
    this.sway.x += (-lookDelta.dx * 0.5 - this.sway.x) * Math.min(1, dt * 8);
    this.sway.y += (-lookDelta.dy * 0.5 - this.sway.y) * Math.min(1, dt * 8);
    this.recoilKick = Math.max(0, this.recoilKick - dt * 3);
    const bob = Math.sin(performance.now() * 0.008) * Math.min(0.02, moveSpeed * 0.003);

    const target = new THREE.Vector3().lerpVectors(this.basePos, this.adsPos, this.adsBlend);
    target.x += this.sway.x * (1 - this.adsBlend);
    target.y += (this.sway.y + bob) * (1 - this.adsBlend);
    target.z += this.recoilKick * 0.12;
    let rotX = -this.recoilKick * 0.4 + this.sway.y;
    let rotY = this.sway.x;
    let rotZ = 0;

    // Reload: the weapon dips and cants while the magazine is swapped.
    if (this.reloading) {
      const p = 1 - this.reloadT / Math.max(0.01, this.def.reloadTime);
      const dip = Math.sin(Math.min(1, p) * Math.PI);
      target.y -= dip * 0.14; target.x -= dip * 0.05;
      rotZ += dip * 0.55; rotX += dip * 0.32;
    }
    // Raise-in on weapon switch.
    if (this.raiseT > 0) {
      const r = this.raiseT / 0.4;
      target.y -= r * 0.3; rotX += r * 0.5; rotZ += r * 0.28;
    }
    // Inspect: rotate the weapon into view and turn it over.
    if (this.inspectT > 0) {
      const p = 1 - this.inspectT / this.inspectDur;
      const env = Math.sin(Math.min(1, p) * Math.PI);
      target.z += env * 0.12; target.x -= env * 0.06; target.y += env * 0.02;
      rotY += env * 0.95; rotX += env * 0.35; rotZ += Math.sin(p * Math.PI * 2) * 0.16 * env;
    }

    this.group.position.lerp(target, Math.min(1, dt * 18));
    this.group.rotation.set(rotX, rotY, rotZ);
  }

  private semiLatch = false;

  private fire() {
    const d = this.def;
    if (this.ammo[this.index] <= 0 && !d.melee) {
      this.ctx.audio.dryFire();
      this.cooldown = 0.2;
      return;
    }
    this.cooldown = 60 / d.rpm;
    if (!d.melee) this.ammo[this.index]--;

    const cam = this.ctx.camera;
    const origin = new THREE.Vector3();
    cam.getWorldPosition(origin);
    const baseDir = new THREE.Vector3();
    cam.getWorldDirection(baseDir);

    const spread = d.spread * (this.aiming ? d.adsSpreadMul : 1);
    const muzzlePos = origin.clone().addScaledVector(baseDir, 0.6).add(new THREE.Vector3(0, -0.05, 0));
    if (!d.melee) this.ctx.effects.muzzle(muzzlePos);
    this.ctx.audio.shoot(d.caliber);

    const range = d.melee ? 2.4 : 400;
    for (let p = 0; p < d.pellets; p++) {
      const dir = baseDir.clone();
      if (spread > 0) {
        dir.x += (Math.random() - 0.5) * spread;
        dir.y += (Math.random() - 0.5) * spread;
        dir.z += (Math.random() - 0.5) * spread;
        dir.normalize();
      }
      this.resolveRay(origin, dir, range, muzzlePos, d, p === 0);
    }

    // Recoil to aim.
    const rv = d.recoilV * (this.aiming ? 0.6 : 1);
    const rh = (Math.random() - 0.5) * 2 * d.recoilH;
    this.ctx.applyRecoil(rv, rh);
    this.recoilKick = Math.min(1, this.recoilKick + 0.5);

    this.ctx.onFire(origin, baseDir, this.index);
  }

  private resolveRay(origin: THREE.Vector3, dir: THREE.Vector3, range: number, muzzle: THREE.Vector3, d: WeaponDef, drawTracer: boolean) {
    this.ray.set(origin, dir);
    this.ray.far = range;
    const targets = [...this.ctx.getEnemyMeshes(), ...this.ctx.worldTargets];
    const hits = this.ray.intersectObjects(targets, false);
    const hit = hits[0];

    if (!hit) {
      if (drawTracer && !d.melee) this.ctx.effects.tracer(muzzle, origin.clone().addScaledVector(dir, range));
      return;
    }
    if (drawTracer && !d.melee) this.ctx.effects.tracer(muzzle, hit.point);

    const obj = hit.object;
    const enemyId: number | undefined = obj.userData.enemyId;
    const playerId: string | undefined = obj.userData.playerId;
    if (enemyId !== undefined) {
      // Headshot if the hit is in the upper portion of the enemy's bounds.
      const top = obj.userData.headY ?? (obj.position.y + 1.4);
      const headshot = hit.point.y >= top;
      const dmg = d.damage * (headshot ? d.headMult : 1);
      this.ctx.onShot({ enemyId, dmg, headshot, point: hit.point.clone(), origin, dir });
    } else if (playerId !== undefined) {
      const headshot = hit.point.y >= (obj.userData.headY ?? 999);
      const dmg = d.damage * (headshot ? d.headMult : 1);
      this.ctx.onShot({ playerId, dmg, headshot, point: hit.point.clone(), origin, dir });
    } else {
      const mat: SurfaceMat = (obj.userData.material as SurfaceMat) ?? 'concrete';
      const normal = hit.face ? hit.face.normal.clone().transformDirection(obj.matrixWorld) : dir.clone().negate();
      this.ctx.effects.impact(hit.point, normal, mat);
      this.ctx.audio.impact(mat, origin.distanceTo(hit.point));
      this.ctx.onShot({ dmg: 0, headshot: false, point: hit.point.clone(), material: mat, origin, dir });
    }
  }
}
