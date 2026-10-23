import type { QuestionPack } from '../types/game';

export const FILIPINO_BUILTIN_PACKS: QuestionPack[] = [
  // 1. Filipino Food & Drinks
  {
    id: 'pack-filipino-food-drinks',
    title: 'Filipino Food & Drinks',
    description: 'Pinoy birthday favorites, breakfast staples, street foods, celebratory desserts, and milk tea orders.',
    category: 'Filipino Food & Drinks',
    isBuiltIn: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    questions: [
      {
        id: 'p1-q1',
        prompt: 'Name a Filipino dish commonly served at birthdays.',
        category: 'Filipino Food & Drinks',
        answers: [
          { id: 'p1-q1-a1', text: 'Spaghetti', points: 30, acceptedVariants: ['spaghetti', 'pinoy spaghetti', 'sweet spaghetti', 'pasta'], displayOrder: 1 },
          { id: 'p1-q1-a2', text: 'Pancit', points: 25, acceptedVariants: ['pancit', 'pansit', 'bihon', 'canton', 'noodles'], displayOrder: 2 },
          { id: 'p1-q1-a3', text: 'Lumpia', points: 20, acceptedVariants: ['lumpia', 'lumpiang shanghai', 'shanghai', 'spring roll'], displayOrder: 3 },
          { id: 'p1-q1-a4', text: 'Fried chicken', points: 15, acceptedVariants: ['fried chicken', 'chicken', 'chickenjoy'], displayOrder: 4 },
          { id: 'p1-q1-a5', text: 'Menudo', points: 10, acceptedVariants: ['menudo', 'kaldereta', 'caldereta'], displayOrder: 5 },
        ],
      },
      {
        id: 'p1-q2',
        prompt: 'Name a Filipino food people commonly eat for breakfast.',
        category: 'Filipino Food & Drinks',
        answers: [
          { id: 'p1-q2-a1', text: 'Sinangag at itlog', points: 30, acceptedVariants: ['sinangag at itlog', 'sinangag', 'fried rice', 'garlic rice', 'itlog', 'egg'], displayOrder: 1 },
          { id: 'p1-q2-a2', text: 'Tapsilog', points: 25, acceptedVariants: ['tapsilog', 'tapa', 'silog'], displayOrder: 2 },
          { id: 'p1-q2-a3', text: 'Pandesal', points: 20, acceptedVariants: ['pandesal', 'pan de sal', 'bread'], displayOrder: 3 },
          { id: 'p1-q2-a4', text: 'Longganisa', points: 15, acceptedVariants: ['longganisa', 'longanisa', 'sausage'], displayOrder: 4 },
          { id: 'p1-q2-a5', text: 'Lugaw', points: 10, acceptedVariants: ['lugaw', 'arroz caldo', 'goto', 'congee', 'porridge'], displayOrder: 5 },
        ],
      },
      {
        id: 'p1-q3',
        prompt: 'Name a popular Filipino street food.',
        category: 'Filipino Food & Drinks',
        answers: [
          { id: 'p1-q3-a1', text: 'Fish balls', points: 30, acceptedVariants: ['fish balls', 'fishballs', 'fish ball'], displayOrder: 1 },
          { id: 'p1-q3-a2', text: 'Isaw', points: 25, acceptedVariants: ['isaw', 'chicken isaw', 'pork isaw', 'intestines'], displayOrder: 2 },
          { id: 'p1-q3-a3', text: 'Kwek-kwek', points: 20, acceptedVariants: ['kwek-kwek', 'kwek kwek', 'kwekkwek', 'tokneneng', 'quail egg'], displayOrder: 3 },
          { id: 'p1-q3-a4', text: 'Banana cue', points: 15, acceptedVariants: ['banana cue', 'bananacue', 'banana cue on a stick'], displayOrder: 4 },
          { id: 'p1-q3-a5', text: 'Betamax', points: 10, acceptedVariants: ['betamax', 'coagulated blood', 'pork blood', 'blood'], displayOrder: 5 },
        ],
      },
      {
        id: 'p1-q4',
        prompt: 'Name a Filipino dessert served during celebrations.',
        category: 'Filipino Food & Drinks',
        answers: [
          { id: 'p1-q4-a1', text: 'Leche flan', points: 30, acceptedVariants: ['leche flan', 'flan', 'caramel custard'], displayOrder: 1 },
          { id: 'p1-q4-a2', text: 'Halo-halo', points: 25, acceptedVariants: ['halo-halo', 'halo halo', 'halohalo'], displayOrder: 2 },
          { id: 'p1-q4-a3', text: 'Buko salad', points: 20, acceptedVariants: ['buko salad', 'fruit salad', 'buko'], displayOrder: 3 },
          { id: 'p1-q4-a4', text: 'Bibingka', points: 15, acceptedVariants: ['bibingka', 'rice cake'], displayOrder: 4 },
          { id: 'p1-q4-a5', text: 'Puto', points: 10, acceptedVariants: ['puto', 'puto bumbong', 'steamed rice cake'], displayOrder: 5 },
        ],
      },
      {
        id: 'p1-q5',
        prompt: 'Name a drink Filipinos commonly order at a milk tea shop.',
        category: 'Filipino Food & Drinks',
        answers: [
          { id: 'p1-q5-a1', text: 'Wintermelon milk tea', points: 30, acceptedVariants: ['wintermelon', 'wintermelon milk tea', 'winter melon'], displayOrder: 1 },
          { id: 'p1-q5-a2', text: 'Brown sugar milk tea', points: 25, acceptedVariants: ['brown sugar', 'tiger sugar', 'brown sugar boba', 'boba milk tea'], displayOrder: 2 },
          { id: 'p1-q5-a3', text: 'Okinawa milk tea', points: 20, acceptedVariants: ['okinawa', 'okinawa milk tea', 'roasted milk tea'], displayOrder: 3 },
          { id: 'p1-q5-a4', text: 'Matcha', points: 15, acceptedVariants: ['matcha', 'matcha milk tea', 'green tea'], displayOrder: 4 },
          { id: 'p1-q5-a5', text: 'Taro milk tea', points: 10, acceptedVariants: ['taro', 'taro milk tea', 'ube milk tea'], displayOrder: 5 },
        ],
      },
    ],
  },

  // 2. Pinoy Childhood Memories
  {
    id: 'pack-pinoy-childhood-memories',
    title: 'Pinoy Childhood Memories',
    description: 'Classic outdoor Larong Pinoy, things parents say, school snacks, supplies, and reasons for getting scolded.',
    category: 'Pinoy Childhood Memories',
    isBuiltIn: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    questions: [
      {
        id: 'p2-q1',
        prompt: 'Name a game Filipino children play outside.',
        category: 'Pinoy Childhood Memories',
        answers: [
          { id: 'p2-q1-a1', text: 'Taguan', points: 30, acceptedVariants: ['taguan', 'tagu-taguan', 'hide and seek'], displayOrder: 1 },
          { id: 'p2-q1-a2', text: 'Tumbang preso', points: 25, acceptedVariants: ['tumbang preso', 'tumba preso', 'preso'], displayOrder: 2 },
          { id: 'p2-q1-a3', text: 'Patintero', points: 20, acceptedVariants: ['patintero', 'harangang taga'], displayOrder: 3 },
          { id: 'p2-q1-a4', text: 'Agawan base', points: 15, acceptedVariants: ['agawan base', 'agawan'], displayOrder: 4 },
          { id: 'p2-q1-a5', text: 'Luksong baka', points: 10, acceptedVariants: ['luksong baka', 'luksong tinik'], displayOrder: 5 },
        ],
      },
      {
        id: 'p2-q2',
        prompt: 'Name something a Filipino child hears from their parents.',
        category: 'Pinoy Childhood Memories',
        answers: [
          { id: 'p2-q2-a1', text: '"Mag-aral kang mabuti"', points: 30, acceptedVariants: ['mag-aral kang mabuti', 'mag aral kang mabuti', 'mag-aral', 'study hard'], displayOrder: 1 },
          { id: 'p2-q2-a2', text: '"Matulog ka na"', points: 25, acceptedVariants: ['matulog ka na', 'matulog ka na sa tanghali', 'tulog na', 'sleep now', 'go to sleep'], displayOrder: 2 },
          { id: 'p2-q2-a3', text: '"Huwag kang magpuyat"', points: 20, acceptedVariants: ['huwag kang magpuyat', 'wag kang magpuyat', 'huwag magpuyat', 'wag magpuyat', 'dont stay up late'], displayOrder: 3 },
          { id: 'p2-q2-a4', text: '"Maglinis ka ng kwarto"', points: 15, acceptedVariants: ['maglinis ka ng kwarto', 'linis kwarto', 'maglinis', 'clean your room'], displayOrder: 4 },
          { id: 'p2-q2-a5', text: '"Sundin mo ako"', points: 10, acceptedVariants: ['sundin mo ako', 'makinig ka sa akin', 'follow me', 'obey me', 'makinig ka'], displayOrder: 5 },
        ],
      },
      {
        id: 'p2-q3',
        prompt: 'Name a snack children commonly buy outside school.',
        category: 'Pinoy Childhood Memories',
        answers: [
          { id: 'p2-q3-a1', text: 'Fish balls', points: 30, acceptedVariants: ['fish balls', 'fishball', 'kikiam', 'squid balls'], displayOrder: 1 },
          { id: 'p2-q3-a2', text: 'Ice candy', points: 25, acceptedVariants: ['ice candy', 'icecandy'], displayOrder: 2 },
          { id: 'p2-q3-a3', text: 'Chichirya', points: 20, acceptedVariants: ['chichirya', 'junk food', 'chips'], displayOrder: 3 },
          { id: 'p2-q3-a4', text: 'Dirty ice cream', points: 15, acceptedVariants: ['dirty ice cream', 'sorbetes', 'ice cream'], displayOrder: 4 },
          { id: 'p2-q3-a5', text: 'Banana cue', points: 10, acceptedVariants: ['banana cue', 'bananacue', 'turon'], displayOrder: 5 },
        ],
      },
      {
        id: 'p2-q4',
        prompt: 'Name something students bring to school.',
        category: 'Pinoy Childhood Memories',
        answers: [
          { id: 'p2-q4-a1', text: 'Bag', points: 30, acceptedVariants: ['bag', 'backpack', 'school bag'], displayOrder: 1 },
          { id: 'p2-q4-a2', text: 'Baon', points: 25, acceptedVariants: ['baon', 'lunch', 'money', 'allowance', 'food'], displayOrder: 2 },
          { id: 'p2-q4-a3', text: 'Notebook', points: 20, acceptedVariants: ['notebook', 'notebooks', 'binder'], displayOrder: 3 },
          { id: 'p2-q4-a4', text: 'Pencil', points: 15, acceptedVariants: ['pencil', 'ballpen', 'pen', 'lapis'], displayOrder: 4 },
          { id: 'p2-q4-a5', text: 'Water bottle', points: 10, acceptedVariants: ['water bottle', 'tumbler', 'water', 'jug'], displayOrder: 5 },
        ],
      },
      {
        id: 'p2-q5',
        prompt: 'Name a reason a Filipino child gets scolded.',
        category: 'Pinoy Childhood Memories',
        answers: [
          { id: 'p2-q5-a1', text: 'Not doing homework', points: 30, acceptedVariants: ['not doing homework', 'no homework', 'hindi nag-aral', 'assignment'], displayOrder: 1 },
          { id: 'p2-q5-a2', text: 'Playing too much', points: 25, acceptedVariants: ['playing too much', 'laro ng laro', 'cellphone', 'computer games'], displayOrder: 2 },
          { id: 'p2-q5-a3', text: 'Getting bad grades', points: 20, acceptedVariants: ['getting bad grades', 'low grades', 'mababang grado', 'bagsak'], displayOrder: 3 },
          { id: 'p2-q5-a4', text: 'Talking back', points: 15, acceptedVariants: ['talking back', 'sumasagot', 'pilosopo', 'disrespect'], displayOrder: 4 },
          { id: 'p2-q5-a5', text: 'Coming home late', points: 10, acceptedVariants: ['coming home late', 'uwi ng gabi', 'late home', 'gabi na umuwi'], displayOrder: 5 },
        ],
      },
    ],
  },

  // 3. Philippine Festivals
  {
    id: 'pack-philippine-festivals',
    title: 'Philippine Festivals',
    description: 'Iconic fiestas across Luzon, Visayas, and Mindanao, street dancing, festive costumes, and souvenirs.',
    category: 'Philippine Festivals',
    isBuiltIn: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    questions: [
      {
        id: 'p3-q1',
        prompt: 'Name a famous festival in the Philippines.',
        category: 'Philippine Festivals',
        answers: [
          { id: 'p3-q1-a1', text: 'Sinulog', points: 30, acceptedVariants: ['sinulog', 'cebu sinulog'], displayOrder: 1 },
          { id: 'p3-q1-a2', text: 'Ati-Atihan', points: 25, acceptedVariants: ['ati-atihan', 'atiatihan', 'kalibo'], displayOrder: 2 },
          { id: 'p3-q1-a3', text: 'Panagbenga', points: 20, acceptedVariants: ['panagbenga', 'flower festival', 'baguio'], displayOrder: 3 },
          { id: 'p3-q1-a4', text: 'Dinagyang', points: 15, acceptedVariants: ['dinagyang', 'iloilo dinagyang'], displayOrder: 4 },
          { id: 'p3-q1-a5', text: 'Pahiyas', points: 10, acceptedVariants: ['pahiyas', 'lucban pahiyas', 'kiping'], displayOrder: 5 },
        ],
      },
      {
        id: 'p3-q2',
        prompt: 'Name something people see during a Philippine festival.',
        category: 'Philippine Festivals',
        answers: [
          { id: 'p3-q2-a1', text: 'Street dancing', points: 30, acceptedVariants: ['street dancing', 'dancers', 'sayaw', 'parade'], displayOrder: 1 },
          { id: 'p3-q2-a2', text: 'Colorful costumes', points: 25, acceptedVariants: ['colorful costumes', 'costumes', 'headdresses'], displayOrder: 2 },
          { id: 'p3-q2-a3', text: 'Floats', points: 20, acceptedVariants: ['floats', 'parade floats', 'flower floats'], displayOrder: 3 },
          { id: 'p3-q2-a4', text: 'Live music', points: 15, acceptedVariants: ['live music', 'marching band', 'drums', 'banda'], displayOrder: 4 },
          { id: 'p3-q2-a5', text: 'Food stalls', points: 10, acceptedVariants: ['food stalls', 'tiangge', 'food booths', 'bazaar'], displayOrder: 5 },
        ],
      },
      {
        id: 'p3-q3',
        prompt: 'Name something people wear during a festival.',
        category: 'Philippine Festivals',
        answers: [
          { id: 'p3-q3-a1', text: 'Colorful costumes', points: 30, acceptedVariants: ['colorful costumes', 'costumes', 'elaborate costumes'], displayOrder: 1 },
          { id: 'p3-q3-a2', text: 'Festival shirts', points: 25, acceptedVariants: ['festival shirts', 't-shirt', 'souvenir shirt', 'shirt'], displayOrder: 2 },
          { id: 'p3-q3-a3', text: 'Headdresses', points: 20, acceptedVariants: ['headdresses', 'headpiece', 'crown', 'feathers'], displayOrder: 3 },
          { id: 'p3-q3-a4', text: 'Face paint', points: 15, acceptedVariants: ['face paint', 'body paint', 'glitter'], displayOrder: 4 },
          { id: 'p3-q3-a5', text: 'Traditional clothing', points: 10, acceptedVariants: ['traditional clothing', 'barong', 'filipiniana', 'native attire'], displayOrder: 5 },
        ],
      },
      {
        id: 'p3-q4',
        prompt: 'Name a reason people attend festivals.',
        category: 'Philippine Festivals',
        answers: [
          { id: 'p3-q4-a1', text: 'To have fun', points: 30, acceptedVariants: ['to have fun', 'fun', 'enjoy', 'bonding'], displayOrder: 1 },
          { id: 'p3-q4-a2', text: 'To watch performances', points: 25, acceptedVariants: ['to watch performances', 'watch street dancing', 'performances', 'shows'], displayOrder: 2 },
          { id: 'p3-q4-a3', text: 'To celebrate local traditions', points: 20, acceptedVariants: ['to celebrate local traditions', 'traditions', 'religion', 'fiesta', 'culture'], displayOrder: 3 },
          { id: 'p3-q4-a4', text: 'To eat local food', points: 15, acceptedVariants: ['to eat local food', 'food', 'eat', 'local delicacies'], displayOrder: 4 },
          { id: 'p3-q4-a5', text: 'To take pictures', points: 10, acceptedVariants: ['to take pictures', 'pictures', 'photos', 'instagram', 'selfies'], displayOrder: 5 },
        ],
      },
      {
        id: 'p3-q5',
        prompt: 'Name something you might buy at a festival.',
        category: 'Philippine Festivals',
        answers: [
          { id: 'p3-q5-a1', text: 'Street food', points: 30, acceptedVariants: ['street food', 'food', 'snacks', 'isaw'], displayOrder: 1 },
          { id: 'p3-q5-a2', text: 'Souvenirs', points: 25, acceptedVariants: ['souvenirs', 'pasalubong', 'keychains'], displayOrder: 2 },
          { id: 'p3-q5-a3', text: 'Toys', points: 20, acceptedVariants: ['toys', 'balloons', 'light sticks'], displayOrder: 3 },
          { id: 'p3-q5-a4', text: 'Clothes', points: 15, acceptedVariants: ['clothes', 'shirts', 'festival shirt'], displayOrder: 4 },
          { id: 'p3-q5-a5', text: 'Accessories', points: 10, acceptedVariants: ['accessories', 'beads', 'headband', 'necklace'], displayOrder: 5 },
        ],
      },
    ],
  },

  // 4. Filipino Slang & Expressions
  {
    id: 'pack-filipino-slang-expressions',
    title: 'Filipino Slang & Expressions',
    description: 'Spontaneous reactions, iconic expressions like petmalu and sana all, hurry-up phrases, and bahala na.',
    category: 'Filipino Slang & Expressions',
    isBuiltIn: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    questions: [
      {
        id: 'p4-q1',
        prompt: 'What does a Filipino commonly say when surprised?',
        category: 'Filipino Slang & Expressions',
        answers: [
          { id: 'p4-q1-a1', text: '"Hala!"', points: 30, acceptedVariants: ['hala', 'hala!', 'hala ka'], displayOrder: 1 },
          { id: 'p4-q1-a2', text: '"Grabe!"', points: 25, acceptedVariants: ['grabe', 'grabe!', 'grabeng'], displayOrder: 2 },
          { id: 'p4-q1-a3', text: '"Ay, wow!"', points: 20, acceptedVariants: ['ay wow', 'ay, wow!', 'wow', 'ay wow!'], displayOrder: 3 },
          { id: 'p4-q1-a4', text: '"Susmaryosep!"', points: 15, acceptedVariants: ['susmaryosep', 'susmaryosep!', 'sus', 'maryosep'], displayOrder: 4 },
          { id: 'p4-q1-a5', text: '"Talaga ba?"', points: 10, acceptedVariants: ['talaga ba', 'talaga ba?', 'talaga', 'weeh'], displayOrder: 5 },
        ],
      },
      {
        id: 'p4-q2',
        prompt: 'What does "petmalu" mean?',
        category: 'Filipino Slang & Expressions',
        answers: [
          { id: 'p4-q2-a1', text: 'Astig / cool', points: 35, acceptedVariants: ['astig', 'cool', 'astig / cool', 'malupit'], displayOrder: 1 },
          { id: 'p4-q2-a2', text: 'Magaling', points: 25, acceptedVariants: ['magaling', 'lodi', 'great', 'skilled'], displayOrder: 2 },
          { id: 'p4-q2-a3', text: 'Kahanga-hanga', points: 20, acceptedVariants: ['kahanga-hanga', 'amazing', 'impressive'], displayOrder: 3 },
          { id: 'p4-q2-a4', text: 'Nakakatawa', points: 10, acceptedVariants: ['nakakatawa', 'funny'], displayOrder: 4 },
          { id: 'p4-q2-a5', text: 'Nakakagulat', points: 10, acceptedVariants: ['nakakagulat', 'shocking', 'surprising'], displayOrder: 5 },
        ],
      },
      {
        id: 'p4-q3',
        prompt: 'What might a Filipino say when someone is taking too long?',
        category: 'Filipino Slang & Expressions',
        answers: [
          { id: 'p4-q3-a1', text: '"Bilisan mo!"', points: 30, acceptedVariants: ['bilisan mo', 'bilisan mo!', 'dali', 'bilis'], displayOrder: 1 },
          { id: 'p4-q3-a2', text: '"Ang tagal mo!"', points: 25, acceptedVariants: ['ang tagal mo', 'ang tagal mo!', 'tagal', 'ang kupad'], displayOrder: 2 },
          { id: 'p4-q3-a3', text: '"Tara na!"', points: 20, acceptedVariants: ['tara na', 'tara na!', 'tara', 'let\'s go'], displayOrder: 3 },
          { id: 'p4-q3-a4', text: '"Ano na?"', points: 15, acceptedVariants: ['ano na', 'ano na?', 'anyare'], displayOrder: 4 },
          { id: 'p4-q3-a5', text: '"Naghihintay kami!"', points: 10, acceptedVariants: ['naghihintay kami', 'naghihintay kami!', 'hinihintay ka na'], displayOrder: 5 },
        ],
      },
      {
        id: 'p4-q4',
        prompt: 'What does "sana all" usually express?',
        category: 'Filipino Slang & Expressions',
        answers: [
          { id: 'p4-q4-a1', text: 'Envy or admiration', points: 35, acceptedVariants: ['envy', 'admiration', 'inggit', 'inggit / admiration'], displayOrder: 1 },
          { id: 'p4-q4-a2', text: 'Wanting the same thing', points: 25, acceptedVariants: ['wanting the same thing', 'wish', 'sana ako rin', 'gusto ko rin'], displayOrder: 2 },
          { id: 'p4-q4-a3', text: 'Being impressed', points: 20, acceptedVariants: ['impressed', 'being impressed', 'bilib'], displayOrder: 3 },
          { id: 'p4-q4-a4', text: 'Being happy for someone', points: 10, acceptedVariants: ['happy for someone', 'masaya para sa iba'], displayOrder: 4 },
          { id: 'p4-q4-a5', text: 'Making a joke', points: 10, acceptedVariants: ['making a joke', 'joke', 'biro'], displayOrder: 5 },
        ],
      },
      {
        id: 'p4-q5',
        prompt: 'What does a Filipino usually mean by "bahala na"?',
        category: 'Filipino Slang & Expressions',
        answers: [
          { id: 'p4-q5-a1', text: 'Whatever happens, happens', points: 30, acceptedVariants: ['whatever happens, happens', 'come what may', 'bahala na'], displayOrder: 1 },
          { id: 'p4-q5-a2', text: 'Leave it to fate', points: 25, acceptedVariants: ['leave it to fate', 'fate', 'god', 'diyos', 'nasa diyos ang awa'], displayOrder: 2 },
          { id: 'p4-q5-a3', text: 'Take a chance', points: 20, acceptedVariants: ['take a chance', 'gamble', 'risk it'], displayOrder: 3 },
          { id: 'p4-q5-a4', text: 'Stop worrying', points: 15, acceptedVariants: ['stop worrying', 'don\'t worry', 'wag mag-alala'], displayOrder: 4 },
          { id: 'p4-q5-a5', text: 'Let someone else decide', points: 10, acceptedVariants: ['let someone else decide', 'ikaw na bahala'], displayOrder: 5 },
        ],
      },
    ],
  },

  // 5. Love, Dating & Relationships
  {
    id: 'pack-love-dating-relationships',
    title: 'Love, Dating & Relationships',
    description: 'Pinoy date spots, couple arguments, thoughtful gifts, secret crush signs, and anniversary routines.',
    category: 'Love, Dating & Relationships',
    isBuiltIn: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    questions: [
      {
        id: 'p5-q1',
        prompt: 'Name a common date destination for Filipino couples.',
        category: 'Love, Dating & Relationships',
        answers: [
          { id: 'p5-q1-a1', text: 'Mall', points: 30, acceptedVariants: ['mall', 'shopping mall', 'sm', 'ayala'], displayOrder: 1 },
          { id: 'p5-q1-a2', text: 'Restaurant', points: 25, acceptedVariants: ['restaurant', 'dinner', 'kainan'], displayOrder: 2 },
          { id: 'p5-q1-a3', text: 'Cinema', points: 20, acceptedVariants: ['cinema', 'movie theater', 'movies', 'sine'], displayOrder: 3 },
          { id: 'p5-q1-a4', text: 'Coffee shop', points: 15, acceptedVariants: ['coffee shop', 'cafe', 'starbucks'], displayOrder: 4 },
          { id: 'p5-q1-a5', text: 'Park', points: 10, acceptedVariants: ['park', 'luneta', 'bgc'], displayOrder: 5 },
        ],
      },
      {
        id: 'p5-q2',
        prompt: 'Name something couples commonly argue about.',
        category: 'Love, Dating & Relationships',
        answers: [
          { id: 'p5-q2-a1', text: 'Jealousy', points: 30, acceptedVariants: ['jealousy', 'selos', 'selos / jealousy'], displayOrder: 1 },
          { id: 'p5-q2-a2', text: 'Lack of time', points: 25, acceptedVariants: ['lack of time', 'time', 'walang time', 'no time'], displayOrder: 2 },
          { id: 'p5-q2-a3', text: 'Misunderstandings', points: 20, acceptedVariants: ['misunderstandings', 'miscommunication', 'away'], displayOrder: 3 },
          { id: 'p5-q2-a4', text: 'Money', points: 15, acceptedVariants: ['money', 'pera', 'gastos'], displayOrder: 4 },
          { id: 'p5-q2-a5', text: 'Late replies', points: 10, acceptedVariants: ['late replies', 'seen', 'hindi nagreply', 'slow reply'], displayOrder: 5 },
        ],
      },
      {
        id: 'p5-q3',
        prompt: 'Name something a Filipino might give their partner.',
        category: 'Love, Dating & Relationships',
        answers: [
          { id: 'p5-q3-a1', text: 'Flowers', points: 30, acceptedVariants: ['flowers', 'roses', 'bouquet'], displayOrder: 1 },
          { id: 'p5-q3-a2', text: 'Chocolates', points: 25, acceptedVariants: ['chocolates', 'chocolate', 'tsokolate'], displayOrder: 2 },
          { id: 'p5-q3-a3', text: 'Stuffed toy', points: 20, acceptedVariants: ['stuffed toy', 'teddy bear', 'bear'], displayOrder: 3 },
          { id: 'p5-q3-a4', text: 'Jewelry', points: 15, acceptedVariants: ['jewelry', 'ring', 'necklace', 'bracelet'], displayOrder: 4 },
          { id: 'p5-q3-a5', text: 'Handwritten letter', points: 10, acceptedVariants: ['handwritten letter', 'love letter', 'letter', 'card'], displayOrder: 5 },
        ],
      },
      {
        id: 'p5-q4',
        prompt: 'Name a sign that someone has a crush on you.',
        category: 'Love, Dating & Relationships',
        answers: [
          { id: 'p5-q4-a1', text: 'Keeps looking at you', points: 30, acceptedVariants: ['keeps looking at you', 'eye contact', 'staring', 'tingin ng tingin'], displayOrder: 1 },
          { id: 'p5-q4-a2', text: 'Frequently messages you', points: 25, acceptedVariants: ['frequently messages you', 'chatting', 'texting', 'palaging nag-chachat'], displayOrder: 2 },
          { id: 'p5-q4-a3', text: 'Gets shy around you', points: 20, acceptedVariants: ['gets shy around you', 'shy', 'nahihiya', 'blushing'], displayOrder: 3 },
          { id: 'p5-q4-a4', text: 'Teases you', points: 15, acceptedVariants: ['teases you', 'tinutukso', 'nang-aasar', 'teasing'], displayOrder: 4 },
          { id: 'p5-q4-a5', text: 'Offers to help you', points: 10, acceptedVariants: ['offers to help you', 'helping', 'tumutulong'], displayOrder: 5 },
        ],
      },
      {
        id: 'p5-q5',
        prompt: 'Name something couples do on an anniversary.',
        category: 'Love, Dating & Relationships',
        answers: [
          { id: 'p5-q5-a1', text: 'Go on a date', points: 30, acceptedVariants: ['go on a date', 'date', 'romantic dinner', 'dinner'], displayOrder: 1 },
          { id: 'p5-q5-a2', text: 'Exchange gifts', points: 25, acceptedVariants: ['exchange gifts', 'give gifts', 'gifts', 'regalo'], displayOrder: 2 },
          { id: 'p5-q5-a3', text: 'Take pictures', points: 20, acceptedVariants: ['take pictures', 'photoshoot', 'pictures', 'selfie'], displayOrder: 3 },
          { id: 'p5-q5-a4', text: 'Eat together', points: 15, acceptedVariants: ['eat together', 'eat out', 'fancy dinner', 'kain'], displayOrder: 4 },
          { id: 'p5-q5-a5', text: 'Post on social media', points: 10, acceptedVariants: ['post on social media', 'sweet post', 'facebook post', 'instagram story'], displayOrder: 5 },
        ],
      },
    ],
  },

  // 6. Work & Office Life
  {
    id: 'pack-work-office-life',
    title: 'Work & Office Life',
    description: 'Commute traffic, payday hype, desk clutter, file leaves, and sudden manager meetings.',
    category: 'Work & Office Life',
    isBuiltIn: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    questions: [
      {
        id: 'p6-q1',
        prompt: 'Name a reason an employee arrives late to work.',
        category: 'Work & Office Life',
        answers: [
          { id: 'p6-q1-a1', text: 'Traffic', points: 35, acceptedVariants: ['traffic', 'heavy traffic', 'edsa traffic', 'trapik'], displayOrder: 1 },
          { id: 'p6-q1-a2', text: 'Overslept', points: 25, acceptedVariants: ['overslept', 'tanghali nagising', 'late wake up'], displayOrder: 2 },
          { id: 'p6-q1-a3', text: 'Rain', points: 15, acceptedVariants: ['rain', 'baha', 'flood', 'ulan'], displayOrder: 3 },
          { id: 'p6-q1-a4', text: 'Public transportation delays', points: 15, acceptedVariants: ['public transportation delays', 'commute', 'mrt breakdown', 'jeep', 'bus'], displayOrder: 4 },
          { id: 'p6-q1-a5', text: 'Personal emergency', points: 10, acceptedVariants: ['personal emergency', 'emergency', 'family emergency'], displayOrder: 5 },
        ],
      },
      {
        id: 'p6-q2',
        prompt: 'Name something employees look forward to.',
        category: 'Work & Office Life',
        answers: [
          { id: 'p6-q2-a1', text: 'Payday', points: 35, acceptedVariants: ['payday', 'sahod', 'sweldo', 'salary'], displayOrder: 1 },
          { id: 'p6-q2-a2', text: 'Weekend', points: 25, acceptedVariants: ['weekend', 'saturday', 'sabado'], displayOrder: 2 },
          { id: 'p6-q2-a3', text: 'Holidays', points: 20, acceptedVariants: ['holidays', 'holiday', 'walang pasok', 'long weekend'], displayOrder: 3 },
          { id: 'p6-q2-a4', text: 'Lunch break', points: 10, acceptedVariants: ['lunch break', 'lunch', 'break', 'breaktime'], displayOrder: 4 },
          { id: 'p6-q2-a5', text: 'Vacation leave', points: 10, acceptedVariants: ['vacation leave', 'leave', 'pto', 'vl'], displayOrder: 5 },
        ],
      },
      {
        id: 'p6-q3',
        prompt: 'Name something found on an office desk.',
        category: 'Work & Office Life',
        answers: [
          { id: 'p6-q3-a1', text: 'Computer', points: 30, acceptedVariants: ['computer', 'laptop', 'monitor', 'pc'], displayOrder: 1 },
          { id: 'p6-q3-a2', text: 'Papers', points: 25, acceptedVariants: ['papers', 'documents', 'files'], displayOrder: 2 },
          { id: 'p6-q3-a3', text: 'Pens', points: 20, acceptedVariants: ['pens', 'pen', 'ballpen'], displayOrder: 3 },
          { id: 'p6-q3-a4', text: 'Coffee', points: 15, acceptedVariants: ['coffee', 'mug', 'coffee cup', 'kape'], displayOrder: 4 },
          { id: 'p6-q3-a5', text: 'Phone', points: 10, acceptedVariants: ['phone', 'mobile phone', 'cellphone'], displayOrder: 5 },
        ],
      },
      {
        id: 'p6-q4',
        prompt: 'Name a common reason employees request leave.',
        category: 'Work & Office Life',
        answers: [
          { id: 'p6-q4-a1', text: 'Sickness', points: 30, acceptedVariants: ['sickness', 'sick', 'sick leave', 'sl', 'may sakit'], displayOrder: 1 },
          { id: 'p6-q4-a2', text: 'Family matters', points: 25, acceptedVariants: ['family matters', 'family emergency', 'family event'], displayOrder: 2 },
          { id: 'p6-q4-a3', text: 'Vacation', points: 20, acceptedVariants: ['vacation', 'trip', 'travel', 'outing'], displayOrder: 3 },
          { id: 'p6-q4-a4', text: 'Personal errands', points: 15, acceptedVariants: ['personal errands', 'errands', 'government papers'], displayOrder: 4 },
          { id: 'p6-q4-a5', text: 'Important appointments', points: 10, acceptedVariants: ['important appointments', 'doctor appointment', 'checkup'], displayOrder: 5 },
        ],
      },
      {
        id: 'p6-q5',
        prompt: 'Name something people do when the boss says, "May meeting tayo."',
        category: 'Work & Office Life',
        answers: [
          { id: 'p6-q5-a1', text: 'Prepare reports', points: 30, acceptedVariants: ['prepare reports', 'reports', 'review slides', 'prep'], displayOrder: 1 },
          { id: 'p6-q5-a2', text: 'Check their schedule', points: 25, acceptedVariants: ['check their schedule', 'check calendar', 'schedule'], displayOrder: 2 },
          { id: 'p6-q5-a3', text: 'Feel nervous', points: 20, acceptedVariants: ['feel nervous', 'kinakabahan', 'kabahan', 'panic'], displayOrder: 3 },
          { id: 'p6-q5-a4', text: 'Open their laptop', points: 15, acceptedVariants: ['open their laptop', 'laptop', 'bring laptop', 'notepad'], displayOrder: 4 },
          { id: 'p6-q5-a5', text: 'Ask what the meeting is about', points: 10, acceptedVariants: ['ask what the meeting is about', 'ask colleagues', 'tanong bakit'], displayOrder: 5 },
        ],
      },
    ],
  },

  // 7. Social Media & Internet Trends
  {
    id: 'pack-social-media-internet-trends',
    title: 'Social Media & Internet Trends',
    description: 'Favorite apps, Facebook posts, deleted posts, viral reactions, and getting left on read.',
    category: 'Social Media & Internet Trends',
    isBuiltIn: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    questions: [
      {
        id: 'p7-q1',
        prompt: 'Name a social media platform Filipinos commonly use.',
        category: 'Social Media & Internet Trends',
        answers: [
          { id: 'p7-q1-a1', text: 'Facebook', points: 35, acceptedVariants: ['facebook', 'fb', 'meta'], displayOrder: 1 },
          { id: 'p7-q1-a2', text: 'TikTok', points: 25, acceptedVariants: ['tiktok', 'tik tok'], displayOrder: 2 },
          { id: 'p7-q1-a3', text: 'YouTube', points: 20, acceptedVariants: ['youtube', 'yt'], displayOrder: 3 },
          { id: 'p7-q1-a4', text: 'Instagram', points: 10, acceptedVariants: ['instagram', 'ig'], displayOrder: 4 },
          { id: 'p7-q1-a5', text: 'Messenger', points: 10, acceptedVariants: ['messenger', 'fb messenger'], displayOrder: 5 },
        ],
      },
      {
        id: 'p7-q2',
        prompt: 'Name something people post on Facebook.',
        category: 'Social Media & Internet Trends',
        answers: [
          { id: 'p7-q2-a1', text: 'Photos', points: 30, acceptedVariants: ['photos', 'pictures', 'selfies'], displayOrder: 1 },
          { id: 'p7-q2-a2', text: 'Life updates', points: 25, acceptedVariants: ['life updates', 'status', 'milestones', 'stories'], displayOrder: 2 },
          { id: 'p7-q2-a3', text: 'Memes', points: 20, acceptedVariants: ['memes', 'funny memes', 'jokes'], displayOrder: 3 },
          { id: 'p7-q2-a4', text: 'Food pictures', points: 15, acceptedVariants: ['food pictures', 'food', 'kain'], displayOrder: 4 },
          { id: 'p7-q2-a5', text: 'Relationship status', points: 10, acceptedVariants: ['relationship status', 'in a relationship', 'single'], displayOrder: 5 },
        ],
      },
      {
        id: 'p7-q3',
        prompt: 'Name a reason someone deletes a social media post.',
        category: 'Social Media & Internet Trends',
        answers: [
          { id: 'p7-q3-a1', text: 'Embarrassing content', points: 30, acceptedVariants: ['embarrassing content', 'cringe', 'embarrassing', 'nakakahiya'], displayOrder: 1 },
          { id: 'p7-q3-a2', text: 'Negative comments', points: 25, acceptedVariants: ['negative comments', 'bashers', 'hate comments', 'criticism'], displayOrder: 2 },
          { id: 'p7-q3-a3', text: 'Wrong information', points: 20, acceptedVariants: ['wrong information', 'typo', 'mistake', 'mali'], displayOrder: 3 },
          { id: 'p7-q3-a4', text: 'Low engagement', points: 15, acceptedVariants: ['low engagement', 'walang likes', 'no likes', 'few likes'], displayOrder: 4 },
          { id: 'p7-q3-a5', text: 'Changed their mind', points: 10, acceptedVariants: ['changed their mind', 'regret', 'nagbago ang isip'], displayOrder: 5 },
        ],
      },
      {
        id: 'p7-q4',
        prompt: 'Name something people do when a post goes viral.',
        category: 'Social Media & Internet Trends',
        answers: [
          { id: 'p7-q4-a1', text: 'Share it', points: 30, acceptedVariants: ['share it', 'share', 'retweet'], displayOrder: 1 },
          { id: 'p7-q4-a2', text: 'Comment on it', points: 25, acceptedVariants: ['comment on it', 'comment', 'leave a comment'], displayOrder: 2 },
          { id: 'p7-q4-a3', text: 'Make memes', points: 20, acceptedVariants: ['make memes', 'memes', 'parody'], displayOrder: 3 },
          { id: 'p7-q4-a4', text: 'Create a reaction video', points: 15, acceptedVariants: ['create a reaction video', 'reaction video', 'react', 'stitch'], displayOrder: 4 },
          { id: 'p7-q4-a5', text: 'Follow the creator', points: 10, acceptedVariants: ['follow the creator', 'follow', 'subscribe'], displayOrder: 5 },
        ],
      },
      {
        id: 'p7-q5',
        prompt: 'Name a reason someone leaves you on "seen."',
        category: 'Social Media & Internet Trends',
        answers: [
          { id: 'p7-q5-a1', text: 'Busy', points: 30, acceptedVariants: ['busy', 'may ginagawa', 'working'], displayOrder: 1 },
          { id: 'p7-q5-a2', text: 'Forgot to reply', points: 25, acceptedVariants: ['forgot to reply', 'nakalimutan', 'forgot'], displayOrder: 2 },
          { id: 'p7-q5-a3', text: 'Doesn\'t know what to say', points: 20, acceptedVariants: ['doesn\'t know what to say', 'no words', 'awkward'], displayOrder: 3 },
          { id: 'p7-q5-a4', text: 'Not interested', points: 15, acceptedVariants: ['not interested', 'walang interest', 'ayaw kausap'], displayOrder: 4 },
          { id: 'p7-q5-a5', text: 'Intentionally ignoring you', points: 10, acceptedVariants: ['intentionally ignoring you', 'ghosting', 'ignoring', 'snob'], displayOrder: 5 },
        ],
      },
    ],
  },

  // 8. Philippine Geography & Trivia
  {
    id: 'pack-philippine-geography-trivia',
    title: 'Philippine Geography & Trivia',
    description: 'Famous tourist spots, 3 island groups, beach provinces, volcanic landmarks, and shopping destinations.',
    category: 'Philippine Geography & Trivia',
    isBuiltIn: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    questions: [
      {
        id: 'p8-q1',
        prompt: 'Name a famous tourist destination in the Philippines.',
        category: 'Philippine Geography & Trivia',
        answers: [
          { id: 'p8-q1-a1', text: 'Boracay', points: 30, acceptedVariants: ['boracay', 'bora', 'boracay island'], displayOrder: 1 },
          { id: 'p8-q1-a2', text: 'Palawan', points: 25, acceptedVariants: ['palawan', 'el nido', 'coron'], displayOrder: 2 },
          { id: 'p8-q1-a3', text: 'Baguio', points: 20, acceptedVariants: ['baguio', 'baguio city'], displayOrder: 3 },
          { id: 'p8-q1-a4', text: 'Cebu', points: 15, acceptedVariants: ['cebu', 'cebu city'], displayOrder: 4 },
          { id: 'p8-q1-a5', text: 'Siargao', points: 10, acceptedVariants: ['siargao', 'siargao island'], displayOrder: 5 },
        ],
      },
      {
        // Explicitly 3 answers as required
        id: 'p8-q2',
        prompt: 'Name a major island group in the Philippines.',
        category: 'Philippine Geography & Trivia',
        answers: [
          { id: 'p8-q2-a1', text: 'Luzon', points: 40, acceptedVariants: ['luzon'], displayOrder: 1 },
          { id: 'p8-q2-a2', text: 'Visayas', points: 35, acceptedVariants: ['visayas', 'bisaya'], displayOrder: 2 },
          { id: 'p8-q2-a3', text: 'Mindanao', points: 25, acceptedVariants: ['mindanao'], displayOrder: 3 },
        ],
      },
      {
        id: 'p8-q3',
        prompt: 'Name a Philippine province known for its beaches.',
        category: 'Philippine Geography & Trivia',
        answers: [
          { id: 'p8-q3-a1', text: 'Palawan', points: 30, acceptedVariants: ['palawan', 'el nido', 'coron'], displayOrder: 1 },
          { id: 'p8-q3-a2', text: 'Cebu', points: 25, acceptedVariants: ['cebu', 'mactan', 'bantayan'], displayOrder: 2 },
          { id: 'p8-q3-a3', text: 'Batangas', points: 20, acceptedVariants: ['batangas', 'nasugbu', 'laiya', 'calatagan'], displayOrder: 3 },
          { id: 'p8-q3-a4', text: 'Bohol', points: 15, acceptedVariants: ['bohol', 'panglao'], displayOrder: 4 },
          { id: 'p8-q3-a5', text: 'Zambales', points: 10, acceptedVariants: ['zambales', 'anawangin', 'subic'], displayOrder: 5 },
        ],
      },
      {
        id: 'p8-q4',
        prompt: 'Name a famous mountain or volcano in the Philippines.',
        category: 'Philippine Geography & Trivia',
        answers: [
          { id: 'p8-q4-a1', text: 'Mayon Volcano', points: 30, acceptedVariants: ['mayon', 'mayon volcano', 'bulkang mayon', 'albay'], displayOrder: 1 },
          { id: 'p8-q4-a2', text: 'Mount Apo', points: 25, acceptedVariants: ['mount apo', 'mt apo', 'apo'], displayOrder: 2 },
          { id: 'p8-q4-a3', text: 'Taal Volcano', points: 20, acceptedVariants: ['taal', 'taal volcano', 'bulkang taal'], displayOrder: 3 },
          { id: 'p8-q4-a4', text: 'Mount Pulag', points: 15, acceptedVariants: ['mount pulag', 'mt pulag', 'pulag'], displayOrder: 4 },
          { id: 'p8-q4-a5', text: 'Mount Pinatubo', points: 10, acceptedVariants: ['mount pinatubo', 'mt pinatubo', 'pinatubo'], displayOrder: 5 },
        ],
      },
      {
        id: 'p8-q5',
        prompt: 'Name a city people commonly visit for shopping.',
        category: 'Philippine Geography & Trivia',
        answers: [
          { id: 'p8-q5-a1', text: 'Manila', points: 30, acceptedVariants: ['manila', 'divisoria', 'metro manila'], displayOrder: 1 },
          { id: 'p8-q5-a2', text: 'Quezon City', points: 25, acceptedVariants: ['quezon city', 'qc', 'cubao'], displayOrder: 2 },
          { id: 'p8-q5-a3', text: 'Cebu City', points: 20, acceptedVariants: ['cebu city', 'cebu'], displayOrder: 3 },
          { id: 'p8-q5-a4', text: 'Makati', points: 15, acceptedVariants: ['makati', 'makati city', 'glorietta', 'greenbelt'], displayOrder: 4 },
          { id: 'p8-q5-a5', text: 'Davao City', points: 10, acceptedVariants: ['davao city', 'davao'], displayOrder: 5 },
        ],
      },
    ],
  },

  // 9. Funny Filipino Habits
  {
    id: 'pack-funny-filipino-habits',
    title: 'Funny Filipino Habits',
    description: 'Busog na ako moments, ice cream tubs as ulam storage, surprise visitors, balot-balot, and brownout survival.',
    category: 'Funny Filipino Habits',
    isBuiltIn: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    questions: [
      {
        id: 'p9-q1',
        prompt: 'Name something a Filipino does when a visitor says, "Busog na ako."',
        category: 'Funny Filipino Habits',
        answers: [
          { id: 'p9-q1-a1', text: 'Offers more food', points: 35, acceptedVariants: ['offers more food', 'kain pa', 'kumain ka pa', 'alok pa'], displayOrder: 1 },
          { id: 'p9-q1-a2', text: 'Says "konti na lang"', points: 25, acceptedVariants: ['says "konti na lang"', 'konti na lang', 'tikman mo lang'], displayOrder: 2 },
          { id: 'p9-q1-a3', text: 'Packs food for them', points: 20, acceptedVariants: ['packs food for them', 'balot', 'magbalot', 'take out'], displayOrder: 3 },
          { id: 'p9-q1-a4', text: 'Offers dessert', points: 12, acceptedVariants: ['offers dessert', 'dessert', 'matamis'], displayOrder: 4 },
          { id: 'p9-q1-a5', text: 'Finally stops offering', points: 8, acceptedVariants: ['finally stops offering', 'tumigil', 'stops'], displayOrder: 5 },
        ],
      },
      {
        id: 'p9-q2',
        prompt: 'Name something Filipinos use an ice cream tub for after the ice cream is gone.',
        category: 'Funny Filipino Habits',
        answers: [
          { id: 'p9-q2-a1', text: 'Frozen leftovers', points: 35, acceptedVariants: ['frozen leftovers', 'leftovers', 'tirang ulam', 'frozen food'], displayOrder: 1 },
          { id: 'p9-q2-a2', text: 'Ulam storage', points: 25, acceptedVariants: ['ulam storage', 'ulam', 'isda', 'karne', 'meat'], displayOrder: 2 },
          { id: 'p9-q2-a3', text: 'Rice or other food', points: 20, acceptedVariants: ['rice or other food', 'kanin', 'rice', 'sabaw'], displayOrder: 3 },
          { id: 'p9-q2-a4', text: 'Small household items', points: 12, acceptedVariants: ['small household items', 'sewing kit', 'karayom', 'buttons'], displayOrder: 4 },
          { id: 'p9-q2-a5', text: 'Actually stores ice cream', points: 8, acceptedVariants: ['actually stores ice cream', 'ice cream', 'ice'], displayOrder: 5 },
        ],
      },
      {
        id: 'p9-q3',
        prompt: 'What might a Filipino do when visitors arrive unexpectedly?',
        category: 'Funny Filipino Habits',
        answers: [
          { id: 'p9-q3-a1', text: 'Offer food', points: 30, acceptedVariants: ['offer food', 'maghanda ng pagkain', 'kain', 'cook food'], displayOrder: 1 },
          { id: 'p9-q3-a2', text: 'Clean up quickly', points: 25, acceptedVariants: ['clean up quickly', 'magligpit', 'tago kalat', 'tidy up'], displayOrder: 2 },
          { id: 'p9-q3-a3', text: 'Prepare coffee', points: 20, acceptedVariants: ['prepare coffee', 'timpla ng kape', 'coffee', 'kape'], displayOrder: 3 },
          { id: 'p9-q3-a4', text: 'Call other family members', points: 15, acceptedVariants: ['call other family members', 'tawagin ang pamilya', 'tawagin si nanay'], displayOrder: 4 },
          { id: 'p9-q3-a5', text: 'Apologize for the messy house', points: 10, acceptedVariants: ['apologize for the messy house', 'pasensya na magulo', 'pasensya na sa kalat'], displayOrder: 5 },
        ],
      },
      {
        id: 'p9-q4',
        prompt: 'Name something Filipinos bring home from a party.',
        category: 'Funny Filipino Habits',
        answers: [
          { id: 'p9-q4-a1', text: 'Leftover food', points: 35, acceptedVariants: ['leftover food', 'balot', 'shanghai', 'lechon', 'tirang pagkain'], displayOrder: 1 },
          { id: 'p9-q4-a2', text: 'Goodie bag', points: 25, acceptedVariants: ['goodie bag', 'loot bag', 'souvenir'], displayOrder: 2 },
          { id: 'p9-q4-a3', text: 'Cake', points: 15, acceptedVariants: ['cake', 'birthday cake'], displayOrder: 3 },
          { id: 'p9-q4-a4', text: 'Extra drinks', points: 15, acceptedVariants: ['extra drinks', 'softdrinks', 'beer', 'soda'], displayOrder: 4 },
          { id: 'p9-q4-a5', text: 'Disposable containers', points: 10, acceptedVariants: ['disposable containers', 'microwavable', 'tupperware'], displayOrder: 5 },
        ],
      },
      {
        id: 'p9-q5',
        prompt: 'Name something a Filipino does when the electricity goes out.',
        category: 'Funny Filipino Habits',
        answers: [
          { id: 'p9-q5-a1', text: 'Gets a fan or pamaypay', points: 30, acceptedVariants: ['gets a fan or pamaypay', 'pamaypay', 'paypay', 'fan'], displayOrder: 1 },
          { id: 'p9-q5-a2', text: 'Checks the breaker', points: 25, acceptedVariants: ['checks the breaker', 'main switch', 'breaker'], displayOrder: 2 },
          { id: 'p9-q5-a3', text: 'Looks for a flashlight', points: 20, acceptedVariants: ['looks for a flashlight', 'flashlight', 'kandila', 'candle', 'emergency light'], displayOrder: 3 },
          { id: 'p9-q5-a4', text: 'Complains about the heat', points: 15, acceptedVariants: ['complains about the heat', 'ang init', 'mainit'], displayOrder: 4 },
          { id: 'p9-q5-a5', text: 'Checks when power will return', points: 10, acceptedVariants: ['checks when power will return', 'checks meralco', 'brownout update'], displayOrder: 5 },
        ],
      },
    ],
  },

  // 10. Sports & Basketball
  {
    id: 'pack-sports-basketball',
    title: 'Sports & Basketball',
    description: 'Pinoy sports culture, barangay liga scenes, pickup game drama, scoring celebrations, and basketball icons.',
    category: 'Sports & Basketball',
    isBuiltIn: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    questions: [
      {
        id: 'p10-q1',
        prompt: 'Name a sport Filipinos commonly play.',
        category: 'Sports & Basketball',
        answers: [
          { id: 'p10-q1-a1', text: 'Basketball', points: 40, acceptedVariants: ['basketball', 'basketbol', 'baskol'], displayOrder: 1 },
          { id: 'p10-q1-a2', text: 'Volleyball', points: 25, acceptedVariants: ['volleyball', 'bolibol'], displayOrder: 2 },
          { id: 'p10-q1-a3', text: 'Badminton', points: 15, acceptedVariants: ['badminton'], displayOrder: 3 },
          { id: 'p10-q1-a4', text: 'Boxing', points: 10, acceptedVariants: ['boxing', 'boksing', 'pacquiao'], displayOrder: 4 },
          { id: 'p10-q1-a5', text: 'Football', points: 10, acceptedVariants: ['football', 'soccer'], displayOrder: 5 },
        ],
      },
      {
        id: 'p10-q2',
        prompt: 'Name something you commonly see at a barangay basketball court.',
        category: 'Sports & Basketball',
        answers: [
          { id: 'p10-q2-a1', text: 'Basketball hoop', points: 30, acceptedVariants: ['basketball hoop', 'ring', 'shooting ring', 'board'], displayOrder: 1 },
          { id: 'p10-q2-a2', text: 'Players in jerseys', points: 25, acceptedVariants: ['players in jerseys', 'jersey', 'players', 'nba jersey'], displayOrder: 2 },
          { id: 'p10-q2-a3', text: 'Spectators', points: 20, acceptedVariants: ['spectators', 'crowd', 'nanonood', 'fans'], displayOrder: 3 },
          { id: 'p10-q2-a4', text: 'Scoreboard', points: 15, acceptedVariants: ['scoreboard', 'score', 'scorekeeper'], displayOrder: 4 },
          { id: 'p10-q2-a5', text: 'Plastic chairs', points: 10, acceptedVariants: ['plastic chairs', 'monobloc', 'bangko', 'chairs'], displayOrder: 5 },
        ],
      },
      {
        id: 'p10-q3',
        prompt: 'Name a reason someone gets picked last in basketball.',
        category: 'Sports & Basketball',
        answers: [
          { id: 'p10-q3-a1', text: 'Not good at shooting', points: 30, acceptedVariants: ['not good at shooting', 'can\'t shoot', 'bano', 'bano mag-shoot'], displayOrder: 1 },
          { id: 'p10-q3-a2', text: 'Doesn\'t know how to play well', points: 25, acceptedVariants: ['doesn\'t know how to play well', 'hindi marunong', 'walang skills'], displayOrder: 2 },
          { id: 'p10-q3-a3', text: 'Shorter than other players', points: 20, acceptedVariants: ['shorter than other players', 'short', 'pandak', 'maliit'], displayOrder: 3 },
          { id: 'p10-q3-a4', text: 'Gets tired easily', points: 15, acceptedVariants: ['gets tired easily', 'madaling mapagod', 'hingalin', 'slow'], displayOrder: 4 },
          { id: 'p10-q3-a5', text: 'Nobody knows them', points: 10, acceptedVariants: ['nobody knows them', 'stranger', 'dayo', 'di kilala'], displayOrder: 5 },
        ],
      },
      {
        id: 'p10-q4',
        prompt: 'Name something a basketball player does after scoring.',
        category: 'Sports & Basketball',
        answers: [
          { id: 'p10-q4-a1', text: 'Celebrates', points: 30, acceptedVariants: ['celebrates', 'flex', 'sigaw', 'celebration'], displayOrder: 1 },
          { id: 'p10-q4-a2', text: 'Runs back on defense', points: 25, acceptedVariants: ['runs back on defense', 'defense', 'back on defense', 'balik depensa'], displayOrder: 2 },
          { id: 'p10-q4-a3', text: 'High-fives teammates', points: 20, acceptedVariants: ['high-fives teammates', 'high five', 'apir'], displayOrder: 3 },
          { id: 'p10-q4-a4', text: 'Trash-talks', points: 15, acceptedVariants: ['trash-talks', 'trash talk', 'asar', 'yabang'], displayOrder: 4 },
          { id: 'p10-q4-a5', text: 'Points to the crowd', points: 10, acceptedVariants: ['points to the crowd', 'points to fans', 'point'], displayOrder: 5 },
        ],
      },
      {
        id: 'p10-q5',
        prompt: 'Name a famous Filipino basketball player.',
        category: 'Sports & Basketball',
        answers: [
          { id: 'p10-q5-a1', text: 'June Mar Fajardo', points: 30, acceptedVariants: ['june mar fajardo', 'fajardo', 'june mar', 'kraken'], displayOrder: 1 },
          { id: 'p10-q5-a2', text: 'Robert Jaworski', points: 25, acceptedVariants: ['robert jaworski', 'jaworski', 'jawo', 'big j'], displayOrder: 2 },
          { id: 'p10-q5-a3', text: 'James Yap', points: 20, acceptedVariants: ['james yap', 'yap', 'big game james'], displayOrder: 3 },
          { id: 'p10-q5-a4', text: 'Calvin Abueva', points: 15, acceptedVariants: ['calvin abueva', 'abueva', 'the beast'], displayOrder: 4 },
          { id: 'p10-q5-a5', text: 'Kai Sotto', points: 10, acceptedVariants: ['kai sotto', 'sotto', 'kai'], displayOrder: 5 },
        ],
      },
    ],
  },
];

/**
 * Validates that question points are positive and sum to 100,
 * and that answers count is between 3 and 10.
 */
export function validateQuestionPoints(question: { answers: { points: number; text: string }[] }): {
  valid: boolean;
  total: number;
  message?: string;
} {
  const total = question.answers.reduce((sum, ans) => sum + ans.points, 0);
  const allPositive = question.answers.every((ans) => typeof ans.points === 'number' && ans.points > 0);

  if (!allPositive) {
    return { valid: false, total, message: 'All answers must have positive point values greater than 0.' };
  }

  if (total !== 100) {
    return { valid: false, total, message: `Points must total exactly 100 (current total: ${total}).` };
  }

  return { valid: true, total };
}
