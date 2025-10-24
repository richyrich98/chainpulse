import { useState } from 'react';
import { ScanHistory, YieldOpportunity, ArbitrageAlert, PulseSession } from '../lib/supabase';

interface PulseResult {
  session: PulseSession;
  scans: ScanHistory[];
  yields: YieldOpportunity[];
  arbitrages: ArbitrageAlert[];
}

export function usePulse() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PulseResult | null>(null);

  const runPulse = async (walletAddress: string, chains: string[]) => {
    if (!walletAddress || chains.length === 0) {
      setError('Please enter a wallet address and select at least one chain');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chainpulse-api/pulse`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress, chains }),
      });

      if (!response.ok) {
        throw new Error('Failed to run pulse');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { runPulse, loading, error, result };
}
