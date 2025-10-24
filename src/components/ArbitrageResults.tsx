import { Zap, DollarSign, ArrowRightLeft } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { ArbitrageAlert } from '../lib/supabase';

interface ArbitrageResultsProps {
  arbitrages: ArbitrageAlert[];
}

export function ArbitrageResults({ arbitrages }: ArbitrageResultsProps) {
  if (!arbitrages.length) return null;

  const totalProfit = arbitrages.reduce((sum, a) => sum + a.estimated_profit, 0);
  const bestOpportunity = arbitrages.reduce(
    (max, a) => (a.spread_percent > max.spread_percent ? a : max),
    arbitrages[0]
  );

  return (
    <MetricCard title="Arbitrage Alerts" icon={Zap} accentColor="#fbbf24">
      <div className="flex items-center justify-between">
        <span className="text-gray-400">Active Opportunities</span>
        <span className="text-2xl font-bold text-yellow-400">{arbitrages.length}</span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-gray-400">Est. Total Profit</span>
        <span className="text-xl font-semibold text-green-400 flex items-center gap-1">
          <DollarSign size={18} />
          {totalProfit.toFixed(2)}
        </span>
      </div>

      <div className="pt-3 border-t border-gray-800">
        <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg mb-3">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={16} className="text-yellow-400" />
            <span className="text-sm font-semibold text-yellow-400">Best Opportunity</span>
          </div>
          <div className="text-white font-semibold mb-1">{bestOpportunity.pair}</div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">{bestOpportunity.exchange_buy}</span>
            <ArrowRightLeft size={14} className="text-yellow-400" />
            <span className="text-gray-400">{bestOpportunity.exchange_sell}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-yellow-400 font-bold">
              {bestOpportunity.spread_percent.toFixed(2)}% spread
            </span>
            <span className="text-green-400 font-semibold">
              +${bestOpportunity.estimated_profit.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {arbitrages.slice(0, 3).map((arb) => (
            <div
              key={arb.id}
              className="flex items-center justify-between py-2 hover:bg-gray-800/50 rounded px-2 transition-colors"
            >
              <div>
                <div className="text-sm font-medium text-white">{arb.pair}</div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <span>{arb.exchange_buy}</span>
                  <ArrowRightLeft size={10} />
                  <span>{arb.exchange_sell}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-yellow-400 font-semibold">
                  {arb.spread_percent.toFixed(2)}%
                </div>
                <div className="text-xs text-green-400">+${arb.estimated_profit.toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MetricCard>
  );
}
