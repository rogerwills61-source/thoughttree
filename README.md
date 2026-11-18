# 🌳 ThoughtTree — Zero-Clutter Keyboard-First Mind Mapping

**ThoughtTree** is a lightning-fast, distraction-free mind mapping app designed to get out of your way and let your ideas flow. Whether you are brainstorming project plans on your laptop or organizing notes on your mobile device while on the move, ThoughtTree provides a seamless, fluid infinite canvas that feels instantly responsive and natural.

## ✨ Core User Features
- **Effortless Mind Mapping:** Start with a central idea and branch out naturally. Group thoughts by layer or branch with clean, organic curved connector styles (Bezier, orthogonal, or straight).
- **Lightning-Fast Keyboard Capture:** Keep your hands on the keys. Press `Tab` to create a child node, `Enter` for a sibling node, `F2` (or simply start typing) to edit text, and `Space` to fold or expand entire branches.
- **Connect Ideas with Cross-Links (`L`):** Draw dashed relationship arrows between any two nodes across different branches, complete with multi-line auto-wrapping halo labels that automatically route around your text.
- **Progressive Layer Folding (`[` / `]`):** Focus on what matters right now by stepping inward or outward layer-by-layer, or jump straight to Layer 1 (`L1`), Layer 2 (`L2`), or view everything (`All`).
- **Rich Notes & Web Links (`N`):** Attach detailed notes and clickable URLs to any node, accessible instantly via non-occluding hover or tap callout cards.
- **Zero Lock-In & Flexible Export:** Your data belongs to you. Import and export cleanly using standard JSON mind map files, indented Markdown outlines (`.md`), FreeMind XML (`.mm`), Microsoft Word/Google Docs nested lists (`Ctrl/Cmd + V`), or high-resolution PNG images.

---

## 📲 How to Install ThoughtTree

ThoughtTree runs as an installable Progressive Web App (PWA) across all your devices, working 100% offline once added:

### 💻 Laptop / Desktop (Windows, macOS, Linux, Chromebook)
1. Open your hosted ThoughtTree `https://` URL in **Chrome**, **Edge**, or **Brave**.
2. Click **`☰ Menu`** (top-left) → **`📲 Install ThoughtTree App`** *(or click the install icon on the right side of your browser's address bar)*.
3. ThoughtTree will launch in its own dedicated window and pin directly to your Taskbar, Start Menu, or Dock.

### 📱 Android Phone & Tablet
1. Open your hosted URL in **Chrome for Android**.
2. Tap **`☰ Menu`** (top-left) → **`📲 Install ThoughtTree App`** *(or tap Chrome's three-dot menu `⋮` → **Install app**)*.
3. ThoughtTree installs right into your Android app drawer with its custom tree icon and a full-screen touch dock.

### 🍎 iPhone & iPad (iOS / iPadOS)
1. Open your hosted URL in **Safari**.
2. Tap the **Share** button (square with upward arrow) at the bottom of the screen and tap **Add to Home Screen**.

---

## ⚙️ Technical Architecture & Developer Overview

For those interested in the underlying engineering, ThoughtTree is built with a disciplined **local-first, zero-dependency client-side architecture**:

- **Single-File PWA Engine:** The core application is packaged in a self-contained, high-performance HTML/JS bundle optimized for sub-16ms first paint and 60 FPS canvas rendering.
- **Local Persistence (`IndexedDB`):** Automatically saves state continuously to local browser storage using a normalized flat `nodesById` store with singleton database connection handling (`ADR-039`).
- **Self-Healing Cryptographic File-Bound Sync (`ADR-037`):**
  - **Tri-Layer Transport:** Combines same-browser `BroadcastChannel` (0ms tab sync), multi-broker binary MQTT-over-WebSockets (`emqx`, `hivemq`, `mosquitto` with multi-byte VarInt frame parsing and 20s `PINGREQ` keepalives), and direct peer-to-peer WebRTC DataChannels (`⚡ P2P Live`).
  - **Cryptographic Authorization:** Channel keys are derived from an unguessable 256-bit `fileSyncToken` (`32 random bytes`) combined with `mapId`. Possession of the actual `.json` file is the sole proof of authorization.
  - **Identity Lifecycle:** Normal saves (`Ctrl+S`) preserve identity so open devices stay linked; `Save As` (`Ctrl+Shift+S`) rotates `mapId` and `fileSyncToken` to isolate branched copies.
- **Conflict-Free CRDT Merging:** Implements Last-Write-Wins (LWW) per-node resolution combined with a robust `deletedById` tombstone registry and active in-flight edit/drag locks to prevent race conditions across devices.
