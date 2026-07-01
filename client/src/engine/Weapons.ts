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

  // View-model motion.
  private sway = new THREE.Vector2();
  private recoilKick = 0;
  private basePos = new THREE.Vector3(0.22, -0.2, -0.45);
  private adsPos = new THREE.Vector3(0, -0.13, -0.32);

  constructor(ctx: Ctx) {
    this.ctx = ctx;
    WEAPONS.forEach((w) => { this.ammo.push(w.mag); this.reserve.push(w.reserve); this.mode.push(w.modes[0]); });
    this.buildViewModel();
    ctx.camera.add(this.group);
  }

  get def() { return WEAPONS[this.index]; }
  get fireModeLabel() { return this.mode[this.index].toUpperCase(); }

  private buildViewModel() {
    // Rebuild a simple procedural gun for the current weapon.
    this.modelParts.forEach((p) => this.group.remove(p));
    this.modelParts = [];
    const metal = new THREE.MeshStandardMaterial({ color: 0x1c1a17, roughness: 0.42, metalness: 0.82 });
    const accent = new THREE.MeshStandardMaterial({ color: 0x100d0a, roughness: 0.3, metalness: 0.9 });
    const d = this.def;
    const len = d.id === 'sniper' || d.id === 'dmr' ? 1.1 : d.id === 'pistol' ? 0.4 : 0.8;
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.11, len), metal);
    body.position.set(0, 0, -len / 2);
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, len * 0.7, 10), accent);
    barrel.rotation.x = Math.PI / 2; barrel.position.set(0, 0.01, -len * 0.85);
    const grip = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.16, 0.09), metal);
    grip.position.set(0, -0.12, -0.1); grip.rotation.x = 0.3;
    const sight = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.05, 0.015), new THREE.MeshBasicMaterial({ color: 0xd9552b }));
    sight.position.set(0, 0.08, -0.2);
    this.modelParts = d.melee
      ? [(() => { const k = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.05, 0.4), accent); k.position.set(0, -0.05, -0.4); return k; })()]
      : [body, barrel, grip, sight];
    this.modelParts.forEach((p) => this.group.add(p));
    this.group.position.copy(this.basePos);
  }

  switchTo(i: number) {
    if (i < 0 || i >= WEAPONS.length || i === this.index || this.reloading) return;
    this.index = i;
    this.buildViewModel();
    this.cooldown = 0.25;
  }

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

    // View-model sway + recoil recovery + ADS position.
    this.sway.x += (-lookDelta.dx * 0.5 - this.sway.x) * Math.min(1, dt * 8);
    this.sway.y += (-lookDelta.dy * 0.5 - this.sway.y) * Math.min(1, dt * 8);
    this.recoilKick = Math.max(0, this.recoilKick - dt * 3);
    const bob = Math.sin(performance.now() * 0.008) * Math.min(0.02, moveSpeed * 0.003);

    const target = new THREE.Vector3().lerpVectors(this.basePos, this.adsPos, this.adsBlend);
    target.x += this.sway.x * (1 - this.adsBlend);
    target.y += (this.sway.y + bob) * (1 - this.adsBlend);
    target.z += this.recoilKick * 0.12;
    this.group.position.lerp(target, Math.min(1, dt * 18));
    this.group.rotation.set(-this.recoilKick * 0.4 + this.sway.y, this.sway.x, 0);
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
