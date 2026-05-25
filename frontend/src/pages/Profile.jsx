import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import BottomNav from '../components/BottomNav';

export default function Profile() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-line bg-paper/85 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-5 pt-5 pb-4">
          <h1 className="text-2xl font-bold text-ink">Profile</h1>
        </div>
      </header>

      {/* Profile Content */}
      <div className="mx-auto max-w-md px-6 py-8">
        {/* User Info Section */}
        <div className="mb-8 rounded-2xl border border-line bg-white p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-2xl">
              👤
            </div>
            <div>
              <p className="text-sm text-body">Phone Number</p>
              <p className="font-semibold text-ink">{user?.phone || 'Not available'}</p>
            </div>
          </div>
        </div>

        {/* Coming Soon Features */}
        <div className="space-y-3 mb-8">
          <div className="rounded-xl border border-line bg-cream p-4 opacity-50 cursor-not-allowed">
            <p className="text-sm font-semibold text-ink">Edit Profile</p>
            <p className="text-xs text-body">Coming Soon</p>
          </div>

          <div className="rounded-xl border border-line bg-cream p-4 opacity-50 cursor-not-allowed">
            <p className="text-sm font-semibold text-ink">Saved Addresses</p>
            <p className="text-xs text-body">Coming Soon</p>
          </div>

          <div className="rounded-xl border border-line bg-cream p-4 opacity-50 cursor-not-allowed">
            <p className="text-sm font-semibold text-ink">Payment Methods</p>
            <p className="text-xs text-body">Coming Soon</p>
          </div>

          <div className="rounded-xl border border-line bg-cream p-4 opacity-50 cursor-not-allowed">
            <p className="text-sm font-semibold text-ink">Help & Support</p>
            <p className="text-xs text-body">Coming Soon</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full rounded-xl border-2 border-nonveg px-6 py-3 font-semibold text-nonveg transition-colors hover:bg-nonveg/10"
        >
          Log Out
        </button>
      </div>

      <BottomNav active="profile" />
    </div>
  );
}
