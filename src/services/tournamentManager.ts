import type { GameCatalogId } from '../types/hub';

export interface TournamentRound {
  gameId: GameCatalogId;
  gameName: string;
  isCompleted: boolean;
  winnerTeamName?: string;
}

export interface TournamentStanding {
  teamName: string;
  color: string;
  totalScore: number;
  gamesWon: number;
}

export interface TournamentSession {
  id: string;
  title: string;
  currentRoundIndex: number;
  rounds: TournamentRound[];
  standings: TournamentStanding[];
  isFinished?: boolean;
  createdAt: string;
}

const STORAGE_KEY = 'hub_active_tournament_session';

export function getActiveTournament(): TournamentSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

export function saveActiveTournament(session: TournamentSession): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {}
}

export function clearActiveTournament(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

export function createNewTournament(
  title: string,
  gameIds: GameCatalogId[],
  teamNames: string[] = ['Santos Family', 'Reyes Family']
): TournamentSession {
  const roundNames: Record<GameCatalogId, string> = {
    'family-feud': 'Family Feud',
    'family-trivia': 'Family Trivia',
    'charades': 'Charades Party',
    'pictionary': 'Pictionary',
    'family-bingo': 'Family Bingo',
    'guess-the-word': 'Guess the Word',
    'password': 'Password',
    'catchphrase': 'Catchphrase',
    'taboo': 'Taboo',
    'jeopardy': 'Jeopardy!',
    'wheel-of-fortune': 'Wheel of Fortune',
    'bluff-the-answer': 'Bluff the Answer',
    'heads-up': 'Heads Up!',
    'word-hunt': 'Word Hunt',
    'scattergories': 'Scattergories',
    'trivia-elimination': 'Trivia Elimination',
  };

  const rounds: TournamentRound[] = gameIds.map((id) => ({
    gameId: id,
    gameName: roundNames[id] || id,
    isCompleted: false,
  }));

  const standings: TournamentStanding[] = teamNames.map((name, idx) => ({
    teamName: name,
    color: idx === 0 ? 'blue' : idx === 1 ? 'red' : 'gold',
    totalScore: 0,
    gamesWon: 0,
  }));

  const session: TournamentSession = {
    id: `tourn_${Date.now()}`,
    title,
    currentRoundIndex: 0,
    rounds,
    standings,
    isFinished: false,
    createdAt: new Date().toISOString(),
  };

  saveActiveTournament(session);
  return session;
}

export function recordTournamentRoundResult(
  rankings: Array<{ teamName: string; matchScore: number }>,
  roundIndex?: number
): TournamentSession | null {
  const active = getActiveTournament();
  const targetIndex = roundIndex !== undefined ? roundIndex : active?.currentRoundIndex;
  if (!active || targetIndex === undefined || !active.rounds[targetIndex]) return null;

  // Award tournament points: 1st = 100 pts, 2nd = 60 pts, 3rd = 30 pts
  const pointsMap = [100, 60, 30, 15];

  const sortedRankings = [...rankings].sort((a, b) => b.matchScore - a.matchScore);
  const winner = sortedRankings[0];

  active.rounds[targetIndex].isCompleted = true;
  active.rounds[targetIndex].winnerTeamName = winner?.teamName || 'Tied';

  for (let i = 0; i < sortedRankings.length; i++) {
    const rank = sortedRankings[i];
    const standing = active.standings.find((s) => s.teamName === rank.teamName);
    if (standing) {
      standing.totalScore += pointsMap[i] || 10;
      if (i === 0) standing.gamesWon += 1;
    }
  }

  // Sort standings by total tournament score
  active.standings.sort((a, b) => b.totalScore - a.totalScore);
  if (targetIndex + 1 < active.rounds.length) {
    active.currentRoundIndex = targetIndex + 1;
    active.isFinished = false;
  } else {
    active.currentRoundIndex = active.rounds.length;
    active.isFinished = true;
  }

  saveActiveTournament(active);
  return active;
}
