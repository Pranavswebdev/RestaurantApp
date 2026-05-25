import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

export default function Splash() {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const timer = setTimeout(() => navigate(token ? '/home' : '/login'), 1800);
    return () => clearTimeout(timer);
  }, [token, navigate]);

  return (
    <div className="brand-gradient flex h-screen flex-col items-center justify-center gap-3">
      <div className="animate-fade text-6xl">⚡🍔</div>
      <h1 className="animate-rise text-4xl font-extrabold tracking-tight text-white">FoodRush</h1>
      <p className="animate-fade text-sm text-white/80">Lightning fast food delivery</p>
    </div>
  );
}
