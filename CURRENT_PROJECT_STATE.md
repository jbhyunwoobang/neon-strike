# CURRENT PROJECT STATE — ECHOES OF EDEN
*Live production snapshot. Always describes NOW. Updated at the end of every session.
Division of labor: this file = production state; `PROJECT_STATE.md` = canon-amendment
ledger + session-protocol source. Last updated: 2026-07-04 (Save foundation live — versioned chunks on disk, 54 tests; SPRINT 003 PLANNED: 'Grey Noon (Production)' — the first production-quality level).*

## Phase & milestone
- **Production phase:** Pre-production — creative foundation COMPLETE; checkpoint done;
  **awaiting user approval to begin implementation phase (Sprint 0).**
- **Current milestone:** SPRINT 003 PLANNED (`docs/sprints/SPRINT-003-PLAN.md` — "Grey Noon (Production)": stillwood approach → Taproot nest → the acre dressed; 132h nominal; F1 Fidelity Gate first). Save foundation (Book X §10) LIVE: versioned chunks + rollback + forward-tolerance (54 tests green); world-ledger persists across sessions ("THE LEDGER REMEMBERS"). Prior: SPRINT 002 IN EXECUTION — **THE FIRST GAMEPLAY LOOP IS PLAYABLE**: "The Acre — Covenant Proving" ships from the main menu (ridge read → plant hold-verb → staged Warden arrivals → drill/radio/five-states live in 3D → bank waits for the fight → win/fail-retry; the sapling is the frame's only green; LAW 4-D live). Integration caught + fixed a real director bug (same-tick wave resolution) — now a tested law. Prior: **the systems core is landed and tested** (Z1 tree; Z2 locomotion state machine + THE TIMING-TABLE TEST; W1/W2 weapon framework + Arsenal C-9; W4–W6 damage pipeline + Breath/Binding vitals + plate arcs; A1–A3+A5 five-state Wardenry AI + escalation drill + radio actors + Warden First Class elite; C2 covenant wave director v1 — 47 tests, all green, in CI). All headless RULES-layer per Book X's three-layer law; render-lane integration (graybox arena, viewmodel, HUD binding) is the next execution block. S001 Phase A done; remaining Z-block items (interaction set, save chunks, UI shell, graybox stations) queue next.
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
