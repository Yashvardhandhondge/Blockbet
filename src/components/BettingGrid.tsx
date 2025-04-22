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

console.log('Initializing BettingGrid with settings:', {
  MIN_BET,
  MAX_BET,
  PLATFORM_FEE,
  BETTING_ROUND_DURATION
});

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

const getNormalizedPoolId = (poolId: string): string => {
  if (!poolId) return 'unknown';
  
  const poolMapping: Record<string, string> = {
    'foundry': 'foundryusa',
    'foundryusa': 'foundryusa',
    'binance': 'binancepool',
    'ocean': 'Ocean',
    'bitfufupool': 'BitFuFuPool',
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
  
  useEffect(() => {
    const storedLastBlockTime = localStorage.getItem('lastBlockTime');
    if (storedLastBlockTime) {
      const parsedTime = parseInt(storedLastBlockTime);
      setLastBlockTime(parsedTime);
    } else {
      const simulatedBlockTime = Date.now() - (Math.floor(Math.random() * 60) * 1000);
      localStorage.setItem('lastBlockTime', simulatedBlockTime.toString());
      setLastBlockTime(simulatedBlockTime);
    }
  }, []);

  useEffect(() => {
    if (lastBlockTime) {
      localStorage.setItem('lastBlockTime', lastBlockTime.toString());
    }
  }, [lastBlockTime]);

  useEffect(() => {
    if (!lastBlockTime) return;
    
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    
    const endTime = lastBlockTime + BETTING_ROUND_DURATION * 1000;
    
    const calculateTimeRemaining = () => {
      const now = Date.now();
      const remaining = Math.max(0, (endTime - now) / 1000);
      setTimeRemaining(Math.floor(remaining));
      
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
    
    calculateTimeRemaining();
    
    timerIntervalRef.current = setInterval(calculateTimeRemaining, 100);
    
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [lastBlockTime, isBettingClosed]);

  const hasStartedInitialRound = useRef(false);
  
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
                const poolStats = stats.find(s => 
                  s.poolName.toLowerCase().includes(pool.id.toLowerCase()) ||
                  pool.id.toLowerCase().includes(s.poolName.toLowerCase()) ||
                  pool.name.toLowerCase().includes(s.poolName.toLowerCase()) ||
                  s.poolName.toLowerCase().includes(pool.name.toLowerCase())
                );
                
                if (poolStats) {
                  if (poolStats.hashrate > 0) pool.hashRate = poolStats.hashrate;
                  if (poolStats.percentage > 0) pool.hashRatePercent = poolStats.percentage;
                  if (poolStats.percentage > 0) pool.odds = 100 / poolStats.percentage;
                  console.log(`Updated pool stats for ${pool.name}: ${pool.hashRate} EH/s, ${pool.hashRatePercent}%`);
                } else {
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
    
    const newBet: Omit<BetHistoryRecord, 'id' | 'timestamp'> = {
      poolId: poolId,
      poolName: pool.name,
      amount: amount,
      isWin: isWin,
      blockHeight: currentBlock + 1,
      winAmount: winAmount
    };
  
    if (user) {
      try {
        console.log('Saving bet to history:', newBet);
        await betHistoryService.saveBetHistory(newBet);
        
        await loadBetHistory();
      } catch (error) {
        console.error('Failed to save bet history:', error);
      }
    }
  
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
        return "bg-blue-600";
      case 50000:
        return "bg-red-600";
      case 100000:
        return "bg-green-600";
      case 200000:
        return "bg-yellow-500";
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
        return "bg-blue-500";
      case 50000:
        return "bg-red-500";
      case 100000:
        return "bg-green-500";
      case 200000:
        return "bg-yellow-400";
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
                    <div className="flex items-center">
                      {amount >= 1000 ? `${amount / 1000}K
