/** Wardenry doctrine tests (Sprint 002 A1–A3, A5) — the laws, asserted. */
import { describe, it, expect } from 'vitest';
import { WardenAI, AIState, DrillStage, RadioCall, LINE_WARDEN, FIRST_CLASS, type LedgerWrite } from './warden';

const DT = 1 / 60;
function tickFor(ai: WardenAI, seconds: number, contact: boolean) {
  for (let t = 0; t < seconds; t += DT) ai.tick(DT, contact);
}

describe('the five-state grammar (Book VII §9.1)', () => {
  it('LAW: no psychic tracking — an unfed unit never leaves Unaware', () => {
    const ai = new WardenAI(LINE_WARDEN);
    tickFor(ai, 30, false);
    expect(ai.state).toBe(AIState.Unaware);
  });

  it('sound → Curious, investigates on procedure, gives up and resumes', () => {
    const ai = new WardenAI(LINE_WARDEN);
    ai.perceive({ kind: 'sound', x: 10, z: 0 });
    expect(ai.state).toBe(AIState.Curious);
    tickFor(ai, LINE_WARDEN.curiousS + 0.5, false);
    expect(ai.state).toBe(AIState.Unaware);
  });

  it('lost contact → Searching at LKP → FILED writes the world ledger once', () => {
    const writes: LedgerWrite[] = [];
    const ai = new WardenAI(LINE_WARDEN, { onLedger: (w) => writes.push(w) });
    ai.perceive({ kind: 'sight', x: 5, z: 5, strength: 1 });
    tickFor(ai, 3, true);           // engaged, drill completes
    tickFor(ai, 0.5, false);        // contact lost
    expect(ai.state).toBe(AIState.Searching);
    tickFor(ai, LINE_WARDEN.searchS + 0.5, false);
    expect(ai.state).toBe(AIState.Filed);
    expect(writes.length).toBe(1);
    expect(writes[0]).toMatchObject({ type: 'cordon', x: 5, z: 5, hardening: 1 });
    ai.resumePatrol();
    expect(ai.state).toBe(AIState.Unaware);
  });
});

describe('the escalation drill (Lock §17)', () => {
  it('LAW: ANNOUNCE → POSTURE → FIRE, never fires early', () => {
    const ai = new WardenAI(LINE_WARDEN);
    ai.perceive({ kind: 'sight', x: 0, z: 0, strength: 1 });
    expect(ai.drillStage).toBe(DrillStage.Announce);
    expect(ai.canFire).toBe(false);
    tickFor(ai, LINE_WARDEN.announceS - 0.1, true);
    expect(ai.canFire).toBe(false);
    tickFor(ai, 0.2, true);
    expect(ai.drillStage).toBe(DrillStage.Posture);
    expect(ai.canFire).toBe(false);
    tickFor(ai, LINE_WARDEN.postureS + 0.1, true);
    expect(ai.canFire).toBe(true);
  });

  it('LAW: the ONLY drill skip is being fired upon', () => {
    const ai = new WardenAI(LINE_WARDEN);
    ai.perceive({ kind: 'attacked', x: 0, z: 0 });
    expect(ai.state).toBe(AIState.Engaged);
    expect(ai.canFire).toBe(true); // no announce, no posture — the player chose this
  });

  it('re-acquisition re-runs from POSTURE (they already announced)', () => {
    const ai = new WardenAI(LINE_WARDEN);
    ai.perceive({ kind: 'sight', x: 0, z: 0, strength: 1 });
    tickFor(ai, 3, true);
    tickFor(ai, 0.2, false); // lose
    expect(ai.state).toBe(AIState.Searching);
    ai.tick(DT, true);       // re-acquire
    expect(ai.drillStage).toBe(DrillStage.Posture);
    expect(ai.canFire).toBe(false);
  });
});

describe('the radio actor (Book X §21.5 — information moves physically)', () => {
  it('a completed call propagates; squad-mates escalate to Searching', () => {
    const ai = new WardenAI(LINE_WARDEN);
    ai.perceive({ kind: 'sight', x: 3, z: 3, strength: 1 });
    tickFor(ai, RadioCall.DURATION_S + 0.1, true);
    expect(ai.radio!.tick(DT)).toBe('propagated');

    const mate = new WardenAI(LINE_WARDEN);
    mate.perceive({ kind: 'radio', x: 3, z: 3 });
    expect(mate.state).toBe(AIState.Searching);
  });

  it('LAW: an interrupted call propagates NOTHING', () => {
    const ai = new WardenAI(LINE_WARDEN);
    ai.perceive({ kind: 'sight', x: 3, z: 3, strength: 1 });
    tickFor(ai, 0.5, true);          // mid-call
    expect(ai.radio!.audible).toBe(true);
    ai.radio!.interrupt();           // the player silenced it
    tickFor(ai, 3, true);
    expect(ai.radio!.tick(DT)).toBe('silenced');
  });
});

describe('Warden First Class — the elite is doctrine, not a palette swap (Book VII §5)', () => {
  it('shorter announce: the veteran stops talking', () => {
    expect(FIRST_CLASS.announceS).toBeLessThan(LINE_WARDEN.announceS);
  });

  it('bait refusal: the veteran does not walk to noises', () => {
    const elite = new WardenAI(FIRST_CLASS);
    elite.perceive({ kind: 'sound', x: 10, z: 0 });
    expect(elite.state).toBe(AIState.Unaware);
    expect(elite.baitRefusals).toBe(1); // the squad layer sends a junior instead
  });

  it('no Hesitation state exists pre-Ch.6 (Book VII §9.6 — absent by construction)', () => {
    const elite = new WardenAI(FIRST_CLASS) as unknown as Record<string, unknown>;
    expect(elite['hesitation']).toBeUndefined();
  });
});
