# ECHOES OF EDEN — SPRINT 002 IMPLEMENTATION PLAN
### "THE COVENANT GREY-BOX" · The First Complete Gameplay Loop · Official Sprint Document · 2026-07-04

*Authority: Book IX §3 Phase 2 + Book X §17 Sprint 2 (the covenant grey-box gate),
executed per this brief's loop mandate. Canon governs every mechanic named here —
nothing is redesigned, everything extends Sprint 001's architecture. The Lane Ruling
stands [PROJECT_STATE 2026-07-04]: execution on the web lane, `[UE5 MIRROR]` notes
throughout, so the plan reads verbatim as a UE5 plan if the Engine Gate fires.*

**STATUS CORRECTION (logged, honest):** Sprint 001 is planned in full and its
**Phase A is executed** (gates closed, MP excised, CI + the live link). Its Phases
B–E (controller retune, interaction framework, save foundation, UI shell, graybox)
are **open** and are the load-bearing substrate of everything below. This plan
therefore begins with **Block Z — the Sprint 001 carry-over**, sequenced first, so
Sprint 002's ledger stays truthful. Nothing in Block Z is re-planned — it executes
`SPRINT-001-PLAN.md` §2 Phases B–E as written.

**THE LOOP THIS SPRINT PROVES (the brief's mandate, in canon terms):**
EXPLORE (read the approach) → DISCOVER (the regrowth site) → INTERACT (plant/start
the green unit) → FIGHT (the covenant wave — defend the pointable thing) → WIN (the
charge banks) → REWARD (the aftermath: the sapling stands, the world ledger writes,
the bench opens) → CONTINUE (the exit seam re-opens exploration). This is Book V
§1.2's macro loop, grey-boxed — *if this is not fun ugly, nothing built on it will
be fun pretty* [Book IX §13 Prototype gate].

---

## SECTION 1 — SPRINT OVERVIEW

- **Objective:** the first complete, canon-true gameplay loop: one weapon family
  (the Arsenal C-9 "the Nine") + the spade melee, the Breath/Binding damage model,
  the five-state Wardenry AI with one elite, one covenant arena, and the full
  feedback/reward/checkpoint chain — playable at the staging link, fun in grey.
- **Estimated duration:** **Block Z (S001 carry-over): 62–78 h** + **Sprint 002
  proper: 72–96 h** → **134–174 focused hours total** (≈ 5–7 solo weeks; task table
  §2 sums to 158 h nominal). The two blocks interleave where dependencies allow.
- **Definition of Done (sprint-level):** the covenant grey-box gate [Book IX §13]:
  one arena, one full wave sequence, "fun ugly" verdict from 4/5 testers; the
  timing-table test extended to weapons and green; 60 fps grey-box on min-spec;
  all §14 checklist items green; deployed to the link.
- **Dependencies:** Block Z (internal); no external blockers — G0 gates are closed.
- **Deliverables:** D1 locomotion+camera to table (Z) · D2 interaction/save/UI/
  graybox foundation (Z) · D3 the C-9 weapon system + spade · D4 Breath/Binding
  damage + enemy plate model · D5 Line Warden AI (five states + escalation drill +
  pair doctrine + radio actor) · D6 Warden First Class elite · D7 the Acre arena
  (grey) + covenant wave director v1 · D8 combat feedback suite (canon-bounded) ·
  D9 aftermath/reward chain + checkpoint integration · D10 level-taught combat
  tutorial · D11 combat debug tools · D12 QA suite extension.
- **Technical risks:** wave-director/AI interplay complexity (mitigate: director
  drives SPAWN ORDERS only, AI stays autonomous); enemy capsule vs Rapier moving
  bodies (reuse S001 C3 findings); anim-state legibility without real anims
  (mitigate: posture proxies — color/pose swaps on grey capsule-rigs, the posture
  law rehearsed cheap).
- **Production risks:** scope gravity toward "more enemies/weapons" (the roster is
  LOCKED at Line Warden + First Class + Surveyor-stub this sprint — Book X's
  taxonomy arrives family-by-family, not all at once); the legacy arcade combat
  tempting reuse-in-place (rule: legacy code may be MINED for snippets, never
  extended — new systems live in `core/combat`, ledgered).

## SECTION 2 — TASK BREAKDOWN

*Format: # · task · Pri · hrs · Diff · Deps · result · commit · QA requirement.
Block Z tasks reference their S001 IDs and are not re-specified here.*

**BLOCK Z — SPRINT 001 CARRY-OVER (execute per SPRINT-001-PLAN.md §2)**

| # | Task (S001 ID) | Pri | Hrs | Notes |
|---|---|---|---|---|
| Z1 | A5 folder restructure | P0 | 4 | first — everything lands in `core/` |
| Z2 | B1+B2 locomotion state machine + timing test | P0 | 15 | the feel canon |
| Z3 | B3+B4 camera + footsteps | P0 | 12 | |
| Z4 | B5 input contexts/buffering | P0 | 6 | weapon states need contexts |
| Z5 | C1+C2 interaction framework + set 1 | P0 | 14 | the plant-verb rides this |
| Z6 | C4+C5 save chunks + checkpoints | P0 | 13 | combat checkpoints ride this |
| Z7 | D1+D2 UI tokens + menus/settings | P1 | 14 | |
| Z8 | E1 graybox proving level (stations 1–12) | P1 | 12 | the Acre becomes station 13 |
| Z9 | E2 dev tools base (`eoe.*`) | P1 | 8 | §11 extends it |
| Z10 | C3+C6+D3+D4+E3 (elevator, seam, slots, HUD, package) | P2 | 14 | may trail into polish week |

**BLOCK W — WEAPON & DAMAGE (Sprint 002 proper)**

| # | Task | Pri | Hrs | Diff | Deps | Result · Commit · QA |
|---|---|---|---|---|---|---|
| W1 | **Weapon framework** (`core/combat/weapon`): weapon-as-data (DA schema: timings, ammo class, cone, recoil curve), state machine (idle/ready/fire/reload-staged/stow/jam-stub), input-context integration | P0 | 8 | 4 | Z2,Z4 | framework + tests · `feat(combat): weapon framework — data-driven state machine` · timing assertions per state |
| W2 | **The C-9 "Nine"** implementation: semi + 2-round burst (NO full-auto LAW), hitscan ≤30 m → projectile beyond, spread by stance (crouch +15%, moving penalty per table), recoil (3–4° rise, settle curve), staged interruptible reload (tactical 2.4 s / empty 3.2 s, half-fed persists), draw/stow (±10% canon band) | P0 | 10 | 4 | W1 | the primary weapon · `feat(combat): Arsenal C-9 — burst discipline, staged reload, honest ballistics` · full timing table + cone visualizer check |
| W3 | **The spade (melee fallback):** 1.0 s strike, stamina-priced, staggers unplated, cracks crates; defensive shove; NO takedown cinema LAW | P0 | 5 | 2 | W1,Z2 | melee verb · `feat(combat): spade melee — strike, shove, stamina price` · stagger/no-cinema check |
| W4 | **Damage pipeline** (`core/combat/damage`): hit event → material/plate-arc resolution → Breath/Binding routing → feedback events; NO damage numbers LAW; damage-type enum WITHOUT anti-personnel-explosive (type-system canon) | P0 | 8 | 4 | W1 | one pipeline for all parties · `feat(combat): damage pipeline — plate arcs, Breath/Binding routing` · pipeline unit tests |
| W5 | **Player vitals:** Breath (regen-to-segment, 5 s out-of-fire) + Binding (4+4 segments, dressing verb 3.5 s interruptible, 2-hand); death → checkpoint ≤5 s, cut-to-grey (no humiliation LAW); double-rule HUD binding | P0 | 8 | 3 | W4,Z6,Z7 | canon health live · `feat(combat): Breath/Binding player vitals + dressing verb` · segment-boundary regen tests; death-loop soak |
| W6 | **Enemy vitals:** plate arcs as physical shapes on the capsule rig (torso/shoulder), joins/straps as honest hit zones; helmets defeat ball at range (accuracy honesty, not damage tax); spall/flinch feedback events | P0 | 6 | 3 | W4 | enemy damage model · `feat(combat): enemy plate-arc model — joins, helmets, spall` · arc-resolution determinism test |
| W7 | **Ammo economy v1:** ball-caliber counters, diegetic stencil HUD, hand-loot verb (0.8 s crouch) from fallen Wardenry — ball calibers ONLY, weapons never lootable LAW 4-B; cache interactable (the "weapon pickup" of this sprint: the C-9 is acquired at a CACHE, scripted, not vacuumed) | P1 | 5 | 2 | W2,Z5 | ammo loop · `feat(combat): ammo counters, hand-loot verb, cache acquisition` · floor-law stub noted |

**BLOCK A — AI (the Wardenry arrives)**

| # | Task | Pri | Hrs | Diff | Deps | Result · Commit · QA |
|---|---|---|---|---|---|---|
| A1 | **Five-state trunk** (`core/ai`): Unaware→Curious(20–40 s procedure)→Engaged→Searching(45–90 s LKP)→**Filed** (cordon posture + permanent world-ledger write); sense-honest perception (sight cone + light term; hearing from the noise column); NO psychic tracking LAW | P0 | 12 | 5 | Z2,Z9 | the doctrine trunk · `feat(ai): five-state grammar + sense-honest perception` · state-gizmo review; no-psychic test (fire unseen → Curious not Engaged) |
| A2 | **Line Warden unit:** pair doctrine (one covers, one moves; bounding withdrawal dragging wounded), escalation drill (ANNOUNCE→POSTURE→FIRE, skippable only by player fire), C-9 burst discipline, compliance-phrase bark slots (text placeholders) | P0 | 12 | 5 | A1,W2,W6 | the baseline human opponent · `feat(ai): Line Warden — pairs, escalation drill, doctrine combat` · drill-order test; pair-cover observation |
| A3 | **Radio actor:** alert propagation as an audible, interruptible world event (duration, source, kill-to-silence); unchecked → squad state escalation + Filed hardening | P0 | 5 | 3 | A1 | information moves physically · `feat(ai): radio actors — audible, interruptible alerts` · interrupt test (kill radio mid-call → no propagation) |
| A4 | **Staged spawns:** arrival routes (gate/stair markers), watchable approach LAW 6-B; wave-director handshake (orders in, arrivals staged) | P0 | 5 | 3 | A1 | no teleport spawns · `feat(ai): staged arrivals via route markers` · spawn-visibility audit |
| A5 | **Warden First Class (elite):** same silhouette, behavior deltas (shorter announce, refuses bait investigations — sends junior, pre-aims the arena's flank lanes), wear-biography ID stub (tint/decal proxy in grey), partner grief-bark slot | P1 | 6 | 3 | A2 | seniority not palette-swap · `feat(ai): Warden First Class — veteran doctrine deltas` · blind-ID test (testers spot the elite by behavior) |
| A6 | **Death/defeat honesty:** grounded brief deaths, radio-still-talking beat, drag-out attempts when doctrine permits; Searching→Filed writes cordon-stub to world ledger | P1 | 5 | 3 | A2,Z6 | the world files the fight · `feat(ai): deaths, drag-outs, filed-state ledger writes` · post-fight re-visit shows cordon stub |

**BLOCK C — THE COVENANT (arena + loop)**

| # | Task | Pri | Hrs | Diff | Deps | Result · Commit · QA |
|---|---|---|---|---|---|---|
| C1 | **The Acre arena (grey):** §7's build — radial archetype A appended to the proving level; scale-table true, under an enormous grey mass; lanes/flank/retreat per V-6 | P0 | 10 | 3 | Z8 | the arena · `feat(levels): the Acre — covenant arena grey-box` · V-6 audit (≥3 lanes, ownable flank, no-dead-end retreat, read vantage) |
| C2 | **Covenant loop v1** (`core/covenant`): protected-thing registry (sapling stub + green-unit stub with bank meter), plant/start interaction (hold-verb), wave director (3 waves: pair → pair+elite → pairs+radio; escalation by doctrine not HP LAW), bank ticks, win state | P0 | 12 | 5 | A4,Z5 | the loop's heart · `feat(covenant): protected registry + wave director v1 + banking` · full-loop soak ×20; sapling-damage-by-player fail case (LAW 4-D: possible, catastrophic, player's) |
| C3 | **Aftermath & reward chain:** win → mix-drop stub → the ACCOUNTING staging (protected thing first: camera-free, layout-forced), world-ledger write (acre banked), bench unlock (one upgrade: C-9 trigger work — handling change, not damage LAW 10-A), lore pickup (1 doc), dressing + ammo cache refresh; checkpoint write | P0 | 8 | 3 | C2,Z6 | win→reward→continue · `feat(covenant): aftermath — ledger write, bench unlock, reward chain` · reward-order observation (do testers check the sapling first?) |
| C4 | **Combat tutorial (level-taught, §10):** staged first-contact sequencing inside the approach + arena; zero tutorial popups (one journal line max) | P1 | 6 | 3 | C1,C2 | taught by space · `feat(levels): combat tutorialization pass — taught by staging` · blind-newcomer test (5 users, no prompts needed) |
| C5 | **Combat feedback suite (§8):** crosshair states, subtle hitmarker (+audio tick), directional damage vignette, spall/flinch VFX events, screen effects ≤ canon (shake bus, no slow-mo); enemy feedback (posture flinch, plate-shed stub on elite) | P1 | 8 | 3 | W4 | readable combat · `feat(combat): feedback suite — canon-bounded readability` · muted-playtest readability check |
| C6 | **Combat debug tools (§11)** + QA suite extension (§12) + deploy | P0 | 7 | 2 | all | tools + green CI · `feat(dev): combat/AI debug suite; test extension; sprint-002 deploy` · §14 checklist run |

**Nominal total: Block Z 112 h-of-plan → 62–78 h executed lean · Blocks W/A/C 96 h
nominal → 72–96 h band. Sprint total ≈ 158 h nominal.**

## SECTION 3 — WEAPON FRAMEWORK (architecture, canon-bound)

**Data-driven weapon-as-asset** (`data/weapons/*.json` — the UE5 `DA_Weapon`
mirror): family, timings (±10% locked band — the timing test asserts), ammo class,
magazine model, spread cones by stance, recoil curve refs, feedback event map
(anim/audio/particle event names — one event vocabulary across lanes). **State
machine:** idle/ready/fire/burst-cycle/reload(staged: eject→feed→chamber, each
stage a checkpoint — interruption preserves stage)/stow/jam-stub (fouling arrives
Sprint 003+ with the bench system's maintenance). **Fire modes:** the C-9 is semi +
2-round burst ONLY (mix law — full-auto would bury the protected thing's audio
[Book V LAW 4-A]); mode toggle on the existing input. **Hit detection:** hitscan
≤30 m, projectile with drop beyond (the C-9's engagement band makes hitscan
dominant this sprint; the projectile path ships dormant-but-tested for the R-4
later). **Recoil:** camera-space rise per shot on a settle curve; NO random-only
recoil (pattern + noise, learnable). **Spread:** honest cones (crouch +15%, lean
−10% stub, move penalty per locomotion state); no bloom-on-jump gimmicks.
**Events:** every state transition emits `anim:`, `audio:`, `vfx:` events by name —
placeholder consumers this sprint (pose proxies, procedural pips, tone stubs), real
assets later WITHOUT framework change. **Future compatibility:** the P-11/Tide/R-4/
seed-thrower/Jack are data files + state-machine variants (tube-feed, single-load,
two-hand deploy) already stubbed as machine states; upgrades hook the data layer
(trigger work = timing delta file — never code) [Book V §10 LAW 10-A].
`[UE5 MIRROR]`: DA_Weapon + ABP anim-notifies + MetaSound events, identical names.

## SECTION 4 — COMBAT FRAMEWORK

**Damage:** one pipeline, all parties: `HitEvent{source, target, zone, ammoClass,
distance}` → zone resolution (plate arc / join / unarmored / material) → routing
(player: Breath-chip vs Binding-segment; enemy: plate-chip vs join-wound) →
feedback events. **Critical hits:** canon-true — there is no multiplier fetish:
joins/straps are the skill target (full damage past plate); headshots work vs
unarmored, helmets defeat ball at range HONESTLY (deflection, audible) [Book V
§4.7]. NO damage numbers on screen, ever LAW. **Armor interaction:** plate
converts Binding-class to Breath-class chip + spall feedback [Book V §3.5];
elite plate-shed staging stub. **Invulnerability frames:** none — Eden has no
dodge-i-frame grammar; survivability is position + Breath regen out-of-fire (5 s)
+ the dressing verb. The ONE mercy window: post-checkpoint-restore 1.0 s
no-aggro (anti-spawn-camp, world-side not player-side). **Hit reactions:**
posture-honest — Breath-chip = flinch-in-posture (aim disturbed), Binding-hit =
stagger step; enemies mirror (plate flinch vs join stagger). **Knockback:**
mass-honest shove only (spade shove, capacitor-bloom push stub) — no juggling.
**Impact effects:** spall plates with stub-mesh chips (never gravel LAW), material-
true hit ticks. **Player feedback:** §8. **Enemy feedback:** posture + bark + plate
state. **Combat pacing:** the covenant's 3-wave arc with breath-gaps between waves
(15–25 s aftermath-mini per wave — check-the-sapling beats); encounter ends on
cost/question staging, not victory audio LAW. **Risk vs reward:** push = exposure
buys lane control near the sapling; fall back = safety spends bank-rate (the green
unit banks slower when hostiles stand inside the acre radius — pressure made
mechanical, simple v1 rule, tunable data).

## SECTION 5 — ENEMY AI (production v1)

**The five-state trunk is the Behavior structure** (Book X §4; the brief's states
map in): Idle/Patrol = **Unaware** (rotation walk, interval-regular, torch pool
self-blinding); Investigate/Search = **Curious** (procedure: walk-to-stimulus,
chalk-stub, radio-check; 20–40 s) and **Searching** (LKP lattice, 45–90 s); Detect
= the **escalation drill** (announce→posture→fire — detection is a PROCEDURE, not
a ping); Attack = **Engaged** (pair doctrine: cover+move bounds, suppression role
talks while partner bounds, crossfire called audibly); Take cover = trained bounds
between authored cover (arena lane data, not free EQS this sprint); Retreat/
Recover = doctrine withdrawal (bounding, dragging wounded — the creed visible);
Die = grounded + radio-still-talking; Alert allies = **the radio actor ONLY**
(audible, interruptible — kill the caller or the set mid-call and nothing
propagates); Lose target → Searching → **Filed** (cordon posture, ledger write,
resume patrol +1 hardening); Return to patrol = Filed's resume. **Blackboard
organization:** `TargetLKP, AlertLevel, PairPartner, CommanderAlive(stub),
DrillStage, LeashAnchor, RadioAvailable` [Book X §4 keys]. **Behavior-tree
structure:** trunk selector on the five states; Wardenry subtree = drill + pair
services; per-unit deltas are DATA (announce timing, bait-refusal flag, flank
pre-aim set) — the elite is a data row, not a new tree LAW. **Perception:**
sight = cone + light-level term; hearing = noise-event bus (the locomotion noise
column feeds it); focus narrows on task. **Optimization:** ≤16 alive LAW makes
this cheap; distant units schedule-tick; per-frame sense budget (staggered
perception updates, 10 Hz). `[UE5 MIRROR]`: BT/BB per Book X §4 verbatim.

## SECTION 6 — ANIMATION (grey-rig plan)

*No character art exists yet — this sprint ships the ANIMATION ARCHITECTURE on
grey proxy rigs (capsule + articulated posture proxies), so the posture law is
real before assets arrive. Every state below = a posture pose + transition timing
now, a full clip later, SAME state graph.*

**Player (viewmodel proxies):** fire (kick pose + recoil), reload (3-stage arm
choreography as timed pose steps — the interruptibility is the point), aim
(ADS pose lerp), sprint (weapon-lowered), walk/crouch bob hooks (Z3), jump/landing
(settle poses by class), interaction (one-hand and two-hand hold poses — the
dressing and plant verbs read), damage (Breath flinch = view nudge ≤0.5° via the
shake bus; Binding = heavier settle), death placeholder (cut-to-grey — no death
anim by design LAW). **Enemy (grey rigs):** idle (occupational: strap-check
beat), patrol (interval walk), walk/run (bound), attack (posture+burst cycle),
damage (plate flinch / join stagger), search (torch sweep + chalk crouch), alert
(the drill's three postures — ANNOUNCE stance is a readable silhouette change),
death (grounded fold + gear settle), drag-out (pair carry pose). **Transition
rules:** AI state ↔ posture 1:1 LAW; transitions never skipped for snappiness
LAW — the body announces every decision [Book VII §12]. **Architecture:** one
posture-state graph per family (`core/anim`), events consumed from the weapon/AI
event vocabulary; `[UE5 MIRROR]`: ABP state machines + montages per Book X §5;
no motion matching, no mocap — these grey timings BECOME the keyframe brief.

## SECTION 7 — THE COMBAT ARENA: "THE ACRE (PROVING)" — station 13

**Fiction-forward grey:** a dead grey clearing (stillwood-stub columns) breached
by one living point — the sapling stub + green unit at center. Archetype A radial
[Book VI §8.3]. **Dimensions:** 70 × 55 m playspace; defended center radius 20 m;
cover ring at 8–12 m from center (6 fin/crate elements, chest-height standard);
ceiling/mass: the arena sits under a 30 m grey viaduct-stub slab — insignificance
in grey LAW. **Sightlines:** three lanes down colonnade-stub rows (N/SW/SE
approaches); arena grain runs N–S; one long lane (60 m) for future marksman
teaching, unused by AI this sprint. **Verticality:** one gantry flank at +4 m
(the ownable flank, ladder + future sling stub) overlooking the N lane.
**Entry:** from proving-station 12 through a threshold corridor → the read
vantage (a low ridge overlooking the whole arena BEFORE entry — the pre-fight
Read spot LAW). **Exit:** S seam re-opens post-covenant to a bench pocket (the
reward room) → loops to the proving hub. **Enemy spawns:** staged arrival
markers at the three lane mouths (gate-stub, stair-stub, ridge path — all
watchable). **Elite placement:** wave 2, N lane, with a junior partner (the
bait-refusal behavior is OBSERVABLE against the gantry flank). **Player
movement:** orbit-and-spoke geometry — cover gaps at 8–14 m sprint distances;
the retreat lane (S) never dead-ends. **Environmental storytelling (grey-stub):**
the cordon-stub tape line from a previous "incident," one chalk-stub marking,
the D-1-husk silhouette massing on the far ridge (unlit, unreachable, 100 m —
the boss-shaped dread, free). **Difficulty goals:** wave 1 completable by a
first-time player without dressing use; wave 3 pressures 1–2 dressings; full
loop failable only by ignoring the sapling (LAW 4-D's lesson).

## SECTION 8 — COMBAT FEEDBACK (canon-bounded readability)

Crosshair: minimal cross, state-aware (spread-breathe with cone, dim when
weapon lowered, dot-only in ADS); hit markers: subtle tick + audio click,
headshot/join variant tone — NO kill confirmations, NO score popups LAW;
damage indicators: directional Breath vignette (thin, amber-tinted per canon
UI), Binding hit = deeper pulse + the double-rule HUD segment loss; screen
effects: shake bus ≤0.5° LAW, no slow-mo, no chromatic punches; controller
vibration: event hooks stubbed (Phase B enhancement, never required LAW);
audio feedback: material-true impacts, plate spall ring, join-hit dull thud
(the honesty is audible), enemy barks as state feedback; enemy feedback:
posture flinch/stagger, plate-shed on the elite (visible damage biography),
drill postures readable at silhouette range; visual readability: muted-audio
playtest must remain fully readable; the READ of combat is posture + tracer +
cone, not particle soup — one particle idea per frame LAW.

## SECTION 9 — REWARD SYSTEM (the aftermath chain, canon-locked)

**The win IS the reward, staged:** the sapling stands (the protected thing's
survival is the victory sting — its wind-stub audio rises as the mix drops);
the bank meter's total writes to the world ledger (persistent, save-chunked);
THEN materiel: **enemy drops** = ball-caliber ammo only via the 0.8 s hand-loot
verb (weapons never lootable LAW; no loot bursts, no pinatas); **caches** =
dressings + ammo refresh in the bench pocket; **lore pickup** = one document
(the cordon-stub's incident slip — reward hierarchy: understanding above
materiel LAW); **progression** = the bench opens ONE upgrade (C-9 trigger work:
–0.2 s ready time — a handling change, never damage LAW 10-A) + the journal's
first combat annotation (perception progression stub); **temporary buffs:**
none — not in this game's grammar; **balancing:** ammo inflow ≈ 80% of median
outflow (count in playtest, tune the caches); the critical-path floor stub
(LAW 11-A) logged for Sprint 003. NO XP, NO score, NO kill-count rewards —
the fields do not exist LAW [Book X §21.4].

## SECTION 10 — TUTORIALIZATION (taught by the level)

Combat: first contact is ONE announcing Warden pair at the approach choke —
the escalation drill IS the tutorial (the announce phase gives the player
time to understand; firing first is taught as a choice); reload: the cache
gives exactly 2 magazines before the arena — scarcity teaches the R press and
the staged-reload's interruptibility teaches itself under pressure; cover:
the cover ring's geometry + the pair's suppression role (being suppressed
behind a fin teaches the bound-and-cover grammar by receiving it); enemy
awareness: the torch-pool self-blinding is demonstrated by the approach's
dark flank (walk past a torch Warden unseen ONCE, staged); weak points: the
first Warden's shoulder-join faces the player's vantage at the choke (the
spall-vs-thud audio difference teaches zones in two shots); rewards: the
bench pocket is ON the exit path (unmissable), the lore slip beside the
dressings (reading taught by adjacency). UI: ONE journal line per taught verb
maximum; zero popups, zero highlighted anything LAW.

## SECTION 11 — DEBUG TOOLS (extends `eoe.*`)

`eoe.ai` (real now): five-state gizmos over heads, perception cone/hearing-ring
draw, blackboard inspector per selected unit, drill-stage readout; `eoe.ai.time`
state-transition log; `eoe.combat`: damage-pipeline event tap (zone, routing,
result — console, since numbers are banned on screen), TTK/TTD session stats;
`eoe.hitbox`: plate-arc/join volume viewer; `eoe.weapon`: cone visualizer, recoil
plot, state-machine readout, timing live-check; `eoe.anim`: posture-state
overlay (AI state vs posture 1:1 audit view); `eoe.wave`: director timeline,
spawn-order queue, bank-rate meter; `eoe.heatmap`: position recording → orbit-
and-spoke verification export; `eoe.perf`: per-system frame cost (AI/anim/
physics buckets). All dev-flag gated, stripped from ship LAW.

## SECTION 12 — QA PLAN

**Functional:** weapon state machine (every transition × interrupt matrix);
reload stage persistence (interrupt at each stage → resume correct); dressing
verb interruption; cache/loot verbs; bench upgrade applies (timing delta
measurable). **Combat:** Breath regen boundary cases (regen stops at segment,
resumes correctly); plate→join routing determinism (fixed-seed volley test);
helmet deflection at range bands; spade stagger vs plated (no stagger) —
each an automated or scripted-scene test. **Animation:** posture 1:1 audit
(every AI state change → posture change within 150 ms, none skipped).
**AI:** drill order (never fires before posture unless fired upon); pair
integrity (never both move); radio interrupt (silence propagation); no-psychic
(unseen suppressed player not magically found); Filed writes ledger; leash
honesty (escort-stub anchor). **Performance:** 60 fps min-spec with 6 alive +
wave VFX; perception budget ≤1 ms/frame at 16 alive (synthetic). **Edge cases:**
sapling destroyed by player (fail-retry staging, no soft-lock); all Wardens
dead mid-wave (director advances); save/reload mid-wave (restore at wave
boundary snapshot); pause during drill; alt-tab during reload. **Regression:**
the S001 suite + timing tables re-run every PR; the proving-level 12-station
walkthrough stays green. **Acceptance:** the covenant grey-box gate — fun-ugly
4/5, full-loop soak ×20 clean, checklist §14 green.

## SECTION 13 — OPTIMIZATION

Animation: posture proxies are near-free; budget rule set now — ≤16 full-rate
anim updates (the headcount law is the budget). AI: staggered 10 Hz senses;
schedule-tick beyond 60 m; zero per-frame allocations in the trunk (pool
events). Weapon: pooled tracers/casings (mined from legacy, re-homed in
`core`); hitscan ray reuse. Collision: plate volumes as simple primitives on
one filtered group; the interaction trace and combat rays on separate masks
(S001 channels). "Niagara" (web: the effects layer): one particle idea per
frame LAW is the perf plan — spall stubs pooled, counts capped in data.
Audio: event-pooled one-shots; bark de-dup (one voice per pair per 2 s).
"Blueprint" (content configs): wave/encounter configs are data — zero logic
in content, the Z1 layer law enforced in review. `[UE5 MIRROR]`: URO,
significance manager, Niagara pools per Book X §14.

## SECTION 14 — END-OF-SPRINT CHECKLIST (~100 items, grouped)

**Block Z foundation (18):** ☐ folders per plan ☐ locomotion table green ☐
stamina/regen green ☐ camera caps enforced ☐ footsteps surface-true ☐ input
contexts ☐ buffering 120 ms ☐ interaction trace ☐ door ☐ lever ☐ lore-read ☐
pickup ☐ save round-trip ☐ checkpoint restore ≤5 s ☐ settings persist ☐
menu/pause/slots ☐ stations 1–12 walkable ☐ dev base tools.
**Weapons (16):** ☐ C-9 timings ±10% (automated) ☐ burst-only modes ☐ hitscan/
projectile split at 30 m ☐ stance cones ☐ recoil learnable (pattern test) ☐
reload stages persist ☐ reload interruptible each stage ☐ draw/stow times ☐
cone visualizer matches data ☐ spade strike/stagger ☐ spade shove ☐ no
takedown cinema ☐ ammo counters diegetic ☐ hand-loot ball-only ☐ weapons
never lootable ☐ cache acquisition scripted.
**Damage & vitals (14):** ☐ one pipeline all parties ☐ no damage numbers
anywhere ☐ no anti-personnel type exists ☐ Breath regen 5 s to boundary ☐
Binding dressing-gated ☐ dressing 3.5 s interruptible ☐ death ≤5 s cut-to-grey
☐ plate converts to chip ☐ joins full-route ☐ helmet deflects at range ☐
spall never gravel ☐ flinch/stagger by class ☐ post-restore 1 s no-aggro ☐
segments constant (no HP growth fields).
**AI (20):** ☐ five states observable via gizmo ☐ sight cone + light term ☐
torch self-blind demo ☐ hearing from noise column ☐ no psychic tracking ☐
drill order enforced ☐ drill skip only on player fire ☐ pair never both move
☐ suppression role audible ☐ bounding withdrawal ☐ drag-out attempt ☐ radio
audible ☐ radio interruptible ☐ unchecked radio escalates ☐ staged arrivals
watchable ☐ Searching LKP honest ☐ Filed writes ledger ☐ patrol resume +1 ☐
elite deltas observable blind ☐ elite never hesitates (state absent pre-Ch.6).
**Covenant loop (14):** ☐ plant/start hold-verb ☐ bank meter runs ☐ hostiles-
in-radius slows bank ☐ 3-wave arc ☐ inter-wave breaths 15–25 s ☐ win state ☐
sapling player-damageable (LAW 4-D) ☐ fail-retry staging clean ☐ aftermath
mix-drop ☐ sapling-first staging verified in test ☐ ledger write persists ☐
bench upgrade applies ☐ lore doc readable ☐ exit seam re-opens.
**Feedback & tutorial (10):** ☐ crosshair states ☐ hitmarker subtle ☐ no
kill-popups ☐ directional vignette ☐ shake ≤0.5° ☐ muted readability test ☐
first-contact teaches ☐ scarcity teaches reload ☐ join audio teaches zones ☐
zero tutorial popups.
**Tools/QA/deploy (8):** ☐ ai/combat/weapon/anim/wave/hitbox/heatmap tools ☐
tools stripped from ship ☐ CI suites green ☐ 60 fps min-spec ☐ soak ×20 ☐
fun-ugly 4/5 ☐ ledgers updated ☐ tag `v2.3.0-sprint002` + link deployed.

## SECTION 15 — SPRINT RETROSPECTIVE (template + pre-commitments)

**Stable?** expected: locomotion/timing suite, interaction, save chunks —
judge by change-rate during Blocks W/A/C (foundation edited under combat load
= contract debt). **Refactor candidates:** legacy `Effects/Audio` mining
boundaries (anything reached into more than twice gets re-homed in `core`);
the wave director if it grew AI opinions (it must stay a spawn scheduler).
**Acceptable debt (logged):** grey rigs, bark text placeholders, tone-stub
audio, Surveyor absent, single arena, floor-law stub, elite decal proxy.
**Never-acceptable debt:** timing failures, damage numbers anywhere, psychic
AI, unstaged spawns, posture-skip transitions, XP/score fields existing,
content-layer logic. **Ready for Sprint 003:** if the gate passes — the
Surveyor + Read Tier 1 in combat, the P-11, wave pages toward the Standing
Watch, and the graybox→Prologue-blockout pivot (Book X §17 S3). **Do NOT
expand yet:** enemy roster beyond plan, weapon count, arena count, any art
pass — the formula is proven in grey first.

---

*— End of SPRINT 002 PLAN. Authority: Books V/VII (mechanics canon), IX–X
(production/technical), Sprint 001 plan (substrate). The sprint's one question,
from the gate: **is the covenant fun ugly?** Everything else is scaffolding for
an honest answer. Amendments require a logged entry in PROJECT_STATE.md.*
