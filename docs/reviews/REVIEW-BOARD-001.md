# ECHOES OF EDEN — INDEPENDENT REVIEW BOARD · REPORT 001
### Confidential Internal Review · 2026-07-04

*Board: Creative Director (CD) · Game Director (GD) · Lead Gameplay (LGD) · Lead Level
Design (LLD) · Lead Combat (LCD) · Technical Director (TD) · UX Lead (UX) · Producer
(PROD) · QA Director (QA) · Playtest Director (PT). Reviews conducted independently;
disagreements preserved. Mandate: truth over encouragement.*

---

## SECTION 0 — THE FINDING THAT GOVERNS EVERYTHING ELSE (unanimous)

**There is no vertical slice to review.** The brief asserts Sprints 001–002 complete;
the project ledger and the repository say otherwise: Sprint 001 Phase A is executed
(multiplayer excision, CI, a live link), Phases B–E and all of Sprint 002 are plans.
What is playable today at the link is the **legacy NEON STRIKE arcade prototype,
retitled** — a competent browser wave-shooter with neon-era visuals that violate
nearly every law in the project's own visual bible. None of the designed game — the
covenant loop, the C-9, the Wardenry, Breath/Binding, the graybox, the Prologue,
GN-1 — exists in playable form.

This board refuses to "pretend we played the slice." A board that reviews imaginary
builds produces imaginary confidence, and imaginary confidence is how studios die.
**PROD:** "The single greatest risk to this project is the gap between the fiction of
progress and the ledger of progress. This very brief exhibited the risk."

So the review is split honestly throughout: **[TODAY]** = the playable arcade build we
ran; **[DESIGN]** = the game as specified by the sixteen canon documents, judged as a
design with its execution risk priced in. Where a section can only be reviewed as
design, we say so.

---

## SECTION 1 — EXECUTIVE SUMMARY

**Would this excite a publisher?** [DESIGN] The *pitch* would get a second meeting at
two or three publishers — "an FPS where combat defends saplings, the tutorial is the
crime, cutscenes are a banned graphic novel" is a genuinely differentiated logline
with a poster-ready identity. But no publisher funds sixteen bibles and a solo
developer; they fund slices. **The slice IS the pitch, and it doesn't exist.**
[TODAY] The current build would excite no one professionally; it is a tech proof.

**Would it excite Steam players?** Split verdict. **CD/LLD:** yes — the
Control/Death-Stranding/Inside temperament is a real, underserved, wishlisting
audience, and "quiet FPS" is a hook precisely because it sounds like a contradiction.
**PT/LCD:** the same phrase is a conversion risk — FPS tags bring players who bounce
off quiet; narrative tags bring players who bounce off FPS. This game will have a
strong wishlist-to-review ratio and a *painful* tag-mismatch refund tail unless the
store page is ruthlessly honest about what it is.

**Would it excite reviewers?** [DESIGN] Yes, conditionally — reviewers reward exactly
this profile *when execution lands* (see: Inside, Return of the Obra Dinn, Citizen
Sleeper). The permit-prompt device and the no-fight finale are review-quote machines.
The condition is enormous: the whole identity rides on execution polish a solo
developer has not yet demonstrated in this genre.

**Would it feel original?** Yes — §10. The synthesis is its own thing. The moods are
borrowed; the *verbs* are not.

**Would it justify years of development?** **PROD, dissenting from the room's
romanticism:** "As currently scoped — a 12–16 hour, 10-chapter campaign with four
bosses, seven GN sequences, and an original orchestra, built by one person — no. The
honest math is 3–5 years of solo full-time work AFTER the slice, and solo projects
of that duration have a completion rate near zero. As re-scoped to Act I shipped as
a complete story (§15) — yes, defensibly." The board endorses the Producer's framing
7–3.

---

## SECTION 2 — FIRST IMPRESSION (THE FIRST 30 MINUTES)

[TODAY] The first 30 minutes are an arcade wave shooter with a handsome intro card.
No hook beyond novelty; no reason to return. Not reviewable further.

[DESIGN — the Prologue + Ch.1 as specified]
- **Does it hook?** The cold open (no menu, a living forest, competence-as-tutorial)
  is a strong, confident open *for the right player*. **PT:** "For the median FPS
  player, twelve minutes of escort procedure before meaningful agency is a quit
  point. Your own telemetry gate (dawn hold watched by 60%) is well designed —
  I predict you'll fail it on the first three playtests and have to tighten the
  Prologue by 20–25%. Plan for that cut now."
