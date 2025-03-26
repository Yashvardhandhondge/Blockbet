
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
    const mappedBlocks: Block[] = mempoolBlocks.map(block => {
      // Convert sat to BTC (1 BTC = 100,000,000 satoshis)
      const blockReward = 6.25; // Current block reward in BTC
      const feesInBtc = block.extras?.totalFees ? block.extras.totalFees / 100000000 : 0;
      const totalBtc = blockReward + feesInBtc;
      
      // Get fee range
      const feeRange = block.extras?.feeRange 
        ? `${block.extras.feeRange[0]} - ${block.extras.feeRange[block.extras.feeRange.length - 1]} sat/vB`
        : '0 - 0 sat/vB';
      
      // Get median fee for fee display
      const medianFee = block.extras?.medianFee || 0;
      
      return {
        height: block.height,
        hash: block.id, // The block hash
        minedBy: block.extras?.pool?.name || 'Unknown',
        timestamp: block.timestamp * 1000, // Convert from seconds to milliseconds
        size: block.size,
        transactionCount: block.tx_count,
        fees: block.extras?.totalFees || 0,
        feesRangeText: `~${medianFee} sat/vB`,
        feeRange: feeRange,
        totalBtc: totalBtc // Total BTC (block reward + fees)
      };
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
