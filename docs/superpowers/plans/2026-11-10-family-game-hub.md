# Family Game Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Family Feud website into a centralized **Family Game Hub** with 6 playable party games (Family Feud preserved, Family Trivia, Charades, Pictionary, Family Bingo, Guess the Word), shared player/team roster management, shared scoreboard, shared timer, shared audio controls, two-screen (Host/TV) synchronization, game history, and global settings.

**Architecture:** A modular platform shell (`MainHubPage`) with a dynamic game registry (`src/games/registry.ts`). Each game operates as an isolated module providing a Host Console view and a TV Display view. All games consume shared platform kernel services: Dexie v2 database (roster & history), `hubSyncBus` (BroadcastChannel two-screen synchronization), `soundManager` (Web Audio synthesized sound cues), and shared UI widgets (Timer, Scoreboard, Canvas, Player Manager).

**Architecture Diagram:**

```mermaid
graph TD
    subgraph "Family Game Hub Platform Shell"
        Router[Router & Navigation] --> HubPage[MainHubPage - Game Library & Hero]
        Router --> SetupPage[GameSetupHubPage - Player/Team Selection]
        Router --> HostShell[HubHostPage - Host Console Container]
        Router --> DisplayShell[HubDisplayPage - TV Display Container]
        Router --> HistoryPage[GameHistoryPage - Match Ledger]
        Router --> SettingsPage[GlobalSettingsPage - Audio & TV Config]
    end

    subgraph "Modular Game Registry (6 Games)"
        HostShell & DisplayShell --> GameRegistry[Game Registry]
        GameRegistry --> FeudModule[1. Family Feud (Preserved)]
        GameRegistry --> TriviaModule[2. Family Trivia]
        GameRegistry --> CharadesModule[3. Charades]
        GameRegistry --> PictionaryModule[4. Pictionary]
        GameRegistry --> BingoModule[5. Family Bingo]
        GameRegistry --> GuessWordModule[6. Guess the Word]
    end

    subgraph "Shared Platform Kernel"
        GameRegistry & SetupPage --> SharedDB[(Dexie DB v2: Players, Teams, History)]
        GameRegistry & HostShell --> SharedSound[SoundManager: Web Audio FX]
        HostShell <==>|BroadcastChannel| DisplayShell
    end
```

**Tech Stack:** React 19, TypeScript 6, Vite 8, Tailwind CSS v3, Dexie.js (IndexedDB), Motion (Framer Motion), Canvas Confetti, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-11-10-family-game-hub-design.md`

## Global Constraints
- **Preserve Family Feud**: Zero deletion, renaming, or modification of existing Feud packs (all 39 Filipino packs, 195 questions), Fast Money (20 sets/100 questions), buzzer strikes, or existing Feud routes (`#/setup`, `#/game/:id`, `#/display/:id`, `#/packs`).
- **No Cloud Backend**: Entire platform runs locally in the browser with offline PWA support and IndexedDB storage.
- **Two-Screen Architecture**: Every game must support Host Console (with secrets) and TV Display (audience-safe).
- **Anti-AI-Slop Quality Floor**: Token-declared colors at `:root`, instant `:focus-visible`, hardware-accelerated animations (`transform`/`opacity`), no emojis as structural icons, and WCAG AA contrast.

## Review Focus
1. **Existing Feud Data Integrity**: Database migration from v1 to v2 must preserve existing question packs, custom packs, and saved game sessions without data loss.
2. **Secret Information Leakage on TV**: In Charades, Pictionary, and Guess the Word, secret words and unrevealed clues must NEVER appear on the TV display screen.
3. **Pictionary Canvas Real-Time Sync**: Pointer events drawn on the Host Console canvas must stream smoothly to the TV canvas without latency or disconnects.
4. **Bingo Winning Detection**: Winning patterns (Line, Four Corners, Postage Stamp, Blackout) must accurately detect called numbers on player cards.
5. **Two-Screen Reconnection**: Opening the TV display window after a game has started must immediately pull current game state and render the active board.

---

