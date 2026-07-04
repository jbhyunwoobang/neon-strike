# TODO — ECHOES OF EDEN MASTER BACKLOG
*Status: ⬜ open · 🟨 in progress · ✅ done · ⛔ blocked. Owner: Claude unless noted
(user). Effort: S <1 session · M 1–2 · L 3+ · XL multi-sprint.*

## CRITICAL
- ⛔ **Repo privacy decision** — P:CRITICAL · Deps: user · E:S · Owner: **user**
  decides, Claude executes. AC: bibles no longer publicly exposed (repo private OR
  docs moved to private repo; Pages implications documented).
- ⬜ **SPRINT 0 / PHASE 0 — production setup** — P:CRITICAL · Deps: privacy
  decision, user approval · E:M · AC per Book IX §3 Phase 0: privacy executed;
  Engine Gate prep (decision itself lands at slice-ship, default = web stack);
  rename plan; conventions doc; Sprint 1 scope signed.
- ⬜ **PHASES 1–4 → THE LINK** — P:CRITICAL · Deps: Sprint 0 · E:XL · the committed
  deliverable: "The Sigh & the Seedling" ~30-min playable at a public web link
  (Prologue + Ch.1 + one Standing Watch page). Full phase plan + acceptance
  criteria: Book IX §2–3, §13.
- ⬜ **SPRINT 1 — multiplayer excision + retitle** — P:CRITICAL · Deps: Sprint 0 ·
  E:L · AC: server/ removed; Net.ts/lobby/rooms/MP UI removed; Render service
  decommissioned; menus single-player only; product renamed ECHOES OF EDEN
  everywhere (repo, package, Pages, launch.json, README); legacy docs rewritten;
  build + live link verified.

## HIGH
- ✅ **Book numbering erratum** — RESOLVED 2026-07-03 by shelf renumbering (user
  ruling; Experience → IV.5, Gameplay & Systems = V; files renamed, headers errata'd).
  Residual (E:S): fold ruling into Canon Lock Edition Two at its next revision.
- ✅ **BOOK V — Gameplay & Systems Bible** (was listed as "Book VI Gameplay/Combat")
  — DONE 2026-07-03 → `docs/bible/BOOK-V-GAMEPLAY-SYSTEMS-BIBLE.md`. Covers all AC:
  canonical verbs (covenant waves, carry/evac, procedure-stealth, green-unit modes),
  encounter/boss contracts over the Lock §17 roster, progression-as-perception,
  weapons, economy, Standing Watch, saves/accessibility/balance, QC batteries.
- ⬜ **BOOK VII — Level Design Bible** (user brief) — P:H · Deps: VI · E:L.
- ⬜ **BOOK VIII — Cinematic & Audio Bible** (user brief) — P:H · Deps: II–V ·
  E:L · AC: full shot lists, GN page scripts, motif score spec; GPT-Image key-art
  requests to user where needed.
- ⬜ **Hero-prop concept set via GPT-Image** — P:H · Deps: user runs prompts (or
  approves batch) · E:M · AC: 8 hero props + Asher/Grimwood portraits + canyon/
  valley environments generated, curated into docs/art/.
- ⬜ **Story scaffold prototype** (post-Sprint 1): chapter flow, save slots
  (pressed-leaf), GN sequence player stub — P:H · Deps: Sprint 1 · E:XL.

## MEDIUM
- ⬜ Prototype cleanup: Physics.ts dead smoke path, grenade/lob dedup, protocol.ts
  single-sourcing (moot if MP removed first) — E:S.
- ⬜ Compliance tooling: green-ration histogram overlay + palette lint — E:M.
- ⬜ Accessibility pass per V.5 gates (shape-doubling, thresholds, 200% subs) — E:M.
- ⬜ Diegetic UI migration (two-hands doctrine; HUD-defection moment) — E:L ·
  Deps: story scaffold.
- ⬜ Rapier bundle strategy per engine decision — E:S.
- ⬜ Reference-board archival copy into private storage (trailing-space path is
  fragile) — E:S · Deps: privacy decision.

## LOW
- ⬜ Marketing capsule + wordmark exploration (serif treatment per board) — E:M ·
  Deps: Book VIII, privacy.
- ⬜ Memory/doc housekeeping: consolidate legacy neon-strike notes — E:S.
- ⬜ Alt-title decision record (The Long Verdance / Stillwood filed) — user, E:S.
- ⬜ Prototype live-link sunset-or-keep decision after retitle — user, E:S.
