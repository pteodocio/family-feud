export interface WheelPuzzle {
  id: string;
  phrase: string;
  category: string;
}

const WHEEL_PUZZLES: WheelPuzzle[] = [
  // English & Pop Culture
  { id: 'wof_1', phrase: 'A ROLLING STONE GATHERS NO MOSS', category: 'Proverb' },
  { id: 'wof_2', phrase: 'BREAKING THE SOUND BARRIER', category: 'Phrase' },
  { id: 'wof_3', phrase: 'MAY THE FORCE BE WITH YOU', category: 'Movie Quote' },
  { id: 'wof_4', phrase: 'ROASTED MARSHMALLOWS BY THE CAMPFIRE', category: 'Fun & Games' },
  { id: 'wof_5', phrase: 'HOMEMADE CHOCOLATE CHIP COOKIES', category: 'Food & Drink' },
  { id: 'wof_6', phrase: 'WATCHING THE SUNSET ON THE BEACH', category: 'What Are You Doing?' },
  { id: 'wof_7', phrase: 'ELECTRIC GUITAR AND DRUM SOLO', category: 'Music' },
  { id: 'wof_8', phrase: 'FLYING FIRST CLASS TO TOKYO', category: 'Travel' },
  // Filipino Themes
  { id: 'wof_9', phrase: 'PICTURE MUNA BAGO KUMAIN', category: 'Pinoy Habit' },
  { id: 'wof_10', phrase: 'BAHALA NA ANG MAYKAPAL', category: 'Pinoy Saying' },
  { id: 'wof_11', phrase: 'PAGKAIN NG BALUT SA KANTO', category: 'Pinoy Food' },
  { id: 'wof_12', phrase: 'SAKIT SA ULO ANG TRAFFIC SA EDSA', category: 'Everyday Reality' },
  { id: 'wof_13', phrase: 'KARAOKE HANGGANG MADALING ARAW', category: 'Pinoy Celebration' },
  { id: 'wof_14', phrase: 'MASARAP NA HALO HALO SA TAG INIT', category: 'Pinoy Treats' },
  { id: 'wof_15', phrase: 'PASALUBONG MULA SA PROBINSYA', category: 'Family Life' },
];

export async function generateProceduralWheel(options: {
  count?: number;
  category?: string;
}): Promise<WheelPuzzle[]> {
  const count = options.count || 3;
  let pool = [...WHEEL_PUZZLES];

  if (options.category && options.category !== 'All') {
    pool = pool.filter((p) => p.category.toLowerCase().includes(options.category!.toLowerCase()));
    if (pool.length === 0) pool = [...WHEEL_PUZZLES];
  }

  const shuffled = pool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
