# ECHOES OF EDEN
## BOOK IX — THE PRODUCTION MASTER PLAN
### Edition One · How the Game Gets Built · 2026

*Governed by the complete shelf: BOOK 0 → II.5 → I–VIII.5. This book designs nothing —
no lore, no mechanics, no frames. It converts fourteen canon documents into an
achievable development roadmap: phases, pipelines, priorities, budgets, risks, and the
discipline to ship. Where it makes production decisions (slice definition, engine gate,
budgets, schedules), those are flagged **[PRODUCTION CANON]** and logged in
PROJECT_STATE.md. The objective: maximum quality, minimum wasted work.*

**The production reality this plan is built on (stated honestly, because plans built on
fantasy studios fail):** this project is currently a **solo developer with AI-assisted
production** (Claude as co-developer/production partner), a completed creative bible
shelf, and a working legacy prototype (the NEON STRIKE Three.js/React FPS engine —
movement, hitscan combat, wave AI, Rapier physics, rendering pipeline, procedural
audio — retained as the technical foundation [PROJECT_STATE]). The plan scales to
larger teams (§8) but every schedule and priority herein is executable at current
strength first.

**The committed deliverable (user-directed, locked):** after this book → sprints →
vertical slice, the user receives **a web link to a ~30-minute playable game**
[Book VIII §18.12]. Everything in this plan bends toward that link first and the full
campaign second.

---

# SECTION 1 — PROJECT OVERVIEW

- **Project vision:** the quiet game, on purpose — a single-player cinematic story FPS
  where combat defends living things, perception is progression, and one honest entry
  is written into a falsified ledger [B0 §1].
- **Scope:** Prologue + 10 chapters + Epilogue (~12–16 h campaign, exploration-paced)
  + THE STANDING WATCH wave mode (6 launch pages + endless) [Book V §12] + 7 GN
  sequences + 8 locked cinematics.
- **Genre:** single-player cinematic story FPS · wave-survival combat · graphic-novel
  storytelling [Lock §1].
- **Target platforms [PRODUCTION CANON, per Book V §0.5]:** Phase A — instant-play
  **web link** (browser; the 30-minute slice first, content streaming after); Phase B
  — **Steam desktop** (full campaign, achievements, cloud saves). Single-player in
  all phases; no multiplayer, ever.
- **Estimated playtime:** slice 30 min · campaign 12–16 h · Standing Watch open-ended.
- **Development philosophy:** *the cheapest honest version, shipped* [B0 §15] — canon
  law applied to production: every milestone ships the smallest thing that keeps the
  losses felt; nothing is built before the thing it depends on is proven.
- **Core pillars (locked, production-facing):** (1) awe before anger, (2) no cartoons,
  (3) green is sacred and scarce, (4) hope is manual labor, (5) the quiet is the
  antagonist [BI §XVII] — plus the production pillar: **(6) the bibles govern; drift
  is a bug** (the QC batteries in Books IV-QR/V/VI/VII/VIII/VIII.5 are the acceptance
  tests of record).
- **Production goals:** G1 — ship the 30-minute link (the slice) as the project's
  proof and the user's deliverable; G2 — convert slice learnings into a locked
  production formula (cost-per-chapter known before committing to ten); G3 — ship the
  campaign on Steam without breaking the solo developer or the canon; G4 — protect
  the franchise assets (open questions, sequel threads) for the future.

# SECTION 2 — THE VERTICAL SLICE **[PRODUCTION CANON — slice definition]**

## 2.1 What the slice is

**"THE SIGH & THE SEEDLING" — Prologue + Chapter 1 compressed, ~30 minutes** (target
band 28–38 min first playthrough), delivered as the web link. It is the campaign's
actual opening, built at ship quality — never throwaway demo content (the slice IS
the game's first half hour forever; nothing built for it is wasted **LAW**).

## 2.2 The slice's contents (mapped to the brief's requirements)

| Requirement | The slice's answer (all locked canon) |
|---|---|
| Opening cinematic | the cold open — black, wind, the far sigh, serif card [BVIII §4.P] |
| Tutorial | procedure-as-tutorial: Warden escort verbs, the permit prompt (two presses) [BII §VIII] |
| Movement | full Book V §2 controller (walk/run/sprint/crouch/vault/lean/carry) |
| Combat | Prologue escalation-drill firefight + Ch.1 covenant wave (archetype A "the Acre") |
| Exploration | stillwood traversal, Chargehand reads, the Assessor's Read Tier 1 |
| One puzzle | environmental: the wind-with-texture read finding the regrowth site approach [Book V §9] |
| One upgrade | Coil's bench — the Converter re-govern + one weapon-handling step [Book V §10] |
| One safe room | the Taproot nest (bench, leaf-save, seedling, conversation set) [BVI §10.2] |
| One enemy faction | the Wardenry (Line Wardens, pairs, drills) + Surveyor drones [BVII §4] |
| One elite | one Warden First Class in the Ch.1 patrol (wear-biography ID) [BVII §5] |
| One mini-boss | **the D-1 husk** (the unfought derelict — boss-shaped dread in safety) + the Prologue's D-2 Incident (the authored unwinnable event) [BVII §6] |
| One major boss | **a Standing Watch machine event** — the slice unlocks one wave-mode page after the dawn hold, whose 7th-wave D-2-class arrival is the demo's fightable boss (canon-safe: campaign's D-2 stays Ch.5; wave mode legally reuses the grammar [Book V §12.4]) |
| One GN sequence | GN-1, complete (eleven wordless pages, 2m10s) [BVIII §5] |
| One architectural reveal | the stillwood cathedral (THE POUR, S11) + the viaduct nest warmth |
| One complete emotional arc | competence → horror → isolation → belonging → hope (the dawn hold, 40 s, no UI) — the sixteen stations' first four, whole [BIV.5 §2] |

