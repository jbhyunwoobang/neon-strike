/**
 * Physics.ts — Lightweight custom physics layer.
 *
 * NOT a full rigid-body engine (no constraint solver, no drivable vehicles).
 * It integrates a pool of simple dynamic bodies — shell casings, ragdoll flops,
 * grenades and debris chunks — under gravity with ground bounce, friction,
 * tumble and a life/fade, which covers the high-impact, readable interactions:
 * ejecting brass, enemies flopping on death, thrown grenades that arc + bounce,
 * and explosions that shove nearby debris.
 *
 * Gameplay consequences (enemy/player damage, screen flash, EMP stun) are raised
 * through callbacks so Game stays authoritative over game state.
 */

import * as THREE from 'three';
import type { Effects } from './Effects';
import type { Audio } from './Audio';
import type { GrenadeType } from '../store';

interface Body {
  obj: THREE.Object3D;
  vel: THREE.Vector3;
  ang: THREE.Vector3;      // angular velocity (rad/s per axis)
  life: number; max: number;
  restitution: number;
  groundY: number;         // rest height for this body's origin
  kind: 'casing' | 'ragdoll' | 'grenade' | 'debris';
  mats?: THREE.Material[]; // materials to fade
  onRest?: () => void;
  data?: any;
}

interface Ctx {
  scene: THREE.Scene;
  effects: Effects;
  audio: Audio;
  onExplosion: (pos: THREE.Vector3, radius: number, dmg: number) => void;
  onFlash: () => void;
  onEmp: (pos: THREE.Vector3, radius: number) => void;
}

const GRAVITY = 22;
const MAX_CASINGS = 40;

