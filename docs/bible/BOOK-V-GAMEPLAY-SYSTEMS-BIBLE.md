# ECHOES OF EDEN
## BOOK V — THE GAMEPLAY & SYSTEMS BIBLE
### Edition One · The Definitive Systems Specification · 2026

*Filed as Book V per the 2026-07-03 shelf ruling (the Experience Bible is refiled as
Book IV.5; see PROJECT_STATE.md). Governed by BOOK 0 (identity) → BOOK II.5 (Canon Lock —
facts & rulings) → BOOK I–IV.5 as cited. Nothing herein contradicts a previous book; where
this book must invent (weapon roster, system names, numeric tuning), the invention is
flagged **[NEW CANON]** and logged in PROJECT_STATE.md. Where a previous book already
locked a rule, this book cites it and builds the system that obeys it.*

**Audience:** gameplay programmers, systems/combat/technical designers, AI programmers,
animation programmers, UI programmers, level designers, QA engineers. This book defines
**design specifications** — behaviors, values, states, rules, and acceptance criteria.
It contains **no code, no engine nodes, no implementation instructions.** Engineers
choose the implementation; this book defines what must be true when they are done.

**How to read this book:** every system is specified as (1) *purpose* — why it exists in
THIS game and no other; (2) *player feeling* — the experiential target from Book IV.5;
(3) *specification* — states, parameters, and interactions engineers can build against;
(4) *limits* — what the system must never do; (5) *validation* — how QA proves it. All
numeric values are Edition One tuning targets: they establish proportions and intent, and
may be adjusted ±20% in playtest without a canon amendment. Structural rules (marked
**LAW**) may not.

**The one-sentence version of this entire book:** every system exists to make the player
*feel the cost of things* — numbness is the failure state of the mechanics exactly as it
is the failure state of the fiction [B0 §2.1].

---

# SECTION 0 — CORE DESIGN PHILOSOPHY

## 0.1 What makes this game unique

Echoes of Eden is a first-person shooter in which the shooting is the *least* renewable
resource on screen. Its unique claims, each load-bearing:

1. **Combat defends something the camera can point at** — a sapling, a book cart, a
   door, a schedule [B0 §13.61]. There is no fight in the game whose reason cannot be
   framed in a single shot. The wave is not a mode; it is a *covenant*: the player holds
   ground around a living thing while a reversed Converter banks growth into it.
2. **Perception is the true progression system** [B0 §8]. The player's character sheet
   barely changes; the player's *eye* changes enormously. What levels up is the ability
   to read light, wear, load paths, and Chargehand — and the game pays that skill in
   understanding, routes, and preparation.
3. **The tutorial is the crime.** The permit prompt in the Prologue — two innocent
   button presses taught as UI — is re-priced at Chapter 5 as the cause of three deaths
   [Lock §15]. No other game makes its input tutorial the moral center of its midgame.
4. **The UI defects with the player** [B0 §9-UI]. The prologue's Edge HUD (grotesk,
   amber-on-dark) is replaced from Chapter 1 by the Sower kit-bag hand (paper,
   Chargehand, hand-ruled lines). The interface is a character with an arc.
5. **Preparation over flair** [B0 §8]. Mastery is positioning, readiness, maintenance,
   and route-craft — never slide-cancel acrobatics [B0 §13.79]. The player wins fights
   in the ten minutes before them.
6. **Authored catharsis.** The game's climaxes are inputs — a held lever (ten seconds),
   a walked refusal, a repeated shovel stroke — never cutscene rewards [B0 §2.18].
   Release must be work, because in this world hope is manual labor.

## 0.2 Why exploration is fun

Because the world is a text and traversal is reading [BIV.5 §1]. The game withholds
labels and exhibits evidence; the player generates the questions (*who built this — why
empty — can I reach it — what was filed*) and the design guarantees every question has a
findable answer at the player's chosen depth: surface read → prop read → document read →
Chargehand read [BIV.5 §4]. Exploration rewards rank **understanding > views > human
traces > materiel** — ammunition is deliberately the least interesting thing behind any
door [BIV.5 §1]. The moment loot outranks meaning, the Quiet has won the design meeting.

## 0.3 Why combat is meaningful

Because it is scarce, placed, and priced. Combat interrupts exploration, never the
reverse [BIV.5 §8]; every encounter sits where the story would bleed anyway; every arena
keeps its scars forward (the chart stays fallen; the orchard stays burned). Emotional
dosage is typed: **waves = covenant · duels = grief · machines = institutional
emptiness** [BIV.5 §8]. Fights end on a question or a cost [B0 §13.66], and the
protected thing stays audible under the fight [B0 §12].

## 0.4 Why players keep moving

Three engines, staggered so at least one is always pulling:

- **The architectural question** — sightlines are built incomplete (doors ajar, light
  from unlisted floors, desire-lines to "nothing") [BIV.5 §4]; the skyline starts
  sentences only walking can finish.
- **The schedule** — from Chapter 7 the fiction carries a clock ("Thirty days"), and
  infiltrations run on patrol and festival timetables the player has stolen. Pressure in
  Eden is bureaucratic, not timed-mission UI: the world moves on rails the player reads.
- **The covenant** — a planted thing, once banked, is *theirs*; players return to and
  push forward from what they have defended. Ownership of outcomes, not breadcrumbs of
  reward, is the traction system.

## 0.5 Why players investigate architecture

