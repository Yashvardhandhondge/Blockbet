
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useCountUp } from '@/lib/animations';
import { GlowEffect } from './ui/glow-effect';
import { BackgroundGradientAnimation } from './ui/background-gradient-animation';
import { useIsMobile } from '@/hooks/use-mobile';

interface MiningPoolCardProps {
  id: string;
  name: string;
  probability: number;
  isSelected: boolean;
  onClick: () => void;
  selectedChip: number;
}

const MiningPoolCard = ({ 
  id, 
  name, 
  probability, 
  isSelected, 
  onClick,
  selectedChip
}: MiningPoolCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();
  
  // Calculate payout based on probability
  const payout = probability > 0 ? (1 / probability).toFixed(2) : "∞";
  
  // Simulate a hashrate percentage based on probability
  const hashRatePercent = probability * 100;
  const displayedHashrate = useCountUp(hashRatePercent, 1500, 300);
  
  const poolColor = getPoolColor(id);
  
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
      onClick={onClick}
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
      style={{ background: getDarkerTechGradient(id) }}></div>
      
      <div className="absolute inset-0 backdrop-blur-sm bg-btc-dark/80"></div>
      
      <div className="relative z-10 p-4 flex flex-col h-full">
        <div className="flex flex-col items-center mb-1">
          <div className={cn(
            "rounded-lg overflow-hidden bg-transparent mb-1",
            isMobile ? "h-10 w-10" : "h-16 w-16"
          )}>
            <div className="w-full h-full flex items-center justify-center rounded-lg overflow-hidden">
              <img 
                src={`/${id} Bitcoin Explorer.svg`} 
                alt={`${name} logo`} 
                className="w-full h-full object-contain" 
                onError={(e) => {
                  console.log(`Error loading logo for ${id}: /${id} Bitcoin Explorer.svg`);
                  e.currentTarget.src = '/Mempool Bitcoin Explorer (2).svg';
                }} 
              />
            </div>
          </div>
          
          <div className="text-center">
            <h3 className={cn(
              "font-medium text-white truncate max-w-full",
              isMobile ? "text-xs" : "text-lg"
            )}>{name}</h3>
          </div>
        </div>
        
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
                {payout}
                <span className="ml-0.5">×</span>
              </span>
              <span className={cn("ml-1 text-white/60", isMobile ? "text-[9px]" : "text-xs")}>payout</span>
            </div>
          </div>
          
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-1000 ease-out"
              style={{ width: `${displayedHashrate}%`, background: getDarkerTechGradient(id) }}
            ></div>
          </div>
        </div>

        {isSelected && renderChip(selectedChip)}
      </div>
    </div>
  );
};

// Helper functions for getting colors, gradients, etc.

const getDarkerTechGradient = (poolId: string): string => {
  switch(poolId) {
    case 'braiins':
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
    case 'btccom':
      return 'linear-gradient(135deg, #1a3366 0%, #0d1933 100%)';
    case 'binance':
      return 'linear-gradient(135deg, #4a3f0e 0%, #241f05 100%)';
    case 'whitepool':
      return 'linear-gradient(135deg, #474747 0%, #242424 100%)';
    case 'foundry':
      return 'linear-gradient(135deg, #4f1a00 0%, #3d1500 100%)';
    default:
      return 'linear-gradient(135deg, #1a1a2e 0%, #0d0d16 100%)';
  }
};

const getPoolColor = (poolId: string): string => {
  switch(poolId) {
    case 'braiins':
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
    case 'btccom':
      return '#72BBFF';
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
  switch(value) {
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

const formatChipValue = (value: number): string => {
  if (value >= 1000) {
    return `${value / 1000}K`;
  }
  return value.toString();
};

const renderChip = (value: number) => {
  return (
    <div className="absolute bottom-3 right-3">
      <div 
        className={cn(
          "rounded-full flex items-center justify-center font-bold text-white shadow-xl w-7 h-7",
          getChipColor(value)
        )}
        style={{
          boxShadow: "0 3px 6px rgba(0,0,0,0.6)",
        }}
      >
        <div className="absolute rounded-full border border-white/30 inset-1"></div>
        <div 
          className="absolute rounded-full border-dashed inset-0.5 border-2"
          style={{
            borderColor: `${getChipSecondaryColor(value)}`
          }}
        ></div>
        <span className="relative z-10 text-white font-bold drop-shadow-md text-[8px]">
          {formatChipValue(value)}
        </span>
      </div>
    </div>
  );
};

export default MiningPoolCard;
