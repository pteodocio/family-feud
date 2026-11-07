import { describe, it, expect } from 'vitest';
import { FILIPINO_BUILTIN_PACKS } from '../data/filipinoPacks';
import { FAST_MONEY_SETS, getCleanFastMoneySet } from '../data/fastMoney';
import {
  isQuestionConflicting,
  resolveFastMoneyConflicts,
} from '../engine/questionConflictDetector';
import {
  createGameSession,
  advanceToNextRound,
  initFastMoneyWithSet,
} from '../engine/gameEngine';
import { GamePhase, type Question, type FastMoneySet, type Answer } from '../types/game';

function makeAnswer(id: string, text: string, points: number, displayOrder: number): Answer {
  return { id, text, points, acceptedVariants: [], displayOrder };
}

describe('Fast Money Strict Separation and Anti-Reuse Engine', () => {
  it('detects exact prompt matches and normalized variations', () => {
    const candidate: Question = {
      id: 'fm_test_1',
      prompt: 'Name something people eat for breakfast.',
      category: 'Food',
      answers: [
        makeAnswer('a1', 'Eggs', 40, 1),
        makeAnswer('a2', 'Bread', 30, 2),
        makeAnswer('a3', 'Rice', 15, 3),
        makeAnswer('a4', 'Coffee', 10, 4),
        makeAnswer('a5', 'Bacon', 5, 5),
      ],
    };

    const played = [
      {
        id: 'reg_1',
        prompt: '  name something people eat for breakfast!  ',
        answers: ['Eggs', 'Bread', 'Rice'],
      },
    ];

    const result = isQuestionConflicting(candidate, played);
    expect(result.isConflict).toBe(true);
  });

  it('detects semantic intent duplicates with different wording (e.g. breakfast vs morning meal)', () => {
    const candidate: Question = {
      id: 'fm_test_2',
      prompt: 'What is a common morning meal food?',
      category: 'Food',
      answers: [
        makeAnswer('a1', 'Eggs', 40, 1),
        makeAnswer('a2', 'Bread', 30, 2),
        makeAnswer('a3', 'Pancit', 15, 3),
        makeAnswer('a4', 'Coffee', 10, 4),
        makeAnswer('a5', 'Rice', 5, 5),
      ],
    };

    const played = [
      {
        id: 'reg_2',
        prompt: 'Name something people eat for breakfast.',
        answers: ['Eggs', 'Bread', 'Hotdog', 'Coffee'],
      },
    ];

    const result = isQuestionConflicting(candidate, played);
    expect(result.isConflict).toBe(true);
  });

  it('allows genuinely distinct and non-conflicting questions', () => {
    const candidate: Question = {
      id: 'fm_test_clean',
      prompt: 'Name a musical instrument found in a high school marching band.',
      category: 'Music',
      answers: [
        makeAnswer('a1', 'Trumpet', 35, 1),
        makeAnswer('a2', 'Trombone', 25, 2),
        makeAnswer('a3', 'Snare Drum', 20, 3),
        makeAnswer('a4', 'Flute', 12, 4),
        makeAnswer('a5', 'Cymbals', 8, 5),
      ],
    };

    const played = [
      {
        id: 'reg_1',
        prompt: 'Name something people eat for breakfast.',
        answers: ['Eggs', 'Bread', 'Coffee'],
      },
      {
        id: 'reg_2',
        prompt: 'Name a chore people do on weekends.',
        answers: ['Laundry', 'Cleaning', 'Cooking'],
      },
    ];

    const result = isQuestionConflicting(candidate, played);
    expect(result.isConflict).toBe(false);
  });

  it('auto-replaces conflicting questions in a Fast Money set with clean questions from bank', () => {
    const targetSet: FastMoneySet = {
      id: 'test_set',
      title: 'Test Conflict Set',
      questions: [
        {
          id: 'q1_conflict',
          prompt: 'Name something people eat for breakfast.',
          category: 'Food',
          answers: [
            makeAnswer('a1', 'Eggs', 50, 1),
            makeAnswer('a2', 'Bread', 50, 2),
          ],
        },
        ...FAST_MONEY_SETS[0].questions.slice(1, 5),
      ],
    };

    const played = [
      {
        id: 'played_breakfast',
        prompt: 'What is a common morning meal?',
        answers: ['Eggs', 'Bread', 'Rice'],
      },
    ];

    const resolution = resolveFastMoneyConflicts(targetSet, played, FAST_MONEY_SETS);
    expect(resolution.replacedCount).toBe(1);
    expect(resolution.resolvedSet).not.toBeNull();
    expect(resolution.resolvedSet?.questions).toHaveLength(5);
    // Conflicting question was replaced
    expect(resolution.resolvedSet?.questions[0].prompt).not.toBe('Name something people eat for breakfast.');
    // Total points still equal 100
    const totalPts = resolution.resolvedSet?.questions[0].answers.reduce((s, a) => s + a.points, 0);
    expect(totalPts).toBe(100);
  });

  it('fails with explicit error and refuses to load regular questions when bank is empty', () => {
    const resolution = resolveFastMoneyConflicts(
      FAST_MONEY_SETS[0],
      [{ id: 'p1', prompt: 'Any question', answers: [] }],
      [] // Empty Fast Money bank
    );

    expect(resolution.resolvedSet).toBeNull();
    expect(resolution.error).toContain('Fast Money question bank is unavailable');
  });
});

