
import { useEffect, useState } from 'react';
import { fetchLatestBlockData } from '@/api/latestBlockApi';
import { fetchWithRetry } from '@/utils/errorUtils';
import { useToast } from '@/hooks/use-toast';
import { GlowEffect } from '@/components/ui/glow-effect';
import { cn } from '@/lib/utils';

interface LatestMiningPoolProps {
  className?: string;
}

const LatestMiningPool = ({ className }: LatestMiningPoolProps) => {
  const [latestPool, setLatestPool] = useState<{
    name: string;
    logoUrl: string;
    height: number;
  } | null>(null);
  const [previousHeight, setPreviousHeight] = useState<number | null>(null);
  const [isNewBlock, setIsNewBlock] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Function to get the logo URL for a mining pool
  const getPoolLogo = (poolName: string): string => {
    // Convert pool name to lowercase for case-insensitive matching
    const normalizedName = poolName.toLowerCase().trim();
    
    // Map of known pool names to their logo paths
    const poolLogoMap: { [key: string]: string } = {
      'foundry usa': '/pool-logos/foundryusa.svg',
      'antpool': '/pool-logos/antpool.svg',
      'f2pool': '/pool-logos/f2pool.svg',
      'binance pool': '/pool-logos/binancepool.svg',
      'viabtc': '/pool-logos/viabtc.svg',
      'slushpool': '/pool-logos/slushpool.svg',
      'braiins pool': '/pool-logos/braiinspool.svg',
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
    };
    
    // Check if we have a logo for this pool
    for (const [key, value] of Object.entries(poolLogoMap)) {
      if (normalizedName.includes(key)) {
        return value;
      }
    }
    
    // Return default logo if no match found
    return '/pool-logos/default.svg';
  };

  // Fetch the latest block data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchWithRetry(() => fetchLatestBlockData());
        
        // Check if we have a new block
        if (latestPool && data.latestBlock.height > latestPool.height) {
          setPreviousHeight(latestPool.height);
          setIsNewBlock(true);
          
          // Show notification
          toast({
            title: "New Block Mined!",
            description: `Block #${data.latestBlock.height} mined by ${data.latestBlock.minedBy}`,
          });
          
          // Reset the animation after 5 seconds
          setTimeout(() => {
            setIsNewBlock(false);
          }, 5000);
        }
        
        // Update latest pool data
        setLatestPool({
          name: data.latestBlock.minedBy,
          logoUrl: getPoolLogo(data.latestBlock.minedBy),
          height: data.latestBlock.height
        });
        
        setError(null);
      } catch (err) {
        console.error('Error fetching latest block data:', err);
        setError('Failed to fetch latest block data');
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchData();

    // Set up polling interval (every 30 seconds)
    const intervalId = setInterval(fetchData, 30000);
    
    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, [latestPool, toast]);

  if (isLoading && !latestPool) {
    return (
      <div className={cn("p-8 text-center bg-btc-dark rounded-xl border border-white/5", className)}>
        <div className="animate-pulse flex flex-col items-center justify-center h-40">
          <div className="w-20 h-20 bg-white/10 rounded-full mb-4"></div>
          <div className="h-5 bg-white/10 rounded w-32 mb-2"></div>
          <div className="h-4 bg-white/10 rounded w-24"></div>
        </div>
      </div>
    );
  }

  if (error && !latestPool) {
    return (
      <div className={cn("p-4 text-center bg-red-900/20 border border-red-500/20 rounded-xl", className)}>
        <p className="text-red-400">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={cn(
      "relative bg-btc-dark rounded-xl border border-white/5 overflow-hidden",
      "transition-all duration-300 group",
      className
    )}>
      {/* Header */}
      <div className="p-3 border-b border-white/10">
        <h2 className="text-lg font-medium text-white">Latest Block Mined By</h2>
      </div>
      
      {/* Glow effect for new blocks */}
      {isNewBlock && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <GlowEffect 
            colors={['#FFD700', '#F7931A', '#FFBF00', '#FFA500']}
            mode="pulse"
            blur="stronger"
            scale={1.2}
            duration={1.5}
            className="opacity-60"
          />
        </div>
      )}
      
      {/* Content */}
      <div className="p-6 flex flex-col items-center justify-center relative z-10">
        {latestPool && (
          <>
            <div className={cn(
              "w-28 h-28 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center p-2 mb-4",
              "border border-white/10 transition-all duration-300",
              isNewBlock ? "border-btc-orange scale-110" : "group-hover:border-white/20"
            )}>
              <img 
                src={latestPool.logoUrl} 
                alt={latestPool.name}
                className={cn(
                  "w-20 h-20 object-contain transition-transform duration-300",
                  isNewBlock ? "animate-pulse-subtle" : "group-hover:scale-110"
                )}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/pool-logos/default.svg';
                }}
              />
            </div>
            
            <h3 className={cn(
              "text-xl font-bold mb-1 transition-colors duration-300",
              isNewBlock ? "text-btc-orange" : "text-white group-hover:text-btc-orange"
            )}>
              {latestPool.name}
            </h3>
            
            <p className="text-white/60 text-sm">
              Block #{latestPool.height.toLocaleString()}
            </p>
            
            {isNewBlock && previousHeight && (
              <div className="mt-2 px-3 py-1 bg-btc-orange/10 border border-btc-orange/20 rounded-full">
                <span className="text-xs text-btc-orange">
                  New block mined!
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LatestMiningPool;
