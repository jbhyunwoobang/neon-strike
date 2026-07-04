# PROJECT STATE — ECHOES OF EDEN
*Role since 2026-07-03 checkpoint: the CANON-AMENDMENT LEDGER + session-protocol source.
Live production snapshot lives in `CURRENT_PROJECT_STATE.md`; onboarding in `README_FOR_CLAUDE.md`;
history in `CHANGELOG.md`; backlog in `TODO.md`. The six-line status header draws from this file
+ CURRENT_PROJECT_STATE.md.*

---

## Project identity
- **Title:** ECHOES OF EDEN (working title, from the reference board; alternates on file: *The Long Verdance*, *Stillwood*)
- **Form:** Single-player cinematic story FPS with wave-survival combat, cutscenes, and graphic-novel visual storytelling.
- **PLATFORM AMENDMENT (2026-07-03, user-directed; amends Lock §1 "Platform intent"):** two-phase delivery — **Phase A: instant-play web link** (type/click a URL and play; no install) → **Phase B: downloadable Steam app**. Single-player in ALL phases ("online" = delivered online, never played against others). Spec: Book V §0.5.
- **Direction change (2026-07-03):** ALL multiplayer is removed from the design — no PvP, co-op, lobby, rooms, WebSocket networking, servers, or MP UI. The existing multiplayer codebase is legacy; it will be stripped in the first implementation sprint.
- **Reference board (permanent):** `/Users/hyunwoobang/Desktop/Game Project - reference /`
- **Roadmap:** BOOK I–IX (creative bibles) → Sprint 1–4 (implementation) → Vertical Slice.

## Current milestone
**SPRINT 001 PLANNED** (2026-07-04) → `docs/sprints/SPRINT-001-PLAN.md` — the official
foundation-sprint implementation roadmap (97h nominal across 24 tasks in 5 phases;
Sprint-0 gates G0.1–G0.4 embedded; graybox proving level `EOE_DEV_PROVING`;
end-of-sprint = deployed staging link).

