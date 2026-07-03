# PROJECT CHECKPOINT — 2026-07-03
## Consistency Review & Production Readiness Report
*Findings only — nothing fixed automatically, per instruction. Each item carries a
recommendation; execution awaits approval.*

---

## STEP 2 — CONSISTENCY REVIEW

### A. Duplicates & overlaps
1. **PROJECT_STATE.md vs CURRENT_PROJECT_STATE.md** — intentional division declared
   (amendment ledger vs production snapshot), cross-referenced in both. Risk: drift.
   *Recommendation:* keep both; the six-line header draws milestones from
   CURRENT_PROJECT_STATE and canon amendments from PROJECT_STATE; review both at
   session end.
2. **Quick references duplicate their parents by design** (IV.5←IV, V.5←V, 0←all).
   Authority chains are printed in each; acceptable. *Recommendation:* when a parent
   book is amended, its quick reference must be regenerated in the same session.
3. Reference-board caption text duplicated across two board sheets (Sowers/Steelgate)
   — already ruled a drafting artifact (Lock §21-J). No action.

### B. Contradictory / drifted documentation
4. **Book numbering drift (real, needs erratum):** Book I §VII.2 promises "Book V
   (weapons) will detail"; Book II appendix references "Book VIII (cinematics)";
   Book III's next-target note guessed Book IV would be gameplay. The Experience
   Bible then took slot V (user's "book 4.5" brief). *Recommendation:* Canon Lock
   Edition Two adds a book-plan map (VI Gameplay · VII Level · VIII Cinematic/Audio —
   subject to user's roadmap) and errata footers in Books I–II re-pointing the two
   stale references. Logged in TODO (HIGH).
5. **Legacy root README.md + docs/ (ARCHITECTURE, DEPLOYMENT, NETWORKING, INSTALL,
   DESIGN_NOTES)** describe the multiplayer arcade game — factually correct for the
   prototype, contradictory to the project's stated identity for any newcomer.
   *Recommendation:* rewrite during Sprint 1 (retitle task); until then
   README_FOR_CLAUDE.md is the authoritative entry point (it says so).
6. **PROJECT_STATE quick-reference** retains a couple of pre-Lock phrasings
   (e.g., lowercase-verdance rule applied but older wording above it). Minor.
   *Recommendation:* sweep during the Lock Edition Two pass.

### C. Outdated / unused
7. **server/ + client MP stack (Net.ts, lobby/room/MP-menu UI, protocol.ts pair)** —
   scheduled for Sprint 1 excision; currently still deployed (Render) and reachable.
8. **render.yaml + client/.env.production** — become obsolete with excision;
   the Render service should be decommissioned deliberately (it auto-deploys on
   every push today).
9. **Legacy launch.json entries** named neon-strike-*; fps-game entry from an
   unrelated project also present in user-level config.

### D. Naming inconsistencies
10. **Repo/product mismatch:** repo, package names, Pages URL, in-game title all say
    NEON STRIKE; project is ECHOES OF EDEN. *Recommendation:* single rename pass in
    Sprint 1 (repo rename keeps GitHub redirects; Pages URL changes — the old live
    link will break; decide sunset-or-keep first).
11. **Reference-board folder name has a trailing space** ("…reference ") — fragile in
    scripts/tools. *Recommendation:* keep the original untouched (it is the user's),
    but archive a copy under a safe name (TODO MEDIUM).
12. Bible file naming is consistent (BOOK-N-… pattern) including the .5 conventions.

### E. Broken / fragile references
13. The two stale forward references from B.4 (Books I/II → "Book V/VIII").
14. Book III GPT-prompt suites reference board-final designs — correct, but the
    board lives outside the repo on one machine (single point of failure).
    *Recommendation:* archival copy (see D.11), private.
15. Memory files (assistant-side) reference the pivot correctly; legacy neon-strike
    memory retained deliberately for prototype-tech recall.

### F. Potential future problems (flagged early)
16. **IP exposure (CRITICAL):** the repo is PUBLIC; all nine bibles — the entire
    franchise design — are publicly readable and indexed. Also the live prototype
    shares the future game's lineage publicly. *Recommendation:* user decision now:
    (a) make repo private (Pages link dies; simplest), or (b) split: private repo
    for docs/bible + state files, public stays code-only, or (c) accept exposure
    knowingly. Everything else in this report is smaller than this.
17. **Engine fork risk:** bibles carry UE5 guidance while the working prototype is
    Three.js. The longer Sprint 0 is deferred, the more prototype-specific work
    risks being throwaway. *Recommendation:* make the engine call the first act of
    resumption.
18. GN pipeline (an in-world artist's hand, mixed fingerprint) is a hiring/pipeline
    problem with long lead time — plan at Book VIII, not later.
19. VO scale: the 400-binomial recitation + full cast sheets imply real casting
    budget; the script database (motifs, daily sentences) should be structured data
    from day one to avoid re-keying.
20. Canon governance under speed: canon debt compounds silently — the Lock cadence
    (a .5 audit after every 2–3 books) should continue into sprints as a "code vs
    canon" audit.

## STEP 3 — PRODUCTION READINESS REPORT

**Health: STRONG (creative) / EARLY (production).** Nine internally consistent,
cross-cited canon documents with a working conflict-resolution order; a live,
typecheck-clean prototype proving the core combat loop and render mood; disciplined
state tracking; zero unresolved canon contradictions (post-Lock).

**Strengths:** identity clarity (the one-frame test and Twenty Rules make delegation
possible); the audit culture (rulings, errata, logged additions) already caught and
fixed real defects; the prototype de-risks the hardest technical unknowns (wave
combat feel, brutalist rendering on cheap budgets); reference board is genuinely
distinctive.

**Risks (ranked):** 1. public IP (act before anything else) · 2. engine decision
latency (fork risk) · 3. solo-team scope vs. AAA-scale bibles — Edition One depth is
right, but production must ruthlessly scope to the vertical slice (Book I App. C) ·
4. asset pipeline nonexistent (GN, VO, score, bespoke art) · 5. name/link churn at
retitle.

**Remaining work (macro):** privacy + Sprint 0 decisions → Sprint 1 excision/retitle
→ Books VI–VIII (gameplay/level/cinematic-audio) → vertical-slice production
(scaffold, one chapter, one GN sequence, one boss) → evaluate.

**Recommendations before continuing implementation:**
1. Decide repo privacy today (user).
2. Hold Sprint 0 as a decision sprint (engine, rename, conventions) — no feature
   code until it closes.
3. Approve the Lock Edition Two mini-pass (numbering erratum, §B.6 sweep) as the
   first creative task after resumption.
4. Choose the vertical-slice target explicitly (recommend: Prologue + Ch.1 per
   Book I App. C) so every sprint aims at one playable, feelable proof.
5. Keep the checklist culture: every implemented scene passes IV.5/V.5 checklists,
   not just concept work.

**STEP 4 — STOPPED.** No sprint begun, no new books generated, no fixes applied
beyond the four documentation files this checkpoint required. Awaiting approval.
