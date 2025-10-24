import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ArbitrageAlert } from '../lib/supabase';

interface ArbitrageChartProps {
  arbitrages: ArbitrageAlert[];
}

export function ArbitrageChart({ arbitrages }: ArbitrageChartProps) {
  if (!arbitrages.length) return null;

  const chartData = arbitrages
    .sort((a, b) => b.spread_percent - a.spread_percent)
    .slice(0, 8)
    .map((a) => ({
      name: a.pair,
      spread: a.spread_percent,
      profit: a.estimated_profit,
    }));

  const colors = ['#fbbf24', '#f59e0b', '#d97706', '#b45309'];

  return (
    <div className="w-full h-64 bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
      <h3 className="text-lg font-bold text-white mb-4">Arbitrage Spreads</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="name"
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
            label={{ value: 'Spread %', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#fff',
            }}
            labelStyle={{ color: '#9ca3af' }}
            formatter={(value: number, name: string) => {
              if (name === 'spread') return [`${value.toFixed(2)}%`, 'Spread'];
              return [`$${value.toFixed(2)}`, 'Est. Profit'];
            }}
          />
          <Bar dataKey="spread" radius={[8, 8, 0, 0]}>
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
