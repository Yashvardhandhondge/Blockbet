import { useState, useEffect, useRef } from 'react';
import { MiningPool } from '@/utils/types';
import { cn } from '@/lib/utils';
import { useCountUp } from '@/lib/animations';
import { GlowEffect } from './ui/glow-effect';
import { BackgroundGradientAnimation } from './ui/background-gradient-animation';
import { useIsMobile } from '@/hooks/use-mobile';
import { Server } from 'lucide-react';

interface MiningPoolCardProps {
  pool: MiningPool;
  onSelect: (pool: MiningPool) => void;
  isSelected: boolean;
  bets?: Array<{id: number; amount: number}>;
  disabled?: boolean;
  isWinningPool?: boolean;
}

// Add this helper function for getting the correct logo URL
const getNormalizedPoolLogoUrl = (pool: MiningPool): string => {
  // Check if the pool already has a valid logoUrl
  if (pool.logoUrl && !pool.logoUrl.includes('undefined')) {
    return pool.logoUrl;
  }
  
  // Mapping for specific pools with different case or naming conventions
  const poolMapping: Record<string, string> = {
    'foundry': 'foundryusa',
    'foundryusa': 'foundryusa',
    'binance': 'binancepool',
    'ocean': 'Ocean', // Fix: Changed to capital 'O' for correct filename
    'bitfufupool': 'BitFuFuPool', // Fix: Changed to match actual case in filename
    'mara': 'marapool',
  };
  
  const normalizedId = poolMapping[pool.id.toLowerCase()] || pool.id;
  return `/pool-logos/${normalizedId}.svg`;
};

const MiningPoolCard = ({ 
  pool, 
  onSelect, 
  isSelected, 
  bets = [], 
  disabled = false,
  isWinningPool = false
}: MiningPoolCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showWinningEffect, setShowWinningEffect] = useState(false);
  const winTimerRef = useRef<NodeJS.Timeout>();
  const isMobile = useIsMobile();
  
  // Make sure we have a valid hashrate value before animating
  const displayedHashrate = useCountUp(pool.hashRatePercent > 0 ? pool.hashRatePercent : 0.1, 1500, 300);
  const poolColor = getPoolColor(pool.id);