### Task 1: Shared Data Contracts & Dexie Database Schema Upgrade (v2)

**Files:**
- Create: `src/types/hub.ts`
- Create: `src/db/hubDatabase.ts`
- Modify: `src/db/database.ts:47-65`
- Test: `src/db/hubDatabase.test.ts`

**Interfaces:**
- Produces: `HubPlayer`, `HubTeam`, `HubGameHistoryEntry`, `HubGameSessionState`, `saveHubPlayer()`, `listHubPlayers()`, `deleteHubPlayer()`, `saveHubTeam()`, `listHubTeams()`, `recordGameHistory()`, `listGameHistory()`, `clearGameHistory()`.

- [ ] **Step 1: Write failing test for Dexie v2 schema & Hub operations in `src/db/hubDatabase.test.ts`**
- [ ] **Step 2: Run test to verify it fails (`npx vitest run src/db/hubDatabase.test.ts`)**
- [ ] **Step 3: Define TypeScript contracts in `src/types/hub.ts`**
- [ ] **Step 4: Upgrade FeudDatabase to version(2) in `src/db/database.ts` and implement queries in `src/db/hubDatabase.ts`**
- [ ] **Step 5: Run test to verify it passes**
- [ ] **Step 6: Run existing `src/db/database.test.ts` to confirm zero regression to Feud storage**
- [ ] **Step 7: Commit**

---

### Task 2: Shared Audio Coordinator & Party Game Sound Cues

**Files:**
- Create: `src/audio/gameSounds.ts`
- Modify: `src/audio/soundManager.ts`
- Test: `src/audio/soundManager.test.ts`

**Interfaces:**
- Produces: `soundManager.playPartyCue('correct' | 'wrong' | 'tick' | 'fanfare' | 'bingoRoll' | 'bingoWin' | 'whistle' | 'drumroll')`.

- [ ] **Step 1: Write unit test in `src/audio/soundManager.test.ts` for party sound cues**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement Web Audio synthesis routines in `src/audio/gameSounds.ts` and integrate with `soundManager.ts`**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit**

---

### Task 3: Shared Broadcast Synchronization Bus (`hubSyncBus`)

**Files:**
- Create: `src/sync/hubSync.ts`
- Test: `src/sync/hubSync.test.ts`

**Interfaces:**
- Produces: `hubSyncBus`: `broadcastState(state)`, `broadcastCanvasStroke(stroke)`, `broadcastCanvasClear()`, `broadcastTimer(time)`, `broadcastSound(cue)`, `onStateUpdate(cb)`, `onCanvasStroke(cb)`, `onCanvasClear(cb)`, `onTimerUpdate(cb)`.

- [ ] **Step 1: Write unit test in `src/sync/hubSync.test.ts` for multi-window communication**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `hubSync.ts` using `BroadcastChannel('family-game-hub-sync-v1')`**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit**

---

### Task 4: Game Content Banks (Trivia, Charades, Pictionary, Bingo, Guess the Word)

**Files:**
- Create: `src/data/hubData/triviaQuestions.ts` (6 categories, 60+ questions, MC & TF)
- Create: `src/data/hubData/charadesWords.ts` (6 categories, 90+ words, Easy/Med/Hard)
- Create: `src/data/hubData/pictionaryWords.ts` (60+ items across objects, animals, actions)
- Create: `src/data/hubData/bingoPatterns.ts` (Standard line, Four corners, Postage stamp, Blackout)
- Create: `src/data/hubData/wordClues.ts` (30+ word puzzles with 4 progressive clues each)
- Test: `src/data/hubData/hubData.test.ts`

**Interfaces:**
- Produces: `TRIVIA_QUESTIONS`, `CHARADES_WORDS`, `PICTIONARY_WORDS`, `BINGO_PATTERNS`, `WORD_CLUES`.

- [ ] **Step 1: Write test in `src/data/hubData/hubData.test.ts` verifying counts, structure, and validity**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Create content banks with relatable family-friendly prompts**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit**

---

### Task 5: Shared Platform UI Components

