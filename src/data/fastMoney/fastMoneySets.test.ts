import { describe, it, expect } from 'vitest';
import {
  FAST_MONEY_SETS,
  getFastMoneySetById,
  getRandomFastMoneySet,
  validateAllFastMoneySets,
} from './index';
import { FILIPINO_BUILTIN_PACKS } from '../filipinoPacks';
import {
  isDuplicateFastMoneyAnswer,
  checkFastMoneyDuplicate,
} from '../../engine/answerMatcher';
import {
  createGameSession,
  initFastMoneyWithSet,
  startFastMoneyPlayer,
  submitFastMoneyStepAnswer,
  passFastMoneyQuestion,
  revealFastMoneyAnswer,
  revealFastMoneyPoints,
  resolveFastMoney,
} from '../../engine/gameEngine';

describe('Fast Money 20 Question Sets Validation', () => {
  it('passes comprehensive data validation (20 sets, 100 questions, descending points summing to 100)', () => {
    const report = validateAllFastMoneySets();
    if (!report.valid) {
      console.error('Fast Money validation errors:', report.errors);
    }
    expect(report.valid).toBe(true);
    expect(report.errors).toHaveLength(0);
    expect(report.totalSets).toBe(20);
    expect(report.totalQuestions).toBe(100);
  });

  it('contains exactly 20 sets named Fast Money Set 01 to Fast Money Set 20', () => {
    expect(FAST_MONEY_SETS).toHaveLength(20);
    for (let i = 1; i <= 20; i++) {
      const pad = String(i).padStart(2, '0');
      const expectedId = `fm_set_${pad}`;
      const expectedTitle = `Fast Money Set ${pad}`;
      const found = FAST_MONEY_SETS.find((s) => s.id === expectedId);
      expect(found, `Missing set with id ${expectedId}`).toBeDefined();
      expect(found?.title).toBe(expectedTitle);
      expect(found?.questions).toHaveLength(5);
    }
  });

  it('verifies every question has 4 to 8 answers summing to exactly 100 points in descending order', () => {
    FAST_MONEY_SETS.forEach((set) => {
      set.questions.forEach((q) => {
        expect(q.prompt.length).toBeGreaterThan(5);
        expect(q.answers.length).toBeGreaterThanOrEqual(4);
        expect(q.answers.length).toBeLessThanOrEqual(8);

        const sum = q.answers.reduce((acc, a) => acc + a.points, 0);
        expect(sum, `Question "${q.prompt}" in ${set.id} does not sum to 100 points`).toBe(100);

        for (let idx = 0; idx < q.answers.length - 1; idx++) {
          expect(
            q.answers[idx].points >= q.answers[idx + 1].points,
            `Answers in "${q.prompt}" must be descending: answer ${idx} (${q.answers[idx].points}) < answer ${idx + 1} (${q.answers[idx + 1].points})`
          ).toBe(true);
        }
      });
    });
  });

  it('fetches sets by ID correctly and supports random selection', () => {
    const set1 = getFastMoneySetById('fm_set_01');
    expect(set1).toBeDefined();
    expect(set1?.title).toBe('Fast Money Set 01');

    const randomSet = getRandomFastMoneySet(['fm_set_01', 'fm_set_02']);
    expect(randomSet).toBeDefined();
    expect(['fm_set_01', 'fm_set_02']).not.toContain(randomSet.id);
  });
});

