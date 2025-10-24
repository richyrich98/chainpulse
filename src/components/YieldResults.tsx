import { TrendingUp, Award } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { YieldOpportunity } from '../lib/supabase';

interface YieldResultsProps {
  yields: YieldOpportunity[];
}

export function YieldResults({ yields }: YieldResultsProps) {
  if (!yields.length) return null;

  const topYield = yields.reduce((max, y) => (y.apy > max.apy ? y : max), yields[0]);
  const avgAPY = yields.reduce((sum, y) => sum + y.apy, 0) / yields.length;

  return (
    <MetricCard title="Staking Yield Optimizer" icon={TrendingUp} accentColor="#00ccff">
      <div className="flex items-center justify-between">
        <span className="text-gray-400">Opportunities Found</span>
        <span className="text-2xl font-bold text-cyan-400">{yields.length}</span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-gray-400">Average APY</span>
        <span className="text-xl font-semibold text-white">{avgAPY.toFixed(2)}%</span>
      </div>

      <div className="pt-3 border-t border-gray-800">
        <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg mb-3">
          <div className="flex items-center gap-2 mb-2">
            <Award size={16} className="text-cyan-400" />
            <span className="text-sm font-semibold text-cyan-400">Top Validator</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white font-semibold">{topYield.validator_name}</span>
            <span className="text-cyan-400 font-bold text-lg">{topYield.apy.toFixed(2)}%</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {topYield.chain} • {topYield.effectiveness.toFixed(1)}% effective
          </div>
        </div>

        <div className="space-y-2">
          {yields.slice(0, 4).map((y) => (
            <div
              key={y.id}
              className="flex items-center justify-between py-2 hover:bg-gray-800/50 rounded px-2 transition-colors"
            >
              <div>
                <div className="text-sm font-medium text-white">{y.validator_name}</div>
                <div className="text-xs text-gray-500">{y.chain}</div>
              </div>
              <div className="text-right">
                <div className="text-cyan-400 font-semibold">{y.apy.toFixed(2)}%</div>
                <div className="text-xs text-gray-500">{y.commission.toFixed(1)}% fee</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MetricCard>
  );
}
