import { describe, it, expect, beforeEach } from 'vitest';
import {
  createGameSession,
  resolveFaceOff,
  revealAnswer,
  recordStrike,
  clearStrike,
  resolveSteal,
  advanceToNextRound,
  submitFastMoneyAnswer,
  revealFastMoneyAnswer,
  revealFastMoneyPoints,
  resolveFastMoney,
} from '../engine/gameEngine';
import { saveGameSession, loadGameSession, db } from '../db/database';
import { GamePhase } from '../types/game';
import type { GameSession, GameConfig, Question } from '../types/game';

const testQuestions: Question[] = [
  {
    id: 't-q1',
    prompt: 'Name a food you expect to see on the table at a family gathering',
    category: 'Food',
    answers: [
      { id: 't-a1', text: 'Roast Pig', points: 42, acceptedVariants: ['pig'], displayOrder: 1 },
      { id: 't-a2', text: 'Spring Rolls', points: 26, acceptedVariants: ['rolls'], displayOrder: 2 },
      { id: 't-a3', text: 'Noodles', points: 16, acceptedVariants: ['noodles'], displayOrder: 3 },
      { id: 't-a4', text: 'Fried Chicken', points: 16, acceptedVariants: ['chicken'], displayOrder: 4 },
    ],
  },
  {
    id: 't-q2',
    prompt: 'Name a classic song people love to sing at karaoke',
    category: 'Entertainment',
    answers: [
      { id: 't-a5', text: 'My Way', points: 38, acceptedVariants: ['my way'], displayOrder: 1 },
      { id: 't-a6', text: 'Total Eclipse', points: 24, acceptedVariants: ['eclipse'], displayOrder: 2 },
      { id: 't-a7', text: 'Dancing Queen', points: 20, acceptedVariants: ['dancing'], displayOrder: 3 },
      { id: 't-a8', text: 'Sweet Caroline', points: 18, acceptedVariants: ['sweet'], displayOrder: 4 },
    ],
  },
  {
    id: 't-q3',
    prompt: 'Name a souvenir brought back from a trip',
    category: 'Travel',
    answers: [
      { id: 't-a9', text: 'Dried Mangoes', points: 40, acceptedVariants: ['mangoes'], displayOrder: 1 },
      { id: 't-a10', text: 'T-Shirts', points: 25, acceptedVariants: ['shirt'], displayOrder: 2 },
      { id: 't-a11', text: 'Keychains', points: 20, acceptedVariants: ['keychain'], displayOrder: 3 },
      { id: 't-a12', text: 'Magnets', points: 15, acceptedVariants: ['magnet'], displayOrder: 4 },
    ],
  },
  {
    id: 't-q4',
    prompt: 'Name something every mom warns her kids about',
    category: 'Family',
    answers: [
      { id: 't-a13', text: 'Going to bed with wet hair', points: 44, acceptedVariants: ['wet hair'], displayOrder: 1 },
      { id: 't-a14', text: 'Staying out late', points: 26, acceptedVariants: ['late'], displayOrder: 2 },
      { id: 't-a15', text: 'Not eating vegetables', points: 18, acceptedVariants: ['veggies'], displayOrder: 3 },
      { id: 't-a16', text: 'Sitting too close to the TV', points: 12, acceptedVariants: ['tv'], displayOrder: 4 },
    ],
  },
  {
    id: 't-q5',
    prompt: 'Name an excuse for being late to a meeting',
    category: 'Work',
    answers: [
      { id: 't-a17', text: 'Heavy Traffic', points: 50, acceptedVariants: ['traffic'], displayOrder: 1 },
      { id: 't-a18', text: 'Overslept', points: 30, acceptedVariants: ['alarm'], displayOrder: 2 },
      { id: 't-a19', text: 'Car Trouble', points: 20, acceptedVariants: ['car'], displayOrder: 3 },
    ],
  },
];

