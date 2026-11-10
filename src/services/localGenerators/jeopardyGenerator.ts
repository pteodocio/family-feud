export interface JeopardyQuestion {
  id: string;
  value: number;
  clue: string;
  answer: string;
  isDailyDouble?: boolean;
}

export interface JeopardyCategory {
  id: string;
  name: string;
  questions: JeopardyQuestion[];
}

export interface JeopardyBoard {
  id: string;
  title: string;
  categories: JeopardyCategory[];
  finalJeopardy: {
    category: string;
    clue: string;
    answer: string;
  };
}

const CATEGORY_BANK: JeopardyCategory[] = [
  {
    id: 'cat_ph_history',
    name: 'Philippine History',
    questions: [
      { id: 'jh_1', value: 100, clue: 'The national hero executed at Bagumbayan in 1896', answer: 'Jose Rizal' },
      { id: 'jh_2', value: 200, clue: 'The Portuguese explorer who arrived in Cebu in 1521', answer: 'Ferdinand Magellan' },
      { id: 'jh_3', value: 300, clue: 'The 1898 declaration of Philippine Independence happened in this Cavite town', answer: 'Kawit' },
      { id: 'jh_4', value: 400, clue: 'First President of the Commonwealth of the Philippines', answer: 'Manuel L. Quezon' },
      { id: 'jh_5', value: 500, clue: 'The secret society founded by Andres Bonifacio in 1892', answer: 'Katipunan (KKK)' },
    ],
  },
  {
    id: 'cat_world_geo',
    name: 'World Geography',
    questions: [
      { id: 'jg_1', value: 100, clue: 'Capital city of France, known as the City of Light', answer: 'Paris' },
      { id: 'jg_2', value: 200, clue: 'The longest river in South America', answer: 'Amazon River' },
      { id: 'jg_3', value: 300, clue: 'Country with the largest land area on Earth', answer: 'Russia' },
      { id: 'jg_4', value: 400, clue: 'The highest mountain peak in Africa', answer: 'Mount Kilimanjaro' },
      { id: 'jg_5', value: 500, clue: 'Capital city of Australia (not Sydney)', answer: 'Canberra' },
    ],
  },
  {
    id: 'cat_science',
    name: 'Science & Nature',
    questions: [
      { id: 'js_1', value: 100, clue: 'Chemical symbol for gold on the periodic table', answer: 'Au' },
      { id: 'js_2', value: 200, clue: 'The closest planet to the Sun in our Solar System', answer: 'Mercury' },
      { id: 'js_3', value: 300, clue: 'The powerhouse organelle of the biological cell', answer: 'Mitochondria' },
      { id: 'js_4', value: 400, clue: 'The speed of light in a vacuum in kilometers per second (approx)', answer: '300,000 km/s' },
      { id: 'js_5', value: 500, clue: 'The most abundant gas in Earth’s atmosphere', answer: 'Nitrogen' },
    ],
  },
  {
    id: 'cat_pop_culture',
    name: 'Pop Culture & Movies',
    questions: [
      { id: 'jp_1', value: 100, clue: 'The superhero who carries a vibranium shield', answer: 'Captain America' },
      { id: 'jp_2', value: 200, clue: 'The highest-grossing film of all time directed by James Cameron', answer: 'Avatar' },
      { id: 'jp_3', value: 300, clue: 'Platform created by Mark Zuckerberg in 2004 at Harvard', answer: 'Facebook' },
      { id: 'jp_4', value: 400, clue: 'Pop star known as the Queen of Pop who sang "Like a Virgin"', answer: 'Madonna' },
      { id: 'jp_5', value: 500, clue: 'The fictional African nation ruled by King T’Challa', answer: 'Wakanda' },
    ],
  },
  {
    id: 'cat_pinoy_food',
    name: 'Pinoy Kitchen',
    questions: [
      { id: 'jf_1', value: 100, clue: 'Traditional soup dish known for its sour tamarind broth', answer: 'Sinigang' },
      { id: 'jf_2', value: 200, clue: 'Marinated meat dish braised in soy sauce, vinegar, and garlic', answer: 'Adobo' },
      { id: 'jf_3', value: 300, clue: 'Whole roasted pig often served at grand fiestas and holidays', answer: 'Lechon' },
      { id: 'jf_4', value: 400, clue: 'Pampanga’s famous sizzling dish made from pig’s head and liver', answer: 'Sisig' },
      { id: 'jf_5', value: 500, clue: 'Peanut stew traditionally cooked with oxtail and served with bagoong', answer: 'Kare-Kare' },
    ],
  },
];

export async function generateProceduralJeopardy(): Promise<JeopardyBoard> {
  // Deep clone to avoid mutating bank
  const categories: JeopardyCategory[] = JSON.parse(JSON.stringify(CATEGORY_BANK.slice(0, 5)));

  // Pick one random question to be the Daily Double
  const randomCatIdx = Math.floor(Math.random() * categories.length);
  const randomQIdx = Math.floor(Math.random() * 5);
  categories[randomCatIdx].questions[randomQIdx].isDailyDouble = true;

  return {
    id: `jeopardy_${Date.now()}`,
    title: 'Family Game Hub Jeopardy Championship',
    categories,
    finalJeopardy: {
      category: 'World Landmarks',
      clue: 'Built during the Mughal Empire in Agra as a white marble mausoleum for Mumtaz Mahal',
      answer: 'The Taj Mahal',
    },
  };
}
