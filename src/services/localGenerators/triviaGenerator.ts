import type { TriviaQuestion } from '../../data/hubData/triviaQuestions';
import { getRecentContentHashes } from '../contentHistory';

export interface TriviaGenOptions {
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'all';
  count: number;
  language?: 'en' | 'fil';
  avoidRecent?: boolean;
}

// -------------------------------------------------------------
// RELATIONAL FACT MATRICES (OFFLINE REUSABLE DATA ENGINE)
// -------------------------------------------------------------

interface ProvinceEntity {
  name: string;
  capital: string;
  region: string;
  landmark: string;
  festival: string;
  food: string;
}

const PHILIPPINE_PROVINCES: ProvinceEntity[] = [
  { name: 'Cebu', capital: 'Cebu City', region: 'Central Visayas', landmark: "Magellan's Cross", festival: 'Sinulog Festival', food: 'Lechon' },
  { name: 'Bohol', capital: 'Tagbilaran City', region: 'Central Visayas', landmark: 'Chocolate Hills', festival: 'Sandugo Festival', food: 'Peanut Kisses' },
  { name: 'Albay', capital: 'Legazpi City', region: 'Bicol Region', landmark: 'Mayon Volcano', festival: 'Magayon Festival', food: 'Bicol Express' },
  { name: 'Benguet', capital: 'La Trinidad', region: 'Cordillera Administrative Region', landmark: 'Strawberry Farm', festival: 'Panagbenga Festival', food: 'Fresh Strawberries' },
  { name: 'Ilocos Norte', capital: 'Laoag City', region: 'Ilocos Region', landmark: 'Bangui Windmills and Paoay Church', festival: 'Pamulinawen Festival', food: 'Empanada' },
  { name: 'Pampanga', capital: 'San Fernando', region: 'Central Luzon', landmark: 'Mount Arayat', festival: 'Giant Lantern Festival', food: 'Sisig' },
  { name: 'Palawan', capital: 'Puerto Princesa', region: 'MIMAROPA', landmark: 'Puerto Princesa Subterranean River', festival: 'Baragatan Festival', food: 'Crocodile Sisig' },
  { name: 'Batangas', capital: 'Batangas City', region: 'CALABARZON', landmark: 'Taal Volcano', festival: 'Ala Eh Festival', food: 'Bulalo and Kapeng Barako' },
  { name: 'Laguna', capital: 'Santa Cruz', region: 'CALABARZON', landmark: 'Pagsanjan Falls', festival: 'Anilag Festival', food: 'Buko Pie' },
  { name: 'Iloilo', capital: 'Iloilo City', region: 'Western Visayas', landmark: 'Miagao Church', festival: 'Dinagyang Festival', food: 'La Paz Batchoy' },
  { name: 'Negros Occidental', capital: 'Bacolod City', region: 'Western Visayas', landmark: 'The Ruins', festival: 'MassKara Festival', food: 'Chicken Inasal' },
  { name: 'Davao del Sur', capital: 'Davao City', region: 'Davao Region', landmark: 'Mount Apo', festival: 'Kadayawan Festival', food: 'Durian' },
  { name: 'Aklan', capital: 'Kalibo', region: 'Western Visayas', landmark: 'Boracay Island', festival: 'Ati-Atihan Festival', food: 'Inubaran Chicken' },
  { name: 'Pangasinan', capital: 'Lingayen', region: 'Ilocos Region', landmark: 'Hundred Islands', festival: 'Bangus Festival', food: 'Bangus and Tupig' },
  { name: 'Quezon', capital: 'Lucena City', region: 'CALABARZON', landmark: 'Mount Banahaw', festival: 'Pahiyas Festival in Lucban', food: 'Pancit Habhab and Longganisang Lucban' },
  { name: 'Rizal', capital: 'Antipolo City', region: 'CALABARZON', landmark: 'Hinulugang Taktak', festival: 'Higantes Festival', food: 'Kasoy and Suman' },
  { name: 'Cavite', capital: 'Imus', region: 'CALABARZON', landmark: 'Aguinaldo Shrine in Kawit', festival: 'Regada Festival', food: 'Tamales and Tinapa' },
  { name: 'Leyte', capital: 'Tacloban City', region: 'Eastern Visayas', landmark: 'San Juanico Bridge', festival: 'Pintados Festival', food: 'Moron and Binagol' },
  { name: 'Camiguin', capital: 'Mambajao', region: 'Northern Mindanao', landmark: 'White Island and Sunken Cemetery', festival: 'Lanzones Festival', food: 'Sweet Lanzones' },
  { name: 'Batanes', capital: 'Basco', region: 'Cagayan Valley', landmark: 'Marlboro Hills and Stone Houses', festival: 'Vakul-Kanayi Festival', food: 'Uved and Luñis' },
  { name: 'South Cotabato', capital: 'Koronadal City', region: 'SOCCSKSARGEN', landmark: 'Lake Sebu', festival: "T'nalak Festival", food: 'Tilapia dishes' },
  { name: 'Bataan', capital: 'Balanga City', region: 'Central Luzon', landmark: 'Mount Samat National Shrine', festival: 'Bataan Day / Pawikan Festival', food: 'Smoked Fish (Tinapa)' },
  { name: 'Zamboanga del Sur', capital: 'Pagadian City', region: 'Zamboanga Peninsula', landmark: 'Fort Pilar and Pink Sand Beach', festival: 'Zamboanga Hermosa Festival', food: 'Curacha with Alavar Sauce' },
  { name: 'Isabela', capital: 'Ilagan City', region: 'Cagayan Valley', landmark: 'Magat Dam', festival: 'Bambanti Festival', food: 'Pancit Cabagan' },
];

