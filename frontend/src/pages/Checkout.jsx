import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../stores/cartStore';
import useOrderStore from '../stores/orderStore';

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', sub: 'Pay via any UPI app', glyph: '📱' },
  { id: 'card', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay', glyph: '💳' },
  { id: 'cod', label: 'Cash on Delivery', sub: 'Pay when it arrives', glyph: '💵' },
];

export default function Checkout() {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.getCartTotal());
  const clearCart = useCartStore((state) => state.clearCart);
  const placeOrder = useOrderStore((state) => state.placeOrder);

  const [address, setAddress] = useState({
    label: 'Home',
    line: '42, MG Road, Indiranagar',
    city: 'Bengaluru 560038',
  });
  const [editingAddr, setEditingAddr] = useState(false);
  const [payment, setPayment] = useState('upi');
  const [placing, setPlacing] = useState(false);

  const deliveryFee = items.length ? 40 : 0;
  const taxes = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + taxes;

  // Redirect to cart only if it's empty AND we're not mid-placement
  // (placing clears the cart, which would otherwise bounce us here).
  useEffect(() => {
    if (items.length === 0 && !placing) navigate('/cart', { replace: true });
  }, [items.length, placing, navigate]);

  const handlePlaceOrder = () => {
    setPlacing(true);
    setTimeout(() => {
      const id = placeOrder({
        items: items.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity })),
        subtotal,
        deliveryFee,
        taxes,
        total,
        address,
        payment,
        restaurantId: useCartStore.getState().restaurantId,
      });
      clearCart();
      navigate(`/order/${id}`, { replace: true });
    }, 900);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-40">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-white px-5 py-4">
        <button onClick={() => navigate(-1)} className="text-xl font-bold text-ink">←</button>
        <h1 className="text-xl font-bold text-ink">Checkout</h1>
      </header>

      <div className="mx-auto max-w-2xl space-y-4 px-4 pt-4">
        {/* Delivery address */}
        <section className="rounded-3xl bg-white p-5 card-shadow">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold text-ink">📍 Delivery Address</h2>
            <button
              onClick={() => setEditingAddr((v) => !v)}
              className="text-sm font-semibold text-primary"
            >
              {editingAddr ? 'Done' : 'Change'}
            </button>
          </div>
          {editingAddr ? (
            <div className="space-y-2">
              <input
                value={address.line}
                onChange={(e) => setAddress({ ...address, line: e.target.value })}
                className="w-full rounded-xl border border-line bg-gray-50 px-4 py-2.5 text-ink outline-none focus:border-primary"
              />
              <input
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="w-full rounded-xl border border-line bg-gray-50 px-4 py-2.5 text-ink outline-none focus:border-primary"
              />
            </div>
          ) : (
            <div>
              <p className="inline-block rounded-md bg-orange-100 px-2 py-0.5 text-xs font-bold text-primary">
                {address.label}
              </p>
              <p className="mt-1 text-sm text-ink">{address.line}</p>
              <p className="text-sm text-muted">{address.city}</p>
            </div>
          )}
        </section>

        {/* Payment method */}
        <section className="rounded-3xl bg-white p-5 card-shadow">
          <h2 className="mb-3 font-bold text-ink">💳 Payment Method</h2>
          <div className="space-y-2">
            {PAYMENT_METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => setPayment(m.id)}
                className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition ${
                  payment === m.id ? 'border-primary bg-orange-50' : 'border-line bg-white'
                }`}
              >
                <span className="text-2xl">{m.glyph}</span>
                <span className="flex-1">
                  <span className="block font-semibold text-ink">{m.label}</span>
                  <span className="block text-xs text-muted">{m.sub}</span>
                </span>
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    payment === m.id ? 'border-primary' : 'border-gray-300'
                  }`}
                >
                  {payment === m.id && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Bill */}
        <section className="rounded-3xl bg-white p-5 card-shadow">
          <h2 className="mb-3 font-bold text-ink">🧾 Bill Details</h2>
          <Row label={`Item total (${items.length} item${items.length !== 1 ? 's' : ''})`} value={subtotal} />
          <Row label="Delivery fee" value={deliveryFee} />
          <Row label="Taxes & charges" value={taxes} />
          <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
            <span className="font-bold text-ink">To Pay</span>
            <span className="font-bold text-ink">₹{total}</span>
          </div>
        </section>
      </div>

      {/* Sticky place-order bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white px-5 py-3">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted">To Pay</p>
            <p className="text-lg font-bold text-ink">₹{total}</p>
          </div>
          <button
            onClick={handlePlaceOrder}
            disabled={placing}
            className="flex-1 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 py-3.5 text-center font-bold text-white shadow-lg shadow-orange-300/40 active:scale-[0.98] disabled:opacity-60"
          >
            {placing ? 'Placing order…' : `Place Order · ₹${total}`}
          </button>
        </div>
      </div>
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
