import { describe, it, expect } from 'vitest';
import {
  createGameSession,
  revealAnswer,
  revealAllRemainingAnswers,
  recordStrike,
  clearStrike,
  resolveFaceOff,
  resolveSteal,
  awardRoundBank,
  advanceToNextRound,
  adjustTeamScore,
  submitFastMoneyAnswer,
  revealFastMoneyAnswer,
  revealFastMoneyPoints,
  resolveFastMoney,
  restartCurrentRound,
} from './gameEngine';
import { matchAnswer, normalizeText } from './answerMatcher';
import { GamePhase } from '../types/game';
import type { GameConfig, Question } from '../types/game';

const sampleQuestions: Question[] = [
  {
    id: 'q1',
    prompt: 'Name something you find in the kitchen',
    category: 'Household',
    answers: [
      { id: 'a1', text: 'Refrigerator', points: 35, acceptedVariants: ['fridge'], displayOrder: 1 },
      { id: 'a2', text: 'Stove / Oven', points: 25, acceptedVariants: ['stove', 'oven'], displayOrder: 2 },
      { id: 'a3', text: 'Microwave', points: 18, acceptedVariants: [], displayOrder: 3 },
      { id: 'a4', text: 'Sink', points: 12, acceptedVariants: [], displayOrder: 4 },
    ],
  },
  {
    id: 'q2',
    prompt: 'Name a popular Filipino dish',
    category: 'Food',
    answers: [
      { id: 'b1', text: 'Adobo', points: 42, acceptedVariants: ['chicken adobo', 'pork adobo'], displayOrder: 1 },
      { id: 'b2', text: 'Sinigang', points: 28, acceptedVariants: ['sinigang na baboy'], displayOrder: 2 },
      { id: 'b3', text: 'Lechon', points: 15, acceptedVariants: ['roast pig'], displayOrder: 3 },
      { id: 'b4', text: 'Pancit', points: 10, acceptedVariants: ['pansit', 'noodles'], displayOrder: 4 },
    ],
  },
  {
    id: 'q3',
    prompt: 'Name something you pack for a beach trip',
    category: 'Travel',
    answers: [
      { id: 'c1', text: 'Sunscreen', points: 38, acceptedVariants: ['sunblock'], displayOrder: 1 },
      { id: 'c2', text: 'Swimsuit', points: 30, acceptedVariants: ['swimming attire', 'bikini'], displayOrder: 2 },
      { id: 'c3', text: 'Towel', points: 20, acceptedVariants: ['beach towel'], displayOrder: 3 },
      { id: 'c4', text: 'Sunglasses', points: 12, acceptedVariants: ['shades'], displayOrder: 4 },
    ],
  },
  {
    id: 'q4',
    prompt: 'Name an excuse for being late to work',
    category: 'Work',
    answers: [
      { id: 'd1', text: 'Traffic', points: 48, acceptedVariants: ['heavy traffic', 'car jam'], displayOrder: 1 },
      { id: 'd2', text: 'Overslept / Alarm failed', points: 26, acceptedVariants: ['overslept', 'alarm'], displayOrder: 2 },
      { id: 'd3', text: 'Car trouble', points: 14, acceptedVariants: ['flat tire', 'breakdown'], displayOrder: 3 },
      { id: 'd4', text: 'Sick / Not feeling well', points: 8, acceptedVariants: ['headache'], displayOrder: 4 },
    ],
  },
];

