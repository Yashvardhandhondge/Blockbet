
import { MiningPool } from './types';
import { miningPools } from './miningPools';

// Next block estimate
export const nextBlockEstimate = {
  estimatedTimeMinutes: 10,
  difficulty: 67352594066965
};

// Mock user balance information
export const mockUserBalance = {
  totalBalance: 0.25, // BTC
  availableBalance: 0.25, // BTC
  pendingBalance: 0, // BTC
  lastUpdated: new Date()
};

export const formatBTC = (btc: number): string => {
  return btc.toFixed(8);
};

export const formatSatsToBTC = (sats: number): string => {
  return (sats / 100000000).toFixed(8);
};

// Re-export mining pools for backward compatibility
export { miningPools, getRandomMiningPool } from './miningPools';
