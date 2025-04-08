
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
  // We're removing the display of average block time as requested
  
  // Helper function to dispatch a custom event when a block is mined
  const dispatchBlockMinedEvent = (blockData: any) => {
    // Create a custom event with the block data
    const event = new CustomEvent(BLOCK_MINED_EVENT, { detail: blockData });
    window.dispatchEvent(event);
    
    // If processBets callback is provided, call it with the block data
    if (processBets) {
      processBets(blockData);
    }
  };
  
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Average block time display has been removed */}
    </div>
  );
};

export default LiveBlockData;