export class Physics {
  private ctx: Ctx;
  private bodies: Body[] = [];
  private casingCount = 0;
  private brass = new THREE.MeshStandardMaterial({ color: 0xcaa24a, roughness: 0.35, metalness: 0.9 });
  private casingGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.05, 6);
  private grenadeGeo = new THREE.IcosahedronGeometry(0.07, 0);
  private grenadeMat = new THREE.MeshStandardMaterial({ color: 0x33402c, roughness: 0.6, metalness: 0.5 });

  constructor(ctx: Ctx) { this.ctx = ctx; }

  /** Eject a spinning brass casing from the weapon. */
  ejectCasing(pos: THREE.Vector3, right: THREE.Vector3, up: THREE.Vector3) {
    const m = new THREE.Mesh(this.casingGeo, this.brass);
    m.position.copy(pos);
    m.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
    this.ctx.scene.add(m);
    const vel = right.clone().multiplyScalar(2.2 + Math.random())
      .add(up.clone().multiplyScalar(1.4 + Math.random() * 0.8));
    vel.x += (Math.random() - 0.5); vel.z += (Math.random() - 0.5);
    this.bodies.push({
      obj: m, vel, ang: new THREE.Vector3((Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30),
      life: 3, max: 3, restitution: 0.4, groundY: 0.012, kind: 'casing',
      onRest: () => { if (Math.random() < 0.5) this.ctx.audio.impact('metal', 30); },
    });
    if (++this.casingCount > MAX_CASINGS) this.removeOldest('casing');
  }

  /** Flop an enemy's whole figure as a tumbling ragdoll, then fade + remove. */
  ragdoll(group: THREE.Object3D, hitDir: THREE.Vector3) {
    const mats: THREE.Material[] = [];
    group.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        const mm = mesh.material as THREE.Material | THREE.Material[];
        (Array.isArray(mm) ? mm : [mm]).forEach((mat) => { if (!mats.includes(mat)) { mat.transparent = true; mats.push(mat); } });
      }
    });
    const dir = hitDir.clone(); dir.y = 0; dir.normalize();
    this.bodies.push({
      obj: group,
      vel: dir.multiplyScalar(3 + Math.random() * 2).add(new THREE.Vector3(0, 3.5 + Math.random() * 1.5, 0)),
      ang: new THREE.Vector3((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4, 6 + Math.random() * 4),
      life: 2.2, max: 2.2, restitution: 0.25, groundY: 0.05, kind: 'ragdoll', mats,
    });
  }

  /** Throw a grenade of the given type; detonates after its fuse. */
  throwGrenade(pos: THREE.Vector3, dir: THREE.Vector3, type: GrenadeType) {
    const m = new THREE.Mesh(this.grenadeGeo, this.grenadeMat);
    m.position.copy(pos);
    this.ctx.scene.add(m);
    const glow = new THREE.PointLight(type === 'emp' ? 0x4aa0ff : 0xff5a24, 1.2, 4, 2);
    m.add(glow);
    this.bodies.push({
      obj: m, vel: dir.clone().multiplyScalar(16).add(new THREE.Vector3(0, 3, 0)),
      ang: new THREE.Vector3(6, 4, 8), life: 1.6, max: 1.6, restitution: 0.4, groundY: 0.07, kind: 'grenade',
      data: { type },
    });
  }

  /** Enemy bomber lob: an arcing bomb aimed at `to` with a softer blast than
   *  a player frag. Reuses the grenade body sim (bounce + fuse). */
  lobBomb(from: THREE.Vector3, to: THREE.Vector3) {
    const m = new THREE.Mesh(this.grenadeGeo, new THREE.MeshStandardMaterial({ color: 0x8a3b26, roughness: 0.6, metalness: 0.5 }));
    m.position.copy(from);
    this.ctx.scene.add(m);
    const glow = new THREE.PointLight(0xff5a24, 1.2, 4, 2); m.add(glow);
    // Flat-solve the arc for a ~1.3s flight to the target.
    const t = 1.3, g = 14;             // matches the body sim's gravity feel
    const vel = new THREE.Vector3((to.x - from.x) / t, (to.y - from.y) / t + 0.5 * g * t, (to.z - from.z) / t);
    this.bodies.push({
      obj: m, vel, ang: new THREE.Vector3(5, 3, 7), life: t, max: t,
      restitution: 0.3, groundY: 0.07, kind: 'grenade', data: { type: 'enemybomb' },
    });
  }

  private detonate(pos: THREE.Vector3, type: GrenadeType | 'enemybomb') {
    if (type === 'frag') {
      this.ctx.effects.explosion(pos);
      this.ctx.audio.shoot('shotgun', 0); this.ctx.audio.impact('metal', 0);
      this.ctx.onExplosion(pos, 8, 120);
      this.shove(pos, 10, 12);
      for (let i = 0; i < 10; i++) this.spawnDebris(pos);
    } else if (type === 'smoke') {
      this.spawnSmoke(pos);
      this.ctx.audio.impact('concrete', 0);
    } else if (type === 'flash') {
      this.ctx.effects.explosion(pos);
      this.ctx.onFlash();
      this.ctx.audio.impact('glass', 0);
    } else if (type === 'emp') {
      this.ctx.effects.explosion(pos);
      this.ctx.onEmp(pos, 12);
      this.ctx.audio.hitmarker(true);
    } else if (type === 'enemybomb') {
      // Bomber shell: smaller radius + damage than a player frag.
      this.ctx.effects.explosion(pos);
      this.ctx.audio.impact('metal', 0);
      this.ctx.onExplosion(pos, 6, 26);
      this.shove(pos, 7, 8);
      for (let i = 0; i < 5; i++) this.spawnDebris(pos);
    }
  }

  /** Public explosion (e.g. explosive enemy) — visual + damage + shove. */
  explosion(pos: THREE.Vector3, radius: number, dmg: number) {
    this.ctx.effects.explosion(pos);
    this.ctx.onExplosion(pos, radius, dmg);
    this.shove(pos, radius, 10);
  }

  /** Shatter debris chunks (glass/concrete impact). */
  shatter(pos: THREE.Vector3, normal: THREE.Vector3, n = 6) {
    for (let i = 0; i < n; i++) {
      const chunk = new THREE.Mesh(
        new THREE.TetrahedronGeometry(0.04 + Math.random() * 0.05),
        new THREE.MeshStandardMaterial({ color: 0x9fb4c4, roughness: 0.2, metalness: 0.3, transparent: true }),
      );
      chunk.position.copy(pos);
      this.ctx.scene.add(chunk);
      const v = normal.clone().multiplyScalar(1 + Math.random() * 3);
      v.x += (Math.random() - 0.5) * 3; v.y += Math.random() * 3; v.z += (Math.random() - 0.5) * 3;
      this.bodies.push({ obj: chunk, vel: v, ang: new THREE.Vector3((Math.random() - 0.5) * 20, 0, (Math.random() - 0.5) * 20), life: 1.6, max: 1.6, restitution: 0.3, groundY: 0.04, kind: 'debris', mats: [chunk.material as THREE.Material] });
    }
  }

  private spawnDebris(pos: THREE.Vector3) {
    const chunk = new THREE.Mesh(new THREE.TetrahedronGeometry(0.08 + Math.random() * 0.1),
      new THREE.MeshStandardMaterial({ color: 0x3a352d, roughness: 0.9, metalness: 0.1, transparent: true }));
    chunk.position.copy(pos);
    this.ctx.scene.add(chunk);
    const v = new THREE.Vector3((Math.random() - 0.5) * 8, 3 + Math.random() * 5, (Math.random() - 0.5) * 8);
    this.bodies.push({ obj: chunk, vel: v, ang: new THREE.Vector3((Math.random() - 0.5) * 12, 0, (Math.random() - 0.5) * 12), life: 2.2, max: 2.2, restitution: 0.35, groundY: 0.06, kind: 'debris', mats: [chunk.material as THREE.Material] });
  }

  private spawnSmoke(pos: THREE.Vector3) {
    // Layered soft sprite puffs instead of a blocky point cloud: an initial
    // burst plus staggered follow-up billows, each eased + long-lived, so the
    // screen fills with smooth rolling smoke that slowly thins out.
    for (let i = 0; i < 10; i++) this.ctx.effects.puff(pos, 2.6, 0xaaa69e, 6 + Math.random() * 3);
    for (let wave = 1; wave <= 4; wave++) {
      setTimeout(() => {
        for (let i = 0; i < 5; i++) {
          const off = new THREE.Vector3((Math.random() - 0.5) * 3, Math.random() * 1.2, (Math.random() - 0.5) * 3);
          this.ctx.effects.puff(off.add(pos), 2.2, 0xa29e96, 5 + Math.random() * 3);
        }
      }, wave * 450);
    }
  }

  private shove(pos: THREE.Vector3, radius: number, force: number) {
    for (const b of this.bodies) {
      if (b.kind === 'ragdoll' || b.kind === 'grenade') continue;
      const d = b.obj.position.distanceTo(pos);
      if (d < radius) {
        const push = b.obj.position.clone().sub(pos).normalize().multiplyScalar(force * (1 - d / radius));
        push.y += force * 0.4;
        b.vel.add(push);
      }
    }
  }

  private removeOldest(kind: string) {
    const i = this.bodies.findIndex((b) => b.kind === kind);
    if (i >= 0) { this.dispose(this.bodies[i]); this.bodies.splice(i, 1); if (kind === 'casing') this.casingCount--; }
  }

  update(dt: number) {
    for (let i = this.bodies.length - 1; i >= 0; i--) {
      const b = this.bodies[i];
      b.life -= dt;

      if (b.data?.smoke) {
        // Smoke: swell + rise + fade.
        b.data.grow = (b.data.grow ?? 0) + dt;
        const m = b.obj as THREE.Points;
        (m.material as THREE.PointsMaterial).size = 3.2 + b.data.grow * 1.4;
        (m.material as THREE.PointsMaterial).opacity = Math.min(0.5, b.life / 9) * 0.6;
      } else {
        b.vel.y -= GRAVITY * dt;
        b.obj.position.addScaledVector(b.vel, dt);
        b.obj.rotation.x += b.ang.x * dt; b.obj.rotation.y += b.ang.y * dt; b.obj.rotation.z += b.ang.z * dt;
        // Ground collision + bounce.
        if (b.obj.position.y <= b.groundY) {
          b.obj.position.y = b.groundY;
          if (b.vel.y < -0.5) { b.vel.y = -b.vel.y * b.restitution; b.vel.x *= 0.6; b.vel.z *= 0.6; b.ang.multiplyScalar(0.6); b.onRest?.(); b.onRest = undefined; }
          else { b.vel.set(0, 0, 0); b.ang.set(0, 0, 0); }
        }
      }

      // Grenade fuse.
      if (b.kind === 'grenade' && b.life <= 0) {
        this.detonate(b.obj.position.clone(), b.data.type as GrenadeType);
        this.dispose(b); this.bodies.splice(i, 1); continue;
      }

      // Fade tail (non-smoke; smoke manages its own opacity above).
      if (b.mats && b.life < 0.7 && !b.data?.smoke) {
        const o = Math.max(0, b.life / 0.7);
        b.mats.forEach((m) => { (m as THREE.Material).transparent = true; (m as any).opacity = o; });
      }

      if (b.life <= 0 && b.kind !== 'grenade') {
        this.dispose(b); this.bodies.splice(i, 1);
        if (b.kind === 'casing') this.casingCount--;
      }
    }
  }

  private dispose(b: Body) {
    this.ctx.scene.remove(b.obj);
    if (b.kind === 'ragdoll') return; // enemy geometry is shared/managed elsewhere
    const anyObj = b.obj as any;
    anyObj.geometry?.dispose?.();
  }

  clear() { this.bodies.forEach((b) => this.ctx.scene.remove(b.obj)); this.bodies = []; this.casingCount = 0; }
}
