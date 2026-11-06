import type { QuestionPack } from '../../types/game';

export const PACKS_50_TO_61: QuestionPack[] = [
  // PACK 50 (Pack 1): Zombie Apocalypse
  {
    id: 'pack_ph_50',
    title: 'Zombie Apocalypse',
    description: 'Survival strategies, dangerous situations, supplies, and life-or-death decisions during a sudden zombie outbreak.',
    category: 'Survival & Apocalypse',
    isBuiltIn: true,
    createdAt: '2026-11-06T00:00:00.000Z',
    updatedAt: '2026-11-06T00:00:00.000Z',
    questions: [
      {
        id: 'ph_50_q1',
        prompt: 'Name something you would immediately grab from home if a zombie outbreak started right now.',
        category: 'Survival & Apocalypse',
        answers: [
          { id: 'ph_50_q1_a1', text: 'Canned food and non-perishable snacks', points: 35, acceptedVariants: ['canned goods', 'food', 'canned food', 'snacks', 'groceries'], displayOrder: 1 },
          { id: 'ph_50_q1_a2', text: 'Drinking water / Water bottles', points: 25, acceptedVariants: ['water', 'bottled water', 'drinking water', 'mineral water'], displayOrder: 2 },
          { id: 'ph_50_q1_a3', text: 'Weapon (Knife, Machete, Baseball bat)', points: 20, acceptedVariants: ['weapon', 'knife', 'bolo', 'machete', 'baseball bat', 'gun'], displayOrder: 3 },
          { id: 'ph_50_q1_a4', text: 'First aid kit / Essential medicines', points: 12, acceptedVariants: ['first aid kit', 'medicine', 'medical supplies', 'bandages', 'gamot'], displayOrder: 4 },
          { id: 'ph_50_q1_a5', text: 'Flashlight and spare batteries', points: 8, acceptedVariants: ['flashlight', 'batteries', 'torch', 'light'], displayOrder: 5 },
        ],
      },
      {
        id: 'ph_50_q2',
        prompt: 'Name the best place to hide and set up a base during a zombie outbreak.',
        category: 'Survival & Apocalypse',
        answers: [
          { id: 'ph_50_q2_a1', text: 'Supermarket / Grocery mall', points: 38, acceptedVariants: ['supermarket', 'grocery', 'mall', 'puregold', 'sm'], displayOrder: 1 },
          { id: 'ph_50_q2_a2', text: 'Remote island surrounded by deep water', points: 26, acceptedVariants: ['island', 'isolated island', 'beach island'], displayOrder: 2 },
          { id: 'ph_50_q2_a3', text: 'Farm / Countryside house in the province', points: 18, acceptedVariants: ['farm', 'province', 'countryside', 'probinsya'], displayOrder: 3 },
          { id: 'ph_50_q2_a4', text: 'Police station or military barracks', points: 12, acceptedVariants: ['police station', 'military base', 'army base', 'baraks'], displayOrder: 4 },
          { id: 'ph_50_q2_a5', text: 'Rooftop of a secure tall building', points: 6, acceptedVariants: ['rooftop', 'roof', 'building roof', 'penthouse'], displayOrder: 5 },
        ],
      },
      {
        id: 'ph_50_q3',
        prompt: 'What everyday household object would make the best makeshift weapon against a zombie?',
        category: 'Survival & Apocalypse',
        answers: [
          { id: 'ph_50_q3_a1', text: 'Baseball bat / Wooden bat', points: 36, acceptedVariants: ['baseball bat', 'bat', 'wooden bat'], displayOrder: 1 },
          { id: 'ph_50_q3_a2', text: 'Kitchen knife / Meat cleaver', points: 28, acceptedVariants: ['knife', 'kitchen knife', 'cleaver', 'kutsilyo'], displayOrder: 2 },
          { id: 'ph_50_q3_a3', text: 'Machete / Bolo / Itak', points: 18, acceptedVariants: ['bolo', 'machete', 'itak'], displayOrder: 3 },
          { id: 'ph_50_q3_a4', text: 'Heavy frying pan / Cast iron skillet', points: 11, acceptedVariants: ['frying pan', 'kawali', 'pan', 'skillet'], displayOrder: 4 },
          { id: 'ph_50_q3_a5', text: 'Hammer / Crowbar', points: 7, acceptedVariants: ['hammer', 'crowbar', 'martilyo', 'bareta'], displayOrder: 5 },
        ],
      },
      {
        id: 'ph_50_q4',
        prompt: 'What kind of professional would you definitely want in your zombie survival squad?',
        category: 'Survival & Apocalypse',
        answers: [
          { id: 'ph_50_q4_a1', text: 'Doctor / Nurse / Medic', points: 40, acceptedVariants: ['doctor', 'nurse', 'medic', 'health worker'], displayOrder: 1 },
          { id: 'ph_50_q4_a2', text: 'Soldier / Police officer', points: 28, acceptedVariants: ['soldier', 'police', 'military', 'army', 'pulis'], displayOrder: 2 },
          { id: 'ph_50_q4_a3', text: 'Farmer / Hunter / Forager', points: 16, acceptedVariants: ['farmer', 'hunter', 'magsasaka'], displayOrder: 3 },
          { id: 'ph_50_q4_a4', text: 'Mechanic / Engineer', points: 10, acceptedVariants: ['mechanic', 'engineer', 'electrician'], displayOrder: 4 },
          { id: 'ph_50_q4_a5', text: 'Martial artist / Fast runner', points: 6, acceptedVariants: ['athlete', 'martial artist', 'fighter', 'runner'], displayOrder: 5 },
        ],
      },
      {
        id: 'ph_50_q5',
        prompt: 'Name a classic movie mistake that usually gets someone bitten or killed by a zombie.',
        category: 'Survival & Apocalypse',
        answers: [
          { id: 'ph_50_q5_a1', text: 'Hiding that they were secretly bitten or scratched', points: 42, acceptedVariants: ['hiding a bite', 'hiding bite', 'secret bite', 'hiding that they got bitten'], displayOrder: 1 },
          { id: 'ph_50_q5_a2', text: 'Going back into danger to rescue a pet or keepsake', points: 25, acceptedVariants: ['going back for pet', 'saving a pet', 'saving dog', 'going back for belongings'], displayOrder: 2 },
          { id: 'ph_50_q5_a3', text: 'Splitting up from the group to check a strange noise', points: 18, acceptedVariants: ['splitting up', 'separating', 'going alone', 'walking off alone'], displayOrder: 3 },
          { id: 'ph_50_q5_a4', text: 'Panicking and screaming loudly', points: 15, acceptedVariants: ['making noise', 'shouting', 'screaming', 'loud sound'], displayOrder: 4 },
        ],
      },
    ],
  },

  // PACK 51 (Pack 2): If I Were a Millionaire
  {
    id: 'pack_ph_51',
    title: 'If I Were a Millionaire',
    description: 'What people would do with unlimited wealth: luxury mansions, dream travel, supercars, and spoiling loved ones.',
    category: 'Wealth & Luxury',
    isBuiltIn: true,
    createdAt: '2026-11-06T00:00:00.000Z',
    updatedAt: '2026-11-06T00:00:00.000Z',
    questions: [
      {
        id: 'ph_51_q1',
        prompt: 'What is the very first thing people say they would buy if they won millions in the lottery?',
        category: 'Wealth & Luxury',
        answers: [
          { id: 'ph_51_q1_a1', text: 'Dream house / Luxury mansion', points: 40, acceptedVariants: ['house', 'mansion', 'dream house', 'bahay', 'luxury home'], displayOrder: 1 },
          { id: 'ph_51_q1_a2', text: 'Luxury sports car / Supercar', points: 25, acceptedVariants: ['car', 'sports car', 'luxury car', 'kotse', 'ferrari', 'lamborghini'], displayOrder: 2 },
          { id: 'ph_51_q1_a3', text: 'Real estate properties / Vast land', points: 17, acceptedVariants: ['land', 'property', 'lote', 'real estate', 'condo'], displayOrder: 3 },
          { id: 'ph_51_q1_a4', text: 'First-class trip around the world', points: 11, acceptedVariants: ['travel', 'plane ticket', 'trip around the world', 'travel abroad'], displayOrder: 4 },
          { id: 'ph_51_q1_a5', text: 'High-end jewelry and designer clothes', points: 7, acceptedVariants: ['jewelry', 'designer clothes', 'rolex', 'bags', 'alahas'], displayOrder: 5 },
        ],
      },
      {
        id: 'ph_51_q2',
        prompt: 'Name a dream luxury vacation destination where millionaires love to travel.',
        category: 'Wealth & Luxury',
        answers: [
          { id: 'ph_51_q2_a1', text: 'Paris, France', points: 34, acceptedVariants: ['paris', 'france', 'eiffel tower'], displayOrder: 1 },
          { id: 'ph_51_q2_a2', text: 'The Maldives (Overwater villas)', points: 28, acceptedVariants: ['maldives', 'maldives resort', 'overwater bungalow'], displayOrder: 2 },
          { id: 'ph_51_q2_a3', text: 'Switzerland (Swiss Alps)', points: 18, acceptedVariants: ['switzerland', 'swiss alps'], displayOrder: 3 },
          { id: 'ph_51_q2_a4', text: 'Tokyo, Japan', points: 12, acceptedVariants: ['japan', 'tokyo', 'kyoto'], displayOrder: 4 },
          { id: 'ph_51_q2_a5', text: 'New York City, USA', points: 8, acceptedVariants: ['new york', 'nyc', 'usa'], displayOrder: 5 },
        ],
      },
      {
        id: 'ph_51_q3',
        prompt: 'Name something lavish you would install in your ultimate dream home.',
        category: 'Wealth & Luxury',
        answers: [
          { id: 'ph_51_q3_a1', text: 'Massive swimming pool / Infinity pool', points: 38, acceptedVariants: ['swimming pool', 'pool', 'infinity pool', 'indoor pool'], displayOrder: 1 },
          { id: 'ph_51_q3_a2', text: 'Private cinema / Home movie theater', points: 26, acceptedVariants: ['home theater', 'cinema', 'movie room', 'private cinema'], displayOrder: 2 },
          { id: 'ph_51_q3_a3', text: 'Huge walk-in closet for clothes and shoes', points: 18, acceptedVariants: ['walk in closet', 'closet', 'wardrobe room'], displayOrder: 3 },
          { id: 'ph_51_q3_a4', text: 'Arcade game room or private bowling alley', points: 11, acceptedVariants: ['game room', 'gaming room', 'arcade', 'bowling alley'], displayOrder: 4 },
          { id: 'ph_51_q3_a5', text: 'Rooftop helipad', points: 7, acceptedVariants: ['helipad', 'helicopter pad', 'roof helipad'], displayOrder: 5 },
        ],
      },
      {
        id: 'ph_51_q4',
        prompt: 'Who is the first person most people would share their lottery millions with?',
        category: 'Wealth & Luxury',
        answers: [
          { id: 'ph_51_q4_a1', text: 'Parents (Mom and Dad)', points: 48, acceptedVariants: ['parents', 'mom and dad', 'mama', 'nanay', 'tatay'], displayOrder: 1 },
          { id: 'ph_51_q4_a2', text: 'Siblings (Brothers and sisters)', points: 24, acceptedVariants: ['siblings', 'kapatid', 'brother', 'sister'], displayOrder: 2 },
          { id: 'ph_51_q4_a3', text: 'Spouse / Life partner', points: 16, acceptedVariants: ['spouse', 'husband', 'wife', 'partner', 'asawa'], displayOrder: 3 },
          { id: 'ph_51_q4_a4', text: 'Best friends / Barkada', points: 12, acceptedVariants: ['best friend', 'friends', 'barkada', 'tropa'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_51_q5',
        prompt: 'Name a personal staff member you would hire immediately if money were no object.',
        category: 'Wealth & Luxury',
        answers: [
          { id: 'ph_51_q5_a1', text: 'Private chef / Personal gourmet cook', points: 42, acceptedVariants: ['private chef', 'chef', 'cook', 'personal chef'], displayOrder: 1 },
          { id: 'ph_51_q5_a2', text: 'Personal driver / Chauffeur', points: 26, acceptedVariants: ['driver', 'chauffeur', 'personal driver'], displayOrder: 2 },
          { id: 'ph_51_q5_a3', text: 'Full-time maid / Housekeeper', points: 18, acceptedVariants: ['maid', 'housekeeper', 'cleaner', 'kasambahay'], displayOrder: 3 },
          { id: 'ph_51_q5_a4', text: 'Personal bodyguard / Security detail', points: 14, acceptedVariants: ['bodyguard', 'security', 'personal guard'], displayOrder: 4 },
        ],
      },
    ],
  },

  // PACK 52 (Pack 3): Cartoon Kingdom
  {
    id: 'pack_ph_52',
    title: 'Cartoon Kingdom',
    description: 'Iconic cartoon characters, beloved animated shows, timeless cartoon logic, and memorable fictional worlds.',
    category: 'Animation & Cartoons',
    isBuiltIn: true,
    createdAt: '2026-11-06T00:00:00.000Z',
    updatedAt: '2026-11-06T00:00:00.000Z',
    questions: [
      {
        id: 'ph_52_q1',
        prompt: 'Name one of the most recognizable animated cartoon characters of all time.',
        category: 'Animation & Cartoons',
        answers: [
          { id: 'ph_52_q1_a1', text: 'Mickey Mouse', points: 42, acceptedVariants: ['mickey mouse', 'mickey'], displayOrder: 1 },
          { id: 'ph_52_q1_a2', text: 'SpongeBob SquarePants', points: 26, acceptedVariants: ['spongebob', 'spongebob squarepants'], displayOrder: 2 },
          { id: 'ph_52_q1_a3', text: 'Bugs Bunny', points: 16, acceptedVariants: ['bugs bunny', 'bugs'], displayOrder: 3 },
          { id: 'ph_52_q1_a4', text: 'Tom & Jerry', points: 10, acceptedVariants: ['tom and jerry', 'tom', 'jerry'], displayOrder: 4 },
          { id: 'ph_52_q1_a5', text: 'Homer Simpson', points: 6, acceptedVariants: ['homer simpson', 'homer', 'simpsons'], displayOrder: 5 },
        ],
      },
      {
        id: 'ph_52_q2',
        prompt: 'Name a cartoon character famous for having an insatiable appetite or a signature favorite food.',
        category: 'Animation & Cartoons',
        answers: [
          { id: 'ph_52_q2_a1', text: 'Garfield (Lasagna)', points: 34, acceptedVariants: ['garfield', 'garfield the cat'], displayOrder: 1 },
          { id: 'ph_52_q2_a2', text: 'Scooby-Doo & Shaggy (Scooby Snacks)', points: 26, acceptedVariants: ['scooby doo', 'scooby', 'shaggy'], displayOrder: 2 },
          { id: 'ph_52_q2_a3', text: 'Winnie the Pooh (Honey pot)', points: 18, acceptedVariants: ['winnie the pooh', 'pooh', 'pooh bear'], displayOrder: 3 },
          { id: 'ph_52_q2_a4', text: 'Homer Simpson (Pink frosted donuts)', points: 14, acceptedVariants: ['homer simpson', 'homer'], displayOrder: 4 },
          { id: 'ph_52_q2_a5', text: 'Popeye the Sailor (Spinach)', points: 8, acceptedVariants: ['popeye', 'popeye the sailor'], displayOrder: 5 },
        ],
      },
      {
        id: 'ph_52_q3',
        prompt: 'Name a fictional cartoon hometown or fantasy world where people wish they could live.',
        category: 'Animation & Cartoons',
        answers: [
          { id: 'ph_52_q3_a1', text: 'Bikini Bottom (SpongeBob SquarePants)', points: 38, acceptedVariants: ['bikini bottom', 'spongebob world'], displayOrder: 1 },
          { id: 'ph_52_q3_a2', text: 'Springfield (The Simpsons)', points: 24, acceptedVariants: ['springfield'], displayOrder: 2 },
          { id: 'ph_52_q3_a3', text: 'Bedrock (The Flintstones)', points: 16, acceptedVariants: ['bedrock', 'flintstones'], displayOrder: 3 },
          { id: 'ph_52_q3_a4', text: 'The City of Townsville (The Powerpuff Girls)', points: 12, acceptedVariants: ['townsville', 'powerpuff girls'], displayOrder: 4 },
          { id: 'ph_52_q3_a5', text: 'Danville (Phineas and Ferb)', points: 10, acceptedVariants: ['danville', 'phineas and ferb'], displayOrder: 5 },
        ],
      },
      {
        id: 'ph_52_q4',
        prompt: 'Name an iconic cartoon animal sidekick or pet.',
        category: 'Animation & Cartoons',
        answers: [
          { id: 'ph_52_q4_a1', text: 'Scooby-Doo', points: 38, acceptedVariants: ['scooby doo', 'scooby'], displayOrder: 1 },
          { id: 'ph_52_q4_a2', text: 'Snoopy (Peanuts)', points: 27, acceptedVariants: ['snoopy', 'peanuts'], displayOrder: 2 },
          { id: 'ph_52_q4_a3', text: 'Gary the Snail (SpongeBob)', points: 18, acceptedVariants: ['gary', 'gary the snail'], displayOrder: 3 },
          { id: 'ph_52_q4_a4', text: 'Perry the Platypus / Agent P', points: 11, acceptedVariants: ['perry the platypus', 'agent p', 'perry'], displayOrder: 4 },
          { id: 'ph_52_q4_a5', text: 'Pluto the Dog (Disney)', points: 6, acceptedVariants: ['pluto', 'pluto the dog'], displayOrder: 5 },
        ],
      },
      {
        id: 'ph_52_q5',
        prompt: 'Name something that constantly happens to cartoon characters that would be fatal in real life.',
        category: 'Animation & Cartoons',
        answers: [
          { id: 'ph_52_q5_a1', text: 'Falling off a high cliff or skyscraper', points: 42, acceptedVariants: ['falling off a cliff', 'falling from heights', 'falling', 'falling down'], displayOrder: 1 },
          { id: 'ph_52_q5_a2', text: 'Getting crushed flat by an anvil or falling piano', points: 26, acceptedVariants: ['crushed by anvil', 'anvil', 'piano falling', 'getting flattened'], displayOrder: 2 },
          { id: 'ph_52_q5_a3', text: 'Having a stick of dynamite explode in their face', points: 18, acceptedVariants: ['dynamite', 'explosion', 'bomb', 'acme bomb'], displayOrder: 3 },
          { id: 'ph_52_q5_a4', text: 'Getting run over by a speeding freight train or steamroller', points: 14, acceptedVariants: ['hit by a train', 'hit by truck', 'run over'], displayOrder: 4 },
        ],
      },
    ],
  },

  // PACK 53 (Pack 4): Animal Kingdom
  {
    id: 'pack_ph_53',
    title: 'Animal Kingdom',
    description: 'Wild predators, intelligent creatures, beloved pets, and astonishing abilities found in the natural world.',
    category: 'Animals & Nature',
    isBuiltIn: true,
    createdAt: '2026-11-06T00:00:00.000Z',
    updatedAt: '2026-11-06T00:00:00.000Z',
    questions: [
      {
        id: 'ph_53_q1',
        prompt: 'Name an animal widely recognized by scientists as one of the smartest on Earth.',
        category: 'Animals & Nature',
        answers: [
          { id: 'ph_53_q1_a1', text: 'Chimpanzee / Great Ape', points: 36, acceptedVariants: ['chimpanzee', 'chimp', 'monkey', 'ape'], displayOrder: 1 },
          { id: 'ph_53_q1_a2', text: 'Bottlenose Dolphin', points: 30, acceptedVariants: ['dolphin', 'bottlenose dolphin'], displayOrder: 2 },
          { id: 'ph_53_q1_a3', text: 'Elephant', points: 16, acceptedVariants: ['elephant'], displayOrder: 3 },
          { id: 'ph_53_q1_a4', text: 'Dog', points: 10, acceptedVariants: ['dog', 'canine'], displayOrder: 4 },
          { id: 'ph_53_q1_a5', text: 'Octopus', points: 8, acceptedVariants: ['octopus'], displayOrder: 5 },
        ],
      },
      {
        id: 'ph_53_q2',
        prompt: 'Name a ferocious predator you would never want to meet face-to-face in the wild.',
        category: 'Animals & Nature',
        answers: [
          { id: 'ph_53_q2_a1', text: 'Lion', points: 35, acceptedVariants: ['lion'], displayOrder: 1 },
          { id: 'ph_53_q2_a2', text: 'Bengal Tiger', points: 26, acceptedVariants: ['tiger', 'bengal tiger'], displayOrder: 2 },
          { id: 'ph_53_q2_a3', text: 'Grizzly Bear / Polar Bear', points: 18, acceptedVariants: ['bear', 'grizzly bear', 'polar bear'], displayOrder: 3 },
          { id: 'ph_53_q2_a4', text: 'Saltwater Crocodile / Alligator', points: 13, acceptedVariants: ['crocodile', 'alligator', 'croc', 'buwaya'], displayOrder: 4 },
          { id: 'ph_53_q2_a5', text: 'Great White Shark', points: 8, acceptedVariants: ['shark', 'great white shark', 'pating'], displayOrder: 5 },
        ],
      },
      {
        id: 'ph_53_q3',
        prompt: 'Name the most common companion pet that families love keeping at home.',
        category: 'Animals & Nature',
        answers: [
          { id: 'ph_53_q3_a1', text: 'Dog (Man\'s best friend)', points: 46, acceptedVariants: ['dog', 'puppy', 'aso'], displayOrder: 1 },
          { id: 'ph_53_q3_a2', text: 'Cat', points: 32, acceptedVariants: ['cat', 'kitten', 'pusa'], displayOrder: 2 },
          { id: 'ph_53_q3_a3', text: 'Aquarium fish / Goldfish', points: 11, acceptedVariants: ['fish', 'goldfish', 'aquarium fish', 'isda'], displayOrder: 3 },
          { id: 'ph_53_q3_a4', text: 'Pet bird / Parrot', points: 7, acceptedVariants: ['bird', 'parrot', 'parakeet', 'ibon'], displayOrder: 4 },
          { id: 'ph_53_q3_a5', text: 'Hamster / Rabbit', points: 4, acceptedVariants: ['hamster', 'guinea pig', 'rabbit'], displayOrder: 5 },
        ],
      },
      {
        id: 'ph_53_q4',
        prompt: 'Name an animal universally famous for moving at an extremely slow pace.',
        category: 'Animals & Nature',
        answers: [
          { id: 'ph_53_q4_a1', text: 'Three-toed Sloth', points: 45, acceptedVariants: ['sloth', 'three-toed sloth'], displayOrder: 1 },
          { id: 'ph_53_q4_a2', text: 'Garden Snail', points: 28, acceptedVariants: ['snail', 'slug', 'suso'], displayOrder: 2 },
          { id: 'ph_53_q4_a3', text: 'Giant Tortoise / Turtle', points: 18, acceptedVariants: ['turtle', 'tortoise', 'pagong'], displayOrder: 3 },
          { id: 'ph_53_q4_a4', text: 'Koala', points: 9, acceptedVariants: ['koala', 'koala bear'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_53_q5',
        prompt: 'Name a nocturnal animal that sleeps through the day and wakes up at night to hunt.',
        category: 'Animals & Nature',
        answers: [
          { id: 'ph_53_q5_a1', text: 'Bat', points: 40, acceptedVariants: ['bat', 'bats', 'paniki'], displayOrder: 1 },
          { id: 'ph_53_q5_a2', text: 'Owl', points: 32, acceptedVariants: ['owl', 'owls', 'kuwago'], displayOrder: 2 },
          { id: 'ph_53_q5_a3', text: 'Raccoon', points: 14, acceptedVariants: ['raccoon'], displayOrder: 3 },
          { id: 'ph_53_q5_a4', text: 'Wolf', points: 8, acceptedVariants: ['wolf', 'wolves'], displayOrder: 4 },
          { id: 'ph_53_q5_a5', text: 'Hedgehog', points: 6, acceptedVariants: ['hedgehog'], displayOrder: 5 },
        ],
      },
    ],
  },

  // PACK 54 (Pack 5): Street Food Battle
  {
    id: 'pack_ph_54',
    title: 'Street Food Battle',
    description: 'Sizzling grills, hot cauldrons, skewers, and street carts serving the best quick bites in the Philippines and around the world.',
    category: 'Street Food',
    isBuiltIn: true,
    createdAt: '2026-11-06T00:00:00.000Z',
    updatedAt: '2026-11-06T00:00:00.000Z',
    questions: [
      {
        id: 'ph_54_q1',
        prompt: 'Name the most popular skewer or tusok-tusok food sold at street corners across the Philippines.',
        category: 'Street Food',
        answers: [
          { id: 'ph_54_q1_a1', text: 'Fishball', points: 40, acceptedVariants: ['fishball', 'fish ball'], displayOrder: 1 },
          { id: 'ph_54_q1_a2', text: 'Kwek-kwek (Fried battered quail eggs)', points: 28, acceptedVariants: ['kwek kwek', 'kwek-kwek', 'tokneneng'], displayOrder: 2 },
          { id: 'ph_54_q1_a3', text: 'Kikiam', points: 16, acceptedVariants: ['kikiam', 'quekiam'], displayOrder: 3 },
          { id: 'ph_54_q1_a4', text: 'Squidball', points: 10, acceptedVariants: ['squidball', 'squid ball'], displayOrder: 4 },
          { id: 'ph_54_q1_a5', text: 'Calamares (Fried battered squid rings)', points: 6, acceptedVariants: ['calamares', 'squid rings'], displayOrder: 5 },
        ],
      },
      {
        id: 'ph_54_q2',
        prompt: 'Name a classic grilled Filipino street food favorite (Inihaw sa kanto).',
        category: 'Street Food',
        answers: [
          { id: 'ph_54_q2_a1', text: 'Pork Barbecue on a skewer', points: 38, acceptedVariants: ['pork bbq', 'barbecue', 'bbq', 'inihaw na baboy'], displayOrder: 1 },
          { id: 'ph_54_q2_a2', text: 'Isaw (Grilled chicken or pork intestines)', points: 30, acceptedVariants: ['isaw', 'isaw ng manok', 'isaw baboy'], displayOrder: 2 },
          { id: 'ph_54_q2_a3', text: 'Betamax (Grilled coagulated blood cubes)', points: 14, acceptedVariants: ['betamax', 'dugo', 'inihaw na dugo'], displayOrder: 3 },
          { id: 'ph_54_q2_a4', text: 'Helmet (Grilled chicken head)', points: 10, acceptedVariants: ['helmet', 'ulo ng manok'], displayOrder: 4 },
          { id: 'ph_54_q2_a5', text: 'Adidas (Grilled chicken feet)', points: 8, acceptedVariants: ['adidas', 'paa ng manok'], displayOrder: 5 },
        ],
      },
      {
        id: 'ph_54_q3',
        prompt: 'Name an iconic street food from around the world that is loved internationally.',
        category: 'Street Food',
        answers: [
          { id: 'ph_54_q3_a1', text: 'Hot Dog / Sausage in a bun (USA)', points: 35, acceptedVariants: ['hot dog', 'hotdog', 'american hot dog'], displayOrder: 1 },
          { id: 'ph_54_q3_a2', text: 'Street Tacos (Mexico)', points: 26, acceptedVariants: ['tacos', 'taco', 'mexican tacos'], displayOrder: 2 },
          { id: 'ph_54_q3_a3', text: 'Shawarma / Doner Kebab (Middle East)', points: 18, acceptedVariants: ['shawarma', 'kebab', 'doner kebab'], displayOrder: 3 },
          { id: 'ph_54_q3_a4', text: 'Takoyaki (Japanese octopus balls)', points: 12, acceptedVariants: ['takoyaki', 'japanese takoyaki'], displayOrder: 4 },
          { id: 'ph_54_q3_a5', text: 'Churros with chocolate dip (Spain)', points: 9, acceptedVariants: ['churros', 'spanish churros'], displayOrder: 5 },
        ],
      },
      {
        id: 'ph_54_q4',
        prompt: 'Name a sweet Filipino street snack sold fresh by walking vendors.',
        category: 'Street Food',
        answers: [
          { id: 'ph_54_q4_a1', text: 'Hot Taho with sweet arnibal and sago pearls', points: 42, acceptedVariants: ['taho', 'hot taho'], displayOrder: 1 },
          { id: 'ph_54_q4_a2', text: 'Turon / Banana Cue', points: 28, acceptedVariants: ['turon', 'banana cue', 'bananacue'], displayOrder: 2 },
          { id: 'ph_54_q4_a3', text: 'Sorbetes (Dirty Ice Cream in a cone or bun)', points: 16, acceptedVariants: ['dirty ice cream', 'sorbetes', 'sorbetes ice cream'], displayOrder: 3 },
          { id: 'ph_54_q4_a4', text: 'Fresh Buko juice straight from the coconut', points: 14, acceptedVariants: ['buko juice', 'buko', 'coconut water'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_54_q5',
        prompt: 'What dipping sauce do street food lovers always reach for at the cart?',
        category: 'Street Food',
        answers: [
          { id: 'ph_54_q5_a1', text: 'Manong\'s sweet and savory brown sauce', points: 45, acceptedVariants: ['sweet and sour sauce', 'manongs sauce', 'brown sauce', 'sawsawan'], displayOrder: 1 },
          { id: 'ph_54_q5_a2', text: 'Spicy vinegar with chili, garlic, and onions', points: 32, acceptedVariants: ['vinegar', 'suka', 'spicy vinegar', 'suka with chili'], displayOrder: 2 },
          { id: 'ph_54_q5_a3', text: 'Sweet chili sauce', points: 14, acceptedVariants: ['sweet chili', 'sweet chili sauce', 'chili sauce'], displayOrder: 3 },
          { id: 'ph_54_q5_a4', text: 'Rich brown gravy', points: 9, acceptedVariants: ['gravy', 'sweet gravy'], displayOrder: 4 },
        ],
      },
    ],
  },

  // PACK 55 (Pack 6): Around the Philippines
  {
    id: 'pack_ph_55',
    title: 'Around the Philippines',
    description: 'White-sand beaches, rolling chocolate hills, cool highlands, and regional culinary treasures.',
    category: 'Travel & Philippines',
    isBuiltIn: true,
    createdAt: '2026-11-06T00:00:00.000Z',
    updatedAt: '2026-11-06T00:00:00.000Z',
    questions: [
      {
        id: 'ph_55_q1',
        prompt: 'Name one of the most famous tourist beach destinations in the Philippines.',
        category: 'Travel & Philippines',
        answers: [
          { id: 'ph_55_q1_a1', text: 'Boracay Island (White Beach)', points: 45, acceptedVariants: ['boracay', 'boracay island', 'white beach'], displayOrder: 1 },
          { id: 'ph_55_q1_a2', text: 'Palawan (El Nido & Coron)', points: 30, acceptedVariants: ['palawan', 'el nido', 'coron', 'puerto princesa'], displayOrder: 2 },
          { id: 'ph_55_q1_a3', text: 'Siargao Island (Cloud 9)', points: 14, acceptedVariants: ['siargao', 'siargao island', 'cloud 9'], displayOrder: 3 },
          { id: 'ph_55_q1_a4', text: 'Bohol (Panglao Island)', points: 7, acceptedVariants: ['bohol', 'panglao', 'panglao island'], displayOrder: 4 },
          { id: 'ph_55_q1_a5', text: 'Cebu (Bantayan & Malapascua)', points: 4, acceptedVariants: ['cebu', 'bantayan', 'mactan'], displayOrder: 5 },
        ],
      },
      {
        id: 'ph_55_q2',
        prompt: 'Name a Philippine highland getaway famous for chilly mountain weather.',
        category: 'Travel & Philippines',
        answers: [
          { id: 'ph_55_q2_a1', text: 'Baguio City (Summer Capital)', points: 48, acceptedVariants: ['baguio', 'baguio city', 'benguet'], displayOrder: 1 },
          { id: 'ph_55_q2_a2', text: 'Tagaytay City (Overlooking Taal Lake)', points: 32, acceptedVariants: ['tagaytay', 'tagaytay city', 'cavite'], displayOrder: 2 },
          { id: 'ph_55_q2_a3', text: 'Bukidnon (Dahilayan Adventure Park)', points: 12, acceptedVariants: ['bukidnon', 'dahilyan'], displayOrder: 3 },
          { id: 'ph_55_q2_a4', text: 'Sagada (Mountain Province)', points: 8, acceptedVariants: ['sagada', 'mountain province'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_55_q3',
        prompt: 'Name a world-famous natural landmark located in the Philippines.',
        category: 'Travel & Philippines',
        answers: [
          { id: 'ph_55_q3_a1', text: 'Mayon Volcano (Famous for its perfect cone shape)', points: 38, acceptedVariants: ['mayon volcano', 'mayon', 'bulkang mayon', 'albay'], displayOrder: 1 },
          { id: 'ph_55_q3_a2', text: 'Chocolate Hills in Bohol', points: 28, acceptedVariants: ['chocolate hills', 'bohol chocolate hills'], displayOrder: 2 },
          { id: 'ph_55_q3_a3', text: 'Puerto Princesa Underground River', points: 18, acceptedVariants: ['underground river', 'subterranean river', 'palawan underground river'], displayOrder: 3 },
          { id: 'ph_55_q3_a4', text: 'Banaue Rice Terraces', points: 11, acceptedVariants: ['rice terraces', 'banaue', 'banaue rice terraces'], displayOrder: 4 },
          { id: 'ph_55_q3_a5', text: 'Taal Volcano and Lake', points: 5, acceptedVariants: ['taal volcano', 'taal', 'bulkang taal'], displayOrder: 5 },
        ],
      },
      {
        id: 'ph_55_q4',
        prompt: 'Name a popular food souvenir (pasalubong) travelers bring home from Philippine travels.',
        category: 'Travel & Philippines',
        answers: [
          { id: 'ph_55_q4_a1', text: 'Dried Mangoes (Cebu)', points: 35, acceptedVariants: ['dried mangoes', 'cebu dried mango', 'mangga'], displayOrder: 1 },
          { id: 'ph_55_q4_a2', text: 'Good Shepherd Ube Jam (Baguio)', points: 27, acceptedVariants: ['ube jam', 'good shepherd', 'ube baguio'], displayOrder: 2 },
          { id: 'ph_55_q4_a3', text: 'Piaya and Biscocho (Bacolod / Iloilo)', points: 18, acceptedVariants: ['piaya', 'biscocho', 'barquillos'], displayOrder: 3 },
          { id: 'ph_55_q4_a4', text: 'Pili Nuts and Candies (Bicol)', points: 12, acceptedVariants: ['pili nuts', 'pili', 'bicol pili'], displayOrder: 4 },
          { id: 'ph_55_q4_a5', text: 'Fresh Strawberries & Strawberry Jam', points: 8, acceptedVariants: ['strawberry', 'strawberry jam', 'strawberries'], displayOrder: 5 },
        ],
      },
      {
        id: 'ph_55_q5',
        prompt: 'Name an exciting outdoor adventure activity that tourists love experiencing in the Philippines.',
        category: 'Travel & Philippines',
        answers: [
          { id: 'ph_55_q5_a1', text: 'Island hopping by motorized banca boat', points: 40, acceptedVariants: ['island hopping', 'boat tour'], displayOrder: 1 },
          { id: 'ph_55_q5_a2', text: 'Scuba diving or snorkeling with sea turtles', points: 28, acceptedVariants: ['scuba diving', 'snorkeling', 'diving'], displayOrder: 2 },
          { id: 'ph_55_q5_a3', text: 'Surfing the famous ocean breaks', points: 18, acceptedVariants: ['surfing', 'surf', 'cloud 9'], displayOrder: 3 },
          { id: 'ph_55_q5_a4', text: 'Canyoneering and cliff-jumping at waterfalls', points: 14, acceptedVariants: ['canyoneering', 'kawasan falls', 'cliff diving'], displayOrder: 4 },
        ],
      },
    ],
  },

  // PACK 56 (Pack 7): Superpower Showdown
  {
    id: 'pack_ph_56',
    title: 'Superpower Showdown',
    description: 'Flight, super strength, invisibility, and telepathy: extraordinary superhuman powers and superhero lore.',
    category: 'Superpowers',
    isBuiltIn: true,
    createdAt: '2026-11-06T00:00:00.000Z',
    updatedAt: '2026-11-06T00:00:00.000Z',
    questions: [
      {
        id: 'ph_56_q1',
        prompt: 'If you could choose only one superpower to possess forever, which one would it be?',
        category: 'Superpowers',
        answers: [
          { id: 'ph_56_q1_a1', text: 'Flight / Ability to fly through the sky', points: 35, acceptedVariants: ['flight', 'flying', 'ability to fly'], displayOrder: 1 },
          { id: 'ph_56_q1_a2', text: 'Teleportation / Instant travel anywhere', points: 28, acceptedVariants: ['teleportation', 'teleport', 'instant travel'], displayOrder: 2 },
          { id: 'ph_56_q1_a3', text: 'Invisibility / Becoming completely unseen', points: 18, acceptedVariants: ['invisibility', 'invisible', 'turning invisible'], displayOrder: 3 },
          { id: 'ph_56_q1_a4', text: 'Superhuman strength', points: 11, acceptedVariants: ['super strength', 'strength', 'strong'], displayOrder: 4 },
          { id: 'ph_56_q1_a5', text: 'Time manipulation / Time travel', points: 8, acceptedVariants: ['time travel', 'stopping time', 'time manipulation'], displayOrder: 5 },
        ],
      },
      {
        id: 'ph_56_q2',
        prompt: 'Name a situation in everyday life where being invisible would be very helpful.',
        category: 'Superpowers',
        answers: [
          { id: 'ph_56_q2_a1', text: 'Sneaking away from awkward social interactions or small talk', points: 38, acceptedVariants: ['avoiding people', 'sneaking away', 'leaving conversations', 'hiding from people'], displayOrder: 1 },
          { id: 'ph_56_q2_a2', text: 'Eavesdropping on private conversations or hearing juicy gossip', points: 27, acceptedVariants: ['eavesdropping', 'listening to secrets', 'spying', 'chismis'], displayOrder: 2 },
          { id: 'ph_56_q2_a3', text: 'Sneaking into sold-out concerts or movies for free', points: 18, acceptedVariants: ['free movies', 'sneaking into concerts', 'free entry'], displayOrder: 3 },
          { id: 'ph_56_q2_a4', text: 'Avoiding household chores and work assignments', points: 11, acceptedVariants: ['avoiding chores', 'skipping work', 'escape errands'], displayOrder: 4 },
          { id: 'ph_56_q2_a5', text: 'Pulling harmless spooky pranks on friends', points: 6, acceptedVariants: ['pranks', 'scaring friends', 'joking'], displayOrder: 5 },
        ],
      },
      {
        id: 'ph_56_q3',
        prompt: 'Name a classic comic book superhero famous for having immense physical strength.',
        category: 'Superpowers',
        answers: [
          { id: 'ph_56_q3_a1', text: 'Superman (Man of Steel)', points: 40, acceptedVariants: ['superman', 'clark kent'], displayOrder: 1 },
          { id: 'ph_56_q3_a2', text: 'The Incredible Hulk', points: 32, acceptedVariants: ['hulk', 'the incredible hulk', 'bruce banner'], displayOrder: 2 },
          { id: 'ph_56_q3_a3', text: 'Thor (God of Thunder)', points: 14, acceptedVariants: ['thor'], displayOrder: 3 },
          { id: 'ph_56_q3_a4', text: 'Captain America', points: 8, acceptedVariants: ['captain america', 'steve rogers'], displayOrder: 4 },
          { id: 'ph_56_q3_a5', text: 'Wonder Woman', points: 6, acceptedVariants: ['wonder woman', 'diana prince'], displayOrder: 5 },
        ],
      },
      {
        id: 'ph_56_q4',
        prompt: 'Name a superpower that would make somebody wealthy in no time.',
        category: 'Superpowers',
        answers: [
          { id: 'ph_56_q4_a1', text: 'Telepathy / Mind reading (knowing everyone\'s thoughts)', points: 36, acceptedVariants: ['mind reading', 'telepathy', 'reading minds'], displayOrder: 1 },
          { id: 'ph_56_q4_a2', text: 'Precognition / Seeing the future (lottery & stock picks)', points: 30, acceptedVariants: ['seeing the future', 'predicting future', 'fortune telling', 'future sight'], displayOrder: 2 },
          { id: 'ph_56_q4_a3', text: 'Midas touch (Turning ordinary objects into solid gold)', points: 20, acceptedVariants: ['midas touch', 'turning things to gold', 'gold touch'], displayOrder: 3 },
          { id: 'ph_56_q4_a4', text: 'Super genius intelligence', points: 14, acceptedVariants: ['super intelligence', 'genius', 'super smart'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_56_q5',
        prompt: 'Name an iconic superhero suit or piece of high-tech gear fans wish existed in real life.',
        category: 'Superpowers',
        answers: [
          { id: 'ph_56_q5_a1', text: 'Iron Man\'s powered armor suit with flight thrusters', points: 38, acceptedVariants: ['iron man suit', 'iron man armor', 'jarvis'], displayOrder: 1 },
          { id: 'ph_56_q5_a2', text: 'The Batmobile (Batman\'s armored vehicle)', points: 28, acceptedVariants: ['batmobile', 'bat car'], displayOrder: 2 },
          { id: 'ph_56_q5_a3', text: 'Spider-Man\'s wrist web-shooters', points: 18, acceptedVariants: ['web shooters', 'spiderman webs', 'web shooter'], displayOrder: 3 },
          { id: 'ph_56_q5_a4', text: 'Thor\'s magical hammer Mjolnir', points: 10, acceptedVariants: ['mjolnir', 'thors hammer', 'hammer'], displayOrder: 4 },
          { id: 'ph_56_q5_a5', text: 'Captain America\'s indestructible Vibranium shield', points: 6, acceptedVariants: ['shield', 'captain america shield', 'vibranium shield'], displayOrder: 5 },
        ],
      },
    ],
  },

  // PACK 57 (Pack 8): Movie Mania
  {
    id: 'pack_ph_57',
    title: 'Movie Mania',
    description: 'Cinema blockbusters, classic genres, iconic silver-screen villains, and movie theater traditions.',
    category: 'Cinema & Movies',
    isBuiltIn: true,
    createdAt: '2026-11-06T00:00:00.000Z',
    updatedAt: '2026-11-06T00:00:00.000Z',
    questions: [
      {
        id: 'ph_57_q1',
        prompt: 'Name one of the most successful and beloved movie franchises in cinematic history.',
        category: 'Cinema & Movies',
        answers: [
          { id: 'ph_57_q1_a1', text: 'Marvel Cinematic Universe (Avengers)', points: 36, acceptedVariants: ['marvel', 'avengers', 'mcu'], displayOrder: 1 },
          { id: 'ph_57_q1_a2', text: 'Star Wars', points: 26, acceptedVariants: ['star wars'], displayOrder: 2 },
          { id: 'ph_57_q1_a3', text: 'Harry Potter', points: 18, acceptedVariants: ['harry potter', 'wizarding world'], displayOrder: 3 },
          { id: 'ph_57_q1_a4', text: 'Fast & Furious', points: 12, acceptedVariants: ['fast and furious', 'fast & furious'], displayOrder: 4 },
          { id: 'ph_57_q1_a5', text: 'Jurassic Park / Jurassic World', points: 8, acceptedVariants: ['jurassic park', 'jurassic world', 'dinosaurs'], displayOrder: 5 },
        ],
      },
      {
        id: 'ph_57_q2',
        prompt: 'Name a popular film genre people pick for an exciting movie night.',
        category: 'Cinema & Movies',
        answers: [
          { id: 'ph_57_q2_a1', text: 'Action & Adventure', points: 35, acceptedVariants: ['action', 'adventure', 'action movies'], displayOrder: 1 },
          { id: 'ph_57_q2_a2', text: 'Comedy', points: 26, acceptedVariants: ['comedy', 'funny movies'], displayOrder: 2 },
          { id: 'ph_57_q2_a3', text: 'Horror / Psychological Thriller', points: 20, acceptedVariants: ['horror', 'thriller', 'scary movies'], displayOrder: 3 },
          { id: 'ph_57_q2_a4', text: 'Romantic Comedy / Romance', points: 12, acceptedVariants: ['romance', 'rom com', 'romantic comedy'], displayOrder: 4 },
          { id: 'ph_57_q2_a5', text: 'Sci-Fi / Fantasy', points: 7, acceptedVariants: ['sci-fi', 'science fiction', 'scifi'], displayOrder: 5 },
        ],
      },
      {
        id: 'ph_57_q3',
        prompt: 'Name something you must always buy at the cinema concession stand.',
        category: 'Cinema & Movies',
        answers: [
          { id: 'ph_57_q3_a1', text: 'Bucket of popcorn (Butter, Cheese, Caramel)', points: 50, acceptedVariants: ['popcorn', 'cheese popcorn', 'butter popcorn'], displayOrder: 1 },
          { id: 'ph_57_q3_a2', text: 'Large fountain soda / Softdrinks', points: 25, acceptedVariants: ['soda', 'softdrinks', 'coke', 'drink'], displayOrder: 2 },
          { id: 'ph_57_q3_a3', text: 'Hotdog / Corndog sandwich', points: 12, acceptedVariants: ['hotdog', 'corndog'], displayOrder: 3 },
          { id: 'ph_57_q3_a4', text: 'Nachos with warm cheese sauce', points: 8, acceptedVariants: ['nachos', 'nachos cheese'], displayOrder: 4 },
          { id: 'ph_57_q3_a5', text: 'Pack of candy or chocolate bites', points: 5, acceptedVariants: ['candy', 'chocolate', 'm&ms'], displayOrder: 5 },
        ],
      },
      {
        id: 'ph_57_q4',
        prompt: 'Name an iconic fictional movie villain that audiences find fascinating.',
        category: 'Cinema & Movies',
        answers: [
          { id: 'ph_57_q4_a1', text: 'Darth Vader (Star Wars)', points: 38, acceptedVariants: ['darth vader', 'vader'], displayOrder: 1 },
          { id: 'ph_57_q4_a2', text: 'The Joker (Batman series)', points: 30, acceptedVariants: ['the joker', 'joker'], displayOrder: 2 },
          { id: 'ph_57_q4_a3', text: 'Thanos (Marvel Avengers)', points: 18, acceptedVariants: ['thanos'], displayOrder: 3 },
          { id: 'ph_57_q4_a4', text: 'Lord Voldemort (Harry Potter)', points: 14, acceptedVariants: ['voldemort', 'lord voldemort'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_57_q5',
        prompt: 'Name an annoying behavior in a movie theater that ruins the viewing experience.',
        category: 'Cinema & Movies',
        answers: [
          { id: 'ph_57_q5_a1', text: 'Talking loudly or spoiling upcoming scenes', points: 40, acceptedVariants: ['talking loudly', 'talking', 'whispering loud', 'chatting'], displayOrder: 1 },
          { id: 'ph_57_q5_a2', text: 'Checking bright phone screens or answering calls', points: 30, acceptedVariants: ['cellphone on', 'phone screen', 'bright screen', 'texting', 'phone ringing'], displayOrder: 2 },
          { id: 'ph_57_q5_a3', text: 'Kicking the back of someone\'s seat', points: 16, acceptedVariants: ['kicking seat', 'seat kicking'], displayOrder: 3 },
          { id: 'ph_57_q5_a4', text: 'Noisy chewing and crinkling chip wrappers', points: 14, acceptedVariants: ['loud chewing', 'crinkling wrappers', 'noisy eating'], displayOrder: 4 },
        ],
      },
    ],
  },

  // PACK 58 (Pack 9): Ocean Adventures
  {
    id: 'pack_ph_58',
    title: 'Ocean Adventures',
    description: 'The deep blue sea: magnificent sea creatures, vibrant coral reefs, sunken treasures, and marine exploration.',
    category: 'Ocean & Marine',
    isBuiltIn: true,
    createdAt: '2026-11-06T00:00:00.000Z',
    updatedAt: '2026-11-06T00:00:00.000Z',
    questions: [
      {
        id: 'ph_58_q1',
        prompt: 'Name a sea creature that swimmers are most terrified of seeing in open ocean water.',
        category: 'Ocean & Marine',
        answers: [
          { id: 'ph_58_q1_a1', text: 'Shark (Great White Shark)', points: 46, acceptedVariants: ['shark', 'great white', 'pating'], displayOrder: 1 },
          { id: 'ph_58_q1_a2', text: 'Jellyfish (Stinging Box Jellyfish)', points: 28, acceptedVariants: ['jellyfish', 'box jellyfish', 'dikya'], displayOrder: 2 },
          { id: 'ph_58_q1_a3', text: 'Stingray', points: 12, acceptedVariants: ['stingray', 'manta ray', 'pagi'], displayOrder: 3 },
          { id: 'ph_58_q1_a4', text: 'Venomous Sea Snake', points: 8, acceptedVariants: ['sea snake', 'poisonous sea snake'], displayOrder: 4 },
          { id: 'ph_58_q1_a5', text: 'Moray Eel hiding in rocks', points: 6, acceptedVariants: ['eel', 'moray eel'], displayOrder: 5 },
        ],
      },
      {
        id: 'ph_58_q2',
        prompt: 'Name one of the largest animals roaming the world\'s oceans.',
        category: 'Ocean & Marine',
        answers: [
          { id: 'ph_58_q2_a1', text: 'Blue Whale (Largest animal on Earth)', points: 45, acceptedVariants: ['blue whale', 'whale', 'baleen whale'], displayOrder: 1 },
          { id: 'ph_58_q2_a2', text: 'Whale Shark / Butanding', points: 26, acceptedVariants: ['whale shark', 'butanding'], displayOrder: 2 },
          { id: 'ph_58_q2_a3', text: 'Giant Squid / Colossal Squid', points: 16, acceptedVariants: ['giant squid', 'colossal squid'], displayOrder: 3 },
          { id: 'ph_58_q2_a4', text: 'Orca (Killer Whale)', points: 13, acceptedVariants: ['orca', 'killer whale'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_58_q3',
        prompt: 'Name something deep-sea explorers and treasure hunters dream of finding on the ocean floor.',
        category: 'Ocean & Marine',
        answers: [
          { id: 'ph_58_q3_a1', text: 'Sunken pirate treasure and chests of gold', points: 40, acceptedVariants: ['sunken treasure', 'treasure', 'gold', 'pirate treasure'], displayOrder: 1 },
          { id: 'ph_58_q3_a2', text: 'Historic shipwrecks (e.g., Titanic)', points: 30, acceptedVariants: ['shipwreck', 'sunken ship', 'titanic'], displayOrder: 2 },
          { id: 'ph_58_q3_a3', text: 'Lost sunken civilizations (like Atlantis)', points: 16, acceptedVariants: ['atlantis', 'lost city', 'ruins'], displayOrder: 3 },
          { id: 'ph_58_q3_a4', text: 'Previously undiscovered deep-sea creatures', points: 14, acceptedVariants: ['new species', 'glowing creatures', 'unknown animals'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_58_q4',
        prompt: 'Name a colorful marine creature you can easily spot while snorkeling over a coral reef.',
        category: 'Ocean & Marine',
        answers: [
          { id: 'ph_58_q4_a1', text: 'Clownfish (Finding Nemo)', points: 42, acceptedVariants: ['clownfish', 'nemo'], displayOrder: 1 },
          { id: 'ph_58_q4_a2', text: 'Sea Turtle / Pawikan', points: 28, acceptedVariants: ['sea turtle', 'turtle', 'pawikan'], displayOrder: 2 },
          { id: 'ph_58_q4_a3', text: 'Starfish / Sea star', points: 16, acceptedVariants: ['starfish', 'sea star'], displayOrder: 3 },
          { id: 'ph_58_q4_a4', text: 'Seahorse', points: 8, acceptedVariants: ['seahorse'], displayOrder: 4 },
          { id: 'ph_58_q4_a5', text: 'Angelfish / Butterflyfish', points: 6, acceptedVariants: ['angelfish', 'butterflyfish', 'reef fish'], displayOrder: 5 },
        ],
      },
      {
        id: 'ph_58_q5',
        prompt: 'What piece of gear is most essential for anyone embarking on an underwater dive?',
        category: 'Ocean & Marine',
        answers: [
          { id: 'ph_58_q5_a1', text: 'Scuba tank with compressed oxygen', points: 42, acceptedVariants: ['oxygen tank', 'scuba gear', 'breathing apparatus'], displayOrder: 1 },
          { id: 'ph_58_q5_a2', text: 'Diving mask and snorkel', points: 28, acceptedVariants: ['diving mask', 'goggles', 'mask'], displayOrder: 2 },
          { id: 'ph_58_q5_a3', text: 'Swim fins / Flippers for swimming power', points: 16, acceptedVariants: ['fins', 'flippers', 'swim fins'], displayOrder: 3 },
          { id: 'ph_58_q5_a4', text: 'Insulating neoprene wetsuit', points: 14, acceptedVariants: ['wetsuit', 'diving suit'], displayOrder: 4 },
        ],
      },
    ],
  },

  // PACK 59 (Pack 10): Video Game Legends
  {
    id: 'pack_ph_59',
    title: 'Video Game Legends',
    description: 'Iconic gaming heroes, record-breaking multiplayer titles, top consoles, and gamer culture.',
    category: 'Gaming & Video Games',
    isBuiltIn: true,
    createdAt: '2026-11-06T00:00:00.000Z',
    updatedAt: '2026-11-06T00:00:00.000Z',
    questions: [
      {
        id: 'ph_59_q1',
        prompt: 'Name one of the most recognizable video game characters in history.',
        category: 'Gaming & Video Games',
        answers: [
          { id: 'ph_59_q1_a1', text: 'Mario (Super Mario Bros.)', points: 44, acceptedVariants: ['mario', 'super mario'], displayOrder: 1 },
          { id: 'ph_59_q1_a2', text: 'Pikachu (Pokémon)', points: 24, acceptedVariants: ['pikachu', 'pokemon'], displayOrder: 2 },
          { id: 'ph_59_q1_a3', text: 'Sonic the Hedgehog', points: 16, acceptedVariants: ['sonic', 'sonic the hedgehog'], displayOrder: 3 },
          { id: 'ph_59_q1_a4', text: 'Pac-Man', points: 10, acceptedVariants: ['pacman', 'pac-man'], displayOrder: 4 },
          { id: 'ph_59_q1_a5', text: 'Link (The Legend of Zelda)', points: 6, acceptedVariants: ['link', 'zelda'], displayOrder: 5 },
        ],
      },
      {
        id: 'ph_59_q2',
        prompt: 'Name a wildly popular video game that players sink hundreds of hours into.',
        category: 'Gaming & Video Games',
        answers: [
          { id: 'ph_59_q2_a1', text: 'Minecraft', points: 36, acceptedVariants: ['minecraft'], displayOrder: 1 },
          { id: 'ph_59_q2_a2', text: 'Grand Theft Auto (GTA V)', points: 26, acceptedVariants: ['gta', 'grand theft auto', 'gta v'], displayOrder: 2 },
          { id: 'ph_59_q2_a3', text: 'Roblox', points: 18, acceptedVariants: ['roblox'], displayOrder: 3 },
          { id: 'ph_59_q2_a4', text: 'Mobile Legends: Bang Bang (MLBB)', points: 12, acceptedVariants: ['mobile legends', 'ml', 'mlbb'], displayOrder: 4 },
          { id: 'ph_59_q2_a5', text: 'Fortnite', points: 8, acceptedVariants: ['fortnite'], displayOrder: 5 },
        ],
      },
      {
        id: 'ph_59_q3',
        prompt: 'Name a major video game console brand that gamers proudly own.',
        category: 'Gaming & Video Games',
        answers: [
          { id: 'ph_59_q3_a1', text: 'Sony PlayStation (PS4 / PS5)', points: 45, acceptedVariants: ['playstation', 'ps5', 'ps4', 'sony'], displayOrder: 1 },
          { id: 'ph_59_q3_a2', text: 'Nintendo (Switch)', points: 30, acceptedVariants: ['nintendo', 'switch', 'nintendo switch'], displayOrder: 2 },
          { id: 'ph_59_q3_a3', text: 'Microsoft Xbox (Series X)', points: 16, acceptedVariants: ['xbox', 'xbox series', 'microsoft'], displayOrder: 3 },
          { id: 'ph_59_q3_a4', text: 'PC / Custom Gaming Rig', points: 9, acceptedVariants: ['pc', 'gaming pc', 'computer'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_59_q4',
        prompt: 'Name an iconic power-up item from the Super Mario video game series.',
        category: 'Gaming & Video Games',
        answers: [
          { id: 'ph_59_q4_a1', text: 'Super Mushroom (Grows Mario into Super Mario)', points: 42, acceptedVariants: ['mushroom', 'super mushroom', 'red mushroom'], displayOrder: 1 },
          { id: 'ph_59_q4_a2', text: 'Fire Flower (Grants ability to throw fireballs)', points: 26, acceptedVariants: ['fire flower', 'flower'], displayOrder: 2 },
          { id: 'ph_59_q4_a3', text: 'Super Star (Invincibility music power)', points: 20, acceptedVariants: ['star', 'super star', 'invincible star'], displayOrder: 3 },
          { id: 'ph_59_q4_a4', text: '1-Up Green Mushroom (Extra life)', points: 12, acceptedVariants: ['1up', 'green mushroom', 'extra life'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_59_q5',
        prompt: 'Name something that triggers gamers into full rage during an online match.',
        category: 'Gaming & Video Games',
        answers: [
          { id: 'ph_59_q5_a1', text: 'High ping, lag spikes, and sudden internet disconnection', points: 44, acceptedVariants: ['lag', 'high ping', 'delay', 'disconnect'], displayOrder: 1 },
          { id: 'ph_59_q5_a2', text: 'Facing cheaters, aimbots, and hackers', points: 26, acceptedVariants: ['cheaters', 'hackers', 'hacks'], displayOrder: 2 },
          { id: 'ph_59_q5_a3', text: 'Toxic, uncooperative, or trolling teammates', points: 18, acceptedVariants: ['toxic teammates', 'feeding', 'trolls'], displayOrder: 3 },
          { id: 'ph_59_q5_a4', text: 'Losing hours of progress due to unsaved crashes', points: 12, acceptedVariants: ['not saving', 'lost save', 'game crash'], displayOrder: 4 },
        ],
      },
    ],
  },

  // PACK 60 (Pack 11): Things That Scare Us
  {
    id: 'pack_ph_60',
    title: 'Things That Scare Us',
    description: 'Common phobias, creepy-crawlies, midnight spooky sounds, haunted folklore, and horror movie jump-scares.',
    category: 'Horror & Fears',
    isBuiltIn: true,
    createdAt: '2026-11-06T00:00:00.000Z',
    updatedAt: '2026-11-06T00:00:00.000Z',
    questions: [
      {
        id: 'ph_60_q1',
        prompt: 'Name a common phobia or fear that many ordinary people suffer from.',
        category: 'Horror & Fears',
        answers: [
          { id: 'ph_60_q1_a1', text: 'Fear of heights (Acrophobia)', points: 36, acceptedVariants: ['heights', 'high places', 'fear of heights'], displayOrder: 1 },
          { id: 'ph_60_q1_a2', text: 'Fear of the pitch dark (Nyctophobia)', points: 25, acceptedVariants: ['dark', 'the dark', 'darkness'], displayOrder: 2 },
          { id: 'ph_60_q1_a3', text: 'Fear of spiders and crawling insects (Arachnophobia)', points: 20, acceptedVariants: ['spiders', 'arachnophobia', 'bugs'], displayOrder: 3 },
          { id: 'ph_60_q1_a4', text: 'Fear of cramped or tight spaces (Claustrophobia)', points: 11, acceptedVariants: ['tight spaces', 'enclosed spaces', 'elevators'], displayOrder: 4 },
          { id: 'ph_60_q1_a5', text: 'Fear of public speaking in front of an audience', points: 8, acceptedVariants: ['public speaking', 'talking in front', 'stage fright'], displayOrder: 5 },
        ],
      },
      {
        id: 'ph_60_q2',
        prompt: 'Name a classic monster or spooky creature featured in horror stories.',
        category: 'Horror & Fears',
        answers: [
          { id: 'ph_60_q2_a1', text: 'Ghost / Wandering spirit (Multo)', points: 38, acceptedVariants: ['ghost', 'spirit', 'multo', 'phantom'], displayOrder: 1 },
          { id: 'ph_60_q2_a2', text: 'Vampire / Count Dracula', points: 26, acceptedVariants: ['vampire', 'dracula', 'bampira'], displayOrder: 2 },
          { id: 'ph_60_q2_a3', text: 'Zombie / Walking dead', points: 18, acceptedVariants: ['zombie', 'undead', 'living dead'], displayOrder: 3 },
          { id: 'ph_60_q2_a4', text: 'Werewolf transforming during a full moon', points: 10, acceptedVariants: ['werewolf', 'wolfman'], displayOrder: 4 },
          { id: 'ph_60_q2_a5', text: 'Creepy possessed doll (like Annabelle or Chucky)', points: 8, acceptedVariants: ['demon', 'chucky', 'annabelle', 'evil doll'], displayOrder: 5 },
        ],
      },
      {
        id: 'ph_60_q3',
        prompt: 'Name a spooky sound inside an old house that would make your heart race at midnight.',
        category: 'Horror & Fears',
        answers: [
          { id: 'ph_60_q3_a1', text: 'Heavy footsteps in an empty hallway or upstairs floor', points: 40, acceptedVariants: ['footsteps', 'footsteps upstairs', 'pacing'], displayOrder: 1 },
          { id: 'ph_60_q3_a2', text: 'Creaking door slowly swinging open on its own', points: 28, acceptedVariants: ['creaking door', 'door opening', 'squeaking door'], displayOrder: 2 },
          { id: 'ph_60_q3_a3', text: 'Unexplained scratching noises inside the wall or ceiling', points: 18, acceptedVariants: ['scratching', 'scratching wall', 'ceiling noise'], displayOrder: 3 },
          { id: 'ph_60_q3_a4', text: 'Sudden sharp tapping or knocking on the window glass', points: 14, acceptedVariants: ['knocking', 'knock on window', 'knocking on door'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_60_q4',
        prompt: 'Name a famous mythical creature or ghost from Philippine folklore.',
        category: 'Horror & Fears',
        answers: [
          { id: 'ph_60_q4_a1', text: 'White Lady (Floating along Balete Drive)', points: 38, acceptedVariants: ['white lady', 'white lady balete drive'], displayOrder: 1 },
          { id: 'ph_60_q4_a2', text: 'Aswang / Winged Manananggal', points: 30, acceptedVariants: ['aswang', 'manananggal'], displayOrder: 2 },
          { id: 'ph_60_q4_a3', text: 'Kapre (Cigar-smoking tree giant)', points: 18, acceptedVariants: ['kapre'], displayOrder: 3 },
          { id: 'ph_60_q4_a4', text: 'Tikbalang (Half-man, half-horse demon)', points: 8, acceptedVariants: ['tikbalang'], displayOrder: 4 },
          { id: 'ph_60_q4_a5', text: 'Nuno sa Punso (Mystical mound dweller)', points: 6, acceptedVariants: ['nuno', 'nuno sa punso', 'duwende'], displayOrder: 5 },
        ],
      },
      {
        id: 'ph_60_q5',
        prompt: 'What is the very first reflex people have when terrified during a horror movie?',
        category: 'Horror & Fears',
        answers: [
          { id: 'ph_60_q5_a1', text: 'Covering their eyes with their hands or a pillow', points: 48, acceptedVariants: ['cover eyes', 'hide face', 'pillow', 'cover face'], displayOrder: 1 },
          { id: 'ph_60_q5_a2', text: 'Screaming or gasping out loud', points: 28, acceptedVariants: ['scream', 'shout', 'yell', 'tumili'], displayOrder: 2 },
          { id: 'ph_60_q5_a3', text: 'Grabbing or gripping the person sitting next to them', points: 14, acceptedVariants: ['hold hands', 'grab someone', 'hold nearby person'], displayOrder: 3 },
          { id: 'ph_60_q5_a4', text: 'Jumping up to turn on all the room lights', points: 10, acceptedVariants: ['turn on lights', 'open lights', 'switch on light'], displayOrder: 4 },
        ],
      },
    ],
  },

  // PACK 61 (Pack 12): Stranded on an Island
  {
    id: 'pack_ph_61',
    title: 'Stranded on an Island',
    description: 'Shipwrecked in paradise: essential survival gear, sourcing fresh water, foraging coconuts, and signaling for rescue.',
    category: 'Island Survival',
    isBuiltIn: true,
    createdAt: '2026-11-06T00:00:00.000Z',
    updatedAt: '2026-11-06T00:00:00.000Z',
    questions: [
      {
        id: 'ph_61_q1',
        prompt: 'Name the single most critical item you would want to have if stranded on an uninhabited desert island.',
        category: 'Island Survival',
        answers: [
          { id: 'ph_61_q1_a1', text: 'Supply of fresh drinking water', points: 38, acceptedVariants: ['fresh water', 'drinking water', 'water', 'clean water'], displayOrder: 1 },
          { id: 'ph_61_q1_a2', text: 'Sturdy knife or machete', points: 26, acceptedVariants: ['knife', 'machete', 'bolo', 'blade', 'pocket knife'], displayOrder: 2 },
          { id: 'ph_61_q1_a3', text: 'Fire starter (Matches or lighter)', points: 18, acceptedVariants: ['lighter', 'matches', 'fire starter', 'fire'], displayOrder: 3 },
          { id: 'ph_61_q1_a4', text: 'Emergency canned food rations', points: 11, acceptedVariants: ['food', 'canned food', 'rations'], displayOrder: 4 },
          { id: 'ph_61_q1_a5', text: 'First aid and wound care kit', points: 7, acceptedVariants: ['first aid kit', 'medicine', 'medical kit'], displayOrder: 5 },
        ],
      },
      {
        id: 'ph_61_q2',
        prompt: 'What would be your number-one priority task during your very first day stranded on the island?',
        category: 'Island Survival',
        answers: [
          { id: 'ph_61_q2_a1', text: 'Build a protective shelter before nightfall', points: 36, acceptedVariants: ['build shelter', 'shelter', 'make a hut', 'tent'], displayOrder: 1 },
          { id: 'ph_61_q2_a2', text: 'Find a reliable fresh water source', points: 30, acceptedVariants: ['find water', 'look for fresh water', 'water source'], displayOrder: 2 },
          { id: 'ph_61_q2_a3', text: 'Start a campfire for warmth and safety', points: 20, acceptedVariants: ['start a fire', 'make fire', 'build fire'], displayOrder: 3 },
          { id: 'ph_61_q2_a4', text: 'Forage for edible fruit or fish for food', points: 14, acceptedVariants: ['find food', 'hunt', 'forage', 'gather food'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_61_q3',
        prompt: 'Name a method you would use to signal passing planes or distant ships for rescue.',
        category: 'Island Survival',
        answers: [
          { id: 'ph_61_q3_a1', text: 'Build a giant smoky signal fire on the beach', points: 42, acceptedVariants: ['smoke signal', 'bonfire', 'fire on beach', 'make smoke'], displayOrder: 1 },
          { id: 'ph_61_q3_a2', text: 'Spell out "S.O.S." or "HELP" with large stones in the sand', points: 30, acceptedVariants: ['sos', 'write help', 'sos in sand', 'rocks'], displayOrder: 2 },
          { id: 'ph_61_q3_a3', text: 'Flash a shiny mirror or metal surface toward the sun', points: 16, acceptedVariants: ['mirror', 'reflection', 'flash mirror', 'signal mirror'], displayOrder: 3 },
          { id: 'ph_61_q3_a4', text: 'Shoot a bright flare from an emergency flare gun', points: 12, acceptedVariants: ['flare', 'flare gun', 'shoot flare'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_61_q4',
        prompt: 'Name a nutritious food source you can naturally forage on a tropical desert island.',
        category: 'Island Survival',
        answers: [
          { id: 'ph_61_q4_a1', text: 'Coconuts (Both coconut water and rich meat)', points: 44, acceptedVariants: ['coconuts', 'coconut', 'buko', 'niyog'], displayOrder: 1 },
          { id: 'ph_61_q4_a2', text: 'Fresh fish and shoreline crabs', points: 28, acceptedVariants: ['fish', 'crabs', 'shellfish', 'seafood', 'alimango'], displayOrder: 2 },
          { id: 'ph_61_q4_a3', text: 'Wild tropical fruits (Bananas, Papaya, Mangoes)', points: 18, acceptedVariants: ['fruits', 'bananas', 'wild fruit', 'papaya'], displayOrder: 3 },
          { id: 'ph_61_q4_a4', text: 'Wild bird or sea turtle eggs', points: 10, acceptedVariants: ['eggs', 'bird eggs', 'turtle eggs'], displayOrder: 4 },
        ],
      },
      {
        id: 'ph_61_q5',
        prompt: 'Name an imaginary companion or object someone stranded all alone might talk to for company.',
        category: 'Island Survival',
        answers: [
          { id: 'ph_61_q5_a1', text: 'Volleyball with a painted face (like Wilson in Cast Away)', points: 48, acceptedVariants: ['volleyball', 'wilson', 'soccer ball', 'ball'], displayOrder: 1 },
          { id: 'ph_61_q5_a2', text: 'A friendly wild animal (Bird, Crab, Monkey)', points: 26, acceptedVariants: ['pet', 'bird', 'monkey', 'dog', 'crab'], displayOrder: 2 },
          { id: 'ph_61_q5_a3', text: 'Talking out loud to their own reflection or shadow', points: 16, acceptedVariants: ['themselves', 'talk to self', 'reflection'], displayOrder: 3 },
          { id: 'ph_61_q5_a4', text: 'A carved wooden stick figure or palm doll', points: 10, acceptedVariants: ['stick figure', 'wooden carving', 'doll'], displayOrder: 4 },
        ],
      },
    ],
  },
];
