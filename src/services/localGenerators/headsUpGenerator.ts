export interface HeadsUpCard {
  id: string;
  item: string;
  category: string;
}

const HEADS_UP_DECK: HeadsUpCard[] = [
  // Blockbusters & Celebrities
  { id: 'hu_1', item: 'Harry Potter', category: 'Movies & Characters' },
  { id: 'hu_2', item: 'Spider-Man', category: 'Movies & Characters' },
  { id: 'hu_3', item: 'Taylor Swift', category: 'Celebrities' },
  { id: 'hu_4', item: 'Mickey Mouse', category: 'Movies & Characters' },
  { id: 'hu_5', item: 'Darth Vader', category: 'Movies & Characters' },
  { id: 'hu_6', item: 'Beyonce', category: 'Celebrities' },
  { id: 'hu_7', item: 'Barbie', category: 'Movies & Characters' },
  { id: 'hu_8', item: 'The Rock', category: 'Celebrities' },
  // Act It Out & Animals
  { id: 'hu_9', item: 'Penguin', category: 'Animals' },
  { id: 'hu_10', item: 'Kangaroo', category: 'Animals' },
  { id: 'hu_11', item: 'Surfing', category: 'Actions' },
  { id: 'hu_12', item: 'Brushing Teeth', category: 'Actions' },
  { id: 'hu_13', item: 'Walking a Tightrope', category: 'Actions' },
  { id: 'hu_14', item: 'Moonwalking', category: 'Actions' },
  // Pinoy Icons & Celebrities
  { id: 'hu_15', item: 'Manny Pacquiao', category: 'Pinoy Celebrities' },
  { id: 'hu_16', item: 'Catriona Gray', category: 'Pinoy Celebrities' },
  { id: 'hu_17', item: 'Darna', category: 'Pinoy Characters' },
  { id: 'hu_18', item: 'Kapre', category: 'Pinoy Folklore' },
  { id: 'hu_19', item: 'Vice Ganda', category: 'Pinoy Celebrities' },
  { id: 'hu_20', item: 'Coco Martin', category: 'Pinoy Celebrities' },
  { id: 'hu_21', item: 'Tahô Vendor', category: 'Pinoy Daily' },
  { id: 'hu_22', item: 'Jollibee', category: 'Pinoy Icons' },
  { id: 'hu_23', item: 'Sarah Geronimo', category: 'Pinoy Celebrities' },
  { id: 'hu_24', item: 'Tikbalang', category: 'Pinoy Folklore' },
];

export async function generateProceduralHeadsUp(options: {
  count?: number;
  category?: string;
}): Promise<HeadsUpCard[]> {
  const count = options.count || 6;
  let pool = [...HEADS_UP_DECK];

  if (options.category && options.category !== 'All') {
    pool = pool.filter((c) => c.category.toLowerCase().includes(options.category!.toLowerCase()));
    if (pool.length === 0) pool = [...HEADS_UP_DECK];
  }

  const shuffled = pool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
