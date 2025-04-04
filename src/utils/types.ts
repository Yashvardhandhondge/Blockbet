
export interface MiningPool {
  id: string;
  name: string;
  hashRate: number;
  hashRatePercent: number;
  blocksLast24h: number;
  colorClass: string;
  odds: number;
  region: string;
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

export interface MiningPoolLiveStats {
  poolName: string;
  poolId: string;
  hashRatePercent: number;
  blocksLast24h: number;
  odds: number;
}
