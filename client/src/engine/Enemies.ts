/**
 * Enemies.ts — Enemy roster, AI and rendering.
 *
 * Two operating modes share one manager:
 *   - LOCAL (single-player): full client-side simulation. Each enemy runs a
 *     small state machine (approach → strafe/flank → attack → reposition) with
 *     line-of-sight tests against the arena; ranged types shoot hitscan at the
 *     player, melee types rush. Damage, death, score and headshots are resolved
 *     here.
 *   - NET (co-op): the server owns positions/HP. The manager reconciles the
 *     server's EnemyState list (spawn/update/despawn) and interpolates. Client
 *     hits are reported upward for the server to adjudicate.
 *
 * Every enemy mesh carries `userData.enemyId` + `userData.headY` so the weapon
 * raycaster can register body/head hits.
 */

import * as THREE from 'three';
import type { Collider } from './Arena';
import type { Effects } from './Effects';
import type { Audio } from './Audio';
import type { EnemyState } from '../shared/protocol';

export interface EnemyType {
  hp: number; speed: number; damage: number; range: number; ranged: boolean;
  color: number; emissive: number; size: number; score: number; flying: boolean;
  fireInterval: number;
}

// Bone-white ceramic bodies with oxide-red / gunmetal accents — the biomech
// homunculi of the mood board. Dim ember "eye" emission, never neon.
// HP anchors a grunt at 100 = an unarmoured PUBG player, so the rebalanced
// weapon table produces reference-game TTKs: AR = 3 body shots (~0.28s),
// bolt sniper deletes a grunt, shield/heavy soak like armoured targets.
export const ENEMY_TYPES: Record<string, EnemyType> = {
  grunt:   { hp: 100, speed: 3.6, damage: 12, range: 2.2,  ranged: false, color: 0xccc3af, emissive: 0x5a1c0c, size: 1.0, score: 100, flying: false, fireInterval: 0.8 },
  soldier: { hp: 150, speed: 3.0, damage: 11, range: 34,   ranged: true,  color: 0xa8482c, emissive: 0x2a0d05, size: 1.0, score: 150, flying: false, fireInterval: 1.1 },
  shield:  { hp: 280, speed: 2.2, damage: 16, range: 2.4,  ranged: false, color: 0x55635d, emissive: 0x141f1c, size: 1.15, score: 200, flying: false, fireInterval: 1.0 },
  drone:   { hp: 70,  speed: 5.0, damage: 8,  range: 40,   ranged: true,  color: 0xb4ae9f, emissive: 0x4a1e0a, size: 0.7, score: 180, flying: true,  fireInterval: 1.3 },
  heavy:   { hp: 450, speed: 1.7, damage: 22, range: 30,   ranged: true,  color: 0x5e1e1a, emissive: 0x1a0504, size: 1.7, score: 300, flying: false, fireInterval: 1.4 },
  boss:    { hp: 2600, speed: 2.0, damage: 30, range: 42,  ranged: true,  color: 0xc2a44e, emissive: 0x2a1d07, size: 3.0, score: 2000, flying: false, fireInterval: 0.7 },
};

interface Ctx {
  scene: THREE.Scene;
  colliders: Collider[];
  effects: Effects;
  audio: Audio;
  getPlayerPos: () => THREE.Vector3;
  onPlayerDamage: (dmg: number) => void;
  onKill: (score: number, type: string, headshot: boolean) => void;
  onRagdoll?: (group: THREE.Object3D, hitDir: THREE.Vector3) => void;
}

type AIState = 'approach' | 'strafe' | 'attack' | 'reposition';

/**
 * Build a stylised skeletal-shroud figure from primitives (draped robe, skull
 * with ember eye-sockets, clavicle bar, hanging arms). Flat-shaded so it reads
 * as a carved silhouette rather than a smooth mannequin. Shared by local and
 * networked enemies. Returns the group + the body material (for the hurt
 * flash) + the world head height (for headshots).
 */
