# Architecture

## Big picture

```
┌───────────────────────────── Browser ──────────────────────────────┐
│                                                                     │
│   React (UI overlays)            Three.js engine (imperative)       │
│   ────────────────────           ──────────────────────────────     │
│   MainMenu / Settings            Engine  ── renderer + postFX       │
│   Lobby / HUD / Pause            Input   ── pointer-lock/keys       │
│   GameOver / Credits             Arena   ── brutalist city + wx     │
│        │      ▲                  Player  ── FP movement             │
│        │      │ subscribe        Weapons ── data-driven guns        │
│        ▼      │                  Enemies ── AI + net enemies        │
│   ┌──────────────────┐           Waves   ── SP director            │
│   │  Zustand store    │◀── writes │ Effects ── tracers/decals       │
│   │  (screen, HUD,    │  each     │ Net    ── socket.io client      │
│   │   settings, mp)   │  frame    │ Game   ── orchestrator          │
│   └──────────────────┘           └────────────┬──────────────┘     │
│                                                │ socket.io          │
└────────────────────────────────────────────────┼───────────────────┘
                                                  ▼
                          ┌───────────────── Node server ─────────────┐
                          │  index.ts   express + socket.io + loops    │
                          │  RoomManager  registry + code generation   │
                          │  Room         authoritative state + coop AI │
                          └────────────────────────────────────────────┘
```

## The React ⇄ engine boundary

The **engine never imports React**. It is plain TypeScript driving a canvas.
The **only** channel between them is the Zustand store (`src/store.ts`):

- The engine writes HUD values (`setHud`) every frame and reads settings
  (sensitivity, keybinds, quality) on demand via the non-reactive `store.get()`.
- React components subscribe with `useStore(selector)` and re-render only the
  widgets whose slice changed.
- `App.tsx` owns the imperative `Game` instance (via a ref) and translates UI
  intent (start/pause/quit/host/join) into engine lifecycle calls.

This keeps the 60 fps render loop off React's reconciler while still getting a
declarative, hot-reloadable UI.

## Engine module responsibilities

| Module | Responsibility |
| --- | --- |
| `Engine` | WebGLRenderer, scene/camera, `EffectComposer` (RenderPass → UnrealBloom → OutputPass/ACES), the RAF loop, FPS metering, quality presets. |
| `Input` | Pointer-lock mouselook, keybind-mapped actions, trackpad drag-look + arrow-key fallback, ADS/fire/reload intent. |
| `Audio` | Procedural Web Audio SFX (oscillators + noise); event API (`shoot`, `impact`, `reload`…). |
| `Arena` | Seeded procedural city (towers, instanced windows, pillars, sky bridges, cover), box colliders tagged by material, weather + day/night. |
| `Player` | Movement state machine, swept AABB collision with step-up/vault, camera composition (eye height, bob, lean), network flags. |
| `Weapons` | `WEAPONS` stat table + `WeaponController`: ammo, recoil, ADS, fire modes, reload, procedural view-model, hitscan resolution. |
| `Enemies` | `ENEMY_TYPES` + AI state machine (local) and server-reconciled rendering (co-op). |
| `WaveManager` | Single-player wave composition + difficulty scaling + boss cadence. |
| `Effects` | Pooled transient visuals: tracers, muzzle flashes, material impacts, explosions. |
| `Net` | Typed socket.io wrapper: connect, room create/join, ping, emit helpers. |
| `Game` | The orchestrator — instantiates everything, runs `update(dt)`, resolves shots→damage→score→HUD, manages vitals/pickups/death, and (MP) sends transforms + renders remotes. |

## Data flow of a single shot

```
Input.firing ─▶ WeaponController.update ─▶ fire()
   ├─ Effects.muzzle() + Audio.shoot()
   ├─ raycast(camera) vs [enemies ∪ world ∪ remote players]
   │     ├─ enemy hit   → Game.onShot → (SP) Enemies.damageLocal
   │     │                              (Coop) Net.hitEnemy → server adjudicates
   │     ├─ player hit  → Game.onShot → Net.hitPlayer (PvP)
   │     └─ world hit   → Effects.impact(material) + Audio.impact
   ├─ Effects.tracer(muzzle → hit)
   └─ applyRecoil(pitch,yaw) + Net.sendFire (visual sync)
```

## Determinism

The arena is generated from a **seed** (`mulberry32`). In multiplayer the server
picks the seed and broadcasts it in `game:started`, so every player builds the
**same city** locally without shipping any geometry.

## Rendering / performance

- Instancing for windows and pillars.
- Frustum culling (Three.js default) + a modest draw-call budget.
- Quality presets scale DPR, shadow map size and bloom.
- Transient effects and decals are capped/recycled to bound memory.

## Future work (toward the fuller AAA spec)

- Streamed **GLTF** environment/weapon assets + real PBR textures.
- **SSAO / SSR** passes; volumetric fog; light probes.
- **Ragdolls** + Rapier/Ammo physics for debris and doors.
- **Lag compensation** + server-side hit validation (anti-cheat).
- Occlusion culling + texture streaming for larger maps.
- Enemy navmesh pathfinding (currently steering + arena bounds).
