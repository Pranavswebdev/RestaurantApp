import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendOtp, testLogin } from '../services/authService';
import useAuthStore from '../stores/authStore';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const validatePhone = (value) => /^[6-9]\d{9}$/.test(value);

  const handleChange = (e) => {
    setPhone(e.target.value.replace(/\D/g, '').slice(0, 10));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePhone(phone)) {
      setError('Please enter a valid 10-digit Indian phone number');
      return;
    }
    setLoading(true);
    try {
      const res = await sendOtp(`+91${phone}`);
      navigate('/otp', { state: { phone: `+91${phone}`, devOtp: res?.devOtp } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleTestLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await testLogin();
      login(res.token, res.user);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Test login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 text-6xl opacity-20 animate-float">🍕</div>
      <div className="absolute top-20 right-20 text-5xl opacity-15">🍔</div>
      <div className="absolute bottom-32 left-20 text-5xl opacity-15">🍜</div>
      <div className="absolute bottom-20 right-10 text-6xl opacity-20">🍲</div>

      <div className="flex min-h-screen flex-col justify-center items-center px-6 py-12">
        <div className="w-full max-w-sm z-10 animate-slide-up">
          {/* Logo & Branding */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-400 to-red-500 text-4xl shadow-xl shadow-orange-300/40">
              🍽️
            </div>
            <h1 className="font-display text-4xl font-bold text-gray-900 mb-1">FoodRush</h1>
            <p className="text-sm text-gray-500 font-medium">Order food, delivered fast.</p>
          </div>

          {/* Card containing the form */}
          <div className="rounded-3xl bg-white/80 backdrop-blur-sm p-6 shadow-xl shadow-orange-900/5 border border-white/60">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">Mobile number</label>
                <div className="flex gap-2">
                  <span className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm font-bold text-gray-900">
                    +91
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={handleChange}
                    placeholder="98765 43210"
                    disabled={loading}
                    className={`min-w-0 flex-1 rounded-xl border bg-gray-50 px-4 py-3 text-gray-900 font-medium outline-none transition ${
                      error
                        ? 'border-red-400 placeholder:text-red-300'
                        : 'border-gray-200 placeholder:text-gray-400 focus:border-orange-400 focus:bg-white'
                    }`}
                  />
                </div>
                {error && <p className="mt-2 text-sm font-medium text-red-500">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={loading || phone.length !== 10}
                className="w-full rounded-xl bg-gradient-to-br from-orange-400 to-red-500 py-3.5 font-bold text-white shadow-lg shadow-orange-300/40 transition hover:shadow-orange-300/60 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {loading ? 'Sending OTP…' : 'Get OTP'}
              </button>

              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-gray-200" />
                <span className="text-xs font-medium text-gray-400 uppercase">or</span>
                <span className="h-px flex-1 bg-gray-200" />
              </div>

              <button
                type="button"
                onClick={handleTestLogin}
                disabled={loading}
                className="w-full rounded-xl border-2 border-dashed border-green-500 bg-green-50/50 py-3 font-bold text-green-700 transition hover:bg-green-50 active:scale-[0.98] disabled:opacity-50"
              >
                ⚡ Skip OTP — Test Login
              </button>

              <p className="text-center text-xs text-gray-400 pt-1">
                We'll text a 6-digit code to verify your number.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
