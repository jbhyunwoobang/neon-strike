# ECHOES OF EDEN — SPRINT 001 IMPLEMENTATION PLAN
### "FOUNDATION" · The First Playable Foundation · Official Sprint Document · 2026-07-04

*Authority: Book IX (Production Master Plan) §3 Phases 1–2 + Book X (TDD) §17 Sprints
1–2, adapted to this brief's foundation-only scope. Canon governs everything; nothing
here redesigns anything.*

**THE LANE RULING (read first).** The user's standing order — restated in this sprint's
brief — is **an accessible link anyone can open online and play**. UE 5.6 cannot ship a
browser link (no supported web export; pixel streaming = per-player server costs), and
production canon already decided this: **the Engine Gate [Book IX §7.0] defaults to the
existing web stack** (TypeScript / Three.js / React / Vite / Rapier — the proven
prototype at `client/`). Sprint 001 therefore executes on the **WEB LANE**. Every
system below is built to Book X's dual-lane contracts, and each section carries a
`[UE5 MIRROR]` note so the plan ports verbatim if the Gate ever fires at slice-ship.
"Playable executable" on this lane = **a deployed production build at a private
staging URL** — the embryo of the final public link. This ruling is logged in
PROJECT_STATE.md.

**Sprint discipline (Book X §16):** trunk-based Git, one sprint branch, PRs with the
six-line protocol header, `main` always deployable. Estimates are solo focused-hours
(AI-assisted). The timing-table test (Book V §2 feel canon) is this sprint's most
important deliverable after the build itself.

---

## SECTION 1 — SPRINT OVERVIEW

- **Objective:** a clean, packaged, deployable single-player foundation — controller,
  camera, interaction, UI shell, save foundation, one graybox proving level with door/
  elevator/puzzle/checkpoint/transition, and dev tools. No combat, no enemies, no
  bosses, no cinematics.
- **Duration estimate:** **82–112 focused hours** (≈ 2.5–3.5 solo weeks at 6 h/day;
  task table §2 sums to 97 h nominal).
