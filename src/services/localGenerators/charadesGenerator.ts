import type { CharadesWord } from '../../data/hubData/charadesWords';
import { getRecentContentHashes } from '../contentHistory';

export interface CharadesGenOptions {
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'all';
  count: number;
  language?: 'en' | 'fil';
  avoidRecent?: boolean;
}

// -------------------------------------------------------------
// COMBINATORIAL CORPUS & ENTITY BASES
// -------------------------------------------------------------

const ACTORS_EN = ['A clumsy superhero', 'A nervous chef', 'A sleepy student', 'A distracted driver', 'An impatient tourist', 'A competitive grandma', 'A dramatic actor', 'A suspicious spy', 'A frantic barista', 'A robot trying to be human'];
const ACTORS_FIL = ['Isang tita sa reunion', 'Isang drayber ng jeep', 'Isang estudyanteng late sa klase', 'Isang tindera sa palengke', 'Isang bagong gising na kapatid', 'Isang lolo na nanonood ng balita', 'Isang security guard sa mall', 'Isang katorpeng manliligaw'];

const ACTIONS_EN = [
  'trying to catch a flying mosquito with chopsticks',
  'slipping on a banana peel in slow motion',
  'singing karaoke with complete passion but zero pitch',
  'trying to secretly open a loud chip bag in a library',
  'walking on burning hot beach sand without sandals',
  'drinking steaming hot soup without blowing on it',
  'fighting an invisible ghost in an elevator',
  'trying on shoes that are two sizes too small',
  'reacting to an extremely sour lemon slice',
  'dancing the robot while holding hot coffee',
  'trying to sneeze while holding back laughter',
  'getting tangled inside a fitted bedsheet',
  'pretending to know how to skateboard down a hill',
  'chasing a runaway dog carrying your favorite shoe',
  'posing for 10 selfies while losing your balance',
];

const ACTIONS_FIL = [
  'naghahabol sa humaharurot na jeep habang may bitbit na supot',
  'nagtuturo ng direksyon gamit lang ang nguso',
  'nagluluto ng pritong isda habang nagtatago sa talsik ng mantika gamit ang takip ng kaldero',
  'kumakanta sa videoke nang todo-bigay kahit piyok ang boses',
  'nagtatago sa loob ng bahay dahil may tumatawag sa labas',
  'nagtitipid ng shampoo sa bote sa pamamagitan ng paglalagay ng tubig at pag-alog nito',
  'naglalakad sa baha habang nakataas ang magkabilang pantalon',
  'kumakain ng sobrang maanghang na siling labuyo',
  'naghahanap ng tsinelas na tinangay ng aso ng kapitbahay',
  'nagpapanic dahil nawawala ang tupperware ni mama',
  'pumapara sa tricycle ngunit nilampasan lang',
  'nag-aabang sa promo sale sa department store sabay sugod sa rack',
  'naglalaro ng patintero sa kalye tapos biglang umulan',
  'sumusulyap sa crush habang nagpapanggap na nagbabasa ng libro',
  'nagtatapon ng balat ng saging pero may nakakita kaya pinulot ulit',
];

const SINGLE_PROMPTS_EN: Array<{ word: string; category: string; diff: 'easy' | 'medium' | 'hard' }> = [
  { word: 'Eating a messy ice cream cone', category: 'Actions & Verbs', diff: 'easy' },
  { word: 'Brushing an angry cat', category: 'Animals & Nature', diff: 'easy' },
  { word: 'Superhero putting on tight spandex', category: 'Movies & TV Characters', diff: 'easy' },
  { word: 'Astronaut walking on the Moon', category: 'Professions & Jobs', diff: 'easy' },
  { word: 'Firefighter sliding down a pole', category: 'Professions & Jobs', diff: 'easy' },
  { word: 'Scuba diver encountering a friendly shark', category: 'Animals & Nature', diff: 'medium' },
  { word: 'Rockstar breaking a guitar string during a solo', category: 'Funny Scenarios & Mishaps', diff: 'medium' },
  { word: 'Zombie trying to use a touch-screen smartphone', category: 'Movies & TV Characters', diff: 'medium' },
  { word: 'Photographer attacked by playful pigeons', category: 'Funny Scenarios & Mishaps', diff: 'medium' },
  { word: 'Surfer losing balance on a giant tidal wave', category: 'Actions & Verbs', diff: 'medium' },
  { word: 'Statue of Liberty coming to life to stretch', category: 'Objects & Household', diff: 'hard' },
  { word: 'Secret agent defusing a bomb with 3 seconds left', category: 'Movies & TV Characters', diff: 'hard' },
  { word: 'Time traveler adjusting to 21st-century traffic', category: 'Funny Scenarios & Mishaps', diff: 'hard' },
  { word: 'Doctor delivering bad news to a hypochondriac', category: 'Professions & Jobs', diff: 'hard' },
  { word: 'Ninja sneaking into a kitchen to steal a cookie', category: 'Actions & Verbs', diff: 'hard' },
];

