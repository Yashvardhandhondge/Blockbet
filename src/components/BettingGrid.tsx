import { useState, useEffect, useCallback, useRef } from 'react';
import { MiningPool } from '@/utils/types';
import { miningPools, getRandomMiningPool } from '@/utils/miningPools';
import { Clock, Zap, Trash2, Server, X, ArrowDown, Wallet, History, CreditCard, ArrowUpRight, ArrowDownLeft, Info, Coins, Receipt, Banknote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { toast } from './ui/use-toast';
import StatCard from './StatCard';
import { useRandomInterval } from '@/lib/animations';
import MiningPoolCard from './MiningPoolCard';
import { BLOCK_MINED_EVENT } from './LiveBlockData';
import { useIsMobile } from '@/hooks/use-mobile';
import BetHistory from './BetHistory';
import { formatSatsToBTC, formatSats, emitPlayerWin } from '@/utils/formatters';
import { OriginTabs, OriginTabsList, OriginTabsTrigger, OriginTabsContent } from "@/components/ui/origin-tabs";
import { betHistoryService,BetHistoryRecord } from '@/services/betHistoryService';
import { useAuth } from '@/context/AuthContext';

const CHIP_VALUES = [1000, 5000, 10000, 20000, 50000, 100000, 200000];

const BETTING_ROUND_DURATION = 8 * 60; // 8 minutes in seconds
const MIN_BET = 1000; // 1K sats
const MAX_BET = 1000000; // 1M sats
const PLATFORM_FEE = 0.025; 

// Add logging for initialization
console.log('Initializing BettingGrid with settings:', {
  MIN_BET,
  MAX_BET,
  PLATFORM_FEE,
  BETTING_ROUND_DURATION
});

// Patch: Ensure MARA pool is included with correct logoUrl
if (!miningPools.some(pool => pool.id === 'mara')) {
  miningPools.push({
    id: 'mara',
    name: 'MARA Pool',
    hashRate: 25.0,
    hashRatePercent: 4.5,
    blocksLast24h: 5,
    colorClass: 'bg-indigo-600',
    odds: 22,
    region: 'Asia',
    logoUrl: '/pool-logos/marapool.svg', 
    gradient: 'linear-gradient(135deg, #6366F1, #4F46E5)'
  });
}

// Add this helper function for normalizing pool IDs
const getNormalizedPoolId = (poolId: string): string => {
  if (!poolId) return 'unknown';
  
  // Mapping for specific pools with different case or naming conventions
  const poolMapping: Record<string, string> = {
    'foundry': 'foundryusa',
    'foundryusa': 'foundryusa',
    'binance': 'binancepool',
    'ocean': 'Ocean', // Fix: Changed to capital 'O' for correct filename
    'bitfufupool': 'BitFuFuPool', // Fix: Changed to match actual case in filename
    'mara': 'marapool',
    'mining-squared': 'unknown'
  };
  
  return poolMapping[poolId.toLowerCase()] || poolId;
};

const BettingGrid = () => {
  const { user} = useAuth();
  const [selectedChip, setSelectedChip] = useState<number | null>(null);
  const [bets, setBets] = useState<{
    poolId: string | null;
    amount: number;
    id: number;
  }[]>([]);
  const [nextBetId, setNextBetId] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(BETTING_ROUND_DURATION);
  const [totalBet, setTotalBet] = useState(0);
  const [selectedPool, setSelectedPool] = useState<MiningPool | null>(null);
  const [timeVariation, setTimeVariation] = useState(0);
  const [pendingTxCount, setPendingTxCount] = useState(12483);
  const [currentBlock, setCurrentBlock] = useState(miningPools[0]?.blocksLast24h || 0);
  const [avgBlockTime, setAvgBlockTime] = useState(9.8);
  const [walletBalance, setWalletBalance] = useState(25000000);
  const [betHistory, setBetHistory] = useState<BetHistoryRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);
  const [deposits, setDeposits] = useState<Array<{
    id: number;
    amount: number;
    timestamp: Date;
    txId: string;
  }>>([{
    id: 1,
    amount: 10000000,
    timestamp: new Date(Date.now() - 3600000 * 24 * 7),
    txId: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
  }, {
    id: 2,
    amount: 5000000,
    timestamp: new Date(Date.now() - 3600000 * 24 * 3),
    txId: "q1w2e3r4t5y6u7i8o9p0a1s2d3f4g5h6"
  }, {
    id: 3,
    amount: 15000000,
    timestamp: new Date(Date.now() - 3600000 * 10),
    txId: "z1x2c3v4b5n6m7q8w9e0r1t2y3u4i5o6"
  }]);
  const [withdrawals, setWithdrawals] = useState<Array<{
    id: number;
    amount: number;
    timestamp: Date;
    txId: string;
    status: 'completed' | 'pending' | 'failed';
  }>>([{
    id: 1,
    amount: 8000000,
    timestamp: new Date(Date.now() - 3600000 * 24 * 5),
    txId: "j1k2l3m4n5o6p7q8w9e0r1t2y3u4i5o6",
    status: 'completed'
  }, {
    id: 2,
    amount: 3000000,
    timestamp: new Date(Date.now() - 3600000 * 24 * 2),
    txId: "a1s2d3f4g5h6j7k8l9z1x2c3v4b5n6m7",
    status: 'completed'
  }, {
    id: 3,
    amount: 7000000,
    timestamp: new Date(Date.now() - 3600000 * 2),
    txId: "q1w2e3r4t5y6u7i8o9p0a1s2d3f4g5h6",
    status: 'pending'
  }]);
  const isMobile = useIsMobile();
  const totalTime = BETTING_ROUND_DURATION;
  const [progress, setProgress] = useState(0);
  const [winningPool, setWinningPool] = useState<string | null>(null);
  const [isBettingClosed, setIsBettingClosed] = useState(false);
  const [lastBlockTime, setLastBlockTime] = useState<number | null>(null);
  const [glowingPools, setGlowingPools] = useState<string[]>([]);

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const loadBetHistory = useCallback(async () => {
    if (user) {
      try {
        setIsLoadingHistory(true);
        const history = await betHistoryService.getUserBetHistory();
        console.log('Loaded bet history:', history.length, 'entries');
        setBetHistory(history);
      } catch (error) {
        console.error('Error loading bet history:', error);
        toast({
          title: "Error loading bet history",
          description: "Could not retrieve your previous bets",
          variant: "destructive"
        });
      } finally {
        setIsLoadingHistory(false);
      }
    }
  }, [user]);
  
  // Load lastBlockTime from localStorage on component mount
  useEffect(() => {
    const storedLastBlockTime = localStorage.getItem('lastBlockTime');
    if (storedLastBlockTime) {
      const parsedTime = parseInt(storedLastBlockTime);
      setLastBlockTime(parsedTime);
    } else {
      // Simulate a recent block for first-time visitors
      const simulatedBlockTime = Date.now() - (Math.floor(Math.random() * 60) * 1000);
      localStorage.setItem('lastBlockTime', simulatedBlockTime.toString());
      setLastBlockTime(simulatedBlockTime);
    }
  }, []);

  // Update and persist lastBlockTime
  useEffect(() => {
    if (lastBlockTime) {
      localStorage.setItem('lastBlockTime', lastBlockTime.toString());
    }
  }, [lastBlockTime]);

  // Timer effect - Update for smoother animation
  useEffect(() => {
    if (!lastBlockTime) return;
    
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    
    const endTime = lastBlockTime + BETTING_ROUND_DURATION * 1000;
    
    const calculateTimeRemaining = () => {
      const now = Date.now();
      const remaining = Math.max(0, (endTime - now) / 1000);
      setTimeRemaining(Math.floor(remaining)); // Floor for display
      
      // Update progress bar with decimal precision for smoother animation
      const elapsedPercent = Math.max(0, Math.min(100, 100 - (remaining / BETTING_ROUND_DURATION * 100)));
      setProgress(elapsedPercent);
      
      if (remaining <= 0 && !isBettingClosed) {
        setIsBettingClosed(true);
        toast({
          title: "Betting round closed",
          description: "Waiting for next block to be mined",
          variant: "destructive"
        });
        console.log('Betting closed at:', new Date().toISOString());
      }
    };
    
    // Initial calculation
    calculateTimeRemaining();
    
    // Update more frequently for smoother animation
    timerIntervalRef.current = setInterval(calculateTimeRemaining, 100); // 10 updates per second
    
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [lastBlockTime, isBettingClosed]);

  const hasStartedInitialRound = useRef(false);
  
  // Add the missing updateVisualIndicators function
  const updateVisualIndicators = useCallback(() => {
    setPendingTxCount(prev => {
      const variation = Math.random() * 100 - 20;
      return Math.max(1000, Math.floor(prev + variation));
    });
    
    setTimeVariation(Math.random() * 1.5 - 0.75);
    setAvgBlockTime(prev => {
      const variation = Math.random() * 0.4 - 0.2;
      return Math.max(9.2, Math.min(10.5, prev + variation));
    });
  }, []);
  
  useEffect(() => {
    if (bets && Array.isArray(bets)) {
      setTotalBet(bets.reduce((sum, bet) => sum + bet.amount, 0));
    } else {
      setTotalBet(0);
    }
  }, [bets]);

  useEffect(() => {
    updateVisualIndicators();

    const poolStatsInterval = setInterval(() => {
      updateVisualIndicators();
      import('@/api/miningPoolStatsApi').then(({ fetchMiningPoolStats }) => {
        fetchMiningPoolStats()
          .then(stats => {
            if (stats && stats.length > 0) {
              miningPools.forEach(pool => {
                // Try multiple matching strategies
                const poolStats = stats.find(s => 
                  s.poolName.toLowerCase().includes(pool.id.toLowerCase()) ||
                  pool.id.toLowerCase().includes(s.poolName.toLowerCase()) ||
                  pool.name.toLowerCase().includes(s.poolName.toLowerCase()) ||
                  s.poolName.toLowerCase().includes(pool.name.toLowerCase())
                );
                
                if (poolStats) {
                  // Ensure we have valid non-zero values
                  if (poolStats.hashrate > 0) pool.hashRate = poolStats.hashrate;
                  if (poolStats.percentage > 0) pool.hashRatePercent = poolStats.percentage;
                  if (poolStats.percentage > 0) pool.odds = 100 / poolStats.percentage;
                  console.log(`Updated pool stats for ${pool.name}: ${pool.hashRate} EH/s, ${pool.hashRatePercent}%`);
                } else {
                  // Set fallback minimum values if no stats found
                  if (pool.hashRate <= 0) pool.hashRate = 0.1;
                  if (pool.hashRatePercent <= 0) pool.hashRatePercent = 0.1;
                  console.log(`No API stats found for ${pool.name}, using minimum values`);
                }
              });
            } else {
              console.warn('Received empty stats from API, using default values');
            }
          })
          .catch(err => {
            console.error('Error updating pool stats:', err);
            // Ensure minimum values in case of API error
            miningPools.forEach(pool => {
              if (pool.hashRate <= 0) pool.hashRate = 0.1;
              if (pool.hashRatePercent <= 0) pool.hashRatePercent = 0.1;
            });
          });
      });
    }, 30000);

    return () => clearInterval(poolStatsInterval);
  }, []);

  const startNewBettingRoundKeepGlow = useCallback(() => {
    console.log('Starting new betting round (keeping glow effects)');
    setProgress(0);
    setIsBettingClosed(false);
    setBets([]);
    setSelectedChip(null);
    setSelectedPool(null);
    
    if (hasStartedInitialRound.current) {
      toast({
        title: "New betting round started",
        description: `You have ${Math.floor(BETTING_ROUND_DURATION / 60)} minutes to place your bets`,
        variant: "default"
      });
    } else {
      hasStartedInitialRound.current = true;
    }
  }, []);

  const startNewBettingRound = useCallback(() => {
    console.log('Starting new betting round with complete reset');
    setProgress(0);
    setIsBettingClosed(false);
    setBets([]);
    setSelectedChip(null);
    setSelectedPool(null);
    setWinningPool(null);
    setGlowingPools([]);
    
    if (hasStartedInitialRound.current) {
      toast({
        title: "New betting round started",
        description: `You have ${Math.floor(BETTING_ROUND_DURATION / 60)} minutes to place your bets`,
        variant: "default"
      });
    } else {
      hasStartedInitialRound.current = true;
    }
  }, []);

  const handlePlaceBet = (poolId: string | null) => {
    console.log('Attempting to place bet:', {
      poolId,
      selectedChip,
      currentWalletBalance: walletBalance,
      isBettingClosed,
      timeRemaining
    });

    if (timeRemaining <= 0 || isBettingClosed) {
      console.log('Bet rejected: Betting period closed');
      toast({
        title: "Betting is closed",
        description: "Please wait for the next block to be mined",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedChip) {
      console.log('Bet rejected: No chip selected');
      toast({
        title: "Select a chip first",
        description: "Please select a chip value before placing a bet",
        variant: "destructive"
      });
      return;
    }

    if (selectedChip < MIN_BET) {
      console.log('Bet rejected: Below minimum', { attempted: selectedChip, minimum: MIN_BET });
      toast({
        title: "Bet too small",
        description: `Minimum bet is ${formatSats(MIN_BET)}`,
        variant: "destructive"
      });
      return;
    }

    if (selectedChip > MAX_BET) {
      console.log('Bet rejected: Above maximum', { attempted: selectedChip, maximum: MAX_BET });
      toast({
        title: "Bet too large", 
        description: `Maximum bet is ${formatSats(MAX_BET)}`,
        variant: "destructive"
      });
      return;
    }

    if (selectedChip > walletBalance) {
      console.log('Bet rejected: Insufficient funds', { attempted: selectedChip, walletBalance });
      toast({
        title: "Insufficient funds",
        description: "You don't have enough balance to place this bet",
        variant: "destructive"
      });
      return;
    }

    setWalletBalance(prev => prev - selectedChip);
    
    setBets(prevBets => {
      if (!prevBets) return [{
        poolId,
        amount: selectedChip,
        id: nextBetId
      }];
      
      return [...prevBets, {
        poolId,
        amount: selectedChip,
        id: nextBetId
      }];
    });
    setNextBetId(prev => prev + 1);
    
    const poolName = poolId ? miningPools.find(p => p.id === poolId)?.name || 'Unknown' : 'Empty Block';
    console.log('Bet placed:', { poolId, poolName, amount: selectedChip });
    toast({
      title: "Bet placed!",
      description: `${formatSats(selectedChip)} on ${poolName}`,
      variant: "default"
    });
  };

  const handleClearBets = () => {
    if (isBettingClosed) {
      toast({
        title: "Betting is closed",
        description: "Please wait for the next block to be mined",
        variant: "destructive"
      });
      return;
    }
    
    setBets([]);
    console.log('All bets cleared');
    toast({
      title: "Bets cleared",
      description: "All your bets have been cleared",
      variant: "default"
    });
  };

  const handleCancelLastBet = () => {
    if (isBettingClosed) {
      toast({
        title: "Betting is closed",
        description: "Please wait for the next block to be mined",
        variant: "destructive"
      });
      return;
    }
    
    if (!bets || bets.length === 0) {
      toast({
        title: "No bets to cancel",
        description: "You haven't placed any bets yet",
        variant: "destructive"
      });
      return;
    }
    const lastBet = bets[bets.length - 1];
    const newBets = bets.slice(0, -1);
    setBets(newBets);
    const poolName = lastBet.poolId ? miningPools.find(p => p.id === lastBet.poolId)?.name || 'Unknown' : 'Empty Block';
    console.log('Last bet cancelled:', { betId: lastBet.id, poolName, amount: lastBet.amount });
    toast({
      title: "Last bet cancelled",
      description: `Removed bet of ${(lastBet.amount / 100000).toFixed(5)} BTC on ${poolName}`,
      variant: "default"
    });
  };

  const handleDeposit = () => {
    const newBalance = walletBalance + 10000000;
    setWalletBalance(newBalance);

    const newDeposit = {
      id: deposits.length + 1,
      amount: 10000000,
      timestamp: new Date(),
      txId: Array(32).fill(0).map(() => Math.random().toString(36).charAt(2)).join('')
    };
    setDeposits([newDeposit, ...deposits]);
    console.log('Deposit successful:', { amount: newDeposit.amount, newBalance });
    toast({
      title: "Deposit successful",
      description: "Added 0.1 BTC to your wallet",
      variant: "default"
    });
  };

  const handleWithdraw = () => {
    if (walletBalance >= 10000000) {
      const newBalance = walletBalance - 10000000;
      setWalletBalance(newBalance);

      const newWithdrawal = {
        id: withdrawals.length + 1,
        amount: 10000000,
        timestamp: new Date(),
        txId: Array(32).fill(0).map(() => Math.random().toString(36).charAt(2)).join(''),
        status: 'pending' as const
      };
      setWithdrawals([newWithdrawal, ...withdrawals]);

      setTimeout(() => {
        setWithdrawals(prev => prev.map(w => w.id === newWithdrawal.id ? {
          ...w,
          status: 'completed' as const
        } : w));
      }, 5000);
      console.log('Withdrawal successful:', { amount: newWithdrawal.amount, newBalance });
      toast({
        title: "Withdrawal successful",
        description: "Withdrawn 0.1 BTC from your wallet",
        variant: "default"
      });
    } else {
      console.log('Withdrawal failed: Insufficient funds', { walletBalance });
      toast({
        title: "Insufficient funds",
        description: "You don't have enough funds to withdraw",
        variant: "destructive"
      });
    }
  };

  const handleAddBetToHistory = async (poolId: string, amount: number, isWin: boolean, winAmount?: number) => {
    const pool = miningPools.find(p => p.id === poolId);
    if (!pool) return;
    
    // Create new bet object
    const newBet: Omit<BetHistoryRecord, 'id' | 'timestamp'> = {
      poolId: poolId,
      poolName: pool.name,
      amount: amount,
      isWin: isWin,
      blockHeight: currentBlock + 1,
      winAmount: winAmount
    };
  
    // Save to database if user is logged in
    if (user) {
      try {
        console.log('Saving bet to history:', newBet);
        await betHistoryService.saveBetHistory(newBet);
        
        // Refresh the history to get the latest data
        await loadBetHistory();
      } catch (error) {
        console.error('Failed to save bet history:', error);
      }
    }
  
    // For immediate UI feedback, add to local state as well
    const localBet: BetHistoryRecord = {
      ...newBet,
      id: Date.now(),
      timestamp: new Date()
    };
    
    setBetHistory(prev => [localBet, ...prev].slice(0, 50));
  
    if (isWin && pool) {
      const rawWinAmount = winAmount || Math.floor(amount * pool.odds);
      const platformFee = Math.floor(rawWinAmount * PLATFORM_FEE);
      const netWinAmount = rawWinAmount - platformFee;
      
      setWalletBalance(prev => prev + netWinAmount);
      
      toast({
        title: "Bet won!",
        description: `You won ${formatSats(netWinAmount)} (after ${PLATFORM_FEE * 100}% platform fee) betting on ${pool?.name}!`,
        variant: "default"
      });
    }
  };

  const formatTimeRemaining = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const estimatedTime = (() => {
    const totalMinutes = (BETTING_ROUND_DURATION / 60) + timeVariation;
    const minutes = Math.floor(totalMinutes);
    const seconds = Math.floor((totalMinutes - minutes) * 60);
    return `${minutes}m ${seconds}s`;
  })();

  const getUrgencyClass = () => {
    const percentageLeft = timeRemaining / totalTime * 100;
    if (percentageLeft < 20) return "text-btc-orange";
    if (percentageLeft < 50) return "text-btc-orange";
    return "text-btc-orange";
  };

  const handleSelectChip = (value: number) => {
    if (isBettingClosed) {
      toast({
        title: "Betting is closed",
        description: "Please wait for the next block to be mined",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedChip(value);
  };

  const handleSelectPool = (pool: MiningPool) => {
    if (isBettingClosed) {
      toast({
        title: "Betting is closed",
        description: "Please wait for the next block to be mined",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedPool(pool);
    handlePlaceBet(pool.id);
  };

  const getPoolLogo = (poolId: string) => {
    const logoPath = `/pool-logos/${poolId}.svg`;
    return (
      <div className="w-full h-full flex items-center justify-center bg-black rounded-full overflow-hidden p-0.5">
        <img 
          src={logoPath} 
          alt={`${poolId} logo`} 
          className="w-full h-full object-contain" 
          onError={e => {
            console.log(`Error loading logo for ${poolId}: ${logoPath}`);
            e.currentTarget.src = '/pool-logos/default.svg';
          }} 
        />
      </div>
    );
  };

  const getPoolGradientStyle = (poolId: string): React.CSSProperties => {
    const pool = miningPools.find(p => p.id === poolId);
    if (pool) {
      return {
        background: pool.gradient
      };
    }
    return {
      background: 'linear-gradient(135deg, #3a3a3a, #1a1a1a)'
    };
  };

  const getBetsOnPool = (poolId: string | null) => {
    if (!bets || !Array.isArray(bets)) return [];
    return bets.filter(bet => bet.poolId === poolId);
  };

  const getPlaceholderImage = (poolId: string) => {
    const pool = miningPools.find(p => p.id === poolId);
    const firstLetter = pool?.name.charAt(0) || '?';
    const textColor = poolId === 'unknown' ? '#FFFFFF' : '#FFFFFF';
    return <div className="w-full h-full flex items-center justify-center bg-white text-sm font-bold" style={{
      color: textColor
    }}>
        {firstLetter}
      </div>;
  };

  const getChipColor = (value: number) => {
    switch(value) {
      case 1000:
        return "bg-purple-600";
      case 5000:
        return "bg-pink-600";
      case 10000:
        return "bg-orange-600";
      case 20000:
        return "bg-blue-600"; // Changed to blue for 20K
      case 50000:
        return "bg-red-600";
      case 100000:
        return "bg-green-600"; // Changed to green for 100K
      case 200000:
        return "bg-yellow-500"; // Changed to gold/yellow for 200K
      default:
        return "bg-gray-600";
    }
  };
  
  const getChipSecondaryColor = (value: number) => {
    switch(value) {
      case 1000:
        return "bg-purple-500";
      case 5000:
        return "bg-pink-500";
      case 10000:
        return "bg-orange-500";
      case 20000:
        return "bg-blue-500"; // Changed to blue for 20K
      case 50000:
        return "bg-red-500";
      case 100000:
        return "bg-green-500"; // Changed to green for 100K
      case 200000:
        return "bg-yellow-400"; // Changed to gold/yellow for 200K
      default:
        return "bg-gray-500";
    }
  };

 

  const formatChipValue = (value: number) => {
    if (value >= 100000) return `${value / 1000}K`;
    if (value >= 10000) return `${value / 1000}K`;
    if (value >= 1000) return `${value / 1000}K`;
    return value;
  };

  const getConsolidatedBets = () => {
    const betsByPool = new Map<string | null, Array<number>>();
    bets.forEach(bet => {
      const poolKey = bet.poolId !== null ? bet.poolId : 'empty';
      const existingBets = betsByPool.get(poolKey) || [];
      betsByPool.set(poolKey, [...existingBets, bet.amount]);
    });
    const result = Array.from(betsByPool).map(([poolKey, amounts]) => ({
      poolId: poolKey === 'empty' ? null : poolKey,
      amounts: amounts,
      totalAmount: amounts.reduce((sum, amount) => sum + amount, 0)
    }));
    return result;
  };

  const renderRouletteCasualChips = (amounts: number[]) => {
    const groupedChips: {
      [key: number]: number;
    } = {};
    amounts.forEach(amount => {
      groupedChips[amount] = (groupedChips[amount] || 0) + 1;
    });
    const chipGroups = Object.entries(groupedChips).map(([amount, count]) => ({
      amount: parseInt(amount),
      count
    })).sort((a, b) => b.amount - a.amount);
    const chipsToShow = chipGroups.slice(0, 3);
    const remainingDenoms = chipGroups.length > 3 ? chipGroups.length - 3 : 0;
    return <div className="flex -space-x-1 mr-2">
        {chipsToShow.map((chipGroup, index) => <div key={`chip-${chipGroup.amount}-${index}`} className={cn("relative w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white border border-white/40", getChipColor(chipGroup.amount))} style={{
        zIndex: 5 - index,
        transform: `translateX(${index * 4}px)`
      }}>
            <div className="absolute inset-0 rounded-full border-[1.5px] border-white border-dashed"></div>
            <div className="flex items-center">
              {chipGroup.amount >= 1000 ? `${chipGroup.amount / 1000}K` : chipGroup.amount}
              {chipGroup.count > 1 && <span className="text-[6px] ml-0.5">×{chipGroup.count}</span>}
            </div>
          </div>)}
        {remainingDenoms > 0 && <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold bg-black/50 border border-white/20 shadow-sm" style={{
        zIndex: 1,
        transform: `translateX(${chipsToShow.length * 4}px)`
      }}>
            +{remainingDenoms}
          </div>}
      </div>;
  };

  const renderStackedChips = (bets: Array<{
    id: number;
    amount: number;
  }>) => {
    if (bets.length === 0) return null;
    
    const groupedBets: Record<number, Array<{id: number; amount: number}>> = {};
    
    bets.forEach(bet => {
      if (!groupedBets[bet.amount]) {
        groupedBets[bet.amount] = [];
      }
      groupedBets[bet.amount].push(bet);
    });
    
    const denominations = Object.keys(groupedBets).map(Number).sort((a, b) => b - a);
    
    const displayDenominations = denominations.slice(0, 5);
    const remainingDenominations = denominations.length > 5 ? denominations.length - 5 : 0;
    
    return (
      <div className="absolute bottom-3 right-0 left-0 px-4 flex justify-end">
        <div className="flex flex-row-reverse items-end gap-4 h-12">
          {displayDenominations.map((amount, index) => {
            const betCount = groupedBets[amount].length;
            const stackSize = Math.min(betCount, 4);
            
            return (
              <div 
                key={`stack-${amount}`} 
                className="relative"
                style={{ zIndex: 10 - index }}
              >
                {Array.from({ length: stackSize - 1 }).map((_, stackIndex) => (
                  <div 
                    key={`chip-${amount}-${stackIndex}`}
                    className={cn(
                      "rounded-full flex items-center justify-center font-bold text-white shadow-xl w-7 h-7 text-[10px]",
                      getChipColor(amount)
                    )}
                    style={{
                      position: 'absolute',
                      bottom: stackIndex * 4,
                      right: 0,
                      transform: `rotate(${(stackIndex * 5) - 7}deg)`,
                      boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
                    }}
                  >
                    <div className="absolute rounded-full border border-white/30 inset-1"></div>
                    <div 
                      className="absolute rounded-full border-dashed inset-0.5 border-2"
                      style={{
                        borderColor: `${getChipSecondaryColor(amount)}`
                      }}
                    ></div>
                  </div>
                ))}
                
                <div 
                  className={cn(
                    "rounded-full flex flex-col items-center justify-center font-bold text-white shadow-xl w-9 h-9 text-base",
                    getChipColor(amount)
                  )}
                  style={{
                    boxShadow: "0 3px 6px rgba(0,0,0,0.6)",
                    position: stackSize > 1 ? 'relative' : 'relative',
                    bottom: stackSize > 1 ? (stackSize - 1) * 6 : 0,
                    right: 0,
                  }}
                >
                  <div className="absolute rounded-full border border-white/30 inset-1"></div>
                  <div 
                    className="absolute rounded-full border-dashed inset-0.5 border-2"
                    style={{
                      borderColor: `${getChipSecondaryColor(amount)}`
                    }}
                  ></div>
                  <span className="relative z-10 text-white font-bold drop-shadow-md text-sm">
                    {formatChipValue(amount)}
                  </span>
                  {betCount > 1 && 
                    <span className="relative z-10 text-white font-semibold drop-shadow-md text-xs -mt-0.5">
                      ×{betCount}
                    </span>
                  }
                </div>
              </div>
            );
          })}
          
          {remainingDenominations > 0 && (
            <div className="text-xs text-white/80 font-medium ml-1 bg-black/50 px-1.5 py-0.5 rounded-full shadow-md">
              +{remainingDenominations}
            </div>
          )}
        </div>
      </div>
    );
  };

  const processBetsForBlock = useCallback((blockData: any) => {
    console.log('Processing bets for new block:', {
      blockHeight: blockData.height,
      minedBy: blockData.minedBy,
      timestamp: blockData.timestamp,
      activeBets: bets.length,
      totalBetAmount: bets.reduce((sum, bet) => sum + bet.amount, 0)
    });
    
    // Clear betting state first to prevent visual artifacts
    setIsBettingClosed(false);
    
    // Immediately clear the bets to update UI
    setBets([]);
    setSelectedChip(null);
    setSelectedPool(null);
    
    if (!bets || bets.length === 0) {
      console.log('No bets to process, starting new round');
      startNewBettingRound();
      return;
    }
    
    const winningPoolId = blockData.minedBy ? 
      miningPools.find(p => 
        blockData.minedBy.toLowerCase().includes(p.id.toLowerCase()) || 
        p.id.toLowerCase().includes(blockData.minedBy.toLowerCase())
      )?.id || null 
      : null;
    
    console.log('Winning pool determined:', { winningPoolId, minedBy: blockData.minedBy });
    setWinningPool(winningPoolId);
  
    if (winningPoolId) {
      setGlowingPools(prev => [...prev, winningPoolId]);
      
      setTimeout(() => {
        setGlowingPools(prev => prev.filter(id => id !== winningPoolId));
      }, 10000);
    }
    
    let totalWinAmount = 0;
    
    // Process all bets using a local copy since we cleared the state
    const betsToProcess = [...bets];
    
    // Process all bets first
    betsToProcess.forEach(bet => {
      const isWin = bet.poolId === winningPoolId;
      if (bet.poolId) {
        const pool = miningPools.find(p => p.id === bet.poolId);
        if (pool) {
          if (isWin) {
            const rawWinAmount = Math.floor(bet.amount * pool.odds);
            const platformFee = Math.floor(rawWinAmount * PLATFORM_FEE);
            const netWinAmount = rawWinAmount - platformFee;
            totalWinAmount += netWinAmount;
            
            // Save with win amount
            handleAddBetToHistory(bet.poolId, bet.amount, isWin, netWinAmount);
            
            console.log('Win processed:', {
              pool: pool.name,
              betAmount: bet.amount,
              odds: pool.odds,
              netWinAmount
            });
          } else {
            // Save as a loss
            handleAddBetToHistory(bet.poolId, bet.amount, isWin);
          }
        }
      }
    });
    
    if (totalWinAmount > 0) {
      setWalletBalance(prev => prev + totalWinAmount);
      emitPlayerWin();
      toast({
        title: "You won!",
        description: `Total winnings: ${formatSats(totalWinAmount)} (after ${PLATFORM_FEE * 100}% platform fee)`,
        variant: "default"
      });
    } else {
      toast({
        title: "Better luck next time!",
        description: "Your bets didn't win this round.",
        variant: "destructive"
      });
    }
    
    // Update block counter
    setCurrentBlock(prev => prev + 1);
    
    // Let the glow effects play for a moment, then complete the reset
    setTimeout(() => {
      startNewBettingRound();
    }, 3000);
  }, [bets, setWalletBalance, startNewBettingRound, handleAddBetToHistory]);
  useEffect(() => {
    const handleBlockMined = (e: CustomEvent<any>) => {
      console.log('Block mined event received:', e.detail);
      if (e.detail) {
        const newBlockTime = e.detail.timestamp || Date.now();
        setLastBlockTime(newBlockTime);
        processBetsForBlock(e.detail);
      }
    };

    window.addEventListener(BLOCK_MINED_EVENT, handleBlockMined as EventListener);
    return () => {
      window.removeEventListener(BLOCK_MINED_EVENT, handleBlockMined as EventListener);
    };
  }, [processBetsForBlock]);

  const renderImprovedChips = (amounts: number[]) => {
    const groupedChips: {
      [key: number]: number;
    } = {};
    amounts.forEach(amount => {
      groupedChips[amount] = (groupedChips[amount] || 0) + 1;
    });
    
    const chipGroups = Object.entries(groupedChips).map(([amount, count]) => ({
      amount: parseInt(amount),
      count
    })).sort((a, b) => b.amount - a.amount);
    
    const chipsToShow = chipGroups.slice(0, 3);
    const remainingDenoms = chipGroups.length > 3 ? chipGroups.length - 3 : 0;
    
    return (
      <div className="flex -space-x-1 mr-2">
        {chipsToShow.map((chipGroup, index) => (
          <div 
            key={`chip-${chipGroup.amount}-${index}`} 
            className={cn(
              "relative w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white border-2 border-white/50",
              getChipColor(chipGroup.amount)
            )}
            style={{
              zIndex: 5 - index,
              transform: `translateX(${index * 4}px)`
            }}
          >
            <div className="absolute inset-0 rounded-full border-[1.5px] border-white border-dashed"></div>
            <div className="flex flex-col items-center justify-center leading-tight">
              <div className="truncate max-w-[24px] text-center">
                {chipGroup.amount >= 1000 ? `${chipGroup.amount / 1000}K` : chipGroup.amount}
              </div>
              {chipGroup.count > 1 && (
                <div className="text-xs mt-0.5 font-semibold">×{chipGroup.count}</div>
              )}
            </div>
          </div>
        ))}
        
        {remainingDenoms > 0 && (
          <div 
            className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold bg-black/50 border border-white/20 shadow-sm"
            style={{
              zIndex: 1,
              transform: `translateX(${chipsToShow.length * 4}px)`
            }}
          >
            +{remainingDenoms}
          </div>
        )}
      </div>
    );
  };

  const renderBetsInPlay = () => {
    const consolidatedBets = getConsolidatedBets();
    
    if (consolidatedBets.length === 0) {
      return (
        <div className="py-8 text-center">
          <div className="inline-flex items-center justify-center bg-btc-orange/10 rounded-full p-3 mb-3">
            <Info className="h-5 w-5 text-btc-orange" />
          </div>
          <p className="text-white/60 text-sm">No active bets placed yet</p>
          <p className="text-white/40 text-xs mt-1">Place bets on mining pools above</p>
        </div>
      );
    }
    
    const sortedBets = [...consolidatedBets].sort((a, b) => b.totalAmount - a.totalAmount);
    
    return (
      <div className="space-y-3">
        <div className="flex justify-between text-white/60 text-xs border-b border-white/10 pb-2 px-1">
          <span>Mining Pool</span>
          <span>Total Bet</span>
        </div>
        
        {sortedBets.map((bet, index) => {
          const pool = bet.poolId ? miningPools.find(p => p.id === bet.poolId) : null;
          const poolName = pool ? pool.name : 'Empty Block';
          const potentialWin = pool ? Math.floor(bet.totalAmount * pool.odds) : Math.floor(bet.totalAmount * 80);
          
          return (
            <div key={`bet-${bet.poolId}-${index}`} className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                  {bet.poolId ? (
                    <img 
                      src={`/pool-logos/${getNormalizedPoolId(bet.poolId)}.svg`} 
                      alt={poolName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.log(`Error loading logo for ${bet.poolId} (normalized: ${getNormalizedPoolId(bet.poolId)})`);
                        e.currentTarget.src = '/pool-logos/default.svg';
                      }} 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                      <Server className="w-4 h-4 text-white/60" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{poolName}</div>
                  <div className="flex items-center mt-1">
                    {renderImprovedChips(bet.amounts)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-white">{formatSats(bet.totalAmount)}</div>
                <div className="text-xs text-btc-orange">
                  Potential win: {formatSats(potentialWin)}
                </div>
              </div>
            </div>
          );
        })}
        
        <div className="mt-4 pt-2 border-t border-white/10 flex justify-between">
          <div className="text-sm text-white/60">Total bets:</div>
          <div className="text-sm font-medium text-white">{formatSats(totalBet)}</div>
        </div>
      </div>
    );
  };

  const renderTransactionHistory = () => {
    const allTransactions = [
      ...deposits.map(d => ({
        ...d,
        type: 'deposit' as const,
        status: 'completed' as const
      })),
      ...withdrawals.map(w => ({
        ...w,
        type: 'withdrawal' as const
      }))
    ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    return (
      <div className="space-y-3">
        {allTransactions.map((transaction) => (
          <div key={`${transaction.type}-${transaction.id}`} className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center">
              <div className={cn(
                "p-1.5 rounded",
                transaction.type === 'deposit' ? "bg-green-500/10" : "bg-red-500/10"
              )}>
                {transaction.type === 'deposit' ? (
                  <ArrowDownLeft className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowUpRight className="h-4 w-4 text-red-500" />
                )}
              </div>
              <div className="ml-3">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-white">
                    {transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                  </span>
                  {transaction.type === 'withdrawal' && (
                    <span className={cn(
                      "ml-2 text-xs px-1.5 py-0.5 rounded",
                      transaction.status === 'completed' ? "bg-green-500/20 text-green-500" :
                      transaction.status === 'pending' ? "bg-yellow-500/20 text-yellow-500" :
                      "bg-red-500/20 text-red-500"
                    )}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  )}
                </div>
                <div className="text-xs text-white/60">
                  {transaction.timestamp.toLocaleDateString()} {transaction.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-white">
                {transaction.type === 'deposit' ? '+' : '-'}{formatSats(transaction.amount)}
              </div>
              <div className="text-xs text-white/60 flex items-center">
                {transaction.txId.substring(0, 8)}...
                <button className="ml-1 text-btc-orange hover:text-btc-orange/80" onClick={() => {
                  navigator.clipboard?.writeText(transaction.txId);
                  toast({
                    title: "TX ID copied",
                    description: "Transaction ID copied to clipboard",
                    variant: "default"
                  });
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}

        {allTransactions.length === 0 && (
          <div className="py-8 text-center">
            <div className="inline-flex items-center justify-center bg-btc-orange/10 rounded-full p-3 mb-3">
              <Wallet className="h-5 w-5 text-btc-orange" />
            </div>
            <p className="text-white/60 text-sm">No transaction history yet</p>
            <p className="text-white/40 text-xs mt-1">Deposit or withdraw BTC to see your transactions</p>
          </div>
        )}
      </div>
    );
  };

  const renderChipSelection = () => {
    return (
      <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-3">
        {CHIP_VALUES.map(value => (
          <button
            key={`chip-${value}`}
            className={cn(
              "relative rounded-full w-9 h-9 md:w-12 md:h-12 flex items-center justify-center text-white font-bold text-xs md:text-sm transition-all",
              selectedChip === value ? "ring-2 ring-white shadow-lg scale-110 z-10" : "hover:scale-105",
              getChipColor(value)
            )}
            onClick={() => handleSelectChip(value)}
          >
            <div className="absolute inset-1 rounded-full border border-white/30"></div>
            <div 
              className="absolute inset-0.5 rounded-full border-dashed border-2"
              style={{
                borderColor: `${getChipSecondaryColor(value)}`
              }}
            ></div>
            <span className="drop-shadow-md">{formatChipValue(value)}</span>
          </button>
        ))}
      </div>
    );
  };

  useEffect(() => {
    console.log('Environment check:');
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    console.log('- Window location:', window.location.href);
    
    if (process.env.NODE_ENV === 'production') {
      console.warn('Running in production mode - timer should be set to 8 minutes');
      console.log('Explicitly verifying BETTING_ROUND_DURATION:', BETTING_ROUND_DURATION);
    }
  }, []);

  // Sort mining pools descending by blocksLast24h
  const sortedMiningPools = [...miningPools].sort(
    (a, b) => b.blocksLast24h - a.blocksLast24h
  );

  // Update Progress component render for smoother transition
  return (
    <div className="w-full">
      <div className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl mb-6 overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-btc-orange mr-1.5" />
            <span className="text-xs font-medium text-white">Betting closes in:</span>
          </div>
          <div className="flex-grow mx-4 relative">
          <div className="relative pr-14">
              <Progress 
                value={progress} 
                className="h-2 bg-white/10 rounded-full w-full" 
                indicatorClassName="bg-gradient-to-r from-btc-orange to-yellow-500 transition-[width] duration-100 ease-linear" 
              />
              {timeRemaining <= 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-medium text-gradient animate-pulse-subtle">
                    All bets closed for this round. Please wait for the next block to place new bets.
                  </span>
                </div>
              )}
            </div>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
              <span className="text-xs font-mono font-bold text-btc-orange tabular-nums">
                {timeRemaining > 0 ? formatTimeRemaining() : "0:00"}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="w-full bg-[#0a0a0a] border-white/10 p-4 rounded-xl h-[110px]">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-white text-sm">Step 1. Fund your Wallet.</h3>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-btc-orange/10 p-2 rounded-lg mr-3">
                <Wallet className="h-5 w-5 text-btc-orange" strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-xs text-white/60">Balance</div>
                <div className="text-xs md:text-sm lg:text-base font-bold text-white">{formatSats(walletBalance)}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="bg-btc-orange hover:bg-btc-orange/80 text-black border-btc-orange/50 hover:border-btc-orange/70 rounded-full text-xs py-1 h-7" onClick={handleDeposit}>
                Deposit
              </Button>
              <Button variant="outline" className="border-btc-orange/20 bg-btc-orange/5 text-white hover:bg-btc-orange/10 hover:border-btc-orange/30 rounded-full text-xs py-1 h-7" onClick={handleWithdraw}>
                Withdraw
              </Button>
            </div>
          </div>
        </Card>
        
        <Card className="w-full bg-[#0a0a0a] border-white/10 p-4 rounded-xl relative h-[110px]">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-white text-sm">Step 2. Select chip value in Sats.</h3>
          </div>
          {renderChipSelection()}
        </Card>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-sm">
            <span className="block md:hidden">Step 3. Place your bets</span>
            <span className="hidden md:block">Step 3. Place your bets on mining pools.</span>
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" className="border-white/10 hover:border-white/20 hover:bg-white/5 rounded-full text-xs p-1.5 h-7" onClick={handleCancelLastBet} disabled={isBettingClosed}>
              <Trash2 className="h-3.5 w-3.5 text-white/60 mr-1" />
              <span>Undo last</span>
            </Button>
            <Button variant="outline" className="border-white/10 hover:border-white/20 hover:bg-white/5 rounded-full text-xs p-1.5 h-7" onClick={handleClearBets} disabled={isBettingClosed}>
              <X className="h-3.5 w-3.5 text-white/60 mr-1" />
              <span>Clear all</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {sortedMiningPools.map((pool) => (
            <div key={pool.id} className="transition-all">
              <MiningPoolCard 
                pool={pool} 
                onSelect={() => handleSelectPool(pool)}
                isSelected={selectedPool?.id === pool.id}
                bets={getBetsOnPool(pool.id)}
                isWinningPool={glowingPools.includes(pool.id)}
                disabled={isBettingClosed}
              />
            </div>
          ))}
          
          <div className="transition-all h-full">
            <div className={cn(
              "relative rounded-xl overflow-hidden transition-all duration-300 border h-full",
              selectedPool === null && !!selectedChip ? "border-btc-orange shadow-[0_0_20px_rgba(247,147,26,0.15)]" : "border-white/10 hover:border-white/20",
              isBettingClosed ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
              "mobile-equal-height"
            )} onClick={() => !isBettingClosed && handlePlaceBet(null)}>
              <div className="absolute inset-0 opacity-30 transition-opacity duration-300 bg-gradient-to-br from-[#1a1a2e] to-[#0d0d16]"></div>
              <div className="absolute inset-0 backdrop-blur-sm bg-btc-dark/80"></div>
              
              <div className="relative z-10 p-4 flex flex-col h-full">
                <div className="flex flex-col items-center mb-1">
                  <div className={cn(
                    "rounded-lg overflow-hidden bg-transparent mb-1",
                    isMobile ? "h-10 w-10" : "h-16 w-16"
                  )}>
                    <div className="w-full h-full flex items-center justify-center rounded-lg overflow-hidden">
                      <Server className={cn("text-white/40", isMobile ? "w-6 h-6" : "w-10 h-10")} />
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h3 className={cn(
                      "font-medium text-white truncate max-w-full",
                      isMobile ? "text-xs" : "text-lg"
                    )}>Empty Block</h3>
                    {!isMobile && <div className="mt-0.5 text-xs text-white/60">No miner signature</div>}
                  </div>
                </div>
                
                {!isMobile && (
                  <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                    <div className="p-2">
                      <div className="text-white/60 text-xs">Probability</div>
                      <div className="font-medium text-white">~1%</div>
                    </div>
                    <div className="p-2">
                      <div className="text-white/60 text-xs">Blocks (24h)</div>
                      <div className="font-medium text-white">3</div>
                    </div>
                  </div>
                )}
                
                <div className="mt-auto">
                  <div className={cn(
                    "flex justify-center items-center",
                    isMobile ? "mb-2" : "p-2"
                  )}>
                    <div className="text-white/80 text-center">
                      <span className={cn(
                        "font-bold bg-gradient-to-r from-btc-orange to-yellow-500 bg-clip-text text-transparent",
                        isMobile ? "text-sm" : "text-lg"
                      )}>
                        80.00
                        <span className="ml-0.5">×</span>
                      </span>
                      <span className={cn("ml-1 text-white/60", isMobile ? "text-[9px]" : "text-xs")}>payout</span>
                    </div>
                  </div>
                  
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-1000 ease-out"
                      style={{ width: `1%`, background: 'linear-gradient(135deg, #1a1a2e, #0d0d16)' }}
                    ></div>
                  </div>
                </div>

                {renderStackedChips(getBetsOnPool(null))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Card className="w-full bg-[#0a0a0a] border-white/10 p-4 rounded-xl relative mb-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-white text-sm">Select chip value in Sats.</h3>
        </div>
        {renderChipSelection()}
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
        <Card className="bg-[#0a0a0a] border-white/10 rounded-xl overflow-hidden col-span-1">
          <div className="p-4">
            <h3 className="text-white text-sm mb-4">Player Stats:</h3>
            <OriginTabs defaultValue="bets">
              <OriginTabsList className="bg-black/40 w-full flex">
                <OriginTabsTrigger value="bets" icon={<Coins className="h-4 w-4" />} className="flex-1">Bets in Play</OriginTabsTrigger>
                <OriginTabsTrigger value="history" icon={<History className="h-4 w-4" />} className="flex-1">Bet History</OriginTabsTrigger>
                <OriginTabsTrigger value="transactions" icon={<Wallet className="h-4 w-4" />} className="flex-1">Transactions</OriginTabsTrigger>
              </OriginTabsList>
              
              <OriginTabsContent value="bets" className="mt-4">
                {renderBetsInPlay()}
              </OriginTabsContent>
              
              <OriginTabsContent value="history" className="mt-4">
  <BetHistory bets={betHistory} isLoading={isLoadingHistory} />
</OriginTabsContent>
              
              <OriginTabsContent value="transactions" className="mt-4">
                {renderTransactionHistory()}
              </OriginTabsContent>
            </OriginTabs>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BettingGrid;