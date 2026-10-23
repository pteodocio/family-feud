import {
  GamePhase,
} from '../types/game';
import type {
  GameConfig,
  GamePhaseType,
  GameSession,
  Question,
  RoundState,
  FastMoneyState,
  FastMoneyPlayerState,
  Team,
} from '../types/game';

export interface CreateGameParams {
  id: string;
  title: string;
  team1Name: string;
  team2Name: string;
  config: GameConfig;
  regularQuestions: Question[];
  fastMoneyQuestions: Question[];
  packId: string;
}

/**
 * Creates a brand new game session initialized at the SETUP or FACEOFF phase.
 */
export function createGameSession(params: CreateGameParams): GameSession {
  const {
    id,
    title,
    team1Name,
    team2Name,
    config,
    regularQuestions,
    fastMoneyQuestions,
    packId,
  } = params;

  const team1: Team = {
    id: 'team1',
    name: team1Name.trim() || 'Team 1',
    score: 0,
    color: 'blue',
  };

  const team2: Team = {
    id: 'team2',
    name: team2Name.trim() || 'Team 2',
    score: 0,
    color: 'red',
  };

  const rounds: RoundState[] = regularQuestions.slice(0, config.roundsCount).map((q, idx) => ({
    roundIndex: idx,
    multiplier: config.multipliers[idx] ?? (idx === 2 ? 2 : idx >= 3 ? 3 : 1),
    question: q,
    revealedAnswerIds: [],
    roundBank: 0,
    strikes: 0,
    activeTeamId: null,
    controlTeamId: null,
    faceOffWinnerTeamId: null,
    stealTeamId: null,
    stealResult: null,
    isBankAwarded: false,
    awardedToTeamId: null,
    awardedPoints: 0,
  }));

  const initialFastMoney: FastMoneyState = createInitialFastMoneyState(
    fastMoneyQuestions.slice(0, 5),
    config.fastMoneyTarget,
    config.fastMoneyTimer1,
    config.fastMoneyTimer2
  );

  return {
    id,
    title,
    config,
    team1,
    team2,
    phase: GamePhase.FACEOFF,
    packId,
    rounds,
    currentRoundIndex: 0,
    fastMoney: initialFastMoney,
    winnerTeamId: null,
    scoreAdjustments: [],
    actionLog: [`Game "${title}" started with ${team1.name} vs ${team2.name}`],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function createInitialFastMoneyState(
  questions: Question[],
  targetScore: number,
  timer1: number,
  timer2: number
): FastMoneyState {
  const createPlayer = (name: string, timer: number): FastMoneyPlayerState => ({
    name,
    answers: questions.map((q) => ({
      questionId: q.id,
      prompt: q.prompt,
      submittedText: '',
      points: 0,
      matchedAnswerId: null,
      isAccepted: false,
      isRevealed: false,
    })),
    revealedAnswerIndices: [],
    revealedPointsIndices: [],
    timerRemaining: timer,
    timerRunning: false,
    isFinished: false,
    totalScore: 0,
  });

  return {
    questions,
    player1: createPlayer('Player 1', timer1),
    player2: createPlayer('Player 2', timer2),
    activePlayer: 1,
    winningTeamId: null,
    targetScore,
    totalScore: 0,
    isCompleted: false,
    won: null,
  };
}

/**
 * Reveal a specific answer in the current round.
 * Idempotent: Does not double-score if already revealed.
 */
export function revealAnswer(session: GameSession, answerId: string): GameSession {
  const round = session.rounds[session.currentRoundIndex];
  if (!round) return session;

  if (round.revealedAnswerIds.includes(answerId)) {
    return session;
  }

  const answer = round.question.answers.find((a) => a.id === answerId);
  if (!answer) return session;

  const newRevealedIds = [...round.revealedAnswerIds, answerId];
  // Only add points to bank if bank hasn't already been awarded
  const newBank = round.isBankAwarded ? round.roundBank : round.roundBank + answer.points;

  const updatedRound: RoundState = {
    ...round,
    revealedAnswerIds: newRevealedIds,
    roundBank: newBank,
  };

  const updatedRounds = [...session.rounds];
  updatedRounds[session.currentRoundIndex] = updatedRound;

  return {
    ...session,
    rounds: updatedRounds,
    actionLog: [
      ...session.actionLog,
      `Answer revealed: "${answer.text}" (${answer.points} pts). Bank now: ${newBank}`,
    ],
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Reveal all remaining unrevealed answers for the current round (e.g., end-of-round board reveal).
 * Does not add points to round bank if round has concluded or is already awarded.
 */
export function revealAllRemainingAnswers(session: GameSession): GameSession {
  const round = session.rounds[session.currentRoundIndex];
  if (!round) return session;

  const allAnswerIds = round.question.answers.map((a) => a.id);
  const updatedRound: RoundState = {
    ...round,
    revealedAnswerIds: allAnswerIds,
  };

  const updatedRounds = [...session.rounds];
  updatedRounds[session.currentRoundIndex] = updatedRound;

  return {
    ...session,
    rounds: updatedRounds,
    actionLog: [...session.actionLog, 'Host revealed all remaining answers on the board'],
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Record a strike for the active team.
 * Reaching 3 strikes triggers the STEAL phase and switches the active team to the opposing team.
 */
export function recordStrike(session: GameSession): GameSession {
  const round = session.rounds[session.currentRoundIndex];
  if (!round) return session;

  if (round.strikes >= 3 || session.phase === GamePhase.ROUND_SUMMARY) {
    return session;
  }

  const newStrikes = round.strikes + 1;
  const isNowThreeStrikes = newStrikes === 3;

  let newPhase: GamePhaseType = session.phase;
  let stealTeamId = round.stealTeamId;

  if (isNowThreeStrikes && session.phase === GamePhase.REGULAR) {
    newPhase = GamePhase.STEAL;
    // The steal goes to the opposite of the control/active team
    stealTeamId =
      round.controlTeamId === session.team1.id
        ? session.team2.id
        : session.team1.id;
  }

  const updatedRound: RoundState = {
    ...round,
    strikes: newStrikes,
    stealTeamId,
  };

  const updatedRounds = [...session.rounds];
  updatedRounds[session.currentRoundIndex] = updatedRound;

  return {
    ...session,
    phase: newPhase,
    rounds: updatedRounds,
    actionLog: [
      ...session.actionLog,
      `Strike recorded (Strike ${newStrikes}/3)${
        isNowThreeStrikes ? ` — Steal opportunity for ${stealTeamId === session.team1.id ? session.team1.name : session.team2.name}` : ''
      }`,
    ],
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Clear a strike (for host error correction).
 */
export function clearStrike(session: GameSession): GameSession {
  const round = session.rounds[session.currentRoundIndex];
  if (!round || round.strikes <= 0) return session;

  const newStrikes = round.strikes - 1;
  let newPhase = session.phase;

  // If we were in STEAL phase and host undoes strike 3, return to REGULAR phase
  if (session.phase === GamePhase.STEAL && newStrikes < 3) {
    newPhase = GamePhase.REGULAR;
  }

  const updatedRound: RoundState = {
    ...round,
    strikes: newStrikes,
  };

  const updatedRounds = [...session.rounds];
  updatedRounds[session.currentRoundIndex] = updatedRound;

  return {
    ...session,
    phase: newPhase,
    rounds: updatedRounds,
    actionLog: [...session.actionLog, `Strike cleared. Current strikes: ${newStrikes}`],
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Sets the face-off winner and decides whether they play or pass.
 */
export function resolveFaceOff(
  session: GameSession,
  winnerTeamId: string,
  decision: 'play' | 'pass'
): GameSession {
  const round = session.rounds[session.currentRoundIndex];
  if (!round) return session;

  const opposingTeamId =
    winnerTeamId === session.team1.id ? session.team2.id : session.team1.id;

  const playingTeamId = decision === 'play' ? winnerTeamId : opposingTeamId;
  const playingTeamName =
    playingTeamId === session.team1.id ? session.team1.name : session.team2.name;

  const updatedRound: RoundState = {
    ...round,
    faceOffWinnerTeamId: winnerTeamId,
    controlTeamId: playingTeamId,
    activeTeamId: playingTeamId,
  };

  const updatedRounds = [...session.rounds];
  updatedRounds[session.currentRoundIndex] = updatedRound;

  return {
    ...session,
    phase: GamePhase.REGULAR,
    rounds: updatedRounds,
    actionLog: [
      ...session.actionLog,
      `Face-off won by ${winnerTeamId === session.team1.id ? session.team1.name : session.team2.name}. Chose to ${decision}. ${playingTeamName} controls the board.`,
    ],
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Resolves the steal attempt by the opposing team.
 * If successful: stealing team gets roundBank * multiplier.
 * If failed: original control team gets roundBank * multiplier.
 * Multiplier is applied exactly once.
 */
export function resolveSteal(session: GameSession, isSuccessful: boolean): GameSession {
  const round = session.rounds[session.currentRoundIndex];
  if (!round || session.phase !== GamePhase.STEAL || round.isBankAwarded) {
    return session;
  }

  const winningTeamId = isSuccessful
    ? round.stealTeamId!
    : round.controlTeamId!;

  const awardedPoints = round.roundBank * round.multiplier;

  const updatedRound: RoundState = {
    ...round,
    stealResult: isSuccessful ? 'success' : 'failure',
    isBankAwarded: true,
    awardedToTeamId: winningTeamId,
    awardedPoints,
  };

  const updatedRounds = [...session.rounds];
  updatedRounds[session.currentRoundIndex] = updatedRound;

  const team1Score =
    winningTeamId === session.team1.id
      ? session.team1.score + awardedPoints
      : session.team1.score;

  const team2Score =
    winningTeamId === session.team2.id
      ? session.team2.score + awardedPoints
      : session.team2.score;

  const winningTeamName =
    winningTeamId === session.team1.id ? session.team1.name : session.team2.name;

  return {
    ...session,
    phase: GamePhase.ROUND_SUMMARY,
    rounds: updatedRounds,
    team1: { ...session.team1, score: team1Score },
    team2: { ...session.team2, score: team2Score },
    actionLog: [
      ...session.actionLog,
      `Steal ${isSuccessful ? 'SUCCESSFUL' : 'FAILED'}! ${winningTeamName} awarded ${awardedPoints} points (${round.roundBank} x ${round.multiplier}).`,
    ],
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Awards round bank directly to a team (e.g. control team cleared the board without striking out,
 * or host awards round directly).
 * Multiplier applied exactly once.
 */
export function awardRoundBank(session: GameSession, teamId: string): GameSession {
  const round = session.rounds[session.currentRoundIndex];
  if (!round || round.isBankAwarded) {
    return session;
  }

  const awardedPoints = round.roundBank * round.multiplier;

  const updatedRound: RoundState = {
    ...round,
    isBankAwarded: true,
    awardedToTeamId: teamId,
    awardedPoints,
  };

  const updatedRounds = [...session.rounds];
  updatedRounds[session.currentRoundIndex] = updatedRound;

  const team1Score =
    teamId === session.team1.id
      ? session.team1.score + awardedPoints
      : session.team1.score;

  const team2Score =
    teamId === session.team2.id
      ? session.team2.score + awardedPoints
      : session.team2.score;

  const teamName = teamId === session.team1.id ? session.team1.name : session.team2.name;

  return {
    ...session,
    phase: GamePhase.ROUND_SUMMARY,
    rounds: updatedRounds,
    team1: { ...session.team1, score: team1Score },
    team2: { ...session.team2, score: team2Score },
    actionLog: [
      ...session.actionLog,
      `${teamName} awarded ${awardedPoints} points (${round.roundBank} x ${round.multiplier}).`,
    ],
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Adjust a team's score manually with a logged reason.
 */
export function adjustTeamScore(
  session: GameSession,
  teamId: string,
  delta: number,
  reason: string
): GameSession {
  const team1Score =
    teamId === session.team1.id ? session.team1.score + delta : session.team1.score;
  const team2Score =
    teamId === session.team2.id ? session.team2.score + delta : session.team2.score;

  const teamName = teamId === session.team1.id ? session.team1.name : session.team2.name;

  return {
    ...session,
    team1: { ...session.team1, score: Math.max(0, team1Score) },
    team2: { ...session.team2, score: Math.max(0, team2Score) },
    scoreAdjustments: [
      ...session.scoreAdjustments,
      { timestamp: Date.now(), teamId, delta, reason },
    ],
    actionLog: [
      ...session.actionLog,
      `Manual score adjustment for ${teamName}: ${delta > 0 ? `+${delta}` : delta} pts (${reason})`,
    ],
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Advance to the next round, or advance to Fast Money / Final Results if all rounds completed.
 */
export function advanceToNextRound(session: GameSession): GameSession {
  const nextRoundIndex = session.currentRoundIndex + 1;

  if (nextRoundIndex < session.rounds.length) {
    return {
      ...session,
      currentRoundIndex: nextRoundIndex,
      phase: GamePhase.FACEOFF,
      actionLog: [
        ...session.actionLog,
        `Advanced to Round ${nextRoundIndex + 1} (${session.rounds[nextRoundIndex].multiplier}x points)`,
      ],
      updatedAt: new Date().toISOString(),
    };
  }

  // All regular rounds completed -> Determine winning team
  const winningTeamId =
    session.team1.score >= session.team2.score
      ? session.team1.id
      : session.team2.id;

  const fastMoney = session.fastMoney
    ? {
        ...session.fastMoney,
        winningTeamId,
      }
    : null;

  return {
    ...session,
    phase: GamePhase.FAST_MONEY,
    winnerTeamId: winningTeamId,
    fastMoney,
    actionLog: [
      ...session.actionLog,
      `Regular rounds complete! ${
        winningTeamId === session.team1.id ? session.team1.name : session.team2.name
      } leads with highest score and advances to Fast Money!`,
    ],
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Fast Money Answer Submission & Scoring
 */
export function submitFastMoneyAnswer(
  session: GameSession,
  playerNum: 1 | 2,
  questionIndex: number,
  answerText: string,
  points: number,
  matchedAnswerId: string | null = null,
  isAccepted: boolean = true
): GameSession {
  if (!session.fastMoney) return session;

  const playerKey = playerNum === 1 ? 'player1' : 'player2';
  const player = session.fastMoney[playerKey];
  const newAnswers = [...player.answers];

  newAnswers[questionIndex] = {
    ...newAnswers[questionIndex],
    submittedText: answerText,
    points: Math.max(0, points),
    matchedAnswerId,
    isAccepted,
  };

  const totalScore = newAnswers.reduce((sum, a) => sum + (a.isAccepted ? a.points : 0), 0);

  const updatedFastMoney: FastMoneyState = {
    ...session.fastMoney,
    [playerKey]: {
      ...player,
      answers: newAnswers,
      totalScore,
    },
    totalScore:
      playerNum === 1
        ? totalScore + session.fastMoney.player2.totalScore
        : session.fastMoney.player1.totalScore + totalScore,
  };

  return {
    ...session,
    fastMoney: updatedFastMoney,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Reveal an individual answer in Fast Money.
 */
export function revealFastMoneyAnswer(
  session: GameSession,
  playerNum: 1 | 2,
  questionIndex: number
): GameSession {
  if (!session.fastMoney) return session;

  const playerKey = playerNum === 1 ? 'player1' : 'player2';
  const player = session.fastMoney[playerKey];

  if (player.revealedAnswerIndices.includes(questionIndex)) {
    return session;
  }

  const updatedPlayer: FastMoneyPlayerState = {
    ...player,
    revealedAnswerIndices: [...player.revealedAnswerIndices, questionIndex],
  };

  return {
    ...session,
    fastMoney: {
      ...session.fastMoney,
      [playerKey]: updatedPlayer,
    },
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Reveal points for an individual answer in Fast Money.
 */
export function revealFastMoneyPoints(
  session: GameSession,
  playerNum: 1 | 2,
  questionIndex: number
): GameSession {
  if (!session.fastMoney) return session;

  const playerKey = playerNum === 1 ? 'player1' : 'player2';
  const player = session.fastMoney[playerKey];

  if (player.revealedPointsIndices.includes(questionIndex)) {
    return session;
  }

  const updatedPlayer: FastMoneyPlayerState = {
    ...player,
    revealedPointsIndices: [...player.revealedPointsIndices, questionIndex],
  };

  return {
    ...session,
    fastMoney: {
      ...session.fastMoney,
      [playerKey]: updatedPlayer,
    },
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Switch active player in Fast Money (player 1 to player 2).
 */
export function switchFastMoneyPlayer(session: GameSession, playerNum: 1 | 2): GameSession {
  if (!session.fastMoney) return session;

  return {
    ...session,
    fastMoney: {
      ...session.fastMoney,
      activePlayer: playerNum,
    },
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Conclude Fast Money and determine win or loss.
 */
export function resolveFastMoney(session: GameSession): GameSession {
  if (!session.fastMoney) return session;

  const total =
    session.fastMoney.player1.totalScore + session.fastMoney.player2.totalScore;
  const won = total >= session.fastMoney.targetScore;

  return {
    ...session,
    phase: GamePhase.FINAL_RESULTS,
    fastMoney: {
      ...session.fastMoney,
      totalScore: total,
      isCompleted: true,
      won,
    },
    actionLog: [
      ...session.actionLog,
      `Fast Money completed! Total score: ${total}/${session.fastMoney.targetScore} — ${
        won ? 'VICTORY!' : 'Missed target score.'
      }`,
    ],
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Restart current round (reset board, strikes, bank).
 */
export function restartCurrentRound(session: GameSession): GameSession {
  const round = session.rounds[session.currentRoundIndex];
  if (!round) return session;

  // If points were already awarded to a team, deduct them
  let t1Score = session.team1.score;
  let t2Score = session.team2.score;

  if (round.isBankAwarded && round.awardedToTeamId) {
    if (round.awardedToTeamId === session.team1.id) {
      t1Score = Math.max(0, t1Score - round.awardedPoints);
    } else if (round.awardedToTeamId === session.team2.id) {
      t2Score = Math.max(0, t2Score - round.awardedPoints);
    }
  }

  const restartedRound: RoundState = {
    ...round,
    revealedAnswerIds: [],
    roundBank: 0,
    strikes: 0,
    activeTeamId: null,
    controlTeamId: null,
    faceOffWinnerTeamId: null,
    stealTeamId: null,
    stealResult: null,
    isBankAwarded: false,
    awardedToTeamId: null,
    awardedPoints: 0,
  };

  const updatedRounds = [...session.rounds];
  updatedRounds[session.currentRoundIndex] = restartedRound;

  return {
    ...session,
    phase: GamePhase.FACEOFF,
    team1: { ...session.team1, score: t1Score },
    team2: { ...session.team2, score: t2Score },
    rounds: updatedRounds,
    actionLog: [...session.actionLog, `Round ${session.currentRoundIndex + 1} restarted by host`],
    updatedAt: new Date().toISOString(),
  };
}
