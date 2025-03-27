
import React from 'react';
import { MiningPool } from '@/utils/mockData';
import { cn } from '@/lib/utils';

interface MiningPoolCardProps {
  pool: MiningPool;
  isSelected?: boolean;
  onSelect: (pool: MiningPool) => void;
  bets: Array<{
    id: number;
    amount: number;
  }>;
  disabled?: boolean;
}

const MiningPoolCard = ({ pool, isSelected = false, onSelect, bets, disabled = false }: MiningPoolCardProps) => {
  const totalBet = bets.reduce((sum, bet) => sum + bet.amount, 0);
  const hasBets = bets.length > 0;
  
  const handleClick = () => {
    if (!disabled) {
      onSelect(pool);
    }
  };
  
  const renderStackedChips = (bets: Array<{
    id: number;
    amount: number;
  }>) => {
    if (bets.length === 0) return null;
    const displayBets = bets.slice(-5);
    const remainingCount = bets.length > 5 ? bets.length - 5 : 0;
    return <div className="absolute bottom-1 right-1 flex flex-col items-end">
        <div className="relative h-12 w-8">
          {displayBets.map((bet, index) => <div key={bet.id} className={cn("absolute w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-xl", getChipColor(bet.amount))} style={{
          bottom: `${index * 4}px`,
          right: `${index % 2 === 0 ? 0 : 2}px`,
          zIndex: index,
          transform: `rotate(${index * 5 - 10}deg)`
        }}>
              <div className="absolute inset-1.5 rounded-full border-2 border-white/30"></div>
              <div className="flex items-center">
                {bet.amount >= 10000 ? `${bet.amount / 1000}k` : bet.amount}
              </div>
            </div>)}
        </div>
        
        {remainingCount > 0 && <div className="text-xs text-white/80 font-medium mt-1 bg-black/50 px-1 rounded">
            +{remainingCount} more
          </div>}
      </div>;
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
  
  const getPoolLogo = () => {
    try {
      // Try to get pool logo from the right path
      const logoPath = `/pool-logos/${pool.id}.svg`;
      return <img 
        src={logoPath} 
        alt={`${pool.name} logo`} 
        className="w-full h-full object-contain" 
        onError={(e) => {
          console.log(`Error loading logo for ${pool.id}, trying fallback`);
          // Try alternative formats
          (e.currentTarget as HTMLImageElement).src = `/pool-logos/${pool.id}.png`;
        }}
      />;
    } catch (error) {
      return getPlaceholderImage();
    }
  };
  
  const getPlaceholderImage = () => {
    const firstLetter = pool.name.charAt(0) || '?';
    return <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white text-lg font-bold">
        {firstLetter}
      </div>;
  };

  return (
    <div 
      className={cn(
        "relative aspect-square border rounded-lg overflow-hidden cursor-pointer transition-all transform",
        isSelected ? "scale-105 border-btc-orange" : "border-transparent hover:border-white/20",
        disabled ? "opacity-80 cursor-not-allowed" : "hover:scale-[1.02]",
        hasBets ? "border-btc-orange/50" : ""
      )}
      style={{
        background: pool.gradient || "linear-gradient(135deg, #2a2a2a, #1a1a1a)"
      }}
      onClick={handleClick}
    >
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Pool information */}
      <div className="relative p-2 h-full flex flex-col">
        <div className="flex justify-between items-start">
          <div className="h-8 w-8 bg-white rounded-full overflow-hidden flex items-center justify-center">
            {getPoolLogo()}
          </div>
          <div className="text-xs font-medium bg-black/50 px-1.5 py-0.5 rounded text-white/90">
            {pool.hashRatePercent.toFixed(1)}%
          </div>
        </div>
        
        <div className="mt-auto">
          <div className="text-xs font-bold text-white truncate">{pool.name}</div>
          <div className="text-[10px] text-white/60 flex items-center justify-between">
            <span>{pool.odds}x</span>
            {totalBet > 0 && <span className="font-mono text-btc-orange">{totalBet.toLocaleString()}</span>}
          </div>
        </div>
      </div>
      
      {/* Render stacked chips if there are bets */}
      {renderStackedChips(bets)}
      
      {/* Disabled overlay */}
      {disabled && <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
        <div className="bg-black/70 text-white text-xs px-2 py-1 rounded">Closed</div>
      </div>}
    </div>
  );
};

export default MiningPoolCard;