export function buildFigure(def: EnemyType): { group: THREE.Group; bodyMat: THREE.MeshStandardMaterial; headY: number } {
  const g = new THREE.Group();
  const s = def.size;
  const BONE = 0xe7e0d2;

  // Draped shroud — a lathed, flaring profile; low segments give cloth facets.
  const prof: THREE.Vector2[] = [
    [0.06, 1.78], [0.30, 1.72], [0.40, 1.48], [0.47, 1.06], [0.57, 0.55], [0.67, 0.14], [0.70, 0],
  ].map(([r, y]) => new THREE.Vector2(r * s, y * s * 1.06));
  const bodyMat = new THREE.MeshStandardMaterial({
    color: def.color, emissive: def.emissive, emissiveIntensity: 0.5, roughness: 0.9, metalness: 0.08, flatShading: true,
  });
  const shroud = new THREE.Mesh(new THREE.LatheGeometry(prof, 11), bodyMat);
  shroud.castShadow = true; shroud.receiveShadow = true; g.add(shroud);

  // Clavicle / shoulder bar.
  const shoulder = new THREE.Mesh(new THREE.BoxGeometry(0.52 * s, 0.1 * s, 0.16 * s), bodyMat);
  shoulder.position.y = 1.62 * s; shoulder.castShadow = true; g.add(shoulder);

  // Skull head — elongated, bone, faceted.
  const skullMat = new THREE.MeshStandardMaterial({ color: BONE, emissive: def.color, emissiveIntensity: 0.22, roughness: 0.55, metalness: 0.05, flatShading: true });
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.2 * s, 9, 7), skullMat);
  skull.scale.set(1, 1.18, 1.06); skull.position.y = 1.9 * s; skull.castShadow = true; g.add(skull);
  const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.17 * s, 0.11 * s, 0.15 * s), skullMat);
  jaw.position.set(0, 1.77 * s, 0.03 * s); jaw.castShadow = true; g.add(jaw);

  // Glowing ember eye-sockets (also aids visibility in the dark).
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff6a2a });
  for (const dx of [-0.075, 0.075]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.036 * s, 6, 6), eyeMat);
    eye.position.set(dx * s, 1.92 * s, 0.15 * s); g.add(eye);
  }

  // Hanging skeletal arms.
  for (const dx of [-1, 1]) {
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.05 * s, 0.035 * s, 0.95 * s, 6), bodyMat);
    arm.position.set(dx * 0.3 * s, 1.14 * s, 0.03 * s); arm.rotation.z = dx * 0.14; arm.castShadow = true; g.add(arm);
  }

  return { group: g, bodyMat, headY: 1.74 * s };
}

class Enemy {
  id: number;
  type: string;
  def: EnemyType;
  hp: number;
  maxHp: number;
  group: THREE.Group;
  mat: THREE.MeshStandardMaterial;   // body material (hurt flash)
  headY: number;
  state: AIState = 'approach';
  stateT = 0;
  fireCd = 0;
  strafeDir = 1;
  hurtT = 0;
  stun = 0;                 // EMP disable timer
  private _meshes: THREE.Object3D[] = [];

  constructor(id: number, type: string, x: number, z: number) {
    this.id = id;
    this.type = type;
    this.def = ENEMY_TYPES[type] ?? ENEMY_TYPES.grunt;
    this.hp = this.maxHp = this.def.hp;

    const f = buildFigure(this.def);
    this.group = f.group;
    this.mat = f.bodyMat;
    this.headY = f.headY;
    this.group.position.set(x, this.def.flying ? 4 : 0, z);
    // Every mesh in the figure is a hittable enemy target.
    this.group.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) { m.userData.enemyId = id; m.userData.headY = f.headY; this._meshes.push(m); }
    });
  }

  meshes(): THREE.Object3D[] { return this._meshes; }
}

