export interface EliminationQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  difficulty: 'medium' | 'hard';
}

const ELIMINATION_BANK: EliminationQuestion[] = [
  {
    id: 'elim_1',
    question: 'Which element has the highest melting point of all metallic elements?',
    options: ['Tungsten', 'Titanium', 'Platinum', 'Osmium'],
    correctOptionIndex: 0,
    explanation: 'Tungsten has the highest melting point of any metal at 3,422 °C (6,192 °F).',
    difficulty: 'hard',
  },
  {
    id: 'elim_2',
    question: 'How many hearts does an octopus have?',
    options: ['1', '2', '3', '4'],
    correctOptionIndex: 2,
    explanation: 'An octopus has 3 hearts: two pump blood to the gills, while one pumps it to the rest of the body.',
    difficulty: 'medium',
  },
  {
    id: 'elim_3',
    question: 'Which Philippine province is officially known as the "Cradle of the Philippine Revolution"?',
    options: ['Bulacan', 'Cavite', 'Batangas', 'Laguna'],
    correctOptionIndex: 1,
    explanation: 'Cavite is hailed as the Cradle of the Philippine Revolution and Land of the Brave.',
    difficulty: 'medium',
  },
  {
    id: 'elim_4',
    question: 'What is the only mammal capable of sustained true powered flight?',
    options: ['Flying Squirrel', 'Bat', 'Sugar Glider', 'Colugo'],
    correctOptionIndex: 1,
    explanation: 'Bats are the only mammals capable of true, sustained flight; others can only glide.',
    difficulty: 'medium',
  },
  {
    id: 'elim_5',
    question: 'Which atmospheric layer contains the Earth’s protective ozone layer?',
    options: ['Troposphere', 'Stratosphere', 'Mesosphere', 'Thermosphere'],
    correctOptionIndex: 1,
    explanation: 'The ozone layer is primarily found in the lower portion of the stratosphere.',
    difficulty: 'medium',
  },
  {
    id: 'elim_6',
    question: 'What is the longest river entirely located within the Philippines?',
    options: ['Pasig River', 'Cagayan River', 'Agusan River', 'Pampanga River'],
    correctOptionIndex: 1,
    explanation: 'The Cagayan River (Rio Grande de Cagayan) spans 505 km across northeastern Luzon.',
    difficulty: 'medium',
  },
  {
    id: 'elim_7',
    question: 'What unit measures the frequency of sound waves?',
    options: ['Decibel', 'Hertz', 'Watt', 'Joule'],
    correctOptionIndex: 1,
    explanation: 'Hertz (Hz) measures wave frequency, while decibels measure sound intensity.',
    difficulty: 'medium',
  },
  {
    id: 'elim_8',
    question: 'In computer science, what does the acronym "ASCII" stand for?',
    options: [
      'American Standard Code for Information Interchange',
      'Advanced System Code for Internet Integration',
      'Automated Standard Computer Interface Protocol',
      'Applied Software Code for Instruction Indexes',
    ],
    correctOptionIndex: 0,
    explanation: 'ASCII stands for American Standard Code for Information Interchange.',
    difficulty: 'hard',
  },
  {
    id: 'elim_9',
    question: 'Which battle marked the end of Napoleon Bonaparte’s rule as French Emperor in 1815?',
    options: ['Battle of Leipzig', 'Battle of Austerlitz', 'Battle of Waterloo', 'Battle of Borodino'],
    correctOptionIndex: 2,
    explanation: 'Napoleon was decisively defeated at the Battle of Waterloo in Belgium in June 1815.',
    difficulty: 'medium',
  },
  {
    id: 'elim_10',
    question: 'What is the world’s largest coral reef system?',
    options: ['Tubbataha Reefs', 'Great Barrier Reef', 'Mesoamerican Barrier Reef', 'Red Sea Coral Reef'],
    correctOptionIndex: 1,
    explanation: 'The Great Barrier Reef in Australia extends over 2,300 kilometers.',
    difficulty: 'medium',
  },
];

export async function generateProceduralElimination(options: {
  count?: number;
}): Promise<EliminationQuestion[]> {
  const count = options.count || 5;
  const shuffled = [...ELIMINATION_BANK].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
