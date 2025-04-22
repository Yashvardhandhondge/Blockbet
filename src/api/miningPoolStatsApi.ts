
import { fetchRecentBlocks, calculateMiningPoolStats, calculatePoolPayouts, MiningPoolStats, PoolPayout } from '../services/mempoolService';

const REFRESH_INTERVAL = 10000; // 10 seconds
let lastFetchTime = 0;
let cachedStats: MiningPoolStats[] = null;
let cachedPayouts: PoolPayout[] = null;

/**
 * Fetches mining pool statistics from Mempool.space API with caching
 * @returns Promise with mining pool statistics
 */
export const fetchMiningPoolStats = async () => {
  const now = Date.now();
  
  // Return cached data if it's fresh enough
  if (cachedStats && (now - lastFetchTime) < REFRESH_INTERVAL) {
    return cachedStats;
  }
  
  try {
    const blocks = await fetchRecentBlocks();
    
    if (!blocks || blocks.length === 0) {
      throw new Error('No blocks returned from API');
    }
    
    // Process blocks to replace 'Mining Squared' with 'Unknown'
    const processedBlocks = blocks.map(block => {
      if (block.extras?.pool?.name === 'Mining Squared') {
        return {
          ...block,
          extras: {
            ...block.extras,
            pool: {
              ...block.extras.pool,
              name: 'Unknown',
              id: 'unknown',
              slug: 'unknown'
            }
          }
        };
      }
      return block;
    });
    
    const poolStats = calculateMiningPoolStats(processedBlocks);
    
    // Update cache
    cachedStats = poolStats;
    lastFetchTime = now;
    
    return poolStats;
  } catch (error) {
    console.error('Error fetching mining pool stats:', error);
    throw error;
  }
};

/**
 * Fetches and calculates mining pool payout multipliers based on 24h block counts
 * @returns Promise with mining pool payout information
 */
export const fetchMiningPoolPayouts = async (): Promise<PoolPayout[]> => {
  const now = Date.now();
  
  // Return cached data if it's fresh enough
  if (cachedPayouts && (now - lastFetchTime) < REFRESH_INTERVAL) {
    return cachedPayouts;
  }
  
  try {
    // Reuse stats if we already have them
    const stats = cachedStats && (now - lastFetchTime) < REFRESH_INTERVAL
      ? cachedStats
      : await fetchMiningPoolStats();
    
    // Calculate payout multipliers based on block counts
    const payouts = calculatePoolPayouts(stats);
    
    // Update cache
    cachedPayouts = payouts;
    
    return payouts;
  } catch (error) {
    console.error('Error calculating mining pool payouts:', error);
    throw error;
  }
};
