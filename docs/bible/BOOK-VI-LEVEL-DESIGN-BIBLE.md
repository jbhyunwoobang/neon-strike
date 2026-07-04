# ECHOES OF EDEN
## BOOK VI — THE LEVEL DESIGN BIBLE
### Edition One · The Physical Experience of the Game · 2026

*Governed by BOOK 0 (identity) → BOOK II.5 (Canon Lock) → BOOK I (world) → BOOK II
(narrative staging) → BOOK IV + IV-QR (visual & scale law) → BOOK IV.5 (experience law) →
BOOK V (gameplay systems contracts). Nothing herein contradicts a previous book. This book
designs no gameplay systems (Book V owns them), writes no lore (Books I–II own it), and
creates no characters (Book III owns them). It designs THE PHYSICAL EXPERIENCE: every
location, room, hallway, elevator, arena, skyline, transition, and environmental story.
Where this book must invent (route names, sub-locations, per-chapter landmark
assignments, level organization), the invention is flagged **[NEW CANON]** and logged in
PROJECT_STATE.md.*

**Audience:** lead level designers, environment artists, gameplay designers, technical
designers, lighting artists, world builders, and engine developers. **The objective:** a
level designer must be able to build the complete campaign from this book plus its cited
sources **without inventing anything** — every location architecturally believable, every
level emotionally purposed, every room historically caused, nothing randomly placed.

**How to read this book.** Numbers marked **LAW** are structural and immutable; other
numbers are Edition One targets (±20% in blockout review without amendment). Binding
numeric scale canon lives in Book IV §2 / IV-QR §3 and is *cited, never restated* — when
this book says "corridor," it means the 6–9 m nave of the scale table, always. The five
questions (who used this · what did they do · when did it stop · what remains · what was
filed) are abbreviated **5Q** throughout. Arena contracts (lanes, flanks, retreat,
read-route) are Book V §6 and are abbreviated **V-6**. The pacing budgets (12-minute
combat ceiling, 14 recovery beats, shelter-after-peak, insignificance 1/10 min, wonder
3/game) are LAW everywhere in this book and are abbreviated **the budgets**.

**The one-sentence version of this book:** the world is the surviving witness — every
space the player walks must testify, and the level designer's job is not to build
containers for gameplay but to *take the deposition of a civilization*.

---

# SECTION 0 — CORE LEVEL DESIGN PHILOSOPHY

## 0.1 Why exploration exists

Because in this world the truth was never hidden — it was *outshone* [BI §XII]. The
paperwork lies, the media curates, the living witnesses are gone or paid; only the built
world still testifies, and it testifies to anyone who walks slowly enough to read it.
Exploration is therefore not optional content bolted to a campaign: it is the game's
epistemology. The player learns what happened to this civilization the only way it can
still be learned — by attendance. Every exploration reward obeys the fixed hierarchy
(understanding > views > human traces > materiel [BIV.5 §1]), because the game must never
teach the player that walking is for loot. Walking is for knowing.

## 0.2 Why architecture is gameplay

Three reasons, each mechanical:

1. **Architecture is the information system.** There is no minimap, no markers, no
   objective pins **LAW** [B0 §9-UI]. Light promises, wear directs, Chargehand labels,
   formwork dates, load paths predict. The level IS the HUD. A space that fails to guide
   is not "hard" — it is a broken interface.
2. **Architecture is the difficulty curve.** Combat difficulty in Eden is spatial
   (position, lanes, sightlines — V-6), and reading a room before a fight is the tactics
   layer (the Assessor's Read, Book V §2.14). The level designer tunes challenge by
   geometry, never by damage numbers.
3. **Architecture is the argument.** Ideology is legible in section **LAW** [BI §VI.2]:
   Edge looms, the Ledger stands, Sowers borrow. When the player walks from a viaduct's
   contempt (piers landing in former gardens) into a Standing Hall's humility door, they
   have received the game's politics through their legs. No dialogue required — and per
   canon, none permitted where the space can speak [B0 §2.5].

## 0.3 Why verticality matters

Verticality is the world's moral axis made walkable. **Looking up is dread** — mass
above, the inheritance looming, Edge's power expressed as weight over the visitor [BI
§VI.2]. **Looking down is vertigo-hope** — the governor chamber is the only space where
the player descends INTO light [BIV.5 §10], and that camera move is the game's whole
theology. Between those poles, vertical traversal distributes the chapter moods [BIV.5
§5]: sling routes buy the views layer, freight tops buy owned flanks, the 1,100 m shaft
buys ninety seconds of earned smallness. The rule: verticality is never a jungle-gym; it
is *elevation with a thesis*. Every climb must change what the player understands, not
just where they stand.

## 0.4 Why players should become lost

Deliberately, briefly, and safely — because disorientation is the honest first reading
of a civilization that built past its own comprehension. The design distinguishes three
states: **wandering** (desired: the player explores without certainty, held by curiosity
— target state for 20–40% of traversal time), **lost** (permitted in bounded doses: no
current hypothesis about the route, ≤ 3 minutes before an honest signal resolves it —
a landmark reappears, light promises, wear-paths converge), and **stuck** (forbidden:
no hypothesis AND no discoverable signal — this is a design bug, not difficulty).
Getting mildly lost in the stillwood or the arcology stacks is the mechanism by which
finding the landmark *lands* — relief is manufactured from honest uncertainty. **LAW
0-A:** every "lost-able" space carries a recovery lattice — at least two of: persistent
landmark sightline, wear-path convergence, light gradient, sound beacon (the Registry's
nib-scratch grammar [BIV.5 §10]).

## 0.5 Why landmarks matter

Because memory is the game's subject, and landmarks are how a *place* becomes a
*memory*. A landmark is a silhouette the player can name after one look and locate from
anywhere in its domain. The skyline law — max three silhouette depths + exactly one
anomalous vertical **LAW** [BIV §2] — exists so every vista has a rememberable spine.
Landmarks also carry the campaign's continuity: Steelgate must be readable three
chapters out [B0 §10], so that Chapter 9's arrival is not an introduction but a
*keeping of an appointment*. Scale accumulates memory; the level designer's instrument
is repetition of silhouette across increasing proximity.

## 0.6 Why giant structures affect psychology

Because bigness in Eden is inheritance, never triumph [BIV §1]. The Gravity Style is a
dead congregation's sermon: a civilization that feared forgetting poured itself
permanence, then hollowed out. The player's smallness (<3% rule **LAW**) prices their
body against the world's convictions [BIV.5 §5] — and that pricing produces the game's
signature emotional chord: awe → smallness → unease → rationed shelter [BIV-QR §1].
Megalophobia is scheduled (the insignificance cadence, 1/10 min **LAW**) because the
nervous system habituates: the designer must re-administer smallness rhythmically or
the world shrinks to wallpaper. And the counter-beat is equally engineered: pockets
(2.4–3.2 m) exist so the body remembers what *housed* feels like — the contrast is the
content.

## 0.7 Why traversal is emotional

Because the controller is weighted (Book V §2) and the spaces are sequenced monumental
→ threshold → pocket **LAW** [BIV §2], every walk is a composition in compression and
release. Traversal carries the game's slow feelings — the ones combat cannot hold:
isolation (the stillwood's 25-minute ceiling without human trace [BIV.5 §2.3]),
mourning (Ch.7's twenty combatless minutes, one shovel), determination (Charge Day's
three-thread walking work), reflection (the epilogue, all traversal). The two mandatory
slownesses — the Returning's twenty minutes and the descent's ninety seconds — are
LAW [B0 §10], and they are *level design deliverables*: spaces built so that slowness
feels like attendance, not waiting.

## 0.8 Why every level tells history

Because the world has no narrator **LAW** [B0 §2.5] — the player asks; the world
answers. Every level is therefore built as evidence: 5Q answered in props in every
dressed room [B0 §2.12]; two eras on every lingering surface (palimpsest law [BIV-QR
§2.9]); walls dateable by formwork (machine-cold 2.4 m ribbons = Accord; hand-boarded
warm = pre-Accord [BIV §3]); wear that answers "what motion made this?" The level
designer is the game's historian of record: a room without a historical cause does not
ship — "it's a good arena" is not a cause. The QC instrument is Section 17; the
standing test is the Ledger's: does this space *deepen* the record or merely occupy
acreage?

---

# SECTION 1 — WORLD STRUCTURE

## 1.1 The shape of the playable world

The campaign traverses the Meridian Republic west-to-east and surface-to-depth: from
the living redwood coast (Prologue, 2068) through the dead interior (Act I), into the
corporate machine-belt and back to the coast's wound (Act II), then to the capital and
under it (Act III), and finally to the valley (Epilogue). The world is **a journey, not
a hub** — chapters are one-way passages with rich internal loops (§1.8), because the
campaign's fiction is a clock (Evergreen's schedule) and its emotion is a pilgrimage.
The player never "fast-travels"; distance is meaning.

**The macro-geography (canon, Lock §5):** Concession III "Amber" (redwood coast, west)
· Halden's Ford (Ledger town within Amber) · the Quiet Belt and its Stillwoods
(continental interior) · Driftmark (drowned salvage coast) · the Furrows (agricultural
machine-belt) · Cadence (capital arcology, ~40M) containing Steelgate (Edge HQ) and,
1,100 m beneath it, the Evergreen chamber · the valley (epilogue regrowth, reaching
Halden's Ford's watershed).

## 1.2 How districts connect — the four connective systems **[NEW CANON — route names]**

1. **The Amber Line** — the mag-freight spine linking Concession III's harvest tracts
   to the Furrows and Cadence. Kilometer-gauge freight halls, departure boards for
   cancelled passenger lines (schedule ghosts [BIV §3]), cab-forward mag-units. The
   player rides freight (hidden, scripted) at three seams: Ch.3→4 approach, Ch.7→8
   entry to Cadence, Ch.8 internal Charge Day movement. Rail is Edge's circulatory
   system — moving through it is moving through the harvest's bloodstream, and the
   level design makes the cargo legible (Vault racks, timber that shouldn't exist,
   sealed Evergreen containers in Ch.8 — foreshadowing by manifest).
2. **The Viaduct Web** — the Accord's elevated crossings striding over the provinces
   without touching them [BI §VI.2]. Dead infrastructure, alive with Sowers: Taproot's
   nest is *inside* a viaduct [BII Ch.1]. Viaducts are the Belt's skyline anchors and
   its highways for those who walk — deck-level wind, pier-level shadow towns.
   **Design rule:** every Belt vista contains one viaduct silhouette; every viaduct
   pier lands in something it killed (a garden, a street, a churchyard) — the contempt
   is buildable [BIV §8].
3. **The Tide Routes** — Driftmark's half-tide causeways and smuggler channels; passable
   geometry changes on the tide clock (world-visible, never HUD [Book V §9.3]). Brack's
   locks (Ch.8) open the "wet door" into Cadence's harbor levels.
4. **The Deep Pours** — the underground: service galleries under every Accord
   megastructure, Vault depot vaults, and the Steelgate deeps (Verge's 2040s–60s
   pours) terminating in the 1,100 m shaft **LAW** [Lock §21-C]. The deep pours are
   the world's honest stratum — "I know where the concrete is honest" [BII §V] — where
   formwork history, seepage, and chalk tallies replace all signage.