describe('Complete Full Game Show Flow Integration Test', () => {
  beforeEach(async () => {
    await db.gameSessions.clear();
  });

  it('plays through a full 4-round game into Fast Money and final victory', async () => {
    const config: GameConfig = {
      roundsCount: 4,
      multipliers: [1, 1, 2, 3],
      targetScore: 300,
      fastMoneyTimer1: 20,
      fastMoneyTimer2: 25,
      fastMoneyTarget: 200,
      faceOffTieRule: 'hostDecision',
    };

    // 1. SETUP GAME
    let session: GameSession = createGameSession({
      id: 'full-game-123',
      title: 'Christmas Reunion 2026',
      team1Name: 'Santos Family',
      team2Name: 'Reyes Family',
      config,
      regularQuestions: testQuestions.slice(0, 4),
      fastMoneyQuestions: testQuestions.slice(0, 5),
      packId: 'test-pack-custom',
    });

    expect(session.phase).toBe(GamePhase.FACEOFF);
    expect(session.currentRoundIndex).toBe(0);

    // Save initial session to Dexie (autosave simulation)
    await saveGameSession(session);

    // 2. ROUND 1 (1x Multiplier): Face-Off & Regular Play
    // Team 1 wins faceoff and chooses to play
    session = resolveFaceOff(session, session.team1.id, 'play');
    expect(session.phase).toBe(GamePhase.REGULAR);
    expect(session.rounds[0].controlTeamId).toBe(session.team1.id);

    // Team 1 guesses 2 answers: Lechon (42 pts) and Lumpia (26 pts)
    const q1Answers = session.rounds[0].question.answers;
    session = revealAnswer(session, q1Answers[0].id);
    session = revealAnswer(session, q1Answers[1].id);
    expect(session.rounds[0].roundBank).toBe(68);

    // Team 1 gets strikes, tests clearing mistake, then gets 3 strikes
    session = recordStrike(session); // strike 1
    session = recordStrike(session); // strike 2
    session = clearStrike(session);  // host clears accidental strike -> back to 1
    expect(session.rounds[0].strikes).toBe(1);
    session = recordStrike(session); // strike 2
    session = recordStrike(session); // strike 3 -> triggers steal
    expect(session.phase).toBe(GamePhase.STEAL);
    expect(session.rounds[0].stealTeamId).toBe(session.team2.id);

    // Steal attempt by Team 2 is successful!
    session = resolveSteal(session, true);
    expect(session.phase).toBe(GamePhase.ROUND_SUMMARY);
    expect(session.team2.score).toBe(68 * 1); // 68 points awarded to Team 2
    expect(session.team1.score).toBe(0);

    // 3. ADVANCE TO ROUND 2 (1x Multiplier)
    session = advanceToNextRound(session);
    expect(session.currentRoundIndex).toBe(1);
    expect(session.phase).toBe(GamePhase.FACEOFF);

    // Team 2 wins faceoff and plays
    session = resolveFaceOff(session, session.team2.id, 'play');
    const q2Answers = session.rounds[1].question.answers;
    session = revealAnswer(session, q2Answers[0].id); // 38 pts
    session = revealAnswer(session, q2Answers[1].id); // 24 pts
    expect(session.rounds[1].roundBank).toBe(62);

    // Team 2 strikes 3 times
    session = recordStrike(session);
    session = recordStrike(session);
    session = recordStrike(session);
    expect(session.phase).toBe(GamePhase.STEAL);

    // Team 1 tries to steal but FAILS
    session = resolveSteal(session, false);
    expect(session.phase).toBe(GamePhase.ROUND_SUMMARY);
    // Bank goes to Team 2 (original control team)
    expect(session.team2.score).toBe(68 + 62); // 130 pts
    expect(session.team1.score).toBe(0);

    // 4. ADVANCE TO ROUND 3 (2x Double Points)
    session = advanceToNextRound(session);
    expect(session.currentRoundIndex).toBe(2);
    expect(session.rounds[2].multiplier).toBe(2);

    session = resolveFaceOff(session, session.team1.id, 'play');
    const q3Answers = session.rounds[2].question.answers;
    session = revealAnswer(session, q3Answers[0].id); // 40 pts
    session = revealAnswer(session, q3Answers[1].id); // 25 pts
    expect(session.rounds[2].roundBank).toBe(65);

    // Team 1 strikes 3 times
    session = recordStrike(session);
    session = recordStrike(session);
    session = recordStrike(session);

    // Team 2 fails steal -> Team 1 gets 65 * 2 = 130 points!
    session = resolveSteal(session, false);
    expect(session.team1.score).toBe(130);
    expect(session.team2.score).toBe(130); // Tied game!

    // 5. ADVANCE TO ROUND 4 (3x Triple Points)
    session = advanceToNextRound(session);
    expect(session.currentRoundIndex).toBe(3);
    expect(session.rounds[3].multiplier).toBe(3);

    session = resolveFaceOff(session, session.team1.id, 'play');
    const q4Answers = session.rounds[3].question.answers;
    session = revealAnswer(session, q4Answers[0].id); // 44 pts
    session = revealAnswer(session, q4Answers[1].id); // 26 pts
    expect(session.rounds[3].roundBank).toBe(70);

    // Team 1 strikes out
    session = recordStrike(session);
    session = recordStrike(session);
    session = recordStrike(session);

    // Team 2 steals successfully: 70 * 3 = 210 points!
    session = resolveSteal(session, true);
    expect(session.team2.score).toBe(130 + 210); // 340 pts
    expect(session.team1.score).toBe(130);

    // 6. ALL ROUNDS COMPLETED -> ADVANCE TO FAST MONEY
    session = advanceToNextRound(session);
    expect(session.phase).toBe(GamePhase.FAST_MONEY);
    expect(session.winnerTeamId).toBe(session.team2.id); // Reyes Family advances!

    // 7. FAST MONEY ROUND
    // Player 1 answers 5 questions
    session = submitFastMoneyAnswer(session, 1, 0, 'Lechon', 42, 'ff-a1');
    session = submitFastMoneyAnswer(session, 1, 1, 'My Way', 38, 'ff-a6');
    session = submitFastMoneyAnswer(session, 1, 2, 'Dried Mangoes', 40, 'ff-a11');
    session = submitFastMoneyAnswer(session, 1, 3, 'Wet Hair', 44, 'ff-a16');
    session = submitFastMoneyAnswer(session, 1, 4, 'White Flower', 46, 'ff-a20');

    expect(session.fastMoney?.player1.totalScore).toBe(210);

    // Host reveals answers & points
    for (let i = 0; i < 5; i++) {
      session = revealFastMoneyAnswer(session, 1, i);
      session = revealFastMoneyPoints(session, 1, i);
    }

    // Fast Money resolved
    session = resolveFastMoney(session);
    expect(session.phase).toBe(GamePhase.FINAL_RESULTS);
    expect(session.fastMoney?.totalScore).toBe(210);
    expect(session.fastMoney?.won).toBe(true);

    // 8. RELOAD & RESUME TEST: Save final state, reload from DB, verify data integrity
    await saveGameSession(session);

    const reloaded = await loadGameSession('full-game-123');
    expect(reloaded).toBeDefined();
    expect(reloaded?.team2.score).toBe(340);
    expect(reloaded?.fastMoney?.won).toBe(true);
    expect(reloaded?.rounds.length).toBe(4);
    expect(reloaded?.actionLog.length).toBeGreaterThan(10);
  });
});
