/*
  # ChainPulse Database Schema

  ## Overview
  Creates the core database schema for ChainPulse DeFi dashboard, supporting wallet scanning,
  yield optimization tracking, and arbitrage alerts.

  ## New Tables
  
  ### `scan_history`
  - `id` (uuid, primary key) - Unique scan identifier
  - `wallet_address` (text) - Wallet address scanned
  - `chain` (text) - Blockchain (ETH/SOL/BTC)
  - `balance` (numeric) - Wallet balance
  - `risk_score` (text) - Risk assessment (low/medium/high)
  - `risk_flags` (jsonb) - Array of risk indicators
  - `created_at` (timestamptz) - Scan timestamp
  
  ### `yield_opportunities`
  - `id` (uuid, primary key) - Unique opportunity identifier
  - `chain` (text) - Blockchain
  - `validator_name` (text) - Validator/protocol name
  - `apy` (numeric) - Annual percentage yield
  - `commission` (numeric) - Validator commission rate
  - `effectiveness` (numeric) - Validator effectiveness score
  - `recommended_stake` (numeric) - Recommended stake amount
  - `created_at` (timestamptz) - Record timestamp
  
  ### `arbitrage_alerts`
  - `id` (uuid, primary key) - Unique alert identifier
  - `pair` (text) - Trading pair (e.g., ETH/USDT)
  - `exchange_buy` (text) - Exchange to buy from
  - `exchange_sell` (text) - Exchange to sell to
  - `price_buy` (numeric) - Buy price
  - `price_sell` (numeric) - Sell price
  - `spread_percent` (numeric) - Price difference percentage
  - `estimated_profit` (numeric) - Estimated profit after fees
  - `created_at` (timestamptz) - Alert timestamp
  
  ### `pulse_sessions`
  - `id` (uuid, primary key) - Unique session identifier
  - `wallet_address` (text) - Wallet analyzed
  - `chains` (text[]) - Chains scanned
  - `total_value` (numeric) - Total portfolio value
  - `yield_opportunities_count` (integer) - Number of yield opps found
  - `arbitrage_alerts_count` (integer) - Number of arb alerts found
  - `execution_time_ms` (integer) - Pulse execution time
  - `created_at` (timestamptz) - Session timestamp

  ## Security
  - RLS enabled on all tables
  - Public read access for demo (can be restricted later for auth)
  - Tables designed for analytics and caching
*/

-- Scan History Table
CREATE TABLE IF NOT EXISTS scan_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text NOT NULL,
  chain text NOT NULL,
  balance numeric NOT NULL DEFAULT 0,
  risk_score text NOT NULL DEFAULT 'low',
  risk_flags jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_scan_history_wallet ON scan_history(wallet_address);
CREATE INDEX IF NOT EXISTS idx_scan_history_created ON scan_history(created_at DESC);

ALTER TABLE scan_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to scan history"
  ON scan_history FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to scan history"
  ON scan_history FOR INSERT
  WITH CHECK (true);

-- Yield Opportunities Table
CREATE TABLE IF NOT EXISTS yield_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chain text NOT NULL,
  validator_name text NOT NULL,
  apy numeric NOT NULL DEFAULT 0,
  commission numeric NOT NULL DEFAULT 0,
  effectiveness numeric NOT NULL DEFAULT 0,
  recommended_stake numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_yield_chain ON yield_opportunities(chain);
CREATE INDEX IF NOT EXISTS idx_yield_apy ON yield_opportunities(apy DESC);
CREATE INDEX IF NOT EXISTS idx_yield_created ON yield_opportunities(created_at DESC);

ALTER TABLE yield_opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to yield opportunities"
  ON yield_opportunities FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to yield opportunities"
  ON yield_opportunities FOR INSERT
  WITH CHECK (true);

-- Arbitrage Alerts Table
CREATE TABLE IF NOT EXISTS arbitrage_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pair text NOT NULL,
  exchange_buy text NOT NULL,
  exchange_sell text NOT NULL,
  price_buy numeric NOT NULL,
  price_sell numeric NOT NULL,
  spread_percent numeric NOT NULL,
  estimated_profit numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_arb_pair ON arbitrage_alerts(pair);
CREATE INDEX IF NOT EXISTS idx_arb_spread ON arbitrage_alerts(spread_percent DESC);
CREATE INDEX IF NOT EXISTS idx_arb_created ON arbitrage_alerts(created_at DESC);

ALTER TABLE arbitrage_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to arbitrage alerts"
  ON arbitrage_alerts FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to arbitrage alerts"
  ON arbitrage_alerts FOR INSERT
  WITH CHECK (true);

-- Pulse Sessions Table
CREATE TABLE IF NOT EXISTS pulse_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text NOT NULL,
  chains text[] NOT NULL DEFAULT ARRAY[]::text[],
  total_value numeric NOT NULL DEFAULT 0,
  yield_opportunities_count integer NOT NULL DEFAULT 0,
  arbitrage_alerts_count integer NOT NULL DEFAULT 0,
  execution_time_ms integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pulse_wallet ON pulse_sessions(wallet_address);
CREATE INDEX IF NOT EXISTS idx_pulse_created ON pulse_sessions(created_at DESC);

ALTER TABLE pulse_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to pulse sessions"
  ON pulse_sessions FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to pulse sessions"
  ON pulse_sessions FOR INSERT
  WITH CHECK (true);