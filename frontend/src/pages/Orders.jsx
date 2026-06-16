import { useNavigate } from 'react-router-dom';
import useOrderStore from '../stores/orderStore';
import BottomNav from '../components/BottomNav';

const STATUS_LABEL = {
  confirmed: { text: 'Confirmed', cls: 'bg-blue-100 text-blue-700' },
  preparing: { text: 'Preparing', cls: 'bg-amber-100 text-amber-700' },
  on_the_way: { text: 'On the way', cls: 'bg-orange-100 text-orange-700' },
  delivered: { text: 'Delivered', cls: 'bg-green-100 text-green-700' },
};

function timeAgo(ts) {
  const mins = Math.floor((Date.now() - ts) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} day(s) ago`;
}

export default function Orders() {
  const navigate = useNavigate();
  const orders = useOrderStore((state) => state.orders);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="sticky top-0 z-20 border-b border-line bg-white px-5 py-4">
        <h1 className="text-2xl font-bold text-ink">Your Orders</h1>
      </header>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
          <div className="mb-4 text-6xl">📋</div>
          <h2 className="text-xl font-bold text-ink">No orders yet</h2>
          <p className="mt-2 text-sm text-muted">Your past orders will show up here</p>
          <button
            onClick={() => navigate('/home')}
            className="mt-6 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 px-8 py-3 font-bold text-white shadow-lg shadow-orange-300/40"
          >
            Start ordering
          </button>
        </div>
      ) : (
        <div className="mx-auto max-w-2xl space-y-4 px-4 pt-4">
          {orders.map((order) => {
            const status = STATUS_LABEL[order.status] || STATUS_LABEL.confirmed;
            const active = order.status !== 'delivered';
            return (
              <div key={order.id} className="rounded-3xl bg-white p-5 card-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-ink">Order #{order.id}</p>
                    <p className="text-xs text-muted">{timeAgo(order.placedAt)}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${status.cls}`}>
                    {status.text}
                  </span>
                </div>

                <div className="mt-3 border-t border-line pt-3 text-sm text-ink">
                  {order.items.map((it, i) => (
                    <span key={i}>
                      {it.quantity}× {it.name}{i < order.items.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="font-bold text-ink">₹{order.total}</span>
                  <div className="flex gap-2">
                    {active && (
                      <button
                        onClick={() => navigate(`/order/${order.id}`)}
                        className="rounded-xl bg-gradient-to-br from-orange-400 to-red-500 px-4 py-2 text-sm font-bold text-white"
                      >
                        Track
                      </button>
                    )}
                    <button
                      onClick={() => navigate('/home')}
                      className="rounded-xl border border-primary px-4 py-2 text-sm font-bold text-primary"
                    >
                      Reorder
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <BottomNav active="orders" />
    </div>
  );
}
