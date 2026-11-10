import type { WordCluePuzzle } from '../../data/hubData/wordClues';
import { getRecentContentHashes } from '../contentHistory';

export interface GuessWordGenOptions {
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'all';
  count: number;
  language?: 'en' | 'fil';
  avoidRecent?: boolean;
}

// -------------------------------------------------------------
// CURATED PROGRESSIVE PUZZLE REPERTOIRE (HIGH FIDELITY)
// -------------------------------------------------------------

const GUESS_PUZZLES_EN: Array<{
  word: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  clues: [string, string, string, string];
}> = [
  {
    word: 'Microwave',
    category: 'Everyday Objects',
    difficulty: 'easy',
    clues: [
      'I sit quietly on kitchen countertops, ready to assist busy people.',
      'Inside me, a round glass tray spins slowly in circles.',
      'I heat up food and drinks without using an open flame or stovetop burner.',
      'I beep several times when my timer countdown reaches zero.',
    ],
  },
  {
    word: 'Kangaroo',
    category: 'Animals & Nature',
    difficulty: 'easy',
    clues: [
      'I am native to a continent across the southern hemisphere.',
      'I have very powerful hind legs and a muscular balancing tail.',
      'Mother members of my species carry their young (joeys) in a front belly pouch.',
      'I get around by leaping and hopping rather than walking on four legs.',
    ],
  },
  {
    word: 'Popcorn',
    category: 'Food & Snacks',
    difficulty: 'easy',
    clues: [
      'I begin life as hard, unyielding yellow kernels.',
      'When exposed to intense heat and oil, I burst violently inside out.',
      'I am often coated in melted yellow butter, salt, or cheese powder.',
      'The scent of me filling the lobby is the signature of every movie theater.',
    ],
  },
  {
    word: 'Dentist',
    category: 'Professions & Roles',
    difficulty: 'easy',
    clues: [
      'My workplace has a large reclining leather chair with bright spotlights overhead.',
      'People often dread visiting me, though I help them keep a clean smile.',
      'I use tiny mirrors, buzzing drills, and fluoride paste during my work.',
      'I check for cavities and remind patients to floss their teeth daily.',
    ],
  },
  {
    word: 'Volcano',
    category: 'Famous Places & Geography',
    difficulty: 'medium',
    clues: [
      'I often look like an ordinary peaceful mountain on the horizon.',
      'Deep beneath my crust lies immense geological pressure and molten rock.',
      'When I awaken, I spew plumes of ash, sulfur gas, and glowing red magma.',
      'Mount Mayon, Mount Pinatubo, and Mount Fuji are iconic examples of me.',
    ],
  },
  {
    word: 'Telescope',
    category: 'Science & Technology',
    difficulty: 'medium',
    clues: [
      'I am pointed upwards through domes or open night windows.',
      'My optical tubes house precision lenses and curved glass mirrors.',
      'I bring distant celestial bodies like craters on the moon and Saturn rings into sharp focus.',
      'Astronomers and stargazers rely on me to gaze deep into outer space.',
    ],
  },
  {
    word: 'Chameleon',
    category: 'Animals & Nature',
    difficulty: 'medium',
    clues: [
      'I move cautiously through tree branches with clamp-like zygodactylous feet.',
      'My two eyes can swivel and focus independently in completely opposite directions.',
      'I have a lightning-fast sticky tongue that can shoot out to snatch insects.',
      'I am legendary for my ability to shift skin pigments to blend into my environment.',
    ],
  },
  {
    word: 'Lighthouse',
    category: 'Everyday Objects',
    difficulty: 'medium',
    clues: [
      'I stand tall and solitary along rugged coastlines and cliff edges.',
      'I endure crashing ocean waves, gale-force winds, and dense marine fog.',
      'A powerful Fresnel lens at my summit beams a rotating beacon of brilliant light.',
      'I warn passing sea vessels and sailors away from dangerous submerged rocks.',
    ],
  },
  {
    word: 'Black Hole',
    category: 'Science & Technology',
    difficulty: 'hard',
    clues: [
      'I am born when a supermassive dying star collapses under its own immense weight.',
      'My gravitational pull is so intense that space and time warp radically around me.',
      'Beyond my threshold known as the event horizon, nothing can escape.',
      'Even light itself is trapped forever once it crosses my perimeter.',
    ],
  },
  {
    word: 'Archaeologist',
    category: 'Professions & Roles',
    difficulty: 'hard',
    clues: [
      'My office is frequently outdoors under baking sun in dusty dirt trenches.',
      'I work delicately using small trowels, soft brushes, and grid measuring lines.',
      'I excavate buried pottery shards, ancient bone fragments, and lost city ruins.',
      'I reconstruct past human civilizations by studying what people left behind centuries ago.',
    ],
  },
];

