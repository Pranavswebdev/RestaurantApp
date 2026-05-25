import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyOtp, sendOtp } from '../services/authService';
import useAuthStore from '../stores/authStore';
import OTPInput from '../components/OTPInput';

export default function OTPVerify() {
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone;
  const login = useAuthStore((state) => state.login);

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [devOtp, setDevOtp] = useState(location.state?.devOtp || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!phone) { navigate('/login'); return; }
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) { setCanResend(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phone, navigate]);

  const submit = async (code) => {
    setLoading(true);
    setError('');
    try {
      const response = await verifyOtp(phone, code);
      login(response.token, response.user);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (next) => {
    setOtp(next);
    if (next.every((d) => d !== '')) submit(next.join(''));
  };

  const handleResend = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await sendOtp(phone);
      setDevOtp(res?.devOtp || '');
      setOtp(['', '', '', '', '', '']);
      setCanResend(false);
      setResendTimer(30);
    } catch {
      setError('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const mm = String(Math.floor(resendTimer / 60)).padStart(1, '0');
  const ss = String(resendTimer % 60).padStart(2, '0');

  return (
    <div className="flex min-h-screen justify-center bg-surface">
      <div className="flex w-full max-w-md flex-col">
        <header className="flex items-center gap-3 border-b border-line bg-white px-4 py-4">
          <button onClick={() => navigate('/login')} className="text-lg font-bold text-primary">←</button>
          <span className="font-bold text-ink">Verify OTP</span>
        </header>

        <div className="flex flex-col gap-4 px-6 pt-10">
          <div>
            <h1 className="text-xl font-bold text-ink">Enter OTP</h1>
            <p className="mt-1 text-sm text-body">
              Sent to <span className="font-semibold text-ink">{phone}</span>
            </p>
          </div>

          {devOtp && (
            <div className="rounded-xl border border-primary/20 bg-primary-light px-4 py-2.5 text-sm text-primary">
              Demo code (no SMS): <span className="font-bold tracking-widest">{devOtp}</span>
            </div>
          )}

          <div className="mt-2">
            <OTPInput value={otp} onChange={handleChange} />
          </div>

          {error && (
            <div className="rounded-xl border border-nonveg/30 bg-nonveg/10 px-4 py-2.5 text-center text-sm font-medium text-nonveg">
              {error}
            </div>
          )}

          <p className="text-center text-sm text-meta">
            {canResend ? (
              <button onClick={handleResend} disabled={loading} className="font-semibold text-primary">
                Resend OTP
              </button>
            ) : (
              <>Resend in 0:{ss}</>
            )}
          </p>

          <button
            onClick={() => submit(otp.join(''))}
            disabled={loading || otp.some((d) => d === '')}
            className="mt-2 w-full rounded-xl bg-primary py-3.5 font-bold text-white shadow-lg shadow-primary/30 transition hover:bg-primary-dark active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none"
          >
            {loading ? 'Verifying…' : 'Verify OTP'}
          </button>
        </div>
      </div>
    </div>
  );
}