const fastMoneyQuestions: Question[] = [
  {
    id: 'fm1',
    prompt: 'Name a month with 31 days',
    category: 'Calendar',
    answers: [
      { id: 'fm1_1', text: 'January', points: 30, acceptedVariants: [], displayOrder: 1 },
      { id: 'fm1_2', text: 'December', points: 25, acceptedVariants: [], displayOrder: 2 },
      { id: 'fm1_3', text: 'July', points: 20, acceptedVariants: [], displayOrder: 3 },
    ],
  },
  {
    id: 'fm2',
    prompt: 'Name a color of the rainbow',
    category: 'Nature',
    answers: [
      { id: 'fm2_1', text: 'Red', points: 40, acceptedVariants: [], displayOrder: 1 },
      { id: 'fm2_2', text: 'Blue', points: 30, acceptedVariants: [], displayOrder: 2 },
      { id: 'fm2_3', text: 'Yellow', points: 15, acceptedVariants: [], displayOrder: 3 },
    ],
  },
  {
    id: 'fm3',
    prompt: 'Name a sport played with a ball',
    category: 'Sports',
    answers: [
      { id: 'fm3_1', text: 'Basketball', points: 45, acceptedVariants: [], displayOrder: 1 },
      { id: 'fm3_2', text: 'Soccer / Football', points: 30, acceptedVariants: ['football', 'soccer'], displayOrder: 2 },
    ],
  },
  {
    id: 'fm4',
    prompt: 'Name something people drink in the morning',
    category: 'Daily',
    answers: [
      { id: 'fm4_1', text: 'Coffee', points: 55, acceptedVariants: [], displayOrder: 1 },
      { id: 'fm4_2', text: 'Tea', points: 20, acceptedVariants: [], displayOrder: 2 },
      { id: 'fm4_3', text: 'Orange Juice', points: 15, acceptedVariants: ['juice', 'oj'], displayOrder: 3 },
    ],
  },
  {
    id: 'fm5',
    prompt: 'Name an animal kept as a house pet',
    category: 'Animals',
    answers: [
      { id: 'fm5_1', text: 'Dog', points: 52, acceptedVariants: ['puppy', 'canine'], displayOrder: 1 },
      { id: 'fm5_2', text: 'Cat', points: 38, acceptedVariants: ['kitten', 'feline'], displayOrder: 2 },
    ],
  },
];

const testConfig: GameConfig = {
  roundsCount: 4,
  multipliers: [1, 1, 2, 3],
  targetScore: 300,
  fastMoneyTimer1: 20,
  fastMoneyTimer2: 25,
  fastMoneyTarget: 200,
  faceOffTieRule: 'hostDecision',
};

