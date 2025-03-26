
/**
 * Service for interacting with the Mempool.space API
 */

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

/**
 * Fetches recent blocks from the Mempool.space API
 * @returns Promise with an array of block data
 */
export const fetchRecentBlocks = async (): Promise<MempoolBlock[]> => {
  try {
    const response = await fetch(`${BASE_URL}/blocks`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch blocks: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
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
