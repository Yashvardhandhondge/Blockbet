export interface MiningPool {
  id: string;
  name: string;
  hashRate: number;
  hashRatePercent: number;
  blocksLast24h: number;
  colorClass: string;
  odds: number;
  region: 'Asia' | 'North America' | 'Europe' | 'Unknown';
}

export interface Block {
  height: number;
  hash: string;
  minedBy: string;
  timestamp: number;
  size: number;
  transactionCount: number;
  fees: number;
  feeRate: number;
  amount: number;
}

export const miningPools: MiningPool[] = [
  {
    id: 'foundry',
    name: 'Foundry USA',
    hashRate: 156.3,
    hashRatePercent: 34.2,
    blocksLast24h: 49,
    colorClass: 'bg-pool-foundry',
    odds: 2.92,
    region: 'North America'
  },
  {
    id: 'antpool',
    name: 'AntPool',
    hashRate: 98.7,
    hashRatePercent: 21.6,
    blocksLast24h: 31,
    colorClass: 'bg-pool-antpool',
    odds: 4.63,
    region: 'Asia'
  },
  {
    id: 'f2pool',
    name: 'F2Pool',
    hashRate: 74.5,
    hashRatePercent: 16.3,
    blocksLast24h: 23,
    colorClass: 'bg-pool-f2pool',
    odds: 6.13,
    region: 'Asia'
  },
  {
    id: 'binance',
    name: 'Binance Pool',
    hashRate: 52.1,
    hashRatePercent: 11.4,
    blocksLast24h: 16,
    colorClass: 'bg-pool-binance',
    odds: 8.77,
    region: 'Asia'
  },
  {
    id: 'viaBTC',
    name: 'ViaBTC',
    hashRate: 35.6,
    hashRatePercent: 7.8,
    blocksLast24h: 11,
    colorClass: 'bg-pool-viaBTC',
    odds: 12.82,
    region: 'Asia'
  },
  {
    id: 'slushpool',
    name: 'SlushPool',
    hashRate: 22.8,
    hashRatePercent: 5.0,
    blocksLast24h: 7,
    colorClass: 'bg-pool-slushpool',
    odds: 20.0,
    region: 'Europe'
  },
  {
    id: 'poolin',
    name: 'Poolin',
    hashRate: 9.6,
    hashRatePercent: 2.1,
    blocksLast24h: 3,
    colorClass: 'bg-pool-poolin',
    odds: 47.62,
    region: 'Asia'
  },
  {
    id: 'unknown',
    name: 'Unknown',
    hashRate: 7.3,
    hashRatePercent: 1.6,
    blocksLast24h: 2,
    colorClass: 'bg-pool-unknown',
    odds: 62.5,
    region: 'Unknown'
  }
];

export const recentBlocks: Block[] = [
  {
    height: 888558,
    hash: '000000000000000000026e2c5c201e0963aad79f8ff21f282b468a343c153267',
    minedBy: 'ViaBTC',
    timestamp: Date.now() - 240000, // 4 minutes ago
    size: 1283452,
    transactionCount: 1736,
    fees: 0.32,
    feeRate: 2,
    amount: 0.026
  },
  {
    height: 888557,
    hash: '000000000000000000012a7e9d96e8642682f2187b2da245da49d7226e8a82a5',
    minedBy: 'AntPool',
    timestamp: Date.now() - 600000, // 10 minutes ago
    size: 1485213,
    transactionCount: 489,
    fees: 0.45,
    feeRate: 2,
    amount: 0.022
  },
  {
    height: 888556,
    hash: '0000000000000000000ab7c1f29ae8127a89d833a0545823480e9c8e304fa8b6',
    minedBy: 'ViaBTC',
    timestamp: Date.now() - 660000, // 11 minutes ago
    size: 932641,
    transactionCount: 2607,
    fees: 0.21,
    feeRate: 3,
    amount: 0.04
  },
  {
    height: 888555,
    hash: '000000000000000000024a1c85a839be89da34f691cff26356e7c12a2c111fd1',
    minedBy: 'ViaBTC',
    timestamp: Date.now() - 1440000, // 24 minutes ago
    size: 1129574,
    transactionCount: 3164,
    fees: 0.28,
    feeRate: 4,
    amount: 0.053
  },
  {
    height: 888554,
    hash: '000000000000000000019ce64c08ea78b923812f9da28ceec53b69c9985d918f',
    minedBy: 'Unknown',
    timestamp: Date.now() - 2520000, // 42 minutes ago
    size: 1398732,
    transactionCount: 3428,
    fees: 0.36,
    feeRate: 4,
    amount: 0.066
  }
];

export interface UserBalance {
  availableBalance: number;
  inPlay: number;
}

export const mockUserBalance: UserBalance = {
  availableBalance: 0.05237,
  inPlay: 0.00125
};

export const nextBlockEstimate = {
  estimatedTimeMinutes: 7,
  difficulty: 63.724,
  feeRate: 32
};

export const getRandomMiningPool = (): MiningPool => {
  const rand = Math.random() * 100;
  let cumulative = 0;
  
  for (const pool of miningPools) {
    cumulative += pool.hashRatePercent;
    if (rand <= cumulative) {
      return pool;
    }
  }
  
  return miningPools[0];
};

export const formatBTC = (amount: number): string => {
  if (amount < 0.001) {
    return `${amount.toFixed(8)} BTC`;
  } else if (amount < 0.1) {
    return `${amount.toFixed(5)} BTC`;
  } else {
    return `${amount.toFixed(3)} BTC`;
  }
};

export const formatTimeAgo = (timestamp: number): string => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) return `${seconds} seconds ago`;
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? 's' : ''} ago`;
};