## 1.3 Elevators & vertical circulation

Elevators are freight-first cages with Vault-sized gates [BIV §9] — never mirrored
boxes. Design roles: **anticipation instruments** (the shaft descent, 90 s, no skip
**LAW** [BIV.5 §5]); **threshold markers** (a gate-slam is a chapter's paragraph
break); **pacing valves** (cage travel is where streaming breathes, §1.9). Rules: the
player is never locked out of input in an elevator (reveals law); cages carry their
biography (chalk tallies, gate dents, one operator talisman); civic lifts exist only
in Steelgate and run silent — the difference between a freight cage's honesty and a
civic lift's hush is a readable class document. Ladders, gantry stairs, and Sower
sling-drops (§1.2 of Book V §2.7) complete the vertical kit; every multi-level space
routes DOWN faster than UP (falling-water logic — descent is always the offered
direction in this world, and the player feels the asymmetry without being told).

## 1.4 Maintenance tunnels & service space

Every Accord structure carries its service double: gantries, cable galleries, drainage
runnels large enough to walk [BIV §3 infrastructure honesty]. Service space is the
player's professional habitat — Asher's Warden knowledge makes "the maintenance route"
the canonical read-route (V-6) around set-piece spaces. Rules: service space is
body-scaled (2.4–3.2 m — the pocket band) and therefore also the relief system inside
monumental chapters; it is never a crawl-corridor filler (crawls ≤ 90 s **LAW** [BIV
§2]); it always rejoins the monumental with a threshold reveal (the service door onto
the 40 m hall is the game's favorite sentence and must be composed, not spawned).

## 1.5 Collapsed routes & the world's edits

Collapse is authored history, never random rubble: every blocked route names its cause
(flood undercut, spall from a 2064-era emergency harvest, a Wardenry demolition with
cordon serials, tide damage) — debris sorted by salvage value [B0 §6], load-path
failure sketchable [BIV §3]. Collapapsed routes do double duty: they justify the
one-way journey (the world, not invisible walls, closes doors) and they carry the 40%
of visible-inaccessible places that stay questions **LAW** [BIV.5 §4].

## 1.6 Secret shortcuts

The Sower web: sling-drops, borrowed doors re-hung [BIV §9], Mulcher tide-caches,
pre-Accord passages under provincial towns. Shortcuts obey the secret grammar (found by
attention — light, wear, Chargehand [B0 §10]) and pay in the exploration hierarchy:
most shortcuts save little time but yield understanding (the shortcut *is* a document —
who cut it, who kept it stocked). One per chapter minimum links the chapter's shelter
to its arena approach — the "prepared route" that makes preparation (Book V §3.9)
spatial.

## 1.7 Backtracking

Chapters loop internally (out-and-back with changed state), never across chapters —
EXCEPT the three authored returns, which are the campaign's spine made spatial: the
**Standing Hall** (Ch.2 consecrated → Ch.6 burned → Ch.7 the Returning in its ruin
[BII]); **the 2068 cordon** (Prologue lived → Ch.5 revisited as evidence); **Halden's
Ford's watershed** (Ch.5 stillwood → Epilogue regrowth). Backtracking law: a returned
space must be *changed or re-read* (world ledger: scars, cordons, replanting; or new
perception tier) [Book V §8.5] — the three authored returns are the loudest
applications: same geometry, different world, and the level kit must be built to
survive all states (the Hall models three states **LAW** [BIV §8]).

## 1.8 Chapter progression & internal structure

Each chapter is a self-contained streaming world (§1.9) shaped as: **approach corridor**
(broad, landmark-led) → **exploration body** (2–3 interlinked loops around a spine) →
**set-piece space** (arena/boss/rite) → **egress** (short, decompressing, transitional).
Loops within the body allow optional doors and secrets without breaking the pilgrimage;
the spine guarantees the critical path reads without any Read tier **LAW** [Book V
2-B]. Golden-path lengths (target, medium pace): P 45 min · Ch.1–8 60–90 min ·
Ch.9 75 min · Ch.10 60 min · E 40 min; exploration adds 30–60% per chapter.

## 1.9 World streaming strategy

**Phase A (web link, Book V §0.5):** chapter = streaming unit; intra-chapter
sub-levels stream behind thresholds (§11) — freight rides, cage travel, GN pages (the
four empty bars are also preload windows **LAW** [Book V §19.4]), and threshold
compression corridors are the seams. No loading screens exist as screens **LAW**; the
player never reads "LOADING" in this game. **Phase B (UE5):** World Partition with
per-district data layers (§16). Memory discipline: the monumental style is cheap by
design (few lights, one volumetric, metronomic instancing [BIV §15]) — the streaming
budget spends on hero pours and dressed 5% islands, never on filler variety.

---

# SECTION 2 — CAMPAIGN FLOW (CHAPTER MAPS)

*The production spine. Every chapter entry keys to Book II §VII (events — binding),
BIV.5 §17 (emotion/intensity rows — binding), BIV §5 (color scripts — binding), and the
budgets. Format: Purpose · Location · Beginning / Middle / End · Transition out ·
Emotions (1°/2°) · Architecture · Intensity dials (Combat/Explore/Puzzle as L/M/H) ·
Boss · Environmental storytelling anchors · Cutscene/GN placement.*

## P — PROLOGUE "The Sigh" (2068)

- **Purpose:** competence in the wrong livery; plant the permit prompt. **Location:**
  Concession III night tract — living redwood forest under work-light.
- **Beginning:** black, wind, the far sigh; the player walks INTO a living forest at
  night — the game's only chapter that opens warm and loud (rain, crew chatter,
  insects). **Middle:** escort procedure across three harvest stations (perimeter
  walk → Vault convoy → the permit terminal — the two presses). **End:** the
  escalation drill; the D-2 turns; the hand; white.
- **Transition:** GN-1 (eleven wordless pages) → title over the stillwood at grey noon.
- **Emotions:** competence / horror. **Architecture:** none built — the forest AS
  architecture (trunks-columns inverted: here they are alive; the stillwood rhyme is
  planted in its living key). Work-camp furniture: floodlight masts, Vault cradles,
  the permit terminal kiosk (hero prop).
- **Intensity:** Combat M (procedural) · Explore L · Puzzle none. **Boss:** none (the
  D-2 is an event, not a fight — the player cannot win, and the level must make
  fleeing-and-dragging the readable verb).
- **Env. storytelling:** thermos culture, worn permit keys [BII §XII]; the crew's
  numbered tarps — people as serials before the machine ever moves.
- **Cutscenes/GN:** GN-1 at end (2m10s). No mid-chapter cuts — the prologue is uncut.

## CH.1 — "Grey Noon"

- **Purpose:** the 2071 world; the cell; the covenant verb. **Location:** stillwood
  approaches → Taproot nest (Accord viaduct interior) → first regrowth site.
- **Beginning:** stillwood traversal, zero exposition, navigation by Chargehand and
  light — the player's first cathedral rhyme (the dead forest reads as the concrete
  halls will). **Middle:** the viaduct nest — first shelter, first faces, the spade
  before the weapon; Coil re-governs the Converter. **End:** the first regrowth
  defense (canonical covenant wave, V-6 archetype A §8.3) → dawn over the banked
  sapling, 40 s, no UI **LAW**.
- **Transition:** nest rest → Ch.2 orchard road (walked seam, streamed).
- **Emotions:** isolation / belonging. **Architecture:** stillwood-as-building; the
  viaduct's underworld (pier shadow town); the nest = Sower borrow-kit at full warmth.
- **Intensity:** Combat M (one wave block) · Explore H · Puzzle L (environmental
  reads). **Boss:** none.
- **Env. storytelling:** Chargehand marginalia dating tract deaths; the ranger tower
  logbook continuous across the defunding [BII §XII]; two patrol logs signed A.F.
- **Cutscenes/GN:** none — deliberately uncut chapter [BII]; the dawn hold is the
  "cutscene."

## CH.2 — "The Orchard of Names"

- **Purpose:** the Ledger; the moral floor. **Location:** Concession III Standing Hall,
  orchard-cemetery, seed vault.
- **Beginning:** seed-crate escort through stillwood (carry verbs teach). **Middle:**
  the Hall — smallest reveal in the game (2.0 m door onto one tree in one light
  **LAW** [BIV.5 §10]); the orchard read (name-tags in bark; the deconsecrated grey
  wing). **End:** Mulcher poacher defense (orchard perimeter, covenant-lite) → the
  Evergreen broadcast watched in the nave.
- **Transition:** GN-2 (broadcast satire) → Driftmark road.
- **Emotions:** awe / tenderness. **Architecture:** Ledger kit at full statement —
  vertical humility; lime-warm pour; lamplight absolute.
- **Intensity:** Combat L · Explore M · Puzzle L (ledger cross-reads seeded for Ch.6).
  **Boss:** none. **Cutscenes:** Sela's ledger reading (90 s lamplight lock-off);
  broadcast (45 s). **GN:** GN-2 at exit.
- **Env. storytelling:** grave-tree tags; Sela's pencil amendments in a printed
  hymnal; the seed vault's triple hand-me-down locks (Ch.6 payoff).

## CH.3 — "Driftmark"

- **Purpose:** the grey market; June; Dez; the world's price list. **Location:**
  drowned suburbs, tide markets, Brack's yards, June's dock.
- **Beginning:** tide-causeway approach at low water — the First Spending's drowned
  rooms readable through clear water. **Middle:** market loops (the game's densest
  human dressing — the 5% at maximum [BIV §1]); the Vault convoy heist across
  half-tide concrete (schedule = tide clock); the Dez encounter (spare/bypass).
  **End:** the stolen Vaults opened in the nest (30 s held frames) → Lange's arrival.
- **Transition:** Lange's line ends Act I innocence → Amber Line freight seam to Ch.4.
- **Emotions:** warmth / suspicion. **Architecture:** Driftmark kit — palimpsest at
  district scale (hand-paint over drowned serif); timber add-ons on drowned concrete.
- **Intensity:** Combat M (heist + first human squads) · Explore H · Puzzle M (tide
  timing, §9). **Boss:** none. **Cutscenes:** Vault opening (30 s). **GN:** none.
- **Env. storytelling:** high-water lines inside nursery rooms; the legible drowned
  street sign; June's cartridge-label wall; Brack's crews' permit trouble visible in
  background paperwork **(two chapters early — placement is load-bearing)**.

## CH.4 — "The Furrows"

- **Purpose:** the machine that feeds the cities; R1 (the memo). **Location:** a
  kilometer greenhouse vault; Lange's archived lab partition; the exfil dock.
- **Beginning:** the wrongness reveal — flat shadowless light, no shadow to hide scale
  in; the far wall resolves after a full minute's walk **LAW** [BIV.5 §10]. **Middle:**
  stealth-forward infiltration on stolen schedules (procedure grammar; V-6
  read-routes at maximum); the lab partition (R1 document chain). **End:** exfil-dock
  wave defense (covenant: the *documents* are the pointable thing — a book cart
  archetype) → the intake schedule decrypts: Amber, ninety days.
