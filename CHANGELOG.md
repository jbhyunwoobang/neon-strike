# CHANGELOG — ECHOES OF EDEN (repo: neon-strike)
*Chronological. Versions: 0.x = legacy arcade prototype (NEON STRIKE) · 1.x = the
Echoes of Eden era (creative foundation → production).*

## [2.1.1] — 2026-07-04 — SPRINT 001 PLAN + the Lane Ruling
- `docs/sprints/SPRINT-001-PLAN.md`: the official foundation-sprint roadmap — 24
  tasks / 5 phases / 97h nominal; Sprint-0 gates embedded; controller+camera to the
  Book V timing table w/ automated feel test; universal interaction framework;
  versioned-chunk save foundation; `EOE_DEV_PROVING` 12-station graybox (door,
  freight elevator, counterweight puzzle, checkpoint, threshold seam); UI shell;
  dev-tool suite; CI + staging deploy; exit checklist + retro template.
- **Lane Ruling logged:** execution on the web stack per the user's standing
  link-first order + Book IX's Engine Gate default; [UE5 MIRROR] notes throughout.

## [2.1.0] — 2026-07-04 — BOOK X: Technical Design Document — THE SHELF IS FINISHED
- **BOOK X — Technical Design Document, Edition One**
  (`docs/bible/BOOK-X-TECHNICAL-DESIGN-DOCUMENT.md`, ~700 lines): dual-lane
  architecture (UE5 + web-stack deltas); three-layer law; subsystem roster; AI
  doctrine stack (radio actors, threat-tables, bespoke boss machines); animation/
  cinematic/rendering/world pipelines; system contract table; versioned-chunk
  saves; data & tag architecture; two-skin UI; meaning-state audio; optimization/
  debug/build pipelines (CI: timing-table per PR, nightly slice replay); Sprint
  1–4 task decomposition (~90–125 focused days to the link); the Technical
  Director's Manifesto.
- **The shelf is 16 documents and FINISHED.** Design → plan → architecture all
  complete. Next milestone: Sprint 0 (user approval), then the link.

## [2.0.0] — 2026-07-04 — BOOK IX: Production Master Plan — THE SHELF IS COMPLETE
- **BOOK IX — Production Master Plan, Edition One**
  (`docs/bible/BOOK-IX-PRODUCTION-MASTER-PLAN.md`, ~640 lines): the slice "The Sigh
  & the Seedling" (Prologue + Ch.1 + one Standing Watch page = the committed
  30-minute web-link deliverable, with acceptance criteria); phases (Sprints 0–4 →
  the link → tranches T1–T5 + re-scope gate); 4-tier feature priorities; asset
  pipelines; tool map; UE5 pipeline + the Engine Gate (default: web stack);
  team structures solo→AAA; outsourcing doctrine; QA doctrine (canon violation =
  S2); performance budgets; risk matrix (incl. developer-rest law); milestone
  checklists; Steam release plan; post-launch roadmap; the Executive Producer's
  Manifesto.
- **The BOOK I–IX creative roadmap is COMPLETE (15 documents).** Next milestone:
  Sprint 0 (awaits user approval), then the road to the link.

## [1.11.0] — 2026-07-04 — BOOK VIII.5: Cinematic Language & Shot Bible
- **BOOK VIII.5 — Shot Bible, Edition One** (`docs/bible/BOOK-VIII.5-SHOT-BIBLE.md`,
  ~980 lines, companion to Book VIII): the visual philosophy answered; camera rules
  with formal refusals (no orbit/aerial/18mm/135mm; no-enemy-POV); measurable scale
  law (40% headroom floor); THE 100-SHOT LIBRARY in ten families (S1–S100) —
  marketing shoots only from the library; composition/lens/movement/lighting/
  silence/reveal handbooks; GN panel-as-shot mapping; trailer shot kit; UE5
  Sequencer library numbering; 50 frame-level QA questions; the Cinematographer's
  Manifesto.
- New canon register: Book VIII.5 §16 (9 items) logged in PROJECT_STATE.md.

