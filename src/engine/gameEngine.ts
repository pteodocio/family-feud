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
  FastMoneySet,
  FastMoneyStep,
  Team,
} from '../types/game';
import { matchAnswer, checkFastMoneyDuplicate } from './answerMatcher';
import { FAST_MONEY_SETS } from '../data/fastMoney/fastMoneySets';
import {
  resolveFastMoneyConflicts,
  isQuestionConflicting,
  type PlayedQuestionRecord,
} from './questionConflictDetector';

export interface CreateGameParams {
  id: string;
  title: string;
  team1Name: string;
  team2Name: string;
  config: GameConfig;
  regularQuestions: Question[];
  fastMoneyQuestions?: Question[];
  fastMoneySet?: FastMoneySet | null;
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
    fastMoneySet,
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

  const playedQuestions: Question[] = regularQuestions.slice(0, config.roundsCount);

  const rounds: RoundState[] = playedQuestions.map((q, idx) => ({
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

  const playedQuestionHistory: PlayedQuestionRecord[] = playedQuestions.map((q) => ({
    id: q.id,
    prompt: q.prompt,
    answers: q.answers.map((a) => a.text),
  }));

  const playedQuestionIds: string[] = playedQuestions.map((q) => q.id);

  // Strictly independent Fast Money initialization
  let initialFastMoney: FastMoneyState | null = null;
  let fastMoneyError: string | null = null;

  if (!FAST_MONEY_SETS || FAST_MONEY_SETS.length === 0) {
    fastMoneyError = 'Fast Money question bank is unavailable or empty. Cannot load regular-round questions.';
  } else {
    let targetSet: FastMoneySet | null = null;

    if (fastMoneySet) {
      targetSet = fastMoneySet;
    } else if (fastMoneyQuestions && fastMoneyQuestions.length >= 5) {
      // Allow custom Fast Money questions only if they strictly do NOT conflict with regular questions
      const hasConflict = fastMoneyQuestions.some((fmQ) =>
        isQuestionConflicting(fmQ, playedQuestionHistory).isConflict
      );
      if (!hasConflict) {
        targetSet = {
          id: 'fm_custom',
          title: 'Custom Fast Money Set',
          description: 'Custom questions set',
          questions: fastMoneyQuestions.slice(0, 5),
        };
      }
    }

    if (!targetSet) {
      targetSet = FAST_MONEY_SETS[0];
    }

    const conflictResult = resolveFastMoneyConflicts(targetSet, playedQuestionHistory, FAST_MONEY_SETS);
    if (conflictResult.resolvedSet) {
      initialFastMoney = {
        ...createInitialFastMoneyState(
          conflictResult.resolvedSet.questions,
          config.fastMoneyTarget,
          config.fastMoneyTimer1,
          config.fastMoneyTimer2
        ),
        setId: conflictResult.resolvedSet.id,
        setTitle: conflictResult.resolvedSet.title,
        step: 'setup',
      };
    } else {
      fastMoneyError = conflictResult.error || 'Failed to initialize conflict-free Fast Money set.';
    }
  }

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
    fastMoneyError,
    playedQuestionIds,
    playedQuestionHistory,
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
      isPassed: false,
      rawInput: '',
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
    step: 'setup',
    currentQuestionIndex: 0,
    passedIndices: [],
    duplicateWarning: null,
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
 * Un-reveals / hides a previously revealed answer (e.g., host accidentally clicked or misheard).
 * Deducts answer points from the round bank if the bank hasn't yet been awarded to a team.
 */
export function hideAnswer(session: GameSession, answerId: string): GameSession {
  const round = session.rounds[session.currentRoundIndex];
  if (!round) return session;

  if (!round.revealedAnswerIds.includes(answerId)) {
    return session;
  }

  const answer = round.question.answers.find((a) => a.id === answerId);
  if (!answer) return session;

  const newRevealedIds = round.revealedAnswerIds.filter((id) => id !== answerId);
  const newBank = round.isBankAwarded
    ? round.roundBank
    : Math.max(0, round.roundBank - answer.points);

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
      `Answer hidden: "${answer.text}" (-${answer.points} pts from bank). Bank now: ${newBank}`,
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

  const played: PlayedQuestionRecord[] =
    session.playedQuestionHistory && session.playedQuestionHistory.length > 0
      ? session.playedQuestionHistory
      : session.rounds.map((r) => ({
          id: r.question.id,
          prompt: r.question.prompt,
          answers: r.question.answers.map((a) => a.text),
        }));

  let fastMoney = session.fastMoney;
  let fastMoneyError = session.fastMoneyError ?? null;

  if (!FAST_MONEY_SETS || FAST_MONEY_SETS.length === 0) {
    fastMoney = null;
    fastMoneyError =
      'Fast Money question bank is unavailable or empty. Cannot load regular-round questions.';
  } else if (!fastMoney || !fastMoney.setId) {
    const validation = resolveFastMoneyConflicts(FAST_MONEY_SETS[0], played, FAST_MONEY_SETS);
    if (validation.resolvedSet) {
      fastMoney = {
        ...createInitialFastMoneyState(
          validation.resolvedSet.questions,
          session.config.fastMoneyTarget,
          session.config.fastMoneyTimer1,
          session.config.fastMoneyTimer2
        ),
        setId: validation.resolvedSet.id,
        setTitle: validation.resolvedSet.title,
        winningTeamId,
        step: 'setup',
      };
      fastMoneyError = null;
    } else {
      fastMoney = null;
      fastMoneyError = validation.error || 'Failed to initialize conflict-free Fast Money questions.';
    }
  } else {
    // Re-validate existing fastMoney against played questions
    const currentSet: FastMoneySet = {
      id: fastMoney.setId,
      title: fastMoney.setTitle || 'Fast Money Set',
      description: '',
      questions: fastMoney.questions,
    };
    const validation = resolveFastMoneyConflicts(currentSet, played, FAST_MONEY_SETS);
    if (validation.resolvedSet) {
      fastMoney = {
        ...fastMoney,
        questions: validation.resolvedSet.questions,
        winningTeamId,
      };
      fastMoneyError = null;
    } else {
      fastMoney = null;
      fastMoneyError = validation.error || 'Conflict detected in Fast Money questions.';
    }
  }

  return {
    ...session,
    phase: GamePhase.FAST_MONEY,
    winnerTeamId: winningTeamId,
    fastMoney,
    fastMoneyError,
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
 * Navigates directly to a specific regular round index (0-based) for host question navigation.
 */
export function navigateToRound(session: GameSession, targetRoundIndex: number): GameSession {
  if (targetRoundIndex < 0 || targetRoundIndex >= session.rounds.length) {
    return session;
  }

  const targetRound = session.rounds[targetRoundIndex];
  const phase = targetRound.isBankAwarded
    ? GamePhase.ROUND_SUMMARY
    : targetRound.revealedAnswerIds.length > 0 || targetRound.controlTeamId
    ? GamePhase.REGULAR
    : GamePhase.FACEOFF;

  const currentPlayedHistory = session.playedQuestionHistory || [];
  const currentPlayedIds = session.playedQuestionIds || [];

  const updatedHistory = currentPlayedIds.includes(targetRound.question.id)
    ? currentPlayedHistory
    : [
        ...currentPlayedHistory,
        {
          id: targetRound.question.id,
          prompt: targetRound.question.prompt,
          answers: targetRound.question.answers.map((a) => a.text),
        },
      ];

  const updatedIds = currentPlayedIds.includes(targetRound.question.id)
    ? currentPlayedIds
    : [...currentPlayedIds, targetRound.question.id];

  return {
    ...session,
    phase,
    currentRoundIndex: targetRoundIndex,
    playedQuestionHistory: updatedHistory,
    playedQuestionIds: updatedIds,
    actionLog: [...session.actionLog, `Host navigated to Round ${targetRoundIndex + 1}`],
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Navigates to previous round if available.
 */
export function previousRound(session: GameSession): GameSession {
  if (session.currentRoundIndex > 0) {
    return navigateToRound(session, session.currentRoundIndex - 1);
  }
  return session;
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
 * Load a complete Fast Money set (questions, set title/id) into the session.
 * Validates against played questions and replaces any conflicting questions.
 * If the question bank is unavailable or empty, does not start and sets fastMoneyError.
 */
export function initFastMoneyWithSet(session: GameSession, set: FastMoneySet): GameSession {
  const targetScore = session.fastMoney?.targetScore ?? session.config.fastMoneyTarget ?? 200;
  const timer1 = session.config.fastMoneyTimer1 ?? 20;
  const timer2 = session.config.fastMoneyTimer2 ?? 25;

  if (!FAST_MONEY_SETS || FAST_MONEY_SETS.length === 0) {
    return {
      ...session,
      fastMoney: null,
      fastMoneyError: 'Fast Money question bank is unavailable or empty. Cannot load regular-round questions.',
      actionLog: [...session.actionLog, 'Failed to load Fast Money: question bank unavailable.'],
      updatedAt: new Date().toISOString(),
    };
  }

  const played: PlayedQuestionRecord[] =
    session.playedQuestionHistory && session.playedQuestionHistory.length > 0
      ? session.playedQuestionHistory
      : session.rounds.map((r) => ({
          id: r.question.id,
          prompt: r.question.prompt,
          answers: r.question.answers.map((a) => a.text),
        }));

  const validation = resolveFastMoneyConflicts(set, played, FAST_MONEY_SETS);
  if (validation.error || !validation.resolvedSet) {
    return {
      ...session,
      fastMoney: null,
      fastMoneyError: validation.error || 'Failed to initialize Fast Money set without conflicts.',
      actionLog: [...session.actionLog, `Error loading Fast Money set: ${validation.error}`],
      updatedAt: new Date().toISOString(),
    };
  }

  const cleanSet = validation.resolvedSet;
  const newFastMoney: FastMoneyState = {
    ...createInitialFastMoneyState(cleanSet.questions.slice(0, 5), targetScore, timer1, timer2),
    setId: cleanSet.id,
    setTitle: cleanSet.title,
    step: 'setup',
    currentQuestionIndex: 0,
    passedIndices: [],
    duplicateWarning: null,
    winningTeamId: session.fastMoney?.winningTeamId ?? null,
  };

  const actionNotice =
    validation.replacedCount > 0
      ? `Loaded Fast Money set: "${cleanSet.title}" (${validation.replacedCount} conflicting question(s) auto-replaced with clean questions)`
      : `Loaded Fast Money set: "${cleanSet.title}"`;

  return {
    ...session,
    fastMoney: newFastMoney,
    fastMoneyError: null,
    actionLog: [...session.actionLog, actionNotice],
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Start a player's round in Fast Money (starts their timer and sets active question to 0).
 */
export function startFastMoneyPlayer(session: GameSession, playerNum: 1 | 2): GameSession {
  if (!session.fastMoney) return session;
  const playerKey = playerNum === 1 ? 'player1' : 'player2';
  const player = session.fastMoney[playerKey];
  const defaultTimer =
    playerNum === 1 ? (session.config.fastMoneyTimer1 ?? 20) : (session.config.fastMoneyTimer2 ?? 25);

  const updatedPlayer: FastMoneyPlayerState = {
    ...player,
    timerRemaining: player.timerRemaining > 0 ? player.timerRemaining : defaultTimer,
    timerRunning: true,
    isFinished: false,
  };

  return {
    ...session,
    fastMoney: {
      ...session.fastMoney,
      activePlayer: playerNum,
      step: playerNum === 1 ? 'player1_playing' : 'player2_playing',
      currentQuestionIndex: 0,
      passedIndices: [],
      duplicateWarning: null,
      [playerKey]: updatedPlayer,
    },
    actionLog: [...session.actionLog, `Started Fast Money round for Player ${playerNum}`],
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Passes the current question in Fast Money and advances to the next question.
 */
export function passFastMoneyQuestion(session: GameSession, playerNum: 1 | 2): GameSession {
  if (!session.fastMoney) return session;
  const currentIndex = session.fastMoney.currentQuestionIndex ?? 0;
  const passedIndices = session.fastMoney.passedIndices ?? [];
  const playerKey = playerNum === 1 ? 'player1' : 'player2';
  const player = session.fastMoney[playerKey];

  const newAnswers = [...player.answers];
  newAnswers[currentIndex] = {
    ...newAnswers[currentIndex],
    isPassed: true,
  };

  const newPassed = passedIndices.includes(currentIndex)
    ? passedIndices
    : [...passedIndices, currentIndex];

  // Find next unanswered or passed question:
  // 1. Look ahead (currentIndex + 1 .. 4)
  let nextIndex = -1;
  for (let i = currentIndex + 1; i < 5; i++) {
    const a = newAnswers[i];
    if (!a.submittedText || a.isPassed) {
      nextIndex = i;
      break;
    }
  }

  // 2. If none ahead, cycle back to earlier passed/unanswered questions
  if (nextIndex === -1) {
    for (let i = 0; i < 5; i++) {
      if (i !== currentIndex && (!newAnswers[i].submittedText || newAnswers[i].isPassed)) {
        nextIndex = i;
        break;
      }
    }
  }

  // If still none, stay at currentIndex
  if (nextIndex === -1) {
    nextIndex = currentIndex;
  }

  return {
    ...session,
    fastMoney: {
      ...session.fastMoney,
      currentQuestionIndex: nextIndex,
      passedIndices: newPassed,
      duplicateWarning: null,
      [playerKey]: {
        ...player,
        answers: newAnswers,
      },
    },
    actionLog: [...session.actionLog, `Player ${playerNum} passed Question ${currentIndex + 1}`],
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Submits an answer for the active question stepper, checks duplicates for Player 2,
 * calculates points, and advances to the next question.
 */
export function submitFastMoneyStepAnswer(
  session: GameSession,
  playerNum: 1 | 2,
  text: string,
  allowDuplicateOverride: boolean = false
): { session: GameSession; isDuplicate: boolean } {
  if (!session.fastMoney) return { session, isDuplicate: false };

  const currentIndex = session.fastMoney.currentQuestionIndex ?? 0;
  const question = session.fastMoney.questions[currentIndex];
  if (!question) return { session, isDuplicate: false };

  const playerKey = playerNum === 1 ? 'player1' : 'player2';
  const player = session.fastMoney[playerKey];

  const trimmed = text.trim();
  const match = matchAnswer(question, trimmed);

  // Check duplicate for Player 2
  if (playerNum === 2 && !allowDuplicateOverride) {
    const p1Answer = session.fastMoney.player1.answers[currentIndex];
    const isDup = checkFastMoneyDuplicate(
      p1Answer?.submittedText ?? '',
      p1Answer?.matchedAnswerId ?? null,
      trimmed,
      match.matchedAnswer?.id ?? null
    );

    if (isDup) {
      const updatedSession: GameSession = {
        ...session,
        fastMoney: {
          ...session.fastMoney,
          duplicateWarning: `Duplicate answer "${trimmed}"! Contestant must give another answer.`,
        },
      };
      return { session: updatedSession, isDuplicate: true };
    }
  }

  const newAnswers = [...player.answers];
  newAnswers[currentIndex] = {
    ...newAnswers[currentIndex],
    submittedText: trimmed,
    points: match.points,
    matchedAnswerId: match.matchedAnswer?.id ?? null,
    isAccepted: match.isMatch,
    isPassed: false,
    rawInput: trimmed,
  };

  const totalScore = newAnswers.reduce((sum, a) => sum + (a.isAccepted ? a.points : 0), 0);
  const newPassed = (session.fastMoney.passedIndices ?? []).filter((idx) => idx !== currentIndex);

  // Find next unanswered or passed question
  let nextIndex = -1;
  // Look forward
  for (let i = currentIndex + 1; i < 5; i++) {
    if (!newAnswers[i].submittedText || newAnswers[i].isPassed) {
      nextIndex = i;
      break;
    }
  }
  // Look backward
  if (nextIndex === -1) {
    for (let i = 0; i < currentIndex; i++) {
      if (!newAnswers[i].submittedText || newAnswers[i].isPassed) {
        nextIndex = i;
        break;
      }
    }
  }

  const allAnswered = nextIndex === -1;
  const nextStep = allAnswered
    ? (playerNum === 1 ? 'player1_review' : 'player2_review')
    : session.fastMoney.step;

  const updatedPlayer: FastMoneyPlayerState = {
    ...player,
    answers: newAnswers,
    totalScore,
    isFinished: allAnswered,
    timerRunning: allAnswered ? false : player.timerRunning,
  };

  const updatedFastMoney: FastMoneyState = {
    ...session.fastMoney,
    [playerKey]: updatedPlayer,
    step: nextStep,
    currentQuestionIndex: allAnswered ? currentIndex : nextIndex,
    passedIndices: newPassed,
    duplicateWarning: null,
    totalScore:
      playerNum === 1
        ? totalScore + session.fastMoney.player2.totalScore
        : session.fastMoney.player1.totalScore + totalScore,
  };

  return {
    session: {
      ...session,
      fastMoney: updatedFastMoney,
      actionLog: [
        ...session.actionLog,
        `Player ${playerNum} Q${currentIndex + 1}: "${trimmed}" (${match.points} pts)`,
      ],
      updatedAt: new Date().toISOString(),
    },
    isDuplicate: false,
  };
}

/**
 * Jump to a specific question index in Fast Money stepper.
 */
export function setFastMoneyQuestionIndex(session: GameSession, index: number): GameSession {
  if (!session.fastMoney) return session;
  return {
    ...session,
    fastMoney: {
      ...session.fastMoney,
      currentQuestionIndex: Math.max(0, Math.min(4, index)),
      duplicateWarning: null,
    },
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Manually switch the Fast Money phase/step.
 */
export function setFastMoneyStep(session: GameSession, step: FastMoneyStep): GameSession {
  if (!session.fastMoney) return session;
  return {
    ...session,
    fastMoney: {
      ...session.fastMoney,
      step,
      duplicateWarning: null,
    },
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Restart Fast Money round for the current set.
 */
export function restartFastMoneyRound(session: GameSession): GameSession {
  if (!session.fastMoney) return session;
  const questions = session.fastMoney.questions;
  const targetScore = session.fastMoney.targetScore;
  const timer1 = session.config.fastMoneyTimer1 ?? 20;
  const timer2 = session.config.fastMoneyTimer2 ?? 25;

  const fresh = createInitialFastMoneyState(questions, targetScore, timer1, timer2);
  fresh.setId = session.fastMoney.setId;
  fresh.setTitle = session.fastMoney.setTitle;
  fresh.winningTeamId = session.fastMoney.winningTeamId;

  return {
    ...session,
    phase: GamePhase.FAST_MONEY,
    fastMoney: fresh,
    actionLog: [...session.actionLog, 'Restarted Fast Money round'],
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

/**
 * Concludes the game directly and transitions to FINAL_RESULTS screen.
 */
export function endGame(session: GameSession): GameSession {
  const winnerTeamId =
    session.team1.score >= session.team2.score ? session.team1.id : session.team2.id;
  const winnerName =
    winnerTeamId === session.team1.id ? session.team1.name : session.team2.name;

  return {
    ...session,
    phase: GamePhase.FINAL_RESULTS,
    winnerTeamId,
    actionLog: [
      ...session.actionLog,
      `Host concluded the game. Final Champion: ${winnerName}!`,
    ],
    updatedAt: new Date().toISOString(),
  };
}
