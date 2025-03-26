import { fetchRecentBlocks, calculateAverageBlockTime, estimateNextBlockTime } from '../services/mempoolService';
import { Block } from '@/utils/mockData';

export interface LatestBlockData {
  latestBlock: Block;
  previousBlocks: Block[];
  avgBlockTime: number;
  estimatedNextBlock: string;
}

/**
 * Formats a number to at most 1 decimal place, removing trailing zeros
 * @param value The number to format
 * @returns Formatted number string
 */
const formatToOneDecimal = (value: number): string => {
  // Round to 1 decimal place
  const rounded = Math.round(value * 10) / 10;
  // If it's a whole number, return without decimal
  if (rounded === Math.floor(rounded)) {
    return rounded.toString();
  }
  // Otherwise return with 1 decimal place
  return rounded.toFixed(1);
};

/**
 * Formats a fee range string with abbreviated numbers
 * @param feeRange Array of fee values
 * @returns Formatted fee range string
 */
const formatFeeRange = (feeRange: number[]): string => {
  if (!feeRange || feeRange.length === 0) {
    return '0 - 0 sat/vB';
  }
  
  const minFee = formatToOneDecimal(feeRange[0]);
  const maxFee = formatToOneDecimal(feeRange[feeRange.length - 1]);
  
  return `${minFee} - ${maxFee} sat/vB`;
};

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
      feesRangeText: `~${formatToOneDecimal(block.extras?.medianFee || 0)} sat/vB`,
      feeRange: block.extras?.feeRange 
        ? formatFeeRange(block.extras.feeRange)
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
