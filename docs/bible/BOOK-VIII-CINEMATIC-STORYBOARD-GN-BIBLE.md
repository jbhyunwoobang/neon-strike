# ECHOES OF EDEN
## BOOK VIII — THE CINEMATIC, STORYBOARD & GRAPHIC NOVEL BIBLE
### Edition One · How the Story Is Seen · 2026

*Governed by BOOK 0 (identity) → BOOK II.5 (Canon Lock) → BOOK II (the eight locked
cinematics & seven GN sequences) → BOOK III (per-character cinematic grammar) → BOOK IV +
IV-QR (camera, GN, lighting, VFX law) → BOOK IV.5 (cutscene/GN/music experiential law) →
BOOK V (player-control contracts, GN preload) → BOOK VI (transitions, reveal staging,
boss-arena cutscene geography) → BOOK VII (boss staging & enemy animation law). Nothing
herein contradicts a previous book. This book creates no lore, changes no story, alters
no character. It defines HOW THE PLAYER SEES: every cinematic, cutscene, camera move,
shot, reveal, transition, GN sequence, memory sequence, boss introduction, ending shot,
and trailer. Where earlier books locked a rule, this book cites and choreographs it;
inventions (shot taxonomy, storyboard conventions, cutscene tables, trailer suite,
pipeline) are flagged **[NEW CANON]** and logged in PROJECT_STATE.md.*

**Audience:** film/cinematic directors, storyboard artists, camera and lighting artists,
animators, sequencer artists, graphic-novel artists, motion designers, trailer editors,
marketing, engine developers.

**Production note (user-directed, logged):** after the bible shelf, the sprints, and the
vertical slice, the first shipped deliverable is **a web link to a ~30-minute playable
slice** [Book V §0.5 Phase A]. This book's Prologue and GN-1 specifications (§4.P, §5)
ARE that slice's cinematic content — everything here is written to be buildable first
at slice scope, then extended.

**The one-sentence version of this book:** the camera is a witness, not a performer —
it arrives after the world has already spoken, holds still long enough to be trusted,
and leaves before the feeling does.

---

# SECTION 0 — CORE PHILOSOPHY

## 0.1 Why use cinematics?

