
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
      
      // Get fee range as min - max sat/vB
      const feeRange = block.extras?.feeRange 
        ? `${block.extras.feeRange[0]} - ${block.extras.feeRange[block.extras.feeRange.length - 1]} sat/vB`
        : '0 - 0 sat/vB';
      
      // Get median fee for fee display
      const medianFee = block.extras?.medianFee || 0;
      
      // Calculate minutes since block was mined
      const blockTimestamp = block.timestamp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const minutesAgo = Math.floor((currentTime - blockTimestamp) / (60 * 1000));
      
      console.log(`Block ${block.height} mapping:`, {
        height: block.height,
        minedBy: block.extras?.pool?.name || 'Unknown',
        feesInBtc,
        totalBtc,
        txCount: block.tx_count,
        medianFee,
        feeRange,
        minutesAgo
      });
      
      return {
        height: block.height,
        hash: block.id, // The block hash
        minedBy: block.extras?.pool?.name || 'Unknown',
        timestamp: blockTimestamp,
        size: block.size,
        transactionCount: block.tx_count,
        fees: block.extras?.totalFees || 0,
        feesRangeText: `~${medianFee} sat/vB`,
        feeRange: feeRange,
        totalBtc: totalBtc, // Total BTC (block reward + fees)
        minutesAgo: minutesAgo
      };
    });
    
    console.log('Mapped blocks data:', mappedBlocks);
    
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
