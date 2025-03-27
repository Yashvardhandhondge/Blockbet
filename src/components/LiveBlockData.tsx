
import React, { useState, useEffect } from 'react';
import { Pickaxe, Star } from 'lucide-react';
import { fetchLatestBlockData } from '@/api/latestBlockApi';
import { fetchWithRetry } from '@/utils/errorUtils';
import { toast } from './ui/use-toast';

// Custom event for block mining
export const BLOCK_MINED_EVENT = 'blockMined';

export function emitBlockMined(blockData: any) {
  const event = new CustomEvent(BLOCK_MINED_EVENT, { 
    detail: blockData 
  });
  window.dispatchEvent(event);
}

const LiveBlockData = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [minedBy, setMinedBy] = useState<string>('Unknown');
  const [poolLogo, setPoolLogo] = useState<string | null>(null);
  const [blockHeight, setBlockHeight] = useState<number | null>(null);
  const [prevBlockHeight, setPrevBlockHeight] = useState<number | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch block data with retry logic
        const blockData = await fetchWithRetry(() => fetchLatestBlockData());
        
        // Check if this is a new block
        if (blockHeight !== null && blockData.latestBlock.height !== blockHeight) {
          // Emit block mined event
          emitBlockMined(blockData.latestBlock);
        }
        
        setPrevBlockHeight(blockHeight);
        setMinedBy(blockData.latestBlock.minedBy || 'Unknown');
        setBlockHeight(blockData.latestBlock.height);

        // Set poolLogo based on pool name
        const normalizedPoolName = blockData.latestBlock.minedBy?.toLowerCase().replace(/\s+/g, '') || '';
        try {
          // Try to find a matching logo
          setPoolLogo(`/pool-logos/${normalizedPoolName}.svg`);
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

    // Refresh data every 30 seconds
    const intervalId = setInterval(() => {
      fetchData().catch(err => {
        console.error("Error in interval fetch:", err);
        toast({
          title: "Data fetch error",
          description: "Could not update blockchain data",
          variant: "destructive"
        });
      });
    }, 30000);
    
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
  
  return <div className="flex flex-1 gap-3 overflow-x-auto hide-scrollbar">
      <div className="flex items-center gap-1.5 bg-[#0f0f0f] border-white/5 rounded-lg px-2 py-1 min-w-24">
        <Pickaxe className="h-3 w-3 text-btc-orange flex-shrink-0" />
        <span className="text-xs text-white/70 mr-1 whitespace-nowrap">Latest block: </span>
        <span className="text-xs font-mono font-bold text-white mr-2">{blockHeight}</span>
        <span className="text-xs text-white/70 mr-1 whitespace-nowrap">mined by:</span>
        <div className="flex items-center">
          {poolLogo && <img src={poolLogo} alt={minedBy} className="h-4 w-4 mr-1" onError={e => {
          (e.target as HTMLImageElement).src = '/pool-logos/unknown.svg';
        }} />}
          <span className="text-xs font-mono font-bold text-white truncate max-w-16">{minedBy}</span>
        </div>
        <div className="relative ml-1">
          <Star className="h-3 w-3 text-btc-orange absolute" />
          <Star className="h-2 w-2 text-yellow-300 absolute -right-1.5 -top-0.5" />
        </div>
      </div>
    </div>;
};

export default LiveBlockData;
