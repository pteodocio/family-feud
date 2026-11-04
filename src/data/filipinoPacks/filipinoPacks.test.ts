import { describe, it, expect } from 'vitest';
import {
  FILIPINO_BUILTIN_PACKS,
  FILIPINO_NEW_6_PACKS,
  FILIPINO_NEW_8_PACKS,
  validateQuestionPackIntegrity,
} from './index';

describe('Filipino Question Packs Validation', () => {
  it('contains exactly 39 built-in packs (25 original + 6 + 8 new)', () => {
    expect(FILIPINO_BUILTIN_PACKS.length).toBe(39);
    expect(FILIPINO_NEW_6_PACKS.length).toBe(6);
    expect(FILIPINO_NEW_8_PACKS.length).toBe(8);
  });

  it('contains exactly 195 questions total (5 per pack)', () => {
    let totalQuestions = 0;
    for (const pack of FILIPINO_BUILTIN_PACKS) {
      expect(pack.questions.length).toBe(5);
      totalQuestions += pack.questions.length;
    }
    expect(totalQuestions).toBe(195);
  });

  it('verifies the 8 new packs have exactly 40 questions, 3-5 answers, 100 points descending', () => {
    let newQuestionsCount = 0;
    for (const pack of FILIPINO_NEW_8_PACKS) {
      expect(pack.questions.length).toBe(5);
      newQuestionsCount += pack.questions.length;

      for (const question of pack.questions) {
        expect(question.answers.length).toBeGreaterThanOrEqual(3);
        expect(question.answers.length).toBeLessThanOrEqual(5);

        const sum = question.answers.reduce((acc, a) => acc + a.points, 0);
        expect(sum).toBe(100);

        for (let i = 0; i < question.answers.length - 1; i++) {
          expect(question.answers[i].points).toBeGreaterThanOrEqual(question.answers[i + 1].points);
        }
      }
    }
    expect(newQuestionsCount).toBe(40);
  });

  it('passes comprehensive data integrity check with zero errors across all 39 packs', () => {
    const report = validateQuestionPackIntegrity(FILIPINO_BUILTIN_PACKS);
    expect(report.errors).toEqual([]);
    expect(report.isValid).toBe(true);
    expect(report.packCount).toBe(39);
    expect(report.questionCount).toBe(195);
    expect(report.answerCount).toBeGreaterThanOrEqual(585); // At least 3 * 195
  });

  it('verifies all 8 new specific pack titles match requirements', () => {
    const titles = FILIPINO_NEW_8_PACKS.map((p) => p.title);
    expect(titles).toContain('Elementary Days');
    expect(titles).toContain('Mga Larong Kalye');
    expect(titles).toContain('Palengke Adventures');
    expect(titles).toContain('Birthday Party sa Pinas');
    expect(titles).toContain('Fast Food Favorites');
    expect(titles).toContain('Online Shopping Budol');
    expect(titles).toContain('Karinderya Chronicles');
    expect(titles).toContain('Mga Bagay na Laging Mayroon sa Bahay');
  });
});
