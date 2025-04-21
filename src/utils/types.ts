// src/utils/types.ts

export interface MiningPool {
  id: string;
  name: string;
  hashRate: number;
  hashRatePercent: number;
  blocksLast24h: number;
  colorClass: string;
  odds: number;
  region: string; // Changed from union type to string to match mockData.ts
  logoUrl: string;
  gradient: string;
}

export interface Block {
  height: number;
  hash: string;
  minedBy: string;
  timestamp: number;
  size?: number;
  transactionCount?: number;
  fees?: number;
  feesRangeText?: string;
  feeRange?: string;
  totalBtc?: number;
}

export interface UserBalance {
  availableBalance: number;
  inPlay: number;
}

// New type for bet history entries in the database
export interface BetHistoryEntry {
  id: string;
  user_id: string;
  pool_id: string;
  pool_name: string;
  amount: number;
  is_win: boolean;
  block_height: number;
  win_amount?: number | null;
  created_at: string;
}

// Client-side representation of bet history
export interface BetHistoryRecord {
  id: number;
  poolId: string;
  poolName: string;
  amount: number;
  timestamp: Date;
  isWin: boolean;
  blockHeight: number;
  winAmount?: number;
}