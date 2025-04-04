
import { useState } from 'react';
import { MiningPool } from '@/utils/types';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface MiningPoolCardProps {
  pool: MiningPool;
  onSelect: (pool: MiningPool) => void;
  isSelected: boolean;
  bets: Array<{ id: number; amount: number }>;
}

const MiningPoolCard = ({ pool, onSelect, isSelected, bets }: MiningPoolCardProps) => {
  const isMobile = useIsMobile();
  const [isHovered, setIsHovered] = useState(false);
  
  // Check if multiplier is at max cap (50x)
  const isMaxMultiplier = pool.odds >= 50;

  return (
    <div
      className={cn(
        "relative rounded-xl overflow-hidden transition-all duration-300 border h-full",
        isSelected ? "border-btc-orange shadow-[0_0_20px_rgba(247,147,26,0.15)]" : "border-white/10 hover:border-white/20",
        "cursor-pointer mobile-equal-height"
      )}
      onClick={() => onSelect(pool)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 opacity-30 transition-opacity duration-300" style={{ 
        background: pool.gradient,
        opacity: isSelected || isHovered ? 0.5 : 0.3
      }}></div>
      <div className="absolute inset-0 backdrop-blur-sm bg-btc-dark/80"></div>
      
      <div className="relative z-10 p-4 flex flex-col h-full">
        <div className="flex flex-col items-center mb-1">
          <div className="rounded-lg overflow-hidden bg-transparent mb-1 h-16 w-16">
            <div className="w-full h-full flex items-center justify-center rounded-lg overflow-hidden">
              <img
                src={`/pool-logos/${pool.id}.svg`}
                alt={`${pool.name} logo`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  console.log(`Error loading logo for ${pool.name}`);
                  (e.target as HTMLImageElement).src = '/pool-logos/default.svg';
                }}
              />
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="text-lg font-medium text-white truncate max-w-full">{pool.name}</h3>
            <div className="mt-0.5 text-xs text-white/60">{pool.hashRate.toFixed(1)} EH/s</div>
          </div>
        </div>
        
        <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
          <div className="p-2">
            <div className="text-white/60 text-xs">Probability</div>
            <div className="font-medium text-white">{pool.hashRatePercent.toFixed(1)}%</div>
          </div>
          <div className="p-2">
            <div className="text-white/60 text-xs">Blocks (24h)</div>
            <div className="font-medium text-white">{pool.blocksLast24h}</div>
          </div>
        </div>
        
        <div className="mt-auto">
          <div className="flex justify-center items-center p-2">
            <div className="text-white/80 text-center">
              <div className="flex items-center justify-center">
                <span className={cn(
                  "text-lg font-bold bg-clip-text text-transparent",
                  isMaxMultiplier ? "bg-gradient-to-r from-yellow-400 via-yellow-200 to-btc-orange animate-pulse-subtle" : "bg-gradient-to-r from-btc-orange to-yellow-500"
                )}>
                  {pool.odds.toFixed(2)}
                  <span className="ml-0.5">×</span>
                </span>
                {isMaxMultiplier && (
                  <span className="ml-1 text-xs px-1.5 py-0.5 rounded bg-yellow-400/20 text-yellow-400">MAX</span>
                )}
              </div>
              <span className="ml-1 text-xs text-white/60">payout</span>
            </div>
          </div>
          
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-1000 ease-out",
                isMaxMultiplier ? "bg-gradient-to-r from-yellow-500 to-yellow-300" : ""
              )}
              style={{ 
                width: `${Math.min(100, pool.hashRatePercent * 2)}%`, 
                background: isMaxMultiplier ? undefined : pool.gradient
              }}
            ></div>
          </div>
        </div>

        {/* Stack of betting chips */}
        {bets.length > 0 && (
          <div className="absolute bottom-1 right-1 flex flex-col items-end">
            <div className="relative h-12 w-8">
              {bets.slice(-5).map((bet, index) => (
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
                    {formatChipValue(bet.amount)}
                  </div>
                </div>
              ))}
            </div>
            
            {bets.length > 5 && (
              <div className="text-xs text-white/80 font-medium mt-1 bg-black/50 px-1 rounded">
                +{bets.length - 5} more
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MiningPoolCard;

// Helper functions
const getChipColor = (value: number): string => {
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

const formatChipValue = (value: number): React.ReactNode => {
  if (value >= 10000) return `${value / 1000}k`;
  if (value >= 1000) return `${value / 1000}k`;
  return value;
};
