// Real food photography from Unsplash. We resolve an image by matching the
// dish name against keywords first, then fall back to cuisine, then a generic
// food shot. All URLs are stable Unsplash CDN photos with sizing params.

const U = (id, w = 600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

// Keyword -> Unsplash photo id. Order matters (first match wins).
const KEYWORD_IMAGES = [
  [['margherita', 'pizza'], '1513104890138-7c749659a591'],
  [['pepperoni'], '1628840042765-356cda07504e'],
  [['burger', 'cheeseburger'], '1568901346375-23c9450c58cd'],
  [['fries'], '1573080496219-bb080dd4f877'],
  [['biryani'], '1563379091339-03b21ab4a4f8'],
  [['curry', 'masala', 'tikka', 'paneer'], '1585937421612-70a008356fbe'],
  [['naan', 'roti', 'bread', 'garlic'], '1626700051175-6818013e1d4f'],
  [['noodle', 'ramen', 'chow', 'hakka', 'lo mein'], '1585032226651-759b368d7246'],
  [['dumpling', 'momo', 'dim sum', 'wonton'], '1496116218417-1a781b1c416c'],
  [['sushi', 'roll', 'maki', 'sashimi', 'nigiri'], '1579871494447-9811cf80d66c'],
  [['taco', 'burrito', 'quesadilla', 'nacho'], '1565299624946-b28f40a0ae38'],
  [['salad', 'caesar', 'greens', 'bowl'], '1512621776951-a57141f2eefd'],
  [['pad thai', 'thai', 'tom yum'], '1559314809-0d155014e29e'],
  [['falafel', 'hummus', 'shawarma', 'kebab', 'mediterranean', 'greek'], '1540420773420-3366772f4999'],
  [['cake', 'dessert', 'brownie', 'pastry', 'sweet'], '1551024601-bec78aea704b'],
  [['ice cream', 'gelato'], '1497034825429-c343d7c6a68f'],
  [['coffee', 'latte', 'cappuccino'], '1509042239860-f550ce710b93'],
  [['croissant', 'bakery', 'muffin', 'donut'], '1509440159596-0249088772ff'],
  [['soup', 'broth'], '1547592180-85f173990554'],
  [['chicken', 'wings', 'bbq', 'grill'], '1532550907401-a500c9a57435'],
  [['rice', 'fried rice'], '1603133872878-684f208fb84b'],
  [['pasta', 'spaghetti', 'italian'], '1551183053-bf91a1d81141'],
  [['sandwich', 'sub', 'wrap'], '1528735602780-2552fd46c7af'],
];

const CUISINE_IMAGES = {
  Pizza: '1513104890138-7c749659a591',
  Italian: '1551183053-bf91a1d81141',
  American: '1568901346375-23c9450c58cd',
  Burgers: '1568901346375-23c9450c58cd',
  Indian: '1585937421612-70a008356fbe',
  Biryani: '1563379091339-03b21ab4a4f8',
  Chinese: '1585032226651-759b368d7246',
  Healthy: '1512621776951-a57141f2eefd',
  Salads: '1512621776951-a57141f2eefd',
  Mexican: '1565299624946-b28f40a0ae38',
  Japanese: '1579871494447-9811cf80d66c',
  Sushi: '1579871494447-9811cf80d66c',
  Thai: '1559314809-0d155014e29e',
  Mediterranean: '1540420773420-3366772f4999',
  Greek: '1540420773420-3366772f4999',
  Desserts: '1551024601-bec78aea704b',
  Bakery: '1509440159596-0249088772ff',
};

const GENERIC = '1504674900247-0877df9cc836';

export function getFoodImage(name = '', cuisines = [], width = 600) {
  const lower = name.toLowerCase();
  for (const [keywords, id] of KEYWORD_IMAGES) {
    if (keywords.some((k) => lower.includes(k))) return U(id, width);
  }
  for (const c of cuisines) {
    if (CUISINE_IMAGES[c]) return U(CUISINE_IMAGES[c], width);
  }
  return U(GENERIC, width);
}

export function getRestaurantImage(restaurant, width = 800) {
  const cuisines = restaurant?.cuisines || [];
  // Bias the hero toward the restaurant's primary cuisine.
  return getFoodImage(cuisines[0] || restaurant?.name || '', cuisines, width);
}
