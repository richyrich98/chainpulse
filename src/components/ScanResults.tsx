import { Scan, AlertTriangle, CheckCircle } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { ScanHistory } from '../lib/supabase';

interface ScanResultsProps {
  scans: ScanHistory[];
}

export function ScanResults({ scans }: ScanResultsProps) {
  if (!scans.length) return null;

  const totalBalance = scans.reduce((sum, scan) => sum + scan.balance, 0);
  const highRiskCount = scans.filter((s) => s.risk_score === 'high').length;

  return (
    <MetricCard title="Wallet Scans" icon={Scan} accentColor="#00ff88">
      <div className="flex items-center justify-between">
        <span className="text-gray-400">Total Chains Scanned</span>
        <span className="text-2xl font-bold text-green-400">{scans.length}</span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-gray-400">Total Balance (USD)</span>
        <span className="text-xl font-semibold text-white">
          ${(totalBalance * 2400).toFixed(2)}
        </span>
      </div>

      <div className="pt-3 border-t border-gray-800">
        {scans.map((scan) => (
          <div
            key={scan.id}
            className="flex items-center justify-between py-2 hover:bg-gray-800/50 rounded px-2 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-semibold text-cyan-400">
                {scan.chain}
              </span>
              {scan.risk_score === 'high' && (
                <AlertTriangle size={16} className="text-red-400" />
              )}
              {scan.risk_score === 'low' && (
                <CheckCircle size={16} className="text-green-400" />
              )}
            </div>
            <span className="text-gray-300 font-mono text-sm">
              {scan.balance.toFixed(4)}
            </span>
          </div>
        ))}
      </div>

      {highRiskCount > 0 && (
        <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertTriangle size={16} />
            <span>{highRiskCount} high-risk wallet(s) detected</span>
          </div>
        </div>
      )}
    </MetricCard>
  );
}