interface PlanetEntity {
  name: string;
  trait: string;
  order: string;
  traitFil: string;
}

const PLANETS: PlanetEntity[] = [
  { name: 'Mercury', trait: 'the smallest planet and closest to the Sun', order: 'first', traitFil: 'ang pinakamaliit na planeta at pinakamalapit sa Araw' },
  { name: 'Venus', trait: 'the hottest planet with thick clouds of sulfuric acid', order: 'second', traitFil: 'ang pinakamainit na planeta dahil sa makakapal na greenhouse gas' },
  { name: 'Earth', trait: 'the only known planet to harbor liquid water and life', order: 'third', traitFil: 'ang tanging planeta na may buhay at likidong tubig' },
  { name: 'Mars', trait: 'known as the Red Planet due to iron oxide on its surface', order: 'fourth', traitFil: 'kilala bilang Pulang Planeta dahil sa kalawang na iron oxide' },
  { name: 'Jupiter', trait: 'the largest planet, famous for its Great Red Spot', order: 'fifth', traitFil: 'ang pinakamalaking planeta, kilala sa Great Red Spot storm' },
  { name: 'Saturn', trait: 'famous for its extensive, spectacular system of rings', order: 'sixth', traitFil: 'tanyag sa malalapad at magagandang singsing na yelo at bato' },
  { name: 'Uranus', trait: 'an ice giant that rotates completely on its side', order: 'seventh', traitFil: 'isang ice giant na umiikot nang nakatagilid' },
  { name: 'Neptune', trait: 'the windiest planet, located furthest from the Sun', order: 'eighth', traitFil: 'ang pinakamalayong planeta na may pinakamalakas na hangin' },
];

interface ScienceElement {
  name: string;
  symbol: string;
  atomicNumber: number;
  use: string;
}

