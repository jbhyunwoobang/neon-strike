/**
 * Player.ts — First-person character controller.
 *
 * Implements the movement verbs — walk, sprint, crouch, slide, jump, gravity,
 * auto step-up, ledge vault/mantle and lean — with swept axis-aligned collision
 * against the Arena's box colliders (so you can stand on containers and sky
 * bridges). Drives the camera each frame with eye-height, head-bob and lean
 * roll; exposes look delta + velocity so the weapon view-model can sway.
 *
 * Networking reads `flags`, position and yaw/pitch for the transform packet.
 */

import * as THREE from 'three';
import type { Input } from './Input';
import type { Collider } from './Arena';
import { MoveFlags } from '../shared/protocol';
import { store } from '../store';

const STAND_HEIGHT = 1.75;
const CROUCH_HEIGHT = 1.05;
const RADIUS = 0.4;
const STEP = 0.6;          // auto step-up height
const VAULT = 1.5;         // max ledge you can vault onto
const GRAVITY = 20;
const JUMP_V = 7.0;

export class Player {
  pos = new THREE.Vector3(0, 0, 0);   // feet
  vel = new THREE.Vector3();
  yaw = 0;
  pitch = 0;

  private camera: THREE.PerspectiveCamera;
  private colliders: Collider[];
  private input: Input;

  private eye = STAND_HEIGHT;
  private targetEye = STAND_HEIGHT;
  private onGround = true;
  private bob = 0;
  private lean = 0;         // smoothed lean roll
  private slideT = 0;
  private lastStep = 0;
  flags = MoveFlags.None;
  landImpulse = 0;

  // Movement tunables.
  walkSpeed = 5.0;
  sprintSpeed = 8.2;
  crouchSpeed = 2.6;

  onFootstep?: (metal: boolean) => void;
  private groundMat: 'concrete' | 'metal' = 'concrete';

  constructor(camera: THREE.PerspectiveCamera, colliders: Collider[], input: Input) {
    this.camera = camera;
    this.colliders = colliders;
    this.input = input;
  }

  reset(x: number, y: number, z: number) {
    this.pos.set(x, y, z);
    this.vel.set(0, 0, 0);
    this.yaw = 0; this.pitch = 0;
    this.eye = this.targetEye = STAND_HEIGHT;
    this.onGround = true;
  }

  /** True while crouched or sliding (used to gate standing up under geometry). */
  get crouching() { return this.targetEye === CROUCH_HEIGHT; }

