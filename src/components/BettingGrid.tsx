import { useState, useEffect } from 'react';
import { MiningPool } from '@/utils/types';
import { miningPools, getRandomMiningPool } from '@/utils/miningPools';
import { Clock, Zap, Trash2, Server, X, ArrowDown, Wallet, History, CreditCard, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
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
            <div className="absolute inset-0 rounded-full border border-white/30 border-dashed"></div>
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
              <div className="absolute inset-1.5 rounded-full border-2 border-white/30"></div>
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
      <div className="flex flex-nowrap overflow-x-auto hide-scrollbar gap-2 justify-between px-2 mobile-chip-row">
        {CHIP_VALUES.map(value => (
          <div 
            key={value} 
            className={cn(
              "relative rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110 flex-shrink-0", 
              selectedChip === value ? "transform scale-110" : "transform scale-100",
              isMobile ? "w-10 h-10 my-1" : "w-12 h-12 my-1"
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
                "relative rounded-full flex items-center justify-center text-xs font-bold text-white shadow-xl",
                getChipColor(value),
                isMobile ? "w-8 h-8" : "w-10 h-10"
              )}
            >
              <div 
                className="absolute inset-0 rounded-full border-2 border-dashed" 
                style={{
                  borderColor: `${getChipSecondaryColor(value)}`
                }}
              ></div>
              
              <div className="absolute rounded-full border border-white/30 inset-1"></div>
              
              <span className="relative z-10 text-white font-bold drop-shadow-md text-[10px]">
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
            <div className="absolute inset-0 rounded-full border border-white/30 border-dashed"></div>
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

  return (
    <div className="w-full">
      <div className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl mb-6 overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-btc-orange mr-1.5" />
            <span className="text-xs font-medium text-white">Betting closes in:</span>
          </div>
          <div className="flex-grow mx-4 relative">
            <Progress value={progressPercentage} className="h-2 bg-white/10 rounded-full w-full" indicatorClassName="bg-gradient-to-r from-btc-orange to-yellow-500" />
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 progress-time-display">
              <span className="text-xs font-mono font-bold text-btc-orange">{formatTimeRemaining()}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="w-full bg-[#0a0a0a] border-white/10 p-4 rounded-xl h-[110px]">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-white text-sm">Step 1. Found your Wallet.</h3>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-btc-orange/10 p-2 rounded-lg mr-3">
                <Wallet className="h-5 w-5 text-btc-orange" strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-xs text-white/60">Balance</div>
                <div className="text-xs font-bold text-white">{formatSats(walletBalance)}</div>
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
            <h3 className="text-white text-sm">Step 2. Choose your chips</h3>
          </div>
          {renderChipSelection()}
        </Card>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-sm">Step 3. Place your bets on mining pools.</h3>
          <div className="flex gap-2">
            <Button variant="outline" className="border-white/10 hover:border-white/20 hover:bg-white/5 rounded-full text-xs p-1.5 h-7" onClick={handleCancelLastBet}>
              <Trash2 className="h-3.5 w-3.5 text-white/60 mr-1" />
              <span>Undo</span>
            </Button>
            <Button variant="outline" className="border-white/10 hover:border-white/20 hover:bg-white/5 rounded-full text-xs p-1.5 h-7" onClick={handleClearBets}>
              <X className="h-3.5 w-3.5 text-white/60 mr-1" />
              <span>Clear</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {miningPools.map(pool => (
            <MiningPoolCard 
              key={pool.id}
              pool={pool}
              isSelected={selectedPool?.id === pool.id}
              onSelect={() => handleSelectPool(pool)}
              className="h-[150px]"
            />
          ))}
        </div>
        
        <div className="mt-12 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white text-sm">Your Bets</h3>
            <div className="text-xs text-white/60">
              Total: {formatSats(totalBet)}
            </div>
          </div>
          
          <Card className="w-full bg-[#0a0a0a] border-white/10 p-4 rounded-xl">
            {bets && bets.length > 0 ? (
              <div className="space-y-3">
                {getConsolidatedBets().map(bet => (
                  <div key={bet.poolId || 'empty'} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                    <div className="flex items-center">
                      {bet.poolId ? (
                        <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                          {getPoolLogo(bet.poolId)}
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                          <span className="text-white text-xs">?</span>
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-white">
                          {bet.poolId ? miningPools.find(p => p.id === bet.poolId)?.name || 'Unknown' : 'Empty Block'}
                        </div>
                        <div className="text-xs text-white/60">
                          {bet.poolId ? (
                            <span>{miningPools.find(p => p.id === bet.poolId)?.odds.toFixed(2)}x odds</span>
                          ) : (
                            <span>Unknown odds</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {renderImprovedChips(bet.amounts)}
                      <div className="text-right">
                        <div className="text-sm font-semibold text-white">{formatSats(bet.totalAmount)}</div>
                        <div className="text-xs text-white/60">{formatSatsToBTC(bet.totalAmount)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-white/40">
                No active bets. Select a chip and place your bet on a mining pool.
              </div>
            )}
          </Card>
          
          <div className="mt-12">
            <OriginTabs defaultValue="history">
              <OriginTabsList className="w-full mb-4">
                <OriginTabsTrigger value="history" icon={<History className="h-4 w-4" />} className="flex-1">
                  Bet History
                </OriginTabsTrigger>
                <OriginTabsTrigger value="deposits" icon={<ArrowDownLeft className="h-4 w-4" />} className="flex-1">
                  Deposits
                </OriginTabsTrigger>
                <OriginTabsTrigger value="withdrawals" icon={<ArrowUpRight className="h-4 w-4" />} className="flex-1">
                  Withdrawals
                </OriginTabsTrigger>
              </OriginTabsList>
              <OriginTabsContent value="history">
                <BetHistory bets={betHistory} />
              </OriginTabsContent>
              <OriginTabsContent value="deposits">
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {deposits.map(deposit => (
                    <div key={deposit.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <div>
                        <div className="text-sm font-medium text-white">Deposit</div>
                        <div className="text-xs text-white/60">{deposit.timestamp.toLocaleDateString()} • #{deposit.id}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-400">+{formatSats(deposit.amount)}</div>
                        <div className="text-xs text-white/60">{formatSatsToBTC(deposit.amount)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </OriginTabsContent>
              <OriginTabsContent value="withdrawals">
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {withdrawals.map(withdrawal => (
                    <div key={withdrawal.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <div>
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-white">Withdrawal</div>
                          {withdrawal.status === 'pending' && (
                            <div className="ml-2 px-1.5 py-0.5 bg-yellow-500/10 text-yellow-500 rounded-full text-xs">
                              Pending
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-white/60">{withdrawal.timestamp.toLocaleDateString()} • #{withdrawal.id}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-red-400">-{formatSats(withdrawal.amount)}</div>
                        <div className="text-xs text-white/60">{formatSatsToBTC(withdrawal.amount)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </OriginTabsContent>
            </OriginTabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BettingGrid;
