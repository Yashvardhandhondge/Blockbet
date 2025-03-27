
import { useState } from 'react';
import { MiningPool } from '@/utils/types';
import { cn } from '@/lib/utils';
import { useCountUp } from '@/lib/animations';
import { GlowEffect } from './ui/glow-effect';
import { BackgroundGradientAnimation } from './ui/background-gradient-animation';
import { useIsMobile } from '@/hooks/use-mobile';

interface MiningPoolCardProps {
  pool: MiningPool;
  onSelect: (pool: MiningPool) => void;
  isSelected: boolean;
  bets?: Array<{id: number; amount: number}>;
}

const MiningPoolCard = ({ pool, onSelect, isSelected, bets = [] }: MiningPoolCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();
  
  const displayedHashrate = useCountUp(pool.hashRatePercent, 1500, 300);
  
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
      {isHovered && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <BackgroundGradientAnimation 
            firstColor={poolColor}
            secondColor="#121212"
            thirdColor={poolColor}
            fourthColor="#232323"
            fifthColor={poolColor}
            size="small"
            blendingValue="overlay"
            interactive={false}
            className="opacity-20"
          />
        </div>
      )}
      
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
      
      <div className={cn(
        "absolute inset-0 opacity-30 transition-opacity duration-300",
        isSelected ? "opacity-40" : "opacity-20"
      )}
      style={{ background: getDarkerTechGradient(pool.id) }}></div>
      
      <div className="absolute inset-0 backdrop-blur-sm bg-btc-dark/80"></div>
      
      <div className="relative z-10 p-4">
        <div className="flex flex-col items-center mb-1">
          <div className="h-20 w-20 rounded-lg overflow-hidden bg-transparent mb-1">
            <div className="w-full h-full flex items-center justify-center rounded-lg overflow-hidden">
              <img 
                src={pool.logoUrl} 
                alt={`${pool.name} logo`} 
                className="w-full h-full object-contain" 
                onError={(e) => {
                  console.log(`Error loading logo for ${pool.id}: ${pool.logoUrl}`);
                  e.currentTarget.src = '/Mempool Bitcoin Explorer (2).svg';
                }} 
              />
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="text-lg font-medium text-white">{pool.name}</h3>
            {!isMobile && <div className="mt-0.5 text-xs text-white/60">{pool.region}</div>}
          </div>
        </div>
        
        {!isMobile && (
          <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
            <div className="p-2">
              <div className="text-white/60 text-xs">Hashrate</div>
              <div className="font-medium text-white">{pool.hashRate.toFixed(1)} EH/s</div>
            </div>
            <div className="p-2">
              <div className="text-white/60 text-xs">Blocks (24h)</div>
              <div className="font-medium text-white">{pool.blocksLast24h}</div>
            </div>
          </div>
        )}
        
        <div className={cn("mt-2 flex justify-center items-center p-2", isMobile && "mt-1")}>
          <div className="text-white/80 text-center">
            <span className="text-lg font-bold bg-gradient-to-r from-btc-orange to-yellow-500 bg-clip-text text-transparent">{pool.odds.toFixed(2)}
              <span className="ml-0.5">×</span>
            </span>
            <span className="text-xs ml-1 text-white/60">payout</span>
          </div>
        </div>
        
        <div className="mt-3 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-1000 ease-out"
            style={{ width: `${displayedHashrate}%`, background: getDarkerTechGradient(pool.id) }}
          ></div>
        </div>

        {bets.length > 0 && renderStackedChips(bets)}
      </div>
    </div>
  );
};

const getDarkerTechGradient = (poolId: string): string => {
  switch(poolId) {
    case 'braiinspool':
      return 'linear-gradient(135deg, #0a2e4f 0%, #041424 100%)';
    case 'f2pool':
      return 'linear-gradient(135deg, #0a3a4f 0%, #051b24 100%)';
    case 'antpool':
      return 'linear-gradient(135deg, #4a0e0e 0%, #2a0606 100%)';
    case 'viabtc':
      return 'linear-gradient(135deg, #4a2e0e 0%, #221605 100%)';
    case 'bitcoincom':
      return 'linear-gradient(135deg, #2a1f5e 0%, #16102d 100%)';
    case 'poolin':
      return 'linear-gradient(135deg, #0a4a30 0%, #052218 100%)';
    case 'sbicrypto':
      return 'linear-gradient(135deg, #1a3366 0%, #0d1b33 100%)';
    case 'spiderpool':
      return 'linear-gradient(135deg, #664d1a 0%, #33260d 100%)';
    case 'luxor':
      return 'linear-gradient(135deg, #664d1a 0%, #33270d 100%)';
    case 'ultimuspool':
      return 'linear-gradient(135deg, #1a1a66 0%, #0d0d33 100%)';
    case 'ocean':
      return 'linear-gradient(135deg, #1a3366 0%, #0d1933 100%)';
    case 'secpool':
      return 'linear-gradient(135deg, #33195e 0%, #1a0d2f 100%)';
    case 'carbonnegative':
      return 'linear-gradient(135deg, #1a4d33 0%, #0d2619 100%)';
    case 'bitfufupool':
      return 'linear-gradient(135deg, #4d1a33 0%, #260d19 100%)';
    case 'whitepool':
      return 'linear-gradient(135deg, #474747 0%, #242424 100%)';
    case 'binance':
      return 'linear-gradient(135deg, #4a3f0e 0%, #241f05 100%)';
    case 'foundry':
      return 'linear-gradient(135deg, #4f1a00 0%, #3d1500 100%)';
    default:
      return 'linear-gradient(135deg, #1a1a2e 0%, #0d0d16 100%)';
  }
};

