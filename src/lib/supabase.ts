import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ScanHistory = {
  id: string;
  wallet_address: string;
  chain: string;
  balance: number;
  risk_score: string;
  risk_flags: string[];
  created_at: string;
};

export type YieldOpportunity = {
  id: string;
  chain: string;
  validator_name: string;
  apy: number;
  commission: number;
  effectiveness: number;
  recommended_stake: number;
  created_at: string;
};

export type ArbitrageAlert = {
  id: string;
  pair: string;
  exchange_buy: string;
  exchange_sell: string;
  price_buy: number;
  price_sell: number;
  spread_percent: number;
  estimated_profit: number;
  created_at: string;
};

export type PulseSession = {
  id: string;
  wallet_address: string;
  chains: string[];
  total_value: number;
  yield_opportunities_count: number;
  arbitrage_alerts_count: number;
  execution_time_ms: number;
  created_at: string;
};
