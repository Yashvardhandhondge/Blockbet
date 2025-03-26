/**
 * Service for interacting with the Mempool.space API
 */

// CORS proxy options - we'll try multiple services if one fails
const CORS_PROXIES = [
  'https://api.codetabs.com/v1/proxy?quest=',
  'https://corsproxy.io/?',
  'https://api.allorigins.win/raw?url=',
  'https://cors-anywhere.herokuapp.com/'
];

// Keep track of which proxy is working
let currentProxyIndex = 0;

// Base URL for the Mempool.space API
const BASE_URL = 'https://mempool.space/api';

// Alternative API URLs if the main one fails
const FALLBACK_APIS = [
  'https://mempool.blockstream.com/api',
  'https://mempool.emzy.de/api'
];

// Current API base URL index
let currentApiIndex = 0;

// Track failed requests to avoid endless retries
let consecutiveFailures = 0;
const MAX_CONSECUTIVE_FAILURES = 3;
const FAILURE_RESET_TIMEOUT = 30000; // 30 seconds

export interface MempoolBlock {
  id: string;
  height: number;
  version: number;
  timestamp: number;
  bits: number;
  nonce: number;
  difficulty: number;
  merkle_root: string;
  tx_count: number;
  size: number;
  weight: number;
  previousblockhash: string;
  mediantime: number;
  extras: {
    coinbaseRaw: string;
    medianFee: number;
    feeRange: number[];
    reward: number;
    totalFees: number;
    avgFee: number;
    avgFeeRate: number;
    pool: {
      id: string;
      name: string;
      slug: string;
    };
    avgTxSize: number;
    totalInputs: number;
    totalOutputs: number;
    totalOutputAmt: number;
    segwitTotalTxs: number;
    segwitTotalSize: number;
    segwitTotalWeight: number;
  };
}

export interface MempoolTransaction {
  txid: string;
  fee: number;
  vsize: number;
  value: number;
  status?: {
    confirmed: boolean;
    block_height?: number;
    block_hash?: string;
    block_time?: number;
  };
  firstSeen: number;
}

export interface MiningPoolStats {
  poolName: string;
  blocksCount: number;
  percentage: number;
}

// Reset the failure counter after some time
setInterval(() => {
  if (consecutiveFailures > 0) {
    console.log('Resetting API failure counter...');
    consecutiveFailures = 0;
  }
}, FAILURE_RESET_TIMEOUT);

/**
 * Tries to fetch data using different CORS proxies or direct connection
 * @param endpoint API endpoint to fetch
 * @returns Promise with response data
 */
const fetchWithProxies = async (endpoint: string): Promise<any> => {
  // If we've had too many consecutive failures, immediately use mock data
  if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
    console.log(`Too many consecutive failures (${consecutiveFailures}), skipping API requests`);
    throw new Error('Maximum consecutive failures reached');
  }
  
  // Start with the current proxy
  let startIndex = currentProxyIndex;
  let attempts = 0;
  const maxAttempts = CORS_PROXIES.length + FALLBACK_APIS.length + 1; // +1 for direct attempt
  
  // Try each proxy and then direct connection
  while (attempts < maxAttempts) {
    try {
      console.log(`Attempt ${attempts + 1}/${maxAttempts}: Trying to fetch data...`);
      
      let url;
      // First try all proxies with main API
      if (attempts < CORS_PROXIES.length) {
        const proxyIndex = (startIndex + attempts) % CORS_PROXIES.length;
        const proxy = CORS_PROXIES[proxyIndex];
        url = `${proxy}${encodeURIComponent(`${BASE_URL}${endpoint}`)}`;
        console.log(`Using proxy: ${proxy} with base: ${BASE_URL}`);
      } 
      // Then try fallback APIs with the current working proxy
      else if (attempts < CORS_PROXIES.length + FALLBACK_APIS.length) {
        const apiIndex = (attempts - CORS_PROXIES.length) % FALLBACK_APIS.length;
        const api = FALLBACK_APIS[apiIndex];
        url = `${CORS_PROXIES[currentProxyIndex]}${encodeURIComponent(`${api}${endpoint}`)}`;
        console.log(`Using fallback API: ${api} with proxy: ${CORS_PROXIES[currentProxyIndex]}`);
      } 
      // Last resort: try direct connection (might work in some environments)
      else {
        url = `${BASE_URL}${endpoint}`;
        console.log(`Direct connection attempt to: ${url}`);
      }
      
      // Generate a unique cache-busting parameter
      const cacheBuster = `_=${Date.now()}`;
      const separator = url.includes('?') ? '&' : '?';
      const finalUrl = `${url}${separator}${cacheBuster}`;
      
      // Make the request
      const response = await fetch(finalUrl, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        // Reduce timeout to try alternatives faster
        signal: AbortSignal.timeout(3000) // 3 second timeout
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
      }
      
      // If successful, update the current proxy index for future requests
      if (attempts < CORS_PROXIES.length) {
        currentProxyIndex = (startIndex + attempts) % CORS_PROXIES.length;
        console.log(`Found working proxy, setting current index to: ${currentProxyIndex}`);
      } else if (attempts < CORS_PROXIES.length + FALLBACK_APIS.length) {
        currentApiIndex = (attempts - CORS_PROXIES.length) % FALLBACK_APIS.length;
        console.log(`Found working API, setting current index to: ${currentApiIndex}`);
      }
      
      // Reset consecutive failures on success
      consecutiveFailures = 0;
      
      // Return the response data
      return await response.json();
    } catch (error) {
      console.warn(`Attempt ${attempts + 1} failed:`, error);
      attempts++;
      
      // If we've tried everything, increment failure counter and throw the last error
      if (attempts >= maxAttempts) {
        consecutiveFailures++;
        console.error(`All fetch attempts failed. Consecutive failures: ${consecutiveFailures}`);
        throw error;
      }
    }
  }
  
  throw new Error('All fetch attempts failed');
};

