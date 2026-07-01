/**
 * RapierWorld.ts — Real rigid-body physics (Rapier3D / WASM).
 *
 * Runs a genuine constraint-based physics world alongside the game for the
 * interactions that benefit from it: pushable dynamic crates (shot/exploded),
 * physics-driven ragdolls (dead enemies tumble + collide), and a basic drivable
 * vehicle. The player keeps its lightweight custom collision (swept AABB) — this
 * world adds a layer of dynamic objects that bullets, blasts and the vehicle
 * interact with.
 *
 * Everything is guarded: Rapier initialises asynchronously from inlined WASM;
 * if it ever fails to load, `ready` stays false and the game runs unchanged
 * (the custom Physics layer still handles casings/grenades).
 */

import * as THREE from 'three';
import type { Collider as ArenaCollider } from './Arena';

// The compat build inlines the WASM, so no special bundler config is needed.
// Types from the package are loose across versions, so we lean on `any` here.
type R = any;

interface Body {
  rb: R;
  obj: THREE.Object3D;
  kind: 'crate' | 'ragdoll' | 'vehicle';
  life?: number;
}

export class RapierWorld {
  ready = false;
  private RAPIER: R = null;
  private world: R = null;
  private scene: THREE.Scene;
  private bodies: Body[] = [];
  private crateMat = new THREE.MeshStandardMaterial({ color: 0x6b5c44, roughness: 0.8, metalness: 0.1 });

  vehicle: Body | null = null;

  constructor(scene: THREE.Scene) { this.scene = scene; }

  async init() {
    try {
      const RAPIER = await import('@dimforge/rapier3d-compat');
      await RAPIER.init();
      this.RAPIER = RAPIER;
      this.world = new RAPIER.World({ x: 0, y: -24, z: 0 });
      this.ready = true;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[rapier] unavailable, using fallback physics', e);
      this.ready = false;
    }
  }

  /** Big static floor so dynamic bodies rest on the plaza. */
  addGround() {
    if (!this.ready) return;
    const R = this.RAPIER;
    const rb = this.world.createRigidBody(R.RigidBodyDesc.fixed().setTranslation(0, -0.5, 0));
    this.world.createCollider(R.ColliderDesc.cuboid(140, 0.5, 140).setFriction(0.9).setRestitution(0.1), rb);
  }

  /** Static cuboids for the arena's box colliders so crates/ragdolls collide with buildings. */
  addStatics(colliders: ArenaCollider[]) {
    if (!this.ready) return;
    const R = this.RAPIER;
    const box = new THREE.Vector3(), center = new THREE.Vector3();
    for (const c of colliders) {
      c.box.getSize(box); c.box.getCenter(center);
      if (box.x < 0.2 || box.z < 0.2 || box.y < 0.2) continue;
      const rb = this.world.createRigidBody(R.RigidBodyDesc.fixed().setTranslation(center.x, center.y, center.z));
      this.world.createCollider(R.ColliderDesc.cuboid(box.x / 2, box.y / 2, box.z / 2).setFriction(0.85), rb);
    }
  }

