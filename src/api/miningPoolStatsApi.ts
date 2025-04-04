
import { fetchRecentBlocks, calculateMiningPoolStats, MempoolBlock } from '../services/mempoolService';
import { MiningPool } from '@/utils/types';
import { updateMiningPoolsData } from '@/utils/miningPools';

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
    
    // Update mining pools data based on recent blocks
    updateMiningPoolsWithRealData(blocks);
    
    return poolStats;
  } catch (error) {
    console.error('Error fetching mining pool stats:', error);
    throw error;
  }
};

/**
 * Updates mining pools data with real-time information
 * @param blocks Recent block data from mempool.space API
 */
export const updateMiningPoolsWithRealData = (blocks: MempoolBlock[]): void => {
  try {
    // Update global mining pools data
    const updatedPools = updateMiningPoolsData(blocks);
    
    // Replace the existing mining pools array - handled automatically
    // by the utility function
    
    console.log('Mining pools data updated with real-time information');
  } catch (error) {
    console.error('Error updating mining pools with real data:', error);
  }
};
