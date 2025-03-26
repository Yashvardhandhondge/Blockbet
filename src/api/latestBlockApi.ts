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
    
    console.log('API responded with blocks:', mempoolBlocks.length);
    console.log('First block sample:', JSON.stringify(mempoolBlocks[0], null, 2));
    
    // Calculate average block time
    const avgBlockTime = calculateAverageBlockTime(mempoolBlocks);
    
    // Estimate next block time
    const estimatedNextBlock = estimateNextBlockTime(mempoolBlocks);
    
    // Map the Mempool API responses to our Block interface
    const mappedBlocks: Block[] = mempoolBlocks.map(block => {
      // Safely access nested properties with optional chaining and fallbacks
      const medianFee = block.extras?.medianFee ?? 0;
      const feeRange = block.extras?.feeRange ?? [];
      const totalFees = block.extras?.totalFees ?? 0;
      const reward = block.extras?.reward ?? 0;
      const poolName = block.extras?.pool?.name ?? 'Unknown';
      
      return {
        height: block.height,
        hash: block.id,
        minedBy: poolName,
        timestamp: block.timestamp * 1000, // Convert from seconds to milliseconds
        size: block.size,
        transactionCount: block.tx_count,
        fees: totalFees,
        feesRangeText: `~${formatToOneDecimal(medianFee)} sat/vB`,
        feeRange: formatFeeRange(feeRange),
        totalBtc: (reward + totalFees) / 100000000 // Convert sats to BTC
      };
    });
    
    // Log to make sure we have transformed data correctly
    console.log('Mapped first block:', JSON.stringify(mappedBlocks[0], null, 2));
    
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
