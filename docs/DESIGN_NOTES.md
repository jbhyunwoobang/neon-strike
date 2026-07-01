# Design Notes & Tool Integrations

This project's visual identity and intro were built with three external tools/skills
you asked for. Here's exactly how each is wired in and how to take it further.

---

## 1. `ui-ux-pro-max-skill`
<https://github.com/nextlevelbuilder/ui-ux-pro-max-skill>

An AI design-intelligence skill (161 industry design rules + 99 UX guidelines +
a pre-delivery checklist). Its **game-UI recommendations** ("HUD/Sci-Fi UI",
"Retro-Futurism", soft shadows + 200–300ms transitions) and **accessibility
checklist** were applied directly to the intro and menus:

| Skill rule | Where it's applied |
| --- | --- |
| `cursor-pointer` on all clickable elements | `.intro`, `.intro-cta`, `.btn`, `.link` (index.css) |
| Hover states, 150–300ms transitions | `.intro-cta` (`.22s`), `.btn` (`.16s`), all interactive elements |
| Visible focus states for keyboard nav | `.intro:focus-visible`, `.intro-cta:focus-visible` (ember outline) |
| `prefers-reduced-motion` respected | Full fallback block in index.css disables intro animation |
| SVG icons, never emoji | ENTER arrow + weapon HUD are inline SVG/CSS, no emoji anywhere |
| HUD / Sci-Fi game style | ember-on-concrete HUD, editorial stamps, mono readouts |
| WCAG-AA-minded contrast | bone `#e7e0d2` text on `#070607` void ≈ 15:1 contrast |

To regenerate/extend a design system with the skill, install it per its README
and query it for a "gaming / FPS, HUD-Sci-Fi" system, then fold results into
`src/index.css` tokens.

## 2. `21st.dev`
<https://21st.dev>

A community React component + template marketplace, plus a **Magic MCP** server.
The intro's **ENTER** control follows 21st.dev's "magic" animated-CTA pattern —
a shimmer sweep (`.intro-cta-shine`) with a glow-on-hover and an icon nudge —
implemented locally so it ships with zero external dependency.

**To drop in real 21st.dev components** (needs a free 21st.dev account):

- **Magic MCP** (recommended): get an API key at <https://21st.dev/magic>, then
  add the MCP server to your editor and prompt it for a component; it writes the
  component into `client/src/ui/`.
- **Registry install** (shadcn-style):
  ```bash
  cd client
  npx shadcn@latest add "https://21st.dev/r/<author>/<component>"
  ```
  Then import it in `src/ui/Intro.tsx` in place of `.intro-cta`.

Because those components are account-gated, this repo ships the pattern rather
than proprietary code — swap it in whenever you connect your account.

## 3. CodeRabbit
<https://github.com/coderabbitai>

AI code review on every pull request. Configured via **`.coderabbit.yaml`** at
the repo root — it includes path-specific review instructions for the engine
(hot-path allocations, disposal, no-React rule), the UI (this checklist), and
the server (payload validation, room cleanup, protocol sync).

**Activate it:**
1. Install the app: <https://github.com/apps/coderabbitai> → *Configure* →
   select this repository.
2. Open a pull request. CodeRabbit reviews it automatically using
   `.coderabbit.yaml` and posts a summary + inline suggestions.
3. Chat with `@coderabbitai` in PR comments to refine.

No key needs to live in the repo — CodeRabbit authenticates through the GitHub
App installation.
