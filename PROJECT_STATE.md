# PROJECT STATE — ECHOES OF EDEN
*Role since 2026-07-03 checkpoint: the CANON-AMENDMENT LEDGER + session-protocol source.
Live production snapshot lives in `CURRENT_PROJECT_STATE.md`; onboarding in `README_FOR_CLAUDE.md`;
history in `CHANGELOG.md`; backlog in `TODO.md`. The six-line status header draws from this file
+ CURRENT_PROJECT_STATE.md.*

---

## Project identity
- **Title:** ECHOES OF EDEN (working title, from the reference board; alternates on file: *The Long Verdance*, *Stillwood*)
- **Form:** Single-player cinematic story FPS with wave-survival combat, cutscenes, and graphic-novel visual storytelling. Downloadable app.
- **Direction change (2026-07-03):** ALL multiplayer is removed from the design — no PvP, co-op, lobby, rooms, WebSocket networking, servers, or MP UI. The existing multiplayer codebase is legacy; it will be stripped in the first implementation sprint.
- **Reference board (permanent):** `/Users/hyunwoobang/Desktop/Game Project - reference /`
- **Roadmap:** BOOK I–IX (creative bibles) → Sprint 1–4 (implementation) → Vertical Slice.

## Current milestone
**BOOK 0 — Master Creative Bible** ✅ complete — THE DAY-1 HANDBOOK
**⚠ LOADING ORDER FOR ALL FUTURE SESSIONS: Book 0 (identity) → Book II.5 Canon Lock
(facts/rulings) → the domain book for the task. Book 0 is loaded FIRST, always.**
*(Numbering note: user's brief called this "book 4.5", but IV.5 = Art Quick Reference;
filed as Book V and noted in the document header. Rename on user request.)*

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
- **BOOK III — Character Bible, Edition One** → `docs/bible/BOOK-III-CHARACTER-BIBLE.md`
  (visual philosophy extracted from board; 14 full character entries incl. The Artist as
  unresolved presence; relationship evolution by chapter; 4-stage visual evolutions;
  per-character cinematic grammar; GPT-Image production prompt kit; QC pass 14/14
  silhouettes distinct)
- **BOOK IV — Visual Language Bible, Edition One** → `docs/bible/BOOK-IV-VISUAL-LANGUAGE-BIBLE.md`
  (one-frame test: pour/ration/tenant; numeric Rule of Scale; architecture/material/
  color/lighting law; 11 chapter color scripts w/ hex anchors; 12 district kits; prop +
  GN + UI + camera + VFX language; 12-shot environment prompt suite; UE5 mapping; QC)