describe('Independence from Regular Round Question Packs', () => {
  it('verifies zero exact or semantic duplication between Fast Money (100 questions) and Regular Packs (305 questions)', () => {
    const regularPrompts: { packId: string; prompt: string; normalized: string }[] = [];
    FILIPINO_BUILTIN_PACKS.forEach((pack) => {
      pack.questions.forEach((q) => {
        regularPrompts.push({
          packId: pack.id,
          prompt: q.prompt,
          normalized: q.prompt.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim(),
        });
      });
    });

    const stopWords = new Set([
      'a', 'an', 'the', 'and', 'or', 'of', 'in', 'on', 'at', 'to', 'for', 'with', 'from',
      'by', 'about', 'as', 'into', 'like', 'through', 'after', 'over', 'between', 'out',
      'against', 'during', 'without', 'before', 'under', 'around', 'among',
      'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does',
      'did', 'can', 'could', 'should', 'would', 'will', 'shall', 'may', 'might', 'must',
      'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'there', 'where',
      'when', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other',
      'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
      'name', 'something', 'people', 'person', 'someone', 'things', 'thing', 'ano', 'ang',
      'mga', 'sa', 'ng', 'na', 'kung', 'kapag', 'may', 'para', 'kay', 'kasi', 'dahil',
      'commonly', 'popular', 'usually', 'often', 'always', 'found', 'seen', 'known'
    ]);

    const tokenize = (text: string) =>
      text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 2 && !stopWords.has(w));

    const collisions: string[] = [];

    FAST_MONEY_SETS.forEach((set) => {
      set.questions.forEach((fmQ) => {
        const fmNorm = fmQ.prompt.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
        const fmTokens = new Set(tokenize(fmQ.prompt));

        regularPrompts.forEach((reg) => {
          // Exact text match
          if (fmNorm === reg.normalized) {
            collisions.push(`Exact duplicate: "${fmQ.prompt}" in ${set.id} matches "${reg.prompt}" in ${reg.packId}`);
          }

          // High semantic / keyword overlap
          const regTokens = tokenize(reg.prompt);
          const shared = regTokens.filter((t) => fmTokens.has(t));
          const minTokens = Math.min(fmTokens.size, regTokens.length);
          const ratio = minTokens > 0 ? shared.length / minTokens : 0;

          if (shared.length >= 2 && ratio >= 0.45) {
            collisions.push(
              `Semantic overlap: "${fmQ.prompt}" in ${set.id} resembles "${reg.prompt}" in ${reg.packId} (Shared: ${shared.join(', ')})`
            );
          }
        });
      });
    });

    if (collisions.length > 0) {
      console.error('Fast Money Collisions Found:', collisions);
    }

    expect(collisions).toHaveLength(0);
  });
});

describe('Fast Money Duplicate Answer Detection', () => {
  it('normalizes case, punctuation, and whitespace when detecting duplicates', () => {
    expect(isDuplicateFastMoneyAnswer('Doctor', 'doctor')).toBe(true);
    expect(isDuplicateFastMoneyAnswer('  DOCTOR  ', 'doctor')).toBe(true);
    expect(isDuplicateFastMoneyAnswer('Nurse!', 'nurse')).toBe(true);
    expect(isDuplicateFastMoneyAnswer('call-center', 'call center')).toBe(true);
    expect(isDuplicateFastMoneyAnswer('Baker', 'Doctor')).toBe(false);
  });

  it('detects duplicate answers between Player 1 and Player 2 via canonical ID match or text match', () => {
    // Both matched canonical answer ID
    expect(checkFastMoneyDuplicate('Doctor', 'fm_01_q1_a1', 'Nurse', 'fm_01_q1_a1')).toBe(true);

    // Raw text normalizes to same
    expect(checkFastMoneyDuplicate('Security guard', 'fm_01_q1_a2', 'security guard', null)).toBe(true);

    // Completely distinct answers
    expect(checkFastMoneyDuplicate('Doctor', 'fm_01_q1_a1', 'Baker', 'fm_01_q1_a5')).toBe(false);
  });
});

