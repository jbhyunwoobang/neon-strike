# TODO — ECHOES OF EDEN MASTER BACKLOG
*Status: ⬜ open · 🟨 in progress · ✅ done · ⛔ blocked. Owner: Claude unless noted
(user). Effort: S <1 session · M 1–2 · L 3+ · XL multi-sprint.*

## CRITICAL
- ⛔ **Repo privacy decision** — P:CRITICAL · Deps: user · E:S · Owner: **user**
  decides, Claude executes. AC: bibles no longer publicly exposed (repo private OR
  docs moved to private repo; Pages implications documented).
- ⬜ **SPRINT 0 — production setup** — P:CRITICAL · Deps: privacy decision, user
  approval to resume · E:M · AC: engine decision recorded w/ rationale; repo/product
  rename plan; folder + naming conventions doc; pipeline tools list; Sprint 1 scope
  signed.
- ⬜ **SPRINT 1 — multiplayer excision + retitle** — P:CRITICAL · Deps: Sprint 0 ·
  E:L · AC: server/ removed; Net.ts/lobby/rooms/MP UI removed; Render service
  decommissioned; menus single-player only; product renamed ECHOES OF EDEN
  everywhere (repo, package, Pages, launch.json, README); legacy docs rewritten;
  build + live link verified.

## HIGH
- ⬜ **Book numbering erratum** (I/II reference "Book V weapons"/"Book VIII
  cinematics" written pre-drift) — P:H · Deps: none · E:S · AC: Lock Edition Two
  maps the final book plan; errata footers updated.
- ⬜ **BOOK VI — Gameplay/Combat Bible** (user brief) — P:H · Deps: Book 0 ·
  E:L · AC: canonical verbs (regrowth defense, carry/evac, stealth, Converter
  modes), enemy roster re-fictionalized, progression-as-perception spec.
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
