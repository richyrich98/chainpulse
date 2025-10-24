import { supabase, PulseSession } from '../lib/supabase';
import { scanMultipleChains, ChainType } from './scannerService';
import { fetchYieldOpportunities } from './yieldService';
import { detectArbitrageOpportunities } from './arbitrageService';

export type PulseResult = {
  session: PulseSession;
  scans: Awaited<ReturnType<typeof scanMultipleChains>>;
  yields: Awaited<ReturnType<typeof fetchYieldOpportunities>>[];
  arbitrages: Awaited<ReturnType<typeof detectArbitrageOpportunities>>;
};

export async function runPulse(
  walletAddress: string,
  chains: ChainType[]
): Promise<PulseResult> {
  const startTime = Date.now();

  const [scans, arbitrages] = await Promise.all([
    scanMultipleChains(walletAddress, chains),
    detectArbitrageOpportunities(['ETH/USDT', 'SOL/USDT', 'BTC/USDT']),
  ]);

  const yieldPromises = scans.map((scan) =>
    fetchYieldOpportunities(scan.chain as ChainType, scan.balance)
  );
  const yields = await Promise.all(yieldPromises);

  const totalValue = scans.reduce((sum, scan) => sum + scan.balance, 0);
  const yieldCount = yields.flat().length;
  const arbCount = arbitrages.length;
  const executionTime = Date.now() - startTime;

  const sessionData = {
    wallet_address: walletAddress,
    chains,
    total_value: totalValue,
    yield_opportunities_count: yieldCount,
    arbitrage_alerts_count: arbCount,
    execution_time_ms: executionTime,
  };

  const { data: session, error } = await supabase
    .from('pulse_sessions')
    .insert(sessionData)
    .select()
    .maybeSingle();

  if (error) throw error;
  if (!session) throw new Error('Failed to create pulse session');

  return {
    session: session as PulseSession,
    scans,
    yields,
    arbitrages,
  };
}

export async function getRecentPulseSessions(limit: number = 10): Promise<PulseSession[]> {
  const { data, error } = await supabase
    .from('pulse_sessions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []) as PulseSession[];
}
