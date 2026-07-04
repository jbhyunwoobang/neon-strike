# README FOR CLAUDE — ECHOES OF EDEN
*Permanent onboarding document for every future Claude session. This file should rarely
change. Read it before touching anything.*

---

## 1. What this project is
**ECHOES OF EDEN** — a single-player cinematic story FPS (wave-survival combat,
graphic-novel storytelling, post-industrial brutalist world), shipped as a downloadable
app. It pivoted on 2026-07-03 from a multiplayer arcade prototype ("NEON STRIKE" — this
repo's legacy name). The prototype code is a technical foundation only; its gameplay
content is **non-canon** (Canon Lock §3 rule 20).

**Vision in one line:** the quiet game, on purpose — one honest entry in a falsified
ledger. **Core philosophy:** keep the losses felt. **Central Question (never answered
in text):** "If survival requires spending the living world, what exactly is being
kept alive?"

## 2. Canon loading order (MANDATORY, every session)
1. `docs/bible/BOOK-0-MASTER-CREATIVE-BIBLE.md` — identity (load FIRST)
2. `docs/bible/BOOK-II.5-CANON-LOCK.md` — facts, rulings, glossary, canon rules
3. The domain book for the task (I universe · II narrative · III characters ·
   IV + IV-QR visual · IV.5 + IV.5-QR experience · V gameplay & systems · VI level
   design & world building · VII enemies, factions & bosses · VIII cinematics,
   storyboards & graphic novel · VIII.5 the shot library & frame law · IX production master plan · X technical design document)
4. `CURRENT_PROJECT_STATE.md` — where we are right now
Conflict resolution: **Lock rulings > Book I > Book II > later books > summaries.**
The reference board (`/Users/hyunwoobang/Desktop/Game Project - reference /` — note the
trailing space) is supreme for *visuals only*; its draft copy text is superseded.

## 3. Session protocol
- Begin every implementation response with the six-line status header:
  **Current milestone / Completed milestones / Outstanding blockers / Files created /
  Files modified / Next implementation target** (source: `PROJECT_STATE.md` +
  `CURRENT_PROJECT_STATE.md`).
- End every working session by updating `CURRENT_PROJECT_STATE.md`, `CHANGELOG.md`,
  and (if canon was added) `PROJECT_STATE.md`'s amendment ledger.
- During BOOK phases: **no code changes.** During SPRINT phases: code freely within
  the rules below.
- New canon may only resolve documented UNKNOWNs and must be logged (Lock rule 20.20).
- Never resolve the eight Open Questions (Lock §19) without explicit user sign-off.

## 4. Development rules
- **Do not contradict canon.** When code and canon disagree (names, dates, palette,
  rules), canon wins; file an erratum if canon itself conflicts.
- **Modifying existing systems:** read the file first; keep the module's established
  style; typecheck (`npx tsc --noEmit` in `client/` and `server/`); verify observable
  changes in the preview before claiming success; production-build before push.
- **Introducing new systems:** justify against a Book or TODO.md entry; smallest
  honest version first; wire into existing managers (Game.ts orchestrates; React
  only via the Zustand store); log in CHANGELOG.md.
- **Consistency:** the visual/experience/gameplay checklists (IV-QR §final, IV.5-QR p.9, Book V §17–18, Book 0
  §14) apply to *implemented* scenes, not just concept art. The green-ration and
  palette laws bind the runtime too.
- **Legacy quarantine:** multiplayer code (server/, client Net.ts, MP UI) is
  scheduled for excision in Sprint 1 — do not extend it; the legacy arcade maps/
  enemies/weapons may be re-derived only through re-fictionalization per canon.

## 5. Engine & coding philosophy
- **Current prototype:** TypeScript + Three.js + React + Zustand (client),
  Node/Express (server — to be removed). Style: documented module headers,
  imperative engine classes bridged to React only via the store, comments explain
  constraints not narration.
- **Engine decision happens at Sprint 0** (owner: user). The bibles' UE5 sections are
  guidance, not a decision. If UE5 is chosen: **C++ for systems** (simulation, save,
  performance-critical, the Cycle/verdance model), **Blueprints for content**
  (encounter scripting, GN sequencing, UI wiring, cinematics) — with the rule that
  anything touched every frame or by save-data lives in C++, and anything a designer
  iterates daily lives in BP. Naming and folder conventions to be set in the Sprint 0
  technical design doc, derived from the bible glossary.
- Performance philosophy (engine-agnostic): the aesthetic is cheap by design — few
  lights, one volumetric idea, instanced repetition; build the compliance tools
  (green-ration histogram) early.

## 6. Git workflow
- Single branch `main`; small, complete, verified commits; imperative subject +
  wrapped body explaining what/why; end commit messages with the Claude co-author
  trailer. Push after verification, not before.
- The GitHub Pages workflow auto-deploys `client/` on push (legacy prototype's live
  link); Render auto-deploys `server/` (until Sprint 1 removes it). Watch deploys
  after pushing (`gh run watch`).
- **⚠ The repo is currently PUBLIC** — see CURRENT_PROJECT_STATE blockers before
  committing sensitive material.

## 7. How future Claude sessions should behave
Load canon in order; give the status header; do the work honestly (verify, don't
claim); log everything; update the state files; stop at phase boundaries and wait for
the user's brief. The user names each Book/Sprint — do not pre-empt their roadmap.
When a brief asks for tools that aren't connected (Blender/Unreal MCPs), say so
plainly and proceed with what exists. When canon and a request conflict, surface the
conflict — never silently pick. And when any decision is unclear, apply the
project's own test: *does it keep the losses felt?*
