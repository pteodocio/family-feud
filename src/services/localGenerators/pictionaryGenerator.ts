import type { PictionaryWord } from '../../data/hubData/pictionaryWords';
import { getRecentContentHashes } from '../contentHistory';

export interface PictionaryGenOptions {
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'all';
  count: number;
  language?: 'en' | 'fil';
  avoidRecent?: boolean;
}

// -------------------------------------------------------------
// DRAWABLE OBJECTS & COMPOUND SCENE BASES
// -------------------------------------------------------------

const EASY_PROMPTS_EN: Array<{ word: string; category: string }> = [
  { word: 'Coffee Mug with Steam', category: 'Everyday Objects' },
  { word: 'Eyeglasses on a Book', category: 'Everyday Objects' },
  { word: 'Pair of Scissors', category: 'Everyday Objects' },
  { word: 'Wristwatch', category: 'Everyday Objects' },
  { word: 'Flashlight Beam', category: 'Everyday Objects' },
  { word: 'Guitar with Six Strings', category: 'Everyday Objects' },
  { word: 'Toothbrush and Toothpaste', category: 'Everyday Objects' },
  { word: 'Umbrella in the Rain', category: 'Everyday Objects' },
  { word: 'Backpack with Zipper', category: 'Everyday Objects' },
  { word: 'Bicycle with Bell', category: 'Everyday Objects' },
  { word: 'Sunflower in a Pot', category: 'Places & Nature' },
  { word: 'Cactus with Spikes', category: 'Places & Nature' },
  { word: 'Campfire with Logs', category: 'Places & Nature' },
  { word: 'Snowman with Carrot Nose', category: 'Places & Nature' },
  { word: 'Hot Air Balloon', category: 'Places & Nature' },
  { word: 'Slice of Pepperoni Pizza', category: 'Food & Drinks' },
  { word: 'Ice Cream Cone with Cherry', category: 'Food & Drinks' },
  { word: 'Hamburger with Cheese', category: 'Food & Drinks' },
  { word: 'Donut with Sprinkles', category: 'Food & Drinks' },
  { word: 'Watermelon Slice', category: 'Food & Drinks' },
  { word: 'Penguin on an Iceberg', category: 'Animals & Creatures' },
  { word: 'Sea Turtle Swimming', category: 'Animals & Creatures' },
  { word: 'Giraffe with Long Neck', category: 'Animals & Creatures' },
  { word: 'Elephant Spouting Water', category: 'Animals & Creatures' },
  { word: 'Friendly Dolphin', category: 'Animals & Creatures' },
];

const MEDIUM_PROMPTS_EN: Array<{ word: string; category: string }> = [
  { word: 'Cat sleeping on a Laptop Keyboard', category: 'Fun Compound Prompts' },
  { word: 'Tent pitched under a Crescent Moon', category: 'Places & Nature' },
  { word: 'Chef flipping a Pancake in mid-air', category: 'Actions & Sports' },
  { word: 'Bird nesting inside a Mailbox', category: 'Animals & Creatures' },
  { word: 'Dog chasing its own Tail', category: 'Animals & Creatures' },
  { word: 'Sailboat gliding past a Lighthouse', category: 'Places & Nature' },
  { word: 'Basketball swooshing through a Hoop', category: 'Actions & Sports' },
  { word: 'Frog sitting on a Lily Pad wearing a Crown', category: 'Fun Compound Prompts' },
  { word: 'Birthday Cake with Sparkler Candles', category: 'Food & Drinks' },
  { word: 'Surfer riding inside a Wave Barrel', category: 'Actions & Sports' },
  { word: 'Robot drinking Motor Oil from a cup', category: 'Fun Compound Prompts' },
  { word: 'Submarine shining lights on an Octopus', category: 'Animals & Creatures' },
  { word: 'Jeepney caught in Manila Traffic', category: 'Places & Nature' },
  { word: 'Telescope pointing at Saturn Rings', category: 'Everyday Objects' },
  { word: 'Treasure Chest overflowing with Gold Coins', category: 'Everyday Objects' },
];

const HARD_PROMPTS_EN: Array<{ word: string; category: string }> = [
  { word: 'Astronaut playing Golf on the Moon surface', category: 'Fun Compound Prompts' },
  { word: 'Treehouse connected by a Rope Bridge with a Tire Swing', category: 'Places & Nature' },
  { word: 'Pirate Ship sailing through a Thunderstorm with Lightning', category: 'Places & Nature' },
  { word: 'Mad Scientist pouring bubbling green potion into a beaker', category: 'Actions & Sports' },
  { word: 'Amusement Park Roller Coaster doing a loop-the-loop', category: 'Places & Nature' },
  { word: 'Firefighter rescuing a Cat stuck in a tall pine tree', category: 'Actions & Sports' },
  { word: 'Scuba diver photographing a Sunken Pirate Shipwreck', category: 'Places & Nature' },
  { word: 'Medieval Knight battling a fire-breathing Dragon on a castle', category: 'Fun Compound Prompts' },
  { word: 'Street Vendor grilling BBQ skewers with smoke rising over cart', category: 'Food & Drinks' },
  { word: 'Orchestra Conductor waving baton in front of violinists', category: 'Actions & Sports' },
];

