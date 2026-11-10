# Design Specification: 10 New Group-vs-Group Competitive Games for Family Game Hub

**Date:** 2026-11-10  
**Status:** Approved Architecture Draft  
**Scope:** Architectural Upgrade (Phase 5)

---

## 1. Executive Summary & Vision

Family Game Hub is expanding from a 6-game platform into a complete 16-game family entertainment platform. Phase 5 introduces a dedicated **Team Battle Games** category featuring 10 authentic, group-versus-group competitive party games:

1. **Password** (1-word clue deduction battle)
2. **Catchphrase** (Rapid pass-the-phrase hot potato)
3. **Taboo** (Forbidden-word penalty challenge)
4. **Jeopardy!** (Interactive category & point value board)
5. **Wheel of Fortune** (Virtual prize wheel, phrase puzzle & bankrupts)
6. **Bluff the Answer** (Deceptive bluff submissions & point stealing)
7. **Heads Up!** (Rapid-fire team shouting & clue guessing)
8. **Word Hunt** (Simultaneous 4x4 Boggle letter grid race)
9. **Scattergories** (Letter die roll, category alliteration & duplicate cancellations)
10. **Trivia Elimination** (Survival quiz battle with ❤️❤️❤️ team lives)

---

## 2. Core Architecture & Design Philosophy (Ponytail Standard)

- **Smallest Complete Change**: Every new game uses the proven modular patterns of the existing Game Hub (`src/games/<gameId>/`), reusing `hubSyncBus` for real-time dual-screen broadcast, `hubDatabase.ts` for Dexie v3 offline storage, `soundManager.ts` for television game show audio, and `SharedTimer.tsx` / `SharedScoreboard.tsx` for core mechanics.
- **Strict Anti-AI-Slop Styling**:
  - CSS tokens declared at `:root` (no hardcoded inline styles).
  - High WCAG contrast, large projector-readable typography (min 24px on TV view).
  - Instantaneous `:focus-visible` on all interactive elements.
  - Zero generic 3-column AI slop cards, zero emoji icons, authentic physical game-show aesthetics.
- **Strict Preservation Guarantee**:
  - 100% of all 39 Filipino Family Feud packs and 20 Fast Money sets preserved with zero regressions.
  - Existing 5 hub games (Trivia, Charades, Pictionary, Bingo, Guess the Word) remain untouched.

---

## 3. Data Models & Type Definitions

### 3.1 Game Catalog Expansion (`src/types/hub.ts`)
```typescript
export type GameCatalogId =
  | 'family-feud'
  | 'family-trivia'
  | 'charades'
  | 'pictionary'
  | 'family-bingo'
  | 'guess-the-word'
  // 10 New Team Battle Games
  | 'password'
  | 'catchphrase'
  | 'taboo'
  | 'jeopardy'
  | 'wheel-of-fortune'
  | 'bluff-the-answer'
  | 'heads-up'
  | 'word-hunt'
  | 'scattergories'
  | 'trivia-elimination';
```

### 3.2 Category Taxonomy
- `TV Game Show`: Family Feud, Jeopardy!, Wheel of Fortune
- `Team Battle Games`: Password, Catchphrase, Taboo, Bluff the Answer, Heads Up!, Word Hunt, Scattergories, Trivia Elimination
- `Party & Quiz`: Family Trivia, Charades, Pictionary, Family Bingo, Guess the Word

---

## 4. Gameplay Mechanics for the 10 Games

### Game 1: Password (`src/games/password/`)
- **Mechanics**: 2+ teams. Secret password is shown only to the active clue-giver on the Host screen. Clue-giver may speak only ONE word. Teammate has 10 seconds to guess. If incorrect, turn passes to the opposing team for a 2nd clue. Points decrease with each clue (Round 1: 10 pts, Round 2: 8 pts, Round 3: 6 pts, Round 4: 4 pts).
- **Host Console**: Shows secret word, clue count (1 to 4), toggle active team, "Correct Guess" button, "Pass / Wrong" button, "Reveal Word" button.
- **TV Display**: Secret word hidden (`● ● ● ● ● ●`). Shows active team, current point value ladder (10 -> 8 -> 6 -> 4), and dramatic reveal animation upon solve.

