# ECHOES OF EDEN
## BOOK X — THE TECHNICAL DESIGN DOCUMENT
### Edition One · How the Game Is Built · 2026

*The final book. Governed by the complete shelf (Book 0 → II.5 → I–IX). This document
designs nothing and codes nothing: it converts every locked design decision into a
practical implementation architecture an experienced team could begin building
immediately. Specifications, not source; contracts, not tutorials.*

**The dual-target reality (per Book IX §7.0 — THE ENGINE GATE):** the slice ("The Sigh
& the Seedling") ships on the **existing web stack** (TypeScript/Three.js/React/Vite/
Rapier — the proven prototype foundation); **UE5 is the Phase B target** if the gate's
criteria fire. This TDD is therefore written as: (a) an **engine-portable architecture**
(systems as contracts with inputs/outputs/data), (b) the **UE5 implementation mapping**
the brief requires, and (c) **Phase A web-stack deltas** per section, marked `[WEB]`.
The architecture is identical in both lanes **LAW** — only the substrate forks. A
system whose design survives both engines is a system specified correctly.

**Binding technical laws inherited from the shelf (cited once, enforced everywhere):**
input-to-photon ≤70 ms (A) / ≤50 ms (B) — feel outranks beauty [Book V §2.1, IX §11];
zero visible loads [BVI §11]; 60 fps targets per Book IX §11; no AGI-style AI — tables
and doctrine only [Lock §3.5]; detection sense-honest, information radio-physical
[BVII §14]; canon violations are S2 bugs [Book IX §10]; the QC batteries are the
acceptance tests of record.

---

# SECTION 1 — PROJECT ARCHITECTURE

## 1.1 The architectural thesis

**Systems mirror the bibles 1:1.** Each Book V/VII system becomes one module with the
same name and section reference in its header — so the spec IS the documentation and
drift is grep-able. Three layers:

1. **CORE (C++ / `[WEB]` TS modules):** deterministic, hot, testable — controller &
   feel, damage/health, wave director, AI doctrine states, save/serialization,
   streaming, audio state machine, GN player runtime.
2. **CONTENT GLUE (Blueprint / `[WEB]` data-driven TS + JSON):** encounters,
   interactions, level scripting, cinematic triggers — everything a designer tunes.
