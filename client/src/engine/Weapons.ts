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
  scoped?: boolean;     // ADS goes to a full scope overlay (viewmodel hidden, real zoom)
}

/** The full loadout. Order defines slots 1..9. */
export const WEAPONS: WeaponDef[] = [
  { id: 'pistol',  name: 'SIDEARM',    caliber: 'light',   damage: 26, headMult: 2.0, rpm: 320, mag: 15, reserve: 90,  reloadTime: 1.0, pellets: 1, spread: 0.012, adsSpreadMul: 0.4, modes: ['semi'], adsFov: 68, recoilV: 0.010, recoilH: 0.006 },
  { id: 'smg',     name: 'SMG-9',      caliber: 'light',   damage: 18, headMult: 1.8, rpm: 820, mag: 30, reserve: 210, reloadTime: 1.3, pellets: 1, spread: 0.028, adsSpreadMul: 0.45, modes: ['auto'], adsFov: 74, recoilV: 0.008, recoilH: 0.007 },
  { id: 'rifle',   name: 'AR-14',      caliber: 'light',   damage: 24, headMult: 2.0, rpm: 640, mag: 30, reserve: 210, reloadTime: 1.4, pellets: 1, spread: 0.016, adsSpreadMul: 0.35, modes: ['auto', 'semi'], adsFov: 70, recoilV: 0.011, recoilH: 0.006 },
  { id: 'battle',  name: 'BR-55',      caliber: 'heavy',   damage: 34, headMult: 2.0, rpm: 400, mag: 20, reserve: 140, reloadTime: 1.5, pellets: 1, spread: 0.013, adsSpreadMul: 0.3, modes: ['auto', 'burst'], adsFov: 66, recoilV: 0.015, recoilH: 0.007 },
  { id: 'dmr',     name: 'DMR-7',      caliber: 'heavy',   damage: 55, headMult: 2.2, rpm: 260, mag: 12, reserve: 84,  reloadTime: 1.6, pellets: 1, spread: 0.008, adsSpreadMul: 0.2, modes: ['semi'], adsFov: 38, recoilV: 0.02, recoilH: 0.006, scoped: true },
  { id: 'sniper',  name: 'RAIL-X',     caliber: 'heavy',   damage: 130, headMult: 2.5, rpm: 45, mag: 5, reserve: 35,  reloadTime: 2.4, pellets: 1, spread: 0.004, adsSpreadMul: 0.05, modes: ['semi'], adsFov: 20, recoilV: 0.05, recoilH: 0.01, scoped: true },
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
  /** Fired when a scoped weapon enters/leaves full scope view (HUD overlay). */
  onScope?: (on: boolean) => void;
}

/* Rounded-corner, edge-beveled boxes replace raw BoxGeometry for every weapon
 * part, so receivers/grips/stocks read as machined metal and moulded polymer
 * instead of cubes. Geometries are cached by dimensions — weapon switches
 * rebuild the viewmodel often and the extrusions are not free. */
const rboxCache = new Map<string, THREE.BufferGeometry>();
function roundedBox(w: number, h: number, dp: number): THREE.BufferGeometry {
  const key = `${w}|${h}|${dp}`;
  const hit = rboxCache.get(key);
  if (hit) return hit;
  const r = Math.min(w, h) * 0.28;                 // corner radius from the small side
  const hw = Math.max(0.0001, w / 2 - r), hh = Math.max(0.0001, h / 2 - r);
  const s = new THREE.Shape();
  s.absarc(hw, hh, r, 0, Math.PI / 2, false);
  s.absarc(-hw, hh, r, Math.PI / 2, Math.PI, false);
  s.absarc(-hw, -hh, r, Math.PI, Math.PI * 1.5, false);
  s.absarc(hw, -hh, r, Math.PI * 1.5, Math.PI * 2, false);
  const bev = Math.min(dp * 0.22, r * 0.7, 0.008); // soften the extruded edges too
  const depth = Math.max(0.002, dp - bev * 2);
  const g = new THREE.ExtrudeGeometry(s, {
    depth, bevelEnabled: true, bevelThickness: bev, bevelSize: bev * 0.9,
    bevelSegments: 2, curveSegments: 5,
  });
  g.translate(0, 0, -depth / 2);
  rboxCache.set(key, g);
  return g;
}

