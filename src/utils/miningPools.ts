
import { MiningPool } from './types';

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
    logoUrl: '/pool-logos/foundryusa.svg',
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
    logoUrl: '/pool-logos/antpool.svg',
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
    logoUrl: '/pool-logos/binancepool.svg',
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
    id: 'braiinspool',
    name: 'Braiins Pool',
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
    id: 'sbicrypto',
    name: 'SBI Crypto',
    hashRate: 27.3,
    hashRatePercent: 4.6,
    blocksLast24h: 7,
    colorClass: 'bg-blue-700',
    odds: 21.74,
    region: 'Asia',
    logoUrl: '/pool-logos/sbicrypto.svg',
    gradient: 'linear-gradient(135deg, #1D4ED8, #1E3A8A)'
  },
  {
    id: 'bitcoincom',
    name: 'Bitcoin.com',
    hashRate: 26.2,
    hashRatePercent: 4.4,
    blocksLast24h: 6,
    colorClass: 'bg-red-500',
    odds: 22.73,
    region: 'Asia',
    logoUrl: '/pool-logos/bitcoincom.svg',
    gradient: 'linear-gradient(135deg, #EF4444, #991B1B)'
  },
  {
    id: 'spiderpool',
    name: 'SpiderPool',
    hashRate: 24.9,
    hashRatePercent: 4.2,
    blocksLast24h: 6,
    colorClass: 'bg-yellow-600',
    odds: 23.81,
    region: 'Asia',
    logoUrl: '/pool-logos/spiderpool.svg',
    gradient: 'linear-gradient(135deg, #FFBE1E, #CA8A04)'
  },
  {
    id: 'luxor',
    name: 'Luxor',
    hashRate: 23.8,
    hashRatePercent: 4.0,
    blocksLast24h: 6,
    colorClass: 'bg-amber-500',
    odds: 25.0,
    region: 'North America',
    logoUrl: '/pool-logos/luxor.svg',
    gradient: 'linear-gradient(135deg, #F0BB31, #F59E0B)'
  },
  {
    id: 'ultimuspool',
    name: 'ULTIMUSPOOL',
    hashRate: 20.7,
    hashRatePercent: 3.5,
    blocksLast24h: 5,
    colorClass: 'bg-indigo-600',
    odds: 28.57,
    region: 'Europe',
    logoUrl: '/pool-logos/ultimuspool.svg',
    gradient: 'linear-gradient(135deg, #1652EE, #4F46E5)'
  },
  {
    id: 'ocean',
    name: 'OCEAN',
    hashRate: 19.5,
    hashRatePercent: 3.3,
    blocksLast24h: 5,
    colorClass: 'bg-sky-600',
    odds: 30.30,
    region: 'North America',
    logoUrl: '/pool-logos/Ocean.svg',
    gradient: 'linear-gradient(135deg, #72BBFF, #0284C7)'
  },
  {
    id: 'secpool',
    name: 'SECPOOL',
    hashRate: 17.7,
    hashRatePercent: 3.0,
    blocksLast24h: 4,
    colorClass: 'bg-purple-600',
    odds: 33.33,
    region: 'Europe',
    logoUrl: '/pool-logos/secpool.svg',
    gradient: 'linear-gradient(135deg, #9333EA, #7E22CE)'
  },
  {
    id: 'carbonnegative',
    name: 'Carbon Negative',
    hashRate: 15.3,
    hashRatePercent: 2.6,
    blocksLast24h: 4,
    colorClass: 'bg-green-700',
    odds: 38.46,
    region: 'North America',
    logoUrl: '/pool-logos/carbonnegative.svg',
    gradient: 'linear-gradient(135deg, #15803D, #166534)'
  },
  {
    id: 'bitfufupool',
    name: 'BitFuFuPool',
    hashRate: 12.4,
    hashRatePercent: 2.1,
    blocksLast24h: 3,
    colorClass: 'bg-pink-600',
    odds: 47.62,
    region: 'Asia',
    logoUrl: '/pool-logos/BitFuFuPool.svg',
    gradient: 'linear-gradient(135deg, #DB2777, #9D174D)'
  },
  {
    id: 'whitepool',
    name: 'WhitePool',
    hashRate: 11.2,
    hashRatePercent: 1.9,
    blocksLast24h: 3,
    colorClass: 'bg-gray-100',
    odds: 52.63,
    region: 'Europe',
    logoUrl: '/pool-logos/whitepool.svg',
    gradient: 'linear-gradient(135deg, #ffffff, #d4d4d8)'
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
  },
  {
    id: 'empty',
    name: 'Empty Block',
    hashRate: 4.2,
    hashRatePercent: 0.7,
    blocksLast24h: 1,
    colorClass: 'bg-gray-800',
    odds: 142.86,
    region: 'N/A',
    logoUrl: '/Mempool Bitcoin Explorer.svg',
    gradient: 'linear-gradient(135deg, #18181B, #09090B)'
  },
  {
    id: 'btccom',
    name: 'BTC.com',
    hashRate: 18.5,
    hashRatePercent: 3.1,
    blocksLast24h: 4,
    colorClass: 'bg-red-400',
    odds: 32.26,
    region: 'Asia',
    logoUrl: '/pool-logos/btccom.svg',
    gradient: 'linear-gradient(135deg, #FF6B6B, #CC4444)'
  },
  {
    id: 'kucoinpool',
    name: 'KuCoin Pool',
    hashRate: 14.8,
    hashRatePercent: 2.5,
    blocksLast24h: 4,
    colorClass: 'bg-emerald-500',
    odds: 40.0,
    region: 'Asia',
    logoUrl: '/pool-logos/kucoinpool.svg',
    gradient: 'linear-gradient(135deg, #10B981, #047857)'
  },
  {
    id: 'minerium',
    name: 'Minerium',
    hashRate: 10.1,
    hashRatePercent: 1.7,
    blocksLast24h: 2,
    colorClass: 'bg-blue-400',
    odds: 58.82,
    region: 'Europe',
    logoUrl: '/pool-logos/minerium.svg',
    gradient: 'linear-gradient(135deg, #60A5FA, #2563EB)'
  },
  {
    id: 'emcdpool',
    name: 'EMCD Pool',
    hashRate: 9.5,
    hashRatePercent: 1.6,
    blocksLast24h: 2,
    colorClass: 'bg-cyan-500',
    odds: 62.5,
    region: 'Europe',
    logoUrl: '/pool-logos/emcdpool.svg',
    gradient: 'linear-gradient(135deg, #22D3EE, #0891B2)'
  },
  {
    id: 'pegapool',
    name: 'PEGA Pool',
    hashRate: 8.9,
    hashRatePercent: 1.5,
    blocksLast24h: 2,
    colorClass: 'bg-lime-500',
    odds: 66.67,
    region: 'Europe',
    logoUrl: '/pool-logos/pegapool.svg',
    gradient: 'linear-gradient(135deg, #84CC16, #4D7C0F)'
  },
  {
    id: 'titan',
    name: 'Titan Pool',
    hashRate: 6.5,
    hashRatePercent: 1.1,
    blocksLast24h: 2,
    colorClass: 'bg-violet-500',
    odds: 90.91,
    region: 'North America',
    logoUrl: '/pool-logos/titan.svg',
    gradient: 'linear-gradient(135deg, #8B5CF6, #6D28D9)'
  },
  {
    id: 'bitfury',
    name: 'Bitfury',
    hashRate: 5.3,
    hashRatePercent: 0.9,
    blocksLast24h: 1,
    colorClass: 'bg-blue-300',
    odds: 111.11,
    region: 'Europe',
    logoUrl: '/pool-logos/bitfury.svg',
    gradient: 'linear-gradient(135deg, #93C5FD, #3B82F6)'
  },
  {
    id: 'arkpool',
    name: 'ArkPool',
    hashRate: 4.8,
    hashRatePercent: 0.8,
    blocksLast24h: 1,
    colorClass: 'bg-amber-400',
    odds: 125.0,
    region: 'Asia',
    logoUrl: '/pool-logos/arkpool.svg',
    gradient: 'linear-gradient(135deg, #FBBF24, #D97706)'
  }
];

