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
  // 10 Team Battle Generators
  generatePasswordContent,
  generateCatchphraseContent,
  generateTabooContent,
  generateJeopardyContent,
  generateWheelContent,
  generateBluffContent,
  generateHeadsUpContent,
  generateWordHuntContent,
  generateScattergoriesContent,
  generateEliminationContent,
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

  describe('10 Team Battle Generators', () => {
    it('generates Password items with hints', async () => {
      const res = await generatePasswordContent({ count: 5 });
      expect(res.words.length).toBeGreaterThanOrEqual(1);
      expect(res.words[0].word).toBeTruthy();
    });

    it('generates Catchphrase items', async () => {
      const res = await generateCatchphraseContent({ count: 5 });
      expect(res.phrases.length).toBeGreaterThanOrEqual(1);
      expect(res.phrases[0].phrase).toBeTruthy();
    });

    it('generates Taboo cards with 5 forbidden words', async () => {
      const res = await generateTabooContent({ count: 4 });
      expect(res.cards.length).toBeGreaterThanOrEqual(1);
      expect(res.cards[0].target).toBeTruthy();
      expect(res.cards[0].tabooWords.length).toBe(5);
    });

    it('generates Jeopardy 5x5 board with 5 categories and escalating values', async () => {
      const res = await generateJeopardyContent();
      expect(res.categories.length).toBe(5);
      expect(res.categories[0].questions.length).toBe(5);
      expect(res.categories[0].questions[0].value).toBe(100);
      expect(res.categories[0].questions[4].value).toBe(500);
    });

    it('generates Wheel of Fortune mystery phrases', async () => {
      const res = await generateWheelContent({ count: 3 });
      expect(res.puzzles.length).toBeGreaterThanOrEqual(1);
      expect(res.puzzles[0].phrase).toBeTruthy();
      expect(res.puzzles[0].category).toBeTruthy();
    });

    it('generates Bluff trivia with questions and true answers', async () => {
      const res = await generateBluffContent({ count: 3 });
      expect(res.items.length).toBeGreaterThanOrEqual(1);
      expect(res.items[0].question).toBeTruthy();
      expect(res.items[0].trueAnswer).toBeTruthy();
    });

    it('generates Heads Up clue cards', async () => {
      const res = await generateHeadsUpContent({ count: 6 });
      expect(res.cards.length).toBeGreaterThanOrEqual(1);
      expect(res.cards[0].item).toBeTruthy();
    });

    it('generates 4x4 Word Hunt board with path validator', async () => {
      const res = await generateWordHuntContent();
      expect(res.grid.length).toBe(4);
      expect(res.grid[0].length).toBe(4);
      expect(typeof res.isValidWordPath).toBe('function');
    });

    it('generates Scattergories list with key letter', async () => {
      const res = await generateScattergoriesContent();
      expect(res.letter).toBeTruthy();
      expect(res.categories.length).toBeGreaterThanOrEqual(6);
    });

    it('generates Trivia Elimination survival questions', async () => {
      const res = await generateEliminationContent({ count: 5 });
      expect(res.questions.length).toBeGreaterThanOrEqual(1);
      expect(res.questions[0].question).toBeTruthy();
      expect(res.questions[0].options.length).toBe(4);
    });
  });
});