export class WeaponController {
  private ctx: Ctx;
  private ray = new THREE.Raycaster();
  private group = new THREE.Group();
  private modelParts: THREE.Object3D[] = [];
  // Metallic view-model materials whose IBL reflection strength is animated.
  private metalMats: THREE.MeshStandardMaterial[] = [];
  private vmClock = 0;
  private scopeOn = false;   // currently in full scope view (scoped weapon, ADS held)

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
    // Rebuild a detailed procedural weapon + gloved hands. Each weapon has its
    // own distinct, recognisable silhouette + materials.
    this.modelParts.forEach((p) => { this.group.remove(p); });
    this.modelParts = [];

    // Palette — distinct finishes per weapon family.
    const gun = new THREE.MeshStandardMaterial({ color: 0x2a2c33, roughness: 0.45, metalness: 0.78 });
    const poly = new THREE.MeshStandardMaterial({ color: 0x15161b, roughness: 0.7, metalness: 0.2 });
    const steel = new THREE.MeshStandardMaterial({ color: 0x40444c, roughness: 0.28, metalness: 0.95 });
    const tan = new THREE.MeshStandardMaterial({ color: 0x8a774f, roughness: 0.6, metalness: 0.25 });
    const olive = new THREE.MeshStandardMaterial({ color: 0x3a4230, roughness: 0.6, metalness: 0.3 });
    const wood = new THREE.MeshStandardMaterial({ color: 0x5a3f26, roughness: 0.6, metalness: 0.1 });
    const glove = new THREE.MeshStandardMaterial({ color: 0x1b1b20, roughness: 0.82, metalness: 0.12 });
    const emberDot = new THREE.MeshBasicMaterial({ color: 0xd9552b });
    const lens = new THREE.MeshStandardMaterial({ color: 0x3a5a7a, roughness: 0.1, metalness: 0.3, emissive: 0x14324a, emissiveIntensity: 0.6 });

    // Register the metallic finishes for animated IBL reflections. baseEnv scales
    // how strongly each finish catches the environment — bare steel glints hard,
    // painted tan/olive barely shimmer. update() modulates envMapIntensity around
    // these so highlights breathe across the metal and flare briefly on fast turns.
    this.metalMats = [gun, steel, tan, olive];
    gun.userData.baseEnv = 1.0; steel.userData.baseEnv = 1.35;
    tan.userData.baseEnv = 0.5; olive.userData.baseEnv = 0.6;