- **Transition:** freight seam west; the schedule burns in the journal.
- **Emotions:** wonder-inverted / unease. **Architecture:** Furrows kit — glass vault,
  white catwalks, corporate green (wrong `#5E8A6A`), the only abundant green the
  player cannot touch.
- **Intensity:** Combat M · Explore M · Puzzle M (technology puzzles — Edge forms
  turned against Edge [Book V §9.1]). **Boss:** none. **Cutscenes:** Lange at her
  bench (60 s). **GN:** none.
- **Env. storytelling:** worker shrines zip-tied to irrigation; chapel attendance
  ledger; the unauthorized tomato plant in a duct — the game's smallest covenant.

## CH.5 — "Amber" (the hinge)

- **Purpose:** homecoming; the D-2; R2 (the report). **Location:** Halden's Ford
  stillwood → Noor's door (optional) → the 2068 cordon → the regrowth acre.
- **Beginning:** the homecoming walk — the stillwood that used to be his coast;
  optional-encounter-rich approach (Noor's kitchen, the fence-post initials).
  **Middle:** the cordon — the player walks into their own Prologue (same geometry,
  three years dead, evidence tags on the trees); dread built in daylight. **End:**
  the **D-2 boss** at the acre (arena §12.2); R2 detonates mid-fight; the standing-
  apart scene; GN-3.
- **Transition:** GN-3 (the Incident redrawn) → mobilization intercept: the Hall.
- **Emotions:** dread / shame (with the acre's WONDER₁ at center **LAW** — the first
  sanctioned gasp). **Architecture:** provincial/Belt kit + stillwood; the cordon =
  procedure archaeology at full dress; the acre = the color event.
- **Intensity:** Combat H · Explore M · Puzzle L. **Boss:** D-2/C3-0881.
- **Env. storytelling:** 2068 evidence tags; Noor's bucket path worn into stone; the
  parish's empty town readable house by house.
- **Cutscenes/GN:** report-read is in-fight (barks, not cutscene) **LAW**; GN-3 at
  exit.

## CH.6 — "The Standing Hall"

- **Purpose:** the war's moral turn; loss; R3 (the parish ledger). **Location:** the
  Hall and orchard, night → fire.
- **Beginning:** arrival mid-evacuation — the space the player rested in (Ch.2) is
  now the stakes; carrying books is the combat verb. **Middle:** evacuation waves
  (civilian-throughput covenant, archetype C §8.3); the fire spreads by authored
  stages (amber-only law **LAW** [BIV §5]); Sela's death is staged in level (smoke
  route, volume three), not cutscene. **End:** the **Harrow duel** (colonnade,
  §12.3) → the orchard-burning wide (2 m static) → R3 findable in the rescued
  volumes.
- **Transition:** GN-4 (the page) → ash rain into Ch.7.
- **Emotions:** loss / anger. **Architecture:** the Hall kit's burned state — the
  level deletes its own shelter **LAW** [BIV.5 §13; Book V §5.6].
- **Intensity:** Combat H (but grief-typed) · Explore L · Puzzle L (the ledger
  cross-read R3 is the chapter's one "puzzle" and is optional-findable **LAW** [Lock
  §20.4]). **Boss:** Harrow.
- **Env. storytelling:** the fire-order (oldest volumes saved first); the triple
  locks opened; Wardens' route knowledge exposing Brack two ways.
- **Cutscenes/GN:** orchard burning (2 m, the act's spine); GN-4 at exit (40 s).

## CH.7 — "The Architect"

- **Purpose:** grief → authorship; the plan. **Location:** the Hall ruin (the
  Returning) → Cadence: Verge's unfinished commission → deep-pour recon.
- **Beginning:** the Returning — twenty combatless minutes **LAW**; the shovel input;
  the funeral the player attends. **Middle:** Verge's commission (raw pour, one
  inhabited wing; his corrected drawings nailed over originals). **End:** lantern-lit
  deep-pour recon (beam-taught geometry [BIV.5 §10]) → "Thirty days."
- **Transition:** the lantern hand-off; Verge stays in the dark.
- **Emotions:** mourning / resolve. **Architecture:** the ruin's re-dress (ash, rain,
  one surviving sapling); the commission = Gravity Style *unfinished* — the style's
  anatomy lesson (rebar, formwork in place, pour lifts half-poured: the player sees
  HOW the world was made, once, here **[NEW CANON — placement]**).
- **Intensity:** Combat none **LAW** · Explore M · Puzzle M (route-craft recon).
  **Boss:** none. **Cutscenes:** none over the rite (the rite is playable **LAW**).
  **GN:** none — the chapter IS the breath.

## CH.8 — "Charge Day"

- **Purpose:** attachment to the city about to go dark; the three keys. **Location:**
  Cadence at festival — stacks, mag-halls, Registry, June's dock-rig, Brack's harbor
  locks.
- **Beginning:** arrival into festival striplight — the Accord Age at its most
  charming, and the player knows the bill [BIV.5 §16]. **Middle:** three-thread prep
  (Pale's books — Registry stacks; Dez's schedules — Wardenry margins; Brack's locks —
  harbor levels + the forgiveness choice at the tide-line); the cartridge on real air
  (dock night, nobody speaks). **End:** the cell goes dark; gear-check.
- **Transition:** GN-5 (lamplight gear check) → Steelgate approach.
- **Emotions:** attachment / foreboding. **Architecture:** arcology residential kit at
  festival dress (bunting from harvest-livery offcuts); the Registry (dove-grey
  stacks, heard before seen); mini-boss: marksman duo on the stack rooftops [Book V
  §6.8].
- **Intensity:** Combat L–M · Explore H (the game's widest optional field) · Puzzle M
  (memory-class: Pale's duplicate books [§9]). **Boss:** none. **Cutscenes:** the
  speaker scene (held, in-engine). **GN:** GN-5 at exit.
- **Env. storytelling:** translation registers in public brass; Amber's serials
  pre-printed for next quarter's liturgy; door-shrines; laundry lines between fins.

## CH.9 — "Steelgate"

- **Purpose:** the breach; the D-3000; the refusal. **Location:** Edge HQ — plaza,
  lobby (the chart), corridor cathedrals, descending cores, Voss's office, the shaft
  head.
- **Beginning:** the approach the player has watched for three chapters arrives —
  Steelgate at full scale (hazard-crew foreman mini-boss on the service approach).
  **Middle:** the combat crescendo (the game's 12-minute ceiling lives here **LAW**);
  the lobby reveal (arena before boss **LAW**); the **D-3000** under the chart
  (§12.4). **End:** the silence after — Voss's office (no art, one window, the grid);
  the deal; the walk **LAW** (input held, the door pushed); the cage down.
- **Transition:** GN-6 (the shaft in section, one page one panel) → the 90 s descent
  → Ch.10.
- **Emotions:** awe / cold clarity. **Architecture:** Steelgate kit — the district
  that lies (no visible cables **LAW** [BIV-QR §7]); mirror floors; the etched chart
  floor-to-ceiling.
- **Intensity:** Combat H · Explore M (Edge's curated emptiness reads differently —
  the 5Q answered in *redactions*) · Puzzle L. **Boss:** Devastator-3000.
- **Env. storytelling:** the Wardenry locker with the child's tree drawing [BI §I];
  queue posts for absent crowds; Voss's floor designed to lie [BIV §3].
- **Cutscenes/GN:** Voss negotiation (in-engine, coffee & HVAC, no score **LAW**);
  GN-6 into the descent.

## CH.10 — "Evergreen"

- **Purpose:** the chamber; the docent; the governor. **Location:** shaft base →
  antechamber → the inverted Standing Hall.
- **Beginning:** the antechamber quiet — the recitation overheard (four hundred names,
  heard before seen **LAW** [BIV-QR §9 Grimwood grammar]); staff spaces where the
  Republic's best believers work (optional dialogues, deliberately hard to argue
  with). **Middle:** the array encounter (schedule-denial, §12.5) while the docent
  narrates. **End:** the governor — the carved sentence above it; the ten held
  seconds; the flood; the arrest; "One valley." / "One more than you were leaving."
- **Transition:** the anti-sigh completes → epilogue fade (one year).
- **Emotions:** revelation / acceptance. **Architecture:** the inverted nave — the
  style's theological end-state **LAW** [Lock §11]; lit from below, white → green.
- **Intensity:** Combat M · Explore M (the archive is the last museum) · Puzzle L.
  **Boss:** the Evergreen array (reached, not destroyed **LAW**).
- **Env. storytelling:** the species list on four hundred index cards; the parish
  ledger open to the Forester page; Verge's shell — his formwork signature readable
  by the player who learned it in Ch.7 (the architecture's authorship as the final
  environmental revelation **[NEW CANON — placement]**).
- **Cutscenes/GN:** the governor is an interface, not a cutscene **LAW**; ending
  cutscene (4 m ceiling, locked).

## E — EPILOGUE "The First Credit" (2072)

- **Purpose:** consequences read; the inverted ration; reflection. **Location:** the
  valley; vignette sites (Driftmark tide-line, the court bench, Noor's kitchen, the
  parish).
- **Structure:** all traversal, zero combat **LAW**, no objectives, no prompts
  (protected UI state **LAW** [BIV.5 §2.16]); vignettes discovered by walking;
  choice-inflected texture. June's shot; the seedling; "Still here."; one bird at
  +0:60.
- **Emotions:** melancholy + hope, together. **Architecture:** the valley — green
  world, grey accent (inverted ration **LAW**); the first informal desire-line path
  [BII §XII] as the last piece of environmental storytelling: the oldest architecture
  there is, returning.

## 2.1 Campaign flow audit (the budgets, verified per chapter)

| Ch | Combat | Explore | Puzzle | Boss | Shelter (after peak) | Insignificance beat | GN |
|---|---|---|---|---|---|---|---|
| P | M | L | — | — | — (prologue exempt: the forest is warm) | harvest floodlight canyon | GN-1 |
| 1 | M | H | L | — | Taproot nest | stillwood nave; viaduct underworld | — |
| 2 | L | M | L | — | Sela's reading bench | orchard under grey hills | GN-2 |
| 3 | M | H | M | — | June's dock at lamp-hour | drowned suburb horizon | — |
| 4 | M | M | M | — | Furrows observation catwalk | the far-wall minute | — |
| 5 | H | M | L | D-2 | Noor's kitchen (optional; nest fallback) | the cordon approach | GN-3 |
| 6 | H | L | L | Harrow | — DELETED (the burned Hall; the loss is the design) → Ch.7 rite carries the breath **LAW** | colonnade smoke-light | GN-4 |
| 7 | — | M | M | — | Verge's drafting wing | the commission's raw nave | — |
| 8 | L–M | H | M | mini | laundry-line balcony | Charge Day skyline | GN-5 |
| 9 | H | M | L | D-3000 | shaft-head catwalk (post-Voss) | the lobby; the chart | GN-6 |
| 10 | M | M | L | Array | — (the finale; epilogue is the rest) | the descent; the chamber | — |
| E | — | H | — | — | the valley entire | the valley from the tree line | GN-7 |

*14 designed recovery beats distributed per BIV.5 §3; max continuous combat lives in
Ch.9 at 12:00 **LAW**; no block repeats its predecessor's dominant **LAW**.*

---

# SECTION 3 — THE LEVEL BLUEPRINT (THE TWELVE-PART ANATOMY)

*Every campaign level is assembled from twelve anatomical parts. Not all are equal-sized
and two are conditional, but a blockout review checks all twelve boxes or documents the
exception. The order below is the DEFAULT sequence; chapters may re-order for cause
(logged), never omit without cause.*

1. **ENTRANCE.** The level's first sentence — always a threshold (compression before
   the chapter's opening wide **LAW** [BIV §12]). Why: the player must *cross into* a
   chapter, not load into it; the entrance prices what follows. Spec: 35 mm-compressed
   approach ≥ 8 s of walk; surface change underfoot (audio confirms arrival); the
   chapter title card sits here (serif, the only serif in UI law).
2. **INTRODUCTION SPACE.** A low-pressure 2–4 minute zone teaching the chapter's key:
   its light regime, its district kit, its dominant verb (carry, read, climb, hold).
   Why: chapters are dialects; the introduction space is the phrasebook. No combat may
   start here **LAW** (chapter opens belong to insignificance beats [B0 §2.4]).
3. **LANDMARK.** The chapter's spine made visible early (§6): one anomalous vertical
   or signature silhouette established in the first wide. Why: all subsequent
   wayfinding hangs from it (§5); memory needs a spine.
4. **EXPLORATION AREA.** The chapter body's 2–3 loops (§1.8): optional doors, secrets,
   documents, human traces. Why: this is where the game's epistemology lives (§0.1);
   density target — one authored discovery per 90 seconds of wandering at medium
   attention (not per meter: per *attention*).
5. **COMBAT ARENA(S).** Placed where the story bleeds [B0 §10], built to V-6 (lanes,
   ownable flank, retreat, read-route), under something enormous **LAW**. Why: combat
   is the argument by other means, and the arena is the courtroom.
6. **PUZZLE.** One spatial understanding-test per chapter minimum (§9), woven into the
   architecture (a counterweight, a tide gate, a formwork read). Why: the head must be
   asked to read, not to solve [BIV.5 §17] — the puzzle is proof the player has learned
   the district's language.
7. **NARRATIVE SPACE.** The room where the chapter's story event lands (the nave, the
   lab partition, the office). Why: story beats need staging that outlives them — the
   narrative space is dressed to be re-read after the beat (scars persist **LAW**).
8. **QUIET SPACE.** The shelter (§10), after the peak, never before **LAW**. Why: rest
   is digestion [BIV.5 §9]; feelings catch up to hands here.
9. **ENVIRONMENTAL REVEAL.** The chapter's staged architectural first (the seven firsts
   [BIV.5 §10] and their siblings): threshold → one 24 mm wide held ≥ 4 s → the
   player's input first **LAW**. Why: wonder is rationed and must be *composed*.
