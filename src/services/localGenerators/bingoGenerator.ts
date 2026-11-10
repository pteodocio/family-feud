export interface GeneratedBingoCard {
  id: string;
  playerName: string;
  type: 'classic_numbers' | 'themed_words';
  themeName: string;
  grid: Array<Array<{ text: string; isFree: boolean; isMarked: boolean }>>;
}

export const BINGO_THEMES = [
  'Classic 75-Ball Numbers',
  'Filipino Family Reunion',
  'Holiday & Christmas Fiesta',
  'Pinoy Everyday Life',
  'Road Trip & Vacation',
  'Pop Culture & Movies',
] as const;

// -------------------------------------------------------------
// THEMED WORD POOLS (60+ items per theme for massive permutation)
// -------------------------------------------------------------

const THEME_WORDS: Record<string, string[]> = {
  'Filipino Family Reunion': [
    'Tita asks if you have a boyfriend/girlfriend yet',
    'Tita asks why you gained or lost weight',
    'Someone brings out a tupperware for takeout (sharon)',
    'Videoke singer hits volume 100 on My Way',
    'Lolo falls asleep in the living room chair with TV on',
    'Baby starts crying when passed to a relative',
    'Someone says "Picture muna bago kain!"',
    'Kuya arrives 2 hours late and blames EDSA traffic',
    'Tito tells an unverified political story',
    'Debate over who cooked the best spaghetti',
    'Someone mistakes you for your sibling or cousin',
    'Lumpia platter vanishes in under 60 seconds',
    'Someone forgot the ice for the soft drinks',
    'Tita distributes envelopes / angpao to kids',
    'Cousins huddled in the corner playing mobile games',
    'Someone brings a giant box of bibingka / puto bumbong',
    'Host insists you eat more even after you say you are full',
    'Family photo where at least one person blinked',
    'Someone is asked to sing or dance for the titas',
    'Spilled soft drink cleaned up with table napkins',
    'Someone asks for the Wi-Fi password immediately upon arrival',
    'Tito falls asleep with his mouth slightly open',
    'Someone tells a childhood story that makes you cringe',
    'Extra plastic monobloc chairs pulled out from the bodega',
    'Karaoke score of 99 or 100 triggers cheers',
    'A pet dog begging under the boodle table',
    'Someone brings home-cooked adobo in an ice cream tub',
    'Tita whispers a family rumor behind a fan',
    'Someone gives a blessing (mano po) to 10 elders in a row',
    'Someone takes home leftover cake in foil',
  ],
  'Holiday & Christmas Fiesta': [
    'Parol with blinking colorful lights on the gate',
    'Jose Mari Chan song plays for the 5th time',
    'Queso de Bola with red wax wrapper on the table',
    'Exchanging gifts and getting a mug or towel',
    'Kids singing carols with makeshift tambourines made of bottle caps',
    'Someone eating fruit salad with condensed milk',
    'Firecrackers heard from three barangays away',
    'Waiting until midnight for Noche Buena',
    'Someone wearing red and green holiday clothes',
    'Christmas tree lights tangled in a giant knot',
    'Ham with sweet pineapple glaze sliced on a platter',
    'Someone receives an unexpected monetary gift',
    'Taking a holiday family picture by the Christmas tree',
    'Someone accidentally buys the same gift twice',
    'Playing parlor games like Trip to Jerusalem',
    'Balloons popped during party game relay',
    'Watching Home Alone on local television',
    'Hot chocolate (tsokolate de batirol) served with pandesal',
    'Someone eating puto bumbong bought outside the church',
    'Secret Santa gift exchange mix-up',
    'Complaining about December traffic at the mall',
    'Someone wearing reindeer antlers or a Santa hat',
    'Paper plates bending under the weight of holiday food',
    'Children asking when they can open their gifts',
    'Midnight church bells ringing for Simbang Gabi',
  ],
  'Pinoy Everyday Life': [
    'Shampoo bottle filled with water to get the last drops',
    'Tsinelas left neatly by the front door',
    'Using lips to point towards the kitchen',
    'Jeepney driver shouts "Apat pa sa kanan!" when full',
    'Tricycle revving its engine early in the morning',
    'Waiting for the taho vendor to shout "Taho-o-o!"',
    'Brownout in the middle of an electric fan rotation',
    'Sachet of 3-in-1 coffee stirred with a small spoon',
    'Using an old calendar as a notebook or phone directory',
    'Plastic grocery bag stored inside another grocery bag',
    'Someone answering the telephone with "Hello, sino to?"',
    'Tabo and timba used during morning shower',
    'Eating street food fishballs with sweet and spicy sauce',
    'Sari-sari store with a wire mesh window',
    'Checking phone load by dialing *143#',
    'Passing fare inside a jeepney and saying "Bayad po"',
    'Air-con remote wrapped in plastic to keep it clean',
    'Ice water sold in transparent plastic bags with a straw',
    'Someone shouting "Para!" at the corner of the street',
    'Eating instant pancit canton with a fried egg on top',
    'Mom threatening you with a flying tsinelas',
    'Someone singing loudly inside the shower',
    'Rain starts falling and everyone rushes to get clothes off the sampayan',
    'Tupperware lid that doesn’t fit any existing container',
  ],
  'Road Trip & Vacation': [
    'Someone asks "Malayo pa ba?" within 15 minutes of leaving',
    'Stopover at a gas station just to buy snacks and use the restroom',
    'Aux cord / Bluetooth music battle between passengers',
    'Someone fell asleep with their mouth open in the back seat',
    'Buying pasalubong at roadside fruit stands',
    'Plastic bag hung on the gear stick for road trip garbage',
    'Singing along loudly to 90s rock or pop road songs',
    'Driver misses the highway exit because of storytelling',
    'Cooler chest filled with ice, bottled water, and canned drinks',
    'Taking a photo with the giant provincial welcome arch',
    'Someone forgot their sunglasses or phone charger at home',
    'Traffic jam at the toll plaza',
    'Window rolled down to feel the cool mountain breeze',
    'Eating boiled peanuts or corn purchased at a traffic stop',
    'Searching for the nearest beach or waterfall',
    'Taking photos of the sunset from the car window',
    'Someone feeling motion sick and asking for white flower ointment',
    'Car trunk jammed completely with duffel bags and cardboard boxes',
    'Spotting a herd of carabaos grazing in a rice field',
    'Arriving at the hotel or resort and jumping immediately onto the bed',
  ],
  'Pop Culture & Movies': [
    'Superheroes landing on one knee dramatically',
    'Villain revealing their entire evil masterplan to the hero',
    'Dramatic slow-motion explosion where nobody looks back',
    'Car chase that crashes through a fruit cart',
    'Main character running through an airport to confess love',
    'Hacker typing furiously on keyboard for 5 seconds: "I\'m in"',
    'Horror movie character asking "Is anyone there?" into a dark basement',
    'Mentor dies right before the final battle begins',
    'Training montage with inspirational 80s rock music',
    'Plot twist that was spoiled on social media',
    'Post-credits scene that sets up the sequel',
    'Hero taking off glasses and shaking hair to look completely different',
    'Action hero taking zero damage from multiple bullet hits',
    'Time travel paradox that nobody can logically explain',
    'Disguise that consists solely of a fedora and trench coat',
    'Phone losing signal at the most critical moment of danger',
    'Cop on their last day before retirement',
    'High school drama where teenagers look 28 years old',
    'Hero jumping off a building onto a moving garbage truck',
    'Alien invasion that only attacks New York or Tokyo',
  ],
};

