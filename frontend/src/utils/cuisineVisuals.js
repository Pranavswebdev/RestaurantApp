// Indigo/purple gradient banners + a cuisine glyph, matching the approved
// "Electric Indigo" mock. Banners stay within the brand palette; the glyph
// gives each restaurant a recognizable, always-rendered visual.

const GLYPHS = {
  Pizza: '🍕', Italian: '🍝', American: '🍔', Burgers: '🍔',
  Indian: '🍛', Biryani: '🍚', Chinese: '🥡', Healthy: '🥗',
  Salads: '🥬', Mexican: '🌮', Japanese: '🍣', Sushi: '🍣',
  Thai: '🍜', Mediterranean: '🥙', Greek: '🫒', Desserts: '🍰',
  Bakery: '🥐',
};

const GRADIENTS = [
  ['#4F46E5', '#7C3AED'],
  ['#7C3AED', '#4C1D95'],
  ['#6366F1', '#4F46E5'],
  ['#8B5CF6', '#6D28D9'],
];

function hash(str = '') {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

export function getRestaurantVisual(restaurant) {
  const cuisines = restaurant?.cuisines || [];
  let glyph = '🍽️';
  for (const c of cuisines) {
    if (GLYPHS[c]) { glyph = GLYPHS[c]; break; }
  }
  const [from, to] = GRADIENTS[hash(restaurant?.name || cuisines[0] || '') % GRADIENTS.length];
  return { glyph, from, to };
}

export function gradientStyle(visual) {
  return { backgroundImage: `linear-gradient(135deg, ${visual.from} 0%, ${visual.to} 100%)` };
}