// Calculate odds based on hash rate percentage
export const calculateOdds = (hashRatePercent: number): number => {
  // Formula: 100 / hashRatePercent
  // Minimum odds of 1.5
  if (!hashRatePercent || hashRatePercent <= 0) {
    return 100;
  }
  return Math.max(100 / hashRatePercent, 1.5);
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

// Function to update mining pool data with real-time information
export const updateMiningPoolsData = (
  poolStats: Array<{ 
    poolName: string, 
    blocksCount: number, 
    percentage: number 
  }>
): MiningPool[] => {
  const updatedPools = [...miningPools];
  
  // Update pools with real-time data
  poolStats.forEach(stat => {
    const poolIndex = updatedPools.findIndex(p => 
      p.name.toLowerCase() === stat.poolName.toLowerCase() ||
      stat.poolName.toLowerCase().includes(p.id.toLowerCase()) ||
      p.id.toLowerCase().includes(stat.poolName.toLowerCase())
    );
    
    if (poolIndex !== -1) {
      updatedPools[poolIndex] = {
        ...updatedPools[poolIndex],
        hashRatePercent: stat.percentage,
        blocksLast24h: stat.blocksCount,
        // Recalculate odds based on new percentage
        odds: calculateOdds(stat.percentage)
      };
    }
  });
  
  return updatedPools;
};
