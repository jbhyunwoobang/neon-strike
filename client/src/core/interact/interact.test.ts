/** Interaction framework tests (S003 P1) — press/hold grammar, latches, honesty. */
import { describe, it, expect } from 'vitest';
import { InteractionSystem } from './interact';

const DT = 1 / 60;
function hold(sys: InteractionSystem, seconds: number, want = true) {
  let s = sys.tick(0, want);
  for (let t = 0; t < seconds; t += DT) s = sys.tick(DT, want);
  return s;
}

describe('the universal interaction framework (Book V §2.11)', () => {
  it('press fires exactly once per press (latch until release)', () => {
    const sys = new InteractionSystem();
    let fires = 0;
    sys.register({ id: 'slip', prompt: 'READ', mode: 'press' }, () => fires++);
    sys.setFocus('slip');
    hold(sys, 0.5, true);        // held down — still one fire
    expect(fires).toBe(1);
    hold(sys, 0.1, false);       // release
    hold(sys, 0.1, true);        // press again
    expect(fires).toBe(2);
  });

  it('LAW: holds are honest — release resets progress, no banked half-holds', () => {
    const sys = new InteractionSystem();
    let fires = 0;
    sys.register({ id: 'plant', prompt: 'START THE GREEN UNIT', mode: 'hold', holdS: 1.5 }, () => fires++);
    sys.setFocus('plant');
    const mid = hold(sys, 1.0, true);
    expect(mid.progress).toBeGreaterThan(0.5);
    expect(fires).toBe(0);
    hold(sys, 0.1, false);                        // release at 1.0s
    const restart = sys.tick(DT, true);
    expect(restart.progress).toBeLessThan(0.1);   // reset, not banked
    hold(sys, 1.6, true);
    expect(fires).toBe(1);
  });

  it('once-latch spends; rearm() restores; documents (once:false) re-fire', () => {
    const sys = new InteractionSystem();
    let lever = 0, reads = 0;
    sys.register({ id: 'lever', prompt: 'THROW', mode: 'press', once: true }, () => lever++);
    sys.register({ id: 'doc', prompt: 'READ', mode: 'press' }, () => reads++);

    sys.setFocus('lever');
    hold(sys, 0.1, true); hold(sys, 0.1, false); hold(sys, 0.1, true);
    expect(lever).toBe(1);                       // spent — second press ignored
    expect(sys.tick(DT, false).prompt).toBeNull(); // spent once = no prompt
    sys.rearm('lever');
    hold(sys, 0.1, false); hold(sys, 0.1, true);
    expect(lever).toBe(2);

    sys.setFocus('doc');
    hold(sys, 0.1, false); hold(sys, 0.1, true);
    hold(sys, 0.1, false); hold(sys, 0.1, true);
    expect(reads).toBe(2);                       // re-readable
  });

  it('focus change resets hold progress and press latch', () => {
    const sys = new InteractionSystem();
    let fires = 0;
    sys.register({ id: 'a', prompt: 'A', mode: 'hold', holdS: 1 }, () => fires++);
    sys.register({ id: 'b', prompt: 'B', mode: 'hold', holdS: 1 }, () => fires++);
    sys.setFocus('a');
    hold(sys, 0.8, true);
    sys.setFocus('b');                           // walked to another target mid-hold
    const s = sys.tick(DT, true);
    expect(s.progress).toBeLessThan(0.1);
    expect(fires).toBe(0);
  });

  it('no focus → no prompt, no fires (the system never invents targets)', () => {
    const sys = new InteractionSystem();
    sys.register({ id: 'x', prompt: 'X', mode: 'press' }, () => { throw new Error('must not fire'); });
    const s = hold(sys, 0.5, true);
    expect(s.prompt).toBeNull();
    expect(s.fired.length).toBe(0);
  });
});