const SCIENCE_ELEMENTS: ScienceElement[] = [
  { name: 'Gold', symbol: 'Au', atomicNumber: 79, use: 'jewelry, currency, and high-conductivity electronics' },
  { name: 'Silver', symbol: 'Ag', atomicNumber: 47, use: 'mirrors, photography, and the highest electrical conductivity' },
  { name: 'Iron', symbol: 'Fe', atomicNumber: 26, use: 'steel manufacturing and carrying oxygen in hemoglobin' },
  { name: 'Sodium', symbol: 'Na', atomicNumber: 11, use: 'table salt when combined with chlorine' },
  { name: 'Potassium', symbol: 'K', atomicNumber: 19, use: 'fertilizers and human nervous system electrical impulses' },
  { name: 'Mercury', symbol: 'Hg', atomicNumber: 80, use: 'traditional liquid thermometers and barometers' },
  { name: 'Lead', symbol: 'Pb', atomicNumber: 82, use: 'radiation shielding and car battery plates' },
  { name: 'Helium', symbol: 'He', atomicNumber: 2, use: 'filling party balloons and cooling MRI magnets' },
  { name: 'Copper', symbol: 'Cu', atomicNumber: 29, use: 'electrical wiring and plumbing pipes' },
  { name: 'Carbon', symbol: 'C', atomicNumber: 6, use: 'diamonds, graphite, and the organic basis of all life' },
  { name: 'Oxygen', symbol: 'O', atomicNumber: 8, use: 'cellular respiration and supporting combustion' },
  { name: 'Nitrogen', symbol: 'N', atomicNumber: 7, use: 'making up about 78% of Earth’s atmosphere' },
];

interface WorldGeoEntity {
  country: string;
  capital: string;
  continent: string;
  wonder: string;
}

const WORLD_PLACES: WorldGeoEntity[] = [
  { country: 'Japan', capital: 'Tokyo', continent: 'Asia', wonder: 'Mount Fuji' },
  { country: 'Australia', capital: 'Canberra', continent: 'Oceania', wonder: 'Sydney Opera House and Great Barrier Reef' },
  { country: 'Canada', capital: 'Ottawa', continent: 'North America', wonder: 'Niagara Falls and Banff National Park' },
  { country: 'Brazil', capital: 'Brasília', continent: 'South America', wonder: 'Christ the Redeemer statue and Amazon Rainforest' },
  { country: 'Egypt', capital: 'Cairo', continent: 'Africa', wonder: 'The Great Pyramids of Giza' },
  { country: 'France', capital: 'Paris', continent: 'Europe', wonder: 'The Eiffel Tower and Louvre Museum' },
  { country: 'Italy', capital: 'Rome', continent: 'Europe', wonder: 'The Colosseum and Leaning Tower of Pisa' },
  { country: 'India', capital: 'New Delhi', continent: 'Asia', wonder: 'The Taj Mahal' },
  { country: 'China', capital: 'Beijing', continent: 'Asia', wonder: 'The Great Wall of China' },
  { country: 'South Korea', capital: 'Seoul', continent: 'Asia', wonder: 'Gyeongbokgung Palace' },
  { country: 'United Kingdom', capital: 'London', continent: 'Europe', wonder: 'Big Ben and Stonehenge' },
  { country: 'Spain', capital: 'Madrid', continent: 'Europe', wonder: 'La Sagrada Familia' },
  { country: 'Greece', capital: 'Athens', continent: 'Europe', wonder: 'The Parthenon on the Acropolis' },
  { country: 'Thailand', capital: 'Bangkok', continent: 'Asia', wonder: 'The Grand Palace and Wat Arun' },
  { country: 'Mexico', capital: 'Mexico City', continent: 'North America', wonder: 'Chichen Itza Mayan Pyramids' },
];

interface AnimalEntity {
  name: string;
  nameFil: string;
  classType: string;
  fact: string;
  factFil: string;
  diet: string;
}

