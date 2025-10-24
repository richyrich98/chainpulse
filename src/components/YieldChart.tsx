import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { YieldOpportunity } from '../lib/supabase';

interface YieldChartProps {
  yields: YieldOpportunity[];
}

export function YieldChart({ yields }: YieldChartProps) {
  if (!yields.length) return null;

  const chartData = yields
    .sort((a, b) => a.apy - b.apy)
    .map((y, idx) => ({
      name: y.validator_name.slice(0, 10),
      apy: y.apy,
      index: idx,
    }));

  return (
    <div className="w-full h-64 bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
      <h3 className="text-lg font-bold text-white mb-4">Yield Comparison</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="name"
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
            label={{ value: 'APY %', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#fff',
            }}
            labelStyle={{ color: '#9ca3af' }}
          />
          <Line
            type="monotone"
            dataKey="apy"
            stroke="#00ccff"
            strokeWidth={3}
            dot={{ fill: '#00ccff', r: 5 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
