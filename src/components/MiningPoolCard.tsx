import React from 'react';
import { cn } from '@/lib/utils';
import { MiningPool } from '@/utils/types';
import { useMiningPoolStats } from '@/hooks/use-mining-pool-stats';
import { Skeleton } from './ui/skeleton';

// Utility functions - moved outside of component to avoid redeclaration
const getDarkerTechGradient = (gradient: string): string => {
  const gradientMap: Record<string, string> = {
    'from-blue-500 via-blue-600 to-blue-700': 'from-blue-600 via-blue-700 to-blue-800',
    'from-red-500 via-red-600 to-red-700': 'from-red-600 via-red-700 to-red-800',
    'from-green-500 via-green-600 to-green-700': 'from-green-600 via-green-700 to-green-800',
    'from-yellow-500 via-yellow-600 to-yellow-700': 'from-yellow-600 via-yellow-700 to-yellow-800',
    'from-purple-500 via-purple-600 to-purple-700': 'from-purple-600 via-purple-700 to-purple-800',
    'from-pink-500 via-pink-600 to-pink-700': 'from-pink-600 via-pink-700 to-pink-800',
    'from-indigo-500 via-indigo-600 to-indigo-700': 'from-indigo-600 via-indigo-700 to-indigo-800',
    'from-orange-500 via-orange-600 to-orange-700': 'from-orange-600 via-orange-700 to-orange-800',
    'from-teal-500 via-teal-600 to-teal-700': 'from-teal-600 via-teal-700 to-teal-800',
    'from-cyan-500 via-cyan-600 to-cyan-700': 'from-cyan-600 via-cyan-700 to-cyan-800',
  };
  
  return gradientMap[gradient] || gradient;
};

const getPoolColor = (poolName: string): string => {
  const poolColorMap: Record<string, string> = {
    'Foundry USA': 'text-blue-500',
    'Antpool': 'text-red-500',
    'F2Pool': 'text-green-500',
    'Binance Pool': 'text-yellow-500',
    'ViaBTC': 'text-purple-500',
    'SlushPool': 'text-cyan-500',
    'Poolin': 'text-indigo-500',
    'BTC.com': 'text-orange-500',
    'AntPool': 'text-pink-500',
    'MARA Pool': 'text-amber-500',
    'SBI Crypto': 'text-violet-500',
    'Luxor': 'text-emerald-500',
    'Unknown': 'text-gray-500',
    'SECPOOL': 'text-lime-500'
  };
  
  return poolColorMap[poolName] || 'text-gray-400';
};

const getChipColor = (type: string): string => {
  const chipColorMap: Record<string, string> = {
    'hashRate': 'bg-blue-500/15 text-blue-500',
    'blocks': 'bg-green-500/15 text-green-500',
    'odds': 'bg-amber-500/15 text-amber-500'
  };
  
  return chipColorMap[type] || 'bg-gray-500/15 text-gray-500';
};

const getChipSecondaryColor = (type: string): string => {
  const secondaryColorMap: Record<string, string> = {
    'hashRate': 'text-blue-400',
    'blocks': 'text-green-400',
    'odds': 'text-amber-400'
  };
  
  return secondaryColorMap[type] || 'text-gray-400';
};

const formatChipValue = (value: number, type: string): string => {
  if (type === 'hashRate') {
    return `${value.toFixed(1)}%`;
  } else if (type === 'blocks') {
    return `${value}`;
  } else if (type === 'odds') {
    return `${value.toFixed(2)}x`;
  }
  return `${value}`;
};

interface MiningPoolCardProps {
  pool: MiningPool;
  isSelected?: boolean;
  onSelect?: () => void;
  className?: string;
}

const MiningPoolCard: React.FC<MiningPoolCardProps> = ({
  pool,
  isSelected = false,
  onSelect,
  className
}) => {
  const { liveStats, isLoading } = useMiningPoolStats();
  
  // Find the live stats for this pool
  const liveStat = liveStats.find(stat => stat.poolId === pool.id);
  
  const hashRatePercent = liveStat ? liveStat.hashRatePercent : pool.hashRatePercent;
  const blocksLast24h = liveStat ? liveStat.blocksLast24h : pool.blocksLast24h;
  const odds = liveStat ? liveStat.odds : pool.odds;
  
  return (
    <button
      onClick={onSelect}
      className={cn(
        "relative rounded-xl overflow-hidden transition-transform duration-200 transform hover:scale-105 active:scale-100",
        "bg-gradient-to-br " + getDarkerTechGradient(pool.gradient),
        isSelected ? "ring-2 ring-btc-orange" : "ring-0",
        className
      )}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-md z-10"></div>
      <div className="relative p-4 z-20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            {isLoading ? (
              <Skeleton className="h-5 w-12 rounded-full" />
            ) : (
              <div className={cn("font-semibold text-sm", getPoolColor(pool.name))}>
                {pool.name}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-xs text-white/70">Odds</div>
            {isLoading ? (
              <Skeleton className="h-5 w-8 rounded-full" />
            ) : (
              <div className={cn("font-semibold text-sm", getPoolColor(pool.name))}>
                {odds ? formatChipValue(odds, 'odds') : 'N/A'}
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <div className="text-xs text-white/70 mb-1">Hashrate</div>
            {isLoading ? (
              <Skeleton className="h-7 w-full rounded-md" />
            ) : (
              <div className="text-2xl font-bold text-white tracking-tight">
                {hashRatePercent ? formatChipValue(hashRatePercent, 'hashRate') : 'N/A'}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <div className="text-xs text-white/70 mb-1">Blocks (24h)</div>
            {isLoading ? (
              <Skeleton className="h-7 w-full rounded-md" />
            ) : (
              <div className="text-2xl font-bold text-white tracking-tight">
                {blocksLast24h ? formatChipValue(blocksLast24h, 'blocks') : 'N/A'}
              </div>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};

export default MiningPoolCard;
