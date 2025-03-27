
import React, { useState, useEffect } from 'react';
import { Clock, Zap, Server, Pickaxe } from 'lucide-react';
import StatCard from './StatCard';
import { fetchLatestBlockData } from '@/api/latestBlockApi';
import { fetchPendingTransactionsData } from '@/api/pendingTransactionsApi';
import { fetchWithRetry } from '@/utils/errorUtils';
import { toast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';
import { ToastContent } from './ui/toast-content';
import { useIsMobile } from '@/hooks/use-mobile';

const LiveBlockData = () => {
  const [currentBlock, setCurrentBlock] = useState<number>(0);
  const [avgBlockTime, setAvgBlockTime] = useState<number>(10);
  const [pendingTxCount, setPendingTxCount] = useState<number>(0);
  const [estimatedTime, setEstimatedTime] = useState<string>('Calculating...');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [minedBy, setMinedBy] = useState<string>('Unknown');
  const [poolLogo, setPoolLogo] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch block data with retry logic
        const blockData = await fetchWithRetry(() => fetchLatestBlockData());
        setCurrentBlock(blockData.latestBlock.height);
        setAvgBlockTime(blockData.avgBlockTime);
        setEstimatedTime(blockData.estimatedNextBlock);
        setMinedBy(blockData.latestBlock.minedBy || 'Unknown');

        // Set poolLogo based on pool name
        const normalizedPoolName = blockData.latestBlock.minedBy?.toLowerCase().replace(/\s+/g, '') || '';
        try {
          // Try to find a matching logo
          setPoolLogo(`/pool-logos/${normalizedPoolName}.svg`);
        } catch {
          setPoolLogo('/pool-logos/unknown.svg');
        }

        // Fetch pending transaction data with retry logic
        const txData = await fetchWithRetry(() => fetchPendingTransactionsData());
        setPendingTxCount(txData.count);
        setError(null);
      } catch (err) {
        console.error('Error fetching live data:', err);
        setError('Failed to load data');
        toast({
          description: "",
          action: (
            <ToastContent
              title="Data fetch error"
              description="Could not update blockchain data"
              variant="destructive"
            />
          )
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
          description: "",
          action: (
            <ToastContent
              title="Data fetch error"
              description="Could not update blockchain data"
              variant="destructive"
            />
          )
        });
      });
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  if (isLoading) {
    return <div className="flex flex-1 gap-4 overflow-x-auto hide-scrollbar">
        {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-8 bg-white/5 animate-pulse rounded flex-1 min-w-20"></div>)}
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
    <div className={`flex flex-1 ${isMobile ? 'flex-wrap' : ''} gap-3 overflow-x-auto hide-scrollbar`}>
      <div className="flex items-center gap-1.5 bg-[#0f0f0f] border-white/5 rounded-lg px-2 py-1 min-w-24">
        <Server className="h-3 w-3 text-btc-orange flex-shrink-0" />
        <span className="text-xs text-white/70 mr-1 whitespace-nowrap">Block:</span>
        <span className="text-xs font-mono font-bold text-white">{currentBlock.toString()}</span>
      </div>
      
      <div className="flex items-center gap-1.5 bg-[#0f0f0f] border-white/5 rounded-lg px-2 py-1 min-w-24">
        <Clock className="h-3 w-3 text-btc-orange flex-shrink-0" />
        <span className="text-xs text-white/70 mr-1 whitespace-nowrap">Avg:</span>
        <span className="text-xs font-mono font-bold text-white">{avgBlockTime.toFixed(1)}m</span>
      </div>
      
      <div className="flex items-center gap-1.5 bg-[#0f0f0f] border-white/5 rounded-lg px-2 py-1 min-w-24">
        <Zap className="h-3 w-3 text-btc-orange flex-shrink-0" />
        <span className="text-xs text-white/70 mr-1 whitespace-nowrap">Pending:</span>
        <span className="text-xs font-mono font-bold text-white">{pendingTxCount.toLocaleString()}</span>
      </div>
      
      <div className="flex items-center gap-1.5 bg-[#0f0f0f] border-white/5 rounded-lg px-2 py-1 min-w-24">
        <Clock className="h-3 w-3 text-btc-orange flex-shrink-0" />
        <span className="text-xs text-white/70 mr-1 whitespace-nowrap">Next:</span>
        <span className="text-xs font-mono font-bold text-white">{estimatedTime}</span>
      </div>
      
      <div className="flex items-center gap-1.5 bg-[#0f0f0f] border-white/5 rounded-lg px-2 py-1 min-w-24">
        <Pickaxe className="h-3 w-3 text-btc-orange flex-shrink-0" />
        <span className="text-xs text-white/70 mr-1 whitespace-nowrap">Latest block mined by:</span>
        <div className="flex items-center">
          {poolLogo && <img src={poolLogo} alt={minedBy} className="h-3 w-3 mr-1" onError={e => {
          (e.target as HTMLImageElement).src = '/pool-logos/unknown.svg';
        }} />}
          <span className="text-xs font-mono font-bold text-white truncate max-w-16">{minedBy}</span>
        </div>
      </div>
    </div>
  );
};

export default LiveBlockData;
