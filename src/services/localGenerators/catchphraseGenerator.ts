export interface CatchphraseItem {
  id: string;
  phrase: string;
  category: string;
}

const CATCHPHRASE_ITEMS: CatchphraseItem[] = [
  // Everyday Idioms & Pop Culture
  { id: 'cp_1', phrase: 'Piece of Cake', category: 'Sayings' },
  { id: 'cp_2', phrase: 'Break a Leg', category: 'Sayings' },
  { id: 'cp_3', phrase: 'Under the Weather', category: 'Sayings' },
  { id: 'cp_4', phrase: 'Bite the Bullet', category: 'Sayings' },
  { id: 'cp_5', phrase: 'Spill the Beans', category: 'Sayings' },
  { id: 'cp_6', phrase: 'Barking Up the Wrong Tree', category: 'Sayings' },
  { id: 'cp_7', phrase: 'Netflix and Chill', category: 'Pop Culture' },
  { id: 'cp_8', phrase: 'Morning Person', category: 'Everyday Life' },
  { id: 'cp_9', phrase: 'Brainstorming Session', category: 'Work Life' },
  { id: 'cp_10', phrase: 'Road Trip Playlist', category: 'Travel' },
  { id: 'cp_11', phrase: 'Midnight Snack', category: 'Food' },
  { id: 'cp_12', phrase: 'Couch Potato', category: 'Everyday Life' },
  { id: 'cp_13', phrase: 'Fast and Furious', category: 'Movies' },
  { id: 'cp_14', phrase: 'Game of Thrones', category: 'TV' },
  { id: 'cp_15', phrase: 'Social Media Influencer', category: 'Digital' },
  // Pinoy Phrases & Idioms
  { id: 'cp_16', phrase: 'Bukas Makalawa', category: 'Pinoy Sayings' },
  { id: 'cp_17', phrase: 'Picture Muna Bago Kain', category: 'Pinoy Culture' },
  { id: 'cp_18', phrase: 'Bahala na si Batman', category: 'Pinoy Sayings' },
  { id: 'cp_19', phrase: 'Sana All', category: 'Pinoy Pop' },
  { id: 'cp_20', phrase: 'Petsa de Peligro', category: 'Pinoy Work' },
  { id: 'cp_21', phrase: 'Balat Sibuyas', category: 'Pinoy Sayings' },
  { id: 'cp_22', phrase: 'Walang Tulugan', category: 'Pinoy TV' },
  { id: 'cp_23', phrase: 'Huling Hirit sa Tag-init', category: 'Pinoy Pop' },
  { id: 'cp_24', phrase: 'May Pulis sa Ilalim ng Tulay', category: 'Pinoy Sayings' },
  { id: 'cp_25', phrase: 'Para Po sa Tabi', category: 'Pinoy Daily' },
];

export async function generateProceduralCatchphrase(options: {
  count?: number;
  category?: string;
  language?: 'en' | 'fil';
}): Promise<CatchphraseItem[]> {
  const count = options.count || 5;
  let pool = [...CATCHPHRASE_ITEMS];

  if (options.category && options.category !== 'All') {
    pool = pool.filter((c) => c.category.toLowerCase().includes(options.category!.toLowerCase()));
    if (pool.length === 0) pool = [...CATCHPHRASE_ITEMS];
  }

  const shuffled = pool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
