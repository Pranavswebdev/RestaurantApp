import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

export default function Orders() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-line bg-paper/85 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-5 pt-5 pb-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-3 text-xl font-semibold text-primary hover:text-primary-dark transition"
            >
              ←
            </button>
            <h1 className="text-2xl font-bold text-ink">Your Orders</h1>
          </div>
        </div>
      </header>

      {/* Coming Soon Content */}
      <div className="mx-auto max-w-md px-6 py-16 flex flex-col items-center justify-center">
        <div className="mb-6 text-6xl animate-bob">📋</div>
        <h2 className="text-center text-2xl font-bold text-ink mb-3">Coming Soon</h2>
        <p className="text-center text-body mb-8">Order history and tracking will be available here</p>

        <button
          onClick={() => navigate('/home')}
          className="rounded-xl bg-gradient-to-br from-primary to-accent px-8 py-3 font-semibold text-white shadow-lg shadow-primary/30 transition-transform hover:scale-105"
        >
          Start Ordering
        </button>
      </div>

      <BottomNav active="orders" />
    </div>
  );
}
