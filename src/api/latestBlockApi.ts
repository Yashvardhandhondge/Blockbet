
import { fetchRecentBlocks, calculateAverageBlockTime, estimateNextBlockTime } from '../services/mempoolService';
import { Block } from '@/utils/mockData';

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
  try {
    // Fetch recent blocks from the API
    const mempoolBlocks = await fetchRecentBlocks();
    
    if (!mempoolBlocks || mempoolBlocks.length === 0) {
      throw new Error('No blocks returned from API');
    }
    
    // Calculate average block time
    const avgBlockTime = calculateAverageBlockTime(mempoolBlocks);
    
    // Estimate next block time
    const estimatedNextBlock = estimateNextBlockTime(mempoolBlocks);
    
    // Map the Mempool API responses to our Block interface
    const mappedBlocks: Block[] = mempoolBlocks.map(block => ({
      height: block.height,
      hash: block.id,
      minedBy: block.extras?.pool?.name || 'Unknown',
      timestamp: block.timestamp * 1000, // Convert from seconds to milliseconds
      size: block.size,
      transactionCount: block.tx_count,
      fees: block.extras?.totalFees || 0,
      feesRangeText: `~${block.extras?.medianFee || 0} sat/vB`,
      feeRange: block.extras?.feeRange 
        ? `${block.extras.feeRange[0]} - ${block.extras.feeRange[block.extras.feeRange.length - 1]} sat/vB`
        : '0 - 0 sat/vB',
      totalBtc: ((block.extras?.reward || 0) + (block.extras?.totalFees || 0)) / 100000000 // Convert sats to BTC
    }));
    
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
