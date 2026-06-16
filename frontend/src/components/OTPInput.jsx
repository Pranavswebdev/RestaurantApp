import { useRef, useEffect } from 'react';

export default function OTPInput({ value, onChange }) {
  const inputRefs = useRef([]);
  const otp = value;

  useEffect(() => { inputRefs.current[0]?.focus(); }, []);

  const handleChange = (index, char) => {
    if (!/^\d?$/.test(char)) return;
    const next = [...otp];
    next[index] = char;
    onChange(next);
    if (char && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-3">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength="1"
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className={`h-14 w-11 rounded-lg border-[1.5px] bg-white text-center text-xl font-bold text-ink outline-none transition-all ${
            digit ? 'border-primary bg-primary-light animate-pop' : 'border-line'
          } focus:border-primary focus:ring-4 focus:ring-primary/10`}
        />
      ))}
    </div>
  );
}
