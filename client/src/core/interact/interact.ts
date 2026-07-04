/**
 * core/interact/interact.ts — the universal interaction framework (S001 C1 / S003 P1).
 *
 * RULES layer. One interface for doors, levers, documents, pickups, benches,
 * and every future verb. LAWS:
 *  - Press vs HOLD is authored data per interaction — input duration is the
 *    moral grammar (the permit prompt is two presses; the governor is ten
 *    seconds; a lore slip is a press; planting is a hold) [Book V §2.11].
 *  - Holds are interruptible and honest: releasing resets progress (no
 *    banked half-holds); progress is exposed for the prompt chip.
 *  - No interaction wheel, no world-space icons — the PROMPT text is data;
 *    presentation belongs to the UI layer [LAW 2-A].
 */

export interface InteractableDef {
  id: string;
  /** Prompt text, e.g. "READ" / "START THE GREEN UNIT". UI adds the key glyph. */
  prompt: string;
  mode: 'press' | 'hold';
  /** Required hold duration (mode 'hold'). Authored content, versioned. */
  holdS?: number;
  /** One-shot interactions latch after firing (documents stay re-readable: false). */
  once?: boolean;
}

export interface InteractSample {
  /** The focused interactable's prompt, or null. */
  prompt: string | null;
  mode: 'press' | 'hold' | null;
  /** Hold progress 0..1 for the focused hold (0 for press mode). */
  progress: number;
  /** Fired ids this tick. */
  fired: string[];
}

interface Entry {
  def: InteractableDef;
  onFire: () => void;
  spent: boolean;
}

export class InteractionSystem {
  private entries = new Map<string, Entry>();
  private focusId: string | null = null;
  private holdT = 0;
  private pressLatch = false;

  register(def: InteractableDef, onFire: () => void): void {
    this.entries.set(def.id, { def, onFire, spent: false });
  }

  remove(id: string): void {
    this.entries.delete(id);
    if (this.focusId === id) { this.focusId = null; this.holdT = 0; }
  }

  /** Content layer decides focus (raycast/distance are its business). */
  setFocus(id: string | null): void {
    if (id !== this.focusId) { this.focusId = id; this.holdT = 0; this.pressLatch = false; }
  }

  /** Reset a once-latch (e.g. a lever that re-arms after the world changes). */
  rearm(id: string): void {
    const e = this.entries.get(id);
    if (e) e.spent = false;
  }

  tick(dt: number, wantInteract: boolean): InteractSample {
    const fired: string[] = [];
    const e = this.focusId ? this.entries.get(this.focusId) : undefined;

    if (!e || (e.def.once && e.spent)) {
      this.holdT = 0;
      if (!wantInteract) this.pressLatch = false;
      return { prompt: null, mode: null, progress: 0, fired };
    }

    if (e.def.mode === 'press') {
      if (wantInteract && !this.pressLatch) {
        this.pressLatch = true;
        e.spent = true;
        e.onFire();
        fired.push(e.def.id);
      }
      if (!wantInteract) this.pressLatch = false;
      return { prompt: e.def.prompt, mode: 'press', progress: 0, fired };
    }

    // hold mode: honest progress — release resets (no banked half-holds LAW).
    const need = e.def.holdS ?? 1;
    if (wantInteract) {
      this.holdT += dt;
      if (this.holdT >= need) {
        this.holdT = 0;
        e.spent = true;
        e.onFire();
        fired.push(e.def.id);
      }
    } else {
      this.holdT = 0;
    }
    return { prompt: e.def.prompt, mode: 'hold', progress: Math.min(1, this.holdT / need), fired };
  }
}
