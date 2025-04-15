import { fetchRecentBlocks, calculateAverageBlockTime, estimateNextBlockTime } from '../services/mempoolService';
import { Block } from '@/utils/types';

export interface LatestBlockData {
  latestBlock: Block;
  previousBlocks: Block[];
  avgBlockTime: number;
  estimatedNextBlock: string;
}

/**
 * Fetches latest block data from Mempool.space API
 * @returns Promise with latest block data
 */
export const fetchLatestBlockData = async (): Promise<LatestBlockData> => {
  const start = performance.now();
  
  try {
    const mempoolBlocks = await fetchRecentBlocks();
    
    if (!mempoolBlocks || mempoolBlocks.length === 0) {
      throw new Error('No blocks returned from API');
    }

    // Calculate timing metrics
    const avgBlockTime = calculateAverageBlockTime(mempoolBlocks);
    const estimatedNextBlock = estimateNextBlockTime(mempoolBlocks);
    
    // Map the blocks with optimized processing
    const mappedBlocks = await Promise.all(mempoolBlocks.map(block => {
      const blockReward = 6.25;
      const feesInBtc = block.extras?.totalFees ? block.extras.totalFees / 100000000 : 0;
      const totalBtc = blockReward + feesInBtc;
      
      return {
        height: block.height,
        hash: block.id,
        minedBy: block.extras?.pool?.name || 'Unknown',
        timestamp: block.timestamp * 1000,
        size: block.size,
        transactionCount: block.tx_count,
        fees: block.extras?.totalFees || 0,
        feesRangeText: `~${block.extras?.medianFee || 0} sat/vB`,
        feeRange: block.extras?.feeRange ? 
          `${block.extras.feeRange[0]} - ${block.extras.feeRange[block.extras.feeRange.length - 1]} sat/vB` :
          '0 - 0 sat/vB',
        totalBtc
      };
    }));

    const end = performance.now();
    console.log('Block data processing performance:', {
      totalTime: Math.round(end - start) + 'ms',
      blockCount: mappedBlocks.length,
      avgBlockTime: avgBlockTime.toFixed(2) + ' min',
      timestamp: new Date().toISOString()
    });
    
    return {
      latestBlock: mappedBlocks[0],
      previousBlocks: mappedBlocks.slice(1),
      avgBlockTime,
      estimatedNextBlock
    };
  } catch (error) {
    console.error('Error fetching latest block data:', error);
    throw error;
  }
};
