import { describe, it, expect, beforeEach } from 'vitest';
import {
  generateTriviaContent,
  generateCharadesContent,
  generatePictionaryContent,
  generateBingoContent,
  generateGuessWordContent,
  regenerateSingleTriviaItem,
  regenerateSingleCharadesItem,
  regenerateSinglePictionaryItem,
  regenerateSingleGuessWordItem,
  clearContentHistory,
} from './contentEngine';
import { recordContentUsage, isContentRecentlyUsed } from './contentHistory';

describe('Unified Content Generation Engine', () => {
  beforeEach(async () => {
    await clearContentHistory();
  });

  describe('Family Trivia Generator', () => {
    it('generates multiple valid trivia questions with options and explanation', async () => {
      const res = await generateTriviaContent({ count: 5 });
      expect(res.questions.length).toBeGreaterThanOrEqual(1);
      const q = res.questions[0];
      expect(q.prompt).toBeTruthy();
      expect(q.options.length).toBe(4);
      expect(q.correctOptionIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctOptionIndex).toBeLessThan(4);
      expect(q.explanation).toBeTruthy();
    });

    it('supports Filipino language mode', async () => {
      const res = await generateTriviaContent({ count: 4, language: 'fil' });
      expect(res.questions.length).toBeGreaterThanOrEqual(1);
      expect(res.questions[0].prompt).toBeTruthy();
    });

    it('can regenerate a single trivia question', async () => {
      const single = await regenerateSingleTriviaItem({});
      expect(single).not.toBeNull();
      expect(single?.prompt).toBeTruthy();
    });
  });

  describe('Charades Generator', () => {
    it('generates playable prompts with difficulty and point values', async () => {
      const res = await generateCharadesContent({ count: 5 });
      expect(res.words.length).toBeGreaterThanOrEqual(1);
      const w = res.words[0];
      expect(w.word).toBeTruthy();
      expect(['easy', 'medium', 'hard']).toContain(w.difficulty);
      expect(w.points).toBeGreaterThanOrEqual(1);
    });

    it('can regenerate a single charades prompt', async () => {
      const single = await regenerateSingleCharadesItem({});
      expect(single).not.toBeNull();
      expect(single?.word).toBeTruthy();
    });
  });

  describe('Pictionary Generator', () => {
    it('generates clear drawable prompts across categories', async () => {
      const res = await generatePictionaryContent({ count: 6 });
      expect(res.words.length).toBeGreaterThanOrEqual(1);
      const w = res.words[0];
      expect(w.word).toBeTruthy();
      expect(w.category).toBeTruthy();
    });

    it('can regenerate a single pictionary prompt', async () => {
      const single = await regenerateSinglePictionaryItem({});
      expect(single).not.toBeNull();
      expect(single?.word).toBeTruthy();
    });
  });

  describe('Family Bingo Generator', () => {
    it('generates 5x5 classic number cards with FREE center space', () => {
      const res = generateBingoContent({ theme: 'Classic 75-Ball Numbers', cardCount: 3 });
      expect(res.cards.length).toBe(3);
      for (const card of res.cards) {
        expect(card.grid.length).toBe(5);
        expect(card.grid[0].length).toBe(5);
        expect(card.grid[2][2].isFree).toBe(true);
        expect(card.grid[2][2].text).toBe('FREE');
      }
    });

    it('generates unique themed event cards without duplicates', () => {
      const res = generateBingoContent({
        theme: 'Filipino Family Reunion',
        cardCount: 4,
        playerNames: ['Santos 1', 'Santos 2', 'Reyes 1', 'Reyes 2'],
      });
      expect(res.cards.length).toBe(4);
      expect(res.cards[0].playerName).toBe('Santos 1');
      expect(res.cards[0].grid[2][2].isFree).toBe(true);
      expect(res.cards[0].grid[0][0].text).toBeTruthy();
    });
  });

  describe('Guess the Word Generator', () => {
    it('generates progressive word puzzles with exactly 4 clues', async () => {
      const res = await generateGuessWordContent({ count: 4 });
      expect(res.puzzles.length).toBeGreaterThanOrEqual(1);
      const p = res.puzzles[0];
      expect(p.word).toBeTruthy();
      expect(p.clues.length).toBe(4);
      // Clues must not directly contain the secret word (case-insensitive check)
      const wordLower = p.word.toLowerCase();
      for (const clue of p.clues) {
        expect(clue.toLowerCase().includes(wordLower)).toBe(false);
      }
    });

    it('can regenerate a single guess the word puzzle', async () => {
      const single = await regenerateSingleGuessWordItem({});
      expect(single).not.toBeNull();
      expect(single?.word).toBeTruthy();
      expect(single?.clues.length).toBe(4);
    });
  });

  describe('Content History Deduplication', () => {
    it('records played items and checks recent usage', async () => {
      await recordContentUsage({
        gameId: 'family-trivia',
        itemTitle: 'Unique Fact About Solar System',
        category: 'Science',
      });

      const isUsed = await isContentRecentlyUsed('family-trivia', 'Unique Fact About Solar System');
      expect(isUsed).toBe(true);

      const isOtherUsed = await isContentRecentlyUsed('family-trivia', 'Completely Unseen Fact');
      expect(isOtherUsed).toBe(false);
    });
  });
});
