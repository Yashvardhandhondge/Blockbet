
import React, { useState } from 'react';
import { miningPools } from '@/utils/mockData';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface BettingGridProps {
  className?: string;
}

export function BettingGrid({ className }: BettingGridProps) {
  const navigate = useNavigate();
  const [selectedPool, setSelectedPool] = useState<string | null>(null);

  // This function returns the path to the SVG logo from our pool-logos directory
  const getPoolLogo = (poolId: string): string => {
    const pool = miningPools.find(p => p.id === poolId);
    if (pool && pool.logoUrl) {
      return pool.logoUrl;
    }
    return '/pool-logos/default.svg'; // Default fallback logo
  };

  const handlePoolSelect = (poolId: string) => {
    setSelectedPool(poolId === selectedPool ? null : poolId);
  };

  const handlePlaceBet = () => {
    if (selectedPool) {
      navigate(`/place-bet?pool=${selectedPool}`);
    }
  };

  return (
    <div className={cn("bg-black/20 backdrop-blur-sm rounded-xl p-4", className)}>
      <h2 className="text-xl font-bold mb-4">Choose a Mining Pool</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
        {miningPools.map((pool) => (
          <div
            key={pool.id}
            className={cn(
              "relative flex flex-col items-center justify-center p-3 rounded-xl cursor-pointer transition-all duration-200 border-2",
              selectedPool === pool.id 
                ? "border-orange-500 bg-orange-500/10" 
                : "border-gray-700 hover:border-gray-500 bg-black/40"
            )}
            onClick={() => handlePoolSelect(pool.id)}
          >
            <div className="w-12 h-12 mb-2 relative">
              <img
                src={getPoolLogo(pool.id)}
                alt={pool.name}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-sm font-medium text-center block">{pool.name}</span>
            <span className="text-xs text-gray-400 block text-center">{pool.hashRatePercent}%</span>
            <span className="text-xs text-gray-400 block text-center">1:{pool.odds.toFixed(2)}</span>
          </div>
        ))}
      </div>
      
      <button
        className={cn(
          "w-full py-3 rounded-xl text-center font-bold transition-all duration-200",
          selectedPool 
            ? "bg-orange-500 hover:bg-orange-600 text-black" 
            : "bg-gray-800 text-gray-500 cursor-not-allowed"
        )}
        disabled={!selectedPool}
        onClick={handlePlaceBet}
      >
        {selectedPool ? "Place Bet" : "Select a Pool"}
      </button>
    </div>
  );
}
