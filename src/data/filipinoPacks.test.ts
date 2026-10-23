import { describe, it, expect, beforeEach } from 'vitest';
import { FILIPINO_BUILTIN_PACKS, validateQuestionPoints } from './filipinoPacks';
import { STARTER_PACKS } from './starterPacks';
import { db, initializeDatabase, listQuestionPacks } from '../db/database';
import { createGameSession, revealAnswer, revealAllRemainingAnswers } from '../engine/gameEngine';
import type { GameConfig } from '../types/game';

describe('10 Filipino-Themed Built-In Question Packs Verification', () => {
  beforeEach(async () => {
    await db.questionPacks.clear();
    await db.gameSessions.clear();
  });

  it('1. registers exactly 10 Filipino question packs', () => {
    expect(FILIPINO_BUILTIN_PACKS).toHaveLength(10);
    expect(STARTER_PACKS.length).toBeGreaterThanOrEqual(10);
  });

  it('2. contains all 10 required categories with readable titles', () => {
    const requiredCategories = [
      'Filipino Food & Drinks',
      'Pinoy Childhood Memories',
      'Philippine Festivals',
      'Filipino Slang & Expressions',
      'Love, Dating & Relationships',
      'Work & Office Life',
      'Social Media & Internet Trends',
      'Philippine Geography & Trivia',
      'Funny Filipino Habits',
      'Sports & Basketball',
    ];

    const actualCategories = FILIPINO_BUILTIN_PACKS.map((p) => p.category);
    expect(actualCategories).toEqual(requiredCategories);

    FILIPINO_BUILTIN_PACKS.forEach((pack) => {
      expect(pack.title.trim().length).toBeGreaterThan(0);
      expect(pack.isBuiltIn).toBe(true);
      expect(pack.id).toMatch(/^pack-/);
    });
  });

  it('3. has exactly 50 questions in total across all 10 packs (5 per pack)', () => {
    const totalQuestions = FILIPINO_BUILTIN_PACKS.reduce(
      (sum, pack) => sum + pack.questions.length,
      0
    );
    expect(totalQuestions).toBe(50);

    FILIPINO_BUILTIN_PACKS.forEach((pack) => {
      expect(pack.questions).toHaveLength(5);
    });
  });

  it('4. ensures every answer has a positive integer point value', () => {
    FILIPINO_BUILTIN_PACKS.forEach((pack) => {
      pack.questions.forEach((q) => {
        expect(q.answers.length).toBeGreaterThanOrEqual(3);
        expect(q.answers.length).toBeLessThanOrEqual(5);

        q.answers.forEach((ans) => {
          expect(ans.points).toBeGreaterThan(0);
          expect(Number.isInteger(ans.points)).toBe(true);
          expect(ans.text.trim().length).toBeGreaterThan(0);
          expect(ans.id.trim().length).toBeGreaterThan(0);
        });
      });
    });
  });

  it('5. validates that every single question totals exactly 100 points', () => {
    FILIPINO_BUILTIN_PACKS.forEach((pack) => {
      pack.questions.forEach((q) => {
        const sum = q.answers.reduce((acc, a) => acc + a.points, 0);
        expect(sum).toBe(100);

        const validation = validateQuestionPoints(q);
        expect(validation.valid).toBe(true);
        expect(validation.total).toBe(100);
      });
    });
  });

  it('6. verifies the Geography major island groups question has exactly 3 answers totaling 100', () => {
    const geoPack = FILIPINO_BUILTIN_PACKS.find(
      (p) => p.id === 'pack-philippine-geography-trivia'
    );
    expect(geoPack).toBeDefined();

    const islandQ = geoPack?.questions.find((q) =>
      q.prompt.includes('major island group')
    );
    expect(islandQ).toBeDefined();
    expect(islandQ?.answers).toHaveLength(3);

    const answers = islandQ?.answers.map((a) => ({ text: a.text, points: a.points }));
    expect(answers).toEqual([
      { text: 'Luzon', points: 40 },
      { text: 'Visayas', points: 35 },
      { text: 'Mindanao', points: 25 },
    ]);

    const total = islandQ?.answers.reduce((sum, a) => sum + a.points, 0);
    expect(total).toBe(100);
  });

  it('7. ensures all pack IDs, question IDs, and answer IDs are unique', () => {
    const packIds = new Set<string>();
    const questionIds = new Set<string>();
    const answerIds = new Set<string>();

    FILIPINO_BUILTIN_PACKS.forEach((pack) => {
      expect(packIds.has(pack.id)).toBe(false);
      packIds.add(pack.id);

      pack.questions.forEach((q) => {
        expect(questionIds.has(q.id)).toBe(false);
        questionIds.add(q.id);

        q.answers.forEach((ans) => {
          expect(answerIds.has(ans.id)).toBe(false);
          answerIds.add(ans.id);
        });
      });
    });
  });

  it('8. loads the first question and starts games correctly for each of the 10 packs', () => {
    const defaultConfig: GameConfig = {
      roundsCount: 4,
      multipliers: [1, 1, 2, 3],
      targetScore: 300,
      fastMoneyTimer1: 20,
      fastMoneyTimer2: 25,
      fastMoneyTarget: 200,
      faceOffTieRule: 'hostDecision',
    };

    FILIPINO_BUILTIN_PACKS.forEach((pack, packIdx) => {
      const session = createGameSession({
        id: `test-game-pack-${packIdx}`,
        title: `Game for ${pack.title}`,
        team1Name: 'Team Blue',
        team2Name: 'Team Red',
        config: defaultConfig,
        regularQuestions: pack.questions.slice(0, 4),
        fastMoneyQuestions: pack.questions.slice(0, 5),
        packId: pack.id,
      });

      expect(session.rounds).toHaveLength(4);
      expect(session.rounds[0].question.prompt).toBe(pack.questions[0].prompt);
      expect(session.rounds[0].question.answers).toHaveLength(pack.questions[0].answers.length);
    });
  });

  it('9. supports revealing and scoring answers correctly across questions including 3-answer questions', () => {
    const geoPack = FILIPINO_BUILTIN_PACKS.find(
      (p) => p.id === 'pack-philippine-geography-trivia'
    )!;

    const config: GameConfig = {
      roundsCount: 4,
      multipliers: [1, 1, 2, 3],
      targetScore: 300,
      fastMoneyTimer1: 20,
      fastMoneyTimer2: 25,
      fastMoneyTarget: 200,
      faceOffTieRule: 'hostDecision',
    };

    let session = createGameSession({
      id: 'test-geo-game',
      title: 'Geography Trivia',
      team1Name: 'Team Blue',
      team2Name: 'Team Red',
      config,
      // Put the 3-answer question as round 1
      regularQuestions: [geoPack.questions[1], ...geoPack.questions.slice(0, 3)],
      fastMoneyQuestions: geoPack.questions,
      packId: geoPack.id,
    });

    const firstAnswer = session.rounds[0].question.answers[0]; // Luzon - 40 pts
    session = revealAnswer(session, firstAnswer.id);

    expect(session.rounds[0].revealedAnswerIds).toContain(firstAnswer.id);
    expect(session.rounds[0].roundBank).toBe(40);

    // Reveal remaining
    session = revealAllRemainingAnswers(session);
    expect(session.rounds[0].revealedAnswerIds).toHaveLength(3);
  });

  it('10. initializes database and prevents duplicates across multiple restarts', async () => {
    // 1st initialization
    await initializeDatabase();
    let packs = await listQuestionPacks();
    const count1 = packs.length;
    expect(count1).toBeGreaterThanOrEqual(10);

    // 2nd initialization (simulating restart)
    await initializeDatabase();
    packs = await listQuestionPacks();
    const count2 = packs.length;

    expect(count2).toBe(count1);

    // All 10 Filipino packs must be present
    FILIPINO_BUILTIN_PACKS.forEach((filipinoPack) => {
      const found = packs.find((p) => p.id === filipinoPack.id);
      expect(found).toBeDefined();
      expect(found?.questions).toHaveLength(5);
    });
  });
});
