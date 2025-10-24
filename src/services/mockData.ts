export const MOCK_VALIDATORS = {
  ETH: [
    { name: 'Lido', apy: 3.8, commission: 10, effectiveness: 99.2 },
    { name: 'Rocket Pool', apy: 3.5, commission: 15, effectiveness: 98.8 },
    { name: 'Coinbase', apy: 3.2, commission: 25, effectiveness: 99.5 },
  ],
  SOL: [
    { name: 'Jito', apy: 7.2, commission: 8, effectiveness: 99.8 },
    { name: 'Marinade', apy: 6.8, commission: 6, effectiveness: 98.5 },
    { name: 'Socean', apy: 6.5, commission: 10, effectiveness: 97.9 },
  ],
};

export const MOCK_EXCHANGES = [
  { name: 'Binance', pairs: ['ETH/USDT', 'SOL/USDT', 'BTC/USDT'] },
  { name: 'Coinbase', pairs: ['ETH/USDT', 'SOL/USDT', 'BTC/USDT'] },
  { name: 'Kraken', pairs: ['ETH/USDT', 'SOL/USDT', 'BTC/USDT'] },
];

export function generateMockPrice(base: number, variance: number): number {
  return base + (Math.random() - 0.5) * variance;
}

export function calculateRiskScore(balance: number, chain: string): {
  score: 'low' | 'medium' | 'high';
  flags: string[];
} {
  const flags: string[] = [];
  let score: 'low' | 'medium' | 'high' = 'low';

  if (chain === 'ETH') {
    if (balance < 0.01) {
      flags.push('High dust (<0.01 ETH)');
      score = 'high';
    } else if (balance < 0.1) {
      flags.push('Low balance');
      score = 'medium';
    }
  } else if (chain === 'SOL') {
    if (balance < 0.05) {
      flags.push('Rent due (SOL < threshold)');
      score = 'high';
    } else if (balance < 1) {
      flags.push('Low balance for staking');
      score = 'medium';
    }
  } else if (chain === 'BTC') {
    if (balance < 0.001) {
      flags.push('UTXO sprawl risk');
      score = 'high';
    } else if (balance < 0.01) {
      flags.push('Low balance');
      score = 'medium';
    }
  }

  return { score, flags };
}