export class EnemyManager {
  private ctx: Ctx;
  private ray = new THREE.Raycaster();
  private local = new Map<number, Enemy>();
  private net = new Map<number, { group: THREE.Group; meshes: THREE.Object3D[]; tx: number; tz: number; ty: number }>();
  private seq = 1;
  networked = false;

  constructor(ctx: Ctx) { this.ctx = ctx; }

  get count() { return this.networked ? this.net.size : this.local.size; }

  meshes(): THREE.Object3D[] {
    const out: THREE.Object3D[] = [];
    if (this.networked) this.net.forEach((n) => out.push(...n.meshes));
    else this.local.forEach((e) => out.push(...e.meshes()));
    return out;
  }

  /* ------------------------------- LOCAL -------------------------------- */

  spawnLocal(type: string, x: number, z: number): number {
    const e = new Enemy(this.seq++, type, x, z);
    this.ctx.scene.add(e.group);
    this.local.set(e.id, e);
    return e.id;
  }

  clear() {
    this.local.forEach((e) => this.ctx.scene.remove(e.group));
    this.local.clear();
    this.net.forEach((n) => this.ctx.scene.remove(n.group));
    this.net.clear();
  }

  /** Apply a client hit locally (single-player). Returns kill info. */
  damageLocal(enemyId: number, dmg: number, headshot: boolean): { killed: boolean; type: string } | null {
    const e = this.local.get(enemyId);
    if (!e) return null;
    e.hp -= dmg;
    e.hurtT = 0.12;
    if (e.hp <= 0) { this.killLocal(e, headshot); return { killed: true, type: e.type }; }
    return { killed: false, type: e.type };
  }

  /** Radial damage (grenades / explosions). Kills within range flop as ragdolls. */
  damageArea(pos: THREE.Vector3, radius: number, dmg: number) {
    for (const e of [...this.local.values()]) {
      const d = e.group.position.distanceTo(pos);
      if (d > radius) continue;
      e.hp -= dmg * (1 - d / radius);
      e.hurtT = 0.12;
      if (e.hp <= 0) this.killLocal(e, false);
    }
  }

  /** EMP stun: disable machines in radius for a few seconds. */
  empStun(pos: THREE.Vector3, radius: number, duration = 4) {
    for (const e of this.local.values()) {
      if (e.group.position.distanceTo(pos) < radius) e.stun = duration;
    }
  }

  private killLocal(e: Enemy, headshot: boolean) {
    this.local.delete(e.id);
    if (this.ctx.onRagdoll) {
      const hit = e.group.position.clone().sub(this.ctx.getPlayerPos());
      this.ctx.onRagdoll(e.group, hit);        // physics takes ownership + removes it
    } else {
      this.ctx.scene.remove(e.group);
    }
    this.ctx.onKill(e.def.score, e.type, headshot);
  }

