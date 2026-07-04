/**
 * core/save/save.ts — the versioned-chunk save foundation (Sprint 002 Z6 / Book X §10).
 *
 * Architecture: snapshot-composed — each system serializes its own versioned
 * chunk {id, version, blob}; the composer adds a header (build, level,
 * playtime, slot meta). LAWS:
 *  - Per-chunk versioning with registered migrations (forward tolerance:
 *    unknown chunks are PRESERVED, never dropped).
 *  - Corruption never boot-loops: a bad slot rolls back to the last valid
 *    snapshot; a bad chunk falls back to that system's defaults.
 *  - Storage is an adapter (memory for tests, localStorage/IndexedDB in the
 *    browser lane, platform saves in the UE5 mirror) — the RULES layer never
 *    touches the DOM.
 */

export interface SaveChunk {
  id: string;
  version: number;
  blob: unknown;
}

export interface SaveHeader {
  build: string;
  level: string;
  playtimeS: number;
  savedAt: number;
  /** Journal-page slot art reference (the GN splash law, Book V §13.1). */
  splash?: string;
}

export interface Snapshot {
  header: SaveHeader;
  chunks: SaveChunk[];
}

export interface StorageAdapter {
  read(key: string): Promise<string | null>;
  write(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
}

/** In-memory adapter (tests, headless). */
export class MemoryStorage implements StorageAdapter {
  private m = new Map<string, string>();
  async read(k: string) { return this.m.get(k) ?? null; }
  async write(k: string, v: string) { this.m.set(k, v); }
  async remove(k: string) { this.m.delete(k); }
}

/** Browser adapter — localStorage v1 (IndexedDB upgrade is a drop-in swap). */
export class LocalStorage implements StorageAdapter {
  async read(k: string) { try { return localStorage.getItem(k); } catch { return null; } }
  async write(k: string, v: string) { try { localStorage.setItem(k, v); } catch { /* quota/private */ } }
  async remove(k: string) { try { localStorage.removeItem(k); } catch { /* ok */ } }
}

type Provider = { version: number; capture(): unknown; restore(blob: unknown): void };
type Migration = (old: unknown, fromVersion: number) => unknown;

export class SaveSystem {
  private providers = new Map<string, Provider>();
  private migrations = new Map<string, Migration>();
  private storage: StorageAdapter;
  private build: string;

  constructor(storage: StorageAdapter, build = 'dev') {
    this.storage = storage;
    this.build = build;
  }

  /** Systems register once; capture/restore are theirs (composer owns nothing). */
  register(id: string, provider: Provider, migrate?: Migration) {
    this.providers.set(id, provider);
    if (migrate) this.migrations.set(id, migrate);
  }

  compose(level: string, playtimeS: number, splash?: string): Snapshot {
    const chunks: SaveChunk[] = [];
    for (const [id, p] of this.providers) {
      chunks.push({ id, version: p.version, blob: p.capture() });
    }
    return {
      header: { build: this.build, level, playtimeS, savedAt: Date.now(), splash },
      chunks,
    };
  }

  /**
   * Apply a snapshot. Unknown chunks are preserved on re-save (forward
   * tolerance); version-mismatched chunks run their migration or fall back to
   * defaults (restore is skipped, never crashed).
   */
  apply(snap: Snapshot): { restored: string[]; migrated: string[]; skipped: string[]; preserved: SaveChunk[] } {
    const restored: string[] = [];
    const migrated: string[] = [];
    const skipped: string[] = [];
    const preserved: SaveChunk[] = [];
    for (const chunk of snap.chunks) {
      const p = this.providers.get(chunk.id);
      if (!p) { preserved.push(chunk); continue; }
      let blob = chunk.blob;
      if (chunk.version !== p.version) {
        const m = this.migrations.get(chunk.id);
        if (m) {
          try { blob = m(blob, chunk.version); migrated.push(chunk.id); }
          catch { skipped.push(chunk.id); continue; }
        } else { skipped.push(chunk.id); continue; }
      }
      try { p.restore(blob); restored.push(chunk.id); }
      catch { skipped.push(chunk.id); }
    }
    this.pendingPreserved = preserved;
    return { restored, migrated, skipped, preserved };
  }

  private pendingPreserved: SaveChunk[] = [];

  async save(slot: string, level: string, playtimeS: number, splash?: string): Promise<void> {
    const snap = this.compose(level, playtimeS, splash);
    // Forward tolerance: carry chunks we didn't understand from the last load.
    snap.chunks.push(...this.pendingPreserved.filter((c) => !this.providers.has(c.id)));
    const key = `eoe:save:${slot}`;
    const prev = await this.storage.read(key);
    if (prev) await this.storage.write(`${key}:prev`, prev); // rollback shadow
    await this.storage.write(key, JSON.stringify(snap));
  }

  /**
   * Load with rollback: a corrupt slot falls back to its shadow; a corrupt
   * shadow returns null (fresh start) — never a boot-loop (LAW).
   */
  async load(slot: string): Promise<Snapshot | null> {
    const key = `eoe:save:${slot}`;
    for (const k of [key, `${key}:prev`]) {
      const raw = await this.storage.read(k);
      if (!raw) continue;
      try {
        const snap = JSON.parse(raw) as Snapshot;
        if (!snap.header || !Array.isArray(snap.chunks)) throw new Error('shape');
        if (k !== key) await this.storage.write(key, raw); // promote shadow
        return snap;
      } catch {
        await this.storage.remove(k); // quarantine the corrupt entry
      }
    }
    return null;
  }

  async listSlots(slots: string[]): Promise<Array<{ slot: string; header: SaveHeader } | null>> {
    const out: Array<{ slot: string; header: SaveHeader } | null> = [];
    for (const s of slots) {
      const snap = await this.load(s);
      out.push(snap ? { slot: s, header: snap.header } : null);
    }
    return out;
  }
}
