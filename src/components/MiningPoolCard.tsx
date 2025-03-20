
import { useState } from 'react';
import { MiningPool } from '@/utils/mockData';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCountUp } from '@/lib/animations';

interface MiningPoolCardProps {
  pool: MiningPool;
  onSelect: (pool: MiningPool) => void;
  isSelected: boolean;
}

const MiningPoolCard = ({ pool, onSelect, isSelected }: MiningPoolCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Animate hashrate percentage
  const displayedHashrate = useCountUp(pool.hashRatePercent, 1500, 300);
  
  // Get a darker gradient based on the pool's color
  const getPoolDarkGradient = () => {
    switch(pool.id) {
      case 'antpool':
        return 'bg-gradient-to-br from-[#661919] to-[#2a0808]';
      case 'binance':
        return 'bg-gradient-to-br from-[#553c00] to-[#2a1c00]';
      case 'f2pool':
        return 'bg-gradient-to-br from-[#143a4d] to-[#081c24]';
      case 'foundry':
        return 'bg-gradient-to-br from-[#662e00] to-[#2a1200]';
      case 'slushpool':
        return 'bg-gradient-to-br from-[#0d3b56] to-[#091e2a]';
      case 'poolin':
        return 'bg-gradient-to-br from-[#0d3b30] to-[#061c17]';
      case 'viabtc':
        return 'bg-gradient-to-br from-[#28401a] to-[#101a0a]';
      default:
        return 'bg-gradient-to-br from-[#3a3a3a] to-[#1a1a1a]';
    }
  };
  
  return (
    <div 
      className={cn(
        "relative rounded-xl overflow-hidden transition-all duration-300 border",
        isSelected 
          ? "border-btc-orange shadow-[0_0_20px_rgba(247,147,26,0.15)]" 
          : "border-white/10 hover:border-white/20",
        isHovered ? "transform-gpu scale-[1.02]" : "transform-gpu scale-100"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[32px] border-r-[32px] border-t-transparent border-r-btc-orange z-10"></div>
      )}
      
      {/* Background gradient based on pool color */}
      <div className={cn(
        "absolute inset-0 opacity-30 transition-opacity duration-300",
        getPoolDarkGradient(),
        isSelected ? "opacity-40" : "opacity-20"
      )}></div>
      
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 backdrop-blur-sm bg-btc-dark/80"></div>
      
      {/* Content */}
      <div className="relative z-10 p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-white">{pool.name}</h3>
            <div className="mt-1 text-xs text-white/60">{pool.region}</div>
          </div>
          <div className={cn(
            "h-10 w-10 rounded-lg flex items-center justify-center",
            getPoolDarkGradient()
          )}>
            <span className="text-xs font-medium text-white">
              {Math.round(displayedHashrate)}%
            </span>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between text-sm">
          <div>
            <div className="text-white/60">Hashrate</div>
            <div className="font-medium text-white">{pool.hashRate.toFixed(1)} EH/s</div>
          </div>
          <div>
            <div className="text-white/60">Blocks (24h)</div>
            <div className="font-medium text-white">{pool.blocksLast24h}</div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div className="text-white/80">
            <span className="text-lg font-bold">{pool.odds.toFixed(2)}x</span>
            <span className="text-xs ml-1">payout</span>
          </div>
          
          <Button 
            onClick={() => onSelect(pool)}
            variant={isSelected ? "default" : "outline"}
            className={cn(
              "transition-all duration-300",
              isSelected 
                ? "bg-btc-orange hover:bg-btc-orange/90 text-btc-dark"
                : "border-btc-orange/40 hover:border-btc-orange text-btc-orange hover:bg-btc-orange/10"
            )}
            size="sm"
          >
            {isSelected ? 'Selected' : 'Select'}
          </Button>
        </div>
        
        {/* Progress bar showing hashrate percentage */}
        <div className="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full transition-all duration-1000 ease-out",
              getPoolDarkGradient()
            )}
            style={{ width: `${displayedHashrate}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default MiningPoolCard;
