export interface ScattergoriesRound {
  letter: string;
  categories: string[];
}

const PLAYABLE_LETTERS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
  'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'W',
];

const CATEGORY_POOLS = [
  // General & Fun
  'Things in a Supermarket',
  'Animals',
  'Things You See in School',
  'Countries or Cities',
  'Foods or Snacks',
  'Movie Titles',
  'Things in the Kitchen',
  'Hobbies or Sports',
  'Professions or Jobs',
  'Things You Plug In',
  'Items in a Bedroom',
  'Celebrities',
  'Things in a Park',
  'Things That Are Red',
  // Pinoy Culture
  'Things in a Sari-Sari Store',
  'Filipino Dishes or Ulam',
  'Things Seen During Fiesta',
  'Philippine Provinces or Towns',
  'Things You Ride in Traffic',
  'Items Found in Lola’s House',
  'Pinoy Merienda Treats',
  'Reasons for Being Late',
];

export async function generateProceduralScattergories(options?: {
  letter?: string;
  categoryCount?: number;
}): Promise<ScattergoriesRound> {
  const letter =
    options?.letter ||
    PLAYABLE_LETTERS[Math.floor(Math.random() * PLAYABLE_LETTERS.length)];

  const count = options?.categoryCount || 8;
  const shuffledCats = [...CATEGORY_POOLS].sort(() => Math.random() - 0.5);

  return {
    letter,
    categories: shuffledCats.slice(0, count),
  };
}
