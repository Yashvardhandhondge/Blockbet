
import React, { useState, useEffect } from 'react';
import { Pickaxe, Star, Clock, Loader2 } from 'lucide-react';
import { fetchLatestBlockData } from '@/api/latestBlockApi';
import { fetchWithRetry } from '@/utils/errorUtils';
import { toast } from './ui/use-toast';

// Custom event for block mining
export const BLOCK_MINED_EVENT = 'blockMined';
export const BETTING_RESET_EVENT = 'bettingReset';

export function emitBlockMined(blockData: any) {
  const event = new CustomEvent(BLOCK_MINED_EVENT, { 
    detail: blockData 
  });
  window.dispatchEvent(event);
  
  // Also emit betting reset event
  const resetEvent = new CustomEvent(BETTING_RESET_EVENT);
  window.dispatchEvent(resetEvent);
}

const LiveBlockData = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [minedBy, setMinedBy] = useState<string>('Unknown');
  const [poolLogo, setPoolLogo] = useState<string | null>(null);
  const [blockHeight, setBlockHeight] = useState<number | null>(null);
  const [prevBlockHeight, setPrevBlockHeight] = useState<number | null>(null);
  const [avgBlockTime, setAvgBlockTime] = useState<number | null>(null);
  const [blockFees, setBlockFees] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Only show loading state on initial load, not during background polling
        if (blockHeight === null) {
          setIsLoading(true);
        }

        // Fetch block data with retry logic
        const blockData = await fetchWithRetry(() => fetchLatestBlockData());
        
        // Check if this is a new block
        if (blockHeight !== null && blockData.latestBlock.height !== blockHeight) {
          console.log('New block detected:', blockData.latestBlock.height, 'Previous:', blockHeight);
          
          // Emit block mined event
          emitBlockMined(blockData.latestBlock);
          
          toast({
            title: "New Block Mined!",
            description: `Block #${blockData.latestBlock.height} mined by ${blockData.latestBlock.minedBy}`,
          });
        }
        
        setPrevBlockHeight(blockHeight);
        setMinedBy(blockData.latestBlock.minedBy || 'Unknown');
        setBlockHeight(blockData.latestBlock.height);
        setAvgBlockTime(blockData.avgBlockTime);
        setBlockFees(blockData.latestBlock.feesRangeText || '~0 sat/vB');

        // Set poolLogo based on pool name
        const normalizedPoolName = blockData.latestBlock.minedBy?.toLowerCase().trim() || '';
        
        // Special handling for SEC pool
        if (normalizedPoolName.includes('sec')) {
          setPoolLogo('/pool-logos/secpool.svg');
        } else {
          try {
            // Try to find a matching logo using normalized name
            // Map of common pool name variations
            const poolNameMapping: Record<string, string> = {
              'foundry': 'foundryusa',
              'f2pool': 'f2pool',
              'antpool': 'antpool',
              'binance': 'binancepool',
              'via': 'viabtc',
              'slush': 'slushpool',
              'braiins': 'braiinspool',
              'poolin': 'poolin',
              'btc.com': 'btccom',
              'sbi': 'sbicrypto',
              'luxor': 'luxor',
              'ultimuspool': 'ultimuspool',
              'unknown': 'unknown',
              'spider': 'spiderpool',
              'white': 'whitepool',
              'mara': 'marapool',
              'okex': 'okexpool',
              'huobi': 'huobipool',
              'carbon': 'carbonnegative',
              'emcd': 'emcdpool',
              'titan': 'titan',
              'bitdeer': 'bitdeer',
              'kucoin': 'kucoinpool',
              'bitfufu': 'bitfufupool',
              'sigma': 'sigmapoolcom',
              'pega': 'pegapool',
              'ocean': 'ocean'
            };
            
            // Find matching pool name key
            let logoName = 'unknown';
            for (const [key, value] of Object.entries(poolNameMapping)) {
              if (normalizedPoolName.includes(key)) {
                logoName = value;
                break;
              }
            }
            
            setPoolLogo(`/pool-logos/${logoName}.svg`);
          } catch {
            setPoolLogo('/pool-logos/unknown.svg');
          }
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
    
    // Initial data fetch
    fetchData();

    // Poll every second for updates
    const intervalId = setInterval(() => {
      if (isPolling) {
        fetchData().catch(err => {
          console.error("Error in interval fetch:", err);
        });
      }
    }, 1000); // 1 second polling
    
    return () => {
      clearInterval(intervalId);
      setIsPolling(false);
    };
  }, [blockHeight, isPolling]);
  
  if (isLoading && !blockHeight) {
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

      {/* Additional block stats for desktop */}
      <div className="hidden md:flex items-center gap-1.5 bg-[#0f0f0f] border-white/5 rounded-lg px-2 py-1">
        <Clock className="h-3 w-3 text-btc-orange flex-shrink-0" />
        <span className="text-xs text-white/70 mr-1 whitespace-nowrap">Avg block time: </span>
        <span className="text-xs font-mono font-bold text-white">{avgBlockTime ? `${avgBlockTime.toFixed(1)}m` : '--'}</span>
      </div>

      <div className="hidden md:flex items-center gap-1.5 bg-[#0f0f0f] border-white/5 rounded-lg px-2 py-1">
        <Star className="h-3 w-3 text-btc-orange flex-shrink-0" />
        <span className="text-xs text-white/70 mr-1 whitespace-nowrap">Tx fees: </span>
        <span className="text-xs font-mono font-bold text-white">{blockFees || '--'}</span>
      </div>

      {/* Indicator that data is being fetched every second */}
      <div className="hidden md:flex items-center gap-1.5 bg-[#0f0f0f] border-white/5 rounded-lg px-2 py-1">
        <div className={`h-1.5 w-1.5 rounded-full bg-green-500 ${isPolling ? 'animate-pulse' : ''}`}></div>
        <span className="text-xs text-white/70">Live</span>
      </div>
    </div>;
};

export default LiveBlockData;