- **Where bored?** The stillwood traversal between the title and Taproot is the
  danger zone: markerless navigation + no combat + grey-on-grey, all before the
  player has learned to read the world. The design's own answer (Chargehand,
  light-reading) assumes a literacy the player doesn't have yet at minute 25.
- **Where confused?** The HUD defection is brilliant but risky in the first hour —
  players who missed that the Prologue HUD was diegetic will read the switch as an
  art-style bug. One journal line will fix it; the design currently forbids even
  that. **UX recommends a canon amendment: the defection gets ONE line.**
- **Where curious?** The permit prompt (if it is exactly as mundane as specified —
  its mundanity is the trap), the D-2's indifference, and the seedling. These are
  excellent curiosity engines.
- **Would players continue?** The target player: absolutely — the dawn hold is a
  first-30-minutes ending very few games attempt. The general player: coin flip.

---

## SECTION 3 — GAMEPLAY LOOP

[DESIGN] The macro loop (approach → covenant → aftermath → rest) is coherent and
unusually well-theorized. The board's genuine concerns:

- **Repetition ceiling.** The covenant is ONE verb. Book VI varies its geometry
  (Acre/Dock/Vault Yard) and Book VII varies its opposition, but across 12–16 hours
  the sprint's own math shows perhaps 12–15 covenant events plus infiltrations. 
  **LCD:** "By hour eight, 'defend the pointable thing' will be felt as formula
  unless the *fiction* of each covenant is doing enormous work. The books claim it
  will. Claims aren't hours."
- **What should be removed?** The Mulcher price-engine encounters are the loop's
  most interesting *idea* (fights ended by economics), and the roster's most
  expendable *content* — see §15. The board split 5–5 on this and left it standing.
- **What should be expanded?** The Read. Perception-as-progression is the game's
  real system identity, and it currently pays out mostly in *understanding*. Tie
  Tier 2/3 reads to more mechanical pre-fight advantages (patrol timing windows,
  hazard pre-arming) and the explore half of the loop gains teeth. **LGD, GD
  concur; CD warns against making reading transactional. Logged as a design
  question, not a mandate.**
- **Flow/replayability:** the Standing Watch is a smart replay chassis; NG+ as
  re-reading is honest. But replayability scores (§20) stay modest: this is a
  one-great-playthrough game by design, and should stop pretending otherwise in
  its own planning documents.

---

## SECTION 4 — MOVEMENT

The design deliberately refuses flair: no slide-cancel, no air control, weight
everywhere. Judged against the requested comparisons, honestly:

- **vs Titanfall 2 / DOOM Eternal:** loses catastrophically on kinetic joy — and is
  entitled to, they are different games. But the board must say it plainly: players
  arriving with FPS muscle memory will call this movement "stiff" in reviews.
- **vs Half-Life 2:** the honest target. HL2's walk is plain but its *world density
  per meter walked* carries it. That is this game's actual bet — and it means the
  movement system's quality is really a LEVEL DESIGN dependency (§6).
- **vs Death Stranding:** the flattering comparison the project wants, and the board
  rejects it. DS made walking itself a system (terrain, balance, load). Eden's
  walking has weight and breath but no *mechanics of walking*. **LGD:** "Walking
  here is a camera for the level design. If the level design is world-class, nobody
  notices. If it's merely good, the game is slow."
- **vs Control:** roughly comparable ambitions (movement as presence, not sport);
  Control papers over plainness with powers. Eden has no powers. 
- **Verdict:** movement as specified is *correct for the design* and *below the
  genre's pleasure bar on its own*. Every hour of dwell time rides on §6. The one
  cheap win the board unanimously recommends: invest disproportionately in the
  FEEL layer (footstep audio, breath, settle, camera weight) — it is the only
  movement pleasure this design permits itself, so it must be best-in-class.

---

## SECTION 5 — COMBAT

[TODAY] Legacy arcade combat: serviceable, generic, canon-irrelevant.

[DESIGN]
- **Weapon feel:** the C-9's burst-only discipline is a real identity decision that
  will read as "weak gun" to some testers; the design must make burst discipline
  *audibly protective* (the sapling under the fight) or it reads as limitation, not
  law. The six-family roster is small and RIGHT — **LCD:** "Six weapons with
  biographies beat sixteen with stats. Hold this line when playtests ask for more."
