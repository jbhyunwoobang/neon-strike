# ECHOES OF EDEN — SPRINT 003 IMPLEMENTATION PLAN
### "GREY NOON (PRODUCTION)" · The First Production-Quality Level · Official Sprint Document · 2026-07-04

*Authority: Book IX §3 Phase 3 + Book X §17 Sprint 3, executed per this brief. Canon
governs everything; nothing is redesigned. Numbering note (ledger-resolved): the brief
arrived labeled "sprint 4"; by the ledger this is **SPRINT 003** — the first
production-quality level. The Lane Ruling stands; `[UE5 MIRROR]` posture throughout.*

**THE LEVEL (the sprint's one decision, made from canon):** **"GREY NOON (PRODUCTION)"
— the Chapter 1 sequence: stillwood approach → the Taproot nest → the regrowth acre.**
Why this and not another: (1) the stillwood is THE signature landscape — the one-frame
identity's home biome [BI §III.1; BIV §8]; (2) the nest is the first shelter — the
warmth-against-grey contrast that IS the emotional identity [BVI §10.2]; (3) the acre
covenant is already playable — Sprint 002's loop gets dressed, not rebuilt (nothing
wasted, per Book IX's slice law); (4) every environmental-storytelling anchor is
already canon [BII §XII Ch.1]; (5) finished, this IS the slice's second half — Sprint
004 then builds the Prologue and the 30-minute link is content-complete. If shown to a
publisher, this level answers "what makes this game unique" in its first three minutes:
the dead cathedral, the reading, the warmth, the covenant.

**"Production quality," honestly defined for the web lane:** this sprint IS Book IX's
**dressed-Acre fidelity milestone** — the identity's carrier test (does board-form
monumentality read at 60 fps on integrated GPUs?). "Final art" means: the Gravity kit
v1 (instanced pour modules with baked board-form normal/AO), the canon palette graded
per the Ch.1 color script (the game's greyest hour; green = single-digit pixels until
the acre), the one-source lighting law, full audio/VFX passes at their §9–10 scope,
and the QC batteries green. It does not mean UE5-tier microdetail — it means **the
one-frame test passes in OUR engine**, which is the only definition that matters.

---

## SECTION 1 — SPRINT OVERVIEW

- **Objective:** one complete, polished, production-quality level — Grey Noon — proving
  the project as a complete experience: gameplay, pacing, architecture, atmosphere,
  environmental storytelling, audio, VFX, performance, all at ship intent.
- **Estimated duration:** **110–150 focused hours** (§2 sums 132 h nominal; ≈ 4–6 solo
  weeks). Includes the remaining Sprint 002 carry-overs it depends on (Z5 interaction
  set, Z7 UI tokens — folded in as tasks P1/P2).
