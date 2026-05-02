# GoogleMeet

<b>## The Project Video Demo</b> 🎞

👉 👉 👉 👉 👉 👉 <a href="https://youtu.be/CAuYgEEET5U">Youtube Google Meet Clone Project</a>

This is a Google Meet clone — a real-time video conferencing web app built with React and Node.js.

## Versions

**v1.0.0** — Initial release (~6 years ago)
Original monolithic implementation. A single vanilla JavaScript codebase with no build tooling, no module separation, and basic WebRTC video/chat functionality.

**v2.0.0** — Current release
Full architectural migration to a modern JavaScript stack:
- **Client** rebuilt with React 18 and Vite — component-based UI, hot module replacement, and SCSS module styling
- **Server** split into two dedicated processes: Express + Socket.IO for room signaling and chat relay, and a standalone PeerJS server for WebRTC peer discovery
- **Tooling** upgraded: deprecated SCSS `@import` replaced with `@use`, React-controlled UI components (no jQuery dependency)
- **CI/CD** added via GitHub Actions with Claude Code integration for automated code review

### What it does

-   Users can create a meeting room (instant or via shareable link) or join one by ID
-   Once in a room, participants share live video and audio directly with each other
-   A side panel provides real-time text chat during the call
-   Users can mute/unmute their mic, turn their camera on/off, or leave the call

### How it works:

-   The React frontend (Vite) handles the UI and all media logic
-   An Express + Socket.IO server acts as the signaling layer — it tells peers who else is in the room, but never touches media data
-   A PeerJS server handles WebRTC peer discovery; once two peers find each other, all audio/video flows directly between browsers (peer-to-peer), bypassing the server entirely
-   Chat messages are the only data routed through the server

### Tech stack: React 18 · Vite · Express · Socket.IO · PeerJS · WebRTC · SCSS · Bootstrap 4