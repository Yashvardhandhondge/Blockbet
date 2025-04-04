import { useState, useEffect } from 'react';
import { fetchMiningPoolStats, fetchLiveMiningPoolStats } from '@/api/miningPoolStatsApi';
import { MiningPoolStats as PoolStats } from '@/services/mempoolService';
import { MiningPoolLiveStats } from '@/utils/types';
import { AuroraContainer } from '@/components/ui/aurora-container';
import { Pickaxe, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fetchWithRetry } from '@/utils/errorUtils';
import { toast } from './ui/use-toast';

const MiningPoolStats = () => {
  const [poolStats, setPoolStats] = useState<PoolStats[]>([]);
  const [livePoolStats, setLivePoolStats] = useState<MiningPoolLiveStats[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch enhanced live stats that combine hashrate and block data
      const liveStats = await fetchWithRetry(() => fetchLiveMiningPoolStats(), 3, 2000);
      setLivePoolStats(liveStats);
      
      // Fetch standard pool stats for backward compatibility
      const stats = await fetchWithRetry(() => fetchMiningPoolStats(), 3, 2000);
      setPoolStats(stats);
      
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching pool stats:', err);
      setError('Failed to load mining pool statistics');
      toast({
        title: "Data fetch error",
        description: "Could not update mining pool statistics",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Refresh every 1 minute (60000ms) for more real-time data
    const intervalId = setInterval(fetchData, 60000);
    return () => clearInterval(intervalId);
  }, []);

  // Helper function to get mining pool logo
  const getPoolLogo = (poolName: string): string => {
    const normalizedName = poolName.toLowerCase()
      .replace(/\s+/g, '')
      .replace(/\./g, '')
      .replace(/-/g, '');
    
    if (poolName === 'Foundry USA') return '/pool-logos/foundryusa.svg';
    if (poolName === 'AntPool') return '/pool-logos/antpool.svg';
    if (poolName === 'F2Pool') return '/pool-logos/f2pool.svg';
    if (poolName === 'Binance Pool') return '/pool-logos/binancepool.svg';
    if (poolName === 'ViaBTC') return '/pool-logos/viabtc.svg';
    if (poolName === 'SlushPool' || poolName === 'Braiins Pool') return '/pool-logos/braiinspool.svg';
    if (poolName === 'Poolin') return '/pool-logos/poolin.svg';
    if (poolName === 'BTC.com') return '/pool-logos/btccom.svg';
    if (poolName === 'SBI Crypto') return '/pool-logos/sbicrypto.svg';
    if (poolName === 'EMCD') return '/pool-logos/emcdpool.svg';
    if (poolName === 'Luxor') return '/pool-logos/luxor.svg';
    if (poolName === 'KuCoin Pool' || poolName === 'KanoPool') return '/pool-logos/kucoinpool.svg';
    if (poolName === 'PEGA Pool') return '/pool-logos/pegapool.svg';
    if (poolName === 'Ultimuspool' || poolName === 'WhitePool') return '/pool-logos/ultimuspool.svg';
    if (poolName === 'Minerium') return '/pool-logos/minerium.svg';
    if (poolName === 'Titan Pool' || poolName === 'Titan') return '/pool-logos/titan.svg';
    if (poolName === 'Bitfury') return '/pool-logos/bitfury.svg';
    if (poolName === 'SECPOOL') return '/pool-logos/secpool.svg';
    
    return '/pool-logos/default.svg';
  };

  // Format relative time for last updated
  const getLastUpdatedText = () => {
    if (!lastUpdated) return '';
    
    const now = new Date();
    const diffMs = now.getTime() - lastUpdated.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins === 1) return '1 minute ago';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hour ago';
    return `${diffHours} hours ago`;
  };

  // Decide which stats to display, preferring live stats but falling back to poolStats
  const displayStats = livePoolStats.length > 0 
    ? livePoolStats.map(stat => ({
        poolName: stat.poolName,
        blocksCount: stat.blocksLast24h,
        percentage: stat.hashRatePercent,
        poolId: stat.poolId,
        odds: stat.odds
      }))
    : poolStats;

  // Ensure the multiplier is properly typed before calling toFixed
  const getMultiplierDisplay = (multiplier: number | unknown): string => {
    if (typeof multiplier === 'number') {
      return multiplier.toFixed(2);
    }
    return '0.00';
  };

  return (
    <AuroraContainer className="w-full rounded-xl overflow-hidden">
      <div className="p-3 border-b border-white/10 flex justify-between items-center">
        <div className="flex items-center">
          <Pickaxe className="h-5 w-5 text-btc-orange mr-2" />
          <h2 className="text-lg font-medium text-white">Mining Pool Distribution (24h)</h2>
        </div>
        <div className="flex items-center">
          {lastUpdated && (
            <span className="text-xs text-white/50 mr-2">
              Updated {getLastUpdatedText()}
            </span>
          )}
          <button 
            onClick={fetchData}
            className={cn("p-1.5 rounded-full hover:bg-white/10 transition-colors", 
              isLoading && "animate-spin")}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4 text-white/70" />
          </button>
        </div>
      </div>
      
      <div className="p-4 bg-gradient-to-b from-[#0a0a0a] to-[#070707]">
        {isLoading && displayStats.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-btc-orange/70 animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-3 h-3 rounded-full bg-btc-orange/70 animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-3 h-3 rounded-full bg-btc-orange/70 animate-bounce"></div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-400 mb-2">{error}</p>
            <button 
              onClick={fetchData}
              className="px-4 py-2 bg-btc-orange/20 hover:bg-btc-orange/30 text-btc-orange rounded transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {displayStats.map((pool) => (
              <div key={pool.poolName} className="flex items-center">
                <div className="w-6 h-6 rounded-full overflow-hidden bg-black flex items-center justify-center mr-3">
                  <img
                    src={getPoolLogo(pool.poolName)}
                    alt={pool.poolName}
                    className="w-5 h-5 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/pool-logos/default.svg';
                    }}
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-white">{pool.poolName}</span>
                    <div className="flex items-center">
                      <span className="text-sm text-white/80">
                        {pool.blocksCount} blocks ({pool.percentage.toFixed(1)}%)
                      </span>
                      {'odds' in pool && (
                        <span className="ml-2 text-xs bg-btc-orange/10 text-btc-orange px-1.5 py-0.5 rounded-full">
                          {getMultiplierDisplay(pool.odds)}×
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-500 to-yellow-400"
                      style={{ width: `${pool.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
            
            {displayStats.length === 0 && !isLoading && !error && (
              <p className="text-center text-white/60 py-8">No mining pool data available for the last 24 hours</p>
            )}
          </div>
        )}
      </div>
    </AuroraContainer>
  );
};

export default MiningPoolStats;