### ✅ GATE G0.1 CLOSED (2026-07-04): REPO STAYS **PUBLIC** — user's decision.
The IP-exposure tradeoff (checkpoint finding #1) was surfaced repeatedly; the user
ruled PUBLIC. The bibles ship in the open. Consequence: the standing "uncommitted
pending privacy" hold is lifted — canon commits/pushes resume normally.

### ⚖ LANE RULING (2026-07-04, execution-phase — per the user's standing order)
The user's restated order: "an accessible link any people can access online and
play." UE 5.6 cannot ship a browser link; per Book IX §7.0 (Engine Gate default)
**Sprint 001+ executes on the WEB LANE** (existing TS/Three.js/React/Vite/Rapier
stack). Every sprint plan carries [UE5 MIRROR] notes so the Phase B port stays
verbatim-portable. "Playable executable" = deployed production build at a staging
URL → the ancestor of THE LINK.

**BOOK X — Technical Design Document** ✅ complete (2026-07-04) — **THE ENTIRE SHELF
IS FINISHED (16 documents).** (~700 lines; dual-lane architecture (UE5 mapping +
web-stack deltas), gameplay framework & subsystem roster, AI/animation/cinematic/
rendering/world/save/data/UI/audio architectures, optimization & debug & build
pipelines, Sprint 1–4 task decomposition w/ solo estimates → THE LINK, technical
risk matrix, the Technical Director's Manifesto.)
**The design, plan, and architecture are DONE. Next: SPRINT 0 on user approval
(privacy decision first), then Sprints 1–4 → the committed 30-minute web link.**

### 📌 PRODUCTION COMMITMENT (user-directed, 2026-07-04 — Book VIII brief)
After the bible shelf → sprints → vertical slice, the first shipped deliverable is
**a web link to a ~30-minute playable game** (Phase A scope: Prologue + GN-1 + title,
per Book V §0.5). This is the definition-of-done for the vertical slice milestone.
**⚠ LOADING ORDER FOR ALL FUTURE SESSIONS: Book 0 (identity) → Book II.5 Canon Lock
(facts/rulings) → the domain book for the task. Book 0 is loaded FIRST, always.**

### ⚖ SHELF RENUMBERING RULING (2026-07-03 — user-directed; resolves the checkpoint's numbering-drift finding)
The user's Book V brief confirmed the shelf numbering. Applied via `git mv` + header errata:
| Book | Old file | New file |
|---|---|---|
| BOOK IV Quick Reference (Art) | `BOOK-IV.5-ART-QUICK-REFERENCE.md` | `BOOK-IV-QUICK-REFERENCE.md` |
| BOOK IV.5 — Experience Bible | `BOOK-V-EXPERIENCE-BIBLE.md` | `BOOK-IV.5-EXPERIENCE-BIBLE.md` |
| BOOK IV.5 Quick Reference (Experience) | `BOOK-V.5-EXPERIENCE-QUICK-REFERENCE.md` | `BOOK-IV.5-QUICK-REFERENCE.md` |
| **BOOK V — Gameplay & Systems Bible** | *(new)* | `BOOK-V-GAMEPLAY-SYSTEMS-BIBLE.md` |
Canonical shelf: **0 · I · II · II.5 · III · IV · IV-QR · IV.5 · IV.5-QR · V · VI · VII · VIII · VIII.5 · IX · X.** THE SHELF IS COMPLETE (16 documents).
All citations of "Book V (Experience)" in older documents now mean Book IV.5.

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
- **BOOK IV QUICK REFERENCE — Art, Edition One** → `docs/bible/BOOK-IV-QUICK-REFERENCE.md` *(renumbered 2026-07-03)*
  (the printable desk handbook: visual DNA page, Ten Absolute Rules, cheat sheets,
  district/prop tables, one-pagers, UE5 checklist, universal GPT-Image template,
  DO/DON'T, 25-question approval checklist; ZERO new canon — pure distillation)
- **BOOK IV.5 — Experience Bible, Edition One** → `docs/bible/BOOK-IV.5-EXPERIENCE-BIBLE.md` *(renumbered 2026-07-03)*
  (emotional blueprint: 16-station journey; pace map w/ breath audit (max 12 min combat,
  14 recovery beats); Rules of curiosity/megalophobia/silence/discovery/combat/relief/
  reveals/fear/hope/loss/bosses/cutscenes/GN/music; Top 25 unforgettable moments — all
  locked beats; 16-attribute chapter table; psychological flowchart; QC)
- **BOOK IV.5 QUICK REFERENCE — Experience, Edition One** → `docs/bible/BOOK-IV.5-QUICK-REFERENCE.md` *(renumbered 2026-07-03)*
  (10-page desk handbook: Experience DNA + 100-word statement, Ten Commandments,
  emotional curve scan table, pacing guide, wonder/combat/exploration/cinematic
  one-pagers, 30-question checklist, the North Star manifesto; ZERO new canon)
- **BOOK 0 — Master Creative Bible, Edition One** → `docs/bible/BOOK-0-MASTER-CREATIVE-BIBLE.md`
  (the Day-1 handbook compressing Books I–IV.5-QR: Project DNA, Twenty Absolute Rules,
  universe/story/character/visual/experience summaries, design philosophy, six role
  handbooks, 100 DO/DON'Ts, 75-question quality checklist, the North Star + Creative
  Manifesto; ZERO new canon; defines the loading order)
- **BOOK X — Technical Design Document, Edition One** → `docs/bible/BOOK-X-TECHNICAL-DESIGN-DOCUMENT.md`
  (how the game is built, ~700 lines: dual-lane law (engine-portable contracts;
  UE5 mapping + [WEB] deltas — slice ships on the web stack per the Engine Gate);
  three-layer architecture (rules in C++/core, sequences in BP/content, numbers in
  data); subsystem roster (Save/WorldLedger/Covenant/Trust/PerceptionTier/GN/
  AudioState/Canon/Encounter); AI doctrine stack (five-state BT trunk, machines as
  literal threat-tables, radio actors, bosses as bespoke phase machines — no HP on
  Harrow BY TYPE); animation (posture-first, no motion matching, no mocap);
  cinematic pipeline (four-bars preload contract); rendering (Lumen manual-EV,
  grain 0.10, one shared PP); world (Data-Layer states, seam contracts); system
  contract table (13 systems w/ inputs/outputs/save/debug); versioned-chunk save
  architecture; gameplay-tag taxonomy; two-skin UI tree (the defection = a style
  swap); MetaSounds/meaning-state audio; optimization budgets; debug/console
  suite; CI law (timing-table per PR, nightly slice replay); SPRINT 1–4 TASK
  DECOMPOSITION w/ estimates → the link; technical risks; technical QA; the
  Technical Director's Manifesto; Technical Canon Register §21)
- **BOOK IX — Production Master Plan, Edition One** → `docs/bible/BOOK-IX-PRODUCTION-MASTER-PLAN.md`
  (how the game gets built, ~640 lines: honest production reality (solo + AI);
  project overview; THE VERTICAL SLICE "The Sigh & the Seedling" (Prologue + Ch.1 +
  one Standing Watch page, ~30 min, = the committed link deliverable, w/ measurable
  acceptance criteria); production phases (Sprints 0–4 → Phases 0–4 → THE LINK →
  chapter tranches T1–T5 w/ re-scope gate); 4-tier feature prioritization; asset
  pipeline per category; tool map (md-ledger = production database of record);
  UE5 pipeline + THE ENGINE GATE (decision at slice-ship, default = web stack,
  costed port criteria); team structures solo→AAA; outsourcing doctrine (GN hand +
  score = the two identity outsources; no mocap); QA doctrine (canon violation =
  S2 bug; the slice = eternal regression suite); performance budgets Phase A/B;
  risk matrix incl. burnout + developer-rest law; milestone checklists; Steam
  release plan (the link = perpetual demo); post-launch roadmap; the Executive
  Producer's Manifesto; Production Canon Register §17)
- **BOOK VIII.5 — Cinematic Language & Shot Bible, Edition One** → `docs/bible/BOOK-VIII.5-SHOT-BIBLE.md`
  (the frame law, ~980 lines: the visual philosophy answered (observe-don't-consume);
  camera rules incl. formal refusals (orbit/drone/18mm/135mm forbidden with reasons;
  no-enemy-POV rule; the two overheads); measurable scale law (40% headroom floor,
  3-edge megastructure rule, containment=comprehension); THE 100-SHOT LIBRARY in ten
  families (Architecture & Scale · The Tenant · Reveals · Combat & Boss · Memory &
  the Book · Emotion Set · Conversation · Journey & Transition · Ending · Marketing)
  — marketing may only shoot from the library; composition language (centered-framing
  ownership: 4 owners only); 4-lens handbook; movement/lighting/silence/reveal
  handbooks; GN panel-as-shot mapping; trailer shot kit; UE5 Sequencer library
  numbering; 50 new frame-level QA questions (inherits Book VIII's 50); the
  Cinematographer's Manifesto; New Canon Register §16)
- **BOOK VIII — Cinematic, Storyboard & GN Bible, Edition One** → `docs/bible/BOOK-VIII-CINEMATIC-STORYBOARD-GN-BIBLE.md`
  (how the story is seen, ~1,080 lines: 8-question philosophy (witness camera);
  cinematic grammar (4 movement verbs, lens moral scale, 2-second floor); 14-shot
  taxonomy (THE POUR → THE FIRST CREDIT); GN-native storyboard conventions;
  per-chapter cutscene structure map around the locked 8 cinematics + 7 GN
  sequences; consolidated GN language + input-paced pages; camera handbook
  (no-aerial rule; first-person default; earned objective third person); cinematic
  lighting deltas; the seven firsts shot-directed; boss intro rules (the Array's
  no-intro); 7-beat character cinematic arcs; player-control contract (20-min
  non-interactive ceiling; moral spine 100% played); 11-stage GN pipeline;
  14 GPT-Image prompts; UE5 Sequencer conventions; the 5-trailer suite (marketing
  obeys all canon, never looks better than the game); 100 QC questions; the Film
  Director's Manifesto; New Canon Register §18)
- **BOOK VII — Enemy, Faction & Boss Bible, Edition One** → `docs/bible/BOOK-VII-ENEMY-FACTION-BOSS-BIBLE.md`
  (every living threat, ~1,480 lines: philosophy of enemies (no monsters — employees,
  machines, believers); 9-faction bible (Wardenry service structure; harvest crews
  ruled permanently non-combatant); complete taxonomy tree + full unit roster (Line/
  Escort/First-Class/Marksman/Hazard/Breach Wardens, Watch command; Surveyor & Cordon
  drones; Mulcher Cutter/Stripper/Tide-Captain; Evergreen Custodian frames & Steward
  arms); elite philosophy (seniority-not-palette-swaps, silence is rank); mini-bosses
  (Long Glass pair, Hazard Foreman, the unfought D-1 husk); four main-boss character
  treatments + the final encounter (5-stage Array; final ring combat-free); AI
  philosophy (five-state grammar, escalation drills, the Hesitation, Mulcher price
  engine, machines-as-tables, radio-physical information); encounter feel; audio/
  animation language; 21 GPT-Image prompts; UE5 behavior-tree/perception philosophy;
  100 QC questions; the Creature Director's Manifesto; New Canon Register §17)
- **BOOK VI — Level Design Bible, Edition One** → `docs/bible/BOOK-VI-LEVEL-DESIGN-BIBLE.md`
  (the physical experience, ~1,450 lines: level-design philosophy (8 whys); world
  structure (Amber Line / Viaduct Web / Tide Routes / Deep Pours; journey-not-hub;
  3 authored returns; streaming strategy); complete campaign flow maps P→Epilogue w/
  budget audit table; 12-part level anatomy; room philosophy (8 questions + archetype
  library); markerless guidance system (10 instruments + Compass Test); landmark
  five-slot law + per-chapter register; exploration/combat/puzzle/safe-space build
  specs (3 covenant arena archetypes; shelter register); transition law (no loading
  screens); 4 boss-arena build documents; environmental-storytelling placement law;
  8-beat level pacing; world-consistency audits; UE5 World Partition/naming/kit
  strategy; 100 QC questions; the Level Design Manifesto; New Canon Register §19)
- **BOOK V — Gameplay & Systems Bible, Edition One** → `docs/bible/BOOK-V-GAMEPLAY-SYSTEMS-BIBLE.md`
  (the definitive systems spec, ~1,800 lines: design philosophy + platform plan (web
  link → Steam); core loops micro/macro/campaign; full player controller w/ state table;
  the Assessor's Read (scanning); combat philosophy (Breath/Binding health, plate armor);
  6-family weapon roster + green unit + prosthetic; 4-track progression (perception/
  trust/hand/kit) + the Second Printing NG+; encounter & boss system contracts;
  exploration/puzzle/upgrade/economy systems; THE STANDING WATCH wave mode (GN-apocrypha
  framing, ledger scoring, the Long Night); save (leaf) / accessibility / balance /
  psychology; 100 QC questions; 50-gate Director's Checklist; audio addendum (grand
  ambient orchestra register, total SFX coverage, grain 0.10 + room-tone floor);
  New Canon Register §20)

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
- `docs/bible/BOOK-IV-QUICK-REFERENCE.md` *(renamed from BOOK-IV.5-ART-QUICK-REFERENCE.md)*
- `docs/bible/BOOK-IV.5-EXPERIENCE-BIBLE.md` *(renamed from BOOK-V-EXPERIENCE-BIBLE.md)*
- `docs/bible/BOOK-IV.5-QUICK-REFERENCE.md` *(renamed from BOOK-V.5-EXPERIENCE-QUICK-REFERENCE.md)*
- `docs/bible/BOOK-0-MASTER-CREATIVE-BIBLE.md`
- `docs/bible/BOOK-V-GAMEPLAY-SYSTEMS-BIBLE.md` *(2026-07-03)*
- `docs/bible/BOOK-VI-LEVEL-DESIGN-BIBLE.md` *(2026-07-03)*
- `docs/bible/BOOK-VII-ENEMY-FACTION-BOSS-BIBLE.md` *(2026-07-04)*
- `docs/bible/BOOK-VIII-CINEMATIC-STORYBOARD-GN-BIBLE.md` *(2026-07-04)*
- `docs/bible/BOOK-VIII.5-SHOT-BIBLE.md` *(2026-07-04)*
- `docs/bible/BOOK-IX-PRODUCTION-MASTER-PLAN.md` *(2026-07-04)*
- `docs/bible/BOOK-X-TECHNICAL-DESIGN-DOCUMENT.md` *(2026-07-04)*

## Files modified
- Renumbered books' headers/footers (errata notes added); PROJECT_STATE.md,
  CURRENT_PROJECT_STATE.md, README_FOR_CLAUDE.md, CHANGELOG.md updated for the ruling.
- (no code changes — creative phase)

## Next implementation target
**EXECUTE SPRINT 001** per `docs/sprints/SPRINT-001-PLAN.md` — first action: close
gates G0.1–G0.4 (G0.1 repo privacy = USER decision), then Phase A (MP excision, CI,
restructure) → Phases B–E → the staging link. After Sprint 001: Sprint 002 (covenant
grey-box) per Book X §17, on the road to the **committed ~30-minute playable web
link** ("The Sigh & the Seedling").

## Technical canon added by BOOK X (logged; full register in Book X §21)
1. **Dual-lane law:** engine-portable contracts; architecture identical across
   web stack (Phase A) and UE5 (Phase B); only substrate forks.
2. **Three-layer law:** rules in C++/core, sequences in BP/content, numbers in
   data; plugin-per-system, DAG-enforced.
3. **Subsystem roster** (Save/WorldLedger/Covenant/Trust/PerceptionTier/GN/
   AudioState/Canon/Encounter).
4. **Type-system canon enforcement:** no anti-personnel damage type; no HP field
   on Harrow; no XP fields; no kill-score field.
5. **Radio actors** (alerts as audible interruptible world events); machines as
   literal data-table policies.
6. **Motion matching rejected; no mocap; procedural = feet/slope/recoil only.**
7. **Four-bars preload contract**; versioned-chunk saves (≤2MB checkpoints; A→B
   signed journal export).
8. **CI law:** timing-table on every PR; nightly slice replay + save soak;
   main always deploys the link.
9. **Sprint 1–4 task decomposition** (solo estimates: ≈90–125 focused days total
   to the link).
10. **The min-spec laptop on the desk rule.**

## Production canon added by BOOK IX (logged; full register in Book IX §17)
1. **Slice definition:** "The Sigh & the Seedling" = Prologue + Ch.1 + one Standing
   Watch page (~30 min) = the committed web-link deliverable, with measurable
   acceptance criteria (Book IX §2.4).
2. **Phase plan:** Sprints 0–4 = Phases 0–4 → THE LINK; then chapter tranches
   T1(Ch.2–3)…T5(Ch.10+E) with a re-scope gate after T1.
3. **THE ENGINE GATE:** decided at slice-ship; default = continue web stack;
   UE5 port only if ≥2 criteria true; port plan costed.
4. **md-ledger = production database of record** (PROJECT_STATE/CURRENT/CHANGELOG/
   TODO + bibles).
5. **Budgets:** Phase A ≤200MB initial, 60fps integrated, ≤30s time-to-play,
   input-to-photon ≤70ms (feel outranks beauty).
6. **QA doctrine:** canon violations = S2; slice = eternal regression suite.
7. **Outsourcing:** GN hand + score = the two identity outsources; no mocap;
   hero assets in-house.
8. **Developer-rest law:** fallow weeks after milestones; one tranche in flight.

## New canon added by BOOK VIII.5 (binding; logged per rule 20.20 — full register in Book VIII.5 §16)
1. **THE 100-SHOT LIBRARY** (ten families, numbered S1–S100); marketing shoots only
   from the library.
2. **The two overheads** (the ledger page; the valley) — the audit view, spent twice.
3. **No-enemy-POV rule**; 18mm & 135mm formally forbidden (spectacle / surveillance).
4. **Scale measurables:** 40% headroom floor; megastructure touches ≥3 edges;
   containment = comprehension (no full-frame containment before interior walked).
5. **Re-reveals quote their first frames exactly.**
6. **The exit look-back** (one per chapter, at the seam).
7. **Centered-framing ownership** — Grimwood, isolation, the covenant's protected
   thing, irony-once.
8. **Sequencer shot-library numbering** (`S<nn>_<NAME>`); DoF law (lens-true, ≤1
   motivated rack, attention-speed).
9. **Marketing screenshot law** (25-question art check + shot QA per release).

## New canon added by BOOK VIII (binding; logged per rule 20.20 — full register in Book VIII §18)
1. **14-shot taxonomy** (THE POUR, THE TENANT, THE APPLIANCE, THE PRESSED LEAF,
   THE WORKING HANDS, THE ONE FIGURE, THE DAYLIGHT DREAD, THE INHERITANCE, THE
   ACCOUNTING, THE STOWED THING, THE SPACE BETWEEN, THE FILED TRUTH, THE HELD
   BREATH, THE FIRST CREDIT).
2. **2-second shot floor** (three authored sub-2s shocks: the cascade, the hand,
   the chart-fall).
3. **Storyboard conventions:** GN-native boards, light drawn first, four arrow
   glyphs + held-frame bracket, mandatory emotion word, `EOE-CIN-` numbering.
4. **Per-chapter cutscene structure map** completing the locked 8+7.
5. **Vista letterbox rule** (21:9 only during held POUR wides).
6. **GN grammar additions:** 3-4-1 page rhythm notation; input-paced pages (6s
   fallback); page-by-page skip; print-survivable resolution.
7. **No-aerial rule** (the sky belongs to Surveyors).
8. **20-minute non-interactive ceiling** campaign-wide; moral spine 100% played.
9. **11-stage GN pipeline** (GPT-image = concept layer only, never shipped).
10. **Trailer suite:** Still Here / The Covenant (one unbroken take) / The Ledger /
    One Valley / dev diary / Steam loop — marketing obeys all canon, never looks
    better than the game, ends quieter than it begins, no spoilers past R1.
11. **Sequencer conventions:** `EOE_CIN_CH<nn>_<name>`; four-lens kit enforced at
    rig level; handheld = recorded human takes.
12. **PRODUCTION MILESTONE:** vertical slice definition-of-done = ~30-minute
    playable via web link (see Current Milestone box).

## New canon added by BOOK VII (binding; logged per rule 20.20 — full register in Book VII §17)
1. **Wardenry service structure:** ranks Recruit→Warden→First Class→Corporal→Watch
   Sergeant→Watch Commander→Regional Commander; organizations rotation/escort/watch/
   response.
2. **Harvest crews permanently non-combatant, franchise-wide** (closes Lock §17's
   "armed variant TBD-BIII").
3. **Unit roster:** Line/Escort Warden, Warden First Class (elite), Warden Marksman,
   Hazard Crewman, Breach Warden, Watch Sergeant/Commander; Surveyor (S) & Cordon (C)
   drones; Mulcher Cutter/Stripper/Tide-Captain; Evergreen Custodian frame & Steward
   arm.
4. **Visor law:** no enemy eyes in combat — faces belong to the named cast.
5. **Elite philosophy:** seniority not palette-swaps; wear/movement/audio-reduction
   identification; music never changes (silence is rank).
6. **Mini-bosses:** "Long Glass" marksman pair (Ch.8) + Hazard Foreman (Ch.9), both
   routable; the **D-1 husk** = the unfought derelict (Ch.1).
7. **The Hesitation:** post-Ch.6 Wardenry conscience state (~1 in 6 line Wardens;
   never Breach/elites; never exploitable).
8. **Mulcher price engine:** morale = job price; encounters endable by economics
   alone; the withdrawal whistle.
9. **Evergreen doctrine:** no human combatants at Evergreen; Custodians deny, never
   kill; the final ring to the governor is combat-free.
10. **Machine law:** recalled-never-retreating; defeats = power-down/seal; dispatch-
    band audio; radio-physical information rule (alerts propagate audibly/
    interruptibly, never omnisciently).

## New canon added by BOOK VI (binding; logged per rule 20.20 — full register in Book VI §19)
1. **Connective systems:** the Amber Line (mag-freight spine), the Viaduct Web, the
   Tide Routes, the Deep Pours — named routes binding future geography.
2. **World model:** journey-not-hub; chapter = streaming world; exactly three authored
   cross-chapter returns (Standing Hall / 2068 cordon / Halden's Ford watershed).
3. **The twelve-part level anatomy** (entrance→exit) + blueprint law VI-A.
4. **Room archetype library** (~30 build-sheet archetypes across work/civic/sacred/
   domestic/ruin/service).
5. **Lost-state taxonomy** (wandering/lost/stuck; ≤3-min lost ceiling; recovery
   lattice LAW 0-A).
6. **Landmark five-slot law** (skyline/impossible/vista/emotional/reveal per chapter)
   + the full per-chapter landmark register; Halden's Ford's grain elevator = the
   town's anomalous vertical.
7. **Covenant arena archetypes:** the Acre (radial), the Dock (linear exfil), the
   Vault Yard (asymmetric hazard).
8. **Shelter register** build sheets incl. Ch.9 shaft-head catwalk; Ch.6 shelter
   formally DELETED (the burned Hall) with Ch.7's rite carrying the breath.
9. **Transition law:** no loading screens ever; palette handover at district seams;
   GN shape-match at both crossings.
10. **Placement rulings:** Verge's unfinished commission = the style's one
    mid-construction anatomy lesson (Ch.7); his formwork signature readable in the
    Evergreen shell (Ch.10); plinth-holding-a-Vault cartoon spent once (Ch.1 Belt).
11. **UE5 conventions:** `EOE_CH<nn>_<District>_<Function>` naming; Data-Layer
    world-state model (never duplicate maps); landmark HLODs art-reviewed.

## New canon added by BOOK V (binding; logged per rule 20.20 — full register in Book V §20)
1. **Platform:** two-phase delivery (web link → Steam); single-player all phases.
2. **The Assessor's Read** — diegetic scanning/perception system, 3 tiers (Surface/
   Clerk/Assessor); no outlines/x-ray ever; journal annotations; prosthetic amber
   proximity ring (~15 m).
3. **Weapon roster:** Arsenal P-11 sidearm & C-9 carbine (Republic patterns,
   Edge-refurbished), Tideworks coil-pump shotgun, Ranger-pattern R-4 survey rifle,
   grafting mortar (seed/smoke/foam/thumper cases; NO anti-personnel payload — LAW),
   bolt-driver "Jack" (Mulcher industrial anti-machine tool). Nomenclature: Arsenal /
   Ranger-pattern / Tideworks.
4. **The spade as melee** + spade-clamp bayonet; no takedown cinema.
5. **Health grammar:** Breath/Binding double-rule segments, constant all campaign; no
   HP progression; armor = physical plate arcs.
6. **THE STANDING WATCH** — wave mode as the banned GN's apocryphal loose pages (other
   Sower cells; not Asher); ledger scoring (banked growth, kills never scored); the
   Long Night endless bracket; banking-out decision; no campaign power crossover.
7. **The Second Printing** — NG+ (variant marginalia, GN pencil under-sketches;
   resolves nothing).
8. **Difficulty watches:** Reader / Planter / Warden / the Long Watch.
9. **Economy:** no abstract currency — barter + the cell's ledger of favors;
   seed-stock never purchasable.
10. **Accessibility ruling:** all holds toggle-convertible EXCEPT the governor's ten
    seconds (converts to repeated-press rite).
11. **Score register:** grand ambient orchestra bed (Dune-scale epic-ambient register,
    100% original composition, zero licensed material) — subordinate to all locked
    silence law; full orchestra still Ch.9 only.
12. **Presentation locks:** film grain intensity **0.10** (off on GN pages; reducible
    for accessibility) + **−60 LUFS room-tone floor** under every mix state.

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