Because architecture is the only surviving witness [BIV.5 §1] — paperwork lies, the
countryside is dead, and the pour-lines tell the truth. Mechanically, this book gives
investigation a verb-set (the Assessor's Read, §2.14), a payment schedule (§8), and a
skill curve (perception tiers, §5.3) so that "looking at walls" is a *system*, not a
vibe. The player who reads formwork can date a district, predict a patrol's blind
corridor, find the maintenance route around a fight, and understand the Republic's whole
history without one line of exposition.

## 0.6 Why players return after finishing

- **The inverted ration** — the epilogue and NG+ (the *Second Printing*, §5.7) recolor
  known spaces; the world re-read with the ending's knowledge is a different text.
- **Texture debts** — optional doors buy epilogue texture, not endings [BIV.5 §7];
  first playthroughs mathematically cannot see all vignettes; the Registry drawer's
  facsimiles remain partially unread.
- **The Standing Watch** (wave mode, §12) — a separate, score-driven expression of the
  covenant verb with its own progression and an endless bracket.
- **The eight open questions** [Lock §19] — the franchise's respiration; finishing the
  game arms the player to re-see evidence (the GN artist, the excess regrowth) that was
  present from Chapter 1.

## 0.7 How gameplay reinforces the themes

| Theme [B0 §1] | The system that carries it |
|---|---|
| Memory | GN pages as save/replay anchors (§13); losses that subtract mechanics (§13.5 of BIV.5, honored in §5.6); the world keeping combat's ledger (§6.7) |
| Architecture & scale | the controller's weight model (§2); megalophobia cadence as level-design law (§6.4); reveals never time out (§8.6) |
| Wonder | three sanctioned gasps, budgeted (§15.6); awe always carries a bill elsewhere |
| Exploration | markerless wayfinding (§8.2); perception tiers (§5.3); reward hierarchy (§0.2) |
| Humanity | trust progression — the cell warms as systems, not cutscenes (§5.4); rests as mechanical digestion (§9 of BIV.5, honored in §15.4) |
| Loss | permanent subtraction design (§5.6); the burned Hall deletes a save-haven (§13.6) |
| Hope | the covenant verb; planting as terminal verb of every loop (§1); hope-verbs cost stamina — manual labor, made literal (§2.13) |

**LAW 0-A.** Any proposed feature, level, weapon, enemy, or mechanic is interrogated
against the Master Creative Bible before design work begins: *"Does this belong in the
universe defined by Book 0? If not, reject it or redesign it until it does."* The
interrogation instrument is Section 18 (the Game Director's Checklist). A feature that
fails and cannot be redesigned is rejected regardless of how much it "adds."

---

# SECTION 0.5 — PLATFORM & DELIVERY **[NEW CANON — amends Lock §1 "Platform intent"]**

**The delivery decision (2026-07-03, user-directed):** the game ships **online-first as
an instant-play web link** — anyone can type/click a URL and play, no install, no
account wall. A **downloadable Steam build follows** in a later phase. This amends the
Canon Lock's "downloadable app" platform intent to a two-phase plan; logged in
PROJECT_STATE.md.

## 0.5.1 Phase A — "The Link" (browser build)

- **Form:** a single shareable URL; time-to-play under 30 seconds on a mid-range laptop.
- **Scope guidance:** the Phase A build carries (a) the campaign **vertical slice**
  (Prologue + Chapter 1 — the permit prompt, the HUD defection, the first covenant
  wave), and (b) **the Standing Watch** (wave mode, §12) as the replayable centerpiece.
  Full campaign chapters stream in as they are produced.
- **Technical envelope (binding on system design):** 60 fps target on integrated
  graphics at 1080p with graceful degradation; initial payload ≤ 200 MB with
  chapter-streamed assets; all systems in this book must function with
  keyboard+mouse and gamepad; sessions must survive tab-refresh via web-local saves
  (§13.8). No mechanic may *require* hardware the browser cannot promise (no
  haptics-dependent design; haptics are enhancement only).
- **Engine posture:** this book is **engine-agnostic by construction**. The existing
  Three.js/React foundation is the Phase A vehicle; the UE5 evaluation for Phase B
  stands as written [BIV §13, "engine confirmed at Sprint 0"]. Every specification
  herein is expressed as behavior + values, portable across both.

## 0.5.2 Phase B — Steam desktop

- Full campaign, full fidelity (Nanite/Lumen posture per BIV §13 if UE5 is confirmed),
  Steam achievements mapped to the memory portfolio (the Top 25 [BIV.5 §16] — never to
  kill-counts), cloud saves migrating Phase A progress forward (§13.8).
- **LAW 0.5-A.** No design in this book may be *possible only* in Phase B. Phase A is
  the game, smaller — never a different game.
- **LAW 0.5-B.** The web link is single-player. No multiplayer, PvP, or co-op exists in
  any phase [PROJECT_STATE: all MP removed]. "Online" means *delivered* online, not
  *played* against others. Leaderboards for the Standing Watch (§12.9) are
  asynchronous score tables only.

## 0.5.3 What the platform decision costs the design (stated honestly)

Browser delivery prices asset density, not systems. The rules that protect us: the
Gravity Style's repetition is also an instancing budget [BIV §13]; few lights + one
volumetric is cheap by design; the ration (90% grey discipline) compresses beautifully.
The two places engineering must protect at all costs: **input latency** (the controller
feel budget, §2.2 — feel is canon) and **audio integrity** (the silence law dies if the
mix stutters; §0.6 of the Audio Addendum, Section 19).

---

# SECTION 1 — THE CORE GAMEPLAY LOOP

## 1.1 The micro loop (5–30 seconds) — *read → decide → act → cost → trace*

1. **READ** (2–10 s): the player samples the space — light promises, wear-paths lead,
   Chargehand labels, patrol audio locates. Supported by: the Assessor's Read (§2.14),
   lean/peek (§2.11), the sound scene (§19).
2. **DECIDE** (1–5 s): route, tool, or trigger. The decision space is always at least
   two-deep (fight/avoid; path A/B; spend/hold). Systems guarantee the alternatives
   exist (§6.5 encounter law: every arena has a read-route).
3. **ACT** (2–10 s): movement verb or combat verb, executed with weight (§2) and
   procedure (§4.6 reload/maintenance grammar).
4. **COST** (instant): ammunition decremented visibly, stamina spent, noise made,
   position revealed, time consumed. **LAW 1-A: no free verbs.** Every act in the micro
   loop has a legible price; the price is diegetic (counter, breath, sound), never a
   floating number.
5. **TRACE** (1–3 s): the world records it — spall on the pour, a cordon alarm state, a
   patrol reroute, a journal annotation. The trace is the reward *and* the next READ's
   input. The loop is a spiral, not a circle: each pass leaves the world more legible
   and more marked.

**Why it satisfies:** each pass pays in *comprehension* (the rarest pleasure in
shooters) and closes with evidence the player existed. The loop's rhythm is
read-heavy by design — the game's fantasy is the person who *understands* the room,
then acts once, correctly [B0 §8].

## 1.2 The macro loop (5–20 minutes) — *approach → covenant → aftermath → rest*

1. **APPROACH** (3–8 min): traversal + environmental storytelling; one insignificance
   beat [B0 §2.4]; curiosity questions planted; resources scavenged (economy §11);
   optional doors offered.
2. **COVENANT** (3–12 min): the block's core event — a wave defense, an infiltration on
   a stolen schedule, a heist beat, a boss (chapter-dependent per the pace map
   [BIV.5 §3]). Max continuous combat 12 minutes **LAW** [B0 §7-Experience].
3. **AFTERMATH** (1–3 min): the cost read back — scars persist, the banked sapling
   stands, casualties and spending accounted in the journal; the *next* question is
   planted here (the D-2's serial; the creed stenciled where you fought).
4. **REST** (2–5 min): a true shelter after the peak, never before [B0 §2.16] — bench
   work (§10), conversation, save (pressed leaf), planting. Rest is mechanical
   digestion: progression actions (upgrades, journal consolidation) are deliberately
   gated *into* rests so the player's hands and feelings catch up together [BIV.5 §9].

**Why it satisfies:** the macro loop is a complete emotional sentence — tension,
release, meaning, breath — and no block repeats its predecessor's dominant [LAW,
B0 §7]. The player always ends a macro loop owning something: a banked acre, a stolen
schedule, an understood room, a warmer cell.

## 1.3 The campaign loop

- **Beginning (P–Ch.3):** competence granted, then re-contextualized. Systems teach
  themselves as *procedure* (the Warden tutorial is literally the job); the covenant
  verb arrives in Ch.1 as the game's thesis; economy is tight but survivable; trust
  systems open the cell to the player.
- **Midgame (Ch.4–7):** mastery granted, then morally re-priced. The confidence plateau
  is deliberately engineered (loadout familiarity peaks Ch.4–5 [BIV.5 §2.9]) so Chapter
  5 can break it — the D-2 fight interrupted by the player's own report. Chapter 6
  subtracts (place, trust, music); Chapter 7 removes combat entirely and teaches the
  shovel. The midgame's design job: make power feel *owed*, not owned.
- **Late game (Ch.8–10):** preparation externalized. Charge Day's three-thread prep
  work converts the whole toolkit into one authored night; Steelgate spends the
  orchestra and the biggest arena; Evergreen inverts the loop — the final "boss" is
  *reached, not destroyed* [Lock §16], and the last mechanic is a held input.
- **Ending & reflection:** the epilogue is a zero-combat, no-objective UI state
  [BIV.5 §2.16]; the campaign loop's last iteration is READ only — the player walks
  the valley and reads what they authored.
- **Replayability:** §0.6. The Second Printing (NG+, §5.7), the Standing Watch (§12),
  and the texture-debt structure make the second run a re-reading, not a repeat.

**LAW 1-B.** The campaign never contains a loop iteration whose covenant cannot be
named in one sentence by a playtester. "What were you protecting?" answered wrong =
the encounter is re-staged [B0 §14-QC].

---

# SECTION 2 — PLAYER CONTROLLER

*The controller is the game's first sentence. Its subject is weight: Asher is a large,
trained, 34-year-old field officer with nine years of procedure in his hands and a
prosthetic he is still learning to own. The controller must feel like operating a
competent body, not piloting a camera [B0 §8: grounded, weighty, prepared; no arcade
slide-cancel feel, B0 §13.79].*

## 2.1 Global feel targets

| Property | Target | Rationale |
|---|---|---|
| Input-to-photon latency | ≤ 70 ms Phase A / ≤ 50 ms Phase B | feel is canon; protect above asset fidelity (§0.5.3) |
| Base FOV | 70° (74° sprint) **LAW** | [BIV §9] |
| Camera shake ceiling | 0.5° **LAW** | [B0 §13.96] |
| Acceleration curve | 0.25 s to full walk; 0.4 s to full run | mass first, response close behind |
| Deceleration | 0.3 s with 1–2 frame settle | stops are planted, never ice or glue |
| Turn assist / input smoothing | none on mouse; gamepad standard dual-zone | honesty of aim |
| Head bob | vertical ≤ 1.2 cm walk / ≤ 2.4 cm run, 2 Hz-band; OFF toggle (accessibility) | body presence without nausea |
| Breathing | audible + ≤ 0.3° sway after sprint, sigh-response, and in the descent | the body as instrument [BIV.5 §6] |

## 2.2 Walking (default state)

- **Purpose:** the reading pace. Walking is the mode in which the world's text is
  legible; most of the game is walked.
- **Feeling:** unhurried authority — a man who belongs to procedure even after
  defecting.
- **Spec:** 1.5 m/s; full weapon readiness; zero stamina cost; footsteps surface-true
  and mix-forward in monumental interiors **LAW** [B0 §12].
- **Limits:** never auto-accelerates into run; no walk-speed variance by story state
  (grief is authored by the world, not by stealing the player's legs).
- **Combat/exploration interplay:** walking is full-accuracy movement; the Assessor's
  Read (§2.14) is walk-gated — running closes the book.

## 2.3 Running (sustained locomotion)

- **Spec:** 3.4 m/s; no stamina cost; slight weapon lower after 4 s of sustained run
  (readiness recovered in 0.25 s); FOV stays 70°.
- **Purpose/feel:** purposeful transit; the pace of a man late to work he knows how
  to do.
- **Limits:** aimed fire while running takes the full moving-accuracy penalty (§4.7);
  Chargehand and document interaction disabled above walk speed.

## 2.4 Sprinting

- **Spec:** 5.2 m/s; FOV 74°; stamina-limited to 12 s full burn (§2.13); weapon
  fully lowered; exit-to-fire delay 0.35 s; audible breathing tail 3–6 s after burns
  ≥ 6 s.
- **Purpose:** commitment. Sprint is a *decision* with an entry and exit cost, used to
  cross fire lanes, reach the sapling, catch the freight gate.
- **Feeling:** heavy urgency — boots and kit, not an energy drink.
- **Limits:** no sprint-slide chaining; no infinite sprint option except via
  accessibility assist (§14); sprint never breaks the reveal law (scripted reveals damp
  sprint to run within signature thresholds — the space is given at reading speed, but
  input is never locked [BIV.5 §5]).

## 2.5 Crouching & sliding

- **Crouch spec:** toggle or hold (user choice); 0.8 m/s crouched walk; height 1.05 m;
  noise profile −70%; accuracy bonus +15% stationary.
- **Slide spec:** available ONLY from sprint, on slopes or smooth floors: 2.5 m
  commitment slide, 0.6 s, ends in crouch; **cooldown 2 s**; no mid-slide aim of long
  weapons (sidearm permitted at penalty). This is an arrival verb (reaching cover /
  the sapling), not a combat dance verb.
- **Limits:** LAW — slide grants no accuracy or damage state; chained slide inputs are
  ignored, deliberately. If playtest video looks like an arcade shooter, the slide gets
  slower, not faster [B0 §13.79].

## 2.6 Jumping, vaulting, mantling

- **Jump spec:** 0.5 m vertical, 1.8 m running horizontal; pre-jump 0.15 s crouch-load;
  landing settle scales with drop (§2.10). Jump exists for gaps and stumbles, not for
  rhythm — headroom in this architecture makes jumping feel *small*, which is the
  point.
- **Vault spec (waist obstacles ≤ 1.1 m):** contextual, 0.7 s, keeps run momentum,
  sidearm retained; long weapons lowered.
- **Mantle spec (ledges 1.1–2.4 m):** contextual, 1.1–1.6 s by height; two-hand
  animation — the ivory hand visibly leads (the prosthetic grips without pain; animation
  language, not mechanics).
- **Limits:** no wall-jump, no double-jump, no air control beyond 10% drift. Nothing in
  the Meridian Republic bounces.

## 2.7 Climbing & ladders

- **Ladders/rungs:** 1.0 m/s; sidearm one-handed use permitted at heavy penalty
  (−50% accuracy); freight-cage and gantry ladders are over-provisioned per prop law
  [BIV-QR §8].
- **Sower slings & borrowed structure:** fixed climb paths on visible slings/anchor
  lines (never cut into the pour — Sower law [BIV-QR §3]); climb verbs are deliberate,
  ~0.8 m/s, with weight-creak audio; used for vertical exploration (§8.5) and arena
  flanks (§6.4).
- **Limits:** no free-climbing arbitrary surfaces. Climbable = engineered or rigged,
  always visually honest (the load path must be sketchable — [B0 §2.9] applied to
  traversal).

## 2.8 Swimming & wading

- **Scope:** Driftmark and coastal intrusions only. **Wading** (≤ 1.2 m): 0.9 m/s,
  long weapons raised overhead automatically, loud. **Swimming** (surface only): 1.2
  m/s, weapons holstered, stamina drains at 2× sprint rate; no diving mechanic in game
  one — deep water is a boundary and a hazard (tide pull telegraphed by foam lines),
  not a playground. Water is mirror or violence, nothing between [BIV-QR §4].
- **Limits:** no underwater combat, no breath-meter minigame. Falling into deep water
  in kit is survivable but costly (wet-kit debuff: −20% stamina regen, audible drip,
  8 min or until a rest's heat source).

## 2.9 Leaning & peeking

- **Spec:** analog lean ±20° from cover-adjacent stance (Q/E or stick-press+direction);
  exposes 25% silhouette; aimed fire from lean at −10% accuracy; lean is also a
  *reading* verb (peek a ledger page, a serial, around a pour-fin without entering the
  room).
- **Purpose:** the procedural infiltrator's verb — Warden training embodied; pairs with
  the schedule pressure of Ch.4/8/9.

## 2.10 Falling & landing

- **Spec:** safe ≤ 3 m (settle 0.2 s); heavy landing 3–5 m (settle 0.6 s, audible,
  stamina −25%); injury 5–8 m (health segment damage, 1.2 s recovery crouch); lethal
  > 8 m *with one exception*: scripted drops into water or dust-drift where fiction
  supports it.
- **Feeling:** mass tells the truth. The camera dips ≤ 0.5° **LAW**; the knees do the
  acting (audio + hands), not the lens.

## 2.11 Interaction & context actions

- **Spec:** single interact key; hold-to-confirm (0.4 s) for irreversible acts
  (planting, lever polarity, burning); **press vs. hold is the moral grammar** — the
  permit prompt in the Prologue is two *presses*; the governor is a ten-second *hold*
  [Lock §15]. Engineers must treat input duration as authored content, specified
  per-interaction in level data.
- Context verbs: carry (books, seed crates, the wounded — two-hand carry lowers
  weapons, 1.2 m/s), water (canteen → tended pocket), graft, chalk-mark (player leaves
  own Chargehand annotations; §8.4), listen (hold near pipes/doors: the sound scene
  sharpens), shovel (Ch.7's single repeated unhurried input — cadence-gated, cannot be
  spammed: input faster than the animation is *ignored*, teaching the rite's tempo
  [BIV.5 §2.13]).
- **LAW 2-A:** no interaction wheel, no floating world-space icons. Prompts are the
  diegetic UI hand (paper tag / amber stencil, per era) at screen edge [BIV-QR §11].

## 2.12 Looking & camera

- Free-look always; no cutscene camera theft outside real-time scenes law [BIV.5 §15];
  reveals damp speed, never lock input **LAW** [BIV.5 §5]. Camera settings: FOV
  65–90 slider (default 70), bob/sway/lean-roll toggles, motion-blur off-able (§14).

## 2.13 Stamina & weight model

- **Stamina** (hidden bar, expressed as breath audio + subtle sway): spent by sprint,
  swim, carry-run, heavy melee (§4.9), shovel-free climb; regenerates walk 8 s
  full, stationary 5 s; **never gates walking, aiming, or interacting.**
- **Weight:** loadout has three notches — *light* (sidearm + tool), *field* (standard),
  *laden* (carry objects / Vault pack segments) — affecting sprint duration (14/12/8 s)
  and landing settle. No encumbrance inventory Tetris; weight is a stance, not a
  spreadsheet.
- **Purpose:** the body keeps the ledger. Hope-verbs (carrying books, hauling the green
  unit, digging) *cost* — manual labor made literal [B0 §1].

## 2.14 The Assessor's Read (scanning) **[NEW CANON — system name]**

*The game's "scan" is not a pulse, not an outline shader, not AR. It is Warden
assessment training turned against its makers: Asher reads spaces the way he was taught
to price them.*

- **Spec:** hold the Read input while walking/stationary → time continues (no pause,
  no slow-mo), the camera settles, and **readable evidence acquires focus priority**:
  Chargehand resolves at distance ×1.5, wear-paths and drainage read with heightened
  micro-contrast, sound scene sharpens (footsteps direction-tagged). NO outlines, NO
  highlights, NO x-ray **LAW** [B0 §13.38 no memory shaders; BIV-QR §15 no floating
  UI]. What the Read produces: **journal annotations** — Asher's hand notes the finding
  on the kit-bag map/journal (Sower era) with a dry stamp sound [BIV-QR §11].
- **Perception tiers (§5.3) deepen the Read:** Tier 1 reads wear and light; Tier 2
  reads full Chargehand + patrol grammar (route chalk, rotation tallies); Tier 3 reads
  institutional intent (threat-table postures of machines telegraphed by stance —
  because Asher wrote those tables' field reports).
- **The prosthetic's role:** near verdance activity, the ivory hand's amber ring warms
  (diegetic proximity sense, range ~15 m, no direction) — Edge built it, and Edge
  hardware smells charge. Coil's firmware upgrades tune this (§10.3).
- **Combat interplay:** Read is walk-gated and lowers the weapon — using it mid-fight
  is a deliberate, brave act (and the way boss weak-states are found, §7.4).
- **Validation:** a blindfold test — a player denied all Read tiers can still finish
  every space (the Read deepens; it never gates the critical path) **LAW 2-B**.

## 2.15 Controller state table (engineering summary)

| State | Speed m/s | Weapon | Stamina | Noise | Notes |
|---|---|---|---|---|---|
| Walk | 1.5 | ready | — | low | Read available |
| Run | 3.4 | ready− | — | med | Read closed |
| Sprint | 5.2 | lowered | burn | high | 0.35 s exit-to-fire |
| Crouch | 0.8 | ready | — | −70% | +15% accuracy stationary |
| Slide | 2.5 (0.6 s) | sidearm only | tick | med | 2 s cooldown |
| Vault/Mantle | ctx | lowered | tick | med | ivory hand leads |
| Ladder/Sling | 1.0/0.8 | sidearm −50% | — | med | engineered paths only |
| Wade/Swim | 0.9/1.2 | raised/holstered | —/2× | high | surface only |
| Carry (2-hand) | 1.2 | none | walk ok / run burns | low | the mourning verb |
| Lean | 0 | ready −10% | — | low | reading + firing |
| Read | ≤1.5 | lowered | — | low | annotations, no overlays |

---

# SECTION 3 — COMBAT PHILOSOPHY

*Combat supports the narrative or it does not ship. There is no fight "because it's
time" [B0 §13.71]. The QC test for any encounter: point the camera at what it defends.*

## 3.1 Pacing & frequency

- Combat is **scarce by AAA-FPS standards and precious by design**: target 25–35% of
  campaign runtime in combat states (genre norm 50–70%). Chapter combat presence obeys
  the locked pace map exactly [BIV.5 §17]: none in Ch.7 or the Epilogue **LAW**; max
  continuous combat 12 minutes (Ch.9) **LAW**; every combat block borders a breath
  **LAW** [B0 §7].
- Encounter count guidance per chapter: 2–4 placed encounters + 0–1 boss. An encounter
  cut is always preferred to an encounter padded.

## 3.2 Intensity model

Three intensity registers, typed to emotional dosage [BIV.5 §8]:

| Register | Type | Duration | Emotional target |
|---|---|---|---|
| **Covenant** (waves) | defend the pointable | 3–8 min | resolve; protective fear |
| **Procedure** (patrol/infiltration combat) | schedule + position | 1–4 min | competence; tension |
| **Grief** (duels & machine bosses) | authored set pieces | 6–12 min | per boss's locked emotion [BIV.5 §14] |

Escalation *within* an encounter is always legible before it is dangerous: Wardenry
escalation drills are procedural (compliance phrases → posture → fire) [Lock §17];
machines telegraph via threat-table posture (§2.14). The player is never killed by
information they could not have had — **fear is comprehension arriving early**
[BIV.5 §11–12].

## 3.3 Ammo philosophy

- **Counted, found, and felt.** Ammunition is diegetic (stencil counters, visible
  magazines), scarce enough that spraying is anxiety and every shot placed is
  satisfaction. Target economy: the player ends most encounters at 30–60% of the
  ammo they entered with (§11.3 for acquisition rates).
- Scarcity is *tension seasoning*, never a starvation game: the critical path always
  carries a minimum floor (§11.6 anti-frustration rules).
- **LAW 3-A:** ammo is the least interesting reward in any container hierarchy
  [BIV.5 §1]; a secret whose payoff is only ammo is a design bug.

## 3.4 Health & recovery philosophy

- **Health = the thin double rule** [BIV-QR §11]: two bars, four segments each.
  **Breath** (outer rule): chip damage; recovers alone to the current segment boundary
  after 5 s out of fire — getting grazed and recovering is *breathing, not magic*.
  **Binding** (inner rule): segment damage from solid hits; recovers ONLY via field
  dressings (a 3.5 s two-hand verb, interruptible) or rests.
- **Purpose:** short fights forgive; sustained recklessness compounds. The player's
  body keeps a ledger the UI merely reports.
- No health pickups floating in the world; dressings are inventory used deliberately.
  Death = reload from checkpoint/leaf (§13); no death animations that mock, no
  score-screen — a cut to grey, one breath, the world again. Dying is priced in
  *repetition*, never humiliation.

## 3.5 Armor philosophy

- Asher's kit is cloth, canvas, and salvaged composite plate — **armor is placement**:
  plates cover torso arcs; hits on plate convert Binding damage to Breath damage and
  spall audibly; plates degrade (visible cracking) and are re-fitted at bench (§10).
  No armor bar; armor is a *material state* of the body, inspected visually.
- The Wardenry's bone-white composite obeys the same honesty in reverse: their plate
  arcs are readable, and aimed fire at straps/joins is the skill reward (§4.7).

## 3.6 Risk, aggression, retreat

- **Risk vs reward is spatial, not statistical:** pushing forward buys position and
  the protected thing's safety; falling back buys breath and re-reading. Both are
  always designed-in (§6.5: every arena has at least one retreat lane and one flank
  the player can own).
- Aggression is *procedural*: moving on a schedule the enemy hasn't updated. There is
  no rage meter, no kill-chain reward, no execution animations. **LAW 3-B: no power
  fantasy drift** [B0 §13.72] — the power curve pays in preparation options, never in
  feeling bulletproof.
- Retreat is honorable and mechanically supported (disengagement: enemies search on
  last-known-position logic, §6.6, and *give up* on procedure — they file, cordon, and
  wait, because that is what institutions do).

## 3.7 Cover & positioning

- Cover is architecture used honestly: pour-fins, plinth barriers, Vault cradles,
  freight. No snap-to-cover system — proximity + crouch + lean IS the cover verb
  (fluid, analog, trained). Destructible cover only where material honesty says so
  (canvas, crates yield; the pour does not — spall plates with rebar stubs, never
  gravel [BIV-QR §12]).
- Positioning doctrine the AI respects and the player learns: machines hold lanes,
  Wardens rotate pairs, poachers cluster and break. Reading the doctrine (§2.14 Tier
  2) *is* the tactics layer.

## 3.8 Environmental combat

- The environment fights honestly: Vault ruptures are a *hazard* (verdance discharge —
  a soundless bloom of light + concussive push; no fire, no lightning — charge flows,
  never arcs [BIV-QR §12]); freight and counterweights move on player-thrown levers;
  dust banks kill sightlines; tide gates re-time arenas (Driftmark).
- **LAW 3-C:** environmental kills obey the same moral bounds as weapons (Lock §3.16:
  Wardenry, machines, Mulcher combatants, Evergreen defenses only; never civilians).

## 3.9 Resource management as combat verb

Pre-encounter preparation is a first-class combat phase: dressing count, plate state,
magazine top-off (the top-off animation is the game's "war face" — a procedure
performed calmly), seed-case selection, route annotations. Bench and cache placement
guarantee a preparation beat before every major encounter (§6.4).

## 3.10 The psychological goals of combat, stated for engineers

Combat should feel: **grounded** (mass, recoil, procedure), **protective** (the
covenant), **costly** (LAW 1-A), **legible** (comprehension-fear, not chaos-fear),
and afterwards **quiet** (the post-combat mix drops to room tone; the protected
thing's sound — wind in the sapling, the cart's wheels — is the victory sting; music
only if meaning completed [B0 §12]). The player should end fights checking on
something, not looting something. If playtesters end fights looting first, the
aftermath staging is re-ordered.

---

# SECTION 4 — WEAPON SYSTEM

*Everything that fires in this world is ballistic **LAW** [Lock §3.6]: verdance powers
grids, not handguns; no energy small-arms, ever. All arms are appliance-honest — worker
tools with serial plates, wear biographies, and maintenance needs [BIV-QR §15]. Amber
"charge-windows" on Edge weapons are status indicators (chamber/feed state), never
power cells.*

## 4.1 Weapon philosophy

- **Manufactured by this civilization:** the Republic's arms predate the Accord; Edge
  does not love guns (violence dressed as procedure, Lock §20.8) — it *refurbishes*
  the Republic's arsenal patterns and stamps them with tract-serials. The Sowers own
  nothing new: they carry ranger leftovers, tide-market salvage, and Coil's re-splices.
  Every weapon is thus a **document of custody** — its stampings, re-bluing, and stock
  repairs tell who held it and when (two eras per surface, applied to guns).
- **Roster size:** SIX player weapon families + one tool + one prosthetic. Small on
  purpose: mastery of few > novelty of many; each weapon is a *relationship* with
  maintenance, history, and an upgrade path.
- **[NEW CANON] Nomenclature:** "Arsenal patterns" (pre-Accord Republic military),
  "Ranger-pattern" (defunded ranger service), "Tideworks" (Driftmark salvage-craft).
  Logged in PROJECT_STATE.md; naming follows the Meridian-pattern convention
  [Lock §10].

## 4.2 The roster

### W1 — Arsenal P-11 sidearm ("the Eleven")
- **History/lore:** Republic service pistol, pattern of 2041; millions stamped;
  Edge-refurbished units carry amber chamber-windows and tract-serials. Asher's is his
  Wardenry sidearm, kept after defection — re-stamped by Coil with a Sower line over
  the Edge serial (visible on inspect).
- **Role:** the constant companion; the ladder/sling/slide weapon; the merciful,
  quiet-adjacent option.
- **Strengths:** always available (every controller state that permits any weapon
  permits the Eleven); fast handling (0.8 s draw); accurate to 25 m.
- **Weaknesses:** low stopping power vs plate; 12-round magazine.
- **Ammo:** service ball 9 mm-class ("ball, small"). **Reload:** 1.6 s, retained mags.
- **Handling/recoil:** crisp single action; 2° muzzle rise, fast settle.
- **Upgrade path (§10):** trigger work → sight regulation → suppressor-wrap (salvage
  fabric baffle: 2-mag life, then audibly degrades — honesty, not Hollywood silence).
- **Sound identity:** dry civic *crack*, echo scaled by nave height. **Visual:** worn
  bone furniture, one hand-painted green line (board canon: white/amber pistols).
- **Enemy usage:** Wardenry standard sidearm.

### W2 — Arsenal C-9 carbine ("the Nine")
- **History:** the Republic's last general-issue rifle (2044 pattern); the Wardenry's
  workhorse; Taproot's armory holds six, all with different biographies.
- **Role:** the spine of covenant defense — mid-range, controllable, dull-reliable.
- **Strengths:** effective 10–80 m; forgiving handling; bayonet-lug accepts the spade
  clamp (melee, §4.9).
- **Weaknesses:** mediocre vs plate at range; iron-sight honesty (optics are rare and
  earned).
- **Ammo:** rifle ball ("ball, long"). 24-round magazines. **Reload:** 2.4 s tactical /
  3.2 s empty (bolt work visible; the ivory hand does the fine motions — animation
  showcase).
- **Recoil:** firm push, 3–4° rise in bursts; full-auto NOT available (select semi /
  2-round burst — doctrine, and mix protection: sustained full-auto would bury the
  protected thing's audio **LAW 4-A**).
- **Upgrades:** bedding (accuracy) → aperture sight → sling-and-wrap (faster
  ready-from-climb) → Coil's feed polish (−0.4 s reloads).
- **Sound:** flat industrial report + case-fall on concrete (surface-true).
- **Enemy usage:** Wardenry patrol standard — the player is shot at by their own
  muscle memory (loss of identity, BIV.5 §13).

### W3 — Tideworks coil-pump shotgun ("the Tide")
- **History:** Driftmark boat gun; hand-built receivers around salvaged barrel stock;
  no two identical; Brack's yards sell them under the counter.
- **Role:** pocket-space dominance (nests, corridors ≤ 2.4 m, boarding actions);
  Devastator sensor-head flincher (staggers, never destroys).
- **Strengths:** decisive ≤ 8 m; mechanical drama (the pump is the argument).
- **Weaknesses:** 5-shell tube; slow feed (0.7 s/shell, interruptible); useless past
  15 m; loud in a game that prices noise.
- **Ammo:** coil shells (rolled-salvage shot; also **foam-slug** utility shell, §4.5).
- **Recoil:** heavy 6° lift, full settle 0.8 s — a decision per trigger pull.
- **Upgrades:** tube +2 → choke work → wet-proofing (Driftmark rust honesty removed).
- **Sound:** oceanic *boom* with chain-locker rattle tail.
- **Enemy usage:** Mulcher poachers.

### W4 — Ranger-pattern R-4 survey rifle ("the Ranger")
- **History:** the defunded ranger service's marksman/survey tool (integral 4× survey
  optic — the only optic in the game); Mara's own service weapon class; Sower cells
  cherish surviving units. Carrying it *means* something in the fiction, and NPCs note
  it.
- **Role:** the preparation weapon — overwatch on covenant waves, sensor-head surgery
  on machines, the one answer at 80–200 m.
- **Strengths:** one-breath accuracy (hold-breath: 3 s steady window, stamina-priced);
  penetrates Wardenry plate at joins.
- **Weaknesses:** 5-round internal magazine, single-loaded (1.1 s/round); slowest
  handling in the game; the optic glints (enemies acquire the player 20% faster while
  scoped — honesty both ways).
- **Ammo:** survey long (scarcest ammunition in the economy, §11.3).
- **Upgrades:** action bedding → optic re-collimation (Tier 2 Read integration: range
  annotations) → subsonic handloads (Coil, late; pairs with wrap-baffle).
- **Sound:** deep provincial *crack* that the Belt's emptiness answers twice.
- **Enemy usage:** none — Wardenry marksmen use a different pattern (they get optics
  and lose them to the player only as a story beat, never as loot: LAW 4-B, enemy
  weapons are not vacuumed; salvage is scripted or bench-derived).

### W5 — Grafting mortar ("the seed-thrower") **[NEW CANON — weaponized Sower planting tech, Lock §10 "seed-case mortars" made playable]**
- **History:** repurposed line-throwing mortar (maritime rescue pattern) firing
  seed-cases; the Sowers' signature tool — a *planting instrument* the war has taught
  other uses.
- **Role:** the covenant's utility organ. Payloads: **seed-case** (plants a growth
  point for regrowth defense objectives / epilogue texture), **smoke-case** (dust-bank
  sightline cutter, 8 m × 20 s), **foam-case** (expanding lignin foam: blocks a lane
  or mires a Devastator limb 6 s), **thumper-case** (concussive noisemaker — pulls
  patrols on their own investigation procedure).
- **LAW 4-C:** the seed-thrower has NO anti-personnel payload. The Sowers do not bomb
  people [Lock §20.12]; the design enforces the theology mechanically. Its combat
  value is geometry, time, and attention — never casualties.
- **Handling:** two-hand deploy 1.2 s; arc-thrown with a dotted *hand-annotated*
  trajectory on the kit-bag UI only while deployed (paper grammar, not holograms);
  4-case bandolier.
- **Upgrades:** bandolier +2 → case chemistry (longer smoke, harder foam) → the
  planter's ear (thumper draws machines too, not just people — Coil learns the
  threat-tables' audio triggers).

### W6 — Bolt-driver ("the Jack") **[NEW CANON — anti-machine salvage tool]**
- **History:** Mulcher piton/rebar driver for splitting stillwood trunks and cracking
  Vault cradles; industrial, two-handed, worker-honest. Acquired Ch.5 (before the D-2)
  via Driftmark debt — the game's "heavy" is a demolition tool with a work permit.
- **Role:** the Devastator answer. Drives a hardened bolt: vs machines, staggers limb
  assemblies and pins access plates open (creating the Read-found weak-states, §7.4);
  vs Wardenry it is cruel overkill the player CAN use — and the fiction notices
  (cell barks register discomfort; no mechanical punishment, only social truth).
- **Spec:** 1 bolt chambered + 6 carried; 2.8 s recharge cycle (flywheel spin-up whine
  — the game's most industrial sound); effective ≤ 30 m, heavy arc beyond.
- **Weaknesses:** slowest swap in the game (1.4 s); laden-notch weight while carried
  (§2.13); bolts are the rarest consumable after survey long.
- **Upgrades:** capstan re-gear (−0.6 s cycle) → hardened bolts (D-3000 plate) →
  carry-frame (removes laden notch).

### T1 — The green unit (tool, not weapon)
The reversed Converter [Lock §10] is an objective device: deployed at covenant sites,
it banks growth over N waves; it is carried (two-hand, laden), placed, defended, and
— in two authored beats — shoulder-fired as a *reversal pulse* that accelerates growth
in living tissue (staggers nothing, harms nothing; its combat use is zero **LAW**).
Its presence re-times every system around it: the sigh/anti-sigh audio, the amber ring
of the prosthetic, enemy sapling-priority targeting [Lock §17].

### P1 — The Meridian-pattern prosthetic (the ivory hand)
Not a weapon. The hand's gameplay surface: fine-work interactions others can't
(single-hand reloads of the Eleven while carrying, §2.11 carry states; lock/terminal
work 30% faster), the amber proximity ring (§2.14), firmware upgrade slots (§10.3),
and the sigh-response — a brief amber HUD vignette + grip tremor after every cascade
event until Ch.10 **LAW** [Lock §20.16]: during the tremor (2.5 s) fine-work verbs
slow 50% and aimed fire sways +1°. A readable cost, never a control lock [B0 §8].

## 4.3 Loadout rules

- Carried: sidearm (always) + 2 long slots + tool assignments. Swaps at benches and
  caches only (no mid-arena rummaging); weapon select is a radial-free two-key cycle
  with distinct silhouette-first viewmodel poses.
- Enemy weapons are NOT lootable (LAW 4-B): custody is a story system, not a vacuum
  cleaner. Ammo interchange from fallen Wardenry is permitted for ball calibers only,
  hand-animated per pickup (0.8 s crouch verb — looting is a decision, not a stroll).

## 4.4 Ballistics model

- Hitscan ≤ 30 m for ball calibers; projectile with drop beyond (survey long: 1 m drop
  at 150 m); shot spreads by real choke cone; penetration limited to canvas/thin steel
  with energy loss. NO damage falloff curves that lie (a hit is a hit; range affects
  *accuracy and penetration*, not invisible damage taxes) — legibility is the tuning
  religion.
- Friendly fire: cell NPCs cannot be damaged (they flinch and bark — social cost
  only); the protected thing CAN be damaged by the player (the covenant is real;
  shooting the sapling is possible, catastrophic, and 100% the player's) **LAW 4-D**.

## 4.5 Utility & thrown

Chalk (marks), thumper-cases and smoke via W5, rag-flare (10 s sodium light, reveals
and is seen), dressing kits, and the canteen. No fragmentation grenades exist for the
player **LAW** (Lock §20.12 extended: anti-personnel explosives are Edge's moral
territory, and the player never inherits it).

## 4.6 Reload & maintenance grammar

Reloads are procedures: interruptible, state-preserving (a half-fed tube stays
half-fed), visible in viewmodel, never cancelled into sprint-flash. **Maintenance** is
a bench system (§10.2): weapons accrue fouling (round-count driven); fouling past
threshold = visible smoke/sluggish action (+15% jam-free grace on Story assist, §14);
jams clear with a 1.8 s two-hand verb. Fouling is slow enough to be a *rhythm*
(bench each chapter), never a nag (≈300 rounds of grace).

## 4.7 Accuracy model

Base cone per weapon → modified by stance (crouch +15%, lean −10%, moving per §2.15),
breath (hold: steady 3 s), fouling, tremor (sigh-response), and plate-hit flinch.
Enemy plate arcs take ball damage as Breath-class chip unless joins/straps are hit —
aimed skill expression without headshot-fetish scoring (headshots work vs unarmored;
helmets defeat ball at range honestly).

## 4.8 Weapon feel targets (animation/audio contract)

Draw/stow/reload timings above are *feel canon*: ±10% only. Every weapon has: a
surface-true case-fall, a nave-scaled echo profile, a maintenance idle (Asher checks
the chamber when the player stands still 20 s — procedure as characterization), and a
GN-style silhouette read at first acquisition (the weapon is introduced by shape
before stats — no stat cards ever; the journal describes weapons in Asher's clipped
prose).

## 4.9 Melee

The spade **[NEW CANON as melee]**: after Ch.1 Asher carries a spade before a weapon
[Lock §7]. Melee = spade strike (1.0 s, stamina-priced, staggers unplated, cracks
crates) and spade-clamp bayonet on the Nine (defensive shove). No takedown
animations, no stealth-kill cinema: quiet removal of a sentry is a *choice with a
body*, done in real time, facing the consequence — the design refuses to make killing
feel like a menu confirmation.


---

# SECTION 5 — PLAYER PROGRESSION

*Progression must feel like perception sharpening and trust accumulating — never like a
skill-tree spreadsheet **LAW** [B0 §8]. There is no XP number anywhere in the game.*

## 5.1 The four progression tracks

| Track | What grows | Fed by | Expressed as |
|---|---|---|---|
| **Perception** (§5.3) | what the player can read | attention (Reads performed, documents found, spaces understood) | Assessor's Read tiers; journal depth |
| **Trust** (§5.4) | what the cell offers | story beats + covenant outcomes + optional-door humanity | bench access, barks, gear custody, vignettes |
| **The Hand** (§5.5) | what the body can do | Coil's firmware bench (story-gated) | fine-work speed, tremor management, ring tuning |
| **Kit mastery** (§10) | what the tools can do | bench work + salvage economy | maintenance mods, carry options |

Health and armor do NOT progress numerically: the double rule's four segments are
constant for the whole game **LAW** — survivability grows through plate custody, kit,
and knowledge. The power curve of Echoes of Eden is the player, not the sheet.

## 5.2 Suit & traversal progression

Asher's kit (wax canvas, canvas-and-plate) upgrades at benches: sling-and-wrap (weapon
ready from climb), padded yoke (carry at 1.5 m/s), tide boots (wet-kit debuff halved),
plate cradle (third torso arc). Traversal options grow *through the world*, not the
body: Sower sling-kits unlock rigged routes (level designers place sling anchors that
open when the player carries the kit, Ch.4+), and freight passes/stolen schedules open
mechanical routes. No jump upgrades, no air-dash, ever **LAW**.

## 5.3 Knowledge, memory, scanning — Perception tiers

- **Tier 1 "Surface"** (default): wear, light, and desire-line reads; journal sketches
  landmark silhouettes.
- **Tier 2 "Clerk"** (auto at cumulative evidence threshold ~Ch.3–4, accelerated by
  document collection): full Chargehand glyph literacy (the ~60 stencils render as
  translated tooltips in Read); patrol grammar (chalk rotations, tally marks) reads as
  schedule annotations; the journal cross-references documents automatically (the
  parish-ledger discovery in Ch.6 uses this system diegetically [Lock §20.4]).
- **Tier 3 "Assessor"** (auto ~Ch.7–8): institutional intent — machine threat-table
  postures telegraph next-state (§7.4); Edge paperwork reads between lines (redactions
  annotated with Asher's reconstructions); the Read can price a space (which routes
  Edge budgeted for, therefore which it forgot).
- **LAW 5-A:** tiers unlock by *doing* (counted Reads, documents, room-questions
  answered), never purchased. **LAW 2-B** stands: no tier gates the critical path.

## 5.4 Trust (the cell warms)

A hidden per-character scalar fed by story beats (fixed) and optional acts (variable:
covenant saplings banked, human-trace finds returned — June's labels, Noor's water
route, Dez's unanswered anger faced). Expressed ONLY diegetically: barks warm, idle
scenes deepen (hidden conversations, BIV.5 §7), bench masters offer their personal
work (§10 upgrade gating), and epilogue vignettes key to it [BIV.5 §7]. Numbers are
never shown **LAW**. Ch.5–6's trust subtraction (the cell cools for two chapters
[BIV.5 §13]) is this system running backward — the mechanic makes the social air
measurably colder: fewer barks, shorter answers, benches still available but wordless.

## 5.5 The Hand (ability progression)

Coil's bench, story-gated: Grip I (tremor 2.5→1.5 s), Fine Work (terminal/lock verbs
−30%), Ring Tuning (proximity ring gains a pulse-rate gradient), Steady (aimed sway
during tremor halved), and at Ch.10 by story, not purchase: the Reversal Grip (the
hand can hold the governor — the ten seconds are physically *this* upgrade's payoff;
the player's whole progression track ends in one held input **LAW**: the finale uses
no ability the player didn't grow).

## 5.6 Losses (subtraction as progression)

Progression in Eden includes designed LOSS, per the locked law "every loss subtracts
something the player used" [BIV.5 §13]: the Wardenry HUD (Prologue only); the Standing
Hall rest-point (burned Ch.6 — its bench, save-leaf, and cache are deleted from the
map); burned ledger volumes (lore entries permanently lost if not saved — Sela's
fire-order determines the save-set); the cooled cell (Ch.5–6). QA treats these as
features with acceptance tests, not bugs.

## 5.7 Late game, NG+ ("the Second Printing"), replay incentives **[NEW CANON — mode name]**

- **Late game:** progression converges — by Ch.9 all tracks near cap so the finale is
  about authorship, not builds.
- **The Second Printing (NG+):** campaign replay carrying perception tiers, journal,
  kit mods, and trust echoes (the cell remembers; barks acknowledge the re-read). What
  changes: document set variant B (the Registry's *duplicate* books — same facts, new
  marginalia, deepening [B0 §13.10] not repeating); GN pages gain the artist's pencil
  under-sketches (evidence for Lock §19.1 hunters, resolving nothing **LAW**); the
  Prologue's permit prompt now displays its full bureaucratic consequence chain as
  flavor (the player files it anyway — or stands there; both are allowed, nothing
  branches [Lock §3.18]).
- **Chapter replay** via GN splash saves (§13.4) with kit snapshots.
- **No difficulty-locked content, no completion percentages on screen** — the journal
  fills, it is never graded.

---

# SECTION 6 — ENEMY ENCOUNTER DESIGN

*Encounter philosophy only; the enemy roster is Lock §17's and Book III's. Rule 16
bounds all of it: opponents are Wardenry, Edge machines, Mulcher combatants, and
Evergreen defenses — never civilians.*

## 6.1 Enemy density

Low, deliberate, and front-loaded with information. Reference densities: patrol
encounters 3–6 hostiles; covenant waves 4–10 per wave, 3–5 waves; set pieces ≤ 16
alive. The Republic is *empty* — density above these bands reads as another game and
fails the one-frame test's tenant clause in spirit.

## 6.2 Encounter rhythm

Per the pace map **LAW** [BIV.5 §3]: every combat block borders a breath; encounters
cluster mid-chapter, never at chapter open (chapter opens belong to insignificance
beats); the final encounter of a chapter always ends on cost or question, not victory
audio.

## 6.3 Arena sizing (obeys the numeric scale canon [BIV-QR §3])

| Encounter type | Space class | Dimensions |
|---|---|---|
| Pocket fights | pockets/corridors | 2.4–9 m ceilings, tight lanes |
| Patrol/procedure | civic/industrial halls | 18–40 m clear span |
| Covenant waves | halls to signature | 40–80 m with a defended center ≤ 25 m radius |
| Bosses | signature spaces | 60–120 m [locked arenas per Lock §16] |

Every arena stands **under something enormous** [B0 §10] and keeps its scars.

## 6.4 Flanking, verticality, pressure

- Every arena ≥ 3 approach lanes; ≥ 1 player-ownable flank (sling route, gantry,
  freight top); ≥ 1 retreat lane that doesn't dead-end **LAW 6-A**.
- Vertical combat: enemies use stairs and lifts honestly (no teleport spawns —
  arrivals are *staged*: doors, freight gates, drop-lines the player can watch and
  therefore time; spawn visibility is a hard rule **LAW 6-B**).
- Pressure instruments: schedule (reinforcement timers the player has *read* in
  advance), geometry (foam/smoke re-shaping), and the covenant center's exposure —
  never artificial DPS ramps.

## 6.5 The read-route rule

Every encounter is approachable in at least two of three grammars: **procedure**
(stealth on the schedule), **position** (fight from an owned flank), **pace** (run
the gap; some patrols can simply be outwalked). Full ghosting is supported wherever
fiction permits; extermination is never required except where the covenant demands
holding ground **LAW 6-C**.

## 6.6 Recovery & disengagement

Alert states: unaware → curious (investigate on procedure, 20–40 s) → engaged →
searching (last-known-position, 45–90 s) → **filed** (the institutional giving-up:
cordon posture, radio-in, resume patrol with a *permanent* logged change — next
patrol carries +1 and new chalk; the world files paperwork about the player). Enemies
never psychically track. Player recovery: Breath regen out of fire (§3.4), and arenas
guarantee ≥ 1 defilade pocket per 20 m of fight space.

## 6.7 Surprise, hazards, and the world's ledger

Surprise belongs to the player by default (information advantage is the designed
state); enemy surprises are always pre-evidenced (the repaired D-2's fresh weld
biography is readable BEFORE it stands up). Environmental hazards per §3.8, placed as
labor honesty (a Vault yard is dangerous because Vaults are). After-action
persistence: bodies are processed by the world (next visit: cordon tape, tags,
serials — violence leaves procedure, not gore [B0 §6]); arena scars persist to the
epilogue.

## 6.8 Evolution across the campaign

Prologue: the player IS the procedure (walking escort law). Ch.1–3: procedure meets
covenant; enemies are patrols doing jobs. Ch.4–6: the institution notices — named
rotations, marksmen, hazard crews, the taboo raid. Ch.7: none **LAW**. Ch.8–9:
festival policing → Steelgate's honest fortress (the game's only "gauntlet",
12-minute ceiling). Ch.10: Evergreen's station-denial waves — defenses that protect
a schedule, not a person, fought while a docent narrates gently [Lock §16–17].
Mini-bosses: exactly two (a Wardenry marksman duo Ch.8 rooftops; a hazard-crew
foreman + crew Ch.9 approach) — both re-use known grammar at heightened stakes; no
new mechanics after Ch.8 **LAW 6-D** (the finale tests fluency, not novelty).

---

# SECTION 7 — BOSS SYSTEMS

*Universal rules. The four bosses and their locked arenas/emotions/defeats are canon
[Lock §16; BIV.5 §14]; this section defines the system contract every boss encounter
must satisfy.*

## 7.1 The universal boss contract

Every boss must ship with ALL of:

1. **Narrative purpose** stated in one sentence (Lock §16's "exists because" column).
2. **An assigned emotion** with a playtest exit-word target **LAW** [B0 §2.14] — D-2:
   *grief/empty* · Harrow: *respect* · D-3000: *awe* · Array: *acceptance*. "Epic" =
   re-stage.
3. **Arena before boss** **LAW** [B0 §13.87]: the space is explored, read, and
   understood before the threat enters it.
4. **Phases as escalation of meaning**, not HP gates: each phase must change the
   *question*, not just the damage. (D-2: fight → the broadcast report → what is the
   player even hitting; Harrow: duel → her barks teaching → the resignation; D-3000:
   suppression → the chart's rigging read → authored demolition; Array: waves → the
   recitation → the walk to the lever.)
5. **Environmental interaction as the decisive verb** — every boss ends through the
   world, not through ammunition totals: the D-2 powers down mid-gesture (its end is
   *witnessed*, not exploded); Harrow is outlasted (survival scoring, §7.5); the
   D-3000 dies under the dropped chart slab (player-rigged, three anchor stations);
   the Array is *reached* and reversed **LAW** [Lock §16 defeat column].
6. **Checkpoint philosophy:** checkpoint at arena entry + each phase boundary; a boss
   death never costs more than one phase; prep states (ammo/dressings) restore to
   phase-entry snapshot — bosses test comprehension, not attrition **LAW 7-A**.
7. **Death/defeat sequence** owned by the fiction: no slow-mo, no confetti, no loot
   burst. The kill's aftermath is a *held playable quiet* (the mix drops, the arena
   scar is born, the next question is planted).
8. **Reward = understanding + story state**, never gear from the corpse (the R2
   revelation, the resignation, the opened descent, the valley).
9. **Player learning:** each boss is the exam of the preceding chapters' verbs (D-2:
   covenant + Jack; Harrow: procedure + position; D-3000: full kit + rig-work; Array:
   everything, then one hand).
10. **Emotional objective verified** by one-word exit interviews in every playtest
    round **LAW**.

## 7.2 Phase design rules

2–4 phases; each ≤ 4 minutes; phase transitions are *legible state changes in the
world* (light scheme shift per locked boss lighting [BIV-QR §6], audio register
change, arena geometry change). No invulnerability shells without fiction (the D-3000's
plate IS fiction; a glowing weak point is forbidden — weak-states are Read-derived,
§7.4).

## 7.3 Escalation & difficulty

Boss difficulty peaks at *the almost-agreement* (Array is hardest — peak difficulty
coinciding with peak sympathy is the design [BIV.5 §14]) — ordering: D-2 < D-3000 <
Harrow (skill) < Array (skill + schedule). Escalation instruments: tempo, arena
denial, and information load — never damage sponging **LAW** [B0 §13.73].

## 7.4 Weak-states, not weak-points

Machines expose **states** (vent cycles, limb reloads, sensor sweeps — telegraphed by
posture per threat-table honesty) discoverable via the Assessor's Read mid-fight
(§2.14: lowering the weapon to *look* is the bravest verb). The Read annotates the
journal in-fight (one-line hand notes). Nothing glows **LAW**.

## 7.5 The Harrow exception (duel grammar)

Human boss = survival + position scoring, not HP: the duel ends by *outcome states*
(cornered/disarmed/timed per Book II staging), she cannot be killed **LAW** [Lock
§20.5]; her barks are content (teaching to the end); shooting to wound vs. suppress
affects bark text only, never the outcome [Lock §3.18]. Engineering note: build the
duel as a state machine over positions, with damage as pressure input — an HP bar on
Harrow is a canon violation.

## 7.6 What makes a boss memorable (design targets)

The arena (D-3000's chart hall), the interruption (the report over the D-2 fight),
the refusal (walking past Voss — non-boss, but the grammar's proof), the reversal
(the lever). Memorability in Eden is authored *moments inside* fights — each boss
carries one Top-25 memory beat [BIV.5 §16] and the fight is staged around protecting
that beat from noise.


---

# SECTION 8 — EXPLORATION

## 8.1 Exploration philosophy

Exploration is reading (§0.2). The player should feel like the *first attentive person*
in spaces built for crowds that never came — curious, small, trusted with the text.
Design serves the four feelings in sequence per space: awe → smallness → unease →
rationed shelter [BIV-QR §1].

## 8.2 Navigation & landmarks (markerless law)

- **No minimap, no compass ribbon, no objective markers** **LAW** [B0 §9-UI]. The map
  is a hand-annotated compass-journal (drawn by Asher as the player Reads; fidelity =
  perception tier).
- Wayfinding instruments, in priority: **landmarks** (one anomalous vertical per
  skyline **LAW** [BIV-QR §3]; persistent silhouettes across chapters — Steelgate
  readable three chapters out), **light** (a warm pool promises honestly — light never
  lies **LAW** [BIV.5 §4]), **wear** (desire-lines, hinge polish, worn thresholds),
  **Chargehand** (the world's own signage), and **sound** (the Registry heard two
  corridors early [BIV.5 §10]).
- The objective *line* (text, one sentence, journal-voiced) hides entirely in
  signature spaces **LAW** [B0 §5].

## 8.3 Environmental storytelling as system

Every dressed space answers the five questions (who/what/when/what-remains/what-was-
filed) **in props** [B0 §2.12]; this book adds the *interaction contract*: at least
one of the five answers per room is interactive (a document, a Read annotation, a
Chargehand line) so storytelling is verbed, not wallpapered. The journal's room-log
quietly tracks answered questions per named space — the input to perception tier
progression (§5.3).

## 8.4 Secrets & optional paths

- Found by **attention**: light, wear, Chargehand, sound asymmetry — never shimmer,
  never markers **LAW** [B0 §10].
- Rank of what's behind them, enforced in content review: understanding > views >
  human traces > materiel **LAW**.
- One visible-inaccessible place per major space; ~60% open later **LAW** [BIV.5 §4].
- The player's chalk (§2.11) lets them annotate the world itself — the game never
  needs it (spaces are honest), but it makes exploration *authored*, and returning to
  one's own chalk three chapters later is a designed nostalgia beat.
- Optional doors buy epilogue texture, never power or endings **LAW** [BIV.5 §7].

## 8.5 Backtracking & vertical exploration

Backtracking is always *re-reading*, not padding: a returned-to space must have
changed (world ledger: scars, cordons, seasonal light, replanting) or the player must
have changed (new tier reads old walls anew). Vertical exploration distributes dread
(up: mass above) and vertigo-hope (down: the lit-from-below grammar) per chapter mood
[BIV.5 §5]; sling routes and freight tops are the optional vertical tier with the
views layer of the reward hierarchy.

## 8.6 Observation points & reveals

No tower-synchronize mechanics. Observation points are benches, catwalks, and dock
ends — rest-class spaces (§15.4) whose reward IS the view and what it lets the
journal annotate (a skyline sketched = landmarks named = navigation deepened). The
seven architectural firsts and reveal law (35 mm threshold → 24 mm hold ≥ 4 s, input
never locked, reveals never time out) are binding [BIV.5 §10].

## 8.7 Hidden lore & collectibles

Collectible classes: **documents** (facsimiles, read in-world in the Registry-drawer
UI — never paraphrased [B0 §9-UI]), **Chargehand variants** (glyph glossary grows),
**June's sound labels** (found audio), **GN loose pages** (apocrypha; feeds §12's
framing), **grave-tree tags**. Zero "1/54 collected" counters on screen; the journal
shows what it holds, not what it lacks **LAW** — absence is for the world to imply,
not the UI to nag.

## 8.8 Safe spaces

One true shelter per chapter, after the peak **LAW** [B0 §2.16]; the locked shelter
list [BIV.5 §9] is the level-design order of battle. Shelter systems: bench, leaf
(save), cache, water/heat (debuff clears), conversation set, and one hope-verb
(watering, grafting, mending) that costs a minute and pays in nothing but feeling —
protected from all objective pressure **LAW 8-A**.

---

# SECTION 9 — PUZZLE DESIGN

*This game asks the head to READ, not to solve [BIV.5 §17 note]. Puzzle density is
light, environmental-only; there are no puzzle rooms with abstract logic gates, no
sliding-tile locks, no Towers of Hanoi. A "puzzle" in Eden is always a piece of the
world being exactly what it is, asking to be understood.*

## 9.1 Puzzle classes

| Class | Form | Example grammar |
|---|---|---|
| **Architectural** | read the load path / date the pour to find the way | machine-cold ribbon = Accord addition = the sealed original door is *behind* it |
| **Environmental** | light, water, dust as information | the drip that shouldn't exist reveals the roof route; wind direction finds the broken pane |
| **Mechanical** | counterweights, freight cages, tide gates, sling rigging | re-hang a freight counterweight to open the Vault gate; time the tide lock |
| **Memory** | documents cross-referenced | match the parish ledger hand to the school register (Ch.6's R3 discovery is this system [Lock §20.4]) |
| **Traversal** | route-craft under constraint | reach the catwalk carrying the green unit (laden) without a fight |
| **Technology** | Edge procedure turned against Edge | the permit terminal accepts Asher's still-valid Warden form-language; the player fills a form to open a door (the tutorial's grammar, re-priced) |

## 9.2 Difficulty progression & fairness

Early puzzles are single-read (one evidence piece); by Ch.7–9 route-craft compounds
2–3 reads. Every puzzle's evidence is within the space or the journal **LAW 9-A** (no
moon logic, no pixel hunts — Read-focus priority guarantees findability). Hint
philosophy: the world hints (light shifts, NPC barks at rests), the UI never does
**LAW**; optional cell-radio nudges only on Story assist (§14).

## 9.3 Reward & failure

Rewards follow the exploration hierarchy (§8.4). Failure states: none hard — a puzzle
unsolved is a route untaken; mechanical puzzles are always resettable (counterweights
re-hang; tides return). The only timed puzzles are tide- and schedule-driven, and
their clocks are world-visible (water line, festival bells), never HUD timers **LAW**.

---

# SECTION 10 — UPGRADE SYSTEM

*All upgrades are bench work — hands, tools, and favors. Nothing is "unlocked" in a
menu; everything is fitted, filed, ground, sighted, or sewn by someone with a name.*

## 10.1 The bench system

Benches live in shelters (§8.8) and are keyed to masters: **Coil** (the hand, feed
polish, case chemistry), **Mara** (kit, slings, doctrine — her "upgrades" are
briefings that annotate maps), **Brack/tide markets** (plates, Tideworks work, bolt
stock — priced in salvage and favors), **Registry contacts** (document restoration —
lore-track upgrades). Master availability follows the story **LAW** (Ch.6–7's cooled
cell prices warmth honestly: benches work, voices don't).

## 10.2 Upgrade classes & example ladders

- **Weapons (§4 paths):** 3–4 steps per family; each step is a *handling* change
  (time, sway, capacity), never a damage multiplier **LAW 10-A** — damage grows only
  via ammunition class (hardened bolts, handloads), which is economy, not skill-tree.
- **Suit/kit (§5.2):** carry, climb-ready, wet-proofing, third plate arc.
- **Movement:** nothing direct **LAW** (§5.2) — movement upgrades are route unlocks
  (sling-kit, freight pass).
- **Scanning:** ring tuning + optic re-collimation (Read annotations at range).
- **Survival:** dressing pouch +2, canteen insulation, bench-made splint kit
  (Binding recovery in field, 1 use/rest).
- **Utility:** bandolier, case chemistry, chalk set (three colors — pure expression).

## 10.3 Resource costs & pacing

Costs draw on §11's economy (components + specific salvage + sometimes a favor). The
full ladder cannot be bought in one run (~70% coverage on a thorough playthrough) —
choice, not completionism. Upgrade pacing budget: ~1 meaningful acquisition per
chapter early, ~2 mid-game, tapering to zero in Ch.10 **LAW** (the finale adds
nothing new; §6.8's no-new-mechanics law extended to gear).

## 10.4 Balancing philosophy

An upgrade must change *how the player behaves*, or it's cut. QA test per upgrade:
observe 5 playtesters before/after — if routes, stances, or preparation rituals don't
visibly change, the upgrade is a stat ghost and gets redesigned.

---

# SECTION 11 — RESOURCE ECONOMY

## 11.1 The resource set

| Resource | Fiction | Sources | Sinks | Rarity |
|---|---|---|---|---|
| Ball, small / long | service calibers | caches, fallen Wardenry (hand-looted), tide markets | firing | common / uncommon |
| Coil shells | rolled salvage | Driftmark, benches | firing | uncommon |
| Survey long | pre-Accord stock | caches only (finite chapter budgets) | firing | rare |
| Driver bolts | industrial stock | Vault yards, Mulcher trade | firing | rare |
| Cases (seed/smoke/foam/thumper) | Sower shop goods | benches (component-built) | deployment | crafted |
| Dressings & splints | cloth + tincture | benches, caches, Noor-class NPCs | damage | common-ish |
| Components | stripped salvage | the Read finds them (wear says what's worth stripping); carcasses of machines | bench work | steady trickle |
| Plate | composite salvage | tide markets, fallen hazard crews (scripted) | fitting + degradation | uncommon |
| Seed-stock | the sacred resource | Standing Hall vault, regrowth sites, Ledger gifts | covenant plantings, epilogue texture | precious **LAW: never purchasable** |
| Documents/lore | paper | the world | understanding | see §8.7 |
| Keys/permits | Edge bureaucracy | stolen, forged (Pale), formed (§9.1 technology puzzles) | doors, schedules | story-paced |
| Currency | none abstract | — | — | **barter + the cell's ledger of favors only [NEW CANON]** |

## 11.2 Acquisition philosophy

Scavenging is a *reading* act (components look load-bearing to Tier-1 eyes and
strippable to Tier-2); looting bodies is slow, deliberate, and only for calibers +
scripted salvage (§4.3). Vendors are relationships (Brack's prices move with the
forgiveness thread — logged as the one place economy touches story state).

## 11.3 Tuning targets

Ammo inflow ≈ 80% of observed median outflow per chapter (pressure without famine);
survey long & bolts hard-capped per chapter (preparation weapons stay preparation);
dressing inflow tuned so the player rests because they *want* the bench, not because
the game starves them into it. Wave mode (§12) runs its own closed economy.

## 11.4 The critical-path floor (anti-frustration)

Dynamic floor: if the player crosses an encounter threshold below (1 dressing + 30%
sidearm ammo), the next cache tops them to the floor exactly — never above **LAW
11-A**. Invisible, unannounced, and tuned to be rarely triggered. No difficulty-based
economy scaling except via named assists (§14).

## 11.5 What is never in the economy

XP, currency-as-number, gacha anything, crafting trees deeper than one bench step,
vendor-trash items, and seed-stock markets **LAW** — the moment life is priced in
shells, the game has answered the Central Question in text, wrongly.

---

# SECTION 12 — THE STANDING WATCH (WAVE SURVIVAL MODE) **[NEW CANON — mode name & framing]**

*The standalone wave mode. Separate from the campaign; same laws.*

## 12.1 Narrative justification

The Standing Watch is the banned graphic novel's *apocrypha*: loose pages depicting
regrowth defenses by OTHER Sower cells across the Republic — the nights the book's
readers copied most. Menu framing: the journal's last drawer holds recovered loose
pages; selecting one enters that page's night. This framing (a) keeps single-player
canon intact (the player embodies unnamed cell planters, not Asher — Asher's story
stays authored), (b) licenses arena variety across all six Concessions, Driftmark,
and the Belt, (c) makes score fiction-honest: a page's "score" is *what the acre
banked*, and (d) resolves nothing (apocrypha, curated by the Canon Office [Lock
§20.15]).

## 12.2 Unlock & structure

Unlocks when the campaign's first covenant completes (Ch.1) — the verb must be
learned in context first **LAW**. Phase A note: the Standing Watch is the web link's
replayable centerpiece (§0.5.1); its arenas are the smallest shippable expressions of
full canon law.

## 12.3 Arena design philosophy

Each arena = one page = one place with the five questions answered (even wave arenas
are dressed spaces **LAW**); built per §6.3–6.4 (lanes, flanks, retreat, under
something enormous); one green unit + 1–3 plantable points; day-night is fixed per
page (the fiction's nights). Launch set: 6 arenas (stillwood cordon, Driftmark tide
yard, Furrows partition, provincial parish orchard, Vault depot, viaduct nest
approach).

## 12.4 Wave progression & enemy scaling

Waves follow *escalation drills*, not HP inflation **LAW**: composition and doctrine
escalate (patrol pairs → hazard crews → survey drones → marksmen → Devastator-class
events) per Lock §17's roster; machine events are the "boss waves" (a D-2 arrival
re-stages the arena; it targets the sapling first — sapling-priority is canon [Lock
§17]). Wave count per page: 7 standard; every 7th is a machine event; after wave 14
the page enters **the Long Night** (endless bracket) where intervals shorten and
resource inflow flattens — ends when the acre falls or the player *chooses* to bank
and leave (banking out is a scored decision: greed vs. stewardship, the mode's soul).

## 12.5 Between-wave economy & upgrades

Closed economy: banked growth (the score currency) spends between waves at a field
bench — cases, dressings, plate, ONE weapon-handling step per night. Spending banked
growth on kit visibly *shrinks the acre's final tally* — every purchase is read back
by the end screen **LAW 12-A** (risk/reward as theology: what you spend on the gun
was life).

## 12.6 Scoring

Score = **the acre's ledger**: growth banked (waves held × unit uptime) + plantings
alive − growth spent on kit − structures lost. Style is not scored; kills are not
scored **LAW** — the mode counts what survived, not what died. High-score table per
page (local + asynchronous global, §0.5.2); the score screen is a ledger page in
Sela's format, and a perfect night is stamped "reckoned."

## 12.7 Difficulty & replayability

Pages carry fixed doctrine variants (which enemies exist) + three watch conditions
(Quiet/Long/Amber = standard/endless-earlier/machine-heavy). Replay driver: the
ledger table, the banking-out decision, and page unlocks (new pages found as campaign
collectibles — modes feed each other, §8.7).

## 12.8 Rewards

Cosmetic + textural only: chalk colors, kit-bag patches, journal marginalia, and one
campaign echo (a Standing Watch acre well-kept appears as one extra epilogue vignette
line) **LAW: no campaign power crosses over.**

---

# SECTION 13 — SAVE SYSTEM

## 13.1 The leaf (manual save)

Manual save = pressing a leaf into the journal at shelters **LAW** [B0 §9-UI]: one
deliberate verb, 2 s, diegetic. Slots are journal pages (12 visible slots; chapter
splash art = the GN pages [BIV-QR §10]).

## 13.2 Autosave & checkpoints

Autosave at: chapter boundaries, macro-loop seams (post-aftermath), covenant wave
boundaries, boss phase boundaries (§7.1.6), pre-irreversible interactions. Never
mid-combat otherwise; never during rests (rests are the player's time). Death reload
≤ 5 s to control **LAW** (Phase A included — checkpoint payloads sized accordingly).

## 13.3 What is saved

World ledger (scars, cordons, chalk, plantings), journal (annotations, documents,
tiers), trust state, kit/bench state, losses (§5.6 — burned volumes stay burned in
the slot), and the two player-set relationship choices (Dez Ch.3; Brack Ch.8 [Lock
§15]) — which affect texture, never endings [Lock §3.18].

## 13.4 Chapter & mission replay

From the journal's GN splashes: any completed chapter replays with a kit snapshot
from its first entry; replay progress writes to a shadow slot (never clobbers the
campaign line). Standing Watch pages launch from the last drawer (§12.2).

## 13.5 Difficulty selection & statistics

Difficulty (named as *watches*: Reader / Planter / Warden / **the Long Watch**) is
selectable at start and changeable at any rest; changes are logged in the journal's
own hand (the ledger records everything, judgment-free). Statistics live as journal
marginalia (distance walked, acres banked, documents read, nights out) — never
K/D, never accuracy grades **LAW**: the game does not keep the score the player's
old employer would have kept.

## 13.6 NG+ & save inheritance

The Second Printing (§5.7) starts from a completed slot; Phase A→B migration: web
saves export as a signed journal file importable in the Steam build (§0.5.2).

---

# SECTION 14 — ACCESSIBILITY

*Accessibility gates are canon [B0 §14-QC.69] and ship-blocking. The principle:
assists lower the interest rate, never delete the bill — every player feels cost;
no player is walled from the text.*

- **Difficulty assists (per-toggle, any combination, any time):** aim assist strength
  0–3 (magnetism + friction; default 1 on gamepad); enemy lethality −25/−50%; ammo
  floor raised (§11.4 floor at 60%); tremor-response visual-only (motor accessibility
  for the sigh mechanic — cost communicated, input unimpaired); Story watch preset
  (all of the above + cell-radio puzzle nudges §9.2). Assists never disable
  achievements/pages **LAW**.
- **Subtitles:** 200% scaling [B0 canon]; speaker names; sound-description track
  (the sigh, the four bars, and room-tone changes are *captioned* — silence is
  content here, so silence is described); paper-strip styling preserved at all sizes.
- **Audio:** full mix sliders; mono option; visualize-audio option (journal-styled
  direction ticks for gunfire/footsteps — paper grammar, not radar) — tuned so it
  aids without becoming a minimap **LAW**.
- **Visual:** colorblind green→luminance variant (mandatory QA [B0]); the green
  ration's *meaning* re-carried by luminance + shape (shape-doubled codes are canon
  [B0 §9-UI]); UI scale 100–200%; high-legibility font toggle for journal hand;
  camera: FOV 65–90, bob/sway/blur/shake toggles (§2.12); photosensitivity: amber
  pulse capped under threshold [B0], no strobes anywhere, Vault-bloom softened mode.
- **Motor:** full remap (both phases, KBM + pad); hold→toggle conversions for ALL
  holds — *except the governor's ten seconds, which converts to a repeated-press
  rite* (the meaning is effort; the implementation is flexible) **[NEW CANON —
  accessibility ruling]**; single-hand presets; slide/lean optional alternates.
- **Cognitive:** objective-line always-on option (one sentence, journal voice — it
  may leave signature-space hiding when enabled, overriding B0 §5 for this user;
  logged exception); rest-recap page (what happened, in Asher's prose).

---

# SECTION 15 — GAME BALANCE

## 15.1 The balance philosophy

Balance in Eden = *the price is always right*: every option's cost tracks its power
in the currencies this game actually runs on (time, noise, position, ammunition,
feeling). Imbalance symptoms are behavioral, not statistical: if playtesters stop
reading rooms, something is overpriced; if they stop feeling losses, something is
underpriced.

## 15.2 Risk/reward audit table

| System | Risk | Reward | Guard |
|---|---|---|---|
| Push forward in waves | exposure | covenant safety | retreat lane law 6-A |
| The Read in combat | lowered weapon | weak-states | §7.4 |
| Banking out vs Long Night | greed | ledger score | §12.4 |
| Spending banked growth | smaller tally | kit now | LAW 12-A |
| Suppressor-wrap | 2-mag life | quiet | degradation audio |
| Optional doors | time | texture | never power (LAW) |

## 15.3 Difficulty across watches

Watches scale: enemy accuracy/aggression windows, ammo economy (±20%), Binding damage
thresholds — never enemy HP inflation, never boss mechanics removal **LAW**. The
Long Watch: no Breath regen out of segment, benches cost double components, and the
journal keeps a *debt page*. All watches keep the pace map [BIV.5 §3] — difficulty
never buys more combat minutes **LAW 15-A**.

## 15.4 Pacing budgets (the numbers QA holds)

Combat ≤ 12 continuous min **LAW**; ≥ 14 designed recovery beats campaign-wide
**LAW**; 1 shelter/chapter after peak **LAW**; insignificance 1/10 min **LAW**;
wonder 3/game **LAW**; Ch.7 + Epilogue combat = 0 **LAW**. Upgrade pacing per §10.3;
economy per §11.3. These are regression-tested against playthrough telemetry every
milestone.

## 15.5 Player fatigue & psychological flow

Fatigue watch: session telemetry flags >20 min without a state change (combat/
explore/rest) as a pacing bug. Flow protection: no loading walls mid-chapter (Phase A
streams behind thresholds); death-retry ≤ 5 s; rests never interrupted by systems
(LAW 8-A). The curve never flatlines [BIV.5 §18] — and never redlines: two peaks
never adjoin without a designed breath.

## 15.6 The wonder budget

Three unqualified wonder-beats (acre, chart-hall, valley) **LAW** [B0 §2.17]. All
other awe carries a visible bill in-frame (a cost, a debt, an occupancy). Balance
reviews audit new content against the budget: a "wow" without a bill is spending the
game's rarest currency without authorization.

---

# SECTION 16 — PLAYER PSYCHOLOGY

*How the systems make the player think — the engineering targets behind BIV.5 §2's
sixteen stations.*

- **How players should think:** like an assessor who changed sides — pricing spaces,
  reading procedure, preparing. The systems reward *hypothesis → evidence → action*;
  they never reward twitch-first (§1.1's READ phase is where the game lives).
- **When they panic:** covenant breaches (the sapling exposed) and machine events —
  panic by *stakes*, never by information denial **LAW** (§3.2). Panic must always
  have a verb available (foam, smoke, body-block, carry).
- **When they feel safe:** shelters — absolutely (LAW 8-A: safety there is a promise
  the game never breaks; the ONE exception in the whole game is the Standing Hall
  raid, which is the point — the war breaks the promise, not the design [Lock §3.13]).
- **When curiosity overrides fear:** always eventually — fear in Eden is
  comprehension arriving early (BIV.5 §11), so curiosity is the *cure*: the D-2 is
  less frightening read than unread. Systems ensure investigating is always possible
  (Read from safety, lean, sound) before engaging.
- **When they feel powerful:** Ch.4–5's granted plateau (loadout familiar, procedures
  working) and whenever preparation pays exactly as planned. Power in Eden = the
  plan surviving contact.
- **When they feel vulnerable:** carrying (weapons down — the mourning verbs are the
  vulnerable verbs, deliberately); laden traversal; the tremor; the descent; any time
  the covenant splits their attention. Vulnerability is always *chosen or authored*,
  never random.
- **The forbidden state:** numbness [B0 §2.1]. Telemetry proxies: skipped documents
  trending up, rests skipped, saplings unwatched in aftermath. Any sustained numbness
  signal = pacing/stakes review, not a content nerf.


---

# SECTION 17 — QUALITY CONTROL (THE 100 GAMEPLAY VALIDATION QUESTIONS)

*Run against every new feature, level, weapon, enemy behavior, or mechanic — before
implementation and again before ship. Any "wrong" answer = redesign or reject. Q1 is
the master question mandated for this book: everything else elaborates it.*

**Belonging (1–10)**
1. Does this belong in the universe defined by the Master Creative Bible — and can you
   defend that in one sentence without the word "cool"?
2. Could this mechanic exist unchanged in another game? *(yes = redesign)* [B0 §14.5]
3. Does it keep the losses felt? [B0 manifesto]
4. Does it dramatize the Central Question or dodge it?
5. Would the world do this to itself if no player were watching?
6. Is it the cheapest honest version?
7. Does it deepen rather than repeat? [B0 §14.73]
8. Does it need a marker, logo, or monologue to work? *(yes = redesign)*
9. Is anything here only because it looks/feels cool? *(yes = redesign)*
10. Does it resemble another franchise's signature? *(yes = restart)*

**Core loop & exploration (11–25)**
11. Does the mechanic reinforce exploration-as-reading?
12. Does it respect the reward hierarchy (understanding > views > traces > materiel)?
13. Does it work without markers, minimap, or objective pins?
14. Does it leave a trace the world keeps?
15. Does it have a legible, diegetic cost (LAW 1-A)?
16. Can the player read their way around it (read-route rule)?
17. Does it give curiosity a verb?
18. Does it respect "light never lies"?
19. Does it survive the blindfold test (no Read tier required for critical path)?
20. Does backtracking through it offer a re-read, not a repeat?
21. Does it honor reveal law (input never locked; awe never times out)?
22. Is any secret it hides findable by attention alone?
23. Does its optional content buy texture, never power?
24. Does it keep one visible-inaccessible place per major space?
25. Would a player standing still in it for 60 seconds still be learning?

**Combat (26–45)**
26. Can the camera point at what this fight defends?
27. Does the encounter end on a question or a cost?
28. Is the protected thing audible under the fight?
29. Does it stay inside the 12-minute continuous-combat ceiling?
30. Does it border a breath on both sides?
31. Is every enemy present for a faction-true reason (Lock §17)?
32. Are civilians structurally impossible to harm (Lock §3.16)?
33. Is escalation legible before it is dangerous?
34. Does fear come from comprehension, not startle?
35. Are spawns staged and watchable (no teleports)?
36. Do arenas provide lanes, an ownable flank, and a retreat (LAW 6-A)?
37. Does the AI disengage on procedure and file paperwork about the player?
38. Does the arena keep its scar afterward?
39. Is the aftermath staged so players check the protected thing before loot?
40. Does difficulty escalate by tempo/information, never HP sponging?
41. Does the mechanic avoid power-fantasy drift (no kill rewards, no rage meters)?
42. Are weapon handling times honored ±10% (feel canon)?
43. Is ballistic behavior honest (no hidden damage taxes)?
44. Does noise have consequences the player can predict?
45. Would Sela sign the encounter's entry? [B0 §14.75]

**Weapons & economy (46–60)**
46. Is it ballistic, appliance-honest, and custody-documented?
47. Does its wear answer "what motion made this"?
48. Is its ammunition priced into the chapter economy?
49. Does the upgrade change behavior, not just numbers (LAW 10-A)?
50. Is the seed-thrower still incapable of anti-personnel harm (LAW 4-C)?
51. Does nothing in the economy price seed-stock in currency?
52. Is ammo still the least interesting reward in any container?
53. Does the critical-path floor remain invisible and minimal (LAW 11-A)?
54. Are enemy weapons still un-lootable outside scripted salvage (LAW 4-B)?
55. Does maintenance stay a rhythm, never a nag?
56. Does the melee refuse execution-cinema?
57. Do reloads preserve state and stay interruptible?
58. Is the tremor a readable cost, never a control lock?
59. Does the green unit remain combat-harmless?
60. Could a player finish the chapter without firing outside covenants? (If the
    design accidentally forbids it where fiction permits it, restage.)

**Progression & systems (61–75)**
61. Does progression read as perception + trust, never spreadsheet?
62. Are health segments still constant (no HP inflation across the campaign)?
63. Does every loss subtract something the player used?
64. Are trust numbers invisible and consequences diegetic?
65. Does the upgrade taper hold (nothing new in Ch.10)?
66. Do saves honor the leaf (deliberate, diegetic, at shelters)?
67. Is death priced in ≤ 5 s of repetition and zero humiliation?
68. Do chapter replays shadow-save (never clobber the line)?
69. Does NG+ deepen the text (variant marginalia) without resolving open questions?
70. Do the two relationship choices touch texture only, never endings?
71. Do assists lower interest, never delete the bill?
72. Are all holds toggle-convertible except the governor's authored rite?
73. Are shape-doubled color codes intact in every new UI surface?
74. Does the statistics page refuse K/D and grades?
75. Does the journal show what it holds, never what it lacks?

**Waves, bosses, pacing (76–90)**
76. Is the wave a covenant (pointable, audible, alive)?
77. Does wave escalation change doctrine, not padding?
78. Does banking-out remain a real scored decision?
79. Does spending banked growth visibly shrink the tally (LAW 12-A)?
80. Does the Standing Watch resolve zero campaign mysteries?
81. Does every boss pass the ten-point contract (§7.1)?
82. Is the arena readable before the boss enters?
83. Do phases change the question, not the HP bar?
84. Does the boss end through the world (witnessed/outlasted/rigged/reached)?
85. Is Harrow still un-killable and Voss still un-fightable?
86. Did exit-interviews return the assigned word (not "epic")?
87. Are checkpoints at phase boundaries with prep restored (LAW 7-A)?
88. Do the pacing budgets hold (14 breaths, 1 shelter/chapter, 1/10 insignificance)?
89. Is the wonder budget unspent by this feature (3/game)?
90. Do Ch.7 and the Epilogue still contain zero combat?

**Experience & platform (91–100)**
91. Does it support the chapter's assigned emotional row [BIV.5 §17]?
92. Does it protect its Top-25 beat from noise?
93. Does silence remain placed and full where this feature lives?
94. Does music enter only after meaning completes?
95. Does the feature work identically in the web build (LAW 0.5-A)?
96. Does it hold 60 fps on the Phase A envelope?
97. Does it survive tab-refresh (state captured in checkpoint schema)?
98. Is it single-player pure (LAW 0.5-B)?
99. Is every [NEW CANON] item it introduces logged in PROJECT_STATE.md?
100. After playing it, is the tester feeling *something* — and can they name it in
     one word? *(numb = redesign everything around it)*

---

# SECTION 18 — THE GAME DIRECTOR'S CHECKLIST (50 YES/NO GATES)

*The pre-implementation gate. Every gameplay feature passes ALL applicable gates
before an engineer touches it. Answer honestly; a "yes, but" is a no.*

**Gameplay (1–10)**
1. Can you state the feature's purpose in one sentence? Y/N
2. Does it serve at least one loop tier (micro/macro/campaign)? Y/N
3. Does it have a legible cost? Y/N
4. Does it leave a trace? Y/N
5. Is it operable with KBM and gamepad? Y/N
6. Does it obey the controller feel canon (§2.1)? Y/N
7. Is it free of markers, pins, and floating UI? Y/N
8. Does it work at 60 fps on Phase A hardware? Y/N
9. Is it save/restore-safe at every checkpoint boundary? Y/N
10. Is it testable with written acceptance criteria? Y/N

**Story & emotion (11–20)**
11. Does it dramatize (not answer) the Central Question? Y/N
12. Does it keep the losses felt? Y/N
13. Is its emotion assignment named — one word? Y/N
14. Does it respect the chapter's pace-map row? Y/N
15. Is it silent where the silence law rules? Y/N
16. Does it avoid exposition (world answers, nobody narrates)? Y/N
17. Are locked fates untouched (Sela, Harrow, Grimwood, Voss, the two deaths)? Y/N
18. Are the eight open questions still open? Y/N
19. Does any new name/date slot into the Master Timeline without displacement? Y/N
20. Is every [NEW CANON] addition logged? Y/N

**Combat (21–28)**
21. Pointable defended thing? Y/N
22. Faction-true opposition only? Y/N
23. Civilians impossible to harm? Y/N
24. Escalation legible first? Y/N
25. Ends on cost or question? Y/N
26. Borders a breath? Y/N
27. Ballistics-only, appliance-honest? Y/N
28. No power-fantasy drift (no kill rewards)? Y/N

**Exploration & progression (29–36)**
29. Reward hierarchy honored? Y/N
30. Found by attention, not shimmer? Y/N
31. Optional = texture, never power? Y/N
32. Perception/trust progression only (no XP, no spreadsheets)? Y/N
33. Loss subtracts something used? Y/N
34. Critical path Read-tier-free? Y/N
35. Shelter promises kept (LAW 8-A)? Y/N
36. Wonder budget unspent? Y/N

**Accessibility (37–41)**
37. Shape-doubled color codes? Y/N
38. Subtitle/caption coverage including silence description? Y/N
39. Hold→toggle conversion (or authored-rite exception documented)? Y/N
40. Photosensitivity thresholds held? Y/N
41. Playable with assists without content loss? Y/N

**Replayability & production (42–50)**
42. Does it read differently on a second playthrough? Y/N
43. Does it work in chapter replay's shadow-slot? Y/N
44. Standing Watch compatible (if arena-class content)? Y/N
45. Phase A/Phase B identical in design (LAW 0.5-A)? Y/N
46. Single-player pure? Y/N
47. Within the asset/perf envelope for its scene? Y/N
48. Cheapest honest version chosen? Y/N
49. Sources cited to governing books? Y/N
50. Would you defend this feature to Sela's ledger — and to a player ten years from
    now? Y/N

*Scoring: all applicable gates Y = build it. Any N = fix or reject. Gates 11, 12, 17,
18, 23, 46 are absolute — a single N there is a stop-ship.*

---

# SECTION 19 — AUDIO & PRESENTATION ADDENDUM (GAMEPLAY INTEGRATION)

*Audio law lives in Book 0 §12; this addendum binds the user-directed 2026-07-03
additions into that law and gives engineering the integration spec. Logged in
PROJECT_STATE.md.*

## 19.1 The score: grand ambient orchestra **[NEW CANON — register definition]**

- **Direction:** the score's *bed register* is a **grand ambient orchestra** — vast,
  slow, pressure-bearing orchestral textures in the modern epic-ambient tradition
  (low massed strings and brass breathing at architectural scale, choral air, deep
  sustained drones; the *Dune*-scale feeling of a world too large for its people) —
  **100% original composition, zero copyrighted or licensed material, no reference
  audio shipped**. The comparison is a register description, never a temp-track to
  imitate; Book 0's import test applies to music exactly as to art (if the cue needs
  another franchise's name to pitch it, it belongs to that franchise).
- **Reconciliation with locked law (no exceptions):** the ambient orchestra is the
  *presence* half of the score's presence/absence grammar [B0 §12]. It enters only
  after meaning completes; it ends when the player should carry the feeling alone;
  silence wins every tie; the full orchestra still detonates exactly once (Ch.9)
  **LAW** — the ambient register is what makes that single detonation land. Stillwood
  traversal, the four bars, Ch.6, the Voss negotiation, and the governor seconds stay
  unscored **LAW**. Motif ownership per the ledger (hymn/Sela, bass/Asher, slowed
  piano/Grimwood, anti-sigh/Coil, cartridge/June) is binding; the ambient bed carries
  motifs as *architecture entered*, not melodies applied.
- **Gameplay integration:** the bed is state-aware, not combat-aware — it keys to
  *meaning states* (covenant active, aftermath, revelation, rest) and never to
  aggro-state (no combat-music switch **LAW**; stingers are forbidden [B0 §13.91]).
  Mix: the bed sits under the protected thing's audio in covenants, always.

## 19.2 Sound effects: total coverage, worker-honest

Every mechanic specified in this book carries an SFX contract line — nothing moves
silently, nothing sounds imported:

| System | Signature sounds (all original, surface-true, convolution-spaced) |
|---|---|
| Controller (§2) | footsteps per surface (12 material sets), kit-creak by weight notch, breath state machine, mantle hand-hits (ivory hand has its own tap), landing settles, wet-kit drip |
| Weapons (§4) | per-family fire/echo profiles scaled by nave height, case-fall per surface, reload procedures (every stage), fouling wheeze, jam-clear, suppressor-wrap degradation, the Jack's flywheel whine |
| The Read (§2.14) | page-settle, pencil annotation, dry stamp; ring warmth = low harmonic hum (15 m proximity grammar) |
| Covenant | the green unit's anti-sigh (ascending, diegetic), sapling wind (the protected thing's voice — mix-forward under fire **LAW**), banked-growth chime = ledger-pen scratch, never a fanfare |
| Enemies | doctrine audio: compliance phrases, escalation calls, cordon radio; machine threat-table posture sounds (servo grammar per Devastator mark); the sigh on any cascade + Asher's phantom response (rumble + one exhale) until Ch.10 **LAW** [Lock §20.16] |
| UI | stamps (120 ms, one bounce), paper slides forbidden, leaf-press, journal hand |
| World | HVAC hush, heel echoes ≥ 2 s in monuments, lamp-buzz, chain/tide, the stillwood's designed-absence room tone [B0 §12] |
| Bosses | per locked schemes: D-2 spotlight servos + broadcast band; Harrow's decelerating snare (the one percussion exception); D-3000 orchestra cut dead at collapse; Array recitation + governor mechanism |

**Coverage rule:** any shippable interaction without an authored sound is a bug of
record. SFX are mixed to protect *the silence law*: the loudest sound in the game
(D-3000's chart-fall) is loud because everything else refused to be.

## 19.3 The 0.1 noise layer (presentation quality) **[NEW CANON — locked value]**

- **Visual:** the filmic stack [Lock §14] locks its grain at **intensity 0.10**
  (10% of full scale), luminance-weighted, resolution-independent (grain sized to
  1080p reference so it never becomes noise-soup at 4K), applied AFTER the LUT,
  disabled on GN pages (paper texture is their grain) and reducible to 0 in
  accessibility settings. Purpose: the 0.1 grain is *material honesty for the
  lens* — it keeps the ration's flat greys alive and kills banding in the long grey
  gradients this game lives in.
- **Audio:** a matching **−60 LUFS room-tone floor** under every mix state (the world
  is never digitally dead-silent — even the stillwood's designed absence is a
  *presence*); dither-honest export chain. The silence law is served by this floor,
  not violated: "silence" in Eden is room tone, and room tone is authored.

## 19.4 Phase A audio integrity

Web build ships the full mix architecture (no "we'll do audio later"): compressed
stems within the 200 MB envelope, seamless loop points, and the four empty bars
timed to asset-load reality (GN pages preload during the bars — the Artist's
signature is also the streaming budget's friend).

---

# SECTION 20 — NEW CANON REGISTER (THIS BOOK'S ADDITIONS)

*Everything Book V introduces that future books must honor; logged in
PROJECT_STATE.md per Lock §20.20.*

1. **Platform amendment:** two-phase delivery — instant-play web link first, Steam
   desktop second; single-player in all phases (§0.5).
2. **The Assessor's Read** — the perception/scanning system and its three tiers
   (§2.14, §5.3).
3. **Weapon roster & nomenclature:** Arsenal P-11 / C-9 (Republic patterns,
   Edge-refurbished), Tideworks coil-pump, Ranger-pattern R-4 survey rifle, the
   grafting mortar (seed/smoke/foam/thumper cases; no anti-personnel payload — LAW),
   the bolt-driver "Jack" (Mulcher industrial tool) (§4.2).
4. **The spade as melee** and the spade-clamp bayonet (§4.9).
5. **Health grammar:** Breath/Binding double-rule segments, constant for the campaign
   (§3.4, §5.1).
6. **The Standing Watch** — wave mode framed as the banned GN's apocryphal loose
   pages; ledger scoring; the Long Night; banking-out (§12).
7. **The Second Printing** — NG+ naming and variant-marginalia design (§5.7).
8. **Watch-named difficulties:** Reader / Planter / Warden / the Long Watch (§13.5).
9. **Economy ruling:** no abstract currency; barter + the cell's ledger of favors;
   seed-stock never purchasable (§11).
10. **Accessibility ruling:** all holds toggle-convertible except the governor's ten
    seconds, which converts to a repeated-press rite (§14).
11. **Score register:** the grand ambient orchestra bed, original composition only,
    subordinate to all locked silence law (§19.1).
12. **Presentation locks:** film grain intensity 0.10; −60 LUFS room-tone floor
    (§19.3).

---

## CLOSING — THE SYSTEMS MANIFESTO

We build systems the way this world pours concrete: load-honest, over-provisioned in
care, empty of ornament. Every verb has a price and every price leaves a trace.
The player's eye is the character sheet. The covenant is the game. The tutorial is
the crime, the lever is the absolution, and between them every mechanic exists to do
one thing the Accord Age could not:

**keep the losses felt.**

If a system does that — ship it.
If it doesn't — bring the spade.

*Still here.*

*— End of BOOK V (Gameplay & Systems Bible), Edition One. New canon per §20 logged in
PROJECT_STATE.md. Loading order stands: Book 0 → Canon Lock II.5 → this book for all
gameplay disciplines. Amendments require a logged entry in PROJECT_STATE.md.*
