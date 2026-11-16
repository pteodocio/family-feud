export interface RankedParticipant {
  id?: string;
  name: string;
  score: number;
}

export interface MatchOutcome<T extends RankedParticipant> {
  sorted: T[];
  topScore: number;
  winners: T[];
  isTie: boolean;
  winnerLabel: string;
}

/**
 * Resolves sorted standings and tie-aware winner metadata without mutating input.
 */
export function resolveMatchOutcome<T extends RankedParticipant>(
  participants: readonly T[]
): MatchOutcome<T> {
  if (participants.length === 0) {
    return {
      sorted: [],
      topScore: 0,
      winners: [],
      isTie: false,
      winnerLabel: 'Everyone',
    };
  }

  const sorted = [...participants].sort((a, b) => b.score - a.score);
  const topScore = sorted[0].score;
  const winners = sorted.filter((p) => p.score === topScore);
  const isTie = winners.length > 1;
  const winnerLabel = isTie ? 'Tie Game!' : winners[0].name;

  return {
    sorted,
    topScore,
    winners,
    isTie,
    winnerLabel,
  };
}
