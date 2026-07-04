/** Damage pipeline + vitals tests (Sprint 002 W4–W6). */
import { describe, it, expect } from 'vitest';
import { route, DamageClass, HitZone, PlayerVitals, DRESSING_VERB_S } from './damage';

const DT = 1 / 120;
function tickFor(v: PlayerVitals, seconds: number) {
  let s = v.sample();
  for (let t = 0; t < seconds; t += DT) s = v.tick(DT);
  return s;
}

describe('damage routing (plate arcs, joins, helmets — Book V §3.5/§4.7)', () => {
  it('plate converts to Breath chip with spall — never Binding', () => {
    const r = route({ cls: DamageClass.BallLong, zone: HitZone.PlateArc, base: 20, distanceM: 10 });
    expect(r.binding).toBe(0);
    expect(r.breath).toBeCloseTo(7, 0);
    expect(r.feedback).toContain('spall');
  });

  it('joins route full Binding with the dull thud (the skill target)', () => {
    const r = route({ cls: DamageClass.BallLong, zone: HitZone.Join, base: 20, distanceM: 10 });
    expect(r.binding).toBe(20);
    expect(r.feedback).toContain('thud-join');
  });

  it('helmets deflect ball honestly at range; close ball chips', () => {
    const far = route({ cls: DamageClass.BallLong, zone: HitZone.Helmet, base: 20, distanceM: 30 });
    expect(far.breath + far.binding).toBe(0);
    expect(far.feedback).toContain('deflect');
    const near = route({ cls: DamageClass.BallLong, zone: HitZone.Helmet, base: 20, distanceM: 8 });
    expect(near.breath).toBeGreaterThan(0);
  });

  it('LAW: the anti-personnel-explosive damage class does not exist', () => {
    const all = Object.values(DamageClass) as string[];
    expect(all).not.toContain('explosive');
    expect(all).not.toContain('frag');
    expect(all).not.toContain('anti-personnel');
    // Concussive exists and is never lethal by itself: routes Breath only.
    const r = route({ cls: DamageClass.Concussive, zone: HitZone.Unarmored, base: 30, distanceM: 2 });
    expect(r.binding).toBe(0);
  });
});

describe('the double rule — Breath/Binding vitals (Book V §3.4)', () => {
  it('Breath regens to the CURRENT segment boundary after 5 s out of fire', () => {
    const v = new PlayerVitals();
    v.apply({ breath: 30, binding: 0 }); // 100 → 70 (inside segment 3: boundary 75)
    const before = tickFor(v, 4.5);
    expect(before.breath).toBeCloseTo(70, 0); // still inside the delay
    const after = tickFor(v, 1.0);
    expect(after.breath).toBeCloseTo(75, 0); // boundary, NOT full — breathing, not magic
    const later = tickFor(v, 5);
    expect(later.breath).toBeCloseTo(75, 0); // never past the boundary
  });

  it('Binding loss caps capacity and only dressings restore it', () => {
    const v = new PlayerVitals(1);
    v.apply({ breath: 0, binding: 25 }); // lose one segment
    let s = tickFor(v, 10);
    expect(s.bindingSegments).toBe(3);
    expect(s.breath).toBeLessThanOrEqual(75);
    expect(v.startDressing()).toBe(true);
    s = tickFor(v, DRESSING_VERB_S + 0.1);
    expect(s.bindingSegments).toBe(4);
    expect(v.dressings).toBe(0);
    expect(v.startDressing()).toBe(false); // none left
  });

  it('damage interrupts the dressing verb (interruptible LAW)', () => {
    const v = new PlayerVitals(2);
    v.apply({ breath: 0, binding: 25 });
    tickFor(v, 6);
    v.startDressing();
    tickFor(v, 1.5);
    v.apply({ breath: 5, binding: 0 }); // hit mid-verb
    const s = tickFor(v, DRESSING_VERB_S);
    expect(s.bindingSegments).toBe(3); // verb was cancelled, dressing not consumed
    expect(v.dressings).toBe(2);
  });

  it('segments are constant — no growth API exists on vitals', () => {
    const v = new PlayerVitals() as unknown as Record<string, unknown>;
    expect(v['maxHealth']).toBeUndefined();
    expect(v['setMaxSegments']).toBeUndefined();
    expect(v['xp']).toBeUndefined();
  });

  it('sustained recklessness compounds to death; short fights forgive', () => {
    const v = new PlayerVitals(0);
    for (let i = 0; i < 4; i++) v.apply({ breath: 10, binding: 25 });
    expect(v.dead).toBe(true);
  });
});
