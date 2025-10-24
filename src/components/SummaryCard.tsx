import { DollarSign, TrendingUp, Clock } from 'lucide-react';

interface SummaryCardProps {
  totalValue: number;
  yieldCount: number;
  arbCount: number;
  executionTime: number;
}

export function SummaryCard({ totalValue, yieldCount, arbCount, executionTime }: SummaryCardProps) {
  const totalOppValue = yieldCount * 150 + arbCount * 25;

  return (
    <div className="w-full max-w-4xl mx-auto bg-gradient-to-r from-green-500/20 to-cyan-500/20 backdrop-blur-sm border border-green-500/30 rounded-xl p-6 mb-8">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <DollarSign className="text-green-400" size={28} />
        Pulse Summary
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900/60 rounded-lg p-4">
          <div className="text-gray-400 text-sm mb-1">Portfolio Value</div>
          <div className="text-2xl font-bold text-white">
            ${(totalValue * 2400).toFixed(2)}
          </div>
        </div>

        <div className="bg-gray-900/60 rounded-lg p-4">
          <div className="text-gray-400 text-sm mb-1 flex items-center gap-1">
            <TrendingUp size={14} />
            Yield Opps
          </div>
          <div className="text-2xl font-bold text-cyan-400">{yieldCount}</div>
        </div>

        <div className="bg-gray-900/60 rounded-lg p-4">
          <div className="text-gray-400 text-sm mb-1">Arb Alerts</div>
          <div className="text-2xl font-bold text-yellow-400">{arbCount}</div>
        </div>

        <div className="bg-gray-900/60 rounded-lg p-4">
          <div className="text-gray-400 text-sm mb-1 flex items-center gap-1">
            <Clock size={14} />
            Exec Time
          </div>
          <div className="text-2xl font-bold text-green-400">{executionTime}ms</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-gray-300 font-semibold">Total Opportunity Value</span>
          <span className="text-3xl font-bold text-green-400">
            ${totalOppValue.toFixed(2)}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Estimated combined value from yield opportunities and arbitrage alerts
        </p>
      </div>
    </div>
  );
}
