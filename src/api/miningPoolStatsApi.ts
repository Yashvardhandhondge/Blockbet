
import { calculateMiningPoolStats, fetchRecentBlocks, calculateLiveMiningPoolStats } from '../services/mempoolService';
import { MiningPoolLiveStats } from '../utils/types';

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

/**
 * Fetches enhanced mining pool statistics with live data
 * @returns Promise with live mining pool statistics
 */
export const fetchLiveMiningPoolStats = async (): Promise<MiningPoolLiveStats[]> => {
  try {
    const stats = await calculateLiveMiningPoolStats();
    return stats;
  } catch (error) {
    console.error('Error fetching live mining pool stats:', error);
    throw error;
  }
};
