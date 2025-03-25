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
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-white">{pool.name}</h3>
            <div className="mt-1 text-xs text-white/60">{pool.region}</div>
          </div>
          <div className="h-10 w-10 rounded-lg overflow-hidden bg-white/90 shadow-md">
            {getPoolLogo(pool.id)}
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
        </div>
        
        <div className="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
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

const getPoolLogo = (poolId: string) => {
  const logoMap: Record<string, string> = {
    'foundry': '/pool-logos/foundryusa.svg',
    'antpool': '/pool-logos/antpool.svg',
    'f2pool': '/pool-logos/f2pool.svg',
    'binance': '/pool-logos/binancepool.svg',
    'viabtc': '/pool-logos/viabtc.svg',
    'slushpool': '/pool-logos/slushpool.svg',
    'poolin': '/pool-logos/poolin.svg',
    'btc-com': '/pool-logos/bitcoincom.svg',
    'genesis': '/pool-logos/genesisdigitalassets.svg',
    'bitfury': '/pool-logos/bitfury.svg',
    'kano': '/pool-logos/kanopool.svg',
    'pega': '/pool-logos/pegapool.svg',
    'emcd': '/pool-logos/luxor.svg',
    'okkong': '/pool-logos/okkong.svg',
    'okex': '/pool-logos/okexpool.svg',
    'titan': '/pool-logos/titan.svg',
    'sbicrypto': '/pool-logos/sbicrypto.svg',
    'rawpool': '/pool-logos/rawpool.svg',
    'sigmapool': '/pool-logos/sigmapoolcom.svg',
    '1thash': '/pool-logos/1thash.svg',
    'spiderpool': '/pool-logos/spiderpool.svg',
    'prohashing': '/pool-logos/prohashing.svg',
    'arkpool': '/pool-logos/arkpool.svg',
    'bitcoincom': '/pool-logos/bitcoincom.svg',
    'unknown': '/pool-logos/unknown.svg'
  };

  const logoPath = logoMap[poolId] || '/Mempool Bitcoin Explorer (2).svg';
  
  return (
    <div className="w-full h-full flex items-center justify-center bg-white rounded-lg overflow-hidden p-0.5">
      <img 
        src={logoPath} 
        alt={`${poolId} logo`} 
        className="w-full h-full object-contain" 
        onError={(e) => {
          console.log(`Error loading logo for ${poolId}: ${logoPath}`);
          e.currentTarget.src = '/Mempool Bitcoin Explorer (2).svg';
        }} 
      />
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

const renderStackedChips = (bets: Array<{id: number; amount: number}>) => {
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
