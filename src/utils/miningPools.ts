
import { MiningPool } from './types';
import { MiningPoolStats } from '../services/mempoolService';

// Base mining pool data
export const miningPools: MiningPool[] = [
  {
    id: 'foundry',
    name: 'Foundry USA',
    hashRate: 156.3,
    hashRatePercent: 26.5,
    blocksLast24h: 38,
    colorClass: 'bg-orange-500',
    odds: 3.77, // Will be dynamically updated
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
    odds: 5.99, // Will be dynamically updated
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
    odds: 7.94, // Will be dynamically updated
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
    odds: 11.36, // Will be dynamically updated
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
    odds: 16.67, // Will be dynamically updated
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
    odds: 19.23, // Will be dynamically updated
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
    odds: 20.83, // Will be dynamically updated
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
    odds: 21.74, // Will be dynamically updated
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
    odds: 22.73, // Will be dynamically updated
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
    odds: 23.81, // Will be dynamically updated
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
    odds: 25.0, // Will be dynamically updated
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
    odds: 28.57, // Will be dynamically updated
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
    odds: 30.30, // Will be dynamically updated
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
    odds: 33.33, // Will be dynamically updated
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
    odds: 38.46, // Will be dynamically updated
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
    odds: 47.62, // Will be dynamically updated
    region: 'Asia',
    logoUrl: '/pool-logos/BitFuFuPool.svg',
    gradient: 'linear-gradient(135deg, #DB2777, #9D174D)'
  },
  {
    id: 'nicehash',
    name: 'NiceHash',
    hashRate: 11.8,
    hashRatePercent: 2.0,
    blocksLast24h: 3,
    colorClass: 'bg-blue-400',
    odds: 50.0, // Will be dynamically updated
    region: 'Global',
    logoUrl: '/pool-logos/nicehash.svg',
    gradient: 'linear-gradient(135deg, #38BDF8, #0369A1)'
  },
  {
    id: 'whitepool',
    name: 'WhitePool',
    hashRate: 11.2,
    hashRatePercent: 1.9,
    blocksLast24h: 3,
    colorClass: 'bg-gray-100',
    odds: 52.63, // Will be dynamically updated
    region: 'Europe',
    logoUrl: '/pool-logos/whitepool.svg',
    gradient: 'linear-gradient(135deg, #ffffff, #d4d4d8)'
  },
  {
    id: 'mining-squared',
    name: 'Mining Squared',
    hashRate: 18.9,
    hashRatePercent: 3.2,
    blocksLast24h: 5,
    colorClass: 'bg-gray-600',
    odds: 31.25, // Will be dynamically updated
    region: 'Global',
    logoUrl: '/pool-logos/MiningSquared.svg',
    gradient: 'linear-gradient(135deg, #4B5563, #1F2937)'
  },
  {
    id: 'unknown',
    name: 'Unknown',
    hashRate: 7.3,
    hashRatePercent: 1.2,
    blocksLast24h: 2,
    colorClass: 'bg-gray-600',
    odds: 83.33, // Will be dynamically updated
    region: 'Unknown',
    logoUrl: '/pool-logos/unknown.svg',
    gradient: 'linear-gradient(135deg, #4B5563, #1F2937)'
  },
  {
    id: 'empty',
    name: 'Empty Block',
    hashRate: 0,
    hashRatePercent: 0,
    blocksLast24h: 0,
    colorClass: 'bg-gray-800',
    odds: 35.0, // This will remain static at 35x
    region: 'None',
    logoUrl: '/placeholder.svg',
    gradient: 'linear-gradient(135deg, #1F2937, #111827)'
  }
];

/**
 * Updates mining pool data with real-time statistics from the API
 * @param apiPoolStats Mining pool statistics from the API
 * @returns Updated array of mining pools
 */
export const updateMiningPoolsWithApiData = (apiPoolStats: MiningPoolStats[]): MiningPool[] => {
  // Create a deep copy of the original mining pools
  const updatedPools = JSON.parse(JSON.stringify(miningPools)) as MiningPool[];
  
  // Process each pool from the API statistics
  apiPoolStats.forEach(stat => {
    // Try to find a matching pool in our predefined list
    const matchingPool = updatedPools.find(pool => {
      // Match by name (case-insensitive) or by similar naming patterns
      const poolName = stat.poolName.toLowerCase();
      const localName = pool.name.toLowerCase();
      
      return poolName === localName || 
             poolName.includes(localName) || 
             localName.includes(poolName) ||
             (poolName.includes('mining') && poolName.includes('squared') && localName.includes('unknown')) ||
             (poolName === 'mining squared' && localName === 'unknown');
    });
    
    if (matchingPool) {
      // Update the pool data
      matchingPool.blocksLast24h = stat.blocksCount;
      matchingPool.hashRate = stat.hashrate || matchingPool.hashRate;
      matchingPool.hashRatePercent = stat.percentage || matchingPool.hashRatePercent;
      
      // Update the odds (payout multiplier) if provided
      if (stat.multiplier && matchingPool.id !== 'empty') {
        matchingPool.odds = stat.multiplier;
      }
    } else {
      console.log(`No matching pool found for API pool: ${stat.poolName}`);
    }
  });
  
  // Ensure Empty Block always has 35x payout
  const emptyBlock = updatedPools.find(pool => pool.id === 'empty');
  if (emptyBlock) {
    emptyBlock.odds = 35.0;
  }
  
  return updatedPools;
};

/**
 * Gets a random mining pool based on their hashrate percentages
 * @returns A randomly selected mining pool
 */
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
