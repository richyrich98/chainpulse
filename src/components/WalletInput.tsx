import { Wallet } from 'lucide-react';

interface WalletInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function WalletInput({ value, onChange, placeholder = 'Enter wallet address...' }: WalletInputProps) {
  return (
    <div className="relative w-full max-w-2xl">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
        <Wallet size={20} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-4 bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
      />
    </div>
  );
}