**Files:**
- Create: `src/components/shared/GameCard.tsx`
- Create: `src/components/shared/SharedTimer.tsx`
- Create: `src/components/shared/SharedScoreboard.tsx`
- Create: `src/components/shared/DrawingCanvas.tsx`
- Create: `src/components/shared/PlayerManagerModal.tsx`
- Create: `src/components/shared/WinnerPodiumModal.tsx`
- Test: `src/components/shared/SharedComponents.test.tsx`

**Interfaces:**
- Produces: Reusable UI widgets with full keyboard navigation and accessible focus rings.

- [ ] **Step 1: Write component tests for SharedTimer, SharedScoreboard, and DrawingCanvas**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement components in `src/components/shared/`**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit**

---

### Task 6: Modular Game Engines & Registry

**Files:**
- Create: `src/games/registry.ts`
- Create: `src/games/trivia/TriviaHostView.tsx`, `src/games/trivia/TriviaTvView.tsx`
- Create: `src/games/charades/CharadesHostView.tsx`, `src/games/charades/CharadesTvView.tsx`
- Create: `src/games/pictionary/PictionaryHostView.tsx`, `src/games/pictionary/PictionaryTvView.tsx`
- Create: `src/games/bingo/BingoHostView.tsx`, `src/games/bingo/BingoTvView.tsx`
- Create: `src/games/guessWord/GuessWordHostView.tsx`, `src/games/guessWord/GuessWordTvView.tsx`
- Test: `src/games/gameEngines.test.ts`

**Interfaces:**
- Produces: `GAMES_CATALOG` with all 6 games, their metadata, Host and TV components.

- [ ] **Step 1: Write tests in `src/games/gameEngines.test.ts` verifying game mechanics (trivia scoring, charades timers, bingo pattern matching, clue progression)**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement game host and TV views with full gameplay cycles**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit**

---

### Task 7: Platform Shell Pages (Homepage, History, Settings, Setup)

**Files:**
- Create: `src/components/common/HubNavbar.tsx`
- Create: `src/pages/MainHubPage.tsx`
- Create: `src/pages/GameHistoryPage.tsx`
- Create: `src/pages/GlobalSettingsPage.tsx`
- Create: `src/pages/GameSetupHubPage.tsx`
- Create: `src/pages/HubHostPage.tsx`
- Create: `src/pages/HubDisplayPage.tsx`

- [ ] **Step 1: Implement `HubNavbar.tsx` with logo, navigation links, and audio indicator**
- [ ] **Step 2: Implement `MainHubPage.tsx` with Hero section, Featured Game spotlight, and 6-game responsive grid**
- [ ] **Step 3: Implement `GameHistoryPage.tsx` with match summaries and clear action**
- [ ] **Step 4: Implement `GlobalSettingsPage.tsx` with sound sliders and TV screen settings**
- [ ] **Step 5: Implement `GameSetupHubPage.tsx` connecting player/team selection to game launch**
- [ ] **Step 6: Implement `HubHostPage.tsx` and `HubDisplayPage.tsx` routing active game view**
- [ ] **Step 7: Commit**

---

### Task 8: Routing Integration & End-to-End Verification

**Files:**
- Modify: `src/router/Router.tsx`
- Modify: `src/App.tsx`
- Modify: `src/index.css`
- Create: `e2e/familyGameHub.spec.ts`

- [ ] **Step 1: Update Router with routes: `/`, `/games`, `/games/:id/setup`, `/games/:id/host`, `/display/hub/:id`, `/history`, `/settings`**
- [ ] **Step 2: Update `App.tsx` to mount Hub pages while keeping existing Feud routes (`#/setup`, `#/game/:id`, `#/display/:id`, `#/packs`) 100% active**
- [ ] **Step 3: Write E2E Playwright tests in `e2e/familyGameHub.spec.ts`**
- [ ] **Step 4: Run Vitest test suite (`npm test`)**
- [ ] **Step 5: Run Playwright E2E test suite (`npm run test:e2e`)**
- [ ] **Step 6: Run build verification (`npm run build`)**
- [ ] **Step 7: Commit**