// Enhanced winning effect management with fixed 10-second duration
useEffect(() => {
  if (isWinningPool) {
    console.log('Starting win animation for pool:', {
      poolId: pool.id,
      poolName: pool.name,
      timestamp: new Date().toISOString()
    });

    // Clear any existing timer
    if (winTimerRef.current) {
      clearTimeout(winTimerRef.current);
    }

    // Show the winning effect
    setShowWinningEffect(true);
    
    // Set timer to exactly 10 seconds
    winTimerRef.current = setTimeout(() => {
      console.log('Ending win animation for pool after 10 seconds:', {
        poolId: pool.id,
        poolName: pool.name,
        timestamp: new Date().toISOString()
      });
      setShowWinningEffect(false);
    }, 10000); // Exactly 10 seconds
  } else {
    // Clean up if pool is no longer winning
    if (showWinningEffect) {
      console.log('Clearing win animation for pool:', {
        poolId: pool.id,
        poolName: pool.name,
        timestamp: new Date().toISOString()
      });
      setShowWinningEffect(false);
    }
  }

  // Cleanup function
  return () => {
    if (winTimerRef.current) {
      console.log('Cleaning up win timer for pool:', {
        poolId: pool.id,
        poolName: pool.name,
        timestamp: new Date().toISOString()
      });
      clearTimeout(winTimerRef.current);
    }
  };
}, [isWinningPool, pool.id, pool.name, showWinningEffect]);

  useEffect(() => {
    console.log('MiningPoolCard state update:', {
      poolId: pool.id,
      poolName: pool.name,
      isWinningPool,
      showWinningEffect,
      timestamp: new Date().toISOString()
    });
  }, [pool.id, pool.name, isWinningPool, showWinningEffect]);
  
  return (
    <div 
      className={cn(
        "relative rounded-xl overflow-hidden transition-all duration-300 border",
        isSelected 
          ? "border-btc-orange shadow-[0_0_20px_rgba(247,147,26,0.15)]" 
          : "border-white/10 hover:border-white/20",
        isHovered ? "transform-gpu scale-[1.02]" : "transform-gpu scale-100",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      )}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => !disabled && setIsHovered(false)}
      onClick={() => !disabled && onSelect(pool)}
    >
      {isHovered && !disabled && (
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
      
      {showWinningEffect && (
        <>
          <GlowEffect 
            colors={['#fbbf24', '#f59e0b', '#f97316']} 
            mode="pulse" 
            blur="strongest"
            scale={1.5}
            duration={1.5}
            className="opacity-80"
          />
          <GlowEffect 
            colors={['#f7931a', '#fbbf24', '#f59e0b']} 
            mode="rotate" 
            blur="strong"
            scale={1.4}
            duration={2}
            className="opacity-70"
          />
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-yellow-500/20"></div>
        </>
      )}

      {isSelected && (
        <GlowEffect 
          colors={[poolColor, '#f7931a']} 
          mode="breathe" 
          blur="stronger"
          scale={1.2}
          duration={3}
          className="opacity-40"
        />
      )}

      <div className={cn(
        "absolute inset-0 opacity-30 transition-opacity duration-300",
        isSelected ? "opacity-40" : "opacity-20",
        showWinningEffect && "opacity-60"
      )}
      style={{ background: getDarkerTechGradient(pool.id) }}></div>
      
      <div className="absolute inset-0 backdrop-blur-sm bg-btc-dark/80"></div>
      
      <div className="relative z-10 p-4 flex flex-col h-full">
        <div className="flex flex-col items-center mb-1">
          <div className={cn(
            "rounded-lg overflow-hidden bg-transparent mb-1",
            isMobile ? "h-10 w-10" : "h-16 w-16"
          )}>
            <div className="w-full h-full flex items-center justify-center rounded-lg overflow-hidden">
              <img 
                src={getNormalizedPoolLogoUrl(pool)} 
                alt={`${pool.name} logo`} 
                className="w-full h-full object-contain" 
                onError={(e) => {
                  console.log(`Error loading logo for ${pool.id}: ${getNormalizedPoolLogoUrl(pool)}`);
                  e.currentTarget.src = '/pool-logos/unknown.svg';
                }} 
              />
            </div>
          </div>
          
          <div className="text-center">
            <h3 className={cn(
              "font-medium text-white truncate max-w-full",
              isMobile ? "text-xs" : "text-lg"
            )}>{pool.name}</h3>
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
        
        <div className="mt-auto">
        <div className={cn(
  "flex justify-center items-center",
  isMobile ? "mb-2" : "p-2"
)}>
  <div className="text-white/80 text-center">
    <span className={cn(
      "font-bold bg-gradient-to-r from-btc-orange to-yellow-500 bg-clip-text text-transparent",
      isMobile ? "text-sm" : "text-lg"
    )}>
      {pool.odds.toFixed(2)}
      <span className="ml-0.5">×</span>
    </span>
    <span className={cn("ml-1 text-white/60", isMobile ? "text-[9px]" : "text-xs")}>payout</span>
  </div>
</div>
          
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
  <div 
    className="h-full transition-all duration-1000 ease-out"
    style={{ 
      width: `${displayedHashrate}%`, 
      background: 'linear-gradient(90deg, #f7931a 0%, #ffd700 100%)' 
    }}
    onTransitionEnd={() => {
      console.log(`Hashrate bar animation completed for ${pool.name}:`, {
        displayedValue: displayedHashrate + '%',
        actualValue: pool.hashRatePercent + '%'
      });
    }}
  ></div>
</div>
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
  switch(value) {
    case 1000:
      return "bg-purple-600";
    case 5000:
      return "bg-pink-600";
    case 10000:
      return "bg-orange-600";
    case 20000:
      return "bg-blue-600"; // Changed to blue for 20K
    case 50000:
      return "bg-red-600";
    case 100000:
      return "bg-green-600"; // Changed to green for 100K
    case 200000:
      return "bg-yellow-500"; // Changed to gold/yellow for 200K
    default:
      return "bg-gray-600";
  }
};

const getChipSecondaryColor = (value: number) => {
  switch(value) {
    case 1000:
      return "bg-purple-500";
    case 5000:
      return "bg-pink-500";
    case 10000:
      return "bg-orange-500";
    case 20000:
      return "bg-blue-500"; // Changed to blue for 20K
    case 50000:
      return "bg-red-500";
    case 100000:
      return "bg-green-500"; // Changed to green for 100K
    case 200000:
      return "bg-yellow-400"; // Changed to gold/yellow for 200K
    default:
      return "bg-gray-500";
  }
};

const formatChipValue = (value: number): string => {
  if (value >= 1000) {
    return `${value / 1000}K`;
  }
  return value.toString();
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
                  "rounded-full flex flex-col items-center justify-center font-bold text-white shadow-xl w-7 h-7",
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
                <span className="relative z-10 text-white font-bold drop-shadow-md text-[8px]">
                  {formatChipValue(amount)}
                </span>
                {betCount > 1 && 
                  <span className="relative z-10 text-white font-bold drop-shadow-md text-[6px] leading-none -mt-0.5">
                    ×{betCount}
                  </span>
                }
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
