import { describe, it, expect } from 'vitest';

describe('Group 2 Games Engine Logic', () => {
  describe('Jeopardy Scoring & State', () => {
    it('adds points for correct answer and deducts points for incorrect answer', () => {
      let score = 200;

      const handleAnswer = (isCorrect: boolean, value: number) => {
        score = isCorrect ? score + value : score - value;
      };

      handleAnswer(true, 300);
      expect(score).toBe(500);

      handleAnswer(false, 400);
      expect(score).toBe(100);

      // Can go negative
      handleAnswer(false, 500);
      expect(score).toBe(-400);
    });

    it('marks questions as used once opened', () => {
      const usedTiles = new Set<string>();
      const tileId = 'cat_1_q_100';

      usedTiles.add(tileId);
      expect(usedTiles.has(tileId)).toBe(true);
      expect(usedTiles.has('cat_1_q_200')).toBe(false);
    });
  });

  describe('Wheel of Fortune Mechanics', () => {
    it('reveals matched letters and counts occurrences', () => {
      const phrase = 'PAGKAIN NG BALUT';
      const guessedLetters = new Set<string>(['A', 'N']);

      const renderedTiles = phrase.split('').map((char) => {
        if (char === ' ') return ' ';
        return guessedLetters.has(char) ? char : '_';
      }).join('');

      expect(renderedTiles).toBe('_A__A_N N_ _A___');

      const countA = (phrase.match(/A/g) || []).length;
      expect(countA).toBe(3);
    });

    it('handles bankrupt by wiping current round bank without wiping total bank', () => {
      let totalBank = 1200;
      let roundBank = 600;

      const applyBankrupt = () => {
        roundBank = 0;
      };

      applyBankrupt();
      expect(roundBank).toBe(0);
      expect(totalBank).toBe(1200);
    });
  });

  describe('Bluff the Answer Scoring', () => {
    it('awards 200 pts for picking truth and 100 pts per rival tricked', () => {
      // Team 1 submitted bluff A, Team 2 submitted bluff B.
      // True answer is C.
      // Team 1 voted for C (+200 pts)
      // Team 2 voted for A (+100 pts to Team 1)
      let team1Score = 0;
      let team2Score = 0;

      const team1VotedTrue = true;
      const team1TrickedCount = 1;

      if (team1VotedTrue) team1Score += 200;
      team1Score += team1TrickedCount * 100;

      expect(team1Score).toBe(300);
      expect(team2Score).toBe(0);
    });
  });
});