10. **VERTICAL TRAVERSAL.** At least one meaningful elevation change with a thesis
    (§0.3): sling route, gantry stair, freight top, cage. Why: the moral axis must be
    walked, not just seen.
11. **BOSS ARENA** *(Ch.5/6/9/10 only)*: §12. Why: revealed before the boss **LAW**;
    the arena is half the encounter's meaning.
12. **EXIT.** The decompression seam: shorter and quieter than the entrance, carrying
    the chapter's cost forward (the journal annotates; the world's ledger updates).
    Why: chapters must end the way the game ends — with the player carrying something.

**Blueprint law VI-A:** the twelve parts connect monumental → threshold → pocket →
monumental **LAW** [BIV §2]; never two pockets adjacent, never three monuments
unrelieved; every part reachable on the spine without any Read tier [Book V LAW 2-B].

---

# SECTION 4 — ROOM PHILOSOPHY

## 4.1 The eight questions (5Q + 3)

Every dressed room answers, in props and surfaces alone [B0 §2.12; BIV §7]:

1. **Who built this?** — answered by formwork (machine ribbon = Accord; hand-board =
   pre-Accord), proportion (which kit), and inscription voice (serif/grotesk/
   Chargehand).
2. **Why?** — answered by load path and fixture: what the room's geometry is *for* is
   sketchable (a Vault cradle room curves its floor falls toward drainage; a chapel
   aims its volume at one aperture).
3. **When?** — answered by strata: two eras per lingering surface **LAW**; datable
   junctions (a 2.4 m Accord ribbon meeting hand-boarded lime pour is a *date written
   in concrete*).
4. **Who used it?** — answered by wear: hinge polish, key-cluster wear, prayer-grip
   shine, desire-lines; wear maps are choreography records [BIV §4].
5. **What happened here?** — answered by procedure residue: cordon tape, tags, chalk
   serials, spall with rebar stubs — violence leaves paperwork, never gore **LAW**.
6. **What remains?** — answered by the salvage sort: what was taken tells the price
   list; what was left tells the values [BIV §7]; dust ghosts record removals.
7. **Why is it abandoned?** — answered by economics made visible: maintenance
   withdrawn (rust bleed), route severed (the collapsed span outside the window),
   purpose extinct (departure boards for cancelled lines). Abandonment always has a
   *budget reason* the dresser can name **LAW** [BIV §4].
8. **What was filed about it?** — the franchise question: the room's documentary
   residue placed where the work happened (manifest, permit, register) — findable,
   purposeful, never confetti **LAW**.

## 4.2 How architecture tells the story (the room grammar)

- **Volume is intent:** ceiling class (pocket/corridor/hall/signature per the scale
  table) declares who the room was built FOR — bodies, freight, crowds, or God-scale
  argument.
- **Light is biography:** the one source (blade/pool/glow) says what the room's makers
  thought deserved illumination; a room lit for work reads different from a room lit
  for judgment [BIV §6].
- **The inhabited island:** furniture as isolated islands in monumental volume,
  arranged by last use, chairs angled to dead conversations **LAW** [BIV §7]; the
  island's edge is the room's most eloquent line — where habitation *stopped*.
- **The threshold record:** doors carry the room's whole social history (Edge 5.4 m /
  residential 2.2 m / Ledger 2.0 m **LAW**; hinge polish = traffic; a re-hung Sower
  door = borrowed life).

## 4.3 Room archetype library (build-sheet index) **[NEW CANON — catalog]**

*Each archetype ships as a kit recipe (dimensions from the scale table + district kit
+ 5Q dressing checklist). The library covers ~90% of campaign rooms; the remainder are
signature one-offs (§6, §12).*

**Work:** harvest station · Vault depot bay · mag-freight hall · gantry gallery ·
pump/drainage vault · Furrows rack aisle · lab partition · shop (Coil-class, warm).
**Civic:** lobby (Steelgate-class) · queue hall · archive stack · chapel (Bright Hour
niche) · columbarium wall · court bench. **Sacred:** Standing Hall nave (3 states) ·
seed vault · orchard rows. **Domestic:** arcology flat (2.2 m door, one shrine) ·
provincial kitchen (Noor-class) · nest pocket (Taproot-class) · dock shack
(June-class). **Ruin:** drowned room (tide-lined) · burned nave · collapsed span ·
stillwood clearing (build with architecture tools **LAW**). **Service:** cable
gallery · runnel walk · cage landing · crawl (≤90 s **LAW**).

---

# SECTION 5 — PLAYER GUIDANCE (THE MARKERLESS SYSTEM)

*No arrows, no pins, no minimap, no shimmer — ever **LAW**. Guidance is the
architecture doing its job. The instruments, in priority order; every navigational
decision point deploys at least TWO (redundancy law), and light never lies **LAW**.*

1. **LANDMARKS** (§6): the spine. Rule of thirds of scale: from any exploration loop,
   the chapter landmark is visible, implied by light, or audible within 60 seconds of
   wandering (the recovery lattice, LAW 0-A).
2. **LIGHTING:** warm pools promise habitation/route; the one-source law makes every
   light a sentence; guidance gradient — the critical path is, on average, 15–20%
   brighter-keyed than optional branches (subliminal, never a spotlight trail).
3. **ARCHITECTURE:** funneling by threshold sizes (bodies flow to body-doors); the
   repetition field breaks where the route turns (irregularity = information **LAW**
   [BIV §3] — a missing column, a Sower sling, damage); floor falls and drainage runnels
   literally point downhill toward circulation cores.