function shuffle<T>(arr: T[]): T[] {
  const c = [...arr];
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
}

/**
 * Generates a batch of unique Traditional 75-Ball Number Cards.
 */
export function generateBatchNumberCards(count: number, playerNames: string[] = []): GeneratedBingoCard[] {
  const cards: GeneratedBingoCard[] = [];
  const existingCardSignatures = new Set<string>();

  for (let c = 0; c < count; c++) {
    let attempts = 0;
    while (attempts < 50) {
      attempts++;
      const getCol = (min: number, max: number, n: number) => {
        const pool = Array.from({ length: max - min + 1 }, (_, i) => min + i);
        return shuffle(pool).slice(0, n);
      };

      const bCol = getCol(1, 15, 5);
      const iCol = getCol(16, 30, 5);
      const nCol = getCol(31, 45, 5);
      const gCol = getCol(46, 60, 5);
      const oCol = getCol(61, 75, 5);

      const grid: Array<Array<{ text: string; isFree: boolean; isMarked: boolean }>> = [];
      const signatureParts: number[] = [];

      for (let row = 0; row < 5; row++) {
        const rowItems = [
          { text: String(bCol[row]), isFree: false, isMarked: false },
          { text: String(iCol[row]), isFree: false, isMarked: false },
          row === 2
            ? { text: 'FREE', isFree: true, isMarked: true }
            : { text: String(nCol[row]), isFree: false, isMarked: false },
          { text: String(gCol[row]), isFree: false, isMarked: false },
          { text: String(oCol[row]), isFree: false, isMarked: false },
        ];
        grid.push(rowItems);
        signatureParts.push(bCol[row], iCol[row], row === 2 ? 0 : nCol[row], gCol[row], oCol[row]);
      }

      const sig = signatureParts.join('-');
      if (!existingCardSignatures.has(sig)) {
        existingCardSignatures.add(sig);
        const name = playerNames[c] || `Player ${c + 1}`;
        cards.push({
          id: `card_num_${Date.now()}_${c}`,
          playerName: name,
          type: 'classic_numbers',
          themeName: 'Classic 75-Ball Numbers',
          grid,
        });
        break;
      }
    }
  }

  return cards;
}

