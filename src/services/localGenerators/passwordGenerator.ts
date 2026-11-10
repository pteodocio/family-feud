export interface PasswordItem {
  id: string;
  word: string;
  category: string;
  sampleClues: string[];
}

const PASSWORD_WORDS: PasswordItem[] = [
  // English
  { id: 'pw_1', word: 'ECLIPSE', category: 'Astronomy', sampleClues: ['Moon', 'Shadow', 'Solar'] },
  { id: 'pw_2', word: 'VOLCANO', category: 'Nature', sampleClues: ['Lava', 'Erupt', 'Magma'] },
  { id: 'pw_3', word: 'PUPPY', category: 'Animals', sampleClues: ['Dog', 'Bark', 'Pet'] },
  { id: 'pw_4', word: 'SUBMARINE', category: 'Vehicles', sampleClues: ['Underwater', 'Periscope', 'Naval'] },
  { id: 'pw_5', word: 'PYRAMID', category: 'History', sampleClues: ['Egypt', 'Pharaoh', 'Tomb'] },
  { id: 'pw_6', word: 'GIRAFFE', category: 'Animals', sampleClues: ['Neck', 'Tall', 'Safari'] },
  { id: 'pw_7', word: 'AVALANCHE', category: 'Nature', sampleClues: ['Snow', 'Slide', 'Mountain'] },
  { id: 'pw_8', word: 'DIAMOND', category: 'Valuables', sampleClues: ['Gem', 'Ring', 'Sparkle'] },
  { id: 'pw_9', word: 'CHEF', category: 'Professions', sampleClues: ['Cook', 'Kitchen', 'Recipe'] },
  { id: 'pw_10', word: 'TELESCOPE', category: 'Science', sampleClues: ['Stars', 'Lens', 'Galaxy'] },
  { id: 'pw_11', word: 'POPCORN', category: 'Food', sampleClues: ['Cinema', 'Butter', 'Kernel'] },
  { id: 'pw_12', word: 'COMPASS', category: 'Navigation', sampleClues: ['North', 'Needle', 'Direction'] },
  { id: 'pw_13', word: 'WATERFALL', category: 'Nature', sampleClues: ['Cascade', 'River', 'Drop'] },
  { id: 'pw_14', word: 'TORNADO', category: 'Weather', sampleClues: ['Twister', 'Wind', 'Funnel'] },
  { id: 'pw_15', word: 'GUITAR', category: 'Music', sampleClues: ['Strings', 'Strum', 'Acoustic'] },
  // Filipino / Taglish
  { id: 'pw_16', word: 'JEEPNEY', category: 'Pinoy Culture', sampleClues: ['Biyahe', 'Tsuper', 'Sakay'] },
  { id: 'pw_17', word: 'HALO-HALO', category: 'Pinoy Food', sampleClues: ['Yelo', 'Leche Flan', 'Ube'] },
  { id: 'pw_18', word: 'SINIGANG', category: 'Pinoy Food', sampleClues: ['Asim', 'Sampaloc', 'Sabaw'] },
  { id: 'pw_19', word: 'BALUT', category: 'Pinoy Food', sampleClues: ['Sisiw', 'Itlog', 'Chicharon'] },
  { id: 'pw_20', word: 'TRICYCLE', category: 'Pinoy Culture', sampleClues: ['Toda', 'Sidecar', 'Pasada'] },
  { id: 'pw_21', word: 'FIESTA', category: 'Pinoy Culture', sampleClues: ['Handaan', 'Banderitas', 'Lechon'] },
  { id: 'pw_22', word: 'KARAOKE', category: 'Entertainment', sampleClues: ['Mic', 'Kanta', 'Score'] },
  { id: 'pw_23', word: 'SARI-SARI', category: 'Pinoy Culture', sampleClues: ['Tindahan', 'Tingi', 'Utang'] },
  { id: 'pw_24', word: 'BARONG', category: 'Clothing', sampleClues: ['Pinya', 'Kasal', 'Pormal'] },
  { id: 'pw_25', word: 'PALENGKE', category: 'Places', sampleClues: ['Tawad', 'Isda', 'Bagsakan'] },
];

export async function generateProceduralPassword(options: {
  count?: number;
  category?: string;
  language?: 'en' | 'fil';
}): Promise<PasswordItem[]> {
  const count = options.count || 5;
  let pool = [...PASSWORD_WORDS];

  if (options.category && options.category !== 'All') {
    pool = pool.filter((p) => p.category.toLowerCase().includes(options.category!.toLowerCase()));
    if (pool.length === 0) pool = [...PASSWORD_WORDS];
  }

  // Shuffle
  const shuffled = pool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
