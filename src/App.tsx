import { useState } from 'react';
import { WormholeBackground } from './components/WormholeBackground';
import { WalletInput } from './components/WalletInput';
import { ChainSelector } from './components/ChainSelector';
import { PulseButton } from './components/PulseButton';
import { SummaryCard } from './components/SummaryCard';
import { ScanResults } from './components/ScanResults';
import { YieldResults } from './components/YieldResults';
import { ArbitrageResults } from './components/ArbitrageResults';
import { YieldChart } from './components/YieldChart';
import { ArbitrageChart } from './components/ArbitrageChart';
import { usePulse } from './hooks/usePulse';
import { Zap } from 'lucide-react';

function App() {
  const [walletAddress, setWalletAddress] = useState('');
  const [selectedChains, setSelectedChains] = useState<string[]>(['ETH', 'SOL']);
  const { runPulse, loading, error, result } = usePulse();

  const handlePulse = () => {
    runPulse(walletAddress, selectedChains);
  };

  return (
    <div className="min-h-screen relative">
      <WormholeBackground />

      <div className="relative z-10 min-h-screen">
        <header className="py-8 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Zap className="text-green-400" size={48} />
              <h1 className="text-5xl font-bold text-white">
                Chain<span className="text-green-400">Pulse</span>
              </h1>
            </div>
            <p className="text-gray-400 text-lg">
              Enterprise-Grade DeFi Dashboard: Scan Wallets, Optimize Yields, Detect Arbitrage
            </p>
          </div>
        </header>

        <main className="px-4 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 space-y-6">
              <div className="flex justify-center">
                <WalletInput
                  value={walletAddress}
                  onChange={setWalletAddress}
                  placeholder="Enter wallet address (e.g., 0x742d35...)"
                />
              </div>

              <ChainSelector selected={selectedChains} onChange={setSelectedChains} />

              <div className="flex justify-center">
                <PulseButton onClick={handlePulse} loading={loading} />
              </div>

              {error && (
                <div className="max-w-2xl mx-auto p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-center">
                  {error}
                </div>
              )}
            </div>

            {result && (
              <>
                <SummaryCard
                  totalValue={result.session.total_value}
                  yieldCount={result.session.yield_opportunities_count}
                  arbCount={result.session.arbitrage_alerts_count}
                  executionTime={result.session.execution_time_ms}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  <ScanResults scans={result.scans} />
                  <YieldResults yields={result.yields} />
                  <ArbitrageResults arbitrages={result.arbitrages} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <YieldChart yields={result.yields} />
                  <ArbitrageChart arbitrages={result.arbitrages} />
                </div>
              </>
            )}

            {!result && !loading && (
              <div className="text-center text-gray-500 mt-12">
                <p className="text-lg">Enter a wallet address and run ChainPulse to get started</p>
              </div>
            )}
          </div>
        </main>

        <footer className="py-6 text-center text-gray-600 text-sm">
          <p>ChainPulse v1.0 - Enterprise DeFi Analytics Platform</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
