# Installation & Local Development

## Prerequisites

- **Node.js ≥ 18** (LTS recommended) and npm ≥ 9.
- A WebGL2-capable browser (Chrome, Edge, Firefox, Safari 16+).

Check:

```bash
node -v   # v18+ 
npm -v    # 9+
```

## 1. Get the code

```bash
git clone <your-fork-url> neon-strike
cd neon-strike
```

## 2. Install dependencies

The client and server are independent npm packages.

```bash
# Option A — one shot from the repo root
npm run install:all

# Option B — manually
cd client && npm install
cd ../server && npm install
```

## 3. Configure the client → server URL

Single Player needs no server. For Multiplayer, tell the client where the
server lives:

```bash
cd client
cp .env.example .env
# .env:
# VITE_SERVER_URL=http://localhost:8080
```

If `VITE_SERVER_URL` is unset, the client defaults to
`http(s)://<current-host>:8080`, which is correct for typical local dev.

## 4. Run

Two terminals (or use the root `npm run dev` which backgrounds the server):

```bash
# terminal 1 — authoritative game server (port 8080)
cd server && npm run dev

# terminal 2 — Vite dev server (port 5173) with HMR
cd client && npm run dev
```

Open <http://localhost:5173>.

- **Single Player** → drops straight into wave survival.
- **Multiplayer → Create Room** → you get a room code + shareable
  `http://localhost:5173/room/CODE` link. Open that link in another
  tab/device on the same network to join.

## 5. Production build (local check)

```bash
# client → static bundle in client/dist
cd client && npm run build && npm run preview   # serves on :4173

# server → compiled JS in server/dist
cd ../server && npm run build && npm start
```

When `client/dist` exists, the server will also **serve the built client** from
its own origin (single-origin deploy) — see [DEPLOYMENT.md](DEPLOYMENT.md).

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `Cannot reach server` in MP menu | Server not running, or `VITE_SERVER_URL` wrong. Confirm `curl http://localhost:8080/health`. |
| Black screen on match start | GPU/WebGL blocked. Try another browser; lower **Settings → Quality**. |
| Low FPS | Settings → Quality → **Low/Medium**; close other GPU-heavy tabs. |
| Mouse won't lock | Click the canvas once; some browsers require a user gesture. Trackpad users can drag or use arrow keys. |
| Room "not found" when joining | Rooms are ephemeral — the host must be online. Re-host if the host left. |