- **Deliverables:** D1 the level (3 zones, ~18–25 min first play) · D2 Gravity kit v1 +
  stillwood kit v1 (reusable — the campaign's actual kits begin here) · D3 lighting
  pass (grey noon + nest lamp + acre event) · D4 environmental storytelling pass (the
  Ch.1 canon anchors) · D5 the ranger-tower puzzle · D6 the dressed covenant encounter
  · D7 the stillwood-cathedral reveal · D8 the nest safe room (bench/leaf/rest) · D9
  the seed-packet lore sequence · D10 the Surveyor fly-past scripted event · D11 the
  D-1 husk set-piece · D12 checkpoint loop (leaf + auto, on the live save system) ·
  D13 audio pass · D14 VFX pass · D15 optimization pass (budgets green) · D16
  structured playtest round + report.
- **Dependencies:** Sprint 002's core + proving mode (DONE); Z5/Z7 carry-overs
  (in-sprint); no external blockers.
- **Definition of Done:** §14 checklist green; the one-frame test passes on 5 random
  screenshots; Compass Test 4/5 fresh testers; 60 fps min-spec; exit-word capture
  matches Ch.1's row (isolation → belonging [BIV.5 §17]); deployed to the link;
  tagged `v2.4.0-sprint003`.
- **Production risks:** *fidelity ceiling* (board-form reads flat on low-end →
  mitigation: normal/AO-baked kit textures + silhouette-first modules; the Fidelity
  Gate task F1 runs FIRST and fails fast); *scope gravity* (three zones is the cap —
  no fourth zone, no extra arena, ever this sprint); *solo art bottleneck* (kit
  discipline: 12 pour modules + 6 stillwood trunks + 8 nest props MAX; variety by
  instancing law, not asset count); *the greyest-hour boredom risk* (Review Board §2
  — mitigated by authored density per the 90-second attention cadence, verified in
  playtest task T2).

## SECTION 2 — TASK BREAKDOWN

*Pri / hrs / deps / output / commit / QA. Phases: F (fidelity gate) → P (prereqs) →
K (kits) → L (level zones) → S (systems dress) → A (audio/VFX) → O (optimization) →
T (test/ship).*

| # | Task | Pri | Hrs | Deps | Output · Commit · QA |
|---|---|---|---|---|---|
| F1 | **THE FIDELITY GATE:** one pour module + one stillwood trunk at target quality (baked board-form normals, AO, canon-hex albedo, dust pass) in a lighting test scene on min-spec — GO/NO-GO on the whole approach | P0 | 8 | — | fidelity verdict · `feat(art): fidelity gate — pour+trunk hero modules` · 60fps + one-frame test on the test scene; art sign-off |
| P1 | Z5 carry-over: interaction set 1 (door, lever, lore-read overlay, pickup) on the framework | P0 | 8 | — | 4 interactables · `feat(core): interaction set 1` · S001 §11 cases |
| P2 | Z7 carry-over: UI paper/ink tokens + prompt chips + journal-stub reader (the Sower skin v1) | P0 | 6 | — | token pass · `feat(ui): Sower-skin tokens + reader` · muted readability |
| K1 | **Gravity kit v1:** 12 pour modules (wall/fin/lintel/pier/slab/stair) instanced, LOD'd, dust-graded | P0 | 12 | F1 | the kit · `feat(art): gravity kit v1 (12 modules)` · silhouette @100m fog test |
| K2 | **Stillwood kit v1:** 6 trunk-column variants + canopy-coffer cards + floor litter cards (architecture tools, zero vegetation tools LAW) | P0 | 10 | F1 | the kit · `feat(art): stillwood kit v1` · rhyme check vs K1 (§15 BVI) |
| K3 | **Nest kit:** 8 props (crate desk, seed racks, lamp, hammock, bench, kettle, cable runs, canvas) + warm-lamp material set | P1 | 8 | F1 | the kit · `feat(art): taproot nest kit` · 5Q dressing checklist |
| L1 | **Zone 1 — the stillwood approach** (~8 min): trunk cathedral, light shafts, Chargehand marginalia decals, patrol-log pickups, the wind-texture puzzle lead-in, THE REVEAL (§L4), D-1 husk vista station | P0 | 14 | K1,K2,P1 | zone 1 · `feat(levels): grey-noon zone 1 — stillwood approach` · guidance instruments ×2 per decision point |
| L2 | **Zone 2 — the Taproot nest** (~5 min): viaduct underbelly, borrowed-door entry, the shelter (bench/leaf/cache/kettle/conversation-stub), seed-packet letters (D9), exit to acre trail | P0 | 12 | K1,K3,P1,P2 | zone 2 · `feat(levels): grey-noon zone 2 — the nest` · shelter promise audit (LAW 8-A) |
| L3 | **Zone 3 — the acre (dressed):** Sprint 002's arena re-skinned with K1/K2 at production dress; approach ridge kept; cover ring as fallen trunks + pour fins | P0 | 10 | K1,K2 | zone 3 · `feat(levels): grey-noon zone 3 — the acre dressed` · V-6 re-audit post-dress |
| L4 | **The architectural reveal:** the stillwood cathedral first-wide (35mm threshold corridor → held wide over the trunk nave, input free) staged at zone 1's second bend | P0 | 5 | L1 | the reveal · `feat(levels): the stillwood reveal` · reveal grammar checklist (BVIII §8) |
| L5 | **The ranger-tower puzzle (§8):** find the way up (collapsed stair → counterweight re-hang from the winch crate) → the logbook + the view annotation | P0 | 8 | L1,P1 | the puzzle · `feat(levels): ranger tower puzzle` · §8 acceptance |
| L6 | **The scripted event:** the Surveyor fly-past (spotlight sweep crossing zone 1, classification bark at distance — never engaging; the first machine dread, watchable) | P1 | 5 | L1 | the event · `feat(levels): surveyor fly-past` · triggers once, missable-proof sightline |
| S1 | **Checkpoint loop on the live save:** leaf-save at the nest bench (hold-verb), autosave at zone seams + covenant boundaries; resume-into-zone verified across refresh | P0 | 6 | L2 | checkpoints · `feat(core): grey-noon checkpoint loop` · refresh-resume soak ×10 |
| S2 | **Encounter dress (§7):** wave content unchanged; arrivals re-staged through zone geometry (gate → trunk lanes); elite wave-2 flank teach vs the gantry; reward chain (bench unlock + dressing cache + patrol-log lore) placed on the exit path | P0 | 6 | L3 | dressed encounter · `feat(levels): acre encounter dress` · §7 acceptance |
| A1 | **Audio pass (§9):** stillwood designed-absence bed, nest hearth bed, footstep surface sets (duff/pour/steel), reverb zones (nave ≥2s / pocket dry), the sigh distant event, radio/drill barks placeholder-VO→text-tone pass, win mix-drop | P0 | 12 | L1–L3 | audio pass · `feat(audio): grey-noon pass 1` · silence-law audit; mix-forward footsteps in nave |
| A2 | **VFX pass (§10):** dust motes in shafts (one idea per space LAW), aperture columns, spall on pour, muzzle/tracer polish, the acre's green-unit lens glow, husk heat-shimmer none (dead = still) | P1 | 8 | L1–L3 | vfx pass · `feat(vfx): grey-noon pass 1` · particle-idea count ≤1/space |
| O1 | **Optimization pass (§11):** instancing audit, draw-call budget (≤1,500), texture memory ≤ budget, zone streaming seams (nest door = the valve), min-spec verification | P0 | 8 | all L | budgets green · `perf: grey-noon optimization pass` · budget dashboard capture |
| T1 | **QA battery run (§13)** + fixes | P0 | 8 | all | green batteries · `test: grey-noon QA pass` · §14 checklist |
| T2 | **Structured playtest (§12):** 5 fresh testers, protocol + report; density/pacing fixes | P0 | 8 | T1 | playtest report · `docs: grey-noon playtest 1 report + fixes` · Compass 4/5; exit-words on target |
| T3 | Ship: deploy, tag `v2.4.0-sprint003`, ledgers, retro | P0 | 3 | T2 | shipped · `build: sprint-003 exit — grey noon live` · link verified |

**Nominal: 132 h.** Sequencing law: F1 completes before any K/L hour is spent.

## SECTION 3 — LEVEL PRODUCTION WORKFLOW (the pipeline this sprint proves)

CONCEPT APPROVAL (done — the bibles are the concept; BII §XII Ch.1 + BVI §2 Ch.1 are
the sign-off docs) → GRAYBOX REFINEMENT (zone volumes at scale-table truth; the acre
inherits) → GAMEPLAY VALIDATION (walk/encounter/puzzle fun-ugly in grey — gate before
art) → ART BLOCKOUT (kit modules replace grey per zone, silhouette-first) → FINAL
ARCHITECTURE (hero moments: the reveal nave, the husk vista, the nest interior) →
MATERIALS (the three masters: concrete/steel/canvas + decal library) → PROPS (hero
first: the green unit, the leaf-bench, the logbook) → LIGHTING (§5 — after geometry
locks, before dressing finals) → AUDIO (§9 — beds early, events after staging) → VFX
(§10 — last of the visual passes) → OPTIMIZATION (§11 — continuous budget checks +
one dedicated pass) → PLAYTESTING (§12 — grey-stage AND dressed-stage) → FINAL
APPROVAL (the QC batteries + the one-frame screenshot audit). `[UE5 MIRROR]`: the
identical stage-gate chain per Book IX §5.

## SECTION 4 — ENVIRONMENT ART ROADMAP

**Architecture:** K1's twelve modules carry the level; board-form via baked normal +
AO + cavity dust (F1's recipe); pour-lift strata at 2.4–3.6 m striping LAW; the
viaduct underbelly = slab + pier + haunch modules. **Concrete:** three-tone canon
family + Belt dust overlay; stain-tongue decals under every drip line (placement
follows water, LAW). **Steel:** gantry rails + nest cable trays; mill-blue with
contact-polish at hand heights only. **Glass:** none in this level (canon: zone has
no glazing — the tower's panes are long gone; empty frames tell it). **Props:** kit
lists in K2/K3; the hero three at max fidelity (green unit, bench, logbook).
**Furniture:** nest islands per the red-carpet grammar (isolands of habitation in
monumental dark). **Pipes/infrastructure:** every run answers "what does this feed"
— nest power taps the viaduct's dead conduit (visible splice, Coil's copper).
**Signage:** Chargehand stencil decal set (the ~12-glyph starter glossary) + one
pre-Accord serif quarantine plate at the tower. **Damage/weathering:** spall at
rebar lines with rust halos; the husk's cannibalization order legible (lens cored,
panels stripped). **Decals:** the marginalia layer IS the storytelling (§6) — decal
budget 60% story / 40% grime, never inverted. **Material instances:** one master
per family, instances per zone tint; grading stays in the LUT, not the albedo.

## SECTION 5 — LIGHTING WORKFLOW

**Primary:** grey noon — one directional at high overcast intensity, shadowless-soft
(large source angle), the canon dust-light; the stillwood's parallel shafts are the
ONE volumetric idea (per space LAW). **Secondary:** bounce fill only; nest = the lamp
(warm `#E5B76A` pool, absolute — the level's single warmth, rationed). **Emergency/
event:** the Surveyor's spotlight sweep (the fly-past's moving cone — the level's one
hostile light); the acre's green-unit lens glow post-plant. **Fog:** three-plane
depth per the skyline law; density per zone (approach heavier, acre clearer — the
color event needs air). **Volumetrics:** shafts in zone 1 only. **"Lumen" (web
lane):** IBL + baked-AO + the filmic stack; manual exposure anchors per zone LAW
(approach EV, nest EV +1.5 warm, acre EV) — no auto-exposure drift ever. **
Reflections:** none (provincial never reflects LAW — no polished floors here).
**Color grading:** the Ch.1 script LUT — the game's greyest hour; the sapling's
green survives the grade at single-digit pixel share until the acre event.
**Exposure:** locked per zone with 2 s cross-fade at seams (the palette handover).
**Cinematic:** the reveal wide gets its own graded hold (no added lights — blocking
finds the shafts LAW). **Readability:** combat lanes keyed +10–15% over surround
(the guidance gradient, subliminal); QA = muted+greyscale playtest capture.
**Optimization:** one shadowed light; everything else unshadowed fill; shaft
volumetrics budgeted ≤0.8 ms min-spec.

## SECTION 6 — ENVIRONMENTAL STORYTELLING (the Ch.1 canon anchors, implemented)

**Documents:** 2 Wardenry patrol logs (signed A.F. — the player's own old sector,
found before anyone says so LAW: discovery, never announcement); the ranger-tower
logbook (continuous across the defunding — the state withered mid-sentence [BII
§XII]); 4 seed-packet letters in the nest (plantable-paper correspondence — the
lore sequence D9: reading three triggers Mara's bark-stub about the fourth).
**Architecture:** viaduct piers landing in a crushed homestead footprint (the
contempt, buildable); the nest borrowing structure on visible slings LAW.
**Furniture:** the nest's two-author mending (grid-regular vs chaotic stitches on
the same canvas — Asher/Coil's grammar seeded early). **Damage:** one harvested
trunk-row cut low (the Converter's leavings) vs the standing dead — the difference
IS the lore. **Blood:** none, ever — violence leaves procedure (the old cordon
tape at the acre, tags faded). **Abandoned objects:** the ranger tower's kettle,
rusted through — rhymed against the nest's working kettle (the level's thesis in
two props). **Machines:** the D-1 husk set-piece (cannibalization order; chalk
decommission serial; a Sower 'reckoned' line struck across its housing). **
Memorials:** one folk memorial under the viaduct (bucket of stones + a name-board)
— uncommissioned grief, per district law. **Lighting clues:** the nest's lamp
visible as a warm pinprick from the approach's last bend (light promises honestly
LAW). **Discovery moments:** the tower view (the journal sketches the acre from
above — the player sees their destination before walking it: the read-route made
literal).

## SECTION 7 — THE COMBAT ENCOUNTER (dress of the proven loop)

Placement: unchanged waves (canon composition); arrivals through zone geometry —
N gate becomes a viaduct service arch, SW/SE through trunk lanes (staged, watchable
LAW). Arena flow: cover ring re-dressed as fallen trunks + pour fins (same collision
volumes — gameplay identical to the validated grey). Sightlines: the long N lane
kept clean for the elite's flank-teach; canopy cards must NOT occlude the gantry
read. Verticality: gantry flank re-dressed as the viaduct's maintenance stair.
Difficulty: wave 1 completable dressing-free by a first-timer (validated T2);
wave 3 pressures 1–2 dressings. Rewards: exit-path chain (bench unlock → dressing
cache → patrol log #2) — sapling first, materiel second, staged by layout LAW.
Checkpoints: covenant-start + per-wave boundary on the live save system (S1).
Post-combat pacing: the mix-drop into sapling-wind; the walk back to the nest as
the designed digestion beat (rest after the peak LAW) — the level ENDS at the
bench, leaf in hand.

## SECTION 8 — THE PUZZLE (the ranger tower)

Logic: the tower's stair is collapsed; the service winch's counterweight crate
sits spilled at its base; re-hang the crate (pickup-verb → cradle hold-verb) →
the winch lever raises the ladder-stair → up. Visual communication: the winch
cable runs FROM the crate TO the stair in one unbroken readable line (evidence in
the same space LAW 9-A); the cradle's empty hook lit by the tower's gap-light.
Guidance: wear-path to the crate; Chargehand 'live-line' glyph at the winch.
Failure states: none hard — resettable (crate re-hangs; lever re-throws); wrong
attempts produce honest clunks, never lockouts. Rewards: the logbook (understanding),
the vista (the journal's acre sketch — navigation), patrol log #1 (human trace) —
the hierarchy in one room LAW. Accessibility: the hold-verb honors hold→toggle;
the climb has a fall-safe rail; colorblind-safe glyph (shape-doubled). Testing:
5-tester blind solve ≤3 min median, zero hint requests (or the cable read gets
thickened).

## SECTION 9 — AUDIO PASS

Ambient: zone beds — stillwood designed-absence (room-tone-with-pressure synth, NO
nature bed LAW), viaduct underbelly (wind through box girders), nest hearth
(kettle/lamp/canvas), acre (air that carries the sapling). Environmental: distant
sigh event once in zone 1 (the world's cruelest sound, far off — with the phantom-
response stub on the controller layer deferred to the Prologue sprint). Combat:
S002's set + trunk-impact woods, duff footsteps under fights. Footsteps: duff /
pour / steel-grate sets, mix-forward in the nave LAW. Reverb: nave ≥2 s tail,
pocket dry, tower semi-open. Music: NONE except the hymn's bass-line entering at
the bench after the win (music after meaning LAW; the level is otherwise unscored
— stillwood traversal is silent BY LAW). Transitions: bed crossfades at seams
(the mix is the door). Optimization: pooled one-shots, ≤24 concurrent voices,
bark de-dup.

## SECTION 10 — VFX PASS

Dust: motes in shafts (zone 1's one idea); footfall lift on duff. Fog: the three-
plane depth cards + distance fog only. Smoke: none (nothing burns here — Ch.6's
grammar is not spent early). Particles: spall (stub-mesh chips LAW), muzzle,
tracer fade, the lens glow. Environmental: canopy-gap light flicker NONE (dead
canopy = still; stillness is the effect). Impact: material-true ticks (duff puff /
pour chip / steel spark small). Lighting FX: the Surveyor cone sweep; the win's
lens bloom-up. Optimization: pools, ≤1 particle idea per space audited by capture.

## SECTION 11 — OPTIMIZATION PASS

GPU: instanced kits (HISM-equivalent via Three instancing), one shadowed light,
shaft volumetrics budget; target 60 fps @1080p integrated (min-spec laptop on the
desk LAW). CPU: AI ≤ wave caps; zone actors sleep outside their zone. "Nanite/
Lumen/VSM" `[UE5 MIRROR]`: hero pours Nanite, manual-EV Lumen, VSM blades — per
Book X §7 when the gate fires; web lane = baked AO + IBL as specced. Streaming:
three zone bundles behind the two seams (approach→nest door; nest→acre trail
bend); zero visible loads LAW; preload next zone at seam-approach trigger.
Texture memory: ≤300 MB resident; 2K standard/4K the three heroes. Draw calls:
≤1,500 verified per zone worst-view. Shader complexity: three master materials +
instances only. Frame pacing: no GC spikes >2 ms (pool audit). Loading: cold
link→ridge ≤30 s target intact (bundle report in CI).

## SECTION 12 — PLAYTEST PLAN (structured, 5 fresh testers)

Protocol: no guidance, think-aloud, screen+input capture; observer silent.
Observe: navigation (wrong-turn count per zone; stuck-state per BVI taxonomy),
combat (deaths, dressing use, sapling checks), puzzle (solve time, hint requests),
exploration (optional finds: logs/letters/husk/memorial — how many of 8),
pacing (bored-signals: camera wander, pace spikes), confusion (verbalized),
curiosity (unprompted "what's that"), enjoyment (post-session 1–7 + one word),
completion time (target 18–25 min golden path). Structured capture sheet per
tester + exit interview: the one-word exit (target family: "alone/quiet/
belonging/hope"), "draw the level from memory" (landmark test), "what was the
green thing" (identity read). Two rounds: R1 after T1 fixes, R2 confirms.
Findings → fix list ranked by (frequency × severity), fixes land before T3.

## SECTION 13 — QA PLAN

Functional: interaction set matrix; save/refresh-resume soak; checkpoint
boundaries; puzzle reset paths. Art review: one-frame test on 5 random
screenshots per zone ⊗; kit silhouette @100 m fog; palette histogram (green
≤ threshold until acre) ⊗. Lighting review: one-source audit per space ⊗;
EV anchors locked; readability capture (muted+greyscale). Combat review: V-6
re-audit post-dress ⊗; drill/radio observable through dressing; heatmap
orbit-and-spoke retained. Puzzle review: §8 acceptance. Performance: budgets
green on min-spec ⊗; seam hitch = 0 ⊗. Regression: the 54-test suite + S002
proving loop + S001 walkthrough all green every PR ⊗. Acceptance: §14 full
checklist; the Compass and exit-word gates from §12.

## SECTION 14 — END-OF-SPRINT CHECKLIST

**Fidelity & art (12):** ☐ F1 gate passed ☐ 12+6+8 kit pieces at bar ☐ one-frame
test ×15 screenshots ☐ silhouettes @100 m ☐ palette histogram per zone ☐ decal
story/grime ratio ☐ two-eras surfaces on lingerables ☐ pour strata striping ☐
stillwood built with architecture tools ☐ husk cannibalization legible ☐ nest 5Q
dense ☐ no green outside sapling/lens/letters-line budget.
**Level & flow (14):** ☐ three zones complete ☐ golden path 18–25 min ☐ reveal
grammar (threshold→wide→input-free) ☐ D-1 vista station ☐ fly-past fires
watchably ☐ tower puzzle ≤3 min median blind ☐ nest promise absolute (no
objective pressure inside) ☐ leaf-save verb ☐ autosaves at seams/waves ☐
refresh-resume ×10 ☐ V-6 post-dress ☐ arrivals staged through geometry ☐
reward chain ordered (sapling→bench→cache→lore) ☐ exit-at-bench digestion beat.
**Storytelling (8):** ☐ 2 A.F. patrol logs ☐ logbook continuous-across-defunding
☐ 4 seed-packet letters + bark-stub ☐ memorial ☐ kettle rhyme ☐ pier-in-homestead
☐ cordon tape at acre ☐ zero announced discoveries.
**Audio/VFX (8):** ☐ zone beds ☐ designed-absence (not nature-minus-birds) ☐
footsteps 3 sets mix-forward in nave ☐ reverb zones ☐ distant sigh once ☐ music
only post-win bass-line ☐ one particle idea per space ☐ spall never gravel.
**Perf & QA (10):** ☐ 60 fps min-spec all zones ☐ draw calls ≤1,500 ☐ texture
≤300 MB ☐ zero visible loads ☐ no GC spikes ☐ cold-load ≤30 s ☐ 54+ tests green
☐ regression walkthroughs green ☐ playtest R2 gates (Compass 4/5, exit-words,
completion window) ☐ zero S1/S2.
**Ship (4):** ☐ deployed to the link ☐ tag v2.4.0-sprint003 ☐ ledgers updated ☐
retro filed.

## SECTION 15 — SPRINT RETROSPECTIVE (template + pre-commitments)

Evaluate: which pipeline stages ran clean vs stalled (the kit→zone→dress chain is
the campaign's production formula — its measured cost here IS the re-scope gate's
input [Book IX §12]); what to change (kit module count? decal workflow? playtest
cadence?); technical debt (accepted: bark text-tones await VO; the phantom-response
awaits the Prologue; Surveyor is scripted, not the AI unit — logged; never-accepted:
budget violations, one-frame failures, silence-law breaks); reusable content
(EVERYTHING — both kits, the beds, the decal library, the workflow itself: this
sprint manufactures the factory); Sprint 004 efficiency (the Prologue: living-forest
biome + the Incident + GN-1 + cold open — the slice completes; estimate refined by
this sprint's measured hours-per-dressed-minute).

---

*— End of SPRINT 003 PLAN. Authority: Books II/IV/V/VI/VIII/IX/X + Sprints 001–002.
The sprint's one question, from the shelf: **does the first frame of the real game
pass the one-frame test at 60 fps?** F1 answers it in week one. Amendments require a
logged entry in PROJECT_STATE.md.*
