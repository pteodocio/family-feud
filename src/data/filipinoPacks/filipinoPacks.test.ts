import { describe, it, expect } from 'vitest';
import {
  FILIPINO_BUILTIN_PACKS,
  FILIPINO_NEW_6_PACKS,
  FILIPINO_NEW_8_PACKS,
  FILIPINO_SCENARIO_10_PACKS,
  VARIETY_12_PACKS,
  validateQuestionPackIntegrity,
} from './index';

describe('Filipino Question Packs Validation', () => {
  it('contains exactly 61 built-in packs (25 original + 6 + 8 + 10 scenario + 12 variety packs)', () => {
    expect(FILIPINO_BUILTIN_PACKS.length).toBe(61);
    expect(FILIPINO_NEW_6_PACKS.length).toBe(6);
    expect(FILIPINO_NEW_8_PACKS.length).toBe(8);
    expect(FILIPINO_SCENARIO_10_PACKS.length).toBe(10);
    expect(VARIETY_12_PACKS.length).toBe(12);
  });

  it('contains exactly 305 questions total (5 per pack across all 61 packs)', () => {
    let totalQuestions = 0;
    for (const pack of FILIPINO_BUILTIN_PACKS) {
      expect(pack.questions.length).toBe(5);
      totalQuestions += pack.questions.length;
    }
    expect(totalQuestions).toBe(305);
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

  it('verifies the 10 scenario-based packs have exactly 50 questions, 3-5 answers, 100 points descending', () => {
    let scenarioQuestionsCount = 0;
    for (const pack of FILIPINO_SCENARIO_10_PACKS) {
      expect(pack.questions.length).toBe(5);
      scenarioQuestionsCount += pack.questions.length;

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
    expect(scenarioQuestionsCount).toBe(50);
  });

  it('verifies the 12 variety packs have exactly 60 questions, 3-6 answers, 100 points descending', () => {
    let varietyQuestionsCount = 0;
    for (const pack of VARIETY_12_PACKS) {
      expect(pack.questions.length).toBe(5);
      varietyQuestionsCount += pack.questions.length;

      for (const question of pack.questions) {
        expect(question.answers.length).toBeGreaterThanOrEqual(3);
        expect(question.answers.length).toBeLessThanOrEqual(6);

        const sum = question.answers.reduce((acc, a) => acc + a.points, 0);
        expect(sum).toBe(100);

        for (let i = 0; i < question.answers.length - 1; i++) {
          expect(question.answers[i].points).toBeGreaterThanOrEqual(question.answers[i + 1].points);
        }
      }
    }
    expect(varietyQuestionsCount).toBe(60);
  });

  it('passes comprehensive data integrity check with zero errors across all 61 packs', () => {
    const report = validateQuestionPackIntegrity(FILIPINO_BUILTIN_PACKS);
    expect(report.errors).toEqual([]);
    expect(report.isValid).toBe(true);
    expect(report.packCount).toBe(61);
    expect(report.questionCount).toBe(305);
    expect(report.answerCount).toBeGreaterThanOrEqual(915); // At least 3 * 305
  });

  it('verifies all 8 previous new specific pack titles match requirements', () => {
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

  it('verifies all 10 scenario-based pack titles match exact requirements', () => {
    const titles = FILIPINO_SCENARIO_10_PACKS.map((p) => p.title);
    expect(titles).toEqual([
      'Biglang May Bisita!',
      'Nasa Labas Na Ako!',
      'May Nag-message na Crush Mo!',
      'Nahuli ni Mama!',
      'May Exam Bukas!',
      'Naubusan ng Ulam!',
      'Nagkamali ng Send!',
      'May Group Project Kayo!',
      'May Nag-aya Kumain!',
      'Nag-away ang Magkapatid!',
    ]);
  });

  it('verifies all 12 variety pack titles match exact requirements', () => {
    const titles = VARIETY_12_PACKS.map((p) => p.title);
    expect(titles).toEqual([
      'Zombie Apocalypse',
      'If I Were a Millionaire',
      'Cartoon Kingdom',
      'Animal Kingdom',
      'Street Food Battle',
      'Around the Philippines',
      'Superpower Showdown',
      'Movie Mania',
      'Ocean Adventures',
      'Video Game Legends',
      'Things That Scare Us',
      'Stranded on an Island',
    ]);
  });
});
