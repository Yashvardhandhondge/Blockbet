import { fetchPendingTransactions } from '../services/mempoolService';

export interface PendingTransactionsData {
  count: number;
  transactions: {
    txid: string;
    fee: number;
    size: number;
    timestamp: number;
    feeRate: number;
  }[];
}

/**
 * Fetches pending transactions from Mempool.space API
 * @returns Promise with pending transactions data
 */
export const fetchPendingTransactionsData = async (): Promise<PendingTransactionsData> => {
  try {
    const pendingTxs = await fetchPendingTransactions();
    
    if (!pendingTxs || pendingTxs.length === 0) {
      throw new Error('No pending transactions returned from API');
    }
    
    const mappedTransactions = pendingTxs.map(tx => ({
      txid: tx.txid,
      fee: tx.fee,
      size: tx.vsize,
      timestamp: tx.firstSeen * 1000, // Convert to milliseconds
      feeRate: tx.fee / tx.vsize // Calculate fee rate in sats/vB
    }));
    
    return {
      count: mappedTransactions.length,
      transactions: mappedTransactions
    };
  } catch (error) {
    console.error('Error fetching pending transactions data:', error);
    throw error;
  }
};

// Add a function to periodically fetch pending tx data
let pendingTxCache: PendingTransactionsData | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5000; // 5 seconds cache

/**
 * Fetches pending transactions with caching
 * @returns Promise with pending transactions data
 */
export const fetchPendingTransactionsWithCache = async (): Promise<PendingTransactionsData> => {
  const now = Date.now();
  
  // Return cached data if it's fresh
  if (pendingTxCache && now - lastFetchTime < CACHE_DURATION) {
    return pendingTxCache;
  }
  
  // Otherwise fetch fresh data
  try {
    const data = await fetchPendingTransactionsData();
    pendingTxCache = data;
    lastFetchTime = now;
    return data;
  } catch (error) {
    // If fetch fails but we have cached data, return that
    if (pendingTxCache) {
      console.warn('Using cached pending tx data due to fetch error');
      return pendingTxCache;
    }
    throw error;
  }
};