4. **COLOR:** the ration as compass — amber = Edge operations (danger/wages), the
   single hand-painted green line = Sower routes (the literal painted line along
   borrowed structure is the resistance's own wayfinding — diegetic, sparse, earned),
   paper = Ledger presence. Color guidance obeys the frame budget (green ≤10% **LAW**).
5. **SOUND:** beacons with fiction — the Registry's nib-scratch two corridors early;
   Vault depots' breathing amber pulse (12/min) audible as hum; the protected thing's
   voice during covenants; wind direction at broken panes. One sound beacon per major
   space **LAW** (the audio one-idea law applied to navigation).
6. **MOVEMENT:** the world's own motion is rationed (stillness is the rest state), so
   any authored motion — dust in a blade, a swinging cable, water without wakes
   disturbed — is a pointing finger. Spend it like green.
7. **SCALE:** the monumental → threshold → pocket sequence is itself directional; the
   player learns that thresholds lead SOMEWHERE and pockets end; scale rhythm is the
   route's punctuation.
8. **SIGHTLINES:** incompleteness at the edges **LAW** [BIV.5 §4] — doors ajar at
   colonnade ends, light from unlisted floors; every major space frames its exit as a
   question and one non-exit as a temptation (the visible-inaccessible ration).
9. **SILHOUETTES:** route-critical objects read as shapes at distance (the cage gate's
   gallows-frame, the Hall's aperture lantern, a viaduct stair's zigzag); silhouette
   library is shared with the GN (the book teaches the shapes; the world pays them
   off).
10. **NATURAL CURIOSITY:** the desire-line system — worn paths, chalk marginalia,
    barter-cache stubs record where PEOPLE went; following humanity's residue is
    always a valid navigation strategy in a world about what humans left behind.

**Guidance QA:** the New Player Compass Test — five fresh testers per chapter; if two
or more stall (stuck state, §0.4) at the same point, the space is re-lit or re-built;
the HUD never rescues a failed space **LAW** [B0 §10].

---

# SECTION 6 — LANDMARK DESIGN

## 6.1 The five-slot law

Every chapter carries five authored landmark experiences **LAW**: one iconic skyline ·
one impossible structure (impossible in scale or state, never in physics **LAW** [Lock
§3.1]) · one memorable vista · one emotional location · one unforgettable reveal. The
slots may overlap in a single place at most once per chapter.

## 6.2 The landmark register **[NEW CANON — assignments]**

| Ch | Iconic skyline | Impossible structure | Memorable vista | Emotional location | Unforgettable reveal |
|---|---|---|---|---|---|
| P | floodlight masts over living canopy | the D-2 at rest (building-sized tool) | moonlit canopy from the ridge road | the permit terminal kiosk | the cascade — the forest going grey in one wave |
| 1 | the dead viaduct striding the Belt | stillwood cathedral (a forest that is a building) | grey-noon horizon, dead-straight | the nest's lamplit warren | dawn over the banked sapling (40 s, no UI) |
| 2 | grey hills over the orchard | the deconsecrated wing (stillwooded grave-trees indoors) | orchard rows from the Hall's aperture | Sela's ledger desk | the 2.0 m door onto one tree in one light |
| 3 | Cadence across the water at dusk-lamp hour (the FIRST skyline **LAW** [BIV.5 §10]) | a drowned suburb legible under clear water | tide-market roofscape at low water | June's dock | the Vaults opened in the nest (teal on faces) |
| 4 | the Furrows' glass roofline to the horizon | one kilometer of interior (the far-wall minute) | the observation catwalk over abundance | the tomato plant in the duct | the flat-light wrongness itself |
| 5 | Halden's Ford's grain elevator over stillwood **[NEW CANON — the town's anomalous vertical]** | the regrowth acre (life where life is impossible) | the cordon from the ridge — his own memory at 200 m | Noor's kitchen | the acre — WONDER₁, the color event |
| 6 | the Hall burning under night hills (amber only) | the orchard alight — trees of names on fire | the colonnade in smoke-dusk | the seed vault, held | Sela's route — the level's own geometry becomes the grief |
| 7 | Cadence's working skyline from the commission's raw crown | the unfinished nave (the style's skeleton shown once) | the deep-pour dark by lantern beam | the grave of the one surviving sapling | the commission's drafting wing — corrections nailed over originals |
| 8 | Charge Day: the skyline as temple (striplight liturgy) | the Registry (a building made of paper mass) | the laundry-line balcony at festival dusk | June's speaker-rig dock | the cartridge on real air — the city listens |
| 9 | Steelgate filling the frame at last (3 chapters of approach paid) | the etched chart, floor-to-ceiling | the lobby wide — arena before boss | the locker with the child's tree drawing | the chart FALLING — the graph kills its god's bodyguard |
| 10 | none — the chapter has no sky **LAW** (its "skyline" is the shaft's mouth receding) | the inverted Standing Hall | the descent's 1,100 m in one GN panel | the parish ledger on the desk | descending INTO light — the only downward reveal |
| E | the valley under golden hour (the game's one warm sun **LAW**) | one green valley in a grey continent | the valley from the tree line | the seedling's planting spot | June lowering the recorder |

## 6.3 Landmark engineering rules

Persistence: a landmark established in a chapter appears in at least one later sightline
(Steelgate's three-chapter approach is the model: first as skyline anomaly in Ch.3's
first-skyline vista, again over Charge Day, then arrival). Silhouette first: every
landmark reads as pure shape at its greatest viewing distance (fog-plane test at 3
depths **LAW** [BIV §2]). Naming: landmarks are never labeled — the player names them,
which is the point; the journal sketches what the player has seen (Book V §8.6).
Reveals: per the locked grammar, never in motion, never timed out, input never stolen
**LAW**.


---

# SECTION 7 — EXPLORATION (THE LEVEL-SIDE SPECIFICATION)

*System law is Book V §8 (binding). This section specifies what level designers BUILD.*

## 7.1 Hidden paths

Grammar: hidden = *unlabeled*, never invisible. Every hidden path is discoverable by
one of the four attention channels (light asymmetry · wear evidence · Chargehand ·
sound asymmetry) and confirmable by a second **LAW** (the redundancy law, §5). Types:
Sower slings (green line stubs at anchor points), Mulcher tide-caches (chain polish on
one cleat among fifty), pre-Accord service voids (hand-boarded formwork inside Accord
ribbon walls — the date-junction IS the door), maintenance galleries (drainage falls
lead to them). Budget: 2–4 hidden paths per chapter; at least one connects exploration
loops laterally (reward = route), at least one is pure understanding (reward = a room
that answers a question the chapter raised).

## 7.2 Optional lore & the optional-door registry

The campaign's authored optional doors (canon, BII §XVI — they gate epilogue texture
only **LAW**): **Noor's door** (Ch.5 — the kitchen, the unreadable ledger kept
anyway); **June's second listen** (Ch.8 — the dock rig); **Verge's drawings** (Ch.7 —
the drafting wing's corrections). Level law for all three: placed OFF the spine within
sight of it; entered through human-scaled thresholds (these are the anti-monuments);
zero combat within their bubble; their interiors are the game's densest 5% dressing.
Beyond the registry: every chapter carries 4–8 lore placements per the collectible
classes (Book V §8.7), each placed where its document would actually live **LAW**
(manifests at docks, registers in chapels, memo drafts in the lab partition).

## 7.3 Observation decks

One per chapter minimum, doubling as rest-class or vista-class space: the Furrows
catwalk (abundance contemplated in safety [BIV.5 §9]), the laundry balcony, the
commission's crown, the shaft-head catwalk, June's dock. Build spec: protected
approach, one bench-class prop, the chapter landmark centered in the natural frame,
one journal-annotation trigger (the sketch). No tower-synchronize mechanics **LAW**
[Book V §8.6].

## 7.4 Architecture rewards & secret rooms

The reward hierarchy applied spatially: the best secrets in this game are ROOMS THAT
EXPLAIN — the ranger tower with its continuous logbook; the viaduct's construction
bothy (the Accord's workers lived here while pouring the thing that killed the town —
find their wall of family photos); the Bright Hour chapel's back room where a
registrar did the arithmetic (his abandoned abacus, his neat resignation). Secret
rooms are historical annexes, never treasure closets **LAW**; materiel appears in them
only as the residue of the person who was there.

## 7.5 Collectibles & backtracking rewards

Placement follows habitation logic (documents live where filed; June's labels cluster
at docks and markets; GN loose pages hide where readers hid them — under floor plates,
inside Vault cradles, behind the columbarium's niches). The three authored returns
(§1.7) each carry one return-only discovery **LAW**: the Hall's fire-order evidence
(Ch.7, in the ruin), the cordon's two impossible sightlines (Ch.5 — the GN-artist
thread, placed but never labeled [Lock §19.1]), the watershed's first seedlings (E).

---

# SECTION 8 — COMBAT SPACES

*Enemy design is Books II.5/III; system contracts are V-6 (binding). This section is
the spatial recipe book.*

## 8.1 Arena proportions

Per the encounter classes (Book V §6.3), with level-design deltas: covenant arenas are
**radial** (defended center ≤ 25 m radius, approach lanes at 3–5 points of the
compass, defender-favoring cover ring at 8–12 m from center); procedure arenas are
**linear-with-loops** (patrol routes the player reads and enters at a chosen phase);
duel and machine arenas are **signature spaces** (§12). All arenas sit under something
enormous **LAW** and keep their scars **LAW**.

## 8.2 Cover

Cover is architecture being itself: pour-fins, plinth barriers, Vault cradles, freight,
counterweights — never crates-from-nowhere **LAW** (every cover object answers 5Q-2:
why is it here?). Height grammar: knee (1.0 m — lean-fire), chest (1.4 m — the
standard), full (fin/column — movement cover). Density: covenant rings 1 cover
element / 6–8 m of arc; procedure spaces cover-rich along patrol walls and cover-poor
across watched floors (the risk is legible). Destructibility per material honesty
**LAW** [Book V §3.7]: canvas and crate yield; the pour does not.

## 8.3 The three covenant archetypes **[NEW CANON — arena patterns]**

- **A "The Acre"** (radial green): a living/planted center in open monumental volume;
  the green unit at center; sightlines long, cover ring modest — the tension is
  exposure bought for position. (Ch.1; Standing Watch pages: stillwood cordon,
  parish orchard.)
- **B "The Dock"** (linear exfil): a throughput objective moving along a line (book
  carts, seed crates, evacuees); the player defends a corridor's flanks in sequence;
  arenas re-form at each choke. (Ch.4 exfil; Ch.6 evacuation; Standing Watch tide
  yard.)
- **C "The Vault Yard"** (asymmetric hazard): objective amid environmental hazards
  (Vault rupture blooms, tide gates, freight movement); the arena itself is a
  third combatant the player can read and use. (Ch.9 approach; Standing Watch depot.)

## 8.4 Sightlines

Every arena publishes its information before its danger **LAW** (fear is
comprehension): one overlook or approach vantage from which the whole arena's shape
reads (the pre-fight Read spot — Book V §3.9's preparation beat made spatial); firing
lanes follow the architecture's own axes (colonnade bays, rack aisles, causeway
lines); no 360° soup — arenas have a *grain*, and fighting with or against the grain
is the tactical choice.

## 8.5 Vertical combat, flanking, escape

Per V-6 **LAW**: ≥3 approach lanes, ≥1 player-ownable flank (sling, gantry, freight
top — reachable in ≤20 s from the arena's natural cover ring), ≥1 no-dead-end retreat
lane. Enemy verticality is staged honestly (stairs, lifts, drop-lines — watchable
arrivals **LAW**). Escape lanes double as the covenant's vulnerability: the lane the
player retreats through is a lane the wave can enter — the geometry itself teaches
that leaving the center costs.

## 8.6 Environmental hazards & destructibles

Hazards are labor honesty (Vault yards are dangerous because Vaults are — teal lines
and red latches say so; tide gates drown on schedule the water line announces;
freight moves where rails run). Player-usable levers (counterweights, gate releases,
foam lanes via the seed-thrower) are placed at read-route discoverable positions.
**LAW:** hazards obey the moral bounds (machines/materiel/combatants only [Lock
§3.16]); no explosive-barrel grammar — this world's red containers are Devastator
liveries, not fuel cans [B0 §2.7].

## 8.7 Movement flow

Arena floors are choreography: the cover ring's gaps align with sprint distances
(8–14 m dashes — one stamina commitment per reposition [Book V §2.4]); slide arrivals
have destinations (cover ends where a slide ends); carry-verbs get protected seams
(the book-cart line hugs the colonnade's blind side). Playtest instrument: heatmaps
must show orbit-and-spoke movement in covenants (players circling the center,
sallying outward) — if they show wall-hugging, the center has failed and gets
re-staged.

---

# SECTION 9 — PUZZLE SPACES

*Puzzle system law is Book V §9 (classes, fairness, no-HUD-timers). This section
designs the SPACES. Every puzzle is the architecture being exactly what it is.*

- **Architectural puzzle spaces:** the date-junction door (find the pre-Accord void by
  reading formwork); the load-path gate (which of three spans still carries weight —
  read the haunches, the spall, the rebar); the Accord addition that sealed the
  original circulation (the older building remembers its own doors — follow the worn
  thresholds behind the new wall). Space spec: the evidence is on the walls of the
  SAME room **LAW** [Book V 9-A]; sightline from puzzle to evidence wherever possible.
- **Environmental puzzle spaces:** the drip that shouldn't exist (roof route above);
  the wind with texture (a living pocket beyond — Ch.5's approach to the acre); dust
  wedges pointing to the sealed vent; tide-line wrack marking the safe causeway hour.
- **Traversal puzzle spaces:** laden route-craft (carry the green unit through a
  gantry maze — weight notches close options and the space must offer the freight
  answer); sling-sequence ascents (anchor points readable from below **LAW**); the
  tide window (cross the drowned quarter inside one tide phase — clock on the walls,
  water line rising visibly).
- **Mechanical puzzle spaces:** counterweight re-hangs (the freight cage's dead
  counterweight must be re-loaded with Vault mass — the room supplies cradle, rail,
  and visible balance arithmetic); gate-timing (mag-freight passes on schedule; ride
  the schedule); Verge's site lift (power it by hand-crank relay — the effort is the
  point [hope is manual]).
- **Memory puzzle spaces:** the parish ledger cross-read (R3 — match hands across two
  documents found meters apart; the room stages both under one lamp **LAW** [Lock
  §20.4: environmental, never announced]); Pale's duplicate-book reconciliation
  (Ch.8: find the three-entry discrepancy that IS the Wardenry schedule — the puzzle
  teaches what the Registry is FOR).
- **Technology puzzle spaces:** the permit terminal reprise (Ch.4/Ch.9: Asher's
  form-language opens Edge doors — the tutorial's grammar re-priced, staged at
  terminals whose worn keys spell the frequent fields); Vault charge-sequencing
  (power a dead district's gate from a carried Vault — teal lines animate the route
  as the charge flows [flows, never arcs **LAW**]).

**Placement law:** one puzzle-anchored space per chapter minimum (§3.6); puzzle spaces
are QUIET (no combat may intersect an unsolved puzzle's bubble **LAW**) — reading
under fire is for the Assessor's Read in arenas, not for puzzles.

---

# SECTION 10 — SAFE SPACES

*The locked shelter ration: one true rest per chapter, always AFTER the peak **LAW**
[B0 §2.16; BIV.5 §9]. Book V §8.8 defines shelter systems (bench, leaf, cache,
heat/water, conversation set, one hope-verb). This section builds them.*

## 10.1 The rules of the safe room

1. **The promise is absolute:** no enemy may enter, no objective may intrude, no timer
   may run **LAW** [Book V 8-A]. The single franchise exception is the Standing Hall
   raid (Ch.6) — the war breaking the promise IS the story [Lock §3.13], and it may
   never happen again.
2. **Body-scaled:** shelters live in the pocket band (2.4–3.2 m) — the only spaces
   built to the human datum; crossing their threshold is felt in the ceiling.
3. **One warm source:** lamp, stove, lantern — the light-idea is warmth (religious/
   domestic registers [BIV §6]); shelter is where the palette's warmth concentrates.
4. **Sound floor:** the mix drops to hearth register (fire tick, kettle, pages, rain
   on the roof of THIS room); the world's pressure audibly outside.
5. **Dressed to 5Q at maximum density:** shelters are the game's most humane rooms —
   whose kettle, whose blanket, whose letters.

## 10.2 The shelter register (build sheets)

**Taproot nest (Ch.1, recurring):** viaduct interior; seed-packet letters papering the
walls; Mara's crate desk; Coil's bench (sparks, warm); the seedling's windowsill
niche. **Sela's reading bench (Ch.2):** the nave's lamp pool; pew-shine; the ledger
desk — the archetypal "library" shelter. **June's dock (Ch.3, Ch.8):** lamp-hour
water; the cartridge-label wall; a kettle on a brazier. **Furrows catwalk (Ch.4):**
the exception that proves the rule — a shelter with a VIEW of wrongness; rest as
vantage (§7.3). **Noor's kitchen (Ch.5, optional):** the game's warmest room —
bread, the unreadable ledger, four chairs for one resident. **[Ch.6: none — deleted
shelter **LAW**.]** **Verge's drafting wing (Ch.7):** drawings, lantern, his bed in
the unfinished nave — shelter inside the style's skeleton. **The laundry balcony
(Ch.8):** domestic monumental — lines between fins, festival light below.
**Shaft-head catwalk (Ch.9):** the quietest shelter — coffee gone cold in Voss's
tower above, the cage waiting; rest as threshold. **The valley (E):** the whole
chapter as shelter — the ration inverted.

## 10.3 Why players rest here (the design answer)

Because the game makes rest *productive of meaning*: progression actions are gated
into rests (Book V §1.2.4), conversations deepen only here (hidden mid-life scenes
[BIV.5 §7]), and the hope-verb (watering, mending, grafting) pays in nothing but
feeling **LAW** — which, in a game about keeping losses felt, is the true currency.
Libraries, gardens, archives, balconies, abandoned apartments — every shelter class
answers the same brief: a room where the world's account is, briefly, in credit.

---

# SECTION 11 — TRANSITIONS

*Never a loading screen as an emotional break **LAW** — the player never reads
"LOADING." Every transition is authored space-time.*

- **Between districts:** ride, walk, or descend — the Amber Line freight seams
  (hidden-cargo rides: 40–90 s, readable manifests, streaming behind the car walls),
  tide causeways (the water clock as pacing), the viaduct decks. Rule: district
  transitions carry a *palette handover* — the grade LUT crossfades over the seam's
  duration [BIV §5 scripts], so the player FEELS the district change before they see
  its first landmark.
- **Between buildings:** thresholds with compression (35 mm law); porches, gatehouses,
  and door-furniture do the work; weather/audio handover at the jamb (interior
  pressure change is audible **LAW** — the mix is the door).
- **Between floors:** cages, gantry stairs, sling drops (§1.3); streaming valves; the
  rule of descent-asymmetry (§1.3) holds.
- **Into bosses:** arena before boss **LAW** — the transition INTO a boss space is
  always a return or an overlook-first entry; the player walks INTO a room they
  already understand and the threat enters second [BIV-QR §9].
- **Into cutscenes:** control surrendered on the player's motion, never on a cut
  (environmental cutscenes preferred [BIV.5 §15]); control returns before the fade
  **LAW** — the world resumes before the feeling does.
- **Into GN pages:** the four empty bars precede **LAW** (also the preload window
  [Book V §19.4]); entry by shape-match (the last gameplay frame's dominant shape
  becomes the first panel's **LAW** [BIV §10]); exit likewise — form-matching both
  directions so time-crossing is felt, not cut.
- **Into major reveals:** threshold compression → the held wide → the player's input
  first **LAW**; reveals never in motion; sprint damped to run inside signature
  thresholds [Book V §2.4].

---

# SECTION 12 — BOSS ARENAS (BUILD DOCUMENTS)

*Bosses are locked (Lock §16; BII §XIII; system contract Book V §7). These are the
FOUR ROOMS. Lighting schemes are locked [BIV-QR §6]; music triggers keyed to phase
boundaries (score enters only after meaning completes **LAW**).*

## 12.1 Universal arena laws

Signature-space class (60–120 m) **LAW**; revealed before the boss **LAW**; V-6
contract holds even in boss spaces (lanes/flank/retreat); checkpoint geometry at
entry + phase boundaries [Book V 7-A]; the arena keeps its scar in ALL subsequent
states **LAW**; cutscene staging uses the arena's own camera geography (no teleport
staging).

## 12.2 The 2068 cordon + regrowth acre (D-2, Ch.5)

**Architecture:** stillwood cathedral (trunks-as-columns, 20–30 m canopy coffer) with
the living acre breaching it — a hard color boundary the arena FIGHTS ACROSS.
**Scale:** ~90 × 70 m playspace; the acre ~25 m radius at one focus (radial archetype
A inverted — the machine defends, the player attacks [BII §XIII]). **Traversal:**
fallen-trunk causeways (the only "cover that was alive"); the old cordon road as the
grain. **Sightlines:** long lanes down colonnade rows; the acre's green is
back-light for phase 3's close work. **Hazards:** venting capacitors (phase 3 —
concussive blooms, telegraphed by teal line-glow). **Lighting:** spotlight
classification glare (the machine's own light is the scheme — the player is lit BY
the boss **LAW**). **Music triggers:** phase 1 none (servo grammar only); phase 2 =
the report reading (barks ride the band — no score under it **LAW**); phase 3
percussion (sampled Converter clicks). **Cutscene staging:** none in-arena; the
standing-apart scene uses the wreck as its set — camera lock-off across the venting
machine, Mara and Asher on opposite sides of frame **LAW** [BII]. **Positioning:**
entry from the ridge overlook (the Read spot — the player sees their own memory's
geometry before entering it).

## 12.3 The Standing Hall colonnade (Harrow, Ch.6)

**Architecture:** the Hall's exterior colonnade — twin pillar ranks (8–12 m spacing,
metronomic) framing a 60 m processional, the burning orchard as backdrop (amber-only
**LAW**). **Scale:** deliberately the smallest boss space (duel class): 60 × 25 m.
**Traversal:** pillar-to-pillar; no verticality — the duel is flat, formal,
honor-structured [BII §XIII]. **Sightlines:** the colonnade's grain IS the fight;
crossing the open nave axis is the risk verb. **Hazards:** collapsing orchard brands
(ember-fall zones, telegraphed by roof-light). **Lighting:** smoke-dusk — the scheme
where the game's shadow discipline peaks (40–60% readable shadow in FIRELIGHT).
**Music:** one snare, decelerating **LAW** [B0 §12]; silence at her resignation.
**Cutscene staging:** the altar-stump sidearm-emptying is in-engine at the nave's
axis — the camera the colonnade built (symmetry she has earned; she authored a
creed). **Positioning:** she initiates at the processional's far end — the player
walks INTO an honor structure and understands it wordlessly.

## 12.4 The Steelgate lobby (D-3000, Ch.9)

**Architecture:** the corporate cathedral [BIV §14.8]: 100 × 60 × 60 m; the etched
2038 chart floor-to-ceiling on the far wall; mirror floor (power doubled — and the
fight wrecks the reflection first, a readable escalation). **Scale:** the game's
largest interior arena. **Traversal:** monumental furniture as cover archipelago
(queue plinths, reception masses); service galleries at +12 m (the ownable flank);
freight gates at grade. **Sightlines:** the chart dominates every lane — the arena's
grain aims AT it (the player is always fighting toward the graph). **Hazards:**
falling spall (plate-fragments with rebar stubs **LAW**), the machine's own
harvest-array sweeps (lane denial). **The rig:** three anchor stations (readable via
Read) rig the chart slab — the player's demolition is prepared DURING the fight
(environmental interaction as decisive verb [Book V §7.1.5]). **Lighting:** daylight
blade through the entry aperture + red permitted (the D-3000's dominance [BIV §5]).
**Music:** the game's only full orchestra, cut dead at the collapse **LAW**.
**Cutscene staging:** Voss's walk-in uses the lobby's ruined axis; the coffee, the
HVAC, no score **LAW**; the refusal door is the lobby's far service exit — pushed.
**Positioning:** entry via the overlook mezzanine (arena read first), descent to
floor by the grand stair the architecture always intended.

## 12.5 The Evergreen chamber (the Array, Ch.10)

**Architecture:** the inverted Standing Hall **LAW** [Lock §11]: nave proportions at
signature scale (80 × 40 × 60 m), aperture DOWN, light rising; the array where the
altar-tree should stand; the carved sentence above the governor rail. **Scale:**
vast but *legible* — the player must be able to almost-agree with the room.
**Traversal:** descending gallery rings (the fight moves DOWN through station
levels); the governor at the nave's focus. **Sightlines:** every ring frames the
array; Grimwood visible at his rail throughout (heard before seen on approach
**LAW**; never targetable **LAW** [Lock §20.5]). **Hazards:** intake scheduling
(station activations sweep rings on the docent's calm countdowns — the schedule IS
the boss [Book V §7]). **Lighting:** lit-from-below white → the sanctioned green
flood at reversal **LAW** — the game's single chromatic release, and the LEVEL
delivers it (every surface calibrated for the flood's read). **Music:** the hymn at
Grimwood's tempo, resolving true only at polarity flip **LAW**. **Cutscene staging:**
none at the governor — the held input IS the cinematic **LAW**; the camera dollies
lever → face → aperture during the ten seconds [BII §X]. **Positioning:** the player
enters from ABOVE and descends into light — the only downward reveal in the game
**LAW**, the theology in one camera move.


---

# SECTION 13 — ENVIRONMENTAL STORYTELLING (THE DRESSING SPECIFICATION)

*Nothing requires dialogue **LAW**. The rules of evidence are BIV §7 (binding); the
per-chapter load-bearing details are BII §XII (binding). This section turns both into
placement law for dressers, by channel.*

- **Objects:** every hero prop placed at maximum fidelity where its story happened
  (the permit terminal, Sela's volumes, Verge's lantern, June's recorder, the
  governor lever [BIV §9]); every minor object passes 5Q-2 (why HERE). One-per-room
  rule: each dressed room owns ONE object that carries its whole story if the player
  reads nothing else — the anchor object, named in the room's build sheet.
- **Furniture:** islands by last use **LAW**; chairs angled to dead conversations;
  over-provisioned civic ranks for absent crowds; benches carry name-etch memorials.
- **Machines:** die mid-task, cannibalized in part-value order **LAW**; drip fans
  under berths; a cored Converter husk = a Mulcher visit, legibly.
- **Architecture:** the palimpsest law (two eras per lingered surface **LAW**);
  date-junctions at every retrofit; ideology in section, everywhere (§0.2.3).
- **Documents:** placed where filed **LAW**; facsimile-real in the Registry drawer;
  redactions are Steelgate's dressing voice (what the frame omits is Edge's
  fingerprint [Lock §14]).
- **Lighting:** dead fixtures left in place (budget story **LAW** [BIV-QR §8]); a
  re-lamped socket in a dead district = somebody still comes here (Noor's grammar).
- **Damage:** load-path-true collapse; spall plates with rebar stubs; violence leaves
  procedure (cordon/tags/serials — the 2068 grammar) **LAW**.
- **Nature:** biology is the rarest material **LAW** — every green placement is plot;
  dead-lichen lace on provincial pours (even the moss is stillwooded); the
  unauthorized tomato plant class of detail: one tended impossible thing per act.
- **Dust:** wind-shadow wedges; removal ghosts (the shape of what was taken is the
  sentence); footfall records in undisturbed rooms — the player's OWN trail persists
  per world-ledger (their re-visit reads their first visit).
- **Water:** intrusion maps roof failure; tended dryness maps care; the tide writes
  Driftmark's clock on every wall; mirror-water at thresholds of revelation only
  **LAW**.
- **Sound:** rooms carry their occupancy history in reverb (emptied rooms ring;
  papered nests damp); one sound-anachronism per chapter as a findable story (a
  generator running in a dead town = Noor-class presence).
- **Weather:** grey noon default; rain as coastal intrusion event only **LAW**;
  interior leaks on cue; the Belt's stillness must be VISIBLE (hanging particulate,
  wakeless water **LAW** [B0 §6]).
- **Memorials:** every district ≥1 folk memorial + ≥1 managed memorial; their contrast
  is the standing essay **LAW** [BIV §7]; pressed-leaf reliquaries in every civic
  lobby (labeled like relics: *QUERCUS ALBA, WITHDRAWN 2051*).
- **Statues:** the Accord builds infrastructure, not figures **LAW**; pre-Accord
  plinths stand empty or repurposed; the plinth-holding-a-Vault political cartoon is
  spent ONCE, in the Belt, Ch.1 **[NEW CANON — placement]**.

---

# SECTION 14 — LEVEL PACING (THE PER-LEVEL RHYTHM)

*Chapter-scale pacing is §2 and the budgets. This section is the INTERNAL rhythm
template every level must set to its own chapter's key.*

**The eight-beat bar:** ENTRY TENSION (the threshold's compression — 1–3 min;
curiosity load HIGH, pressure LOW) → EXPLORATION (the body's first loop — 8–15 min;
discoveries at the 90-second attention cadence) → DISCOVERY (the chapter's first
understanding-payoff — a room that answers; 2–4 min) → COMBAT (placed where the story
bleeds — 3–12 min per the chapter's dial) → RECOVERY (post-combat aftermath + a
pocket breath — 2–4 min **LAW**: every combat block borders a breath) → [BOSS (per
§12 — Ch.5/6/9/10 only)] → REFLECTION (the shelter — 3–6 min, after the peak **LAW**)
→ EXIT (decompression seam — 1–2 min, carrying cost).

**Per-chapter rhythm keys** (dominant beat lengthened, per the emotion rows): P
compresses EXPLORATION (procedure fills it); Ch.1 doubles EXPLORATION; Ch.2 doubles
DISCOVERY; Ch.3 doubles EXPLORATION with market loops; Ch.4 runs DISCOVERY→COMBAT
back-to-back (the memo then the exfil); Ch.5 doubles ENTRY TENSION (the homecoming
walk is the longest approach in the game) and detonates at BOSS; Ch.6 inverts —
COMBAT opens (evacuation in progress) and REFLECTION is deleted with the shelter
**LAW**; Ch.7 is REFLECTION as the whole bar (the rite) then EXPLORATION (recon);
Ch.8 triples EXPLORATION (three threads); Ch.9 sustains COMBAT to the 12:00 ceiling
then hard-cuts to the quietest RECOVERY in the game (the office); Ch.10 runs
DISCOVERY (antechamber) → BOSS → the held ten seconds as the campaign's final
"combat"; E is REFLECTION entire.

**Tension audit instrument:** every level ships a tension graph (designer-drawn, then
telemetry-verified): the line must never flatline >20 min **LAW** [Book V §15.5] and
never spike twice without a designed breath between **LAW**.

---

# SECTION 15 — WORLD CONSISTENCY

*How every district belongs to one civilization; no area may feel disconnected.*

1. **One structural DNA:** everything descends from the Poured Tradition — the same
   board-form grammar from a provincial floodgate (1700s lime pour) to Steelgate's
   machine ribbon; districts differ in BUDGET and ERA, never in species **LAW**. The
   dating system (hand-board → early Accord → machine ribbon) is one continuous
   technology the player learns once and reads everywhere.
2. **One infrastructure logic:** charge flows from Concessions (harvest) → Vault
   depots → mag-freight (the Amber Line) → arcology grid; water falls, drains, and is
   fought (runnels everywhere); every district shows its position in that flow
   (organ-pipe gantries aim DOWN at forests; depots breathe; the arcology glows).
   An environment artist can answer, for any prop: *what does this feed?* **LAW**
   [BIV §9 cables rule, generalized].
3. **Evolution, not variety:** district kits are one grammar under different
   pressures — Steelgate is the Hall's proportions with a corporate budget and no
   humility door; the Furrows are the nave glazed; the stillwood is the turbine hall
   grown [the rhyme **LAW**]. Adjacent districts share a boundary condition built as
   its own micro-space (viaduct pier towns; the tide-line where Driftmark's timber
   meets drowned Accord pour; the Furrows' fence where corporate green stops DEAD).
4. **Engineering sense audits:** every blockout answers gravity (load paths
   sketchable **LAW**), water (falls and drains), access (how was it built — crane
   pads, formwork scars; how is it maintained — gantries, ladders), and logistics
   (what arrived by which gauge of door). The commission (Ch.7) is the audit's
   teaching aid: the style shown mid-construction, once **LAW**.
5. **The one-civilization test:** swap-test any room into another district — if it
   fits without re-dressing, it lacks district identity; if it couldn't ONLY be this
   civilization's, it fails the one-frame test and returns [B0 §14.5].

---

# SECTION 16 — UNREAL ENGINE 5 IMPLEMENTATION

*Extends BIV §15 (binding posture: UE5 is the stated Phase B production target,
confirmed at Sprint 0; every principle engine-portable; Phase A web build streams the
same level organization [Book V §0.5]). No code — organization and strategy only.*

- **World Partition strategy:** one persistent world per CHAPTER (chapters are
  streaming worlds, §1.9), partitioned by district cell grid (cell size ~128 m in
  exteriors, per-room granularity indoors via Level Instances); Data Layers per
  world-state (the Hall's three states; pre/post-scar arenas; epilogue variants) —
  state flips are data-layer swaps, never duplicate maps **LAW**.
- **Streaming:** seams at thresholds/cages/freight rides (§11); GN pages and the four
  bars as guaranteed preload windows; HLODs for Belt distances and skyline landmarks
  (the persistent-silhouette law needs far-field impostors that MATCH the hero
  silhouettes — landmark HLODs are art-reviewed, not auto-only **LAW**).
- **Level organization & naming [NEW CANON — conventions]:**
  `EOE_CH<nn>_<District>_<Function>` for sub-levels (e.g. `EOE_CH06_HALL_ARENA`,
  `EOE_CH03_DRIFT_MARKET`); Data Layers `DL_<state>` (`DL_BURNED`, `DL_EPILOGUE`);
  arenas suffix `_ARENA`, shelters `_REST`, reveals `_REVEAL`; the master doc maps
  every §2 chapter entry to its level set — one row per twelve-part anatomy slot
  (§3), so production tracks anatomy coverage per chapter.
- **Reusable modular kits:** the Gravity mega-kit (20–30 pour modules, 8–12 gantry
  [BIV §15]) + per-district dress kits (12 [BIV §8]) + the room archetype recipes
  (§4.3); repetition-as-rhetoric IS instancing budget; bespoke geometry reserved for
  hero props, boss arenas, and the five-slot landmarks **LAW**.
- **Performance zones:** budget by camera dwell — hero density at reveals, shelters,
  and arenas (where the camera lingers per the cadence); corridor/connective space
  runs kit-only; the ration is the perf plan (few lights, one volumetric idea, grey
  discipline compresses).
- **Lighting strategy:** Lumen with manual EV anchors per district **LAW** (no
  auto-exposure drift [BIV §15]); one-source law = emissive apertures + GI; VSM
  high-res pages on aperture blades; boss schemes as lighting scenarios swapped at
  phase boundaries.
- **Occlusion:** the style is occlusion-friendly (massive walls, threshold funnels);
  design REQUIREMENT: thresholds double as occlusion portals — never build a
  signature space visible from another signature space except the authored skyline
  sightlines (which get impostors).
- **Optimization:** 60 fps target with the governor fallback [BIV §15]; Phase A
  (web) mirrors the same chapter/sub-level organization at reduced asset tiers —
  the level ORGANIZATION is engine-portable canon; only asset fidelity forks.

---

# SECTION 17 — QUALITY CONTROL (THE 100 VALIDATION QUESTIONS)

*Run per space at blockout, dress, and ship. Any wrong answer = revise; questions
marked ⊗ are stop-ship.*

**Purpose & belonging (1–10)**
1. Does this space have a historical cause you can state in one sentence? ⊗
2. Could this room exist in another game unchanged? *(yes = redesign)* ⊗
3. Does it serve the chapter's purpose and emotion rows (§2)?
4. Does it pass the one-frame test (pour/ration/tenant)? ⊗
5. Is anything here only because it looks cool? *(yes = redesign)*
6. Does it deepen the record or merely occupy acreage?
7. Would Sela sign this room's entry?
8. Does it keep the losses felt? ⊗
9. Can you caption it with a story reason without the word "cool"?
10. Does it need a logo, marker, or monologue to work? *(yes = redesign)* ⊗

**Anatomy & structure (11–22)**
11. Are all twelve blueprint parts present or excepted with cause (§3)?
12. Entrance a true threshold with compression?
13. Introduction space combat-free?
14. Landmark established in the first wide?
15. Monumental → threshold → pocket sequence held? ⊗
16. Never two pockets adjacent / three monuments unrelieved?
17. Critical path walkable with zero Read tiers? ⊗
18. Ceilings/doors/pillars on the scale table (or signed)? ⊗
19. Crawls ≤ 90 s?
20. One visible-inaccessible place per major space?
21. ~60/40 split of eventually-reachable vs. forever-question honored chapter-wide?
22. Exit shorter and quieter than entrance, carrying cost?

**Guidance (23–34)**
23. Two guidance instruments at every navigational decision point? ⊗
24. Light never lies? ⊗
25. Recovery lattice present in every lost-able space (LAW 0-A)?
26. Stuck-state impossible (evidence findable from every position)?
27. Landmark visible/implied/audible within 60 s of wandering?
28. Critical-path brightness bias inside the 15–20% band (no spotlight trails)?
29. Repetition metronomic, irregularity story-caused? ⊗
30. Route-critical silhouettes readable at distance?
31. One sound beacon per major space, fiction-true?
32. Desire-lines and wear-paths converge on truth?
33. Chargehand placements glossary-legal [BI §X]?
34. Did five fresh testers pass the Compass Test?

**Room evidence (35–46)**
35. All eight questions answered in props (§4.1)? ⊗
36. Anchor object named and placed?
37. Two eras per lingering surface? ⊗
38. Formwork dates correctly (Accord vs. pre-Accord)?
39. Wear answers "what motion"?
40. Abandonment has a nameable budget reason?
41. Documentary residue placed where filed?
42. Furniture islands by last use, chairs to dead conversations?
43. Violence rendered as procedure, never gore? ⊗
44. Green placement story-earned, ≤10% of frame? ⊗
45. Red absent unless Devastator/alarm? ⊗
46. Would the room survive a 6-second hold?

**Combat & boss spaces (47–60)**
47. Camera can point at what the fight defends? ⊗
48. Arena under something enormous?
49. Lanes ≥3, ownable flank, no-dead-end retreat (V-6)? ⊗
50. Pre-fight Read vantage exists?
51. Arena grain legible (no 360° soup)?
52. Cover answers 5Q-2 (why is it here)?
53. Enemy arrivals staged and watchable? ⊗
54. Hazards labor-honest and morally bounded? ⊗
55. Heatmap shows orbit-and-spoke in covenants?
56. Scar authored for all subsequent states? ⊗
57. Arena revealed before boss? ⊗
58. Boss arena checkpoint geometry at entry + phases?
59. Locked lighting scheme built (D-2 glare / smoke-dusk / blade+red / lit-below)? ⊗
60. The protected thing audible under the fight?

**Pacing & experience (61–74)**
61. Eight-beat bar present, keyed to the chapter (§14)?
62. Every combat block borders a breath? ⊗
63. Shelter after the peak, promise absolute? ⊗
64. Ch.6's deleted shelter and Ch.7's rite honored? ⊗
65. Insignificance beat per 10 min / per arena / per chapter open? ⊗
66. Wonder budget unspent by this space (3/game)? ⊗
67. Reveal grammar held (compression → wide ≥4 s → input first)? ⊗
68. Reveals never in motion, never timed out? ⊗
69. Tension graph free of >20-min flatlines and unbreathd double peaks?
70. The two mandatory slownesses protected (rite / descent)? ⊗
71. One ≥6 s silence shot per chapter survives its frame? ⊗
72. Max continuous combat ≤12:00? ⊗
73. Puzzle bubbles combat-free?
74. Optional doors within sight of the spine, texture-only rewards?

**World consistency & technical (75–88)**
75. Load path sketchable for everything shown? ⊗
76. Water falls, drains, and intrudes correctly?
77. "What does this feed?" answerable for every service prop?
78. District kit correct (materials/light/palette/props)? ⊗
79. Boundary conditions built at district seams?
80. Swap-test failed (room could ONLY be here)?
81. One light idea per space (or documented 4:1)? ⊗
82. Manual EV anchor set; no auto-exposure drift?
83. Thresholds double as occlusion portals?
84. Landmark HLODs art-reviewed against hero silhouettes?
85. Data-layer states (not duplicate maps) for world changes?
86. Naming conventions held (§16)?
87. Streaming seams behind thresholds/cages/pages — zero visible loads? ⊗
88. Phase A tier of this space verified at 60 fps envelope?

**Canon & memory (89–100)**
89. Dates, names, glyphs match the Lock (no displacement)? ⊗
90. Boss/negotiation staging honors locked fates (Harrow lives, Voss unfought,
    Grimwood untargetable)? ⊗
91. The two-layer Amber account preserved in all cordon dressing? ⊗
92. Open questions left open (artist evidence placed, never labeled)? ⊗
93. GN shape-matches built at both crossings?
94. The chapter's five landmark slots filled (§6.2)?
95. Return-only discoveries placed at the three authored returns?
96. New canon logged in PROJECT_STATE.md? ⊗
97. The room's exit interview: can a tester name where they were in one word?
98. Can a tester DRAW the chapter's landmark from memory?
99. A year from now, which space from this chapter gets remembered — and is that
    the one you meant?
100. Does every space reinforce the philosophy — the deposition of a civilization,
     the losses kept felt? ⊗

---

# SECTION 18 — THE LEVEL DESIGN MANIFESTO

*To every level designer who joins this project after us.*

**Architecture is storytelling** because in this world it is the only witness left
standing. The people are gone or paid; the paperwork lies by omission; the feeds are
curated. But concrete cannot be edited after the pour. Every lift-line is a dated
signature, every tie-hole a confession, every worn threshold a census. When you build
a room, you are not making a container for mechanics — you are taking testimony.
Build rooms that would hold up in court.

**Empty space matters** because vacancy is the wound. The Republic owns twice what it
inhabits; the provinces emptied not by violence but by arithmetic. Every discipline
in you will itch to fill the volume — with props, with encounters, with *content*.
Resist. The emptiness IS the content. Dress the inhabited 5% with obsessive humanity
and leave the 95% disciplined, because the distance between those two numbers is the
whole story of the Accord Age.

**Scale matters** because smallness is the argument. We do not build big to impress;
we build big to *price the player's body against a civilization's convictions*. The
player must be processed by buildings, dwarfed on schedule, and then — rarely,
deliberately — handed a room with a 2.4-meter ceiling and a warm lamp, so their
nervous system learns what the world forgot: comfort is scarce, engineered, and worth
fighting for.

**Exploration matters** because attendance is the game's morality. Asher's
load-bearing guilt is an unattended funeral; the player's redemption of it is paid in
attendance — at doors that don't advance the plot, at rooms that only explain, at a
kitchen where an old woman asks four words. Every optional door you build is a chance
for the player to be present. Build them like they matter, because they are the
only currency the Ledger accepts.

**This game must never become corridor shooting** because the corridor is the enemy's
architecture. The Accord Age is itself a corridor — a long passage of sensible
decisions with no doors and the light going out behind [BI §0]. If our levels funnel
the player down decorated tubes from fight to fight, we have rebuilt the thing the
game exists to indict, and no art pass will save us. Every space must offer the
read-route, the flank, the optional door, the question at the edge of the sightline.
When in doubt, open a door in the wall and put a room behind it that answers
something.

**Every level should be remembered years later** because memory is what we are
making. Not content — *places*. A decade from now, someone who played this game will
be walking through a parking structure, or a dead mall, or a forest, and something in
the light will put them back in the stillwood, or the colonnade, or the valley — and
they will stand there for a second, feeling something they can't name. That second
is the entire point of your work. Build for it.

The five questions. The one light. The green spent like the last of it. The losses
kept felt.

If a space does that — ship it.
If it doesn't — bring the spade.

*Still here.*

---

# SECTION 19 — NEW CANON REGISTER (THIS BOOK'S ADDITIONS)

*Logged in PROJECT_STATE.md per Lock §20.20.*

1. **The four connective systems:** the Amber Line (mag-freight spine), the Viaduct
   Web, the Tide Routes, the Deep Pours (§1.2) — route names and roles.
2. **World structure model:** journey-not-hub; chapter = streaming world; the three
   authored returns (Hall / cordon / watershed) as the only cross-chapter
   backtracking (§1.7–1.8).
3. **The twelve-part level anatomy** and blueprint law VI-A (§3).
4. **The room archetype library** (§4.3).
5. **Lost-state taxonomy** (wandering/lost/stuck) + recovery lattice LAW 0-A (§0.4).
6. **The landmark five-slot law + the per-chapter landmark register** (§6),
   including Halden's Ford's grain elevator as the town's anomalous vertical.
7. **The three covenant arena archetypes** (Acre/Dock/Vault Yard) (§8.3).
8. **The shelter register build sheets**, incl. Ch.9's shaft-head catwalk (§10.2).
9. **Transition law:** no loading screens ever; palette handover at district seams;
   GN shape-match both directions (§11).
10. **Boss arena build documents** (§12) — spatial specifics within locked staging.
11. **Placement rulings:** the unfinished commission as the style's one anatomy
    lesson (Ch.7); Verge's formwork signature readable in the Evergreen shell
    (Ch.10); the plinth-holding-a-Vault cartoon spent once (Ch.1, Belt) (§2, §13).
12. **UE5 level organization & naming conventions** (`EOE_CH<nn>_<District>_
    <Function>`, Data-Layer state model) (§16).

---

*— End of BOOK VI (Level Design Bible), Edition One. New canon per §19 logged in
PROJECT_STATE.md. Loading order stands: Book 0 → Canon Lock II.5 → this book for
level design, world building, and environment disciplines (with Book IV for visual
law and Book V for system contracts). Amendments require a logged entry in
PROJECT_STATE.md.*