describe('Full Game Flow: Played Rounds vs Fast Money Questions', () => {
  // Test across 3 distinct question packs: General, Scenario-based, Entertainment
  const testPacks = [
    FILIPINO_BUILTIN_PACKS[0], // Pack 1: Pagkain at Inumin
    FILIPINO_BUILTIN_PACKS.find((p) => p.title.includes('Biglang May Bisita')) || FILIPINO_BUILTIN_PACKS[25],
    FILIPINO_BUILTIN_PACKS.find((p) => p.title.includes('Zombie Apocalypse')) || FILIPINO_BUILTIN_PACKS[35],
  ];

  for (const pack of testPacks) {
    it(`verifies Fast Money questions NEVER duplicate played rounds for pack: "${pack.title}"`, () => {
      const roundsCount = 4;
      const regularQuestions = pack.questions.slice(0, roundsCount);

      // Create session
      let session = createGameSession({
        id: `test_game_${pack.id}`,
        title: `Game with ${pack.title}`,
        team1Name: 'Family Blue',
        team2Name: 'Family Red',
        config: {
          roundsCount,
          multipliers: [1, 1, 2, 3],
          targetScore: 300,
          fastMoneyTimer1: 20,
          fastMoneyTimer2: 25,
          fastMoneyTarget: 200,
          faceOffTieRule: 'hostDecision',
        },
        regularQuestions,
        packId: pack.id,
      });

      // Verify played questions tracking is initialized
      expect(session.playedQuestionIds).toHaveLength(roundsCount);
      expect(session.playedQuestionHistory).toHaveLength(roundsCount);

      const playedRoundsHistory = [...(session.playedQuestionHistory || [])];

      // Play through all regular rounds
      for (let r = 0; r < roundsCount; r++) {
        session = advanceToNextRound(session);
      }

      // Main game finished -> transitioned to Fast Money
      expect(session.phase).toBe(GamePhase.FAST_MONEY);
      expect(session.fastMoney).not.toBeNull();
      expect(session.fastMoneyError).toBeNull();

      // Record all 5 Fast Money questions presented on the board
      const fmQuestions = session.fastMoney!.questions;
      expect(fmQuestions).toHaveLength(5);

      // Compare every Fast Money question against every played question
      for (const fmq of fmQuestions) {
        const conflict = isQuestionConflicting(fmq, playedRoundsHistory);
        expect(conflict.isConflict).toBe(false);

        for (const played of playedRoundsHistory) {
          // 1. Not identical ID
          expect(fmq.id).not.toBe(played.id);
          // 2. Not identical prompt
          expect(fmq.prompt.trim().toLowerCase()).not.toBe(played.prompt.trim().toLowerCase());
        }
      }

      // Host chooses a different set (e.g. Set 03)
      const set3 = FAST_MONEY_SETS[2];
      session = initFastMoneyWithSet(session, set3);
      expect(session.fastMoney?.setId).toBe('fm_set_03');

      // Verify Set 03 also has 0 overlap with played rounds
      for (const fmq of session.fastMoney!.questions) {
        const conflict = isQuestionConflicting(fmq, playedRoundsHistory);
        expect(conflict.isConflict).toBe(false);
      }
    });
  }

  it('guarantees clean separation in getCleanFastMoneySet helper', () => {
    const played = FILIPINO_BUILTIN_PACKS[0].questions.map((q) => ({
      id: q.id,
      prompt: q.prompt,
      answers: q.answers.map((a) => a.text),
    }));

    const result = getCleanFastMoneySet('fm_set_01', played);
    expect(result.set).not.toBeNull();
    expect(result.error).toBeUndefined();
    expect(result.set?.questions).toHaveLength(5);

    for (const q of result.set!.questions) {
      const check = isQuestionConflicting(q, played);
      expect(check.isConflict).toBe(false);
    }
  });
});
