/**
 * core/combat/weapon.ts — the weapon framework (Sprint 002 W1/W2).
 * RULES layer: headless state machine, data-driven, event-emitting.
 *
 * States: stowed → drawing → ready → cycling(fire) → reloading(staged) → stowing.
 * LAW: reload stages persist across interruption (a half-fed tube stays fed);
 * LAW: no full-auto exists at the type level (fire modes come from data);
 * LAW: timings live in data with the ±10% canon band — tests assert them.
 *
 * Events (anim:/audio:/vfx: vocabulary — one name-space across lanes):
 * consumers subscribe; this module never touches rendering or sound.
 */

import type { WeaponData } from '../../data/weapons/c9';

export type WeaponState = 'stowed' | 'drawing' | 'ready' | 'cycling' | 'reloading' | 'stowing';
export type WeaponEvent =
  | { type: 'fire'; round: number }
  | { type: 'dry' }
  | { type: 'stage'; stage: string }
  | { type: 'reload-complete' }
  | { type: 'drawn' }
  | { type: 'stowed' };

export class Weapon {
  readonly data: WeaponData;
  private st: WeaponState = 'stowed';
  private timer = 0;
  private modeIndex = 0;
  private burstLeft = 0;

  /** Rounds in the magazine + whether one is chambered. */
  mag: number;
  chambered: boolean;
  reserve: number;

  /** Staged reload progress — persists across interruption (LAW). */
  private stageQueue: Array<{ id: string; s: number }> = [];
  private stageElapsed = 0;
  private pendingFeed = false;

  private listeners: Array<(e: WeaponEvent) => void> = [];

  constructor(data: WeaponData, reserve = 72) {
    this.data = data;
    this.mag = data.magazine;
    this.chambered = true;
    this.reserve = reserve;
  }

  on(fn: (e: WeaponEvent) => void) { this.listeners.push(fn); }
  private emit(e: WeaponEvent) { for (const fn of this.listeners) fn(e); }

  get state(): WeaponState { return this.st; }
  get mode() { return this.data.fireModes[this.modeIndex]; }

  toggleMode() { this.modeIndex = (this.modeIndex + 1) % this.data.fireModes.length; }

  draw() {
    if (this.st !== 'stowed') return;
    this.st = 'drawing';
    this.timer = this.data.drawS;
  }

  stow() {
    if (this.st === 'stowed' || this.st === 'stowing') return;
    // Interrupting a reload preserves completed stages (LAW): stageQueue keeps
    // its remaining entries; a partially elapsed stage restarts.
    this.stageElapsed = 0;
    this.st = 'stowing';
    this.timer = this.data.stowS;
  }

  /**
   * Trigger pull. canFire carries the locomotion gate (sprint/exit-to-fire LAW).
   * Returns true if a shot cycle began.
   */
  trigger(canFire: boolean): boolean {
    if (!canFire || this.st !== 'ready') return false;
    if (!this.chambered || this.mag < 0) { this.emit({ type: 'dry' }); return false; }
    if (this.mag === 0 && !this.chambered) { this.emit({ type: 'dry' }); return false; }
    this.burstLeft = this.mode === 'burst2' ? 2 : 1;
    this.st = 'cycling';
    this.timer = 0; // fire first round immediately on tick
    return true;
  }

  /** Begin (or resume) the staged reload. */
  reload() {
    if (this.st === 'reloading' || this.st === 'stowed' || this.st === 'stowing') return;
    // Resuming pending stages always wins (LAW: completed work persists).
    if (this.stageQueue.length === 0) {
      if (this.mag >= this.data.magazine && this.chambered) return;
      if (this.reserve <= 0) return;
    }
    if (this.stageQueue.length === 0) {
      // Fresh reload: build the stage list; empty chamber adds the bolt stage.
      this.stageQueue = [...this.data.reloadStages.map((s) => ({ ...s }))];
      if (!this.chambered) this.stageQueue.push({ ...this.data.emptyExtraStage });
    }
    this.st = 'reloading';
    this.stageElapsed = 0;
  }

  /** Interrupt whatever is happening (movement demand, damage, stow). */
  interrupt() {
    if (this.st === 'reloading') {
      this.stageElapsed = 0; // current stage restarts; completed stages persist
      this.st = 'ready';
    } else if (this.st === 'cycling') {
      this.burstLeft = 0;
      this.st = 'ready';
    }
  }

  tick(dt: number): void {
    switch (this.st) {
      case 'drawing':
        this.timer -= dt;
        if (this.timer <= 0) { this.st = 'ready'; this.emit({ type: 'drawn' }); }
        break;
      case 'stowing':
        this.timer -= dt;
        if (this.timer <= 0) { this.st = 'stowed'; this.emit({ type: 'stowed' }); }
        break;
      case 'cycling': {
        this.timer -= dt;
        if (this.timer <= 0 && this.burstLeft > 0) {
          if (this.chambered || this.mag > 0) {
            // Fire: consume chamber, auto-chamber next from mag.
            if (!this.chambered) { /* unreachable in normal cycle */ }
            this.emit({ type: 'fire', round: this.mag });
            if (this.mag > 0) { this.mag -= 1; this.chambered = true; }
            else { this.chambered = false; }
            this.burstLeft -= 1;
            this.timer = this.burstLeft > 0 ? this.data.burstIntervalS : this.data.cycleS;
          } else {
            this.emit({ type: 'dry' });
            this.burstLeft = 0;
          }
        }
        if (this.burstLeft <= 0 && this.timer <= 0) this.st = 'ready';
        break;
      }
      case 'reloading': {
        const stage = this.stageQueue[0];
        if (!stage) { this.st = 'ready'; break; }
        this.stageElapsed += dt;
        if (this.stageElapsed >= stage.s) {
          this.stageElapsed = 0;
          this.stageQueue.shift();
          this.emit({ type: 'stage', stage: stage.id });
          if (stage.id === 'feed') {
            // The magazine physically swaps at feed completion.
            const need = this.data.magazine - this.mag;
            const take = Math.min(need, this.reserve);
            this.mag += take;
            this.reserve -= take;
          }
          if (stage.id === 'chamber' || stage.id === 'bolt') {
            if (this.mag > 0 && !this.chambered) { this.chambered = true; this.mag -= 1; }
          }
          if (this.stageQueue.length === 0) {
            if (!this.chambered && this.mag > 0) { this.chambered = true; this.mag -= 1; }
            this.st = 'ready';
            this.emit({ type: 'reload-complete' });
          }
        }
        break;
      }
      default:
        break;
    }
  }

  /** Current spread cone (deg) for the given stance — honesty, no bloom tricks. */
  cone(stance: { crouched: boolean; moving: boolean }): number {
    let c = this.data.baseConeDeg;
    if (stance.crouched) c *= this.data.cone.crouch;
    if (stance.moving) c *= this.data.cone.move;
    return c;
  }
}
