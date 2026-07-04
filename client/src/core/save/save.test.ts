/** Save foundation tests (Sprint 002 Z6 / Book X §10) — versioning, rollback, tolerance. */
import { describe, it, expect } from 'vitest';
import { SaveSystem, MemoryStorage, type Snapshot } from './save';

function makeSystem(state: { vitals: { breath: number }; ledger: string[] }) {
  const storage = new MemoryStorage();
  const sys = new SaveSystem(storage, 'test-build');
  sys.register('vitals', {
    version: 1,
    capture: () => ({ ...state.vitals }),
    restore: (b) => { state.vitals = { ...(b as { breath: number }) }; },
  });
  sys.register('ledger', {
    version: 1,
    capture: () => [...state.ledger],
    restore: (b) => { state.ledger = [...(b as string[])]; },
  });
  return { storage, sys, state };
}

describe('versioned-chunk save system (Book X §10)', () => {
  it('round-trips a snapshot through storage', async () => {
    const a = makeSystem({ vitals: { breath: 75 }, ledger: ['cordon@acre'] });
    await a.sys.save('slot1', 'ACRE_PROVING', 123);

    const b = makeSystem({ vitals: { breath: 100 }, ledger: [] });
    // Share the storage (same "disk").
    const snap = await a.sys.load('slot1');
    expect(snap).not.toBeNull();
    const result = b.sys.apply(snap!);
    expect(result.restored.sort()).toEqual(['ledger', 'vitals']);
    expect(b.state.vitals.breath).toBe(75);
    expect(b.state.ledger).toEqual(['cordon@acre']);
    expect(snap!.header.build).toBe('test-build');
    expect(snap!.header.level).toBe('ACRE_PROVING');
  });

  it('migrates old chunk versions through registered migrations', () => {
    const state = { vitals: { breath: 0 }, ledger: [] as string[] };
    const storage = new MemoryStorage();
    const sys = new SaveSystem(storage);
    sys.register(
      'vitals',
      {
        version: 2,
        capture: () => state.vitals,
        restore: (b) => { state.vitals = b as { breath: number }; },
      },
      // v1 stored `hp`; v2 stores `breath` — the migration renames.
      (old, from) => (from === 1 ? { breath: (old as { hp: number }).hp } : old),
    );
    const snap: Snapshot = {
      header: { build: 'x', level: 'L', playtimeS: 0, savedAt: 0 },
      chunks: [{ id: 'vitals', version: 1, blob: { hp: 50 } }],
    };
    const r = sys.apply(snap);
    expect(r.migrated).toContain('vitals');
    expect(state.vitals.breath).toBe(50);
  });

  it('LAW: version mismatch without migration skips to defaults, never crashes', () => {
    const state = { vitals: { breath: 100 }, ledger: [] as string[] };
    const storage = new MemoryStorage();
    const sys = new SaveSystem(storage);
    sys.register('vitals', {
      version: 3,
      capture: () => state.vitals,
      restore: (b) => { state.vitals = b as { breath: number }; },
    });
    const snap: Snapshot = {
      header: { build: 'x', level: 'L', playtimeS: 0, savedAt: 0 },
      chunks: [{ id: 'vitals', version: 1, blob: { ancient: true } }],
    };
    const r = sys.apply(snap);
    expect(r.skipped).toContain('vitals');
    expect(state.vitals.breath).toBe(100); // defaults kept
  });

  it('LAW: forward tolerance — unknown chunks survive a load→save cycle', async () => {
    const { storage, sys } = makeSystem({ vitals: { breath: 90 }, ledger: [] });
    const future: Snapshot = {
      header: { build: 'future', level: 'CH09', playtimeS: 9, savedAt: 1 },
      chunks: [
        { id: 'vitals', version: 1, blob: { breath: 60 } },
        { id: 'gn-pages', version: 7, blob: { seen: ['GN-1'] } }, // from a newer build
      ],
    };
    await storage.write('eoe:save:s', JSON.stringify(future));
    const snap = await sys.load('s');
    const r = sys.apply(snap!);
    expect(r.preserved.map((c) => c.id)).toContain('gn-pages');
    await sys.save('s', 'ACRE', 10);
    const resaved = JSON.parse((await storage.read('eoe:save:s'))!) as Snapshot;
    expect(resaved.chunks.some((c) => c.id === 'gn-pages')).toBe(true);
  });

  it('LAW: corruption rolls back to the shadow, then to fresh — never a boot-loop', async () => {
    const { storage, sys } = makeSystem({ vitals: { breath: 40 }, ledger: ['a'] });
    await sys.save('s', 'L1', 1);   // good save #1 (no shadow yet)
    await sys.save('s', 'L2', 2);   // good save #2 (#1 becomes the shadow)
    await storage.write('eoe:save:s', '{corrupt!!!');
    const snap = await sys.load('s');
    expect(snap).not.toBeNull();
    expect(snap!.header.level).toBe('L1'); // the shadow promoted
    // Corrupt both → fresh start, quarantined, no throw.
    await storage.write('eoe:save:s', 'x');
    await storage.write('eoe:save:s:prev', 'y');
    const gone = await sys.load('s');
    expect(gone).toBeNull();
  });

  it('slot listing returns headers without applying state', async () => {
    const { sys, state } = makeSystem({ vitals: { breath: 55 }, ledger: [] });
    await sys.save('a', 'ACRE', 100, 'GN-1');
    state.vitals.breath = 99;
    const slots = await sys.listSlots(['a', 'empty']);
    expect(slots[0]?.header.level).toBe('ACRE');
    expect(slots[0]?.header.splash).toBe('GN-1');
    expect(slots[1]).toBeNull();
    expect(state.vitals.breath).toBe(99); // listing never restores
  });
});
