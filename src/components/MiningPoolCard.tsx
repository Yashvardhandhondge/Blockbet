import { useState } from 'react';
import { MiningPool } from '@/utils/mockData';
import { cn } from '@/lib/utils';
import { useCountUp } from '@/lib/animations';
import { GlowEffect } from './ui/glow-effect';
import { ArrowDown } from 'lucide-react';

interface MiningPoolCardProps {
  pool: MiningPool;
  onSelect: (pool: MiningPool) => void;
  isSelected: boolean;
  bets?: Array<{id: number; amount: number}>;
  isPlaceholder?: boolean;
}

const MiningPoolCard = ({ pool, onSelect, isSelected, bets = [], isPlaceholder = false }: MiningPoolCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const displayedHashrate = useCountUp(pool.hashRatePercent, 1500, 300);
  
  const poolColor = getPoolColor(pool.id);

  if (isPlaceholder) {
    return (
      <div 
        className={cn(
          "relative rounded-xl overflow-hidden transition-all duration-300 border cursor-pointer h-full",
          "border-white/10 hover:border-btc-orange/40 hover:shadow-[0_0_20px_rgba(247,147,26,0.15)]",
          isHovered ? "transform-gpu scale-[1.02]" : "transform-gpu scale-100"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-btc-dark to-black opacity-80"></div>
        <GlowEffect 
          colors={['#f7931a', '#ffa41b', '#f76e1a']} 
          mode="breathe" 
          blur="soft"
          scale={1.1}
          duration={4}
          className="opacity-20"
        />
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 text-center">
          <div className="mb-4 bg-btc-orange/10 p-3 rounded-full border border-btc-orange/20">
            <ArrowDown className="h-10 w-10 text-btc-orange animate-bounce" />
          </div>
          
          <h3 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-btc-orange to-yellow-500">
            Place Your Bets
          </h3>
          
          <p className="text-white/60 text-sm">
            Choose a mining pool to place your bet on who will mine the next block
          </p>
        </div>
      </div>
    );
  }
  
  const getBetsByAmount = () => {
    const grouped: Record<number, {id: number, amount: number, count: number}[]> = {};
    
    bets.forEach(bet => {
      if (!grouped[bet.amount]) {
        grouped[bet.amount] = [];
      }
      
      const existingStack = grouped[bet.amount].find(stack => stack.amount === bet.amount);
      
      if (existingStack) {
        existingStack.count += 1;
      } else {
        grouped[bet.amount].push({...bet, count: 1});
      }
    });
    
    return Object.values(grouped).flat();
  };
  
  const stackedBets = getBetsByAmount();
  
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
      
      {isSelected && (
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[32px] border-r-[32px] border-t-transparent border-r-btc-orange z-10"></div>
      )}
      
      <div className={cn(
        "absolute inset-0 opacity-30 transition-opacity duration-300",
        isSelected ? "opacity-40" : "opacity-20"
      )}
      style={{ background: getDarkerTechGradient(pool.id) }}></div>
      
      <div className="absolute inset-0 backdrop-blur-sm bg-btc-dark/80"></div>
      
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
        
        <div className="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-1000 ease-out"
            style={{ width: `${displayedHashrate}%`, background: getDarkerTechGradient(pool.id) }}
          ></div>
        </div>

        {stackedBets.length > 0 && renderChipStacks(stackedBets)}
      </div>
    </div>
  );
};

const renderChipStacks = (bets: Array<{id: number; amount: number; count: number}>) => {
  if (bets.length === 0) return null;
  
  const getChipSize = () => {
    if (bets.length >= 5) return "w-5 h-5 text-[9px]";
    if (bets.length >= 3) return "w-6 h-6 text-[10px]";
    return "w-7 h-7 text-xs";
  };
  
  const stackSpacing = bets.length <= 2 ? 6 : 
                       bets.length <= 3 ? 4 : 
                       bets.length <= 4 ? 2 : 0;
  
  return (
    <div className="absolute bottom-2 right-4">
      <div className="flex items-end justify-end space-x-1">
        {bets.map((stack, stackIndex) => (
          <div 
            key={`stack-${stack.id}-${stackIndex}`}
            className="relative"
            style={{
              marginRight: `${stackSpacing}px`,
              height: `${Math.min(stack.count * 4 + 20, 40)}px`,
              width: getChipSize().split(' ')[0],
              zIndex: 10 - stackIndex
            }}
          >
            {Array.from({ length: Math.min(stack.count, 5) }).map((_, chipIndex) => (
              <div 
                key={`chip-${stack.id}-${chipIndex}`} 
                className={cn(
                  "absolute rounded-full flex items-center justify-center font-bold text-white shadow-xl",
                  getChipSize(),
                  getChipColor(stack.amount)
                )} 
                style={{
                  bottom: `${chipIndex * 4}px`,
                  left: 0,
                  transform: `rotate(${(chipIndex * 3) - 6}deg)`,
                  zIndex: 5 - chipIndex
                }}
              >
                <div className={cn(
                  "absolute rounded-full border border-white/30",
                  "inset-1"
                )}></div>
                <div 
                  className={cn(
                    "absolute rounded-full border-dashed",
                    "inset-0.5 border-2"
                  )}
                  style={{
                    borderColor: `${getChipSecondaryColor(stack.amount)}`
                  }}
                ></div>
                
                {chipIndex === 0 && (
                  <span className="relative z-10 text-white font-bold drop-shadow-md">
                    {stack.amount >= 10000 ? `${stack.amount / 1000}k` : stack.amount}
                  </span>
                )}
              </div>
            ))}
            
            {stack.count > 5 && (
              <div className="absolute -right-2 -top-2 text-[10px] text-white/90 font-medium bg-black/70 px-1 py-0.5 rounded-full border border-white/20 shadow-md">
                x{stack.count}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

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

const getChipColor = (value: number) => {
  if (value >= 10000) return "bg-red-900";
  if (value >= 5000) return "bg-blue-900";
  if (value >= 1000) return "bg-green-900";
  if (value >= 500) return "bg-purple-900";
  return "bg-yellow-900";
};

const getChipSecondaryColor = (value: number) => {
  if (value >= 10000) return "bg-red-800";
  if (value >= 5000) return "bg-blue-800";
  if (value >= 1000) return "bg-green-800";
  if (value >= 500) return "bg-purple-800";
  return "bg-yellow-800";
};

export default MiningPoolCard;
