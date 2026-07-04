/**
 * core/ai/warden.ts — the five-state doctrine trunk + Wardenry drill layer
 * (Sprint 002 A1–A3; Book VII §9, Book X §4).
 *
 * LAWS enforced here:
 *  - Five states: UNAWARE → CURIOUS → ENGAGED → SEARCHING → FILED.
 *  - Detection is sense-honest: this module knows ONLY the stimuli it is fed
 *    (no world queries, no player handle — psychic tracking is impossible by
 *    construction).
 *  - The escalation drill: ANNOUNCE → POSTURE → FIRE. Skippable ONLY by being
 *    fired upon (Lock §17).
 *  - Alerts propagate via the RadioCall actor — audible, durational,
 *    interruptible. No radio, no propagation.
 *  - FILED writes a permanent world-ledger entry via callback and the unit
 *    resumes patrol. The institution gives up on procedure, never forgets on
 *    paper.
 */

export enum AIState {
  Unaware = 'unaware',
  Curious = 'curious',
  Engaged = 'engaged',
  Searching = 'searching',
  Filed = 'filed',
}

export enum DrillStage {
  None = 'none',
  Announce = 'announce',
  Posture = 'posture',
  Fire = 'fire',
}

export interface Stimulus {
  kind: 'sight' | 'sound' | 'attacked' | 'radio';
  /** World position of the stimulus (LKP source). */
  x: number;
  z: number;
  /** Sight confidence 0..1 (light term applied by the SENSES layer, not here). */
  strength?: number;
}

export interface LedgerWrite {
  type: 'cordon';
  x: number;
  z: number;
  /** Next rotation hardens (+1) — the world's memory, not the unit's. */
  hardening: 1;
}

export interface WardenConfig {
  /** Curious investigation duration (Book VII: 20–40 s; fixed per unit). */
  curiousS: number;
  /** Searching duration at LKP (45–90 s). */
  searchS: number;
  announceS: number;
  postureS: number;
  /** Elite deltas (Warden First Class): shorter announce, refuses bait. */
  elite?: boolean;
}

export const LINE_WARDEN: WardenConfig = { curiousS: 30, searchS: 60, announceS: 1.2, postureS: 0.8 };
export const FIRST_CLASS: WardenConfig = { curiousS: 30, searchS: 60, announceS: 0.5, postureS: 0.6, elite: true };

/** The radio actor: an audible, interruptible world event (Book X §21.5). */
export class RadioCall {
  static readonly DURATION_S = 2.0;
  private t = 0;
  private done = false;
  private dead = false;
  constructor(readonly x: number, readonly z: number) {}
  /** Kill the caller or the set mid-call → nothing propagates. */
  interrupt() { if (!this.done) this.dead = true; }
  tick(dt: number): 'calling' | 'propagated' | 'silenced' {
    if (this.dead) return 'silenced';
    if (this.done) return 'propagated';
    this.t += dt;
    if (this.t >= RadioCall.DURATION_S) { this.done = true; return 'propagated'; }
    return 'calling';
  }
  get audible(): boolean { return !this.done && !this.dead; }
}

export class WardenAI {
  readonly cfg: WardenConfig;
  private st = AIState.Unaware;
  private drill = DrillStage.None;
  private drillT = 0;
  private stateT = 0;
  private lkp: { x: number; z: number } | null = null;
  private filedOnce = false;
  /** Investigations refused (elite bait-refusal — juniors get sent instead). */
  baitRefusals = 0;

  private onLedger: (w: LedgerWrite) => void;
  private radioFactory: (x: number, z: number) => RadioCall;
  radio: RadioCall | null = null;

  constructor(cfg: WardenConfig, hooks: { onLedger?: (w: LedgerWrite) => void; radioFactory?: (x: number, z: number) => RadioCall } = {}) {
    this.cfg = cfg;
    this.onLedger = hooks.onLedger ?? (() => {});
    this.radioFactory = hooks.radioFactory ?? ((x, z) => new RadioCall(x, z));
  }