/**
 * Fetches recent blocks from the Mempool.space API
 * @returns Promise with an array of block data
 */
export const fetchRecentBlocks = async (): Promise<MempoolBlock[]> => {
  try {
    console.log('Fetching recent blocks...');
    return await fetchWithProxies('/v1/blocks');
  } catch (error) {
    console.error('Error fetching recent blocks:', error);
    throw error;
  }
};

/**
 * Fetches pending transactions from the mempool
 * @returns Promise with an array of transaction data
 */
export const fetchPendingTransactions = async (): Promise<MempoolTransaction[]> => {
  try {
    console.log('Fetching pending transactions...');
    return await fetchWithProxies('/v1/mempool/recent');
  } catch (error) {
    console.error('Error fetching pending transactions:', error);
    throw error;
  }
};

/**
 * Calculates the average block time based on recent blocks
 * @param blocks Array of recent blocks
 * @returns Average block time in minutes
 */
export const calculateAverageBlockTime = (blocks: MempoolBlock[]): number => {
  if (blocks.length < 2) {
    // Default to 10 minutes if not enough blocks
    return 10;
  }
  
  // Calculate time differences between consecutive blocks
  const timeDiffs: number[] = [];
  for (let i = 0; i < blocks.length - 1; i++) {
    const timeDiff = blocks[i].timestamp - blocks[i + 1].timestamp;
    timeDiffs.push(timeDiff);
  }
  
  // Calculate average in seconds and convert to minutes
  const avgTimeInSeconds = timeDiffs.reduce((sum, time) => sum + time, 0) / timeDiffs.length;
  return avgTimeInSeconds / 60;
};

/**
 * Estimates time until next block
 * @param blocks Array of recent blocks
 * @returns Estimated time string
 */
export const estimateNextBlockTime = (blocks: MempoolBlock[]): string => {
  if (blocks.length === 0) {
    return 'Unknown';
  }
  
  const avgBlockTimeMinutes = calculateAverageBlockTime(blocks);
  const lastBlockTime = blocks[0].timestamp;
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  const elapsedTimeMinutes = (currentTime - lastBlockTime) / 60;
  
  // If elapsed time is already greater than average block time
  if (elapsedTimeMinutes >= avgBlockTimeMinutes) {
    return 'Any moment';
  }
  
  const remainingMinutes = avgBlockTimeMinutes - elapsedTimeMinutes;
  
  if (remainingMinutes < 1) {
    return 'Under a minute';
  } else if (remainingMinutes < 2) {
    return 'About a minute';
  } else {
    return `~${Math.round(remainingMinutes)} min`;
  }
};

/**
 * Calculates mining pool statistics for the last 24 hours
 * @param blocks Array of recent blocks
 * @returns Array of mining pool stats
 */
export const calculateMiningPoolStats = (blocks: MempoolBlock[]): MiningPoolStats[] => {
  // Filter blocks mined in the last 24 hours
  const oneDayAgo = Math.floor(Date.now() / 1000) - 86400; // 24 hours in seconds
  const last24HoursBlocks = blocks.filter(block => block.timestamp >= oneDayAgo);
  
  // Count blocks by mining pool
  const poolCounts = new Map<string, number>();
  last24HoursBlocks.forEach(block => {
    if (block.extras?.pool?.name) {
      const poolName = block.extras.pool.name;
      poolCounts.set(poolName, (poolCounts.get(poolName) || 0) + 1);
    }
  });
  
  // Calculate percentages and create stats objects
  const totalBlocks = last24HoursBlocks.length;
  const stats: MiningPoolStats[] = Array.from(poolCounts.entries()).map(([poolName, blocksCount]) => ({
    poolName,
    blocksCount,
    percentage: (blocksCount / totalBlocks) * 100
  }));
  
  // Sort by block count descending
  return stats.sort((a, b) => b.blocksCount - a.blocksCount);
};
