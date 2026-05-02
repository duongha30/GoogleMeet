# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from `GoogleMeet/` (the project root).

```bash
# Install all dependencies
npm run install:all

# Start all services concurrently (Vite dev server, Express, PeerJS)
npm run dev

# Start individual services
npm run dev:client    # Vite frontend on :5173, proxies /socket.io to :3000
npm run dev:server    # Express + Socket.IO on port 3000 (nodemon)
npm run peer-server   # PeerJS signaling server on port 3001

# Production build
npm run build         # Vite build → client/dist/
```

No test runner or linter is configured.

## Architecture

Three processes run in development:

| Process | Port | Purpose |
|---|---|---|
| Vite dev server | 5173 | React frontend with HMR |
| Express/Socket.IO | 3000 | Room signaling + chat relay |
| PeerJS server | 3001 | WebRTC peer discovery/signaling |

**Routes:**

| Path | Component | Purpose |
|---|---|---|
| `/` | `Home.jsx` | Create or join a meeting |
| `/:roomId` | `Room.jsx` | Active meeting room |
| `/stop` | `EndPage.jsx` | Post-call landing page |

**Communication flow:**
1. User lands on `Home.jsx` → generates a UUID room ID → navigates to `/:roomId`
2. `Room.jsx` connects to both servers on mount:
   - Socket.IO (`VITE_SERVER_URL`, default `:3000`) for room membership and chat
   - PeerJS (`VITE_PEER_HOST`/`VITE_PEER_PORT`, default `localhost:3001`) for video/audio
3. When a user joins, Socket.IO broadcasts `USER_CONNECTED` with their PeerJS peer ID to roommates, who call that peer directly — all audio/video flows **peer-to-peer**, never through the Express server
4. Chat messages go through Socket.IO: client emits `SEND_TEXT` → server broadcasts `SHOW_TEXT` to room

**Socket.IO events** (all payloads are positional args, not objects):

| Event | Direction | Args |
|---|---|---|
| `JOIN_ROOM` | client → server | `roomId, userId` |
| `USER_CONNECTED` | server → others | `userId` (PeerJS peer ID) |
| `USER_DISCONNECT` | server → others | `userId` |
| `SEND_TEXT` | client → server | `peerId, text` |
| `SHOW_TEXT` | server → room | `peerId, text` |

Chat display name is derived client-side: `peerId.slice(9, 13)` (4 chars from the PeerJS UUID).

## Key Files

- [server/index.js](server/index.js) — Express app, Socket.IO handlers, room state, production static serving
- [server/peer-server.js](server/peer-server.js) — PeerJS `ExpressPeerServer` instance
- [client/src/pages/Room.jsx](client/src/pages/Room.jsx) — all WebRTC logic, media controls, chat state; the core of the app
- [client/src/pages/Home.jsx](client/src/pages/Home.jsx) — meeting creation/join UI
- [client/vite.config.js](client/vite.config.js) — proxy config for Socket.IO in dev

## Environment Variables

| Variable | Default | Used by |
|---|---|---|
| `VITE_SERVER_URL` | `http://localhost:3000` | `Room.jsx` Socket.IO connection |
| `VITE_PEER_HOST` | `localhost` | `Room.jsx` PeerJS host |
| `VITE_PEER_PORT` | `3001` | `Room.jsx` PeerJS port |
| `PORT` | `3000` | Express server |
| `NODE_ENV` | — | `production` enables static file serving from `client/dist/` |

## Styling

SCSS with a `$primary-color: #ffb600` theme. Modular partials in `client/src/styles/` (`_variables.scss`, `_btn.scss`, `_header.scss`, `_input.scss`, `_video.scss`) are imported in `app.scss`. Bootstrap 4 and Font Awesome 5 are loaded via CDN in `index.html`.
