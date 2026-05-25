import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRestaurantImage } from '../utils/foodImages';
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
  const [imgFailed, setImgFailed] = useState(false);
  const visual = getRestaurantVisual(restaurant);
  const gradientClass = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
  const cuisines = restaurant.cuisines || [];
  const imageUrl = getRestaurantImage(restaurant, 800);

  const delivery =
    restaurant.deliveryCharge === 0 ? 'Free' : `₹${restaurant.deliveryCharge ?? 40}`;

  return (
    <article
      onClick={() => navigate(`/restaurant/${restaurant._id}`)}
      style={{ animationDelay: `${Math.min(index, 9) * 40}ms` }}
      className="animate-rise cursor-pointer overflow-hidden rounded-3xl bg-white transition-all duration-300 card-shadow card-hover group"
    >
      {/* Hero image */}
      <div className="relative h-40 overflow-hidden">
        {imgFailed ? (
          <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradientClass}`}>
            <span className="text-6xl drop-shadow-xl">{visual.glyph}</span>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={restaurant.name}
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}

        {/* Bottom gradient scrim for legibility */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Delivery time pill */}
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-gray-900 shadow-sm">
          🚗 {restaurant.deliveryTime ?? 30} min
        </span>

        {!restaurant.isOpen && (
          <span className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white">
            Closed
          </span>
        )}
      </div>

      {/* Info */}
      <div className="px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-gray-900 text-base leading-tight">{restaurant.name}</h3>
          {restaurant.rating != null && (
            <div className="flex shrink-0 items-center gap-1 rounded-md bg-green-600 px-1.5 py-0.5">
              <span className="text-xs font-bold text-white">{restaurant.rating.toFixed(1)}</span>
              <span className="text-[10px] text-white">★</span>
            </div>
          )}
        </div>
        <p className="mt-1 truncate text-sm text-gray-500">{cuisines.join(', ')}</p>
        <p className="mt-1 text-xs text-gray-400">{delivery} delivery · ₹{restaurant.minOrder ?? 0} min</p>
      </div>
    </article>
  );
}
