
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
