import { useState } from 'react';
import { MiningPool } from '@/utils/mockData';
import { cn } from '@/lib/utils';
import { useCountUp } from '@/lib/animations';
import { GlowEffect } from './ui/glow-effect';

interface MiningPoolCardProps {
  pool: MiningPool;
  onSelect: (pool: MiningPool) => void;
  isSelected: boolean;
  bets?: Array<{id: number; amount: number}>;
}

const MiningPoolCard = ({ pool, onSelect, isSelected, bets = [] }: MiningPoolCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Animate hashrate percentage
  const displayedHashrate = useCountUp(pool.hashRatePercent, 1500, 300);
  
  // Get color for the pool
  const poolColor = getPoolColor(pool.id);
  
  return (
    <div 
      className={cn(
        "relative rounded-xl overflow-hidden transition-all duration-300 border cursor-pointer",
        isSelected 
          ? "border-btc-orange shadow-[0_0_20px_rgba(247,147,26,0.15)]" 
          : "border-white/10 hover:border-white/20",
        isHovered ? "transform-gpu scale-[1.02]" : "transform-gpu scale-100"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(pool)}
    >
      {/* Glow effect */}
      {isSelected && (
        <GlowEffect 
          colors={[poolColor, '#f7931a']} 
          mode="breathe" 
          blur="stronger"
          scale={1.2}
          duration={3}
          className="opacity-30"
        />
      )}
      
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[32px] border-r-[32px] border-t-transparent border-r-btc-orange z-10"></div>
      )}
      
      {/* Background gradient based on pool color - now using darker tech gradients */}
      <div className={cn(
        "absolute inset-0 opacity-30 transition-opacity duration-300",
        isSelected ? "opacity-40" : "opacity-20"
      )}
      style={{ background: getDarkerTechGradient(pool.id) }}></div>
      
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 backdrop-blur-sm bg-btc-dark/80"></div>
      
      {/* Content */}
      <div className="relative z-10 p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-white">{pool.name}</h3>
            <div className="mt-1 text-xs text-white/60">{pool.region}</div>
          </div>
          <div className="h-10 w-10 rounded-lg flex items-center justify-center"
               style={{ background: getDarkerTechGradient(pool.id) }}>
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
          
          {isSelected && (
            <div className="text-btc-orange text-xs font-medium px-2 py-1 rounded-full border border-btc-orange/30 bg-btc-orange/5">
              Selected
            </div>
          )}
        </div>
        
        {/* Progress bar showing hashrate percentage */}
        <div className="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-1000 ease-out"
            style={{ width: `${displayedHashrate}%`, background: getDarkerTechGradient(pool.id) }}
          ></div>
        </div>

        {/* Render stacked chips if there are bets */}
        {bets.length > 0 && renderStackedChips(bets)}
      </div>
    </div>
  );
};

// Function to get darker, more tech-oriented gradients based on pool ID
const getDarkerTechGradient = (poolId: string): string => {
  switch(poolId) {
    case 'slushpool':
      return 'linear-gradient(135deg, #0a2e4f 0%, #041424 100%)';
    case 'f2pool':
      return 'linear-gradient(135deg, #0a3a4f 0%, #051b24 100%)';
    case 'antpool':
      return 'linear-gradient(135deg, #4a0e0e 0%, #2a0606 100%)';
    case 'viabtc':
      return 'linear-gradient(135deg, #4a2e0e 0%, #221605 100%)';
    case 'btccom':
      return 'linear-gradient(135deg, #2a1f5e 0%, #16102d 100%)';
    case 'poolin':
      return 'linear-gradient(135deg, #0a4a30 0%, #052218 100%)';
    case 'genesis':
      return 'linear-gradient(135deg, #3a1e5e 0%, #1c0e2d 100%)';
    case 'bitfury':
      return 'linear-gradient(135deg, #4f1a2e 0%, #290e18 100%)';
    case 'binance':
      return 'linear-gradient(135deg, #4a3f0e 0%, #241f05 100%)';
    case 'kano':
      return 'linear-gradient(135deg, #354a0e 0%, #1a2405 100%)';
    case 'pega':
      return 'linear-gradient(135deg, #1a344f 0%, #0e1a29 100%)';
    case 'emcd':
      return 'linear-gradient(135deg, #4a0e3f 0%, #24051e 100%)';
    default:
      return 'linear-gradient(135deg, #1a1a2e 0%, #0d0d16 100%)';
  }
};

// Function to get the primary color for each pool
const getPoolColor = (poolId: string): string => {
  switch(poolId) {
    case 'slushpool':
      return '#1ABC9C';
    case 'f2pool':
      return '#3498DB';
    case 'antpool':
      return '#E74C3C';
    case 'viabtc':
      return '#E67E22';
    case 'btccom':
      return '#9B59B6';
    case 'poolin':
      return '#2ECC71';
    case 'genesis':
      return '#8E44AD';
    case 'bitfury':
      return '#E83E8C';
    case 'binance':
      return '#F1C40F';
    case 'kano':
      return '#7F8C8D';
    case 'pega':
      return '#3498DB';
    case 'emcd':
      return '#E84393';
    default:
      return '#95A5A6';
  }
};

// Function to render chips stacked on the pool - UPDATED to display horizontally
const renderStackedChips = (bets: Array<{id: number; amount: number}>) => {
  if (bets.length === 0) return null;
  
  const displayBets = bets.slice(-5);
  const remainingCount = bets.length > 5 ? bets.length - 5 : 0;
  
  return (
    <div className="absolute bottom-2 left-2 right-2">
      <div className="relative flex justify-start items-center h-8">
        {displayBets.map((bet, index) => (
          <div 
            key={bet.id} 
            className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-xl",
              getChipColor(bet.amount)
            )} 
            style={{
              marginLeft: index > 0 ? '-8px' : '0',
              zIndex: 5 - index,
              transform: `rotate(${index * 5 - 10}deg)`
            }}
          >
            <div className="absolute inset-1.5 rounded-full border border-white/30"></div>
            <div 
              className="absolute inset-0.5 rounded-full border-4 border-dashed" 
              style={{
                borderColor: `${getChipSecondaryColor(bet.amount)}`
              }}
            ></div>
            <span className="relative z-10 text-white font-bold drop-shadow-md">
              {bet.amount >= 10000 ? `${bet.amount / 1000}k` : bet.amount}
            </span>
          </div>
        ))}
        
        {remainingCount > 0 && (
          <div className="text-xs text-white/80 font-medium ml-1 bg-black/50 px-1 rounded">
            +{remainingCount} more
          </div>
        )}
      </div>
    </div>
  );
};

// Function to get chip color based on value
const getChipColor = (value: number) => {
  if (value >= 10000) return "bg-red-900";
  if (value >= 5000) return "bg-blue-900";
  if (value >= 1000) return "bg-green-900";
  if (value >= 500) return "bg-purple-900";
  return "bg-yellow-900";
};

// Function to get chip secondary color based on value
const getChipSecondaryColor = (value: number) => {
  if (value >= 10000) return "bg-red-800";
  if (value >= 5000) return "bg-blue-800";
  if (value >= 1000) return "bg-green-800";
  if (value >= 500) return "bg-purple-800";
  return "bg-yellow-800";
};

export default MiningPoolCard;
