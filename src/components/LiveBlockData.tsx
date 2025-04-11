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
  // Helper function to dispatch a custom event when a block is mined
  const dispatchBlockMinedEvent = (blockData: any) => {
    console.log('Dispatching block mined event with data:', blockData);
    
    // Create a custom event with the block data
    const event = new CustomEvent(BLOCK_MINED_EVENT, { detail: blockData });
    window.dispatchEvent(event);
    
    // If processBets callback is provided, call it with the block data
    if (processBets) {
      processBets(blockData);
    }
  };
  
  // Simulate mined blocks for development purposes
  useEffect(() => {
    // Function to fetch the latest block data
    const fetchLatestBlock = async () => {
      try {
        // In a real app, this would fetch from an API
        const mockMinedBy = ['foundry', 'antpool', 'f2pool', 'binance', 'viabtc', 'slushpool', 'braiinspool'];
        const randomPool = mockMinedBy[Math.floor(Math.random() * mockMinedBy.length)];
        
        // Mock block data
        const blockData = {
          height: Math.floor(800000 + Math.random() * 100000),
          minedBy: randomPool,
          timestamp: Date.now(),
          hash: Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')
        };
        
        // Dispatch the event with the block data
        dispatchBlockMinedEvent(blockData);
        
        console.log('New block mined by:', randomPool);
      } catch (error) {
        console.error('Error fetching latest block:', error);
      }
    };
    
    // Fetch immediately on mount to start the first round
    fetchLatestBlock();
    
    // Then set up interval (for development only) - setting to 10 minutes (600000ms) to better simulate Bitcoin blocks
    // We've increased this from 30 seconds to prevent chips being cleared too frequently
    const interval = setInterval(fetchLatestBlock, 600000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Component doesn't render anything visible */}
    </div>
  );
};

export default LiveBlockData;
