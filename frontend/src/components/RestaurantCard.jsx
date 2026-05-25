import { useNavigate } from 'react-router-dom';
import { getRestaurantVisual } from '../utils/cuisineVisuals';

const CARD_GRADIENTS = [
  'from-red-500 via-red-400 to-orange-400',
  'from-orange-500 via-yellow-400 to-yellow-300',
  'from-green-500 via-teal-400 to-blue-400',
  'from-pink-500 via-red-400 to-orange-400',
  'from-blue-500 via-indigo-400 to-purple-400',
  'from-purple-500 via-pink-400 to-red-400',
  'from-amber-500 via-orange-400 to-rose-400',
  'from-cyan-500 via-blue-400 to-indigo-400',
];

export default function RestaurantCard({ restaurant, index = 0 }) {
  const navigate = useNavigate();
  const visual = getRestaurantVisual(restaurant);
  const gradientClass = CARD_GRADIENTS[index % CARD_GRADIENTS.length];

  const delivery =
    restaurant.deliveryCharge === 0 ? 'Free' : `₹${restaurant.deliveryCharge ?? 40}`;

  return (
    <article
      onClick={() => navigate(`/restaurant/${restaurant._id}`)}
      style={{ animationDelay: `${Math.min(index, 9) * 40}ms` }}
      className="animate-rise cursor-pointer overflow-hidden rounded-3xl transition-all duration-300 card-shadow card-hover group"
    >
      {/* Hero Section with Gradient */}
      <div className={`relative flex h-32 items-center justify-center overflow-hidden bg-gradient-to-br ${gradientClass}`}>
        <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-20 bg-black" />

        <span className="relative z-10 text-6xl drop-shadow-xl transform transition-transform duration-300 group-hover:scale-110">
          {visual.glyph}
        </span>

        {/* Shine effect */}
        <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-30" style={{
          background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)',
        }} />

        {/* Status badge */}
        {!restaurant.isOpen && (
          <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-red-600 shadow-md">
            Closed
          </span>
        )}
      </div>

      {/* Info Section */}
      <div className="px-5 py-4 bg-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-display font-bold text-gray-900 text-lg mb-1">
              {restaurant.name}
            </h3>
            <p className="text-xs text-gray-600 font-medium">{restaurant.cuisine}</p>
          </div>
          {restaurant.rating && (
            <div className="ml-2 flex items-center gap-1 bg-orange-100 rounded-full px-2.5 py-1">
              <span className="text-sm font-bold text-orange-600">⭐</span>
              <span className="text-sm font-bold text-orange-600">{restaurant.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-3 mt-3 text-xs text-gray-700 font-medium">
          <span className="flex items-center gap-1">
            <span>🚗</span> {restaurant.deliveryTime ?? 30} min
          </span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span>{delivery} delivery</span>
        </div>
      </div>
    </article>
  );
}