describe('Game Engine Unit Tests', () => {
  it('creates a fresh game session with correct initial state', () => {
    const session = createGameSession({
      id: 'session-1',
      title: 'Family Reunion 2026',
      team1Name: 'Santos Family',
      team2Name: 'Reyes Family',
      config: testConfig,
      regularQuestions: sampleQuestions,
      fastMoneyQuestions,
      packId: 'pack-1',
    });

    expect(session.id).toBe('session-1');
    expect(session.team1.name).toBe('Santos Family');
    expect(session.team2.name).toBe('Reyes Family');
    expect(session.team1.score).toBe(0);
    expect(session.team2.score).toBe(0);
    expect(session.rounds.length).toBe(4);
    expect(session.rounds[0].multiplier).toBe(1);
    expect(session.rounds[2].multiplier).toBe(2);
    expect(session.rounds[3].multiplier).toBe(3);
    expect(session.phase).toBe(GamePhase.FACEOFF);
    expect(session.currentRoundIndex).toBe(0);
  });

  it('reveals answers and updates round bank, preventing duplicate scoring', () => {
    let session = createGameSession({
      id: 'session-1',
      title: 'Game 1',
      team1Name: 'Team A',
      team2Name: 'Team B',
      config: testConfig,
      regularQuestions: sampleQuestions,
      fastMoneyQuestions,
      packId: 'pack-1',
    });

    // Reveal refrigerator (35 pts)
    session = revealAnswer(session, 'a1');
    expect(session.rounds[0].revealedAnswerIds).toContain('a1');
    expect(session.rounds[0].roundBank).toBe(35);

    // Try revealing refrigerator again (idempotent duplicate prevention)
    session = revealAnswer(session, 'a1');
    expect(session.rounds[0].roundBank).toBe(35);
    expect(session.rounds[0].revealedAnswerIds.length).toBe(1);

    // Reveal stove (25 pts)
    session = revealAnswer(session, 'a2');
    expect(session.rounds[0].roundBank).toBe(60);
    expect(session.rounds[0].revealedAnswerIds.length).toBe(2);
  });

  it('reveals all remaining answers on the board without extra scoring', () => {
    let session = createGameSession({
      id: 'session-1',
      title: 'Game 1',
      team1Name: 'Team A',
      team2Name: 'Team B',
      config: testConfig,
      regularQuestions: sampleQuestions,
      fastMoneyQuestions,
      packId: 'pack-1',
    });

    session = revealAnswer(session, 'a1');
    expect(session.rounds[0].roundBank).toBe(35);

    session = revealAllRemainingAnswers(session);
    expect(session.rounds[0].revealedAnswerIds).toEqual(['a1', 'a2', 'a3', 'a4']);
  });

  it('handles face-off resolution: play or pass', () => {
    let session = createGameSession({
      id: 'session-1',
      title: 'Game 1',
      team1Name: 'Team A',
      team2Name: 'Team B',
      config: testConfig,
      regularQuestions: sampleQuestions,
      fastMoneyQuestions,
      packId: 'pack-1',
    });

    // Team 1 wins face-off and chooses to play
    session = resolveFaceOff(session, session.team1.id, 'play');
    expect(session.phase).toBe(GamePhase.REGULAR);
    expect(session.rounds[0].faceOffWinnerTeamId).toBe(session.team1.id);
    expect(session.rounds[0].controlTeamId).toBe(session.team1.id);
    expect(session.rounds[0].activeTeamId).toBe(session.team1.id);

    // If Team 1 chose to pass, Team 2 would control the board
    let session2 = createGameSession({
      id: 'session-2',
      title: 'Game 2',
      team1Name: 'Team A',
      team2Name: 'Team B',
      config: testConfig,
      regularQuestions: sampleQuestions,
      fastMoneyQuestions,
      packId: 'pack-1',
    });
    session2 = resolveFaceOff(session2, session2.team1.id, 'pass');
    expect(session2.rounds[0].controlTeamId).toBe(session2.team2.id);
    expect(session2.rounds[0].activeTeamId).toBe(session2.team2.id);
  });

  it('records strikes up to 3 and triggers steal phase', () => {
    let session = createGameSession({
      id: 'session-1',
      title: 'Game 1',
      team1Name: 'Team A',
      team2Name: 'Team B',
      config: testConfig,
      regularQuestions: sampleQuestions,
      fastMoneyQuestions,
      packId: 'pack-1',
    });

    session = resolveFaceOff(session, session.team1.id, 'play');
    expect(session.phase).toBe(GamePhase.REGULAR);

    session = recordStrike(session); // Strike 1
    expect(session.rounds[0].strikes).toBe(1);
    expect(session.phase).toBe(GamePhase.REGULAR);

    session = recordStrike(session); // Strike 2
    expect(session.rounds[0].strikes).toBe(2);
    expect(session.phase).toBe(GamePhase.REGULAR);

    session = recordStrike(session); // Strike 3
    expect(session.rounds[0].strikes).toBe(3);
    expect(session.phase).toBe(GamePhase.STEAL);
    expect(session.rounds[0].stealTeamId).toBe(session.team2.id);

    // Extra strikes beyond 3 are ignored
    session = recordStrike(session);
    expect(session.rounds[0].strikes).toBe(3);
  });

  it('allows clearing a strike and reverts STEAL phase if undone below 3', () => {
    let session = createGameSession({
      id: 'session-1',
      title: 'Game 1',
      team1Name: 'Team A',
      team2Name: 'Team B',
      config: testConfig,
      regularQuestions: sampleQuestions,
      fastMoneyQuestions,
      packId: 'pack-1',
    });

    session = resolveFaceOff(session, session.team1.id, 'play');
    session = recordStrike(session);
    session = recordStrike(session);
    session = recordStrike(session); // 3 strikes -> STEAL
    expect(session.phase).toBe(GamePhase.STEAL);

    session = clearStrike(session); // back to 2 strikes -> REGULAR
    expect(session.rounds[0].strikes).toBe(2);
    expect(session.phase).toBe(GamePhase.REGULAR);
  });

  it('resolves successful steal with multiplier applied exactly once', () => {
    let session = createGameSession({
      id: 'session-1',
      title: 'Game 1',
      team1Name: 'Team A',
      team2Name: 'Team B',
      config: testConfig,
      regularQuestions: sampleQuestions,
      fastMoneyQuestions,
      packId: 'pack-1',
    });

    // Advance to round index 2 (Multiplier = 2x)
    session = advanceToNextRound(session); // to round 1 (1x)
    session = advanceToNextRound(session); // to round 2 (2x)
    expect(session.currentRoundIndex).toBe(2);
    expect(session.rounds[2].multiplier).toBe(2);

    session = resolveFaceOff(session, session.team1.id, 'play');
    session = revealAnswer(session, 'c1'); // Sunscreen (38 pts)
    session = revealAnswer(session, 'c2'); // Swimsuit (30 pts)
    expect(session.rounds[2].roundBank).toBe(68);

    // 3 strikes by Team A
    session = recordStrike(session);
    session = recordStrike(session);
    session = recordStrike(session);
    expect(session.phase).toBe(GamePhase.STEAL);

    // Team B steals successfully
    session = resolveSteal(session, true);
    expect(session.phase).toBe(GamePhase.ROUND_SUMMARY);
    expect(session.rounds[2].isBankAwarded).toBe(true);
    expect(session.rounds[2].awardedToTeamId).toBe(session.team2.id);
    expect(session.rounds[2].awardedPoints).toBe(68 * 2); // 136 pts
    expect(session.team2.score).toBe(136);
    expect(session.team1.score).toBe(0);

    // Bank cannot be awarded again
    session = resolveSteal(session, true);
    expect(session.team2.score).toBe(136);
  });

  it('resolves failed steal awarding bank to original controlling team', () => {
    let session = createGameSession({
      id: 'session-1',
      title: 'Game 1',
      team1Name: 'Team A',
      team2Name: 'Team B',
      config: testConfig,
      regularQuestions: sampleQuestions,
      fastMoneyQuestions,
      packId: 'pack-1',
    });

    session = resolveFaceOff(session, session.team1.id, 'play');
    session = revealAnswer(session, 'a1'); // 35
    session = revealAnswer(session, 'a2'); // 25
    expect(session.rounds[0].roundBank).toBe(60);

    // 3 strikes
    session = recordStrike(session);
    session = recordStrike(session);
    session = recordStrike(session);

    // Steal failed!
    session = resolveSteal(session, false);
    expect(session.phase).toBe(GamePhase.ROUND_SUMMARY);
    expect(session.team1.score).toBe(60); // 60 * 1x
    expect(session.team2.score).toBe(0);
    expect(session.rounds[0].awardedToTeamId).toBe(session.team1.id);
  });

  it('direct bank award applies multiplier exactly once', () => {
    let session = createGameSession({
      id: 'session-1',
      title: 'Game 1',
      team1Name: 'Team A',
      team2Name: 'Team B',
      config: testConfig,
      regularQuestions: sampleQuestions,
      fastMoneyQuestions,
      packId: 'pack-1',
    });

    session = revealAnswer(session, 'a1'); // 35
    session = awardRoundBank(session, session.team1.id);
    expect(session.team1.score).toBe(35);
    expect(session.rounds[0].isBankAwarded).toBe(true);

    // Calling again does not double-award
    session = awardRoundBank(session, session.team1.id);
    expect(session.team1.score).toBe(35);
  });

  it('supports manual score adjustments with reason logging', () => {
    let session = createGameSession({
      id: 'session-1',
      title: 'Game 1',
      team1Name: 'Team A',
      team2Name: 'Team B',
      config: testConfig,
      regularQuestions: sampleQuestions,
      fastMoneyQuestions,
      packId: 'pack-1',
    });

    session = adjustTeamScore(session, session.team1.id, 50, 'Bonus challenge point');
    expect(session.team1.score).toBe(50);
    expect(session.scoreAdjustments.length).toBe(1);
    expect(session.scoreAdjustments[0].reason).toBe('Bonus challenge point');

    // Deduct 20
    session = adjustTeamScore(session, session.team1.id, -20, 'Penalty');
    expect(session.team1.score).toBe(30);
  });

  it('restarts current round and reverts awarded points safely', () => {
    let session = createGameSession({
      id: 'session-1',
      title: 'Game 1',
      team1Name: 'Team A',
      team2Name: 'Team B',
      config: testConfig,
      regularQuestions: sampleQuestions,
      fastMoneyQuestions,
      packId: 'pack-1',
    });

    session = revealAnswer(session, 'a1'); // 35
    session = awardRoundBank(session, session.team1.id);
    expect(session.team1.score).toBe(35);

    // Host restarts round
    session = restartCurrentRound(session);
    expect(session.team1.score).toBe(0);
    expect(session.rounds[0].roundBank).toBe(0);
    expect(session.rounds[0].revealedAnswerIds.length).toBe(0);
    expect(session.rounds[0].isBankAwarded).toBe(false);
    expect(session.phase).toBe(GamePhase.FACEOFF);
  });

  it('handles Fast Money answering, scoring, and win resolution', () => {
    let session = createGameSession({
      id: 'session-1',
      title: 'Game 1',
      team1Name: 'Team A',
      team2Name: 'Team B',
      config: testConfig,
      regularQuestions: sampleQuestions,
      fastMoneyQuestions,
      packId: 'pack-1',
    });

    // Advance through all 4 rounds to reach Fast Money
    session = advanceToNextRound(session);
    session = advanceToNextRound(session);
    session = advanceToNextRound(session);
    session = advanceToNextRound(session);
    expect(session.phase).toBe(GamePhase.FAST_MONEY);

    // Player 1 answers
    session = submitFastMoneyAnswer(session, 1, 0, 'January', 30, 'fm1_1');
    session = submitFastMoneyAnswer(session, 1, 1, 'Red', 40, 'fm2_1');
    session = submitFastMoneyAnswer(session, 1, 2, 'Basketball', 45, 'fm3_1');
    session = submitFastMoneyAnswer(session, 1, 3, 'Coffee', 55, 'fm4_1');
    session = submitFastMoneyAnswer(session, 1, 4, 'Dog', 52, 'fm5_1');

    expect(session.fastMoney?.player1.totalScore).toBe(222);
    expect(session.fastMoney?.totalScore).toBe(222);

    // Reveal player 1 answer 0 and its points
    session = revealFastMoneyAnswer(session, 1, 0);
    session = revealFastMoneyPoints(session, 1, 0);
    expect(session.fastMoney?.player1.revealedAnswerIndices).toContain(0);
    expect(session.fastMoney?.player1.revealedPointsIndices).toContain(0);

    // Conclude Fast Money
    session = resolveFastMoney(session);
    expect(session.phase).toBe(GamePhase.FINAL_RESULTS);
    expect(session.fastMoney?.won).toBe(true); // 222 >= 200
  });
});

