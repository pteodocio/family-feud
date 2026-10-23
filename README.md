# Family Feud Live — Game Show Experience

A production-grade, locally playable Family Feud-style game show application built for family reunions and gatherings. Designed for dual-screen presentation: a clean, high-contrast, animated 16:9 game board on a television or projector, paired with a host console on a laptop.

No cloud backend, external APIs, authentication, or subscriptions required. Runs completely offline via service worker caching and local IndexedDB persistence.

---

## 🌟 Key Features

### 1. Game Show Visuals & Audio
- **16:9 Studio Display**: Optimized for 1080p and 720p televisions and projectors with high readability from across a living room.
- **Motion Animations**: 3D tile flips, strike overlays, glowing scoreboards, round win banners, and confetti celebrations.
- **Royalty-Free Audio Synthesizer**: Custom Web Audio API synthesizer generating clean, original game-show audio (intro fanfare, card flip, correct chime, strike buzzers, timer ticks, steal fanfare, and win celebration) with zero network audio asset dependencies.
- **Reduced Motion Support**: Respects OS `prefers-reduced-motion` settings.

### 2. Deterministic Game Engine
- **Face-Off Phase**: Representatives buzz in, answer reveals determine who plays or passes.
- **Regular Play**: Point-based answer reveals, single-point, double-point (2x), and triple-point (3x) round multipliers.
- **Strict Scoring Invariants**: Prevents duplicate answer reveals and duplicate bank scoring; multipliers applied exactly once.
- **Strikes & Steal**: 3 strikes trigger the steal opportunity for the opposing team. Successful or failed steal cleanly awards round bank.
- **Fast Money Round**: 5 questions, 2 players, configurable timer with audio countdown, survey match suggestions or manual score adjustments, and 200-point target victory reveal.
- **Safe Recovery & Undo**: Multi-level undo stack allows host to safely undo accidental clicks, clear strikes, or manually adjust scores with logged reasons.

### 3. Dual-Screen Synchronization
- **BroadcastChannel Sync**: Single-browser, multi-window communication keeps the TV Display (`/display/:id`) and Host Console (`/game/:id`) perfectly synchronized in real-time.
- **IndexedDB Autosave**: Automatically persists every action to browser IndexedDB (Dexie), allowing instant resume even after browser refresh or tab closure.

### 4. Question Pack Management
- **Built-in Starter Packs**:
  - *Pinoy Fiesta & Filipino Family Life* (Filipino food, Pinoy habits, gatherings, pasalubong, karaoke classics)
  - *Family Reunion & Daily Household* (Household chores, excuses for being late, reunion questions, remote control battles)
  - *Foodies, Snacks & Comfort Dining* (Pizza toppings, midnight snacks, fast food sides, comfort foods)
  - *Fun Hypotheticals & Quirky Situations* (Closet hiding, white lies, pilot intercom fears)
- **Full Question Pack Editor**: Create, edit, rename, duplicate, delete, and shuffle packs.
- **Safety Validations**: Zod schema validation protects against malformed JSON imports.
- **Printable Host Cheat Sheet**: 1-click printable sheet with prompts, answers, points, and accepted variants.

---

## 🚀 Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | Component architecture & presentation layer |
| **TypeScript (Strict)** | Strong typing, verbatim module syntax, zero `any` |
| **Vite 8** | High-performance build tool and dev server |
| **Tailwind CSS** | Custom game show theme, stage lighting gradients, 3D flip card utilities |
| **Motion (`motion/react`)** | Hardware-accelerated animations, spring physics |
| **Zustand** | Centralized game state management & undo stack |
| **Zod** | Runtime schema validation for question packs and configs |
| **Dexie (IndexedDB)** | Local client-side persistence, autosave, and backup restore |
| **Web Audio API** | Zero-asset, copyright-clean sound synthesis |
| **BroadcastChannel API** | Real-time cross-window sync between host and display |
| **Vite PWA (`vite-plugin-pwa`)**| Service worker offline asset precaching |
| **Vitest & Testing Library**| 26 unit and component tests covering all game logic |
| **Playwright** | 8 end-to-end tests across 1080p and 720p projector profiles |

