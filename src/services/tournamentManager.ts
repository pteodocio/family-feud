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

  // Idempotency guard: prevent double-awarding an already completed round
  if (active.rounds[targetIndex].isCompleted) {
    return active;
  }

  // Award tournament points: 1st = 100 pts, 2nd = 60 pts, 3rd = 30 pts
  const pointsMap = [100, 60, 30, 15];

  const sortedRankings = [...rankings].sort((a, b) => b.matchScore - a.matchScore);
  const topScore = sortedRankings[0]?.matchScore;
  const topWinners = sortedRankings.filter((r) => r.matchScore === topScore);
  const isTie = topWinners.length > 1;

  active.rounds[targetIndex].isCompleted = true;
  active.rounds[targetIndex].winnerTeamName = isTie
    ? 'Tie Game!'
    : topWinners[0]?.teamName || 'Tied';

  let currentRank = 0;
  for (let i = 0; i < sortedRankings.length; i++) {
    if (i > 0 && sortedRankings[i].matchScore < sortedRankings[i - 1].matchScore) {
      currentRank = i;
    }
    const rank = sortedRankings[i];
    const standing = active.standings.find(
      (s) => s.teamName.trim().toLowerCase() === rank.teamName.trim().toLowerCase()
    );
    if (standing) {
      standing.totalScore += pointsMap[currentRank] ?? 10;
      if (currentRank === 0) standing.gamesWon += 1;
    }
  }

  // Sort standings by total tournament score
  active.standings.sort((a, b) => b.totalScore - a.totalScore);
  const nextIncomplete = active.rounds.findIndex((r) => !r.isCompleted);
  if (nextIncomplete !== -1) {
    active.currentRoundIndex = nextIncomplete;
    active.isFinished = false;
  } else {
    active.currentRoundIndex = active.rounds.length;
    active.isFinished = true;
  }

  saveActiveTournament(active);
  return active;
}

/**
 * Automatically records match scores into an active tournament if the current
 * uncompleted round matches `gameId`.
 */
export function recordActiveTournamentIfMatching(
  gameId: GameCatalogId,
  participants: Array<{ name: string; score: number }>
): TournamentSession | null {
  const active = getActiveTournament();
  if (!active || active.isFinished) return null;

  const currentRound = active.rounds[active.currentRoundIndex];
  if (!currentRound || currentRound.isCompleted || currentRound.gameId !== gameId) {
    return null;
  }

  const byLowerName = new Map(
    participants.map((p) => [p.name.trim().toLowerCase(), p.score] as const)
  );
  const matchedAnyName = active.standings.some((s) =>
    byLowerName.has(s.teamName.trim().toLowerCase())
  );

  const rankings = active.standings.map((s, idx) => ({
    teamName: s.teamName,
    matchScore: matchedAnyName
      ? (byLowerName.get(s.teamName.trim().toLowerCase()) ?? 0)
      : (participants[idx]?.score ?? 0),
  }));

  return recordTournamentRoundResult(rankings, active.currentRoundIndex);
}
