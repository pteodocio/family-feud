export interface CharadesWord {
  id: string;
  word: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number; // easy = 1, medium = 2, hard = 3
}

export const CHARADES_CATEGORIES = [
  'Movies & TV',
  'Animals & Nature',
  'Actions & Verbs',
  'Professions & Jobs',
  'Famous Characters',
  'Objects & Household',
] as const;

export const CHARADES_WORDS: CharadesWord[] = [
  // 1. Movies & TV (15 items)
  { id: 'ch_m_1', word: 'The Lion King', category: 'Movies & TV', difficulty: 'easy', points: 1 },
  { id: 'ch_m_2', word: 'Titanic', category: 'Movies & TV', difficulty: 'easy', points: 1 },
  { id: 'ch_m_3', word: 'Jurassic Park', category: 'Movies & TV', difficulty: 'easy', points: 1 },
  { id: 'ch_m_4', word: 'Spider-Man', category: 'Movies & TV', difficulty: 'easy', points: 1 },
  { id: 'ch_m_5', word: 'Frozen', category: 'Movies & TV', difficulty: 'easy', points: 1 },
  { id: 'ch_m_6', word: 'Harry Potter', category: 'Movies & TV', difficulty: 'medium', points: 2 },
  { id: 'ch_m_7', word: 'Star Wars', category: 'Movies & TV', difficulty: 'medium', points: 2 },
  { id: 'ch_m_8', word: 'Pirates of the Caribbean', category: 'Movies & TV', difficulty: 'medium', points: 2 },
  { id: 'ch_m_9', word: 'Avengers: Endgame', category: 'Movies & TV', difficulty: 'medium', points: 2 },
  { id: 'ch_m_10', word: 'Finding Nemo', category: 'Movies & TV', difficulty: 'medium', points: 2 },
  { id: 'ch_m_11', word: 'The Matrix', category: 'Movies & TV', difficulty: 'hard', points: 3 },
  { id: 'ch_m_12', word: 'Stranger Things', category: 'Movies & TV', difficulty: 'hard', points: 3 },
  { id: 'ch_m_13', word: 'Inception', category: 'Movies & TV', difficulty: 'hard', points: 3 },
  { id: 'ch_m_14', word: 'Mission Impossible', category: 'Movies & TV', difficulty: 'hard', points: 3 },
  { id: 'ch_m_15', word: 'Squid Game', category: 'Movies & TV', difficulty: 'hard', points: 3 },

  // 2. Animals & Nature (15 items)
  { id: 'ch_a_1', word: 'Dog', category: 'Animals & Nature', difficulty: 'easy', points: 1 },
  { id: 'ch_a_2', word: 'Cat', category: 'Animals & Nature', difficulty: 'easy', points: 1 },
  { id: 'ch_a_3', word: 'Monkey', category: 'Animals & Nature', difficulty: 'easy', points: 1 },
  { id: 'ch_a_4', word: 'Frog', category: 'Animals & Nature', difficulty: 'easy', points: 1 },
  { id: 'ch_a_5', word: 'Bird', category: 'Animals & Nature', difficulty: 'easy', points: 1 },
  { id: 'ch_a_6', word: 'Elephant', category: 'Animals & Nature', difficulty: 'medium', points: 2 },
  { id: 'ch_a_7', word: 'Penguin', category: 'Animals & Nature', difficulty: 'medium', points: 2 },
  { id: 'ch_a_8', word: 'Snake', category: 'Animals & Nature', difficulty: 'medium', points: 2 },
  { id: 'ch_a_9', word: 'Kangaroo', category: 'Animals & Nature', difficulty: 'medium', points: 2 },
  { id: 'ch_a_10', word: 'Shark', category: 'Animals & Nature', difficulty: 'medium', points: 2 },
  { id: 'ch_a_11', word: 'Octopus', category: 'Animals & Nature', difficulty: 'hard', points: 3 },
  { id: 'ch_a_12', word: 'Chameleon', category: 'Animals & Nature', difficulty: 'hard', points: 3 },
  { id: 'ch_a_13', word: 'Sloth', category: 'Animals & Nature', difficulty: 'hard', points: 3 },
  { id: 'ch_a_14', word: 'Flamingo', category: 'Animals & Nature', difficulty: 'hard', points: 3 },
  { id: 'ch_a_15', word: 'Volcano Eruption', category: 'Animals & Nature', difficulty: 'hard', points: 3 },

  // 3. Actions & Verbs (15 items)
  { id: 'ch_ac_1', word: 'Brushing Teeth', category: 'Actions & Verbs', difficulty: 'easy', points: 1 },
  { id: 'ch_ac_2', word: 'Swimming', category: 'Actions & Verbs', difficulty: 'easy', points: 1 },
  { id: 'ch_ac_3', word: 'Cooking an Egg', category: 'Actions & Verbs', difficulty: 'easy', points: 1 },
  { id: 'ch_ac_4', word: 'Sleeping', category: 'Actions & Verbs', difficulty: 'easy', points: 1 },
  { id: 'ch_ac_5', word: 'Driving a Car', category: 'Actions & Verbs', difficulty: 'easy', points: 1 },
  { id: 'ch_ac_6', word: 'Taking a Selfie', category: 'Actions & Verbs', difficulty: 'medium', points: 2 },
  { id: 'ch_ac_7', word: 'Riding a Roller Coaster', category: 'Actions & Verbs', difficulty: 'medium', points: 2 },
  { id: 'ch_ac_8', word: 'Singing in the Shower', category: 'Actions & Verbs', difficulty: 'medium', points: 2 },
  { id: 'ch_ac_9', word: 'Walking a Stiff Dog', category: 'Actions & Verbs', difficulty: 'medium', points: 2 },
  { id: 'ch_ac_10', word: 'Fishing', category: 'Actions & Verbs', difficulty: 'medium', points: 2 },
  { id: 'ch_ac_11', word: 'Walking on the Moon', category: 'Actions & Verbs', difficulty: 'hard', points: 3 },
  { id: 'ch_ac_12', word: 'Defusing a Bomb', category: 'Actions & Verbs', difficulty: 'hard', points: 3 },
  { id: 'ch_ac_13', word: 'Skydiving', category: 'Actions & Verbs', difficulty: 'hard', points: 3 },
  { id: 'ch_ac_14', word: 'Sneaking at Midnight', category: 'Actions & Verbs', difficulty: 'hard', points: 3 },
  { id: 'ch_ac_15', word: 'Building a Sandcastle', category: 'Actions & Verbs', difficulty: 'hard', points: 3 },

  // 4. Professions & Jobs (15 items)
  { id: 'ch_p_1', word: 'Doctor', category: 'Professions & Jobs', difficulty: 'easy', points: 1 },
  { id: 'ch_p_2', word: 'Chef / Cook', category: 'Professions & Jobs', difficulty: 'easy', points: 1 },
  { id: 'ch_p_3', word: 'Police Officer', category: 'Professions & Jobs', difficulty: 'easy', points: 1 },
  { id: 'ch_p_4', word: 'Teacher', category: 'Professions & Jobs', difficulty: 'easy', points: 1 },
  { id: 'ch_p_5', word: 'Firefighter', category: 'Professions & Jobs', difficulty: 'easy', points: 1 },
  { id: 'ch_p_6', word: 'Astronaut', category: 'Professions & Jobs', difficulty: 'medium', points: 2 },
  { id: 'ch_p_7', word: 'Pilot', category: 'Professions & Jobs', difficulty: 'medium', points: 2 },
  { id: 'ch_p_8', word: 'Photographer', category: 'Professions & Jobs', difficulty: 'medium', points: 2 },
  { id: 'ch_p_9', word: 'Dentist', category: 'Professions & Jobs', difficulty: 'medium', points: 2 },
  { id: 'ch_p_10', word: 'Magician', category: 'Professions & Jobs', difficulty: 'medium', points: 2 },
  { id: 'ch_p_11', word: 'Archaeologist', category: 'Professions & Jobs', difficulty: 'hard', points: 3 },
  { id: 'ch_p_12', word: 'Deep Sea Diver', category: 'Professions & Jobs', difficulty: 'hard', points: 3 },
  { id: 'ch_p_13', word: 'Fashion Runway Model', category: 'Professions & Jobs', difficulty: 'hard', points: 3 },
  { id: 'ch_p_14', word: 'Stand-Up Comedian', category: 'Professions & Jobs', difficulty: 'hard', points: 3 },
  { id: 'ch_p_15', word: 'Weather Forecaster in Typhoon', category: 'Professions & Jobs', difficulty: 'hard', points: 3 },

  // 5. Famous Characters (15 items)
  { id: 'ch_fc_1', word: 'Santa Claus', category: 'Famous Characters', difficulty: 'easy', points: 1 },
  { id: 'ch_fc_2', word: 'Superman', category: 'Famous Characters', difficulty: 'easy', points: 1 },
  { id: 'ch_fc_3', word: 'Pikachu', category: 'Famous Characters', difficulty: 'easy', points: 1 },
  { id: 'ch_fc_4', word: 'Tarzan', category: 'Famous Characters', difficulty: 'easy', points: 1 },
  { id: 'ch_fc_5', word: 'Barbie', category: 'Famous Characters', difficulty: 'easy', points: 1 },
  { id: 'ch_fc_6', word: 'Sherlock Holmes', category: 'Famous Characters', difficulty: 'medium', points: 2 },
  { id: 'ch_fc_7', word: 'Michael Jackson', category: 'Famous Characters', difficulty: 'medium', points: 2 },
  { id: 'ch_fc_8', word: 'Captain Jack Sparrow', category: 'Famous Characters', difficulty: 'medium', points: 2 },
  { id: 'ch_fc_9', word: 'The Hulk', category: 'Famous Characters', difficulty: 'medium', points: 2 },
  { id: 'ch_fc_10', word: 'Darth Vader', category: 'Famous Characters', difficulty: 'medium', points: 2 },
  { id: 'ch_fc_11', word: 'Mona Lisa', category: 'Famous Characters', difficulty: 'hard', points: 3 },
  { id: 'ch_fc_12', word: 'Gollum', category: 'Famous Characters', difficulty: 'hard', points: 3 },
  { id: 'ch_fc_13', word: 'Frankenstein', category: 'Famous Characters', difficulty: 'hard', points: 3 },
  { id: 'ch_fc_14', word: 'Wednesday Addams', category: 'Famous Characters', difficulty: 'hard', points: 3 },
  { id: 'ch_fc_15', word: 'Darna', category: 'Famous Characters', difficulty: 'hard', points: 3 },

  // 6. Objects & Household (15 items)
  { id: 'ch_o_1', word: 'Smartphone', category: 'Objects & Household', difficulty: 'easy', points: 1 },
  { id: 'ch_o_2', word: 'Umbrella', category: 'Objects & Household', difficulty: 'easy', points: 1 },
  { id: 'ch_o_3', word: 'Guitar', category: 'Objects & Household', difficulty: 'easy', points: 1 },
  { id: 'ch_o_4', word: 'Clock / Watch', category: 'Objects & Household', difficulty: 'easy', points: 1 },
  { id: 'ch_o_5', word: 'Bicycle', category: 'Objects & Household', difficulty: 'easy', points: 1 },
  { id: 'ch_o_6', word: 'Microwave', category: 'Objects & Household', difficulty: 'medium', points: 2 },
  { id: 'ch_o_7', word: 'Telescope', category: 'Objects & Household', difficulty: 'medium', points: 2 },
  { id: 'ch_o_8', word: 'Vacuum Cleaner', category: 'Objects & Household', difficulty: 'medium', points: 2 },
  { id: 'ch_o_9', word: 'Ironing Board', category: 'Objects & Household', difficulty: 'medium', points: 2 },
  { id: 'ch_o_10', word: 'Scissors', category: 'Objects & Household', difficulty: 'medium', points: 2 },
  { id: 'ch_o_11', word: 'Electric Fan', category: 'Objects & Household', difficulty: 'hard', points: 3 },
  { id: 'ch_o_12', word: 'Karaoke Microphone', category: 'Objects & Household', difficulty: 'hard', points: 3 },
  { id: 'ch_o_13', word: 'Popcorn Machine', category: 'Objects & Household', difficulty: 'hard', points: 3 },
  { id: 'ch_o_14', word: 'Boomerang', category: 'Objects & Household', difficulty: 'hard', points: 3 },
  { id: 'ch_o_15', word: 'Washing Machine on Spin Cycle', category: 'Objects & Household', difficulty: 'hard', points: 3 },
];