  updateLocal(dt: number, elapsed: number) {
    const player = this.ctx.getPlayerPos();
    for (const e of this.local.values()) {
      const gp = e.group.position;
      const toX = player.x - gp.x, toZ = player.z - gp.z;
      const dist = Math.hypot(toX, toZ) || 1;
      const dirX = toX / dist, dirZ = toZ / dist;

      // Face the player + a subtle idle sway.
      e.group.rotation.y = Math.atan2(toX, toZ);
      e.group.rotation.z = Math.sin(elapsed * 2 + e.id) * 0.02;

      // EMP-stunned: twitch in place, no movement or attacks.
      if (e.stun > 0) {
        e.stun -= dt;
        e.group.rotation.z += Math.sin(elapsed * 40) * 0.05;
        e.mat.emissiveIntensity = 0.2 + Math.random() * 0.6;
        continue;
      }

      // Simple state machine.
      e.stateT -= dt;
      e.fireCd -= dt;
      const d = e.def;

      if (!d.ranged) {
        // Melee: rush and swing.
        if (dist > d.range) { gp.x += dirX * d.speed * dt; gp.z += dirZ * d.speed * dt; }
        else if (e.fireCd <= 0) { e.fireCd = d.fireInterval; this.ctx.onPlayerDamage(d.damage); }
      } else {
        // Ranged: hold at mid-range, strafe, shoot on LOS.
        const ideal = d.range * 0.55;
        if (dist > ideal + 4) { gp.x += dirX * d.speed * dt; gp.z += dirZ * d.speed * dt; }
        else if (dist < ideal - 4) { gp.x -= dirX * d.speed * 0.7 * dt; gp.z -= dirZ * d.speed * 0.7 * dt; }
        // Strafe perpendicular for a "flanking" read.
        if (e.stateT <= 0) { e.strafeDir = Math.random() > 0.5 ? 1 : -1; e.stateT = 1 + Math.random() * 1.5; }
        gp.x += -dirZ * e.strafeDir * d.speed * 0.5 * dt;
        gp.z += dirX * e.strafeDir * d.speed * 0.5 * dt;

        if (e.fireCd <= 0 && dist < d.range) {
          e.fireCd = d.fireInterval;
          const eye = gp.clone(); eye.y += d.flying ? 0 : 1.4;
          const aim = player.clone(); aim.y += 1.4;
          this.ctx.effects.tracer(eye, aim, 0xff5a3b);
          // Falloff damage.
          const dmg = d.damage * THREE.MathUtils.clamp(1 - dist / (d.range * 1.4), 0.3, 1);
          this.ctx.onPlayerDamage(dmg);
          this.ctx.audio.shoot('light', dist);
        }
      }

      // Flying bob.
      if (d.flying) gp.y = 4 + Math.sin(elapsed * 2 + e.id) * 0.6;

      // Keep inside the arena and off the exact player position.
      gp.x = THREE.MathUtils.clamp(gp.x, -106, 106);
      gp.z = THREE.MathUtils.clamp(gp.z, -106, 106);

      // Hurt flash decay.
      if (e.hurtT > 0) { e.hurtT -= dt; e.mat.emissiveIntensity = 1.7; }
      else { e.mat.emissiveIntensity = 0.5; }
    }
  }

  /* -------------------------------- NET --------------------------------- */

  /** Reconcile against a server snapshot (co-op). */
  syncNet(list: EnemyState[]) {
    this.networked = true;
    const seen = new Set<number>();
    for (const s of list) {
      seen.add(s.id);
      let n = this.net.get(s.id);
      if (!n) {
        const def = ENEMY_TYPES[s.type] ?? ENEMY_TYPES.grunt;
        const f = buildFigure(def);
        f.group.position.set(s.x, s.y, s.z);
        const meshes: THREE.Object3D[] = [];
        f.group.traverse((o) => {
          const m = o as THREE.Mesh;
          if (m.isMesh) { m.userData.enemyId = s.id; m.userData.headY = f.headY; meshes.push(m); }
        });
        this.ctx.scene.add(f.group);
        n = { group: f.group, meshes, tx: s.x, tz: s.z, ty: s.y };
        this.net.set(s.id, n);
      }
      n.tx = s.x; n.tz = s.z; n.ty = s.y;
      n.group.rotation.y = Math.atan2(this.ctx.getPlayerPos().x - s.x, this.ctx.getPlayerPos().z - s.z);
    }
    // Despawn removed.
    for (const [id, n] of this.net) {
      if (!seen.has(id)) { this.ctx.scene.remove(n.group); this.net.delete(id); }
    }
  }

  updateNet(dt: number) {
    for (const n of this.net.values()) {
      n.group.position.x += (n.tx - n.group.position.x) * Math.min(1, dt * 12);
      n.group.position.z += (n.tz - n.group.position.z) * Math.min(1, dt * 12);
      n.group.position.y += (n.ty - n.group.position.y) * Math.min(1, dt * 12);
    }
  }
}
