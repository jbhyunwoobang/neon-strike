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
export const ENEMY_TYPES: Record<string, EnemyType> = {
  grunt:   { hp: 30,  speed: 3.6, damage: 9,  range: 2.2,  ranged: false, color: 0xccc3af, emissive: 0x5a1c0c, size: 1.0, score: 100, flying: false, fireInterval: 0.8 },
  soldier: { hp: 55,  speed: 3.0, damage: 8,  range: 34,   ranged: true,  color: 0xa8482c, emissive: 0x2a0d05, size: 1.0, score: 150, flying: false, fireInterval: 1.1 },
  shield:  { hp: 120, speed: 2.2, damage: 14, range: 2.4,  ranged: false, color: 0x55635d, emissive: 0x141f1c, size: 1.15, score: 200, flying: false, fireInterval: 1.0 },
  drone:   { hp: 35,  speed: 5.0, damage: 6,  range: 40,   ranged: true,  color: 0xb4ae9f, emissive: 0x4a1e0a, size: 0.7, score: 180, flying: true,  fireInterval: 1.3 },
  heavy:   { hp: 220, speed: 1.7, damage: 18, range: 30,   ranged: true,  color: 0x5e1e1a, emissive: 0x1a0504, size: 1.7, score: 300, flying: false, fireInterval: 1.4 },
  boss:    { hp: 1500, speed: 2.0, damage: 26, range: 42,  ranged: true,  color: 0xc2a44e, emissive: 0x2a1d07, size: 3.0, score: 2000, flying: false, fireInterval: 0.7 },
};

interface Ctx {
  scene: THREE.Scene;
  colliders: Collider[];
  effects: Effects;
  audio: Audio;
  getPlayerPos: () => THREE.Vector3;
  onPlayerDamage: (dmg: number) => void;
  onKill: (score: number, type: string, headshot: boolean) => void;
}

type AIState = 'approach' | 'strafe' | 'attack' | 'reposition';

class Enemy {
  id: number;
  type: string;
  def: EnemyType;
  hp: number;
  maxHp: number;
  mesh: THREE.Mesh;
  head: THREE.Mesh;
  group = new THREE.Group();
  state: AIState = 'approach';
  stateT = 0;
  fireCd = 0;
  strafeDir = 1;
  hurtT = 0;
  targetPos = new THREE.Vector3();

  constructor(id: number, type: string, x: number, z: number) {
    this.id = id;
    this.type = type;
    this.def = ENEMY_TYPES[type] ?? ENEMY_TYPES.grunt;
    this.hp = this.maxHp = this.def.hp;

    const s = this.def.size;
    const bodyMat = new THREE.MeshStandardMaterial({ color: this.def.color, emissive: this.def.emissive, emissiveIntensity: 0.95, roughness: 0.5, metalness: 0.3 });
    this.mesh = new THREE.Mesh(new THREE.BoxGeometry(s, s * 1.6, s * 0.6), bodyMat);
    this.mesh.position.y = s * 0.8;
    this.mesh.castShadow = true;
    this.head = new THREE.Mesh(new THREE.SphereGeometry(s * 0.32, 12, 12), new THREE.MeshStandardMaterial({ color: 0xe7e0d2, emissive: 0x7a3212, emissiveIntensity: 0.35, roughness: 0.6 }));
    this.head.position.y = s * 1.75;
    this.head.castShadow = true;

    const headY = this.def.size * 1.5;
    [this.mesh, this.head].forEach((m) => { m.userData.enemyId = id; m.userData.headY = headY; });
    this.group.add(this.mesh, this.head);
    this.group.position.set(x, this.def.flying ? 4 : 0, z);
  }

  meshes(): THREE.Object3D[] { return [this.mesh, this.head]; }
}

export class EnemyManager {
  private ctx: Ctx;
  private ray = new THREE.Raycaster();
  private local = new Map<number, Enemy>();
  private net = new Map<number, { group: THREE.Group; mesh: THREE.Mesh; head: THREE.Mesh; tx: number; tz: number; ty: number }>();
  private seq = 1;
  networked = false;

  constructor(ctx: Ctx) { this.ctx = ctx; }

  get count() { return this.networked ? this.net.size : this.local.size; }

  meshes(): THREE.Object3D[] {
    const out: THREE.Object3D[] = [];
    if (this.networked) this.net.forEach((n) => { out.push(n.mesh, n.head); });
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
    if (e.hp <= 0) {
      this.ctx.scene.remove(e.group);
      this.local.delete(enemyId);
      this.ctx.onKill(e.def.score, e.type, headshot);
      return { killed: true, type: e.type };
    }
    return { killed: false, type: e.type };
  }

  updateLocal(dt: number, elapsed: number) {
    const player = this.ctx.getPlayerPos();
    for (const e of this.local.values()) {
      const gp = e.group.position;
      const toX = player.x - gp.x, toZ = player.z - gp.z;
      const dist = Math.hypot(toX, toZ) || 1;
      const dirX = toX / dist, dirZ = toZ / dist;

      // Face the player.
      e.mesh.rotation.y = e.head.rotation.y = Math.atan2(toX, toZ);

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
      gp.x = THREE.MathUtils.clamp(gp.x, -95, 95);
      gp.z = THREE.MathUtils.clamp(gp.z, -95, 95);

      // Hurt flash decay.
      if (e.hurtT > 0) {
        e.hurtT -= dt;
        (e.mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.4;
      } else {
        (e.mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.95;
      }
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
        const group = new THREE.Group();
        const mesh = new THREE.Mesh(
          new THREE.BoxGeometry(def.size, def.size * 1.6, def.size * 0.6),
          new THREE.MeshStandardMaterial({ color: def.color, emissive: def.emissive, emissiveIntensity: 0.95, roughness: 0.5, metalness: 0.3 }),
        );
        mesh.position.y = def.size * 0.8; mesh.castShadow = true;
        const head = new THREE.Mesh(new THREE.SphereGeometry(def.size * 0.32, 12, 12), new THREE.MeshStandardMaterial({ color: 0xe7e0d2, emissive: 0x7a3212, emissiveIntensity: 0.35, roughness: 0.6 }));
        head.position.y = def.size * 1.75;
        const headY = def.size * 1.5;
        [mesh, head].forEach((m) => { m.userData.enemyId = s.id; m.userData.headY = headY; });
        group.add(mesh, head);
        group.position.set(s.x, s.y, s.z);
        this.ctx.scene.add(group);
        n = { group, mesh, head, tx: s.x, tz: s.z, ty: s.y };
        this.net.set(s.id, n);
      }
      n.tx = s.x; n.tz = s.z; n.ty = s.y;
      const ang = Math.atan2(this.ctx.getPlayerPos().x - s.x, this.ctx.getPlayerPos().z - s.z);
      n.mesh.rotation.y = n.head.rotation.y = ang;
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
