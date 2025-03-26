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
  
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchWithRetry(() => fetchLatestBlockData());
      
      console.log('Fetched block data:', data);
      
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
      } else if (blocks.length === 0) {
        setBlocks([data.latestBlock, ...data.previousBlocks.slice(0, 9)]);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching blockchain data:', err);
      setError('Failed to fetch blockchain data');
    } finally {
      setIsLoading(false);
    }
  }, [blocks, toast]);
  
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      setShouldRefresh(prev => !prev);
    }, 30000);
    
    return () => clearInterval(refreshInterval);
  }, []);
  
  useEffect(() => {
    fetchData();
  }, [fetchData, shouldRefresh]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPendingBlock(prev => {
        const newValue = prev + (Math.random() * 2);
        if (newValue >= 100) {
          return 0;
        }
        return newValue;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getPoolLogo = (poolName: string): string => {
    const normalizedName = poolName.toLowerCase().trim();
    const poolLogoMap: { [key: string]: string } = {
      'foundry usa': '/pool-logos/foundryusa.svg',
      'foundry': '/pool-logos/foundryusa.svg',
      'antpool': '/pool-logos/antpool.svg',
      'f2pool': '/pool-logos/f2pool.svg',
      'binance pool': '/pool-logos/binancepool.svg',
      'binance': '/pool-logos/binancepool.svg',
      'viabtc': '/pool-logos/viabtc.svg',
      'slushpool': '/pool-logos/slushpool.svg',
      'braiins pool': '/pool-logos/braiinspool.svg',
      'braiins': '/pool-logos/braiinspool.svg',
      'poolin': '/pool-logos/poolin.svg',
      'btc.com': '/pool-logos/btccom.svg',
      'btccom': '/pool-logos/btccom.svg',
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
      'whitepool': '/Whitepool Bitcoin Explorer.svg',
      'spiderpool': '/Spiderpool Bitcoin Explorer.svg',
      'luxor mining': '/Luxor Bitcoin Explorer.svg',
      'mempool': '/Mempool Bitcoin Explorer.svg',
      'mempool.space': '/Mempool Bitcoin Explorer.svg',
      'mempool.com': '/Mempool Bitcoin Explorer.svg',
      'antpool#0': '/Antpool Bitcoin Explorer.svg',
      'f2pool#0': '/Bitcoin Explorer f2pool.svg',
      'binance#0': '/Binance Pool.svg',
      'unknown': '/pool-logos/default.svg',
    };
    
    for (const [key, value] of Object.entries(poolLogoMap)) {
      if (normalizedName.includes(key)) {
        return value;
      }
    }
    
    return '/pool-logos/default.svg';
  };

  const handleManualRefresh = async () => {
    try {
      setIsLoading(true);
      const data = await fetchWithRetry(() => fetchLatestBlockData());
      
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
  
  const formatTransactionCount = (count: number): string => {
    return count ? count.toLocaleString() : '0';
  };

  const formatBTC = (amount: number | undefined): string => {
    if (!amount) return '0.000 BTC';
    return `${amount.toFixed(3)} BTC`;
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
            className="flex overflow-x-auto hide-scrollbar py-4 px-4 space-x-4 bg-black"
            style={{ scrollbarWidth: 'none' }}
          >
            {blocks.map((block, index) => (
              <div 
                key={`${block.height}-${block.hash?.substring(0, 10) || index}`} 
                className="flex-shrink-0 flex flex-col min-w-[140px] max-w-[140px]"
              >
                <div className="text-center py-2">
                  <span className="text-lg font-bold text-cyan-400">
                    {block.height.toLocaleString()}
                  </span>
                </div>
                
                <div className="bg-gradient-to-b from-purple-800 via-indigo-700 to-blue-700 p-2 rounded-t-md flex flex-col h-[160px]">
                  <div className="text-center mb-1">
                    <span className="text-sm font-medium text-white">{block.feesRangeText}</span>
                  </div>
                  
                  <div className="text-center mb-2">
                    <span className="text-xs text-yellow-300 font-medium">{block.feeRange}</span>
                  </div>
                  
                  <div className="text-center mb-2">
                    <span className="text-lg font-bold text-white">{formatBTC(block.totalBtc)}</span>
                  </div>
                  
                  <div className="text-center mb-2">
                    <span className="text-xs font-medium text-white">
                      {formatTransactionCount(block.transactionCount)} txs
                    </span>
                  </div>
                  
                  <div className="text-center mt-auto">
                    <span className="text-xs font-medium text-white">
                      {block.minutesAgo ? `${block.minutesAgo} minutes ago` : formatTimeAgo(block.timestamp)}
                    </span>
                  </div>
                </div>
                
                <div className="bg-black py-2 px-1 rounded-b-md flex items-center justify-center space-x-1">
                  <div className="w-4 h-4 rounded-full overflow-hidden bg-black flex items-center justify-center">
                    <img 
                      src={getPoolLogo(block.minedBy)} 
                      alt={block.minedBy}
                      className="w-3 h-3 object-contain"
                      onError={(e) => {
                        console.error(`Error loading logo for ${block.minedBy}`);
                        (e.target as HTMLImageElement).src = '/pool-logos/default.svg';
                      }}
                    />
                  </div>
                  <span className="text-xs text-white font-medium truncate">{block.minedBy}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AuroraContainer>
  );
};

export default BlockchainVisualization;
