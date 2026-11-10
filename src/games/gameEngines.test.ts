import { describe, it, expect } from 'vitest';
import { GAMES_CATALOG, getGameById } from './registry';
import { generateBingoCard, checkBingoWin } from '../data/hubData/bingoPatterns';

describe('Modular Game Engines & Registry', () => {
  it('registry has all 6 games registered with required metadata', () => {
    expect(GAMES_CATALOG).toHaveLength(6);
    const ids = GAMES_CATALOG.map((g) => g.id);
    expect(ids).toContain('family-feud');
    expect(ids).toContain('family-trivia');
    expect(ids).toContain('charades');
    expect(ids).toContain('pictionary');
    expect(ids).toContain('family-bingo');
    expect(ids).toContain('guess-the-word');

    GAMES_CATALOG.forEach((g) => {
      expect(g.name).toBeDefined();
      expect(g.tagline).toBeDefined();
      expect(g.description).toBeDefined();
      expect(g.isAvailable).toBe(true);
      expect(g.rules.length).toBeGreaterThanOrEqual(3);
    });
  });

  it('getGameById retrieves the correct game definition', () => {
    const feud = getGameById('family-feud');
    expect(feud?.name).toBe('Family Feud');
    const trivia = getGameById('family-trivia');
    expect(trivia?.name).toBe('Family Trivia');
  });

  it('bingo engine generates cards with 5x5 grid and center FREE space', () => {
    const card = generateBingoCard('test_card_1', 'Tito Boy');
    expect(card.grid).toHaveLength(5);
    expect(card.grid[0]).toHaveLength(5);
    expect(card.grid[2][2]).toBe(0); // FREE space
    expect(card.marked[2][2]).toBe(true); // Marked by default
  });

  it('bingo engine detects horizontal line win', () => {
    const card = generateBingoCard('c2', 'Tita Baby');
    // Mark first row
    card.marked[0] = [true, true, true, true, true];
    expect(checkBingoWin(card, 'line')).toBe(true);
  });

  it('bingo engine detects four corners win', () => {
    const card = generateBingoCard('c3', 'Kuya Jun');
    card.marked[0][0] = true;
    card.marked[0][4] = true;
    card.marked[4][0] = true;
    card.marked[4][4] = true;
    expect(checkBingoWin(card, 'four_corners')).toBe(true);
  });
});
