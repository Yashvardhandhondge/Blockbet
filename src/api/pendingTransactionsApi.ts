
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
