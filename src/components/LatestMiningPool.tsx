import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { fetchLatestBlockData } from '@/api/latestBlockApi';
import { Block } from '@/utils/types';
import { AuroraContainer } from '@/components/ui/aurora-container';
import { ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatTimeAgo } from '@/utils/mockData';
import { SparklesText } from '@/components/ui/sparkles-text';
import { fetchWithRetry, hasNewBlock } from '@/utils/errorUtils';
import { ToastContent } from './ui/toast-content';
import LiveBlockData, { BLOCK_MINED_EVENT } from './LiveBlockData';

const LatestMiningPool = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNewBlockAppearing, setIsNewBlockAppearing] = useState(false);
  const [previousLatestBlock, setPreviousLatestBlock] = useState<string | null>(null);
  const [shouldRefresh, setShouldRefresh] = useState<boolean>(false);
  const [pendingTxCount, setPendingTxCount] = useState(12483);
  const [avgBlockTime, setAvgBlockTime] = useState(9.8);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const THROTTLE_TIME = 1000; // 1 second throttle
  const { toast } = useToast();

  const fetchData = async () => {
    const now = Date.now();
    if (now - lastFetchTime < THROTTLE_TIME) {
      return; // Throttle requests
    }
    
    try {
      setLastFetchTime(now);
      const data = await fetchWithRetry(() => fetchLatestBlockData(), 3, 1000);
      
      if (blocks.length > 0 && hasNewBlock(blocks, [data.latestBlock, ...data.previousBlocks])) {
        setPreviousLatestBlock(blocks[0].hash);
        setIsNewBlockAppearing(true);
        
        // Dispatch block mined event
        const event = new CustomEvent(BLOCK_MINED_EVENT, { detail: data.latestBlock });
        window.dispatchEvent(event);
        
        toast({
          title: "New Block Found!",
          description: `Block #${data.latestBlock.height} has been mined by ${data.latestBlock.minedBy}`
        });
        
        setTimeout(() => {
          setBlocks([data.latestBlock, ...data.previousBlocks.slice(0, 9)]);
          setIsNewBlockAppearing(false);
        }, 500);
      } else if (blocks.length === 0) {
        setBlocks([data.latestBlock, ...data.previousBlocks.slice(0, 9)]);
      }
      
      setPendingTxCount(prev => {
        const variation = Math.random() * 100 - 20;
        return Math.max(1000, Math.floor(prev + variation));
      });
      
      setAvgBlockTime(prev => {
        const variation = Math.random() * 0.4 - 0.2;
        return Math.max(9.2, Math.min(10.5, prev + variation));
      });
      
      setError(null);
    } catch (err) {
      console.error('Error fetching blockchain data:', err);
      setError('Failed to fetch blockchain data');
    } finally {
      setIsLoading(false);
    }
  };

  // Poll for updates
  useEffect(() => {
    const pollInterval = setInterval(() => {
      setShouldRefresh(prev => !prev);
    }, 1000); // Poll every second
    
    // Cleanup
    return () => clearInterval(pollInterval);
  }, []);

  // Fetch data when shouldRefresh changes
  useEffect(() => {
    fetchData();
  }, [shouldRefresh]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, []);

  const getPoolLogo = (poolName: string): string => {
    const normalizedName = poolName.toLowerCase().trim();
    
    // FIX: Remove special handling for Mining Squared that sets it to unknown
    // Instead, use unknown.svg as a fallback if needed, but preserve the name
    
    const poolLogoMap: { [key: string]: string } = {
      'foundry usa': '/pool-logos/foundryusa.svg',
      'antpool': '/pool-logos/antpool.svg',
      'f2pool': '/pool-logos/f2pool.svg',
      'binance pool': '/pool-logos/binancepool.svg',
      'viabtc': '/pool-logos/viabtc.svg',
      'slushpool': '/pool-logos/slushpool.svg',
      'braiins pool': '/pool-logos/braiinspool.svg',
      'bitfufupool': '/pool-logos/bitfufupool.svg',
      'ocean': '/pool-logos/ocean.svg',
      'mara': '/pool-logos/marapool.svg',
      'poolin': '/pool-logos/poolin.svg',
      'btc.com': '/pool-logos/btccom.svg',
      'sbi crypto': '/pool-logos/sbicrypto.svg',
      'emcd': '/pool-logos/emcdpool.svg',
      'luxor': '/pool-logos/luxor.svg',
      'kano pool': '/pool-logos/kucoinpool.svg',
      'pega pool': '/pool-logos/pegapool.svg',
      'ultimuspool': '/pool-logos/ultimuspool.svg',
      'minerium': '/pool-logos/minerium.svg',
      'titan.io': '/pool-logos/titan.svg',
      'bitfury': '/pool-logos/bitfury.svg',
      'okex': '/pool-logos/okexpool.svg',
      'huobi pool': '/pool-logos/huobipool.svg',
      'mara pool': '/pool-logos/marapool.svg',
      'whitepool': '/pool-logos/whitepool.svg',
      'spiderpool': '/pool-logos/spiderpool.svg',
      'rawpool': '/pool-logos/rawpool.svg',
      'sigmapool': '/pool-logos/sigmapoolcom.svg',
      'secpool': '/pool-logos/secpool.svg',
      // Add Mining Squared with its proper logo
      'mining squared': '/pool-logos/unknown.svg', // Use unknown.svg as fallback
    };
    
    for (const [key, value] of Object.entries(poolLogoMap)) {
      if (normalizedName.includes(key)) {
        return value;
      }
    }
    
    return '/pool-logos/unknown.svg';
  };

  const handleManualRefresh = async () => {
    try {
      await fetchData();
      toast({
        title: "Data Refreshed",
        description: "Mining pool data updated"
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to refresh data",
        variant: "destructive"
      });
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <AuroraContainer className="w-full rounded-xl overflow-hidden">
      <div className="p-3 border-b border-white/10 flex justify-between items-center">
        <h2 className="box-title text-lg font-medium text-white">Latest Blocks</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-white/70">Live</span>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={scrollLeft}
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 text-white/70" />
            </button>
            <button 
              onClick={scrollRight}
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
            >
              <ArrowRight className="h-4 w-4 text-white/70" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        {error && (
          <div className="p-8 text-center">
            <p className="text-red-400">{error}</p>
            <button 
              onClick={handleManualRefresh}
              className="mt-4 px-4 py-2 bg-btc-orange/20 hover:bg-btc-orange/30 text-btc-orange rounded transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
        
        {isLoading && blocks.length === 0 && !error && (
          <div className="p-8 text-center">
            <div className="flex justify-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-btc-orange/70 animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-3 h-3 rounded-full bg-btc-orange/70 animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-3 h-3 rounded-full bg-btc-orange/70 animate-bounce"></div>
            </div>
            <p className="mt-4 text-white/70">Loading blockchain data...</p>
          </div>
        )}
        
        <div className={cn(
          "absolute inset-0 bg-btc-orange/10 flex items-center justify-center transition-all duration-500 z-10",
          isNewBlockAppearing ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
          <div className="bg-btc-dark glass-panel rounded-xl p-4 transform transition-all duration-500 animate-block-appear">
            <h3 className="text-base font-medium text-white mb-1">New Block Found!</h3>
            <p className="text-xs text-white/70">Block #{blocks.length > 0 ? blocks[0].height + 1 : "..."} has been mined.</p>
          </div>
        </div>

        {blocks.length > 0 && (
          <div 
            ref={scrollRef}
            className="flex md:flex-row miners-grid-mobile md:miners-grid-none md:overflow-x-auto hide-scrollbar py-4 px-4 space-x-0 md:space-x-4 bg-gradient-to-b from-[#0a0a0a] to-[#070707]"
            style={{ scrollbarWidth: 'none' }}
          >
            {blocks.map((block, index) => {
              const isLatestBlock = index === 0;
              const wasPreviousLatest = previousLatestBlock === block.hash;
              
              return (
                <div 
                  key={`${block.height}-${block.hash?.substring(0, 10) || index}`} 
                  className={cn(
                    "md:flex-shrink-0 md:w-28 relative group transition-all duration-300 mb-4 md:mb-0",
                    isLatestBlock ? "animate-block-appear" : ""
                  )}
                >
                  {isLatestBlock && (
                    <div className="absolute -inset-2 pointer-events-none opacity-70 z-10">
                      <SparklesText 
                        text="" 
                        colors={{ first: "#FFD700", second: "#FFF8E1" }}
                        className="absolute inset-0 w-full h-full"
                        sparklesCount={30}
                      />
                    </div>
                  )}
                  
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "w-14 h-14 md:w-18 md:h-18 rounded-full overflow-hidden flex items-center justify-center p-1",
                      isLatestBlock 
                        ? "bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700" 
                        : "bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900"
                    )}>
                      <div className="w-full h-full bg-black/80 rounded-full flex items-center justify-center p-1.5">
                        <img 
                          src={getPoolLogo(block.minedBy)} 
                          alt={block.minedBy}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            console.error(`Error loading logo for ${block.minedBy}`);
                            (e.target as HTMLImageElement).src = '/pool-logos/unknown.svg';
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className={cn(
                      "text-center mt-1 md:mt-2 px-1 md:px-2 py-0.5 md:py-1 rounded-md",
                      isLatestBlock ? "bg-yellow-900/30" : ""
                    )}>
                      <p className={cn(
                        "font-medium text-xs md:text-sm truncate w-full max-w-full md:max-w-[112px] title-gradient",
                        isLatestBlock ? "text-yellow-400" : ""
                      )}>
                        {/* FIX: Remove the conditional that changes "Mining Squared" to "Unknown" */}
                        {block.minedBy}
                      </p>
                      <p className={cn(
                        "text-[10px] md:text-xs mt-0.5 md:mt-1",
                        isLatestBlock ? "text-yellow-200" : "text-white/70"
                      )}>
                        #{block.height}
                      </p>
                      <p className="text-[8px] md:text-[10px] text-white/50 mt-0.5 md:mt-1">
  {safeFormatTimeAgo(block.timestamp)}
</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AuroraContainer>
  );
};

export default LatestMiningPool;

const safeFormatTimeAgo = (timestamp: number | Date): string => {
  if (timestamp instanceof Date) {
    return formatTimeAgo(timestamp);
  } else {
    return formatTimeAgo(new Date(timestamp));
  }
};