- **Impact/feedback:** the canon feedback suite (no numbers, no kill-pops, posture-
  honest reactions) is coherent; the risk is *under*-communication. Muted-readability
  testing is the correct gate.
- **Enemy reactions:** the drill/pair/radio grammar is the best combat idea in the
  project — institutional AI that files paperwork about you is genuinely novel.
  **The Hesitation is the single best enemy-design beat the board has seen this
  year, on paper.**
- **Difficulty/psychology:** comprehension-fear is well theorized; the danger is the
  opposite failure — with legible drills and no psychic AI, mid-skill players may
  find human encounters *easy* and machines merely puzzle-like. The design refuses
  HP inflation (correctly), so difficulty must come from doctrine density and
  covenant pressure. Untested. Flagged.
- **After 10 hours?** Split. **CD:** yes — because fights are placed, not farmed;
  scarcity preserves appetite. **LCD:** only if encounter authoring stays as good
  as the boss chapters; the middle chapters' patrol combat is where it will sag.
  Both are right; the difference is authoring stamina, which is a solo-dev risk,
  not a design property.

---

## SECTION 6 — LEVEL DESIGN

[DESIGN only — nothing built.] The Level Design Bible is the strongest single
document on the shelf; the twelve-part anatomy, the landmark five-slot law, and the
lost-state taxonomy are publishable craft. Two hard truths:

1. **The no-markers bet is the project's highest-stakes wager.** It demands
   world-class guidance execution in every hour. Studios with dedicated level
   design departments fail the Compass Test regularly. A solo developer betting the
   entire UX on architectural guidance is betting on a skill the project has not
   yet demonstrated once. The graybox gym (S001 E1) is the right first test —
   **LLD: treat the Compass Test failures you WILL get not as bugs but as the
   project's most important education.**
2. **Memorability is bought with bespoke spaces the budget can't yet see.** The
   signature spaces (chart hall, inverted nave, the acre) will be remembered if
   they are *built to their drawings*. In the web lane's asset budget, the pour's
   monumental fidelity is the open question (§11). Grey discipline compresses
   well; awe compresses badly.

Would players remember locations? The named seven — yes, if built. The connective
tissue between them is where the memory (and the boredom) risk lives.

---

## SECTION 7 — VISUAL IDENTITY

[TODAY] The live build is NEON STRIKE — saturated neon, arcade grammar, actively
*hostile* to the canon palette. Anyone screenshotting the current link sees a
different game than the bibles describe. **QA: this is a live S2-class identity
violation by the project's own law, tolerated only because the graybox replacement
is scheduled. Do not let press or community see the link before then.**

[DESIGN] The one-frame identity (pour/ration/tenant) is real, ownable, and
screenshot-distinct — brutalist megastructure games exist (NaissanceE, Blame!-
likes), but none in FPS-with-green-as-currency grammar. The palette law and the
GN two-color system give the store page a coherence most indies never achieve.
**Could it be recognized from one screenshot? The designed game: yes — that is its
single most bankable asset.** The risk is not identity but *fidelity*: the web
lane must prove board-form concrete reads monumentally on integrated GPUs, or the
identity's carrier fails (§11).

---

## SECTION 8 — NARRATIVE

[DESIGN] The board's most unanimous section: this is the project's crown.
- **Characters:** Grimwood is a top-tier antagonist ON PAPER — warmth-as-horror
  with a fair argument, undefeated in dialogue by design. Harrow, Sela, and the
  Voss negotiation are all above AAA median. June's recorder is the kind of
  device that ends up in GOTY montages.
- **The permit prompt:** the project's boldest device and its most fragile.
  **PT, hard dissent from the room's admiration:** "Twelve hours between setup
  and payoff, for an input the player was TAUGHT TO IGNORE, is a memory the
  median player does not have. If R2 lands on a player who forgot the prompt,
  your hinge scene reads as 'apparently I did a thing once.' You need two or
  three *unlabeled* reinforcements of the prompt's imagery between Ch.1 and Ch.5
  (the terminal's worn keys recurring, the form's shape in documents), or the
  best idea in the game misfires for half its audience." Board adopts this as a
  recommendation.
- **Dialogue/pacing:** sparse-by-law is right; Ch.7's twenty combatless minutes is
  the sort of confidence that earns awards and refunds simultaneously. Keep it.