Only for what gameplay cannot hold: the passage of time (GN pages — the game's memory
organ [BIV.5 §15]), the composure of icons (Sela's lamp, the orchard wide), and the
handover of meaning between chapters. Everything else stays playable **LAW** — the
governor is an interface, not a cutscene; the Returning is walked; the refusal is a
door pushed [B0 §11]. A cinematic in Eden must justify the theft of the player's
verbs with something no verb could earn. Runtime discipline is brutal **LAW**:
45–120 s, 4 minutes for the ending only [BIV.5 §15].

## 0.2 Why use silence?

Because the Quiet is the antagonist, and silence is its screen time [B0 §2.6]. Every
scene contains one silence ≥ 5 s **LAW**; every chapter holds one ≥ 6 s silence shot
that must survive its frame **LAW** [BIV §12]. Silence in this grammar is not absence
— it is *contact with the enemy*: the four empty bars before every GN page are the
franchise's bravest cue and its author's signature [BIII §14]. The editing rule:
silence wins every tie [B0 §12].

## 0.3 Why use architecture?

Because architecture is the only surviving witness [BVI §0.1] and therefore the
scene's most reliable actor. Conversations frame the architecture BETWEEN speakers
**LAW**; architecture finishes conversations **LAW** [BIV §12] — when a hard question
lands, the reply is a cut to what the space says. The camera's first loyalty is to
the room; people are its tenants (<3% in establishing shots **LAW**).

## 0.4 Why should cameras move slowly?

Because movement is rhetoric and this world's rhetoric is mass. Camera movement earns
itself **LAW** [B0 §11]: dolly = procession; handheld = inside grief only; lock-off =
icons; crane = the two descents only. A fast camera says the world is light; this
world is not light. Slow movement also keeps the player's eye doing the work —
composition over choreography, reading over riding.

## 0.5 Why should players feel tiny?

Because smallness is the argument [BVI §0.6]: megalophobia prices the player's body
against a civilization's convictions. Cinematics enforce the insignificance law
hardest — humans <3% of frame height in establishing shots **LAW**, headroom
oppression as house style **LAW** [BIV §12] — so that when a frame finally grants a
face its full warmth (the one unrationed warmth [BIV §5]), the intimacy detonates.

## 0.6 Why do environmental reveals matter more than dialogue?

Because the player asks and the world answers; nobody narrates **LAW** [B0 §2.5].
A reveal is the world answering at full volume: threshold compression → one 24 mm
wide held ≥ 4 s → the player's input first **LAW** [BIV §12]. Dialogue can be
doubted (paperwork lies); the pour cannot. The design spends reveals like green —
and never times them out **LAW**.

## 0.7 Why do graphic novels exist?

Because the resistance's own record IS the cutscene form [BI §XI]: the player reads
the banned book *Echoes of Eden* about events they lived — including, twice, small
discrepancies between what they did and what the book shows, because records are
made by people [BII §XI]. The GN is the game's memory organ: gameplay is
present-tense and continuous; pages are past-tense and held; crossing between them
is how the player feels time pass **LAW** [BIV.5 §15].

## 0.8 Why should gameplay and cinematics feel connected?

Because immersion is trust, and trust dies at seams. The rules that keep the seam
invisible: real-time in-engine only **LAW**; control surrendered on the player's
motion, never on a cut; control returns on the last visual beat, before the fade
**LAW** [BIV.5 §15]; environmental cinematics (uncut in-world camera) preferred
wherever the frame can be surrendered without a cut; GN crossings form-match shapes
both directions **LAW** [BVI §11]. The player should never be able to say exactly
when the movie started.

---

# SECTION 1 — THE CINEMATIC LANGUAGE (THE VISUAL GRAMMAR)

*The locked foundation: lens kit 24/35/50/85 spherical, no zooms **LAW**; FOV 70/74
gameplay, lens-true cinematics; shake ≤ 0.5° **LAW**; one dominant light source (4:1
documented exceptions); no lens flares **LAW** [BIV §12; B0 §13]. This section makes
the grammar operational.*

- **Camera movement:** four verbs only — dolly (procession: approaches, arrivals,
  rites), handheld (grief's interior: Ch.6's raid cinematography, Harrow's
  resignation beat — the ONLY sanctioned uses [BIII §17]), lock-off (icons: Sela,
  documents, memorials), crane (the two descents **LAW**). No orbits around
  characters, no drone-swoops, no speed ramps, ever **LAW**.
- **Camera speed:** dolly ≤ 0.5 m/s (walking reverence); pans ≤ 12°/s; tilts ≤ 8°/s
  (mass is read slowly); the single fastest camera event in the game is the D-3000
  chart-fall — and even it is a static frame the ACTION crosses.
- **Lens philosophy:** 24 mm = the world's size (reveals, architecture); 35 mm =
  the human passage (thresholds, movement, conversation coverage); 50 mm = the
  patient face (close-ups, level, unforced); 85 mm = judgment and distance (Voss
  through doorframes **LAW**). The kit is a moral scale: wider = truer to the world,
  longer = truer to power.
- **Wide shots:** open every scene that can afford one; tenant <3%; three silhouette
  depths maximum; one anomalous vertical [BIV §2].
- **Close-ups:** rationed like green — one fully-felt face per scene (the GN's
  one-rendered-face law [BIV §10] applied to cinematography); faces carry the
  unrationed warmth, so the edit spends them at the emotional apex only.
- **Negative space:** weight ABOVE figures **LAW** (headroom oppression); emptiness
  is content [BIV §1] — frames may not be filled for comfort.
- **Depth:** three planes (near frame-cutter, middle subject, far ghost in haze)
  [BIV §2 skyline law, applied to interiors via fog's 3-plane rule].
- **Scale:** the insignificance cadence binds cinematics as it binds levels **LAW**.
- **Architecture framing:** load paths legible in frame (a composition that hides
  how the building stands is a lie [BIV §3]); date-strata visible on lingered
  surfaces (two eras **LAW**).
- **Character framing:** per BIII §17's locked grammar — Asher off-center and
  wall-adjacent, no dolly toward him before Ch.7 **LAW**; Grimwood alone gets formal
  symmetry + lit-from-below + heard-before-seen **LAW**; Voss at 85 mm in doorways;
  Sela in static lamp-key at tabletop height; June at her own eyeline **LAW**; Dez
  in corridor depth, focus pulled past him to exits.
- **Symmetry:** power's default (Edge civic, Grimwood); **asymmetry:** everyone
  else's honesty — frames "breathe" for the living and are "composed" for the
  institutional [BIII §17].
- **Silence:** §0.2; placed and full — every silent frame keeps one moving thing
  (dust in a blade, water without wakes) **LAW** [B0 §7].
- **Rhythm:** cuts on meaning, never on beat; average shot length in cinematics
  6–10 s (double the genre norm, on purpose); no shot under 2 s except the three
  authored shocks (the reclassification cascade, the hand, the chart-fall)
  **[NEW CANON — the 2-second floor]**.
- **Motion vs. stillness:** stillness is the rest state; motion is spent like
  green **LAW** [BIV §1]. A moving camera and a moving subject may not share a
  frame except in combat coverage — one of them testifies, the other acts.

---

# SECTION 2 — SHOT LANGUAGE (THE OFFICIAL SHOT TAXONOMY) **[NEW CANON — taxonomy]**

*Fourteen named shots. Storyboards, sequencer files, and shot lists use these names
(naming convention §14). Fields: purpose · camera/lens · composition · lighting ·
movement · duration · music/silence · emotion.*

1. **THE POUR** (Architectural Reveal). Purpose: the world answering at full volume.
   35 mm compression through threshold → ONE 24 mm wide, held ≥ 4 s, input free
   **LAW**. Composition: tenant <3%, one anomalous vertical. Lighting: the space's
   one source at full statement. Movement: none at the wide (reveals never in
   motion **LAW**). Duration: player-governed (never times out). Music: enters
   AFTER the hold if meaning has completed; silence default. Emotion: awe-as-
   inheritance.
2. **THE TENANT** (Character Reveal). Purpose: a person priced against the world.
   Camera: 35→50 mm; the character enters an already-understood space (arena-before-
   boss law generalized to people). Composition: per BIII §17's per-character
   grammar. Duration: 6–12 s. Music: motif at barest voicing or none. Emotion:
   recognition.
3. **THE APPLIANCE** (Boss/Machine Reveal). Purpose: institutional threat made
   legible. Camera: low 35 mm from cover height (the player's tactical eye).
   Composition: machine INSIDE its infrastructure (berth, rails) or violating it
   (the acre). Lighting: the boss's locked scheme [BIV-QR §6]. Movement: lock-off;
   the machine moves, the frame does not. Duration: ≤ 15 s, then control. Music:
   none at reveal (percussion enters with phase 1). Emotion: comprehension-dread.
4. **THE PRESSED LEAF** (Memory Reveal). Purpose: the past surfacing as material.
   Camera: 50 mm lock-off on documents/strata/objects; macro patience. Lighting:
   lamplight register. Duration: player-governed (reading). Music: four bars of
   nothing, then room tone. Emotion: recognition-grief. (No memory shaders, ever
   **LAW** — memory is material [BIV §13].)
5. **THE WORKING HANDS** (Hope Shot). Purpose: hope as manual labor made visible
   **LAW** [B0 §2.15]. Camera: 50 mm on hands doing work (planting, mending,
   watering); face optional, hands mandatory. Music: the ONLY shot class where the
   score may warm **LAW**. Duration: 4–8 s. Emotion: tended hope.
6. **THE ONE FIGURE** (Isolation Shot). Purpose: vacancy as withdrawal. Camera:
   24 mm wide, figure <3%, dead-center for once (isolation earns symmetry).
   Lighting: grey noon. Duration: ≥ 6 s (the chapter's silence shot often lives
   here). Music: none. Emotion: loneliness with structure.
7. **THE DAYLIGHT DREAD** (Fear Shot). Purpose: fear built in daylight **LAW**
   [BIV.5 §11] — comprehension arriving early. Camera: slow 35 mm push (≤ 0.3 m/s)
   toward what the player already understands. Lighting: flat or over-lit (flatness
   is alarm [BIV §6]). Music: none — room tone sharpens. Emotion: dread without
   startle.
8. **THE INHERITANCE** (Scale Shot). Purpose: the insignificance beat as
   composition. Camera: 24 mm; humans as punctuation. Movement: none, or the
   slowest tilt UP the game allows (8°/s — reading the mass). Emotion: smallness.
9. **THE ACCOUNTING** (Victory Shot). Purpose: victory as cost read back — end
   fights on a question or a cost **LAW** [B0 §13.66]. Camera: the aftermath's
   quiet — the protected thing first, the wreckage second, the player's hands
   third. Music: the protected thing's own sound (wind in the sapling) is the
   sting **LAW**. Emotion: relief priced.
10. **THE STOWED THING** (Loss Shot). Purpose: grief in posture, not faces —
    Asher stows something at every loss **LAW** [BIII §1.5]. Camera: 50 mm,
    mid-shot, held; the face a closed door with excellent hinges. Duration: one
    held breath. Music: withheld. Emotion: loss without melodrama.
11. **THE SPACE BETWEEN** (Conversation Shot). Purpose: architecture finishing
    sentences. Camera: 35 mm two-shots framing the architecture between speakers
    **LAW**; singles rationed; the reply to a hard question is a cut to the room.
    Duration: dialogue ≤ 50% of scene runtime **LAW**. Emotion: what is not said.
12. **THE FILED TRUTH** (Environmental Storytelling Shot). Purpose: paperwork as
    blood-spatter. Camera: lock-off on the 5Q evidence; the player's Read grammar
    quoted by the cinematography (focus priority on wear, Chargehand, documents).
    Duration: 3–6 s inserts. Emotion: understanding.
13. **THE HELD BREATH** (Reflection Shot). Purpose: the ≥6 s chapter silence; the
    frame that must survive it **LAW**. Camera: any lens, no movement, no music,
    no dialogue, no objective. One moving thing. Emotion: the chapter's residue.
14. **THE FIRST CREDIT** (Ending Shot class). Purpose: closure as planting, never
    triumph. Camera: golden-hour 35 mm (the game's one warm sun **LAW**); pans
    only. Music: motifs resolved, then silence, then wind, then one bird at +0:60
    **LAW**. Emotion: melancholy + hope, arriving together.

---

# SECTION 3 — STORYBOARD LANGUAGE **[NEW CANON — conventions]**

*Boards are production law, not suggestions: a shot that isn't boarded isn't shot.*

- **Format:** GN-native — boards are drawn in the banned book's own grammar
  (two-tone, silhouette-first, dry-brush) so that board → GN page → in-engine frame
  is ONE visual lineage; a board that looks wrong as a GN panel will look wrong on
  screen (the franchise's cheapest QC instrument).
- **Composition & framing:** every board panel carries the frame's three depths and
  the tenant's % (annotated: "T<3" or "T:face"); headroom marked with a weight-bar
  glyph at panel top; the one light source drawn FIRST (boards begin with the light,
  then the room, then the people — the world's own order).
- **Character positioning:** per BIII §17 grammar, stamped as initials + rule
  (e.g., "AF: off-ctr, wall-adj"; "BG: sym, lit-below, heard-first").
- **Camera arrows:** four arrow glyphs only, matching the four movement verbs —
  dolly (straight arrow with foot-ticks), handheld (hand glyph — requires grief
  justification in the margin **LAW**), lock-off (padlock), crane (vertical arrow,
  descents only). A fifth glyph, the held-frame bracket, marks player-governed
  durations (reveals, reads).
- **Motion:** subject motion drawn INSIDE panels; camera motion only as arrows —
  a panel may not contain both kinds of drawn motion (the §1 testimony rule,
  enforced at board stage).
- **Panel numbering:** `EOE-CIN-CH<nn>-<scene>-<shot>` with shot-class tag from §2
  (e.g., `EOE-CIN-CH06-ORCHARD-04 [STOWED THING]`).
- **Transitions:** marked with the GN vocabulary — CUT (blade glyph), STAMP (120 ms
  UI grammar), FORM-MATCH (shape-echo glyph: the outgoing dominant shape sketched
  small in the incoming panel's corner **LAW** for GN crossings), FADE (forbidden
  except chapter ends — noted).
- **Lighting notes:** hex anchors from the chapter color script [BIV §5] in the
  margin; the one source named (blade/pool/glow/lamp) + 4:1 exception flag if any.
- **Director notes:** the shot's one-word emotion target (from §2) — mandatory;
  boards without an emotion word are returned.
- **Animator notes:** the per-character gesture library reference (BIII §1.5-class
  tells: the wrist-seam touch, the wrist-clasp, the goggles); silence durations
  written as held beats ("hold 3 breaths"), never seconds alone — animators time
  to breath, which is the game's clock.

---

# SECTION 4 — CUTSCENE STRUCTURE (THE PER-CHAPTER CINEMATIC MAP)

*The eight locked cinematics [BII §X] and seven GN sequences [BII §XI] are the
skeleton; this table completes every chapter's cinematic anatomy. Fields: opening ·
mid-chapter · environmental · boss intro/outro · GN · ending · transition · durations
· control · music · dialogue · lighting. Universal laws: real-time in-engine; control
surrendered on player motion, returned before the fade **LAW**; dialogue ≤ 50%;
one ≥5 s silence per scene; runtimes 45–120 s (ending 4 m).*

## P — PROLOGUE "The Sigh"
- **Opening:** cold open, no menu **LAW** [BII §VIII] — 2 m black-to-forest (wind,
  the far sigh, one serif line: CONCESSION III · "AMBER" · 2068). Control at first
  step.
- **Mid:** none — the prologue is uncut **LAW**; the permit prompt is GAMEPLAY
  (two presses, unmarked, unscored **LAW**).
- **Environmental:** the harvest at work — uncut walk-past of a Converter crew
  (THE FILED TRUTH inserts available on player look, not on rails).
- **Boss intro (the D-2 event):** THE APPLIANCE, 12 s: the machine's posture-swap
  read from the player's own escort position; control never leaves.
- **Ending:** the hand — smash to white (one of three sub-2 s shots).
- **GN:** GN-1 "the defection" — 2 m 10 s, eleven wordless pages [BII §X.1];
  transition out: last panel's window form-matches the title's stillwood **LAW**.
- **Transition to menu:** title over grey noon; the E grows its green line; THEN
  the main menu (the inversion is locked).
- **Music:** none until GN-1's barest motif; crew chatter and rain are the score.
  **Lighting:** work-amber in green dark → white.

## CH.1 — "Grey Noon"
- **Opening:** none — cut from title to boots on dust (the chapter IS the opening).
- **Mid:** none **LAW** — deliberately uncut chapter [BII].
- **Environmental:** the nest's first-warmth arrival (uncut; the camera never
  leaves the player; the "cinematic" is the room's own staging).
- **Ending:** the dawn hold — 40 s, no UI, no music but wind **LAW** (a HELD
  BREATH the player may leave at will; the design bets they won't).
- **GN:** none. **Transition:** walked seam to Ch.2.
- **Lighting:** the game's greyest hour; green = single-digit pixels [BIV §5].

## CH.2 — "The Orchard of Names"
- **Opening:** arrival at the humility door — THE POUR at its smallest (the
  inverted reveal: intimacy as monument [BIV.5 §10]).
- **Mid (locked cinematic #2):** Sela's Ledger — 90 s, static lamp-key lock-off,
  pages turning; the only cutscene that is just reading aloud; hymn at true tempo
  **LAW**.
- **Environmental:** the deconsecrated wing (uncut walk; THE ONE FIGURE composition
  offered, not forced).
- **Ending (locked #3):** the Evergreen broadcast — 45 s, cracked hall screen,
  congregation lit blue, no score **LAW**.
- **GN:** GN-2 the announcement satire (40 s) at exit. **Transition:** tide-road
  seam. **Dialogue:** the chapter carries the game's densest liturgy — still ≤50%.

## CH.3 — "Driftmark"
- **Opening:** first skyline (THE POUR, exterior class): Cadence across the water
  at dusk-lamp hour, 21:9 letterbox for the vista's hold **[NEW CANON — the vista
  letterbox: 21:9 mask permitted ONLY during held POUR wides, never in play]**.
- **Mid:** the Dez encounter (in-engine, control retained; the spare/bypass choice
  is played, never cut).
- **Environmental:** June's dock listen — the cartridge's first 40 s (the camera
  stays in first person; the world does the acting).
- **Ending (locked #-adjacent):** the Vaults opened — 30 s held frames, teal on
  faces; Mara's line. **GN:** none. **Transition:** Lange's arrival hook (played),
  freight seam.

## CH.4 — "The Furrows"
- **Opening:** the wrongness reveal — THE DAYLIGHT DREAD as a full-minute
  environmental cinematic the player WALKS (control never leaves; the far wall
  resolves at walking pace **LAW** [BVI §2]).
- **Mid (locked #-adjacent):** Lange at her bench — 60 s, 50 mm patience, she
  touches nothing; her memo read flat **LAW** [BIII §9].
- **Ending:** the intake schedule decrypt — THE FILED TRUTH insert series, then
  the journal's hand writes AMBER (the UI as actor). **GN:** none.
- **Lighting:** flat shadowless (the documented violation [BIV §6]).

## CH.5 — "Amber"
- **Opening:** the homecoming walk (uncut; Noor's door optional — her scene is
  in-engine at kitchen scale, lock-off, lamp).
- **Boss intro:** the cordon approach IS the intro (the player walks into their
  own memory — no cinematic; the Prologue's geometry does the work **LAW**);
  the D-2's wake-posture gets THE APPLIANCE (12 s, control retained).
- **Mid-fight event:** the report read — combat barks, never cutscene **LAW**.
- **Boss outro:** power-down mid-gesture; the standing-apart scene (60 s, two
  statics across the wreck, no touch, no absolution **LAW**; "Bring the spade.").
- **GN:** GN-3 the Incident redrawn (the two impossible panels — unlabeled
  **LAW**). **Ending/transition:** mobilization intercept (radio over black, 8 s).

## CH.6 — "The Standing Hall"
- **Opening:** arrival mid-evacuation (in medias res; no establishing luxury —
  the one chapter that opens at combat pitch, the design's authorized exception).
- **Mid (locked #4):** THE ORCHARD BURNS — 2 m, wide static frames, smoke the only
  motion, Harrow small in her own shot; score enters final 20 s only, hymn broken
  to single notes **LAW**.
- **Boss intro (Harrow):** she initiates — 20 s, the colonnade's axis, her mantle
  shed (THE TENANT at duel pitch); dialogue: her locked argument line, nothing
  else. **Boss outro:** the sidearm into the ash — in-engine at the nave's axis,
  handheld for exactly her resignation and back **LAW** [BIII §17].
- **GN (locked #5):** GN-4 THE PAGE — 40 s, one drawing assembling stroke by
  stroke, then the feeds' reproduction wipe **LAW**. **Lighting:** amber-only fire
  **LAW**.

## CH.7 — "The Architect"
- **Opening:** the Returning — NO cutscene **LAW**: twenty playable minutes; the
  camera earns its single first dolly-toward-Asher here [BIII §17].
- **Mid:** Verge's drafting wing (in-engine; his long speeches are the exception
  that is licensed [BIII §10]; the camera lock-offs on drawings while he talks —
  architecture between speakers, literally).
- **Ending:** the lantern hand-off — 45 s; he stays in the dark; crane FORBIDDEN
  (the shaft's crane is Ch.9's — this scene is a lock-off; the descent must not be
  pre-spent). **GN:** none — the chapter is the breath **LAW**.

## CH.8 — "Charge Day"
- **Opening:** festival arrival — THE POUR (exterior): the skyline as temple,
  striplight liturgy.
- **Mid:** the speaker scene — the cartridge on real air (held, in-engine,
  wordless **LAW** [BIII §13]; the camera at June's eyeline for her shots **LAW**).
- **Environmental:** the translation registers read aloud (diegetic broadcast;
  THE FILED TRUTH at city scale).
- **Ending/GN (locked):** GN-5 lamplight gear check — eleven panels, the anti-sigh
  tuning under the final page **LAW**. **Transition:** the cell goes dark (light
  snap, no fade).

## CH.9 — "Steelgate"
- **Opening:** the arrival appointment — Steelgate fills the frame the level has
  promised for three chapters (THE POUR at maximum; the vista letterbox's last
  sanctioned use).
- **Boss intro (D-3000):** THE APPLIANCE inverted — the lobby is revealed FIRST
  (arena before boss **LAW**), then the machine enters an already-understood
  cathedral; 15 s; the orchestra does NOT enter yet.
- **Boss outro:** the chart-fall — static frame, the action crosses it; orchestra
  cut dead at the collapse **LAW**; dust; silence.
- **Mid (locked, the negotiation):** VOSS — in-engine, coffee and HVAC, no score
  **LAW**; 85 mm through the doorway; the refusal is INPUT (the walk, the pushed
  door — control never leaves **LAW**).
- **GN (locked #6):** GN-6 the descent — one page, one panel, the shaft in
  section; 55 s; cable-song and breathing; the anti-sigh tunes underneath **LAW**.
- **Transition:** the 90 s crane descent (the second and last crane move) into
  Ch.10 — no cut between GN and cage **LAW** (form-match: the panel's shaft
  becomes the shaft).

## CH.10 — "Evergreen"
- **Opening:** the antechamber — heard-before-seen for a full minute **LAW**
  (the recitation; Grimwood's first image is his reflection in the array glass
  **LAW** [BIII §17]).
- **Mid:** the reactive antechamber node (walkable conversation; examinations
  change his next line [BIII §2.8] — cinematography: symmetrical frontal 35 mm
  ONLY when he speaks; the player's free look breaks and remakes the symmetry,
  which is the scene's whole meaning).
- **Boss (the Array):** no intro cinematic **LAW** — the docent simply begins;
  the fight is scored by his voice, mixed nearest of all sounds **LAW**.
- **THE GOVERNOR (locked #7):** not a cutscene **LAW** — the held ten seconds;
  the camera dollies lever → face → aperture as the input holds; the flesh hand
  shakes, the ivory hand does not **LAW** [BIII §1.7]; the flood.
- **Ending (locked #8, the 4-minute ceiling):** the arrest ("thanks the
  officers"), "One valley." / "One more than you were leaving." — then the
  epilogue's pans begin.

## E — EPILOGUE "The First Credit"
- **Structure (locked #8 continued):** vignettes as slow pans, choice-inflected;
  June's shot at her eyeline; the cartridge running out into live birdsong; the
  seedling; "Still here."; the thin green double rule; credits in silence, wind,
  ONE BIRD at +0:60 **LAW**.
- **GN:** GN-7 frontispiece — the valley drawn in advance of the pan that proves
  it **LAW** (the book precedes the world exactly once, at the end: the record
  finally ahead of the loss).
- **Control:** the epilogue walks; only the final 4 m surrenders the camera, and
  it returns for the last sentence — the player PLANTS **LAW** [Book V].

---

# SECTION 5 — GRAPHIC NOVEL LANGUAGE (THE DEFINING IDENTITY)

*The full art spec is BOOK IV §10 (binding, quantified). This section consolidates it
with the narrative law [BII §XI] and the experience law [BIV.5 §15] into the working
handbook, and adds production grammar.*

- **Panel layout:** 1–5 panels/page, never denser **LAW**; gutters ≥ 8% page width
  (structural white); splash pages open acts (full-bleed architecture, tenant <3%).
- **Panel rhythm:** the book breathes — a dense page (4–5 panels) is always followed
  by air (1–2); the eleven-page sequences (GN-1, GN-5) run 3-4-1 / 2-4-1 rhythm
  cycles **[NEW CANON — rhythm notation]**; page turns land on held single panels.
- **Negative space:** paper is silence made visible; a panel may be 70% empty and
  usually should be.
- **Typography:** captions in civic serif small caps, ≤ 12 words **LAW**; speech
  rare, hand-lettered; Chargehand replaces captions after Ch.4 **LAW** (the book
  teaches its reader the world's script).
- **Speech bubbles:** near-none — the book was drawn by someone who wasn't always
  close enough to hear (in-world truth as style); when speech appears it is
  hand-lettered, unboxed, floating at whisper size.
- **Ink & texture:** dry-brush structure over wash greys; hatching = machines only
  **LAW**; figures silhouette-flat; ONE fully rendered face per sequence — the
  page's spent emotion **LAW**.
- **Color palette:** ink `#2A2B2A` on paper `#D8D2C4` + green `#4F7A3D` ≤ 10%; red
  `#A6231C` only in Devastator panels ≤ 5% **LAW**.
- **Transitions:** last panel's dominant shape form-matches the first gameplay frame,
  both directions **LAW**; paper-tone audio crossfade; stroke-cluster assembly
  200–400 ms per cluster **LAW**; parallax ≤ 4°; in-panel motion forbidden **LAW**.
- **Animation:** the page assembles (strokes arriving in draw-order — the reader
  watches the witness remember); light-shift permitted inside held frames; nothing
  else moves.
- **Camera movement (over pages):** slow drift ≤ 2% scale per second; page turns are
  CUTS with a paper-drag foley, never 3D flips **LAW**.
- **Voice-over:** only where a document is being read in-world **LAW**; otherwise
  wordless.
- **Music & SFX:** four empty bars precede every sequence — never scored over
  **LAW**; inside: paper texture + room tone + the barest motif voicing; diegetic
  SFX ghosted at −18 dB (the memory of sound, not sound).
- **Page turns:** the reader's verb — GN sequences advance on player input where
  runtime permits (GN-1's eleven pages are input-paced with a 6 s auto-fallback)
  **[NEW CANON — input-paced pages]**; the four bars play once regardless.
- **Motion graphics:** the reproduction wipe (GN-4's feeds), the title's growing
  green line, chapter cards — all obey stamp grammar (150 ms, one bounce [BIV §11]).
- **Historical sequences:** archival two-tone, paper aged darker, dates hand-stamped
  **LAW**. **Dreams:** ink on black, NO paper texture; the grey tide-rule advancing
  one page per act **LAW**. **Memories:** always material — pages, strata, objects;
  never a shader **LAW**. **Flashbacks:** the aged-darker register; the only
  flashback footage in the game is drawn.
- **The Artist's fingerprint:** mixed deliberately (left-leaning compositions,
  right-angle green linework, tool-tenderness on machines); no asset, credit, or
  file name may disambiguate **LAW** [BIII §14]; the two impossible cordon panels
  ship unlabeled forever **LAW**.

---

# SECTION 6 — THE CAMERA HANDBOOK

- **Focal lengths:** the kit and its moral scale (§1). Wide (24) belongs to the
  world; normal (35) to passage; long (50) to faces; longest (85) to power. NO
  zooms, NO focal animation mid-shot **LAW**.
- **Telephoto:** 85 mm is rationed to Voss, judgment framings, and exactly one
  other use: the epilogue's vignettes (watched from respectful distance — the
  player as witness, not participant).
- **Tracking:** lateral tracking only alongside processions (the book-cart line,
  the Returning's walk); never leads, always accompanies.
- **Static cameras:** the default. Lock-off is this franchise's signature the way
  handheld is other franchises' — icons, documents, aftermaths, the orchard.
- **Handheld:** inside grief only **LAW**; amplitude ≤ 0.5°; sanctioned uses are
  enumerated (Ch.6 raid interior, Harrow's resignation beat) and any new use
  requires a director sign-off logged in PROJECT_STATE.
- **Crane:** the two descents **LAW**. **Drone:** does not exist — no aerials
  anywhere (the sky belongs to Surveyors, and the player's camera is never Edge's)
  **[NEW CANON — the no-aerial rule]**.
- **Dolly:** procession speed (≤ 0.5 m/s); always motivated by a walk the player
  could take.
- **Slow push:** THE DAYLIGHT DREAD's instrument (≤ 0.3 m/s, toward the understood).
- **Pullback:** reserved for endings of scenes where a person stays behind (Verge
  in the dark; Sela at her desk in Ch.2's exit) — the camera leaves people the way
  the Republic did; used with intent, sparingly.
- **Orbit:** forbidden **LAW** (§1). **Tilt/pan:** ≤ 8°/s / ≤ 12°/s; tilts UP read
  mass, tilts DOWN read cost (the two meanings are not interchangeable).
- **Reveal:** the locked grammar (§2.1); never in motion; input never stolen.
- **First-person cinematic rules:** the player's eyes are the DEFAULT cinematic
  camera — environmental cinematics, the permit prompt, the governor, the walks;
  head-motion damped to 0.5° during authored beats; FOV stays gameplay-true (70°);
  hands remain visible (the body is never amputated by cinema).
- **Third-person rules:** earned, rare, and always OBJECTIVE (never over-shoulder
  action cam): the eight locked cinematics' wides, the standing-apart scene, the
  duel's resignation, the epilogue pans. Third person exists to show Asher AS the
  world sees him — a tenant — and therefore obeys tenant law (<3% in wides,
  off-center, wall-adjacent until Ch.7 **LAW**).

# SECTION 7 — LIGHTING FOR CINEMATICS

*Base law: BIV §6 (one source, grey noon, striplight commerce, lamplight absolute,
boss schemes locked). Cinematic deltas by state:*

- **Dialogue:** the room's existing source only — no added glamour light **LAW**
  [BIV §6]; faces find the light by BLOCKING, not by cheating (actors move to the
  blade; the blade does not move to them).
- **Bosses:** locked schemes [BIV-QR §6] — D-2 spotlight glare (the boss lights the
  player); Harrow smoke-dusk; D-3000 daylight blade + red; Array lit-from-below
  white → green.
- **Hope:** lamplight register + THE WORKING HANDS warmth; the score may warm only
  here **LAW**.
- **Fear:** daylight, flat or over-even (flatness is alarm **LAW**); never darkness-
  as-monster [BIV.5 §11].
- **Mystery:** beam geometry (cap-lamp, lantern) — darkness with structure; the
  light TEACHES, never teases.
- **Revelations:** the aperture's judgment (direct sun through monumental openings
  — one of the three sanctioned sun events); R-beats are lit as audits.
- **Graphic novels:** paper-tone ambient; the pages self-lit at reading luminance;
  no environment bleed.
- **Ending:** the game's single golden hour **LAW** — the only warm-sun grade;
  the inverted ration (grey as accent) [BIV §5].
- **Memory:** lamplight on material (never a glow, never a shader **LAW**).
- **Architecture reveals:** the space's one source at full statement; volumetrics
  one idea only; god-rays only through story-bearing apertures **LAW**.

# SECTION 8 — ARCHITECTURAL REVEALS (THE SEVEN FIRSTS, SHOT-DIRECTED)

*Locked list and staging: BIV.5 §10; arenas: BVI. Universal spec: threshold 35 mm
compression ≥ 8 s walk → ONE 24 mm wide held ≥ 4 s → player's input first; music
after the hold or never; reveals never time out **LAW**.*

1. **First skyline (Ch.3, Cadence across the water):** dusk-lamp hour; the vista
   letterbox's first use; music enters AFTER the hold, quiet; control retained.
   The city as false dawn — beautiful, and the player will learn the bill.
2. **First megastructure interior (Ch.4, the Furrows):** the wrongness reveal —
   flat light, no held wide (subversion: the reveal grammar's compression never
   releases; the far wall arrives at walking pace and the "wide" never cuts —
   one continuous first-person minute).
3. **First underground (Ch.7, deep-pour recon):** lantern-taught geometry — the
   reveal is a BEAM SWEEP the player performs; the space assembles in passes;
   no wide exists (darkness with structure).
4. **The shaft (Ch.9→10):** GN-6's single panel IS the reveal (the architecture
   drawn before it is ridden — the record preceding the descent); then 90 s of
   crane, cable-song, breathing; no skip **LAW**.
5. **First religious chamber (Ch.2, the Standing Hall):** the smallest reveal —
   a 2.0 m door opening onto one tree in one light; the 24 mm wide is INSIDE, held
   from the threshold; awe by inversion.
6. **First archive (Ch.8, the Registry):** revealed by SOUND two corridors early
   (nib-scratch); the visual reveal is an afterthought by design — the player
   already knows what lives here.
7. **First reactor-equivalent (Ch.10, the Array):** the only descent INTO light —
   approached from above, the camera's whole theology in one move **LAW**; white
   rising; the wide is granted at the top gallery and held as long as the player
   stands.

# SECTION 9 — BOSS INTRODUCTIONS

*Rules (universal): the ARENA is revealed before the boss **LAW**; intro length
≤ 20 s; dialogue in intros: none (machines) or one line (humans); control retained
wherever physically true (the player may move during every boss intro — the camera
authors attention, never paralysis); music does NOT enter at intros **LAW** (meaning
has not completed); scale established by the arena's own datum objects; ending
transition = the intro's last frame is a playable frame (no cut back to gameplay —
the intro ends IN gameplay).*

- **D-2:** no intro cinematic in the classic sense — the wake-posture APPLIANCE
  shot (12 s) inside the player's approach; its spotlight finds the player and the
  fight has begun before any camera says so.
- **Harrow:** she walks the colonnade's axis toward the player, sheds the mantle,
  and takes stance — 20 s, one line, lock-off at the processional's far end; the
  honor structure is understood wordlessly.
- **D-3000:** the lobby first (the reveal), then the machine ENTERS an understood
  cathedral (staged arrival — freight gates, floor answering); 15 s; the orchestra
  waits for phase 1's meaning.
- **The Array:** no intro **LAW** — the docent simply begins speaking; the absence
  of a boss intro IS the intro (the player keeps waiting for the movie; the movie
  never comes; the schedule was always already running).
- **Voss (non-boss):** the anti-intro — he is discovered mid-coffee in the silence
  after the orchestra's dead-cut; 85 mm; the most dangerous scene in the game has
  the least cinematography.

# SECTION 10 — CHARACTER CINEMATICS (THE SEVEN-BEAT ARCS)

*Per-character camera grammar is BIII §17 (binding). This section maps each major
character's seven cinematic beats — introduction · relationship · turning point ·
lowest point · final appearance · death (if any) · ending — onto locked scenes; no
new scenes are invented, only shot-directed.*

- **ASHER:** intro — from behind, in uniform, one of many **LAW**; relationship —
  the soldering lesson (Ch.4, two prosthetics of a kind); turning — the report
  read over the D-2 (in-fight); lowest — standing apart ("Bring the spade.");
  final/ending — the planting, the sentence, the ivory hand in golden hour; his
  camera approaches him for the first time at the funeral **LAW** and stands
  beside him by the valley.
- **GRIMWOOD:** intro — heard a full minute before seen; first image his
  reflection in array glass **LAW**; relationship — the antechamber node
  (reactive); turning — the reversal (his tempo corrected); lowest — the
  recalculation (fragments into arithmetic — the actor's single unraveling
  **LAW**); final — the arrest, collar-mask removed, throat bared (first
  unguarded centimeter **LAW**); no epilogue scene **LAW**.
- **HARROW:** intro — quarter-angle low 35 mm statue grammar (P's doctrine
  presence is muscle memory only); relationship — the report reading (Ch.5, her
  voice on the band choosing the institution); turning/lowest — the duel and the
  ash; final — the epilogue glimpse, grey entire, planting, NO words **LAW**
  (they never speak after the colonnade).
- **MARA:** intro — the spade handed before the weapon; relationship — the
  seed-crate walks (she shares frames **LAW**); turning — "Debrief's at six.";
  lowest — authorizing demolition methods, said plainly, on camera **LAW**;
  ending — the parish, the coat on its nail (background, built [BIII §16]).
- **SELA:** intro — the ledger reading (lock-off, lamp, icon grammar); turning —
  closing the ledger at the broadcast; death — IN LEVEL, procedural, volume
  three (the raid's handheld is her martyrdom's cinematography **LAW**); final —
  her Returning: the rite the camera attends at last.
- **COIL:** intro — 24 mm in shop clutter, cut rate double **LAW**; relationship
  — teaching the hand; turning — naming the anti-sigh; ending — the marker
  drying on a page we do not see **LAW** (the camera almost resolves the Artist
  and looks away — the franchise's held breath, shot literally).
- **VOSS:** intro — a signature lowering (the pen shot); the negotiation; final
  — one lit window in a dark skyline **LAW**.
- **DEZ:** intro — corridor depth as an enemy squad leader; turning — the carry
  (GN-4's subject, never shown in engine **LAW** — the image belongs to the
  book); the anger scene, directed at paperwork **LAW**; ending — vignette per
  choice, four unresolved bars.
- **JUNE:** all scenes at her eyeline **LAW**; the speaker scene wordless; the
  final shot of the game is hers **LAW**.
- **VERGE / LANGE / PALE / BRACK / NOOR:** single-beat icons — the lantern
  hand-off (pullback, he stays); the bench she doesn't touch; the mag-platform
  hand-off; the tide-line (choice-staged pairing); the alarm clock (the game's
  first golden hour shared with the valley) — each shot-classed and boarded from
  its locked scene.

# SECTION 11 — PLAYER CONTROL (THE IMMERSION CONTRACT)

- **Players LOSE control only when:** time must pass (GN pages), an icon must be
  composed (the eight locked cinematics' wides), or the world must be watched
  doing something the player cannot stand inside (the orchard burning). Total
  fully-non-interactive time in the campaign: under 20 minutes **[NEW CANON —
  the 20-minute ceiling]**.
- **Players RETAIN control during:** every reveal **LAW**; every boss intro (§9);
  the permit prompt, the governor, the refusal, the Returning, the shovel, the
  planting — the game's moral spine is 100% played **LAW**.
- **Cinematics become interactive when** meaning requires authorship: held inputs
  (the ten seconds), walked refusals, input-paced pages (§5), the reactive
  antechamber. Rule: if a scene's emotion is DECISION or LABOR, it must be
  played; if it is WITNESS, it may be watched.
- **Seamless blending:** surrender on player motion (the camera takes over as the
  player walks, never freezing them); return before the fade **LAW**; the first
  input after any cinematic is always available within 0.5 s of the last visual
  beat; camera handoffs match position/FOV within one lens step (no teleport
  cuts into the head).
- **Never break immersion:** no letterbox in play (vista mask only during held
  wides §4); no "cinematic mode" UI; no skip prompt overlay — skipping is held
  Esc/pause-menu only, and GN pages are skippable page-by-page, never
  sequence-whole **[NEW CANON — skip grammar]** (accessibility: full-skip toggle
  exists in settings [Book V §14 cognitive]).


---

# SECTION 12 — THE GRAPHIC NOVEL PIPELINE **[NEW CANON — workflow]**

*From script to engine, one lineage. The GN is drawn by ONE artist-hand in reality
using the mixed style-fingerprint **LAW** [BIII §14].*

1. **SCRIPT:** the sequence's beats in the writers' locked prose (BII §XI's map);
   caption drafts ≤ 12 words; the Canon Office marks the two sanctioned
   discrepancies and any Chargehand substitutions.
2. **THUMBNAIL:** page rhythm first (the 3-4-1 notation §5); silhouettes only; the
   one-rendered-face is CHOSEN here (which face this sequence spends) and signed off
   by the director.
3. **STORYBOARD:** §3 conventions; form-match shapes designed at both ends NOW (the
   crossing frames are the hardest and are drawn first).
4. **GPT-IMAGE CONCEPT PASS:** §13 prompts generate composition studies and material
   references; generated images are NEVER shipped — they are the concept layer under
   the artist's hand **LAW** (originality law: silhouettes bespoke).
5. **LAYOUT:** final pages at print resolution (the book must survive being printed
   — it is, in-world, a printed object; marketing will print it).
6. **VOICE-OVER:** only for read-aloud documents **LAW**; recorded before motion so
   assembly timing breathes with the read.
7. **MOTION GRAPHICS:** stroke-cluster assembly maps (draw-order choreography,
   200–400 ms/cluster); parallax plates separated ≤ 4°.
8. **ANIMATION:** light-shift passes; page-turn foley sync; the four bars timed.
9. **SOUND:** paper texture bed, room tone, ghosted SFX at −18 dB, barest motif
   voicing; the four empty bars precede — never scored over **LAW**.
10. **INTEGRATION:** input-paced page advance + 6 s auto-fallback; preload behind
    the four bars **LAW** [Book V §19.4]; skip grammar per §11.
11. **UE5 IMPLEMENTATION:** UMG/material pages, never video **LAW** [BIV §15] —
    resolution-independent, grain-free (paper texture is the grain [Book V §19.3]).

# SECTION 13 — GPT-IMAGE PROMPT LIBRARY (CINEMATIC & GN PRODUCTION)

**Globals:** use BOOK III §18's global style block + negative verbatim for character
frames; BOOK IV §14's for environments. Quality target: "key-art finish, 4K detail."
Append per subject:

1. **Storyboard sheet:** "storyboard page, six panels, two-tone ink and wash on
   paper, silhouette-first figures, one light source drawn per panel, camera arrows
   in the margins, panel numbers hand-stamped; a night forest harvest going wrong:
   floodlights, a quadruped machine turning, a hand reaching; dry-brush urgency,
   no color except one green frame. 16:9."
2. **Chapter splash (save-slot art class):** "full-bleed graphic novel splash page,
   ink #2A2B2A on paper #D8D2C4, monumental brutalist interior with human figure
   under 3% of frame, serif small-caps chapter title zone left empty, one green
   accent ≤10%; held stillness. 2:3."
3. **GN page (the page, GN-4 class):** "two-color inked comic page, 3 panels over
   one large final panel, dry-brush over wash, silhouette figures; a soldier out of
   uniform carrying an elderly woman from smoke, books clutched; ONE fully rendered
   face — hers, at peace; captions absent; green absent; amber implied by wash
   density only. 2:3."
4. **Dream page:** "ink drawing floating on pure black, no paper texture, a living
   forest above a small town, a grey tide-line ruled dead level advancing through
   the trees; a distant descending chord made visible as settling dust; unease,
   memory, loss. 2:3."
5. **Memory insert (pressed-leaf class):** "macro still life: a pressed leaf in a
   glass case labeled in serif small caps, museum lighting, concrete lobby bokeh;
   QUERCUS ALBA, WITHDRAWN 2051; reverence and indictment in one object. 1:1."
6. **Cutscene keyframe — Sela's ledger:** "static tabletop-height frame, single
   lamp, elderly clergywoman-accountant reading an open parish ledger aloud, black
   text-bands at her cuffs, one living tree soft in background dark; lamplight
   #E5B76A absolute, everything else shadow-held; iron-gall intimacy. 16:9."
7. **Cutscene keyframe — the orchard burns:** "very wide static frame, a burning
   orchard at night rendered ONLY in amber work-light and ash-fall — no red —
   figures small carrying books, a broad-shouldered commander smaller still in her
   own frame; smoke as the only motion; restraint, loss. 21:9."
8. **Boss reveal keyframe — the chart-fall:** "corporate cathedral lobby, a
   floor-to-ceiling etched stock chart slab mid-fall onto a colossal red-banded
   machine, dust sheeting, daylight blade, mirror floor shattered; the graph
   killing its god's bodyguard; static camera, the action crossing the frame.
   16:9."
9. **Character close-up — the almost-agreement:** "50mm portrait, 70-year-old
   scientist lit from below in cold white, round brass spectacles catching an
   upward light, warmth that unsettles, mid-sentence of a gentle explanation;
   behind him, out of focus, a machine array where an altar should be. 2:3."
10. **The governor (interactive keyframe):** "first-person hands on an industrial
    polarity lever — right hand flesh and white-knuckled, left hand ivory
    prosthetic and steady — carved serif inscription band above, cold white light
    rising and beginning to green at the frame's lowest edge; ten seconds made
    visible. 16:9."
11. **Architecture reveal — the descent panel (GN-6):** "single-panel graphic
    novel page: an elevator shaft drawn in architectural section, eleven hundred
    meters of poured concrete strata, one tiny lamp descending, hand-stamped depth
    marks; ink on paper, one panel, no caption. 2:3."
12. **Ending artwork — the first credit:** "golden-hour valley alive with green,
    grey stillwood ridges framing every edge, a man kneeling at the tree line
    planting a seedling from a metal-lid pot, a child lowering a field recorder
    mid-frame distance; the color ration inverted — grey now the accent; one bird
    implied in the light. 21:9."
13. **Marketing poster (capsule master):** "vertical poster: monumental concrete
    threshold, small figure walking in, ivory left hand catching the only light,
    editorial serif title zone empty at top, one thin green line growing through
    the final letterform space; melancholy, scale, restraint. 2:3."
14. **Trailer keyframe — stars over the blackout:** "megacity skyline gone dark
    under an indecent field of stars, one office window lit, orbital mirror-lines
    crossing; strange peace, consequence. 21:9."

**Negative prompts (all):** per the locked globals — plus, for GN subjects: "no
screen-tone dots, no manga styling, no digital gradients, no color except specified
green/red allowances."

# SECTION 14 — UNREAL ENGINE 5 (CINEMATIC IMPLEMENTATION PHILOSOPHY)

*Posture per BIV §15 / BVI §16: UE5 = Phase B target; principles engine-portable;
Phase A web build implements the same cinematic law at its asset tier — GN pages
and real-time scenes fork in fidelity, never in grammar **LAW**.*

- **Sequencer:** one master sequence per locked cinematic, named
  `EOE_CIN_CH<nn>_<name>`; shots as sub-sequences named by §2 taxonomy; real
  cine-cameras with locked filmback and the four-lens kit ONLY (a fifth focal
  length cannot be created — remove the temptation at the rig level).
- **Control Rig:** the per-character gesture libraries (BIII tells) as rig-space
  assets; the ivory hand's steady/tremble split is a rig constraint, not hand-key
  luck.
- **Camera rigs:** dolly = rail rig with speed clamp (≤ 0.5 m/s baked); crane
  exists as ONE rig asset used twice; handheld = a recorded human operator take
  (never procedural noise — grief is performed, not simulated) **LAW**.
- **Virtual camera:** used for scouting and the handheld takes; all VCam output
  conformed to the lens kit before lock.
- **MetaHuman Animator / facial:** facial capture for the named cast only (enemies
  have no faces **LAW** [BVII visor law]); the animators' rule is SUBTRACT [BIII
  §1.5] — capture is thinned, never sweetened; Grimwood's warmth and Asher's
  stillness are performance directions, not post effects.
- **Niagara:** per BIV §13 (one particle idea; the sigh as MPC wave, not
  particles); cinematic-only particles forbidden (the world's VFX budget is the
  cinematic's too — no glamour dust).
- **Post-process:** the shared filmic stack (grain 0.10 [Book V §19.3], per-chapter
  LUTs [BIV §5]); cinematics add NOTHING (no extra vignette, no added CA, no
  bloom sweetening) **LAW** — lens-true or it lies.
- **Movie Render Queue:** for trailers/marketing only (in-game cinematics are
  real-time **LAW**); MRQ renders use the same LUTs and grain — marketing may not
  look better than the game **LAW** (§15).
- **Optimization:** cinematics budget like boss arenas [BVI §16]; level streaming
  hides loads behind GN pages and the four bars **LAW**; camera-cut visibility
  culling per shot; the 2-second floor (§1) is also a streaming guarantee.
- **Lighting workflow:** the space's existing lighting scenario IS the cinematic
  rig — scenes add bounce cards only (one-source law survives cinematics); boss
  scheme swaps at phase boundaries via lighting scenarios [BVI §16].

# SECTION 15 — TRAILER DIRECTION **[NEW CANON — the trailer suite]**

*The marketing law: trailers obey EVERY canon law — the ration, the silence, the
lens kit, no spoilers past R1, and marketing may not look better than the game
**LAW**. The five pillars govern content [BI §XVII]; the GN is the marketing
identity's spine (the banned book advertises the game that contains it).*

1. **ANNOUNCEMENT ("Still Here", 60–75 s):** GN pages assembling in silence — the
   four empty bars AS the trailer's opening; stroke-clusters build the stillwood,
   the seedling, the ivory hand; ONE in-engine shot at the end (the dawn hold,
   40 s compressed to 8); title; the E grows its line; one bird. No dialogue, no
   music until 0:40, then the hymn's bass only. Text: none except the title.
2. **GAMEPLAY ("The Covenant", 90 s):** one unbroken first-person covenant wave —
   no cuts **LAW** (the anti-montage: the genre's loudest format answered with one
   held take); the protected sapling audible under everything; end on THE
   ACCOUNTING (checking the sapling, not the wreckage). Caption cards in serif,
   ≤ 4 words each ("PROTECT WHAT LIVES." / "HOLD THE LINE." / "PLANT.").
3. **STORY ("The Ledger", 2 m):** the permit prompt shown UNEXPLAINED at 0:10 and
   again, re-contextualized, at 1:50 (the trailer performs the game's own
   re-pricing trick — spoiling nothing, promising everything); Sela's line as the
   only VO ("The ledger doesn't need you innocent..."); ends on the standing-apart
   frame.
4. **LAUNCH ("One Valley", 60 s):** the emotional montage earned — motifs
   resolved; the only trailer permitted the full orchestra (Ch.9's cue, once,
   licensed to marketing exactly as the game spends it); ends on "Still here."
   and the bird at the final second.
5. **DEVELOPER DIARY series:** desk-scale honesty — the board, the bibles, the
   grain of the process; the manifesto read over work-in-progress (the marketing
   voice is the Ledger's: show the planting).
6. **STEAM PAGE VIDEO (30 s loop):** wordless — the one-frame test performed
   thrice (pour / ration / tenant), the wordmark, the bird. Autoplays muted:
   composed to work silent FIRST (this franchise's advantage — it already does).

**Editing rules:** cuts on meaning; ASL ≥ 4 s (trailers, not tabata); no riser-
whoosh grammar, no black-frame strobing, no review quotes over image (end-card
only); logos: publisher/engine cards in serif on paper, 2 s, silent. **Music:**
original score only; the sigh/anti-sigh as the audio brand (the announcement
trailer teaches the sound; the launch trailer resolves it). **Shot order law:**
every trailer ends quieter than it began — the franchise promise made formal.

# SECTION 16 — QUALITY CONTROL (THE 100 VALIDATION QUESTIONS)

*Run per shot, scene, sequence, and trailer at board, blockout, and final. ⊗ =
stop-ship.*

**Identity & belonging (1–12)**
1. Could this cinematic belong to another franchise? *(yes = redesign)* ⊗
2. Does the frame pass the one-frame test (pour/ration/tenant)? ⊗
3. Would this shot be memorable without dialogue? 
4. Does it keep the losses felt? ⊗
5. Is anything here only because it looks cool? *(yes = redesign)* ⊗
6. Can you name the shot's §2 class and its one-word emotion? ⊗
7. Does it need a logo, caption, or line to be understood? *(yes = redesign)*
8. Is the emotion arriving from composition, not coverage?
9. Does it deepen the record or repeat it?
10. Would Sela sign this scene's entry?
11. Does it serve the chapter's emotional row [BIV.5 §17]? ⊗
12. Is it the cheapest honest version?

**Camera & lens (13–28)**
13. Lens from the kit (24/35/50/85)? ⊗
14. Zero zooms, orbits, aerials, speed-ramps? ⊗
15. Movement one of the four verbs, justified? ⊗
16. Handheld inside grief only, signed off? ⊗
17. Crane = the two descents only? ⊗
18. Dolly ≤ 0.5 m/s; pans ≤ 12°/s; tilts ≤ 8°/s?
19. Shake ≤ 0.5°? ⊗
20. Shot ≥ 2 s (or one of the three authored shocks)? ⊗
21. ASL 6–10 s held?
22. First-person FOV gameplay-true; hands visible?
23. Third person objective, tenant-lawful, earned?
24. Camera handoffs position/FOV-matched within one lens step? ⊗
25. Does the camera testify rather than perform?
26. Is subject motion vs. camera motion separated (one testifies)?
27. Voss at 85 mm through a doorway; his rules held? ⊗
28. No dolly toward Asher before Ch.7? ⊗

**Composition & light (29–46)**
29. Humans <3% in establishing shots? ⊗
30. Headroom oppression present?
31. Three depth planes, one anomalous vertical?
32. Architecture framed between speakers? ⊗
33. One dominant light source (or documented 4:1)? ⊗
34. No added glamour lighting? ⊗
35. Shadow readable, never #000? ⊗
36. Green ≤10%, earned; red only Devastator/alarm? ⊗
37. Chapter color script obeyed (grade LUT correct)? ⊗
38. Faces spent at the apex only (one full face per scene)?
39. Grimwood: symmetric, lit-below, heard-first? ⊗
40. Sela: lock-off, lamp-key, tabletop height? ⊗
41. June at her own eyeline? ⊗
42. Boss lighting scheme locked-correct? ⊗
43. Flatness only as alarm?
44. The one warm sun spent only in the epilogue? ⊗
45. Would the frame survive a 6-second hold? ⊗
46. Is the load path legible in architectural frames?

**Sound & silence (47–58)**
47. One silence ≥5 s in every scene? ⊗
48. The chapter's ≥6 s silence shot placed and surviving? ⊗
49. Music only after meaning completes? ⊗
50. Silence wins the tie here?
51. Four bars before every GN page, unscored? ⊗
52. Dialogue ≤50% of runtime? ⊗
53. No stingers, no risers? ⊗
54. Machines melody-free; boss cues locked-only? ⊗
55. The sigh triggers the phantom response? ⊗
56. Every silent frame keeps one moving thing? ⊗
57. Diegetic sound doing the score's work where possible?
58. Does the scene end quieter than it began (where the chapter allows)?

**Control & transitions (59–72)**
59. Real-time in-engine (no pre-rendered video)? ⊗
60. Control surrendered on player motion, never on a cut? ⊗
61. Control returns before the fade, ≤0.5 s to input? ⊗
62. Reveals: input free, never timed out? ⊗
63. Boss intros ≤20 s, arena first, control retained? ⊗
64. The moral spine 100% played (prompt/governor/refusal/rite/planting)? ⊗
65. Runtime 45–120 s (ending 4 m only)? ⊗
66. Non-interactive total under the 20-minute ceiling? ⊗
67. GN crossings form-matched both directions? ⊗
68. Stroke-assembly 200–400 ms; parallax ≤4°; no in-panel motion? ⊗
69. Page advance input-paced with fallback; skip grammar honored?
70. Streaming hidden behind bars/pages/thresholds — zero visible loads? ⊗
71. Letterbox only during held vista wides? ⊗
72. Does this transition feel seamless — can a tester say when the movie began?
    *(if yes precisely = revise)*

**Canon & memory (73–88)**
73. The eight cinematics and seven GN sequences intact as locked? ⊗
74. No new lore, no changed story, no altered character? ⊗
75. The two GN discrepancies preserved, unlabeled? ⊗
76. The Artist unresolved — no asset/credit disambiguation? ⊗
77. Dream pages: ink on black, tide-rule advancing per act? ⊗
78. GN two-color law + one-face law held? ⊗
79. Captions ≤12 words, serif small caps; Chargehand after Ch.4? ⊗
80. Locked lines verbatim (the argument, the deal, "One valley...")? ⊗
81. Asher's camera history honored (behind → beside)? ⊗
82. Harrow and Asher never speak after the colonnade? ⊗
83. Grimwood absent from the epilogue? ⊗
84. The carry (GN-4's subject) never shown in engine? ⊗
85. Ending protocol exact (silence, wind, bird at +0:60)? ⊗
86. New canon logged in PROJECT_STATE.md? ⊗
87. Does scale read (does the tester FEEL tiny where designed)?
88. Does the transition out carry the cost forward?

**Trailers & production (89–100)**
89. Trailer obeys every in-game law (ration/silence/lenses)? ⊗
90. Marketing does not look better than the game? ⊗
91. No spoilers past R1; the re-pricing trick spoils nothing? ⊗
92. Ends quieter than it begins? ⊗
93. Original score only; sigh/anti-sigh as audio brand?
94. Storyboards carry emotion words, light-first drawing, §3 glyphs? ⊗
95. Sequencer naming per convention; shots classed? ⊗
96. Buildable at slice scope first (Prologue + GN-1)? ⊗
97. Would this shot read on a phone, muted? (Steam/loop assets only)
98. Can a tester DRAW the shot from memory a day later?
99. A year later, which frame from this chapter is remembered — and is it the
    one you meant?
100. Does every frame reinforce the philosophy — the witness camera, the losses
     kept felt? ⊗

# SECTION 17 — THE FILM DIRECTOR'S MANIFESTO

*To every cinematic artist who joins this project after us.*

**Cinematics matter** because they are the moments the player agrees to stop
acting and simply attend — and attendance is this story's whole morality. A man's
redemption in this game is measured in funerals attended, doors knocked, records
read. When the player gives you their verbs for ninety seconds, you are holding
the game's most sacred currency. Spend it like green: once, deliberately, where
nothing else would do.

**Architecture is the main actor.** People in this world lie, curate, and file;
the pour does not. Light the room before the face. Frame the argument between the
speakers. When a conversation reaches the thing that cannot be said, cut to what
stands — the colonnade, the aperture, the empty plinth — and let the civilization
answer for its children. If your scene works with the people removed, you have
built it correctly; the people will only make it better.

**Silence is dialogue.** The Quiet is our antagonist, and every unscored second is
its close-up. Do not fear the held frame; fear the reflex that fills it. The four
empty bars before every page are the bravest cue in our score because they trust
the player to feel without being conducted. Write silence into your boards with
durations. Hold it one breath past comfortable. That breath is where the game
lives.

**Composition tells stories** that coverage cannot. A tenant under three percent
of frame IS the Accord Age. Headroom IS inheritance. One warm face in ninety
percent grey IS the ration, spent. Before you move the camera, ask what the frame
already says standing still — in this franchise, the answer is usually
"everything," and the move is usually vanity.

**Players remember images more than exposition** — they will forget every line we
were wise enough not to write, and they will keep the ivory hand in the doorway
light, the ledger under the lamp, the chart falling, the stars over the dark city,
the recorder lowering. Nine of our twenty-five unforgettable moments are silent
[BIV.5 §16]. That ratio is not an accident; it is the house style. Build frames
worth keeping and the story will be kept with them.

**Graphic novels are essential** because they are the story's own testimony — the
banned book, drawn by a hand we never name, remembering events the player lived
slightly differently than the player lived them. The pages are where the game
becomes a record, and the record is what this whole world failed to keep
honestly. Treat every page as evidence. Draw it like the witness's hands were
cold. And never, ever, score over the four bars.

**How every future cinematic should be judged:** hold the frame six seconds. Ask:
does it pass the one-frame test? Does it need a line to work? Would it survive
muted, on paper, in two colors? Does it keep the losses felt? Four yeses — shoot
it. Any no — bring the spade.

*Still here.*

---

# SECTION 18 — NEW CANON REGISTER (THIS BOOK'S ADDITIONS)

*Logged in PROJECT_STATE.md per Lock §20.20.*

1. **The shot taxonomy** — fourteen named shot classes (THE POUR, THE TENANT, THE
   APPLIANCE, THE PRESSED LEAF, THE WORKING HANDS, THE ONE FIGURE, THE DAYLIGHT
   DREAD, THE INHERITANCE, THE ACCOUNTING, THE STOWED THING, THE SPACE BETWEEN,
   THE FILED TRUTH, THE HELD BREATH, THE FIRST CREDIT) (§2).
2. **The 2-second shot floor** with exactly three authored sub-2 s shocks (§1).
3. **Storyboard conventions:** GN-native boards; light-drawn-first; four arrow
   glyphs + held-frame bracket; emotion-word mandatory; `EOE-CIN-` numbering (§3).
4. **The per-chapter cutscene structure map** (§4) — completes every chapter's
   cinematic anatomy around the locked eight + seven.
5. **The vista letterbox rule:** 21:9 mask only during held POUR wides (§4).
6. **GN production grammar:** 3-4-1 rhythm notation; input-paced pages with 6 s
   fallback; page-by-page skip grammar; print-survivable resolution (§5, §11–12).
7. **The no-aerial rule:** no drone/aerial cameras exist — the sky belongs to
   Surveyors (§6).
8. **The 20-minute non-interactive ceiling** for the whole campaign (§11).
9. **The GN pipeline** (11 stages, GPT-image as concept-only layer) (§12).
10. **The trailer suite:** Still Here / The Covenant (one unbroken take) / The
    Ledger / One Valley / diary / Steam loop — with the marketing laws (obey all
    canon; never look better than the game; end quieter than begun; no spoilers
    past R1) (§15).
11. **Sequencer conventions:** `EOE_CIN_CH<nn>_<name>`, shots classed by taxonomy;
    the four-lens kit enforced at rig level; handheld = recorded human takes (§14).
12. **Production milestone (user-directed):** the first shipped deliverable after
    books → sprints → vertical slice is a **web link to a ~30-minute playable
    slice** (Prologue + GN-1 + title, per Book V §0.5 Phase A scope).

---

*— End of BOOK VIII (Cinematic, Storyboard & Graphic Novel Bible), Edition One. New
canon per §18 logged in PROJECT_STATE.md. Loading order stands: Book 0 → Canon Lock
II.5 → this book for cinematic, storyboard, GN, and marketing disciplines (with Book
IV for visual law and Book VI for staging). Amendments require a logged entry in
PROJECT_STATE.md.*