  get state(): AIState { return this.st; }
  get drillStage(): DrillStage { return this.drill; }
  get canFire(): boolean { return this.st === AIState.Engaged && this.drill === DrillStage.Fire; }

  perceive(s: Stimulus): void {
    switch (s.kind) {
      case 'attacked':
        // Being fired upon skips the drill (the ONLY skip — Lock §17).
        this.lkp = { x: s.x, z: s.z };
        this.st = AIState.Engaged;
        this.drill = DrillStage.Fire;
        this.stateT = 0;
        this.startRadio(s.x, s.z);
        break;
      case 'sight':
        if ((s.strength ?? 0) >= 0.99) {
          this.lkp = { x: s.x, z: s.z };
          if (this.st !== AIState.Engaged) {
            this.st = AIState.Engaged;
            this.drill = DrillStage.Announce;
            this.drillT = this.cfg.announceS;
            this.startRadio(s.x, s.z);
          }
        } else if ((s.strength ?? 0) > 0.2 && this.st === AIState.Unaware) {
          this.enterCurious(s);
        }
        break;
      case 'sound':
        if (this.st === AIState.Unaware) this.enterCurious(s);
        else if (this.st === AIState.Searching) this.lkp = { x: s.x, z: s.z };
        break;
      case 'radio':
        // Squad escalation: a propagated call raises readiness (posture, not fire —
        // the drill still governs the individual trigger).
        if (this.st === AIState.Unaware || this.st === AIState.Curious) {
          this.lkp = { x: s.x, z: s.z };
          this.st = AIState.Searching;
          this.stateT = this.cfg.searchS;
        }
        break;
    }
  }

  private enterCurious(s: Stimulus) {
    // Elite bait-refusal: the veteran does not walk to noises; a junior is sent
    // (squad layer's job) — the unit itself stays posted (Book VII §5).
    if (this.cfg.elite) { this.baitRefusals += 1; return; }
    this.st = AIState.Curious;
    this.stateT = this.cfg.curiousS;
    this.lkp = { x: s.x, z: s.z };
  }

  private startRadio(x: number, z: number) {
    if (!this.radio || !this.radio.audible) this.radio = this.radioFactory(x, z);
  }

  /** Target lost this frame? The caller reports contact truthfully; we manage state. */
  tick(dt: number, contact: boolean): void {
    this.radio?.tick(dt);

    switch (this.st) {
      case AIState.Curious:
        this.stateT -= dt;
        if (this.stateT <= 0) this.st = AIState.Unaware; // nothing found: resume
        break;
      case AIState.Engaged:
        if (this.drill === DrillStage.Announce) {
          this.drillT -= dt;
          if (this.drillT <= 0) { this.drill = DrillStage.Posture; this.drillT = this.cfg.postureS; }
        } else if (this.drill === DrillStage.Posture) {
          this.drillT -= dt;
          if (this.drillT <= 0) this.drill = DrillStage.Fire;
        }
        if (!contact) {
          this.st = AIState.Searching;
          this.stateT = this.cfg.searchS;
          this.drill = DrillStage.None;
        }
        break;
      case AIState.Searching:
        if (contact) {
          // Re-acquire: the drill re-runs from POSTURE (they already announced).
          this.st = AIState.Engaged;
          this.drill = DrillStage.Posture;
          this.drillT = this.cfg.postureS;
          break;
        }
        this.stateT -= dt;
        if (this.stateT <= 0) this.file();
        break;
      default:
        break;
    }
  }

  /** The institutional giving-up: cordon, write the ledger, resume patrol. */
  private file(): void {
    this.st = AIState.Filed;
    if (!this.filedOnce && this.lkp) {
      this.filedOnce = true;
      this.onLedger({ type: 'cordon', x: this.lkp.x, z: this.lkp.z, hardening: 1 });
    }
    // Filed is a posture beat; the unit then resumes its rotation.
    this.st = AIState.Filed;
  }

  /** Called by the patrol layer after the cordon beat completes. */
  resumePatrol(): void {
    if (this.st === AIState.Filed) this.st = AIState.Unaware;
  }
}
