# PROJECT STATE — ECHOES OF EDEN
*Persistent state file. Read at the start of every session; update at the end of every session.
Every implementation response begins with the six-line status header drawn from this file.*

---

## Project identity
- **Title:** ECHOES OF EDEN (working title, from the reference board; alternates on file: *The Long Verdance*, *Stillwood*)
- **Form:** Single-player cinematic story FPS with wave-survival combat, cutscenes, and graphic-novel visual storytelling. Downloadable app.
- **Direction change (2026-07-03):** ALL multiplayer is removed from the design — no PvP, co-op, lobby, rooms, WebSocket networking, servers, or MP UI. The existing multiplayer codebase is legacy; it will be stripped in the first implementation sprint.
- **Reference board (permanent):** `/Users/hyunwoobang/Desktop/Game Project - reference /`
- **Roadmap:** BOOK I–IX (creative bibles) → Sprint 1–4 (implementation) → Vertical Slice.

## Current milestone
**BOOK I — Universe Bible** (creative phase; no gameplay design, no code)

## Completed milestones
- Legacy arcade prototype (NEON STRIKE): engine, 5 maps, 10 weapons, wave AI, effects, audio — retained as tech foundation, multiplayer to be excised.
- Reference board reviewed in full (synopsis, Dr. Beck Grimwood, the Converter, Devastator-3000, Bioharvest Vault, The Sowers, Battle of Steelgate, architecture/typography boards).
- **BOOK I — Universe Bible, Edition One** written → `docs/bible/BOOK-I-UNIVERSE-BIBLE.md`

## Outstanding blockers
- None creative. (Implementation-phase blocker noted early: multiplayer excision touches App.tsx, Net.ts, server/ — scheduled for Sprint 1, not now.)
- Cinematic key art beyond the board: user offers GPT-Image generation on request — request images when Book VIII (cinematics) needs them.

## Files created
- `PROJECT_STATE.md` (this file)
- `docs/bible/BOOK-I-UNIVERSE-BIBLE.md`

## Files modified
- (none this session — creative phase forbids code changes)

## Next implementation target
**BOOK II — Characters & Factions Bible** (Asher Forester, Dr. Beck Grimwood, the Sowers cell, Edge Corp org chart, casting-sheet depth). After Books: Sprint 1 = strip multiplayer + retitle + story scaffold.

## Canon quick-reference (from BOOK I)
- Era: 2071. Place: the Meridian Republic (fictionalized N. America).
- The Verdance = plant bioenergy. The Converter = extraction tool. The Dimming = ecological silencing.
- Edge Corp: energy monopoly, "Concession" biomes, Wardenry enforcers. Devastator series: siege automata.
- Asher Forester: ex-Warden First Class, prosthetic left hand, defector. The Sowers: replanting resistance.
- Dr. Beck Grimwood: inventor of the Grimwood Cycle (conversion), Edge's chief scientist.
- Central question: **"If survival requires spending the living world, what exactly is being kept alive?"**
