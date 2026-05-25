import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { restaurantService } from '../services/restaurantService';
import MenuItemCard from '../components/MenuItemCard';
import CategoryTabs from '../components/CategoryTabs';
import FloatingCartBar from '../components/FloatingCartBar';
import BottomNav from '../components/BottomNav';
import useCartStore from '../stores/cartStore';
import { getRestaurantImage } from '../utils/foodImages';

export default function Restaurant() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const categorySectionRefs = useRef({});

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        const data = await restaurantService.getRestaurantById(id);
        setRestaurant(data);
        if (data.categories && data.categories.length > 0) {
          setActiveCategory(data.categories[0].id);
        }
        const { restaurantId: cartRestaurantId, clearCart, setRestaurant: setCartRestaurant } =
          useCartStore.getState();
        if (cartRestaurantId && cartRestaurantId !== id) clearCart();
        if (cartRestaurantId !== id) setCartRestaurant(id);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [id]);

  const handleCategorySelect = (categoryId) => {
    setActiveCategory(categoryId);
    categorySectionRefs.current[categoryId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="skeleton h-56 w-full" />
        <div className="mx-auto max-w-3xl space-y-4 p-6">
          <div className="skeleton h-9 w-2/3 rounded-full" />
          <div className="skeleton h-4 w-1/2 rounded-full" />
          <div className="skeleton h-24 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen px-5 py-8">
        <button onClick={() => navigate(-1)} className="mb-4 text-sm font-semibold text-saffron">← Back</button>
        <div className="rounded-2xl border border-ember/30 bg-ember/10 p-5 text-ember">
          {error || 'Restaurant not found'}
        </div>
      </div>
    );
  }

  const heroImage = getRestaurantImage(restaurant, 1000);

  return (
    <div className="min-h-screen pb-36">
      {/* Hero */}
      <div className="relative h-56 overflow-hidden sm:h-64">
        <img src={heroImage} alt={restaurant.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/20" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-paper to-transparent" />

        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-lg font-bold text-ink shadow-lg backdrop-blur transition hover:scale-105"
        >
          ←
        </button>
      </div>

      {/* Info */}
      <div className="mx-auto -mt-8 max-w-3xl px-5">
        <div className="animate-rise rounded-3xl border border-line bg-cream p-6 shadow-[0_20px_44px_-26px_rgba(33,25,19,0.4)]">
          <div className="flex items-start justify-between gap-3">
            <h1 className="font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
              {restaurant.name}
            </h1>
            <div className="flex shrink-0 items-center gap-1 rounded-full bg-veg/10 px-3 py-1.5">
              <span className="text-honey">★</span>
              <span className="font-bold text-ink">{restaurant.rating}</span>
            </div>
          </div>

          <p className="mt-1.5 text-sm text-muted">{restaurant.cuisines?.join(' · ')}</p>

          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl bg-paper py-3">
              <p className="font-display text-lg font-semibold text-ink">{restaurant.deliveryTime}′</p>
              <p className="text-xs text-muted">delivery</p>
            </div>
            <div className="rounded-2xl bg-paper py-3">
              <p className="font-display text-lg font-semibold text-ink">₹{restaurant.deliveryCharge}</p>
              <p className="text-xs text-muted">fee</p>
            </div>
            <div className="rounded-2xl bg-paper py-3">
              <p className="font-display text-lg font-semibold text-ink">₹{restaurant.minOrder}</p>
              <p className="text-xs text-muted">min order</p>
            </div>
          </div>

          {!restaurant.isOpen && (
            <div className="mt-4 rounded-2xl border border-ember/30 bg-ember/10 py-2.5 text-center text-sm font-bold uppercase tracking-wide text-ember">
              Currently closed
            </div>
          )}
        </div>
      </div>

      {restaurant.categories?.length > 0 && (
        <div className="mt-5">
          <CategoryTabs
            categories={restaurant.categories}
            activeCategory={activeCategory}
            onCategorySelect={handleCategorySelect}
          />
        </div>
      )}

      <div className="mx-auto max-w-3xl px-5 py-5">
        {restaurant.categories?.map((category) => (
          <section
            key={category.id}
            ref={(el) => { categorySectionRefs.current[category.id] = el; }}
            className="mb-9 scroll-mt-24"
          >
            <h2 className="mb-2 font-display text-2xl font-bold text-ink">{category.name}</h2>
            <div className="divide-y divide-line rounded-3xl border border-line bg-white px-5 pb-3">
              {category.items?.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={{ id: item.id, ...item }}
                  cuisines={restaurant.cuisines}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <FloatingCartBar />
      <BottomNav active="home" />
    </div>
  );
}