// Filipino / Taglish relatable drawable items
const FILIPINO_PROMPTS: Array<{ word: string; category: string; diff: 'easy' | 'medium' | 'hard' }> = [
  { word: 'Sorbetes (Dirty Ice Cream) Cart with Colorful Bells', category: 'Food & Drinks', diff: 'easy' },
  { word: 'Halo-Halo with Leche Flan and Ube on top', category: 'Food & Drinks', diff: 'easy' },
  { word: 'Tsinelas flying across the living room', category: 'Everyday Objects', diff: 'easy' },
  { word: 'Tricycle with passengers inside the sidecar', category: 'Places & Nature', diff: 'medium' },
  { word: 'Taho vendor carrying two aluminum buckets on a bamboo pole', category: 'Food & Drinks', diff: 'medium' },
  { word: 'Parol (Christmas Star Lantern) glowing with lights', category: 'Everyday Objects', diff: 'medium' },
  { word: 'Bahay Kubo with banana trees and a carabao outside', category: 'Places & Nature', diff: 'medium' },
  { word: 'Boodle Fight spread on fresh green banana leaves', category: 'Food & Drinks', diff: 'hard' },
  { word: 'Mayon Volcano with perfect cone shape and smoke puffs', category: 'Places & Nature', diff: 'medium' },
  { word: 'Roasted Lechon on a bamboo spit over glowing charcoal', category: 'Food & Drinks', diff: 'hard' },
];

// Combinator matrices for procedural generation
const SUBJECTS = ['A penguin', 'A monkey', 'A frog', 'A robot', 'A chef', 'A cat', 'A wizard', 'An alien', 'A squirrel', 'A bear'];
const ACTIVITIES = ['skateboarding down a ramp', 'eating a slice of pizza', 'flying a colorful kite', 'wearing huge sunglasses', 'holding an umbrella in a storm', 'sleeping inside a cardboard box', 'playing an acoustic guitar', 'painting a rainbow on a canvas', 'surfing on an ironing board', 'reading a map upside down'];

export async function generateProceduralPictionary(options: PictionaryGenOptions): Promise<PictionaryWord[]> {
  const targetCount = Math.max(1, Math.min(options.count || 10, 30));
  const lang = options.language || 'en';
  const categoryFilter = options.category && options.category !== 'All' ? options.category : null;
  const diffFilter = options.difficulty && options.difficulty !== 'all' ? options.difficulty : null;

  const recentHashes = options.avoidRecent !== false ? await getRecentContentHashes('pictionary') : new Set<string>();
  const generated: PictionaryWord[] = [];
  let attempts = 0;
  const maxAttempts = targetCount * 15;

  const pool = [
    ...EASY_PROMPTS_EN.map((p) => ({ ...p, diff: 'easy' as const })),
    ...MEDIUM_PROMPTS_EN.map((p) => ({ ...p, diff: 'medium' as const })),
    ...HARD_PROMPTS_EN.map((p) => ({ ...p, diff: 'hard' as const })),
    ...(lang === 'fil' ? FILIPINO_PROMPTS : []),
  ];

  while (generated.length < targetCount && attempts < maxAttempts) {
    attempts++;

    let word: string;
    let cat: string;
    let diff: 'easy' | 'medium' | 'hard';

    if (Math.random() > 0.35 && pool.length > 0) {
      const item = pool[Math.floor(Math.random() * pool.length)];
      word = item.word;
      cat = item.category;
      diff = item.diff;
    } else {
      // Dynamic compound generation
      const sub = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
      const act = ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)];
      word = `${sub} ${act}`;
      cat = 'Fun Compound Prompts';
      diff = Math.random() > 0.5 ? 'medium' : 'hard';
    }

    if (categoryFilter && cat !== categoryFilter && categoryFilter !== 'All') continue;
    if (diffFilter && diff !== diffFilter) continue;

    const hash = word.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (recentHashes.has(hash)) continue;
    if (generated.some((g) => g.word === word)) continue;

    generated.push({
      id: `gen_pic_${Date.now()}_${generated.length}`,
      word,
      category: cat,
      difficulty: diff,
    });
  }

  return generated;
}
