/**
 * Service for interacting with the Mempool.space API
 */

// Base URL for the Mempool.space API
const BASE_URL = 'https://mempool.space/api';
const FETCH_TIMEOUT = 5000; // 5 seconds

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
  hashrate: number; // EH/s
}

let lastBlockHash: string | null = null;
let lastBlockTime: number = 0;

/**
 * Fetches recent blocks from the Mempool.space API
 * @returns Promise with an array of block data
 */
export const fetchRecentBlocks = async (): Promise<MempoolBlock[]> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

    const response = await fetch(
      `${BASE_URL}/v1/blocks?limit=15&_=${Date.now()}`,
      { signal: controller.signal }
    );
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch blocks: ${response.status} ${response.statusText}`);
    }
    
    const blocks = await response.json();
    
    // Check if we have a new block
    if (blocks[0]?.hash !== lastBlockHash) {
      lastBlockHash = blocks[0].hash;
      lastBlockTime = Date.now();
      // Dispatch event for new block
      window.dispatchEvent(new CustomEvent('new-block', { detail: blocks[0] }));
    }
    
    return blocks;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn('Block fetch timed out, retrying...');
      return fetchRecentBlocks();
    }
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
  if (blocks.length < 2) return 10; // Default to 10 minutes
  
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
  console.log('Calculating mining pool stats from blocks:', {
    totalBlocks: blocks.length,
    timeRange: {
      oldest: new Date(blocks[blocks.length-1]?.timestamp * 1000).toISOString(),
      newest: new Date(blocks[0]?.timestamp * 1000).toISOString()
    }
  });

  const oneDayAgo = Math.floor(Date.now() / 1000) - 86400;
  const last24HoursBlocks = blocks.filter(block => block.timestamp >= oneDayAgo);
  
  console.log('Filtered last 24h blocks:', {
    count: last24HoursBlocks.length,
    periodStart: new Date(oneDayAgo * 1000).toISOString()
  });

  // Count blocks by mining pool and calculate time differences
  const poolStats = new Map<string, { count: number, timestamps: number[] }>();
  
  last24HoursBlocks.forEach((block, index) => {
    if (block.extras?.pool?.name) {
      const poolName = block.extras.pool.name;
      const stats = poolStats.get(poolName) || { count: 0, timestamps: [] };
      stats.count += 1;
      stats.timestamps.push(block.timestamp);
      poolStats.set(poolName, stats);
    }
  });
  
  const totalBlocks = last24HoursBlocks.length;
  const stats: MiningPoolStats[] = [];
  
  // Calculate statistics for each pool
  for (const [poolName, data] of poolStats.entries()) {
    const percentage = (data.count / totalBlocks) * 100;
    
    // Calculate estimated hashrate based on block times and difficulty
    let hashrate = 0;
    if (data.timestamps.length > 1) {
      const avgBlockTime = calculateAverageBlockTime(last24HoursBlocks);
      const networkHashrate = calculateNetworkHashrate(last24HoursBlocks[0].difficulty, avgBlockTime * 60);
      hashrate = (networkHashrate * percentage) / 100;
      
      console.log(`Pool stats calculated for ${poolName}:`, {
        blocks: data.count,
        percentage: percentage.toFixed(2) + '%',
        hashrate: hashrate.toFixed(2) + ' EH/s',
        avgBlockTime: avgBlockTime.toFixed(2) + ' min',
        networkHashrate: networkHashrate.toFixed(2) + ' EH/s'
      });
    }
    
    stats.push({
      poolName,
      blocksCount: data.count,
      percentage,
      hashrate
    });
  }

  console.log('Final mining pool stats:', stats);
  return stats.sort((a, b) => b.blocksCount - a.blocksCount);
};

/**
 * Calculates network hashrate based on difficulty and block time
 * @param difficulty Network difficulty
 * @param blockTime Average block time in seconds
 * @returns Network hashrate in EH/s
 */
export const calculateNetworkHashrate = (difficulty: number, blockTime: number): number => {
  // Network hashrate in EH/s = (difficulty * 2^32) / (blocktime * 10^18)
  return (difficulty * Math.pow(2, 32)) / (blockTime * Math.pow(10, 18));
};