## [1.10.0] — 2026-07-04 — BOOK VIII: Cinematic, Storyboard & GN Bible
- **BOOK VIII — Cinematic, Storyboard & Graphic Novel Bible, Edition One**
  (`docs/bible/BOOK-VIII-CINEMATIC-STORYBOARD-GN-BIBLE.md`, ~1,080 lines): witness-
  camera philosophy; cinematic grammar (4 movement verbs, lens moral scale); 14-shot
  taxonomy; GN-native storyboard conventions; per-chapter cutscene structure map
  (completes the locked 8 cinematics + 7 GN sequences); consolidated GN language;
  camera handbook; cinematic lighting; the seven firsts shot-directed; boss intro
  rules; 7-beat character arcs; player-control contract (20-min non-interactive
  ceiling); 11-stage GN pipeline; 14 GPT-Image prompts; UE5 Sequencer conventions;
  5-trailer suite; 100 QC questions; the Film Director's Manifesto.
- **Production commitment logged:** vertical slice definition-of-done = ~30-minute
  playable game delivered as a web link (Prologue + GN-1 + title).
- New canon register: Book VIII §18 (12 items) logged in PROJECT_STATE.md.

## [1.9.0] — 2026-07-04 — BOOK VII: Enemy, Faction & Boss Bible
- **BOOK VII — Enemy, Faction & Boss Bible, Edition One**
  (`docs/bible/BOOK-VII-ENEMY-FACTION-BOSS-BIBLE.md`, ~1,480 lines): philosophy of
  enemies (no monsters — employees/machines/believers); 9-faction bible; complete
  taxonomy + unit roster across four families (Wardenry, Edge machines, Mulchers,
  Evergreen Custodian system); elite philosophy; mini-bosses (Long Glass, Hazard
  Foreman, the unfought D-1 husk); four main-boss character treatments + the 5-stage
  final encounter; AI philosophy (escalation drills, the Hesitation, Mulcher price
  engine); encounter feel; audio/animation language; 21 GPT-Image prompts; UE5 AI
  implementation philosophy; 100 QC questions; the Creature Director's Manifesto.
- New canon register: Book VII §17 (12 items) logged in PROJECT_STATE.md; ruling:
  harvest crews permanently non-combatant (closes Lock §17 TBD).

## [1.8.0] — 2026-07-03 — BOOK VI: Level Design Bible
- **BOOK VI — Level Design Bible, Edition One** (`docs/bible/BOOK-VI-LEVEL-DESIGN-BIBLE.md`,
  ~1,450 lines): level-design philosophy; world structure (Amber Line/Viaduct Web/
  Tide Routes/Deep Pours, journey-not-hub, 3 authored returns, streaming); complete
  per-chapter campaign flow maps + budget audit; 12-part level anatomy; room
  philosophy + archetype library; markerless guidance (10 instruments); landmark
  five-slot register; combat/puzzle/safe-space build specs; transition law (no
  loading screens); 4 boss-arena build documents; environmental storytelling
  placement law; 8-beat pacing; world consistency; UE5 World Partition strategy;
  100 QC questions; the Level Design Manifesto.
- New canon register: Book VI §19 (12 items) logged in PROJECT_STATE.md.

