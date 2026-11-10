export interface TabooCard {
  id: string;
  target: string;
  category: string;
  tabooWords: string[];
}

const TABOO_CARDS: TabooCard[] = [
  {
    id: 'taboo_1',
    target: 'BEACH',
    category: 'Travel',
    tabooWords: ['Sand', 'Ocean', 'Water', 'Sun', 'Waves'],
  },
  {
    id: 'taboo_2',
    target: 'COFFEE',
    category: 'Food & Drink',
    tabooWords: ['Cup', 'Caffeine', 'Morning', 'Drink', 'Starbucks'],
  },
  {
    id: 'taboo_3',
    target: 'AIRPLANE',
    category: 'Travel',
    tabooWords: ['Fly', 'Sky', 'Airport', 'Wings', 'Pilot'],
  },
  {
    id: 'taboo_4',
    target: 'PIZZA',
    category: 'Food',
    tabooWords: ['Cheese', 'Crust', 'Slice', 'Italian', 'Delivery'],
  },
  {
    id: 'taboo_5',
    target: 'HOSPITAL',
    category: 'Places',
    tabooWords: ['Doctor', 'Nurse', 'Sick', 'Patient', 'Medicine'],
  },
  {
    id: 'taboo_6',
    target: 'BIRTHDAY',
    category: 'Celebration',
    tabooWords: ['Cake', 'Candles', 'Party', 'Age', 'Presents'],
  },
  {
    id: 'taboo_7',
    target: 'SMARTPHONE',
    category: 'Technology',
    tabooWords: ['Call', 'Screen', 'Apple', 'Android', 'App'],
  },
  {
    id: 'taboo_8',
    target: 'WEDDING',
    category: 'Celebration',
    tabooWords: ['Bride', 'Groom', 'Ring', 'Church', 'Marriage'],
  },
  // Filipino Themes
  {
    id: 'taboo_9',
    target: 'LECHON',
    category: 'Pinoy Food',
    tabooWords: ['Baboy', 'Crispy', 'Cebu', 'Balat', 'Piyesta'],
  },
  {
    id: 'taboo_10',
    target: 'JEEPNEY',
    category: 'Pinoy Culture',
    tabooWords: ['Barya', 'Tsuper', 'Sakay', 'Pasahero', 'Toda'],
  },
  {
    id: 'taboo_11',
    target: 'PALENGKE',
    category: 'Pinoy Places',
    tabooWords: ['Tawad', 'Isda', 'Gulay', 'Tinda', 'Amoy'],
  },
  {
    id: 'taboo_12',
    target: 'BALIKBAYAN BOX',
    category: 'Pinoy Culture',
    tabooWords: ['OFW', 'Padala', 'Kahon', 'Pasalubong', 'Duty Free'],
  },
  {
    id: 'taboo_13',
    target: 'SIMBANG GABI',
    category: 'Pinoy Holidays',
    tabooWords: ['Pasko', 'Bibingka', 'Puto Bumbong', 'Madaling Araw', 'Siyam'],
  },
  {
    id: 'taboo_14',
    target: 'KARAOKE',
    category: 'Pinoy Party',
    tabooWords: ['Kanta', 'Mic', 'My Way', 'Score', 'Birit'],
  },
];

export async function generateProceduralTaboo(options: {
  count?: number;
  category?: string;
  language?: 'en' | 'fil';
}): Promise<TabooCard[]> {
  const count = options.count || 4;
  let pool = [...TABOO_CARDS];

  if (options.category && options.category !== 'All') {
    pool = pool.filter((t) => t.category.toLowerCase().includes(options.category!.toLowerCase()));
    if (pool.length === 0) pool = [...TABOO_CARDS];
  }

  const shuffled = pool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
