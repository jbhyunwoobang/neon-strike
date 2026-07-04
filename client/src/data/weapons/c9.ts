/**
 * data/weapons/c9.ts — the Arsenal C-9 carbine "the Nine" (Book V §4.2 W2).
 * NUMBERS layer. Timings carry the ±10% canon band (LAW); tune here only.
 * LAW: fire modes are semi + 2-round burst ONLY — full-auto does not exist
 * (mix law, Book V LAW 4-A: sustained auto would bury the protected thing).
 */

export interface WeaponData {
  id: string;
  name: string;
  family: 'arsenal' | 'tideworks' | 'ranger' | 'grafting' | 'driver';
  ammoClass: 'ball-long' | 'ball-small' | 'coil-shell' | 'survey-long' | 'driver-bolt';
  magazine: number;
  fireModes: ReadonlyArray<'semi' | 'burst2'>;
  /** Seconds between shots inside a burst. */
  burstIntervalS: number;
  /** Minimum seconds between trigger actuations (semi) / bursts. */
  cycleS: number;
  drawS: number;
  stowS: number;
  /** Staged reload — interruption preserves completed stages (LAW). */
  reloadStages: ReadonlyArray<{ id: 'eject' | 'feed' | 'chamber' | 'bolt'; s: number }>;
  /** Extra stage prepended when the chamber is empty (empty reload 3.2 s total). */
  emptyExtraStage: { id: 'bolt'; s: number };
  /** Hitscan inside this range; projectile with drop beyond (Book V §4.4). */
  hitscanRangeM: number;
  /** Base spread cone half-angle, degrees, standing still. */
  baseConeDeg: number;
  /** Stance modifiers (multipliers on cone). */
  cone: { crouch: number; move: number; sprintExitBlocked: true };
  /** Recoil: per-shot rise (deg) and settle time (s) — pattern + noise, learnable. */
  recoil: { riseDeg: number; settleS: number };
}

export const C9: WeaponData = {
  id: 'c9',
  name: 'ARSENAL C-9',
  family: 'arsenal',
  ammoClass: 'ball-long',
  magazine: 24,
  fireModes: ['semi', 'burst2'],
  burstIntervalS: 0.09,
  cycleS: 0.25,
  drawS: 1.0,
  stowS: 0.7,
  // 0.8 + 1.0 + 0.6 = 2.4 s tactical (canon); + bolt 0.8 = 3.2 s empty (canon).
  reloadStages: [
    { id: 'eject', s: 0.8 },
    { id: 'feed', s: 1.0 },
    { id: 'chamber', s: 0.6 },
  ],
  emptyExtraStage: { id: 'bolt', s: 0.8 },
  hitscanRangeM: 30,
  baseConeDeg: 0.9,
  cone: { crouch: 0.85, move: 1.6, sprintExitBlocked: true },
  recoil: { riseDeg: 3.5, settleS: 0.35 },
};
