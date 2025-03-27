
import React, { useState, useEffect } from 'react';
import { Pickaxe, Star } from 'lucide-react';
import { fetchLatestBlockData } from '@/api/latestBlockApi';
import { fetchWithRetry } from '@/utils/errorUtils';
import { toast } from './ui/use-toast';

// Custom events for block mining and betting reset
export const BLOCK_MINED_EVENT = 'blockMined';
export const BETTING_RESET_EVENT = 'bettingReset';

export function emitBlockMined(blockData: any) {
  console.log('Emitting block mined event with data:', blockData);
  const event = new CustomEvent(BLOCK_MINED_EVENT, { 
    detail: blockData 
  });
  window.dispatchEvent(event);
}

export function emitBettingReset() {
  const event = new CustomEvent(BETTING_RESET_EVENT);
  window.dispatchEvent(event);
}

const LiveBlockData = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [minedBy, setMinedBy] = useState<string>('Unknown');
  const [poolLogo, setPoolLogo] = useState<string | null>(null);
  const [blockHeight, setBlockHeight] = useState<number | null>(null);
  const [prevBlockHeight, setPrevBlockHeight] = useState<number | null>(null);
  const [txCount, setTxCount] = useState<number | null>(null);
  const [blockTime, setBlockTime] = useState<string | null>(null);
  const [feesRange, setFeesRange] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Don't show loading spinner on subsequent fetches
        if (blockHeight === null) {
          setIsLoading(true);
        }

        // Fetch block data with retry logic
        const blockData = await fetchWithRetry(() => fetchLatestBlockData());
        
        // Check if this is a new block
        const isNewBlock = blockHeight !== null && blockData.latestBlock.height !== blockHeight;
        
        if (isNewBlock) {
          console.log('New block detected:', blockData.latestBlock.height, 'previous:', blockHeight);
          // Emit block mined event
          emitBlockMined(blockData.latestBlock);
          
          // Display toast notification
          toast({
            title: "New Block Mined!",
            description: `Block #${blockData.latestBlock.height} mined by ${blockData.latestBlock.minedBy}`
          });
        }
        
        // Update state
        setPrevBlockHeight(blockHeight);
        setMinedBy(blockData.latestBlock.minedBy || 'Unknown');
        setBlockHeight(blockData.latestBlock.height);
        setTxCount(blockData.latestBlock.transactionCount);
        setFeesRange(blockData.latestBlock.feesRangeText);
        
        // Format timestamp
        const date = new Date(blockData.latestBlock.timestamp);
        setBlockTime(date.toLocaleTimeString());

        // Set poolLogo based on pool name
        const normalizedPoolName = blockData.latestBlock.minedBy?.toLowerCase().replace(/\s+/g, '') || '';
        try {
          // Try to find a matching logo
          const logoPath = `/pool-logos/${normalizedPoolName}.svg`;
          setPoolLogo(logoPath);
        } catch {
          setPoolLogo('/pool-logos/unknown.svg');
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching live data:', err);
        setError('Failed to load data');
        toast({
          title: "Data fetch error",
          description: "Could not update blockchain data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();

    // Fetch data every 1 second
    const intervalId = setInterval(() => {
      fetchData().catch(err => {
        console.error("Error in interval fetch:", err);
      });
    }, 1000); // 1 second interval
    
    return () => clearInterval(intervalId);
  }, [blockHeight]);
  
  if (isLoading) {
    return <div className="flex flex-1 gap-4 overflow-x-auto hide-scrollbar">
        <div className="h-8 bg-white/5 animate-pulse rounded flex-1 min-w-20"></div>
      </div>;
  }
  
  if (error) {
    return <div className="bg-red-500/10 text-red-400 px-3 py-1 rounded-lg text-xs flex items-center">
        <span className="mr-2">{error}</span>
        <button onClick={() => window.location.reload()} className="px-2 py-0.5 bg-red-500/20 hover:bg-red-500/30 rounded text-xs">
          Retry
        </button>
      </div>;
  }
  
  return (
    <div className="flex flex-1 gap-3 overflow-x-auto hide-scrollbar">
      <div className="flex items-center gap-1.5 bg-[#0f0f0f] border-white/5 rounded-lg px-2 py-1 min-w-24">
        <Pickaxe className="h-3 w-3 text-btc-orange flex-shrink-0" />
        <span className="text-xs text-white/70 mr-1 whitespace-nowrap">Block: </span>
        <span className="text-xs font-mono font-bold text-white mr-2">{blockHeight}</span>
        <span className="text-xs text-white/70 mr-1 whitespace-nowrap">by:</span>
        <div className="flex items-center">
          {poolLogo && <img 
            src={poolLogo} 
            alt={minedBy} 
            className="h-4 w-4 mr-1" 
            onError={e => {
              (e.target as HTMLImageElement).src = '/pool-logos/unknown.svg';
            }} 
          />}
          <span className="text-xs font-mono font-bold text-white truncate max-w-16">{minedBy}</span>
        </div>
      </div>

      {/* Additional stats */}
      <div className="flex items-center gap-1.5 bg-[#0f0f0f] border-white/5 rounded-lg px-2 py-1 min-w-24">
        <span className="text-xs text-white/70 mr-1">Txs:</span>
        <span className="text-xs font-mono font-bold text-white">{txCount?.toLocaleString() || "0"}</span>
      </div>

      <div className="flex items-center gap-1.5 bg-[#0f0f0f] border-white/5 rounded-lg px-2 py-1 min-w-24">
        <span className="text-xs text-white/70 mr-1">Fees:</span>
        <span className="text-xs font-mono font-bold text-white">{feesRange || "unknown"}</span>
      </div>

      <div className="flex items-center gap-1.5 bg-[#0f0f0f] border-white/5 rounded-lg px-2 py-1 flex-shrink-0">
        <span className="text-xs text-white/70 mr-1">Time:</span>
        <span className="text-xs font-mono font-bold text-white">{blockTime || "unknown"}</span>
      </div>
    </div>
  );
};

export default LiveBlockData;