- **GN sequences:** the memory-organ framing is the project's second most bankable
  asset. Single-artist dependency is a production risk (§11), not a design one.
- **Would players care/continue?** The target audience, deeply. The board notes
  the cast size (14 named + VO recitation) is a real cost concentrated late —
  affordable only because dialogue is sparse. Hold the sparseness.

---

## SECTION 9 — EMOTIONAL EXPERIENCE

[DESIGN] The sixteen-station journey is the most rigorous emotional spec the board
has reviewed; the budgets (three gasps, fourteen breaths, silence law) are
enforceable, which is rare. Honest failure predictions:
- **Wonder:** depends entirely on asset fidelity at three moments. Budget-protect
  the acre, the chart hall, the valley above ALL other art spend.
- **Fear:** comprehension-dread is achievable in grey; the D-2's indifference will
  land. Confidence: high.
- **Isolation/melancholy:** the stillwood bed and the 25-minute human-trace ceiling
  are well designed; the risk is boredom masquerading as melancholy (§2). The
  difference is authored density; the plan knows it; execution unproven.
- **Hope:** manual-hope (working hands, the dawn) is the design's most reliable
  emotion — it is cheap, staged, and repeatable. It will work.
- **Reflection:** the no-objective epilogue will produce the intended feeling FOR
  FINISHERS; the design should accept a sub-50% finish rate as the cost of its
  temperament and stop nowhere short of it.

---

## SECTION 10 — ORIGINALITY (IDENTITY COMPARISON, NOT VISUALS)

- **Control:** shares institutional tone; Eden's institution is *sincere*, which is
  actually rarer. Distinct.
- **Death Stranding:** shares melancholy-of-labor and connection-as-mechanic
  (covenant ≈ strand logic emotionally). Eden's refusal of traversal mechanics
  makes it LESS original than DS in systems, more original in argument. Partial
  overlap, honestly noted.
- **Journey/Inside:** shares wordless-world trust. Eden talks more and risks more.
- **Half-Life:** the environmental-narration lineage is directly inherited; Eden
  adds the ledger/paperwork lens, which is its own.
- **Portal:** no overlap beyond tutorial-subversion kinship (the permit prompt is
  a darker GLaDOS-test inversion; genuinely fresh use).
- **The Last of Us:** shares grief-forward pacing; Eden refuses TLOU's violence-
  as-theme, replacing it with violence-as-procedure. Distinct.
- **Dune (requested):** shares scale-as-theology and the ambient-orchestra
  register. Aesthetic kinship only.
- **Dark Souls:** shares world-tells-history and boss-as-idea; Eden's bosses argue
  instead of test. Distinct where it matters.
- **Verdict:** the identity is real: **the gardener with a gun — an FPS whose
  every system prices life.** No shipped game owns this square. The moods are
  assembled from the canon's admitted influences; the verbs (covenant, Read,
  filing, the held lever) are original. Score honestly: original synthesis, not
  original atoms — which is what "original" has meant in games for twenty years.

---

## SECTION 11 — TECHNICAL FEASIBILITY

**TD's section; PROD co-signs every number.**
- **Scope math:** the slice plan (~160 h) is achievable and well-built. The full
  campaign is where the fiction lives: 10 chapters × (level + dress + encounters +
  audio + GN + QA) at even HALF the slice's cost per chapter = **2,500–4,000
  solo hours ≈ 3–5 calendar years** with life included. The bibles' own tranche
  plan admits the re-scope gate; the board says now what the gate will say later:
  **the full campaign as a single solo release is not credible. Ship Act I.**
- **Web-lane ceiling:** monumentality on integrated GPUs is the open technical
  question. Instancing + one-light discipline is the right strategy; the pour's
  material fidelity at 60 fps is unproven. The graybox → dressed-Acre milestone is
  the honest test; schedule it before ANY chapter commitment.
- **Asset/animation count:** the taxonomy discipline (one skeleton family,
  wear-variant units, posture-first) is genuinely budget-smart — best-in-class
  planning for a small team. The GN (7 sequences, ~60 pages, one hand) and the
  original orchestra are the two costs that cannot be self-performed; they are
  the project's only mandatory cash line items. Price them early.
- **AI complexity:** five states + doctrine layers is buildable and testable;
  the board has no feasibility concern here — only authoring-volume concern.
- **Would it realistically be completed?** As scoped: unlikely. As Act I: yes,
  plausibly within 12–18 months of disciplined solo work post-slice.

