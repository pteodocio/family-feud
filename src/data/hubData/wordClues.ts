export interface WordCluePuzzle {
  id: string;
  word: string;
  category: string;
  clues: [string, string, string, string]; // exactly 4 progressive clues
}

export const WORD_CLUE_CATEGORIES = [
  'Everyday Objects',
  'Animals',
  'Food & Snacks',
  'Famous Places',
  'Professions',
  'Philippine Culture',
] as const;

export const WORD_CLUES: WordCluePuzzle[] = [
  // 1. Everyday Objects
  {
    id: 'wc_obj_1',
    word: 'Refrigerator',
    category: 'Everyday Objects',
    clues: [
      'I hum quietly in the corner of a room all day and night.',
      'Opening my door usually turns on a small warm light.',
      'I keep perishable groceries from going bad.',
      'You open me multiple times a day looking for cold drinks or snacks.',
    ],
  },
  {
    id: 'wc_obj_2',
    word: 'Umbrella',
    category: 'Everyday Objects',
    clues: [
      'I stay folded up in bags or corners until the weather changes.',
      'People hate carrying me around on sunny days, but regret leaving me when clouds gather.',
      'I shield you from falling raindrops and scorching sun.',
      'I pop open with ribs of fabric overhead.',
    ],
  },
  {
    id: 'wc_obj_3',
    word: 'Guitar',
    category: 'Everyday Objects',
    clues: [
      'I have a wooden body and a hollow round soundhole.',
      'I have a long neck with metallic frets.',
      'People pluck or strum my six strings at campfires and parties.',
      'Acoustic and electric versions of me are played in bands.',
    ],
  },
  {
    id: 'wc_obj_4',
    word: 'Washing Machine',
    category: 'Everyday Objects',
    clues: [
      'I shake violently during my final cycle if things are uneven.',
      'I need both running water and detergent powder to do my job.',
      'I spin dirty garments in soapy bubbles.',
      'I save people from doing laundry by hand on a washboard.',
    ],
  },
  {
    id: 'wc_obj_5',
    word: 'Eyeglasses',
    category: 'Everyday Objects',
    clues: [
      'I have two frames and two hinges that rest over your ears.',
      'People often misplace me while I am resting right on top of their head.',
      'You clean my transparent surfaces with microfiber cloth.',
      'People put me on their nose to read small print clearly.',
    ],
  },

  // 2. Animals
  {
    id: 'wc_anim_1',
    word: 'Penguin',
    category: 'Animals',
    clues: [
      'I am a bird, but you will never see me soaring in the sky.',
      'I wear a natural black and white tuxedo look.',
      'I am an expert swimmer who waddles awkwardly on icy ground.',
      'I huddle in massive colonies in Antarctica to stay warm.',
    ],
  },
  {
    id: 'wc_anim_2',
    word: 'Kangaroo',
    category: 'Animals',
    clues: [
      'I am a marsupial native to a single continent.',
      'I use my powerful hind legs and heavy tail for balance and speed.',
      'My babies are called joeys.',
      'Mothers carry their young in a furry front pouch.',
    ],
  },
  {
    id: 'wc_anim_3',
    word: 'Chameleon',
    category: 'Animals',
    clues: [
      'I move very slowly along tree branches.',
      'My eyes can rotate independently in two completely different directions.',
      'I shoot out a long sticky tongue to catch flies.',
      'I am famous for changing the color of my skin to match surroundings.',
    ],
  },
  {
    id: 'wc_anim_4',
    word: 'Elephant',
    category: 'Animals',
    clues: [
      'I am the largest walking land mammal alive today.',
      'Folklore says I am terrified of mice and have an incredible memory.',
      'I have large flapping ears and long ivory tusks.',
      'I drink water and pick up fruit using my long trunk.',
    ],
  },
  {
    id: 'wc_anim_5',
    word: 'Bat',
    category: 'Animals',
    clues: [
      'I sleep hanging completely upside down in dark caves or attics.',
      'I am the only mammal capable of true sustained flight.',
      'I navigate pitch-black darkness using ultrasonic echolocation.',
      'Pop culture associates me with Dracula and Halloween.',
    ],
  },

  // 3. Food & Snacks
  {
    id: 'wc_food_1',
    word: 'Popcorn',
    category: 'Food & Snacks',
    clues: [
      'I start out as hard dried yellow kernels.',
      'Heat and pressure cause me to explode inside out with loud snapping noises.',
      'I am usually tossed in melted butter and salt.',
      'You buy a giant bucket of me when watching a movie at the cinema.',
    ],
  },
  {
    id: 'wc_food_2',
    word: 'Ice Cream',
    category: 'Food & Snacks',
    clues: [
      'If you do not consume me quickly under the sun, I turn into liquid soup.',
      'Eating me too fast can trigger a temporary "brain freeze".',
      'I come in flavors like vanilla, chocolate, strawberry, and ube.',
      'I am scooped into waffle cones or bowls with colorful sprinkles.',
    ],
  },
  {
    id: 'wc_food_3',
    word: 'Pizza',
    category: 'Food & Snacks',
    clues: [
      'My shape is round, but I am served in a square cardboard box.',
      'People constantly argue about whether pineapple belongs on top of me.',
      'I am sliced into triangles of melted mozzarella cheese and tomato sauce.',
      'Pepperoni is my most popular topping worldwide.',
    ],
  },
  {
    id: 'wc_food_4',
    word: 'Chocolate',
    category: 'Food & Snacks',
    clues: [
      'I originated from bitter beans cultivated by ancient Mesoamerican civilizations.',
      'I can be dark, milk, or white.',
      'I melt smoothly at normal human body temperature.',
      'I am given inside heart-shaped boxes on Valentine’s Day.',
    ],
  },
  {
    id: 'wc_food_5',
    word: 'Halo-Halo',
    category: 'Food & Snacks',
    clues: [
      'I am an iconic dessert served in a tall clear glass with a long spoon.',
      'My name translates to "mix-mix" in Filipino.',
      'I contain sweet beans, nata de coco, sago, evaporated milk, and crushed ice.',
      'I am crowned with a slice of leche flan and a scoop of purple ube ice cream.',
    ],
  },

  // 4. Famous Places
  {
    id: 'wc_pl_1',
    word: 'Eiffel Tower',
    category: 'Famous Places',
    clues: [
      'I was constructed in 1889 as an entrance arch for the World’s Fair.',
      'Many critics originally considered my wrought-iron lattice ugly.',
      'I sparkle with thousands of lights every night in the City of Love.',
      'I am the most famous monument in Paris, France.',
    ],
  },
  {
    id: 'wc_pl_2',
    word: 'Great Wall of China',
    category: 'Famous Places',
    clues: [
      'My construction began over 2,000 years ago across rugged mountain ridges.',
      'I span thousands of kilometers of stone ramparts and watchtowers.',
      'Ancient emperors built me to protect borders from northern invaders.',
      'I am the world’s longest architectural structure located in China.',
    ],
  },
  {
    id: 'wc_pl_3',
    word: 'Pyramids of Giza',
    category: 'Famous Places',
    clues: [
      'I stand on a desert plateau beside the Nile River.',
      'I was built from millions of heavy limestone blocks aligned with the stars.',
      'I served as monumental tombs for ancient Egyptian pharaohs.',
      'The Great Sphinx guards my entrance.',
    ],
  },
  {
    id: 'wc_pl_4',
    word: 'Colosseum',
    category: 'Famous Places',
    clues: [
      'I am an oval amphitheater made of travertine limestone and concrete.',
      'Thousands of spectators gathered here in ancient times.',
      'Gladiators once fought wild beasts and each other on my arena floor.',
      'I am an iconic ancient ruin standing in Rome, Italy.',
    ],
  },
  {
    id: 'wc_pl_5',
    word: 'Mayon Volcano',
    category: 'Famous Places',
    clues: [
      'I am an active stratovolcano located in the Bicol region.',
      'Legend says my clouds represent the tragic love story of Daragang Magayon.',
      'Photographers travel across the globe to admire my nearly perfect symmetrical cone.',
      'I stand majestically overlooking the province of Albay, Philippines.',
    ],
  },

  // 5. Professions
  {
    id: 'wc_prof_1',
    word: 'Astronaut',
    category: 'Professions',
    clues: [
      'I spend months training in neutral buoyancy water pools.',
      'I experience zero gravity and eat rehydrated food pouches.',
      'I must wear a pressurized helmet and suit to survive outside.',
      'I travel on rockets into outer space.',
    ],
  },
  {
    id: 'wc_prof_2',
    word: 'Firefighter',
    category: 'Professions',
    clues: [
      'I slide down a brass pole when an alarm sounds.',
      'I wear flame-retardant yellow gear and a heavy helmet.',
      'I ride in a red truck equipped with flashing sirens, hoses, and ladders.',
      'I rush into burning buildings to rescue people and extinguish fires.',
    ],
  },
  {
    id: 'wc_prof_3',
    word: 'Chef',
    category: 'Professions',
    clues: [
      'I work in a hot, fast-paced environment surrounded by stainless steel.',
      'I shout commands like "Order up!" and "Yes, chef!"',
      'I wear a tall pleated white hat called a toque and an apron.',
      'I create gourmet dishes and oversee commercial restaurant kitchens.',
    ],
  },
  {
    id: 'wc_prof_4',
    word: 'Dentist',
    category: 'Professions',
    clues: [
      'People recline back in my specialized hydraulic chair with a bright overhead lamp.',
      'I use a tiny mirror and high-pitched whirring drill.',
      'I constantly remind patients to brush and floss twice daily.',
      'I inspect your teeth and fill cavities.',
    ],
  },
  {
    id: 'wc_prof_5',
    word: 'Pilot',
    category: 'Professions',
    clues: [
      'I sit inside a cockpit filled with hundreds of dials, screens, and throttles.',
      'I communicate with air traffic control towers using headsets.',
      'I wear a navy uniform with striped shoulder epaulets.',
      'I fly airplanes carrying hundreds of passengers through the sky.',
    ],
  },

  // 6. Philippine Culture
  {
    id: 'wc_ph_1',
    word: 'Jeepney',
    category: 'Philippine Culture',
    clues: [
      'I was originally assembled from surplus military vehicles left after World War II.',
      'Passengers pass coins forward by saying "Bayad po!"',
      'I am decorated with colorful vibrant murals and chrome horses on my hood.',
      'I am known as the King of the Road in Philippine public transport.',
    ],
  },
  {
    id: 'wc_ph_2',
    word: 'Karaoke / Videoke',
    category: 'Philippine Culture',
    clues: [
      'I am rented or dragged out onto the sidewalk during every birthday or fiesta.',
      'Coins are dropped into my slot to queue up classic songs.',
      'Frank Sinatra’s "My Way" is notoriously sung with caution.',
      'Singers score 100 on my screen as family members sing along into the microphone.',
    ],
  },
  {
    id: 'wc_ph_3',
    word: 'Taho',
    category: 'Philippine Culture',
    clues: [
      'I am sold in early mornings carried in two large aluminum buckets on a shoulder yoke.',
      'The vendor walks down neighborhoods shouting my name with a booming voice.',
      'I consist of warm silken tofu mixed with chewy sago pearls.',
      'I am drizzled with sweet dark brown syrup called arnibal.',
    ],
  },
  {
    id: 'wc_ph_4',
    word: 'Sari-Sari Store',
    category: 'Philippine Culture',
    clues: [
      'I am usually built into the front window or garage of a family home.',
      'I have wooden metal grills with hanging packets of shampoo and chips.',
      'Neighbors gather around my bench to gossip and buy items "tingi" style.',
      'The quintessential Filipino neighborhood corner convenience store.',
    ],
  },
  {
    id: 'wc_ph_5',
    word: 'Balut',
    category: 'Philippine Culture',
    clues: [
      'Vendors cycle through the dark streets at night with insulated baskets.',
      'You crack the shell, sprinkle a pinch of salt or spicy vinegar, and sip the broth first.',
      'Foreign tourists and reality show contestants are often challenged to eat me.',
      'A fertilized developing duck egg delicacy beloved by Filipinos.',
    ],
  },
];
