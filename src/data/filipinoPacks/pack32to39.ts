import type { QuestionPack } from '../../types/game';

export const PACKS_32_TO_39: QuestionPack[] = [
  // PACK 32: Elementary Days
  {
    id: 'pack_ph_32',
    title: 'Elementary Days',
    description: 'Mga kwelang alaala noong elementary—mula sa recess, flag ceremony, hanggang sa mga gamit sa bag.',
    category: 'Education',
    isBuiltIn: true,
    createdAt: '2026-11-04T00:00:00.000Z',
    updatedAt: '2026-11-04T00:00:00.000Z',
    questions: [
      {
        id: 'ph_32_q1',
        prompt: 'Bukod sa ballpen at papel, ano ang laging laman ng pencil case o bag ng elementary student?',
        category: 'Education',
        answers: [
          { id: 'ph_32_q1_a1', text: 'Mongol Pencil / Lapis', points: 38, acceptedVariants: ['mongol lapis', 'lapis', 'pencil', 'mongol'], displayOrder: 1 },
          { id: 'ph_32_q1_a2', text: 'Eraser / Pambura', points: 28, acceptedVariants: ['eraser', 'pambura', 'pambura ng lapis'], displayOrder: 2 },
          { id: 'ph_32_q1_a3', text: 'Crayola / Crayon', points: 20, acceptedVariants: ['crayola', 'crayons', 'pangkulay', 'krayola'], displayOrder: 3 },
          { id: 'ph_32_q1_a4', text: 'Pantasa / Sharpener', points: 14, acceptedVariants: ['pantasa', 'sharpener', 'tasa', 'pantasa ng lapis'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_32_q2',
        prompt: 'Ano ang paboritong bilhin ng mga bata sa canteen o labas ng gate kapag recess?',
        category: 'Education',
        answers: [
          { id: 'ph_32_q2_a1', text: 'Zesto / Juice drink', points: 35, acceptedVariants: ['zesto', 'juice', 'tetra pak', 'zesto juice', 'inumin'], displayOrder: 1 },
          { id: 'ph_32_q2_a2', text: 'Fishball / Kikiam / Kwek-kwek', points: 25, acceptedVariants: ['fishball', 'kikiam', 'kwek kwek', 'tusok-tusok', 'squidball'], displayOrder: 2 },
          { id: 'ph_32_q2_a3', text: 'Chichirya / Snack pack', points: 18, acceptedVariants: ['chichirya', 'chips', 'sitsirya', 'clover', 'piattos'], displayOrder: 3 },
          { id: 'ph_32_q2_a4', text: 'Ice Pop / Ice candy', points: 12, acceptedVariants: ['ice candy', 'ice pop', 'popsicle'], displayOrder: 4 },
          { id: 'ph_32_q2_a5', text: 'Biscuit / Fudgee Barr', points: 10, acceptedVariants: ['biscuit', 'fudgee barr', 'rebisco', 'mamon'], displayOrder: 5 },
        ],
      },
      {
        id: 'ph_32_q3',
        prompt: 'Ano ang karaniwang parusa ni teacher kapag maingay o makulit ang estudyante sa klase?',
        category: 'Education',
        answers: [
          { id: 'ph_32_q3_a1', text: 'Papatayuin sa sulok o harap ng klase', points: 42, acceptedVariants: ['patayuin', 'nakatayo sa harap', 'tumayo sa sulok', 'standing'], displayOrder: 1 },
          { id: 'ph_32_q3_a2', text: 'Isusulat ang pangalan sa blackboard under "Noise Makers"', points: 28, acceptedVariants: ['noise makers', 'isulat sa board', 'listahan ng maingay'], displayOrder: 2 },
          { id: 'ph_32_q3_a3', text: 'Paglilinisin ng classroom / Mag-bubunot ng sahig', points: 18, acceptedVariants: ['paglinisin', 'magbunot ng floor', 'walis', 'cleaner'], displayOrder: 3 },
          { id: 'ph_32_q3_a4', text: 'Pagbabasahin nang malakas sa harap ng libro', points: 12, acceptedVariants: ['magbasa', 'read aloud', 'basahin ang lesson'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_32_q4',
        prompt: 'Ano ang kinatatakutang mangyari ng isang estudyante tuwing Lunes sa Flag Ceremony?',
        category: 'Education',
        answers: [
          { id: 'ph_32_q4_a1', text: 'Mahimatay sa init ng araw', points: 40, acceptedVariants: ['mahimatay', 'mahilo', 'mag-faint', 'maulanan ng araw'], displayOrder: 1 },
          { id: 'ph_32_q4_a2', text: 'Mahuli sa pila / Late at mailista ng guard', points: 30, acceptedVariants: ['late', 'nahuli', 'mahuli sa gate', 'latecomer'], displayOrder: 2 },
          { id: 'ph_32_q4_a3', text: 'Walang ID o kulang ang uniform', points: 18, acceptedVariants: ['walang id', 'walang ribbon', 'mali ang uniform', 'walang necktie'], displayOrder: 3 },
          { id: 'ph_32_q4_a4', text: 'Tawagin sa stage para mag-lead o mapagalitan', points: 12, acceptedVariants: ['tawagin sa stage', 'tawagin ni principal', 'tawagin'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_32_q5',
        prompt: 'Anong posisyon sa classroom officers ang pinaka-ayaw o pinaka-kinatatakutan ng mga estudyante?',
        category: 'Education',
        answers: [
          { id: 'ph_32_q5_a1', text: 'Peace Officer / Sgt. at Arms', points: 45, acceptedVariants: ['peace officer', 'sergeant at arms', 'sgt at arms', 'tagabantay ng ingay'], displayOrder: 1 },
          { id: 'ph_32_q5_a2', text: 'President', points: 26, acceptedVariants: ['president', 'presidente', 'class president'], displayOrder: 2 },
          { id: 'ph_32_q5_a3', text: 'Treasurer / Taga-singil ng pondo', points: 17, acceptedVariants: ['treasurer', 'tresorera', 'tagasingil', 'tagasingil ng pera'], displayOrder: 3 },
          { id: 'ph_32_q5_a4', text: 'Secretary / Taga-lista ng maingay', points: 12, acceptedVariants: ['secretary', 'sekretarya', 'tagasulat'], displayOrder: 4 },
        ],
      },
    ],
  },

  // PACK 33: Mga Larong Kalye
  {
    id: 'pack_ph_33',
    title: 'Mga Larong Kalye',
    description: 'Mga klasikong larong Pinoy sa kalsada bago mag-dilim o bago tawagin ni Mama para kumain.',
    category: 'Culture & Habits',
    isBuiltIn: true,
    createdAt: '2026-11-04T00:00:00.000Z',
    updatedAt: '2026-11-04T00:00:00.000Z',
    questions: [
      {
        id: 'ph_33_q1',
        prompt: 'Ano ang pinakasikat na larong kalye na nilalaro ng mga batang Pinoy sa hapon?',
        category: 'Culture & Habits',
        answers: [
          { id: 'ph_33_q1_a1', text: 'Patintero', points: 35, acceptedVariants: ['patintero', 'tubigan', 'harangang taga'], displayOrder: 1 },
          { id: 'ph_33_q1_a2', text: 'Tumbang Preso', points: 26, acceptedVariants: ['tumbang preso', 'tumba preso', 'lata'], displayOrder: 2 },
          { id: 'ph_33_q1_a3', text: 'Tagu-taguan / Hide and seek', points: 18, acceptedVariants: ['taguan', 'tagu-taguan', 'hide and seek'], displayOrder: 3 },
          { id: 'ph_33_q1_a4', text: 'Luksong Baka / Luksong Tinik', points: 12, acceptedVariants: ['luksong baka', 'luksong tinik', 'luksong tinik o baka'], displayOrder: 4 },
          { id: 'ph_33_q1_a5', text: 'Piko', points: 9, acceptedVariants: ['piko', 'hopscotch'], displayOrder: 5 },
        ],
      },
      {
        id: 'ph_33_q2',
        prompt: 'Ano ang laging ginagamit na pamato o kagamitan kapag naglalaro ng Tumbang Preso?',
        category: 'Culture & Habits',
        answers: [
          { id: 'ph_33_q2_a1', text: 'Tsinelas', points: 50, acceptedVariants: ['tsinelas', 'slipper', 'rambo', 'spartan'], displayOrder: 1 },
          { id: 'ph_33_q2_a2', text: 'Lata ng gatas o sardinas', points: 30, acceptedVariants: ['lata', 'lata ng gatas', 'can', 'lata ng sardinas'], displayOrder: 2 },
          { id: 'ph_33_q2_a3', text: 'Tisa o chalk pangguhit ng bilog', points: 12, acceptedVariants: ['tisa', 'chalk', 'bato pangguhit', 'guhit'], displayOrder: 3 },
          { id: 'ph_33_q2_a4', text: 'Bato / Pamato na bato', points: 8, acceptedVariants: ['bato', 'pamato'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_33_q3',
        prompt: 'Ano ang karaniwang dahilan kung bakit napuputol o natitigil ang laro sa kalsada?',
        category: 'Culture & Habits',
        answers: [
          { id: 'ph_33_q3_a1', text: 'May dadaan na kotse o tricycle ("Tabi, may sasakyan!")', points: 44, acceptedVariants: ['may dadaan na kotse', 'may sasakyan', 'kotse', 'tricycle', 'tabi'], displayOrder: 1 },
          { id: 'ph_33_q3_a2', text: 'Tinawag na ng nanay para umuwi o maligo', points: 28, acceptedVariants: ['tinawag ni nanay', 'tinawag ni mama', 'tawag ng magulang', 'uwi na'], displayOrder: 2 },
          { id: 'ph_33_q3_a3', text: 'Lumubog na ang araw / Dumilim na', points: 16, acceptedVariants: ['dumilim na', 'gabi na', 'gabi', 'madilim na'], displayOrder: 3 },
          { id: 'ph_33_q3_a4', text: 'May nagkapikunan o nag-away', points: 12, acceptedVariants: ['nagka-pikunan', 'nag-away', 'nag-iyakan', 'may nagalit'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_33_q4',
        prompt: 'Anong salita o linyahan ang karaniwang maririnig kapag naglalaro ng taguan sa kalye?',
        category: 'Culture & Habits',
        answers: [
          { id: 'ph_33_q4_a1', text: '"Tagu-taguan, maliwanag ang buwan!"', points: 46, acceptedVariants: ['tagu-taguan maliwanag ang buwan', 'maliwanag ang buwan', 'pagbilang ng sampu'], displayOrder: 1 },
          { id: 'ph_33_q4_a2', text: '"Bong / Bang! (Huli ka!)"', points: 27, acceptedVariants: ['bong', 'bang', 'huli ka', 'sabay turo'], displayOrder: 2 },
          { id: 'ph_33_q4_a3', text: '"Save! / Ligtas!"', points: 15, acceptedVariants: ['save', 'ligtas', 'nakasave', 'tapak sa base'], displayOrder: 3 },
          { id: 'ph_33_q4_a4', text: '"Sali ako / Saling pusa!"', points: 12, acceptedVariants: ['saling pusa', 'sali ako', 'saling ketket'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_33_q5',
        prompt: 'Ano ang nangyayari sa bata kapag umuwi sa bahay galing sa buong hapong paglalaro sa kalye?',
        category: 'Culture & Habits',
        answers: [
          { id: 'ph_33_q5_a1', text: 'Amoy araw at basang-basa ng pawis ang likod', points: 42, acceptedVariants: ['amoy araw', 'pawis', 'basang basa ng pawis', 'amoy pawis'], displayOrder: 1 },
          { id: 'ph_33_q5_a2', text: 'May lagay na bimpo o panyo sa likod', points: 26, acceptedVariants: ['may bimpo sa likod', 'nilalagyan ng bimpo', 'bimpo', 'tuwalya'], displayOrder: 2 },
          { id: 'ph_33_q5_a3', text: 'May gasgas o dumi sa tuhod at binti', points: 20, acceptedVariants: ['may gasgas', 'sugat sa tuhod', 'madumi ang binti', 'kalmot'], displayOrder: 3 },
          { id: 'ph_33_q5_a4', text: 'Napagalitan dahil hindi nag-merienda o nag-aral', points: 12, acceptedVariants: ['napagalitan', 'sermon ni nanay', 'napalo'], displayOrder: 4 },
        ],
      },
    ],
  },

  // PACK 34: Palengke Adventures
  {
    id: 'pack_ph_34',
    title: 'Palengke Adventures',
    description: 'Ang makulay na karanasan sa palengke—tawaran, wet market, suki, at libreng tangkay ng sibuyas.',
    category: 'Community',
    isBuiltIn: true,
    createdAt: '2026-11-04T00:00:00.000Z',
    updatedAt: '2026-11-04T00:00:00.000Z',
    questions: [
      {
        id: 'ph_34_q1',
        prompt: 'Ano ang laging binibili o pinupuntahan ng nanay sa basang bahagi ng palengke (wet market)?',
        category: 'Community',
        answers: [
          { id: 'ph_34_q1_a1', text: 'Isda / Tilapia / Bangus', points: 40, acceptedVariants: ['isda', 'tilapia', 'bangus', 'galunggong', 'isda sa palengke'], displayOrder: 1 },
          { id: 'ph_34_q1_a2', text: 'Karne ng Baboy / Liempo', points: 30, acceptedVariants: ['karne ng baboy', 'baboy', 'liempo', 'kasim', 'pork'], displayOrder: 2 },
          { id: 'ph_34_q1_a3', text: 'Manok / Whole chicken', points: 18, acceptedVariants: ['manok', 'chicken', 'manok pangkulay'], displayOrder: 3 },
          { id: 'ph_34_q1_a4', text: 'Hipon o Pusit', points: 12, acceptedVariants: ['hipon', 'pusit', 'seafood', 'talaba'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_34_q2',
        prompt: 'Ano ang karaniwang linyahan ng mamimili kapag tumatawad sa tindera sa palengke?',
        category: 'Community',
        answers: [
          { id: 'ph_34_q2_a1', text: '"Ate/Kuya, wala na bang tawad \'to?"', points: 45, acceptedVariants: ['wala na bang tawad', 'baka pwede tawad', 'pwede tumawad'], displayOrder: 1 },
          { id: 'ph_34_q2_a2', text: '"Suki naman ako dito eh!"', points: 28, acceptedVariants: ['suki naman ako', 'suki mo ako', 'suki'], displayOrder: 2 },
          { id: 'ph_34_q2_a3', text: '"Sa kabila mas mura ng sampung piso!"', points: 15, acceptedVariants: ['mas mura sa kabila', 'mura sa kabila', 'doon sa kabila'], displayOrder: 3 },
          { id: 'ph_34_q2_a4', text: '"Pakidagdagan naman ng padas o dagdag!"', points: 12, acceptedVariants: ['padas', 'dagdag', 'dagdagan mo naman', 'pahingi tawad'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_34_q3',
        prompt: 'Ano ang libreng hinihingi ng nanay sa tindera ng gulay bago magbayad?',
        category: 'Community',
        answers: [
          { id: 'ph_34_q3_a1', text: 'Tangkay ng dahon ng sibuyas o celery', points: 44, acceptedVariants: ['dahon ng sibuyas', 'sibuyas dahon', 'celery', 'kintsay'], displayOrder: 1 },
          { id: 'ph_34_q3_a2', text: 'Sibuyas o Bawang na piraso', points: 28, acceptedVariants: ['pirasong bawang', 'sibuyas', 'bawang', 'konting bawang'], displayOrder: 2 },
          { id: 'ph_34_q3_a3', text: 'Sili (Pansahog o panigang)', points: 16, acceptedVariants: ['sili', 'siling panigang', 'labuyo', 'siling haba'], displayOrder: 3 },
          { id: 'ph_34_q3_a4', text: 'Luya o Tanglad', points: 12, acceptedVariants: ['luya', 'tanglad', 'kalamansi'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_34_q4',
        prompt: 'Ano ang dapat ihanda o dalhin bago maglakbay at mamalengke?',
        category: 'Community',
        answers: [
          { id: 'ph_34_q4_a1', text: 'Eco bag o Bayong', points: 42, acceptedVariants: ['eco bag', 'bayong', 'basket', 'supot'], displayOrder: 1 },
          { id: 'ph_34_q4_a2', text: 'Listahan ng bibilhin / Kodigo', points: 28, acceptedVariants: ['listahan', 'listahan ng bibilhin', 'kodigo', 'sulat'], displayOrder: 2 },
          { id: 'ph_34_q4_a3', text: 'Barya at barya-baryang pera', points: 18, acceptedVariants: ['barya', 'barya baryang pera', 'maliit na pera', 'cash'], displayOrder: 3 },
          { id: 'ph_34_q4_a4', text: 'Tsinelas o bota pang-iwas sa putik', points: 12, acceptedVariants: ['bota', 'tsinelas', 'sapatos pang palengke'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_34_q5',
        prompt: 'Ano ang maririnig mong isinisigaw ng mga nagtitinda sa loob ng palengke?',
        category: 'Community',
        answers: [
          { id: 'ph_34_q5_a1', text: '"Bili na kayo, sariwa pa!"', points: 40, acceptedVariants: ['sariwa pa', 'bili na', 'sariwang isda', 'sariwa'], displayOrder: 1 },
          { id: 'ph_34_q5_a2', text: '"Mura lang, piso-piso / bente-bente!"', points: 30, acceptedVariants: ['mura lang', 'bente bente', 'sampu sampu', 'bagsak presyo'], displayOrder: 2 },
          { id: 'ph_34_q5_a3', text: '"Boss / Ma\'am / Suki, ano sa \'yo?"', points: 18, acceptedVariants: ['suki ano sayo', 'ano sa inyo boss', 'ano hanap mo'], displayOrder: 3 },
          { id: 'ph_34_q5_a4', text: '"Timbangan! Sakto timbang dito!"', points: 12, acceptedVariants: ['timbangan', 'walang bawas timbang', 'sakto timbang'], displayOrder: 4 },
        ],
      },
    ],
  },

  // PACK 35: Birthday Party sa Pinas
  {
    id: 'pack_ph_35',
    title: 'Birthday Party sa Pinas',
    description: 'Spaghetti na may condensed milk, hotdog sa marshmallow, parlor games, at Sharonian balot-balot.',
    category: 'Celebrations',
    isBuiltIn: true,
    createdAt: '2026-11-04T00:00:00.000Z',
    updatedAt: '2026-11-04T00:00:00.000Z',
    questions: [
      {
        id: 'ph_35_q1',
        prompt: 'Anong pagkain ang hindi kailanman nawawala sa handaan ng birthday ng batang Pinoy?',
        category: 'Celebrations',
        answers: [
          { id: 'ph_35_q1_a1', text: 'Sweet Filipino Spaghetti', points: 38, acceptedVariants: ['spaghetti', 'spag', 'matamis na spaghetti', 'pinoy spaghetti'], displayOrder: 1 },
          { id: 'ph_35_q1_a2', text: 'Hotdog na may marshmallow sa stick', points: 26, acceptedVariants: ['hotdog na may marshmallow', 'hotdog sa stick', 'marshmallow hotdog'], displayOrder: 2 },
          { id: 'ph_35_q1_a3', text: 'Fried Chicken', points: 18, acceptedVariants: ['fried chicken', 'pritong manok', 'chicken'], displayOrder: 3 },
          { id: 'ph_35_q1_a4', text: 'Birthday Cake na may kandila', points: 11, acceptedVariants: ['birthday cake', 'cake', 'keyk'], displayOrder: 4 },
          { id: 'ph_35_q1_a5', text: 'Lumpiang Shanghai', points: 7, acceptedVariants: ['lumpiang shanghai', 'shanghai', 'lumpia'], displayOrder: 5 },
        ],
      },
      {
        id: 'ph_35_q2',
        prompt: 'Anong parlor game ang laging nilalaro sa children\'s birthday party?',
        category: 'Celebrations',
        answers: [
          { id: 'ph_35_q2_a1', text: 'Stop Dance / Musical Statues', points: 42, acceptedVariants: ['stop dance', 'stop dancing', 'musical statues'], displayOrder: 1 },
          { id: 'ph_35_q2_a2', text: 'Trip to Jerusalem / Musical Chairs', points: 30, acceptedVariants: ['trip to jerusalem', 'musical chairs', 'upuan'], displayOrder: 2 },
          { id: 'ph_35_q2_a3', text: 'Bring Me ("Bring me 1000 peso bill!")', points: 16, acceptedVariants: ['bring me', 'bring me game', 'magdala ng'], displayOrder: 3 },
          { id: 'ph_35_q2_a4', text: 'Pabitin', points: 12, acceptedVariants: ['pabitin', 'bitin', 'habulan ng laruan'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_35_q3',
        prompt: 'Ano ang laging laman ng loot bag na ipinapamigay sa mga bata bago umuwi?',
        category: 'Celebrations',
        answers: [
          { id: 'ph_35_q3_a1', text: 'Kendi at Lollipop', points: 42, acceptedVariants: ['kendi', 'lollipop', 'candy', 'matatamis'], displayOrder: 1 },
          { id: 'ph_35_q3_a2', text: 'Maliit na laruan (Yoyo, pito, o stickers)', points: 28, acceptedVariants: ['maliit na laruan', 'laruan', 'pito', 'stickers', 'yoyo'], displayOrder: 2 },
          { id: 'ph_35_q3_a3', text: 'Chichirya o biskwit', points: 18, acceptedVariants: ['chichirya', 'sitsirya', 'biskwit', 'chips'], displayOrder: 3 },
          { id: 'ph_35_q3_a4', text: 'Lobo (Balloons)', points: 12, acceptedVariants: ['lobo', 'balloon', 'lobo sa stick'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_35_q4',
        prompt: 'Sino ang bisitang palaging present sa birthday party kahit minsan hindi kilala ng may kaarawan?',
        category: 'Celebrations',
        answers: [
          { id: 'ph_35_q4_a1', text: 'Mga kapitbahay na nakatunog ng handaan', points: 40, acceptedVariants: ['kapitbahay', 'kapitbahay na nakikain', 'tsismosang kapitbahay'], displayOrder: 1 },
          { id: 'ph_35_q4_a2', text: 'Barkada ni tatay na naghihintay ng inuman/pulutan', points: 30, acceptedVariants: ['barkada ni tatay', 'kainuman ni papa', 'manginginom'], displayOrder: 2 },
          { id: 'ph_35_q4_a3', text: 'Kalaro ng pinsan ng kapatid', points: 18, acceptedVariants: ['kalaro ng pinsan', 'tropa ng kuya', 'kalaro'], displayOrder: 3 },
          { id: 'ph_35_q4_a4', text: 'Mga kumukuha agad ng pambalot ("Sharon Cuneta")', points: 12, acceptedVariants: ['sharon cuneta', 'tagabalot', 'mga nagbabalot'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_35_q5',
        prompt: 'Ano ang ginagawa ng mga bisita kapag malapit nang matapos ang party?',
        category: 'Celebrations',
        answers: [
          { id: 'ph_35_q5_a1', text: 'Nagbabalot ng tirang pagkain ("Sharon")', points: 48, acceptedVariants: ['nagbabalot', 'sharon', 'balot balot', 'magbalot ng shanghai'], displayOrder: 1 },
          { id: 'ph_35_q5_a2', text: 'Nagpapa-picture kasama ang may birthday sa harap ng tarp', points: 26, acceptedVariants: ['picture picture', 'picture sa tarp', 'kodakan'], displayOrder: 2 },
          { id: 'ph_35_q5_a3', text: 'Nagkakantahan sa videoke', points: 16, acceptedVariants: ['videoke', 'kantahan', 'karaoke'], displayOrder: 3 },
          { id: 'ph_35_q5_a4', text: 'Humihingi ng slice ng cake para iuwi sa bahay', points: 10, acceptedVariants: ['slice ng cake', 'humingi ng cake', 'iuwing cake'], displayOrder: 4 },
        ],
      },
    ],
  },

  // PACK 36: Fast Food Favorites
  {
    id: 'pack_ph_36',
    title: 'Fast Food Favorites',
    description: 'Mula Jollibee hanggang McDo, Chowking, at Mang Inasal—ang mga paboritong order ng Pinoy.',
    category: 'Food & Dining',
    isBuiltIn: true,
    createdAt: '2026-11-04T00:00:00.000Z',
    updatedAt: '2026-11-04T00:00:00.000Z',
    questions: [
      {
        id: 'ph_36_q1',
        prompt: 'Anong fast food meal ang pinaka-unang naiisip ng Pinoy kapag gutom?',
        category: 'Food & Dining',
        answers: [
          { id: 'ph_36_q1_a1', text: '1-pc o 2-pc Fried Chicken with Rice', points: 48, acceptedVariants: ['chickenjoy', 'fried chicken with rice', 'chicken with rice', 'manok'], displayOrder: 1 },
          { id: 'ph_36_q1_a2', text: 'Burger at French Fries', points: 26, acceptedVariants: ['burger at fries', 'yum burger', 'burger', 'fries'], displayOrder: 2 },
          { id: 'ph_36_q1_a3', text: 'Sweet Spaghetti with Hotdog', points: 16, acceptedVariants: ['spaghetti', 'fast food spaghetti', 'jolly spaghetti'], displayOrder: 3 },
          { id: 'ph_36_q1_a4', text: 'Palabok o Noodles', points: 10, acceptedVariants: ['palabok', 'noodles', 'fast food palabok'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_36_q2',
        prompt: 'Ano ang laging hinihingi o ina-upgrade ng customer sa fast food counter?',
        category: 'Food & Dining',
        answers: [
          { id: 'ph_36_q2_a1', text: 'Extra Gravy / Sabaw ng gravy', points: 44, acceptedVariants: ['extra gravy', 'gravy', 'dagdag gravy', 'unli gravy'], displayOrder: 1 },
          { id: 'ph_36_q2_a2', text: 'Upsize ang Drinks o Fries (Large / Jumbo)', points: 28, acceptedVariants: ['upsize fries', 'upsize drinks', 'gawing large', 'upsize'], displayOrder: 2 },
          { id: 'ph_36_q2_a3', text: 'Extra Rice', points: 16, acceptedVariants: ['extra rice', 'unli rice', 'dagdag kanin'], displayOrder: 3 },
          { id: 'ph_36_q2_a4', text: 'Ketchup / Chili powder / Spicy sauce', points: 12, acceptedVariants: ['ketchup', 'chili powder', 'spicy powder', 'hot sauce'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_36_q3',
        prompt: 'Anong side dish o dessert ang paboritong pandagdag sa order sa fast food?',
        category: 'Food & Dining',
        answers: [
          { id: 'ph_36_q3_a1', text: 'French Fries', points: 45, acceptedVariants: ['french fries', 'fries', 'patatas'], displayOrder: 1 },
          { id: 'ph_36_q3_a2', text: 'Peach Mango Pie o Apple Pie', points: 27, acceptedVariants: ['peach mango pie', 'pie', 'mango pie'], displayOrder: 2 },
          { id: 'ph_36_q3_a3', text: 'Sundae / Ice Cream', points: 16, acceptedVariants: ['sundae', 'ice cream', 'soft serve'], displayOrder: 3 },
          { id: 'ph_36_q3_a4', text: 'Halo-Halo', points: 12, acceptedVariants: ['halo-halo', 'halo halo'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_36_q4',
        prompt: 'Ano ang ginagawa ng Pinoy kapag punuan ang lamesa sa fast food restaurant?',
        category: 'Food & Dining',
        answers: [
          { id: 'ph_36_q4_a1', text: 'Tumatayo sa tabi ng malapit nang matapos kumain', points: 46, acceptedVariants: ['tumayo sa tabi ng kumakain', 'abang sa lamesa', 'bantay lamesa'], displayOrder: 1 },
          { id: 'ph_36_q4_a2', text: 'Nagpapaiwan ng gamit / bag para i-reserve ang upuan', points: 28, acceptedVariants: ['iwan ng gamit sa upuan', 'panyo sa upuan', 'reserve gamit'], displayOrder: 2 },
          { id: 'ph_36_q4_a3', text: 'Nagte-take out na lang / Drive-thru', points: 14, acceptedVariants: ['mag-take out', 'take out na lang', 'pabalot'], displayOrder: 3 },
          { id: 'ph_36_q4_a4', text: 'Nakiki-share ng lamesa kung may bakanteng upuan', points: 12, acceptedVariants: ['maki-share ng upuan', 'maki-table', 'share lamesa'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_36_q5',
        prompt: 'Anong kilalang fast food chain ang may sariling pwesto sa puso ng bawat pamilyang Pilipino?',
        category: 'Food & Dining',
        answers: [
          { id: 'ph_36_q5_a1', text: 'Jollibee', points: 52, acceptedVariants: ['jollibee', 'jabee', 'jabi'], displayOrder: 1 },
          { id: 'ph_36_q5_a2', text: 'McDonald\'s / McDo', points: 24, acceptedVariants: ['mcdo', 'mcdonalds', 'mcdonald\'s'], displayOrder: 2 },
          { id: 'ph_36_q5_a3', text: 'Mang Inasal', points: 14, acceptedVariants: ['mang inasal', 'inasal'], displayOrder: 3 },
          { id: 'ph_36_q5_a4', text: 'Chowking', points: 10, acceptedVariants: ['chowking', 'chow king'], displayOrder: 4 },
        ],
      },
    ],
  },

  // PACK 37: Online Shopping Budol
  {
    id: 'pack_ph_37',
    title: 'Online Shopping Budol',
    description: 'Shopee 9.9, Lazada sale, COD, "Rider po ito!", at mga binili na hindi naman pala kailangan.',
    category: 'Technology & Social',
    isBuiltIn: true,
    createdAt: '2026-11-04T00:00:00.000Z',
    updatedAt: '2026-11-04T00:00:00.000Z',
    questions: [
      {
        id: 'ph_37_q1',
        prompt: 'Ano ang dahilan kung bakit napapa-checkout ang Pinoy sa online shopping app?',
        category: 'Technology & Social',
        answers: [
          { id: 'ph_37_q1_a1', text: 'Free Shipping Voucher', points: 45, acceptedVariants: ['free shipping', 'free shipping voucher', 'libreng delivery'], displayOrder: 1 },
          { id: 'ph_37_q1_a2', text: 'Double-digit sale (e.g., 9.9, 11.11, Payday Sale)', points: 30, acceptedVariants: ['double digit sale', '11.11', 'payday sale', 'sale'], displayOrder: 2 },
          { id: 'ph_37_q1_a3', text: 'Flash Sale / Piso Sale', points: 15, acceptedVariants: ['flash sale', 'piso sale', 'bagsak presyo'], displayOrder: 3 },
          { id: 'ph_37_q1_a4', text: 'Boredom / Na-stress sa trabaho kaya nag-shopping', points: 10, acceptedVariants: ['bored', 'retail therapy', 'stress shopping', 'pampalipas oras'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_37_q2',
        prompt: 'Ano ang laging binibili o na-"budol" ng mga Pinoy online?',
        category: 'Technology & Social',
        answers: [
          { id: 'ph_37_q2_a1', text: 'Damit / Pambahay / OOTD', points: 40, acceptedVariants: ['damit', 'pambahay', 't-shirt', 'shorts', 'ootd'], displayOrder: 1 },
          { id: 'ph_37_q2_a2', text: 'Phone accessories / Charger / Case', points: 28, acceptedVariants: ['phone case', 'charger', 'accessories', 'case'], displayOrder: 2 },
          { id: 'ph_37_q2_a3', text: 'Gamit sa kusina o pambahay organizer', points: 20, acceptedVariants: ['gamit sa kusina', 'organizer', 'kitchenware', 'lagayan'], displayOrder: 3 },
          { id: 'ph_37_q2_a4', text: 'Skincare / Makeup / Beauty products', points: 12, acceptedVariants: ['skincare', 'makeup', 'pampaganda', 'lotion'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_37_q3',
        prompt: 'Ano ang ginagawa ng buyer bago mag-click ng "Place Order"?',
        category: 'Technology & Social',
        answers: [
          { id: 'ph_37_q3_a1', text: 'Nagbabasa ng product reviews at tumitingin ng pictures', points: 46, acceptedVariants: ['magbasa ng reviews', 'tignan reviews', 'review pictures'], displayOrder: 1 },
          { id: 'ph_37_q3_a2', text: 'Nangongolekta at nag-aaply ng mga discount vouchers', points: 28, acceptedVariants: ['collect vouchers', 'maglagay ng voucher', 'voucher hunting'], displayOrder: 2 },
          { id: 'ph_37_q3_a3', text: 'Nagse-search sa ibang shop kung may mas mura', points: 15, acceptedVariants: ['magkumpara ng presyo', 'hanap mas mura', 'compare shops'], displayOrder: 3 },
          { id: 'ph_37_q3_a4', text: 'Nagtatanong sa seller sa chat kung may stock pa', points: 11, acceptedVariants: ['magchat sa seller', 'pm seller', 'chat'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_37_q4',
        prompt: 'Ano ang karaniwang text o tawag ng delivery rider sa umaga?',
        category: 'Technology & Social',
        answers: [
          { id: 'ph_37_q4_a1', text: '"Ma\'am/Sir, may delivery po kayo galing Shopee/Lazada"', points: 48, acceptedVariants: ['may delivery po', 'rider po ito', 'may parcel kayo'], displayOrder: 1 },
          { id: 'ph_37_q4_a2', text: '"Nasa labas na po ako ng gate / bahay"', points: 26, acceptedVariants: ['nasa labas po', 'nasa gate na ako', 'andito na po sa labas'], displayOrder: 2 },
          { id: 'ph_37_q4_a3', text: '"Pakihanda po ang eksaktong bayad sa COD"', points: 16, acceptedVariants: ['eksaktong bayad', 'paki-prepare ang cod', 'bayad po'], displayOrder: 3 },
          { id: 'ph_37_q4_a4', text: '"Sino po ang pwedeng mag-receive kung wala kayo?"', points: 10, acceptedVariants: ['sino magreceive', 'may tatanggap ba', 'wala pong tao'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_37_q5',
        prompt: 'Ano ang paboritong gawin pagka-deliver na pagka-deliver ng parcel?',
        category: 'Technology & Social',
        answers: [
          { id: 'ph_37_q5_a1', text: 'Mag-unboxing video o agad buksan gamit ang gunting', points: 45, acceptedVariants: ['unboxing', 'buksan agad', 'guntingin ang bubble wrap'], displayOrder: 1 },
          { id: 'ph_37_q5_a2', text: 'Paputukin ang bubble wrap', points: 28, acceptedVariants: ['paputukin ang bubble wrap', 'putok bubble wrap', 'magpaputok'], displayOrder: 2 },
          { id: 'ph_37_q5_a3', text: 'I-fit o subukan agad kung kasya o gumagana', points: 17, acceptedVariants: ['isukat agad', 'i-test', 'subukan kung gumagana'], displayOrder: 3 },
          { id: 'ph_37_q5_a4', text: 'Mag-rate ng 5 stars para sa Shopee/Lazada coins', points: 10, acceptedVariants: ['mag-rate ng 5 stars', 'rate 5 stars', 'review for coins'], displayOrder: 4 },
        ],
      },
    ],
  },

  // PACK 38: Karinderya Chronicles
  {
    id: 'pack_ph_38',
    title: 'Karinderya Chronicles',
    description: 'Turo-turo, libreng sabaw ng sinigang o nilaga, extra kanin, at malamig na RC o softdrinks.',
    category: 'Food & Dining',
    isBuiltIn: true,
    createdAt: '2026-11-04T00:00:00.000Z',
    updatedAt: '2026-11-04T00:00:00.000Z',
    questions: [
      {
        id: 'ph_38_q1',
        prompt: 'Anong ulam ang laging laman ng mga kaldero o display case sa carinderia?',
        category: 'Food & Dining',
        answers: [
          { id: 'ph_38_q1_a1', text: 'Adobo (Baboy o Manok)', points: 35, acceptedVariants: ['adobo', 'adobong baboy', 'adobong manok'], displayOrder: 1 },
          { id: 'ph_38_q1_a2', text: 'Menudo o Afritada', points: 26, acceptedVariants: ['menudo', 'afritada', 'mechado'], displayOrder: 2 },
          { id: 'ph_38_q1_a3', text: 'Sinigang na Baboy o Bangus', points: 18, acceptedVariants: ['sinigang', 'sinigang na baboy', 'sinigang na bangus'], displayOrder: 3 },
          { id: 'ph_38_q1_a4', text: 'Giniling / Picadillo', points: 12, acceptedVariants: ['giniling', 'picadillo', 'tortang talong'], displayOrder: 4 },
          { id: 'ph_38_q1_a5', text: 'Dinuguan', points: 9, acceptedVariants: ['dinuguan', 'dugo-dugo'], displayOrder: 5 },
        ],
      },
      {
        id: 'ph_38_q2',
        prompt: 'Ano ang laging hinihingi nang libre sa tindera pagka-order ng kanin at ulam?',
        category: 'Food & Dining',
        answers: [
          { id: 'ph_38_q2_a1', text: 'Libreng sabaw ng Sinigang o Nilaga', points: 52, acceptedVariants: ['libreng sabaw', 'sabaw', 'sabaw ng sinigang', 'sabaw ng nilaga'], displayOrder: 1 },
          { id: 'ph_38_q2_a2', text: 'Baso ng malamig na service water', points: 24, acceptedVariants: ['service water', 'tubig', 'baso ng tubig', 'malamig na tubig'], displayOrder: 2 },
          { id: 'ph_38_q2_a3', text: 'Patis, toyo, o sili na sawsawan', points: 14, acceptedVariants: ['sawsawan', 'toyo at kalamansi', 'patis at sili', 'sili'], displayOrder: 3 },
          { id: 'ph_38_q2_a4', text: 'Toothpick', points: 10, acceptedVariants: ['toothpick', 'pangtinga'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_38_q3',
        prompt: 'Bakit mas gustong kumain ng mga tao sa carinderia kaysa sa mamahaling restaurant?',
        category: 'Food & Dining',
        answers: [
          { id: 'ph_38_q3_a1', text: 'Mura at abot-kaya ang presyo', points: 48, acceptedVariants: ['mura ang presyo', 'budget friendly', 'mura', 'nakakatipid'], displayOrder: 1 },
          { id: 'ph_38_q3_a2', text: 'Luto at lasang lutong-bahay', points: 26, acceptedVariants: ['lutong bahay', 'lasang bahay', 'sarap ng luto'], displayOrder: 2 },
          { id: 'ph_38_q3_a3', text: 'Mabilis ang serbisyo / Turo-turo lang agad kakain na', points: 16, acceptedVariants: ['mabilis', 'turo-turo', 'walang hintayan'], displayOrder: 3 },
          { id: 'ph_38_q3_a4', text: 'Malalaki ang servings at pwedeng mag-half order', points: 10, acceptedVariants: ['half order', 'malaking serving', 'pwedeng kalahati'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_38_q4',
        prompt: 'Anong malamig na inumin ang karaniwang itinatapat ng kostumer sa mainit na ulam sa carinderia?',
        category: 'Food & Dining',
        answers: [
          { id: 'ph_38_q4_a1', text: 'Softdrinks na nasa bote (Coke, Sprite, RC Cola)', points: 45, acceptedVariants: ['softdrinks sa bote', 'rc cola', 'coke', 'malamig na coke'], displayOrder: 1 },
          { id: 'ph_38_q4_a2', text: 'Gulaman / Sago\'t Gulaman', points: 28, acceptedVariants: ['sago\'t gulaman', 'gulaman', 'palamig'], displayOrder: 2 },
          { id: 'ph_38_q4_a3', text: 'Buko Juice', points: 16, acceptedVariants: ['buko juice', 'sabaw ng buko'], displayOrder: 3 },
          { id: 'ph_38_q4_a4', text: 'Malamig na Iced Tea', points: 11, acceptedVariants: ['iced tea', 'malamig na tsaa'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_38_q5',
        prompt: 'Ano ang makikita sa bawat lamesa ng tradisyonal na carinderia?',
        category: 'Food & Dining',
        answers: [
          { id: 'ph_38_q5_a1', text: 'Lalagyan ng kutsara at tinidor na nakabalot sa napkin', points: 42, acceptedVariants: ['kutsara at tinidor', 'kubyertos', 'nakabalot na kutsara'], displayOrder: 1 },
          { id: 'ph_38_q5_a2', text: 'Bote ng toyo, suka, at patis', points: 30, acceptedVariants: ['toyo suka patis', 'bote ng sawsawan', 'pampalasa'], displayOrder: 2 },
          { id: 'ph_38_q5_a3', text: 'Tissue roll o napkin dispenser', points: 16, acceptedVariants: ['tissue', 'napkin', 'tissue roll'], displayOrder: 3 },
          { id: 'ph_38_q5_a4', text: 'Baso na may lamang mga toothpick', points: 12, acceptedVariants: ['toothpick sa baso', 'lagayan ng toothpick'], displayOrder: 4 },
        ],
      },
    ],
  },

  // PACK 39: Mga Bagay na Laging Mayroon sa Bahay
  {
    id: 'pack_ph_39',
    title: 'Mga Bagay na Laging Mayroon sa Bahay',
    description: 'Lata ng Danish cookies na lagayan ng panahi, walis tambo, Vicks, at plastic bag ng mga plastic bag.',
    category: 'Home & Living',
    isBuiltIn: true,
    createdAt: '2026-11-04T00:00:00.000Z',
    updatedAt: '2026-11-04T00:00:00.000Z',
    questions: [
      {
        id: 'ph_39_q1',
        prompt: 'Anong gamit sa bahay ang kapag binuksan mo, panahi pala ang laman at hindi biskwit?',
        category: 'Home & Living',
        answers: [
          { id: 'ph_39_q1_a1', text: 'Lata ng Danish Butter Cookies', points: 52, acceptedVariants: ['danish butter cookies', 'lata ng cookies', 'royal danshk', 'lata ng biskwit'], displayOrder: 1 },
          { id: 'ph_39_q1_a2', text: 'Lalagyan ng Ice Cream (Selecta o Magnolia)', points: 25, acceptedVariants: ['lagayan ng ice cream', 'tub ng ice cream', 'selecta'], displayOrder: 2 },
          { id: 'ph_39_q1_a3', text: 'Kahon ng sapatos', points: 13, acceptedVariants: ['shoebox', 'kahon ng sapatos'], displayOrder: 3 },
          { id: 'ph_39_q1_a4', text: 'Lata ng pulvoron o candy', points: 10, acceptedVariants: ['lata ng kendi', 'lata ng pulvoron'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_39_q2',
        prompt: 'Ano ang laging hinahanap ng nanay kapag marumi o magugulo ang sahig sa sala?',
        category: 'Home & Living',
        answers: [
          { id: 'ph_39_q2_a1', text: 'Walis Tambo', points: 46, acceptedVariants: ['walis tambo', 'tambo', 'walis'], displayOrder: 1 },
          { id: 'ph_39_q2_a2', text: 'Dustpan / Pandakot', points: 28, acceptedVariants: ['dustpan', 'pandakot', 'dakot'], displayOrder: 2 },
          { id: 'ph_39_q2_a3', text: 'Basahan / Mop pampunas ng sahig', points: 16, acceptedVariants: ['basahan', 'mop', 'pamunas'], displayOrder: 3 },
          { id: 'ph_39_q2_a4', text: 'Walis Tingting (Pang-labas o bakuran)', points: 10, acceptedVariants: ['walis tingting', 'tingting'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_39_q3',
        prompt: 'Anong gamot o pamahid ang laging nasa ibabaw ng cabinet o lamesa ng lola o nanay?',
        category: 'Home & Living',
        answers: [
          { id: 'ph_39_q3_a1', text: 'Vicks VapoRub', points: 48, acceptedVariants: ['vicks', 'vicks vaporub', 'pampahid'], displayOrder: 1 },
          { id: 'ph_39_q3_a2', text: 'White Flower / Katinko / Efficascent Oil', points: 28, acceptedVariants: ['white flower', 'katinko', 'efficascent oil', 'efficascent'], displayOrder: 2 },
          { id: 'ph_39_q3_a3', text: 'Salonpas / Pain patch', points: 14, acceptedVariants: ['salonpas', 'patch'], displayOrder: 3 },
          { id: 'ph_39_q3_a4', text: 'Alcohol (70% Isopropyl)', points: 10, acceptedVariants: ['alcohol', 'alkansya', 'green cross'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_39_q4',
        prompt: 'Saan karaniwang itinatago ng pamilyang Pinoy ang isang malaking plastic bag na puno ng iba pang plastic bag?',
        category: 'Home & Living',
        answers: [
          { id: 'ph_39_q4_a1', text: 'Sa ilalim ng lababo sa kusina', points: 44, acceptedVariants: ['ilalim ng lababo', 'ilalim ng lababo sa kusina', 'sink'], displayOrder: 1 },
          { id: 'ph_39_q4_a2', text: 'Nakasabit sa likod ng pinto', points: 28, acceptedVariants: ['likod ng pinto', 'nakasabit sa pinto'], displayOrder: 2 },
          { id: 'ph_39_q4_a3', text: 'Sa gilid o likod ng refrigerator', points: 16, acceptedVariants: ['gilid ng ref', 'likod ng ref', 'tabi ng ref'], displayOrder: 3 },
          { id: 'ph_39_q4_a4', text: 'Sa ilalim ng cabinet o drawer', points: 12, acceptedVariants: ['drawer', 'cabinet sa kusina', 'ilalim ng cabinet'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_39_q5',
        prompt: 'Anong kagamitan sa sala ang madalas na may nakabalot pang plastic para hindi marumihan?',
        category: 'Home & Living',
        answers: [
          { id: 'ph_39_q5_a1', text: 'Remote control ng TV', points: 46, acceptedVariants: ['remote control', 'remote', 'remote ng tv'], displayOrder: 1 },
          { id: 'ph_39_q5_a2', text: 'Sofa o upuan sa sala', points: 28, acceptedVariants: ['sofa', 'sala set', 'upuan', 'sopa'], displayOrder: 2 },
          { id: 'ph_39_q5_a3', text: 'Bagong electric fan', points: 14, acceptedVariants: ['electric fan', 'bentilador'], displayOrder: 3 },
          { id: 'ph_39_q5_a4', text: 'Talahanayan / Glass table top', points: 12, acceptedVariants: ['lamesa', 'glass table', 'center table'], displayOrder: 4 },
        ],
      },
    ],
  },
];
