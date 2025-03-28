
import React from 'react';
import { cn } from '@/lib/utils';
import { MiningPool } from '@/utils/types';
import { formatSats } from '@/utils/formatters';

export interface MiningPoolCardProps {
  pool: MiningPool;
  bets: Array<{
    id: number;
    amount: number;
  }>;
  onSelect: (pool: MiningPool) => void;
  selectedChip: number | null;
}

const MiningPoolCard: React.FC<MiningPoolCardProps> = ({ pool, bets, onSelect, selectedChip }) => {
  const totalBetAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);
  
  const renderStackedChips = (bets: Array<{
    id: number;
    amount: number;
  }>) => {
    if (bets.length === 0) return null;
    const displayBets = bets.slice(-5);
    const remainingCount = bets.length > 5 ? bets.length - 5 : 0;
    
    return (
      <div className="absolute bottom-1 right-1 flex flex-col items-end">
        <div className="relative h-12 w-8">
          {displayBets.map((bet, index) => (
            <div 
              key={bet.id} 
              className={cn(
                "absolute w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-xl", 
                getChipColor(bet.amount)
              )} 
              style={{
                bottom: `${index * 4}px`,
                right: `${index % 2 === 0 ? 0 : 2}px`,
                zIndex: index,
                transform: `rotate(${index * 5 - 10}deg)`
              }}
            >
              <div className="absolute inset-1.5 rounded-full border-2 border-white/30"></div>
              <div className="flex items-center">
                {bet.amount >= 10000 ? `${bet.amount / 1000}k` : bet.amount}
              </div>
            </div>
          ))}
        </div>
        
        {remainingCount > 0 && (
          <div className="text-xs text-white/80 font-medium mt-1 bg-black/50 px-1 rounded">
            +{remainingCount} more
          </div>
        )}
      </div>
    );
  };
  
  const getChipColor = (value: number) => {
    switch (value) {
      case 100:
        return "bg-blue-600";
      case 500:
        return "bg-green-600";
      case 1000:
        return "bg-purple-600";
      case 5000:
        return "bg-pink-600";
      case 10000:
        return "bg-orange-600";
      case 50000:
        return "bg-red-600";
      case 100000:
        return "bg-yellow-600";
      default:
        return "bg-gray-600";
    }
  };
  
  return (
    <div 
      className={cn(
        "relative flex flex-col overflow-hidden rounded-xl border transition-colors hover:border-btc-orange/50", 
        totalBetAmount > 0 ? "border-white/20 bg-black/30" : "border-white/10 bg-black/20"
      )}
      style={{ background: pool.gradient }}
      onClick={() => onSelect(pool)}
    >
      <div className="flex items-center p-3 cursor-pointer">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 mr-3 flex-shrink-0">
          <img 
            src={`/pool-logos/${pool.id}.svg`} 
            alt={pool.name} 
            className="w-full h-full object-contain p-0.5"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/pool-logos/default.svg';
            }} 
          />
        </div>
        <div className="flex-grow">
          <div className="text-sm font-medium text-white">{pool.name}</div>
          <div className="flex items-center space-x-2">
            <div className="text-xs text-white/60">{pool.hashRatePercent.toFixed(1)}% Hash Rate</div>
            <div className="text-xs bg-white/10 px-1 rounded text-white/70">{pool.odds.toFixed(1)}x</div>
          </div>
        </div>
        {totalBetAmount > 0 && (
          <div className="text-right text-xs text-white">
            <div className="font-medium">{formatSats(totalBetAmount)}</div>
          </div>
        )}
      </div>
      
      {renderStackedChips(bets)}
    </div>
  );
};

export default MiningPoolCard;