const getPoolColor = (poolId: string): string => {
  switch(poolId) {
    case 'braiinspool':
      return '#1ABC9C';
    case 'f2pool':
      return '#3498DB';
    case 'antpool':
      return '#E74C3C';
    case 'viabtc':
      return '#E67E22';
    case 'bitcoincom':
      return '#9B59B6';
    case 'poolin':
      return '#2ECC71';
    case 'sbicrypto':
      return '#0065F5';
    case 'spiderpool':
      return '#FFBE1E';
    case 'luxor':
      return '#F0BB31';
    case 'ultimuspool':
      return '#1652EE';
    case 'ocean':
      return '#72BBFF';
    case 'secpool':
      return '#9333EA';
    case 'carbonnegative':
      return '#15803D';
    case 'bitfufupool':
      return '#DB2777';
    case 'whitepool':
      return '#FFFFFF';
    case 'binance':
      return '#F1C40F';
    case 'foundry':
      return '#F97316';
    default:
      return '#95A5A6';
  }
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

const getChipSecondaryColor = (value: number) => {
  switch (value) {
    case 100:
      return "bg-blue-500";
    case 500:
      return "bg-green-500";
    case 1000:
      return "bg-purple-500";
    case 5000:
      return "bg-pink-500";
    case 10000:
      return "bg-orange-500";
    case 50000:
      return "bg-red-500";
    case 100000:
      return "bg-yellow-500";
    default:
      return "bg-gray-500";
  }
};

const renderStackedChips = (bets: Array<{
    id: number;
    amount: number;
  }>) => {
  if (bets.length === 0) return null;
  
  const groupedBets: Record<number, Array<{id: number; amount: number}>> = {};
  
  bets.forEach(bet => {
    if (!groupedBets[bet.amount]) {
      groupedBets[bet.amount] = [];
    }
    groupedBets[bet.amount].push(bet);
  });
  
  const denominations = Object.keys(groupedBets).map(Number).sort((a, b) => b - a);
  
  const displayDenominations = denominations.slice(0, 5);
  const remainingDenominations = denominations.length > 5 ? denominations.length - 5 : 0;
  
  return (
    <div className="absolute bottom-3 right-0 left-0 px-4 flex justify-end">
      <div className="flex flex-row-reverse items-end gap-4 h-12">
        {displayDenominations.map((amount, index) => {
          const betCount = groupedBets[amount].length;
          const stackSize = Math.min(betCount, 4);
          
          return (
            <div 
              key={`stack-${amount}`} 
              className="relative"
              style={{ zIndex: 10 - index }}
            >
              {Array.from({ length: stackSize - 1 }).map((_, stackIndex) => (
                <div 
                  key={`chip-${amount}-${stackIndex}`}
                  className={cn(
                    "rounded-full flex items-center justify-center font-bold text-white shadow-xl w-7 h-7 text-[10px]",
                    getChipColor(amount)
                  )}
                  style={{
                    position: 'absolute',
                    bottom: stackIndex * 4,
                    right: 0,
                    transform: `rotate(${(stackIndex * 5) - 7}deg)`,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
                  }}
                >
                  <div className="absolute rounded-full border border-white/30 inset-1"></div>
                  <div 
                    className="absolute rounded-full border-dashed inset-0.5 border-2"
                    style={{
                      borderColor: `${getChipSecondaryColor(amount)}`
                    }}
                  ></div>
                </div>
              ))}
              
              <div 
                className={cn(
                  "rounded-full flex items-center justify-center font-bold text-white shadow-xl w-7 h-7 text-[10px]",
                  getChipColor(amount)
                )}
                style={{
                  boxShadow: "0 3px 6px rgba(0,0,0,0.6)",
                  position: stackSize > 1 ? 'relative' : 'relative',
                  bottom: stackSize > 1 ? (stackSize - 1) * 4 : 0,
                  right: 0,
                }}
              >
                <div className="absolute rounded-full border border-white/30 inset-1"></div>
                <div 
                  className="absolute rounded-full border-dashed inset-0.5 border-2"
                  style={{
                    borderColor: `${getChipSecondaryColor(amount)}`
                  }}
                ></div>
                <span className="relative z-10 text-white font-bold drop-shadow-md flex items-center">
                  {amount >= 10000 ? `${amount / 1000}k` : amount}
                  {betCount > 1 && <span className="text-[8px] ml-0.5">×{betCount}</span>}
                </span>
              </div>
            </div>
          );
        })}
        
        {remainingDenominations > 0 && (
          <div className="text-xs text-white/80 font-medium ml-1 bg-black/50 px-1.5 py-0.5 rounded-full shadow-md">
            +{remainingDenominations}
          </div>
        )}
      </div>
    </div>
  );
};

export default MiningPoolCard;
