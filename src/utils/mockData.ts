export interface MiningPool {
  id: string;
  name: string;
  hashRate: number;
  hashRatePercent: number;
  blocksLast24h: number;
  colorClass: string;
  odds: number;
  region: 'Asia' | 'North America' | 'Europe' | 'Unknown';
  logoUrl: string;
  gradient: string;
}

export interface Block {
  height: number;
  hash: string;
  minedBy: string;
  timestamp: number;
  size: number;
  transactionCount: number;
  fees: number;
  feesRangeText: string;
  feeRange: string;
  totalBtc: number;
}

export const miningPools: MiningPool[] = [
  {
    id: 'foundry',
    name: 'Foundry USA',
    hashRate: 156.3,
    hashRatePercent: 26.5,
    blocksLast24h: 38,
    colorClass: 'bg-orange-500',
    odds: 3.77,
    region: 'North America',
    logoUrl: '/pool-logos/foundryusa.png',
    gradient: 'linear-gradient(135deg, #F97316, #7C2D12)'
  },
  {
    id: 'antpool',
    name: 'AntPool',
    hashRate: 98.7,
    hashRatePercent: 16.7,
    blocksLast24h: 24,
    colorClass: 'bg-red-600',
    odds: 5.99,
    region: 'Asia',
    logoUrl: '/pool-logos/antpool.png',
    gradient: 'linear-gradient(135deg, #DC2626, #7F1D1D)'
  },
  {
    id: 'f2pool',
    name: 'F2Pool',
    hashRate: 74.5,
    hashRatePercent: 12.6,
    blocksLast24h: 18,
    colorClass: 'bg-blue-500',
    odds: 7.94,
    region: 'Asia',
    logoUrl: '/pool-logos/f2pool.svg',
    gradient: 'linear-gradient(135deg, #3B82F6, #1E40AF)'
  },
  {
    id: 'binance',
    name: 'Binance Pool',
    hashRate: 52.1,
    hashRatePercent: 8.8,
    blocksLast24h: 13,
    colorClass: 'bg-yellow-500',
    odds: 11.36,
    region: 'Asia',
    logoUrl: '/pool-logos/binancepool.png',
    gradient: 'linear-gradient(135deg, #EAB308, #854D0E)'
  },
  {
    id: 'viabtc',
    name: 'ViaBTC',
    hashRate: 35.6,
    hashRatePercent: 6.0,
    blocksLast24h: 9,
    colorClass: 'bg-green-600',
    odds: 16.67,
    region: 'Asia',
    logoUrl: '/pool-logos/viabtc.svg',
    gradient: 'linear-gradient(135deg, #16A34A, #14532D)'
  },
  {
    id: 'slushpool',
    name: 'Slush Pool',
    hashRate: 30.5,
    hashRatePercent: 5.2,
    blocksLast24h: 7,
    colorClass: 'bg-cyan-600',
    odds: 19.23,
    region: 'Europe',
    logoUrl: '/pool-logos/braiinspool.svg',
    gradient: 'linear-gradient(135deg, #0891B2, #164E63)'
  },
  {
    id: 'poolin',
    name: 'Poolin',
    hashRate: 28.4,
    hashRatePercent: 4.8,
    blocksLast24h: 7,
    colorClass: 'bg-emerald-600',
    odds: 20.83,
    region: 'Asia',
    logoUrl: '/pool-logos/poolin.svg',
    gradient: 'linear-gradient(135deg, #059669, #065F46)'
  },
  {
    id: 'btc-com',
    name: 'BTC.com',
    hashRate: 26.2,
    hashRatePercent: 4.4,
    blocksLast24h: 6,
    colorClass: 'bg-red-500',
    odds: 22.73,
    region: 'Asia',
    logoUrl: '/pool-logos/btccom.svg',
    gradient: 'linear-gradient(135deg, #EF4444, #991B1B)'
  },
  {
    id: 'genesis',
    name: 'Genesis Mining',
    hashRate: 23.8,
    hashRatePercent: 4.0,
    blocksLast24h: 6,
    colorClass: 'bg-indigo-500',
    odds: 25.0,
    region: 'Europe',
    logoUrl: '/pool-logos/genesisdigitalassets.svg',
    gradient: 'linear-gradient(135deg, #6366F1, #4338CA)'
  },
  {
    id: 'bitfury',
    name: 'Bitfury',
    hashRate: 19.5,
    hashRatePercent: 3.3,
    blocksLast24h: 5,
    colorClass: 'bg-sky-600',
    odds: 30.30,
    region: 'Europe',
    logoUrl: '/pool-logos/bitfury.svg',
    gradient: 'linear-gradient(135deg, #0284C7, #0C4A6E)'
  },
  {
    id: 'kanopool',
    name: 'KanoPool',
    hashRate: 17.7,
    hashRatePercent: 3.0,
    blocksLast24h: 4,
    colorClass: 'bg-amber-600',
    odds: 33.33,
    region: 'North America',
    logoUrl: '/pool-logos/kanopool.svg',
    gradient: 'linear-gradient(135deg, #D97706, #78350F)'
  },
  {
    id: 'pegapool',
    name: 'PEGA Pool',
    hashRate: 14.8,
    hashRatePercent: 2.5,
    blocksLast24h: 4,
    colorClass: 'bg-fuchsia-600',
    odds: 40.0,
    region: 'North America',
    logoUrl: '/pool-logos/pegapool.svg',
    gradient: 'linear-gradient(135deg, #C026D3, #86198F)'
  },
  {
    id: 'emcd',
    name: 'EMCD',
    hashRate: 11.2,
    hashRatePercent: 1.9,
    blocksLast24h: 3,
    colorClass: 'bg-rose-600',
    odds: 52.63,
    region: 'Europe',
    logoUrl: '/pool-logos/emcd.svg',
    gradient: 'linear-gradient(135deg, #E11D48, #9F1239)'
  },
  {
    id: 'unknown',
    name: 'Unknown',
    hashRate: 7.3,
    hashRatePercent: 1.2,
    blocksLast24h: 2,
    colorClass: 'bg-gray-600',
    odds: 83.33,
    region: 'Unknown',
    logoUrl: '/pool-logos/unknown.svg',
    gradient: 'linear-gradient(135deg, #4B5563, #1F2937)'
  }
];

