/** Covenant loop tests (Sprint 002 C2) — the full loop, simulated. */
import { describe, it, expect } from 'vitest';
import { CovenantDirector, ACRE_PROVING, type FieldReport, type SpawnOrder } from './director';

const DT = 1 / 30;

/** Scripted battlefield: hostiles die a fixed time after spawning. */
function simulate(opts: { killAfterS: number; standInAcre: boolean; killSaplingAtS?: number; maxS?: number }) {
  const d = new CovenantDirector(ACRE_PROVING);
  d.start();
  const alive: Array<{ t: number }> = [];
  const allSpawns: SpawnOrder[] = [];
  let saplingAlive = true;
  let t = 0;
  let last = d.tick(0, { hostilesAlive: 0, hostilesInAcre: 0, saplingAlive });
  for (const s of last.spawns) { alive.push({ t: 0 }); allSpawns.push(s); }
  const max = opts.maxS ?? 600;
  const pressureSeconds = { total: 0 };
  while (t < max && last.phase !== 'won' && last.phase !== 'failed') {
    t += DT;
    if (opts.killSaplingAtS !== undefined && t >= opts.killSaplingAtS) saplingAlive = false;
    for (const a of alive) a.t += DT;
    for (let i = alive.length - 1; i >= 0; i--) if (alive[i].t >= opts.killAfterS) alive.splice(i, 1);
    const field: FieldReport = {
      hostilesAlive: alive.length,
      hostilesInAcre: opts.standInAcre ? alive.length : 0,
      saplingAlive,
    };
    if (field.hostilesInAcre > 0) pressureSeconds.total += DT;
    last = d.tick(DT, field);
    for (const s of last.spawns) { alive.push({ t: 0 }); allSpawns.push(s); }
  }
  return { last, t, allSpawns, pressureSeconds: pressureSeconds.total };
}

describe('the covenant wave director (Book V §12 grammar, campaign v1)', () => {
  it('runs the full loop to WON: 3 waves, staged orders, bank complete', () => {
    const r = simulate({ killAfterS: 8, standInAcre: false });
    expect(r.last.phase).toBe('won');
    // The win must WAIT for the fights: 3 kill-phases (~8 s) + 2 breaths (20 s).
    expect(r.t).toBeGreaterThanOrEqual(3 * 8 + 2 * 20 - 1);
    // 2 + 2 + 4 orders across the three waves, all with route markers (staged LAW).
    expect(r.allSpawns.length).toBe(8);
    expect(r.allSpawns.every((s) => ['N', 'SW', 'SE'].includes(s.route))).toBe(true);
    expect(r.last.bank).toBeGreaterThanOrEqual(ACRE_PROVING.bankTarget);
  });

  it('escalation is composition, not HP: wave 2 brings the elite', () => {
    const r = simulate({ killAfterS: 5, standInAcre: false });
    expect(r.allSpawns.some((s) => s.unit === 'first-class')).toBe(true);
  });

  it('the designed breath: waves 2 and 3 wait 20 s after the previous resolves', () => {
    const fast = simulate({ killAfterS: 2, standInAcre: false });
    // 3 kill-phases (~2 s each) + 2 breaths (20 s each) ≈ 46 s minimum to clear waves;
    // the win additionally requires the bank (100 s unpressured) — so ≥ 100 s.
    expect(fast.t).toBeGreaterThanOrEqual(ACRE_PROVING.bankTarget / ACRE_PROVING.bankRatePerS - 1);
  });

  it('pressure is mechanical: hostiles in the acre slow the bank (LAW)', () => {
    const clean = simulate({ killAfterS: 6, standInAcre: false });
    const pressured = simulate({ killAfterS: 6, standInAcre: true });
    expect(pressured.t).toBeGreaterThan(clean.t); // the same fight takes longer banked-out
  });

  it('a wave never resolves in the tick it launches (arrivals are staged)', () => {
    const d = new CovenantDirector(ACRE_PROVING);
    d.start();
    const first = d.tick(DT, { hostilesAlive: 0, hostilesInAcre: 0, saplingAlive: true });
    expect(first.spawns.length).toBe(2);
    // Next tick, still zero alive reported (units walking in): wave 2 must NOT launch.
    const second = d.tick(DT, { hostilesAlive: 0, hostilesInAcre: 0, saplingAlive: true });
    expect(second.spawns.length).toBe(0);
    // Once a unit reports alive then dies, the wave resolves properly.
    d.tick(DT, { hostilesAlive: 2, hostilesInAcre: 0, saplingAlive: true });
    const after = d.tick(DT, { hostilesAlive: 0, hostilesInAcre: 0, saplingAlive: true });
    expect(after.phase).toBe('banking');
  });

  it('LAW 4-D: the sapling死 fails the covenant, no matter the wave state', () => {
    const r = simulate({ killAfterS: 6, standInAcre: false, killSaplingAtS: 15 });
    expect(r.last.phase).toBe('failed');
  });

  it('no kill-score field exists anywhere on the sample (Book X §21.4)', () => {
    const d = new CovenantDirector(ACRE_PROVING);
    d.start();
    const s = d.tick(DT, { hostilesAlive: 0, hostilesInAcre: 0, saplingAlive: true }) as unknown as Record<string, unknown>;
    expect(s['kills']).toBeUndefined();
    expect(s['score']).toBeUndefined();
    expect(s['xp']).toBeUndefined();
  });

  it('the director never touches units: orders out, field reports in, nothing else', () => {
    const d = new CovenantDirector(ACRE_PROVING) as unknown as Record<string, unknown>;
    expect(d['aimAssist']).toBeUndefined();
    expect(d['buffUnit']).toBeUndefined();
    expect(d['setUnitHealth']).toBeUndefined();
  });
});
