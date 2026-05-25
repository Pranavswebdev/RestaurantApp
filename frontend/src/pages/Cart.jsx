import { useNavigate } from 'react-router-dom';
import useCartStore from '../stores/cartStore';
import { getFoodImage } from '../utils/foodImages';
import BottomNav from '../components/BottomNav';

export default function Cart() {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const subtotal = useCartStore((state) => state.getCartTotal());

  const deliveryFee = items.length ? 40 : 0;
  const taxes = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + taxes;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white pb-24">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-white px-5 py-4">
          <button onClick={() => navigate(-1)} className="text-xl font-bold text-ink">←</button>
          <h1 className="text-xl font-bold text-ink">Your Cart</h1>
        </header>
        <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
          <div className="mb-4 text-6xl">🛒</div>
          <h2 className="text-xl font-bold text-ink">Your cart is empty</h2>
          <p className="mt-2 text-sm text-muted">Add some delicious food to get started</p>
          <button
            onClick={() => navigate('/home')}
            className="mt-6 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 px-8 py-3 font-bold text-white shadow-lg shadow-orange-300/40"
          >
            Browse restaurants
          </button>
        </div>
        <BottomNav active="cart" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-44">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-white px-5 py-4">
        <button onClick={() => navigate(-1)} className="text-xl font-bold text-ink">←</button>
        <h1 className="text-xl font-bold text-ink">Your Cart</h1>
      </header>

      {/* Items */}
      <div className="mx-auto max-w-2xl px-4 pt-4">
        <div className="rounded-3xl bg-white p-4 card-shadow">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 border-b border-line py-3 last:border-0">
              <img
                src={getFoodImage(item.name, [], 200)}
                alt={item.name}
                className="h-14 w-14 shrink-0 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-ink truncate">{item.name}</p>
                <p className="text-sm text-muted">₹{item.price}</p>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-primary bg-white px-3 py-1.5">
                <button onClick={() => removeItem(item.id)} className="text-lg font-bold leading-none text-primary">−</button>
                <span className="w-4 text-center font-bold text-primary">{item.quantity}</span>
                <button onClick={() => addItem(item)} className="text-lg font-bold leading-none text-primary">+</button>
              </div>
            </div>
          ))}
        </div>

        {/* Bill summary */}
        <div className="mt-4 rounded-3xl bg-white p-5 card-shadow">
          <h2 className="mb-3 font-bold text-ink">Bill Details</h2>
          <Row label="Item total" value={subtotal} />
          <Row label="Delivery fee" value={deliveryFee} />
          <Row label="Taxes & charges" value={taxes} />
          <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
            <span className="font-bold text-ink">To Pay</span>
            <span className="font-bold text-ink">₹{total}</span>
          </div>
        </div>
      </div>

      {/* Sticky checkout bar */}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-line bg-white px-5 py-3">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted">Total</p>
            <p className="text-lg font-bold text-ink">₹{total}</p>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="flex-1 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 py-3.5 text-center font-bold text-white shadow-lg shadow-orange-300/40 active:scale-[0.98]"
          >
            Proceed to Checkout →
          </button>
        </div>
      </div>

      <BottomNav active="cart" />
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between py-1 text-sm">
      <span className="text-muted">{label}</span>
      <span className="font-medium text-ink">₹{value}</span>
    </div>
  );
}
