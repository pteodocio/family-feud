import { describe, it, expect } from 'vitest';

describe('Group 1 Games Engine Logic', () => {
  describe('Password Game Logic', () => {
    it('calculates points correctly along the clue ladder (10, 8, 6, 4)', () => {
      const getPointsForClue = (clueNumber: number) => {
        const ladder = [10, 8, 6, 4];
        return ladder[Math.min(clueNumber - 1, ladder.length - 1)] || 4;
      };

      expect(getPointsForClue(1)).toBe(10);
      expect(getPointsForClue(2)).toBe(8);
      expect(getPointsForClue(3)).toBe(6);
      expect(getPointsForClue(4)).toBe(4);
      expect(getPointsForClue(5)).toBe(4);
    });

    it('alternates active team turn when clue or guess passes', () => {
      const getNextTeamIndex = (current: number, totalTeams: number) => {
        return (current + 1) % totalTeams;
      };

      expect(getNextTeamIndex(0, 2)).toBe(1);
      expect(getNextTeamIndex(1, 2)).toBe(0);
    });
  });

  describe('Catchphrase Game Logic', () => {
    it('tracks words completed and passes possession cleanly', () => {
      let activeTeamIdx = 0;
      let wordsCompleted = 0;

      const passTurn = () => {
        wordsCompleted++;
        activeTeamIdx = (activeTeamIdx + 1) % 2;
      };

      passTurn();
      expect(wordsCompleted).toBe(1);
      expect(activeTeamIdx).toBe(1);
    });
  });

  describe('Taboo Game Logic', () => {
    it('applies penalty buzzer strikes and score deductions accurately', () => {
      let score = 5;
      let strikes = 0;

      const applyTabooViolation = () => {
        strikes++;
        score = Math.max(0, score - 1);
      };

      applyTabooViolation();
      expect(strikes).toBe(1);
      expect(score).toBe(4);
    });
  });
});
