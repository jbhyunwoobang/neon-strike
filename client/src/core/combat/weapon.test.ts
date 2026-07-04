/** Weapon framework tests (Sprint 002 W1/W2) — timings, burst law, staged reload. */
import { describe, it, expect } from 'vitest';
import { Weapon, type WeaponEvent } from './weapon';
import { C9 } from '../../data/weapons/c9';

const DT = 1 / 240;
function tickFor(w: Weapon, seconds: number) {
  for (let t = 0; t < seconds; t += DT) w.tick(DT);
}
function drawn(reserve = 72): { w: Weapon; events: WeaponEvent[] } {
  const w = new Weapon(C9, reserve);
  const events: WeaponEvent[] = [];
  w.on((e) => events.push(e));
  w.draw();
  tickFor(w, C9.drawS + 0.02);
  return { w, events };
}

describe('C-9 weapon state machine (Book V §4.2)', () => {
  it('draws in 1.0 s (±10% canon band asserted at data edge)', () => {
    const w = new Weapon(C9);
    w.draw();
    tickFor(w, C9.drawS - 0.05);
    expect(w.state).toBe('drawing');
    tickFor(w, 0.1);
    expect(w.state).toBe('ready');
  });

  it('LAW: fire modes are semi and burst2 only — full-auto does not exist', () => {
    expect(C9.fireModes).toEqual(['semi', 'burst2']);
    // @ts-expect-error — 'auto' is not a representable fire mode
    const illegal: (typeof C9.fireModes)[number] = 'auto';
    void illegal;
  });

  it('semi fires one round per trigger; burst2 fires exactly two', () => {
    const { w, events } = drawn();
    expect(w.mode).toBe('semi');
    w.trigger(true);
    tickFor(w, 0.05);
    expect(events.filter((e) => e.type === 'fire').length).toBe(1);

    w.toggleMode();
    expect(w.mode).toBe('burst2');
    tickFor(w, C9.cycleS); // let the cycle clear
    w.trigger(true);
    tickFor(w, C9.burstIntervalS * 2 + 0.05);
    expect(events.filter((e) => e.type === 'fire').length).toBe(3);
  });

  it('LAW: the locomotion gate blocks fire (sprint / exit-to-fire)', () => {
    const { w, events } = drawn();
    expect(w.trigger(false)).toBe(false);
    tickFor(w, 0.1);
    expect(events.filter((e) => e.type === 'fire').length).toBe(0);
  });

  it('tactical reload completes in 2.4 s; empty reload in 3.2 s', () => {
    const { w } = drawn();
    w.mag = 10;
    w.reload();
    tickFor(w, 2.4 - 0.05);
    expect(w.state).toBe('reloading');
    tickFor(w, 0.1);
    expect(w.state).toBe('ready');
    expect(w.mag + (w.chambered ? 1 : 0)).toBeGreaterThanOrEqual(24);

    const { w: e } = drawn();
    e.mag = 0; e.chambered = false;
    e.reload();
    tickFor(e, 3.2 - 0.05);
    expect(e.state).toBe('reloading');
    tickFor(e, 0.1);
    expect(e.state).toBe('ready');
    expect(e.chambered).toBe(true);
  });

  it('LAW: interruption preserves completed stages — the half-fed tube stays fed', () => {
    const { w, events } = drawn();
    w.mag = 4;
    const reserveBefore = w.reserve;
    w.reload();
    // Complete eject (0.8) + feed (1.0) = 1.8 s, then interrupt mid-chamber.
    tickFor(w, 1.9);
    w.interrupt();
    expect(w.state).toBe('ready');
    // Feed completed → magazine already swapped.
    expect(w.mag).toBe(C9.magazine);
    expect(w.reserve).toBe(reserveBefore - (C9.magazine - 4));
    // Resuming runs ONLY the remaining stage(s): chamber (0.6 s), not 2.4 s.
    const stagesBefore = events.filter((e) => e.type === 'stage').length;
    w.reload();
    tickFor(w, 0.65);
    expect(w.state).toBe('ready');
    const stagesAfter = events.filter((e) => e.type === 'stage').length;
    expect(stagesAfter - stagesBefore).toBe(1);
  });

  it('dry fire emits dry, never fire', () => {
    const { w, events } = drawn(0);
    w.mag = 0; w.chambered = false;
    w.trigger(true);
    tickFor(w, 0.1);
    expect(events.some((e) => e.type === 'dry')).toBe(true);
    expect(events.filter((e) => e.type === 'fire').length).toBe(0);
  });

  it('spread cone: crouch tightens (×0.85), movement loosens (×1.6)', () => {
    const w = new Weapon(C9);
    const base = w.cone({ crouched: false, moving: false });
    expect(base).toBeCloseTo(C9.baseConeDeg, 5);
    expect(w.cone({ crouched: true, moving: false })).toBeLessThan(base);
    expect(w.cone({ crouched: false, moving: true })).toBeGreaterThan(base);
  });

  it('magazine accounting is honest: 24 in the mag + 1 chambered maximum', () => {
    const { w } = drawn();
    let fired = 0;
    w.on((e) => { if (e.type === 'fire') fired++; });
    for (let i = 0; i < 30; i++) {
      w.trigger(true);
      tickFor(w, C9.cycleS + 0.02);
    }
    expect(fired).toBe(C9.magazine + 1); // 24 + the chambered round
  });
});
