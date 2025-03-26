
import { useState, useEffect } from 'react';
import { fetchMiningPoolStats } from '@/api/miningPoolStatsApi';
import { MiningPoolStats as PoolStats } from '@/services/mempoolService';
import { AuroraContainer } from '@/components/ui/aurora-container';
import { Pickaxe, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

const MiningPoolStats = () => {
  const [poolStats, setPoolStats] = useState<PoolStats[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const stats = await fetchMiningPoolStats();
      setPoolStats(stats);
      setError(null);
    } catch (err) {
      console.error('Error fetching pool stats:', err);
      setError('Failed to load mining pool statistics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Refresh every 10 minutes
    const intervalId = setInterval(fetchData, 600000);
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
    if (poolName === 'SlushPool') return '/pool-logos/braiinspool.svg';
    if (poolName === 'Poolin') return '/pool-logos/poolin.svg';
    if (poolName === 'BTC.com') return '/pool-logos/btccom.svg';
    
    return '/pool-logos/default.svg';
  };

  return (
    <AuroraContainer className="w-full rounded-xl overflow-hidden">
      <div className="p-3 border-b border-white/10 flex justify-between items-center">
        <div className="flex items-center">
          <Pickaxe className="h-5 w-5 text-btc-orange mr-2" />
          <h2 className="text-lg font-medium text-white">Mining Pool Distribution (24h)</h2>
        </div>
        <button 
          onClick={fetchData}
          className={cn("p-1.5 rounded-full hover:bg-white/10 transition-colors", isLoading && "animate-spin")}
        >
          <RefreshCw className="h-4 w-4 text-white/70" />
        </button>
      </div>
      
      <div className="p-4 bg-gradient-to-b from-[#0a0a0a] to-[#070707]">
        {isLoading && poolStats.length === 0 ? (
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
            {poolStats.map((pool) => (
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
                    <span className="text-sm text-white/80">{pool.blocksCount} blocks ({pool.percentage.toFixed(1)}%)</span>
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
            
            {poolStats.length === 0 && !isLoading && !error && (
              <p className="text-center text-white/60 py-8">No mining pool data available for the last 24 hours</p>
            )}
          </div>
        )}
      </div>
    </AuroraContainer>
  );
};

export default MiningPoolStats;
