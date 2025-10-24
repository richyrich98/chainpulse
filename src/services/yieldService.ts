import { supabase, YieldOpportunity } from '../lib/supabase';
import { MOCK_VALIDATORS } from './mockData';
import { ChainType } from './scannerService';

export async function fetchYieldOpportunities(
  chain: ChainType,
  balance: number
): Promise<YieldOpportunity[]> {
  const validators = MOCK_VALIDATORS[chain] || [];
  const opportunities: YieldOpportunity[] = [];

  for (const validator of validators) {
    const recommendedStake = calculateRecommendedStake(balance, chain);

    const oppData = {
      chain,
      validator_name: validator.name,
      apy: validator.apy,
      commission: validator.commission,
      effectiveness: validator.effectiveness,
      recommended_stake: recommendedStake,
    };

    const { data, error } = await supabase
      .from('yield_opportunities')
      .insert(oppData)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (data) opportunities.push(data as YieldOpportunity);
  }

  return opportunities;
}

export async function getTopYieldOpportunities(
  limit: number = 5
): Promise<YieldOpportunity[]> {
  const { data, error } = await supabase
    .from('yield_opportunities')
    .select('*')
    .order('apy', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []) as YieldOpportunity[];
}

export function calculateRecommendedStake(balance: number, chain: ChainType): number {
  switch (chain) {
    case 'ETH':
      return Math.min(balance, 32);
    case 'SOL':
      return balance * 0.9;
    case 'BTC':
      return 0;
    default:
      return 0;
  }
}

export function calculateProjectedYield(
  stake: number,
  apy: number,
  commission: number
): number {
  const netAPY = apy * (1 - commission / 100);
  return stake * (netAPY / 100);
}