/**
 * Generates a batch of unique Themed Word Bingo Cards.
 */
export function generateBatchThemedCards(
  themeName: string,
  count: number,
  playerNames: string[] = []
): GeneratedBingoCard[] {
  const cards: GeneratedBingoCard[] = [];
  const wordPool = THEME_WORDS[themeName] || THEME_WORDS['Filipino Family Reunion'];
  const existingSignatures = new Set<string>();

  for (let c = 0; c < count; c++) {
    let attempts = 0;
    while (attempts < 50) {
      attempts++;
      const shuffledWords = shuffle(wordPool).slice(0, 24); // 24 words + 1 FREE space = 25 cells
      const sig = shuffledWords.slice(0, 10).join('|');

      if (!existingSignatures.has(sig) || attempts > 20) {
        existingSignatures.add(sig);
        const grid: Array<Array<{ text: string; isFree: boolean; isMarked: boolean }>> = [];
        let wordIdx = 0;

        for (let row = 0; row < 5; row++) {
          const rowItems = [];
          for (let col = 0; col < 5; col++) {
            if (row === 2 && col === 2) {
              rowItems.push({ text: 'FREE SPACE', isFree: true, isMarked: true });
            } else {
              rowItems.push({
                text: shuffledWords[wordIdx] || 'Party Fun',
                isFree: false,
                isMarked: false,
              });
              wordIdx++;
            }
          }
          grid.push(rowItems);
        }

        const name = playerNames[c] || `Player ${c + 1}`;
        cards.push({
          id: `card_theme_${Date.now()}_${c}`,
          playerName: name,
          type: 'themed_words',
          themeName,
          grid,
        });
        break;
      }
    }
  }

  return cards;
}

export function generateBingoCards(options: {
  theme?: string;
  cardCount: number;
  playerNames?: string[];
}): GeneratedBingoCard[] {
  const theme = options.theme || 'Classic 75-Ball Numbers';
  const count = Math.max(1, Math.min(options.cardCount || 4, 30));

  if (theme === 'Classic 75-Ball Numbers') {
    return generateBatchNumberCards(count, options.playerNames);
  } else {
    return generateBatchThemedCards(theme, count, options.playerNames);
  }
}