  update(dt: number) {
    const inp = this.input;
    inp.applyArrowLook(dt);
    const look = inp.consumeLook();
    this.yaw += look.dx;
    this.pitch = THREE.MathUtils.clamp(this.pitch + look.dy, -Math.PI / 2 + 0.05, Math.PI / 2 - 0.05);

    // Desired movement in local space.
    let mx = 0, mz = 0;
    if (inp.action('forward')) mz -= 1;
    if (inp.action('back')) mz += 1;
    if (inp.action('left')) mx -= 1;
    if (inp.action('right')) mx += 1;
    const moving = mx !== 0 || mz !== 0;
    const len = Math.hypot(mx, mz) || 1;
    mx /= len; mz /= len;

    const wantSprint = inp.action('sprint') && mz < 0 && this.onGround;
    const wantCrouch = inp.action('crouch') || this.slideT > 0;

    // Slide: initiate from a sprint + crouch.
    if (inp.action('slide') && wantSprint && this.slideT <= 0 && this.onGround) {
      this.slideT = 0.6;
      this.vel.x += -Math.sin(this.yaw) * 6;
      this.vel.z += -Math.cos(this.yaw) * 6;
    }
    if (this.slideT > 0) this.slideT -= dt;

    this.targetEye = wantCrouch ? CROUCH_HEIGHT : STAND_HEIGHT;

    // Speed selection.
    let speed = this.walkSpeed;
    if (wantSprint) speed = this.sprintSpeed;
    else if (wantCrouch) speed = this.crouchSpeed;

    // World-space acceleration from yaw basis.
    const fwdX = -Math.sin(this.yaw), fwdZ = -Math.cos(this.yaw);
    const rightX = Math.cos(this.yaw), rightZ = -Math.sin(this.yaw);
    const wishX = fwdX * -mz + rightX * mx;
    const wishZ = fwdZ * -mz + rightZ * mx;

    if (this.slideT > 0) {
      // During a slide, keep momentum, apply friction.
      this.vel.x *= (1 - dt * 2.2);
      this.vel.z *= (1 - dt * 2.2);
    } else {
      // Ground/air acceleration toward wish velocity.
      const accel = this.onGround ? 14 : 4;
      const targetVX = wishX * speed;
      const targetVZ = wishZ * speed;
      this.vel.x += (targetVX - this.vel.x) * Math.min(1, accel * dt);
      this.vel.z += (targetVZ - this.vel.z) * Math.min(1, accel * dt);
      if (!moving && this.onGround) { this.vel.x *= (1 - dt * 10); this.vel.z *= (1 - dt * 10); }
    }

    // Jump.
    if (this.input.action('jump') && this.onGround) {
      this.vel.y = JUMP_V;
      this.onGround = false;
    }

    // Gravity.
    this.vel.y -= GRAVITY * dt;

    // Integrate with collision, axis-separated.
    this.moveAxis('x', this.vel.x * dt);
    this.moveAxis('z', this.vel.z * dt);
    this.moveVertical(this.vel.y * dt);

    // Lean (Q/E) — camera roll.
    let leanTarget = 0;
    if (this.input.isDown('KeyQ')) leanTarget = 0.2;
    else if (this.input.isDown('KeyE')) leanTarget = -0.2;
    this.lean += (leanTarget - this.lean) * Math.min(1, dt * 10);

    // Camera eye height easing + head-bob.
    this.eye += (this.targetEye - this.eye) * Math.min(1, dt * 12);
    if (moving && this.onGround && this.slideT <= 0) {
      this.bob += dt * (wantSprint ? 14 : 9);
    }
    const bobY = moving && this.onGround ? Math.sin(this.bob) * (wantSprint ? 0.06 : 0.035) : 0;
    const bobX = moving && this.onGround ? Math.cos(this.bob * 0.5) * 0.03 : 0;

    // Footstep audio on bob apex.
    if (moving && this.onGround && Math.sin(this.bob) > 0.98 && performance.now() - this.lastStep > 220) {
      this.lastStep = performance.now();
      this.onFootstep?.(this.groundMat === 'metal');
    }

    // Compose camera.
    const eyeY = this.pos.y + this.eye + bobY - (this.slideT > 0 ? 0.3 : 0);
    this.camera.position.set(this.pos.x + bobX, eyeY, this.pos.z);
    this.camera.rotation.set(this.pitch, this.yaw, this.lean, 'YXZ');

    // Landing impulse (for camera dip in Game).
    if (this.landImpulse > 0) this.landImpulse = Math.max(0, this.landImpulse - dt * 4);

    // Pack network flags.
    let f = MoveFlags.None;
    if (wantCrouch) f |= MoveFlags.Crouch;
    if (wantSprint) f |= MoveFlags.Sprint;
    if (!this.onGround) f |= MoveFlags.Airborne;
    if (this.slideT > 0) f |= MoveFlags.Sliding;
    this.flags = f;
  }

  /** Move along a horizontal axis, resolving collisions with step-up + vault. */
  private moveAxis(axis: 'x' | 'z', delta: number) {
    if (delta === 0) return;
    const before = this.pos[axis];
    this.pos[axis] += delta;
    const head = this.pos.y + this.eye;
    for (const c of this.colliders) {
      const b = c.box;
      // Broad-phase in the horizontal plane.
      if (this.pos.x + RADIUS < b.min.x || this.pos.x - RADIUS > b.max.x) continue;
      if (this.pos.z + RADIUS < b.min.z || this.pos.z - RADIUS > b.max.z) continue;
      // Vertical overlap?
      if (b.max.y <= this.pos.y + 0.05 || b.min.y >= head) continue;
      // Can we step / vault onto it?
      const ledge = b.max.y - this.pos.y;
      const canStep = ledge <= STEP;
      const canVault = ledge <= VAULT && (this.input.action('jump'));
      if (canStep || canVault) {
        this.pos.y = b.max.y + 0.001;
        this.onGround = true;
        this.groundMat = c.material === 'metal' ? 'metal' : 'concrete';
        continue;
      }
      // Blocked — revert this axis.
      this.pos[axis] = before;
      this.vel[axis] = 0;
      return;
    }
  }

  /** Vertical integration: gravity, ground plane and standing on collider tops. */
  private moveVertical(delta: number) {
    const prevY = this.pos.y;
    this.pos.y += delta;

    // Find the highest supporting surface directly under the player.
    let ground = 0; // world floor
    for (const c of this.colliders) {
      const b = c.box;
      if (this.pos.x + RADIUS < b.min.x || this.pos.x - RADIUS > b.max.x) continue;
      if (this.pos.z + RADIUS < b.min.z || this.pos.z - RADIUS > b.max.z) continue;
      if (b.max.y <= prevY + STEP + 0.001 && b.max.y > ground) {
        ground = b.max.y;
        this.groundMat = c.material === 'metal' ? 'metal' : 'concrete';
      }
    }

    if (this.pos.y <= ground) {
      if (!this.onGround && this.vel.y < -6) this.landImpulse = Math.min(1, -this.vel.y / 12);
      this.pos.y = ground;
      this.vel.y = 0;
      this.onGround = true;
    } else {
      this.onGround = false;
    }
  }
}