- **Dependencies (SPRINT 0 GATES — must close first, ≈2 h of user decisions + 4 h
  execution):**
  - **G0.1 — Repo privacy decision (USER).** The standing blocker. Recommendation:
    flip private now; the public link later exposes only built artifacts, never the
    bibles. *Blocks: first commit of Sprint 001 (seven uncommitted books ride along).*
  - **G0.2 — Lane confirmation (USER, this document's ruling).** Web lane per above.
  - **G0.3 — Hosting target.** Recommendation: keep GitHub Pages (already configured)
    for staging; final public link host decided at slice-ship. Zero new cost.
  - **G0.4 — Rename scope.** Product-facing strings → ECHOES OF EDEN this sprint;
    repo/package rename deferred to the privacy decision's execution (same commit).
- **Deliverables:** D1 clean SP codebase (MP excised) · D2 controller+camera to the
  Book V §2 state table (foundation subset) · D3 universal interaction framework ·
  D4 UI shell (menu/pause/settings/save-load) · D5 versioned-chunk save foundation ·
  D6 `EOE_DEV_PROVING` graybox level (door, freight elevator, counterweight puzzle,
  checkpoint leaf, threshold transition) · D7 dev tools suite · D8 CI + deployed
  staging build · D9 the automated timing-table test.
- **Success criteria:** all §13 checklist items green; timing table passes; 60 fps on
  the min-spec integrated-GPU laptop in the graybox; staging URL playable start-to-
  finish keyboard+mouse AND gamepad; save/load round-trips across a page refresh.
- **Definition of Done (per task):** implemented → typechecks → its §11 test cases
  pass → runs at 60 fps in the proving level → committed with the listed message →
  demo-able at the staging link. A task without its test is not done.

## SECTION 2 — TASK BREAKDOWN

*Priority: P0 blocker-path · P1 sprint-critical · P2 sprint-complete. Difficulty
1–5. Risk L/M/H. Sequenced top-to-bottom; parallelizable tasks share a phase letter.*

**PHASE A — CLEAN GROUND (Book IX Phase 1)**

| # | Task | Pri | Hrs | Deps | Diff | Risk | Output · Commit |
|---|---|---|---|---|---|---|---|
| A1 | Execute G0.1–G0.4 (privacy flip, rename strings, hosting confirm); commit the seven books + ledgers | P0 | 2 | user | 1 | L | private repo, canon committed · `chore: execute sprint-0 gates; commit bible shelf (Books V–X)` |
| A2 | **MP excision by compilation:** delete `server/`, `client/src/engine/Net.ts`, MP UI (`Lobby.tsx`, `MultiplayerMenu.tsx`, room flows in `App.tsx`/`store.ts`); fix until `tsc` clean; remove `render.yaml` | P0 | 8 | A1 | 2 | M | SP-only codebase · `refactor: excise multiplayer (server, Net, lobby/MP UI) per Sprint 1` |
| A3 | Quarantine legacy arcade content behind `?dev=arcade` flag (maps, enemy roster, weapons stay compilable, unreachable in normal flow) | P1 | 3 | A2 | 2 | L | quarantine flag · `refactor: quarantine legacy arcade content behind dev flag` |
| A4 | CI pipeline: GitHub Actions — typecheck + test + build on PR; deploy `main` → staging URL; build-size report | P0 | 4 | A1 | 2 | L | green CI, staging link · `ci: typecheck/test/build + staging deploy on main` |
| A5 | Folder restructure to §3 (`core/ content/ data/ ui/ levels/ dev/`); move engine files; barrel exports | P1 | 4 | A2 | 2 | M | §3 tree in place · `refactor: restructure client/src to EOE core/content/data layout` |

**PHASE B — THE CONTROLLER (Book X §3 Locomotion, foundation subset)**

| # | Task | Pri | Hrs | Deps | Diff | Risk | Output · Commit |
|---|---|---|---|---|---|---|---|
| B1 | **Movement state machine:** discrete states walk/run/sprint/crouch (+stubs for later states); speeds & transitions from `data/locomotion.json` (the Book V §2.15 table verbatim); stamina (sprint 12 s, regen walk 8 s); jump (0.5 m, pre-load 0.15 s); NO slide yet (combat-adjacent — Sprint 002) | P0 | 10 | A5 | 4 | M | state-machine controller · `feat(core): locomotion state machine per Book V §2 table` |
| B2 | **The timing-table test:** automated headless test asserting every locomotion number (speeds, accel 0.25 s, decel 0.3 s, exit-to-fire stub, stamina) against the JSON; wired into CI | P0 | 5 | B1 | 3 | M | `npm test` timing suite · `test(core): locomotion timing-table assertions (feel canon)` |
| B3 | **Camera system:** FOV 70 (74 sprint lerp), head bob (≤1.2/2.4 cm @2 Hz band, toggle), landing settle by drop class, shake bus hard-capped 0.5°, lean stub, damped-look mode for authored beats; settings-driven | P0 | 8 | B1 | 3 | M | camera rig module · `feat(core): first-person camera — fov/bob/settle/shake-cap per canon` |
| B4 | **Footsteps & surfaces:** surface-tag raycast → 4 material sets for graybox (concrete/metal/grate/dust); mix-forward gain in "monument" audio zones (stub zone) | P1 | 4 | B1 | 2 | L | surface footsteps · `feat(audio): surface-true footsteps, 4 graybox sets` |
| B5 | **Input mapping:** action-map layer (KBM + gamepad) with contexts Move/Interact/UI; rebind-ready schema in `data/input.json`; interaction input buffering (120 ms buffer, hold-vs-press resolver) | P0 | 6 | A5 | 3 | M | input layer · `feat(core): input contexts + rebindable action maps (KBM/pad)` |

**PHASE C — INTERACTION & SAVE (Book X §3 Interaction/Save)**

| # | Task | Pri | Hrs | Deps | Diff | Risk | Output · Commit |
|---|---|---|---|---|---|---|---|
| C1 | **Universal interaction framework:** `Interactable` interface (prompt text/skin, press vs authored-hold duration, enable predicate, focus events); camera-center trace (2.2 m, sphere 0.15 m); diegetic edge-prompt UI (paper chip placeholder); no world icons LAW | P0 | 8 | B5 | 3 | M | interaction core · `feat(core): universal interaction framework (trace, press/hold, prompts)` |
| C2 | **Interactables set 1:** animated door (borrowed-door 2.2 m, hinge audio, blockable), button/lever (state + latched), readable lore object (journal-stub overlay), collectible (pickup verb 0.8 s) | P1 | 6 | C1 | 2 | L | 4 interactables · `feat(content): door, lever, lore-read, pickup interactables` |
| C3 | **Freight elevator:** cage + gate (gate-slam), call/ride logic, moving-platform physics (player parenting on Rapier), cage travel as streaming-valve stub | P1 | 8 | C2 | 4 | H | working freight cage · `feat(content): freight elevator w/ gate, ride physics, valve stub` |
| C4 | **Save foundation (versioned chunks):** `SaveSubsystem` — per-system chunk registry `{id, version, blob}` + header (build, level, playtime); IndexedDB + export/import JSON file; autosave on checkpoint; manual quicksave (dev) | P0 | 8 | A5 | 4 | H | save core, round-trip proof · `feat(core): versioned-chunk save system (IndexedDB + file export)` |
| C5 | **Checkpoint system:** checkpoint volume → full snapshot ≤2 MB; death/reload stub (fall volume) → restore ≤5 s; the leaf-save interactable (placeholder art, real verb: 2 s hold at a bench) | P0 | 5 | C4 | 3 | M | checkpoints + leaf stub · `feat(core): checkpoint snapshots + leaf-save interactable` |
| C6 | **Loading transition:** threshold-seam pattern — compression corridor triggers async preload of next zone; fade-none (audio-forward door grammar); a visible-load assert in dev overlay (zero visible loads LAW) | P1 | 6 | C3 | 3 | M | seam transition · `feat(core): threshold-seam async zone transition (zero visible loads)` |

**PHASE D — UI SHELL (Book X §12 two-skin tree, Sower skin first)**

| # | Task | Pri | Hrs | Deps | Diff | Risk | Output · Commit |
|---|---|---|---|---|---|---|---|
| D1 | UI style tokens (paper/ink/amber hex anchors from BIV §5; serif titles only; stamp transitions 150 ms, no slides LAW); replace legacy menu styling | P1 | 4 | A5 | 2 | L | token system · `feat(ui): EOE style tokens (paper/serif/stamp grammar)` |
| D2 | Main menu (title over placeholder grey noon; Continue/New/Settings/Quit-to-link-home), pause (journal-spread placeholder, resumes clean), settings (video: quality tiers, FOV 65–90, bob/shake toggles · audio: 4 sliders · controls: rebind + gamepad · accessibility: subtitle scale 200%, hold→toggle master) persisted to save chunk | P0 | 10 | D1,C4 | 3 | M | menu/pause/settings · `feat(ui): main/pause/settings shell w/ persisted options` |
| D3 | Save/Load UI: 12 journal-page slots + quicksave slot; load from menu & pause; slot metadata (playtime, location) | P1 | 4 | D2 | 2 | L | slots UI · `feat(ui): save/load journal slots` |
| D4 | HUD placeholder: double-rule health bar (static), prompt chip, subtitle strip (paper lower-third); hidden-by-default in "signature" zones (zone flag stub) | P2 | 3 | D1 | 1 | L | HUD skeleton · `feat(ui): HUD placeholder (double rule, prompts, subtitles)` |

**PHASE E — THE GRAYBOX & DEV TOOLS**

| # | Task | Pri | Hrs | Deps | Diff | Risk | Output · Commit |
|---|---|---|---|---|---|---|---|
| E1 | **`EOE_DEV_PROVING` graybox** built to §8's design (scale-table-true volumes, all stations); collision + surface tags + audio zones | P0 | 12 | B*, C* | 3 | M | the proving level · `feat(levels): EOE_DEV_PROVING graybox (12-station foundation gym)` |
| E2 | **Dev tools:** FPS/frametime graph, debug menu (`~` console + URL params), collision wireframe toggle, interaction trace visualizer, perf stats (draw calls, memory), god-mode (no-clip fly = free camera), level restart, quick save/load, teleport-to-station, AI-viz placeholder panel | P1 | 8 | E1 | 3 | L | `eoe.*` tool suite · `feat(dev): debug console, overlays, freecam, quick save/load` |
| E3 | **Packaging:** production build ≤ size budget (report in CI), deployed to staging URL, tested on min-spec laptop + one phone-browser smoke check (playability not required on mobile; must not crash) | P0 | 4 | all | 2 | M | the packaged staging build · `build: production package + staging deploy (sprint-001 exit)` |
| E4 | Sprint exit: §13 checklist run, §11 regression pass recorded, retro notes (§14), ledgers updated, tag `v2.2.0-sprint001` | P0 | 3 | E3 | 1 | L | sprint closed · `docs: sprint-001 exit checklist + retro; tag v2.2.0-sprint001` |

**Total: 97 h nominal (82–112 band).**

## SECTION 3 — FOLDER STRUCTURE (created in A5; the Book X §2 tree, web lane)

```
client/src/
  core/          # RULES (Book X three-layer law) — engine-portable logic
    locomotion/  # state machine, stamina, camera rig
    interact/    # interaction framework, trace, prompts
    save/        # chunk registry, IndexedDB, export
    streaming/   # zone loader, seam valves
    audio/       # state machine, zones, footsteps
    input/       # contexts, action maps, buffering
    debug/       # console, overlays, asserts (stripped from ship builds)
  content/       # SEQUENCES — level scripts, interactable configs, zone graphs
    proving/     # EOE_DEV_PROVING definitions
  data/          # NUMBERS — locomotion.json, input.json, settings schema, budgets.json
  levels/        # geometry/scene builders per level (graybox kit)
  ui/            # React shell: menu/pause/settings/slots/HUD (two-skin tokens)
  legacy/        # quarantined arcade content (A3) — deleted at slice-ship
  dev/           # dev-only harnesses, test maps
docs/sprints/    # this file + successors; retro notes
```
*Why:* the three layers keep rules/sequences/numbers separated (Book X §1 LAW);
`legacy/` makes the quarantine visible and deletable; `data/` is the designer-tuning
surface and the timing test's single source of truth.
**[UE5 MIRROR]** = `/Content/EOE/{Core,Blueprints,Data,Levels,UI,Developer}` +
`/Plugins/EOE*` exactly per Book X §2.

## SECTION 4 — PROJECT CONFIGURATION

- **"Plugins"/dependencies:** keep three/rapier/react/vite/zustand; ADD: vitest (the
  timing suite), idb-keyval (save), playwright (E3 smoke). REMOVE: socket.io & all MP
  deps (A2).
- **Settings:** `data/settings.schema.json` — video tiers (Low/Med/High mapping to
  render scale, shadow res, AO on/off), FOV 65–90 (default 70), toggles (bob, shake,
  motion blur off by default), audio (master/world/UI/VO), input (rebinds, gamepad
  curves), accessibility (subtitle 200%, hold→toggle master, photosensitivity cap).
- **Rendering config:** the established filmic pipeline retuned — grain 0.10 LOCKED,
  hex-anchor ambient palette, single-key-light discipline lint (dev warn).
- **Collision channels (Rapier interaction groups):** WORLD_STATIC · WORLD_DYNAMIC ·
  PLAYER · INTERACT_TRACE · TRIGGER_VOLUME · DEBUG. (Enemy channels reserved,
  documented, unused this sprint.)
- **Default maps:** boot → MainMenu (placeholder stillwood grey) → `EOE_DEV_PROVING`.
- **Scalability:** three tiers; min-spec tier is the CI-reported default assumption.
- **Packaging:** `vite build` + size report (budget: ≤80 MB this sprint — no chapter
  assets yet; the 200 MB canon budget is slice-scope); source maps to staging only.
- **Developer settings:** `?dev=1` enables console/overlays; ship build strips
  `core/debug` via build flag.
- **Version control:** `.gitattributes` LFS for `*.png/hdr/glb/wav` from this sprint
  forward; `.gitignore` verified for `dist/`, IndexedDB dumps.
- **[UE5 MIRROR]:** Enhanced Input, CommonUI, custom collision channels EOE_Interact/
  EOE_Trigger, DefaultMaps set, Shipping strips EOEDev — per Book X §1–2.

## SECTION 5 — ARCHITECTURE SPLIT (the brief's "Blueprint vs C++", web-lane form)

- **"Blueprint" (= `content/` configs + level scripts):** interactable placements &
  parameters, zone graphs, puzzle wiring, checkpoint volumes, menu flow. *Reasoning:*
  designer-tunable sequencing, no rules.
- **"C++" (= `core/` modules, port-critical):** locomotion, camera, interaction
  resolution, save, streaming, input, audio state. *Reasoning:* deterministic, hot,
  timing-tested — these are the Book X plugin cores and the UE5 port surface.
- **Data-driven (= `data/`):** every number (speeds, duration, budgets, prompts'
  hold-times — the permit-prompt/governor grammar depends on authored durations being
  DATA). *Reasoning:* Book V's ±20% tuning band + the timing test need one source.
- **Later-C++ candidates flagged now [UE5 MIRROR]:** the wave director, AI doctrine,
  GN runtime — Sprint 002+; their interfaces are stubbed in `core/` this sprint so
  contracts exist before implementations.

## SECTION 6 — PLAYER CONTROLLER (implementation plan)

Movement: state objects per Book V §2.15 rows (walk 1.5 · run 3.4 · sprint 5.2 m/s ·
crouch 0.8, height 1.05 m), accel 0.25 s / decel 0.3 s with 1–2 frame settle; slope
handling ≤40°; step-offset 0.35 m. Jump: 0.5 m, 0.15 s pre-load crouch, air drift
≤10%, landing classes (safe ≤3 m settle 0.2 s; heavy 3–5 m settle 0.6 s + stamina
−25%; injury/lethal stubs logged for Sprint 002 health). Sprint: 12 s burn / walk-8 s
regen; FOV 70→74 lerp 0.3 s; breath audio tail ≥6 s burns. Crouch: toggle or hold
(setting). Camera: §2 B3 scope — bob bands, settle, the 0.5° shake ceiling enforced
in the bus (clamps, logs violations as S2). Interaction trace: camera-center sphere
trace 2.2 m radius 0.15 m, 10 Hz + on-look-delta; focus/defocus events drive prompt
chip. Cursor: locked pointer in play; freed in UI; gamepad = soft cursor in menus
only. Head bob OFF toggle, motion-blur OFF default (accessibility law). Footsteps per
B4 (cadence from velocity, surface from tag). Input buffering: 120 ms action buffer;
hold-resolver distinguishes press (<180 ms) vs authored-hold (per-interactable
duration) — the moral-grammar plumbing, foundation of the permit prompt later.
**Explicitly deferred (stubs only):** lean, slide, vault/mantle, carry, Read mode,
weapon states — Sprint 002+ per Book X §17.

## SECTION 7 — INTERACTION SYSTEM (universal framework)

One interface: `Interactable { id, promptKey, mode: press | hold(duration) | toggle,
enabled(ctx), onFocus/onBlur, onInteract(ctx), saveChunk? }`. Registry + spatial
index; trace resolves nearest-in-cone; prompts render as the paper chip (skin token —
the Edge skin arrives with the Prologue, Sprint 003+). Implementations this sprint:
**door** (state machine closed/opening/open/blocked; hinge-polish audio hook),
**button/lever** (momentary vs latched; emits signals consumed by content wiring),
**computer/terminal stub** (opens a readable overlay — the permit-terminal ancestor),
**elevator** (C3 — call panel + cage gate as two linked interactables),
**collectible** (0.8 s crouch verb, inventory-counter stub), **lore object**
(journal-stub reader; facsimile-viewer contract documented for the Registry drawer).
Future compatibility: the interface IS Book X's contract — planting, watering,
chalk, shovel, the leaf, the governor are all `hold(duration)` instances with
authored durations; nothing needs redesign, only content.

## SECTION 8 — THE GRAYBOX LEVEL: `EOE_DEV_PROVING`

*A 12-station "foundation gym" laid out as a linear loop, built scale-table-true
[BIV §2] so spatial feel is validated now — monumental → threshold → pocket, the
game's whole grammar in graybox. ~8–10 min first walk. All primitive geometry +
three flat materials (grey/amber/paper) + surface tags.*

1. **SPAWN — the pocket (2.8 m ceiling):** wake at a bench (leaf-save station,
   checkpoint 0); settings-check placard.
2. **THE CORRIDOR (6 m × 9 m nave):** locomotion runway — walk/run/sprint metrics
   painted on floor (dev decals); footstep surface changes mid-length.
3. **THE STAIR & DROP COURT:** jump/landing classes tested (1 m / 2.5 m / 4 m
   platforms); fall-volume reload demo at the 9 m pit (checkpoint restore proof).
4. **THE DOOR ROOM:** the animated 2.2 m door + lever; a locked door showing the
   enabled-predicate prompt state.
5. **THE MONUMENT HALL (24 m × 24 m × 30 m):** scale-law proving volume — one
   aperture "blade" light; audio zone flips to monument reverb (heel echoes);
   HUD-hide zone flag test; insignificance read.
6. **THE PUZZLE — the counterweight (Book V §9 mechanical class):** a freight gate
   is dead; the counterweight cradle is empty; the player finds the weight crate
   (pickup-verb), loads the cradle (hold-verb), throws the lever — the gate opens.
   All evidence in-room LAW; resettable.
7. **THE ELEVATOR SHAFT:** the freight cage (C3) — call, gate-slam, 12 m ride with
   the streaming-valve stub firing mid-ride (dev overlay proves async load).
8. **THE THRESHOLD SEAM (C6):** an 18 m compression corridor triggering zone-B
   preload; pressure-change audio at the jamb; the zero-visible-load assert.
9. **ZONE B — THE BALCONY POCKET:** rest-class station: bench + the leaf-save
   (manual save proof) + a lore object (journal-stub read).
10. **THE RETURN LOOP:** a second route back (the two-route rule rehearsed) via a
    crouch gallery (2.4 m under-croft, ≤90 s law's testbed).
11. **THE COLLECTIBLE NOOK:** light-asymmetry hidden alcove (guidance-by-light
    rehearsal) with the collectible.
12. **EXIT — MENU RETURN:** end placard → clean return to main menu (state teardown
    proof), completion stats printed by dev overlay.

Lighting: three setups only — grey-noon skylight, one amber pool (pocket warmth),
one blade (the hall) — the one-source discipline rehearsed in graybox. Objectives:
a dev placard chain (no objective UI beyond the single journal line stub).

## SECTION 9 — UI ROADMAP

Build order: tokens (D1) → settings (the risk item: persistence + apply-without-
restart) → main menu → pause (must freeze sim, not audio beds — the world persists
at −12 dB [Book X §3]) → save/load slots → HUD placeholder → dev console (E2, shares
the overlay root). Developer console: `~` toggle, command registry (`eoe.help`),
history; commands in §10. Debug overlay: corner FPS/frametime always-available via
`?dev=1`. **[UE5 MIRROR]:** CommonUI stack, same tree, two style providers.

## SECTION 10 — DEVELOPER TOOLS (the `eoe.*` suite)

`eoe.fps` graph · `eoe.stats` (draw calls, tris, memory, zone residency) ·
`eoe.collision` wireframes · `eoe.interact` (trace ray, focus target, registry
list) · `eoe.ai` placeholder panel (reserved, prints "Sprint 002") · `eoe.god`
(no-clip freecam = free camera + player immunity to fall volumes) · `eoe.restart`
(level reload preserving settings) · `eoe.save` / `eoe.load` (quick slots) ·
`eoe.teleport <station 1–12>` · `eoe.timing` (runs the feel table live and prints
deltas) · `eoe.seams` (visible-load assert log). All stripped from ship builds.

## SECTION 11 — TESTING PLAN (per feature: cases → edge cases → expected → regression → risks → acceptance)

- **Locomotion:** cases — each state's speed/timing vs table (automated, B2); edges —
  slope 40°, step 0.35 m, crouch under 1.2 m clearance, sprint-empty stamina, jump
  spam (pre-load gate). Expected: table numbers ±2%; no state deadlocks. Regression:
  B2 in CI forever. Risks: Rapier controller quirks on moving platforms (see C3).
  Accept: `eoe.timing` green + hand-feel signoff.
- **Camera:** shake never exceeds 0.5° (bus clamp test); bob toggle zeroes cleanly;
  FOV persists. Edge: settings changed mid-motion. Regression: settings round-trip
  test. Accept: no nausea flags from 3 testers.
- **Interaction:** focus hysteresis (no prompt flicker at range edge); hold canceled
  by movement releases correctly; disabled prompts show-but-refuse. Edge: two
  interactables overlapping cone (nearest-in-cone wins deterministically); interact
  during pause (blocked). Regression: scripted walkthrough clicking all 12 stations.
  Accept: zero orphan prompts in a full run.
- **Door/Elevator:** door blocked-by-player reopens; elevator called from both
  floors; player on cage edge during gate-slam (pushed in, never clipped); ride +
  save mid-ride (restores at cage, not in shaft void). Risks: platform-parenting =
  the sprint's #1 physics risk — timebox 3 h, fallback: teleport-attach pattern.
  Accept: 50-ride soak, zero falls-through.
- **Save:** round-trip after refresh; chunk version bump migration (fake v0→v1 test);
  corrupt-blob → rollback to last valid (never boot-loop); export/import file
  equality. Edge: save during transition (deferred to seam end). Regression: save
  soak in nightly CI. Accept: ≤2 MB checkpoint, restore ≤5 s.
- **Transition/seam:** assert zero visible loads at walking AND sprinting entry;
  audio handover at jamb. Edge: turn back mid-corridor (zone A stays resident).
  Accept: `eoe.seams` log empty across 20 crossings.
- **UI/settings:** every setting applies live + persists; rebind conflicts refused;
  gamepad full-menu navigation. Accept: settings matrix walk (all toggles) clean.
- **Packaging:** min-spec laptop 60 fps in hall (worst view); phone browser: loads,
  shows unsupported-input notice gracefully. Accept: staging URL run start-to-finish.

## SECTION 12 — GIT WORKFLOW

Branches: `main` (protected, deploys staging) · `sprint/001-foundation` (the sprint
branch) · task branches `s001/<task-id>-<slug>` merged by PR into the sprint branch;
sprint branch → `main` at E3. Commits: per task table (small, message discipline as
listed); at minimum per completed task, ideally per test-passing unit. Tags:
milestone `v2.2.0-sprint001` at E4; release tags reserved for slice
(`v3.0.0-slice`). Backups: GitHub is primary; nightly CI artifact retains last 14
builds; the ledger files ride every commit (the six-line header in PR descriptions).

## SECTION 13 — END-OF-SPRINT CHECKLIST

☐ Sprint 0 gates G0.1–G0.4 closed & logged ☐ zero MP symbols (`grep -r socket\.io
client/src` empty) ☐ folder tree per §3 ☐ timing table green in CI ☐ all 12 proving
stations pass their §11 acceptance ☐ door/elevator/puzzle/checkpoint/seam each
demo-able in one unbroken run ☐ save round-trips across refresh AND export/import ☐
settings persist & apply live ☐ pause/menu/slots complete on KBM + gamepad ☐ dev
suite functional, stripped from ship build ☐ 60 fps on the min-spec laptop (the
desk rule [Book X §19]) ☐ build ≤80 MB, size report in CI ☐ staging URL playable
start-to-finish ☐ zero S1/S2 open ☐ ledgers updated (PROJECT_STATE amendment:
lane ruling; CURRENT: sprint status; CHANGELOG: v2.2.0) ☐ retro written (§14) ☐
tag pushed.

## SECTION 14 — SPRINT RETROSPECTIVE (template + pre-commitments)

**Review before Sprint 002:** actual-vs-estimate per task (feeds Sprint 002's
estimates); the platform-parenting outcome (C3 risk); min-spec fps headroom (how
much budget remains for combat); whether the interaction framework survived 6
implementations without modification (contract quality signal); feel-signoff notes
against Book V §2's targets.
**Acceptable technical debt (logged, dated):** placeholder art/audio everywhere;
HUD static; lean/slide/vault stubs; single-zone streaming only; legacy/ quarantine
folder existing; menu stillwood being a flat image.
**Never-acceptable debt (S2, fix before exit):** timing-table failures; visible
loads; save corruption paths; shake-cap violations; rules leaking into content/
configs; magic numbers outside `data/`; MP remnants; dev tools in ship builds.
**Sprint 002 preview (from Book X §17):** Breath/Binding health + damage pipeline,
P-11/C-9 feel, the covenant grey-box loop, Line Warden + Surveyor five-state AI —
the "covenant grey-box" gate.

---

*— End of SPRINT 001 PLAN. Authority: Books IX–X; lane ruling logged in
PROJECT_STATE.md. On completion, the staging link exists — the first ancestor of
THE LINK. Amendments require a logged entry in PROJECT_STATE.md.*