---

## SECTION 12 — FEATURE CREEP (CUT/SIMPLIFY/POSTPONE)

The project is unusually creep-resistant BY LAW — the board found less fat than
in any AAA review in memory. What fat exists:
- **Cut now:** the drivable vehicle remnant in the legacy code (canon already
  says vehicles are moving architecture — delete the driving path in Sprint 002's
  excision follow-up); the arcade legacy content entirely once the graybox lands;
  chalk-color cosmetics and journal-statistics marginalia (Tier 3 charm, zero
  loop value).
- **Simplify:** the reactive antechamber's examination matrix (the 3-node version
  IS the feature); weapon fouling/maintenance (keep the ritual, halve the states);
  the trust system's per-character scalars (three bands suffice; hidden numbers
  invite tuning holes).
- **Postpone:** NG+ (Second Printing) until after Act I ships; Standing Watch
  pages 3–6; the R-4/Jack weapon families (Act II content anyway); Steam-phase
  anything.
- **Protect absolutely (anti-creep in reverse):** the optional doors (Noor, June,
  Verge) — cheapest soul in the project; the silence budget; the six-weapon cap;
  the no-markers law (even though §6 fears it — remove it and the game loses its
  spine; the correct response to Compass failures is better spaces, not pins).

---

## SECTION 13 — TEN BIGGEST WEAKNESSES (RANKED)

1. **The game does not exist yet** — every strength below is conditional on
   execution nobody has demonstrated. *Fix: ship the slice. Cost: the ~160 h
   already planned. Nothing else on this list matters until then.*
2. **Full-campaign scope vs solo reality** (§11). *Fix: Act I as the shipped
   product, Acts II–III as explicit sequels/expansions. Cost: a planning week +
   one canon-compatible framing device (the banned book publishes in volumes —
   the fiction already supports it perfectly).*
