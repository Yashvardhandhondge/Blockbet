export interface MiningPool {
  id: string;
  name: string;
  hashRate: number;
  hashRatePercent: number;
  blocksLast24h: number;
  odds: number; // This is now the multiplier
  gradient: string;
}

export interface Block {
  height: number;
  hash: string;
  minedBy: string;
  timestamp: number | Date;
  size: number;
  transactionCount: number;
  fees: number;
  feesRangeText: string;
  feeRange: string;
  totalBtc: number;
  isEmptyBlock?: boolean; // Added flag for empty blocks
}

export interface MockUserBalance {
  availableBalance: number;
  totalBet: number;
  pendingWithdrawal: number;
}

export const formatBTC = (amount: number): string => {
  return `${amount.toFixed(8)} BTC`;
};

export const mockUserBalance: MockUserBalance = {
  availableBalance: 0.05234,
  totalBet: 0.00321,
  pendingWithdrawal: 0.001
};
