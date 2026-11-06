import type { QuestionPack } from '../../types/game';

export const PACKS_40_TO_49: QuestionPack[] = [
  // PACK 40 (Pack 1): Biglang May Bisita!
  {
    id: 'pack_ph_40',
    title: 'Biglang May Bisita!',
    description: 'Nasa sala pa ang mga nakasampay at magulo ang bahay, pero biglang may tumawag ng "Tao po!" sa labas ng gate.',
    category: 'Family & Home',
    isBuiltIn: true,
    createdAt: '2026-11-06T00:00:00.000Z',
    updatedAt: '2026-11-06T00:00:00.000Z',
    questions: [
      {
        id: 'ph_40_q1',
        prompt: 'Biglang may sumigaw ng "Tao po!" sa gate habang makalat ang sala. Ano ang unang ginagawa ng pamilya?',
        category: 'Family & Home',
        answers: [
          { id: 'ph_40_q1_a1', text: 'Ipunin at itago ang kalat sa kwarto', points: 38, acceptedVariants: ['itago ang kalat', 'itapon sa kwarto', 'ipitin sa kwarto', 'itago kalat', 'linis sala'], displayOrder: 1 },
          { id: 'ph_40_q1_a2', text: 'Utusan ang bata o kapatid na sumilip sa bintana', points: 28, acceptedVariants: ['silip sa bintana', 'utusan ang bata', 'sumilip', 'silipin kung sino'], displayOrder: 2 },
          { id: 'ph_40_q1_a3', text: 'Magsuot agad ng maayos na damit o t-shirt', points: 18, acceptedVariants: ['magdamit', 'magsuot ng t-shirt', 'magbihis', 'magpalit ng damit'], displayOrder: 3 },
          { id: 'ph_40_q1_a4', text: 'Patahimikin ang lahat at sabihing "Huwag kayong maingay!"', points: 16, acceptedVariants: ['wag maingay', 'patahimikin lahat', 'manahimik', 'tahimik'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_40_q2',
        prompt: 'Saan karaniwang isinisiksik o itinatago ang kalat sa bahay kapag nagmamadali bago papasukin ang bisita?',
        category: 'Family & Home',
        answers: [
          { id: 'ph_40_q2_a1', text: 'Sa loob ng kwarto sabay lock ng pinto', points: 42, acceptedVariants: ['sa kwarto', 'loob ng kwarto', 'kwarto', 'ilock ang kwarto'], displayOrder: 1 },
          { id: 'ph_40_q2_a2', text: 'Sa ilalim ng sofa o kama', points: 25, acceptedVariants: ['ilalim ng sofa', 'ilalim ng kama', 'sa ilalim ng upuan', 'ilalim'], displayOrder: 2 },
          { id: 'ph_40_q2_a3', text: 'Sa likod ng kurtina o pinto', points: 18, acceptedVariants: ['likod ng kurtina', 'likod ng pinto', 'kurtina'], displayOrder: 3 },
          { id: 'ph_40_q2_a4', text: 'Sa loob ng washing machine o laundry basket', points: 15, acceptedVariants: ['washing machine', 'laundry basket', 'lagayan ng labada', 'basket ng damit'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_40_q3',
        prompt: 'Pagkaupo ng bisita sa sala, ano ang agarang inihahanda o iniaalok sa kanila?',
        category: 'Family & Home',
        answers: [
          { id: 'ph_40_q3_a1', text: 'Malamig na tubig / Tubig na may yelo', points: 38, acceptedVariants: ['tubig', 'malamig na tubig', 'water', 'tubig na may yelo'], displayOrder: 1 },
          { id: 'ph_40_q3_a2', text: 'Tang juice o powdered juice drink', points: 26, acceptedVariants: ['juice', 'tang juice', 'juice drink', 'tang'], displayOrder: 2 },
          { id: 'ph_40_q3_a3', text: 'Kape (3-in-1 coffee)', points: 18, acceptedVariants: ['kape', 'coffee', '3 in 1', 'mainit na kape'], displayOrder: 3 },
          { id: 'ph_40_q3_a4', text: 'Biskwit o tinapay (SkyFlakes, Fita)', points: 18, acceptedVariants: ['biskwit', 'tinapay', 'skyflakes', 'merienda', 'fita', 'cookies'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_40_q4',
        prompt: 'Ano ang klasikong sinasabi ng nanay sa bisita para magpakumbaba kahit naglinis naman bago sila pumasok?',
        category: 'Family & Home',
        answers: [
          { id: 'ph_40_q4_a1', text: '"Pasensya na kayo, napakagulo ng bahay namin!"', points: 45, acceptedVariants: ['pasensya na magulo', 'magulo ang bahay', 'pasensya na', 'pasensya na makalat'], displayOrder: 1 },
          { id: 'ph_40_q4_a2', text: '"Kararating lang din namin / Kakatapos lang maglinis"', points: 25, acceptedVariants: ['kararating lang', 'kakatapos lang', 'kakarating lang namin'], displayOrder: 2 },
          { id: 'ph_40_q4_a3', text: '"Upo muna kayo, magtitimpla lang ako ng maiinom"', points: 18, acceptedVariants: ['upo muna kayo', 'timpla maiinom', 'sandali lang magtitimpla'], displayOrder: 3 },
          { id: 'ph_40_q4_a4', text: '"Bakit hindi kayo nagpasabi bago pumunta?"', points: 12, acceptedVariants: ['di nagpasabi', 'sana nagtext kayo', 'di kayo nagsabi'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_40_q5',
        prompt: 'Habang nasa sala ang bisita, anong utos ang ibinubulong o pasenyas na sinasabi ni nanay sa mga anak?',
        category: 'Family & Home',
        answers: [
          { id: 'ph_40_q5_a1', text: '"Bumili ka ng softdrinks o yelo sa tindahan"', points: 40, acceptedVariants: ['bumili ng softdrinks', 'bumili ng yelo', 'bili ng coke', 'pabili sa tindahan'], displayOrder: 1 },
          { id: 'ph_40_q5_a2', text: '"Magmano kayo at bumati kay tita/tito"', points: 28, acceptedVariants: ['magmano kayo', 'magmano', 'mag-mano', 'bumati'], displayOrder: 2 },
          { id: 'ph_40_q5_a3', text: '"Pumunta muna kayo sa kwarto / Huwag makulit"', points: 20, acceptedVariants: ['pumasok sa kwarto', 'punta sa kwarto', 'wag makulit', 'sa kwarto muna'], displayOrder: 3 },
          { id: 'ph_40_q5_a4', text: '"Ilabas mo \'yung magagandang baso at plato"', points: 12, acceptedVariants: ['magagandang baso', 'plato para sa bisita', 'espesyal na baso', 'ilabas ang baso'], displayOrder: 4 },
        ],
      },
    ],
  },

  // PACK 41 (Pack 2): Nasa Labas Na Ako!
  {
    id: 'pack_ph_41',
    title: 'Nasa Labas Na Ako!',
    description: 'Sabi sa chat "Nasa labas na ako!" o "Malapit na!", pero sa totoo lang ay nagpapatuyo pa lang ng buhok.',
    category: 'Pinoy Lifestyle',
    isBuiltIn: true,
    createdAt: '2026-11-06T00:00:00.000Z',
    updatedAt: '2026-11-06T00:00:00.000Z',
    questions: [
      {
        id: 'ph_41_q1',
        prompt: 'Nag-text ang barkada na "Nandito na kami sa tagpuan!" pero ikaw ay nasa bahay pa. Ano ang totoo mong ginagawa?',
        category: 'Pinoy Lifestyle',
        answers: [
          { id: 'ph_41_q1_a1', text: 'Naliligo pa lang o kakalabas lang ng banyo', points: 36, acceptedVariants: ['naliligo pa lang', 'naliligo', 'nasa banyo', 'kakaligo lang'], displayOrder: 1 },
          { id: 'ph_41_q1_a2', text: 'Namimili pa lang ng isusuot na damit', points: 26, acceptedVariants: ['nagbibihis', 'namimili ng damit', 'naghahanap ng susuotin', 'nag-aayos ng damit'], displayOrder: 2 },
          { id: 'ph_41_q1_a3', text: 'Nagpapatuyo o nag-aayos pa ng buhok', points: 18, acceptedVariants: ['nag-aayos ng buhok', 'blower ng buhok', 'nagsusuklay', 'nagpapatuyo ng buhok'], displayOrder: 3 },
          { id: 'ph_41_q1_a4', text: 'Kakagising pa lang sa kama', points: 12, acceptedVariants: ['kakagising lang', 'kagigising lang', 'nasa kama pa', 'higa pa'], displayOrder: 4 },
          { id: 'ph_41_q1_a5', text: 'Naghahanap pa ng wallet, susi, o cellphone', points: 8, acceptedVariants: ['naghahanap ng gamit', 'nawawalang gamit', 'wallet at susi', 'cellphone'], displayOrder: 5 },
        ],
      },
      {
        id: 'ph_41_q2',
        prompt: 'Ano ang pinakagasgas na palusot sa chat kapag late ka na pero ayaw mong amining nasa bahay ka pa?',
        category: 'Pinoy Lifestyle',
        answers: [
          { id: 'ph_41_q2_a1', text: '"Trapik sobra, hindi gumagalaw ang sasakyan"', points: 42, acceptedVariants: ['traffic', 'trapik', 'traffic sobra', 'sobrang trapik', 'ipit sa traffic'], displayOrder: 1 },
          { id: 'ph_41_q2_a2', text: '"Malapit na ako, mga 5 minutes na lang!"', points: 28, acceptedVariants: ['malapit na ako', '5 minutes na lang', '5 mins', 'lapit na'], displayOrder: 2 },
          { id: 'ph_41_q2_a3', text: '"Hirap sumakay / Walang masakyan na jeep o taxi"', points: 18, acceptedVariants: ['hirap sumakay', 'walang masakyan', 'pila sa sakayan', 'nag-aabang ng jeep'], displayOrder: 3 },
          { id: 'ph_41_q2_a4', text: '"Palabas na ako ng pinto / Naglalakad na"', points: 12, acceptedVariants: ['palabas na', 'naglalakad na', 'papunta na', 'paalis na'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_41_q3',
        prompt: 'Ano ang gamit na madalas mawala sa bahay sa mismong minutong paalis ka na kaya lalo kang na-late?',
        category: 'Pinoy Lifestyle',
        answers: [
          { id: 'ph_41_q3_a1', text: 'Susi ng bahay o kwarto', points: 35, acceptedVariants: ['susi', 'susi ng bahay', 'keys', 'susi ng pinto'], displayOrder: 1 },
          { id: 'ph_41_q3_a2', text: 'Pera o Wallet', points: 26, acceptedVariants: ['wallet', 'pitaka', 'pera', 'barya'], displayOrder: 2 },
          { id: 'ph_41_q3_a3', text: 'Cellphone o Charger / Powerbank', points: 20, acceptedVariants: ['cellphone', 'phone', 'charger', 'powerbank'], displayOrder: 3 },
          { id: 'ph_41_q3_a4', text: 'Medyas o kapares ng sapatos', points: 11, acceptedVariants: ['medyas', 'sapatos', 'tsinelas', 'kapares ng sapatos'], displayOrder: 4 },
          { id: 'ph_41_q3_a5', text: 'Panyo o bimpo / Face towel', points: 8, acceptedVariants: ['panyo', 'bimpo', 'face towel', 'towel'], displayOrder: 5 },
        ],
      },
      {
        id: 'ph_41_q4',
        prompt: 'Kapag sinabi ng Pinoy na "On the way na ako", saan ba talaga siya karaniwang naroroon?',
        category: 'Pinoy Lifestyle',
        answers: [
          { id: 'ph_41_q4_a1', text: 'Nakasakay na sa jeep, bus, o tricycle', points: 38, acceptedVariants: ['nakasakay na', 'nasa jeep', 'nasa byahe', 'nasa sasakyan'], displayOrder: 1 },
          { id: 'ph_41_q4_a2', text: 'Kakalabas pa lang ng gate ng sariling bahay', points: 28, acceptedVariants: ['kakalabas lang ng gate', 'nasa labas ng bahay', 'palabas ng gate'], displayOrder: 2 },
          { id: 'ph_41_q4_a3', text: 'Nag-aabang o pumipila pa sa sakayan', points: 20, acceptedVariants: ['nag-aabang ng masasakyan', 'pumipila', 'naghihintay ng jeep'], displayOrder: 3 },
          { id: 'ph_41_q4_a4', text: 'Nakahiga pa sa kama at nagce-cellphone', points: 14, acceptedVariants: ['nakahiga pa', 'nasa kama', 'higa pa', 'nagcecellphone'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_41_q5',
        prompt: 'Ano ang ginagawa ng taong naunang dumating sa meeting place habang naghihintay sa late niyang kasama?',
        category: 'Pinoy Lifestyle',
        answers: [
          { id: 'ph_41_q5_a1', text: 'Mag-scroll sa social media o mag-cellphone', points: 44, acceptedVariants: ['mag-cellphone', 'mag-scroll sa facebook', 'cellphone', 'social media', 'tiktok'], displayOrder: 1 },
          { id: 'ph_41_q5_a2', text: 'Mag-text o tumawag para mangulit kung nasaan na', points: 28, acceptedVariants: ['magtext nasaan na', 'tumawag', 'mangulit', 'nasaan ka na'], displayOrder: 2 },
          { id: 'ph_41_q5_a3', text: 'Umorder muna ng inumin o merienda', points: 18, acceptedVariants: ['umorder ng inumin', 'magkape', 'kumain', 'order food'], displayOrder: 3 },
          { id: 'ph_41_q5_a4', text: 'Magpalinga-linga at magmasid sa mga taong dumaraan', points: 10, acceptedVariants: ['magpalinga linga', 'lumingon sa paligid', 'tingin sa dumadaan'], displayOrder: 4 },
        ],
      },
    ],
  },

  // PACK 42 (Pack 3): May Nag-message na Crush Mo!
  {
    id: 'pack_ph_42',
    title: 'May Nag-message na Crush Mo!',
    description: 'Ilang linggong walang paramdam, pero biglang tumunog ang phone at nag-pop up ang pangalan ng crush mo.',
    category: 'Relationships & Kilig',
    isBuiltIn: true,
    createdAt: '2026-11-06T00:00:00.000Z',
    updatedAt: '2026-11-06T00:00:00.000Z',
    questions: [
      {
        id: 'ph_42_q1',
        prompt: 'Biglang nag-pop up ang chat ng crush mo sa cellphone mo. Ano ang pinakaunang ginagawa mo?',
        category: 'Relationships & Kilig',
        answers: [
          { id: 'ph_42_q1_a1', text: 'I-screenshot at i-forward agad sa best friend o GC', points: 40, acceptedVariants: ['screenshot', 'screenshot sabay send sa best friend', 'send sa gc', 'screen shot'], displayOrder: 1 },
          { id: 'ph_42_q1_a2', text: 'Basahin nang paulit-ulit sa notification bar nang hindi sine-seen', points: 28, acceptedVariants: ['basahin sa notification', 'paulit ulit basahin', 'wag i-seen', 'basa sa notification bar'], displayOrder: 2 },
          { id: 'ph_42_q1_a3', text: 'Magtatalon o mapapatili sa sobrang kilig', points: 18, acceptedVariants: ['tumili', 'magtatalon sa kilig', 'tumili sa kilig', 'kilig', 'ngumiti mag-isa'], displayOrder: 3 },
          { id: 'ph_42_q1_a4', text: 'Mag-isip kung panaginip lang ba o totoo', points: 14, acceptedVariants: ['magduda kung totoo', 'panaginip', 'gulat', 'isipin kung totoo'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_42_q2',
        prompt: 'Bakit sinasadyang patagalin muna ang pag-reply sa crush kahit online ka naman?',
        category: 'Relationships & Kilig',
        answers: [
          { id: 'ph_42_q2_a1', text: 'Para hindi magmukhang sabik o easy to get', points: 45, acceptedVariants: ['wag magmukhang sabik', 'not easy to get', 'pakipot', 'wag halatang patay na patay'], displayOrder: 1 },
          { id: 'ph_42_q2_a2', text: 'Nagpapatulong pa sa mga kaibigan kung anong magandang isagot', points: 26, acceptedVariants: ['nagtatanong sa kaibigan', 'nagpapatulong sa reply', 'consult sa barkada'], displayOrder: 2 },
          { id: 'ph_42_q2_a3', text: 'Pinag-iisipan at binubura-bura pa ang tamang drafts', points: 18, acceptedVariants: ['nag-e-edit ng draft', 'bura bura ng message', 'pinag-iisipan ang sasabihin'], displayOrder: 3 },
          { id: 'ph_42_q2_a4', text: 'Nagpapanggap na may ginagawang importanteng bagay', points: 11, acceptedVariants: ['kunwari busy', 'nagpapanggap na busy', 'kunwaring may ginagawa'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_42_q3',
        prompt: 'Ano ang karaniwang unang chat ng crush na nagpapatibok nang mabilis sa puso mo?',
        category: 'Relationships & Kilig',
        answers: [
          { id: 'ph_42_q3_a1', text: '"Uy, gising ka pa?"', points: 38, acceptedVariants: ['gising ka pa', 'uy gising ka pa', 'gising pa?'], displayOrder: 1 },
          { id: 'ph_42_q3_a2', text: '"Free ka ba this weekend / labas tayo?"', points: 28, acceptedVariants: ['free ka ba', 'labas tayo', 'busy ka ba', 'gala tayo'], displayOrder: 2 },
          { id: 'ph_42_q3_a3', text: '"May itatanong lang sana ako..."', points: 20, acceptedVariants: ['may tanong ako', 'may itatanong ako', 'may itatanong lang'], displayOrder: 3 },
          { id: 'ph_42_q3_a4', text: '"Kamusta ka na? / Long time no talk"', points: 14, acceptedVariants: ['kamusta', 'kamusta ka na', 'long time no talk', 'musta'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_42_q4',
        prompt: 'Anong payo ang madalas ibigay ng mga kaibigan mo kapag nagpatulong ka kung ano ang ire-reply sa crush mo?',
        category: 'Relationships & Kilig',
        answers: [
          { id: 'ph_42_q4_a1', text: '"Wag kang mag-reply agad, palamigin mo muna!"', points: 36, acceptedVariants: ['wag reply agad', 'hintay ka muna', 'palamigin muna', 'pakipot ka muna'], displayOrder: 1 },
          { id: 'ph_42_q4_a2', text: '"Gawing casual at cool lang, huwag OA!"', points: 28, acceptedVariants: ['be cool', 'wag oa', 'casual lang', 'chill lang'], displayOrder: 2 },
          { id: 'ph_42_q4_a3', text: '"Tanungin mo rin siya pabalik para humaba ang usapan"', points: 22, acceptedVariants: ['tanungin pabalik', 'magtanong ka rin', 'pahabain ang usapan'], displayOrder: 3 },
          { id: 'ph_42_q4_a4', text: '"Aminin mo na ang nararamdaman mo!"', points: 14, acceptedVariants: ['aminin mo na', 'umamin ka na', 'sabihin mo na gusto mo siya'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_42_q5',
        prompt: 'Ano ang pinakamasakit o nakakadismayang dahilan kung bakit biglang nag-message ang crush mo?',
        category: 'Relationships & Kilig',
        answers: [
          { id: 'ph_42_q5_a1', text: 'Manghihiram pala ng pera o mag-aalok ng networking', points: 38, acceptedVariants: ['mangungutang', 'open minded ka ba', 'networking', 'hiram pera'], displayOrder: 1 },
          { id: 'ph_42_q5_a2', text: 'Magpapatulong o magtatanong tungkol sa ibang taong gusto niya', points: 30, acceptedVariants: ['tungkol sa ibang tao', 'gusto ang kaibigan mo', 'tanong tungkol sa iba'], displayOrder: 2 },
          { id: 'ph_42_q5_a3', text: 'Magpapatulong sa assignment, thesis, o trabaho', points: 20, acceptedVariants: ['sa assignment', 'magpapatulong sa thesis', 'assignment o homework', 'school work'], displayOrder: 3 },
          { id: 'ph_42_q5_a4', text: 'Nagkamali lang pala siya ng send / wrong sent', points: 12, acceptedVariants: ['wrong send', 'nagkamali ng send', 'wrong send pala'], displayOrder: 4 },
        ],
      },
    ],
  },

  // PACK 43 (Pack 4): Nahuli ni Mama!
  {
    id: 'pack_ph_43',
    title: 'Nahuli ni Mama!',
    description: 'Akala mo ligtas ka na, pero biglang bumukas ang pinto at nakatayo na si Mama na nakapamewang.',
    category: 'Family & Home',
    isBuiltIn: true,
    createdAt: '2026-11-06T00:00:00.000Z',
    updatedAt: '2026-11-06T00:00:00.000Z',
    questions: [
      {
        id: 'ph_43_q1',
        prompt: 'Nahuli ka ni Mama na nagce-cellphone habang dapat nag-aaral o naglilinis. Ano ang reflex action mo?',
        category: 'Family & Home',
        answers: [
          { id: 'ph_43_q1_a1', text: 'Itago agad ang phone sa ilalim ng unan o hita', points: 42, acceptedVariants: ['itago ang phone', 'tago sa ilalim ng unan', 'itago sa hita', 'tago cellphone'], displayOrder: 1 },
          { id: 'ph_43_q1_a2', text: 'I-lock ang screen at tumitig sa binabasang reviewer o libro', points: 28, acceptedVariants: ['tingin sa reviewer', 'kunwaring nag-aaral', 'lock ang screen', 'harap sa libro'], displayOrder: 2 },
          { id: 'ph_43_q1_a3', text: 'Magpanggap na biglang may hinahanap o naglilinis', points: 18, acceptedVariants: ['kunwaring naglilinis', 'magpanggap na may ginagawa', 'kunwari nagwawalis'], displayOrder: 3 },
          { id: 'ph_43_q1_a4', text: 'Ngumiti nang alanganin sabay sabing "Sandali lang po!"', points: 12, acceptedVariants: ['sandali lang po', 'ngumiti nang alanganin', 'kamot ulo'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_43_q2',
        prompt: 'Ano ang pinakapaboritong linyang palusot ng anak kapag nahuling nakatutok sa cellphone?',
        category: 'Family & Home',
        answers: [
          { id: 'ph_43_q2_a1', text: '"May tinitingnan lang akong assignment o reviewer!"', points: 44, acceptedVariants: ['assignment reviewer', 'tinitingnan lang reviewer', 'tungkol sa school', 'may sinearch lang'], displayOrder: 1 },
          { id: 'ph_43_q2_a2', text: '"Break time ko lang po, kakatapos ko lang mag-aral!"', points: 26, acceptedVariants: ['break time lang', 'kakatapos lang mag-aral', 'pahinga lang', 'saglit lang'], displayOrder: 2 },
          { id: 'ph_43_q2_a3', text: '"May nag-chat lang na kaklase o teacher tungkol sa school"', points: 18, acceptedVariants: ['chat ng kaklase', 'nagchat si teacher', 'importante message', 'group chat'], displayOrder: 3 },
          { id: 'ph_43_q2_a4', text: '"Tinitingnan ko lang kung anong oras na"', points: 12, acceptedVariants: ['titingnan lang oras', 'anong oras na', 'oras lang tiningnan'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_43_q3',
        prompt: 'Ano ang matinding ebidensya na nagpapatunay na nahuli ka sa kasinungalingan mo kay Mama?',
        category: 'Family & Home',
        answers: [
          { id: 'ph_43_q3_a1', text: 'Mainit pa ang cellphone o computer kahit sabi mong hindi ginamit', points: 38, acceptedVariants: ['mainit ang phone', 'mainit ang laptop', 'mainit ang tv', 'mainit na gadget'], displayOrder: 1 },
          { id: 'ph_43_q3_a2', text: 'Tumunog ang notification sa gitna ng pagpapaliwanag mo', points: 28, acceptedVariants: ['tumunog ang phone', 'tunog ng notification', 'tumunog ang chat'], displayOrder: 2 },
          { id: 'ph_43_q3_a3', text: 'Naka-open pa ang YouTube, laro, o TikTok sa screen', points: 20, acceptedVariants: ['naka-open ang laro', 'naka-play ang video', 'open ang tiktok', 'game screen'], displayOrder: 3 },
          { id: 'ph_43_q3_a4', text: 'Nahulog ang hawak mong gamit dahil sa gulat', points: 14, acceptedVariants: ['nahulog ang phone', 'nabitawan ang gamit', 'gulat nahulog'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_43_q4',
        prompt: 'Nahuli kang gabi na kung umuwi ng bahay. Ano ang unang itinatanong sa iyo ni Mama sa may pintuan?',
        category: 'Family & Home',
        answers: [
          { id: 'ph_43_q4_a1', text: '"Saan ka ba galing at anong oras na?!"', points: 45, acceptedVariants: ['saan ka galing', 'anong oras na', 'san ka nanggaling', 'bakit ngayon ka lang'], displayOrder: 1 },
          { id: 'ph_43_q4_a2', text: '"Sino ang mga kasama mo?!"', points: 25, acceptedVariants: ['sino kasama mo', 'sinong mga kasama mo', 'sinong kasama'], displayOrder: 2 },
          { id: 'ph_43_q4_a3', text: '"Bakit hindi ka sumasagot sa tawag at text ko?!"', points: 18, acceptedVariants: ['di sumasagot sa text', 'di sumasagot sa tawag', 'walang reply', 'bakit di nagtetext'], displayOrder: 3 },
          { id: 'ph_43_q4_a4', text: '"Kumain ka na ba?"', points: 12, acceptedVariants: ['kumain ka na ba', 'nakakain ka na', 'kumain ka na'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_43_q5',
        prompt: 'Ano ang klasikong banta o parusa ni nanay kapag paulit-ulit kang nahuhuling pasaway?',
        category: 'Family & Home',
        answers: [
          { id: 'ph_43_q5_a1', text: 'Kukunin o kukumpiskahin ang cellphone at WiFi', points: 42, acceptedVariants: ['kumpiskahin ang phone', 'kukunin ang cellphone', 'patayin ang wifi', 'walang cellphone'], displayOrder: 1 },
          { id: 'ph_43_q5_a2', text: 'Walang baon o bawas ang baon bukas', points: 26, acceptedVariants: ['walang baon', 'bawas ang baon', 'di bibigyan ng pera'], displayOrder: 2 },
          { id: 'ph_43_q5_a3', text: 'Bawal lumabas ng bahay o "grounded" kasama ang barkada', points: 20, acceptedVariants: ['grounded', 'bawal lumabas', 'bawal gumala', 'di papayagang lumabas'], displayOrder: 3 },
          { id: 'ph_43_q5_a4', text: 'Paghuhugasin ng lahat ng pinggan at kaldero', points: 12, acceptedVariants: ['hugasan ang pinggan', 'maghugas ng plato', 'utusan maglinis', 'maghugas kaldero'], displayOrder: 4 },
        ],
      },
    ],
  },

  // PACK 44 (Pack 5): May Exam Bukas!
  {
    id: 'pack_ph_44',
    title: 'May Exam Bukas!',
    description: 'Alas-diyes na ng gabi nang bigla mong maalalang midterms o finals pala bukas sa pinakamahirap na subject.',
    category: 'Education & School',
    isBuiltIn: true,
    createdAt: '2026-11-06T00:00:00.000Z',
    updatedAt: '2026-11-06T00:00:00.000Z',
    questions: [
      {
        id: 'ph_44_q1',
        prompt: 'Bandang gabi mo na naisip na may major exam ka pala bukas nang umaga. Ano ang unang reaksyon o ginagawa mo?',
        category: 'Education & School',
        answers: [
          { id: 'ph_44_q1_a1', text: 'Mag-panic at mag-message agad sa group chat ng mga kaklase', points: 40, acceptedVariants: ['mag-chat sa gc', 'magpanic sa gc', 'message sa kaklase', 'magtanong sa kaklase'], displayOrder: 1 },
          { id: 'ph_44_q1_a2', text: 'Humingi o magpasa-pasa ng reviewer at notes', points: 28, acceptedVariants: ['humingi ng reviewer', 'hingi ng notes', 'manghingi ng reviewer', 'maghanap ng notes'], displayOrder: 2 },
          { id: 'ph_44_q1_a3', text: 'Magtimpla ng matapang na kape pampagising', points: 18, acceptedVariants: ['magkape', 'magtimpla ng kape', 'uminom ng kape', 'matapang na kape'], displayOrder: 3 },
          { id: 'ph_44_q1_a4', text: 'Tumingin sa kisame at magdasal na sana ma-move ang exam', points: 14, acceptedVariants: ['magdasal na ma-move', 'magdasal', 'sana walang pasok', 'sana suspended'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_44_q2',
        prompt: 'Ano ang paboritong diskarte ng estudyante sa "cramming" ilang oras bago ang examination?',
        category: 'Education & School',
        answers: [
          { id: 'ph_44_q2_a1', text: 'Manood ng summarized tutorial sa YouTube o TikTok', points: 38, acceptedVariants: ['manood sa youtube', 'youtube tutorial', 'tiktok explanation', 'crash course'], displayOrder: 1 },
          { id: 'ph_44_q2_a2', text: 'Basahin lang ang naka-highlight o bold text sa reviewer', points: 28, acceptedVariants: ['basahin ang highlight', 'highlighted words', 'bold text', 'skim ng notes'], displayOrder: 2 },
          { id: 'ph_44_q2_a3', text: 'Magkabisado ng acronyms at mnemonics sa formula', points: 20, acceptedVariants: ['gumawa ng acronyms', 'kabisaduhin ang formula', 'mnemonics', 'memorize acronyms'], displayOrder: 3 },
          { id: 'ph_44_q2_a4', text: 'Makipag-aral sa kaklase via video call o Discord', points: 14, acceptedVariants: ['aral sa discord', 'video call sa kaklase', 'study call', 'aral kasama barkada'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_44_q3',
        prompt: 'Ano ang karaniwang laman ng chat ng estudyante sa kaklase sa bisperas ng exam?',
        category: 'Education & School',
        answers: [
          { id: 'ph_44_q3_a1', text: '"May reviewer ka ba? Pahingi naman!"', points: 45, acceptedVariants: ['pahingi reviewer', 'may reviewer ka ba', 'penge reviewer', 'send reviewer'], displayOrder: 1 },
          { id: 'ph_44_q3_a2', text: '"Nag-aral ka na ba? Wala pa akong nababasa!"', points: 26, acceptedVariants: ['nag-aral ka na', 'wala pa akong nababasa', 'di pa ako nag-aaral', 'may naaral ka na ba'], displayOrder: 2 },
          { id: 'ph_44_q3_a3', text: '"Hanggang anong coverage o anong chapters ang kasama?"', points: 18, acceptedVariants: ['coverage ng exam', 'anong chapters', 'coverage', 'anong topic kasama'], displayOrder: 3 },
          { id: 'ph_44_q3_a4', text: '"Gisingin mo ako bukas nang maaga ha!"', points: 11, acceptedVariants: ['gisingin mo ako', 'tawagan mo ako bukas', 'wake me up', 'gisingin mo ko'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_44_q4',
        prompt: 'Sampung minuto bago ipamigay ang test paper sa classroom, ano ang ginagawa ng mga estudyante?',
        category: 'Education & School',
        answers: [
          { id: 'ph_44_q4_a1', text: 'Mabilisang nagbabasa ng notes habang kinakabahan', points: 40, acceptedVariants: ['nagbabasa ng notes', 'last minute review', 'basa bago exam', 'cramming sa hallway'], displayOrder: 1 },
          { id: 'ph_44_q4_a2', text: 'Humihiram o naghahanap ng extrang ballpen o calculator', points: 28, acceptedVariants: ['humiram ng ballpen', 'hiram ng calculator', 'walang ballpen', 'penge lapis'], displayOrder: 2 },
          { id: 'ph_44_q4_a3', text: 'Nagdarasal nang taimtim para sa passing score', points: 20, acceptedVariants: ['nagdarasal', 'magdasal', 'dasal bago exam', 'taimtim na dasal'], displayOrder: 3 },
          { id: 'ph_44_q4_a4', text: 'Nag-uusap kung sino ang tatabihang matalino sa upuan', points: 12, acceptedVariants: ['tabihan ang matalino', 'humanap ng katabi', 'puwesto malapit sa matalino'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_44_q5',
        prompt: 'Pagkabigay ng test paper at nakita mong wala kang alam sa tanong, anong diskarte ang ginagawa mo?',
        category: 'Education & School',
        answers: [
          { id: 'ph_44_q5_a1', text: 'Sa Multiple Choice, piliin ang "Letter C" o pinakamahabang sagot', points: 42, acceptedVariants: ['piliin ang letter c', 'letter c', 'lahat c', 'pinakamahabang sagot'], displayOrder: 1 },
          { id: 'ph_44_q5_a2', text: 'Gamitin ang "elimination method" sa mga pagpipilian', points: 26, acceptedVariants: ['elimination method', 'alisin ang maling sagot', 'elimination'], displayOrder: 2 },
          { id: 'ph_44_q5_a3', text: 'Sumilip o maghintay ng pasimpleng senyas mula sa kaklase', points: 20, acceptedVariants: ['silip sa katabi', 'senyas sa kaklase', 'hingi ng sign', 'kodigo'], displayOrder: 3 },
          { id: 'ph_44_q5_a4', text: 'Gumawa ng mahabang essay na paulit-ulit ang punto para mukhang marami', points: 12, acceptedVariants: ['mahabang essay', 'pahabain ang sagot', 'paulit ulit na essay'], displayOrder: 4 },
        ],
      },
    ],
  },

  // PACK 45 (Pack 6): Naubusan ng Ulam!
  {
    id: 'pack_ph_45',
    title: 'Naubusan ng Ulam!',
    description: 'Excited kang lumapit sa kaldero para kumain, pero pag-angat mo ng takip, buto at sabaw na lang ang natira.',
    category: 'Food & Dining',
    isBuiltIn: true,
    createdAt: '2026-11-06T00:00:00.000Z',
    updatedAt: '2026-11-06T00:00:00.000Z',
    questions: [
      {
        id: 'ph_45_q1',
        prompt: 'Pagbukas mo ng takip ng ulam sa lamesa, puro sabaw at buto na lang ang natira. Ano ang unang lumalabas sa bibig mo?',
        category: 'Food & Dining',
        answers: [
          { id: 'ph_45_q1_a1', text: '"Sino ang umubos ng ulam?!"', points: 45, acceptedVariants: ['sino umubos', 'sinong umubos ng ulam', 'sino kumain', 'ubos na agad'], displayOrder: 1 },
          { id: 'ph_45_q1_a2', text: '"Bakit hindi niyo ako tinirhan?!"', points: 28, acceptedVariants: ['di niyo ko tinirhan', 'walang tinira sa akin', 'bakit walang tira', 'di nagtira'], displayOrder: 2 },
          { id: 'ph_45_q1_a3', text: '"May iba pa bang ulam diyan?"', points: 16, acceptedVariants: ['may iba pang ulam', 'ano pang pagkain', 'may ulam pa ba', 'may pagkain pa'], displayOrder: 3 },
          { id: 'ph_45_q1_a4', text: '"Kailan pa ito naubos?"', points: 11, acceptedVariants: ['kailan naubos', 'kanina pa ba ubos', 'bakit naubos agad'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_45_q2',
        prompt: 'Kapag naubusan ng nilutong ulam, ano ang pinakakaraniwang emergency ulam na inihahanda agad?',
        category: 'Food & Dining',
        answers: [
          { id: 'ph_45_q2_a1', text: 'Pritong Itlog (Sunny-side up o Scrambled)', points: 40, acceptedVariants: ['itlog', 'pritong itlog', 'egg', 'scrambled egg', 'sunny side up'], displayOrder: 1 },
          { id: 'ph_45_q2_a2', text: 'Instant Pancit Canton o Cup Noodles', points: 28, acceptedVariants: ['pancit canton', 'lucky me canton', 'instant noodles', 'cup noodles'], displayOrder: 2 },
          { id: 'ph_45_q2_a3', text: 'De-latang Sardinas o Tuna', points: 18, acceptedVariants: ['delata', 'sardinas', 'tuna', 'san marino', 'century tuna'], displayOrder: 3 },
          { id: 'ph_45_q2_a4', text: 'Hotdog o Tocino mula sa freezer', points: 14, acceptedVariants: ['hotdog', 'tocino', 'longganisa', 'prito ng hotdog'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_45_q3',
        prompt: 'Saan o kanino karaniwang ibinibintang kung bakit naubos agad ang paboritong ulam?',
        category: 'Food & Dining',
        answers: [
          { id: 'ph_45_q3_a1', text: 'Sa kapatid na malakas kumain o naunang kumain', points: 42, acceptedVariants: ['sa kapatid', 'sa kuya o bunso', 'malakas kumain na kapatid', 'kapatid'], displayOrder: 1 },
          { id: 'ph_45_q3_a2', text: 'Sa tatay na nagpapak ng ulam habang umiinom o nanonood ng TV', points: 26, acceptedVariants: ['kay tatay', 'papak ng tatay', 'pinapak ni papa'], displayOrder: 2 },
          { id: 'ph_45_q3_a3', text: 'Ipinakain daw sa alagang aso o pusa ang natirang ulam', points: 18, acceptedVariants: ['sa aso', 'sa pusa', 'alagang hayop', 'pinakain sa aso'], displayOrder: 3 },
          { id: 'ph_45_q3_a4', text: 'Binalot o kinain daw ng bisita kanina', points: 14, acceptedVariants: ['binalot ng bisita', 'dinala ng bisita', 'kinain ng bisita'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_45_q4',
        prompt: 'Kung talagang walang lutong ulam at walang de-lata, anong kombinasyon ang kinakain ng Pinoy sa kanin?',
        category: 'Food & Dining',
        answers: [
          { id: 'ph_45_q4_a1', text: 'Kanin na may toyo at mantika / mantika ng baboy', points: 38, acceptedVariants: ['toyo at mantika', 'kanin at toyo', 'mantika at toyo', 'kanin toyo'], displayOrder: 1 },
          { id: 'ph_45_q4_a2', text: 'Kanin na sinabawan ng kape o Milo', points: 28, acceptedVariants: ['sabaw kape', 'kanin sa kape', 'milo at kanin', 'kape sa kanin'], displayOrder: 2 },
          { id: 'ph_45_q4_a3', text: 'Kanin na may bagoong o asin', points: 20, acceptedVariants: ['bagoong', 'asin', 'kanin at asin', 'kanin at bagoong'], displayOrder: 3 },
          { id: 'ph_45_q4_a4', text: 'Kanin na sinawsaw sa Mang Tomas o ketchup', points: 14, acceptedVariants: ['mang tomas', 'ketchup', 'kanin at sarsa', 'kanin sa ketchup'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_45_q5',
        prompt: 'Kapag may natirang iisang pirasong karne sa serving plate, bakit walang gustong kumuha nito agad?',
        category: 'Food & Dining',
        answers: [
          { id: 'ph_45_q5_a1', text: '"Kahihiyan piece" / Nakakahiya sa iba baka may gustong kumain', points: 45, acceptedVariants: ['kahihiyan piece', 'nakakahiya', 'piece of shame', 'hiyang-hiya'], displayOrder: 1 },
          { id: 'ph_45_q5_a2', text: 'Naghihintayan kung sinong unang magpaparaya o mag-aalok', points: 25, acceptedVariants: ['naghihintayan', 'alukin ang iba', 'hintay sa iba'], displayOrder: 2 },
          { id: 'ph_45_q5_a3', text: 'Natatakot na mapagsabihan na matakaw o patay-gutom', points: 18, acceptedVariants: ['sabihang matakaw', 'takot masabihan', 'patay gutom'], displayOrder: 3 },
          { id: 'ph_45_q5_a4', text: 'Tinatanong muna ang lahat: "Sino pang kakain nito?"', points: 12, acceptedVariants: ['sino pang kakain', 'tinatanong kung may kakain pa', 'alukin muna'], displayOrder: 4 },
        ],
      },
    ],
  },

  // PACK 46 (Pack 7): Nagkamali ng Send!
  {
    id: 'pack_ph_46',
    title: 'Nagkamali ng Send!',
    description: 'Yung tsismis o reklamo na para sana sa best friend mo, aksidenteng na-send sa mismong taong pinag-uusapan ninyo.',
    category: 'Pinoy Lifestyle',
    isBuiltIn: true,
    createdAt: '2026-11-06T00:00:00.000Z',
    updatedAt: '2026-11-06T00:00:00.000Z',
    questions: [
      {
        id: 'ph_46_q1',
        prompt: 'Aksidente mong na-send ang tsismis sa mismong taong pinag-uusapan ninyo sa Messenger. Ano ang agad mong ginagawa?',
        category: 'Pinoy Lifestyle',
        answers: [
          { id: 'ph_46_q1_a1', text: 'Pindutin agad ang "Unsend for Everyone" nang nanginginig ang kamay', points: 48, acceptedVariants: ['unsend', 'unsend for everyone', 'i-unsend agad', 'delete message'], displayOrder: 1 },
          { id: 'ph_46_q1_a2', text: 'Mag-airplane mode agad sa pag-asang hindi magtuloy ang send', points: 25, acceptedVariants: ['airplane mode', 'patayin ang wifi', 'turn on airplane mode'], displayOrder: 2 },
          { id: 'ph_46_q1_a3', text: 'Mag-panic at ibagsak o itapon sa kama ang cellphone', points: 15, acceptedVariants: ['ibagsak ang phone', 'magpanic', 'tapon ang phone sa kama', 'sumigaw sa kaba'], displayOrder: 3 },
          { id: 'ph_46_q1_a4', text: 'I-block agad ang tao o mag-deactivate ng account', points: 12, acceptedVariants: ['i-block', 'block agad', 'mag-deactivate', 'deactivate account'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_46_q2',
        prompt: 'Na-seen na niya ang maling chat bago mo pa ma-unsend. Ano ang pinakakaraniwang palusot na sinasabi mo?',
        category: 'Pinoy Lifestyle',
        answers: [
          { id: 'ph_46_q2_a1', text: '"Hala sorry, wrong send po! Hindi para sa\'yo \'yan!"', points: 44, acceptedVariants: ['sorry wrong send', 'wrong send', 'wrong send po', 'di para sa iyo'], displayOrder: 1 },
          { id: 'ph_46_q2_a2', text: '"Sorry, pinakialaman o napindot ng pamangkin/kapatid ko yung phone"', points: 28, acceptedVariants: ['nilaro ng bata', 'napindot ng pamangkin', 'hiniram ng kapatid', 'pinakialaman ang phone'], displayOrder: 2 },
          { id: 'ph_46_q2_a3', text: '"Na-hack yata ang account ko o nag-loko ang keyboard!"', points: 16, acceptedVariants: ['nahack ang account', 'nag-loko ang phone', 'autocorrect', 'nag-hang'], displayOrder: 3 },
          { id: 'ph_46_q2_a4', text: '"Forwarded message lang \'yan mula sa kabilang group chat"', points: 12, acceptedVariants: ['forwarded message lang', 'galing sa ibang gc', 'forward lang'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_46_q3',
        prompt: 'Kaninong Group Chat ang pinaka-nakakakabang mapagkamalan at mapag-send-an ng kalokohan o reklamo?',
        category: 'Pinoy Lifestyle',
        answers: [
          { id: 'ph_46_q3_a1', text: 'Sa Family Group Chat kung saan nandoon ang mga magulang at tiyahin', points: 42, acceptedVariants: ['family gc', 'family group chat', 'gc ng pamilya', 'chat ng kamag-anak'], displayOrder: 1 },
          { id: 'ph_46_q3_a2', text: 'Sa Work o Office Group Chat kasama ang Boss', points: 28, acceptedVariants: ['work gc', 'gc kasama ang boss', 'office gc', 'gc sa trabaho'], displayOrder: 2 },
          { id: 'ph_46_q3_a3', text: 'Sa School Class GC kasama ang teacher o professor', points: 18, acceptedVariants: ['school gc', 'class gc', 'gc kasama si teacher', 'gc ng klase'], displayOrder: 3 },
          { id: 'ph_46_q3_a4', text: 'Sa GC ng in-laws o pamilya ng jowa mo', points: 12, acceptedVariants: ['gc ng jowa', 'gc ng in-laws', 'gc ng biyenan'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_46_q4',
        prompt: 'Anong uri ng mensahe o litrato ang pinakanakakahiyang ma-send nang hindi sinasadya?',
        category: 'Pinoy Lifestyle',
        answers: [
          { id: 'ph_46_q4_a1', text: 'Screenshot ng mismong chat ninyo na may mapanghusgang komento', points: 44, acceptedVariants: ['screenshot ng chat nila', 'screenshot', 'backfight screenshot', 'screenshot ng usapan'], displayOrder: 1 },
          { id: 'ph_46_q4_a2', text: 'Reklamo o paninira tungkol sa boss o teacher', points: 26, acceptedVariants: ['reklamo sa boss', 'paninira sa teacher', 'tsismis sa katrabaho'], displayOrder: 2 },
          { id: 'ph_46_q4_a3', text: 'Nakakahiyang selfie o litratong bagong gising', points: 18, acceptedVariants: ['nakakahiyang selfie', 'pangit na picture', 'bagong gising picture', 'ugly photo'], displayOrder: 3 },
          { id: 'ph_46_q4_a4', text: 'Mensaheng pambola o maling pag-amin ng pag-ibig', points: 12, acceptedVariants: ['i love you', 'sweet message sa maling tao', 'landian chat'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_46_q5',
        prompt: 'Pagkatapos mag-unsend ng mensahe sa Group Chat, ano ang agad na itinatanong ng mga usisero mong kasama?',
        category: 'Pinoy Lifestyle',
        answers: [
          { id: 'ph_46_q5_a1', text: '"Ano \'yun? Bakit mo ini-unsend?!"', points: 46, acceptedVariants: ['ano yun', 'bakit inunsend', 'ano yung binura mo', 'ano un'], displayOrder: 1 },
          { id: 'ph_46_q5_a2', text: '"Naka-screenshot ako, may copy ako!"', points: 26, acceptedVariants: ['screenshot ko', 'may screenshot ako', 'nakita ko', 'nabasa ko'], displayOrder: 2 },
          { id: 'ph_46_q5_a3', text: '"Sino ang pinag-uusapan niyo?"', points: 16, acceptedVariants: ['sino pinag-uusapan', 'sinong tinitira niyo', 'para kanino yun'], displayOrder: 3 },
          { id: 'ph_46_q5_a4', text: 'Magpapadala ng mga mapang-asar na memes at stickers', points: 12, acceptedVariants: ['meme stickers', 'nag-send ng stickers', 'laugh reaction', 'nang-aasar na sticker'], displayOrder: 4 },
        ],
      },
    ],
  },

  // PACK 47 (Pack 8): May Group Project Kayo!
  {
    id: 'pack_ph_47',
    title: 'May Group Project Kayo!',
    description: 'Deadline na sa Biyernes, pero ang mga kagrupo mo ay puro "Seen", "Bukas na lang", at walang kibo sa Group Chat.',
    category: 'Education & School',
    isBuiltIn: true,
    createdAt: '2026-11-06T00:00:00.000Z',
    updatedAt: '2026-11-06T00:00:00.000Z',
    questions: [
      {
        id: 'ph_47_q1',
        prompt: 'Gumawa ka ng Group Chat para sa bagong project sa school. Ano ang unang reaksyon ng mga kagrupo mo?',
        category: 'Education & School',
        answers: [
          { id: 'ph_47_q1_a1', text: 'I-se-seen lang ang mensahe at walang sasagot', points: 45, acceptedVariants: ['seen zone', 'seen lang', 'ise-seen lang', 'walang sagot'], displayOrder: 1 },
          { id: 'ph_47_q1_a2', text: 'Magre-reply ng "Kayo bahala" o "Kung ano na lang desisyon niyo"', points: 26, acceptedVariants: ['kayo bahala', 'kung ano desisyon niyo', 'sunod na lang ako', 'kahit ano'], displayOrder: 2 },
          { id: 'ph_47_q1_a3', text: 'Magpapadala ng thumbs up o emoji sabay offline agad', points: 17, acceptedVariants: ['thumbs up', 'like reaction', 'emoji sabay offline', 'send ng sticker'], displayOrder: 3 },
          { id: 'ph_47_q1_a4', text: 'Magtatanong agad: "Sino ang leader natin?"', points: 12, acceptedVariants: ['sino ang leader', 'sinong leader', 'sino magiging leader'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_47_q2',
        prompt: 'Ano ang paboritong idahilan ng pabuhat na kagrupo kapag sinisingil sa kanyang naka-assign na part?',
        category: 'Education & School',
        answers: [
          { id: 'ph_47_q2_a1', text: '"Nawalan kami ng internet o mahina ang WiFi"', points: 42, acceptedVariants: ['nawalan ng internet', 'walang wifi', 'mahina signal', 'walang load'], displayOrder: 1 },
          { id: 'ph_47_q2_a2', text: '"Bumagsak ang lagnat ko / May sakit ako"', points: 26, acceptedVariants: ['may sakit ako', 'may lagnat', 'masama pakiramdam', 'nagkasakit'], displayOrder: 2 },
          { id: 'ph_47_q2_a3', text: '"Nasira ang laptop o nag-loko ang cellphone"', points: 18, acceptedVariants: ['nasira ang laptop', 'nag-hang ang computer', 'sira cp', 'nag-loko ang gadget'], displayOrder: 3 },
          { id: 'ph_47_q2_a4', text: '"Inutusan ako ni mama / May emergency sa pamilya"', points: 14, acceptedVariants: ['inutusan ni mama', 'family emergency', 'may lakad pamilya', 'inutusan'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_47_q3',
        prompt: 'Kapag magkikita raw kayo para "gumawa ng project" sa bahay ng kaklase, ano ang kadalasang totoong nangyayari?',
        category: 'Education & School',
        answers: [
          { id: 'ph_47_q3_a1', text: 'Mas matagal ang pagkain, merienda, at chikahan kaysa sa paggawa', points: 44, acceptedVariants: ['kain at kwentuhan', 'merienda at daldalan', 'chikahan', 'mas matagal kumain'], displayOrder: 1 },
          { id: 'ph_47_q3_a2', text: 'Maglalaro ng Mobile Legends o online games', points: 26, acceptedVariants: ['maglaro ng ml', 'mobile legends', 'online games', 'maglaro'], displayOrder: 2 },
          { id: 'ph_47_q3_a3', text: 'Isa o dalawa lang ang gumagawa habang nakatambay ang iba', points: 18, acceptedVariants: ['isa lang gumagawa', 'tambay ang iba', 'leader lang nagtatrabaho'], displayOrder: 3 },
          { id: 'ph_47_q3_a4', text: 'Matutulog o magpapahinga sa sofa', points: 12, acceptedVariants: ['matutulog', 'tulog sa sofa', 'hihiga', 'tambay'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_47_q4',
        prompt: 'Ano ang madalas na ginagawa ng masipag na leader kapag pumalpak o walang kwenta ang ipinasang part ng kagrupo?',
        category: 'Education & School',
        answers: [
          { id: 'ph_47_q4_a1', text: 'Uulitin at buburahin ang gawa nila para siya na lang ang mag-isa', points: 46, acceptedVariants: ['siya na lang uulit', 'uulitin ang gawa', 'leader na lang gagawa', 'siya magtatapos'], displayOrder: 1 },
          { id: 'ph_47_q4_a2', text: 'Magpaparinig o mag-rarant sa sariling social media MyDay', points: 24, acceptedVariants: ['magparinig sa myday', 'rant sa facebook o twitter', 'magparinig', 'status rant'], displayOrder: 2 },
          { id: 'ph_47_q4_a3', text: 'Tanggalin ang pangalan ng pabuhat sa title page', points: 18, acceptedVariants: ['tanggalin ang pangalan', 'alisin pangalan', 'walang pangalan sa cover page'], displayOrder: 3 },
          { id: 'ph_47_q4_a4', text: 'Isumbong nang diretso kay teacher o professor', points: 12, acceptedVariants: ['isumbong kay teacher', 'sumbong sa prof', 'isumbong'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_47_q5',
        prompt: 'Ano ang paboritong sabihin ng kagrupo na walang naitulong kapag oras na ng submission at presentation?',
        category: 'Education & School',
        answers: [
          { id: 'ph_47_q5_a1', text: '"Magkano ambag ko para sa printing at materials?"', points: 42, acceptedVariants: ['magkano ambag ko', 'magkano babayaran', 'ambag sa printing', 'bayad na lang ako'], displayOrder: 1 },
          { id: 'ph_47_q5_a2', text: '"Kayo na mag-present, taga-next na lang ako ng slides!"', points: 28, acceptedVariants: ['taga-next ng slides', 'taga click ng slides', 'taga next', 'kayo na magpresent'], displayOrder: 2 },
          { id: 'ph_47_q5_a3', text: '"Ang ganda ng gawa natin, proud to be part of the team!"', points: 18, acceptedVariants: ['ang ganda ng gawa natin', 'proud of our team', 'teamwork makes the dream work'], displayOrder: 3 },
          { id: 'ph_47_q5_a4', text: '"Ano nga pala ulit ang topic ng project natin?"', points: 12, acceptedVariants: ['ano nga ulit topic', 'anong topic natin', 'ano project natin'], displayOrder: 4 },
        ],
      },
    ],
  },

  // PACK 48 (Pack 9): May Nag-aya Kumain!
  {
    id: 'pack_ph_48',
    title: 'May Nag-aya Kumain!',
    description: 'Petsa de peligro at sakto na lang ang barya sa bulsa mo, pero biglang nagyaya ang tropa na "Kain tayo sa labas!"',
    category: 'Pinoy Lifestyle',
    isBuiltIn: true,
    createdAt: '2026-11-06T00:00:00.000Z',
    updatedAt: '2026-11-06T00:00:00.000Z',
    questions: [
      {
        id: 'ph_48_q1',
        prompt: 'Nagyaya ang mga kaibigan mo na kumain sa labas pero gipit ang budget mo. Ano ang una mong sinasabi?',
        category: 'Pinoy Lifestyle',
        answers: [
          { id: 'ph_48_q1_a1', text: '"Wala akong pera / Petsa de peligro na!"', points: 45, acceptedVariants: ['wala akong pera', 'petsa de peligro', 'walang pera', 'gipit ako', 'short ang budget'], displayOrder: 1 },
          { id: 'ph_48_q1_a2', text: '"Saan ba kakain? (Checking kung abot-kaya)"', points: 25, acceptedVariants: ['saan kakain', 'saan ba', 'magkano ba diyan', 'saang restaurant'], displayOrder: 2 },
          { id: 'ph_48_q1_a3', text: '"Libre mo ba? Kung libre mo, sasama ako!"', points: 18, acceptedVariants: ['libre mo ba', 'basta libre mo', 'kung may manlilibre', 'libre ba'], displayOrder: 3 },
          { id: 'ph_48_q1_a4', text: '"Busog pa ako / Kakatapos ko lang kumain sa bahay"', points: 12, acceptedVariants: ['busog pa ako', 'kakatapos lang kumain', 'busog pa', 'diet ako'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_48_q2',
        prompt: 'Napilitan kang sumama sa restaurant kahit walang budget. Anong diskarte ang ginagawa mo sa pag-order?',
        category: 'Pinoy Lifestyle',
        answers: [
          { id: 'ph_48_q2_a1', text: 'Maghahanap ng pinakamurang item sa menu o value meal', points: 42, acceptedVariants: ['pinakamurang item', 'value meal', 'pinakamura sa menu', 'cheapest option'], displayOrder: 1 },
          { id: 'ph_48_q2_a2', text: 'Tubig o service water lang ang inumin, bawal mag-softdrinks', points: 26, acceptedVariants: ['service water lang', 'tubig lang', 'water lang po', 'wag mag-softdrinks'], displayOrder: 2 },
          { id: 'ph_48_q2_a3', text: 'Makikikain o makiki-share sa order ng kaibigan', points: 18, acceptedVariants: ['makiki-share', 'hingi sa kaibigan', 'makikikain sa iba', 'share order'], displayOrder: 3 },
          { id: 'ph_48_q2_a4', text: 'Magkunwaring hindi gutom at samahan lang sila', points: 14, acceptedVariants: ['samahan lang sila', 'di gutom', 'sasabay lang tumambay'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_48_q3',
        prompt: 'Saan karaniwang dinadala ng barkada ang kainan kapag gusto ng lahat na makatipid at mabusog?',
        category: 'Pinoy Lifestyle',
        answers: [
          { id: 'ph_48_q3_a1', text: 'Sa Karinderya o Turo-turo', points: 38, acceptedVariants: ['karinderya', 'carinderia', 'turo turo', 'karenderya'], displayOrder: 1 },
          { id: 'ph_48_q3_a2', text: 'Sa Paresan o Gotohan', points: 26, acceptedVariants: ['paresan', 'pares overload', 'gotohan', 'pares'], displayOrder: 2 },
          { id: 'ph_48_q3_a3', text: 'Sa Tusok-tusok / Street food cart (Fishball, Kwek-kwek)', points: 20, acceptedVariants: ['street food', 'tusok tusok', 'fishball kwek kwek', 'fishballan'], displayOrder: 3 },
          { id: 'ph_48_q3_a4', text: 'Sa Fast food na may unlimited rice o murang chicken', points: 16, acceptedVariants: ['unli rice', 'mang inasal', 'fast food', 'murang chicken'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_48_q4',
        prompt: 'Dumating na ang bill sa lamesa. Ano ang klasikong eksena kapag magbabayaran na?',
        category: 'Pinoy Lifestyle',
        answers: [
          { id: 'ph_48_q4_a1', text: 'Maglalabas ng calculator para kwentahin ang kanya-kanyang share', points: 40, acceptedVariants: ['mag-calculator', 'calculator sa phone', 'compute ng share', 'kanya kanyang kwenta'], displayOrder: 1 },
          { id: 'ph_48_q4_a2', text: 'Magtatanong: "Tumatanggap ba kayo ng GCash dito?"', points: 28, acceptedVariants: ['may gcash ba', 'tumatanggap ng gcash', 'pwede gcash', 'send sa gcash'], displayOrder: 2 },
          { id: 'ph_48_q4_a3', text: 'May magsasabing: "Wala akong barya, bayaran ko muna mamaya"', points: 18, acceptedVariants: ['wala akong barya', 'abono mo muna', 'bayaran ko mamaya', 'pautang muna'], displayOrder: 3 },
          { id: 'ph_48_q4_a4', text: 'May biglang magpapanggap na nagbanyo o nag-phone call', points: 14, acceptedVariants: ['nagbanyo', 'pumunta sa cr', 'kunwari may tawag', 'umalis sa cr'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_48_q5',
        prompt: 'Ano ang paboritong biro sa tropa kapag may isang biglang nagsabi ng "Sagot ko na kayong lahat!"?',
        category: 'Pinoy Lifestyle',
        answers: [
          { id: 'ph_48_q5_a1', text: '"Mayaman ka na ah! Nanalo ka ba sa lotto?!"', points: 42, acceptedVariants: ['nanalo sa lotto', 'mayaman ka na', 'tumama ka sa lotto', 'yaman'], displayOrder: 1 },
          { id: 'ph_48_q5_a2', text: '"Baka may kasalanan ka o may hihingin kang pabor!"', points: 28, acceptedVariants: ['may kasalanan ka', 'may hihinging pabor', 'anong kailangan mo'], displayOrder: 2 },
          { id: 'ph_48_q5_a3', text: '"Order tayo ng pinakamahal sa menu, bilis!"', points: 18, acceptedVariants: ['order pinakamahal', 'lubusin natin', 'order pa', 'order ng marami'], displayOrder: 3 },
          { id: 'ph_48_q5_a4', text: '"Seryoso ka ba? Walang bawian ha!"', points: 12, acceptedVariants: ['walang bawian', 'seryoso ka ba', 'sure ka ba', 'bawal bawiin'], displayOrder: 4 },
        ],
      },
    ],
  },

  // PACK 49 (Pack 10): Nag-away ang Magkapatid!
  {
    id: 'pack_ph_49',
    title: 'Nag-away ang Magkapatid!',
    description: 'Mula sa pag-aagawan ng remote hanggang sa paghiram ng damit nang walang paalam—ang araw-araw na gulo ng magkapatid.',
    category: 'Family & Home',
    isBuiltIn: true,
    createdAt: '2026-11-06T00:00:00.000Z',
    updatedAt: '2026-11-06T00:00:00.000Z',
    questions: [
      {
        id: 'ph_49_q1',
        prompt: 'Ano ang pinakakaraniwang pinag-aawayan ng magkapatid sa loob ng bahay?',
        category: 'Family & Home',
        answers: [
          { id: 'ph_49_q1_a1', text: 'Ang remote ng TV o kung anong palabas ang panonoorin', points: 38, acceptedVariants: ['remote ng tv', 'remote control', 'palabas sa tv', 'channel sa tv'], displayOrder: 1 },
          { id: 'ph_49_q1_a2', text: 'Paggamit o panghihiram ng damit nang walang paalam', points: 28, acceptedVariants: ['hiram ng damit', 'damit na walang paalam', 'suot ng damit', 'hiniram ang damit'], displayOrder: 2 },
          { id: 'ph_49_q1_a3', text: 'Kung sinong toka o turno na maghugas ng plato', points: 20, acceptedVariants: ['hugas ng plato', 'toka sa pinggan', 'hugasin', 'sinong maghuhugas'], displayOrder: 3 },
          { id: 'ph_49_q1_a4', text: 'Pangingialam o pagkain sa itinagong pagkain sa ref', points: 14, acceptedVariants: ['kinain ang pagkain', 'pagkain sa ref', 'ulam o snack', 'kinain ang tinago'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_49_q2',
        prompt: 'May nabasag na baso o gamit si bunso habang nagkukulitan. Ano ang unang isinisigaw bago dumating ang magulang?',
        category: 'Family & Home',
        answers: [
          { id: 'ph_49_q2_a1', text: '"Hala ka! Isusumbong kita kay Mama!"', points: 45, acceptedVariants: ['isusumbong kita', 'hala ka', 'sumbong kita kay mama', 'lagot ka kay mama'], displayOrder: 1 },
          { id: 'ph_49_q2_a2', text: '"Wag mong sabihing ako ang nakabasag ha!"', points: 26, acceptedVariants: ['wag sabihing ako', 'sabihin mo di ako', 'wag mo ko idadamay'], displayOrder: 2 },
          { id: 'ph_49_q2_a3', text: '"Linisin mo agad bago makita ni Papa!"', points: 17, acceptedVariants: ['linisin mo agad', 'pulutin mo', 'itapon mo agad', 'walisin mo'], displayOrder: 3 },
          { id: 'ph_49_q2_a4', text: '"Kasalanan mo \'yan, ikaw ang nagtulak sa akin!"', points: 12, acceptedVariants: ['kasalanan mo yan', 'ikaw nagtulak', 'kasalanan mo'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_49_q3',
        prompt: 'Ano ang paboritong panunukso o pang-aasar ng panganay sa kanyang nakababatang kapatid?',
        category: 'Family & Home',
        answers: [
          { id: 'ph_49_q3_a1', text: '"Ampon ka lang, napulot ka lang sa basurahan!"', points: 44, acceptedVariants: ['ampon ka lang', 'napulot sa basurahan', 'ampon', 'napulot ka lang'], displayOrder: 1 },
          { id: 'ph_49_q3_a2', text: '"Pangit ka, hindi ka kamukha nila Mama at Papa!"', points: 25, acceptedVariants: ['pangit ka', 'di ka kamukha nila mama', 'ampon ka'], displayOrder: 2 },
          { id: 'ph_49_q3_a3', text: '"Isusumbong ko \'yung crush mo o sikreto mo!"', points: 18, acceptedVariants: ['isusumbong crush mo', 'alam ko sikreto mo', 'sasabihin ko crush mo'], displayOrder: 3 },
          { id: 'ph_49_q3_a4', text: '"Umiiyak ka na naman, sumbungero!"', points: 13, acceptedVariants: ['iiyak na yan', 'iiyak na', 'sumbungero', 'iyakin'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_49_q4',
        prompt: 'Kapag nag-away at nagkasakitan ang magkapatid, anong ginagawa ng nakasakit kapag nakitang iiyak na ang kapatid?',
        category: 'Family & Home',
        answers: [
          { id: 'ph_49_q4_a1', text: 'Tatakpan ang bibig sabay pakiusap na "Huwag kang umiyak, bibigyan kita ng pera/laruan!"', points: 46, acceptedVariants: ['takpan ang bibig', 'wag kang umiyak', 'bibigyan ng pera', 'pakiusap wag umiyak', 'suhol'], displayOrder: 1 },
          { id: 'ph_49_q4_a2', text: 'Sasabihing "Gantihan mo na lang ako nang mahina, patas na tayo!"', points: 26, acceptedVariants: ['gantihan mo ako', 'suntukin mo rin ako mahina', 'bawi ka na lang', 'patas na'], displayOrder: 2 },
          { id: 'ph_49_q4_a3', text: 'Magpanggap na nasaktan din siya para pantay ang iyak', points: 16, acceptedVariants: ['magpanggap na nasaktan din', 'kunwari masakit din', 'umiyak din'], displayOrder: 3 },
          { id: 'ph_49_q4_a4', text: 'Tumakbo at magtago sa loob ng banyo o kwarto', points: 12, acceptedVariants: ['tumakbo at magtago', 'tago sa kwarto', 'magtago', 'takbo sa banyo'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_49_q5',
        prompt: 'Ano ang klasikong hatol o sinasabi ni nanay kapag nagsumbungan ang magkapatid?',
        category: 'Family & Home',
        answers: [
          { id: 'ph_49_q5_a1', text: '"Pareho kayong may kasalanan, pareho kayong mapapalo!"', points: 45, acceptedVariants: ['pareho may kasalanan', 'pareho kayong mapapalo', 'damay kayong dalawa', 'parehas kayo'], displayOrder: 1 },
          { id: 'ph_49_q5_a2', text: '"Ikaw ang mas matanda, ikaw ang magparaya at umintindi!"', points: 28, acceptedVariants: ['mas matanda magparaya', 'ikaw mas matanda', 'magparaya ka', 'umintindi ka'], displayOrder: 2 },
          { id: 'ph_49_q5_a3', text: '"Huwag kayong mag-away, magkapatid kayo!"', points: 17, acceptedVariants: ['magkapatid kayo', 'wag mag-away', 'magbati kayo'], displayOrder: 3 },
          { id: 'ph_49_q5_a4', text: '"Paghahampasin ko kayong dalawa ng tsinelas!"', points: 10, acceptedVariants: ['hampas ng tsinelas', 'paluin ng tsinelas', 'tsinelas', 'kukunin ko sinturon'], displayOrder: 4 },
        ],
      },
    ],
  },
];
