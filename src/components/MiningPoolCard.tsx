import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from './ui/card';
import { formatSats } from '@/utils/formatters';
import { MiningPool } from '@/utils/types';

// Update the MiningPoolCardProps interface to include onClick
export interface MiningPoolCardProps {
  pool: MiningPool;
  bets?: { poolId: string; amount: number; id: number; }[];
  selected?: boolean;
  onClick?: () => void;
}

const MiningPoolCard: React.FC<MiningPoolCardProps> = ({ pool, bets = [], selected = false, onClick }) => {
  const getPoolLogo = (poolId: string) => {
    const logoPath = `/pool-logos/${poolId}.svg`;
    return (
      <div className="w-full h-full flex items-center justify-center bg-black rounded-full overflow-hidden p-0.5">
        <img 
          src={logoPath} 
          alt={`${poolId} logo`} 
          className="w-full h-full object-contain" 
          onError={e => {
            console.log(`Error loading logo for ${poolId}: ${logoPath}`);
            e.currentTarget.src = '/pool-logos/default.svg';
          }} 
        />
      </div>
    );
  };

  const getBetsOnPool = (poolId: string | null) => {
    if (!bets || !Array.isArray(bets)) return [];
    return bets.filter(bet => bet.poolId === poolId);
  };

  const renderImprovedChips = (amounts: number[]) => {
    const groupedChips: {
      [key: number]: number;
    } = {};
    amounts.forEach(amount => {
      groupedChips[amount] = (groupedChips[amount] || 0) + 1;
    });
    
    const chipGroups = Object.entries(groupedChips).map(([amount, count]) => ({
      amount: parseInt(amount),
      count
    })).sort((a, b) => b.amount - a.amount);
    
    const chipsToShow = chipGroups.slice(0, 3);
    const remainingDenoms = chipGroups.length > 3 ? chipGroups.length - 3 : 0;
    
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

    return (
      <div className="flex -space-x-1 mr-2">
        {chipsToShow.map((chipGroup, index) => (
          <div 
            key={`chip-${chipGroup.amount}-${index}`} 
            className={cn(
              "relative w-6 h-6 rounded-full flex flex-col items-center justify-center text-[9px] font-bold text-white border border-white/40",
              getChipColor(chipGroup.amount)
            )}
            style={{
              zIndex: 5 - index,
              transform: `translateX(${index * 4}px)`
            }}
          >
            <div className="absolute inset-0 rounded-full border border-white/30 border-dashed"></div>
            <div className="flex flex-col items-center justify-center">
              <span className="leading-none">
                {chipGroup.amount >= 1000 ? `${chipGroup.amount / 1000}K` : chipGroup.amount}
              </span>
              {chipGroup.count > 1 && (
                <span className="text-[7px] leading-none mt-0.5">×{chipGroup.count}</span>
              )}
            </div>
          </div>
        ))}
        
        {remainingDenoms > 0 && (
          <div 
            className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold bg-black/50 border border-white/20 shadow-sm"
            style={{
              zIndex: 1,
              transform: `translateX(${chipsToShow.length * 4}px)`
            }}
          >
            +{remainingDenoms}
          </div>
        )}
      </div>
    );
  };

  const renderStackedChips = (bets: Array<{
    id: number;
    amount: number;
  }>) => {
    if (bets.length === 0) return null;
    const displayBets = bets.slice(-5);
    const remainingCount = bets.length > 5 ? bets.length - 5 : 0;

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

  // Update the card's onClick handler
  return (
    <Card 
      className={cn(
        "relative overflow-hidden cursor-pointer transition-all hover:scale-[1.02] border border-white/5 group",
        selected ? "ring-2 ring-btc-orange ring-offset-0" : ""
      )}
      style={{ background: pool.gradient || 'linear-gradient(135deg, #3a3a3a, #1a1a1a)' }}
      onClick={onClick} // Add the onClick handler here
    >
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-[1]" />
      
      <div className="absolute top-2 left-2 z-10">
        <div className="text-xs text-white/60">{pool.name}</div>
        <div className="text-sm font-bold text-white">{pool.hashRatePercent.toFixed(2)}%</div>
      </div>
      
      <div className="absolute bottom-2 left-2 z-10">
        <div className="text-xs text-white/60">Blocks (24h)</div>
        <div className="text-sm font-bold text-white">{pool.blocksLast24h}</div>
      </div>
      
      <div className="absolute top-2 right-2 w-10 h-10 z-10">
        {getPoolLogo(pool.id)}
      </div>
      
      {renderStackedChips(getBetsOnPool(pool.id))}
    </Card>
  );
};

export default MiningPoolCard;
