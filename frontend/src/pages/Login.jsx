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

      <div className="flex min-h-screen justify-center items-center px-6">
        <div className="w-full max-w-md z-10 animate-slide-up">
          {/* Logo & Branding */}
          <div className="mb-12 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-orange-400 to-red-500 text-4xl shadow-2xl shadow-orange-300/40">
              🍽️
            </div>
            <h1 className="font-display text-4xl font-bold text-gray-900 mb-2">FoodRush</h1>
            <p className="text-sm text-gray-600 font-medium">Order food, delivered fast</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-900">Mobile number</label>
              <div className="flex gap-3">
                <span className="flex items-center rounded-2xl border-2 border-gray-200 bg-white px-5 text-sm font-bold text-gray-900">
                  +91
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={handleChange}
                  placeholder="98765 43210"
                  disabled={loading}
                  className={`flex-1 rounded-2xl border-2 bg-white px-5 py-3 text-gray-900 font-medium outline-none transition ${
                    error
                      ? 'border-red-400 placeholder:text-red-300'
                      : 'border-gray-200 placeholder:text-gray-400 focus:border-orange-400 focus:bg-orange-50'
                  }`}
                />
              </div>
            </div>
            {error && <p className="text-sm font-medium text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading || phone.length !== 10}
              className="w-full rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 py-4 font-bold text-white shadow-lg shadow-orange-300/40 transition hover:shadow-orange-300/60 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending OTP…' : 'Get OTP'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-gray-300" />
            <span className="text-xs font-medium text-gray-500 uppercase">or</span>
            <span className="h-px flex-1 bg-gray-300" />
          </div>

          <button
            onClick={handleTestLogin}
            disabled={loading}
            className="w-full rounded-2xl border-2 border-dashed border-orange-400 bg-transparent py-4 font-bold text-orange-600 transition hover:bg-orange-50 active:scale-[0.98] disabled:opacity-50"
          >
            Skip OTP – Test Login
          </button>

          <p className="mt-8 text-center text-xs text-gray-500">
            By continuing you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
}