  /** A stack/scatter of pushable crates around the plaza. */
  spawnCrates(rng: () => number, n = 16) {
    if (!this.ready) return;
    const R = this.RAPIER;
    for (let i = 0; i < n; i++) {
      const s = 0.7 + rng() * 0.6;
      const a = rng() * Math.PI * 2, r = 10 + rng() * 40;
      let x = Math.cos(a) * r, z = Math.sin(a) * r;
      // small stacks
      const stack = 1 + (rng() < 0.4 ? 1 : 0);
      for (let k = 0; k < stack; k++) {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(s, s, s), this.crateMat);
        mesh.castShadow = true; mesh.receiveShadow = true;
        this.scene.add(mesh);
        const rb = this.world.createRigidBody(R.RigidBodyDesc.dynamic().setTranslation(x, s / 2 + k * s + 0.02, z).setLinearDamping(0.1).setAngularDamping(0.3));
        this.world.createCollider(R.ColliderDesc.cuboid(s / 2, s / 2, s / 2).setDensity(0.5).setFriction(0.8).setRestitution(0.15), rb);
        this.bodies.push({ rb, obj: mesh, kind: 'crate' });
      }
    }
  }

  /** Cast a ray (bullet) and shove the first dynamic body it hits. */
  shoot(origin: THREE.Vector3, dir: THREE.Vector3, force = 6) {
    if (!this.ready) return;
    try {
      const R = this.RAPIER;
      const ray = new R.Ray({ x: origin.x, y: origin.y, z: origin.z }, { x: dir.x, y: dir.y, z: dir.z });
      const hit = this.world.castRay(ray, 400, true);
      if (!hit) return;
      const rb = hit.collider?.parent?.() ?? hit.collider?.parent;
      if (rb && typeof rb.applyImpulseAtPoint === 'function' && rb.bodyType?.() !== 1) {
        const toi = hit.toi ?? hit.timeOfImpact ?? 1;
        const point = { x: origin.x + dir.x * toi, y: origin.y + dir.y * toi, z: origin.z + dir.z * toi };
        rb.applyImpulseAtPoint({ x: dir.x * force, y: dir.y * force + 1, z: dir.z * force }, point, true);
      }
    } catch { /* ignore raycast hiccups */ }
  }

  /** Radial impulse from an explosion. */
  explode(pos: THREE.Vector3, radius: number, force: number) {
    if (!this.ready) return;
    for (const b of this.bodies) {
      if (b.kind === 'vehicle') continue;
      const d = b.obj.position.distanceTo(pos);
      if (d < radius) {
        const dir = b.obj.position.clone().sub(pos).normalize();
        const mag = force * (1 - d / radius);
        b.rb.applyImpulse({ x: dir.x * mag, y: mag * 0.8 + 2, z: dir.z * mag }, true);
      }
    }
  }

  /** Turn a dead enemy figure into a physics ragdoll that tumbles + fades. */
  ragdoll(group: THREE.Object3D, hitDir: THREE.Vector3) {
    if (!this.ready) { this.scene.remove(group); return false; }
    const R = this.RAPIER;
    const p = group.position;
    const rb = this.world.createRigidBody(
      R.RigidBodyDesc.dynamic().setTranslation(p.x, p.y + 0.9, p.z)
        .setLinvel(hitDir.x * 2.5, 4, hitDir.z * 2.5)
        .setAngvel({ x: (Math.random() - 0.5) * 8, y: (Math.random() - 0.5) * 4, z: 6 })
        .setAngularDamping(0.4),
    );
    this.world.createCollider(R.ColliderDesc.capsule(0.7, 0.4).setDensity(0.7).setFriction(0.7).setRestitution(0.1), rb);
    // Offset so the figure's feet-origin sits at the capsule centre.
    group.position.set(0, 0, 0);
    const holder = new THREE.Group();
    holder.add(group);
    group.position.y = -0.9;
    this.scene.add(holder);
    const mats: THREE.Material[] = [];
    group.traverse((o) => { const m = (o as THREE.Mesh).material as any; if (m && !mats.includes(m)) { m.transparent = true; mats.push(m); } });
    this.bodies.push({ rb, obj: holder, kind: 'ragdoll', life: 3.5 });
    (holder as any).userData.mats = mats;
    return true;
  }

  /* --------------------------- drivable vehicle --------------------------- */

  spawnVehicle(x: number, z: number) {
    if (!this.ready) return;
    const R = this.RAPIER;
    const g = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x33383f, roughness: 0.5, metalness: 0.6 });
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0c0c0e, roughness: 0.8, metalness: 0.2 });
    const chassis = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.9, 4), bodyMat); chassis.castShadow = true; g.add(chassis);
    const cab = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.7, 1.8), bodyMat); cab.position.set(0, 0.7, -0.2); g.add(cab);
    const strip = new THREE.Mesh(new THREE.BoxGeometry(2.24, 0.08, 0.4), new THREE.MeshBasicMaterial({ color: 0xd9552b })); strip.position.set(0, 0.1, 2); g.add(strip);
    for (const [wx, wz] of [[-1.1, 1.3], [1.1, 1.3], [-1.1, -1.3], [1.1, -1.3]]) {
      const w = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.3, 12), wheelMat);
      w.rotation.z = Math.PI / 2; w.position.set(wx, -0.35, wz); g.add(w);
    }
    this.scene.add(g);
    const rb = this.world.createRigidBody(
      R.RigidBodyDesc.dynamic().setTranslation(x, 1.2, z)
        .setLinearDamping(0.9).setAngularDamping(2.5)
        .enabledRotations(false, true, false), // stay upright, yaw only
    );
    this.world.createCollider(R.ColliderDesc.cuboid(1.1, 0.6, 2).setDensity(1.4).setFriction(0.9), rb);
    this.vehicle = { rb, obj: g, kind: 'vehicle' };
    this.bodies.push(this.vehicle);
  }

  /** Drive the vehicle: throttle/brake + steer. Returns chassis pose for the camera. */
  driveVehicle(throttle: number, steer: number) {
    if (!this.ready || !this.vehicle) return null;
    const rb = this.vehicle.rb;
    const rot = rb.rotation();
    const q = new THREE.Quaternion(rot.x, rot.y, rot.z, rot.w);
    const fwd = new THREE.Vector3(0, 0, 1).applyQuaternion(q);
    const speed = new THREE.Vector3().copy(rb.linvel()).dot(fwd);
    rb.applyImpulse({ x: fwd.x * throttle * 26, y: 0, z: fwd.z * throttle * 26 }, true);
    // Steering torque scales with speed so it turns while moving.
    rb.applyTorqueImpulse({ x: 0, y: -steer * Math.min(1, Math.abs(speed) / 4) * 9 * Math.sign(speed || 1), z: 0 }, true);
    const t = rb.translation();
    return { pos: new THREE.Vector3(t.x, t.y, t.z), quat: q };
  }

  vehiclePos(): THREE.Vector3 | null {
    if (!this.vehicle) return null;
    const t = this.vehicle.rb.translation();
    return new THREE.Vector3(t.x, t.y, t.z);
  }

  /* ------------------------------- stepping ------------------------------ */

  step(dt: number) {
    if (!this.ready) return;
    try {
      this.world.timestep = Math.min(dt, 1 / 30);
      this.world.step();
      for (let i = this.bodies.length - 1; i >= 0; i--) {
        const b = this.bodies[i];
        const t = b.rb.translation(); const r = b.rb.rotation();
        b.obj.position.set(t.x, t.y, t.z);
        b.obj.quaternion.set(r.x, r.y, r.z, r.w);
        if (b.kind === 'ragdoll' && b.life !== undefined) {
          b.life -= dt;
          if (b.life < 0.8) {
            const o = Math.max(0, b.life / 0.8);
            (b.obj as any).userData.mats?.forEach((m: any) => { m.opacity = o; });
          }
          if (b.life <= 0) { this.remove(b); this.bodies.splice(i, 1); }
        }
      }
    } catch { /* never let physics crash the frame */ }
  }

  private remove(b: Body) {
    this.scene.remove(b.obj);
    try { this.world.removeRigidBody(b.rb); } catch { /* */ }
  }

  clear() {
    this.bodies.forEach((b) => this.remove(b));
    this.bodies = []; this.vehicle = null;
  }
}
