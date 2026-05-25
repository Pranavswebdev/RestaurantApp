import { useNavigate } from 'react-router-dom';
import useCartStore from '../stores/cartStore';

const ITEMS = [
  { key: 'home', label: 'Home', glyph: '🏠', path: '/home' },
  { key: 'cart', label: 'Cart', glyph: '🛒', path: '/cart' },
  { key: 'orders', label: 'Orders', glyph: '📋', path: '/orders' },
  { key: 'profile', label: 'Profile', glyph: '👤', path: '/profile' },
];

export default function BottomNav({ active = 'home' }) {
  const navigate = useNavigate();
  const cartCount = useCartStore((state) => state.getCartItemCount());

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white">
      <div className="mx-auto flex max-w-md items-stretch">
        {ITEMS.map((item) => {
          const isActive = item.key === active;
          return (
            <button
              key={item.key}
              onClick={() => navigate(item.path)}
              className={`relative flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors ${
                isActive ? 'text-primary' : 'text-gray-400 hover:text-primary'
              }`}
            >
              <span className="relative text-lg leading-none">
                {item.glyph}
                {item.key === 'cart' && cartCount > 0 && (
                  <span className="absolute -right-3 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </span>
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
