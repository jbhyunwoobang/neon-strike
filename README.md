# NEON STRIKE

A browser-native, **AAA-inspired first-person shooter** set in a futuristic
brutalist megacity (2095). Wave-survival single player and online multiplayer
(co-op survival + PvP), running entirely in the browser and shareable by URL.

Built with **Three.js + React + TypeScript** on the front end and an
**authoritative Node.js + Socket.IO** server on the back end.

![menu](docs/menu.png)

---

## ✨ Features

**Rendering & world**
- Custom Three.js engine: postprocessing pipeline (bloom + ACES filmic tone
  mapping), exponential fog, dynamic shadows, PBR materials.
- Procedurally-generated brutalist city (seed-shared across a room): monolithic
  concrete towers with instanced windows, cantilevers, steel pillars, sky
  bridges, cover, emergency lighting and drone wreckage.
- Dynamic weather + day→night cycle: rain, lightning, moving key light.

**Gameplay**
- Responsive FP controller: walk, sprint, crouch, **slide**, jump, auto
  step-up, ledge **vault**, lean, head-bob, weapon sway, landing feedback.
- Data-driven **weapon system** (9 weapons): pistol, SMG, AR, battle rifle,
  DMR, sniper, LMG, shotgun, knife — each with unique recoil, spread, ADS,
  fire modes (auto/semi/burst), reloads, tracers, muzzle flash and
  material-aware impacts (concrete/metal/glass).
- **Enemy AI**: grunts, ranged soldiers, shields, flying drones, heavies and
  bosses; approach/strafe/attack state machine; headshots; escalating waves
  with a boss every 5th wave.
- Health + armor, ammo/health pickups, score & persistent best score.

**Multiplayer**
- Authoritative rooms with shareable `/room/CODE` links.
- Modes: **Co-op Wave Survival**, **Free-For-All**, **Team Deathmatch**.
- Synced player transforms, shooting, kills/deaths, respawns, wave state;
  kill feed, Tab scoreboard, lobby chat, live ping.

**UX**
- Polished main menu, settings (sensitivity, FOV, volume, quality, keybinds —
  all persisted), pause menu, game-over summary, credits.
- Fully procedural audio (Web Audio API) — **zero asset downloads**, loads in
  seconds.

---

## 🚀 Quick start

```bash
# 1. Install (client + server)
npm run install:all        # or: cd client && npm i ; cd ../server && npm i

# 2. Run both dev servers
npm run dev:server         # http://localhost:8080  (authoritative game server)
npm run dev:client         # http://localhost:5173  (Vite dev server)

# 3. Play
open http://localhost:5173
```

Single Player needs no server. For Multiplayer, point the client at the server
with `client/.env`:

```
VITE_SERVER_URL=http://localhost:8080
```

See **[docs/INSTALL.md](docs/INSTALL.md)** for details and
**[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** to ship it (Vercel + Render).

---

## 🎮 Controls

| Action | Key |
| --- | --- |
| Move | `W A S D` |
| Look | Mouse (click to lock) · trackpad drag · arrow keys |
| Fire / Aim | `LMB` / `RMB` |
| Sprint / Crouch / Slide | `Shift` / `Ctrl` / `C` |
| Jump / Vault | `Space` |
| Lean | `Q` / `E` |
| Weapons | `1`–`9`, mouse wheel |
| Reload / Fire mode | `R` / `V` |
| Scoreboard / Pause | `Tab` / `Esc` |

All binds are remappable in **Settings**.

---

## 🗂 Project structure

```
neon-strike/
├── client/                 # React + Three.js front end (Vite)
│   ├── src/
│   │   ├── engine/         # imperative game engine (framework-free)
│   │   │   ├── Engine.ts       # renderer + postprocessing + loop
│   │   │   ├── Input.ts        # pointer-lock / keyboard / trackpad
│   │   │   ├── Audio.ts        # procedural Web Audio SFX
│   │   │   ├── Arena.ts        # brutalist city generation + weather
│   │   │   ├── Player.ts       # FP movement controller
│   │   │   ├── Weapons.ts      # data-driven weapon system
│   │   │   ├── Enemies.ts      # AI + local/networked enemies
│   │   │   ├── WaveManager.ts  # single-player wave director
│   │   │   ├── Effects.ts      # tracers, decals, particles
│   │   │   ├── Net.ts          # Socket.IO client wrapper
│   │   │   └── Game.ts         # orchestrator (ties it all together)
│   │   ├── ui/             # React overlays (menu, HUD, lobby, …)
│   │   ├── shared/protocol.ts  # network contract (mirror of server)
│   │   ├── store.ts        # Zustand state + persisted settings
│   │   └── App.tsx         # screen router + engine lifecycle
│   └── vite.config.ts
├── server/                 # Node + Socket.IO authoritative server
│   └── src/
│       ├── index.ts        # express + socket.io wiring + sim loops
│       ├── RoomManager.ts  # room registry + code generation
│       ├── Room.ts         # one authoritative room + co-op enemy sim
│       └── protocol.ts     # network contract (source of truth)
└── docs/                   # install / deployment / architecture / networking
```

See **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** for how the engine, React
and the server fit together, and **[docs/NETWORKING.md](docs/NETWORKING.md)**
for the netcode + room-code design.

---

## 🔭 Scope & honesty

This is a **polished indie-scale game with AAA-inspired systems**, not a literal
photorealistic AAA title — those require gigabytes of licensed art, mocap and
an engine team. To keep the whole game loading in seconds and running in a
browser, some things are deliberately stylised-toward-realism rather than
ground-truth photoreal:

- Geometry is procedural (boxes/instances) with PBR materials, bloom and fog —
  not streamed megatexture photogrammetry.
- Audio is synthesised, not recorded.
- Netcode is authoritative for scores/kills/waves and relays transforms, but
  does **not** implement lag compensation or server-side anti-cheat.

Everything listed under **Features** is actually implemented and playable. See
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) → *Future work* for the roadmap
toward the fuller spec (GLTF assets, SSR/SSAO, lag comp, ragdolls, etc.).

## License

MIT — fork it, learn from it, ship your own.
