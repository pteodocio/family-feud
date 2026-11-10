export interface BingoPattern {
  id: string;
  name: string;
  description: string;
}

export const BINGO_PATTERNS: BingoPattern[] = [
  {
    id: 'line',
    name: 'Standard Line',
    description: 'Any complete horizontal, vertical, or diagonal 5-in-a-row line.',
  },
  {
    id: 'four_corners',
    name: 'Four Corners',
    description: 'Mark the 4 extreme corner squares of the 5x5 card.',
  },
  {
    id: 'postage_stamp',
    name: 'Postage Stamp',
    description: 'Mark any 2x2 cluster of 4 squares in any corner.',
  },
  {
    id: 'blackout',
    name: 'Blackout / Full Card',
    description: 'Mark every single number on the entire 5x5 card.',
  },
];

export interface BingoCard {
  id: string;
  playerName: string;
  grid: number[][]; // 5 rows x 5 cols, center (2,2) = 0 for FREE
  marked: boolean[][]; // 5 rows x 5 cols, (2,2) initialized to true
}

/**
 * Returns the column letter for a given number (1-75)
 */
export function getBingoLetter(num: number): 'B' | 'I' | 'N' | 'G' | 'O' {
  if (num <= 15) return 'B';
  if (num <= 30) return 'I';
  if (num <= 45) return 'N';
  if (num <= 60) return 'G';
  return 'O';
}

/**
 * Generates a random valid 5x5 Bingo Card with a FREE center square.
 */
export function generateBingoCard(id: string, playerName: string = 'Player'): BingoCard {
  const getColNumbers = (min: number, max: number, count: number): number[] => {
    const pool = Array.from({ length: max - min + 1 }, (_, i) => min + i);
    const shuffled = pool.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  const bCol = getColNumbers(1, 15, 5);
  const iCol = getColNumbers(16, 30, 5);
  const nCol = getColNumbers(31, 45, 5);
  const gCol = getColNumbers(46, 60, 5);
  const oCol = getColNumbers(61, 75, 5);

  const grid: number[][] = [];
  const marked: boolean[][] = [];

  for (let r = 0; r < 5; r++) {
    const row = [bCol[r], iCol[r], nCol[r], gCol[r], oCol[r]];
    const markedRow = [false, false, false, false, false];
    if (r === 2) {
      row[2] = 0; // FREE space
      markedRow[2] = true;
    }
    grid.push(row);
    marked.push(markedRow);
  }

  return { id, playerName, grid, marked };
}

/**
 * Checks whether a card satisfies the given pattern against marked numbers.
 */
export function checkBingoWin(card: BingoCard, patternId: string): boolean {
  const m = card.marked;

  if (patternId === 'blackout') {
    return m.every((row) => row.every((cell) => cell));
  }

  if (patternId === 'four_corners') {
    return m[0][0] && m[0][4] && m[4][0] && m[4][4];
  }

  if (patternId === 'postage_stamp') {
    // Check top-left, top-right, bottom-left, bottom-right 2x2
    const tl = m[0][0] && m[0][1] && m[1][0] && m[1][1];
    const tr = m[0][3] && m[0][4] && m[1][3] && m[1][4];
    const bl = m[3][0] && m[3][1] && m[4][0] && m[4][1];
    const br = m[3][3] && m[3][4] && m[4][3] && m[4][4];
    return tl || tr || bl || br;
  }

  // Standard line (horizontal, vertical, diagonal)
  // Check rows
  for (let r = 0; r < 5; r++) {
    if (m[r].every((cell) => cell)) return true;
  }
  // Check columns
  for (let c = 0; c < 5; c++) {
    if (m.every((row) => row[c])) return true;
  }
  // Check diagonals
  const diag1 = m[0][0] && m[1][1] && m[2][2] && m[3][3] && m[4][4];
  const diag2 = m[0][4] && m[1][3] && m[2][2] && m[3][1] && m[4][0];

  return diag1 || diag2;
}
