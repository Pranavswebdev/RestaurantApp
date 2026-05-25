import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { restaurantService } from '../services/restaurantService';
import RestaurantCard from '../components/RestaurantCard';
import CuisineChip from '../components/CuisineChip';
import BottomNav from '../components/BottomNav';

const CUISINES = ['All', 'Italian', 'Pizza', 'American', 'Burgers', 'Indian', 'Biryani', 'Chinese', 'Healthy', 'Salads', 'Mexican', 'Japanese', 'Sushi', 'Thai', 'Mediterranean', 'Greek', 'Desserts', 'Bakery'];

const OFFERS = [
  { title: '50% OFF', sub: 'up to ₹100 on first order', code: 'CODE: FRESH50', glyph: '🎉', grad: 'from-orange-500 to-red-500' },
  { title: 'Free Delivery', sub: 'on orders above ₹199', code: 'NO CODE NEEDED', glyph: '🚚', grad: 'from-green-500 to-teal-500' },
  { title: '₹125 OFF', sub: 'pay with UPI', code: 'CODE: UPI125', glyph: '💳', grad: 'from-indigo-500 to-purple-500' },
];

const FEATURES = [
  { label: 'Fast Delivery', glyph: '⚡' },
  { label: 'Live Tracking', glyph: '📍' },
  { label: 'Best Prices', glyph: '💰' },
];

export default function Home() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const [restaurants, setRestaurants] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRestaurants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const filters = {};
      if (selectedCuisine !== 'All') filters.cuisine = selectedCuisine;
      if (searchQuery.trim()) filters.search = searchQuery.trim();
      const data = await restaurantService.getRestaurants(filters);
      setRestaurants(data);
    } catch (err) {
      setError(err.message || 'Failed to load restaurants');
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCuisine, searchQuery]);

  useEffect(() => {
    const t = setTimeout(fetchRestaurants, 300);
    return () => clearTimeout(t);
  }, [fetchRestaurants]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="mx-auto max-w-7xl px-5 py-4">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <span className="text-3xl animate-float">🍽️</span>
              <h1 className="font-display text-2xl font-bold text-gray-900">FoodRush</h1>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-full transition-colors"
            >
              Log out
            </button>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Search restaurants, dishes…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-gray-900 font-medium outline-none transition focus:border-orange-400 focus:bg-white"
              />
            </div>

            <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
              {CUISINES.map((c) => (
                <CuisineChip
                  key={c}
                  label={c}
                  isSelected={selectedCuisine === c}
                  onClick={() => setSelectedCuisine(c)}
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white pt-6 pb-4">
        <div className="mx-auto max-w-7xl px-5">
          <h2 className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-1">Welcome to</h2>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            The neighbourhood, <span className="text-orange-600">delivered hot.</span>
          </h1>
        </div>
      </section>

      {/* Offer banners */}
      <section className="bg-white pb-4">
        <div className="no-scrollbar mx-auto flex max-w-7xl gap-3 overflow-x-auto px-5">
          {OFFERS.map((o) => (
            <div
              key={o.title}
              className={`flex min-w-[260px] items-center gap-3 rounded-2xl bg-gradient-to-br ${o.grad} p-4 text-white shadow-md`}
            >
              <span className="text-4xl">{o.glyph}</span>
              <div>
                <p className="text-lg font-extrabold leading-tight">{o.title}</p>
                <p className="text-sm font-medium text-white/90">{o.sub}</p>
                <p className="mt-1 text-[11px] uppercase tracking-wide text-white/70">{o.code}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature highlights */}
      <section className="bg-white pb-2">
        <div className="mx-auto grid max-w-7xl grid-cols-3 gap-3 px-5">
          {FEATURES.map((f) => (
            <div key={f.label} className="rounded-2xl bg-orange-50 p-3 text-center">
              <div className="text-2xl">{f.glyph}</div>
              <p className="mt-1 text-xs font-semibold text-gray-700">{f.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-5 py-7">
        {loading && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-3xl border border-line bg-cream">
                <div className="skeleton h-44 w-full" />
                <div className="space-y-3 p-5">
                  <div className="skeleton h-6 w-2/3 rounded-full" />
                  <div className="skeleton h-4 w-1/2 rounded-full" />
                  <div className="skeleton h-4 w-1/3 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-ember/30 bg-ember/10 p-5 text-ember">
            <p className="font-semibold">Couldn’t load restaurants</p>
            <p className="mt-1 text-sm opacity-80">{error}</p>
          </div>
        )}

        {!loading && !error && restaurants.length === 0 && (
          <div className="flex flex-col items-center py-20 text-center">
            <span className="text-6xl opacity-60">🍂</span>
            <p className="mt-4 font-display text-2xl text-ink">Nothing on the menu</p>
            <p className="mt-1 text-muted">Try a different cuisine or search.</p>
          </div>
        )}

        {!loading && !error && restaurants.length > 0 && (
          <>
            <p className="mb-5 text-sm font-medium text-muted">
              <span className="font-bold text-ink">{restaurants.length}</span> place{restaurants.length !== 1 ? 's' : ''} ready to deliver
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {restaurants.map((r, i) => (
                <RestaurantCard key={r._id} restaurant={r} index={i} />
              ))}
            </div>
          </>
        )}
      </main>

      <BottomNav active="home" />
    </div>
  );
}
