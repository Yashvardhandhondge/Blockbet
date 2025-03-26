
import React, { useState, useEffect } from 'react';
import { Clock, Zap, Server, Pickaxe } from 'lucide-react';
import { Card } from './ui/card';
import StatCard from './StatCard';
import { fetchLatestBlockData } from '@/api/latestBlockApi';
import { fetchPendingTransactionsData } from '@/api/pendingTransactionsApi';
import { fetchWithRetry } from '@/utils/errorUtils';
import { toast } from './ui/use-toast';

const LiveBlockData = () => {
  const [currentBlock, setCurrentBlock] = useState<number>(0);
  const [avgBlockTime, setAvgBlockTime] = useState<number>(10);
  const [pendingTxCount, setPendingTxCount] = useState<number>(0);
  const [estimatedTime, setEstimatedTime] = useState<string>('Calculating...');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch block data with retry logic
        const blockData = await fetchWithRetry(() => fetchLatestBlockData());
        setCurrentBlock(blockData.latestBlock.height);
        setAvgBlockTime(blockData.avgBlockTime);
        setEstimatedTime(blockData.estimatedNextBlock);
        
        // Fetch pending transaction data with retry logic
        const txData = await fetchWithRetry(() => fetchPendingTransactionsData());
        setPendingTxCount(txData.count);
        
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
    const intervalId = setInterval(fetchData, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-[#0f0f0f] border-white/5 rounded-xl p-3 animate-pulse">
            <div className="flex">
              <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-white/10"></div>
              <div className="ml-3 space-y-2">
                <div className="h-3 w-20 bg-white/10 rounded"></div>
                <div className="h-5 w-24 bg-white/10 rounded"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#0f0f0f] border-white/5 rounded-xl p-4 text-center">
        <p className="text-red-400 mb-2">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-btc-orange/20 hover:bg-btc-orange/30 text-btc-orange rounded transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-[#0f0f0f] border-white/5 rounded-xl p-3 hover:border-white/10 transition-all duration-200">
        <StatCard
          icon={<Server className="h-5 w-5 text-btc-orange" />}
          title="Current Block"
          value={currentBlock.toLocaleString()}
        />
      </Card>
      
      <Card className="bg-[#0f0f0f] border-white/5 rounded-xl p-3 hover:border-white/10 transition-all duration-200">
        <StatCard
          icon={<Clock className="h-5 w-5 text-btc-orange" />}
          title="Avg. Block Time"
          value={`${avgBlockTime.toFixed(1)} min`}
        />
      </Card>
      
      <Card className="bg-[#0f0f0f] border-white/5 rounded-xl p-3 hover:border-white/10 transition-all duration-200">
        <StatCard
          icon={<Zap className="h-5 w-5 text-btc-orange" />}
          title="Pending TX"
          value={pendingTxCount.toLocaleString()}
        />
      </Card>
      
      <Card className="bg-[#0f0f0f] border-white/5 rounded-xl p-3 hover:border-white/10 transition-all duration-200">
        <StatCard
          icon={<Clock className="h-5 w-5 text-btc-orange" />}
          title="Next block est."
          value={estimatedTime}
        />
      </Card>
    </div>
  );
};

export default LiveBlockData;
