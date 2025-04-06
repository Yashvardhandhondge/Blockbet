import { useState, useEffect } from 'react';
import { MiningPool } from '@/utils/types';
import { miningPools, getRandomMiningPool } from '@/utils/miningPools';
import { Clock, Zap, Trash2, Server, X, ArrowDown, Wallet, History, CreditCard, ArrowUpRight, ArrowDownLeft, Info } from 'lucide-react';
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

const CHIP_VALUES = [100, 500, 1000, 5000, 10000, 50000, 100000];

const nextBlockEstimate = {
  estimatedTimeMinutes: 10,
  difficulty: 67352594066965
};

const BettingGrid = () => {
  
  const [selectedChip, setSelectedChip] = useState<number | null>(null);
  const [bets, setBets] = useState<{
    poolId: string | null;
    amount: number;
    id: number;
  }[]>([]);
  const [nextBetId, setNextBetId] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(nextBlockEstimate.estimatedTimeMinutes * 60);
  const [totalBet, setTotalBet] = useState(0);
  const [selectedPool, setSelectedPool] = useState<MiningPool | null>(null);
  const [timeVariation, setTimeVariation] = useState(0);
  const [pendingTxCount, setPendingTxCount] = useState(12483);
  const [currentBlock, setCurrentBlock] = useState(miningPools[0]?.blocksLast24h || 0);
  const [avgBlockTime, setAvgBlockTime] = useState(9.8);
  const [walletBalance, setWalletBalance] = useState(25000000);
  const [betHistory, setBetHistory] = useState<Array<{
    id: number;
    poolId: string;
    poolName: string;
    amount: number;
    timestamp: Date;
    isWin: boolean;
    blockHeight: number;
  }>>([{
    id: 1,
    poolId: 'foundry',
    poolName: 'Foundry USA',
    amount: 5000,
    timestamp: new Date(Date.now() - 3600000 * 24 * 2),
    isWin: true,
    blockHeight: 843231
  }, {
    id: 2,
    poolId: 'antpool',
    poolName: 'Antpool',
    amount: 10000,
    timestamp: new Date(Date.now() - 3600000 * 24 * 1.5),
    isWin: false,
    blockHeight: 843245
  }, {
    id: 3,
    poolId: 'f2pool',
    poolName: 'F2Pool',
    amount: 1000,
    timestamp: new Date(Date.now() - 3600000 * 24),
    isWin: true,
    blockHeight: 843260
  }, {
    id: 4,
    poolId: 'binance',
    poolName: 'Binance Pool',
    amount: 50000,
    timestamp: new Date(Date.now() - 3600000 * 12),
    isWin: false,
    blockHeight: 843279
  }, {
    id: 5,
    poolId: 'viabtc',
    poolName: 'ViaBTC',
    amount: 5000,
    timestamp: new Date(Date.now() - 3600000 * 6),
    isWin: true,
    blockHeight: 843291
  }, {
    id: 6,
    poolId: 'slushpool',
    poolName: 'Slush Pool',
    amount: 10000,
    timestamp: new Date(Date.now() - 3600000 * 3),
    isWin: false,
    blockHeight: 843301
  }, {
    id: 7,
    poolId: 'poolin',
    poolName: 'Poolin',
    amount: 500,
    timestamp: new Date(Date.now() - 3600000),
    isWin: true,
    blockHeight: 843310
  }]);
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
  const totalTime = nextBlockEstimate.estimatedTimeMinutes * 60;
  const progressPercentage = 100 - timeRemaining / totalTime * 100;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          return 8 * 60;
        }
        return prev - 1;
      });
    }, 1000);
    
    const handleBlockMined = () => {
      setTimeRemaining(8 * 60);
    };
    
    window.addEventListener(BLOCK_MINED_EVENT, handleBlockMined);
    
    return () => {
      clearInterval(timer);
      window.removeEventListener(BLOCK_MINED_EVENT, handleBlockMined);
    };
  }, []);

  useRandomInterval(() => {
    setPendingTxCount(prev => {
      const variation = Math.random() * 100 - 20;
      return Math.max(1000, Math.floor(prev + variation));
    });
    setTimeVariation(Math.random() * 1.5 - 0.75);
    setAvgBlockTime(prev => {
      const variation = Math.random() * 0.4 - 0.2;
      return Math.max(9.2, Math.min(10.5, prev + variation));
    });
  }, 3000, 8000);

  useEffect(() => {
    if (bets && Array.isArray(bets)) {
      setTotalBet(bets.reduce((sum, bet) => sum + bet.amount, 0));
    } else {
      setTotalBet(0);
    }
  }, [bets]);

  const handlePlaceBet = (poolId: string | null) => {
    if (!selectedChip) {
      toast({
        title: "Select a chip first",
        description: "Please select a chip value before placing a bet",
        variant: "destructive"
      });
      return;
    }
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
    toast({
      title: "Bet placed!",
      description: `${(selectedChip / 100000).toFixed(5)} BTC on ${poolName}`,
      variant: "default"
    });
  };

  const handleClearBets = () => {
    setBets([]);
    toast({
      title: "Bets cleared",
      description: "All your bets have been cleared",
      variant: "default"
    });
  };

  const handleCancelLastBet = () => {
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
      toast({
        title: "Withdrawal successful",
        description: "Withdrawn 0.1 BTC from your wallet",
        variant: "default"
      });
    } else {
      toast({
        title: "Insufficient funds",
        description: "You don't have enough funds to withdraw",
        variant: "destructive"
      });
    }
  };

  const handleAddBetToHistory = (poolId: string, amount: number, isWin: boolean) => {
    const pool = miningPools.find(p => p.id === poolId);
    if (!pool) return;
    
    const newBet = {
      id: betHistory.length + 1,
      poolId: poolId,
      poolName: pool?.name || 'Unknown Pool',
      amount: amount,
      timestamp: new Date(),
      isWin: isWin,
      blockHeight: currentBlock + 1
    };
    setBetHistory(prev => [newBet, ...prev]);

    if (isWin) {
      const winAmount = amount * (pool?.odds || 2);
      setWalletBalance(prev => prev + winAmount);
      toast({
        title: "Bet won!",
        description: `You won ${formatSats(winAmount)} betting on ${pool?.name}!`,
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
    const totalMinutes = nextBlockEstimate.estimatedTimeMinutes + timeVariation;
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
    setSelectedChip(value);
  };

  const handleSelectPool = (pool: MiningPool) => {
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
    switch (value) {
      case 100:
        return "bg-blue-600";
      case 500:
        return "bg-green-600";
      case 1000:
        return "bg-purple-600";
      case 5000:
        return "bg-pink-600";
      case 10000:
        return "bg-orange-600";
      case 50000:
        return "bg-red-600";
      case 100000:
        return "bg-yellow-600";
      default:
        return "bg-gray-600";
    }
  };

  const getChipSecondaryColor = (value: number) => {
    switch (value) {
      case 100:
        return "bg-blue-500";
      case 500:
        return "bg-green-500";
      case 1000:
        return "bg-purple-500";
      case 5000:
        return "bg-pink-500";
      case 10000:
        return "bg-orange-500";
      case 50000:
        return "bg-red-500";
      case 100000:
        return "bg-yellow-500";
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
    const displayBets = bets.slice(-5);
    const remainingCount = bets.length > 5 ? bets.length - 5 : 0;
    return <div className="absolute bottom-1 right-1 flex flex-col items-end">
        <div className="relative h-12 w-8">
          {displayBets.map((bet, index) => <div key={bet.id} className={cn("absolute w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-xl", getChipColor(bet.amount))} style={{
          bottom: `${index * 4}px`,
          right: `${index % 2 === 0 ? 0 : 2}px`,
          zIndex: index,
          transform: `rotate(${index * 5 - 10}deg)`
        }}>
              <div className="absolute inset-0 rounded-full border-[1.5px] border-white border-dashed"></div>
              <div className="flex items-center">
                {bet.amount >= 10000 ? `${bet.amount / 1000}k` : bet.amount}
              </div>
            </div>)}
        </div>
        
        {remainingCount > 0 && <div className="text-xs text-white/80 font-medium mt-1 bg-black/50 px-1 rounded">
            +{remainingCount} more
          </div>}
      </div>;
  };

  const renderChipSelection = () => {
    return (
      <div className={cn(
        "flex justify-center items-center px-3 my-1",
        isMobile ? "mobile-chip-selection" : "gap-3"
      )}>
        {CHIP_VALUES.map(value => (
          <div 
            key={value} 
            className={cn(
              "relative rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110 flex-shrink-0", 
              selectedChip === value ? "transform scale-110" : "transform scale-100",
              isMobile ? "w-10 h-10" : "w-14 h-14"
            )} 
            onClick={() => handleSelectChip(value)}
          >
            {selectedChip === value && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-btc-orange/60 to-yellow-500 animate-pulse blur-md -z-10 scale-110"></div>
            )}
            
            {selectedChip === value && (
              <div className="absolute inset-0 rounded-full border-2 border-btc-orange animate-pulse-subtle"></div>
            )}
            
            <div 
              className={cn(
                "relative rounded-full flex items-center justify-center font-bold text-white shadow-xl",
                getChipColor(value),
                isMobile ? "w-8 h-8" : "w-12 h-12"
              )}
            >
              <div 
                className="absolute inset-0 rounded-full border-[2.5px] border-white border-dashed"
                style={{
                  borderRadius: '50%',
                  borderStyle: 'dashed'
                }}
              ></div>
              
              <div className="absolute rounded-full border border-white/30 inset-2"></div>
              
              <span className={cn(
                "relative z-10 text-white font-bold drop-shadow-md",
                isMobile ? "text-[10px]" : "text-xs"
              )}>
                {formatChipValue(value)}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const processBetsForBlock = (blockData: any) => {
    if (!bets || bets.length === 0) return;
    
    const winningPoolId = blockData.minedBy ? 
      miningPools.find(p => 
        blockData.minedBy.toLowerCase().includes(p.id.toLowerCase()) || 
        p.id.toLowerCase().includes(blockData.minedBy.toLowerCase())
      )?.id || null 
      : null;
      
    console.log('Winning pool:', winningPoolId, 'Mined by:', blockData.minedBy);
    
    let playerHasWon = false;
    
    bets.forEach(bet => {
      const isWin = bet.poolId === winningPoolId;
      if (bet.poolId) {
        handleAddBetToHistory(bet.poolId, bet.amount, isWin);
      }
      
      if (isWin) {
        playerHasWon = true;
        const pool = miningPools.find(p => p.id === bet.poolId);
        if (pool) {
          const winAmount = Math.floor(bet.amount * pool.odds);
          setWalletBalance(prev => prev + winAmount);
          
          toast({
            title: "You won!",
            description: `Received ${formatSats(winAmount)} from your bet on ${pool.name}!`,
            variant: "default"
          });
        }
      }
    });
    
    if (playerHasWon) {
      emitPlayerWin();
    }
    
    setBets([]);
  };

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
              "relative w-6 h-6 rounded-full flex flex-col items-center justify-center text-[9px] font-bold text-white border border-white/40",
              getChipColor(chipGroup.amount)
            )}
            style={{
              zIndex: 5 - index,
              transform: `translateX(${index * 4}px)`
            }}
          >
            <div className="absolute inset-0 rounded-full border-[1.5px] border-white border-dashed"></div>
            <div className="flex flex-col items-center justify-center">
              <span className="leading-none">
                {chipGroup.amount >= 1000 ? `${chipGroup.amount / 1000}K` : chipGroup.amount}
              </span>
              {chipGroup.count > 1 && (
                <span className="text-[7px] leading-none mt-0.5">×{chipGroup.count}</span>
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
    
    return (
      <div className="space-y-3">
        <div className="flex justify-between text-white/60 text-xs border-b border-white/10 pb-2 px-1">
          <span>Mining Pool</span>
          <span>Total Bet</span>
        </div>
        
        {consolidatedBets.map((bet, index) => {
          const pool = bet.poolId ? miningPools.find(p => p.id === bet.poolId) : null;
          const poolName = pool ? pool.name : 'Empty Block';
          const potentialWin = pool ? Math.floor(bet.totalAmount * pool.odds) : Math.floor(bet.totalAmount * 80);
          
          return (
            <div key={`bet-${bet.poolId}-${index}`} className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                  {bet.poolId ? (
                    <img 
                      src={`/pool-logos/${bet.poolId}.svg`} 
                      alt={poolName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
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

  return (
    <div className="w-full">
      <div className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl mb-6 overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-btc-orange mr-1.5" />
            <div className="text-sm font-semibold">
              <span className={cn("font-semibold", getUrgencyClass())}>Next block:</span>
              <span className="text-white/70 ml-1">{formatTimeRemaining()}</span>
            </div>
          </div>
          <div className="text-xs text-white/60">
            Est. time: {estimatedTime}
          </div>
        </div>
        <Progress 
          value={progressPercentage} 
          className="h-1 rounded-none bg-btc-darker"
          indicatorClassName="bg-gradient-to-r from-btc-orange to-yellow-500"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-btc-dark border-white/5">
          <div className="p-4">
            <h2 className="box-title text-white mb-3">Step 1. Fund your Wallet</h2>
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-sm text-white/60">Balance:</div>
                <div className="text-2xl font-semibold text-white">{formatSats(walletBalance)}</div>
                <div className="text-xs text-white/60 mt-1">≈ {formatSatsToBTC(walletBalance)} BTC</div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-btc-orange/30 text-btc-orange hover:bg-btc-orange/10"
                  onClick={handleDeposit}
                >
                  <ArrowDownLeft className="h-4 w-4 mr-1" /> 
                  Deposit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-white/20 text-white hover:bg-white/5"
                  onClick={handleWithdraw}
                >
                  <ArrowUpRight className="h-4 w-4 mr-1" /> 
                  Withdraw
                </Button>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="bg-btc-dark border-white/5">
          <div className="p-4">
            <h2 className="box-title text-white mb-3">Step 2. Select chip value in Sats</h2>
            {renderChipSelection()}
          </div>
        </Card>
        
        <Card className="bg-btc-dark border-white/5">
          <div className="p-4">
            <h2 className="box-title text-white mb-2">Player stats</h2>
            <OriginTabs defaultValue="bets-in-play" className="w-full">
              <OriginTabsList className="w-full origin-tabs-list mb-4">
                <OriginTabsTrigger value="bets-in-play" className="origin-tabs-trigger">
                  Bets in play
                </OriginTabsTrigger>
                <OriginTabsTrigger value="history" className="origin-tabs-trigger">
                  History
                </OriginTabsTrigger>
                <OriginTabsTrigger value="deposit" className="origin-tabs-trigger">
                  Deposits
                </OriginTabsTrigger>
                <OriginTabsTrigger value="withdraw" className="origin-tabs-trigger">
                  Withdrawals
                </OriginTabsTrigger>
              </OriginTabsList>
              
              <OriginTabsContent value="bets-in-play" className="mt-2">
                {renderBetsInPlay()}
              </OriginTabsContent>
              
              <OriginTabsContent value="history" className="mt-2">
                <BetHistory bets={betHistory} />
              </OriginTabsContent>
              
              <OriginTabsContent value="deposit" className="mt-2">
                {deposits.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-white/60 text-sm">No deposit history</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {deposits.map((deposit) => (
                      <div key={deposit.id} className="flex justify-between items-center border-b border-white/10 pb-3">
                        <div>
                          <div className="text-sm text-white font-medium">{formatSats(deposit.amount)}</div>
                          <div className="text-xs text-white/60">{deposit.timestamp.toLocaleDateString()} {deposit.timestamp.toLocaleTimeString()}</div>
                        </div>
                        <div className="text-xs text-white/40 truncate max-w-[140px]">
                          {deposit.txId.substring(0, 8)}...
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </OriginTabsContent>
              
              <OriginTabsContent value="withdraw" className="mt-2">
                {withdrawals.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-white/60 text-sm">No withdrawal history</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {withdrawals.map((withdrawal) => (
                      <div key={withdrawal.id} className="flex justify-between items-center border-b border-white/10 pb-3">
                        <div>
                          <div className="text-sm text-white font-medium">{formatSats(withdrawal.amount)}</div>
                          <div className="text-xs text-white/60">{withdrawal.timestamp.toLocaleDateString()} {withdrawal.timestamp.toLocaleTimeString()}</div>
                        </div>
                        <div className="flex items-center">
                          <div className={cn(
                            "text-xs px-2 py-0.5 rounded-full mr-2",
                            withdrawal.status === 'completed' ? "bg-green-950 text-green-400" :
                            withdrawal.status === 'pending' ? "bg-yellow-950 text-yellow-400" :
                            "bg-red-950 text-red-400"
                          )}>
                            {withdrawal.status}
                          </div>
                          <div className="text-xs text-white/40 truncate max-w-[80px]">
                            {withdrawal.txId.substring(0, 6)}...
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </OriginTabsContent>
            </OriginTabs>
          </div>
        </Card>
      </div>
      
      <Card className="bg-btc-dark border-white/5 mb-6">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="box-title text-white">Step 3. Place your bets on mining pools</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/5"
                onClick={handleCancelLastBet}
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Undo
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/5"
                onClick={handleClearBets}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Clear
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 miners-grid-mobile">
            {miningPools.slice(0, 18).map((pool) => (
              <MiningPoolCard
                key={pool.id}
                pool={pool}
                onSelect={() => handleSelectPool(pool)}
                bets={getBetsOnPool(pool.id)}
                isMobile={isMobile}
              />
            ))}
            <div
              className={cn(
                "relative rounded-lg bg-btc-darker border border-white/5 p-3 cursor-pointer hover:bg-btc-darker/80 transition-colors",
                isMobile ? "mobile-equal-height" : "h-full"
              )}
              onClick={() => handlePlaceBet(null)}
            >
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <Server className="h-4 w-4 text-white/60" />
                </div>
                <div className="ml-2">
                  <div className="text-sm font-medium text-white">Empty Block</div>
                  <div className="text-xs text-white/60">No known pool</div>
                </div>
              </div>
              
              {!isMobile && (
                <div className="mt-3 text-center pt-1 border-t border-white/5">
                  <div className="text-xs text-white/60 mb-1">Probability:</div>
                  <div className="text-sm font-medium text-white">1.2%</div>
                </div>
              )}
              
              {!isMobile && (
                <div className="mt-3 text-center pt-1 border-t border-white/5">
                  <div className="text-xs text-white/60 mb-1">Blocks (24h):</div>
                  <div className="text-sm font-medium text-white">2</div>
                </div>
              )}
              
              {renderStackedChips(getBetsOnPool(null))}
            </div>
          </div>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Pending Transactions"
          value={pendingTxCount.toLocaleString()}
          icon={<Zap className="h-4 w-4 text-btc-orange" />}
          tooltip="Number of transactions waiting to be confirmed"
        />
        <StatCard
          title="Average Block Time"
          value={`${avgBlockTime.toFixed(1)} minutes`}
          icon={<Clock className="h-4 w-4 text-btc-orange" />}
          tooltip="Average time between blocks in the last 24 hours"
        />
        <StatCard
          title="Current Block"
          value={currentBlock.toString()}
          icon={<Server className="h-4 w-4 text-btc-orange" />}
          tooltip="The latest block mined on the Bitcoin network"
        />
      </div>
    </div>
  );
};

export default BettingGrid;