describe('Fast Money Stepper & Game Flow', () => {
  it('initializes Fast Money with a chosen set and steps through questions', () => {
    const sampleSet = FAST_MONEY_SETS[0];
    let session = createGameSession({
      id: 'test-fm-session',
      title: 'Fast Money Test',
      team1Name: 'Family A',
      team2Name: 'Family B',
      config: {
        roundsCount: 4,
        multipliers: [1, 1, 2, 3],
        targetScore: 300,
        fastMoneyTimer1: 20,
        fastMoneyTimer2: 25,
        fastMoneyTarget: 200,
        faceOffTieRule: 'hostDecision',
      },
      regularQuestions: FILIPINO_BUILTIN_PACKS[0].questions,
      fastMoneySet: sampleSet,
      packId: 'test-pack',
    });

    session = initFastMoneyWithSet(session, sampleSet);
    expect(session.fastMoney?.setId).toBe('fm_set_01');
    expect(session.fastMoney?.setTitle).toBe('Fast Money Set 01');
    expect(session.fastMoney?.step).toBe('setup');

    // Start Player 1
    session = startFastMoneyPlayer(session, 1);
    expect(session.fastMoney?.step).toBe('player1_playing');
    expect(session.fastMoney?.currentQuestionIndex).toBe(0);
    expect(session.fastMoney?.player1.timerRunning).toBe(true);

    // Answer Q1: 'Doctor or Nurse' (worth 35 points in set 01)
    const q1Result = submitFastMoneyStepAnswer(session, 1, 'Doctor');
    expect(q1Result.isDuplicate).toBe(false);
    session = q1Result.session;
    expect(session.fastMoney?.player1.answers[0].points).toBe(35);
    expect(session.fastMoney?.currentQuestionIndex).toBe(1);

    // Pass Q2
    session = passFastMoneyQuestion(session, 1);
    expect(session.fastMoney?.passedIndices).toContain(1);
    expect(session.fastMoney?.currentQuestionIndex).toBe(2);

    // Answer Q3: 'Rubber cleaning gloves' (worth 38 points)
    const q3Result = submitFastMoneyStepAnswer(session, 1, 'Rubber cleaning gloves');
    session = q3Result.session;
    expect(session.fastMoney?.player1.answers[2].points).toBe(38);

    // Answer Q4: 'Swimming' (worth 40 points)
    const q4Result = submitFastMoneyStepAnswer(session, 1, 'Swimming');
    session = q4Result.session;

    // Answer Q5: 'Deposit cash or check' (worth 38 points)
    const q5Result = submitFastMoneyStepAnswer(session, 1, 'Deposit cash');
    session = q5Result.session;

    // Notice Q2 was passed, so stepper should return to Q2!
    expect(session.fastMoney?.currentQuestionIndex).toBe(1);

    // Now answer Q2: 'Library' (worth 42 points)
    const q2Result = submitFastMoneyStepAnswer(session, 1, 'Library');
    session = q2Result.session;

    // All 5 answered! Step moves to player1_review and timer stops
    expect(session.fastMoney?.step).toBe('player1_review');
    expect(session.fastMoney?.player1.isFinished).toBe(true);
    expect(session.fastMoney?.player1.timerRunning).toBe(false);
    expect(session.fastMoney?.player1.totalScore).toBe(35 + 42 + 38 + 40 + 38); // 193 pts!

    // Start Player 2
    session = startFastMoneyPlayer(session, 2);
    expect(session.fastMoney?.step).toBe('player2_playing');
    expect(session.fastMoney?.currentQuestionIndex).toBe(0);

    // Player 2 submits duplicate answer for Q1: 'Doctor' -> DUPLICATE REJECTED!
    const dupResult = submitFastMoneyStepAnswer(session, 2, 'Doctor');
    expect(dupResult.isDuplicate).toBe(true);
    expect(dupResult.session.fastMoney?.duplicateWarning).toContain('Duplicate');

    // Player 2 gives alternative: 'Security guard' (worth 28 points)
    const p2q1 = submitFastMoneyStepAnswer(dupResult.session, 2, 'Security guard');
    expect(p2q1.isDuplicate).toBe(false);
    session = p2q1.session;
    expect(session.fastMoney?.player2.answers[0].points).toBe(28);
    expect(session.fastMoney?.currentQuestionIndex).toBe(1);

    // Complete player 2 answers
    session = submitFastMoneyStepAnswer(session, 2, 'Church').session; // 28 pts
    session = submitFastMoneyStepAnswer(session, 2, 'Winter mittens').session; // 26 pts
    session = submitFastMoneyStepAnswer(session, 2, 'Karate').session; // 30 pts
    session = submitFastMoneyStepAnswer(session, 2, 'Withdraw large amount of cash').session; // 27 pts

    expect(session.fastMoney?.step).toBe('player2_review');

    // Reveal phase: Reveal Player 1 answers & points
    session = revealFastMoneyAnswer(session, 1, 0);
    session = revealFastMoneyPoints(session, 1, 0);
    expect(session.fastMoney?.player1.revealedAnswerIndices).toContain(0);
    expect(session.fastMoney?.player1.revealedPointsIndices).toContain(0);

    // Conclude Fast Money
    session = resolveFastMoney(session);
    expect(session.fastMoney?.isCompleted).toBe(true);
    expect(session.fastMoney?.totalScore).toBeGreaterThanOrEqual(200);
    expect(session.fastMoney?.won).toBe(true); // >= 200 points
  });
});