### Game 2: Catchphrase (`src/games/catchphrase/`)
- **Mechanics**: Active player holds laptop or views screen, describes a word/phrase to teammates without saying the words. When teammates guess correctly, the host hits "Next / Pass Team", switching active team. An accelerating ticking timer runs for 45–90 seconds. The team holding the phrase when the buzzer blows loses the round; opposing team earns 1 point.
- **Host Console**: Current phrase, "Next Word / Team Pass" button, Start/Pause Timer, Word Counter.
- **TV Display**: Tension-building ticking clock, team possession indicator, round score. Secret phrase can optionally be shown to audience or kept secret.

### Game 3: Taboo (`src/games/taboo/`)
- **Mechanics**: Active clue-giver gets a Target Word plus 5 Forbidden (Taboo) words. Clue-giver describes the target to teammates without using any taboo words or gestures. Opposing team acts as "Buzzer Police" watching the host screen.
- **Host Console**: Target word highlighted in gold, 5 forbidden words in red, large "BUZZER PENALTY" button (-1 pt / skip), "CORRECT" button (+1 pt), "PASS" button. 60-second countdown.
- **TV Display**: Timer, active team, score tracker, strike counter. Target and forbidden words concealed from audience so they can guess along.

### Game 4: Jeopardy! (`src/games/jeopardy/`)
- **Mechanics**: 5 categories x 5 point values (100, 200, 300, 400, 500 points). Teams choose available tiles. Host reveals question. Teams buzz in (or take turns). Correct answer adds points; incorrect answer deducts points. Includes 1 Daily Double tile (wager up to current bank) and Final Jeopardy round.
- **Host Console**: Master 5x5 grid with questions, answers, and used-state markers. Team buzz-in assignment, "+ Points" and "- Points" buttons, Daily Double wager input.
- **TV Display**: Classic blue Jeopardy matrix with gold point values. Flip animations into large, high-contrast question display. Buzz-in team banner.

### Game 5: Wheel of Fortune (`src/games/wheelFortune/`)
- **Mechanics**: Mystery phrase displayed with blank letter slots. Active team spins the virtual prize wheel (wedges: 100, 200, 300, 500, 750, 1000, Bankrupt, Lose a Turn, Free Spin). If landing on points, team calls a consonant. If present, letter(s) flip and cash bank accumulates. Team can buy vowels for 250 points or attempt to solve the puzzle.
- **Host Console**: Phrase solution, letter picking alphabet grid (tracks used consonants/vowels), "Bankrupt", "Lose a Turn", "Solve Verified" buttons, wheel spin trigger.
- **TV Display**: Animated 24-wedge spinning wheel, classic letter-flip puzzle board, current round bank and total team banks.

### Game 6: Bluff the Answer (`src/games/bluff/`)
- **Mechanics**: Host presents an obscure, fascinating trivia question. Competing teams each craft a believable bluff answer. Host aggregates all bluff answers + the true answer, shuffles them anonymously, and displays them on the TV screen. Teams vote on the true answer.
  - Picking the true answer = +200 points.
  - Tricking an opponent into picking your bluff = +100 bonus points per tricked team.
- **Host Console**: True question & answer, input forms for team bluffs, shuffle trigger, voting tally, score distributor.
- **TV Display**: Obscure question, anonymous list of choices (A, B, C, D...), vote reveal animation, bluff author unveils with point awards.

### Game 7: Heads Up! (`src/games/headsUp/`)
- **Mechanics**: Active guesser faces the screen away (or teammate holds laptop facing team). Teammates shout clues, act, or sing. Guesser tries to guess as many cards as possible in 60 seconds.
- **Host Console**: Large green "CORRECT (+1)" and red "PASS" buttons, countdown timer, deck progress ticker.
- **TV Display**: Big, bold card display for clue givers, rapid counter, timer with color shifts (green -> yellow -> pulsing red).

### Game 8: Word Hunt (`src/games/wordHunt/`)
- **Mechanics**: 4x4 grid of random letters generated with English/Taglish vowel-consonant weighting. Both teams race simultaneously for 90 seconds to write down as many valid 3+ letter words formed by adjoining letters (horizontal, vertical, diagonal).
- **Host Console**: 4x4 grid, team word submission input, automated Boggle dictionary path validator, scoring breakdown (3-4 letters: 1 pt, 5: 2 pts, 6: 3 pts, 7: 5 pts, 8+: 11 pts). Duplicate cross-team words cancel out.
- **TV Display**: Giant 4x4 letter board, 90s countdown, post-round word comparison and leaderboard.

