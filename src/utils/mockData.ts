
import { MiningPool } from './types';
import { miningPools, getRandomMiningPool } from './miningPools';

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

// Format time ago function for showing relative time
export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
};

// Re-export MiningPool type and mining pools for backward compatibility
export type { MiningPool } from './types';
export { miningPools, getRandomMiningPool } from './miningPools';
