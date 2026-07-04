/**
 * THE TIMING-TABLE TEST (Sprint 002 Z2/B2) — the feel canon, automated.
 * Runs on every PR (CI law, Book X §16). A failure here is an S2 bug.
 */
import { describe, it, expect } from 'vitest';
import { Locomotion, type MoveInput } from './locomotion';
import { LOCOMOTION } from '../../data/locomotion';

const DT = 1 / 240; // fine step for timing accuracy

function run(loco: Locomotion, input: Partial<MoveInput>, seconds: number) {
  const full: MoveInput = { move: 0, sprint: false, crouch: false, jump: false, ...input };
  let last = loco.tick(DT, full);
  for (let t = DT; t < seconds; t += DT) last = loco.tick(DT, full);
  return last;
}

describe('locomotion timing table (Book V §2.15)', () => {
  it('reaches walk speed 1.5 m/s', () => {
    const s = run(new Locomotion(), { move: 0.5 }, 1);
    expect(s.state).toBe('walk');
    expect(s.speed).toBeCloseTo(LOCOMOTION.speeds.walk, 1);
  });

  it('reaches run speed 3.4 m/s', () => {
    const s = run(new Locomotion(), { move: 1 }, 1);
    expect(s.state).toBe('run');
    expect(s.speed).toBeCloseTo(LOCOMOTION.speeds.run, 1);
  });

  it('reaches sprint speed 5.2 m/s and FOV 74', () => {
    const s = run(new Locomotion(), { move: 1, sprint: true }, 1);
    expect(s.state).toBe('sprint');
    expect(s.speed).toBeCloseTo(LOCOMOTION.speeds.sprint, 1);
    expect(s.fov).toBe(74);
  });

  it('crouch moves at 0.8 m/s with -70% noise', () => {
    const s = run(new Locomotion(), { move: 1, crouch: true }, 1);
    expect(s.speed).toBeCloseTo(LOCOMOTION.speeds.crouch, 1);
    expect(s.noise).toBeCloseTo(0.3, 5);
  });

  it('accelerates to full inside ~accelTime (0.25 s) and stops inside ~decelTime (0.3 s)', () => {
    const loco = new Locomotion();
    const atAccel = run(loco, { move: 1 }, LOCOMOTION.accelTime + 0.02);
    expect(atAccel.speed).toBeGreaterThanOrEqual(LOCOMOTION.speeds.run * 0.98);
    const stopped = run(loco, { move: 0 }, LOCOMOTION.decelTime + 0.02);
    expect(stopped.speed).toBeLessThanOrEqual(0.05);
  });

  it('sprint burns the full bar in 12 s and burnout falls to run', () => {
    const loco = new Locomotion();
    const nearEnd = run(loco, { move: 1, sprint: true }, 11.9);
    expect(nearEnd.state).toBe('sprint');
    expect(nearEnd.stamina).toBeLessThan(0.02);
    const after = run(loco, { move: 1, sprint: true }, 0.3);
    expect(after.state).toBe('run'); // never gates walking/aiming — only sprint
  });

  it('stamina regens fully in ~8 s walking and ~5 s idle', () => {
    const a = new Locomotion();
    run(a, { move: 1, sprint: true }, 12.2); // empty the bar
    const walked = run(a, { move: 0.5 }, LOCOMOTION.sprint.regenWalkS + 0.1);
    expect(walked.stamina).toBeGreaterThanOrEqual(0.99);

    const b = new Locomotion();
    run(b, { move: 1, sprint: true }, 12.2);
    const idled = run(b, { move: 0 }, LOCOMOTION.sprint.regenIdleS + 0.1);
    expect(idled.stamina).toBeGreaterThanOrEqual(0.99);
  });

  it('LAW: sprint blocks fire, and exit-to-fire holds 0.35 s after leaving sprint', () => {
    const loco = new Locomotion();
    const sprinting = run(loco, { move: 1, sprint: true }, 1);
    expect(sprinting.canFire).toBe(false);
    const justExited = run(loco, { move: 1 }, LOCOMOTION.sprint.exitToFireS - 0.1);
    expect(justExited.canFire).toBe(false);
    const ready = run(loco, { move: 1 }, 0.2);
    expect(ready.canFire).toBe(true);
  });

  it('jump preloads 0.15 s then launches at v=sqrt(2gh) for 0.5 m', () => {
    const loco = new Locomotion();
    expect(loco.requestJump()).toBe(true);
    run(loco, { move: 0 }, LOCOMOTION.jump.preloadS + 0.02);
    const expectedV = Math.sqrt(2 * 9.81 * LOCOMOTION.jump.heightM);
    expect(loco.vy).toBeGreaterThan(expectedV * 0.9);
    expect(loco.requestJump()).toBe(false); // airborne refuses
  });

  it('landing classes: ≤3 m settles 0.2 s; 3–5 m settles 0.6 s and costs 25% stamina', () => {
    const a = new Locomotion();
    a.land(2.5);
    expect(run(a, { move: 0 }, DT).settle).toBeCloseTo(LOCOMOTION.landing.settleSafeS, 1);

    const b = new Locomotion();
    b.land(4.2);
    const s = run(b, { move: 0 }, DT);
    expect(s.settle).toBeCloseTo(LOCOMOTION.landing.settleHeavyS, 1);
    expect(s.stamina).toBeLessThanOrEqual(0.76);
  });

  it('crouch refuses jump (Book V: nothing in the Republic bounces)', () => {
    const loco = new Locomotion();
    run(loco, { move: 0, crouch: true }, 0.1);
    expect(loco.requestJump()).toBe(false);
  });
});
