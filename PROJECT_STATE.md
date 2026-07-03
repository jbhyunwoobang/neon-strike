# PROJECT STATE — ECHOES OF EDEN
*Persistent state file. Read at the start of every session; update at the end of every session.
Every implementation response begins with the six-line status header drawn from this file.*

---

## Project identity
- **Title:** ECHOES OF EDEN (working title, from the reference board; alternates on file: *The Long Verdance*, *Stillwood*)
- **Form:** Single-player cinematic story FPS with wave-survival combat, cutscenes, and graphic-novel visual storytelling. Downloadable app.
- **Direction change (2026-07-03):** ALL multiplayer is removed from the design — no PvP, co-op, lobby, rooms, WebSocket networking, servers, or MP UI. The existing multiplayer codebase is legacy; it will be stripped in the first implementation sprint.
- **Reference board (permanent):** `/Users/hyunwoobang/Desktop/Game Project - reference /`
- **Roadmap:** BOOK I–IX (creative bibles) → Sprint 1–4 (implementation) → Vertical Slice.

## Current milestone
**BOOK II.5 — Canon Lock** ✅ complete (creative phase; no gameplay design, no code)

## Completed milestones
- Legacy arcade prototype (NEON STRIKE): engine, 5 maps, 10 weapons, wave AI, effects, audio — retained as tech foundation, multiplayer to be excised.
- Reference board reviewed in full (synopsis, Dr. Beck Grimwood, the Converter, Devastator-3000, Bioharvest Vault, The Sowers, Battle of Steelgate, architecture/typography boards).
- **BOOK I — Universe Bible, Edition One** written → `docs/bible/BOOK-I-UNIVERSE-BIBLE.md`
- **BOOK II — Narrative Bible, Edition One** written → `docs/bible/BOOK-II-NARRATIVE-BIBLE.md`
  (core conflict; Asher/Grimwood full sheets; 4 antagonist readings; 10 supporting cast;
  relationship map; Prologue + 3 acts + Epilogue across 11 chapters; opening 30 min;
  5-rung revelation ladder; the Governor ending; 8 cinematics; 7 GN sequences; boss
  staging; lore system; pacing/dialogue/motifs; 4 choice instruments; 7 sequel threads)
- **BOOK II.5 — Canon Lock Document, Edition One** → `docs/bible/BOOK-II.5-CANON-LOCK.md`
  (22 sections; single source of truth; 9 continuity rulings A–I applied as errata to
  Books I & II inline + footers; every future document loads II.5 first)

## Outstanding blockers
- None creative. (Implementation-phase blocker noted early: multiplayer excision touches App.tsx, Net.ts, server/ — scheduled for Sprint 1, not now.)
- Cinematic key art beyond the board: user offers GPT-Image generation on request — request images when Book VIII (cinematics) needs them.

## Files created
- `PROJECT_STATE.md` (this file)
- `docs/bible/BOOK-I-UNIVERSE-BIBLE.md`
- `docs/bible/BOOK-II-NARRATIVE-BIBLE.md`
- `docs/bible/BOOK-II.5-CANON-LOCK.md`

## Files modified
- (none — creative phase forbids code changes)

## Next implementation target
**BOOK III** (user's roadmap next book — likely Gameplay/Combat Design Bible: wave-defense
canon, Converter weapon modes, enemy roster re-skinned to Wardenry/Devastator fiction).
After Books: Sprint 1 = strip multiplayer + retitle + story scaffold.

## New canon added by BOOK II (binding)
- Halden's Ford: shared hometown of Asher AND Grimwood (Concession III). Grimwood b.2001,
  parish Reckoner's son; 2013 orchard blight = his wound; "planting is sentiment, banking
  is love." Evergreen = a Returning performed on the biosphere; his models say the wild is
  doomed regardless (he is almost right).
- Asher's secret: HIS 2068 permit report reclassified the crew → the D-2 engaged. Mara
  always knew. Mother Enna's unattended Returning (2053; ruling II.5 §21-A) = load-bearing guilt. Daily one
  sentence to the windowsill seedling; first="Still here.", last=same words, new meaning.
- Cast: Cmdr. Edda Harrow (mentor-antagonist, duel Ch.6, survives, plants in epilogue);
  Unit D-2/C3-0881 boss Ch.5; Voss = negotiation not boss (Ch.9 deal refused by walking);
  Coil/Kestrel Ondo (engineer, GN-artist thread); Dr. Ivy Lange (2053 memo); Reckoner Sela
  Immen (dies Ch.6 fire; her Returning = funeral Asher attends); Tomas Verge (architect,
  breach route, disappears); Registrar Oren Pale; Brack Meron (betrays Ch.6 for crew
  amnesty; forgiveness = player choice); Cpl. Dez Arno (spared Ch.3, carries Sela out,
  defects); Noor Estevez (Halden's Ford survivor); June (9, Driftmark, dawn-chorus
  cartridge; owns the final shot).
- Ending: Asher reverses the Evergreen governor — spends the banked reserve into the land;
  one valley regrows; Cadence dark 11 hours (2 deaths, read into court record); Grimwood
  audited & arrested by Voss's Edge, "One valley." / "One more than you were leaving.";
  epilogue = the First Credit; final line "Still here."; one bird 60s into credits.

## Canon quick-reference (from BOOK I)
- Era: 2071. Place: the Meridian Republic (fictionalized N. America).
- verdance (lowercase) = plant bioenergy. The Converter = extraction tool. The Quiet = ecological silencing (official term; "Dimming" deprecated per Book II.5 §21-E).
- Edge Corp: energy monopoly, "Concession" biomes, Wardenry enforcers. Devastator series: siege automata.
- Asher Forester: ex-Warden First Class, prosthetic left hand, defector. The Sowers: replanting resistance.
- Dr. Beck Grimwood: inventor of the Grimwood Cycle (conversion), Edge's chief scientist.
- Central question: **"If survival requires spending the living world, what exactly is being kept alive?"**
