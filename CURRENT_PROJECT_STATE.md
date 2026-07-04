# CURRENT PROJECT STATE — ECHOES OF EDEN
*Live production snapshot. Always describes NOW. Updated at the end of every session.
Division of labor: this file = production state; `PROJECT_STATE.md` = canon-amendment
ledger + session-protocol source. Last updated: 2026-07-04 (S004 FE-BLOCK SHIPPED: the Front-End Suite live — title/sign/foreword/registry/cast/end-card, all on the author's art).*

## Phase & milestone
- **Production phase:** Pre-production — creative foundation COMPLETE; checkpoint done;
  **awaiting user approval to begin implementation phase (Sprint 0).**
- **Current milestone:** SPRINT 004 IN EXECUTION — **THE FRONT-END SUITE IS LIVE** (FE1–FE5, FE7): TitleScreen (author key art, 'BY JASON BANG'), SIGN THE LEDGER (the 'login' — name into the journal, feeds 'the ledger remembers, ___'), the FOREWORD (3 banned-book pages, synop1 text verbatim, skippable), THE REGISTRY (6-entry lore codex on project-* art w/ board captions), THE CAST (4 dossiers), the demo END CARD ('The Acre Stands' + signed name + share-the-link CTA). Author art optimized to 1.8MB webp/jpg in client/public/art. Full flow verified live: title→sign('Jason')→menu→registry→foreword→game→covenant win→endcard, 0 console errors. Remaining FE: FE6 settings reskin, loading frames. Prior plan: (`docs/sprints/SPRINT-004-PLAN.md` — the publisher-quality Vertical Slice: Block Y (S003 remainder) + FRONT-END SUITE (title/intro/foreword/codex/cast/profile — the author's art canon for the front-end: 2025-01-17_3.49.12.png = key art; project-* files = codex/cast assets; synop1 = the foreword) + the 10-LOCATION PROLOGUE (L01 Ridge Road → L06 the Incident → GN-1 → L07–L10 Grey Noon) + the D-2 Incident boss set-piece + GN-1 + final passes + external playtest + demo build; 168h nominal; K3 living-canopy gate first; 'level 2' = the four-axis progression mapping (acquisition/verbs/perception-rank/trust — no XP LAW). Exit = v2.5.0-slice at the link. S003 status: F1 ✅ GO · **P1 ✅** (core/interact: universal press/hold framework — duration is the moral grammar; honest holds; once-latches; 5 tests) · **P2 ✅** (paper DocumentReader — Registry-drawer facsimile grammar; store.reading) · **K1/K2 ✅ v1** (content/kits: shared baked materials + 12 Gravity module factories + seeded stillwood trunks) · **Acre dressed** (board-form on all pour masses, stillwood trunk colonnades, the cordon incident slip readable in-world; Ch.1 grade anchor adopted) · **bug fixed:** spawn faced away from the arena (yaw π→0 — the read-vantage law restored). All verified live: covenant starts via framework hold, slip opens the reader mid-covenant, 0 console errors. NEXT: L-zone production (stillwood approach → nest), S1 checkpoint loop, A1 audio beds. Prior: **F1 FIDELITY GATE: GO** (2026-07-04). Verdict: procedurally-baked board-form concrete (plank rows, lift seams, tie-holes w/ rust weeps, stain tongues, bloom) and stillwood bark ('a cast of a tree' — mineral flutes, checks, root flare) pass the one-frame test under both light regimes at 60fps, zero console errors; harness at `?fidelity=1` (views 1/2/3). Findings logged: (1) **Engine.setGrade()** added — the per-zone manual-EV-anchor law now has its API; (2) the legacy arcade grade (hot exposure/bloom/CA smear) is WRONG for Eden — every Eden scene sets anchors (Ch.1 anchor: exposure 0.88, bloom 0.08, CA 0.00025, grain 0.10 locked); ProvingGame to adopt next. K1/K2 kit production is GREENLIT on the F1 recipe. Save foundation (Book X §10) LIVE: versioned chunks + rollback + forward-tolerance (54 tests green); world-ledger persists across sessions ("THE LEDGER REMEMBERS"). Prior: SPRINT 002 IN EXECUTION — **THE FIRST GAMEPLAY LOOP IS PLAYABLE**: "The Acre — Covenant Proving" ships from the main menu (ridge read → plant hold-verb → staged Warden arrivals → drill/radio/five-states live in 3D → bank waits for the fight → win/fail-retry; the sapling is the frame's only green; LAW 4-D live). Integration caught + fixed a real director bug (same-tick wave resolution) — now a tested law. Prior: **the systems core is landed and tested** (Z1 tree; Z2 locomotion state machine + THE TIMING-TABLE TEST; W1/W2 weapon framework + Arsenal C-9; W4–W6 damage pipeline + Breath/Binding vitals + plate arcs; A1–A3+A5 five-state Wardenry AI + escalation drill + radio actors + Warden First Class elite; C2 covenant wave director v1 — 47 tests, all green, in CI). All headless RULES-layer per Book X's three-layer law; render-lane integration (graybox arena, viewmodel, HUD binding) is the next execution block. S001 Phase A done; remaining Z-block items (interaction set, save chunks, UI shell, graybox stations) queue next.
- **Committed slice deliverable:** ~30-minute playable game via web link (user-directed 2026-07-04).
- **Next recommended milestone:** SPRINT 0 — production setup (see TODO CRITICAL).

## Completed
- **Books (16 — THE SHELF IS FINISHED):** 0 · I · II · II.5 · III · IV · IV-QR ·
  IV.5 · IV.5-QR · V (Gameplay) · VI (Level Design) · VII (Enemy/Boss) · VIII
  (Cinematic/GN) · VIII.5 (Shot Bible) · IX (Production Master Plan) · **X
  (Technical Design Document — 2026-07-04: dual-lane architecture, subsystem
  roster, sprint task decomposition to the link)**. All in `docs/bible/`.
  Books V–X NOT yet committed/pushed (repo privacy decision pending — Sprint 0
  deliverable #1).
- **Sprints:** none (implementation not started under the new direction).
- **Gameplay systems (LEGACY PROTOTYPE — non-canon content, reusable tech):**
  Three.js FPS engine (movement, hitscan combat, 10 weapons incl. working scopes,
  wave AI w/ 9 enemy types, 4 bosses, Rapier physics, grenades, pickups, vehicles);
  5 themed maps; procedural audio; GTAO/IBL/filmic-lens render pipeline w/ perf
  governor; HUD/menus/loadout/map-roulette; save-free session flow.
- **Technical systems:** CI (GitHub Pages auto-deploy), Render server auto-deploy
  (to be removed), preview/testing harness (`window.__ns` debug), typecheck-clean
  client+server builds.

## Current blockers
1. **REPO IS PUBLIC** with the full franchise IP (all 9 bibles) inside —
   user decision required: make private, or split docs to a private repo. (CRITICAL)
2. **Engine decision** (Sprint 0, user's call): evolve the Three.js prototype vs.
   UE5 rebuild per the bibles' guidance. Everything downstream depends on it.
3. Multiplayer excision not yet performed (scheduled Sprint 1; server still live on
   Render; MP UI still in the client).

## Current priorities (order)
1. Resolve blocker 1 (privacy) → 2. Sprint 0 decisions (engine, repo/title rename,
   pipeline) → 3. Sprint 1 (MP excision + retitle + story scaffold) → 4. remaining
   Books (VI Gameplay, VII Level, VIII Cinematic/Audio… — user names them).

## Known technical debt
- Legacy MP stack (server/, Net.ts, lobby/room UI, protocol.ts duplication).
- Repo/product name mismatch (neon-strike vs Echoes of Eden) incl. Pages URL,
  launch.json entries, package names, README.
- Rapier WASM bundle ~2 MB (fine for prototype; revisit per engine decision).
- Physics.ts dead code path (old smoke-points), duplicated grenade/lob logic.
- Book numbering drift: RESOLVED 2026-07-03 — shelf renumbered (Experience → IV.5,
  Gameplay & Systems = V); Book I/II's forward references to "Book V (weapons)" now
  correctly point at the real Book V (§4 weapon system). Residual: fold the ruling
  into Canon Lock Edition Two when it is next revised.
- Legacy docs (README.md, docs/DEPLOYMENT/NETWORKING/ARCHITECTURE/INSTALL) describe
  the arcade MP game — outdated post-pivot, scheduled for Sprint 1 rewrite.

## Known bugs
- None currently reported in the prototype (last verified build clean; live link
  functional). Legacy caveat: MP room dies if host disconnects (moot after excision).

## Missing (for the real game)
- **Assets:** all bespoke art (characters, hero props, environments per Book IV),
  GN pages, fonts licensing check, VO, score, foley (the sigh!), key art.
- **Gameplay systems:** story scaffold/chapter flow, saves, dialogue/interaction,
  companion pacing (Dez), stealth verbs (Ch.4), evacuation-carry verbs (Ch.6),
  Converter story-weapon modes, regrowth-defense as canonical mode, GN sequence
  player, journal UI, accessibility per IV.5-QR and Book V §14.
- **Cinematics:** all 8 planned + 7 GN sequences (Book VIII scope).
- **Audio:** entire canonical soundscape (motif ledger, per-district ambience,
  the recitation recording).

## Estimated overall completion
- Creative foundation: **100% — the Book I–IX roadmap is complete.** (Audio and
  UI law live inside Books IV/V/VIII rather than as separate volumes; standalone
  bibles for them are optional future work, not blockers.)
- Production: **~5%** — next milestone is Sprint 0, then Phases 1–4 to the
  committed 30-minute web link (Book IX §3).
- Production (the shippable game): **~5%** — a proven combat/rendering prototype and
  a complete design bible, but no story content implemented, engine undecided,
  asset pipeline not started. Honest read: pre-production complete, production not
  begun.
