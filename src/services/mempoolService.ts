
/**
 * Service for interacting with the Mempool.space API
 */

import { MiningPoolLiveStats } from '../utils/types';

// Base URL for the Mempool.space API
const BASE_URL = 'https://mempool.space/api';

export interface MempoolBlock {
  id: string;
  height: number;
  version: number;
  timestamp: number;
  bits: number;
  nonce: number;
  difficulty: number;
  merkle_root: string;
  tx_count: number;
  size: number;
  weight: number;
  previousblockhash: string;
  mediantime: number;
  extras: {
    coinbaseRaw: string;
    medianFee: number;
    feeRange: number[];
    reward: number;
    totalFees: number;
    avgFee: number;
    avgFeeRate: number;
    pool: {
      id: string;
      name: string;
      slug: string;
    };
    avgTxSize: number;
    totalInputs: number;
    totalOutputs: number;
    totalOutputAmt: number;
    segwitTotalTxs: number;
    segwitTotalSize: number;
    segwitTotalWeight: number;
  };
}

export interface MempoolTransaction {
  txid: string;
  fee: number;
  vsize: number;
  value: number;
  status?: {
    confirmed: boolean;
    block_height?: number;
    block_hash?: string;
    block_time?: number;
  };
  firstSeen: number;
}

export interface MiningPoolStats {
  poolName: string;
  blocksCount: number;
  percentage: number;
}

export interface MiningHashrateStats {
  timestamp: number;
  avgHashrate: number;
  poolsShare: {
    [key: string]: number; // poolId -> share percentage
  }
}

/**
 * Fetches recent blocks from the Mempool.space API
 * @returns Promise with an array of block data
 */
export const fetchRecentBlocks = async (): Promise<MempoolBlock[]> => {
  try {
    // Add a cache buster parameter to avoid caching issues
    const response = await fetch(`${BASE_URL}/v1/blocks?limit=15&_=${Date.now()}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch blocks: ${response.status} ${response.statusText}`);
    }
    
    const blocks = await response.json();
    console.log('Fetched blocks:', blocks);
    return blocks;
  } catch (error) {
    console.error('Error fetching recent blocks:', error);
    throw error;
  }
};

/**
 * Fetches pending transactions from the mempool
 * @returns Promise with an array of transaction data
 */
