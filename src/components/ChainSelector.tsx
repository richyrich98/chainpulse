import { Bitcoin, Hexagon } from 'lucide-react';

interface ChainSelectorProps {
  selected: string[];
  onChange: (chains: string[]) => void;
}

const CHAINS = [
  { id: 'ETH', name: 'Ethereum', color: '#627EEA' },
  { id: 'SOL', name: 'Solana', color: '#14F195' },
  { id: 'BTC', name: 'Bitcoin', color: '#F7931A' },
];

export function ChainSelector({ selected, onChange }: ChainSelectorProps) {
  const toggleChain = (chainId: string) => {
    if (selected.includes(chainId)) {
      onChange(selected.filter((c) => c !== chainId));
    } else {
      onChange([...selected, chainId]);
    }
  };

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {CHAINS.map((chain) => {
        const isSelected = selected.includes(chain.id);
        return (
          <button
            key={chain.id}
            onClick={() => toggleChain(chain.id)}
            className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: isSelected ? `${chain.color}30` : '#1f2937',
              borderWidth: '2px',
              borderColor: isSelected ? chain.color : '#374151',
              color: isSelected ? chain.color : '#9ca3af',
            }}
          >
            <div className="flex items-center gap-2">
              {chain.id === 'BTC' ? (
                <Bitcoin size={20} />
              ) : (
                <Hexagon size={20} />
              )}
              <span>{chain.name}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
