import { describe, it, expect, beforeEach } from 'vitest';
import { LDS_SCRIPTURE_PACKS } from './ldsScripturePacks';
import { STARTER_PACKS } from './starterPacks';
import { db, initializeDatabase, listQuestionPacks } from '../db/database';
import { createGameSession, revealAnswer, revealAllRemainingAnswers } from '../engine/gameEngine';
import type { GameConfig } from '../types/game';

describe('10 LDS Scripture Trivia Packs Verification', () => {
  beforeEach(async () => {
    await db.questionPacks.clear();
    await db.gameSessions.clear();
  });

  it('1. registers exactly 10 LDS scripture trivia packs', () => {
    expect(LDS_SCRIPTURE_PACKS).toHaveLength(10);
    expect(STARTER_PACKS.length).toBeGreaterThanOrEqual(27); // 17 Filipino + 10 LDS + 4 classic = 31

    const expectedPackIds = [
      'pack-noah-great-flood',
      'pack-david-goliath-kings',
      'pack-moses-exodus',
      'pack-life-miracles-jesus',
      'pack-twelve-apostles',
      'pack-prophets-heroes-bom',
      'pack-journey-lehi-family',
      'pack-alma-sons-mosiah',
      'pack-restoration-gospel',
      'pack-people-places-events',
    ];

    expectedPackIds.forEach((id) => {
      const pack = LDS_SCRIPTURE_PACKS.find((p) => p.id === id);
      expect(pack).toBeDefined();
      expect(pack?.isBuiltIn).toBe(true);
      expect(pack?.questions).toHaveLength(5);
    });
  });

  it('2. verifies all 10 scripture themes are covered with exact titles', () => {
    const expectedTitles = [
      'Noah and the Great Flood',
      'David, Goliath, and the Kings of Israel',
      'Moses and the Exodus',
      'The Life and Miracles of Jesus Christ',
      'The Twelve Apostles',
      'Prophets and Heroes of the Book of Mormon',
      'The Journey of Lehi\'s Family',
      'Alma and the Sons of Mosiah',
      'The Restoration of the Gospel',
      'People, Places, and Events in the Scriptures',
    ];

    const actualTitles = LDS_SCRIPTURE_PACKS.map((p) => p.title);
    expect(actualTitles).toEqual(expectedTitles);
  });

  it('3. has exactly 50 scripture questions (5 per pack)', () => {
    const totalQuestions = LDS_SCRIPTURE_PACKS.reduce(
      (sum, pack) => sum + pack.questions.length,
      0
    );
    expect(totalQuestions).toBe(50);

    LDS_SCRIPTURE_PACKS.forEach((pack) => {
      expect(pack.questions).toHaveLength(5);
    });
  });

  it('4. natural distribution of the 6 question formats across the packs', () => {
    const formatsFound = new Set<string>();

    LDS_SCRIPTURE_PACKS.forEach((pack) => {
      pack.questions.forEach((q) => {
        expect(q.questionType).toBeDefined();
        formatsFound.add(q.questionType as string);
      });
    });

    const expectedFormats = [
      'Name the Person',
      'Name the Object',
      'Where Did It Happen?',
      'Who Said It?',
      'How Many?',
      'What Happened Next?',
    ];

    expectedFormats.forEach((format) => {
      expect(formatsFound.has(format)).toBe(true);
    });
  });

  it('5. validates that every question has a scripture reference, explanation, and difficulty', () => {
    LDS_SCRIPTURE_PACKS.forEach((pack) => {
      pack.questions.forEach((q) => {
        expect(q.scriptureReference).toBeDefined();
        expect(q.scriptureReference?.trim().length).toBeGreaterThan(3);

        expect(q.scriptureExplanation).toBeDefined();
        expect(q.scriptureExplanation?.trim().length).toBeGreaterThan(10);

        expect(q.difficulty).toBeDefined();
        expect(['easy', 'medium', 'hard']).toContain(q.difficulty);
      });
    });
  });

  it('6. validates all answers have positive integer points, sorted descending, totaling exactly 100', () => {
    LDS_SCRIPTURE_PACKS.forEach((pack) => {
      pack.questions.forEach((q) => {
        expect(q.answers.length).toBeGreaterThanOrEqual(3);
        expect(q.answers.length).toBeLessThanOrEqual(5);

        // Check descending points
        for (let i = 0; i < q.answers.length - 1; i++) {
          expect(q.answers[i].points).toBeGreaterThanOrEqual(q.answers[i + 1].points);
        }

        // Check point total is exactly 100
        const sum = q.answers.reduce((acc, a) => acc + a.points, 0);
        expect(sum).toBe(100);

        q.answers.forEach((ans) => {
          expect(ans.points).toBeGreaterThan(0);
          expect(Number.isInteger(ans.points)).toBe(true);
          expect(ans.text.trim().length).toBeGreaterThan(0);
          expect(ans.id.trim().length).toBeGreaterThan(0);
        });
      });
    });
  });

  it('7. ensures all pack IDs, question IDs, and answer IDs are unique', () => {
    const packIds = new Set<string>();
    const questionIds = new Set<string>();
    const answerIds = new Set<string>();

    LDS_SCRIPTURE_PACKS.forEach((pack) => {
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

  it('8. initializes database with all LDS packs without duplicates across restarts', async () => {
    // 1st initialization
    await initializeDatabase();
    let packs = await listQuestionPacks();
    const count1 = packs.length;
    expect(count1).toBeGreaterThanOrEqual(27);

    // 2nd initialization
    await initializeDatabase();
    packs = await listQuestionPacks();
    expect(packs.length).toBe(count1);

    // Verify all 10 LDS packs are present
    LDS_SCRIPTURE_PACKS.forEach((ldsPack) => {
      const found = packs.filter((p) => p.id === ldsPack.id);
      expect(found).toHaveLength(1);
      expect(found[0].questions).toHaveLength(5);
    });
  });

  it('9. starts a game and reveals answers with scripture trivia', () => {
    const pack = LDS_SCRIPTURE_PACKS[0]; // Noah and the Great Flood

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
      id: 'test-noah-game',
      title: 'Scripture Bowl',
      team1Name: 'Family 1',
      team2Name: 'Family 2',
      config,
      regularQuestions: pack.questions.slice(0, 4),
      fastMoneyQuestions: pack.questions.slice(0, 5),
      packId: pack.id,
    });

    expect(session.rounds[0].question.prompt).toBe(pack.questions[0].prompt);
    expect(session.rounds[0].question.scriptureReference).toBe('Genesis 6:14');

    const firstAnswer = session.rounds[0].question.answers[0]; // Gopher wood - 40 pts
    session = revealAnswer(session, firstAnswer.id);

    expect(session.rounds[0].revealedAnswerIds).toContain(firstAnswer.id);
    expect(session.rounds[0].roundBank).toBe(40);

    session = revealAllRemainingAnswers(session);
    expect(session.rounds[0].revealedAnswerIds).toHaveLength(4);
  });
});