const ANIMALS: AnimalEntity[] = [
  { name: 'Cheetah', nameFil: 'Cheetah', classType: 'Mammal', fact: 'the fastest land animal reaching speeds of over 100 km/h', factFil: 'ang pinakamabilis na hayop sa lupa na kayang tumakbo nang higit 100 km/h', diet: 'Carnivore' },
  { name: 'Blue Whale', nameFil: 'Blue Whale', classType: 'Mammal', fact: 'the largest animal ever known to have lived on Earth', factFil: 'ang pinakamalaking hayop na nabuhay sa daigdig', diet: 'Carnivore' },
  { name: 'Octopus', nameFil: 'Pugita (Octopus)', classType: 'Mollusk', fact: 'has three hearts and blue copper-based blood', factFil: 'may tatlong puso at asul na dugo', diet: 'Carnivore' },
  { name: 'Platypus', nameFil: 'Platypus', classType: 'Monotreme Mammal', fact: 'lays eggs instead of giving live birth while still nursing milk', factFil: 'nangingitlog kahit ito ay isang mammal na nagpapasuso', diet: 'Carnivore' },
  { name: 'Ostrich', nameFil: 'Ostrich (Abestrus)', classType: 'Bird', fact: 'the largest bird in the world that cannot fly but runs at 70 km/h', factFil: 'ang pinakamalaking ibon sa mundo na hindi lumilipad ngunit mabilis tumakbo', diet: 'Herbivore' },
  { name: 'Chameleon', nameFil: 'Hunyanggo (Chameleon)', classType: 'Reptile', fact: 'can move each eye independently in two different directions', factFil: 'kayang igalaw ang bawat mata nang magkahiwalay sa magkaibang direksyon', diet: 'Insectivore' },
  { name: 'Peregrine Falcon', nameFil: 'Peregrine Falcon', classType: 'Bird', fact: 'the fastest creature in the animal kingdom, diving at over 320 km/h', factFil: 'ang pinakamabilis na nilalang sa daigdig sa bilis na 320 km/h', diet: 'Carnivore' },
  { name: 'Sloth', nameFil: 'Sloth', classType: 'Mammal', fact: 'spends nearly all of its life hanging upside down in trees and moves extremely slowly', factFil: 'gumugugol ng halos buong buhay nang nakabitibit sa puno nang napakabagal', diet: 'Herbivore' },
  { name: 'Philippine Eagle', nameFil: 'Agila ng Pilipinas', classType: 'Bird', fact: 'one of the largest and most powerful eagles in the world, endemic to the Philippines', factFil: 'pambansang ibon ng Pilipinas na isa sa pinakamalaki at pinakamakapangyarihang agila sa mundo', diet: 'Carnivore' },
  { name: 'Tarsier', nameFil: 'Tarsier (Mamag)', classType: 'Primate', fact: 'one of the smallest known primates with giant eyes that cannot rotate in their sockets', factFil: 'isa sa pinakamaliit na primate sa mundo na may malalaking matang hindi nagagalaw sa eyeball socket', diet: 'Insectivore' },
];

// Helper to shuffle arrays
function shuffle<T>(arr: T[]): T[] {
  const c = [...arr];
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
}

// -------------------------------------------------------------
// DYNAMIC PROCEDURAL GENERATOR
// -------------------------------------------------------------

