# Deployment Guide

NEON STRIKE has two deployable pieces:

1. **Client** — a static bundle (`client/dist`). Host anywhere that serves
   static files (Vercel, Netlify, Cloudflare Pages, GitHub Pages, S3…).
2. **Server** — a long-lived Node process with WebSocket support (Render,
   Railway, Fly.io, a VPS…). Serverless/edge platforms that don't hold
   WebSocket connections are **not** suitable for the server.

You can deploy them **separately** (recommended) or as a **single origin**
(server also serves the client).

---

## Option A — Split deploy (recommended)

### A1. Server → Render (example)

1. Push the repo to GitHub.
2. Render → **New → Web Service** → point at the repo.
3. Settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Environment:**
     - `CLIENT_ORIGIN=https://your-client.vercel.app` (locks CORS to your client)
     - `PORT` is provided by Render automatically.
4. Deploy. Note the URL, e.g. `https://neon-strike-server.onrender.com`.
5. Health check: `curl https://neon-strike-server.onrender.com/health`.

The same recipe works on **Railway** and **Fly.io** (any host that runs a
persistent Node process and proxies WebSockets).

### A2. Client → Vercel (example)

1. Vercel → **New Project** → import the repo.
2. Settings:
   - **Root Directory:** `client`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build` · **Output:** `dist`
   - **Environment Variable:** `VITE_SERVER_URL=https://neon-strike-server.onrender.com`
3. **SPA rewrite** so `/room/CODE` deep links resolve — add `client/vercel.json`:

   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```

4. Deploy. Your game is live at `https://your-client.vercel.app`.

> Netlify equivalent: base `client`, build `npm run build`, publish `dist`, and
> add a redirect `/* /index.html 200` (via `client/public/_redirects`).

---

## Option B — Single origin (server serves the client)

Simplest to reason about (no cross-origin, one URL):

```bash
# build the client, then the server picks it up from ../client/dist
cd client && npm run build
cd ../server && npm run build && npm start
```

`server/src/index.ts` detects `client/dist` and serves it with an SPA fallback,
so `https://yourhost/room/CODE` works. Deploy just the server (with the built
client present) to Render/Railway/Fly. Set `CLIENT_ORIGIN` to your own domain
(or leave `*` for open play).

---

## Environment variables

| Where | Var | Purpose |
| --- | --- | --- |
| Server | `PORT` | Listen port (host usually injects this). |
| Server | `CLIENT_ORIGIN` | Allowed CORS origin. `*` = any (fine for hobby). |
| Client | `VITE_SERVER_URL` | Server URL the browser connects to. Baked at build time. |

## Checklist

- [ ] Server reachable at `/health`.
- [ ] `CLIENT_ORIGIN` matches the client domain (or `*`).
- [ ] Client built with the correct `VITE_SERVER_URL`.
- [ ] Deep-link rewrite configured (`/room/*` → `index.html`).
- [ ] HTTPS on both (browsers require secure contexts for pointer lock on
      remote origins).