## [1.7.0] — 2026-07-03 — BOOK V: Gameplay & Systems Bible + shelf renumbering
- **BOOK V — Gameplay & Systems Bible, Edition One** (`docs/bible/BOOK-V-GAMEPLAY-SYSTEMS-BIBLE.md`,
  ~1,800 lines — the definitive systems spec: loops, controller, the Assessor's Read,
  combat/weapons (6 families), progression, encounters/bosses, exploration/puzzles/
  upgrades/economy, THE STANDING WATCH wave mode, saves/accessibility/balance/
  psychology, 100 QC questions + 50-gate Director's Checklist, audio addendum).
- **Shelf renumbering (user ruling):** Art Quick Ref → BOOK-IV-QUICK-REFERENCE.md;
  Experience Bible → BOOK-IV.5-EXPERIENCE-BIBLE.md; Experience Quick Ref →
  BOOK-IV.5-QUICK-REFERENCE.md (headers/footers errata'd; resolves numbering drift).
- **Platform amendment:** two-phase delivery — instant-play web link first, Steam
  later; single-player in all phases (Book V §0.5; PROJECT_STATE.md ledger).
- New canon register: Book V §20 (12 items) logged in PROJECT_STATE.md.

## [1.6.0] — 2026-07-03 — PROJECT CHECKPOINT
- Added `README_FOR_CLAUDE.md`, `CURRENT_PROJECT_STATE.md`, `CHANGELOG.md`, `TODO.md`.
- Consistency review + Production Readiness Report → `docs/CHECKPOINT-2026-07-03.md`.
- Development paused pending user approval (no Sprint started).

## [1.5.0] — 2026-07-03 — BOOK 0: Master Creative Bible
- The Day-1 handbook; canonical loading order defined (Book 0 → Canon Lock → domain).
## [1.4.x] — 2026-07-03 — Experience pair
- BOOK V — Experience Bible (emotional blueprint; numbering note: brief said "IV.5").
- BOOK V.5 — Experience Quick Reference (10-page handbook, North Star manifesto).
## [1.3.x] — 2026-07-03 — Visual pair
- BOOK IV — Visual Language & Art Direction Bible (one-frame test; numeric scale
  canon; hex palette; 11 chapter color scripts; 12 district kits; UE5 guidance).
- BOOK IV.5 — Art Direction Quick Reference (Ten Absolute Rules; 25-question check).
## [1.2.0] — 2026-07-03 — BOOK III: Character Bible
- 14 production character sheets; board-derived visual philosophy; GPT-Image kit.
- New canon: physical stats, middle names (Asher Rell Forester; Beckett Immanuel
  Grimwood), Voss first name locked Coren.
## [1.1.5] — 2026-07-03 — BOOK II.5: Canon Lock
- 22-section single source of truth; **9 continuity rulings (A–I)** applied as errata
  to Books I–II (Enna 2053; Coren Voss; 1,100 m shaft; two-layer Amber account;
  "the Quiet" official; Forester spelling; 900M scope; D-nomenclature; board-text
  artifact).
## [1.1.0] — 2026-07-03 — BOOK II: Narrative Bible
- Full campaign (P + 10 chapters + epilogue); Asher/Grimwood duality; the Governor
  ending; Top-level cast (Mara, Harrow, Sela, Coil, Lange, Verge, Pale, Brack, Dez,
  Noor, June); GN cutscene system.
## [1.0.0] — 2026-07-03 — THE PIVOT + BOOK I: Universe Bible
- **Project direction change:** single-player cinematic story FPS "ECHOES OF EDEN";
  ALL multiplayer removed from design (excision scheduled Sprint 1). Reference board
  adopted as visual canon. PROJECT_STATE.md protocol established.
- BOOK I: the Meridian Republic 2071, verdance/Grimwood Cycle, Edge/Sowers/Ledger/
  Bright Hour, the Quiet, Gravity Style, Central Question.

---

## [0.x] — 2026-06/07 — LEGACY PROTOTYPE (NEON STRIKE)
*(Retained as technical foundation; gameplay content non-canon.)*
- 0.9: concept-board enemy redesign (9 types, 4 bosses, boss-every-3-waves); upper
  decks + game-screen grain; scope tiers (2×/4×/6×) + ARBALEST crossbow; in-game
  settings/exit; PUBG-anchored damage/HP rebalance; cinematic lens post (CA/grain/
  grade/vignette).
- 0.8: staged reload foley + per-map ambience + mute; FPS perf governor; smooth
  smoke/explosions; held-grenade second weapon; visible two-handed grips + throw
  arm; grenade HUD chip; map select + horizontal roulette.
- 0.7: five themed maps from reference boards (theme system, seed-consistent MP);
  curved weapon geometry; working sniper scope; hi-detail trees; gradient skies.
- 0.6: multiplayer deployed (Render blueprint, user's account; wired client via
  .env.production; 4-player room cap, live-verified); unique per-weapon models;
  IBL reflections; GTAO; concrete normal maps.
- 0.5: Rapier physics (crates/ragdolls/vehicle); reload/inspect anims; grenade arc;
  outdoor world + water/waterfall; spawn-in-pillar movement fix.
- 0.4: viewmodel + hands; loadout screen; custom physics + 4 grenade types;
  brutalist art direction pass (ember/bone palette, Cinzel/Barlow, film grain).
- 0.3: detailed arena interiors; curved oculus chamber; skeletal-shroud enemies.
- 0.2: cinematic intro; trackpad look; UI identity; GitHub repo + Pages CI +
  Render blueprint authored; live link.
- 0.1: monorepo scaffold (React+Three client / Socket.IO server); wave survival
  core; 9 weapons; enemy AI; HUD.

## Major decisions log
- 2026-07-03: pivot to single-player story game (user).
- 2026-07-03: bibles govern text; reference board governs visuals (Book II.5).
- 2026-07-03: canonical loading order Book 0 → Lock → domain (Book 0).
- Pending (Sprint 0, user): engine choice; repo privacy; retitle.
