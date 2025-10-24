import { supabase, ArbitrageAlert } from '../lib/supabase';
import { generateMockPrice, MOCK_EXCHANGES } from './mockData';

const BASE_PRICES = {
  'ETH/USDT': 2400,
  'SOL/USDT': 120,
  'BTC/USDT': 45000,
};

const ALERT_THRESHOLD = 0.5;
const TRADING_FEE = 0.001;

export async function detectArbitrageOpportunities(
  pairs: string[] = ['ETH/USDT', 'SOL/USDT']
): Promise<ArbitrageAlert[]> {
  const alerts: ArbitrageAlert[] = [];

  for (const pair of pairs) {
    const basePrice = BASE_PRICES[pair as keyof typeof BASE_PRICES] || 100;
    const exchangePrices: { exchange: string; price: number }[] = [];

    for (const exchange of MOCK_EXCHANGES) {
      if (exchange.pairs.includes(pair)) {
        exchangePrices.push({
          exchange: exchange.name,
          price: generateMockPrice(basePrice, basePrice * 0.02),
        });
      }
    }

    exchangePrices.sort((a, b) => a.price - b.price);

    for (let i = 0; i < exchangePrices.length - 1; i++) {
      const buyExchange = exchangePrices[i];
      const sellExchange = exchangePrices[exchangePrices.length - 1];

      const spreadPercent =
        ((sellExchange.price - buyExchange.price) / buyExchange.price) * 100;

      if (spreadPercent > ALERT_THRESHOLD) {
        const tradeAmount = 1000;
        const buyFee = tradeAmount * TRADING_FEE;
        const sellFee = tradeAmount * TRADING_FEE;
        const estimatedProfit = tradeAmount * (spreadPercent / 100) - buyFee - sellFee;

        const alertData = {
          pair,
          exchange_buy: buyExchange.exchange,
          exchange_sell: sellExchange.exchange,
          price_buy: buyExchange.price,
          price_sell: sellExchange.price,
          spread_percent: spreadPercent,
          estimated_profit: estimatedProfit,
        };

        const { data, error } = await supabase
          .from('arbitrage_alerts')
          .insert(alertData)
          .select()
          .maybeSingle();

        if (error) throw error;
        if (data) alerts.push(data as ArbitrageAlert);
      }
    }
  }

  return alerts;
}

export async function getRecentArbitrageAlerts(
  limit: number = 10
): Promise<ArbitrageAlert[]> {
  const { data, error } = await supabase
    .from('arbitrage_alerts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []) as ArbitrageAlert[];
}

export async function getHighSpreadAlerts(
  minSpread: number = 1.0,
  limit: number = 5
): Promise<ArbitrageAlert[]> {
  const { data, error } = await supabase
    .from('arbitrage_alerts')
    .select('*')
    .gte('spread_percent', minSpread)
    .order('spread_percent', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []) as ArbitrageAlert[];
}