const SINGLE_PROMPTS_FIL: Array<{ word: string; category: string; diff: 'easy' | 'medium' | 'hard' }> = [
  { word: 'Pagbalat at pagkain ng mainit na balut', category: 'Filipino Daily Life & Culture', diff: 'easy' },
  { word: 'Pagsayaw ng Budots sa barangay basketball court', category: 'Filipino Daily Life & Culture', diff: 'easy' },
  { word: 'Pagtatawag ng taho sa umaga habang may dalang baso', category: 'Filipino Daily Life & Culture', diff: 'easy' },
  { word: 'Pagsabit sa likod ng punong jeepney', category: 'Filipino Daily Life & Culture', diff: 'easy' },
  { word: 'Pangangaroling gamit ang pinitpit na tansan at lata', category: 'Filipino Daily Life & Culture', diff: 'medium' },
  { word: 'Pagtatago sa ninong at ninang tuwing Pasko', category: 'Filipino Daily Life & Culture', diff: 'medium' },
  { word: 'Panghuhuli ng tuko sa kisame gamit ang patpat', category: 'Animals & Nature', diff: 'medium' },
  { word: 'Pagsisiksikan sa MRT habang buhat ang backpack sa harap', category: 'Funny Scenarios & Mishaps', diff: 'medium' },
  { word: 'Pagbabalot ng lumpia para iuwi sa tupperware', category: 'Filipino Daily Life & Culture', diff: 'medium' },
  { word: 'Pagtanggal ng tinik ng bangus sa lalamunan gamit ang saging', category: 'Funny Scenarios & Mishaps', diff: 'hard' },
  { word: 'Pagsaway ni mama gamit lang ang matalim na tingin', category: 'Filipino Daily Life & Culture', diff: 'hard' },
  { word: 'Pagsayaw ng Tinikling pero naipit ang paa sa kawayan', category: 'Filipino Daily Life & Culture', diff: 'hard' },
  { word: 'Panghaharang ng manok sa bakuran na ayaw magpahuli', category: 'Animals & Nature', diff: 'hard' },
];

export async function generateProceduralCharades(options: CharadesGenOptions): Promise<CharadesWord[]> {
  const targetCount = Math.max(1, Math.min(options.count || 10, 30));
  const lang = options.language || 'en';
  const categoryFilter = options.category && options.category !== 'All' ? options.category : null;
  const diffFilter = options.difficulty && options.difficulty !== 'all' ? options.difficulty : null;

  const recentHashes = options.avoidRecent !== false ? await getRecentContentHashes('charades') : new Set<string>();
  const generated: CharadesWord[] = [];
  let attempts = 0;
  const maxAttempts = targetCount * 15;

  const singles = lang === 'fil' ? SINGLE_PROMPTS_FIL : SINGLE_PROMPTS_EN;
  const actors = lang === 'fil' ? ACTORS_FIL : ACTORS_EN;
  const actions = lang === 'fil' ? ACTIONS_FIL : ACTIONS_EN;

  while (generated.length < targetCount && attempts < maxAttempts) {
    attempts++;

    let word: string;
    let cat: string;
    let diff: 'easy' | 'medium' | 'hard';

    // 50% single curated templates, 50% dynamic cross-product combinations
    if (Math.random() > 0.5 && singles.length > 0) {
      const s = singles[Math.floor(Math.random() * singles.length)];
      word = s.word;
      cat = s.category;
      diff = s.diff;
    } else {
      const actor = actors[Math.floor(Math.random() * actors.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];
      word = `${actor} ${action}`;
      cat = lang === 'fil' ? 'Filipino Daily Life & Culture' : 'Funny Scenarios & Mishaps';
      diff = Math.random() > 0.6 ? 'hard' : Math.random() > 0.3 ? 'medium' : 'easy';
    }

    if (categoryFilter && cat !== categoryFilter && categoryFilter !== 'All') continue;
    if (diffFilter && diff !== diffFilter) continue;

    const hash = word.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (recentHashes.has(hash)) continue;
    if (generated.some((g) => g.word === word)) continue;

    const points = diff === 'easy' ? 1 : diff === 'medium' ? 2 : 3;

    generated.push({
      id: `gen_ch_${Date.now()}_${generated.length}`,
      word,
      category: cat,
      difficulty: diff,
      points,
    });
  }

  return generated;
}
