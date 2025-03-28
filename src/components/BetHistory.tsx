
import React from 'react';
import { cn } from '@/lib/utils';
import { formatSats, formatBTC } from '@/utils/formatters';

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
              <img 
                src={`/pool-logos/${bet.poolId}.svg`} 
                alt={bet.poolName}
                className="w-6 h-6 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/pool-logos/default.svg';
                }}
              />
            </div>
            <div>
              <div className="text-sm font-medium text-white">
                {bet.poolName}
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
            <div className="text-xs text-white/60">
              {formatBTC(bet.amount / 100000000)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BetHistory;
