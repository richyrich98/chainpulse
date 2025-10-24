import { Activity } from 'lucide-react';
import { useState } from 'react';

interface PulseButtonProps {
  onClick: () => void;
  loading: boolean;
}

export function PulseButton({ onClick, loading }: PulseButtonProps) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = { id: Date.now(), x, y };
    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);

    onClick();
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="relative group px-8 py-4 bg-gradient-to-r from-green-500 to-cyan-500 rounded-lg font-bold text-lg text-black overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
    >
      <span className="relative z-10 flex items-center gap-2">
        <Activity className={loading ? 'animate-spin' : ''} size={24} />
        {loading ? 'Pulsing Through Chains...' : 'Run ChainPulse'}
      </span>

      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white animate-ping"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: '20px',
            height: '20px',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
}
