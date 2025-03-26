
import { useEffect, useState, useRef, useCallback } from 'react';
import { Block, formatTimeAgo } from '@/utils/mockData';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';
import { AuroraContainer } from '@/components/ui/aurora-container';
import { SparklesText } from '@/components/ui/sparkles-text';
import { fetchLatestBlockData } from '@/api/latestBlockApi';
import { useToast } from '@/hooks/use-toast';
import { fetchWithRetry, hasNewBlock } from '@/utils/errorUtils';

const BlockchainVisualization = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [pendingBlock, setPendingBlock] = useState<number>(50); // Animation progress 0-100
  const [isNewBlockAppearing, setIsNewBlockAppearing] = useState(false);
  const [previousLatestBlock, setPreviousLatestBlock] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shouldRefresh, setShouldRefresh] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Memoize the fetch data function to prevent recreating it on each render
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchWithRetry(() => fetchLatestBlockData());
      
      // Check if we have a new block
      if (blocks.length > 0 && hasNewBlock(blocks, [data.latestBlock, ...data.previousBlocks])) {
        // Store the hash of the current latest block before updating
        setPreviousLatestBlock(blocks[0].hash);
        setIsNewBlockAppearing(true);
        
        // Show toast notification for new block
        toast({
          title: "New Block Found!",
          description: `Block #${data.latestBlock.height} has been mined by ${data.latestBlock.minedBy}`,
        });
        
        // After a short delay, update the blocks
        setTimeout(() => {
          setBlocks([data.latestBlock, ...data.previousBlocks.slice(0, 9)]);
          setIsNewBlockAppearing(false);
        }, 500);
      } else if (blocks.length === 0) {
        // Initial load
        setBlocks([data.latestBlock, ...data.previousBlocks.slice(0, 9)]);
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch blockchain data');
      console.error('Error fetching blockchain data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [blocks, toast]); // Depend on blocks and toast for memoization
  
  // Setup periodic refresh
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      setShouldRefresh(prev => !prev);
    }, 30000); // 30 seconds
    
    return () => clearInterval(refreshInterval);
  }, []);
  
  // Fetch when refresh is triggered
  useEffect(() => {
    fetchData();
  }, [fetchData, shouldRefresh]);
  
  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  // Simulate pending block progress
  useEffect(() => {
    const interval = setInterval(() => {
      setPendingBlock(prev => {
        const newValue = prev + (Math.random() * 2);
        // Reset when we reach 100%
        if (newValue >= 100) {
          return 0;
        }
        return newValue;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Function to get pool logo
  const getPoolLogo = (poolName: string): string => {
    // Lowercase the pool name and remove spaces, special characters
    const normalizedName = poolName.toLowerCase()
      .replace(/\s+/g, '')
      .replace(/\./g, '')
      .replace(/-/g, '');
    
    // Check common mining pool names and return the correct SVG path
    if (poolName === 'Foundry USA') return '/pool-logos/foundryusa.svg';
    if (poolName === 'AntPool') return '/pool-logos/antpool.svg';
    if (poolName === 'F2Pool') return '/pool-logos/f2pool.svg';
    if (poolName === 'Binance Pool') return '/pool-logos/binancepool.svg';
    if (poolName === 'ViaBTC') return '/pool-logos/viabtc.svg';
    if (poolName === 'SlushPool') return '/pool-logos/braiinspool.svg';
    if (poolName === 'Poolin') return '/pool-logos/poolin.svg';
    if (poolName === 'BTC.com') return '/pool-logos/btccom.svg';
    if (poolName === 'SBI Crypto') return '/pool-logos/sbicrypto.svg';
    if (poolName === 'EMCD') return '/pool-logos/emcdpool.svg';
    if (poolName === 'Luxor') return '/pool-logos/luxor.svg';
    if (poolName === 'KanoPool') return '/pool-logos/kucoinpool.svg';
    if (poolName === 'PEGA Pool') return '/pool-logos/pegapool.svg';
    if (poolName === 'WhitePool') return '/pool-logos/ultimuspool.svg';
    if (poolName === 'Minerium') return '/pool-logos/minerium.svg';
    if (poolName === 'Titan') return '/pool-logos/titan.svg';
    if (poolName === 'Bitfury') return '/pool-logos/bitfury.svg';
    
    // Return a default logo if no match is found
    return '/pool-logos/default.svg';
  };

  // Manual refresh handler
  const handleManualRefresh = async () => {
    try {
      setIsLoading(true);
      const data = await fetchWithRetry(() => fetchLatestBlockData());
      
      // Check if we have a new block
      if (blocks.length > 0 && hasNewBlock(blocks, [data.latestBlock, ...data.previousBlocks])) {
        setPreviousLatestBlock(blocks[0].hash);
        setIsNewBlockAppearing(true);
        
        toast({
          title: "New Block Found!",
          description: `Block #${data.latestBlock.height} has been mined by ${data.latestBlock.minedBy}`,
        });
        
        setTimeout(() => {
          setBlocks([data.latestBlock, ...data.previousBlocks.slice(0, 9)]);
          setIsNewBlockAppearing(false);
        }, 500);
      } else {
        setBlocks([data.latestBlock, ...data.previousBlocks.slice(0, 9)]);
        
        toast({
          title: "Data Refreshed",
          description: "No new blocks found",
        });
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch blockchain data');
      console.error('Error fetching blockchain data:', err);
      
      toast({
        title: "Error",
        description: "Failed to fetch blockchain data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll handlers
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
    <AuroraContainer className="w-full group hover:border-white/20 transition-colors rounded-xl overflow-hidden">
      <div className="p-3 border-b border-white/10 flex justify-between items-center">
        <h2 className="text-lg font-medium text-white">Latest Blocks</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-white/70">Live</span>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleManualRefresh}
              className={cn(
                "p-1.5 rounded-full hover:bg-white/10 transition-colors",
                isLoading && "animate-spin"
              )}
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4 text-white/70" />
            </button>
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
        {/* Error state */}
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
        
        {/* Loading state */}
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
        
        {/* New block appearing animation */}
        <div className={cn(
          "absolute inset-0 bg-btc-orange/10 flex items-center justify-center transition-all duration-500 z-10",
          isNewBlockAppearing ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
          <div className="bg-btc-dark glass-panel rounded-xl p-4 transform transition-all duration-500 animate-block-appear">
            <h3 className="text-base font-medium text-white mb-1">New Block Found!</h3>
            <p className="text-xs text-white/70">Block #{blocks.length > 0 ? blocks[0].height + 1 : "..."} has been mined.</p>
          </div>
        </div>
        
        {/* Horizontal blocks scrolling area */}
        {blocks.length > 0 && (
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto hide-scrollbar py-4 pl-4 pr-4 space-x-4 border-b border-white/5 bg-gradient-to-b from-[#0a0a0a] to-[#070707] rounded-b-xl"
            style={{ scrollbarWidth: 'none' }}
          >
            {blocks.map((block, index) => {
              // Determine if this is the most recent block
              const isLatestBlock = index === 0;
              // Check if this was the previous latest block that just got pushed
              const wasPreviousLatest = previousLatestBlock === block.hash;
              
              return (
                <div 
                  key={`${block.height}-${block.hash.substring(0, 10)}`} 
                  className={cn(
                    "flex-shrink-0 w-32 relative group transition-all duration-300 hover:transform hover:scale-[1.03]",
                    index === 0 ? "animate-block-appear" : ""
                  )}
                >
                  {/* Add outer sparkles for the latest block */}
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
                  
                  {/* 3D Box Effect - Top */}
                  <div className={cn(
                    "h-4 w-full bg-[#141420] skew-x-[-25deg] origin-top-right absolute -top-3 left-2",
                    isLatestBlock && "bg-[#2A2000]"
                  )}></div>
                  
                  {/* 3D Box Effect - Side */}
                  <div className={cn(
                    "h-full w-4 bg-[#070710] skew-y-[30deg] origin-bottom-left absolute -left-4 top-0",
                    isLatestBlock && "bg-[#1A1500]"
                  )}></div>
                  
                  {/* Block header with height - cyan color for all except latest */}
                  <div className={cn(
                    "h-6 flex items-center justify-center text-sm font-bold",
                    isLatestBlock ? "bg-black text-yellow-300" : "bg-black text-[#7EB5FF]"
                  )}>
                     {block.height}
                  </div>
                  
                  {/* Block content with gradient */}
                  <div 
                    className={cn(
                      "p-3 flex flex-col h-24 relative overflow-hidden text-center",
                      isLatestBlock 
                        ? "bg-gradient-to-b from-yellow-500/90 via-yellow-600/80 to-amber-700/80" 
                        : wasPreviousLatest
                          ? "bg-gradient-to-b from-purple-500/90 via-indigo-600/80 to-blue-700/80 transition-colors duration-1000"
                          : "bg-gradient-to-b from-purple-600/90 via-indigo-700/80 to-blue-700/80"
                    )}
                  >
                    {/* Sparkles effect only for the latest block */}
                    {isLatestBlock && (
                      <div className="absolute inset-0 pointer-events-none opacity-80">
                        <SparklesText 
                          text="" 
                          colors={{ first: "#FFD700", second: "#FFF8E1" }}
                          className="absolute inset-0 w-full h-full"
                          sparklesCount={25}
                        />
                      </div>
                    )}
                    
                    {/* Content layout with centered text */}
                    <div className="text-white text-xs font-medium mb-1">{block.feesRangeText}</div>
                    <div className="text-yellow-300 text-[10px] font-medium mb-1">{block.feeRange}</div>
                    
                    <div className="text-white font-bold text-sm mb-1">{block.totalBtc} BTC</div>
                    
                    <div className="text-white/90 text-[10px] mb-1">{block.transactionCount.toLocaleString()} txs</div>
                    <div className="mt-auto text-white/80 text-[10px]">{formatTimeAgo(block.timestamp)}</div>
                  </div>
                  
                  {/* Pool info with black background */}
                  <div className="bg-black py-1 px-2 flex items-center justify-center space-x-1 border-t border-black/50">
                    <div className="w-3 h-3 rounded-full overflow-hidden flex items-center justify-center">
                      <img 
                        src={getPoolLogo(block.minedBy)} 
                        alt={block.minedBy}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/pool-logos/default.svg';
                        }}
                      />
                    </div>
                    <span className="text-white text-[10px] font-medium truncate">{block.minedBy}</span>
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

export default BlockchainVisualization;
