/**
 * data/locomotion.ts — THE NUMBERS layer (Book X three-layer law).
 *
 * The Book V §2.15 controller state table, verbatim. This file is the single
 * source of truth for movement feel; core/locomotion consumes it and
 * core/locomotion/locomotion.test.ts asserts it (the feel-canon timing table —
 * Sprint 002 task Z2/B2). Values are Edition One tuning targets: ±20% tunable
 * HERE, never in code. Structural rules marked LAW are immutable.
 */

export const LOCOMOTION = {
  /** m/s — Book V §2.15 state table. LAW: proportions between states. */
  speeds: {
    walk: 1.5,
    run: 3.4,
    sprint: 5.2,
    crouch: 0.8,
  },

  /** Seconds to reach full speed / to stop (Book V §2.1). */
  accelTime: 0.25,
  decelTime: 0.3,

  /** Sprint is a decision with an entry and exit cost (Book V §2.4). */
  sprint: {
    /** Full burn duration at field weight-notch, seconds. */
    staminaBurnS: 12,
    /** Full regen while walking, seconds. */
    regenWalkS: 8,
    /** Full regen while stationary, seconds. */
    regenIdleS: 5,
    /** LAW: exit-to-fire delay — sprint never snaps into aimed fire. */
    exitToFireS: 0.35,
    /** FOV pair — LAW (Book IV §12): 70 base / 74 sprint. */
    fovBase: 70,
    fovSprint: 74,
  },

  jump: {
    /** Vertical rise, meters (Book V §2.6). */
    heightM: 0.5,
    /** Pre-jump crouch-load, seconds. */
    preloadS: 0.15,
    /** Air drift cap — LAW: ≤10% control in air. */
    airControl: 0.1,
  },

  /** Landing classes by drop height (Book V §2.10). */
  landing: {
    safeMaxM: 3,
    heavyMaxM: 5,
    settleSafeS: 0.2,
    settleHeavyS: 0.6,
    /** Heavy landing stamina cost, fraction of full bar. */
    heavyStaminaCost: 0.25,
  },

  crouch: {
    heightM: 1.05,
    /** Noise reduction vs walk — LAW (Book V §2.5): −70%. */
    noiseFactor: 0.3,
    /** Stationary crouch accuracy bonus (consumed by combat layer). */
    accuracyBonus: 0.15,
  },

  /** Noise classes per state — feeds the AI hearing bus (Book V §2.15). */
  noise: { idle: 0, crouch: 0.3, walk: 1.0, run: 2.0, sprint: 3.0 } as Record<string, number>,
} as const;

export type LocomotionTable = typeof LOCOMOTION;
