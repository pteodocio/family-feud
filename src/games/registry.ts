import type { GameCatalogItem } from '../types/hub';

export const GAMES_CATALOG: GameCatalogItem[] = [
  {
    id: 'family-feud',
    name: 'Family Feud',
    tagline: 'The classic TV game show with real survey answers & buzzer strikes.',
    description:
      'Face off in teams to guess the top survey answers! Featuring full buzzer strikes, bank steals, 39 Filipino question packs, Fast Money round, and live dual-screen TV mirror.',
    minPlayers: 4,
    maxPlayers: 16,
    estimatedMinutes: '20–30m',
    category: 'TV Game Show',
    badgeColor: '#ffd15c',
    accentColor: '#ffd15c',
    isAvailable: true,
    rules: [
      'Two families or teams face off to guess the most popular survey answers.',
      'Control team gets 3 strikes before the opposing team can attempt a steal.',
      'Points increase with 2x and 3x multipliers in later rounds.',
      'Top team advances to the high-stakes Fast Money round!',
    ],
  },
  {
    id: 'family-trivia',
    name: 'Family Trivia',
    tagline: 'Multi-category quiz battle with automatic scoring and live TV board.',
    description:
      'Compete across Science, History, Philippine Trivia, Pop Culture, and Sports. Features multiple-choice & true/false questions, configurable countdown timers, and automated leaderboards.',
    minPlayers: 2,
    maxPlayers: 12,
    estimatedMinutes: '15–25m',
    category: 'Quiz Show',
    badgeColor: '#38bdf8',
    accentColor: '#38bdf8',
    isAvailable: true,
    rules: [
      'Host reveals questions with a countdown timer.',
      'Players or teams lock in their answers before the buzzer sounds.',
      'Correct answers award points based on speed and difficulty.',
      'Live leaderboard tracks who has the sharpest family trivia mind!',
    ],
  },
  {
    id: 'charades',
    name: 'Charades Party',
    tagline: 'Act out secret words and movies without making a single sound!',
    description:
      'High-energy party acting game. The secret word is shown strictly to the actor on the laptop while remaining hidden from the TV audience until successfully guessed!',
    minPlayers: 3,
    maxPlayers: 16,
    estimatedMinutes: '15–30m',
    category: 'Party Acting',
    badgeColor: '#fb7185',
    accentColor: '#fb7185',
    isAvailable: true,
    rules: [
      'One actor receives a secret word or phrase visible ONLY on the host screen.',
      'The actor acts it out without talking, mouthing words, or making sound effects.',
      'Teammates have 60 seconds to guess the word.',
      'Earn 1 point for Easy, 2 for Medium, and 3 points for Hard challenges.',
    ],
  },
  {
    id: 'pictionary',
    name: 'Pictionary',
    tagline: 'Draw on the laptop while your artwork streams live to the TV!',
    description:
      'Digital drawing & guessing party game. Draw with digital pens, colors, and erasers on the host canvas while the audience guesses the live drawing on the big screen.',
    minPlayers: 3,
    maxPlayers: 16,
    estimatedMinutes: '20–30m',
    category: 'Drawing & Guessing',
    badgeColor: '#34d399',
    accentColor: '#34d399',
    isAvailable: true,
    rules: [
      'One artist receives a secret word and draws it on the digital canvas.',
      'The live sketch streams instantly to the TV display without giving away the answer.',
      'No letters, numbers, or spoken verbal hints allowed!',
      'First team to guess before the clock expires scores points.',
    ],
  },
  {
    id: 'family-bingo',
    name: 'Family Bingo',
    tagline: 'Automated 1–75 ball caller, master tracker, and instant card check.',
    description:
      'Classic 75-ball Bingo with automated voice roll, digital interactive cards, 75-number tracking board on the TV, and winning pattern detection (Line, 4 Corners, Postage Stamp, Blackout).',
    minPlayers: 2,
    maxPlayers: 20,
    estimatedMinutes: '10–20m',
    category: 'Classic Bingo',
    badgeColor: '#fbbf24',
    accentColor: '#fbbf24',
    isAvailable: true,
    rules: [
      'Host triggers the random 1–75 ball caller with audio roll announcements.',
      'Players mark their 5x5 bingo cards (FREE space in the center).',
      'The TV board highlights all called numbers in real-time.',
      'Shout "BINGO!" when you complete the chosen winning pattern!',
    ],
  },
  {
    id: 'guess-the-word',
    name: 'Guess the Word',
    tagline: 'Crack mystery clues one by one — faster guesses earn bigger points!',
    description:
      'Progressive clue-based word puzzle game. Clues are unveiled one at a time on the big screen. Guess early for 40 points, or wait for clearer hints for 30, 20, or 10 points!',
    minPlayers: 2,
    maxPlayers: 12,
    estimatedMinutes: '15–20m',
    category: 'Word Puzzle',
    badgeColor: '#a78bfa',
    accentColor: '#a78bfa',
    isAvailable: true,
    rules: [
      'Each round features a mystery word with 4 progressive clues.',
      'Clue 1 (Cryptic) = 40 pts, Clue 2 = 30 pts, Clue 3 = 20 pts, Clue 4 = 10 pts.',
      'Host reveals clues sequentially on the TV display.',
      'Ring in or shout your answer before time runs out to claim the points!',
    ],
  },
];

export function getGameById(id: string): GameCatalogItem | undefined {
  return GAMES_CATALOG.find((g) => g.id === id);
}
