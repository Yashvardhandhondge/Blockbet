
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

// Mock data to use as fallback if all API requests fail
const generateMockBlockData = (): LatestBlockData => {
  // Get current time for realistic timestamps
  const now = Date.now();
  
  // Create some reasonable mock data
  const mockLatestBlock: Block = {
    height: 833410,
    hash: `mock${now}`,
    minedBy: 'Foundry USA',
    timestamp: now,
    size: 1345678,
    transactionCount: 2415,
    fees: 0.1256,
    feesRangeText: '~2 sat/vB',
    feeRange: '1 - 100 sat/vB',
    totalBtc: 6.25
  };
  
  const mockPreviousBlocks: Block[] = Array(10).fill(0).map((_, i) => ({
    height: mockLatestBlock.height - (i + 1),
    hash: `mock${i}${now}`,
    minedBy: ['Foundry USA', 'AntPool', 'F2Pool', 'Binance Pool'][i % 4],
    timestamp: mockLatestBlock.timestamp - ((i + 1) * 600000), // ~10 min per block
    size: 800000 + Math.floor(Math.random() * 600000),
    transactionCount: 1000 + Math.floor(Math.random() * 1500),
    fees: 0.05 + (Math.random() * 0.2),
    feesRangeText: '~2 sat/vB',
    feeRange: '1 - 90 sat/vB',
    totalBtc: 6.25
  }));
  
  return {
    latestBlock: mockLatestBlock,
    previousBlocks: mockPreviousBlocks,
    avgBlockTime: 10.0,
    estimatedNextBlock: 'Any moment'
  };
};

// Cache for mock data to ensure consistency between calls
let cachedMockData: LatestBlockData | null = null;
let lastMockUpdate = 0;
const MOCK_UPDATE_INTERVAL = 600000; // 10 minutes

/**
 * Gets cached mock data or generates new mock data if needed
 * Ensures consistent mock data between calls
 */
const getMockBlockData = (): LatestBlockData => {
  const now = Date.now();
  
  // If no cached data or it's time to update
  if (!cachedMockData || now - lastMockUpdate > MOCK_UPDATE_INTERVAL) {
    console.log('Generating fresh mock data');
    cachedMockData = generateMockBlockData();
    lastMockUpdate = now;
  }
  
  return cachedMockData;
};

/**
 * Fetches latest block data from Mempool.space API
 * @returns Promise with latest block data
 */
export const fetchLatestBlockData = async (): Promise<LatestBlockData> => {
  try {
    console.log('Attempting to fetch latest block data from API...');
    
    // Fetch recent blocks from the API
    const mempoolBlocks = await fetchRecentBlocks();
    
    if (!mempoolBlocks || mempoolBlocks.length === 0) {
      console.warn('No blocks returned from API, falling back to mock data');
      return getMockBlockData();
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
        fees: totalFees / 100000000, // Convert sats to BTC 
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
    
    // Return mock data as a last resort so the UI isn't completely empty
    console.warn('Falling back to mock data due to API failure');
    return getMockBlockData();
  }
};
