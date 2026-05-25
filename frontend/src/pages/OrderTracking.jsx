import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useOrderStore, { ORDER_STAGES } from '../stores/orderStore';

const STAGE_META = {
  confirmed: { title: 'Order Confirmed', sub: 'Restaurant has accepted your order', glyph: '✅' },
  preparing: { title: 'Preparing your food', sub: 'The chef is working their magic', glyph: '👨‍🍳' },
  on_the_way: { title: 'Out for delivery', sub: 'Your rider is on the way', glyph: '🛵' },
  delivered: { title: 'Delivered', sub: 'Enjoy your meal!', glyph: '🎉' },
};

// Auto-advance through the stages for a lively (mocked) tracking demo.
const STEP_MS = 7000;

export default function OrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = useOrderStore((state) => state.getOrder(id));
  const advanceStatus = useOrderStore((state) => state.advanceStatus);

  const [secondsLeft, setSecondsLeft] = useState((order?.etaMinutes ?? 25) * 60);

  const currentIndex = order ? ORDER_STAGES.indexOf(order.status) : 0;
  const isDelivered = order?.status === 'delivered';

  // Auto-advance the order status.
  useEffect(() => {
    if (!order || isDelivered) return;
    const t = setTimeout(() => advanceStatus(order.id), STEP_MS);
    return () => clearTimeout(t);
  }, [order, isDelivered, advanceStatus]);

  // Countdown timer.
  useEffect(() => {
    if (isDelivered) return;
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [isDelivered]);

  if (!order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 text-center">
        <div className="text-5xl">🔍</div>
        <p className="font-semibold text-ink">Order not found</p>
        <button onClick={() => navigate('/home')} className="rounded-xl bg-primary px-6 py-2.5 font-bold text-white">
          Back to Home
        </button>
      </div>
    );
  }

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const progressPct = (currentIndex / (ORDER_STAGES.length - 1)) * 100;
  const meta = STAGE_META[order.status];

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <header className="flex items-center gap-3 bg-white px-5 py-4 card-shadow">
        <button onClick={() => navigate('/home')} className="text-xl font-bold text-ink">←</button>
        <div>
          <h1 className="font-bold text-ink">Order #{order.id}</h1>
          <p className="text-xs text-muted">Live tracking</p>
        </div>
      </header>

      {/* ETA hero */}
      <div className="bg-gradient-to-br from-orange-400 to-red-500 px-6 py-8 text-center text-white">
        <div className="mb-2 text-6xl animate-bob">{meta.glyph}</div>
        <h2 className="text-2xl font-bold">{meta.title}</h2>
        <p className="mt-1 text-sm text-white/90">{meta.sub}</p>
        {!isDelivered ? (
          <div className="mt-4 inline-block rounded-2xl bg-white/20 px-5 py-2 backdrop-blur">
            <p className="text-xs text-white/80">Arriving in</p>
            <p className="text-2xl font-bold tabular-nums">
              {mins}:{String(secs).padStart(2, '0')}
            </p>
          </div>
        ) : (
          <div className="mt-4 inline-block rounded-2xl bg-white/20 px-5 py-2 backdrop-blur">
            <p className="font-bold">Delivered just now 🎊</p>
          </div>
        )}
      </div>

      {/* Progress timeline */}
      <div className="mx-auto max-w-2xl px-5 py-6">
        <div className="rounded-3xl bg-white p-6 card-shadow">
          {/* Progress bar */}
          <div className="relative mb-6 h-1.5 rounded-full bg-gray-200">
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="space-y-5">
            {ORDER_STAGES.map((stage, i) => {
              const done = i < currentIndex;
              const active = i === currentIndex;
              return (
                <div key={stage} className="flex items-center gap-4">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg transition ${
                      done || active
                        ? 'bg-gradient-to-br from-orange-400 to-red-500 text-white'
                        : 'bg-gray-100 text-gray-400'
                    } ${active && !isDelivered ? 'animate-glow' : ''}`}
                  >
                    {done ? '✓' : STAGE_META[stage].glyph}
                  </span>
                  <div>
                    <p className={`font-semibold ${done || active ? 'text-ink' : 'text-gray-400'}`}>
                      {STAGE_META[stage].title}
                    </p>
                    <p className="text-xs text-muted">{STAGE_META[stage].sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery partner (mock) */}
        {order.status === 'on_the_way' && (
          <div className="mt-4 flex items-center gap-3 rounded-3xl bg-white p-4 card-shadow">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-2xl">🧑‍✈️</div>
            <div className="flex-1">
              <p className="font-semibold text-ink">Rahul is delivering your order</p>
              <p className="text-xs text-muted">Vehicle · KA 01 AB 1234</p>
            </div>
            <button className="rounded-full bg-green-500 px-4 py-2 text-sm font-bold text-white">Call</button>
          </div>
        )}

        {/* Order summary */}
        <div className="mt-4 rounded-3xl bg-white p-5 card-shadow">
          <h3 className="mb-3 font-bold text-ink">Order Summary</h3>
          {order.items.map((it, i) => (
            <div key={i} className="flex justify-between py-1 text-sm">
              <span className="text-ink">{it.quantity} × {it.name}</span>
              <span className="text-muted">₹{it.price * it.quantity}</span>
            </div>
          ))}
          <div className="mt-3 flex justify-between border-t border-line pt-3 font-bold text-ink">
            <span>Total Paid</span>
            <span>₹{order.total}</span>
          </div>
          <p className="mt-2 text-xs text-muted">
            Paid via {order.payment === 'cod' ? 'Cash on Delivery' : order.payment.toUpperCase()} · {order.address.line}
          </p>
        </div>

        <button
          onClick={() => navigate('/orders')}
          className="mt-4 w-full rounded-xl border-2 border-primary py-3 font-bold text-primary"
        >
          View all orders
        </button>
      </div>
    </div>
  );
}