3. **DATA (assets):** all tuning in data assets/tables — no magic numbers in logic
   **LAW** (Book V's ±20% tuning band requires data-side iteration).

## 1.2 Gameplay Framework (UE5 mapping)

- **UEOEGameInstance:** session root; owns subsystem lifetimes; the Phase A save-import
  gate; build/version stamp.
- **GameModes:** `EOE_GM_Campaign` (chapter flow, checkpoint rules), `EOE_GM_Watch`
  (Standing Watch: wave director in ledger-scoring mode, closed economy),
  `EOE_GM_FrontEnd` (the stillwood menu — a real level, per canon).
- **AEOEPlayerController:** input stack (contexts: Move/Combat/Read/Carry/Cinematic —
  Enhanced Input, one context per controller state family [Book V §2.15]); interaction
  arbitration (press vs. hold as authored data **LAW** [Book V §2.11]); camera damping
  during authored beats.
- **AEOECharacter (Asher):** movement component extended for the state table (walk/
  run/sprint/crouch/slide/vault/mantle/ladder/sling/wade/carry/lean/Read) — each state
  a discrete object with enter/exit costs; stamina & weight notches; the sigh-response
  as a timed modifier stack; the prosthetic as a first-class component (ring proximity
  sense, fine-work modifiers, firmware upgrade slots).
- **Pawn strategy:** enemies are `AEOEEnemyPawn` variants per FAMILY (not per unit —
  units are data [BVII taxonomy]); machines are `AEOEMachinePawn` (rail/berth-aware).
- **AEOEHUD / UMG stack:** thin — the HUD is the kit-bag widget tree (§12); HUD state
  machine has exactly two skins (Edge/Sower — the defection switch is a data swap).
- **PlayerState/GameState:** single-player-lean — PlayerState carries run statistics
  (journal marginalia); GameState carries chapter/world-ledger snapshot for save.
- **Subsystems (UGameInstanceSubsystem unless noted):**
  `SaveSubsystem` · `WorldLedgerSubsystem` (scars/cordons/chalk/plantings — the
  world's memory [Book V §13.3]) · `CovenantSubsystem` (protected-thing registry,
  wave director interface) · `TrustSubsystem` (hidden per-character scalars, bark
  gates) · `PerceptionTierSubsystem` (Read tiers, evidence counters) ·
  `GNSubsystem` (page runtime, four-bars preload orchestration) ·
  `AudioStateSubsystem` (meaning-state score logic — never combat-state **LAW**) ·
  `CanonSubsystem` (dev-only: green-ration histogram, budget dashboards, compliance
  toggles) · `WorldSubsystem`: `EncounterSubsystem` (per-world: staged spawns,
  doctrine states, filed-state writes).

## 1.3 Plugin & module strategy

One plugin per bible-system cluster: `EOECore` (types/tags/save), `EOELocomotion`,
`EOECombat`, `EOEAI`, `EOECovenant`, `EOEGN`, `EOEAudio`, `EOEUI`, `EOEDev` (tools,
never ships). Dependency rule: plugins depend on `EOECore` only; cross-system talk via
interfaces + gameplay events (no plugin references a sibling **LAW** — enforced by
module DAG check in CI).

## 1.4 Coding standards & philosophies

- **C++ philosophy:** cores are engine-thin (logic in plain classes testable without
  UWorld where possible); UPROPERTY-exposed tuning only via data assets; no tick where
  an event serves; every system owns a `Debug()` dump.
- **Blueprint philosophy:** BP never implements rules — it *sequences* them (an
  encounter BP orders spawns and doctrine states; it cannot change what a drill IS).
  BP depth limit 2 (BP calling BP calling BP = refactor signal).
- **`[WEB]` mapping:** same three layers — `src/core/*` (TS modules mirroring
  subsystems, framework-free), `src/content/*` (data-driven scene/encounter configs,
  JSON-schema-validated), `src/data/*` (the same data tables, JSON). React only via
  the store (established pattern); Three.js scene graph owned by `core/render`.

## 1.5 Naming (binding, both lanes)

Per the established conventions: levels `EOE_CH<nn>_<District>_<Function>` [BVI §16];
cinematics `EOE_CIN_*`, shots `S<nn>_*` [BVIII/VIII.5]; assets `<prefix>_EOE_<name>`
(SM_/SK_/M_/MI_/MF_/T_/BP_/WBP_/NS_/LS_/DA_/DT_/BT_/BB_); C++ `EOE` prefix; tags
`EOE.` root (§11). `[WEB]` files kebab-case mirroring the same trees.

# SECTION 2 — PROJECT STRUCTURE

```
/Content/EOE/
  Core/            (framework BPs, base classes, input contexts)
  Blueprints/      (content glue only — encounters, interactions, triggers)
  Characters/      (Asher + named cast: SK, rigs, materials, DA)
  Enemies/         (per FAMILY: Wardenry/ Machines/ Mulchers/ Evergreen/)
  Bosses/          (D2/ Harrow/ D3000/ Array/ — hero-asset track)
  Animations/      (per skeleton family; montages; blendspaces)
  Materials/       (Masters/ Instances/ Decals/ — the 3 masters + libraries)
  Audio/           (MetaSounds/ Beds/ Motifs/ VO/ Foley/ — §13)
  UI/              (KitBag/ EdgeHUD/ Journal/ Fonts/ Icons/)
  Levels/          (CH00_P … CH11_E, WATCH_<page>, FRONTEND)
  Props/           (Hero/ Kit/ — the eight hero props first)
  VFX/             (NS_ Niagara; the sigh MPC materials)
  Cinematics/      (per chapter: LS masters + S<nn> subs)
  GN/              (pages as UMG/materials; stroke-cluster data)
  Developer/       (scratch — CI blocks references FROM /EOE into /Developer)
  Testing/         (functional test maps, timing-table tests)
/Plugins/EOE*      (§1.3)
/Source/EOE/       (game module: framework classes only)
/docs/             (the bibles + ledgers — the database of record [Book IX §6])
```
`[WEB]` mirrors: `client/src/{core,content,data,ui,levels,gn,audio,dev}`.

# SECTION 3 — GAMEPLAY FRAMEWORK (SYSTEM CONTRACTS)

*Format: system → owner module → spec source → implementation notes. All tuning
data-side. Every system: save-compatible (§10), debug-dumpable (§15).*

- **Movement** → `EOELocomotion` → Book V §2 (the state table IS the class list).
  Discrete state objects; transition costs as data (exit-to-fire 0.35 s etc. — the
  automated timing-table test asserts the whole table each build **LAW** [Book IX
  §13 Prototype gate]). Camera: FOV 70/74, bob/sway as post-anim modifiers with
  accessibility zeroing. `[WEB]`: retune existing controller to the table; kill
  slide-cancel (logged debt).
- **Interaction** → `EOECore` → Book V §2.11. One interactable interface: prompt
  class (paper/amber skin), input mode (press/hold + duration as authored data),
  moral-grammar flag (the permit prompt and the governor are THIS system's two most
  important instances — their durations are content, versioned).
- **Weapons** → `EOECombat` → Book V §4. Weapon = DataAsset (family, timings ±10%
  locked band, ammo class, fouling curve, upgrade steps) + viewmodel anim set +
  ballistics profile (hitscan ≤30 m / projectile beyond; spread/choke cones; honest
  penetration). Reloads: interruptible state machines preserving stage (half-fed
  tube persists). The seed-thrower's payloads = projectile DataAssets with NO
  anti-personnel damage type possible (the damage-type enum simply lacks it —
  Lock §20.12 enforced by the type system **LAW**).
- **Combat/Damage** → `EOECombat` → Book V §3. Damage pipeline: hit → material/
  plate-arc resolution (arcs as physical asset shapes, not RNG) → Breath vs Binding
  routing → feedback events (spall, flinch). No damage numbers anywhere on screen
  **LAW**.
- **Health/Armor** → Book V §3.4–3.5. Double-rule model: Breath (regen-to-segment
  timer) + Binding (dressing-gated); constant 4+4 segments all game **LAW**; plate
  as material state with visible degradation stages.
- **Inventory/Kit** → Book V §2.13/§11. Notch-based (light/field/laden) — no grid
  Tetris; resources as counters with per-chapter caps; the critical-path floor
  (LAW 11-A) as a cache-populate hook, invisible.
- **Objectives** → journal-voiced single line; hidden in signature spaces (zone
  flag); the epilogue's no-objective state is a GameMode flag **LAW**.
- **Scanning (the Assessor's Read)** → `EOECore` → Book V §2.14. Read mode = input
  context + focus-priority post effect (NO outlines — a subtle sharpening/contrast
  layer on tagged evidence) + journal annotation events; tier gates as data;
  the ring: proximity query against verdance-tagged actors, 15 m, pulse-rate
  gradient via MPC.
- **Dialogue/Barks** → data-table lines with condition tags (trust gates, chapter,
  doctrine state, the Hesitation); VO hooks; subtitle pipeline with the
  sound-description track [Book V §14].
- **Puzzles** → content-glue BPs over core verbs (counterweight = physics
  constraint + lever interface; tide = world-clock subsystem; memory puzzles =
  journal cross-reference queries) — no bespoke puzzle engine **LAW** (puzzles are
  the world being itself [Book V §9]).
- **Save** → §10. **Progression** → `TrustSubsystem` + `PerceptionTierSubsystem` +
  bench upgrade appliers (all data-driven; no XP fields exist anywhere **LAW**).
- **Wave Mode (Standing Watch)** → `EOECovenant` in ledger mode → Book V §12:
  wave director consumes page DataAssets (arena, doctrine variants, watch
  condition); scoring = banked-growth ledger (kills have no score field **LAW**);
  the Long Night = interval/inflow curve swap; banking-out = an interaction.
- **Pause/Game Flow** → journal spread as pause (the game world time-dilates to 0
  but audio beds continue at −12 dB — the world persists; menus are diegetic);
  chapter flow as a data-defined graph (enables slice/demo builds by graph subset).

# SECTION 4 — AI ARCHITECTURE

- **The doctrine stack:** per-FAMILY Behavior Trees [BVII §14] — trunk = the five
  states (Unaware/Curious/Engaged/Searching/**Filed**); family subtrees: Wardenry
  escalation drills + bounding/suppression services; Mulcher price-engine (a
  utility scorer over job-cost blackboard values); Machines = threat-TABLE (literally
  a data table of posture→behavior rows — no BT improvisation branches **LAW**);
  Evergreen = schedule-driven (the Custodian "AI" is a timeline, not an agent).
- **Blackboards:** shared family boards — keys: `TargetLKP`, `AlertLevel`,
  `CommanderAlive`, `PairPartner`, `LeashAnchor` (escorts/covenant mirror),
  `JobCost/JobTake` (Mulchers), `ScheduleIndex` (Evergreen), `HesitationFlag`
  (post-Ch.6 roll, ~1/6, never on Breach/elites [BVII §9.6]).
- **EQS:** cover queries weighted by arena grain (V-6 lane data authored per arena
  as splines/volumes — EQS consumes level data rather than inventing tactics);
  flank queries restricted to architecture's own lanes **LAW**.
- **Navigation:** navmesh per chapter world; doctrine-weighted areas (Wardenry
  lane-affinity, Mulcher threshold-affinity, machine rail-first with off-rail
  cost multipliers); authored retreat paths as spline corridors (V-6's no-dead-end
  law is DATA, not luck).
- **Perception:** sight = cone + light-level term (torch carriers self-blind
  outside their pool — the lamp-leash [BVII §14]); hearing = noise-event bus fed
  by the player's noise column [Book V §2.15]; NO omniscient aggro — alerts
  propagate via **radio actors** (audible, interruptible: a radio call is a
  world event with a duration and a source the player can stop) **LAW**.
- **Target selection:** policy tables (machines: sapling-priority rows [Lock §17];
  Wardenry: threat-by-doctrine; Mulchers: extraction-first).
- **Search:** procedure choreography — search = a planned route of investigation
  POIs (chalk/torch/radio anim events at each), then the Filed transition writes
  to `WorldLedgerSubsystem` (cordon spawn, rotation increment) **LAW**.
- **Boss logic:** bosses are NOT BT agents — each is a bespoke phase state machine
  consuming arena data (the D-2's threat-table rows + cordon stage; Harrow's
  position/outcome duel machine — no HP variable exists on her **LAW** [Book V
  §7.5]; the D-3000's escalation + rig-state listener; the Array = the schedule
  + station timeline). Boss checkpointing at phase boundaries [Book V 7-A].
- **Communication:** commander influence = blackboard fact broadcast on a squad
  channel; the CHECK (two-beat all-stop on commander loss) is a squad-level
  scripted interrupt [BVII §9.4].
- **Optimization/LOD AI:** ≤16 alive **LAW** caps the problem; distant agents run
  schedule-only ticks (rotation rails); off-screen anim disabled; no crowd system
  exists or is needed (the Republic is empty — the design IS the optimization).
- `[WEB]`: same architecture as TS state machines + data tables; the existing
  wave-AI codebase refactors toward the five-state trunk in Phase 2.

# SECTION 5 — ANIMATION PIPELINE

- **Skeletons:** `SK_EOE_Human` (cast + all Wardenry/Mulcher units — one skeleton,
  proportions via retarget profiles); `SK_EOE_Quad` (D-1/D-2), `SK_EOE_D3000`,
  `SK_EOE_DroneS/C`, `SK_EOE_Custodian/Steward`; viewmodel skeleton
  `SK_EOE_Arms` (the ivory hand a first-class bone chain with the
  steady/tremble constraint rig [BVIII §14]).
- **Control Rig:** gesture libraries per named character (the wrist-seam touch,
  the wrist-clasp, goggles — BIII tells as rig-space assets); machine rigs with
  mass-honest constraint chains (Cascadeur-assisted keyframe import).
- **IK Rig/Retargeter:** human family shares anims via retarget profiles (Line→
  Escort→Elite are wear-variants, not anim variants — elites get an override set
  of ~12 anims: shorter bounds, no-announce alerts [BVII §5]).
- **Animation Blueprints:** posture-first — one ABP per skeleton; AI state maps
  1:1 to posture family **LAW** [BVII §12]; transition anims un-skippable (state
  change waits for the body — legibility over snappiness **LAW**).
- **Montages:** interaction verbs (carry/plant/dress/shovel — cadence-gated: input
  faster than the rite is ignored **LAW** [Book V §2.11]); reload stages;
  drag-outs/retrievals.
- **Blend spaces:** locomotion per weight notch; lean/peek additives.
- **Motion Matching:** NOT used **[decision]** — the cast is small, gaits are
  doctrinal (authored interval-regular walks ARE the characterization); MM's
  naturalism would sand off the drill. Revisit only if Phase B mocap policy
  changes (it won't — no mocap [Book IX §9]).
- **Facial:** named cast only (visor law **LAW**); MetaHuman Animator capture,
  subtract-cleaned [BVIII §14]; enemies have zero facial rigs.
- **Procedural:** feet/slope/recoil only **LAW** [BVII §12].
- **Death/defeat:** humans — grounded, brief, radio-still-talking variants;
  machines — power-down/seal sequences (never ragdoll comedy **LAW**);
  crew-retrieval pair anims.
- **Traversal:** vault/mantle two-hand sets (ivory hand leads — animation
  showcase [Book V §2.6]); sling climbs with weight-creak sync.
- `[WEB]`: glTF pipeline from the same Blender sources; posture-state machines in
  TS; montage-equivalents as timeline clips with input gates.

# SECTION 6 — CINEMATIC PIPELINE

Sequencer masters per locked cinematic (`EOE_CIN_*`), shots as `S<nn>_` subs
[BVIII.5 §13]; four-lens Cine Camera rigs with locked filmback — the kit enforced
at rig level (no fifth focal creatable) **LAW**; Camera Rig Rail speed-clamped
≤0.5 m/s; ONE crane asset, two lifetime uses **LAW**; Control Rig for scene
performance; MetaHuman Animator per §5; Movie Render Queue = marketing only
(in-game = real-time always **LAW**); dialogue timing: VO-driven sequences with
breath-based hold markers ("hold 3 breaths" as named track events [BVIII §3]);
**GN integration:** `GNSubsystem` owns page runtime — UMG/material pages, stroke-
cluster reveal via material params on draw-order curves (200–400 ms/cluster),
input-paced advance + 6 s fallback, the four bars = a preload contract (async
loads issued at bar 1, asserted complete by bar 4 **LAW** [Book V §19.4]);
**gameplay transitions:** control handoff protocol — surrender on player motion
(controller lerps into the rail), return before fade with ≤0.5 s input latency,
position/FOV matched within one lens step **LAW** [BVIII §11]. `[WEB]`: the same
shot data drives a TS camera director; GN pages as layered canvas/WebGL quads.

# SECTION 7 — RENDERING PIPELINE

- **Nanite:** hero pours + boss arenas + the eight hero props; kit modules Nanite
  where dense, traditional LOD where thin [BIV §15].
- **Lumen:** GI + reflections; the one-source law is Lumen's best case; **manual
  EV anchors per district — auto-exposure OFF LAW** [BIV §15]; emissive-aperture
  lighting recipe per space class.
- **VSM:** high-res pages on aperture blades; softness via source size only **LAW**.
- **Virtual Textures:** mega-pour surfaces; RVT for Belt ground blends.
- **Reflections:** Lumen + planar ONLY on Edge civic mirror floors (power doubled
  [BIV §8]); provincial surfaces never reflect **LAW**.
- **Post:** ONE shared PP volume + per-chapter LUTs [BIV §5]; grain 0.10 locked
  [Book V §19.3]; no per-cinematic additions **LAW**; vignette/CA per the filmic
  stack only.
- **Exposure/Grading:** EV anchors as data per district; LUT swaps at chapter
  seams (the palette handover [BVI §11]).
- **Volumetric fog:** one global profile per district + local aperture volumes;
  god-rays via story-bearing apertures only **LAW**.
- **Lighting scenarios:** boss phase swaps + world-state variants (burned Hall)
  as scenario levels [BVI §16].
- **Optimization:** few lights by law; the style is the perf plan.
- `[WEB]`: the established filmic pipeline (GTAO/IBL/grain) retuned to the hex
  anchors + LUT approach; one-source discipline enforced by scene lint (the
  `CanonSubsystem` equivalent flags multi-key-light scenes).

# SECTION 8 — WORLD BUILDING

World Partition per chapter world; 128 m cells exterior, Level Instances for
interiors [BVI §16]; **Data Layers** for world states (`DL_BURNED`, `DL_EPILOGUE`,
scar layers — never duplicate maps **LAW**); streaming seams behind thresholds/
cages/rides/pages with the four-bars preload contract; landscape ONLY outside
arenas (interiors all mesh **LAW**); water: tide states as material+collision
data pairs on the world clock (Driftmark's passable geometry swaps on tide
phases [BVI §1.2]); **PCG:** stillwood ranks (metronomic-option scatter) + debris
fields ONLY — nothing PCG faces the camera as hero content [BIV §15]; modular
kits: the Gravity mega-kit as the instancing backbone (HISM everywhere);
navigation rebuilt per data-layer state; large-world: HLOD landmark impostors
art-reviewed **LAW** [BVI §16]. `[WEB]`: chapter = route-level code-split bundle;
sub-level streaming via async scene-graph mounts at the same seam contract.

# SECTION 9 — GAMEPLAY SYSTEMS (THE CONTRACT TABLE)

*Every system's formal contract. Networking: NONE anywhere — single-player pure
**LAW** [Book V 0.5-B]; the only network surface is the async Standing Watch
score table (a REST post of a signed score blob) and save-cloud sync (Phase B).*

| System | Inputs | Outputs | Depends on | Data | Save | Failure state | Debug |
|---|---|---|---|---|---|---|---|
| Locomotion | input stack, stamina, weight | state, noise events, camera mods | — | state table DA, curves | stance only | fall to walk state | state overlay, timing test |
| Read | hold input, tagged evidence | annotations, tier progress | Journal | evidence tags, tier DA | annotations, tiers | degrade to Tier 1 visuals | evidence heatmap |
| Weapons | fire/reload input, ammo | damage events, noise, fouling | Damage | weapon DA, ballistics | ammo, fouling, mods | jam verb (never softlock) | cone/penetration draw |
| Damage/Health | damage events | Breath/Binding deltas, feedback | — | plate assets, curves | segments, dressings | death→checkpoint ≤5 s | god/segment HUD |
| Covenant/Waves | wave DA, protected registry | spawn orders, bank ticks, audio states | Encounter, AI | page/wave DAs | wave index, banked | protected-thing death → authored fail-retry | wave timeline view |
| Encounter/AI | perception, doctrine data | behavior, barks, filed writes | WorldLedger | family BTs, tables | doctrine snapshots | Filed (never stuck-aggro) | five-state gizmos |
| WorldLedger | filed writes, scars, plantings | world-state queries, DL flips | Save | ledger schema | FULL | orphan-entry GC | ledger inspector |
| Trust | story beats, optional acts | bark gates, bench gates, vignettes | Save | per-char scalars | scalars | floor at story minimum | trust readout (dev) |
| Journal/UI | annotations, docs, stats | spreads, map, lore drawer | Read, Save | facsimile assets | FULL | re-derivable from ledger | page dump |
| GN player | page assets, input | pages, preload signals | Streaming | cluster curves | seen-flags | fallback auto-advance | cluster scrubber |
| Audio state | meaning-state events | score/bed/mix states | Covenant, Chapter | motif ledger DA | current state | silence (the safe default IS canon) | state timeline |
| Save | all subsystem snapshots | slots, checkpoints | ALL | schema v1 | — | rollback to last valid | save diff tool |
| Watch scoring | bank/spend events | ledger screen, score blob | Covenant | page DAs | high scores | local-only fallback | score trace |

# SECTION 10 — SAVE SYSTEM

**Architecture:** snapshot-composed — each subsystem serializes its own versioned
chunk (`FEOESaveChunk{SystemId, Version, Blob}`); the SaveSubsystem composes
chunks + header (build, chapter, playtime, thumbnail = the GN splash ref **LAW**
[Book V §13.1]). **Serialization:** UE SaveGame + custom versioned structs; `[WEB]`
the same schema as versioned JSON (schema-validated) in IndexedDB + export-file
(the signed journal file for A→B migration [Book V §13.6]). **Checkpoints:**
per the boundary list [Book V §13.2]; checkpoint = full snapshot (small by
design — the world ledger is the only big chunk; target ≤2 MB). **Autosave:**
boundary-triggered, never mid-combat (except wave boundaries), never during
rests **LAW**. **Manual:** the leaf verb at shelters only — 12 journal-page
slots + shadow-slot for chapter replay **LAW**. **Version compatibility:**
per-chunk versioning with migration functions; unknown-chunk-preserve (forward
tolerance); the eternal-slice regression suite includes save-load across
builds **LAW** [Book IX §10]. **Future expansion:** chunk registry is open —
DLC pages/NG+ add chunks without touching the composer.

# SECTION 11 — DATA ARCHITECTURE

- **Primary Data Assets:** `DA_Weapon`, `DA_EnemyUnit` (family+class+unit fields
  per BVII §4), `DA_Boss`, `DA_Chapter` (flow graph node: levels, budgets row,
  color script LUT, silence shot id, shelter id), `DA_WatchPage`, `DA_Upgrade`,
  `DA_HeroProp`, `DA_GNSequence`, `DA_Cinematic` (shot list with S-numbers).
- **Data Tables:** barks (condition-tagged), documents/facsimiles, Chargehand
  glossary, machine threat-tables (the actual policy rows), economy caps per
  chapter, timing tables (the automated feel test's source).
- **Gameplay Tags:** the taxonomy IS the tag tree — `EOE.Enemy.Wardenry.Line`,
  `EOE.State.Filed`, `EOE.Evidence.Chargehand`, `EOE.Verb.Hold.Governor`,
  `EOE.Zone.Signature` (objective-hiding), `EOE.Audio.MeaningState.*`.
- **Enums/Structs:** damage types (note the ABSENT anti-personnel-explosive type
  **LAW**); segment states; doctrine states; watch conditions.
- **Curves:** feel curves (accel/decel), fouling, wave intervals, trust→bark
  thresholds, stroke-cluster reveal timing.
- **Config:** scalability tiers (Phase A envelope as the floor tier); accessibility
  defaults; the governor's hold-vs-rite accessibility variant as config **LAW**.
- **Localization:** string tables from day one; serif/grotesk/Chargehand font
  routing by locale-aware style set; subtitle-description track as a first-class
  string table [Book V §14].

# SECTION 12 — UI FRAMEWORK

CommonUI stack; **two skins, one tree:** the widget hierarchy is skinned
Edge-grotesk-amber (prologue) vs Sower-kit-bag-paper (Ch.1+) — the defection is
a style-provider swap, proving the "UI defects" beat technically trivial and
narratively enormous. HUD: double-rule health widget, stencil counters, prompt
chips, sigh-vignette — all data-bound, no polling. Menus: the journal spread
(pause), settings-as-equipment-tags, the Registry drawer (facsimile viewer —
renders document ASSETS, never restyled text **LAW**). Map: the hand-annotated
compass-journal (renders `WorldLedger` + annotation data as drawn strokes).
Inventory: notch/kit display only (no grid). Accessibility: the full Book V §14
matrix as a settings schema with per-toggle hooks (holds→toggle conversion at
the input layer; the governor's rite variant flagged); shape-doubled color
tokens in the design system **LAW**; UI scale 100–200%; input icons per device
via CommonUI input routing; full controller navigation. `[WEB]`: same tree in
React on the store; identical style-token system (the Figma library is the
shared source [Book IX §6]).

# SECTION 13 — AUDIO IMPLEMENTATION

**MetaSounds:** procedural beds (stillwood designed-absence = filtered room-tone
synth with pressure LFO — never a nature bed [B0 §12]); the sigh/anti-sigh as
parameterized chord assets (descending/ascending, duration-scaled to cascade
size); weapon reports with nave-height convolution sends. **Cues/attenuation:**
surface-true footstep switcher (12 material sets [Book V §19.2]); pair-cadence
spatialization. **Ambient zones:** per district kit, with occlusion portals at
thresholds (the mix IS the door **LAW** [BVI §11]). **Reverb:** volume-driven,
heel-echo ≥2 s in monuments **LAW**. **Occlusion:** portal-based + material
absorption. **Dynamic music:** the `AudioStateSubsystem` — MEANING states
(covenant-active / aftermath / revelation / rest / silence-locked), never
combat-aggro states **LAW**; motif ledger as data (hymn/bass/piano/anti-sigh/
cartridge ownership rules enforced by state validity table); the four bars =
a state that mutes everything and fires the preload contract. **Dialogue:**
VO with close-mic convention; Grimwood's nearest-mix rule as a priority lane
**LAW** [BIII §2.8]. **Mixing:** the protected thing's bus ducks UNDER nothing
during covenants **LAW**; −60 LUFS room-tone floor everywhere [Book V §19.3];
loudness-normalized to -23 LUFS integrated. `[WEB]`: WebAudio graph mirroring
the same state machine; convolution via impulse sets per space class.

# SECTION 14 — OPTIMIZATION

Budgets per Book IX §11 (binding). **CPU:** AI ≤16 agents + schedule-tick
distants; event-driven systems (tick audit in CI — new tickers need sign-off).
**GPU:** the ration is the budget (few lights, one volumetric, HISM instancing);
per-district EV anchors kill exposure thrash. **Memory:** chapter-scoped asset
lifetimes; GN pages unloaded post-sequence except thumbnails. **Streaming:**
seam contract (§8); the four-bars assert. **Shaders:** master-material discipline
= tiny permutation space; PSO precache on chapter load. **Draw calls:** ≤1,500
(A) via atlasing + instancing; Nanite handles (B). **LOD:** silhouette-preserving
(the 100 m fog test at LOD2 is an art-QA gate **LAW**). **Occlusion:** thresholds
as portals by design [BVI §16]. **Texture:** 2K standard/4K hero (A); 4K/8K (B).
**Lighting:** scenario counts capped per level (≤2 scenarios resident).
**Animation:** off-screen URO aggressive; ≤16 full-tick ABPs by the headcount
law. **Target hardware:** Book IX §11 verbatim. **Profiling:** per-tranche perf
gates with Insights/`[WEB]` tracing dashboards; the budget dashboard is a
`CanonSubsystem` panel — budgets visible during play, always (what is measured
survives).

# SECTION 15 — DEBUGGING & TOOLS

Console/URL-param commands: state teleports (`eoe.chapter CH05`), doctrine
visualizers (`eoe.ai.states`), timing-table run (`eoe.feel.test`), green-ration
histogram (`eoe.canon.green`) [BIV §15 — build it early **LAW**], budget HUD
(`eoe.perf`), silence-audit (`eoe.audio.meaning`), save diff (`eoe.save.diff`),
encounter heatmap record (`eoe.heatmap` — the orbit-and-spoke QA [BVI §8.7]).
Cheats (dev-only plugin, stripped from ship): god segments, ammo floor override,
tier unlock, wave skip. Logging: structured categories per plugin; canon
violations log at Error (they are S2). Visual debugging: five-state gizmos,
lane/retreat spline draw, spawn-stage markers, noise-event ripples. QA tools:
automated timing suite, screenshot-battery harness (random frames → the
25-question checklist queue), save/load soak, the eternal-slice replay script.

# SECTION 16 — BUILD PIPELINE

**Git (current, Phase A):** trunk-based with short-lived feature branches; PRs
even solo (the PR description template = the six-line protocol header; CI is
the reviewer); tags per milestone. **Git LFS:** textures/audio/GN sources now;
**Perforce:** only at UE5-port + team ≥5 [Book IX §6] — migration line-item in
the gate's port plan. **Branch strategy:** `main` (always shippable — the link
deploys from main), `tranche/*` (one in flight **LAW**), `hotfix/*`.
**CI (GitHub Actions):** typecheck/tests/timing-table on PR; nightly: full build
+ save-soak + budget snapshot + the slice replay; deploy: main → staging link,
tagged → the public link. **Packaging:** Phase A = static bundle + asset CDN
with cache-busted chapter chunks; Phase B = UE BuildGraph → Steam depots via
steamcmd, branches: `internal`/`playtest`/`default`. **Versioning:**
`MAJOR.TRANCHE.BUILD` (2.x = post-shelf era per CHANGELOG); save chunks carry
independent versions (§10). **Release builds:** ship config strips `EOEDev`;
symbol upload; crash reporting (Phase B: standard UE crash pipe; Phase A:
window.onerror → endpoint with user consent).

# SECTION 17 — VERTICAL SLICE IMPLEMENTATION (SPRINTS → TASKS)

*Book IX Phases 1–4 decomposed. Effort in solo focused-days (fd); AI-assisted
production assumed. Acceptance = the phase gates [Book IX §13] + listed criteria.*

**SPRINT 1 — FOUNDATION (≈10–15 fd):** MP excision by compilation (delete
server/, Net.ts, lobby/MP UI; fix until clean) [5 fd] · retitle (repo per privacy
decision, package, README, launch.json, deploy) [2 fd] · CI + staging-link
pipeline [2 fd] · legacy-content dev-flag quarantine [1 fd] · docs rewrite
stubs [2 fd]. **Deps:** Sprint 0 decisions. **Accept:** clean SP build at
staging link; zero MP symbols; CI green.

**SPRINT 2 — SLICE SYSTEMS (≈25–35 fd):** controller retune to the state table +
timing tests [6 fd] · Breath/Binding + damage pipeline + plate arcs [4 fd] ·
P-11/C-9 feel pass (viewmodel, reload stages, ballistics) [5 fd] · covenant loop
(green unit, bank ticks, wave director v1) [5 fd] · Line Warden + Surveyor
(five states, drills, staged spawns, radio actors) [6 fd] · Read Tier 1 +
journal annotations [3 fd] · leaf-save/checkpoint v1 (schema, slots) [3 fd] ·
kit-bag HUD skeleton + defection swap [3 fd]. **Deps:** S1. **Accept:** the
covenant grey-box gate (fun ugly, 4/5 testers; timings green; 60 fps grey-box).

**SPRINT 3 — SLICE CONTENT (≈30–40 fd):** Gravity mega-kit v1 (12 pour + 6
gantry modules) [6 fd] · stillwood kit (architecture-tools build) [5 fd] ·
Prologue tract (living forest key, work-camp dress, permit terminal hero prop,
D-2 event staging) [8 fd] · Ch.1 (viaduct nest shelter systems, regrowth arena
per archetype A, D-1 husk, patrol layouts incl. one elite) [8 fd] · environmental
storytelling pass (P/1 anchors, 5Q dressing) [4 fd] · lighting per color scripts
P/1 + EV anchors [3 fd]. **Deps:** S2 systems. **Accept:** both levels walkable
at dress quality; budgets green; Compass Test passed by 4/5 fresh testers.

**SPRINT 4 — ASSEMBLY & POLISH (≈25–35 fd):** GN-1 integration (page runtime,
cluster reveal, four-bars preload; art per the §9 track — thumbnails start in
S2) [6 fd] · cold open + title + menu-as-stillwood [3 fd] · the dawn hold +
epigraph state [2 fd] · Standing Watch page 1 + machine event [5 fd] · audio
pass (sigh/response, beds, bass motif, mix floor) [5 fd] · bench/upgrade +
Coil scene [3 fd] · accessibility gates + settings [4 fd] · QC batteries + soak
+ telemetry hooks (exit-word capture form) [4 fd] · **deploy the public link**
[1 fd]. **Deps:** S3. **Accept:** Book IX §2.4 in full; **the user holds the
link**.

**Post-slice:** the Engine Gate review [Book IX §7.0], then Tranche 1.

# SECTION 18 — RISK MANAGEMENT (TECHNICAL)

| Risk | Mitigation |
|---|---|
| Legacy code fights the new architecture | Sprint 2's retune is a rewrite-in-place with the timing suite as the safety net; delete freely — the prototype's value is proof, not code |
| Feel-canon regressions | the automated timing table runs every PR **LAW** |
| Web-perf ceiling on integrated GPUs | the ration IS the renderer budget; scalability floor tier tested weekly; governor fallback pattern (proven in prototype) |
| Streaming hitches at seams | the four-bars/threshold preload contract with CI assert; chapter chunks sized in the build report |
| AI legibility bugs (states unreadable) | posture-1:1 law enforced by review; five-state gizmo in every playtest build |
| Save corruption across versions | per-chunk versioning + migration tests in the nightly soak |
| GN runtime jank (cluster reveal) | AE prototype first [Book IX §6]; cluster curves as data; fallback to simple crossfade per page (graceful, logged) |
| UE5 port underestimation (if gated) | the port plan re-runs S2–S3 at ~60% with designs de-risked; nothing in Phase A couples content data to the web engine (JSON data tables port verbatim) |
| Solo bus-factor | the md-ledger + this TDD are the continuity system; every system debug-dumpable; the six-line header every session |

# SECTION 19 — QUALITY ASSURANCE (TECHNICAL)

Technical QA: CI gates (typecheck, tests, timing table, module-DAG, tick audit,
budget snapshot). Gameplay QA: grey-box gates + heatmaps + exit-words. Rendering
QA: screenshot battery → 25-question queue; green-ration histogram per chapter;
EV-anchor drift check. Animation QA: posture-state 1:1 audit; LOD2 fog test.
Audio QA: silence audit (music without meaning-state = fail); mix-floor
verification. Performance QA: per-tranche gates on min-spec hardware (a real
2020 integrated-GPU laptop lives on the desk **LAW**). Automation: save soak,
slice replay, budget dashboards, schema validation on all JSON/DataAssets.
Regression: the eternal slice — every phase ends replaying the first 30 minutes
[Book IX §10] **LAW**.

# SECTION 20 — THE TECHNICAL DIRECTOR'S MANIFESTO

*To every engineer who joins this project after us.*

**Maintain clean architecture** the way this world pours concrete: load paths
visible. A system whose data flow you cannot sketch is a system that will fail
under someone else's hands. Mirror the bibles — when the code's map matches the
design's map, every future question has an address.

**Avoid technical debt** by paying it at gates, on purpose, like the re-scope
gate pays scope. Debt logged in the ledger with a date is engineering; debt
remembered vaguely is decay. And when you inherit code that fights the
design — the prototype, someday your own — delete with gratitude. Its job was
proof, and proof does not require preservation.

**Keep Blueprint and C++ responsibilities clear** with one sentence: *rules in
C++, sequences in Blueprint, numbers in data.* The moment a rule lives in a
graph or a number lives in code, iteration dies quietly. Designers tune data;
content sequences systems; systems enforce law. Three layers, no leaks.

**Preserve performance** by trusting the design — the ration is the frame
budget, the emptiness is the memory plan, the ≤16 agents are the CPU headroom.
This game is cheap by conviction. Your job is not to optimize it later; it is
to refuse, daily, the small violations that would make "later" necessary. The
feel budget outranks the beauty budget. Latency is canon.

**Protect maintainability** for the developer most likely to inherit this
codebase: you, in eight months, tired, mid-tranche, having forgotten
everything. Write for that person. Debug dumps on every system. The ledger
current. Names that answer questions. The six lines, every session.

**Ensure every technical decision supports the creative vision** by asking the
engineer's version of the only question this project recognizes: *does this
implementation keep the losses felt?* A save system that loses a leaf breaks a
promise. A stutter at the dawn hold spends the game's rarest currency. A
snappy transition that skips the body's honesty tells a small lie about weight.
We are not building an engine demo. We are building a quiet machine for
keeping accounts honestly — so keep yours the same way.

Ship the link. Then ship the game.

*Still here.*

---

# SECTION 21 — TECHNICAL CANON REGISTER (THIS BOOK'S DECISIONS)

*Logged in PROJECT_STATE.md.*

1. **Dual-lane architecture law:** engine-portable contracts; UE5 mapping + `[WEB]`
   deltas; architecture identical, substrate forks (§0).
2. **Three-layer law:** rules in C++/core-TS, sequences in BP/content-TS, numbers
   in data; plugin-per-system with DAG enforcement (§1).
3. **The subsystem roster** (Save/WorldLedger/Covenant/Trust/PerceptionTier/GN/
   AudioState/Canon/Encounter) (§1.2).
4. **Type-system canon enforcement:** no anti-personnel damage type exists; no HP
   field on Harrow; no XP fields anywhere; no kill-score field in Watch scoring
   (§3, §4).
5. **Radio actors:** alert propagation as audible, interruptible world events (§4).
6. **Motion matching rejected; no mocap; procedural = feet/slope/recoil only** (§5).
7. **The four-bars preload contract** (async issued bar 1, asserted bar 4) (§6).
8. **Save architecture:** per-chunk versioned snapshots; ≤2 MB checkpoints; A→B
   signed journal export (§10).
9. **The gameplay-tag taxonomy mirrors the enemy/system taxonomy** (§11).
10. **CI law:** timing-table on every PR; nightly slice replay + save soak + budget
    snapshot; main always deploys the link (§16).
11. **Sprint task decomposition** with solo-scale estimates (S1 ≈10–15 fd, S2
    ≈25–35, S3 ≈30–40, S4 ≈25–35 → the link) (§17).
12. **The min-spec laptop on the desk** rule (§19).

---

*— End of BOOK X (Technical Design Document), Edition One — and end of the shelf
entire: 0 · I · II · II.5 · III · IV · IV-QR · IV.5 · IV.5-QR · V · VI · VII ·
VIII · VIII.5 · IX · X. Sixteen documents. The design is finished; the plan is
finished; the architecture is finished. What remains is the work — Sprint 0 on
the user's word, then Sprints 1–4, then the link, then the game. Amendments
require a logged entry in PROJECT_STATE.md.*
