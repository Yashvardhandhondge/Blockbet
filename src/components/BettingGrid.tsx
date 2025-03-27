
import { useState, useEffect } from 'react';
import { MiningPool, miningPools, nextBlockEstimate } from '@/utils/mockData';
import { Clock, Zap, Trash2, Server, X, ArrowDown, Wallet, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { toast } from './ui/use-toast';
import StatCard from './StatCard';
import { useRandomInterval } from '@/lib/animations';
import MiningPoolCard from './MiningPoolCard';
import LiveBlockData from './LiveBlockData';
import { useIsMobile } from '@/hooks/use-mobile';
import BetHistory from './BetHistory';
import { formatSatsToBTC, formatSats, emitPlayerWin } from '@/utils/formatters';

const CHIP_VALUES = [100, 500, 1000, 5000, 10000, 50000, 100000];

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
  const [currentBlock, setCurrentBlock] = useState(miningPools[0].blocksLast24h);
  const [avgBlockTime, setAvgBlockTime] = useState(9.8);
  const [walletBalance, setWalletBalance] = useState(25000000); // 0.25 BTC in satoshis
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
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          return nextBlockEstimate.estimatedTimeMinutes * 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
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
    setTotalBet(bets.reduce((sum, bet) => sum + bet.amount, 0));
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
    setBets([...bets, {
      poolId,
      amount: selectedChip,
      id: nextBetId
    }]);
    setNextBetId(prev => prev + 1);
    toast({
      title: "Bet placed!",
      description: `${(selectedChip / 100000).toFixed(5)} BTC on ${poolId ? miningPools.find(p => p.id === poolId)?.name : 'Empty Block'}`,
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
    if (bets.length === 0) {
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
    const poolName = lastBet.poolId ? miningPools.find(p => p.id === lastBet.poolId)?.name : 'Empty Block';
    toast({
      title: "Last bet cancelled",
      description: `Removed bet of ${(lastBet.amount / 100000).toFixed(5)} BTC on ${poolName}`,
      variant: "default"
    });
  };

  const handleDeposit = () => {
    const newBalance = walletBalance + 10000000; // Add 0.1 BTC
    setWalletBalance(newBalance);

    // Add deposit to history
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
      const newBalance = walletBalance - 10000000; // Withdraw 0.1 BTC
      setWalletBalance(newBalance);

      // Add withdrawal to history
      const newWithdrawal = {
        id: withdrawals.length + 1,
        amount: 10000000,
        timestamp: new Date(),
        txId: Array(32).fill(0).map(() => Math.random().toString(36).charAt(2)).join(''),
        status: 'pending' as const
      };
      setWithdrawals([newWithdrawal, ...withdrawals]);

      // Simulate withdrawal completing after 5 seconds
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

    // Update wallet balance based on bet outcome
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
    const logoMap: Record<string, string> = {
      'foundry': '/pool-logos/foundryusa.png',
      'antpool': '/Antpool Bitcoin Explorer.svg',
      'f2pool': '/Bitcoin Explorer f2pool.svg',
      'binance': '/Binance Pool.svg',
      'viabtc': '/Viabtc Bitcoin Explorer.svg',
      'slushpool': '/Mempool Bitcoin Explorer.svg',
      'poolin': '/pool-logos/poolin.svg',
      'btc-com': '/Bitcoin Explorer.svg',
      'genesis': '/pool-logos/genesisdigitalassets.svg',
      'bitfury': '/pool-logos/bitfury.svg',
      'kanopool': '/pool-logos/kanopool.svg',
      'pegapool': '/Spiderpool Bitcoin Explorer.svg',
      'emcd': '/Luxor Bitcoin Explorer.svg',
      'unknown': '/Mempool Bitcoin Explorer (2).svg'
    };
    const logoPath = logoMap[poolId] || '/Mempool Bitcoin Explorer (2).svg';
    return <div className="w-full h-full flex items-center justify-center bg-white rounded-full overflow-hidden p-0.5">
        <img src={logoPath} alt={`${poolId} logo`} className="w-full h-full object-contain" onError={e => {
        console.log(`Error loading logo for ${poolId}: ${logoPath}`);
        e.currentTarget.src = '/Mempool Bitcoin Explorer (2).svg';
      }} />
      </div>;
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
    return bets.filter(bet => bet.poolId === poolId);
  };

  const formatBTC = (satoshis: number) => {
    return (satoshis / 100000000).toFixed(8);
  };

  const formatSats = (satoshis: number) => {
    return satoshis.toLocaleString() + " sats";
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
    const isMobile = window.innerWidth < 768;
    return <div className={cn("flex flex-wrap gap-2 justify-center mb-4", isMobile ? "flex-nowrap overflow-x-auto hide-scrollbar pb-2 pt-1 px-1" : "")}>
        {CHIP_VALUES.map(value => <div key={value} className={cn("relative rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110", selectedChip === value ? "transform scale-110" : "transform scale-100", isMobile ? "w-9 h-9 flex-shrink-0 my-1" : "w-14 h-14")} onClick={() => handleSelectChip(value)}>
            {selectedChip === value && <div className="absolute inset-0 rounded-full bg-gradient-to-r from-btc-orange/60 to-yellow-500/60 animate-pulse blur-md -z-10 scale-110"></div>}
            
            {selectedChip === value && <div className="absolute inset-0 rounded-full border-2 border-btc-orange animate-pulse-subtle"></div>}
            
            <div className={cn("relative rounded-full flex items-center justify-center text-xs font-bold text-white shadow-xl", getChipColor(value), isMobile ? "w-8 h-8" : "w-12 h-12")}>
              <div className="absolute inset-0 rounded-full border-2 border-dashed" style={{
            borderColor: `${getChipSecondaryColor(value)}`
          }}></div>
              
              <div className={cn("absolute rounded-full border border-white/30", isMobile ? "inset-0.5" : "inset-1.5")}></div>
              
              <span className={cn("relative z-10 text-white font-bold drop-shadow-md", isMobile ? "text-[9px]" : "")}>
                {formatChipValue(value)}
              </span>
            </div>
          </div>)}
      </div>;
  };

  const renderBetControlButtons = () => {
    return <div className="flex gap-2 justify-end">
        <Button variant="outline" size="sm" className="flex items-center gap-1 py-1 h-auto text-xs border-btc-orange/20 bg-btc-orange/5 text-white hover:bg-btc-orange/10 hover:border-btc-orange/30" onClick={handleCancelLastBet} disabled={bets.length === 0}>
          <X className="w-3 h-3" />
          Cancel Last
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-1 py-1 h-auto text-xs border-btc-orange/20 bg-btc-orange/5 text-white hover:bg-btc-orange/10 hover:border-btc-orange/30" onClick={handleClearBets} disabled={bets.length === 0}>
          <Trash2 className="w-3 h-3" />
          Clear All
        </Button>
      </div>;
  };

  const formatBTCAmount = (satoshis: number) => {
    return (satoshis / 100000000).toFixed(8) + " BTC";
  };

  const formatSatsAmount = (satoshis: number) => {
    return satoshis.toLocaleString() + " sats";
  };

  const processBetsForBlock = (blockData: any) => {
    if (bets.length === 0) return;
    
    const winningPoolId = blockData.minedBy ? 
      miningPools.find(p => 
        blockData.minedBy.toLowerCase().includes(p.id.toLowerCase()) || 
        p.id.toLowerCase().includes(blockData.minedBy.toLowerCase())
      )?.id || null 
      : null;
      
    console.log('Winning pool:', winningPoolId, 'Mined by:', blockData.minedBy);
    
    // Track if the player has any winning bets
    let playerHasWon = false;
    
    // Process each bet
    bets.forEach(bet => {
      const isWin = bet.poolId === winningPoolId;
      handleAddBetToHistory(bet.poolId || 'unknown', bet.amount, isWin);
      
      if (isWin) {
        playerHasWon = true;
        // Find pool to get odds
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
    
    // Only emit the win event if the player actually won
    if (playerHasWon) {
      emitPlayerWin();
    }
    
    // Clear bets after processing
    setBets([]);
  };

  return <div className="w-full">
      <div className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl mb-6 overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-btc-orange mr-1.5" />
            <span className="text-xs font-medium text-white">Betting closes in:</span>
          </div>
          <div className="flex-grow mx-4 relative">
            <Progress value={progressPercentage} className="h-2 bg-white/10 rounded-full w-full" indicatorClassName="bg-gradient-to-r from-btc-orange to-yellow-500" />
            <span className="absolute right-0 top-1/2 transform -translate-y-1/2 text-xs font-mono font-bold text-btc-orange">{formatTimeRemaining()}</span>
          </div>
        </div>
      </div>
      
      <Card className="w-full bg-[#0a0a0a] border-white/10 p-4 rounded-xl mb-6">
        <h3 className="text-white text-sm mb-3">Step 1. Found your Wallet.</h3>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center mb-3 md:mb-0">
            <div className="bg-btc-orange/10 p-2 rounded-lg mr-3">
              <Wallet className="h-6 w-6 text-btc-orange" strokeWidth={1.5} />
            </div>
            <div>
              <div className="text-xs text-white/60">Balance</div>
              <div className="text-lg font-bold text-white">{formatSatsAmount(walletBalance)}</div>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto justify-end">
            <Button variant="outline" className="flex-1 md:flex-initial bg-btc-orange hover:bg-btc-orange/80 text-black border-btc-orange/50 hover:border-btc-orange/70 rounded-full text-xs py-1 h-8 md:text-sm md:py-2 md:h-auto" onClick={handleDeposit}>
              Deposit
            </Button>
            <Button variant="outline" className="flex-1 md:flex-initial border-btc-orange/20 bg-btc-orange/5 text-white hover:bg-btc-orange/10 hover:border-btc-orange/30 rounded-full text-xs py-1 h-8 md:text-sm md:py-2 md:h-auto" onClick={handleWithdraw}>
              Withdraw
            </Button>
          </div>
        </div>
      </Card>
      
      <Card className="w-full bg-[#0a0a0a] border-white/10 p-3 rounded-xl mb-6 relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
          <h3 className="text-white text-sm mb-2 md:mb-0">Step 2: Select chip value in sats.</h3>
        </div>
        <div className="px-0 py-2">
          {renderChipSelection()}
        </div>
        {isMobile && <div className="absolute bottom-3 right-3 flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1 py-1 h-7 text-[10px] border-btc-orange/20 bg-btc-orange/5 text-white hover:bg-btc-orange/10 hover:border-btc-orange/30" onClick={handleCancelLastBet} disabled={bets.length === 0}>
              <X className="w-2.5 h-2.5" />
              Cancel
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1 py-1 h-7 text-[10px] border-btc-orange/20 bg-btc-orange/5 text-white hover:bg-btc-orange/10 hover:border-btc-orange/30" onClick={handleClearBets} disabled={bets.length === 0}>
              <Trash2 className="w-2.5 h-2.5" />
              Clear
            </Button>
          </div>}
        {!isMobile && <div className="flex justify-end">
            {renderBetControlButtons()}
          </div>}
      </Card>
      
      <Card className="w-full bg-[#0a0a0a] border-white/10 p-4 rounded-xl mb-6">
        <h3 className="text-white text-sm mb-3">Step 3: Place Your Bets On Mining Pools</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {miningPools.slice(0, 10).map(pool => (
            <MiningPoolCard 
              key={pool.id}
              pool={pool}
              onSelect={handleSelectPool}
              isSelected={selectedPool?.id === pool.id}
              bets={getBetsOnPool(pool.id)}
            />
          ))}
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="w-full h-full bg-[#0a0a0a] border-white/10 p-4 rounded-xl">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-white text-sm">Your Bets</h3>
            <div className="text-xs text-white/60">
              Total: {formatSats(totalBet)}
            </div>
          </div>
          
          {bets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="text-white/40 mb-2">No bets placed yet</div>
              <div className="text-xs text-white/30 max-w-xs">
                Select a chip value and click on a mining pool to place a bet
              </div>
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {getConsolidatedBets().map((consolidatedBet, index) => {
                const pool = miningPools.find(p => p.id === consolidatedBet.poolId);
                return (
                  <div 
                    key={`bet-${consolidatedBet.poolId || 'empty'}-${index}`}
                    className="flex items-center justify-between p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                        {consolidatedBet.poolId ? 
                          getPoolLogo(consolidatedBet.poolId) : 
                          <div className="w-full h-full bg-gray-800 flex items-center justify-center text-xs text-white/70">
                            Empty
                          </div>
                        }
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">
                          {consolidatedBet.poolId ? 
                            pool?.name || 'Unknown Pool' : 
                            'Empty Block'
                          }
                        </div>
                        <div className="text-xs text-white/60">
                          {consolidatedBet.poolId && pool ? 
                            `${pool.odds.toFixed(2)}x payout` : 
                            '50x payout'
                          }
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      {renderRouletteCasualChips(consolidatedBet.amounts)}
                      <div className="text-right">
                        <div className="text-sm font-medium text-white">
                          {formatSats(consolidatedBet.totalAmount)}
                        </div>
                        <div className="text-xs text-white/60">
                          {formatSatsToBTC(consolidatedBet.totalAmount)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
        
        <LiveBlockData 
          processBets={processBetsForBlock}
          pendingTransactions={pendingTxCount}
          averageBlockTime={avgBlockTime.toFixed(1)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="w-full bg-[#0a0a0a] border-white/10 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-sm">Bet History</h3>
            <Button variant="outline" size="sm" className="h-7 py-0 px-2 border-white/10 text-white/60 text-xs hover:bg-white/5">
              <History className="h-3 w-3 mr-1" />
              View All
            </Button>
          </div>
          
          <BetHistory bets={betHistory.slice(0, 5)} />
        </Card>
        
        <Card className="w-full bg-[#0a0a0a] border-white/10 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-sm">Transaction History</h3>
            <Button variant="outline" size="sm" className="h-7 py-0 px-2 border-white/10 text-white/60 text-xs hover:bg-white/5">
              <History className="h-3 w-3 mr-1" />
              View All
            </Button>
          </div>
          
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {/* Deposits */}
            {deposits.slice(0, 2).map(deposit => (
              <div 
                key={`deposit-${deposit.id}`}
                className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center mr-3">
                    <ArrowDown className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">
                      Deposit
                    </div>
                    <div className="text-xs text-white/60">
                      {deposit.timestamp.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-green-500">
                    +{formatSats(deposit.amount)}
                  </div>
                  <div className="text-xs text-white/60 truncate max-w-[150px]">
                    {deposit.txId.substring(0, 6)}...{deposit.txId.substring(deposit.txId.length - 6)}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Withdrawals */}
            {withdrawals.slice(0, 2).map(withdrawal => (
              <div 
                key={`withdrawal-${withdrawal.id}`}
                className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-500/10 rounded-full flex items-center justify-center mr-3">
                    <ArrowDown className="h-4 w-4 text-red-500 transform rotate-180" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white flex items-center">
                      Withdrawal
                      {withdrawal.status === 'pending' && (
                        <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-yellow-500/20 text-yellow-500 rounded-full">
                          Pending
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-white/60">
                      {withdrawal.timestamp.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-red-500">
                    -{formatSats(withdrawal.amount)}
                  </div>
                  <div className="text-xs text-white/60 truncate max-w-[150px]">
                    {withdrawal.txId.substring(0, 6)}...{withdrawal.txId.substring(withdrawal.txId.length - 6)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>;
};

export default BettingGrid;
