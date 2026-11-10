import { describe, it, expect } from 'vitest';
import { checkWordPathOnGrid } from '../services/localGenerators/wordHuntGenerator';

describe('Group 3 Games Engine Logic', () => {
  describe('Heads Up Quick Tally', () => {
    it('tallies correct guesses and tracks passes', () => {
      let correct = 0;
      let passes = 0;

      const recordGuess = (isCorrect: boolean) => {
        if (isCorrect) correct++;
        else passes++;
      };

      recordGuess(true);
      recordGuess(true);
      recordGuess(false);
      recordGuess(true);

      expect(correct).toBe(3);
      expect(passes).toBe(1);
    });
  });

  describe('Word Hunt Adjacency & Scoring', () => {
    const testGrid = [
      ['C', 'A', 'T', 'S'],
      ['O', 'R', 'E', 'P'],
      ['D', 'O', 'G', 'S'],
      ['F', 'I', 'S', 'H'],
    ];

    it('validates horizontal, vertical, and diagonal paths', () => {
      expect(checkWordPathOnGrid('CAT', testGrid)).toBe(true);
      expect(checkWordPathOnGrid('CATS', testGrid)).toBe(true);
      expect(checkWordPathOnGrid('DOG', testGrid)).toBe(true);
      expect(checkWordPathOnGrid('FISH', testGrid)).toBe(true);
    });

    it('rejects words not connectable via adjacent letters', () => {
      expect(checkWordPathOnGrid('ELEPHANT', testGrid)).toBe(false);
    });

    it('calculates boggle points based on length', () => {
      const getBoggleScore = (word: string) => {
        const len = word.length;
        if (len < 3) return 0;
        if (len <= 4) return 1;
        if (len === 5) return 2;
        if (len === 6) return 3;
        if (len === 7) return 5;
        return 11;
      };

      expect(getBoggleScore('CAT')).toBe(1);
      expect(getBoggleScore('CRANE')).toBe(2);
      expect(getBoggleScore('PLANET')).toBe(3);
      expect(getBoggleScore('JEEPNEY')).toBe(5);
      expect(getBoggleScore('BALIKBAYAN')).toBe(11);
    });
  });

  describe('Scattergories Uniqueness Scoring', () => {
    it('cancels out duplicate answers across teams', () => {
      const team1Answers = ['Mango', 'Motorcycle', 'Manila'];
      const team2Answers = ['Mango', 'Manicure', 'Makati'];

      const scoreAnswer = (ans: string, otherTeamAns: string[]) => {
        if (!ans) return 0;
        const lower = ans.toLowerCase().trim();
        const isDuplicate = otherTeamAns.some((o) => o.toLowerCase().trim() === lower);
        return isDuplicate ? 0 : 1;
      };

      // 'Mango' is duplicate -> 0 pts
      expect(scoreAnswer(team1Answers[0], team2Answers)).toBe(0);
      // 'Motorcycle' is unique -> 1 pt
      expect(scoreAnswer(team1Answers[1], team2Answers)).toBe(1);
    });
  });

  describe('Trivia Elimination Survival Logic', () => {
    it('deducts lives and marks team eliminated at 0 lives', () => {
      let lives = 3;
      let isEliminated = false;

      const takeDamage = () => {
        lives--;
        if (lives <= 0) {
          lives = 0;
          isEliminated = true;
        }
      };

      takeDamage();
      expect(lives).toBe(2);
      expect(isEliminated).toBe(false);

      takeDamage();
      takeDamage();
      expect(lives).toBe(0);
      expect(isEliminated).toBe(true);
    });
  });
});
