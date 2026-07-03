# CURRENT PROJECT STATE — ECHOES OF EDEN
*Live production snapshot. Always describes NOW. Updated at the end of every session.
Division of labor: this file = production state; `PROJECT_STATE.md` = canon-amendment
ledger + session-protocol source. Last updated: 2026-07-03 (checkpoint).*

## Phase & milestone
- **Production phase:** Pre-production — creative foundation COMPLETE; checkpoint done;
  **awaiting user approval to begin implementation phase (Sprint 0).**
- **Current milestone:** Project Checkpoint ✅ · **Current sprint:** none active.
- **Next recommended milestone:** SPRINT 0 — production setup (see TODO CRITICAL).

## Completed
- **Books (9):** 0 (Master) · I (Universe) · II (Narrative) · II.5 (Canon Lock, 9
  rulings applied) · III (Characters) · IV (Visual) · IV.5 (Art Quick Ref) · V
  (Experience) · V.5 (Experience Quick Ref). All in `docs/bible/`, all pushed.
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
- Book numbering drift: Book I/II reference future "Book V (weapons)"/"Book VIII
  (cinematics)" written before V became the Experience Bible — needs erratum at next
  Lock edition (logged in checkpoint report).
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
  player, journal UI, accessibility per V.5.
- **Cinematics:** all 8 planned + 7 GN sequences (Book VIII scope).
- **Audio:** entire canonical soundscape (motif ledger, per-district ambience,
  the recitation recording).

## Estimated overall completion
- Creative foundation: **~85%** (Books 0–V.5 done at Edition One depth; Gameplay/
  Level/Audio/Cinematic books remain).
- Production (the shippable game): **~5%** — a proven combat/rendering prototype and
  a complete design bible, but no story content implemented, engine undecided,
  asset pipeline not started. Honest read: pre-production complete, production not
  begun.