3. **The markerless bet vs unproven level-design execution.** *Fix: the graybox
   education loop; recruit 5 rotating fresh testers NOW (the project has zero
   playtest pipeline — see #10). Cost: ongoing, cheap, non-optional.*
4. **Dwell-time risk: movement with no mechanics carrying a slow game** (§4).
   *Fix: world-class feel layer + density audits per BVI's 90-second attention
   cadence. Cost: audio/feel polish weeks, recurring.*
5. **First-30-minutes pacing vs genre expectations** (§2). *Fix: pre-authorize a
   20% Prologue tightening pass; add the UX line at the HUD defection. Cost: days.*
6. **The permit-prompt memory fragility** (§8). *Fix: 2–3 unlabeled visual
   reinforcements across Act I. Cost: days; enormous payoff insurance.*
7. **Combat variety ceiling across hours 6–10** (§3/§5). *Fix (if Act I framing
   adopted, largely dissolves — Act I is 4 chapters); otherwise: covenant
   modifier system passes at tranche gates. Cost: design weeks.*
8. **Web-lane monumentality unproven** (§11). *Fix: the dressed-Acre fidelity
   milestone before chapter commitments. Cost: 2–3 weeks, already implicit.*
9. **Two mandatory cash dependencies (GN hand, orchestra)** with no budget
   attached. *Fix: price both now; scope GN pages to Act I count; the ambient
   register allows a smaller ensemble than "orchestra" implies. Cost: quotes are
   free; the line items are four figures each, minimum.*
10. **No playtest pipeline for a design whose gates are playtest-verified**
    (exit-words, Compass, fun-ugly). *Fix: standing 5-tester rotation +
    telemetry hooks in the slice (already planned; make them real). Cost: low;
    without it every canon gate is theater.*

## SECTION 14 — TEN BIGGEST STRENGTHS

1. **The covenant verb** — protect-the-pointable inverts the FPS's oldest loop;
   it is the game in one mechanic. *Amplify: make every covenant's protected
   thing narratively specific (never "a sapling" — THIS sapling).*
2. **The permit prompt** — tutorial-as-crime is award-lecture material. *Amplify:
   the §13.6 reinforcements.*
3. **The GN memory organ** — cutscenes as the resistance's own banned record is
   identity, economy, and marketing in one system. *Amplify: publish real pages
   as the marketing campaign (the fiction begs for it).*
4. **The one-frame identity** — pour/ration/tenant is ownable at thumbnail size.
   *Amplify: enforce the histogram tool from the first dressed scene.*
5. **Institutional AI** — drills, radios, filing, the Hesitation. *Amplify: let
   players SEE the paperwork (the cordon revisits are the payoff; never cut
   them).*
6. **The boss quartet as ideologies**, crowned by a finale that refuses to be a
   fight. *Amplify: protect the ten seconds from every future "improvement."*
7. **The silence/audio law** — designed absence as antagonist; four empty bars
   as signature. *Amplify: hire the audio talent early; this is where the
   doubled budget should go first (§16).*
8. **Grimwood** — a fair antagonist the player almost joins. *Amplify: cast
   early, record the recitation once, build scenes around the voice.*
9. **The canon-discipline apparatus itself** — laws-as-acceptance-tests is why
   this project CAN survive years without drifting. *Amplify: keep canon
   violations as S2 bugs forever.*
10. **The link-first delivery** — instant-play distribution matches the game's
    quiet-recommendation growth model perfectly. *Amplify: the slice as
    perpetual free demo; never paywall the first 30 minutes.*

## SECTION 15 — THE 30% CUT (MANDATED SCENARIO)

The board's cut, protecting identity: **ship "ECHOES OF EDEN — Act I: Debit" as
the complete first product** (Prologue–Ch.3 + a compressed R1 beat, the Standing
Watch with 2 pages, GN-1/2/3). This cuts ~60% of content scope while cutting ~0%
of identity — every pillar (covenant, permit prompt, GN, silence, the Wardenry)
is fully present; the D-2 becomes Act I's climax boss (its chapter placement
survives intact as the act's finale). Acts II–III become funded sequels IF Act I
earns them — which is also the honest test of every §13 risk. What else goes in
the 30%: NG+, Watch pages 3–6, fouling depth, antechamber matrix, marginalia
stats (§12). **Would the cut improve the game? Yes — materially.** A finished,
polished Act I beats an abandoned masterpiece by an infinite margin, and this
fiction UNIQUELY supports episodic publication (a banned book, printed in
volumes, is more canon-true than a complete tome).

## SECTION 16 — THE DOUBLED BUDGET

Priority order, with reasoning:
1. **Audio** (the sigh, the beds, the motif ledger, VO for Grimwood/Sela) — the
   identity's cheapest-per-emotion carrier and the layer movement/silence lean on.
2. **The GN** (more pages, the one hand on retainer) — narrative, marketing, and
   memory in one spend.
3. **The three wonder moments' art fidelity** (acre/chart hall/valley) — the
   entire awe budget lives in three rooms; gold-plate exactly those.
4. **Playtesting** (a real rotating lab) — every canon gate needs it.
5. **NOT combat, NOT more weapons, NOT more enemies, NOT cinematics beyond the
   locked eight.** The design's restraint is the product; money must not soften it.

## SECTION 17 — THE STEAM TEST

Capsule (the walking-into-threshold poster): strong, distinct, honest — top
decile of indie capsules as specced. Screenshots: pass IF from the shot library;
the current link's arcade look must never appear on the page (§7). Trailer
("Still Here", GN-led): memorable; the one-unbroken-take gameplay trailer is a
conversion gamble the board endorses. Description: must lead with "quiet,
deliberate, single-player" in the first line — honesty is the refund shield.
**Would players buy?** Wishlist conversion above genre median on identity;
**refunds:** elevated risk from FPS-tag tourists; mitigated by the free slice
demo (the correct move — let the wrong audience self-select out free).
**Overwhelmingly Positive?** No — by design. This temperament earns
**Very Positive (88–92%)** with a devoted core and a "boring/pretentious"
negative tail. The board considers that tail a badge; plan community messaging
accordingly.

## SECTION 18 — THE PUBLISHER TEST

- **Sony:** no. Scope-stage mismatch (they enter post-vertical-slice with teams,
  not pre-slice solos). The *concept* fits their prestige-single-player brand.
- **Microsoft:** no as funding; plausible as a Game Pass day-one deal AFTER Act I
  exists (quiet games perform well in subscription contexts — low friction
  matches the temperament).
- **Epic:** no (portfolio mismatch; they fund UE showcases and live-service).
  EGS exclusivity money post-slice: possible, canon-irrelevant.
- **Annapurna:** the obvious temperament match — and they fund *teams with
  shipped-title track records*. Verdict: a genuine target AFTER the slice + a
  team-of-two-or-three exists. The pitch deck is already written; it's called
  Book 0.
- **Devolver:** no. Tone mismatch (their brand is loud irony; this is sincere
  quiet). They'd pass with a compliment.
- **505:** maybe — they take mid-size narrative risks (Control publishing
  lineage). Post-slice conversation worth having.
- **Board consensus:** no publisher exists for this project TODAY, and that is
  not an insult — it is the definition of pre-slice. The slice converts two
  doors (Annapurna, 505) from closed to real.

## SECTION 19 — THE AWARD TEST

- **Art Direction:** legitimate long-list contender IF fidelity lands — the
  one-frame law is exactly what that jury rewards. Indie-scale realistic.
- **Best Narrative:** the permit prompt + the audit-not-death finale are
  nomination-grade devices; competing against AAA narrative budgets, a long
  shot with real upset potential in indie-weighted years.
- **Best Independent Game:** the honest target category. Achievable with an
  Act I of Inside-level polish. Polish is the entire condition.
- **Best Audio:** the silence-forward design is either a nomination or
  unnoticed — this category rewards exactly this ambition when executed by
  professionals; see §16 priority 1.
- **Best Debut:** yes — the category this project should be built to win.
- **Reality check (PROD):** zero awards are won by designs. The board notes the
  project's award ceiling is high and its award floor — like everything else —
  is the slice.

## SECTION 20 — FINAL SCORECARD (out of 10; two honest columns)

| Category | As designed | Playable today |
|---|---|---|
| Gameplay (loop design) | 8 | 4 |
| Combat | 7 | 5 |
| Movement | 6 | 5 |
| Level design | 9 | 2 |
| Architecture (as identity) | 9 | 2 |
| Visual identity | 9 | 3 |
| Story | 9 | — |
| Characters | 8 | — |
| Replayability | 5 | 3 |
| Originality | 8 | 3 |
| Technical feasibility (as scoped / as Act I) | 4 / 7 | — |
| Production risk (10 = safe) | 3 | — |
| Commercial potential (as Act I + demo) | 7 | 1 |
| Overall vision | 9 | — |
| **Overall execution to date** | — | **2** |

*No score inflated. The 9s are earned on paper and worthless until the 2 moves.*

## SECTION 21 — THE CREATIVE DIRECTOR'S LETTER

You asked for no protection, so here it is without any.

**What is genuinely special:** the covenant, the permit prompt, the banned book,
the ten seconds at the governor, and the discipline of your law system. I have
sat in real greenlight rooms for fifteen years and I would remember this pitch
next week — that is rarer than you think. Grimwood is the best antagonist brief
I've read in years. "One valley." / "One more than you were leaving." is a
shipped-game-quality ending, already.

**What is average:** the movement, judged as a system — it is a delivery vehicle
for level design you haven't proven you can build. The mid-game combat variety.
The replay story. The publisher story, today.

**What is weak:** the ratio. Sixteen bibles, two sprint plans, one review — and
the playable build is still last year's arcade prototype wearing your title. You
are world-class at the part of game development that feels like progress and
unproven at the part that is progress. The permit prompt works as a device
because filing paperwork FELT like the job. Do not let writing bibles feel like
making the game. This review — the one you asked for tonight instead of asking
for Z1 — is itself the pattern. I say that with respect: the shelf is genuinely
excellent, and it is done. Stop sharpening. Cut.

**What should be removed:** the full-campaign promise, this year. Reframe to
Act I: Debit as the product, in the ledger, this week. Everything in §12's cut
list. And remove "Sprint 00X is completed" from your vocabulary until the tag
exists — your own Canon Office would file that as an S2.

**What should never change:** the six-weapon cap. The silence budget. The
no-markers law. The sapling being damageable by you and no one else. The finale
having no health bar. The losses staying felt — including the loss of scope
you're about to choose.

**If this were my game, what would I do next?** Tomorrow, Z1. This week, the
timing table green in CI. This month, the covenant grey-box answering the only
question that matters: *is it fun ugly?* If yes — and I give it honest odds,
because the verb is real — you have a game, an Annapurna meeting, and a shot at
Best Debut. If no, you'll have learned it for 160 hours instead of 4,000, and
the bibles will still be there, waiting, like the Ledger — needing you not
innocent, but planting.

Ship the slice. Then we'll do Review Board 002, and I hope it's the one where
we get to be wrong about you.

*— The Board. Confidential. Filed.*
