
import React, { useState, useEffect } from 'react';
import { Pickaxe, Star, Clock, Bitcoin } from 'lucide-react';
import { fetchLatestBlockData } from '@/api/latestBlockApi';
import { fetchWithRetry } from '@/utils/errorUtils';
import { toast } from './ui/use-toast';

// Custom event for block mining
export const BLOCK_MINED_EVENT = 'blockMined';
export const BETTING_CLOSED_EVENT = 'bettingClosed';
export const ROUND_DURATION = 8 * 60; // 8 minutes in seconds

export function emitBlockMined(blockData: any) {
  const event = new CustomEvent(BLOCK_MINED_EVENT, { 
    detail: blockData 
  });
  window.dispatchEvent(event);
}

export function emitBettingClosed() {
  const event = new CustomEvent(BETTING_CLOSED_EVENT);
  window.dispatchEvent(event);
}

const LiveBlockData = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [minedBy, setMinedBy] = useState<string>('Unknown');
  const [poolLogo, setPoolLogo] = useState<string | null>(null);
  const [blockHeight, setBlockHeight] = useState<number | null>(null);
  const [prevBlockHeight, setPrevBlockHeight] = useState<number | null>(null);
  const [avgBlockTime, setAvgBlockTime] = useState<number | null>(null);
  const [transactionFees, setTransactionFees] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(ROUND_DURATION);
  const [isBettingClosed, setIsBettingClosed] = useState<boolean>(false);
  
  // Function to reset timer
  const resetTimer = () => {
    setTimeRemaining(ROUND_DURATION);
    setIsBettingClosed(false);
  };
  
  // Handle timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        // If timer reaches zero, close betting
        if (prev <= 1) {
          if (!isBettingClosed) {
            setIsBettingClosed(true);
            emitBettingClosed();
            toast({
              title: "Betting closed",
              description: "No more bets until next block is mined",
              variant: "default"
            });
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isBettingClosed]);
  
  // Format time for display
  const formatTimeRemaining = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Poll for latest block data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch block data with retry logic
        const blockData = await fetchWithRetry(() => fetchLatestBlockData());
        
        // Check if this is a new block
        if (blockHeight !== null && blockData.latestBlock.height !== blockHeight) {
          console.log('New block detected:', blockData.latestBlock.height);
          
          // Emit block mined event
          emitBlockMined(blockData.latestBlock);
          
          // Reset the timer when a new block is mined
          resetTimer();
        }
        
        setPrevBlockHeight(blockHeight);
        setMinedBy(blockData.latestBlock.minedBy || 'Unknown');
        setBlockHeight(blockData.latestBlock.height);
        setAvgBlockTime(blockData.avgBlockTime || null);
        
        // Set transaction fees
        if (blockData.latestBlock.feesRangeText) {
          setTransactionFees(blockData.latestBlock.feesRangeText);
        }

        // Set poolLogo based on pool name - improve logo matching
        const normalizedPoolName = blockData.latestBlock.minedBy?.toLowerCase().replace(/\s+/g, '') || '';
        let logoFound = false;
        
        try {
          // Look for pool logos with a simple fallback strategy
          // First try exact match
          setPoolLogo(`/pool-logos/${normalizedPoolName}.svg`);
          
          // Many common pools have specific file naming patterns
          const commonPools: Record<string, string> = {
            'slushpool': 'slushpool.svg',
            'foundryusa': 'foundryusa.svg',
            'f2pool': 'f2pool.svg',
            'antpool': 'antpool.svg',
            'binancepool': 'binancepool.svg',
            'viabtc': 'viabtc.svg',
            'poolin': 'poolin.svg',
            'btccom': 'btccom.svg',
            'sbicrypto': 'sbicrypto.svg',
            'luxor': 'luxor.svg',
            'spiderpool': 'spiderpool.svg',
            'unknown': 'unknown.svg'
          };
          
          if (commonPools[normalizedPoolName]) {
            setPoolLogo(`/pool-logos/${commonPools[normalizedPoolName]}`);
            logoFound = true;
          }
        } catch (logoError) {
          console.error('Error loading pool logo:', logoError);
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
    
    // Initial fetch
    fetchData();

    // Set up fast polling (1 second intervals for real-time updates)
    const fastPollingInterval = setInterval(() => {
      fetchData().catch(err => {
        console.error("Error in fast polling fetch:", err);
      });
    }, 1000); // Poll every second for maximum responsiveness
    
    return () => {
      clearInterval(fastPollingInterval);
    };
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
  
  return <div className="flex flex-col w-full">
      <div className="flex flex-1 gap-3 overflow-x-auto hide-scrollbar">
        <div className="flex items-center gap-1.5 bg-[#0f0f0f] border-white/5 rounded-lg px-2 py-1 min-w-24">
          <Pickaxe className="h-3 w-3 text-btc-orange flex-shrink-0" />
          <span className="text-xs text-white/70 mr-1 whitespace-nowrap">Latest block: </span>
          <span className="text-xs font-mono font-bold text-white mr-2">{blockHeight}</span>
          <span className="text-xs text-white/70 mr-1 whitespace-nowrap">mined by:</span>
          <div className="flex items-center">
            {poolLogo && <img src={poolLogo} alt={minedBy} className="h-4 w-4 mr-1" onError={e => {
              console.log(`Error loading logo for ${minedBy}:`, e);
              (e.target as HTMLImageElement).src = '/pool-logos/unknown.svg';
            }} />}
            <span className="text-xs font-mono font-bold text-white truncate max-w-16">{minedBy}</span>
          </div>
          <div className="relative ml-1">
            <Star className="h-3 w-3 text-btc-orange absolute" />
            <Star className="h-2 w-2 text-yellow-300 absolute -right-1.5 -top-0.5" />
          </div>
        </div>

        {/* Additional stats for desktop view */}
        <div className="hidden md:flex items-center gap-1.5 bg-[#0f0f0f] border-white/5 rounded-lg px-2 py-1 min-w-24">
          <Clock className="h-3 w-3 text-btc-orange flex-shrink-0" />
          <span className="text-xs text-white/70 mr-1 whitespace-nowrap">Avg block time: </span>
          <span className="text-xs font-mono font-bold text-white">{avgBlockTime ? `${avgBlockTime.toFixed(1)} min` : 'N/A'}</span>
        </div>

        <div className="hidden md:flex items-center gap-1.5 bg-[#0f0f0f] border-white/5 rounded-lg px-2 py-1 min-w-24">
          <Bitcoin className="h-3 w-3 text-btc-orange flex-shrink-0" />
          <span className="text-xs text-white/70 mr-1 whitespace-nowrap">Fees: </span>
          <span className="text-xs font-mono font-bold text-white">{transactionFees || 'N/A'}</span>
        </div>
        
        <div className="hidden md:flex items-center gap-1.5 bg-[#0f0f0f] border-white/5 rounded-lg px-2 py-1 min-w-24">
          <Clock className="h-3 w-3 text-btc-orange flex-shrink-0" />
          <span className="text-xs text-white/70 mr-1 whitespace-nowrap">Betting closes: </span>
          <span className={`text-xs font-mono font-bold ${isBettingClosed ? 'text-red-400' : 'text-white'}`}>
            {isBettingClosed ? 'CLOSED' : formatTimeRemaining()}
          </span>
        </div>
      </div>
    </div>;
};

export default LiveBlockData;
