import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useAccount, useBalance } from 'wagmi';
import { formatSats } from '@/utils/formatters';
import { miningPools, getRandomMiningPool, updateMiningPoolsData } from '@/utils/miningPools';
import { MiningPool } from '@/utils/types';
import MiningPoolCard from './MiningPoolCard';
import BetHistory from './BetHistory';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useConfettiStore } from '@/store/confettiStore';

const BET_AMOUNTS = [100, 500, 1000, 5000, 10000, 50000, 100000];
const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || 'https://block-bet-api.fly.dev';
const BETTING_CLOSES_IN_SECONDS = 30;

const BettingGrid = () => {
  const { address } = useAccount();
  const { data: balanceData } = useBalance({ address });
  const [selectedPool, setSelectedPool] = useState<MiningPool | null>(null);
  const [activePools, setActivePools] = useState<MiningPool[]>(miningPools);
  const [betAmount, setBetAmount] = useState<number>(BET_AMOUNTS[0]);
  const [bets, setBets] = useLocalStorage<{
    id: number;
    poolId: string;
    poolName: string;
    amount: number;
    timestamp: Date;
    isWin: boolean;
    blockHeight: number;
  }[]>('block-bets', []);
  const [isLoading, setIsLoading] = useState(false);
  const [bettingClosesIn, setBettingClosesIn] = useState(BETTING_CLOSES_IN_SECONDS);
  const isMobile = useIsMobile();
  const { enableConfetti } = useConfettiStore();
  
  // Fetch mining pool stats on component mount
  useEffect(() => {
    const fetchPoolStats = async () => {
      try {
        const response = await fetch(`${API_ENDPOINT}/api/pools`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const poolStats = await response.json();
        const updatedPools = updateMiningPoolsData(poolStats);
        setActivePools(updatedPools);
      } catch (error: any) {
        console.error("Failed to fetch mining pool stats:", error);
        toast.error(`Failed to fetch mining pool stats: ${error.message}`);
      }
    };
    
    fetchPoolStats();
    
    // Refresh every 15 seconds
    const intervalId = setInterval(fetchPoolStats, 15000);
    return () => clearInterval(intervalId);
  }, []);
  
  // Betting countdown timer
  useEffect(() => {
    if (bettingClosesIn > 0) {
      const timer = setTimeout(() => {
        setBettingClosesIn(bettingClosesIn - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Auto-select a new pool when betting closes
      handleSelectPool(getRandomMiningPool());
      setBettingClosesIn(BETTING_CLOSES_IN_SECONDS);
    }
  }, [bettingClosesIn]);
  
  const handleSelectPool = useCallback((pool: MiningPool) => {
    setSelectedPool(pool);
  }, []);
  
  const handleSelectBetAmount = (amount: number) => {
    setBetAmount(amount);
  };
  
  const handlePlaceBet = async () => {
    if (!address) {
      toast.error('Connect your wallet to place a bet.');
      return;
    }
    
    if (!selectedPool) {
      toast.error('Select a mining pool to bet on.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_ENDPOINT}/api/blocks/latest`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blockData = await response.json();
      
      if (!blockData || !blockData.height || !blockData.minedBy) {
        throw new Error('Failed to retrieve block data.');
      }
      
      const isWin = blockData.minedBy.toLowerCase().includes(selectedPool.name.toLowerCase());
      
      const newBet = {
        id: Date.now(),
        poolId: selectedPool.id,
        poolName: selectedPool.name,
        amount: betAmount,
        timestamp: new Date(),
        isWin: isWin,
        blockHeight: blockData.height
      };
      
      setBets([newBet, ...bets]);
      
      if (isWin) {
        toast.success(`You won ${formatSats(betAmount)} on ${selectedPool.name}!`);
        enableConfetti();
        
        // Dispatch custom event for confetti effect
        const event = new CustomEvent('playerWin', { 
          detail: { timestamp: Date.now() }
        });
        window.dispatchEvent(event);
      } else {
        toast(`Block #${blockData.height} mined by ${blockData.minedBy}. Better luck next time!`);
      }
    } catch (error: any) {
      console.error("Error placing bet:", error);
      toast.error(`Error placing bet: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getBetsOnPool = (poolId: string) => {
    return bets.filter(bet => bet.poolId === poolId);
  };

  return (
    <div className="w-full">
      {/* Top section with betting closes timer */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-white/60">
          {bettingClosesIn > 0 ?
            `Betting closes in ${bettingClosesIn} seconds` :
            'Selecting new pool...'
          }
        </div>
        <div className="text-sm text-white/60">
          {balanceData && `Balance: ${balanceData.formatted} ${balanceData.symbol}`}
        </div>
      </div>
      
      {/* Chip selection */}
      <div className="flex items-center justify-center gap-2 mb-4 overflow-x-auto py-2">
        {BET_AMOUNTS.map(amount => (
          <button
            key={amount}
            className={cn(
              "px-3 py-1 rounded-full text-sm font-medium transition-colors",
              betAmount === amount ? "bg-btc-orange text-black" : "bg-white/10 text-white hover:bg-white/20"
            )}
            onClick={() => handleSelectBetAmount(amount)}
          >
            {formatSats(amount)}
          </button>
        ))}
      </div>
      
      {/* Grid of mining pools */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
        {activePools.map(pool => (
          <MiningPoolCard
            key={pool.id}
            pool={pool}
            onSelect={handleSelectPool}
            isSelected={selectedPool?.id === pool.id}
            bets={getBetsOnPool(pool.id)}
            disabled={isLoading}
          />
        ))}
      </div>
      
      {/* Place bet button */}
      <button
        className={cn(
          "w-full py-3 rounded-xl font-bold transition-colors",
          selectedPool ? "bg-btc-orange text-black hover:bg-yellow-500" : "bg-gray-700 text-white/60 cursor-not-allowed"
        )}
        onClick={handlePlaceBet}
        disabled={!selectedPool || isLoading}
      >
        {isLoading ? 'Placing Bet...' : `Place Bet on ${selectedPool ? selectedPool.name : 'Select Pool'}`}
      </button>
      
      {/* Bet history */}
      <div className="mt-6">
        <h4 className="text-md font-semibold text-white mb-3">Bet History</h4>
        <BetHistory bets={bets} />
      </div>
    </div>
  );
};

export default BettingGrid;
