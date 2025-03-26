
import { fetchRecentBlocks, calculateMiningPoolStats } from '../services/mempoolService';

/**
 * Fetches mining pool statistics from Mempool.space API
 * @returns Promise with mining pool statistics
 */
export const fetchMiningPoolStats = async () => {
  try {
    const blocks = await fetchRecentBlocks();
    
    if (!blocks || blocks.length === 0) {
      throw new Error('No blocks returned from API');
    }
    
    const poolStats = calculateMiningPoolStats(blocks);
    
    return poolStats;
  } catch (error) {
    console.error('Error fetching mining pool stats:', error);
    throw error;
  }
};
