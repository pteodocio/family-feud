export interface WordHuntResult {
  grid: string[][];
  isValidWordPath: (word: string) => boolean;
}

// Standard English 16-dice distribution for authentic letter probability
const BOGGLE_DICE = [
  'AAEEGN', 'ABBJOO', 'ACHOPS', 'AFFKPS',
  'AOOTTW', 'CIMOTU', 'DEILRX', 'DELRVY',
  'DISTTY', 'EEGHNW', 'EEINSU', 'EHRTVW',
  'EIOSST', 'ELRTTY', 'HIMNUQ', 'HLNNRZ',
];

export function checkWordPathOnGrid(word: string, grid: string[][]): boolean {
  const upper = word.toUpperCase().trim();
  if (upper.length < 3) return false;

  const rows = grid.length;
  const cols = grid[0].length;

  const visited: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));

  const dfs = (r: number, c: number, idx: number): boolean => {
    if (idx === upper.length) return true;
    if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
    if (visited[r][c] || grid[r][c] !== upper[idx]) return false;

    visited[r][c] = true;

    // 8 directional neighbors
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr !== 0 || dc !== 0) {
          if (dfs(r + dr, c + dc, idx + 1)) {
            visited[r][c] = false;
            return true;
          }
        }
      }
    }

    visited[r][c] = false;
    return false;
  };

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === upper[0]) {
        if (dfs(r, c, 0)) return true;
      }
    }
  }

  return false;
}

export async function generateProceduralWordHunt(): Promise<WordHuntResult> {
  const shuffledDice = [...BOGGLE_DICE].sort(() => Math.random() - 0.5);
  const grid: string[][] = [];

  let diceIdx = 0;
  for (let r = 0; r < 4; r++) {
    const row: string[] = [];
    for (let c = 0; c < 4; c++) {
      const die = shuffledDice[diceIdx++];
      const letter = die[Math.floor(Math.random() * die.length)];
      row.push(letter === 'Q' ? 'Qu' : letter);
    }
    grid.push(row);
  }

  // Format Qu if present to Q for 1-char matrix simplicity
  const cleanGrid = grid.map((row) => row.map((char) => char[0]));

  return {
    grid: cleanGrid,
    isValidWordPath: (word: string) => checkWordPathOnGrid(word, cleanGrid),
  };
}
