
import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { fetchLiveMiningPoolStats } from '@/api/miningPoolStatsApi';
import { MiningPoolLiveStats } from '@/utils/types';
import { fetchWithRetry } from '@/utils/errorUtils';
import { toast } from '@/components/ui/use-toast';

interface MiningPoolStatsContextType {
  liveStats: MiningPoolLiveStats[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refreshStats: () => Promise<void>;
}

const MiningPoolStatsContext = createContext<MiningPoolStatsContextType>({
  liveStats: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
  refreshStats: async () => {}
});

export const MiningPoolStatsProvider = ({ children }: { children: React.ReactNode }) => {
  const [liveStats, setLiveStats] = useState<MiningPoolLiveStats[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      const stats = await fetchWithRetry(() => fetchLiveMiningPoolStats(), 3, 2000);
      setLiveStats(stats);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching live mining pool stats:', err);
      setError('Failed to load mining pool statistics');
      toast({
        title: "Data fetch error",
        description: "Could not update mining pool statistics",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    
    // Update every minute
    const intervalId = setInterval(() => {
      fetchStats();
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [fetchStats]);

  const value = {
    liveStats,
    isLoading,
    error,
    lastUpdated,
    refreshStats: fetchStats
  };

  return (
    <MiningPoolStatsContext.Provider value={value}>
      {children}
    </MiningPoolStatsContext.Provider>
  );
};

export const useMiningPoolStats = () => {
  const context = useContext(MiningPoolStatsContext);
  if (context === undefined) {
    throw new Error('useMiningPoolStats must be used within a MiningPoolStatsProvider');
  }
  return context;
};

export default useMiningPoolStats;
