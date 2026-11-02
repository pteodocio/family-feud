import { describe, it, expect } from 'vitest';
import { FILIPINO_25_PACKS, validateQuestionPackIntegrity } from './index';

describe('25 Filipino Question Packs Validation', () => {
  it('contains exactly 25 packs', () => {
    expect(FILIPINO_25_PACKS.length).toBe(25);
  });

  it('contains exactly 125 questions (5 per pack)', () => {
    let totalQuestions = 0;
    for (const pack of FILIPINO_25_PACKS) {
      expect(pack.questions.length).toBe(5);
      totalQuestions += pack.questions.length;
    }
    expect(totalQuestions).toBe(125);
  });

  it('ensures every question has between 3 and 5 answers summing to 100 points descending', () => {
    for (const pack of FILIPINO_25_PACKS) {
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
  });

  it('passes comprehensive data integrity check with zero errors', () => {
    const report = validateQuestionPackIntegrity(FILIPINO_25_PACKS);
    expect(report.errors).toEqual([]);
    expect(report.isValid).toBe(true);
    expect(report.packCount).toBe(25);
    expect(report.questionCount).toBe(125);
    expect(report.answerCount).toBeGreaterThanOrEqual(375); // At least 3 * 125
  });

  it('verifies all 25 specific pack titles match requirements', () => {
    const titles = FILIPINO_25_PACKS.map((p) => p.title);
    expect(titles).toContain('Mga Linyahan ni Mama');
    expect(titles).toContain('Filipino Family Reunion Chaos');
    expect(titles).toContain('Certified Pinoy Moments');
    expect(titles).toContain('Videoke Champions');
    expect(titles).toContain('Pinoy Street Food Adventures');
    expect(titles).toContain('Jeepney and Commute Problems');
    expect(titles).toContain('Marites Chronicles');
    expect(titles).toContain('Kapag Walang Pera');
    expect(titles).toContain('Kanin Is Life');
    expect(titles).toContain('Buhay Pinoy sa Bahay');
    expect(titles).toContain('Mga Palusot ng Pinoy');
    expect(titles).toContain('Pamilya Group Chat');
    expect(titles).toContain('Walang Forever');
    expect(titles).toContain('Filipino Online Behavior');
    expect(titles).toContain('Bahala Na si Batman');
    expect(titles).toContain('Mga Taong Laging Late');
    expect(titles).toContain('Fiesta Madness');
    expect(titles).toContain('Utang Chronicles');
    expect(titles).toContain('Mga Lihim ng Ref');
    expect(titles).toContain('Pinoy Logic');
    expect(titles).toContain('Sari-Sari Store Stories');
    expect(titles).toContain('Tita at Tito Moments');
    expect(titles).toContain('Student Life: Pinoy Edition');
    expect(titles).toContain('Traffic Na Naman!');
    expect(titles).toContain('Mga Tanong na Ayaw Mong Marinig');
  });
});