    const add = (mesh: THREE.Mesh, x: number, y: number, z: number, rx = 0, ry = 0, rz = 0) => {
      mesh.position.set(x, y, z); mesh.rotation.set(rx, ry, rz);
      this.modelParts.push(mesh); this.group.add(mesh); return mesh;
    };
    // Curved construction kit: every "box" is a rounded, beveled solid and
    // cylinders run high segment counts, so nothing on the gun reads as a cube.
    const box = (w: number, h: number, dp: number, m: THREE.Material) => new THREE.Mesh(roundedBox(w, h, dp), m);
    const cyl = (rt: number, rb: number, len: number, m: THREE.Material, seg = 24) => new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, len, Math.max(seg, 16)), m);
    const bar = (rt: number, len: number, m: THREE.Material, z: number, y = 0.045, x = 0) => add(cyl(rt, rt, len, m, 24), x, y, z, Math.PI / 2, 0, 0); // barrel along -Z
    const scope = (z: number, tubeLen: number, tubeR: number) => {
      add(cyl(tubeR, tubeR, tubeLen, gun, 14), 0, 0.125, z, Math.PI / 2, 0, 0);
      add(cyl(tubeR * 1.3, tubeR * 1.3, 0.05, gun, 14), 0, 0.125, z - tubeLen / 2, Math.PI / 2, 0, 0);
      add(cyl(tubeR * 1.3, tubeR * 1.3, 0.05, gun, 14), 0, 0.125, z + tubeLen / 2, Math.PI / 2, 0, 0);
      add(cyl(tubeR, tubeR, 0.006, lens, 14), 0, 0.125, z + tubeLen / 2 + 0.026, Math.PI / 2, 0, 0);
      add(box(0.028, 0.05, 0.03, gun), 0, 0.088, z); // ring mount
    };
    const bipod = (z: number) => { for (const s of [-1, 1]) add(cyl(0.006, 0.006, 0.16, steel, 6), s * 0.05, -0.05, z, 0.5, 0, s * 0.4); };

    // ---- shared greebles: the fine detail that makes each gun read as a real
    // machine rather than a block — trigger guards, rails, muzzle devices, mag
    // ribs, charging handles. Reused across the weapon cases below. ----
    const tguard = (z: number, y = -0.03) => {                       // trigger-guard loop + blade
      add(new THREE.Mesh(new THREE.TorusGeometry(0.027, 0.005, 8, 18), gun), 0, y, z, 0, Math.PI / 2, 0);
      add(box(0.009, 0.026, 0.006, steel), 0, y + 0.01, z - 0.006);
    };
    const rail = (z0: number, z1: number, y: number, w = 0.03) => {   // picatinny ridges z0..z1
      const n = Math.max(2, Math.round(Math.abs(z1 - z0) / 0.02));
      for (let i = 0; i < n; i++) add(box(w, 0.007, 0.01, gun), 0, y, z0 + (z1 - z0) * (i / (n - 1)));
    };
    const flashHider = (z: number, r: number, y = 0.045) => {         // slotted birdcage muzzle
      add(cyl(r * 1.2, r * 1.2, 0.06, steel, 12), 0, y, z, Math.PI / 2, 0, 0);
      for (let i = 0; i < 4; i++) add(box(r * 0.5, r * 2.6, 0.006, poly), 0, y, z - 0.008 - i * 0.012, 0, 0, i * 0.5);
    };
    const magRibs = (x: number, y: number, z: number, w: number, tilt: number, n = 3) => { // stamped witness ribs
      for (let i = 0; i < n; i++) add(box(w * 1.02, 0.006, 0.05, gun), x, y - i * 0.045, z + i * 0.006, tilt, 0, 0);
    };
    const id = this.def.id;
    let fgZ = -0.42, kind: 'rifle' | 'pistol' | 'knife' = 'rifle';

    switch (id) {
      case 'knife': {
        kind = 'knife';
        // Drop-point blade built from an extruded 2-D profile — a real knife
        // silhouette: straight spine, curved belly rising to a sharp point,
        // beveled all round so the edge catches light. Length runs to -Z.
        const bl = 0.30, sp = 0.03;
        const s = new THREE.Shape();
        s.moveTo(0, sp * 0.55);                                      // ricasso top (at guard)
        s.lineTo(bl * 0.60, sp);                                     // spine, slight rise
        s.quadraticCurveTo(bl * 0.90, sp * 0.9, bl, 0);             // drop to the tip
        s.quadraticCurveTo(bl * 0.70, -sp * 0.95, bl * 0.32, -sp * 0.9); // belly / cutting edge
        s.lineTo(0, -sp * 0.7);                                      // edge back to guard
        s.closePath();
        const geo = new THREE.ExtrudeGeometry(s, { depth: 0.012, bevelEnabled: true, bevelThickness: 0.005, bevelSize: 0.004, bevelSegments: 2, steps: 1 });
        geo.translate(0, 0, -0.006);                                 // centre thickness on X after the Y-rotation
        add(new THREE.Mesh(geo, steel), 0, 0.0, -0.06, 0, Math.PI / 2, 0);
        // Fuller (blood groove) — a thin dark inset down each face of the blade.
        add(box(0.002, 0.007, 0.2, gun), 0.008, 0.006, -0.2);
        add(box(0.002, 0.007, 0.2, gun), -0.008, 0.006, -0.2);
        // Partial spine serrations near the guard.
        for (let i = 0; i < 5; i++) add(box(0.012, 0.014, 0.006, steel), 0, 0.03, -0.10 - i * 0.017, 0, 0, Math.PI / 4);
        // Bolster + cross guard with an upswept quillon.
        add(box(0.05, 0.03, 0.03, gun), 0, 0.0, -0.05);
        add(box(0.075, 0.018, 0.026, gun), 0, 0.0, -0.055);
        add(box(0.018, 0.05, 0.02, gun), 0.028, 0.008, -0.05, 0, 0, -0.3); // upswept quillon
        // Contoured micarta handle with finger grooves + a steel pommel.
        add(box(0.03, 0.05, 0.15, wood), 0, -0.006, 0.05);
        for (let i = 0; i < 4; i++) add(cyl(0.017, 0.017, 0.03, gun, 10), 0, -0.03, 0.005 + i * 0.035, Math.PI / 2, 0, 0);
        add(box(0.034, 0.034, 0.022, steel), 0, -0.006, 0.132);     // pommel
        add(cyl(0.005, 0.005, 0.024, poly, 8), 0, -0.022, 0.14, Math.PI / 2, 0, 0); // lanyard hole
        break;
      }
      case 'pistol': {
        add(box(0.05, 0.058, 0.26, gun), 0, 0.05, -0.12);                  // slide
        add(box(0.052, 0.02, 0.05, gun), 0, 0.082, -0.02);                 // rear serrations block
        add(box(0.044, 0.03, 0.22, poly), 0, 0.012, -0.1);                 // frame
        add(box(0.044, 0.15, 0.06, poly), 0, -0.07, 0.05, 0.28, 0, 0);     // grip + mag
        add(box(0.038, 0.02, 0.06, poly), 0, -0.02, -0.02);                // trigger guard
        bar(0.012, 0.06, steel, -0.26);
        add(box(0.008, 0.014, 0.01, gun), 0, 0.086, -0.24);               // front sight
        add(box(0.008, 0.008, 0.008, emberDot), 0, 0.088, -0.238);        // front sight dot
        add(box(0.032, 0.016, 0.012, gun), 0, 0.086, 0.0);                // rear sight
        tguard(-0.05, -0.008);                                            // trigger guard + blade
        for (let i = 0; i < 6; i++) add(box(0.052, 0.026, 0.004, gun), 0, 0.05, -0.03 + i * 0.011); // rear cocking serrations
        add(box(0.026, 0.026, 0.06, poly), 0.02, 0.055, -0.09);           // ejection port (right)
        add(box(0.03, 0.014, 0.05, gun), 0, -0.01, -0.2);                 // underbarrel accessory rail
        add(box(0.008, 0.012, 0.01, steel), 0.024, 0.02, -0.03);          // mag release button
        kind = 'pistol'; break;
      }
      case 'smg': {
        add(box(0.056, 0.085, 0.3, poly), 0, 0.02, -0.08);                 // boxy receiver
        add(box(0.05, 0.075, 0.06, poly), 0, -0.09, 0.02, 0.2, 0, 0);      // grip
        add(box(0.042, 0.22, 0.05, poly), 0, -0.14, -0.16, -0.1, 0, 0);    // vertical mag forward
        add(box(0.028, 0.11, 0.03, poly), 0, -0.075, -0.3);               // vertical foregrip
        bar(0.012, 0.22, steel, -0.36);
        add(cyl(0.02, 0.018, 0.05, steel, 10), 0, 0.045, -0.5, Math.PI / 2, 0, 0);
        add(cyl(0.012, 0.012, 0.16, gun, 8), 0, 0.05, 0.16, Math.PI / 2, 0, 0); // collapsed stock rod
        add(box(0.05, 0.06, 0.03, poly), 0, 0.03, 0.24);                   // stock plate
        add(box(0.05, 0.05, 0.06, gun), 0, 0.1, -0.1);                    // compact red-dot
        add(box(0.036, 0.036, 0.004, lens), 0, 0.108, -0.132);
        add(box(0.004, 0.004, 0.004, emberDot), 0, 0.108, -0.129);        // red-dot reticle
        tguard(-0.06, -0.02);
        add(box(0.026, 0.03, 0.06, poly), 0.026, 0.03, -0.06);            // ejection port (right)
        add(box(0.01, 0.016, 0.02, steel), -0.03, 0.02, -0.02);           // fire selector (left)
        rail(-0.02, -0.18, 0.075);                                        // top handguard rail
        magRibs(0, -0.06, -0.16, 0.042, -0.1, 3);                         // mag witness ribs
        add(box(0.01, 0.012, 0.014, steel), 0.028, -0.02, -0.05);         // charging handle
        fgZ = -0.3; break;
      }
      case 'rifle': { // AR-14 carbine
        buildAR(); add(box(0.05, 0.05, 0.07, gun), 0, 0.105, -0.12);       // red-dot
        add(box(0.038, 0.038, 0.004, lens), 0, 0.115, -0.155);
        add(box(0.004, 0.004, 0.004, emberDot), 0, 0.115, -0.152);
        add(box(0.01, 0.05, 0.01, gun), 0, 0.11, -0.5);                    // flip front sight
        add(box(0.004, 0.004, 0.004, emberDot), 0, 0.115, -0.152);         // red-dot reticle
        tguard(-0.07, -0.03);
        add(box(0.014, 0.03, 0.05, steel), 0.032, 0.06, 0.06);            // charging-handle latch (right)
        add(cyl(0.014, 0.014, 0.02, gun, 8), 0.03, 0.02, -0.02, 0, 0, Math.PI / 2); // forward assist
        rail(-0.3, -0.5, 0.075, 0.028);                                   // handguard top rail
        magRibs(0, -0.12, -0.03, 0.05, -0.12, 4);                         // mag ribs
        add(box(0.01, 0.01, 0.012, steel), 0.03, -0.02, -0.06);           // mag release
        fgZ = -0.46; break;
      }
      case 'battle': { // BR-55 — long tan battle rifle, big mag, full stock
        add(box(0.058, 0.075, 0.38, tan), 0, 0.03, -0.12);                 // receiver
        add(box(0.05, 0.15, 0.06, tan), 0, -0.1, 0.06, 0.32, 0, 0);        // grip
        add(box(0.058, 0.3, 0.11, tan), 0, -0.22, -0.06, -0.14, 0, 0);     // large angled mag
        add(box(0.066, 0.08, 0.46, tan), 0, 0.028, -0.42);                 // long handguard
        add(box(0.062, 0.12, 0.22, tan), 0, 0.02, 0.24);                   // full stock
        add(box(0.066, 0.04, 0.05, poly), 0, -0.04, 0.35);                 // butt pad
        bar(0.016, 0.5, steel, -0.66);
        add(cyl(0.026, 0.022, 0.07, steel, 10), 0, 0.045, -0.92, Math.PI / 2, 0, 0);
        scope(-0.16, 0.16, 0.026);                                         // short optic
        tguard(-0.07, -0.02);
        magRibs(0, -0.18, -0.06, 0.058, -0.14, 4);
        add(box(0.014, 0.03, 0.05, steel), 0.034, 0.05, 0.02);            // charging handle
        rail(-0.3, -0.56, 0.072, 0.03);                                   // handguard rail
        fgZ = -0.52; break;
      }
      case 'dmr': { // DMR-7 — marksman, long barrel + medium scope, skeleton stock
        add(box(0.05, 0.06, 0.36, gun), 0, 0.045, -0.12);
        add(box(0.045, 0.14, 0.055, poly), 0, -0.09, 0.06, 0.32, 0, 0);    // grip
        add(box(0.05, 0.24, 0.08, poly), 0, -0.18, -0.02, -0.12, 0, 0);    // mag
        add(box(0.06, 0.07, 0.42, poly), 0, 0.028, -0.42);                 // handguard
        // skeleton stock (two thin rails + pad)
        add(box(0.012, 0.02, 0.22, gun), 0.02, 0.06, 0.22); add(box(0.012, 0.02, 0.22, gun), -0.02, -0.02, 0.22);
        add(box(0.05, 0.11, 0.03, poly), 0, 0.02, 0.34);
        bar(0.015, 0.56, steel, -0.7);
        add(cyl(0.024, 0.02, 0.06, steel, 10), 0, 0.045, -0.98, Math.PI / 2, 0, 0);
        scope(-0.15, 0.24, 0.028);
        tguard(-0.07, -0.03);
        magRibs(0, -0.14, -0.02, 0.05, -0.12, 4);
        add(box(0.014, 0.03, 0.05, steel), 0.032, 0.05, 0.0);            // charging handle
        flashHider(-1.0, 0.015);                                         // slotted muzzle
        fgZ = -0.5; break;
      }
      case 'sniper': { // RAIL-X — huge scope, very long barrel, bolt, bipod
        add(box(0.058, 0.07, 0.42, gun), 0, 0.045, -0.14);                 // heavy receiver
        add(box(0.048, 0.14, 0.055, poly), 0, -0.09, 0.08, 0.3, 0, 0);     // grip
        add(box(0.05, 0.2, 0.08, poly), 0, -0.16, 0.0, -0.08, 0, 0);       // mag
        add(box(0.062, 0.13, 0.26, poly), 0, 0.02, 0.26);                  // cheek-riser stock
        add(cyl(0.014, 0.011, 0.4, steel, 8), 0, 0.033, 0.0, Math.PI / 2, 0, 0); // chassis rail underside...
        add(cyl(0.01, 0.01, 0.05, gun, 8), 0.055, 0.05, 0.06, 0, 0, Math.PI / 2); // bolt handle (right)
        bar(0.017, 0.66, steel, -0.82);
        add(cyl(0.032, 0.026, 0.09, steel, 12), 0, 0.045, -1.16, Math.PI / 2, 0, 0); // muzzle brake
        bipod(-0.9);
        scope(-0.12, 0.34, 0.036);                                         // large scope
        add(cyl(0.05, 0.05, 0.05, gun, 14), 0, 0.125, 0.09, Math.PI / 2, 0, 0); // big objective bell rear
        tguard(-0.08, -0.03);
        magRibs(0, -0.14, 0.0, 0.05, -0.08, 3);
        rail(-0.06, 0.24, 0.088, 0.03);                                  // scope base rail
        add(cyl(0.012, 0.012, 0.03, gun, 8), 0, 0.05, 0.06, 0, 0, Math.PI / 2); // bolt-handle knob
        fgZ = -0.6; break;
      }
      case 'lmg': { // LMG-40 — box mag, heavy ribbed barrel, bipod, carry handle
        add(box(0.06, 0.09, 0.42, olive), 0, 0.04, -0.12);                 // receiver
        add(box(0.05, 0.14, 0.06, olive), 0, -0.1, 0.08, 0.3, 0, 0);       // grip
        add(box(0.14, 0.17, 0.15, poly), 0, -0.17, -0.04);                 // ammo box
        add(box(0.03, 0.06, 0.12, olive), 0, 0.11, -0.02);                 // top cover / carry handle base
        add(box(0.11, 0.03, 0.03, gun), 0, 0.15, -0.02);                   // carry handle
        add(box(0.062, 0.1, 0.2, olive), 0, 0.02, 0.24);                   // stock
        const bbl = bar(0.02, 0.55, steel, -0.68);                          // heavy barrel
        for (let i = 0; i < 6; i++) add(cyl(0.026, 0.026, 0.012, gun, 10), 0, 0.045, -0.5 - i * 0.07, Math.PI / 2, 0, 0); // cooling rings
        add(cyl(0.03, 0.026, 0.07, steel, 10), 0, 0.045, -0.98, Math.PI / 2, 0, 0);
        bipod(-0.82);
        add(box(0.05, 0.05, 0.06, gun), 0, 0.115, -0.14); add(box(0.038, 0.038, 0.004, lens), 0, 0.125, -0.174); // optic
        tguard(-0.08, -0.02);
        add(box(0.03, 0.05, 0.06, olive), 0, -0.02, -0.04);              // feed-tray cover hump
        add(box(0.012, 0.03, 0.05, steel), 0.034, 0.04, -0.06);          // charging handle
        magRibs(-0.001, -0.1, -0.04, 0.14, 0, 3);                        // ammo-box latch ribs
        fgZ = -0.5; break;
      }
      case 'shotgun': { // BREACH-12 — pump, tube mag under barrel, wood furniture
        add(box(0.056, 0.075, 0.26, gun), 0, 0.03, -0.05);                 // receiver
        bar(0.02, 0.5, steel, -0.4, 0.075);                                // barrel (raised)
        add(cyl(0.016, 0.016, 0.44, steel, 10), 0, 0.03, -0.34, Math.PI / 2, 0, 0); // tube mag UNDER barrel
        add(box(0.052, 0.05, 0.11, wood), 0, 0.03, -0.3);                  // pump fore-end (wood)
        add(box(0.056, 0.11, 0.22, wood), 0, 0.02, 0.2);                   // wood stock
        add(box(0.05, 0.13, 0.05, wood), 0, -0.07, 0.08, 0.34, 0, 0);      // grip
        add(box(0.014, 0.014, 0.014, emberDot), 0, 0.108, -0.62);          // bead front sight
        tguard(-0.01, -0.01);
        for (let i = 0; i < 4; i++) add(cyl(0.021, 0.021, 0.012, gun, 10), 0, 0.075, -0.2 - i * 0.09, Math.PI / 2, 0, 0); // barrel bands
        add(box(0.05, 0.03, 0.05, gun), 0, 0.058, -0.03);                 // ejection port / receiver top
        add(box(0.012, 0.03, 0.05, steel), 0.032, 0.03, -0.03);           // bolt handle (right)
        add(box(0.03, 0.014, 0.04, steel), 0, 0.005, 0.02);               // loading gate / trigger group
        fgZ = -0.3; break;
      }
    }

    // Helper for the AR core (used by 'rifle').
    function _noop() {}
    _noop();

    this.buildHands(add, box, cyl, glove, kind, fgZ);
    this.ejectPortLocal.set(0.05, 0.05, -0.04);
    this.group.position.copy(this.basePos);

    // Local closure to build the AR-14 body (kept inline for the 'rifle' case).
    function buildAR() {
      add(box(0.05, 0.09, 0.26, poly), 0, -0.01, -0.05);
      add(box(0.052, 0.06, 0.3, gun), 0, 0.045, -0.1);
      add(box(0.022, 0.022, 0.05, gun), 0, 0.085, 0.02);
      add(box(0.006, 0.03, 0.06, steel), 0.028, 0.05, -0.04);
      add(cyl(0.017, 0.017, 0.14, gun, 8), 0, 0.04, 0.1, Math.PI / 2, 0, 0);
      add(box(0.05, 0.085, 0.16, poly), 0, 0.02, 0.2);
      add(box(0.055, 0.03, 0.04, poly), 0, -0.01, 0.28);
      add(box(0.045, 0.14, 0.06, poly), 0, -0.11, 0.05, 0.34, 0, 0);
      add(box(0.05, 0.24, 0.09, poly), 0, -0.17, -0.03, -0.12, 0, 0);
      add(box(0.062, 0.07, 0.4, poly), 0, 0.03, -0.47);
      for (let i = 0; i < 9; i++) add(box(0.03, 0.008, 0.014, gun), 0, 0.088, -0.02 - i * 0.05);
      bar(0.014, 0.34, steel, -0.45);
      add(box(0.03, 0.05, 0.04, gun), 0, 0.07, -0.42);
      add(cyl(0.022, 0.02, 0.05, steel, 10), 0, 0.045, -0.62, Math.PI / 2, 0, 0);
    }
  }

  /** Gloved forearms + fists gripping the weapon (added to the view group). */
  private buildHands(
    add: (m: THREE.Mesh, x: number, y: number, z: number, rx?: number, ry?: number, rz?: number) => THREE.Mesh,
    box: (w: number, h: number, dp: number, m: THREE.Material) => THREE.Mesh,
    cyl: (rt: number, rb: number, len: number, m: THREE.Material, seg?: number) => THREE.Mesh,
    glove: THREE.Material, kind: 'rifle' | 'pistol' | 'knife', fgZ = -0.42,
  ) {
    const gripZ = kind === 'pistol' ? 0.04 : kind === 'knife' ? 0.02 : 0.05;
    // Right hand on the grip + forearm angling to the lower-right of the frame.
    add(box(0.055, 0.06, 0.075, glove), 0.005, -0.14, gripZ);
    for (let i = 0; i < 4; i++) add(box(0.015, 0.02, 0.055, glove), -0.02 + i * 0.013, -0.115, gripZ - 0.03, 0.5, 0, 0);
    add(box(0.02, 0.045, 0.05, glove), 0.028, -0.13, gripZ + 0.01);
    add(cyl(0.032, 0.04, 0.34, glove, 8), 0.075, -0.26, gripZ + 0.16, 1.15, 0, 0.35);

    if (kind === 'rifle') {
      // Left hand on the fore-end at the weapon-specific position.
      add(box(0.06, 0.06, 0.09, glove), 0, -0.11, fgZ);
      for (let i = 0; i < 4; i++) add(box(0.016, 0.05, 0.02, glove), -0.03 + i * 0.02, -0.075, fgZ, -0.3, 0, 0);
      add(box(0.022, 0.05, 0.05, glove), -0.04, -0.1, fgZ + 0.02);
      add(cyl(0.032, 0.042, 0.36, glove, 8), -0.11, -0.24, fgZ - 0.14, 1.1, 0, -0.5);
    }
  }

  switchTo(i: number) {
    if (i < 0 || i >= WEAPONS.length || i === this.index || this.reloading) return;
    this.index = i;
    this.buildViewModel();
    this.cooldown = 0.25;
    this.raiseT = 0.4;        // play a raise-in animation
    this.inspectT = 0;
    // Drop out of scope view so the raise-in shows the new weapon.
    if (this.scopeOn) { this.scopeOn = false; this.group.visible = true; this.ctx.onScope?.(false); }
  }

  /** Manual inspect animation (rotate the weapon to examine it). */
  inspect() { if (!this.reloading && this.inspectT <= 0) this.inspectT = this.inspectDur; }

  /** Hide/show the view-model (e.g. while driving a vehicle). */
  setVisible(v: boolean) { this.group.visible = v; }

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

    // Working scope: on scoped weapons, committing to ADS swaps the viewmodel
    // for a full-screen scope overlay (drawn by the HUD) at true zoom FOV.
    const scopeNow = !!this.def.scoped && this.adsBlend > 0.72 && !this.reloading;
    if (scopeNow !== this.scopeOn) {
      this.scopeOn = scopeNow;
      this.group.visible = !scopeNow;
      this.ctx.onScope?.(scopeNow);
    }

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

    // Animated reflections: a slow breathing highlight plus a brief glint when
    // the view swings, so the metal reads as catching moving light rather than a
    // static envmap. Cheap — just modulates envMapIntensity, no recompiles.
    this.vmClock += dt;
    const swing = Math.min(1, Math.abs(lookDelta.dx) + Math.abs(lookDelta.dy));
    const shimmer = 1 + Math.sin(this.vmClock * 1.7) * 0.16 + swing * 0.8 + this.recoilKick * 0.5;
    for (const m of this.metalMats) m.envMapIntensity = (m.userData.baseEnv ?? 1) * shimmer;

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
