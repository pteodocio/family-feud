import { describe, it, expect } from 'vitest';
import { TRIVIA_QUESTIONS, TRIVIA_CATEGORIES } from './triviaQuestions';
import { CHARADES_WORDS, CHARADES_CATEGORIES } from './charadesWords';
import { PICTIONARY_WORDS, PICTIONARY_CATEGORIES } from './pictionaryWords';
import { BINGO_PATTERNS } from './bingoPatterns';
import { WORD_CLUES } from './wordClues';

describe('Hub Game Content Banks Integrity', () => {
  it('trivia questions have valid structure and span all 6 required categories', () => {
    expect(TRIVIA_CATEGORIES).toHaveLength(6);
    expect(TRIVIA_QUESTIONS.length).toBeGreaterThanOrEqual(60);

    TRIVIA_QUESTIONS.forEach((q) => {
      expect(q.id).toBeDefined();
      expect(q.prompt.length).toBeGreaterThan(5);
      expect(q.category).toBeDefined();
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.correctOptionIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctOptionIndex).toBeLessThan(q.options.length);
    });
  });

  it('charades words span 6 categories with easy/medium/hard difficulties', () => {
    expect(CHARADES_CATEGORIES).toHaveLength(6);
    expect(CHARADES_WORDS.length).toBeGreaterThanOrEqual(90);

    const difficulties = new Set(CHARADES_WORDS.map((w) => w.difficulty));
    expect(difficulties.has('easy')).toBe(true);
    expect(difficulties.has('medium')).toBe(true);
    expect(difficulties.has('hard')).toBe(true);
  });

  it('pictionary words contain diverse drawing prompts', () => {
    expect(PICTIONARY_CATEGORIES.length).toBeGreaterThanOrEqual(4);
    expect(PICTIONARY_WORDS.length).toBeGreaterThanOrEqual(60);
    PICTIONARY_WORDS.forEach((w) => {
      expect(w.word.length).toBeGreaterThan(1);
      expect(w.category).toBeDefined();
    });
  });

  it('bingo patterns contain standard, four corners, postage stamp, and blackout', () => {
    const patternIds = BINGO_PATTERNS.map((p) => p.id);
    expect(patternIds).toContain('line');
    expect(patternIds).toContain('four_corners');
    expect(patternIds).toContain('postage_stamp');
    expect(patternIds).toContain('blackout');
  });

  it('word clues puzzles have exactly 4 progressive clues each', () => {
    expect(WORD_CLUES.length).toBeGreaterThanOrEqual(25);
    WORD_CLUES.forEach((item) => {
      expect(item.word.length).toBeGreaterThan(1);
      expect(item.clues).toHaveLength(4);
      expect(item.category).toBeDefined();
    });
  });
});