### Game 9: Scattergories (`src/games/scattergories/`)
- **Mechanics**: A random starting letter is selected via a 20-sided letter wheel (excluding difficult letters Q, X, Z). 6–8 varied categories appear (e.g. "Things in a Filipino Kitchen", "Movie Titles", "School Supplies"). Teams race to write one answer per category starting with the letter.
- **Host Console**: Category list, letter spinner, timer (120s), interactive review table where host can accept/reject answers and toggle duplicate cancellations.
- **TV Display**: Prominent selected letter, category countdown board, side-by-side team answers review matrix.

### Game 10: Trivia Elimination (`src/games/elimination/`)
- **Mechanics**: Survival quiz. Teams start with 3 lives (❤️❤️❤️). Challenging questions are revealed one by one. Teams submit answers. Incorrect answers lose a life with a dramatic buzzer strike. When a team hits 0 lives, they are eliminated with visual fanfare. The last surviving team takes the championship.
- **Host Console**: Question & answer display, team life counters, "Wrong (-1 Life)" / "Correct" buttons, tiebreaker question support.
- **TV Display**: Question display, heart life meters for all teams with crack/fade animations on life loss, dramatic "ELIMINATED!" banner, winner champion podium.

---

## 5. Procedural Content Generators (`src/services/localGenerators/`)

Each game receives an offline procedural generator supporting both English and Filipino datasets:
1. `passwordGenerator.ts`: 150+ password words with curated associations.
2. `catchphraseGenerator.ts`: 200+ popular idioms, Taglish phrases, and pop culture references.
3. `tabooGenerator.ts`: 120+ cards with target words and 5 distinct taboo keywords each.
4. `jeopardyGenerator.ts`: 25+ themed 5-category boards with 100–500 difficulty scaling.
5. `wheelGenerator.ts`: 100+ phrases across categories (Philippine Places, Famous Lines, Food, Everyday Life).
6. `bluffGenerator.ts`: 80+ bizarre real trivia facts with authentic explanations.
7. `headsUpGenerator.ts`: 200+ cards categorized by Movies, Celebrities, Food, and Act It Out.
8. `wordHuntGenerator.ts`: Dynamic 4x4 Boggle board generator using standard dice distributions with Tagalog letter balancing and Trie-based path validation.
9. `scattergoriesGenerator.ts`: 15+ curated category lists (General, Pinoy Pop, Food & Dining, Campus Life).
10. `eliminationGenerator.ts`: 150+ multiple-choice survival questions with escalating difficulty tiers.

All generators integrate cleanly into `src/services/contentEngine.ts` and `DynamicContentGeneratorSection.tsx`.

---

## 6. Dual-Screen TV Mirroring & Audience Concealment

The existing `hubSyncBus` (`src/sync/hubSync.ts`) broadcasts real-time updates via `BroadcastChannel`:
- Host updates state -> `hubSyncBus.broadcastStateUpdate(state)` -> TV updates smoothly.
- **Audience Concealment Principle**: Host views include sensitive information (secret password, taboo forbidden words, true answer in Bluff). The broadcast payload sent to the TV excludes these secret fields until the host triggers the explicit `reveal` event.

---

## 7. Tournament Mode Integration

`src/services/tournamentManager.ts` is updated:
- `GameCatalogId` expands to all 16 games.
- Tournament setup modal allows choosing any combination of the 16 games in custom playlist order.
- Standings and point awards (1st: 100 pts, 2nd: 60 pts, 3rd: 30 pts) track cumulatively.

---

## 8. Testing Strategy

1. **Unit Tests (Vitest)**:
   - Generator tests verifying procedural generation, category filtering, language selection, and content diversity.
   - Boggle dictionary path search test in `wordHuntGenerator`.
   - Scoring and life elimination tests for `triviaElimination`.
   - Tournament session updates with new game catalog IDs.
2. **E2E Tests (Playwright)**:
   - End-to-end launch of new games from library cards.
   - Host controls and TV sync verification.
   - Team Battle category filtering test.
   - Full regression test ensuring Family Feud and existing 5 games remain 100% operational.