export const fetchPendingTransactions = async (): Promise<MempoolTransaction[]> => {
  try {
    const response = await fetch(`${BASE_URL}/mempool/recent`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch pending transactions: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching pending transactions:', error);
    throw error;
  }
};

/**
 * Fetches mining hashrate statistics
 * @returns Promise with mining hashrate data
 */
export const fetchMiningHashrateStats = async (): Promise<MiningHashrateStats> => {
  try {
    const response = await fetch(`${BASE_URL}/v1/mining/hashrate/pools/1m`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch mining hashrate stats: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data[0]; // Get the most recent entry
  } catch (error) {
    console.error('Error fetching mining hashrate stats:', error);
    throw error;
  }
};

/**
 * Calculates the average block time based on recent blocks
 * @param blocks Array of recent blocks
 * @returns Average block time in minutes
 */
export const calculateAverageBlockTime = (blocks: MempoolBlock[]): number => {
  if (blocks.length < 2) {
    // Default to 10 minutes if not enough blocks
    return 10;
  }
  
  // Calculate time differences between consecutive blocks
  const timeDiffs: number[] = [];
  for (let i = 0; i < blocks.length - 1; i++) {
    const timeDiff = blocks[i].timestamp - blocks[i + 1].timestamp;
    timeDiffs.push(timeDiff);
  }
  
  // Calculate average in seconds and convert to minutes
  const avgTimeInSeconds = timeDiffs.reduce((sum, time) => sum + time, 0) / timeDiffs.length;
  return avgTimeInSeconds / 60;
};

/**
 * Estimates time until next block
 * @param blocks Array of recent blocks
 * @returns Estimated time string
 */
export const estimateNextBlockTime = (blocks: MempoolBlock[]): string => {
  if (blocks.length === 0) {
    return 'Unknown';
  }
  
  const avgBlockTimeMinutes = calculateAverageBlockTime(blocks);
  const lastBlockTime = blocks[0].timestamp;
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  const elapsedTimeMinutes = (currentTime - lastBlockTime) / 60;
  
  // If elapsed time is already greater than average block time
  if (elapsedTimeMinutes >= avgBlockTimeMinutes) {
    return 'Any moment';
  }
  
  const remainingMinutes = avgBlockTimeMinutes - elapsedTimeMinutes;
  
  if (remainingMinutes < 1) {
    return 'Under a minute';
  } else if (remainingMinutes < 2) {
    return 'About a minute';
  } else {
    return `~${Math.round(remainingMinutes)} min`;
  }
};

/**
 * Maps pool IDs from mempool.space API to our internal pool IDs
 * @param mempoolPoolId Pool ID from mempool.space API
 * @returns Our internal pool ID
 */
export const mapMempoolPoolIdToInternal = (mempoolPoolId: string, poolName: string): string => {
  const poolIdMap: Record<string, string> = {
    'foundryusa': 'foundry',
    'antpool': 'antpool',
    'f2pool': 'f2pool',
    'binancepool': 'binance',
    'viabtc': 'viabtc',
    'braiinspool': 'braiinspool',
    'poolin': 'poolin',
    'sbicrypto': 'sbicrypto',
    'btccom': 'bitcoincom',
    'luxor': 'luxor',
    'marapool': 'spiderpool', // Assuming some mappings
    'ultimuspool': 'ultimuspool',
    'slushpool': 'braiinspool', // SlushPool is now Braiins Pool
    'okex': 'ocean',
    'huobipool': 'bitfufupool',
    'unknown': 'unknown'
  };
  
  // First try direct match
  if (poolIdMap[mempoolPoolId.toLowerCase()]) {
    return poolIdMap[mempoolPoolId.toLowerCase()];
  }
  
  // Try matching by name parts
  const normalizedName = poolName.toLowerCase();
  if (normalizedName.includes('foundry')) return 'foundry';
  if (normalizedName.includes('antpool')) return 'antpool';
  if (normalizedName.includes('f2pool')) return 'f2pool';
  if (normalizedName.includes('binance')) return 'binance';
  if (normalizedName.includes('viabtc')) return 'viabtc';
  if (normalizedName.includes('braiins') || normalizedName.includes('slush')) return 'braiinspool';
  if (normalizedName.includes('poolin')) return 'poolin';
  if (normalizedName.includes('sbi')) return 'sbicrypto';
  if (normalizedName.includes('bitcoin.com') || normalizedName.includes('btc.com')) return 'bitcoincom';
  if (normalizedName.includes('luxor')) return 'luxor';
  if (normalizedName.includes('spider')) return 'spiderpool';
  if (normalizedName.includes('ultimus')) return 'ultimuspool';
  if (normalizedName.includes('ocean')) return 'ocean';
  if (normalizedName.includes('carbon')) return 'carbonnegative';
  if (normalizedName.includes('secpool')) return 'secpool';
  
  // Default to unknown if no match found
  return 'unknown';
};

/**
 * Calculates mining pool statistics for the last 24 hours
 * @param blocks Array of recent blocks
 * @returns Array of mining pool stats
 */
export const calculateMiningPoolStats = (blocks: MempoolBlock[]): MiningPoolStats[] => {
  // Filter blocks mined in the last 24 hours
  const oneDayAgo = Math.floor(Date.now() / 1000) - 86400; // 24 hours in seconds
  const last24HoursBlocks = blocks.filter(block => block.timestamp >= oneDayAgo);
  
  // Count blocks by mining pool
  const poolCounts = new Map<string, number>();
  last24HoursBlocks.forEach(block => {
    if (block.extras?.pool?.name) {
      const poolName = block.extras.pool.name;
      poolCounts.set(poolName, (poolCounts.get(poolName) || 0) + 1);
    }
  });
  
  // Calculate percentages and create stats objects
  const totalBlocks = last24HoursBlocks.length;
  const stats: MiningPoolStats[] = Array.from(poolCounts.entries()).map(([poolName, blocksCount]) => ({
    poolName,
    blocksCount,
    percentage: (blocksCount / totalBlocks) * 100
  }));
  
  // Sort by block count descending
  return stats.sort((a, b) => b.blocksCount - a.blocksCount);
};

/**
 * Calculate live mining pool statistics combining 24h blocks and hashrate data
 * @returns Promise with live mining pool statistics
 */
export const calculateLiveMiningPoolStats = async (): Promise<MiningPoolLiveStats[]> => {
  try {
    // Fetch recent blocks and hashrate stats
    const blocks = await fetchRecentBlocks();
    const blockStats = calculateMiningPoolStats(blocks);
    
    // Create stats map indexed by pool name
    const statsMap = new Map<string, MiningPoolLiveStats>();
    
    // Process block statistics
    blockStats.forEach(stat => {
      const internalPoolId = mapMempoolPoolIdToInternal(
        stat.poolName.toLowerCase().replace(/\s/g, ''),
        stat.poolName
      );
      
      statsMap.set(stat.poolName, {
        poolName: stat.poolName,
        poolId: internalPoolId,
        hashRatePercent: stat.percentage,
        blocksLast24h: stat.blocksCount,
        odds: calculateMultiplier(stat.percentage)
      });
    });
    
    // Try to get more accurate hashrate data if available
    try {
      const hashrateStats = await fetchMiningHashrateStats();
      
      if (hashrateStats && hashrateStats.poolsShare) {
        // Update stats with real hashrate data when available
        Object.entries(hashrateStats.poolsShare).forEach(([poolName, percentage]) => {
          if (statsMap.has(poolName)) {
            const stats = statsMap.get(poolName)!;
            stats.hashRatePercent = percentage * 100; // Convert from decimal to percentage
            stats.odds = calculateMultiplier(stats.hashRatePercent);
          } else {
            // Add new pool that wasn't seen in blocks
            const internalPoolId = mapMempoolPoolIdToInternal(
              poolName.toLowerCase().replace(/\s/g, ''),
              poolName
            );
            
            statsMap.set(poolName, {
              poolName,
              poolId: internalPoolId,
              hashRatePercent: percentage * 100, // Convert from decimal to percentage
              blocksLast24h: 0, // No blocks in the last 24h
              odds: calculateMultiplier(percentage * 100)
            });
          }
        });
      }
    } catch (error) {
      console.warn('Could not fetch hashrate stats, using block count percentages instead:', error);
    }
    
    // Convert map to array and sort by hashrate percentage descending
    return Array.from(statsMap.values())
      .sort((a, b) => b.hashRatePercent - a.hashRatePercent);
  } catch (error) {
    console.error('Error calculating live mining pool stats:', error);
    throw error;
  }
};

/**
 * Calculate multiplier based on hashrate percentage
 * @param percentage Hashrate percentage
 * @returns Multiplier capped at 50x
 */
const calculateMultiplier = (percentage: number): number => {
  if (percentage <= 0) return 50; // Avoid division by zero
  const multiplier = 100 / percentage;
  return Math.min(multiplier, 50); // Cap at 50x
};