export async function generateProceduralTrivia(options: TriviaGenOptions): Promise<TriviaQuestion[]> {
  const targetCount = Math.max(1, Math.min(options.count || 10, 30));
  const lang = options.language || 'en';
  const categoryFilter = options.category && options.category !== 'All' ? options.category : null;

  const recentHashes = options.avoidRecent !== false ? await getRecentContentHashes('family-trivia') : new Set<string>();
  const generated: TriviaQuestion[] = [];
  let attempts = 0;
  const maxAttempts = targetCount * 12;

  // Question generator routines
  const generators: Array<() => TriviaQuestion | null> = [
    // 1. Philippine Province Capital
    () => {
      if (categoryFilter && categoryFilter !== 'Philippine Trivia' && categoryFilter !== 'History & Geography') return null;
      const prov = PHILIPPINE_PROVINCES[Math.floor(Math.random() * PHILIPPINE_PROVINCES.length)];
      const otherProvs = PHILIPPINE_PROVINCES.filter((p) => p.name !== prov.name);
      const wrong = shuffle(otherProvs).slice(0, 3).map((p) => p.capital);
      const optionsList = shuffle([prov.capital, ...wrong]);

      const prompt = lang === 'fil'
        ? `Ano ang kabisera (capital city) ng lalawigan ng ${prov.name}?`
        : `What is the provincial capital of ${prov.name}?`;
      const explanation = `${prov.capital} is the official capital of ${prov.name}, located in ${prov.region}.`;

      return {
        id: `gen_triv_phcap_${prov.name.toLowerCase().replace(/\s/g, '')}_${Date.now()}`,
        category: 'Philippine Trivia',
        prompt,
        options: optionsList,
        correctOptionIndex: optionsList.indexOf(prov.capital),
        explanation,
        type: 'multiple_choice',
      };
    },

    // 2. Philippine Festival / Landmark
    () => {
      if (categoryFilter && categoryFilter !== 'Philippine Trivia' && categoryFilter !== 'History & Geography') return null;
      const prov = PHILIPPINE_PROVINCES[Math.floor(Math.random() * PHILIPPINE_PROVINCES.length)];
      const otherProvs = PHILIPPINE_PROVINCES.filter((p) => p.name !== prov.name);
      const wrong = shuffle(otherProvs).slice(0, 3).map((p) => p.name);
      const optionsList = shuffle([prov.name, ...wrong]);

      const isLandmark = Math.random() > 0.5;
      const clue = isLandmark ? prov.landmark : prov.festival;
      const prompt = lang === 'fil'
        ? `Saang lalawigan matatagpuan o ipinagdiriwang ang sikat na "${clue}"?`
        : `Which Philippine province is famously home to the "${clue}"?`;
      const explanation = `${prov.name} is celebrated for its ${prov.festival} and iconic landmark ${prov.landmark}.`;

      return {
        id: `gen_triv_phfeat_${prov.name.toLowerCase().replace(/\s/g, '')}_${Date.now()}`,
        category: 'Philippine Trivia',
        prompt,
        options: optionsList,
        correctOptionIndex: optionsList.indexOf(prov.name),
        explanation,
        type: 'multiple_choice',
      };
    },

    // 3. Astronomy & Planets
    () => {
      if (categoryFilter && categoryFilter !== 'Science & Nature' && categoryFilter !== 'General Knowledge') return null;
      const planet = PLANETS[Math.floor(Math.random() * PLANETS.length)];
      const others = PLANETS.filter((p) => p.name !== planet.name);
      const wrong = shuffle(others).slice(0, 3).map((p) => p.name);
      const optionsList = shuffle([planet.name, ...wrong]);

      const prompt = lang === 'fil'
        ? `Aling planeta sa Solar System ang kilala bilang ${planet.traitFil}?`
        : `Which planet in our Solar System is recognized as ${planet.trait}?`;
      const explanation = `${planet.name} is the ${planet.order} planet from the Sun and is distinguished as ${planet.trait}.`;

      return {
        id: `gen_triv_planet_${planet.name.toLowerCase()}_${Date.now()}`,
        category: 'Science & Nature',
        prompt,
        options: optionsList,
        correctOptionIndex: optionsList.indexOf(planet.name),
        explanation,
        type: 'multiple_choice',
      };
    },

    // 4. Chemical Elements & Symbols
    () => {
      if (categoryFilter && categoryFilter !== 'Science & Nature' && categoryFilter !== 'General Knowledge') return null;
      const elem = SCIENCE_ELEMENTS[Math.floor(Math.random() * SCIENCE_ELEMENTS.length)];
      const others = SCIENCE_ELEMENTS.filter((e) => e.name !== elem.name);

      const askSymbol = Math.random() > 0.5;
      if (askSymbol) {
        const wrong = shuffle(others).slice(0, 3).map((e) => e.symbol);
        const optionsList = shuffle([elem.symbol, ...wrong]);
        const prompt = lang === 'fil'
          ? `Ano ang chemical symbol sa Periodic Table para sa elementong "${elem.name}"?`
          : `What is the chemical symbol on the Periodic Table for the element "${elem.name}"?`;
        const explanation = `${elem.name} has the atomic symbol "${elem.symbol}" with atomic number ${elem.atomicNumber}.`;

        return {
          id: `gen_triv_elem_sym_${elem.symbol}_${Date.now()}`,
          category: 'Science & Nature',
          prompt,
          options: optionsList,
          correctOptionIndex: optionsList.indexOf(elem.symbol),
          explanation,
          type: 'multiple_choice',
        };
      } else {
        const wrong = shuffle(others).slice(0, 3).map((e) => e.name);
        const optionsList = shuffle([elem.name, ...wrong]);
        const prompt = lang === 'fil'
          ? `Aling elemento ang may atomic number na ${elem.atomicNumber} at ginagamit sa ${elem.use}?`
          : `Which chemical element has the atomic number ${elem.atomicNumber} and is widely used for ${elem.use}?`;
        const explanation = `${elem.name} (${elem.symbol}) has atomic number ${elem.atomicNumber}.`;

        return {
          id: `gen_triv_elem_name_${elem.name}_${Date.now()}`,
          category: 'Science & Nature',
          prompt,
          options: optionsList,
          correctOptionIndex: optionsList.indexOf(elem.name),
          explanation,
          type: 'multiple_choice',
        };
      }
    },

    // 5. World Geography Capitals & Landmarks
    () => {
      if (categoryFilter && categoryFilter !== 'History & Geography' && categoryFilter !== 'General Knowledge') return null;
      const place = WORLD_PLACES[Math.floor(Math.random() * WORLD_PLACES.length)];
      const others = WORLD_PLACES.filter((p) => p.country !== place.country);

      const askCapital = Math.random() > 0.4;
      if (askCapital) {
        const wrong = shuffle(others).slice(0, 3).map((p) => p.capital);
        const optionsList = shuffle([place.capital, ...wrong]);
        const prompt = lang === 'fil'
          ? `Ano ang kabisera (capital city) ng bansang ${place.country}?`
          : `What is the official capital city of ${place.country}?`;
        const explanation = `${place.capital} is the national capital of ${place.country}, located in ${place.continent}.`;

        return {
          id: `gen_triv_wcap_${place.country.toLowerCase()}_${Date.now()}`,
          category: 'History & Geography',
          prompt,
          options: optionsList,
          correctOptionIndex: optionsList.indexOf(place.capital),
          explanation,
          type: 'multiple_choice',
        };
      } else {
        const wrong = shuffle(others).slice(0, 3).map((p) => p.country);
        const optionsList = shuffle([place.country, ...wrong]);
        const prompt = lang === 'fil'
          ? `Saang bansa matatagpuan ang bantog na atraksyong "${place.wonder}"?`
          : `In which country would you find the world-famous landmark "${place.wonder}"?`;
        const explanation = `${place.wonder} is located in ${place.country} (${place.continent}).`;

        return {
          id: `gen_triv_wonder_${place.country.toLowerCase()}_${Date.now()}`,
          category: 'History & Geography',
          prompt,
          options: optionsList,
          correctOptionIndex: optionsList.indexOf(place.country),
          explanation,
          type: 'multiple_choice',
        };
      }
    },

    // 6. Animals & Biology Facts
    () => {
      if (categoryFilter && categoryFilter !== 'Science & Nature' && categoryFilter !== 'General Knowledge') return null;
      const animal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
      const others = ANIMALS.filter((a) => a.name !== animal.name);
      const wrong = shuffle(others).slice(0, 3).map((a) => lang === 'fil' ? a.nameFil : a.name);
      const correctName = lang === 'fil' ? animal.nameFil : animal.name;
      const optionsList = shuffle([correctName, ...wrong]);

      const prompt = lang === 'fil'
        ? `Aling hayop ang kilala dahil ito ay ${animal.factFil}?`
        : `Which animal is recognized for being ${animal.fact}?`;
      const explanation = `${animal.name} (${animal.classType}) is famous because it is ${animal.fact}.`;

      return {
        id: `gen_triv_anim_${animal.name.toLowerCase().replace(/\s/g, '')}_${Date.now()}`,
        category: 'Science & Nature',
        prompt,
        options: optionsList,
        correctOptionIndex: optionsList.indexOf(correctName),
        explanation,
        type: 'multiple_choice',
      };
    },
  ];

  while (generated.length < targetCount && attempts < maxAttempts) {
    attempts++;
    const chosenGen = generators[Math.floor(Math.random() * generators.length)];
    const q = chosenGen();
    if (!q) continue;

    // Deduplicate against currently generated set and recently used history
    const isDupInSession = generated.some((item) => item.prompt === q.prompt);
    if (isDupInSession) continue;

    const hash = q.prompt.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (recentHashes.has(hash)) continue;

    generated.push(q);
  }

  return generated;
}
