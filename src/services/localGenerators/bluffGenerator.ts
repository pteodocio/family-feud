export interface BluffItem {
  id: string;
  question: string;
  trueAnswer: string;
  explanation: string;
  suggestedBluffs?: string[];
}

const BLUFF_ITEMS: BluffItem[] = [
  {
    id: 'bluff_1',
    question: 'In 2008, Norway officially knighted a penguin named Nils Olav. What is his official military rank today?',
    trueAnswer: 'Major General',
    explanation: 'Brigadier Sir Nils Olav III is the mascot and colonel-in-chief of the Norwegian King’s Guard, promoted to Major General in 2023.',
    suggestedBluffs: ['Captain of the Navy', 'First Lieutenant', 'Honorary Corporal'],
  },
  {
    id: 'bluff_2',
    question: 'Before toilet paper was invented, what unusual object did Americans commonly use in outhouses?',
    trueAnswer: 'Corncobs',
    explanation: 'Corncobs were soft, absorbent, and plentiful in agricultural America before catalogs and commercial TP arrived.',
    suggestedBluffs: ['Banana leaves', 'Polished flat river stones', 'Sheep wool rags'],
  },
  {
    id: 'bluff_3',
    question: 'What happens to a flamingo’s milk when feeding its chicks?',
    trueAnswer: 'It is bright red',
    explanation: 'Flamingos produce "crop milk" in their digestive tract that is rich in carotenoids and blood-red in color.',
    suggestedBluffs: ['It glows under UV light', 'It freezes instantly', 'It smells like sea salt'],
  },
  {
    id: 'bluff_4',
    question: 'In ancient Rome, what strange substance was commonly used as mouthwash and tooth whitener?',
    trueAnswer: 'Human Urine',
    explanation: 'The ammonia in stale urine was prized as a powerful whitening agent and stain remover in the Roman Empire.',
    suggestedBluffs: ['Crushed beetles', 'Goat milk vinegar', 'Volcanic ash paste'],
  },
  {
    id: 'bluff_5',
    question: 'What unexpected animal did the US military attempt to train as guided bomb controllers in WWII?',
    trueAnswer: 'Pigeons',
    explanation: 'Project Pigeon, led by B.F. Skinner, trained pigeons to peck at targets on a screen inside the missile nose cone.',
    suggestedBluffs: ['Dolphins', 'Cats', 'Raccoons'],
  },
  {
    id: 'bluff_6',
    question: 'What is the real origin of the word "Avocado"?',
    trueAnswer: 'Aztec word for Testicle',
    explanation: 'The Nahuatl Aztec word "ahuacatl" meant testicle, named for the fruit’s shape and hanging growth.',
    suggestedBluffs: ['Spanish word for Green Pear', 'Mayan word for Butter Fruit', 'Inca word for Sacred Seed'],
  },
  {
    id: 'bluff_7',
    question: 'What rare Philippine creature communicates using ultrasound frequencies beyond human hearing?',
    trueAnswer: 'Philippine Tarsier',
    explanation: 'Tarsiers call each other using frequencies up to 70-90 kHz, keeping their chats secret from predators.',
    suggestedBluffs: ['Palawan Binturong', 'Mindanao Flying Lemur', 'Visayan Warty Pig'],
  },
  {
    id: 'bluff_8',
    question: 'Why did 18th century British judges wear powdered white wigs?',
    trueAnswer: 'To cover up syphilis sores and lice',
    explanation: 'Wigs became a fashion necessity to conceal head sores, baldness, and hair lice outbreaks across Europe.',
    suggestedBluffs: ['To symbolize the wisdom of angels', 'To keep warm in drafty courts', 'By decree of King George'],
  },
];

export async function generateProceduralBluff(options: {
  count?: number;
}): Promise<BluffItem[]> {
  const count = options.count || 3;
  const shuffled = [...BLUFF_ITEMS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