export const recentBlocks: Block[] = [
  {
    height: 888561,
    hash: '000000000000000000026e2c5c201e0963aad79f8ff21f282b468a343c153267',
    minedBy: 'SBI Crypto',
    timestamp: Date.now() - 840000, // 14 minutes ago
    size: 1283452,
    transactionCount: 1796,
    fees: 0.32,
    feesRangeText: '~2 sat/vB',
    feeRange: '1 - 105 sat/vB',
    totalBtc: 0.028
  },
  {
    height: 888560,
    hash: '000000000000000000012a7e9d96e8642682f2187b2da245da49d7226e8a82a5',
    minedBy: 'Foundry USA',
    timestamp: Date.now() - 1440000, // 24 minutes ago
    size: 1485213,
    transactionCount: 2372,
    fees: 0.45,
    feesRangeText: '~2 sat/vB',
    feeRange: '1 - 151 sat/vB',
    totalBtc: 0.039
  },
  {
    height: 888559,
    hash: '0000000000000000000ab7c1f29ae8127a89d833a0545823480e9c8e304fa8b6',
    minedBy: 'WhitePool',
    timestamp: Date.now() - 2280000, // 38 minutes ago
    size: 932641,
    transactionCount: 1343,
    fees: 0.21,
    feesRangeText: '~2 sat/vB',
    feeRange: '1 - 300 sat/vB',
    totalBtc: 0.028
  },
  {
    height: 888558,
    hash: '000000000000000000024a1c85a839be89da34f691cff26356e7c12a2c111fd1',
    minedBy: 'ViaBTC',
    timestamp: Date.now() - 2700000, // 45 minutes ago
    size: 1129574,
    transactionCount: 1736,
    fees: 0.28,
    feesRangeText: '~2 sat/vB',
    feeRange: '1 - 136 sat/vB',
    totalBtc: 0.026
  },
  {
    height: 888557,
    hash: '000000000000000000019ce64c08ea78b923812f9da28ceec53b69c9985d918f',
    minedBy: 'Foundry USA',
    timestamp: Date.now() - 3060000, // 51 minutes ago
    size: 1398732,
    transactionCount: 489,
    fees: 0.36,
    feesRangeText: '~2 sat/vB',
    feeRange: '2 - 138 sat/vB',
    totalBtc: 0.019
  },
  {
    height: 888556,
    hash: '0000000000000000000d54cda836ad0817b731bc07c6d76b1d982347129968b1',
    minedBy: 'Binance Pool',
    timestamp: Date.now() - 3900000, // 65 minutes ago
    size: 1012574,
    transactionCount: 1834,
    fees: 0.28,
    feesRangeText: '~1 sat/vB',
    feeRange: '1 - 118 sat/vB',
    totalBtc: 0.031
  },
  {
    height: 888555,
    hash: '0000000000000000000e76f31f24cd3c202dafbb9e37d192df650a4bf3a2fba9',
    minedBy: 'AntPool',
    timestamp: Date.now() - 4680000, // 78 minutes ago
    size: 1385632,
    transactionCount: 2216,
    fees: 0.32,
    feesRangeText: '~1 sat/vB',
    feeRange: '1 - 121 sat/vB',
    totalBtc: 0.033
  },
  {
    height: 888554,
    hash: '000000000000000000012a7e9d96e8642682f2187b2da245da49d7226e8a82a5',
    minedBy: 'F2Pool',
    timestamp: Date.now() - 5520000, // 92 minutes ago
    size: 1485213,
    transactionCount: 2372,
    fees: 0.45,
    feesRangeText: '~1 sat/vB',
    feeRange: '1 - 151 sat/vB',
    totalBtc: 0.037
  },
  {
    height: 888553,
    hash: '0000000000000000000ab7c1f29ae8127a89d833a0545823480e9c8e304fa8b6',
    minedBy: 'SlushPool',
    timestamp: Date.now() - 6360000, // 106 minutes ago
    size: 932641,
    transactionCount: 1343,
    fees: 0.21,
    feesRangeText: '~1 sat/vB',
    feeRange: '1 - 148 sat/vB',
    totalBtc: 0.029
  },
  {
    height: 888552,
    hash: '000000000000000000024a1c85a839be89da34f691cff26356e7c12a2c111fd1',
    minedBy: 'Poolin',
    timestamp: Date.now() - 7920000, // 132 minutes ago
    size: 1129574,
    transactionCount: 1736,
    fees: 0.28,
    feesRangeText: '~2 sat/vB',
    feeRange: '1 - 182 sat/vB',
    totalBtc: 0.026
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
  if (minutes < 60) return `${minutes} minutes ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? 's' : ''} ago`;
};
