
import React from 'react';
import { cn } from '@/lib/utils';
import { formatSats } from '@/utils/formatters';
import { MiningPool } from '@/utils/mockData';

interface MiningPoolCardProps {
  pool: MiningPool;
  onSelect: (pool: MiningPool) => void;
  isSelected: boolean;
  bets: Array<{
    id: number;
    amount: number;
  }>;
  disabled?: boolean;
}

const MiningPoolCard = ({ pool, onSelect, isSelected, bets, disabled = false }: MiningPoolCardProps) => {
  const totalBetAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);
  
  const getPoolLogo = () => {
    try {
      return (
        <div className="w-full h-full flex items-center justify-center bg-white rounded-full overflow-hidden p-0.5">
          <img
            src={`/pool-logos/${pool.id}.svg`}
            alt={pool.name}
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/pool-logos/unknown.svg';
            }}
          />
        </div>
      );
    } catch (error) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-white rounded-full overflow-hidden">
          <span className="text-xs font-medium text-gray-700">{pool.name.charAt(0)}</span>
        </div>
      );
    }
  };
  
  const handleClick = () => {
    if (!disabled) {
      onSelect(pool);
    }
  };
  
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center p-2 rounded-lg cursor-pointer transition-all",
        isSelected ? "bg-white/10 border border-btc-orange/40" : "bg-[#0f0f0f] hover:bg-white/5 border border-white/5",
        disabled && "opacity-70 cursor-not-allowed hover:bg-[#0f0f0f]"
      )}
      style={{
        background: isSelected ? pool.gradient : ''
      }}
      onClick={handleClick}
    >
      <div className="w-10 h-10 mb-2">
        {getPoolLogo()}
      </div>
      <div className="text-center">
        <div className="text-xs font-medium text-white whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px] mx-auto">
          {pool.name}
        </div>
        <div className="text-[10px] text-white/60 whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px] mx-auto">
          {pool.hashRatePercent.toFixed(1)}% • {pool.odds.toFixed(1)}x
        </div>
      </div>
      
      {totalBetAmount > 0 && (
        <div className="absolute -bottom-1 -right-1 bg-btc-orange text-black text-[8px] px-1.5 py-0.5 rounded-full font-bold">
          {formatSats(totalBetAmount)}
        </div>
      )}
    </div>
  );
};

export default MiningPoolCard;