---

## 📦 Installation & Setup

### Prerequisites
- **Node.js**: v18.0.0 or later (tested on Node v26)
- **npm**: v9.0.0 or later

### 1. Clone & Install Dependencies
```bash
git clone <repo-url> family-feud
cd family-feud
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Run Production Build
```bash
npm run build
npm run preview
```
Open [http://localhost:4173](http://localhost:4173) to preview the production build with PWA service worker caching enabled.

---

## 🧪 Running Automated Tests

### Unit & Integration Tests (Vitest)
Executes 26 tests covering game engine rules, duplicate prevention, multipliers, strikes, steals, Dexie persistence, BroadcastChannel sync, and component rendering:
```bash
npm test
```

### End-to-End Tests (Playwright)
Executes 8 end-to-end browser tests across Desktop Projector (1920×1080) and Laptop Projector (1280×720) viewports:
```bash
npm run test:e2e
```

---

## 📺 Television & Dual-Screen Setup Guide

For the intended game show experience at a family gathering:

1. Connect your laptop to a television or projector using an HDMI cable or wireless display (Miracast / AirPlay).
2. Set your OS display settings to **"Extend these displays"** (so the TV acts as a second monitor).
3. Open the application in your browser (e.g., Chrome, Edge, Safari, Firefox).
4. On the laptop, click **"Start New Game"** or configure a game at `/setup`.
5. Once on the Host Console (`/game/:id`), click the **"Open TV Display"** button in the header bar.
6. Drag the newly opened Display window onto your TV screen and press **F11** or click the fullscreen icon in the top right corner.
7. Host the game comfortably from your laptop while your family watches the TV board!

---

## ⌨️ Host Console Controls & Shortcuts

The Host Console includes built-in safeguards to ensure shortcuts do not fire when typing into input fields.

| Key | Action |
|---|---|
| `1` – `8` | Reveal answer slot 1 through 8 |
| `X` | Record Strike (1, 2, or 3) |
| `Z` | Clear last strike (mistake correction) |
| `U` | Undo last action |
| `Space` | Next / Confirm action (when outside inputs) |

### Additional Host Features:
- **Live Spoken Guess Matcher**: Type what the contestant said into the guess box. The engine normalizes case, removes punctuation, and tests against accepted synonyms. Matching answers light up green with a 1-click reveal.
- **Manual Score Adjustment**: Adjust any team's score (+ or -) with a documented reason.
- **Restart Current Round**: Reverts bank and clears revealed slots if an unexpected issue occurs.
- **Fast Money Controls**: Independent Player 1 / Player 2 tabs, countdown timer with tick sounds, and reveal toggles.

---

## 💾 Offline Usage & Data Backup

### Offline Play
1. Visit the application while online at least once so the PWA service worker caches all HTML, CSS, JavaScript, and fonts.
2. Once cached, the website can be loaded completely offline without an active internet connection.
3. All starter packs and user-created question packs reside in local IndexedDB.

### Backup & Restore
- Go to `/settings` or `/packs`.
- Click **"Download All Data Backup (JSON)"** to save your questions and settings to a JSON file.
- Click **"Restore Backup from File"** to import questions onto a new device.

---

## 🗺️ Application Routes

- `/` — Main menu, quick launch, resume recent games.
- `/setup` — Team names, question pack selection, round count, and timer configuration.
- `/game/:id` — Interactive host control console.
- `/display/:id` — Clean, full-screen 16:9 TV/projector game board.
- `/packs` — Question pack library (search, filter, import, export, print cheat sheet).
- `/packs/:id/edit` — Visual question and answer pack editor.
- `/settings` — Sound settings, keyboard shortcuts guide, and data backup.
- `/results/:id` — Final game summary, round statistics, and printable score report.

---

## 📄 License

Original software created for family gathering entertainment. Clean room implementation with original code, royalty-free synthesized audio, and customizable questions.