## 2.3 Why this slice convinces

It performs the franchise's five unique claims in half an hour: the tutorial that is
the crime, the covenant wave, the HUD defection, the silence, and the GN memory organ
— and it ends on the game's first credit (the dawn), which is the emotional proof no
competitor's demo can copy. For investors/publishers: the Standing Watch page
demonstrates replayable systems depth; the bible shelf demonstrates that the other
9.5 chapters are *specified, not imagined*.

## 2.4 Slice acceptance criteria (measurable)

30±8 min median first playthrough; 60 fps on integrated GPU @1080p; ≤200 MB initial
payload; time-to-play ≤30 s from link click; zero visible loads; the permit prompt
filed by ≥95% of testers without prompting; the dawn hold watched ≥30 s by ≥60% of
testers unprompted; exit-word capture matching the emotional targets (P: "cold/
complicit-adjacent words"; Ch.1: "belonging/hope words"); all applicable QC batteries
passed (Book V §17, VI §17, VII §15, VIII §16, VIII.5 §14).

# SECTION 3 — PRODUCTION PHASES

*The existing Sprint 0–4 roadmap [PROJECT_STATE] is preserved and extended into the
full phase plan. Solo-scale durations given as focused working-time estimates (they
compress with team scale §8; they stretch with life — the plan measures in
milestones, not calendar promises).*

## PHASE 0 — PRE-PRODUCTION (= SPRINT 0) — *status: awaiting user approval*
**Objectives:** unblock production. **Deliverables:** (1) repo privacy decision
executed (the standing CRITICAL blocker); (2) **the Engine Gate decision** (§7.0);
(3) repo/product rename plan (neon-strike → echoes-of-eden); (4) folder/naming
conventions doc (§7); (5) Sprint 1 scope signed. **Dependencies:** user approval.
**Exit criteria:** all five deliverables logged. **Risks:** engine indecision
stalling everything → the gate has a default (§7.0).

## PHASE 1 — FOUNDATION (= SPRINT 1)
**Objectives:** clean ground. **Deliverables:** multiplayer excised (server/, Net.ts,
lobby/rooms/MP UI deleted; Render service decommissioned); product retitled
everywhere; legacy docs rewritten; build + deploy pipeline for the link verified
(CI → static hosting); the legacy arcade content quarantined behind a dev flag.
**Exit criteria:** clean single-player build deployed to a private test link.
**Risks:** hidden MP coupling in Game.ts → mitigation: excise by compilation errors,
not by search.

## PHASE 2 — SLICE SYSTEMS (= SPRINT 2) — *prototype phase for the real game*
**Objectives:** the Book V core loop playable in grey-box. **Deliverables:**
controller retune to §2 spec (kill slide-cancel feel — logged debt); Breath/Binding
health; the covenant wave loop (green unit, plantable point, wave director on
escalation drills); Wardenry Line Warden + Surveyor (five-state AI, staged spawns);
the P-11 + C-9 weapon feel pass; the Assessor's Read Tier 1; leaf-save/checkpoint;
the kit-bag HUD skeleton (two diegetic hands, the defection switch). **Exit
criteria:** the "covenant grey-box" — one arena, one wave sequence, fun and legible
with no art. **Risks:** feel-canon misses (Book V's ±10% timings) → mitigation:
timing table as automated test.

## PHASE 3 — SLICE CONTENT (= SPRINT 3)
**Objectives:** the Prologue and Ch.1 spaces built to blockout → dress. **Deliverables:**
Prologue forest tract (living key — the one warm biome); the permit terminal (hero
prop #1); the D-2 Incident staging; stillwood cathedral kit; the viaduct nest; the
regrowth site arena; the D-1 husk; environmental storytelling pass per BVI §13's
Ch.P/1 anchors; lighting per color scripts P/1. **Exit criteria:** both levels
walkable start-to-finish at dress quality, budgets held. **Risks:** the stillwood's
"architecture-tools" build reading as cheap trees → mitigation: silhouette-first kit
review against BIV §14.2 prompt renders before mass placement.

## PHASE 4 — SLICE ASSEMBLY (= SPRINT 4) → **MILESTONE: THE VERTICAL SLICE / THE LINK**
**Objectives:** the complete 30 minutes, polished. **Deliverables:** GN-1 (the real
eleven pages — outsource-or-craft decision §9); the cold open; the dawn hold; the
Standing Watch page + machine event; audio pass (the sigh, the phantom response,
ambient beds, the score's bass-line motif — original composition begins here);
accessibility gates; the QC batteries run; **the link delivered to the user**
[the committed deliverable]. **Exit criteria:** §2.4's acceptance criteria met.
**Risks:** GN-1 art quality (the identity hangs on it) → mitigation: §9's artist
strategy starts in Phase 2, not Phase 4.

## PHASE 5 — CORE PRODUCTION (chapters as tranches)
**Objectives:** the production formula proven then repeated. **Structure:** chapters
built in dependency-ordered tranches — T1: Ch.2+3 (Ledger/Driftmark kits, Mulchers,
tide systems); T2: Ch.4+5 (Furrows, the D-2 boss, R1/R2); T3: Ch.6+7 (the Hall's
three states, Harrow, the rite); T4: Ch.8+9 (Cadence, mini-bosses, D-3000, Voss);
T5: Ch.10+E (Evergreen, the Array, the valley). Each tranche exits through the full
QC battery + a pacing playtest against BIV.5's chapter rows. **Deliverables per
tranche:** levels, enemies, systems increments (per the Tier map §4), GN sequences,
score cues. **Exit criteria:** campaign playable start-to-finish (ugly allowed in
un-tranched gaps). **Risks:** the formula not converging (T1 costs don't predict
T3) → mitigation: re-scope gate after T1 (§12).

## PHASE 6 — ALPHA
**Definition:** feature-complete, content-complete-in-grey where not dressed; all
systems final. **Deliverables:** full campaign traversable; Standing Watch's 6 pages;
NG+ skeleton; all four bosses per contract [Book V §7]. **Exit:** the Alpha checklist
(§13). **Risks:** boss exit-word failures → re-staging budget reserved (one
re-stage per boss, planned, not panic).

## PHASE 7 — BETA / CONTENT LOCK
**Definition:** all content in, all features locked; localization/text freeze; the
two GN discrepancies and open-question evidence audited by the Canon Office (this
plan's name for the bible-compliance review role). **Deliverables:** full playthrough
at ship art; performance within budgets on min-spec; accessibility certified.
**Exit:** Beta checklist (§13); zero Tier-1 bugs.

## PHASE 8 — OPTIMIZATION & POLISH
Budgets enforced (§11); streaming seams audited (zero visible loads **LAW**); the
green-ration histogram tool run over every chapter [BIV §15]; input-latency
verification (the feel canon is a ship gate, not a nice-to-have).

## PHASE 9 — GOLD MASTER → LAUNCH (Steam, Phase B)
Steam packaging, achievements (the Top 25 memory beats, never kill-counts [Book V
§0.5]), cloud saves + Phase A save import, store assets from the shot library only
[BVIII.5 §12], the trailer suite [BVIII §15]. **Exit:** Gold checklist (§13).

## PHASE 10 — POST-LAUNCH (§15)

# SECTION 4 — FEATURE PRIORITIZATION

**TIER 1 — MUST EXIST (the slice + the spine):** Book V controller & combat core;
covenant waves; Wardenry patrol + Surveyor + machines (D-2/D-3000 as scheduled);
the Read Tiers 1–2; health/economy/bench cores; leaf saves; kit-bag HUD + defection;
GN player (pages, bars, form-match); the eight cinematics' staging tech; the four
bosses per contract; markerless guidance stack; accessibility gates (ship-blocking
by canon); the sigh/anti-sigh audio systems; chapter streaming with zero loads.
*Why:* each is load-bearing for the franchise's unique claims — cutting any one
collapses a pillar.

**TIER 2 — STRONGLY RECOMMENDED (depth that pays twice):** Read Tier 3; the
Hesitation state; Mulcher price engine (Ch.2+ anyway); trust barks system at full
depth; Standing Watch beyond the slice page (remaining 5 pages); NG+ (the Second
Printing); chapter replay shadow-slots; the optional-door scenes (Noor/June/Verge —
*strongly* protected: they are cheap and they are the soul); weapon fouling/
maintenance. *Why:* they deepen without gating; each degrades gracefully if
simplified.

**TIER 3 — NICE TO HAVE:** journal marginalia statistics; chalk colors and cosmetic
rewards; the reactive antechamber's full examination matrix (a reduced 3-node
version is Tier 1 for Ch.10); Belt weather variety beyond the script's minimum;
extra Chargehand glyph collectibles beyond the glossary's core.

**TIER 4 — FUTURE DLC (per Lock §22's DLC law):** additional Standing Watch pages;
the held sequel threads (never resolved in DLC without franchise sign-off);
Deep-Inheritance-era or Accord-era side stories.

**Postponed until after the slice:** everything outside P+Ch.1+one Watch page —
explicitly including: all other chapters' content, Tiers 2–3 systems except what
the slice table requires, Steam integration, localization, and the full score
(the slice ships with the bass-line motif, ambient beds, and the sigh — the
orchestra is hired once, later, when the cue list is final).

# SECTION 5 — ASSET PIPELINE

*The universal stage-gate chain — every asset: CONCEPT (bible citation + GPT-Image
study per the prompt libraries [BIII §18, BIV §14, BVII §13, BVIII §13] — concept
layer ONLY, never shipped **LAW**) → BLOCKOUT (grey, in-engine, scale-table
verified) → HIGH DETAIL (sculpt/high-poly where the camera lingers per the dwell
cadence [BVI §16]) → GAME MESH (retopo/low-poly, silhouette-first — the 100 m fog
test at LOD2 **LAW**) → UV/TEXTURE (Substance; wear-is-biography maps authored from
the written biography, not noise **LAW**) → MATERIALS (the master-layered system
[BIV §15]) → RIG/ANIM (where applicable; keyframe performance, procedural
feet-only [BVII §12]) → IMPORT (naming per §7) → OPTIMIZATION (budget check §11) →
TEST (in-situ against district kit + lighting) → APPROVAL (the relevant QC battery;
one-frame test for anything camera-facing).*

**Per-category deltas:**
- **Characters (named cast):** BIII sheets govern; four-stage visual evolutions
  built as costume variants; facial rigs for the cast only **LAW** (visor law).
- **Enemies:** family-shared bases + unit deltas (the taxonomy IS the asset plan —
  Line/Escort/Elite Wardens are ONE base + wear-biography variants); posture
  libraries before attack anims (AI reads via posture [BVII §12]).
- **Bosses:** hero-asset track — bespoke, cinematic-budget; the D-2 doubles as the
  D-1 husk (one sculpt, two dressings — planned reuse) and informs the Standing
  Watch event unit; the chart slab is an asset with a physics contract.
- **Architecture:** the Gravity mega-kit FIRST (20–30 pour modules, 8–12 gantry
  [BIV §15]) — the kit is the game; district dress kits second; signature spaces
  (boss arenas, the seven firsts) as hero one-offs last.
- **Props:** the eight hero props at maximum fidelity FIRST (style anchors **LAW**
  [BIV §9]); then the archetype-room prop sets.
- **Weapons:** six families, viewmodel-priority (the player stares at them 12+
  hours); custody biographies as texture stories per Book V §4.
- **Vehicles:** background/kinematic only (mag-freight, crawlers, barges) — no
  drivable systems exist; model as moving architecture.
- **UI:** the two diegetic hands as design-system components (Figma library → 
  engine widgets); paper/stamp/Chargehand assets vector-first.
- **GN assets:** §9's artist track — thumbnails in-house, finals by the ONE hand;
  print-resolution masters; stroke-cluster layer separation deliverable.
- **Marketing:** from the shot library only [BVIII.5 §12]; produced at Gold, not
  before (except the announcement trailer's GN content, which is game content).

# SECTION 6 — TOOLS (WHERE EACH FITS)

- **Engine:** per the Engine Gate (§7.0) — current stack: Three.js/React/Vite +
  Rapier (Phase A); **UE5** = Phase B target for the Steam campaign build if the
  gate confirms the port.
- **Blender:** all 3D DCC (modeling, retopo, rigging, animation, GN parallax
  plates); the mega-kit's home.
- **Substance 3D Painter:** wear-biography texturing (the biography written first,
  painted second). **Substance Designer:** the master materials (concrete family,
  metal, canvas) + the stain/Chargehand decal libraries.
- **RealityCapture / Quixel / Fab:** base grunge and surface references ONLY —
  silhouettes bespoke **LAW** [BIV §15]; Fab additionally as the marketplace for
  vetted utility assets (never visible silhouettes).
- **Photoshop:** GN finishing, texture touch-up, marketing comps. **Figma:** the
  UI design system (both diegetic hands), journal layouts, Steam page comps.
- **DaVinci Resolve:** trailer edit + grade (the chapter LUTs live here too —
  one grading truth for game and marketing). **Premiere/After Effects:** optional
  alternates; AE specifically for GN motion-graphics prototyping (stroke-cluster
  timing tests) before engine implementation.
- **Cascadeur:** physics-assisted keyframe polish for heavy machine animation
  (Devastator mass). **Mixamo:** grey-box placeholder locomotion ONLY — nothing
  Mixamo ships (originality law; the doctrine gaits are authored).
- **GitHub:** source of truth (already); Issues + Projects for the backlog at solo
  scale; Actions for CI/deploy of the link. **Perforce:** only if/when UE5 +
  team >5 (binary-heavy UE projects outgrow Git LFS; the gate's port plan includes
  the P4 migration line-item).
- **Jira:** not at solo scale (process overhead is a burnout vector §12); adopt at
  team ≥10. **Notion/Obsidian:** optional mirrors — **the md-ledger system
  (PROJECT_STATE/CURRENT/CHANGELOG/TODO + the bibles) is the project's actual
  production database and REMAINS the source of truth** [PRODUCTION CANON] — it is
  versioned, greppable, AI-native, and already works.

# SECTION 7 — UNREAL ENGINE PIPELINE (AND THE ENGINE GATE)

## 7.0 THE ENGINE GATE **[PRODUCTION CANON — the plan's biggest decision]**

**Decision point:** end of Phase 4 (the slice shipped as the link). **The question:**
does the full campaign continue on the web stack (wrapped for Steam) or port to UE5?
**Default if undecided: continue the web stack** (momentum beats aspiration; the
slice will have proven it). **Port to UE5 only if ≥2 are true at the gate:** (a) the
slice's visual ceiling demonstrably blocks the one-frame test at campaign scope
(Nanite-class pour detail needed); (b) team has grown to ≥5 with UE experience;
(c) publisher/funding requires it. **What ports cheaply if yes:** every bible is
engine-agnostic by construction; the md-ledger, the asset library (Blender/Substance
sources), the GN pipeline, and all design data survive; code does not — budget a
full systems re-implementation (Phases 2–3 repeated at ~60% cost with the design
de-risked). **What the web stack must prove to keep the campaign:** streaming at
chapter scope, the lighting law's look on integrated GPUs, and save robustness.

## 7.1 The UE5 pipeline (governs Phase B if ported; the web stack mirrors every
convention at its own tier)

- **Folder structure:** `/Content/EOE/` → `Core/` (systems) · `Chapters/CH<nn>/`
  (levels per BVI §16) · `Kits/` (Gravity mega-kit, district kits) · `Characters/` ·
  `Enemies/<Family>/` · `Props/Hero/` + `Props/Kit/` · `GN/` · `Cine/` · `UI/` ·
  `Audio/` · `Materials/Masters/`.
- **Naming:** the established conventions govern — levels `EOE_CH<nn>_<District>_
  <Function>` [BVI §16], cinematics `EOE_CIN_CH<nn>_<name>`, shots `S<nn>_<NAME>`
  [BVIII.5 §13]; assets `<type-prefix>_EOE_<name>_<variant>` (SM_/SK_/M_/MI_/T_/
  BP_/WBP_/NS_/LS_).
- **Blueprint organization:** Blueprints for content glue (encounters, interactions,
  level scripting); **C++ architecture** for the cores: controller/feel, AI
  doctrine states, wave director, save, streaming — one plugin-style module per
  Book V system so the systems map 1:1 to their specs.
- **Animation pipeline:** posture-first state machines [BVII §14]; shared family
  locomotion; Control Rig gesture libraries; MetaHuman Animator for cast facial
  only, subtract-cleaned [BVIII §14].
- **Material pipeline:** the three masters + decal library [BIV §15]; placement-
  curve-driven aging; the green-ration histogram as an editor tool (build it in
  Phase 2 of the port — it protects everything).
- **World Partition:** chapter worlds, data-layer states, landmark HLODs
  art-reviewed [BVI §16]. **Streaming:** seams behind thresholds/cages/pages;
  the four bars as preload **LAW**.
- **Sequencer:** master-per-cinematic, library-numbered shots, four-lens rigs
  [BVIII §14, VIII.5 §13].
- **Lighting:** Lumen + manual EV anchors, scenario swaps for boss phases
  [BIV §15, BVI §16].
- **Optimization workflow:** budget dashboards per §11; per-tranche perf gates.
- **Packaging:** Steam build via automated pipeline; the Phase A save-import
  path tested from day one of the port.

# SECTION 8 — TEAM STRUCTURE

- **SOLO (current reality):** one person + AI-assisted production. Roles collapse
  into a weekly rotation discipline: systems days / content days / review days
  (the review day runs the QC batteries — the bibles replace the missing
  colleagues). Communication: the md-ledger IS the standup. Approval: the
  checklists are the approver; the six-line protocol header is the status report.
  Hard rules: one tranche in flight at a time; outsource the two things solo
  cannot fake (§9: the GN hand, the score); protect the burnout budget (§12).
- **SMALL INDIE (5–10):** solo + GN/2D artist + 3D generalist ×2 + audio designer
  + engineer. The creative director role stays with the founder; the bibles
  onboard every hire (Book 0 → Lock → domain book — the loading order is the
  training program). Reviews: weekly tranche review against QC batteries;
  approvals: creative director + the relevant battery.
- **MID-SIZE (20–40):** discipline leads mirror the bible shelf 1:1 (one lead per
  book — the shelf was written as the org chart in waiting); a dedicated Canon
  Office (1–2 people) runs compliance and the PROJECT_STATE ledger; producers run
  tranches as pods (level + enemy + audio + QA per pod).
- **AAA:** pods per chapter tranche; central strike teams (engine, animation,
  cinematics); the Canon Office becomes a department; the manifesto chain (each
  book's final section) is literally the review-culture document. At every scale:
  **the bibles govern; the QC batteries are the definition of done; PROJECT_STATE
  is the single amendment ledger.**

# SECTION 9 — OUTSOURCING STRATEGY

*Solo-scale rule: outsource identity-critical craft you cannot fake and commodity
volume you should not spend life on; keep systems, levels, and taste in-house.*

- **The GN artist — the project's #1 outsource/collaboration hire** (or deepest
  in-house craft investment): ONE hand, mixed fingerprint per BIII §14 **LAW**;
  engaged from Phase 2 (thumbnails with the writer-director = the user+AI);
  QC: every page against BIV §10's law + the board-to-page lineage [BVIII §3].
- **Music/score:** original composition commissioned ONCE against the final cue
  list (the motif ledger [B0 §12] is the brief); the grand-ambient-orchestra
  register [Book V §19.1]; QC: the silence law — every cue's entry justified.
- **Voice acting:** small cast, enormous weight — cast per BIII's references;
  record late (text freeze), except the 400-name recitation (record once, full
  [Lock canon]) and Sela's reference hymn; QC: speech-shape compliance.
- **Concept art:** GPT-Image covers the concept layer by canon (the prompt
  libraries); human concept pass only for the hero props/bosses if budget allows.
- **Motion capture:** NOT used — the animation law is keyframe performance
  [BVII §12]; Cascadeur assists instead.
- **3D props:** kit-prop volume outsourceable at mid-scale+ with the archetype
  recipes as the spec; hero props stay in-house **LAW**.
- **QA:** playtesting outsourced early and often (the exit-word protocol is the
  script); compliance QA stays in-house (it requires the bibles).
- **Localization:** post-text-freeze, standard vendors; the serif/Chargehand
  typography constraints documented in the kit; subtitle-description track
  included [Book V §14].
- **Marketing:** trailers cut in-house (the shot library makes it cheap);
  store/PR support outsourced at launch window.

# SECTION 10 — QUALITY ASSURANCE

- **The two QA tracks:** COMPLIANCE (the bible batteries — IV-QR's 25, V's 100+50,
  VI's 100, VII's 100, VIII's 100, VIII.5's 50; run at content review, not just
  ship) and PLAY (bugs, feel, pacing, comprehension).
- **Per-discipline workflows:** gameplay (feel-canon timing tables as automated
  tests; encounter heatmaps vs. orbit-and-spoke law); art (one-frame spot checks:
  random screenshot → 25-question audit); animation (posture-state 1:1 audit);
  audio (silence-law audit: any music without a completed meaning = bug);
  performance (§11 dashboards per tranche); UI (shape-doubling + scale gates);
  accessibility (the Book V §14 matrix — ship-blocking); narrative (Canon Office:
  dates, names, speech-shapes, open questions); level design (Compass Test per
  chapter [BVI §5]); cinematics (exit-word protocol + frame QA).
- **Bug severity:** S1 blocker (crash/progression/save-loss) · S2 canon violation
  (a green-ration breach IS an S2 — identity bugs outrank polish bugs
  [PRODUCTION CANON]) · S3 functional · S4 polish. Content lock requires zero
  S1–S2.
- **Regression:** the slice is the eternal regression suite — every phase ends by
  replaying the first 30 minutes (if the opening degrades, the game is degrading).
- **Playtesting schedule:** grey-box tests in Phase 2 (feel), dressed tests each
  tranche (pacing + exit-words), blind-newcomer tests at Alpha/Beta (the Compass
  Test), accessibility panels at Beta.

# SECTION 11 — PERFORMANCE TARGETS **[PRODUCTION CANON — budgets]**

- **Phase A (web link):** min hardware = 2020-class integrated GPU laptop, 8 GB
  RAM; target 60 fps @1080p (30 fps floor on min with governor fallback);
  initial payload ≤200 MB, chapter streams ≤150 MB each; time-to-play ≤30 s;
  memory ≤1.5 GB tab budget; draw calls ≤1,500/frame (instancing-heavy by style);
  texture budget 2K atlases standard / 4K hero-prop only; polys: enemies ≤60k,
  hero props ≤120k, kit modules ≤40k; load seams 0 visible **LAW**.
- **Phase B (Steam/UE5 if ported):** min = GTX 1060/RX 580-class @1080p30 low;
  recommended = RTX 3060-class @1080p60 high; Lumen budgets per BIV §15 (few
  lights by law = headroom); Nanite hero pours; texture 4K standard/8K hero;
  loading: chapter entry ≤10 s cold, seams 0 visible **LAW**.
- **Both phases:** input-to-photon ≤70 ms (A) / ≤50 ms (B) **LAW** [Book V §2.1] —
  the feel budget outranks the beauty budget, always.

# SECTION 12 — RISK ANALYSIS

| Risk | Likelihood | Mitigation |
|---|---|---|
| **Overscoping** (10 chapters, 4 bosses, wave mode — solo) | HIGH | the tranche re-scope gate after T1: if cost-per-chapter > sustainable, the pre-authorized fallback is scope shaping WITHIN canon (shorter optional fields, fewer Standing Watch pages, Tier 3 cuts) — never cutting locked beats; the slice ships regardless (it is self-contained value) |
| **Feature creep** | MED | Book 0's law is the shield: every addition passes the Director's Checklist [Book V §18]; new features enter TODO as Tier 3 by default, promoted only at phase boundaries |
| **Art inconsistency** | MED | the one-frame test + hex anchors + the histogram tool; GPT-Image concept layer keeps references canonical; ONE GN hand **LAW** |
| **Performance debt** | MED | budgets enforced per tranche, not at the end; the style is cheap by design — trust it |
| **Narrative bloat** | LOW | text is locked; the Canon Office audits additions; "deepen, never repeat" |
| **Production delays** | HIGH (life) | milestone-based plan (no calendar promises); the slice front-loads the deliverable; every tranche is shippable-adjacent |
| **Technical debt** (legacy prototype code) | MED | Phase 1's excision + Phase 2's retune are debt-payment phases by design; the Engine Gate is the escape valve |
| **Burnout (solo)** | HIGH | the rotation discipline (§8); one tranche in flight; the rest-after-peak law applies to the developer too — the plan schedules fallow weeks after each milestone [PRODUCTION CANON]; the ledger externalizes memory so breaks don't cost context |
| **Canon drift across a long build** | MED | the loading order every session; the QC batteries as definition-of-done; PROJECT_STATE amendments only |
| **The Engine Gate chosen wrong** | MED | the gate has criteria + a default + a costed port plan (§7.0) — either path is survivable by design |

# SECTION 13 — MILESTONE CHECKLISTS (MEASURABLE)

- **PROTOTYPE (= the covenant grey-box, Phase 2 exit):** ☐ controller timings pass
  the automated table ☐ one wave sequence completable ☐ five-state AI observable
  ☐ leaf-save round-trips ☐ HUD defection functional ☐ 60 fps grey-box on min
  hardware ☐ "is the covenant fun ugly?" playtest = yes from 4/5 testers.
- **VERTICAL SLICE (Phase 4 exit — THE LINK):** ☐ §2.4's criteria all green ☐ the
  QC batteries pass ☐ GN-1 final ☐ the sigh + phantom response shipped ☐ the dawn
  hold lands (telemetry) ☐ deployed at the public link ☐ **the user has the link**.
- **ALPHA:** ☐ all chapters traversable ☐ all systems feature-complete ☐ four
  bosses staged per contract ☐ exit-words captured (may fail; re-stage budget
  live) ☐ Standing Watch 6 pages ☐ full playthrough recorded.
- **BETA/CONTENT LOCK:** ☐ zero S1–S2 ☐ text freeze ☐ localization in flight
  ☐ accessibility certified ☐ budgets green on min-spec ☐ Canon Office sign-off
  (open questions intact, discrepancies placed).
- **GOLD:** ☐ zero S1, S2 waived-none ☐ Steam build + achievements + cloud saves
  + save-import verified ☐ trailer suite delivered ☐ store assets shot-library-
  sourced ☐ day-one patch scoped or empty.
- **LAUNCH:** ☐ page live ☐ builds on both phases current ☐ support/patch
  pipeline warm ☐ the team (of any size) sleeps.

# SECTION 14 — STEAM RELEASE PLAN

**Sequence:** Steam page live at slice+polish (wishlists start when the link is
public — the link IS the demo funnel) → announcement trailer ("Still Here"
[BVIII §15]) → the web link doubles as the perpetual demo (Phase A = marketing
that plays) → Steam Playtest event with the Standing Watch build (wave mode =
ideal playtest content: replayable, spoiler-free) → demo = the slice, packaged
(Next Fest timing) → launch with the suite's remaining trailers. **Store assets:**
capsule = the poster master [BIV §14.12]; screenshots from the shot library only
**LAW**; the page's copy in the serif/paper voice (marketing speaks Ledger).
**Achievements:** the Top 25 memory beats [BIV.5 §16], quiet names, no kill-count
achievements **LAW**. **Cloud saves:** + the Phase A import path [Book V §13.6].
**Controller support:** full (Book V's dual-input law). **Localization:** launch
set EN + the market big-five as budget allows; subtitle-description track in all.

# SECTION 15 — POST-LAUNCH ROADMAP

Patches (S1s in days, S3+ in scheduled rollups); QoL from community feedback
(filtered through the Director's Checklist — player requests that violate canon
get the manifesto's gentle no); free content: Standing Watch pages (the designed
faucet [Tier 4]); DLC per Lock §22's law (inside the Accord Age or Deep
Inheritance; never resolving §19's mysteries without franchise sign-off);
expansion candidates: the held threads (Harrow's diaspora, the other continents'
Concessions); sequel planning: the archive, intact of record, in Voss's inventory
— the franchise has not finished with the man who invented the sigh [BII §XVII].
Community: the banned book as community identity (page-sharing, the Artist
discourse — the mystery is the marketing).

# SECTION 16 — THE EXECUTIVE PRODUCER'S MANIFESTO

*To the team — of one, or of one hundred.*

**How to avoid feature creep:** the game is finished being designed. Fourteen books
lock it. Every "what if we added—" is answered by the Director's Checklist, and the
checklist's hardest question is the cheapest to ask: *does it keep the losses felt,
or does it just spend attention?* New ideas are not enemies — they are Tier 3
entries in TODO.md, where good ideas wait patiently and bad ones evaporate.

**How to protect the creative vision:** load the order, every session — identity,
then facts, then craft. The vision does not live in anyone's memory or mood; it
lives in the shelf, versioned. When tired, do not improvise: read the wall. The
bibles were written precisely for the days when the person building the game
cannot remember why.

**How to know when something is "good enough":** it passes its battery. Not "it
could be better" — everything could be better. The batteries encode the difference
between *better* and *more*: a room that answers its five questions at 60 fps is
done, even if one more prop is imaginable. Ship the cheapest honest version; the
honest part is non-negotiable, the cheapest part is wisdom.

**When to cut features:** at gates, never in despair. The re-scope gate after
Tranche 1 exists so cutting is a planned instrument, not a midnight panic. Cut
Tier 3 before Tier 2, breadth before depth, optional fields before optional doors
— and never cut a locked beat: the beats are why the game exists.

**When to delay:** when a gate's criteria are red and the fix is known. A delay
with a plan is production; a delay without one is drift. Delays buy quality only
if the missing thing is named, budgeted, and tracked.

**When to ship:** when the checklist is green and the fear is merely fear. The
last ten percent of courage cannot be outsourced. The dawn hold does not need to
be perfect; it needs to be *present*, honest, and yours.

**How to finish the project:** the same way the Sowers work — one tract at a
time, at ruinous exchange rates, because the arithmetic of hope has never closed
and they do it anyway. One tranche in flight. Rest after the peak. Keep the
ledger. When the work stalls, do the smallest honest task on the list, because
momentum is planted, not summoned. And when it is done — when the link goes out
and someone you have never met stands in the stillwood for the first time and
turns their audio up because they think the silence is a bug, and then realizes
it isn't —

write the entry. Sign it.

*Still here.*

---

# SECTION 17 — PRODUCTION CANON REGISTER (THIS BOOK'S DECISIONS)

*Logged in PROJECT_STATE.md.*

1. **The slice definition:** "The Sigh & the Seedling" = Prologue + Ch.1 compressed,
   ~30 min, + one Standing Watch page (whose machine event is the demo's fightable
   boss) = the committed web-link deliverable (§2).
2. **The phase plan:** Sprints 0–4 mapped to Phases 0–4 → the link; Phase 5 chapter
   tranches T1–T5 with the re-scope gate after T1 (§3, §12).
3. **THE ENGINE GATE:** decision at slice-ship; default = continue the web stack;
   UE5 port criteria + costed port plan (§7.0).
4. **The md-ledger system remains the production database of record** (§6).
5. **Performance budgets** (Phase A/B numbers, §11); feel budget outranks beauty
   budget.
6. **QA doctrine:** canon violations are S2 bugs; the slice is the eternal
   regression suite; compliance QA = the bible batteries (§10).
7. **Outsourcing doctrine:** the GN hand and the score are the two identity
   outsources; mocap unused; hero assets in-house (§9).
8. **Marketing doctrine:** the link is the perpetual demo; wishlists open with the
   link; achievements = the Top 25 (§14).
9. **The developer-rest law:** fallow weeks after milestones; one tranche in
   flight (§12).

---

*— End of BOOK IX (Production Master Plan), Edition One — and end of the BOOK I–IX
roadmap. The shelf is complete: 0 · I · II · II.5 · III · IV · IV-QR · IV.5 ·
IV.5-QR · V · VI · VII · VIII · VIII.5 · IX. Production canon per §17 logged in
PROJECT_STATE.md. The next milestone is not a book. It is Sprint 0 — and after it,
the link. Amendments require a logged entry in PROJECT_STATE.md.*
