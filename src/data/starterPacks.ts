import type { QuestionPack } from '../types/game';
import { FILIPINO_BUILTIN_PACKS } from './filipinoPacks';

export { FILIPINO_BUILTIN_PACKS };

const CLASSIC_STARTER_PACKS: QuestionPack[] = [
  {
    id: 'pack-filipino-fiesta',
    title: 'Pinoy Fiesta & Filipino Family Life',
    description: 'Classic survey questions celebrating Filipino gatherings, Pinoy habits, karaoke, food, and culture.',
    category: 'Filipino Culture',
    isBuiltIn: true,
    createdAt: '2026-01-01T00:00:00.00Z',
    updatedAt: '2026-01-01T00:00:00.00Z',
    questions: [
      {
        id: 'ff-q1',
        prompt: 'Name a food you expect to see on the table at a Filipino family gathering or fiesta',
        category: 'Food',
        answers: [
          { id: 'ff-a1', text: 'Lechon (Roast Pig)', points: 42, acceptedVariants: ['lechon', 'lechon baboy', 'roast pig'], displayOrder: 1 },
          { id: 'ff-a2', text: 'Lumpia / Shanghai', points: 26, acceptedVariants: ['lumpia', 'lumpiang shanghai', 'spring rolls'], displayOrder: 2 },
          { id: 'ff-a3', text: 'Pancit', points: 16, acceptedVariants: ['pansit', 'pancit canton', 'bihon', 'noodles'], displayOrder: 3 },
          { id: 'ff-a4', text: 'Spaghetti (Sweet Style)', points: 10, acceptedVariants: ['spaghetti', 'pinoy spaghetti'], displayOrder: 4 },
          { id: 'ff-a5', text: 'Menudo / Kaldereta', points: 6, acceptedVariants: ['menudo', 'caldereta', 'kaldereta'], displayOrder: 5 },
        ],
      },
      {
        id: 'ff-q2',
        prompt: 'Name a classic song people love to sing at a Filipino Karaoke session',
        category: 'Entertainment',
        answers: [
          { id: 'ff-a6', text: 'My Way (Frank Sinatra)', points: 38, acceptedVariants: ['my way', 'sinatra'], displayOrder: 1 },
          { id: 'ff-a7', text: 'Total Eclipse of the Heart', points: 24, acceptedVariants: ['total eclipse', 'bonnie tyler'], displayOrder: 2 },
          { id: 'ff-a8', text: 'Touch by Touch', points: 18, acceptedVariants: ['touch by touch'], displayOrder: 3 },
          { id: 'ff-a9', text: 'Bakit Pa (Jessa Zaragoza)', points: 12, acceptedVariants: ['bakit pa'], displayOrder: 4 },
          { id: 'ff-a10', text: 'Dancing Queen / ABBA', points: 8, acceptedVariants: ['dancing queen', 'abba'], displayOrder: 5 },
        ],
      },
      {
        id: 'ff-q3',
        prompt: 'Name a pasalubong (souvenir treat) brought back from a trip in the Philippines',
        category: 'Travel',
        answers: [
          { id: 'ff-a11', text: 'Dried Mangoes (Cebu)', points: 40, acceptedVariants: ['dried mango', 'mangoes'], displayOrder: 1 },
          { id: 'ff-a12', text: 'Ube Jam / Good Shepherd', points: 25, acceptedVariants: ['ube', 'ube halaya', 'baguio ube'], displayOrder: 2 },
          { id: 'ff-a13', text: 'Otap / Piaya / Pastries', points: 18, acceptedVariants: ['piaya', 'otap', 'barquillos'], displayOrder: 3 },
          { id: 'ff-a14', text: 'Chicharon (Bulacan)', points: 11, acceptedVariants: ['chicharon', 'pork cracklings'], displayOrder: 4 },
          { id: 'ff-a15', text: 'Keychains / T-shirts', points: 6, acceptedVariants: ['keychain', 't-shirt', 'shirt', 'souvenir'], displayOrder: 5 },
        ],
      },
      {
        id: 'ff-q4',
        prompt: 'Name something every Filipino mom always warns her kids about',
        category: 'Family Life',
        answers: [
          { id: 'ff-a16', text: 'Bawal matulog na basa ang buhok (Wet hair = blindness)', points: 44, acceptedVariants: ['basa ang buhok', 'wet hair', 'bulag'], displayOrder: 1 },
          { id: 'ff-a17', text: 'Huwag magpa-ulan / Pasma (Catching sick/cold)', points: 26, acceptedVariants: ['pasma', 'ulan', 'rain'], displayOrder: 2 },
          { id: 'ff-a18', text: 'Huwag lumabas nang gabi / Madilim', points: 16, acceptedVariants: ['lumabas', 'gabi', 'late night'], displayOrder: 3 },
          { id: 'ff-a19', text: 'Mag-sweatshirt / Magsuot ng tsinelas (Wear slippers)', points: 14, acceptedVariants: ['tsinelas', 'slippers', 'jacket'], displayOrder: 4 },
        ],
      },
      {
        id: 'ff-q5',
        prompt: 'Name something found inside a typical Pinoy medicine cabinet or purse',
        category: 'Household',
        answers: [
          { id: 'ff-a20', text: 'White Flower / Katinko / Efficascent Oil', points: 46, acceptedVariants: ['white flower', 'katinko', 'efficascent', 'oil', 'ointment'], displayOrder: 1 },
          { id: 'ff-a21', text: 'Biogesic / Paracetamol', points: 28, acceptedVariants: ['biogesic', 'paracetamol', 'panadol'], displayOrder: 2 },
          { id: 'ff-a22', text: 'Vicks VapoRub', points: 14, acceptedVariants: ['vicks', 'vaporub'], displayOrder: 3 },
          { id: 'ff-a23', text: 'Alcohol (70% Isopropyl)', points: 12, acceptedVariants: ['alcohol', 'rubbing alcohol'], displayOrder: 4 },
        ],
      },
      {
        id: 'ff-q6',
        prompt: 'Name a popular Filipino breakfast staple',
        category: 'Food',
        answers: [
          { id: 'ff-a24', text: 'Sinangag (Garlic Fried Rice)', points: 38, acceptedVariants: ['sinangag', 'fried rice', 'garlic rice'], displayOrder: 1 },
          { id: 'ff-a25', text: 'Pandesal', points: 28, acceptedVariants: ['pan de sal', 'bread'], displayOrder: 2 },
          { id: 'ff-a26', text: 'Tapsilog / Tapa', points: 18, acceptedVariants: ['tapa', 'tapsilog', 'silog'], displayOrder: 3 },
          { id: 'ff-a27', text: 'Longganisa', points: 10, acceptedVariants: ['longanisa', 'sausage'], displayOrder: 4 },
          { id: 'ff-a28', text: 'Hot Coffee / Tsokolate', points: 6, acceptedVariants: ['coffee', 'tsokolate', 'kape'], displayOrder: 5 },
        ],
      },
      {
        id: 'ff-q7',
        prompt: 'Name a traditional Filipino street food on a stick',
        category: 'Food',
        answers: [
          { id: 'ff-a29', text: 'Isaw (Chicken Intestines)', points: 45, acceptedVariants: ['isaw', 'chicken isaw'], displayOrder: 1 },
          { id: 'ff-a30', text: 'Pork Barbecue', points: 25, acceptedVariants: ['bbq', 'barbecue', 'pork bbq'], displayOrder: 2 },
          { id: 'ff-a31', text: 'Fishball / Kikiam', points: 18, acceptedVariants: ['fishball', 'kikiam', 'squid ball'], displayOrder: 3 },
          { id: 'ff-a32', text: 'Betamax / Helmet', points: 12, acceptedVariants: ['betamax', 'helmet', 'adidas'], displayOrder: 4 },
        ],
      },
      {
        id: 'ff-q8',
        prompt: 'Name something you reuse as a food storage container in a Filipino home',
        category: 'Household',
        answers: [
          { id: 'ff-a33', text: 'Ice Cream Tub (Selecta / Magnolia)', points: 55, acceptedVariants: ['ice cream tub', 'ice cream container', 'selecta tub'], displayOrder: 1 },
          { id: 'ff-a34', text: 'Cookie / Biscuit Tin', points: 22, acceptedVariants: ['biscuit tin', 'cookie tin', 'danish tin'], displayOrder: 2 },
          { id: 'ff-a35', text: 'Peanut Butter / Mayonnaise Jar', points: 15, acceptedVariants: ['mayo jar', 'glass jar', 'peanut butter jar'], displayOrder: 3 },
          { id: 'ff-a36', text: 'Plastic Grocery Bags (Sando bag)', points: 8, acceptedVariants: ['sando bag', 'plastic bag'], displayOrder: 4 },
        ],
      },
    ],
  },
  {
    id: 'pack-family-life',
    title: 'Family Reunion & Daily Household',
    description: 'Relatable situations, family dynamics, household chores, excuses, and morning routines.',
    category: 'Family Life',
    isBuiltIn: true,
    createdAt: '2026-01-01T00:00:00.00Z',
    updatedAt: '2026-01-01T00:00:00.00Z',
    questions: [
      {
        id: 'fl-q1',
        prompt: 'Name a household chore that everyone tries to avoid doing',
        category: 'Household',
        answers: [
          { id: 'fl-a1', text: 'Washing the Dishes', points: 44, acceptedVariants: ['dishes', 'do the dishes'], displayOrder: 1 },
          { id: 'fl-a2', text: 'Cleaning the Bathroom / Toilet', points: 28, acceptedVariants: ['cleaning toilet', 'bathroom', 'scrubbing toilet'], displayOrder: 2 },
          { id: 'fl-a3', text: 'Taking Out the Trash', points: 14, acceptedVariants: ['garbage', 'trash', 'taking out garbage'], displayOrder: 3 },
          { id: 'fl-a4', text: 'Folding Laundry / Ironing', points: 10, acceptedVariants: ['ironing', 'folding clothes', 'laundry'], displayOrder: 4 },
          { id: 'fl-a5', text: 'Mopping / Vacuuming the Floor', points: 4, acceptedVariants: ['vacuuming', 'mopping', 'sweeping'], displayOrder: 5 },
        ],
      },
      {
        id: 'fl-q2',
        prompt: 'Name a common excuse someone gives for being late to a family dinner',
        category: 'Family Life',
        answers: [
          { id: 'fl-a6', text: 'Stuck in Heavy Traffic', points: 50, acceptedVariants: ['traffic', 'jam', 'car trouble'], displayOrder: 1 },
          { id: 'fl-a7', text: 'Had to finish something at work', points: 22, acceptedVariants: ['work', 'overtime', 'boss held me'], displayOrder: 2 },
          { id: 'fl-a8', text: 'Lost track of time / Overslept', points: 14, acceptedVariants: ['lost track of time', 'overslept', 'fell asleep'], displayOrder: 3 },
          { id: 'fl-a9', text: 'Could not find keys / wallet', points: 8, acceptedVariants: ['lost keys', 'keys', 'wallet'], displayOrder: 4 },
          { id: 'fl-a10', text: 'Getting ready took too long', points: 6, acceptedVariants: ['makeup', 'outfit', 'clothes'], displayOrder: 5 },
        ],
      },
      {
        id: 'fl-q3',
        prompt: 'Name something relatives ask you about as soon as you arrive at a reunion',
        category: 'Family Life',
        answers: [
          { id: 'fl-a11', text: 'When are you getting married / Having kids?', points: 46, acceptedVariants: ['marriage', 'married', 'boyfriend', 'girlfriend', 'kids'], displayOrder: 1 },
          { id: 'fl-a12', text: 'How is your job / career?', points: 24, acceptedVariants: ['job', 'work', 'salary', 'promotion'], displayOrder: 2 },
          { id: 'fl-a13', text: 'Did you gain / lose weight?', points: 18, acceptedVariants: ['weight', 'tumaba', 'pumayat', 'fat'], displayOrder: 3 },
          { id: 'fl-a14', text: 'How are your grades / school?', points: 12, acceptedVariants: ['school', 'grades', 'college'], displayOrder: 4 },
        ],
      },
      {
        id: 'fl-q4',
        prompt: 'Name something family members constantly fight over the remote control to watch',
        category: 'Entertainment',
        answers: [
          { id: 'fl-a15', text: 'Live Sports (Basketball / Football)', points: 42, acceptedVariants: ['sports', 'basketball', 'game'], displayOrder: 1 },
          { id: 'fl-a16', text: 'Drama / Teleserye / Telenovela', points: 28, acceptedVariants: ['drama', 'teleserye', 'soap opera', 'k-drama'], displayOrder: 2 },
          { id: 'fl-a17', text: 'Evening News', points: 18, acceptedVariants: ['news', 'balita'], displayOrder: 3 },
          { id: 'fl-a18', text: 'Cartoons / Kids Movies', points: 12, acceptedVariants: ['cartoons', 'anime', 'disney'], displayOrder: 4 },
        ],
      },
      {
        id: 'fl-q5',
        prompt: 'Name something you pack first when going on an overnight road trip',
        category: 'Travel',
        answers: [
          { id: 'fl-a19', text: 'Extra Clothes / Underwear', points: 40, acceptedVariants: ['clothes', 'underwear', 'extra shirt'], displayOrder: 1 },
          { id: 'fl-a20', text: 'Phone Charger / Power Bank', points: 30, acceptedVariants: ['charger', 'phone charger', 'power bank'], displayOrder: 2 },
          { id: 'fl-a21', text: 'Toothbrush & Toiletries', points: 18, acceptedVariants: ['toothbrush', 'toiletries', 'toothpaste'], displayOrder: 3 },
          { id: 'fl-a22', text: 'Road Snacks & Drinks', points: 12, acceptedVariants: ['snacks', 'chips', 'water'], displayOrder: 4 },
        ],
      },
      {
        id: 'fl-q6',
        prompt: 'Name something that always goes missing inside the living room',
        category: 'Household',
        answers: [
          { id: 'fl-a23', text: 'TV Remote Control', points: 52, acceptedVariants: ['remote', 'tv remote'], displayOrder: 1 },
          { id: 'fl-a24', text: 'Reading Glasses', points: 20, acceptedVariants: ['glasses', 'spectacles'], displayOrder: 2 },
          { id: 'fl-a25', text: 'Phone / Charger cable', points: 16, acceptedVariants: ['phone', 'mobile phone', 'charger'], displayOrder: 3 },
          { id: 'fl-a26', text: 'Keys / Car Keys', points: 12, acceptedVariants: ['keys', 'car keys'], displayOrder: 4 },
        ],
      },
    ],
  },
  {
    id: 'pack-food-comfort',
    title: 'Foodies, Snacks & Comfort Dining',
    description: 'Favorite comfort meals, late-night snacking, pizza toppings, and kitchen secrets.',
    category: 'Food',
    isBuiltIn: true,
    createdAt: '2026-01-01T00:00:00.00Z',
    updatedAt: '2026-01-01T00:00:00.00Z',
    questions: [
      {
        id: 'fd-q1',
        prompt: 'Name a popular topping you order on a pizza',
        category: 'Food',
        answers: [
          { id: 'fd-a1', text: 'Pepperoni', points: 45, acceptedVariants: ['pepperoni'], displayOrder: 1 },
          { id: 'fd-a2', text: 'Mushrooms', points: 22, acceptedVariants: ['mushroom'], displayOrder: 2 },
          { id: 'fd-a3', text: 'Extra Cheese / Mozzarella', points: 15, acceptedVariants: ['cheese', 'extra cheese'], displayOrder: 3 },
          { id: 'fd-a4', text: 'Pineapple (Hawaiian)', points: 10, acceptedVariants: ['pineapple', 'hawaiian'], displayOrder: 4 },
          { id: 'fd-a5', text: 'Sausage / Bacon', points: 8, acceptedVariants: ['sausage', 'bacon'], displayOrder: 5 },
        ],
      },
      {
        id: 'fd-q2',
        prompt: 'Name something people reach for when raiding the fridge at midnight',
        category: 'Food',
        answers: [
          { id: 'fd-a6', text: 'Ice Cream', points: 36, acceptedVariants: ['ice cream', 'gelato'], displayOrder: 1 },
          { id: 'fd-a7', text: 'Leftovers (Pizza / Takeout)', points: 28, acceptedVariants: ['leftover pizza', 'leftovers', 'cold pizza'], displayOrder: 2 },
          { id: 'fd-a8', text: 'Milk / Cold Beverage', points: 18, acceptedVariants: ['milk', 'soda', 'cold water'], displayOrder: 3 },
          { id: 'fd-a9', text: 'Cheese slices / sticks', points: 12, acceptedVariants: ['cheese', 'cheese slice'], displayOrder: 4 },
          { id: 'fd-a10', text: 'Fruit / Grapes / Berries', points: 6, acceptedVariants: ['fruit', 'apple', 'grapes'], displayOrder: 5 },
        ],
      },
      {
        id: 'fd-q3',
        prompt: 'Name a fast food side item you order with a burger',
        category: 'Food',
        answers: [
          { id: 'fd-a11', text: 'French Fries', points: 62, acceptedVariants: ['fries', 'french fries', 'potato fries'], displayOrder: 1 },
          { id: 'fd-a12', text: 'Onion Rings', points: 18, acceptedVariants: ['onion rings'], displayOrder: 2 },
          { id: 'fd-a13', text: 'Soda / Soft Drink', points: 12, acceptedVariants: ['coke', 'soda', 'drink'], displayOrder: 3 },
          { id: 'fd-a14', text: 'Chicken Nuggets / Tenders', points: 8, acceptedVariants: ['nuggets', 'tenders'], displayOrder: 4 },
        ],
      },
      {
        id: 'fd-q4',
        prompt: 'Name something you put on toast',
        category: 'Food',
        answers: [
          { id: 'fd-a15', text: 'Butter / Margarine', points: 48, acceptedVariants: ['butter', 'margarine'], displayOrder: 1 },
          { id: 'fd-a16', text: 'Jam / Jelly', points: 24, acceptedVariants: ['jam', 'jelly', 'strawberry jam'], displayOrder: 2 },
          { id: 'fd-a17', text: 'Peanut Butter', points: 16, acceptedVariants: ['peanut butter', 'pb'], displayOrder: 3 },
          { id: 'fd-a18', text: 'Avocado', points: 8, acceptedVariants: ['avocado'], displayOrder: 4 },
          { id: 'fd-a19', text: 'Nutella / Chocolate Spread', points: 4, acceptedVariants: ['nutella', 'chocolate'], displayOrder: 5 },
        ],
      },
      {
        id: 'fd-q5',
        prompt: 'Name a food you eat when you are feeling sick or have a cold',
        category: 'Food',
        answers: [
          { id: 'fd-a20', text: 'Chicken Soup / Arroz Caldo', points: 56, acceptedVariants: ['chicken soup', 'soup', 'arroz caldo', 'lugaw', 'congee'], displayOrder: 1 },
          { id: 'fd-a21', text: 'Hot Ginger Tea (Salabat)', points: 22, acceptedVariants: ['tea', 'ginger tea', 'salabat'], displayOrder: 2 },
          { id: 'fd-a22', text: 'Crackers / Toast', points: 12, acceptedVariants: ['crackers', 'saltines'], displayOrder: 3 },
          { id: 'fd-a23', text: 'Orange Juice / Citrus', points: 10, acceptedVariants: ['orange juice', 'citrus', 'lemon water'], displayOrder: 4 },
        ],
      },
    ],
  },
  {
    id: 'pack-fun-hypotheticals',
    title: 'Fun Hypotheticals & Quirky Situations',
    description: 'Hilarious scenarios, little lies people tell, and emergency quick-fixes.',
    category: 'Humor',
    isBuiltIn: true,
    createdAt: '2026-01-01T00:00:00.00Z',
    updatedAt: '2026-01-01T00:00:00.00Z',
    questions: [
      {
        id: 'hyp-q1',
        prompt: 'Name something people quickly shove into a closet when unexpected guests arrive',
        category: 'Household',
        answers: [
          { id: 'hyp-a1', text: 'Dirty Laundry / Clothes', points: 50, acceptedVariants: ['clothes', 'laundry', 'dirty clothes'], displayOrder: 1 },
          { id: 'hyp-a2', text: 'Piles of Mail & Paperwork', points: 20, acceptedVariants: ['papers', 'mail', 'documents'], displayOrder: 2 },
          { id: 'hyp-a3', text: 'Kids Toys', points: 16, acceptedVariants: ['toys', 'kid toys'], displayOrder: 3 },
          { id: 'hyp-a4', text: 'Shoes / Slippers', points: 14, acceptedVariants: ['shoes', 'slippers'], displayOrder: 4 },
        ],
      },
      {
        id: 'hyp-q2',
        prompt: 'Name a white lie people frequently tell to get out of a social plan',
        category: 'Social',
        answers: [
          { id: 'hyp-a5', text: 'I am not feeling well / Sick', points: 48, acceptedVariants: ['sick', 'headache', 'stomach ache'], displayOrder: 1 },
          { id: 'hyp-a6', text: 'I have a family emergency / dinner', points: 26, acceptedVariants: ['family emergency', 'family thing', 'family'], displayOrder: 2 },
          { id: 'hyp-a7', text: 'I have too much work / Deadlines', points: 16, acceptedVariants: ['work', 'busy with work'], displayOrder: 3 },
          { id: 'hyp-a8', text: 'My car won’t start / Battery died', points: 10, acceptedVariants: ['car trouble', 'car'], displayOrder: 4 },
        ],
      },
      {
        id: 'hyp-q3',
        prompt: 'Name something you pretend to understand just to avoid an awkward silence',
        category: 'Humor',
        answers: [
          { id: 'hyp-a9', text: 'A joke you didn’t actually get', points: 42, acceptedVariants: ['joke', 'the joke'], displayOrder: 1 },
          { id: 'hyp-a10', text: 'Cryptocurrency / Stock Market talk', points: 28, acceptedVariants: ['crypto', 'stocks', 'bitcoin'], displayOrder: 2 },
          { id: 'hyp-a11', text: 'Tech jargon / Coding terms', points: 18, acceptedVariants: ['coding', 'tech talk', 'computers'], displayOrder: 3 },
          { id: 'hyp-a12', text: 'Sports rules / Offside rule', points: 12, acceptedVariants: ['sports', 'offside'], displayOrder: 4 },
        ],
      },
      {
        id: 'hyp-q4',
        prompt: 'Name something you would never want to hear your pilot say over the intercom',
        category: 'Humor',
        answers: [
          { id: 'hyp-a13', text: 'Does anyone know how to fly a plane?', points: 46, acceptedVariants: ['can anyone fly', 'help fly'], displayOrder: 1 },
          { id: 'hyp-a14', text: 'Uh oh / Oops!', points: 26, acceptedVariants: ['oops', 'uh oh'], displayOrder: 2 },
          { id: 'hyp-a15', text: 'We are out of fuel', points: 16, acceptedVariants: ['no fuel', 'out of gas'], displayOrder: 3 },
          { id: 'hyp-a16', text: 'Brace for impact / Hold on tight', points: 12, acceptedVariants: ['brace', 'hold on'], displayOrder: 4 },
        ],
      },
    ],
  },
];

export const STARTER_PACKS: QuestionPack[] = [
  ...FILIPINO_BUILTIN_PACKS,
  ...CLASSIC_STARTER_PACKS,
];

