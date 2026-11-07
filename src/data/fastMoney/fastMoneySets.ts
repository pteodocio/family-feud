import type { Question } from '../../types/game';

export interface FastMoneySet {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export const FAST_MONEY_SETS: FastMoneySet[] = [
  // ==========================================
  // SET 01: NIGHT JOBS, QUIET PLACES & BANK VISITS
  // ==========================================
  {
    id: 'fm_set_01',
    title: 'Fast Money Set 01',
    description: 'Night shift careers, silent places, hand protection, barefoot sports, and in-person banking.',
    questions: [
      {
        id: 'fm_01_q1',
        prompt: 'Name a job or profession that requires working at night while others are asleep.',
        category: 'Jobs & Occupations',
        answers: [
          { id: 'fm_01_q1_a1', text: 'Doctor or Nurse', points: 35, acceptedVariants: ['doctor', 'nurse', 'hospital staff', 'medtech', 'doktor'], displayOrder: 1 },
          { id: 'fm_01_q1_a2', text: 'Security guard', points: 28, acceptedVariants: ['security guard', 'guard', 'sekyu', 'bantay'], displayOrder: 2 },
          { id: 'fm_01_q1_a3', text: 'Call center agent / BPO', points: 20, acceptedVariants: ['call center', 'bpo', 'agent', 'call center agent'], displayOrder: 3 },
          { id: 'fm_01_q1_a4', text: 'Police officer', points: 11, acceptedVariants: ['police', 'pulis', 'cop', 'patrol'], displayOrder: 4 },
          { id: 'fm_01_q1_a5', text: 'Baker', points: 6, acceptedVariants: ['baker', 'panadero', 'bakeshop staff'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_01_q2',
        prompt: 'Name a place where people are strictly expected to remain quiet.',
        category: 'Public Spaces',
        answers: [
          { id: 'fm_01_q2_a1', text: 'Library', points: 42, acceptedVariants: ['library', 'silid-aklatan', 'reading room'], displayOrder: 1 },
          { id: 'fm_01_q2_a2', text: 'Church or Chapel', points: 28, acceptedVariants: ['church', 'chapel', 'simbahan', 'kapilya'], displayOrder: 2 },
          { id: 'fm_01_q2_a3', text: 'Hospital or Clinic', points: 16, acceptedVariants: ['hospital', 'clinic', 'icu', 'ward', 'ospital'], displayOrder: 3 },
          { id: 'fm_01_q2_a4', text: 'Cinema / Movie theater', points: 9, acceptedVariants: ['cinema', 'movie theater', 'sinehan', 'sine'], displayOrder: 4 },
          { id: 'fm_01_q2_a5', text: 'Courtroom', points: 5, acceptedVariants: ['courtroom', 'court', 'korte'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_01_q3',
        prompt: 'Name something a person wears specifically to protect their hands.',
        category: 'Safety & Clothing',
        answers: [
          { id: 'fm_01_q3_a1', text: 'Rubber cleaning gloves', points: 38, acceptedVariants: ['gloves', 'rubber gloves', 'guwantes', 'latex gloves'], displayOrder: 1 },
          { id: 'fm_01_q3_a2', text: 'Winter mittens or gloves', points: 26, acceptedVariants: ['winter gloves', 'mittens', 'wool gloves'], displayOrder: 2 },
          { id: 'fm_01_q3_a3', text: 'Oven mitts / Heat pads', points: 20, acceptedVariants: ['oven mitts', 'potholder', 'oven gloves', 'mitts'], displayOrder: 3 },
          { id: 'fm_01_q3_a4', text: 'Boxing gloves', points: 11, acceptedVariants: ['boxing gloves', 'hand wraps', 'punching gloves'], displayOrder: 4 },
          { id: 'fm_01_q3_a5', text: 'Gardening gloves', points: 5, acceptedVariants: ['gardening gloves', 'work gloves', 'leather gloves'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_01_q4',
        prompt: 'Name a sport where competitors compete barefoot without shoes.',
        category: 'Sports & Athletics',
        answers: [
          { id: 'fm_01_q4_a1', text: 'Swimming', points: 40, acceptedVariants: ['swimming', 'langoy', 'dive', 'diving'], displayOrder: 1 },
          { id: 'fm_01_q4_a2', text: 'Martial arts / Karate / Taekwondo', points: 30, acceptedVariants: ['karate', 'taekwondo', 'judo', 'mma', 'martial arts'], displayOrder: 2 },
          { id: 'fm_01_q4_a3', text: 'Gymnastics', points: 16, acceptedVariants: ['gymnastics', 'tumbling'], displayOrder: 3 },
          { id: 'fm_01_q4_a4', text: 'Surfing', points: 9, acceptedVariants: ['surfing', 'surf'], displayOrder: 4 },
          { id: 'fm_01_q4_a5', text: 'Beach volleyball', points: 5, acceptedVariants: ['beach volleyball', 'volleyball on sand'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_01_q5',
        prompt: 'Name a reason someone visits a physical bank branch instead of using an app.',
        category: 'Banking & Finance',
        answers: [
          { id: 'fm_01_q5_a1', text: 'Deposit cash or check', points: 38, acceptedVariants: ['deposit', 'deposit cash', 'mag-deposit', 'check deposit', 'cash deposit'], displayOrder: 1 },
          { id: 'fm_01_q5_a2', text: 'Withdraw large amount of cash', points: 27, acceptedVariants: ['withdraw', 'mag-withdraw', 'large withdrawal', 'over the counter'], displayOrder: 2 },
          { id: 'fm_01_q5_a3', text: 'Open a new account', points: 18, acceptedVariants: ['open account', 'magbukas ng account', 'new bank account'], displayOrder: 3 },
          { id: 'fm_01_q5_a4', text: 'Apply for a loan', points: 11, acceptedVariants: ['loan', 'apply loan', 'housing loan', 'car loan'], displayOrder: 4 },
          { id: 'fm_01_q5_a5', text: 'Replace lost ATM card', points: 6, acceptedVariants: ['replace card', 'lost card', 'atm card replacement'], displayOrder: 5 },
        ],
      },
    ],
  },

  // ==========================================
  // SET 02: KITCHEN BASICS, UNITS & TOOLS
  // ==========================================
  {
    id: 'fm_set_02',
    title: 'Fast Money Set 02',
    description: 'Tear-inducing veggies, recipe units, kitchen openers, breakfast bowls, and peeled fruits.',
    questions: [
      {
        id: 'fm_02_q1',
        prompt: 'Name a vegetable that makes your eyes water when you chop it.',
        category: 'Food & Cooking',
        answers: [
          { id: 'fm_02_q1_a1', text: 'Onion', points: 65, acceptedVariants: ['onion', 'sibuyas', 'red onion', 'white onion'], displayOrder: 1 },
          { id: 'fm_02_q1_a2', text: 'Chili pepper / Siling labuyo', points: 18, acceptedVariants: ['chili', 'sili', 'siling labuyo', 'hot pepper', 'pepper'], displayOrder: 2 },
          { id: 'fm_02_q1_a3', text: 'Garlic', points: 10, acceptedVariants: ['garlic', 'bawang'], displayOrder: 3 },
          { id: 'fm_02_q1_a4', text: 'Horseradish', points: 4, acceptedVariants: ['horseradish', 'wasabi'], displayOrder: 4 },
          { id: 'fm_02_q1_a5', text: 'Scallions / Leeks', points: 3, acceptedVariants: ['scallions', 'leeks', 'spring onion'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_02_q2',
        prompt: 'Name a common unit of measurement found in cooking recipe books.',
        category: 'Measurements & Kitchen',
        answers: [
          { id: 'fm_02_q2_a1', text: 'Cup', points: 45, acceptedVariants: ['cup', 'cups', 'tasa'], displayOrder: 1 },
          { id: 'fm_02_q2_a2', text: 'Tablespoon', points: 25, acceptedVariants: ['tablespoon', 'tbsp', 'kutsara'], displayOrder: 2 },
          { id: 'fm_02_q2_a3', text: 'Teaspoon', points: 16, acceptedVariants: ['teaspoon', 'tsp', 'kutsarita'], displayOrder: 3 },
          { id: 'fm_02_q2_a4', text: 'Grams or Kilograms', points: 9, acceptedVariants: ['grams', 'kilos', 'kilograms', 'g', 'kg'], displayOrder: 4 },
          { id: 'fm_02_q2_a5', text: 'Milliliters or Liters', points: 5, acceptedVariants: ['milliliters', 'liters', 'ml', 'litro'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_02_q3',
        prompt: 'Name a tool used in the kitchen specifically for opening containers.',
        category: 'Kitchen Utensils',
        answers: [
          { id: 'fm_02_q3_a1', text: 'Can opener', points: 50, acceptedVariants: ['can opener', 'abrelata', 'tin opener'], displayOrder: 1 },
          { id: 'fm_02_q3_a2', text: 'Bottle opener', points: 26, acceptedVariants: ['bottle opener', 'abrebote', 'opener'], displayOrder: 2 },
          { id: 'fm_02_q3_a3', text: 'Corkscrew', points: 12, acceptedVariants: ['corkscrew', 'wine opener'], displayOrder: 3 },
          { id: 'fm_02_q3_a4', text: 'Kitchen shears / Scissors', points: 7, acceptedVariants: ['scissors', 'shears', 'gunting'], displayOrder: 4 },
          { id: 'fm_02_q3_a5', text: 'Chef knife', points: 5, acceptedVariants: ['knife', 'kutsilyo', 'chef knife'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_02_q4',
        prompt: 'Name a hot porridge or cereal commonly served in a breakfast bowl.',
        category: 'Breakfast Food',
        answers: [
          { id: 'fm_02_q4_a1', text: 'Oatmeal', points: 44, acceptedVariants: ['oatmeal', 'oats', 'rolled oats'], displayOrder: 1 },
          { id: 'fm_02_q4_a2', text: 'Champorado', points: 28, acceptedVariants: ['champorado', 'chocolate rice porridge', 'tsamporado'], displayOrder: 2 },
          { id: 'fm_02_q4_a3', text: 'Arroz Caldo / Lugaw', points: 16, acceptedVariants: ['lugaw', 'arroz caldo', 'pospas', 'rice porridge'], displayOrder: 3 },
          { id: 'fm_02_q4_a4', text: 'Cornflakes', points: 8, acceptedVariants: ['cornflakes', 'cereal'], displayOrder: 4 },
          { id: 'fm_02_q4_a5', text: 'Granola', points: 4, acceptedVariants: ['granola', 'muesli'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_02_q5',
        prompt: 'Name a fruit that people always peel before eating.',
        category: 'Fruits & Produce',
        answers: [
          { id: 'fm_02_q5_a1', text: 'Banana', points: 55, acceptedVariants: ['banana', 'saging'], displayOrder: 1 },
          { id: 'fm_02_q5_a2', text: 'Orange or Citrus', points: 24, acceptedVariants: ['orange', 'dalandan', 'mandarin', 'citrus'], displayOrder: 2 },
          { id: 'fm_02_q5_a3', text: 'Mango', points: 12, acceptedVariants: ['mango', 'mangga'], displayOrder: 3 },
          { id: 'fm_02_q5_a4', text: 'Pineapple', points: 6, acceptedVariants: ['pineapple', 'pinya'], displayOrder: 4 },
          { id: 'fm_02_q5_a5', text: 'Watermelon', points: 3, acceptedVariants: ['watermelon', 'pakwan'], displayOrder: 5 },
        ],
      },
    ],
  },

  // ==========================================
  // SET 03: CLOTHES, TAILORING & ACCESSORIES
  // ==========================================
  {
    id: 'fm_set_03',
    title: 'Fast Money Set 03',
    description: 'Headwear choices, paired items, jacket fasteners, dry cleaning, and fitting room checks.',
    questions: [
      {
        id: 'fm_03_q1',
        prompt: 'Name a headwear accessory people wear besides a baseball cap.',
        category: 'Fashion & Clothing',
        answers: [
          { id: 'fm_03_q1_a1', text: 'Beanie or Bonnet', points: 38, acceptedVariants: ['beanie', 'bonnet', 'knitted cap'], displayOrder: 1 },
          { id: 'fm_03_q1_a2', text: 'Sun hat or Straw hat', points: 28, acceptedVariants: ['sun hat', 'straw hat', 'sombrero', 'bucket hat'], displayOrder: 2 },
          { id: 'fm_03_q1_a3', text: 'Headband', points: 16, acceptedVariants: ['headband', 'hairband'], displayOrder: 3 },
          { id: 'fm_03_q1_a4', text: 'Bandana', points: 11, acceptedVariants: ['bandana', 'scarf', 'panyo'], displayOrder: 4 },
          { id: 'fm_03_q1_a5', text: 'Beret', points: 7, acceptedVariants: ['beret', 'baker boy hat'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_03_q2',
        prompt: 'Name an article of clothing that is sold and worn in pairs.',
        category: 'Apparel & Accessories',
        answers: [
          { id: 'fm_03_q2_a1', text: 'Socks', points: 48, acceptedVariants: ['socks', 'medyas'], displayOrder: 1 },
          { id: 'fm_03_q2_a2', text: 'Shoes or Sneakers', points: 30, acceptedVariants: ['shoes', 'sneakers', 'sapatos', 'tsinelas'], displayOrder: 2 },
          { id: 'fm_03_q2_a3', text: 'Gloves or Mittens', points: 12, acceptedVariants: ['gloves', 'mittens', 'guwantes'], displayOrder: 3 },
          { id: 'fm_03_q2_a4', text: 'Stockings / Tights', points: 6, acceptedVariants: ['stockings', 'tights', 'pantyhose'], displayOrder: 4 },
          { id: 'fm_03_q2_a5', text: 'Earrings', points: 4, acceptedVariants: ['earrings', 'hikaw'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_03_q3',
        prompt: 'Name a fastener used to hold clothes or jackets closed.',
        category: 'Sewing & Tailoring',
        answers: [
          { id: 'fm_03_q3_a1', text: 'Zipper', points: 48, acceptedVariants: ['zipper', 'zip'], displayOrder: 1 },
          { id: 'fm_03_q3_a2', text: 'Buttons', points: 32, acceptedVariants: ['button', 'buttons', 'butones'], displayOrder: 2 },
          { id: 'fm_03_q3_a3', text: 'Velcro', points: 11, acceptedVariants: ['velcro', 'hook and loop'], displayOrder: 3 },
          { id: 'fm_03_q3_a4', text: 'Belt buckle', points: 6, acceptedVariants: ['buckle', 'belt buckle', 'sinturon'], displayOrder: 4 },
          { id: 'fm_03_q3_a5', text: 'Snaps or Hooks', points: 3, acceptedVariants: ['snaps', 'hooks', 'safety pin'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_03_q4',
        prompt: 'Name an item of clothing people take to a professional dry cleaner.',
        category: 'Laundry & Clothing Care',
        answers: [
          { id: 'fm_03_q4_a1', text: 'Formal suit or Tuxedo', points: 44, acceptedVariants: ['suit', 'tuxedo', 'coat', 'blazer', 'terno'], displayOrder: 1 },
          { id: 'fm_03_q4_a2', text: 'Wedding gown or Evening dress', points: 30, acceptedVariants: ['gown', 'dress', 'wedding gown', 'evening dress'], displayOrder: 2 },
          { id: 'fm_03_q4_a3', text: 'Winter overcoat', points: 14, acceptedVariants: ['overcoat', 'coat', 'winter jacket', 'trench coat'], displayOrder: 3 },
          { id: 'fm_03_q4_a4', text: 'Barong Tagalog', points: 8, acceptedVariants: ['barong', 'barong tagalog'], displayOrder: 4 },
          { id: 'fm_03_q4_a5', text: 'Leather jacket', points: 4, acceptedVariants: ['leather jacket', 'leather'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_03_q5',
        prompt: 'Name something people check when trying on pants in a fitting room.',
        category: 'Shopping & Apparel',
        answers: [
          { id: 'fm_03_q5_a1', text: 'Waist fit', points: 48, acceptedVariants: ['waist', 'bewang', 'waistline', 'fit sa bewang'], displayOrder: 1 },
          { id: 'fm_03_q5_a2', text: 'Pant leg length', points: 26, acceptedVariants: ['length', 'haba', 'pant length', 'laylayan'], displayOrder: 2 },
          { id: 'fm_03_q5_a3', text: 'Thigh and seat comfort', points: 14, acceptedVariants: ['comfort', 'thigh fit', 'loose or tight', 'pwet'], displayOrder: 3 },
          { id: 'fm_03_q5_a4', text: 'Fabric stretch', points: 8, acceptedVariants: ['fabric', 'stretch', 'tela'], displayOrder: 4 },
          { id: 'fm_03_q5_a5', text: 'Pocket depth', points: 4, acceptedVariants: ['pocket', 'bulsa', 'pockets'], displayOrder: 5 },
        ],
      },
    ],
  },

  // ==========================================
  // SET 04: ASTRONOMY, WEATHER & LANDFORMS
  // ==========================================
  {
    id: 'fm_set_04',
    title: 'Fast Money Set 04',
    description: 'Night sky wonders, high landforms, sun protection, rotary wind storms, and freshwater bodies.',
    questions: [
      {
        id: 'fm_04_q1',
        prompt: 'Name a celestial body you can see in the clear night sky without a telescope.',
        category: 'Astronomy & Nature',
        answers: [
          { id: 'fm_04_q1_a1', text: 'Moon', points: 52, acceptedVariants: ['moon', 'buwan', 'full moon'], displayOrder: 1 },
          { id: 'fm_04_q1_a2', text: 'Stars', points: 32, acceptedVariants: ['stars', 'star', 'bituin', 'tala'], displayOrder: 2 },
          { id: 'fm_04_q1_a3', text: 'Planets / Venus', points: 9, acceptedVariants: ['planet', 'planets', 'venus', 'mars'], displayOrder: 3 },
          { id: 'fm_04_q1_a4', text: 'Shooting star / Meteor', points: 5, acceptedVariants: ['shooting star', 'meteor', 'bulalakaw'], displayOrder: 4 },
          { id: 'fm_04_q1_a5', text: 'Comet', points: 2, acceptedVariants: ['comet', 'kometa'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_04_q2',
        prompt: 'Name a natural landform that rises high above the surrounding land.',
        category: 'Geography & Landforms',
        answers: [
          { id: 'fm_04_q2_a1', text: 'Mountain', points: 50, acceptedVariants: ['mountain', 'bundok'], displayOrder: 1 },
          { id: 'fm_04_q2_a2', text: 'Volcano', points: 28, acceptedVariants: ['volcano', 'bulkan'], displayOrder: 2 },
          { id: 'fm_04_q2_a3', text: 'Hill', points: 12, acceptedVariants: ['hill', 'burol'], displayOrder: 3 },
          { id: 'fm_04_q2_a4', text: 'Cliff or Plateau', points: 6, acceptedVariants: ['cliff', 'plateau', 'talampas'], displayOrder: 4 },
          { id: 'fm_04_q2_a5', text: 'Canyon', points: 4, acceptedVariants: ['canyon', 'lambak'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_04_q3',
        prompt: 'Name something people use to protect their skin from intense sunlight.',
        category: 'Personal Care & Sun Safety',
        answers: [
          { id: 'fm_04_q3_a1', text: 'Sunscreen or Sunblock lotion', points: 45, acceptedVariants: ['sunscreen', 'sunblock', 'lotion'], displayOrder: 1 },
          { id: 'fm_04_q3_a2', text: 'Umbrella', points: 26, acceptedVariants: ['umbrella', 'payong'], displayOrder: 2 },
          { id: 'fm_04_q3_a3', text: 'Sunglasses', points: 14, acceptedVariants: ['sunglasses', 'shades'], displayOrder: 3 },
          { id: 'fm_04_q3_a4', text: 'Wide-brim sun hat', points: 10, acceptedVariants: ['hat', 'cap', 'sombrero'], displayOrder: 4 },
          { id: 'fm_04_q3_a5', text: 'Long sleeve rashguard or jacket', points: 5, acceptedVariants: ['long sleeves', 'jacket', 'rashguard'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_04_q4',
        prompt: 'Name a type of storm characterized by spinning or circular winds.',
        category: 'Weather & Meteorology',
        answers: [
          { id: 'fm_04_q4_a1', text: 'Tornado / Ipo-ipo', points: 46, acceptedVariants: ['tornado', 'ipo-ipo', 'twister'], displayOrder: 1 },
          { id: 'fm_04_q4_a2', text: 'Typhoon / Hurricane', points: 34, acceptedVariants: ['typhoon', 'bagyo', 'hurricane'], displayOrder: 2 },
          { id: 'fm_04_q4_a3', text: 'Cyclone', points: 12, acceptedVariants: ['cyclone', 'tropical cyclone'], displayOrder: 3 },
          { id: 'fm_04_q4_a4', text: 'Whirlwind', points: 5, acceptedVariants: ['whirlwind', 'buhawi'], displayOrder: 4 },
          { id: 'fm_04_q4_a5', text: 'Dust devil', points: 3, acceptedVariants: ['dust devil', 'sandstorm'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_04_q5',
        prompt: 'Name a body of fresh water smaller than an ocean.',
        category: 'Geography & Water',
        answers: [
          { id: 'fm_04_q5_a1', text: 'River', points: 46, acceptedVariants: ['river', 'ilog'], displayOrder: 1 },
          { id: 'fm_04_q5_a2', text: 'Lake', points: 30, acceptedVariants: ['lake', 'lawa'], displayOrder: 2 },
          { id: 'fm_04_q5_a3', text: 'Waterfalls', points: 12, acceptedVariants: ['waterfall', 'waterfalls', 'talon'], displayOrder: 3 },
          { id: 'fm_04_q5_a4', text: 'Stream or Creek', points: 8, acceptedVariants: ['stream', 'creek', 'sapa'], displayOrder: 4 },
          { id: 'fm_04_q5_a5', text: 'Pond', points: 4, acceptedVariants: ['pond', 'palaisdaan'], displayOrder: 5 },
        ],
      },
    ],
  },

  // ==========================================
  // SET 05: HUMAN BODY, HEALTH & MEDICINE
  // ==========================================
  {
    id: 'fm_set_05',
    title: 'Fast Money Set 05',
    description: 'Lifelong growing body parts, liquid syrups, leg joints, nurse instruments, and sore throat triggers.',
    questions: [
      {
        id: 'fm_05_q1',
        prompt: 'Name a part of the human body that continues to grow throughout life.',
        category: 'Human Biology',
        answers: [
          { id: 'fm_05_q1_a1', text: 'Hair', points: 42, acceptedVariants: ['hair', 'buhok'], displayOrder: 1 },
          { id: 'fm_05_q1_a2', text: 'Nails', points: 34, acceptedVariants: ['nails', 'fingernails', 'kuko'], displayOrder: 2 },
          { id: 'fm_05_q1_a3', text: 'Ears', points: 14, acceptedVariants: ['ears', 'tenga'], displayOrder: 3 },
          { id: 'fm_05_q1_a4', text: 'Nose', points: 7, acceptedVariants: ['nose', 'ilong'], displayOrder: 4 },
          { id: 'fm_05_q1_a5', text: 'Beard', points: 3, acceptedVariants: ['beard', 'bigote', 'balbas'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_05_q2',
        prompt: 'Name a liquid medicine people take using a spoon or dosage cup.',
        category: 'Medicine & Health',
        answers: [
          { id: 'fm_05_q2_a1', text: 'Cough syrup', points: 52, acceptedVariants: ['cough syrup', 'gamot sa ubo', 'syrup'], displayOrder: 1 },
          { id: 'fm_05_q2_a2', text: 'Paracetamol / Fever suspension', points: 24, acceptedVariants: ['paracetamol', 'fever syrup', 'gamot sa lagnat', 'biogesic'], displayOrder: 2 },
          { id: 'fm_05_q2_a3', text: 'Antacid liquid', points: 12, acceptedVariants: ['antacid', 'kremil s', 'gaviscon'], displayOrder: 3 },
          { id: 'fm_05_q2_a4', text: 'Liquid vitamins', points: 8, acceptedVariants: ['vitamins', 'tiki-tiki', 'cherifer'], displayOrder: 4 },
          { id: 'fm_05_q2_a5', text: 'Antibiotic syrup', points: 4, acceptedVariants: ['antibiotic', 'amoxicillin'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_05_q3',
        prompt: 'Name a major joint in the human leg that bends when walking.',
        category: 'Human Anatomy',
        answers: [
          { id: 'fm_05_q3_a1', text: 'Knee', points: 58, acceptedVariants: ['knee', 'tuhod'], displayOrder: 1 },
          { id: 'fm_05_q3_a2', text: 'Ankle', points: 26, acceptedVariants: ['ankle', 'bukung-bukong'], displayOrder: 2 },
          { id: 'fm_05_q3_a3', text: 'Hip', points: 11, acceptedVariants: ['hip', 'balakang'], displayOrder: 3 },
          { id: 'fm_05_q3_a4', text: 'Toes', points: 3, acceptedVariants: ['toes', 'daliri sa paa'], displayOrder: 4 },
          { id: 'fm_05_q3_a5', text: 'Pelvis', points: 2, acceptedVariants: ['pelvis', 'singit'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_05_q4',
        prompt: 'Name an instrument a nurse uses to check your basic health stats.',
        category: 'Medical Instruments',
        answers: [
          { id: 'fm_05_q4_a1', text: 'Thermometer', points: 48, acceptedVariants: ['thermometer', 'termometro'], displayOrder: 1 },
          { id: 'fm_05_q4_a2', text: 'Blood pressure cuff / Monitor', points: 30, acceptedVariants: ['bp apparatus', 'blood pressure monitor', 'sphygmomanometer', 'bp cuff'], displayOrder: 2 },
          { id: 'fm_05_q4_a3', text: 'Stethoscope', points: 12, acceptedVariants: ['stethoscope', 'estetoskopyo'], displayOrder: 3 },
          { id: 'fm_05_q4_a4', text: 'Pulse oximeter', points: 6, acceptedVariants: ['oximeter', 'pulse oximeter'], displayOrder: 4 },
          { id: 'fm_05_q4_a5', text: 'Weighing scale', points: 4, acceptedVariants: ['weighing scale', 'timbangan'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_05_q5',
        prompt: 'Name a food or drink people avoid when suffering from a sore throat.',
        category: 'Health & Wellness',
        answers: [
          { id: 'fm_05_q5_a1', text: 'Ice or Cold water', points: 46, acceptedVariants: ['cold water', 'ice', 'ice cream', 'malamig na tubig', 'yelo'], displayOrder: 1 },
          { id: 'fm_05_q5_a2', text: 'Spicy foods', points: 24, acceptedVariants: ['spicy', 'maanghang', 'chili'], displayOrder: 2 },
          { id: 'fm_05_q5_a3', text: 'Fried or Crunchy food', points: 15, acceptedVariants: ['fried food', 'chicharon', 'crispy food', 'pritong pagkain'], displayOrder: 3 },
          { id: 'fm_05_q5_a4', text: 'Sweets and Chocolates', points: 10, acceptedVariants: ['sweets', 'chocolate', 'matamis'], displayOrder: 4 },
          { id: 'fm_05_q5_a5', text: 'Sour citrus juice', points: 5, acceptedVariants: ['citrus', 'sour juice', 'acidic drink'], displayOrder: 5 },
        ],
      },
    ],
  },

  // ==========================================
  // SET 06: AIRPORTS, HOTELS & TRAVEL COMFORT
  // ==========================================
  {
    id: 'fm_set_06',
    title: 'Fast Money Set 06',
    description: 'Gate documentation, hotel souvenirs, 2-wheel transit, in-flight sleep gear, and flight schedules.',
    questions: [
      {
        id: 'fm_06_q1',
        prompt: 'Name an essential item an airline passenger shows at the boarding gate.',
        category: 'Travel & Aviation',
        answers: [
          { id: 'fm_06_q1_a1', text: 'Boarding pass', points: 50, acceptedVariants: ['boarding pass', 'ticket'], displayOrder: 1 },
          { id: 'fm_06_q1_a2', text: 'Passport', points: 32, acceptedVariants: ['passport', 'pasaporte'], displayOrder: 2 },
          { id: 'fm_06_q1_a3', text: 'Government ID', points: 11, acceptedVariants: ['id', 'valid id', 'national id', 'driver license'], displayOrder: 3 },
          { id: 'fm_06_q1_a4', text: 'Visa document', points: 4, acceptedVariants: ['visa', 'entry visa'], displayOrder: 4 },
          { id: 'fm_06_q1_a5', text: 'Baggage claim tag', points: 3, acceptedVariants: ['baggage tag', 'luggage claim tag'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_06_q2',
        prompt: 'Name a complimentary item hotel guests frequently pack into their luggage.',
        category: 'Hotels & Hospitality',
        answers: [
          { id: 'fm_06_q2_a1', text: 'Miniature shampoo or soap', points: 46, acceptedVariants: ['shampoo', 'soap', 'toiletries', 'conditioner', 'sabon'], displayOrder: 1 },
          { id: 'fm_06_q2_a2', text: 'Disposable bedroom slippers', points: 28, acceptedVariants: ['slippers', 'hotel slippers', 'tsinelas'], displayOrder: 2 },
          { id: 'fm_06_q2_a3', text: 'Coffee and tea packets', points: 14, acceptedVariants: ['coffee', 'tea', 'creamer', 'sugar packets'], displayOrder: 3 },
          { id: 'fm_06_q2_a4', text: 'Pen and notepad', points: 8, acceptedVariants: ['pen', 'ballpen', 'notepad', 'stationery'], displayOrder: 4 },
          { id: 'fm_06_q2_a5', text: 'Dental kit', points: 4, acceptedVariants: ['dental kit', 'toothbrush', 'toothpaste'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_06_q3',
        prompt: 'Name a street vehicle with exactly two wheels.',
        category: 'Transportation & Vehicles',
        answers: [
          { id: 'fm_06_q3_a1', text: 'Bicycle', points: 48, acceptedVariants: ['bicycle', 'bike', 'bisikleta'], displayOrder: 1 },
          { id: 'fm_06_q3_a2', text: 'Motorcycle', points: 32, acceptedVariants: ['motorcycle', 'motor', 'motorbike', 'scooter'], displayOrder: 2 },
          { id: 'fm_06_q3_a3', text: 'Electric kick scooter', points: 12, acceptedVariants: ['scooter', 'e-scooter', 'kick scooter'], displayOrder: 3 },
          { id: 'fm_06_q3_a4', text: 'Moped', points: 5, acceptedVariants: ['moped', 'vespa'], displayOrder: 4 },
          { id: 'fm_06_q3_a5', text: 'Segway', points: 3, acceptedVariants: ['segway', 'hoverboard'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_06_q4',
        prompt: 'Name an item passengers bring on long flights to sleep comfortably.',
        category: 'Flight Essentials',
        answers: [
          { id: 'fm_06_q4_a1', text: 'Neck pillow', points: 52, acceptedVariants: ['neck pillow', 'pillow', 'travel pillow'], displayOrder: 1 },
          { id: 'fm_06_q4_a2', text: 'Eye mask', points: 22, acceptedVariants: ['eye mask', 'blindfold', 'sleep mask'], displayOrder: 2 },
          { id: 'fm_06_q4_a3', text: 'Noise-canceling headphones / Earplugs', points: 14, acceptedVariants: ['earplugs', 'headphones', 'earphones'], displayOrder: 3 },
          { id: 'fm_06_q4_a4', text: 'Light blanket', points: 8, acceptedVariants: ['blanket', 'kumot'], displayOrder: 4 },
          { id: 'fm_06_q4_a5', text: 'Warm sweater', points: 4, acceptedVariants: ['sweater', 'jacket', 'hoodie'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_06_q5',
        prompt: 'Name something travelers consult to verify flight departure details.',
        category: 'Airports & Flight Information',
        answers: [
          { id: 'fm_06_q5_a1', text: 'Airport terminal monitor', points: 45, acceptedVariants: ['screen', 'flight monitor', 'departure board', 'tv monitor'], displayOrder: 1 },
          { id: 'fm_06_q5_a2', text: 'Airline mobile app', points: 28, acceptedVariants: ['app', 'airline app', 'phone app'], displayOrder: 2 },
          { id: 'fm_06_q5_a3', text: 'Paper flight ticket', points: 15, acceptedVariants: ['ticket', 'boarding pass', 'itinerary'], displayOrder: 3 },
          { id: 'fm_06_q5_a4', text: 'Wristwatch', points: 7, acceptedVariants: ['watch', 'wristwatch', 'oras'], displayOrder: 4 },
          { id: 'fm_06_q5_a5', text: 'SMS notification', points: 5, acceptedVariants: ['sms', 'text message', 'email'], displayOrder: 5 },
        ],
      },
    ],
  },

  // ==========================================
  // SET 07: GEOMETRY, CLASSROOM & ACADEMICS
  // ==========================================
  {
    id: 'fm_set_07',
    title: 'Fast Money Set 07',
    description: 'Closed geometric figures, linear rulers, foreign languages, graduation caps, and wall clocks.',
    questions: [
      {
        id: 'fm_07_q1',
        prompt: 'Name a geometric shape with straight closed sides.',
        category: 'Mathematics & Shapes',
        answers: [
          { id: 'fm_07_q1_a1', text: 'Triangle', points: 42, acceptedVariants: ['triangle', 'tatlong sulok'], displayOrder: 1 },
          { id: 'fm_07_q1_a2', text: 'Square', points: 30, acceptedVariants: ['square', 'parisukat'], displayOrder: 2 },
          { id: 'fm_07_q1_a3', text: 'Rectangle', points: 16, acceptedVariants: ['rectangle', 'parihaba'], displayOrder: 3 },
          { id: 'fm_07_q1_a4', text: 'Diamond / Rhombus', points: 7, acceptedVariants: ['diamond', 'rhombus'], displayOrder: 4 },
          { id: 'fm_07_q1_a5', text: 'Pentagon', points: 5, acceptedVariants: ['pentagon', 'hexagon'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_07_q2',
        prompt: 'Name an instrument used for measuring physical length or drawing straight lines.',
        category: 'Stationery & Measurement',
        answers: [
          { id: 'fm_07_q2_a1', text: 'Ruler', points: 55, acceptedVariants: ['ruler', 'line ruler'], displayOrder: 1 },
          { id: 'fm_07_q2_a2', text: 'Tape measure', points: 25, acceptedVariants: ['tape measure', 'medida', 'meter tape'], displayOrder: 2 },
          { id: 'fm_07_q2_a3', text: 'Protractor', points: 11, acceptedVariants: ['protractor'], displayOrder: 3 },
          { id: 'fm_07_q2_a4', text: 'Yardstick / Meter stick', points: 5, acceptedVariants: ['meter stick', 'yardstick'], displayOrder: 4 },
          { id: 'fm_07_q2_a5', text: 'Caliper', points: 4, acceptedVariants: ['caliper', 'vernier'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_07_q3',
        prompt: 'Name a foreign language frequently offered in high school or college courses.',
        category: 'Education & Languages',
        answers: [
          { id: 'fm_07_q3_a1', text: 'Spanish', points: 42, acceptedVariants: ['spanish', 'espanol', 'kastila'], displayOrder: 1 },
          { id: 'fm_07_q3_a2', text: 'Japanese', points: 26, acceptedVariants: ['japanese', 'nihongo'], displayOrder: 2 },
          { id: 'fm_07_q3_a3', text: 'Mandarin / Chinese', points: 18, acceptedVariants: ['mandarin', 'chinese'], displayOrder: 3 },
          { id: 'fm_07_q3_a4', text: 'French', points: 9, acceptedVariants: ['french'], displayOrder: 4 },
          { id: 'fm_07_q3_a5', text: 'Korean', points: 5, acceptedVariants: ['korean', 'hangul'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_07_q4',
        prompt: 'Name an item students wear on their head during university graduation.',
        category: 'Ceremonies & Graduation',
        answers: [
          { id: 'fm_07_q4_a1', text: 'Mortarboard / Graduation cap', points: 60, acceptedVariants: ['graduation cap', 'mortarboard', 'cap', 'toga hat'], displayOrder: 1 },
          { id: 'fm_07_q4_a2', text: 'Tassel', points: 22, acceptedVariants: ['tassel', 'pendil'], displayOrder: 2 },
          { id: 'fm_07_q4_a3', text: 'Laurel wreath', points: 10, acceptedVariants: ['laurel', 'laurel wreath'], displayOrder: 3 },
          { id: 'fm_07_q4_a4', text: 'Academic hood', points: 5, acceptedVariants: ['hood', 'academic hood'], displayOrder: 4 },
          { id: 'fm_07_q4_a5', text: 'Hair ribbon', points: 3, acceptedVariants: ['ribbon', 'hair clip'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_07_q5',
        prompt: 'Name an object mounted on a classroom wall that students glance at during class.',
        category: 'School Environment',
        answers: [
          { id: 'fm_07_q5_a1', text: 'Wall clock', points: 52, acceptedVariants: ['clock', 'wall clock', 'orasan'], displayOrder: 1 },
          { id: 'fm_07_q5_a2', text: 'Whiteboard or Chalkboard', points: 26, acceptedVariants: ['board', 'blackboard', 'whiteboard', 'pisara'], displayOrder: 2 },
          { id: 'fm_07_q5_a3', text: 'World map or Philippine map', points: 12, acceptedVariants: ['map', 'world map', 'philippine map', 'mapa'], displayOrder: 3 },
          { id: 'fm_07_q5_a4', text: 'Bulletin board / Announcements', points: 6, acceptedVariants: ['bulletin board', 'posters', 'announcement board'], displayOrder: 4 },
          { id: 'fm_07_q5_a5', text: 'Calendar', points: 4, acceptedVariants: ['calendar', 'kalendaryo'], displayOrder: 5 },
        ],
      },
    ],
  },

  // ==========================================
  // SET 08: COMPUTERS, BATTERIES & HARDWARE
  // ==========================================
  {
    id: 'fm_set_08',
    title: 'Fast Money Set 08',
    description: 'USB peripherals, battery devices, popular keyboard keys, online registration, and home screens.',
    questions: [
      {
        id: 'fm_08_q1',
        prompt: 'Name a computer accessory connected through a USB cord or Bluetooth.',
        category: 'Technology & Hardware',
        answers: [
          { id: 'fm_08_q1_a1', text: 'Computer mouse', points: 48, acceptedVariants: ['mouse', 'wireless mouse'], displayOrder: 1 },
          { id: 'fm_08_q1_a2', text: 'Keyboard', points: 30, acceptedVariants: ['keyboard', 'teklado'], displayOrder: 2 },
          { id: 'fm_08_q1_a3', text: 'Headphones or Headset', points: 12, acceptedVariants: ['headphones', 'headset', 'earphones'], displayOrder: 3 },
          { id: 'fm_08_q1_a4', text: 'External hard drive / Flash drive', points: 6, acceptedVariants: ['usb', 'flash drive', 'hard drive'], displayOrder: 4 },
          { id: 'fm_08_q1_a5', text: 'Web camera', points: 4, acceptedVariants: ['webcam', 'camera'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_08_q2',
        prompt: 'Name an everyday home appliance that runs on replaceable AA or AAA batteries.',
        category: 'Household Electronics',
        answers: [
          { id: 'fm_08_q2_a1', text: 'TV remote control', points: 58, acceptedVariants: ['remote', 'remote control', 'tv remote'], displayOrder: 1 },
          { id: 'fm_08_q2_a2', text: 'Wall clock', points: 22, acceptedVariants: ['clock', 'wall clock', 'orasan'], displayOrder: 2 },
          { id: 'fm_08_q2_a3', text: 'Emergency flashlight', points: 12, acceptedVariants: ['flashlight', 'ilaw'], displayOrder: 3 },
          { id: 'fm_08_q2_a4', text: 'Wireless computer mouse', points: 5, acceptedVariants: ['wireless mouse', 'mouse'], displayOrder: 4 },
          { id: 'fm_08_q2_a5', text: 'Children battery toy', points: 3, acceptedVariants: ['toy', 'laruan', 'remote control car'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_08_q3',
        prompt: 'Name a key on a standard computer keyboard that is pressed frequently.',
        category: 'Computers & Typing',
        answers: [
          { id: 'fm_08_q3_a1', text: 'Space bar', points: 45, acceptedVariants: ['space', 'space bar', 'spacebar'], displayOrder: 1 },
          { id: 'fm_08_q3_a2', text: 'Enter / Return key', points: 32, acceptedVariants: ['enter', 'return', 'enter key'], displayOrder: 2 },
          { id: 'fm_08_q3_a3', text: 'Backspace / Delete', points: 13, acceptedVariants: ['backspace', 'delete'], displayOrder: 3 },
          { id: 'fm_08_q3_a4', text: 'Shift key', points: 6, acceptedVariants: ['shift', 'shift key'], displayOrder: 4 },
          { id: 'fm_08_q3_a5', text: 'Escape key', points: 4, acceptedVariants: ['esc', 'escape'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_08_q4',
        prompt: 'Name a piece of personal information required when registering a new online account.',
        category: 'Internet & Security',
        answers: [
          { id: 'fm_08_q4_a1', text: 'Email address', points: 44, acceptedVariants: ['email', 'email address'], displayOrder: 1 },
          { id: 'fm_08_q4_a2', text: 'Secure password', points: 32, acceptedVariants: ['password', 'passcode'], displayOrder: 2 },
          { id: 'fm_08_q4_a3', text: 'Full legal name', points: 14, acceptedVariants: ['name', 'full name', 'username'], displayOrder: 3 },
          { id: 'fm_08_q4_a4', text: 'Mobile phone number', points: 6, acceptedVariants: ['phone number', 'cellphone number', 'contact number'], displayOrder: 4 },
          { id: 'fm_08_q4_a5', text: 'Birth date', points: 4, acceptedVariants: ['birthday', 'birthdate', 'age'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_08_q5',
        prompt: 'Name a device with an electronic display screen commonly found in modern homes.',
        category: 'Consumer Electronics',
        answers: [
          { id: 'fm_08_q5_a1', text: 'Television', points: 46, acceptedVariants: ['tv', 'television', 'telebisyon'], displayOrder: 1 },
          { id: 'fm_08_q5_a2', text: 'Smartphone', points: 32, acceptedVariants: ['phone', 'cellphone', 'smartphone'], displayOrder: 2 },
          { id: 'fm_08_q5_a3', text: 'Laptop computer', points: 12, acceptedVariants: ['laptop', 'notebook'], displayOrder: 3 },
          { id: 'fm_08_q5_a4', text: 'Tablet or iPad', points: 6, acceptedVariants: ['tablet', 'ipad'], displayOrder: 4 },
          { id: 'fm_08_q5_a5', text: 'Desktop monitor', points: 4, acceptedVariants: ['monitor', 'computer screen', 'desktop'], displayOrder: 5 },
        ],
      },
    ],
  },

  // ==========================================
  // SET 09: DEPARTMENT STORES, RECEIPTS & SIGNS
  // ==========================================
  {
    id: 'fm_set_09',
    title: 'Fast Money Set 09',
    description: 'Mall departments, shopping carts, register slips, merchandise returns, and storefront signs.',
    questions: [
      {
        id: 'fm_09_q1',
        prompt: 'Name a department commonly found inside a multi-story department store.',
        category: 'Retail & Shopping',
        answers: [
          { id: 'fm_09_q1_a1', text: 'Clothing / Apparel', points: 44, acceptedVariants: ['clothes', 'clothing', 'damit', 'mens wear', 'ladies wear'], displayOrder: 1 },
          { id: 'fm_09_q1_a2', text: 'Shoes and Footwear', points: 26, acceptedVariants: ['shoes', 'footwear', 'sapatos'], displayOrder: 2 },
          { id: 'fm_09_q1_a3', text: 'Cosmetics and Perfume', points: 16, acceptedVariants: ['cosmetics', 'beauty', 'makeup', 'perfume'], displayOrder: 3 },
          { id: 'fm_09_q1_a4', text: 'Home and Kitchenware', points: 9, acceptedVariants: ['homeworld', 'kitchenware', 'home'], displayOrder: 4 },
          { id: 'fm_09_q1_a5', text: 'Toys department', points: 5, acceptedVariants: ['toys', 'toy kingdom', 'laruan'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_09_q2',
        prompt: 'Name something shoppers push or hold to carry items around a supermarket.',
        category: 'Grocery & Supermarket',
        answers: [
          { id: 'fm_09_q2_a1', text: 'Shopping cart / Trolley', points: 54, acceptedVariants: ['cart', 'shopping cart', 'trolley', 'grocery cart'], displayOrder: 1 },
          { id: 'fm_09_q2_a2', text: 'Handheld shopping basket', points: 30, acceptedVariants: ['basket', 'shopping basket', 'cesta'], displayOrder: 2 },
          { id: 'fm_09_q2_a3', text: 'Reusable tote bag / Eco bag', points: 10, acceptedVariants: ['eco bag', 'tote bag', 'bayong'], displayOrder: 3 },
          { id: 'fm_09_q2_a4', text: 'Rolling pushcart', points: 4, acceptedVariants: ['pushcart', 'rolling basket'], displayOrder: 4 },
          { id: 'fm_09_q2_a5', text: 'Cardboard box', points: 2, acceptedVariants: ['box', 'karton', 'box container'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_09_q3',
        prompt: 'Name a slip of paper handed to a customer after finishing payment at the cash register.',
        category: 'Shopping & Receipts',
        answers: [
          { id: 'fm_09_q3_a1', text: 'Official sales receipt', points: 58, acceptedVariants: ['receipt', 'resibo', 'sales invoice'], displayOrder: 1 },
          { id: 'fm_09_q3_a2', text: 'Card payment receipt slip', points: 22, acceptedVariants: ['card slip', 'credit card receipt', 'charge slip'], displayOrder: 2 },
          { id: 'fm_09_q3_a3', text: 'Discount coupon', points: 12, acceptedVariants: ['coupon', 'voucher', 'discount voucher'], displayOrder: 3 },
          { id: 'fm_09_q3_a4', text: 'Warranty document', points: 5, acceptedVariants: ['warranty', 'warranty slip'], displayOrder: 4 },
          { id: 'fm_09_q3_a5', text: 'Raffle entry stub', points: 3, acceptedVariants: ['raffle ticket', 'raffle stub', 'promo ticket'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_09_q4',
        prompt: 'Name a common reason a customer brings an item back to a store for return or exchange.',
        category: 'Consumer Habits',
        answers: [
          { id: 'fm_09_q4_a1', text: 'Wrong clothing size', points: 50, acceptedVariants: ['wrong size', 'too small', 'too big', 'size'], displayOrder: 1 },
          { id: 'fm_09_q4_a2', text: 'Item is defective or damaged', points: 28, acceptedVariants: ['damaged', 'defective', 'sira', 'broken'], displayOrder: 2 },
          { id: 'fm_09_q4_a3', text: 'Changed mind about purchase', points: 12, acceptedVariants: ['changed mind', 'ayaw na'], displayOrder: 3 },
          { id: 'fm_09_q4_a4', text: 'Received duplicate gift', points: 6, acceptedVariants: ['duplicate', 'may kapareho na'], displayOrder: 4 },
          { id: 'fm_09_q4_a5', text: 'Expired shelf life', points: 4, acceptedVariants: ['expired', 'panis'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_09_q5',
        prompt: 'Name a sign posted on a retail storefront to grab shoppers attention.',
        category: 'Retail Marketing',
        answers: [
          { id: 'fm_09_q5_a1', text: 'SALE / Big Discount', points: 55, acceptedVariants: ['sale', 'discount', '50% off', 'promo'], displayOrder: 1 },
          { id: 'fm_09_q5_a2', text: 'Now Open', points: 20, acceptedVariants: ['open', 'now open', 'grand opening'], displayOrder: 2 },
          { id: 'fm_09_q5_a3', text: 'Clearance', points: 13, acceptedVariants: ['clearance', 'clearance sale'], displayOrder: 3 },
          { id: 'fm_09_q5_a4', text: 'Buy 1 Take 1', points: 8, acceptedVariants: ['buy 1 take 1', 'bogo'], displayOrder: 4 },
          { id: 'fm_09_q5_a5', text: 'Now Hiring', points: 4, acceptedVariants: ['hiring', 'now hiring'], displayOrder: 5 },
        ],
      },
    ],
  },

  // ==========================================
  // SET 10: TOOLBOXES, LADDERS & LIGHTING
  // ==========================================
  {
    id: 'fm_set_10',
    title: 'Fast Money Set 10',
    description: 'Emergency toolbox items, wood fasteners, climbing tools, lawn upkeep, and light fixtures.',
    questions: [
      {
        id: 'fm_10_q1',
        prompt: 'Name a basic hand tool kept in an emergency household toolbox.',
        category: 'Home Improvement',
        answers: [
          { id: 'fm_10_q1_a1', text: 'Hammer', points: 46, acceptedVariants: ['hammer', 'martilyo'], displayOrder: 1 },
          { id: 'fm_10_q1_a2', text: 'Screwdriver', points: 30, acceptedVariants: ['screwdriver', 'turnilyador', 'philips'], displayOrder: 2 },
          { id: 'fm_10_q1_a3', text: 'Pliers', points: 14, acceptedVariants: ['pliers', 'plais'], displayOrder: 3 },
          { id: 'fm_10_q1_a4', text: 'Adjustable wrench', points: 6, acceptedVariants: ['wrench', 'llave', 'adjustable wrench'], displayOrder: 4 },
          { id: 'fm_10_q1_a5', text: 'Measuring tape', points: 4, acceptedVariants: ['tape measure', 'medida'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_10_q2',
        prompt: 'Name a metal fastener used to join pieces of wood or wall studs together.',
        category: 'Hardware & Construction',
        answers: [
          { id: 'fm_10_q2_a1', text: 'Nails', points: 50, acceptedVariants: ['nail', 'nails', 'pako'], displayOrder: 1 },
          { id: 'fm_10_q2_a2', text: 'Screws', points: 32, acceptedVariants: ['screw', 'screws', 'turnilyo'], displayOrder: 2 },
          { id: 'fm_10_q2_a3', text: 'Bolts and nuts', points: 11, acceptedVariants: ['bolt', 'nuts', 'bolts'], displayOrder: 3 },
          { id: 'fm_10_q2_a4', text: 'Metal brackets', points: 4, acceptedVariants: ['bracket', 'brackets'], displayOrder: 4 },
          { id: 'fm_10_q2_a5', text: 'Staples', points: 3, acceptedVariants: ['staples', 'staple wire'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_10_q3',
        prompt: 'Name something people climb on to reach high ceilings or roofs safely.',
        category: 'Household Safety',
        answers: [
          { id: 'fm_10_q3_a1', text: 'Extension ladder / Step ladder', points: 60, acceptedVariants: ['ladder', 'hagdan', 'step ladder'], displayOrder: 1 },
          { id: 'fm_10_q3_a2', text: 'Sturdy chair or Stool', points: 22, acceptedVariants: ['chair', 'stool', 'bangko', 'upuan'], displayOrder: 2 },
          { id: 'fm_10_q3_a3', text: 'Wooden table', points: 10, acceptedVariants: ['table', 'mesa'], displayOrder: 3 },
          { id: 'fm_10_q3_a4', text: 'Scaffolding', points: 5, acceptedVariants: ['scaffolding', 'andamyo'], displayOrder: 4 },
          { id: 'fm_10_q3_a5', text: 'Step box', points: 3, acceptedVariants: ['crate', 'box', 'step box'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_10_q4',
        prompt: 'Name a garden chore done specifically to maintain an outdoor lawn.',
        category: 'Lawn & Gardening',
        answers: [
          { id: 'fm_10_q4_a1', text: 'Mowing or cutting grass', points: 48, acceptedVariants: ['mow lawn', 'cut grass', 'tabas damo', 'lawn mowing'], displayOrder: 1 },
          { id: 'fm_10_q4_a2', text: 'Raking fallen dry leaves', points: 26, acceptedVariants: ['rake leaves', 'walis dahon', 'raking'], displayOrder: 2 },
          { id: 'fm_10_q4_a3', text: 'Pulling weeds', points: 14, acceptedVariants: ['weeding', 'bunot damo', 'weed pulling'], displayOrder: 3 },
          { id: 'fm_10_q4_a4', text: 'Watering the lawn', points: 8, acceptedVariants: ['watering', 'dilig', 'water grass'], displayOrder: 4 },
          { id: 'fm_10_q4_a5', text: 'Trimming hedge bushes', points: 4, acceptedVariants: ['trim bushes', 'hedging', 'pruning'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_10_q5',
        prompt: 'Name an electrical item replaced when a ceiling light fixture stops shining.',
        category: 'Electrical & Lighting',
        answers: [
          { id: 'fm_10_q5_a1', text: 'Light bulb', points: 62, acceptedVariants: ['bulb', 'light bulb', 'bombilya', 'led bulb'], displayOrder: 1 },
          { id: 'fm_10_q5_a2', text: 'Fluorescent starter', points: 18, acceptedVariants: ['starter', 'fluorescent starter'], displayOrder: 2 },
          { id: 'fm_10_q5_a3', text: 'Fuse', points: 10, acceptedVariants: ['fuse', 'breaker'], displayOrder: 3 },
          { id: 'fm_10_q5_a4', text: 'LED light tube', points: 6, acceptedVariants: ['tube', 'light tube', 'fluorescent tube'], displayOrder: 4 },
          { id: 'fm_10_q5_a5', text: 'Ballast', points: 4, acceptedVariants: ['ballast'], displayOrder: 5 },
        ],
      },
    ],
  },

  // ==========================================
  // SET 11: TASTE BUDS, SNACKS & PANCAKE TOPPINGS
  // ==========================================
  {
    id: 'fm_set_11',
    title: 'Fast Money Set 11',
    description: 'Sour sensations, bitter profiles, crunchy snacks, spicy condiments, and pancake syrups.',
    questions: [
      {
        id: 'fm_11_q1',
        prompt: 'Name a food known for having an intensely sour taste.',
        category: 'Taste & Flavors',
        answers: [
          { id: 'fm_11_q1_a1', text: 'Lemon or Calamansi', points: 52, acceptedVariants: ['lemon', 'calamansi', 'kalamansi', 'lime'], displayOrder: 1 },
          { id: 'fm_11_q1_a2', text: 'Vinegar', points: 26, acceptedVariants: ['vinegar', 'suka'], displayOrder: 2 },
          { id: 'fm_11_q1_a3', text: 'Green unripened mango', points: 12, acceptedVariants: ['green mango', 'hilaw na mangga', 'mangga'], displayOrder: 3 },
          { id: 'fm_11_q1_a4', text: 'Tamarind / Sampalok', points: 6, acceptedVariants: ['tamarind', 'sampalok'], displayOrder: 4 },
          { id: 'fm_11_q1_a5', text: 'Sour candy', points: 4, acceptedVariants: ['sour candy', 'warheads', 'sour tape'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_11_q2',
        prompt: 'Name a food or drink item known for having a naturally bitter flavor.',
        category: 'Flavors & Food',
        answers: [
          { id: 'fm_11_q2_a1', text: 'Bitter gourd / Ampalaya', points: 55, acceptedVariants: ['ampalaya', 'bitter melon', 'bitter gourd'], displayOrder: 1 },
          { id: 'fm_11_q2_a2', text: 'Black coffee without sugar', points: 25, acceptedVariants: ['black coffee', 'coffee', 'kape'], displayOrder: 2 },
          { id: 'fm_11_q2_a3', text: 'Dark dark chocolate', points: 12, acceptedVariants: ['dark chocolate', 'pure cocoa', 'tablea'], displayOrder: 3 },
          { id: 'fm_11_q2_a4', text: 'Beer', points: 5, acceptedVariants: ['beer', 'serbesa'], displayOrder: 4 },
          { id: 'fm_11_q2_a5', text: 'Tonic water', points: 3, acceptedVariants: ['tonic water', 'quinine'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_11_q3',
        prompt: 'Name a crunchy finger snack people eat directly by the handful.',
        category: 'Snacks & Munchies',
        answers: [
          { id: 'fm_11_q3_a1', text: 'Potato chips', points: 44, acceptedVariants: ['potato chips', 'chips', 'piattos'], displayOrder: 1 },
          { id: 'fm_11_q3_a2', text: 'Popcorn', points: 28, acceptedVariants: ['popcorn'], displayOrder: 2 },
          { id: 'fm_11_q3_a3', text: 'Roasted peanuts or nuts', points: 16, acceptedVariants: ['peanuts', 'mani', 'nuts', 'cashew'], displayOrder: 3 },
          { id: 'fm_11_q3_a4', text: 'Pretzel sticks', points: 7, acceptedVariants: ['pretzels', 'pretzel sticks'], displayOrder: 4 },
          { id: 'fm_11_q3_a5', text: 'Cheese corn curls', points: 5, acceptedVariants: ['corn curls', 'cheese balls', 'cheetos'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_11_q4',
        prompt: 'Name a seasoning or sauce added to meals to increase spiciness.',
        category: 'Spices & Condiments',
        answers: [
          { id: 'fm_11_q4_a1', text: 'Hot sauce', points: 46, acceptedVariants: ['hot sauce', 'tabasco', 'sriracha'], displayOrder: 1 },
          { id: 'fm_11_q4_a2', text: 'Sliced fresh chili peppers / Siling labuyo', points: 30, acceptedVariants: ['sili', 'chili', 'labuyo', 'chili pepper'], displayOrder: 2 },
          { id: 'fm_11_q4_a3', text: 'Chili garlic oil', points: 14, acceptedVariants: ['chili oil', 'chili garlic', 'chili garlic oil'], displayOrder: 3 },
          { id: 'fm_11_q4_a4', text: 'Ground black or cayenne pepper', points: 6, acceptedVariants: ['cayenne', 'black pepper', 'paminta', 'chili powder'], displayOrder: 4 },
          { id: 'fm_11_q4_a5', text: 'Wasabi', points: 4, acceptedVariants: ['wasabi', 'mustard'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_11_q5',
        prompt: 'Name a sweet syrup or topping drizzled over hot breakfast pancakes.',
        category: 'Breakfast Toppings',
        answers: [
          { id: 'fm_11_q5_a1', text: 'Maple syrup or Pancake syrup', points: 54, acceptedVariants: ['maple syrup', 'syrup', 'pancake syrup'], displayOrder: 1 },
          { id: 'fm_11_q5_a2', text: 'Honey', points: 24, acceptedVariants: ['honey', 'pulot'], displayOrder: 2 },
          { id: 'fm_11_q5_a3', text: 'Melted butter', points: 11, acceptedVariants: ['butter', 'mantekilya'], displayOrder: 3 },
          { id: 'fm_11_q5_a4', text: 'Chocolate syrup', points: 7, acceptedVariants: ['chocolate syrup', 'chocolate sauce', 'nutella'], displayOrder: 4 },
          { id: 'fm_11_q5_a5', text: 'Condensed milk', points: 4, acceptedVariants: ['condensed milk', 'condensada'], displayOrder: 5 },
        ],
      },
    ],
  },

  // ==========================================
  // SET 12: CITY SERVICES, ROADS & PLAYGROUNDS
  // ==========================================
  {
    id: 'fm_set_12',
    title: 'Fast Money Set 12',
    description: '24/7 service buildings, pedestrian crossings, commercial parking, fire exits, and playground swings.',
    questions: [
      {
        id: 'fm_12_q1',
        prompt: 'Name an emergency building staffed with personnel 24 hours a day.',
        category: 'City Services',
        answers: [
          { id: 'fm_12_q1_a1', text: 'Public hospital / Emergency room', points: 45, acceptedVariants: ['hospital', 'er', 'emergency room', 'ospital'], displayOrder: 1 },
          { id: 'fm_12_q1_a2', text: 'Police station', points: 32, acceptedVariants: ['police station', 'presinto'], displayOrder: 2 },
          { id: 'fm_12_q1_a3', text: 'Fire department station', points: 15, acceptedVariants: ['fire station', 'fire department'], displayOrder: 3 },
          { id: 'fm_12_q1_a4', text: 'Coast guard outpost', points: 5, acceptedVariants: ['coast guard', 'barangay hall'], displayOrder: 4 },
          { id: 'fm_12_q1_a5', text: '24-hour pharmacy', points: 3, acceptedVariants: ['pharmacy', 'mercury drug'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_12_q2',
        prompt: 'Name an installation found at a busy street pedestrian crosswalk.',
        category: 'Urban Infrastructure',
        answers: [
          { id: 'fm_12_q2_a1', text: 'Pedestrian walk light / Traffic signal', points: 46, acceptedVariants: ['traffic light', 'pedestrian light', 'stoplight'], displayOrder: 1 },
          { id: 'fm_12_q2_a2', text: 'White zebra crossing stripes', points: 32, acceptedVariants: ['zebra cross', 'white stripes', 'crosswalk lines'], displayOrder: 2 },
          { id: 'fm_12_q2_a3', text: 'Push-button pedestrian post', points: 12, acceptedVariants: ['push button', 'pedestrian button'], displayOrder: 3 },
          { id: 'fm_12_q2_a4', text: 'Digital countdown timer', points: 6, acceptedVariants: ['countdown timer', 'timer'], displayOrder: 4 },
          { id: 'fm_12_q2_a5', text: 'Sidewalk ramp for wheelchairs', points: 4, acceptedVariants: ['ramp', 'wheelchair ramp', 'curb ramp'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_12_q3',
        prompt: 'Name a facility where motorists leave their vehicles in a commercial area.',
        category: 'Urban Parking',
        answers: [
          { id: 'fm_12_q3_a1', text: 'Multi-level parking garage', points: 44, acceptedVariants: ['parking building', 'parking garage', 'multi level parking'], displayOrder: 1 },
          { id: 'fm_12_q3_a2', text: 'Open-air parking lot', points: 32, acceptedVariants: ['parking lot', 'open parking'], displayOrder: 2 },
          { id: 'fm_12_q3_a3', text: 'Basement mall parking', points: 14, acceptedVariants: ['basement parking', 'mall parking'], displayOrder: 3 },
          { id: 'fm_12_q3_a4', text: 'Curbside metered slot', points: 6, acceptedVariants: ['curbside parking', 'metered parking', 'street parking'], displayOrder: 4 },
          { id: 'fm_12_q3_a5', text: 'Valet drop-off station', points: 4, acceptedVariants: ['valet', 'valet parking'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_12_q4',
        prompt: 'Name an architectural fixture on a building exterior designed for emergency egress.',
        category: 'Building Safety',
        answers: [
          { id: 'fm_12_q4_a1', text: 'Exterior metal fire escape', points: 52, acceptedVariants: ['fire escape', 'metal stairs', 'emergency stairs'], displayOrder: 1 },
          { id: 'fm_12_q4_a2', text: 'Emergency fire exit door', points: 26, acceptedVariants: ['fire exit', 'exit door', 'emergency door'], displayOrder: 2 },
          { id: 'fm_12_q4_a3', text: 'Fire hose cabinet', points: 12, acceptedVariants: ['fire hose', 'hose reel', 'fire extinguisher'], displayOrder: 3 },
          { id: 'fm_12_q4_a4', text: 'Outdoor fire hydrant', points: 6, acceptedVariants: ['fire hydrant', 'hydrant'], displayOrder: 4 },
          { id: 'fm_12_q4_a5', text: 'Roof rescue access ladder', points: 4, acceptedVariants: ['ladder', 'roof ladder'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_12_q5',
        prompt: 'Name an outdoor playground structure children queue up to play on.',
        category: 'Playgrounds & Parks',
        answers: [
          { id: 'fm_12_q5_a1', text: 'Playground slide', points: 48, acceptedVariants: ['slide', 'padulasan'], displayOrder: 1 },
          { id: 'fm_12_q5_a2', text: 'Swing set', points: 32, acceptedVariants: ['swing', 'duyan', 'swings'], displayOrder: 2 },
          { id: 'fm_12_q5_a3', text: 'Seesaw', points: 11, acceptedVariants: ['seesaw'], displayOrder: 3 },
          { id: 'fm_12_q5_a4', text: 'Monkey bars', points: 6, acceptedVariants: ['monkey bars', 'jungle gym'], displayOrder: 4 },
          { id: 'fm_12_q5_a5', text: 'Merry-go-round', points: 3, acceptedVariants: ['carousel', 'merry go round'], displayOrder: 5 },
        ],
      },
    ],
  },

  // ==========================================
  // SET 13: TIME, CALENDARS & EARLY ALARMS
  // ==========================================
  {
    id: 'fm_set_13',
    title: 'Fast Money Set 13',
    description: 'Time increments under an hour, bank closure days, early wake-up reasons, 30-day months, and calendar reminders.',
    questions: [
      {
        id: 'fm_13_q1',
        prompt: 'Name a standard division of time shorter than an entire hour.',
        category: 'Time & Clocks',
        answers: [
          { id: 'fm_13_q1_a1', text: 'Minute', points: 56, acceptedVariants: ['minute', 'minuto'], displayOrder: 1 },
          { id: 'fm_13_q1_a2', text: 'Second', points: 30, acceptedVariants: ['second', 'segundo'], displayOrder: 2 },
          { id: 'fm_13_q1_a3', text: 'Millisecond', points: 7, acceptedVariants: ['millisecond'], displayOrder: 3 },
          { id: 'fm_13_q1_a4', text: 'Half-hour / 30 mins', points: 4, acceptedVariants: ['half hour', 'kalahating oras', '30 minutes'], displayOrder: 4 },
          { id: 'fm_13_q1_a5', text: 'Quarter-hour / 15 mins', points: 3, acceptedVariants: ['quarter hour', '15 minutes'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_13_q2',
        prompt: 'Name a day of the week when commercial banks are regularly closed.',
        category: 'Calendars & Banking',
        answers: [
          { id: 'fm_13_q2_a1', text: 'Sunday', points: 55, acceptedVariants: ['sunday', 'linggo'], displayOrder: 1 },
          { id: 'fm_13_q2_a2', text: 'Saturday', points: 33, acceptedVariants: ['saturday', 'sabado'], displayOrder: 2 },
          { id: 'fm_13_q2_a3', text: 'Official national holiday', points: 6, acceptedVariants: ['holiday', 'regular holiday', 'pista opisyal'], displayOrder: 3 },
          { id: 'fm_13_q2_a4', text: 'Good Friday', points: 4, acceptedVariants: ['good friday', 'biyernes santo'], displayOrder: 4 },
          { id: 'fm_13_q2_a5', text: 'Maundy Thursday', points: 2, acceptedVariants: ['maundy thursday', 'huwebes santo'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_13_q3',
        prompt: 'Name an occasion when someone configures an alarm clock for an unusually early hour.',
        category: 'Habits & Routines',
        answers: [
          { id: 'fm_13_q3_a1', text: 'Catching an early morning flight', points: 52, acceptedVariants: ['flight', 'airport', 'early flight', 'sasakay ng eroplano'], displayOrder: 1 },
          { id: 'fm_13_q3_a2', text: 'Beginning a long highway road trip', points: 24, acceptedVariants: ['road trip', 'biyahe', 'travel', 'outing'], displayOrder: 2 },
          { id: 'fm_13_q3_a3', text: 'Early morning job interview', points: 12, acceptedVariants: ['interview', 'job interview'], displayOrder: 3 },
          { id: 'fm_13_q3_a4', text: 'Morning board examination', points: 8, acceptedVariants: ['exam', 'board exam', 'entrance exam'], displayOrder: 4 },
          { id: 'fm_13_q3_a5', text: 'Starting an early work shift', points: 4, acceptedVariants: ['work', 'early shift', 'first day of work'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_13_q4',
        prompt: 'Name a month of the year when many families travel for holidays or vacations.',
        category: 'Calendar & Travel',
        answers: [
          { id: 'fm_13_q4_a1', text: 'December', points: 45, acceptedVariants: ['december', 'disyembre', 'christmas'], displayOrder: 1 },
          { id: 'fm_13_q4_a2', text: 'April', points: 28, acceptedVariants: ['april', 'abril', 'holy week', 'summer'], displayOrder: 2 },
          { id: 'fm_13_q4_a3', text: 'May', points: 16, acceptedVariants: ['may', 'mayo', 'summer vacation'], displayOrder: 3 },
          { id: 'fm_13_q4_a4', text: 'January', points: 7, acceptedVariants: ['january', 'enero', 'new year'], displayOrder: 4 },
          { id: 'fm_13_q4_a5', text: 'November', points: 4, acceptedVariants: ['november', 'nobyembre', 'undas'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_13_q5',
        prompt: 'Name an event people circle or write onto a personal wall calendar.',
        category: 'Planning & Events',
        answers: [
          { id: 'fm_13_q5_a1', text: 'Family birthdays', points: 48, acceptedVariants: ['birthday', 'kaarawan', 'birthdays'], displayOrder: 1 },
          { id: 'fm_13_q5_a2', text: 'Medical or Dental appointment', points: 24, acceptedVariants: ['doctor appointment', 'checkup', 'dentist'], displayOrder: 2 },
          { id: 'fm_13_q5_a3', text: 'Utility bill due dates', points: 14, acceptedVariants: ['due date', 'bill due date', 'bayaran ng kuryente'], displayOrder: 3 },
          { id: 'fm_13_q5_a4', text: 'Scheduled vacation / Travel leave', points: 9, acceptedVariants: ['vacation', 'trip', 'leave', 'bakasyon'], displayOrder: 4 },
          { id: 'fm_13_q5_a5', text: 'Wedding anniversary', points: 5, acceptedVariants: ['anniversary', 'wedding anniversary'], displayOrder: 5 },
        ],
      },
    ],
  },

  // ==========================================
  // SET 14: BRASS BANDS, ORCHESTRAS & BALLROOM
  // ==========================================
  {
    id: 'fm_set_14',
    title: 'Fast Money Set 14',
    description: 'Brass instruments, band members, conductor items, partner dances, and audio hardware.',
    questions: [
      {
        id: 'fm_14_q1',
        prompt: 'Name a wind or brass instrument played in an outdoor marching brass band.',
        category: 'Musical Instruments',
        answers: [
          { id: 'fm_14_q1_a1', text: 'Trumpet', points: 45, acceptedVariants: ['trumpet', 'trompeta'], displayOrder: 1 },
          { id: 'fm_14_q1_a2', text: 'Trombone', points: 25, acceptedVariants: ['trombone'], displayOrder: 2 },
          { id: 'fm_14_q1_a3', text: 'Saxophone', points: 16, acceptedVariants: ['saxophone', 'sax'], displayOrder: 3 },
          { id: 'fm_14_q1_a4', text: 'Flute / Piccolo', points: 8, acceptedVariants: ['flute', 'plawta', 'piccolo'], displayOrder: 4 },
          { id: 'fm_14_q1_a5', text: 'Tuba / Sousaphone', points: 6, acceptedVariants: ['tuba', 'sousaphone'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_14_q2',
        prompt: 'Name a musical instrument player on stage besides the lead singer.',
        category: 'Live Music & Bands',
        answers: [
          { id: 'fm_14_q2_a1', text: 'Lead or rhythm guitarist', points: 46, acceptedVariants: ['guitarist', 'gitara', 'lead guitar', 'electric guitar'], displayOrder: 1 },
          { id: 'fm_14_q2_a2', text: 'Drummer', points: 32, acceptedVariants: ['drummer', 'drums', 'nagdo-drums'], displayOrder: 2 },
          { id: 'fm_14_q2_a3', text: 'Bass guitarist', points: 12, acceptedVariants: ['bassist', 'bass guitar', 'bass'], displayOrder: 3 },
          { id: 'fm_14_q2_a4', text: 'Keyboard or piano player', points: 6, acceptedVariants: ['keyboardist', 'pianist', 'keyboard'], displayOrder: 4 },
          { id: 'fm_14_q2_a5', text: 'Backup harmony singer', points: 4, acceptedVariants: ['backup singer', 'harmony'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_14_q3',
        prompt: 'Name an item an orchestra conductor holds while leading musicians.',
        category: 'Classical Music',
        answers: [
          { id: 'fm_14_q3_a1', text: 'Conducting baton', points: 62, acceptedVariants: ['baton', 'stick', 'wand'], displayOrder: 1 },
          { id: 'fm_14_q3_a2', text: 'Musical score booklet', points: 20, acceptedVariants: ['sheet music', 'score', 'music notes', 'book'], displayOrder: 2 },
          { id: 'fm_14_q3_a3', text: 'Reading glasses', points: 10, acceptedVariants: ['glasses', 'eyeglasses', 'salamin'], displayOrder: 3 },
          { id: 'fm_14_q3_a4', text: 'Handkerchief / Towel', points: 5, acceptedVariants: ['handkerchief', 'towel', 'panyo'], displayOrder: 4 },
          { id: 'fm_14_q3_a5', text: 'Metronome', points: 3, acceptedVariants: ['metronome'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_14_q4',
        prompt: 'Name a formal partner dance style performed in ballrooms.',
        category: 'Dance & Ballroom',
        answers: [
          { id: 'fm_14_q4_a1', text: 'Waltz', points: 44, acceptedVariants: ['waltz'], displayOrder: 1 },
          { id: 'fm_14_q4_a2', text: 'Tango', points: 30, acceptedVariants: ['tango'], displayOrder: 2 },
          { id: 'fm_14_q4_a3', text: 'Salsa', points: 14, acceptedVariants: ['salsa'], displayOrder: 3 },
          { id: 'fm_14_q4_a4', text: 'Cha-cha', points: 8, acceptedVariants: ['cha-cha', 'cha cha'], displayOrder: 4 },
          { id: 'fm_14_q4_a5', text: 'Foxtrot', points: 4, acceptedVariants: ['foxtrot'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_14_q5',
        prompt: 'Name an audio piece of equipment positioned on a live stage.',
        category: 'Stage Equipment',
        answers: [
          { id: 'fm_14_q5_a1', text: 'Vocal microphone', points: 52, acceptedVariants: ['microphone', 'mic', 'mikropono'], displayOrder: 1 },
          { id: 'fm_14_q5_a2', text: 'Amplifier speaker cabinet', points: 28, acceptedVariants: ['speaker', 'amp', 'amplifier'], displayOrder: 2 },
          { id: 'fm_14_q5_a3', text: 'Floor stage monitor', points: 11, acceptedVariants: ['monitor', 'stage monitor'], displayOrder: 3 },
          { id: 'fm_14_q5_a4', text: 'Microphone stand', points: 6, acceptedVariants: ['mic stand', 'stand'], displayOrder: 4 },
          { id: 'fm_14_q5_a5', text: 'Mixing soundboard', points: 3, acceptedVariants: ['mixer', 'soundboard'], displayOrder: 5 },
        ],
      },
    ],
  },

  // ==========================================
  // SET 15: PET SUPPLIES, AQUARIUMS & VETS
  // ==========================================
  {
    id: 'fm_set_15',
    title: 'Fast Money Set 15',
    description: 'Dog walking gear, aquarium decorations, pet grooming, cage birds, and veterinary treatments.',
    questions: [
      {
        id: 'fm_15_q1',
        prompt: 'Name an accessory clipped to a dog before walking along neighborhood sidewalks.',
        category: 'Pet Care',
        answers: [
          { id: 'fm_15_q1_a1', text: 'Walking leash', points: 50, acceptedVariants: ['leash', 'tali', 'dog leash'], displayOrder: 1 },
          { id: 'fm_15_q1_a2', text: 'Neck collar', points: 28, acceptedVariants: ['collar', 'dog collar'], displayOrder: 2 },
          { id: 'fm_15_q1_a3', text: 'Chest harness', points: 12, acceptedVariants: ['harness', 'body harness'], displayOrder: 3 },
          { id: 'fm_15_q1_a4', text: 'Identification name tag', points: 6, acceptedVariants: ['tag', 'name tag', 'id tag'], displayOrder: 4 },
          { id: 'fm_15_q1_a5', text: 'Protective muzzle', points: 4, acceptedVariants: ['muzzle', 'mouth cover'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_15_q2',
        prompt: 'Name an accessory placed inside a home aquarium tank.',
        category: 'Aquariums & Fish',
        answers: [
          { id: 'fm_15_q2_a1', text: 'Colored gravel or substrate', points: 38, acceptedVariants: ['gravel', 'rocks', 'pebbles', 'stones', 'bato'], displayOrder: 1 },
          { id: 'fm_15_q2_a2', text: 'Water filter pump', points: 26, acceptedVariants: ['filter', 'water filter', 'pump'], displayOrder: 2 },
          { id: 'fm_15_q2_a3', text: 'Artificial plastic plants', points: 18, acceptedVariants: ['plants', 'fake plants', 'plastic plants', 'seaweed'], displayOrder: 3 },
          { id: 'fm_15_q2_a4', text: 'Air stone bubbler', points: 11, acceptedVariants: ['bubbler', 'oxygen bubbler', 'aerator'], displayOrder: 4 },
          { id: 'fm_15_q2_a5', text: 'Miniature sunken castle or cave', points: 7, acceptedVariants: ['castle', 'shipwreck', 'cave', 'figurine'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_15_q3',
        prompt: 'Name a tool used to groom a domestic dog or cat fur or paws.',
        category: 'Pet Grooming',
        answers: [
          { id: 'fm_15_q3_a1', text: 'Hair comb or Bristle brush', points: 45, acceptedVariants: ['brush', 'comb', 'suklay', 'fur brush'], displayOrder: 1 },
          { id: 'fm_15_q3_a2', text: 'Pet claw clippers', points: 28, acceptedVariants: ['nail cutter', 'nail clippers', 'gunting kuko'], displayOrder: 2 },
          { id: 'fm_15_q3_a3', text: 'Pet grooming shampoo', points: 14, acceptedVariants: ['shampoo', 'soap', 'dog shampoo'], displayOrder: 3 },
          { id: 'fm_15_q3_a4', text: 'Electric fur trimmer', points: 8, acceptedVariants: ['shaver', 'fur trimmer', 'clipper'], displayOrder: 4 },
          { id: 'fm_15_q3_a5', text: 'Blow dryer', points: 5, acceptedVariants: ['dryer', 'hair dryer'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_15_q4',
        prompt: 'Name a domestic bird species kept in home aviaries or cages.',
        category: 'Birds & Aviary',
        answers: [
          { id: 'fm_15_q4_a1', text: 'Parrot', points: 44, acceptedVariants: ['parrot', 'loro'], displayOrder: 1 },
          { id: 'fm_15_q4_a2', text: 'Lovebird', points: 26, acceptedVariants: ['lovebird', 'lovebirds'], displayOrder: 2 },
          { id: 'fm_15_q4_a3', text: 'Canary', points: 16, acceptedVariants: ['canary', 'canary bird'], displayOrder: 3 },
          { id: 'fm_15_q4_a4', text: 'Parakeet / Budgerigar', points: 9, acceptedVariants: ['parakeet', 'budgie'], displayOrder: 4 },
          { id: 'fm_15_q4_a5', text: 'Cockatoo', points: 5, acceptedVariants: ['cockatoo', 'cockatiel'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_15_q5',
        prompt: 'Name a medical reason an owner brings their dog or cat to a veterinary hospital.',
        category: 'Veterinary Medicine',
        answers: [
          { id: 'fm_15_q5_a1', text: 'Anti-rabies or Annual vaccine shots', points: 48, acceptedVariants: ['vaccine', 'bakuna', 'anti rabies', 'rabies shot'], displayOrder: 1 },
          { id: 'fm_15_q5_a2', text: 'Routine health checkup', points: 24, acceptedVariants: ['checkup', 'check up', 'routine check'], displayOrder: 2 },
          { id: 'fm_15_q5_a3', text: 'Physical injury or Bone fracture', points: 14, acceptedVariants: ['injury', 'wound', 'broken bone', 'pilay'], displayOrder: 3 },
          { id: 'fm_15_q5_a4', text: 'Internal deworming', points: 8, acceptedVariants: ['deworming', 'purga'], displayOrder: 4 },
          { id: 'fm_15_q5_a5', text: 'Spay or Neuter surgery', points: 6, acceptedVariants: ['kapon', 'neuter', 'spay', 'surgery'], displayOrder: 5 },
        ],
      },
    ],
  },

  // ==========================================
  // SET 16: DRAWING, CRAFTS & BOARD GAMES
  // ==========================================
  {
    id: 'fm_set_16',
    title: 'Fast Money Set 16',
    description: 'Coloring materials, craft supplies, grid board games, hobbies, and short-string instruments.',
    questions: [
      {
        id: 'fm_16_q1',
        prompt: 'Name a coloring implement used by children or fine artists on paper.',
        category: 'Arts & Crafts',
        answers: [
          { id: 'fm_16_q1_a1', text: 'Wax crayons', points: 42, acceptedVariants: ['crayons', 'krayola', 'crayola'], displayOrder: 1 },
          { id: 'fm_16_q1_a2', text: 'Watercolor paint', points: 28, acceptedVariants: ['watercolor', 'water color', 'paint'], displayOrder: 2 },
          { id: 'fm_16_q1_a3', text: 'Colored pencils', points: 16, acceptedVariants: ['colored pencils', 'color pencils'], displayOrder: 3 },
          { id: 'fm_16_q1_a4', text: 'Marker pens', points: 9, acceptedVariants: ['markers', 'marker', 'pentel pen'], displayOrder: 4 },
          { id: 'fm_16_q1_a5', text: 'Oil pastels', points: 5, acceptedVariants: ['oil pastel', 'pastels'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_16_q2',
        prompt: 'Name a craft material easily snipped with craft scissors.',
        category: 'Craft Materials',
        answers: [
          { id: 'fm_16_q2_a1', text: 'Construction paper', points: 46, acceptedVariants: ['paper', 'construction paper', 'papel'], displayOrder: 1 },
          { id: 'fm_16_q2_a2', text: 'Corrugated cardboard', points: 26, acceptedVariants: ['cardboard', 'karton'], displayOrder: 2 },
          { id: 'fm_16_q2_a3', text: 'Fabric / Felt cloth', points: 14, acceptedVariants: ['fabric', 'cloth', 'felt', 'tela'], displayOrder: 3 },
          { id: 'fm_16_q2_a4', text: 'Satin ribbon', points: 9, acceptedVariants: ['ribbon', 'laso'], displayOrder: 4 },
          { id: 'fm_16_q2_a5', text: 'Adhesive tape', points: 5, acceptedVariants: ['tape', 'scotch tape'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_16_q3',
        prompt: 'Name a classic strategy board game played on a grid of checkered squares.',
        category: 'Tabletop Games',
        answers: [
          { id: 'fm_16_q3_a1', text: 'Chess', points: 55, acceptedVariants: ['chess'], displayOrder: 1 },
          { id: 'fm_16_q3_a2', text: 'Checkers / Dama', points: 30, acceptedVariants: ['checkers', 'dama'], displayOrder: 2 },
          { id: 'fm_16_q3_a3', text: 'Scrabble', points: 8, acceptedVariants: ['scrabble'], displayOrder: 3 },
          { id: 'fm_16_q3_a4', text: 'Othello / Reversi', points: 4, acceptedVariants: ['othello', 'reversi'], displayOrder: 4 },
          { id: 'fm_16_q3_a5', text: 'Go', points: 3, acceptedVariants: ['go', 'weiqi'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_16_q4',
        prompt: 'Name an item collectors gather and preserve as an indoor pastime.',
        category: 'Collecting & Hobbies',
        answers: [
          { id: 'fm_16_q4_a1', text: 'Postage stamps', points: 40, acceptedVariants: ['stamps', 'postage stamps', 'selyo'], displayOrder: 1 },
          { id: 'fm_16_q4_a2', text: 'Currency coins or Old banknotes', points: 28, acceptedVariants: ['coins', 'barya', 'old money'], displayOrder: 2 },
          { id: 'fm_16_q4_a3', text: 'Action figures or Toys', points: 16, acceptedVariants: ['action figures', 'toys', 'funko pop', 'gundam'], displayOrder: 3 },
          { id: 'fm_16_q4_a4', text: 'Comic books', points: 10, acceptedVariants: ['comics', 'comic books', 'manga'], displayOrder: 4 },
          { id: 'fm_16_q4_a5', text: 'Vinyl record albums', points: 6, acceptedVariants: ['vinyl', 'records', 'plaka'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_16_q5',
        prompt: 'Name an acoustic string instrument that has fewer than six strings.',
        category: 'Musical Instruments',
        answers: [
          { id: 'fm_16_q5_a1', text: 'Ukulele', points: 48, acceptedVariants: ['ukulele', 'uke'], displayOrder: 1 },
          { id: 'fm_16_q5_a2', text: 'Bass guitar', points: 28, acceptedVariants: ['bass', 'bass guitar', 'plucked bass'], displayOrder: 2 },
          { id: 'fm_16_q5_a3', text: 'Violin', points: 14, acceptedVariants: ['violin', 'biyolin', 'fiddle'], displayOrder: 3 },
          { id: 'fm_16_q5_a4', text: 'Banjo', points: 6, acceptedVariants: ['banjo'], displayOrder: 4 },
          { id: 'fm_16_q5_a5', text: 'Cello', points: 4, acceptedVariants: ['cello'], displayOrder: 5 },
        ],
      },
    ],
  },

  // ==========================================
  // SET 17: BANKNOTES, CARDS & SAVINGS GOALS
  // ==========================================
  {
    id: 'fm_set_17',
    title: 'Fast Money Set 17',
    description: 'Banknote security prints, cashless methods, bank card details, life savings goals, and coin values.',
    questions: [
      {
        id: 'fm_17_q1',
        prompt: 'Name an element engraved or printed on legal tender paper banknotes.',
        category: 'Currency & Security',
        answers: [
          { id: 'fm_17_q1_a1', text: 'Portrait of a national hero', points: 46, acceptedVariants: ['hero', 'president', 'mukha ng bayani', 'portrait'], displayOrder: 1 },
          { id: 'fm_17_q1_a2', text: 'Denomination currency number', points: 30, acceptedVariants: ['amount', 'number', 'halaga', 'presyo'], displayOrder: 2 },
          { id: 'fm_17_q1_a3', text: 'Central bank seal', points: 12, acceptedVariants: ['seal', 'bsp logo', 'central bank seal'], displayOrder: 3 },
          { id: 'fm_17_q1_a4', text: 'Security serial number', points: 7, acceptedVariants: ['serial number', 'code'], displayOrder: 4 },
          { id: 'fm_17_q1_a5', text: 'Watermark thread', points: 5, acceptedVariants: ['watermark', 'security thread', 'yarn'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_17_q2',
        prompt: 'Name a payment method accepted at stores that avoids physical paper cash.',
        category: 'Finance & Payments',
        answers: [
          { id: 'fm_17_q2_a1', text: 'Credit card', points: 44, acceptedVariants: ['credit card', 'card'], displayOrder: 1 },
          { id: 'fm_17_q2_a2', text: 'Debit card', points: 26, acceptedVariants: ['debit card', 'atm card'], displayOrder: 2 },
          { id: 'fm_17_q2_a3', text: 'Mobile e-wallet app / QR code', points: 20, acceptedVariants: ['gcash', 'maya', 'qr code', 'e-wallet', 'digital wallet'], displayOrder: 3 },
          { id: 'fm_17_q2_a4', text: 'Bank debit transfer', points: 6, acceptedVariants: ['bank transfer', 'online transfer'], displayOrder: 4 },
          { id: 'fm_17_q2_a5', text: 'Store gift card', points: 4, acceptedVariants: ['gift certificate', 'gc', 'gift card'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_17_q3',
        prompt: 'Name a line of personal account information stamped on a plastic bank card.',
        category: 'Banking Security',
        answers: [
          { id: 'fm_17_q3_a1', text: '16-digit card number', points: 48, acceptedVariants: ['card number', 'number', 'account number'], displayOrder: 1 },
          { id: 'fm_17_q3_a2', text: 'Cardholder legal name', points: 26, acceptedVariants: ['name', 'cardholder name', 'pangalan'], displayOrder: 2 },
          { id: 'fm_17_q3_a3', text: 'Expiration validity date', points: 14, acceptedVariants: ['expiry date', 'expiration', 'valid thru'], displayOrder: 3 },
          { id: 'fm_17_q3_a4', text: '3-digit CVV security code', points: 8, acceptedVariants: ['cvv', 'cvc', 'security code'], displayOrder: 4 },
          { id: 'fm_17_q3_a5', text: 'Issuing bank name', points: 4, acceptedVariants: ['bank name', 'bdo', 'bpi', 'logo'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_17_q4',
        prompt: 'Name a major life expense people maintain a dedicated bank savings account for.',
        category: 'Personal Finance Goals',
        answers: [
          { id: 'fm_17_q4_a1', text: 'Buying a house or property', points: 45, acceptedVariants: ['house', 'bahay', 'downpayment', 'property', 'real estate'], displayOrder: 1 },
          { id: 'fm_17_q4_a2', text: 'Emergency medical fund', points: 26, acceptedVariants: ['emergency fund', 'hospital bills', 'medical fund'], displayOrder: 2 },
          { id: 'fm_17_q4_a3', text: 'Purchasing a private car', points: 15, acceptedVariants: ['car', 'kotse', 'vehicle'], displayOrder: 3 },
          { id: 'fm_17_q4_a4', text: 'College tuition fund', points: 9, acceptedVariants: ['tuition', 'education', 'school fund', 'pag-aaral'], displayOrder: 4 },
          { id: 'fm_17_q4_a5', text: 'Wedding expenses', points: 5, acceptedVariants: ['wedding', 'kasal'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_17_q5',
        prompt: 'Name a common metallic coin denomination actively circulating in the Philippines.',
        category: 'Philippine Currency',
        answers: [
          { id: 'fm_17_q5_a1', text: '1 Piso coin', points: 42, acceptedVariants: ['1 piso', 'piso', 'one peso', '1 peso'], displayOrder: 1 },
          { id: 'fm_17_q5_a2', text: '5 Piso coin', points: 28, acceptedVariants: ['5 piso', 'limang piso', 'five pesos', '5 peso'], displayOrder: 2 },
          { id: 'fm_17_q5_a3', text: '10 Piso coin', points: 18, acceptedVariants: ['10 piso', 'sampung piso', 'ten pesos', '10 peso'], displayOrder: 3 },
          { id: 'fm_17_q5_a4', text: '20 Piso coin', points: 8, acceptedVariants: ['20 piso', 'dalawampung piso', 'twenty pesos', '20 peso'], displayOrder: 4 },
          { id: 'fm_17_q5_a5', text: '25 Sentimo coin', points: 4, acceptedVariants: ['25 sentimo', 'cents', '25 cents'], displayOrder: 5 },
        ],
      },
    ],
  },

  // ==========================================
  // SET 18: HOTEL ROOMS, RESORTS & CONCIERGE
  // ==========================================
  {
    id: 'fm_set_18',
    title: 'Fast Money Set 18',
    description: 'Hotel bathroom fittings, concierge requests, door safety latches, resort amenities, and bedroom furniture.',
    questions: [
      {
        id: 'fm_18_q1',
        prompt: 'Name an essential fixture provided inside a hotel guest bathroom.',
        category: 'Hotel Bathrooms',
        answers: [
          { id: 'fm_18_q1_a1', text: 'Clean white bath towels', points: 48, acceptedVariants: ['towel', 'towels', 'tuwalya', 'bath towel'], displayOrder: 1 },
          { id: 'fm_18_q1_a2', text: 'Electric hair dryer', points: 24, acceptedVariants: ['hair dryer', 'blower', 'hairdryer'], displayOrder: 2 },
          { id: 'fm_18_q1_a3', text: 'Soap and shampoo dispenser', points: 16, acceptedVariants: ['soap dispenser', 'shampoo', 'body wash'], displayOrder: 3 },
          { id: 'fm_18_q1_a4', text: 'Glass shower stall', points: 7, acceptedVariants: ['shower', 'bathtub', 'glass door'], displayOrder: 4 },
          { id: 'fm_18_q1_a5', text: 'Extra toilet paper rolls', points: 5, acceptedVariants: ['tissue', 'toilet paper', 'tissue roll'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_18_q2',
        prompt: 'Name a service hotel guests contact the concierge or front desk to arrange.',
        category: 'Concierge Services',
        answers: [
          { id: 'fm_18_q2_a1', text: 'Wake-up telephone call', points: 38, acceptedVariants: ['wake up call', 'wake-up call', 'alarm'], displayOrder: 1 },
          { id: 'fm_18_q2_a2', text: 'Additional bed pillows or blankets', points: 28, acceptedVariants: ['extra pillow', 'extra blanket', 'unan', 'kumot'], displayOrder: 2 },
          { id: 'fm_18_q2_a3', text: 'In-room dining delivery', points: 18, acceptedVariants: ['room service', 'food delivery'], displayOrder: 3 },
          { id: 'fm_18_q2_a4', text: 'Luggage holding storage', points: 10, acceptedVariants: ['luggage storage', 'baggage storage', 'bellhop'], displayOrder: 4 },
          { id: 'fm_18_q2_a5', text: 'Taxi or Airport shuttle booking', points: 6, acceptedVariants: ['airport shuttle', 'taxi', 'car transfer'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_18_q3',
        prompt: 'Name a security feature installed on the entrance door of a hotel room.',
        category: 'Hotel Security',
        answers: [
          { id: 'fm_18_q3_a1', text: 'Electronic keycard RFID reader', points: 46, acceptedVariants: ['keycard', 'card reader', 'rfid lock', 'key card'], displayOrder: 1 },
          { id: 'fm_18_q3_a2', text: 'Interior peephole viewer', points: 26, acceptedVariants: ['peephole', 'eye hole', 'peep hole'], displayOrder: 2 },
          { id: 'fm_18_q3_a3', text: 'Interior swing bar security latch', points: 16, acceptedVariants: ['door latch', 'chain lock', 'swing bar latch', 'security lock'], displayOrder: 3 },
          { id: 'fm_18_q3_a4', text: 'Deadbolt lock', points: 8, acceptedVariants: ['deadbolt', 'lock'], displayOrder: 4 },
          { id: 'fm_18_q3_a5', text: 'Do Not Disturb door hanger', points: 4, acceptedVariants: ['door hanger', 'do not disturb sign'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_18_q4',
        prompt: 'Name a leisure amenity travelers look for when booking a vacation resort.',
        category: 'Resort Amenities',
        answers: [
          { id: 'fm_18_q4_a1', text: 'Swimming pool', points: 45, acceptedVariants: ['pool', 'swimming pool', 'infinity pool'], displayOrder: 1 },
          { id: 'fm_18_q4_a2', text: 'Direct beachfront shoreline', points: 28, acceptedVariants: ['beach', 'beachfront', 'sea view'], displayOrder: 2 },
          { id: 'fm_18_q4_a3', text: 'Complimentary breakfast buffet', points: 14, acceptedVariants: ['free breakfast', 'buffet', 'breakfast'], displayOrder: 3 },
          { id: 'fm_18_q4_a4', text: 'High-speed wireless internet', points: 8, acceptedVariants: ['wifi', 'free wifi', 'internet'], displayOrder: 4 },
          { id: 'fm_18_q4_a5', text: 'Full-service fitness gym', points: 5, acceptedVariants: ['gym', 'fitness center', 'fitness gym'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_18_q5',
        prompt: 'Name a piece of furniture present inside every standard hotel bedroom.',
        category: 'Hotel Furnishings',
        answers: [
          { id: 'fm_18_q5_a1', text: 'Bed / Mattress', points: 55, acceptedVariants: ['bed', 'kama', 'mattress'], displayOrder: 1 },
          { id: 'fm_18_q5_a2', text: 'Bedside nightstand table', points: 22, acceptedVariants: ['nightstand', 'side table', 'bedside table'], displayOrder: 2 },
          { id: 'fm_18_q5_a3', text: 'Writing desk with chair', points: 12, acceptedVariants: ['desk', 'work desk', 'table'], displayOrder: 3 },
          { id: 'fm_18_q5_a4', text: 'Luggage rack bench', points: 7, acceptedVariants: ['luggage rack', 'bench'], displayOrder: 4 },
          { id: 'fm_18_q5_a5', text: 'Wardrobe armoire', points: 4, acceptedVariants: ['closet', 'wardrobe', 'cabinet'], displayOrder: 5 },
        ],
      },
    ],
  },

  // ==========================================
  // SET 19: VEHICLE FLUIDS, SAFETY & SIGNS
  // ==========================================
  {
    id: 'fm_set_19',
    title: 'Fast Money Set 19',
    description: 'Under-hood fluids, internal crash safety, road sign shapes, dashboard warnings, and traffic infractions.',
    questions: [
      {
        id: 'fm_19_q1',
        prompt: 'Name a vital fluid checked under an automobile hood.',
        category: 'Automotive Maintenance',
        answers: [
          { id: 'fm_19_q1_a1', text: 'Engine motor oil', points: 48, acceptedVariants: ['engine oil', 'oil', 'langis'], displayOrder: 1 },
          { id: 'fm_19_q1_a2', text: 'Radiator coolant water', points: 26, acceptedVariants: ['coolant', 'tubig sa radiator', 'radiator fluid'], displayOrder: 2 },
          { id: 'fm_19_q1_a3', text: 'Windshield wiper washer fluid', points: 14, acceptedVariants: ['wiper fluid', 'washer fluid', 'tubig sa wiper'], displayOrder: 3 },
          { id: 'fm_19_q1_a4', text: 'Brake fluid', points: 8, acceptedVariants: ['brake fluid', 'langis sa preno'], displayOrder: 4 },
          { id: 'fm_19_q1_a5', text: 'Automatic transmission fluid', points: 4, acceptedVariants: ['atf', 'transmission fluid'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_19_q2',
        prompt: 'Name an internal safety feature built into passenger cars to protect riders in crashes.',
        category: 'Vehicle Safety',
        answers: [
          { id: 'fm_19_q2_a1', text: 'Three-point seatbelts', points: 52, acceptedVariants: ['seatbelt', 'seat belts', 'seatbelt harness'], displayOrder: 1 },
          { id: 'fm_19_q2_a2', text: 'Front and side airbags', points: 30, acceptedVariants: ['airbag', 'airbags'], displayOrder: 2 },
          { id: 'fm_19_q2_a3', text: 'Anti-lock braking system / ABS', points: 10, acceptedVariants: ['abs', 'brakes', 'anti-lock brakes'], displayOrder: 3 },
          { id: 'fm_19_q2_a4', text: 'Padded headrests', points: 5, acceptedVariants: ['headrest', 'head rest'], displayOrder: 4 },
          { id: 'fm_19_q2_a5', text: 'Tempered safety glass', points: 3, acceptedVariants: ['safety glass', 'windshield glass'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_19_q3',
        prompt: 'Name a geometric shape used for standard metal highway traffic signs.',
        category: 'Highway & Traffic Signs',
        answers: [
          { id: 'fm_19_q3_a1', text: 'Octagon / Stop sign', points: 48, acceptedVariants: ['octagon', 'stop sign shape', '8 sides'], displayOrder: 1 },
          { id: 'fm_19_q3_a2', text: 'Inverted triangle / Yield sign', points: 26, acceptedVariants: ['triangle', 'inverted triangle', 'yield sign'], displayOrder: 2 },
          { id: 'fm_19_q3_a3', text: 'Circle / Speed limit sign', points: 14, acceptedVariants: ['circle', 'bilog', 'round'], displayOrder: 3 },
          { id: 'fm_19_q3_a4', text: 'Diamond / Hazard warning sign', points: 8, acceptedVariants: ['diamond', 'warning diamond'], displayOrder: 4 },
          { id: 'fm_19_q3_a5', text: 'Rectangle / Direction sign', points: 4, acceptedVariants: ['rectangle', 'parihaba'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_19_q4',
        prompt: 'Name an alert light illuminated on a car dashboard when a malfunction occurs.',
        category: 'Dashboard & Instruments',
        answers: [
          { id: 'fm_19_q4_a1', text: 'Check Engine icon', points: 46, acceptedVariants: ['check engine', 'engine light', 'check engine light'], displayOrder: 1 },
          { id: 'fm_19_q4_a2', text: 'Low fuel gas pump icon', points: 28, acceptedVariants: ['fuel light', 'gas icon', 'low fuel'], displayOrder: 2 },
          { id: 'fm_19_q4_a3', text: 'Battery charging indicator', points: 14, acceptedVariants: ['battery', 'battery light', 'alternator'], displayOrder: 3 },
          { id: 'fm_19_q4_a4', text: 'Engine oil pressure can', points: 8, acceptedVariants: ['oil light', 'oil pressure', 'oil lamp'], displayOrder: 4 },
          { id: 'fm_19_q4_a5', text: 'Low tire pressure warning', points: 4, acceptedVariants: ['tire pressure', 'tpms', 'flat tire icon'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_19_q5',
        prompt: 'Name an infraction for which highway patrol pulls over a moving car.',
        category: 'Traffic Regulations',
        answers: [
          { id: 'fm_19_q5_a1', text: 'Speeding above speed limit', points: 48, acceptedVariants: ['speeding', 'over speeding', 'mabilis magpatakbo'], displayOrder: 1 },
          { id: 'fm_19_q5_a2', text: 'Running a red traffic light', points: 28, acceptedVariants: ['red light', 'beating red light', 'paghabol sa pula'], displayOrder: 2 },
          { id: 'fm_19_q5_a3', text: 'Using a mobile phone while driving', points: 12, acceptedVariants: ['cellphone', 'texting while driving', 'using phone'], displayOrder: 3 },
          { id: 'fm_19_q5_a4', text: 'Driving without headlights on', points: 7, acceptedVariants: ['no lights', 'broken headlight', 'headlights off'], displayOrder: 4 },
          { id: 'fm_19_q5_a5', text: 'Failing to wear seatbelts', points: 5, acceptedVariants: ['no seatbelt', 'seatbelt violation'], displayOrder: 5 },
        ],
      },
    ],
  },

  // ==========================================
  // SET 20: FIELD SPORTS, REFEREES & RUNNING
  // ==========================================
  {
    id: 'fm_set_20',
    title: 'Fast Money Set 20',
    description: 'Outdoor field sports, protective helmets, referee tools, track sprint distances, and gym locker items.',
    questions: [
      {
        id: 'fm_20_q1',
        prompt: 'Name a team sport played outdoors on a regulation grass field.',
        category: 'Team Sports',
        answers: [
          { id: 'fm_20_q1_a1', text: 'Soccer / Association football', points: 46, acceptedVariants: ['soccer', 'football', 'futbol'], displayOrder: 1 },
          { id: 'fm_20_q1_a2', text: 'Rugby', points: 24, acceptedVariants: ['rugby'], displayOrder: 2 },
          { id: 'fm_20_q1_a3', text: 'Baseball', points: 16, acceptedVariants: ['baseball', 'softball'], displayOrder: 3 },
          { id: 'fm_20_q1_a4', text: 'American football', points: 9, acceptedVariants: ['american football', 'nfl'], displayOrder: 4 },
          { id: 'fm_20_q1_a5', text: 'Field hockey', points: 5, acceptedVariants: ['hockey', 'field hockey'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_20_q2',
        prompt: 'Name a piece of protective headgear worn in contact sports.',
        category: 'Sports Protective Gear',
        answers: [
          { id: 'fm_20_q2_a1', text: 'Hard helmet', points: 55, acceptedVariants: ['helmet', 'football helmet', 'cycling helmet'], displayOrder: 1 },
          { id: 'fm_20_q2_a2', text: 'Padded boxing headgear', points: 24, acceptedVariants: ['headgear', 'boxing headgear', 'padded headgear'], displayOrder: 2 },
          { id: 'fm_20_q2_a3', text: 'Batting helmet', points: 11, acceptedVariants: ['batting helmet', 'baseball helmet'], displayOrder: 3 },
          { id: 'fm_20_q2_a4', text: 'Rugby scrum cap', points: 6, acceptedVariants: ['scrum cap', 'rugby cap'], displayOrder: 4 },
          { id: 'fm_20_q2_a5', text: 'Catcher face mask', points: 4, acceptedVariants: ['face mask', 'catcher mask'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_20_q3',
        prompt: 'Name an item held or blown by a sports referee during regulation play.',
        category: 'Referees & Officiating',
        answers: [
          { id: 'fm_20_q3_a1', text: 'Loud whistle', points: 54, acceptedVariants: ['whistle', 'pito'], displayOrder: 1 },
          { id: 'fm_20_q3_a2', text: 'Yellow and red penalty cards', points: 26, acceptedVariants: ['cards', 'red card', 'yellow card', 'penalty card'], displayOrder: 2 },
          { id: 'fm_20_q3_a3', text: 'Digital stopwatch', points: 12, acceptedVariants: ['stopwatch', 'timer', 'orasan'], displayOrder: 3 },
          { id: 'fm_20_q3_a4', text: 'Lineman signal flag', points: 5, acceptedVariants: ['flag', 'signal flag', 'bandila'], displayOrder: 4 },
          { id: 'fm_20_q3_a5', text: 'Coin for pre-game coin toss', points: 3, acceptedVariants: ['coin', 'barya'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_20_q4',
        prompt: 'Name a standard track and field footrace distance run at athletic meets.',
        category: 'Track & Field',
        answers: [
          { id: 'fm_20_q4_a1', text: '100-meter sprint', points: 50, acceptedVariants: ['100m', '100 meters', '100m sprint'], displayOrder: 1 },
          { id: 'fm_20_q4_a2', text: '200-meter dash', points: 22, acceptedVariants: ['200m', '200 meters'], displayOrder: 2 },
          { id: 'fm_20_q4_a3', text: '400-meter lap', points: 14, acceptedVariants: ['400m', '400 meters', 'one lap'], displayOrder: 3 },
          { id: 'fm_20_q4_a4', text: 'Marathon / 42 kilometers', points: 9, acceptedVariants: ['marathon', '42k', '42km'], displayOrder: 4 },
          { id: 'fm_20_q4_a5', text: '4 x 100-meter relay', points: 5, acceptedVariants: ['relay', '4x100m', '4x100'], displayOrder: 5 },
        ],
      },
      {
        id: 'fm_20_q5',
        prompt: 'Name an item found inside an athletic gym locker room.',
        category: 'Gym & Fitness Facility',
        answers: [
          { id: 'fm_20_q5_a1', text: 'Lockers with combination padlocks', points: 44, acceptedVariants: ['lockers', 'locker', 'padlock'], displayOrder: 1 },
          { id: 'fm_20_q5_a2', text: 'Wooden bench', points: 26, acceptedVariants: ['bench', 'upuan', 'locker bench'], displayOrder: 2 },
          { id: 'fm_20_q5_a3', text: 'Shower stalls', points: 16, acceptedVariants: ['shower', 'showers', 'paliguan'], displayOrder: 3 },
          { id: 'fm_20_q5_a4', text: 'Bath towel', points: 9, acceptedVariants: ['towel', 'towels', 'tuwalya'], displayOrder: 4 },
          { id: 'fm_20_q5_a5', text: 'Deodorant or Body spray', points: 5, acceptedVariants: ['deodorant', 'body spray', 'cologne'], displayOrder: 5 },
        ],
      },
    ],
  },
];
