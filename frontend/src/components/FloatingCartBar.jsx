import { useNavigate } from 'react-router-dom';
import useCartStore from '../stores/cartStore';

export default function FloatingCartBar() {
  const navigate = useNavigate();
  const itemCount = useCartStore((state) => state.getCartItemCount());
  const cartTotal = useCartStore((state) => state.getCartTotal());

  if (itemCount === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-20 z-30 mx-auto max-w-3xl px-5">
      <button
        onClick={() => navigate('/cart')}
        className="animate-rise flex w-full items-center justify-between rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 px-5 py-4 text-white shadow-[0_20px_40px_-16px_rgba(231,76,60,0.6)] transition-transform active:scale-[0.99]"
      >
        <span className="flex items-center gap-2 font-semibold">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-bold text-primary">
            {itemCount}
          </span>
          {itemCount} item{itemCount !== 1 ? 's' : ''} added
        </span>
        <span className="flex items-center gap-2 font-bold">
          ₹{cartTotal.toFixed(0)}
          <span>View cart →</span>
        </span>
      </button>
    </div>
  );
}