describe('Answer Matcher Unit Tests', () => {
  const question: Question = sampleQuestions[1]; // Adobo, Sinigang, Lechon, Pancit

  it('normalizes text with spaces and punctuation', () => {
    expect(normalizeText('  Chicken Adobo!  ')).toBe('chicken adobo');
    expect(normalizeText('Stove / Oven')).toBe('stove oven');
    expect(normalizeText('Overslept...')).toBe('overslept');
  });

  it('matches primary answer text case-insensitively', () => {
    const res = matchAnswer(question, 'adobo');
    expect(res.isMatch).toBe(true);
    expect(res.matchedAnswer?.id).toBe('b1');
    expect(res.points).toBe(42);
  });

  it('matches accepted variants', () => {
    const res1 = matchAnswer(question, 'chicken adobo');
    expect(res1.isMatch).toBe(true);
    expect(res1.matchedAnswer?.id).toBe('b1');

    const res2 = matchAnswer(question, 'roast pig');
    expect(res2.isMatch).toBe(true);
    expect(res2.matchedAnswer?.id).toBe('b3');
    expect(res2.points).toBe(15);
  });

  it('returns false for unrecognized answers', () => {
    const res = matchAnswer(question, 'spaghetti');
    expect(res.isMatch).toBe(false);
    expect(res.matchedAnswer).toBeNull();
    expect(res.points).toBe(0);
  });
});
