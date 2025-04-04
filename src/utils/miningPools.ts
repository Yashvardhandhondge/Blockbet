import { MempoolBlock } from '@/services/mempoolService';
import { MiningPool } from './types';

// Function to calculate multiplier based on hashrate percentage with a cap of 50x
export const calculateMultiplier = (hashRatePercent: number): number => {
  if (!hashRatePercent || hashRatePercent <= 0) {
    return 50; // Maximum multiplier for unknown or zero hashrate
  }
  
  const multiplier = 100 / hashRatePercent;
  // Cap the multiplier at 50x
  return Math.min(multiplier, 50);
};

// Mock mining pools data for initial rendering
// Will be updated with real data from mempool.space API
export const miningPools: MiningPool[] = [
  {
    id: 'foundry',
    name: 'Foundry USA',
    hashRate: 90.5,
    hashRatePercent: 28.1,
    blocksLast24h: 41,
    odds: calculateMultiplier(28.1),
    gradient: 'linear-gradient(135deg, #FF9900, #FF5500)'
  },
  {
    id: 'antpool',
    name: 'Antpool',
    hashRate: 60.3,
    hashRatePercent: 18.7,
    blocksLast24h: 26,
    odds: calculateMultiplier(18.7),
    gradient: 'linear-gradient(135deg, #E31E24, #981116)'
  },
  {
    id: 'f2pool',
    name: 'F2Pool',
    hashRate: 42.8,
    hashRatePercent: 13.3,
    blocksLast24h: 19,
    odds: calculateMultiplier(13.3),
    gradient: 'linear-gradient(135deg, #5B6987, #313D5A)'
  },
  {
    id: 'binance',
    name: 'Binance Pool',
    hashRate: 33.1,
    hashRatePercent: 10.3,
    blocksLast24h: 15,
    odds: calculateMultiplier(10.3),
    gradient: 'linear-gradient(135deg, #F0B90B, #CF9C08)'
  },
  {
    id: 'viabtc',
    name: 'ViaBTC',
    hashRate: 21.6,
    hashRatePercent: 6.7,
    blocksLast24h: 9,
    odds: calculateMultiplier(6.7),
    gradient: 'linear-gradient(135deg, #446F25, #2A4517)'
  },
  {
    id: 'slushpool',
    name: 'Braiins Pool',
    hashRate: 18.5,
    hashRatePercent: 5.7,
    blocksLast24h: 8,
    odds: calculateMultiplier(5.7),
    gradient: 'linear-gradient(135deg, #186BBE, #0E3F71)'
  },
  {
    id: 'poolin',
    name: 'Poolin',
    hashRate: 15.1,
    hashRatePercent: 4.7,
    blocksLast24h: 7,
    odds: calculateMultiplier(4.7),
    gradient: 'linear-gradient(135deg, #0F7D5B, #085338)'
  },
  {
    id: 'luxor',
    name: 'Luxor',
    hashRate: 9.0,
    hashRatePercent: 2.8,
    blocksLast24h: 4,
    odds: calculateMultiplier(2.8),
    gradient: 'linear-gradient(135deg, #4B2E83, #2E1B51)'
  },
  {
    id: 'sbicrypto',
    name: 'SBI Crypto',
    hashRate: 8.2,
    hashRatePercent: 2.5,
    blocksLast24h: 3,
    odds: calculateMultiplier(2.5),
    gradient: 'linear-gradient(135deg, #0075BA, #00436B)'
  },
  {
    id: 'btccom',
    name: 'BTC.com',
    hashRate: 5.4,
    hashRatePercent: 1.7,
    blocksLast24h: 3,
    odds: calculateMultiplier(1.7),
    gradient: 'linear-gradient(135deg, #FF6600, #CC3600)'
  },
  {
    id: 'ultimuspool',
    name: 'Ultimus Pool',
    hashRate: 3.5,
    hashRatePercent: 1.1,
    blocksLast24h: 2,
    odds: calculateMultiplier(1.1),
    gradient: 'linear-gradient(135deg, #1F72C2, #0E3961)'
  },
  {
    id: 'unknown',
    name: 'Other/Unknown',
    hashRate: 13.8,
    hashRatePercent: 4.3,
    blocksLast24h: 6,
    odds: 50, // Fixed 50x multiplier for unknown miners
    gradient: 'linear-gradient(135deg, #666666, #333333)'
  }
];

// Get a random mining pool for simulation purposes
export const getRandomMiningPool = (): MiningPool => {
  const totalWeight = miningPools.reduce((sum, pool) => sum + pool.hashRatePercent, 0);
  let randomValue = Math.random() * totalWeight;
  
  for (const pool of miningPools) {
    randomValue -= pool.hashRatePercent;
    if (randomValue <= 0) {
      return pool;
    }
  }
  
  // Fallback to the first pool
  return miningPools[0];
};

// Update mining pool data based on real mempool.space API data
export const updateMiningPoolsData = (blocks: MempoolBlock[]): MiningPool[] => {
  // Count blocks by pool in the last 24 hours
  const poolCounts: {[key: string]: number} = {};
  const poolHashrates: {[key: string]: number} = {};
  let totalBlocks = 0;
  
  // Process blocks to gather pool statistics
  blocks.forEach(block => {
    if (block.extras?.pool?.name) {
      const poolName = block.extras.pool.name;
      const poolId = block.extras.pool.slug || poolName.toLowerCase().replace(/\s+/g, '');
      
      poolCounts[poolId] = (poolCounts[poolId] || 0) + 1;
      // We use block count as a proxy for hashrate
      poolHashrates[poolId] = (poolHashrates[poolId] || 0) + 1;
      totalBlocks++;
    }
  });
  
  // Calculate percentages and update mining pool data
  const updatedPools: MiningPool[] = [];
  let totalPercentage = 0;
  
  // First, process known pools
  for (const existingPool of miningPools) {
    const poolId = existingPool.id;
    if (poolCounts[poolId] && poolId !== 'unknown') {
      const percentage = (poolCounts[poolId] / totalBlocks) * 100;
      totalPercentage += percentage;
      
      updatedPools.push({
        ...existingPool,
        hashRatePercent: percentage,
        blocksLast24h: poolCounts[poolId],
        odds: calculateMultiplier(percentage)
      });
      
      // Remove processed pools
      delete poolCounts[poolId];
    } else if (poolId !== 'unknown') {
      // Keep existing pool with lower percentage if not found
      const reducedPercentage = existingPool.hashRatePercent / 2;
      totalPercentage += reducedPercentage;
      
      updatedPools.push({
        ...existingPool,
        hashRatePercent: reducedPercentage,
        blocksLast24h: Math.max(1, Math.floor(existingPool.blocksLast24h / 2)),
        odds: calculateMultiplier(reducedPercentage)
      });
    }
  }
  
  // Add any new pools discovered
  let otherPoolsPercentage = 0;
  let otherPoolsBlocks = 0;
  
  for (const [poolId, count] of Object.entries(poolCounts)) {
    if (poolId !== 'unknown') {
      const percentage = (count / totalBlocks) * 100;
      otherPoolsPercentage += percentage;
      otherPoolsBlocks += count;
    }
  }
  
  // Add the unknown/other pool with accumulated data
  updatedPools.push({
    id: 'unknown',
    name: 'Other/Unknown',
    hashRate: otherPoolsPercentage, // Using percentage as hashrate for simplicity
    hashRatePercent: otherPoolsPercentage,
    blocksLast24h: otherPoolsBlocks,
    odds: 50, // Fixed 50x multiplier for unknown miners
    gradient: 'linear-gradient(135deg, #666666, #333333)'
  });
  
  return updatedPools;
};
