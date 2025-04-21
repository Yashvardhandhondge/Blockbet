import React from 'react';
import { cn } from '@/lib/utils';
import { formatSats } from '@/utils/formatters';

// Add a mapping function for pool IDs to correct image filenames
const getNormalizedPoolId = (poolId: string): string => {
  // Mapping for specific pools with different case or naming conventions
  const poolMapping: Record<string, string> = {
    'foundry': 'foundryusa',
    'foundryusa': 'foundryusa',
    'binance': 'binancepool',
    'ocean': 'Ocean', // Fix: Changed to capital 'O' for correct filename
    'bitfufupool': 'BitFuFuPool', // Fix: Changed to match actual case in filename
    'mara': 'marapool',
    'mining-squared': 'unknown'
  };
  
  return poolMapping[poolId.toLowerCase()] || poolId;
};

export interface BetHistoryProps {
  bets: Array<{
    id: number;
    poolId: string;
    poolName: string;
    amount: number;
    timestamp: Date;
    isWin: boolean;
    blockHeight: number;
  }>;
}

const BetHistory: React.FC<BetHistoryProps> = ({ bets }) => {
  if (!bets || bets.length === 0) {
    return (
      <div className="text-center py-6 text-white/40">
        <p>No bet history yet</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2 max-h-[300px] overflow-y-auto">
      {bets.map((bet) => (
        <div 
          key={`bet-${bet.id}`}
          className={cn(
            "flex items-center justify-between p-2 rounded-lg transition-colors",
            bet.isWin ? "bg-green-500/10 hover:bg-green-500/15" : "bg-white/5 hover:bg-white/10"
          )}
        >
          <div className="flex items-center">
            <div className={cn(
              "w-8 h-8 rounded-full overflow-hidden flex items-center justify-center mr-3",
              bet.isWin ? "bg-green-500/20" : "bg-white/10"
            )}>
              {bet.poolId === 'empty' ? (
                <div className="w-full h-full flex items-center justify-center bg-black/50">
                  <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              ) : (
                <img 
                  src={`/pool-logos/${getNormalizedPoolId(bet.poolId)}.svg`}
                  alt={bet.poolName}
                  className="w-6 h-6 object-contain"
                  onError={(e) => {
                    console.error(`Failed to load logo for ${bet.poolId} (normalized: ${getNormalizedPoolId(bet.poolId)})`);
                    (e.target as HTMLImageElement).src = '/pool-logos/unknown.svg';
                  }}
                />
              )}
            </div>
            <div>
              <div className="text-sm font-medium text-white">
                {bet.poolName === 'Mining Squared' ? 'Unknown' : bet.poolName}
                {bet.isWin && (
                  <span className="ml-2 text-xs px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded-full">
                    Win
                  </span>
                )}
              </div>
              <div className="text-xs text-white/60">
                Block #{bet.blockHeight} • {bet.timestamp.toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className={cn(
              "text-sm font-medium",
              bet.isWin ? "text-green-400" : "text-white"
            )}>
              {formatSats(bet.amount)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BetHistory;
