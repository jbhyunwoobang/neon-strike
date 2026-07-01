# Networking

## Transport & contract

- **Transport:** Socket.IO (WebSocket) — reliable channel with acks for
  request/response flows (create/join/ping).
- **Contract:** `server/src/protocol.ts` is the **single source of truth** for
  every event name and payload. A byte-identical copy lives at
  `client/src/shared/protocol.ts`. Both `ClientToServer` and `ServerToClient`
  maps are fully typed, so a mismatch surfaces as a **compile error** on both
  sides.

> Keeping two copies (instead of a shared workspace package) avoids monorepo
> build-linking friction. If you change one, copy it to the other
> (`cp server/src/protocol.ts client/src/shared/protocol.ts`).

## Authority model

The server is **authoritative** for the things that must not be forgeable by a
single client:

| State | Owner |
| --- | --- |
| Room membership, host, mode | Server |
| Scores, kills, deaths | Server |
| Wave counter | Server |
| Co-op enemy positions & HP | Server (simulated) |
| Respawn positions | Server |
| Player position/rotation | Client-reported, server-relayed |

Player **transforms** are trusted from the client and relayed — this is a
friendly web game, not a competitive title. Lag compensation and server-side
hit validation are intentionally **out of scope** (see ARCHITECTURE → Future
work). Hits are client-detected and reported; the server adjudicates the
*consequences* (enemy HP, kills, scores).

## Room codes & the shareable URL

- Codes are 6 chars from an **unambiguous alphabet** (`ABCDEFGHJKLMNPQRSTUVWXYZ23456789`
  — no `O/0`, `I/1`), generated in `RoomManager.generateCode()` with
  collision-retry.
- On create/join the client does `history.pushState('/room/CODE')`, producing a
  link like `https://yourgame.com/room/AB29KD`.
- Opening that link deep-loads the Multiplayer menu with the code pre-filled
  (`App.tsx` parses `location.pathname`). The SPA rewrite in your host
  (see DEPLOYMENT.md) makes the deep link resolve to `index.html`.
- Rooms are **ephemeral**: created on demand, disposed when the last player
  leaves (a 30 s janitor also reaps empties).

## Simulation loops (server)

Two fixed-rate loops in `index.ts`:

| Loop | Rate | Emits |
| --- | --- | --- |
| Transform relay | `TRANSFORM_HZ = 20` | `players:transforms` (all players in a room) |
| Enemy sim (co-op) | `ENEMY_HZ = 15` | `enemies:state`, `wave:changed`, enemy melee `player:damaged` |

The client sends its own transform at 20 Hz and interpolates remote players and
enemies toward their latest server position for smoothness between packets.

## Message lifecycle examples

**Create → lobby → start**

```
client ──"room:create"{name,mode}──▶ server         (ack → {code})
server ──"room:snapshot"────────────▶ everyone in room
host   ──"game:start"───────────────▶ server
server ──"game:started"{mode,seed,spawn}─▶ everyone   (clients build the world)
server ──"wave:changed"─────────────▶ everyone
```

**Co-op hit**

```
client ──"player:hitEnemy"{enemyId,dmg,headshot}──▶ server
server  (applies dmg; if dead: score++, "player:killed" broadcast)
server ──"enemies:state"────────────▶ everyone       (dead enemy disappears)
```

**PvP hit**

```
attacker ──"player:hitPlayer"{targetId,dmg,headshot,weapon}──▶ server
server   (TDM friendly-fire check) ── "player:damaged"{hp} ──▶ victim only
victim   ──"player:died"{killerId}──▶ server
server   ──"player:killed"(kill feed)──▶ everyone; "room:snapshot" (scoreboard)
victim   ──"player:respawn"──▶ server ── "player:respawned"{pos} ──▶ everyone
```

## Failure handling

- **Disconnect:** `leaveCurrent()` removes the player, reassigns host to the
  earliest remaining member, and disposes the room if empty.
- **Reconnect:** Socket.IO auto-reconnects, but a reconnect yields a **new
  socket id**; since rooms are keyed by live socket ids, a host that fully drops
  loses its room. For persistent sessions you'd add a rejoin token (future work).
- **Bad input:** payloads are clamped/validated server-side (name length, chat
  length, mode whitelist, room capacity).