const GUESS_PUZZLES_FIL: Array<{
  word: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  clues: [string, string, string, string];
}> = [
  {
    word: 'Jeepney',
    category: 'Philippine Culture & Traditions',
    difficulty: 'easy',
    clues: [
      'Bunga ako ng mga naiwang sasakyan ng mga sundalong Amerikano noong Ikalawang Digmaang Pandaigdig.',
      'Puno ako ng makukulay na pinta, burloloy, at may mga pangalan ng anak sa windshield.',
      'Sumisigaw ang aking konduktor o drayber ng mga karatula ng ruta at "Apat pa sa kanan!".',
      'Tinagurian akong "Hari ng Kalsada" kung saan ipinapasa ang barya habang sinasabing "Bayad po".',
    ],
  },
  {
    word: 'Halo-Halo',
    category: 'Food & Snacks',
    difficulty: 'easy',
    clues: [
      'Inihahain ako sa matangkad na baso o mangkok lalo na tuwing tag-init.',
      'Puno ako ng pinaghalong saging, nata de coco, kaong, sago, at minatamis na beans.',
      'Binubudburan ako ng pinong ginadgad na yelo, gatas na ebaporada, at may ube at leche flan sa ibabaw.',
      'Kailangan mo akong haluin nang mabuti gamit ang mahabang kutsara bago kainin.',
    ],
  },
  {
    word: 'Balut',
    category: 'Food & Snacks',
    difficulty: 'easy',
    clues: [
      'Karaniwan akong ibinebenta sa gabi sa mga kalye habang nakalagay sa mainit na basket na may sako.',
      'Iniinom muna ang aking mainit na sabaw bago kainin ang laman.',
      'Nilalagyan ako ng asin o maanghang na suka bago buksan nang tuluyan.',
      'Ako ay pinakuluang itlog ng itik na may namumuong sisiw sa loob.',
    ],
  },
  {
    word: 'Sorbetes (Dirty Ice Cream)',
    category: 'Food & Snacks',
    difficulty: 'medium',
    clues: [
      'Itinutulak ako sa makulay na kariton na may maliliit na metal na drum at yelo na may asin.',
      'Tumutunog ang aking maliit na gintong kampanilya habang umiikot sa barangay tuwing hapon.',
      'Maaari mo akong ilagay sa apa o kaya ay palaman sa tinapay na pandesal.',
      'May lasa akong keso, ube, mangga, at tsokolate na paborito ng mga bata sa kalsada.',
    ],
  },
  {
    word: 'Tsinelas',
    category: 'Everyday Objects',
    difficulty: 'easy',
    clues: [
      'Gawa ako sa goma o plastik at laging nakatambak malapit sa pintuan ng bahay.',
      'Ginagamit ako bilang pamalit sa sapatos kapag naglalakad sa loob o labas ng bakuran.',
      'Ginagamit din ako ng mga bata bilang pamato sa larong Tumbang Preso.',
      'Minsan, nagiging pamosong sandata ako ni nanay kapag makulit o pasaway ang mga anak.',
    ],
  },
  {
    word: 'Parol',
    category: 'Philippine Culture & Traditions',
    difficulty: 'medium',
    clues: [
      'Isinasabit ako sa mga bintana, pinto, at poste ng ilaw simula pa lang ng Setyembre.',
      'Gawa ako sa patpat ng kawayan, makulay na papel de hapon o capiz shells, at may umiilaw na bombilya.',
      'Sumisimbolo ako sa tala o bituin na gumabay sa Tatlong Hari patungo sa sabsaban sa Bethlehem.',
      'Ako ang pinakatanyag na tradisyonal na palamuti ng Pasko sa Pilipinas.',
    ],
  },
  {
    word: 'Taho',
    category: 'Food & Snacks',
    difficulty: 'easy',
    clues: [
      'Dala ako ng maglalako sa dalawang malalaking bucket na aluminyo na nakasabit sa kawayang pingga.',
      'Pang-umagang meryenda ako na paboritong bilhin gamit ang baso o mug mula sa bahay.',
      'Gawa ako sa mainit at malambot na silken tofu na may kasamang maliliit na sago pearls.',
      'Binubuhusan ako ng matamis at maitim na arnibal bago higupin.',
    ],
  },
];

export async function generateProceduralGuessWord(options: GuessWordGenOptions): Promise<WordCluePuzzle[]> {
  const targetCount = Math.max(1, Math.min(options.count || 10, 30));
  const lang = options.language || 'en';
  const categoryFilter = options.category && options.category !== 'All' ? options.category : null;
  const diffFilter = options.difficulty && options.difficulty !== 'all' ? options.difficulty : null;

  const recentHashes = options.avoidRecent !== false ? await getRecentContentHashes('guess-the-word') : new Set<string>();
  const generated: WordCluePuzzle[] = [];
  let attempts = 0;
  const maxAttempts = targetCount * 15;

  const sourcePool = lang === 'fil' ? GUESS_PUZZLES_FIL : GUESS_PUZZLES_EN;

  while (generated.length < targetCount && attempts < maxAttempts) {
    attempts++;
    const puzzle = sourcePool[Math.floor(Math.random() * sourcePool.length)];
    if (!puzzle) continue;

    if (categoryFilter && puzzle.category !== categoryFilter && categoryFilter !== 'All') continue;
    if (diffFilter && puzzle.difficulty !== diffFilter) continue;

    const hash = puzzle.word.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (recentHashes.has(hash)) continue;
    if (generated.some((g) => g.word === puzzle.word)) continue;

    generated.push({
      id: `gen_gw_${Date.now()}_${generated.length}`,
      word: puzzle.word,
      category: puzzle.category,
      clues: puzzle.clues,
    });
  }

  return generated;
}
