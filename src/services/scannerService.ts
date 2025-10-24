import { supabase, ScanHistory } from '../lib/supabase';
import { calculateRiskScore } from './mockData';

export type ChainType = 'ETH' | 'SOL' | 'BTC';

export async function scanWallet(
  walletAddress: string,
  chain: ChainType
): Promise<ScanHistory> {
  const balance = generateMockBalance(chain);
  const { score, flags } = calculateRiskScore(balance, chain);

  const scanData = {
    wallet_address: walletAddress,
    chain,
    balance,
    risk_score: score,
    risk_flags: flags,
  };

  const { data, error } = await supabase
    .from('scan_history')
    .insert(scanData)
    .select()
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error('Failed to create scan record');

  return data as ScanHistory;
}

export async function scanMultipleChains(
  walletAddress: string,
  chains: ChainType[]
): Promise<ScanHistory[]> {
  const scanPromises = chains.map((chain) => scanWallet(walletAddress, chain));
  return Promise.all(scanPromises);
}

export async function getRecentScans(limit: number = 10): Promise<ScanHistory[]> {
  const { data, error } = await supabase
    .from('scan_history')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []) as ScanHistory[];
}

function generateMockBalance(chain: ChainType): number {
  switch (chain) {
    case 'ETH':
      return Math.random() * 10 + 0.005;
    case 'SOL':
      return Math.random() * 100 + 0.01;
    case 'BTC':
      return Math.random() * 0.5 + 0.0005;
    default:
      return 0;
  }
}
