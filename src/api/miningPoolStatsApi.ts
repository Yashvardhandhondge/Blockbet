
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
    
    return poolStats;
  } catch (error) {
    console.error('Error fetching mining pool stats:', error);
    throw error;
  }
};
