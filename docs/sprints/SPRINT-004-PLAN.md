# ECHOES OF EDEN — SPRINT 004 IMPLEMENTATION PLAN
### "THE SIGH & THE SEEDLING — COMPLETE" · The Publisher-Quality Vertical Slice · Official Sprint Document · 2026-07-04

*Authority: Book IX §2–3 (the slice definition + Phase 4) + Book X §17 Sprint 4, executed
per this brief. All Books and Sprint documents remain canon. The Lane Ruling stands
(web lane executes; `[UE5 MIRROR]` posture). This sprint ends at the committed
deliverable: **the ~30–45 minute playable opening at the public link, publisher-ready.***

**STATUS CORRECTION (ledger-honest, the standing discipline):** Sprints 001–002 are
complete in substance (foundation + the playable covenant loop). Sprint 003 is **in
execution** — F1 (GO), P1/P2, K1/K2, and the dressed Acre are done; the L-zones,
checkpoint loop, audio beds, and playtest round remain. Those remainders are **Block Y**
below and execute first. Nothing is re-planned; the plan composes.

**USER DIRECTIVES BOUND INTO THIS SPRINT (2026-07-04 brief — logged as production
canon):**
1. **The Front-End Suite** — every structural component a modern AAA opening carries
   (the user's reference: Cyberpunk 2077's component list, NOT its design): title/intro
   page, intro sequence, lore/background explanation, character page, profile ("name/
   login"), settings, cutscenes. Canon mapping in §3A.
2. **Author art is canon for the front-end:** `2025-01-17_3.49.12.png` = the title/intro
   key art; all `project-*` files (scientist, robot, converter, vault, fight scene,
   building, scene 1) + `synop1.png` are the author's designed assets and are USED
   DIRECTLY in the codex/character/lore pages. Ruling logged: the front-end carries the
   author's board art; the in-world renderer stays under the bible palette laws — two
   registers, one game (the board was always supreme for visuals [Lock §22]).
3. **The Prologue is the product:** 30–45+ minutes of real play, FPS, interaction-dense,
   tutorial woven naturally, **~10 distinct locations**, storyline-driven (the storyline
   is the bibles' — Book II Prologue + Ch.1, already written; the plan stages it).
4. **Progression in the prologue** ("guns/ability/damage/rank increase… up to level 2"):
   canon mapping, honest — Eden has no XP numbers (LAW), so "level 2 by the end of the
   prologue" is delivered as the ACQUISITION ARC: P-11 sidearm → spade → the C-9 (the
   cache) → bench step 1 (trigger work) → Read Tier 1→2 (perception rank — the journal
   literally names the tiers: READER → PLANTER, the user's "rank" made canon). The
   player ends the slice measurably stronger on four axes with zero XP bars. Logged.

---

## SECTION 1 — SPRINT OVERVIEW

- **Objectives:** complete the slice as the shipped game's real opening: the Front-End
  Suite; the Prologue (2068, six locations) + Grey Noon (2071, four locations); the
  D-2 Incident as the first major boss set-piece (authored, cinematic) + the Acre
  covenant finale as the mechanical climax; GN-1 complete; final UI/lighting/audio/VFX
  passes at slice scope; accessibility; optimization; external playtest; the
  publisher/demo build at the link.
- **Estimated duration:** **Block Y (S003 remainder): 55–70 h** + **Sprint 004 proper:
  95–125 h** → **150–195 focused hours** (§2 sums 168 h nominal).
- **Dependencies:** none external. Two identity outsources remain OPEN CASH ITEMS
  (the GN hand, the score [Book IX §9]) — this sprint ships with authored-placeholder
  GN art (the author's board art + two-color treatment) and the motif-bed score stubs;
  both flagged in the publisher review honestly.
- **Deliverables:** D1 Front-End Suite · D2 the 10-location prologue arc · D3 the D-2
  Incident set-piece + cinematic staging · D4 the Acre finale + demo ending hook ·
  D5 GN-1 (11 pages, two-color, four-bars) · D6 final passes (UI/light/audio/VFX) ·
  D7 accessibility set · D8 perf pass (budgets green) · D9 external playtest (2
  rounds) · D10 the demo build: link + downloadable zip; Steam-readiness doc.
- **Definition of Done:** Book IX §2.4's slice acceptance criteria, plus: median
  playthrough 32–45 min; all ten locations visited by ≥80% of testers; the permit
  prompt filed ≥95% unprompted; front-end complete (no dead buttons); zero S1/S2;
  deployed + tagged `v2.5.0-slice`.
- **Major risks & mitigation:** *scope* (ten locations = the killer → the kit factory
  is the answer; locations are DRESSINGS of 3 biome kits + set pieces, not ten bespoke
  worlds; the location budget table in §3 caps each); *the living-forest biome* (the
  Prologue needs the game's ONE warm biome — new kit K3; F1-style gate first, 6 h,
  GO/NO-GO with a canopy-card recipe); *GN art quality* (author's art + two-color
  grade as v1; the hired hand upgrades later — honest in review); *solo audio ceiling*
  (procedural beds + the sigh are provable; melodic motifs stay minimal stubs — honest
  in review); *pacing risk at 40 min* (the minute-map in §3 is the contract; playtest
  R1 exists to cut).

## SECTION 2 — IMPLEMENTATION ROADMAP

*Pri/hrs/deps/deliverable/commit/QA. Review owner: the QC batteries + the six-line
protocol (solo law). Phases: Y (S003 remainder) → FE (front end) → PZ (prologue
zones) → GZ (grey-noon completion) → B (boss/set-piece) → GN (the book) → POL
(passes) → SHIP.*

**BLOCK Y — S003 remainder (execute per SPRINT-003-PLAN):**
| # | Task (S003 id) | Hrs |
|---|---|---|
| Y1 | S1 checkpoint loop (leaf at nest-bench stub → full nest later; autosaves at seams) | 6 |
| Y2 | A1 audio beds v1 (stillwood absence, acre air, footstep sets, reverb zones) | 10 |
| Y3 | L5 ranger-tower puzzle (winch counterweight) — built in the GZ zones below | 8 |
| Y4 | T-cycle: QA battery + fix round on the dressed Acre | 6 |

**BLOCK FE — THE FRONT-END SUITE (the user's component list, canon-mapped):**
| # | Task | Pri | Hrs | Deliverable · QA |
|---|---|---|---|---|
| FE1 | **Title/intro page:** the author's key art (`2025-01-17_3.49.12.png`, optimized ≤400 KB webp) as the entry splash → title screen; menu re-skin to the two-register law (author art backdrop, paper/ink UI) | P0 | 6 | the opening page · loads ≤2 s; muted-readability |
| FE2 | **Intro sequence:** title → the banned-book FOREWORD (synopsis as 3 paper pages, text from `synop1`/the author's synopsis, styled as the book's printed foreword — the "intro video" as motion-graphics pages: slow pan + type-on, skippable page-by-page) → cold open | P0 | 8 | the intro flow · skip grammar; ≤90 s unskipped |
| FE3 | **The Registry (lore/codex page):** menu section with entries — world (synopsis), the Converter (`project-converter`), the Devastators (`project-robot`), the Vault (`project-vault`), Edge & the Sowers (`project - scene 1`, `project-fight scene`), places (`project - building`) — author art + bible-derived captions (facsimile law: short, in-world voice) | P0 | 10 | the codex · every entry art+text; unlocks grow in-game |
| FE4 | **Character page:** the cast — Asher (board portrait crop), Dr. Beck Grimwood (`project - scientist`), Mara, the Wardenry — art + dossier text from the bibles | P1 | 6 | cast page · 4+ entries |
| FE5 | **Profile ("name/login"):** SIGN THE LEDGER — first-run asks the player to sign a name into the journal (the save-slot signature; feeds "the ledger remembers ___"); slot select = journal pages (3 slots, header art) — single-player, no accounts LAW | P0 | 6 | profile flow · save round-trip w/ signature |
| FE6 | **Settings final pass:** existing settings + §10 accessibility set, re-skinned paper/ink | P0 | 6 | settings v2 · every control functional |
| FE7 | Loading/transition frames (paper + four-bars grammar), demo end-card + wishlist/follow call-to-action (link-share CTA for web) | P1 | 4 | frames + end card |

**BLOCK PZ — THE PROLOGUE (2068 — the warm world; locations L01–L06):**
| # | Task | Pri | Hrs | Deliverable · QA |
|---|---|---|---|---|
| PZ0 | **K3 kit gate (F1-style):** living-canopy recipe — trunk variant (living bark bake: warm umber/green-moss accents), canopy cards, fern/undergrowth cards, night-rain mood; GO/NO-GO | P0 | 6 | the warm biome recipe · one-frame test (GREEN allowed >10% HERE — the prologue is the living world; the ration law applies to the 2071 world) |
| PZ1 | L01 **Ridge Road** (canopy approach, night, rain audio; walk-and-learn: move/sprint/look; crew chatter radio stubs) | P0 | 8 | zone · guidance ×2 |
| PZ2 | L02 **Harvest Camp** (floodlight masts, Vault cradles (`project-vault` as the prop's reference), crew NPС stubs, thermos-culture dressing; interactions: 4+; P-11 issued — first weapon) | P0 | 10 | zone · 5Q pass |
| PZ3 | L03 **Converter Line** (the harvest station: escort the crew verb, perimeter walk tutorial-as-procedure, the SIGH event — the first cascade witnessed: desaturation wave over one tract + phantom-pain response teaching) | P0 | 10 | zone + the sigh v1 · event fires; muted-readable |
| PZ4 | L04 **Permit Checkpoint** (the terminal — THE PERMIT PROMPT: two presses, unmarked, unscored LAW; Edge-HUD skin active all prologue: the defection switch is coming) | P0 | 6 | the crime · ≥95% file it unprompted |
| PZ5 | L05 **The Night Tract** (deep harvest rows; first hostile contact: Mulcher poacher pair — the prologue's combat tutorial vs HUMAN opponents as Wardens' work; C-9 handling taught on Warden-issue) | P0 | 8 | zone + first fight · fun-ugly check |
| PZ6 | L06 **The Cordon (the Incident)** — §4's set-piece: the D-2 event | P0 | (in B1) | — |

**BLOCK GZ — GREY NOON completion (2071; locations L07–L10):**
| # | Task | Pri | Hrs | Deliverable |
|---|---|---|---|---|
| GZ1 | L07 **Stillwood Approach** (S003 L1: the cathedral reveal, Chargehand reads, patrol logs, D-1 husk vista, Surveyor fly-past; the HUD DEFECTION lands at zone entry — Edge skin → kit-bag) | P0 | 12 | zone + reveal + defection |
| GZ2 | L08 **Ranger Tower** (the winch puzzle Y3; logbook; the acre sketch vista) | P0 | (Y3) | zone + puzzle |
| GZ3 | L09 **Taproot Nest** (S003 L2: the shelter — bench/leaf/cache/kettle; seed-packet letters; Mara/Coil presence stubs (text-tone barks); C-9 bench step 1 = "level 2" axis 3) | P0 | 10 | the safe area |
| GZ4 | L10 **The Acre** (dressed, S002/S003 — the covenant finale; elite teach; Read Tier 2 unlock post-win = "rank 2") | P0 | 4 | the climax tuned |
| GZ5 | Zone streaming seams (6 seams, zero visible loads) + world map continuity pass | P0 | 8 | seams · 0 hitches |

**BLOCK B — THE BOSS & CINEMATICS:**
| # | Task | Pri | Hrs | Deliverable |
|---|---|---|---|---|
| B1 | **The D-2 Incident set-piece (§4):** the first major boss as AUTHORED EVENT — arena staging, the reclassification, the cutting head, the hand, smash-to-white | P0 | 14 | the boss · exit-word "cold/complicit" family |
| B2 | **GN-1 (§5):** eleven pages — author's board art re-treated two-color + drawn inserts; stroke-assembly runtime exists; four-bars preload; the window→title form-match | P0 | 12 | the book · GN law battery |
| B3 | Title card + the E-grows-green-line wordmark moment; menu-is-the-stillwood after first run | P1 | 4 | the title beat |
| B4 | Acre finale polish: wave-3 climax staging, win mix-drop, the dawn-hold ending + demo end-card hook ("the book continues" + CTA) | P0 | 6 | the ending |

**BLOCK POL — FINAL PASSES:** UI final (paper/ink everywhere, prompt chips,
double-rule vitals restyle) 8 h · Lighting final (per-zone EV anchors ×10, the two
sanctioned warm moments) 8 h · Audio final (§6: beds ×10 zones, the sigh, radio/
drill VO text-tones → recorded scratch VO if time, mix -23 LUFS) 12 h · VFX final
(§8) 6 h · Perf (§9 budgets ×10 zones) 8 h · Accessibility (§10) 8 h · Playtest
(§11: R1 n=5, fixes, R2 n=5) 12 h · Bug triage + fix (§12) 10 h · SHIP (tag,
deploy, publisher one-pager, demo zip) 4 h.

**Total nominal: 168 h.** Sequencing law: PZ0 (K3 gate) before any PZ zone-hour;
FE parallelizes anytime; B1 before B2 (the event feeds the book).

## SECTION 3 — THE OPENING EXPERIENCE (minute-by-minute)

**§3A THE FRONT-END (pre-game, the user's component map):**
ENTRY (the author's key art, title, "PRESS ANY KEY") → SIGN THE LEDGER (first run:
name into the journal — the profile) → MAIN MENU (CONTINUE · BEGIN · THE REGISTRY
(codex) · THE CAST · SETTINGS · CREDITS — stillwood backdrop after first run) →
BEGIN → THE FOREWORD (3 paper pages, the synopsis in the banned book's voice,
skippable) → the cold open. Every codex/cast entry uses the author's project-* art.

**§3B THE TEN LOCATIONS, 0:00–45:00 (emotional line per BIV.5; timings median):**
- **0:00–1:30 · front-end** (first run) — anticipation.
- **1:30–3:00 · L01 Ridge Road** — the cold open: black, rain, the far sigh; walking
  a LIVING forest at night (the game's one warm biome — green unrationed HERE, the
  inversion that makes 2071 land). Feel: warmth, competence-anticipation.
- **3:00–8:00 · L02 Harvest Camp** — meet the crew (names on tarps), kit issued
  (P-11), 6+ interactions (thermos, manifests, Vault cradles); tutorial as morning
  procedure. Feel: belonging-in-the-wrong-family.
- **8:00–14:00 · L03 Converter Line** — escort verbs, perimeter drill (aim/fire on
  range stub, reload under supervision); THE SIGH witnessed — one tract goes grey in
  a wave; the hand throbs (phantom stub teaches the response). Feel: awe→unease.
- **14:00–17:00 · L04 Permit Checkpoint** — paperwork beat; THE PERMIT PROMPT (two
  presses, routine, unmarked). Feel: nothing — by design. The knife goes in unfelt.
- **17:00–24:00 · L05 Night Tract** — deeper rows; first combat (Mulcher poacher
  pair, taught by the escalation drill FROM THE WARDEN SIDE — the player performs
  the announce); C-9 mastery basics. Feel: competence peak.
- **24:00–29:00 · L06 The Cordon — THE INCIDENT (§4)** — the boss. Feel: horror.
- **29:00–32:00 · GN-1** — eleven pages, 2068→2071. Feel: grief compressing to
  resolve. TITLE CARD (the E grows its green line).
- **32:00–37:00 · L07 Stillwood Approach** — 2071, the HUD defects; the cathedral
  reveal; the husk; the fly-past; reads. Feel: isolation→curiosity.
- **37:00–40:00 · L08 Ranger Tower** — the puzzle; the acre seen from above (the
  read-route made literal). Feel: comprehension.
- **40:00–43:00 · L09 Taproot Nest** — the shelter; the letters; the bench (step 1);
  the leaf. Feel: warmth, rationed.
- **43:00–48:00 · L10 The Acre** — the covenant: plant, hold, bank; wave 3 climax;
  THE DAWN HOLD (40 s, no UI). Feel: hope, earned.
- **48:00+ · the end-card** — "the acre stands. the book continues." + CTA; the
  Standing Watch page unlocks for replay. (Median target lands 32–45 min; explorers
  50+.)

**Progression across the arc (the "level 2" mapping, four axes):** weapons P-11 →
C-9 (+bench step 1) · verbs walk→full kit (dress/plant/read/carry) · perception
READER → PLANTER (Tier 2: Chargehand fluency — the rank the journal names) · trust:
the nest opens its bench. No XP bar exists; the player FEELS level 2.

## SECTION 4 — BOSS PRODUCTION: THE D-2 INCIDENT (the first major boss)

The slice's boss is canon's boldest call and the demo's teeth: **an authored,
unwinnable set-piece** — the machine is not fought to death; it is SURVIVED, and
the player's own paperwork is why it happens. (The mechanical boss-fight itch is
served 15 minutes later by the Acre's wave-3 climax; publishers see both.)
**Arena:** the cordon clearing — floodlit rows, the crew mid-shift, one exit lane
authored. **Phases:** (1) WRONGNESS (the D-2 halts mid-task; classification lamp
sweeps; barks re-classify the crew — the player HEARS their permit report quoted
back in dispatch grammar); (2) THE TABLE EXECUTES (it advances on the crew, not
the player — sapling-priority logic horribly inverted: PEOPLE are in its table
now; the player's rounds spall harmlessly — taught in 5 seconds, tried by
everyone); (3) THE DRAG (Dez under the strut — the carry verb at sprint, the
cutting head, THE HAND — smash to white on contact). **Cinematic staging:**
in-engine, control retained until the final 2 s (the white); the camera never
leaves first person LAW. **Animation:** the D-2 rig on the machine grammar
(four-count knock, tool-arm deliberation, no menace tells). **Audio:** servo
grammar + dispatch band + the sigh of its capacitors — no music LAW. **Lighting:**
its own classification lamp is the scheme (the player lit BY the boss).
**Difficulty:** unfailable-but-active (the drag is real input; slow = the white
comes earlier — recorded, not punished). **Reward:** none — the reward is the
story (canon: the kill changes nothing; here there is no kill at all). **Player
learning:** machines are policy; plate is honest; your paperwork is loaded.
**Post-boss pacing:** GN-1 immediately (the book carries the grief).

## SECTION 5 — GRAPHIC NOVEL INTEGRATION (GN-1)

Workflow (the 11-stage pipeline, slice-scoped): script = BII §VIII (locked) →
thumbnails (11 pages: settlement, prosthetic fitting, the windowsill, the duffel)
→ art v1 = **the author's board art re-treated**: two-color ink/paper grade
(#2A2B2A/#D8D2C4 + one green ≤10%) over `project-fight scene`/`project - scene 1`
crops + 6 drawn-insert panels (silhouette-first, the style the boards already
carry) → VO: none (wordless LAW) → motion: stroke/reveal assembly (200–400 ms
clusters — runtime pattern from the reader tech), parallax ≤4°, page-turn on
input + 6 s fallback → sound: paper texture, room tone, the four empty bars
BEFORE (preload contract) → transition: last panel's window form-matches the
title's stillwood frame LAW → `[UE5 MIRROR]` UMG/materials. Performance: pages
as compressed textures ≤300 KB each, preloaded behind the bars.

## SECTION 6 — AUDIO POLISH (slice scope, honest)

Ambient: 10 zone beds (living-night rain w/ insects L01–06 — the LOUD world;
designed-absence L07+ — the rhyme inverted); music: motif stubs only where law
permits (bass-line at the nest, hymn fragment at the dawn) — the commissioned
score is post-slice (flagged); combat: S002 set + human-opponent barks (scratch
VO if time; text-tone otherwise, honestly labeled in review); boss: §4's scheme;
dialogue: crew chatter beds (loops, low, unsubtitled walla) + 12 scripted bark
lines (subtitled); reverb: per-zone; dynamic: meaning-states only LAW; mixing:
-23 LUFS integrated, the sigh at -12 peak (the loudest thing in the prologue);
transitions: bed crossfades at seams; accessibility: full captions incl. sound-
description track ("[the sigh — descending, distant]").

## SECTION 7 — LIGHTING & ATMOSPHERE (final pass)

Per-zone EV anchors ×10 (the setGrade law): L01–06 night-warm (floodlight amber
vs living dark — the game's warm register spent HERE); L07–10 the Ch.1 grade
(0.88 anchor). Volumetrics: rain shafts under floodlights (prologue), dust
shafts (stillwood) — one idea per zone LAW. Exposure: locked, 2 s seam
crossfades. Boss lighting: the classification lamp. Readability: lanes +10–15%;
muted-greyscale captures per zone. `[UE5 MIRROR]`: Lumen anchors per Book X §7.
Optimization: one shadowed light per zone; volumetrics ≤0.8 ms.

## SECTION 8 — VFX FINALIZATION

Rain (L01–06: streaks + drip rings under lights — the prologue's one weather),
THE SIGH (the desaturation wave — MPC-pattern material sweep, the game's
signature effect, must be flawless), muzzle/tracer/spall (polished), the D-2's
lamp cone + capacitor vent, the acre's lens glow + dawn light bloom-up, dust
motes (stillwood), fog planes ×3 LAW. No smoke, no explosions in the slice.
Post: the locked filmic stack; grain 0.10; zone LUTs. Budget: ≤1 particle idea
per space, pooled, capped in data.

## SECTION 9 — PERFORMANCE (measurable targets, the gate)

60 fps @1080p integrated (min-spec laptop, all 10 zones, worst view each);
30 fps floor with governor; input-to-photon ≤70 ms; initial payload ≤200 MB
(author art optimized: key art + 7 codex images ≤2.5 MB total webp; GN pages
≤3.5 MB; textures baked at runtime = 0 network); zone streams ≤150 MB, seams
0 visible; draw calls ≤1,500/zone; memory ≤1.5 GB tab; cold link→title ≤15 s,
title→play ≤10 s; no GC spikes >2 ms; CI budget snapshot per zone in the
nightly. `[UE5 MIRROR]` table per Book IX §11 Phase B.

## SECTION 10 — ACCESSIBILITY (the ship-blocking set)

Subtitles: size to 200%, speaker names, sound-description track, paper-strip
styling at all sizes; colorblind: the green→luminance variant + shape-doubled
codes (the sapling/lens carry a shape mark); input: full remap (KBM+pad), all
holds→toggle EXCEPT authored rites (the permit prompt stays two presses — it
must feel mundane; the plant-hold gets toggle option); difficulty assists: aim
assist 0–3, lethality −25/−50%, Story preset; camera: FOV 65–90, bob/sway/
blur/shake toggles, motion-reduced mode (no drift, no settle dip); UI scale
100–200%; audio: mono, master/bed/fx/vo sliders, visualize-audio ticks
(paper grammar); photosensitivity: no strobes anywhere, the white smash is a
0.4 s ease LAW-compatible.

## SECTION 11 — PLAYTESTING (external, structured)

Two rounds, n=5 fresh each (recruit outside the circle; screen+input capture;
think-aloud). Measures — quantitative: completion %, session length, per-zone
dwell, deaths (by zone), permit-prompt filing rate, prompt-hint requests,
puzzle solve time, drop-off points (where quit), fps on tester hardware;
qualitative: first-impression (60 s in, one sentence), exit-words per beat
(the sigh / the prompt / the incident / the defection / the dawn — target
families per BIV.5), story comprehension probe ("what did you do at the
terminal?" — the R2 seed check), architecture recall (draw the cathedral),
NPS-style "would you continue?" + "would you share the link?". Drop-off
autopsy: any zone with >1 quit gets a fix before R2. R2 gates: completion
≥80%, median 32–48 min, prompt filed 5/5, zero S1/S2 observed.

## SECTION 12 — BUG TRIAGE (the professional ladder)

Severity: **S1 Critical** (crash/progression-block/save-loss — fix same day) ·
**S2 Canon/Identity** (law violations: ration breach, damage numbers, marker
UI, silence-law break — fix before next deploy; the class this project made
famous) · **S3 High** (feature wrong: drill misfire, seam hitch, puzzle
softlockish) · **S4 Medium** (feel/polish: pop, mix bump, hint text) · **S5
Cosmetic**. Category tags: PERF/NARR/GAME/AUDIO/ANIM/UI/ENV. Ledger: GitHub
Issues, `S{n}/{cat}` labels; the slice ships at zero S1–S2, S3 ≤5 known+listed.

## SECTION 13 — PUBLISHER REVIEW (pre-flight, honest)

Self-assessment against the six desks (per Review Board 001's verdicts):
visual — the one-frame identity now EXISTS in-engine (F1→Acre); the prologue's
warm biome is the risk item (K3 gate protects); gameplay — the loop is proven
fun-ugly; the slice adds narrative gravity; originality — the covenant + the
permit prompt demo-able in 45 min: the pitch IS the demo now; stability —
CI + budgets + soak; commercial — the link as perpetual demo (Annapurna/505
are the two real doors [RB-001]; the one-pager leads with the prompt device
and the author's art); production risk — solo + AI cadence documented by four
shipped sprints (the ledger is the proof). **Required before any publisher
sees it:** GN-1 at author-art v1 minimum, zero text-tone barks in the first
17 minutes (scratch VO those 12 lines), the end-card CTA, and the one-pager.

## SECTION 14 — STEAM DEMO PREPARATION (readiness, not launch)

The web link IS the demo (Phase A law). Steam-readiness delivered as a doc +
build affordances: main menu polish (FE) ✓; loading frames ✓; settings ✓;
achievements future-ready (the Top-25 hooks emit events already — list
drafted, none shipped); save support (chunks ✓ + export/import file for the
A→B migration); controller (full pad path + glyphs); Steam integration
checklist (overlay-safe fullscreen, offline saves, cloud-file mapping);
demo ending: the dawn → end-card → THE REGISTRY unlocks + Standing Watch
replay + share-CTA ("give someone the link"). Page assets: 5 shot-library
captures + the author's key art capsule test.

## SECTION 15 — END-OF-SPRINT CHECKLIST (condensed heads; full sub-items in tracker)

☐ Block Y closed ☐ FE1–7 complete, no dead UI ☐ K3 gate GO ☐ L01–L10 built,
dressed, seamed (0 visible loads) ☐ the sigh event flawless ☐ permit prompt
unmarked/unscored, filing ≥95% ☐ first combat fun-ugly ☐ D-2 Incident: control-
retained, drag-verb real, white ≤0.4 s ease ☐ GN-1: 11 pages, two-color law,
four bars, form-match both ends ☐ title beat + defection land ☐ nest promise
absolute ☐ tower puzzle ≤3 min blind ☐ acre finale + dawn hold + end-card ☐
progression's four axes verifiable ☐ UI paper/ink final ☐ 10 EV anchors ☐
audio beds ×10 + 12 barks (scratch VO) + captions ☐ VFX list done ☐ perf
targets green ×10 zones ☐ accessibility set live ☐ playtest R1+R2 gates
passed ☐ zero S1/S2, S3 ≤5 listed ☐ 76 tests green + suite additions ☐
publisher one-pager ☐ deploy + tag `v2.5.0-slice` ☐ ledgers + retro ☐ **the
user holds the finished link.**

## SECTION 16 — SPRINT RETROSPECTIVE (template + the standing questions)

Strongest/weakest systems (measure: change-rate + playtest signal); technical
debt inventory (accepted: text-tone barks beyond min-17, motif stubs, author-
art GN v1, Surveyor scripted; never: budget/canon/silence violations);
pipeline lessons (hours-per-dressed-minute — THE number for the re-scope
gate); readiness for full production = the Engine Gate review [Book IX §7.0]
runs at this sprint's exit with real data. **Sprint 005 recommendation
(pre-registered):** whichever way the gate falls — Tranche 1 (Ch.2–3) on the
measured formula, OR the Act-I reframe conversation with the publisher
one-pager in hand (Review Board 001 §15). The slice decides; that was always
its job.

---

*— End of SPRINT 004 PLAN. Authority: the shelf + Sprints 001–003 + the user's
2026-07-04 directives (front-end suite; author art canon for the front-end; the
10-location, 40-minute prologue; the four-axis progression mapping). The sprint's
one question, from Book IX: **does the first 45 minutes feel like the shipped
game?** Amendments require a logged entry in PROJECT_STATE.md.*
