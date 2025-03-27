
import { MiningPool } from '@/utils/types';

// Mock mining pool data
export const mockMiningPools: MiningPool[] = [
  {
    id: 'foundry',
    name: 'Foundry USA',
    hashRate: 70.5,
    hashRatePercent: 33.8,
    blocksLast24h: 52,
    colorClass: 'bg-amber-600',
    odds: 2.95,
    region: 'North America',
    logoUrl: '/pool-logos/foundryusa.svg',
    gradient: 'bg-gradient-to-r from-amber-600 to-amber-700'
  },
  {
    id: 'antpool',
    name: 'AntPool',
    hashRate: 45.2,
    hashRatePercent: 21.7,
    blocksLast24h: 34,
    colorClass: 'bg-red-600',
    odds: 4.61,
    region: 'Asia',
    logoUrl: '/pool-logos/antpool.svg',
    gradient: 'bg-gradient-to-r from-red-600 to-red-700'
  },
  {
    id: 'f2pool',
    name: 'F2Pool',
    hashRate: 30.4,
    hashRatePercent: 14.6,
    blocksLast24h: 22,
    colorClass: 'bg-blue-600',
    odds: 6.85,
    region: 'Asia',
    logoUrl: '/pool-logos/f2pool.svg',
    gradient: 'bg-gradient-to-r from-blue-600 to-blue-700'
  },
  {
    id: 'binance',
    name: 'Binance Pool',
    hashRate: 20.1,
    hashRatePercent: 9.6,
    blocksLast24h: 15,
    colorClass: 'bg-yellow-500',
    odds: 10.42,
    region: 'Asia',
    logoUrl: '/pool-logos/binancepool.svg',
    gradient: 'bg-gradient-to-r from-yellow-500 to-yellow-600'
  },
  {
    id: 'viabtc',
    name: 'ViaBTC',
    hashRate: 18.7,
    hashRatePercent: 9.0,
    blocksLast24h: 14,
    colorClass: 'bg-green-600',
    odds: 11.11,
    region: 'Asia',
    logoUrl: '/pool-logos/viabtc.svg',
    gradient: 'bg-gradient-to-r from-green-600 to-green-700'
  },
  {
    id: 'slushpool',
    name: 'SlushPool',
    hashRate: 12.9,
    hashRatePercent: 6.2,
    blocksLast24h: 10,
    colorClass: 'bg-indigo-600',
    odds: 16.13,
    region: 'Europe',
    logoUrl: '/pool-logos/slushpool.svg',
    gradient: 'bg-gradient-to-r from-indigo-600 to-indigo-700'
  },
  {
    id: 'poolin',
    name: 'Poolin',
    hashRate: 10.4,
    hashRatePercent: 5.0,
    blocksLast24h: 8,
    colorClass: 'bg-teal-600',
    odds: 20.0,
    region: 'Asia',
    logoUrl: '/pool-logos/poolin.svg',
    gradient: 'bg-gradient-to-r from-teal-600 to-teal-700'
  }
];

// Mock user balance
export const mockUserBalance = {
  availableBalance: 0.05,
  inPlay: 0.015
};

// Format BTC value to string
export const formatBTC = (amount: number): string => {
  return amount.toFixed(8);
};

// Format timeAgo
export const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const elapsedMs = now - timestamp;
  
  const seconds = Math.floor(elapsedMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days} day${days === 1 ? '' : 's'} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  } else {
    return `${seconds} second${seconds === 1 ? '' : 's'} ago`;
  }
};

// Mock bet history
export const mockBetHistory = [
  {
    id: 1,
    poolId: 'foundry',
    poolName: 'Foundry USA',
    amount: 150000,
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
    isWin: true,
    blockHeight: 824523
  },
  {
    id: 2,
    poolId: 'antpool',
    poolName: 'AntPool',
    amount: 75000,
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    isWin: false,
    blockHeight: 824512
  },
  {
    id: 3,
    poolId: 'f2pool',
    poolName: 'F2Pool',
    amount: 200000,
    timestamp: new Date(Date.now() - 1000 * 60 * 180),
    isWin: false,
    blockHeight: 824505
  },
  {
    id: 4,
    poolId: 'binance',
    poolName: 'Binance Pool',
    amount: 120000,
    timestamp: new Date(Date.now() - 1000 * 60 * 240),
    isWin: true,
    blockHeight: 824498
  }
];

// Mock deposits
export const mockDeposits = [
  {
    id: 1,
    amount: 500000,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    txId: '3a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u'
  },
  {
    id: 2,
    amount: 1200000,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    txId: '7h8i9j0k1l2m3n4o5p6q7r8s9t0u3a1b2c3d4e5f6g'
  }
];

// Mock withdrawals
export const mockWithdrawals = [
  {
    id: 1,
    amount: 300000,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10),
    txId: '9j0k1l2m3n4o5p6q7r8s9t0u3a1b2c3d4e5f6g7h8i',
    status: 'completed' as const
  },
  {
    id: 2,
    amount: 700000,
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    txId: '5p6q7r8s9t0u3a1b2c3d4e5f6g7h8i9j0k1l2m3n4o',
    status: 'pending' as const
  }
];
