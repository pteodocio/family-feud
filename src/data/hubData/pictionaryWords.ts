export interface PictionaryWord {
  id: string;
  word: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const PICTIONARY_CATEGORIES = [
  'Everyday Objects',
  'Animals',
  'Food & Drinks',
  'Places & Nature',
  'Actions & Sports',
] as const;

export const PICTIONARY_WORDS: PictionaryWord[] = [
  // Everyday Objects
  { id: 'pic_1', word: 'Coffee Cup', category: 'Everyday Objects', difficulty: 'easy' },
  { id: 'pic_2', word: 'Eyeglasses', category: 'Everyday Objects', difficulty: 'easy' },
  { id: 'pic_3', word: 'Key', category: 'Everyday Objects', difficulty: 'easy' },
  { id: 'pic_4', word: 'Laptop', category: 'Everyday Objects', difficulty: 'easy' },
  { id: 'pic_5', word: 'Toothbrush', category: 'Everyday Objects', difficulty: 'easy' },
  { id: 'pic_6', word: 'Backpack', category: 'Everyday Objects', difficulty: 'medium' },
  { id: 'pic_7', word: 'Headphones', category: 'Everyday Objects', difficulty: 'medium' },
  { id: 'pic_8', word: 'Alarm Clock', category: 'Everyday Objects', difficulty: 'medium' },
  { id: 'pic_9', word: 'Flashlight', category: 'Everyday Objects', difficulty: 'medium' },
  { id: 'pic_10', word: 'Toaster', category: 'Everyday Objects', difficulty: 'medium' },
  { id: 'pic_11', word: 'Ceiling Fan', category: 'Everyday Objects', difficulty: 'hard' },
  { id: 'pic_12', word: 'Grandfather Clock', category: 'Everyday Objects', difficulty: 'hard' },
  { id: 'pic_13', word: 'Microscope', category: 'Everyday Objects', difficulty: 'hard' },
  { id: 'pic_14', word: 'Lawnmower', category: 'Everyday Objects', difficulty: 'hard' },

  // Animals
  { id: 'pic_15', word: 'Dog', category: 'Animals', difficulty: 'easy' },
  { id: 'pic_16', word: 'Cat', category: 'Animals', difficulty: 'easy' },
  { id: 'pic_17', word: 'Fish', category: 'Animals', difficulty: 'easy' },
  { id: 'pic_18', word: 'Snake', category: 'Animals', difficulty: 'easy' },
  { id: 'pic_19', word: 'Bird', category: 'Animals', difficulty: 'easy' },
  { id: 'pic_20', word: 'Turtle', category: 'Animals', difficulty: 'medium' },
  { id: 'pic_21', word: 'Giraffe', category: 'Animals', difficulty: 'medium' },
  { id: 'pic_22', word: 'Dolphin', category: 'Animals', difficulty: 'medium' },
  { id: 'pic_23', word: 'Penguin', category: 'Animals', difficulty: 'medium' },
  { id: 'pic_24', word: 'Lion', category: 'Animals', difficulty: 'medium' },
  { id: 'pic_25', word: 'Chameleon', category: 'Animals', difficulty: 'hard' },
  { id: 'pic_26', word: 'Platypus', category: 'Animals', difficulty: 'hard' },
  { id: 'pic_27', word: 'Jellyfish', category: 'Animals', difficulty: 'hard' },

  // Food & Drinks
  { id: 'pic_28', word: 'Pizza', category: 'Food & Drinks', difficulty: 'easy' },
  { id: 'pic_29', word: 'Banana', category: 'Food & Drinks', difficulty: 'easy' },
  { id: 'pic_30', word: 'Ice Cream Cone', category: 'Food & Drinks', difficulty: 'easy' },
  { id: 'pic_31', word: 'Hamburger', category: 'Food & Drinks', difficulty: 'easy' },
  { id: 'pic_32', word: 'French Fries', category: 'Food & Drinks', difficulty: 'easy' },
  { id: 'pic_33', word: 'Birthday Cake', category: 'Food & Drinks', difficulty: 'medium' },
  { id: 'pic_34', word: 'Taco', category: 'Food & Drinks', difficulty: 'medium' },
  { id: 'pic_35', word: 'Sushi Roll', category: 'Food & Drinks', difficulty: 'medium' },
  { id: 'pic_36', word: 'Watermelon Slice', category: 'Food & Drinks', difficulty: 'medium' },
  { id: 'pic_37', word: 'Donut', category: 'Food & Drinks', difficulty: 'medium' },
  { id: 'pic_38', word: 'Spaghetti with Meatballs', category: 'Food & Drinks', difficulty: 'hard' },
  { id: 'pic_39', word: 'Pancake Stack', category: 'Food & Drinks', difficulty: 'hard' },
  { id: 'pic_40', word: 'Pineapple', category: 'Food & Drinks', difficulty: 'hard' },

  // Places & Nature
  { id: 'pic_41', word: 'Sun and Clouds', category: 'Places & Nature', difficulty: 'easy' },
  { id: 'pic_42', word: 'Mountain', category: 'Places & Nature', difficulty: 'easy' },
  { id: 'pic_43', word: 'Tree', category: 'Places & Nature', difficulty: 'easy' },
  { id: 'pic_44', word: 'House', category: 'Places & Nature', difficulty: 'easy' },
  { id: 'pic_45', word: 'Campfire', category: 'Places & Nature', difficulty: 'medium' },
  { id: 'pic_46', word: 'Waterfall', category: 'Places & Nature', difficulty: 'medium' },
  { id: 'pic_47', word: 'Desert with Cactus', category: 'Places & Nature', difficulty: 'medium' },
  { id: 'pic_48', word: 'Lighthouse', category: 'Places & Nature', difficulty: 'medium' },
  { id: 'pic_49', word: 'Castle', category: 'Places & Nature', difficulty: 'hard' },
  { id: 'pic_50', word: 'Space Station', category: 'Places & Nature', difficulty: 'hard' },
  { id: 'pic_51', word: 'Volcano', category: 'Places & Nature', difficulty: 'hard' },

  // Actions & Sports
  { id: 'pic_52', word: 'Running', category: 'Actions & Sports', difficulty: 'easy' },
  { id: 'pic_53', word: 'Sleeping', category: 'Actions & Sports', difficulty: 'easy' },
  { id: 'pic_54', word: 'Swimming', category: 'Actions & Sports', difficulty: 'easy' },
  { id: 'pic_55', word: 'Dancing', category: 'Actions & Sports', difficulty: 'medium' },
  { id: 'pic_56', word: 'Playing Basketball', category: 'Actions & Sports', difficulty: 'medium' },
  { id: 'pic_57', word: 'Fishing', category: 'Actions & Sports', difficulty: 'medium' },
  { id: 'pic_58', word: 'Skateboarding', category: 'Actions & Sports', difficulty: 'medium' },
  { id: 'pic_59', word: 'Juggling', category: 'Actions & Sports', difficulty: 'hard' },
  { id: 'pic_60', word: 'Skydiving', category: 'Actions & Sports', difficulty: 'hard' },
  { id: 'pic_61', word: 'Baking a Pie', category: 'Actions & Sports', difficulty: 'hard' },
  { id: 'pic_62', word: 'Surfing a Wave', category: 'Actions & Sports', difficulty: 'hard' },
];
