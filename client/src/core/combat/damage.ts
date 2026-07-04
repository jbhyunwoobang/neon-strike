/**
 * core/combat/damage.ts — the one damage pipeline, all parties (Sprint 002 W4–W6).
 *
 * TYPE-SYSTEM CANON ENFORCEMENT (Book X §21.4):
 *  - There is NO anti-personnel-explosive damage class. The enum below is the
 *    complete, closed set. Lock §20.12 is enforced by the compiler.
 *  - There are NO damage numbers for the UI: route() returns segment/chip
 *    deltas and feedback events only. Rendering numbers anywhere is an S2.
 *
 * Player vitals: the double rule (Book V §3.4) — Breath (outer, regens to the
 * current segment boundary after 5 s out of fire) + Binding (inner, dressing-
 * gated). 4+4 segments, constant for the whole game (LAW — no HP growth).
 */

/** Closed set. Note the absence that IS the law. */
export enum DamageClass {
  BallSmall = 'ball-small',
  BallLong = 'ball-long',
  CoilShot = 'coil-shot',
  DriverBolt = 'driver-bolt',
  Melee = 'melee',
  Concussive = 'concussive', // shove/stagger pressure — never lethal by itself
  Spall = 'spall',
}

export enum HitZone {
  PlateArc = 'plate-arc',
  Join = 'join',
  Helmet = 'helmet',
  Unarmored = 'unarmored',
}

export interface HitEvent {
  cls: DamageClass;
  zone: HitZone;
  /** Base wound value of the round at muzzle, abstract units. */
  base: number;
  distanceM: number;
}

export type FeedbackEvent = 'spall' | 'thud-join' | 'deflect' | 'flinch' | 'stagger';

export interface RoutedDamage {
  /** Breath-class chip (recoverable). */
  breath: number;
  /** Binding-class wound (dressing-gated). */
  binding: number;
  feedback: FeedbackEvent[];
}

/** Helmets defeat ball honestly at range (Book V §4.7). */
const HELMET_DEFLECT_RANGE_M = 18;
/** Plate converts Binding-class to Breath-class chip at this factor (Book V §3.5). */
const PLATE_CHIP_FACTOR = 0.35;

export function route(hit: HitEvent): RoutedDamage {
  const fb: FeedbackEvent[] = [];
  switch (hit.zone) {
    case HitZone.PlateArc:
      fb.push('spall', 'flinch');
      return { breath: hit.base * PLATE_CHIP_FACTOR, binding: 0, feedback: fb };
    case HitZone.Join:
      fb.push('thud-join', 'stagger');
      return { breath: 0, binding: hit.base, feedback: fb };
    case HitZone.Helmet:
      if (
        (hit.cls === DamageClass.BallSmall || hit.cls === DamageClass.BallLong) &&
        hit.distanceM > HELMET_DEFLECT_RANGE_M
      ) {
        fb.push('deflect');
        return { breath: 0, binding: 0, feedback: fb };
      }
      fb.push('spall', 'flinch');
      return { breath: hit.base * PLATE_CHIP_FACTOR, binding: 0, feedback: fb };
    case HitZone.Unarmored:
      fb.push(hit.cls === DamageClass.Concussive ? 'stagger' : 'flinch');
      return hit.cls === DamageClass.Concussive
        ? { breath: hit.base * 0.5, binding: 0, feedback: fb }
        : { breath: hit.base * 0.4, binding: hit.base * 0.6, feedback: fb };
  }
}

/* ------------------------------ player vitals ------------------------------ */

const SEGMENTS = 4;               // LAW: constant all game — no growth fields exist
const SEGMENT_VALUE = 25;
const BREATH_REGEN_DELAY_S = 5;   // out-of-fire delay before Breath recovers
const BREATH_REGEN_PER_S = 40;    // recovery rate toward the segment boundary
export const DRESSING_VERB_S = 3.5; // two-hand verb, interruptible (Book V §3.4)

export interface VitalsSample {
  /** 0..100 continuous Breath within the current Binding capacity. */
  breath: number;
  /** Intact Binding segments (0..4). */
  bindingSegments: number;
  dead: boolean;
  dressing: { active: boolean; remainingS: number };
}

export class PlayerVitals {
  private breath = SEGMENTS * SEGMENT_VALUE;
  private bindingSegments = SEGMENTS;
  private sinceHit = Infinity;
  private dressingT = 0;
  dressings: number;

  constructor(dressings = 2) { this.dressings = dressings; }

  private capacity(): number { return this.bindingSegments * SEGMENT_VALUE; }
  /** Breath regens to the CURRENT segment boundary only (LAW). */
  private boundary(): number {
    const cap = this.capacity();
    if (this.breath >= cap) return cap;
    // Regen closes to the NEXT segment line and stops there — sitting exactly
    // on a boundary is the rest state (breathing, not magic — LAW).
    return Math.min(cap, Math.ceil(this.breath / SEGMENT_VALUE - 1e-9) * SEGMENT_VALUE);
  }

  apply(d: { breath: number; binding: number }): void {
    if (this.dead) return;
    this.sinceHit = 0;
    if (this.dressingT > 0) this.dressingT = 0; // damage interrupts the verb
    this.breath = Math.max(0, this.breath - d.breath);
    if (d.binding > 0) {
      const lost = Math.max(1, Math.round(d.binding / SEGMENT_VALUE));
      this.bindingSegments = Math.max(0, this.bindingSegments - lost);
      this.breath = Math.min(this.breath, this.capacity());
    }
    if (d.binding > 0 && this.breath > 0) {
      // A solid hit also winds: chip breath by the overflow.
      this.breath = Math.max(0, this.breath - d.binding * 0.4);
    }
  }

  startDressing(): boolean {
    if (this.dead || this.dressings <= 0 || this.bindingSegments >= SEGMENTS) return false;
    if (this.dressingT > 0) return false;
    this.dressingT = DRESSING_VERB_S;
    return true;
  }

  cancelDressing(): void { this.dressingT = 0; }

  tick(dt: number): VitalsSample {
    this.sinceHit += dt;
    if (this.dressingT > 0) {
      this.dressingT -= dt;
      if (this.dressingT <= 0) {
        this.dressings -= 1;
        this.bindingSegments = Math.min(SEGMENTS, this.bindingSegments + 1);
        this.dressingT = 0;
      }
    }
    if (!this.dead && this.sinceHit >= BREATH_REGEN_DELAY_S) {
      this.breath = Math.min(this.boundary(), this.breath + BREATH_REGEN_PER_S * dt);
    }
    return this.sample();
  }

  get dead(): boolean { return this.breath <= 0 && this.bindingSegments <= 0; }

  sample(): VitalsSample {
    return {
      breath: this.breath,
      bindingSegments: this.bindingSegments,
      dead: this.dead,
      dressing: { active: this.dressingT > 0, remainingS: Math.max(0, this.dressingT) },
    };
  }
}