- **BOOK IV.5 — Art Quick Reference, Edition One** → `docs/bible/BOOK-IV.5-ART-QUICK-REFERENCE.md`
  (the printable desk handbook: visual DNA page, Ten Absolute Rules, cheat sheets,
  district/prop tables, one-pagers, UE5 checklist, universal GPT-Image template,
  DO/DON'T, 25-question approval checklist; ZERO new canon — pure distillation)
- **BOOK V — Experience Bible, Edition One** → `docs/bible/BOOK-V-EXPERIENCE-BIBLE.md`
  (emotional blueprint: 16-station journey; pace map w/ breath audit (max 12 min combat,
  14 recovery beats); Rules of curiosity/megalophobia/silence/discovery/combat/relief/
  reveals/fear/hope/loss/bosses/cutscenes/GN/music; Top 25 unforgettable moments — all
  locked beats; 16-attribute chapter table; psychological flowchart; QC)
- **BOOK V.5 — Experience Quick Reference, Edition One** → `docs/bible/BOOK-V.5-EXPERIENCE-QUICK-REFERENCE.md`
  (10-page desk handbook: Experience DNA + 100-word statement, Ten Commandments,
  emotional curve scan table, pacing guide, wonder/combat/exploration/cinematic
  one-pagers, 30-question checklist, the North Star manifesto; ZERO new canon)
- **BOOK 0 — Master Creative Bible, Edition One** → `docs/bible/BOOK-0-MASTER-CREATIVE-BIBLE.md`
  (the Day-1 handbook compressing Books I–V.5: Project DNA, Twenty Absolute Rules,
  universe/story/character/visual/experience summaries, design philosophy, six role
  handbooks, 100 DO/DON'Ts, 75-question quality checklist, the North Star + Creative
  Manifesto; ZERO new canon; defines the loading order)

## Outstanding blockers
- None creative. (Implementation-phase blocker noted early: multiplayer excision touches App.tsx, Net.ts, server/ — scheduled for Sprint 1, not now.)
- Cinematic key art beyond the board: user offers GPT-Image generation on request — request images when Book VIII (cinematics) needs them.

## Files created
- `PROJECT_STATE.md` (this file)
- `docs/bible/BOOK-I-UNIVERSE-BIBLE.md`
- `docs/bible/BOOK-II-NARRATIVE-BIBLE.md`
- `docs/bible/BOOK-II.5-CANON-LOCK.md`
- `docs/bible/BOOK-III-CHARACTER-BIBLE.md`
- `docs/bible/BOOK-IV-VISUAL-LANGUAGE-BIBLE.md`
- `docs/bible/BOOK-IV.5-ART-QUICK-REFERENCE.md`
- `docs/bible/BOOK-V-EXPERIENCE-BIBLE.md`
- `docs/bible/BOOK-V.5-EXPERIENCE-QUICK-REFERENCE.md`
- `docs/bible/BOOK-0-MASTER-CREATIVE-BIBLE.md`

## Files modified
- (none — creative phase forbids code changes)

## Next implementation target
**BOOK III** (user's roadmap next book — likely Gameplay/Combat Design Bible: wave-defense
canon, Converter weapon modes, enemy roster re-skinned to Wardenry/Devastator fiction).
After Books: Sprint 1 = strip multiplayer + retitle + story scaffold.

## New canon added by BOOK IV (binding; quantifies earlier law per rule 20.20)
- Numeric scale canon (ceilings, doors incl. Ledger 2.0m humility door, pillar spacing
  8–12m, canyon widths, insignificance cadence 1-per-10-min); pour-lift 2.4–3.6m strata.
- Hex anchors for the locked palette (concrete #8A8A85 family, bone #E8E4DA, amber
  #D9A226, sower-line green #4F7A3D, living green #3E6B34→#77A05B, alarm #A6231C, gold
  #C2A44E); forbidden: saturated blue/cyan/purple, pure black/white. 11 chapter color
  scripts (Furrows = deliberately WRONG cold green; Ch.6 fire = amber-only, no red;
  Ch.10 reversal = the game's single chromatic flood; epilogue = inverted ration).
- District kits (12), hero-prop list (Converter, Vault, Vault-lid pot, Sela's volume,
  permit terminal, Verge's lantern, June's recorder, governor lever). UI = two diegetic
  hands (Edge grotesk/amber vs Sower kit-bag paper); no minimap; save = pressed leaf;
  HUD defects with the player at Ch.1. VFX: sigh = outward desaturation wave; memory
  shaders forbidden. UE5 mapping is guidance; engine confirmed at Sprint 0.

## New canon added by BOOK III (binding; resolves Lock UNKNOWNs per rule 20.20)
- Physical/identity stats for all 14 (heights, weights, birthdays, handedness incl.
  Grimwood left-dominant pre-injury retrained right; Asher middle name Rell; Grimwood
  full name Beckett Immanuel; Harrow = Edda Marisol; Voss = Coren Aldous, arcology-born,
  estranged daughter in grid admin; Coil ambidextrous; Dez left-handed).
- Asher: call sign "Amber Six"; b. 11 Mar 2037; anniversary prosthetic-cleaning ritual;
  tinned peaches; will not read the GN. Grimwood: b. 2 Nov 2001; father's drafting pencil
  stub; nightly 400-binomial recitation (record once in VO); has not stood in rain since
  2013; arm cause stays UNKNOWN; arrest beat "thanks the officers."
- Mara: estranged living wife Tomasin (4 unsent letters in nest). Brack: drowned brother
  under the sold route (imply only). Dez: mother on Edge-leased oxygen (defection math).
  Pale: filament pin worn upside down since year nine. June: surname stays UNKNOWN
  (recommend never). The Artist: presence-not-person; three locked deflection lines;
  four empty score bars before each GN = the signature.
- Cinematic law: fixed lens kit 24/35/50/85; Grimwood = symmetry + lit-from-below +
  heard-before-seen; Asher's camera may not dolly toward him before Ch.7.

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
