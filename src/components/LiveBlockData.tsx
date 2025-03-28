
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Waves, Clock } from 'lucide-react';
import { fetchWithRetry } from '@/utils/errorUtils';
import { formatSats } from '@/utils/formatters';

// Name of the event dispatched when a new block is mined
export const BLOCK_MINED_EVENT = 'blockMined';

interface LiveBlockDataProps {
  processBets?: (blockData: any) => void;
  pendingTransactions?: number | null;
  averageBlockTime?: string;
}

const LiveBlockData = ({ 
  processBets,
  pendingTransactions,
  averageBlockTime = "10.0"
}: LiveBlockDataProps) => {
  // The display will now only show average block time
  
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center bg-btc-dark/30 rounded-md px-2 py-1">
        <div className="mr-1.5 text-btc-orange">
          <Clock className="h-3.5 w-3.5" />
        </div>
        <div className="text-xs">
          <span className="text-white/70">Avg. Block: </span>
          <span className="text-white font-medium">{averageBlockTime}m</span>
        </div>
      </div>
    </div>
  );
};

export default LiveBlockData;
