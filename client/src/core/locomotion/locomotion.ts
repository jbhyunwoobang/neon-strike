/**
 * core/locomotion/locomotion.ts — THE RULES layer (Book X three-layer law).
 *
 * The Book V §2 controller state machine, headless and framework-free: no
 * three.js, no DOM, no store. The render layer feeds inputs and reads state;
 * this module owns every rule. Numbers live in data/locomotion.ts ONLY.
 *
 * Sprint 002 Z2. States this sprint: idle/walk/run/sprint/crouch + jump/land.
 * Later states (slide/vault/lean/carry/read) extend the same machine — the
 * enum is the contract (Book V §2.15).
 */

import { LOCOMOTION, type LocomotionTable } from '../../data/locomotion';

export type MoveState = 'idle' | 'walk' | 'run' | 'sprint' | 'crouch' | 'air';

export interface MoveInput {
  /** Normalized move intent 0..1 (magnitude of WASD vector). */
  move: number;
  sprint: boolean;
  crouch: boolean;
  jump: boolean;
}

export interface MoveSample {
  state: MoveState;
  /** Horizontal speed, m/s. */
  speed: number;
  /** 0..1 — the hidden bar; expressed as breath audio, never UI (LAW). */
  stamina: number;
  /** Current FOV target (70 base / 74 sprint — LAW). */
  fov: number;
  /** Noise emission for the AI hearing bus. */
  noise: number;
  /** False during sprint and for exitToFireS after leaving sprint (LAW). */
  canFire: boolean;
  /** Seconds of landing settle remaining (camera consumes). */
  settle: number;
}

export class Locomotion {
  private t: LocomotionTable;
  private state: MoveState = 'idle';
  private speed = 0;
  private stamina = 1;
  private sprintExitTimer = 0;
  private settleTimer = 0;
  private jumpPreload = 0;
  private airborne = false;
  /** Vertical velocity while airborne (m/s, +up). Render layer integrates y. */
  vy = 0;

  constructor(table: LocomotionTable = LOCOMOTION) {
    this.t = table;
  }

  /** Begin a jump: returns false if refused (crouched, airborne, preloading). */
  requestJump(): boolean {
    if (this.airborne || this.jumpPreload > 0 || this.state === 'crouch') return false;
    this.jumpPreload = this.t.jump.preloadS;
    return true;
  }

  /** Called by the render/physics layer when ground contact returns. */
  land(dropHeightM: number): void {
    this.airborne = false;
    this.vy = 0;
    const L = this.t.landing;
    if (dropHeightM <= L.safeMaxM) {
      this.settleTimer = L.settleSafeS;
    } else if (dropHeightM <= L.heavyMaxM) {
      this.settleTimer = L.settleHeavyS;
      this.stamina = Math.max(0, this.stamina - L.heavyStaminaCost);
    } else {
      // Injury/lethal classes route to the damage layer (Sprint 002 W-block);
      // locomotion applies the heavy settle and reports via settle.
      this.settleTimer = L.settleHeavyS;
      this.stamina = Math.max(0, this.stamina - L.heavyStaminaCost);
    }
  }

  tick(dt: number, input: MoveInput): MoveSample {
    const t = this.t;

    // Jump preload → launch.
    if (this.jumpPreload > 0) {
      this.jumpPreload -= dt;
      if (this.jumpPreload <= 0 && !this.airborne) {
        this.airborne = true;
        // v = sqrt(2gh) for the canonical 0.5 m rise.
        this.vy = Math.sqrt(2 * 9.81 * t.jump.heightM);
      }
    }

    // Resolve target state (ground rules; air preserves last horizontal intent).
    let target: MoveState;
    if (this.airborne) {
      target = 'air';
    } else if (input.crouch) {
      target = input.move > 0 ? 'crouch' : 'crouch';
    } else if (input.move <= 0.01) {
      target = 'idle';
    } else if (input.sprint && this.stamina > 0) {
      target = 'sprint';
    } else if (input.move > 0.6) {
      target = 'run';
    } else {
      target = 'walk';
    }

    // Sprint exit cost (LAW: exit-to-fire).
    if (this.state === 'sprint' && target !== 'sprint') {
      this.sprintExitTimer = t.sprint.exitToFireS;
    }
    if (this.sprintExitTimer > 0) this.sprintExitTimer -= dt;
    if (this.settleTimer > 0) this.settleTimer -= dt;

    this.state = target;

    // Stamina: sprint burns; walk/idle regen at their table rates.
    if (this.state === 'sprint' && input.move > 0.01) {
      this.stamina = Math.max(0, this.stamina - dt / t.sprint.staminaBurnS);
      if (this.stamina <= 0) this.state = 'run'; // burnout falls to run
    } else if (this.state === 'idle' || this.state === 'crouch') {
      this.stamina = Math.min(1, this.stamina + dt / t.sprint.regenIdleS);
    } else {
      this.stamina = Math.min(1, this.stamina + dt / t.sprint.regenWalkS);
    }

    // Speed ramp: linear accel/decel per table (mass first, response close).
    const speeds: Record<string, number> = {
      idle: 0,
      walk: t.speeds.walk,
      run: t.speeds.run,
      sprint: t.speeds.sprint,
      crouch: input.move > 0.01 ? t.speeds.crouch : 0,
      air: this.speed, // air preserves momentum; drift handled by render layer
    };
    const targetSpeed = speeds[this.state];
    if (this.state !== 'air') {
      if (targetSpeed > this.speed) {
        const rate = t.speeds.sprint / t.accelTime; // full-scale accel rate
        this.speed = Math.min(targetSpeed, this.speed + rate * dt);
      } else {
        const rate = t.speeds.sprint / t.decelTime;
        this.speed = Math.max(targetSpeed, this.speed - rate * dt);
      }
    }

    // Airborne vertical integration is the render layer's job; we expose vy.
    if (this.airborne) this.vy -= 9.81 * dt;

    const noiseKey = this.state === 'air' ? 'run' : this.state;
    return {
      state: this.state,
      speed: this.speed,
      stamina: this.stamina,
      fov: this.state === 'sprint' ? t.sprint.fovSprint : t.sprint.fovBase,
      noise: t.noise[noiseKey] ?? 0,
      canFire: this.state !== 'sprint' && this.sprintExitTimer <= 0,
      settle: Math.max(0, this.settleTimer),
    };
  }
}
