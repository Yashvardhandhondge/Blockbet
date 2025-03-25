import { useState, useEffect } from 'react';
import { MiningPool, miningPools, nextBlockEstimate } from '@/utils/mockData';
import { Clock, Zap, Trash2, Server, X, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { toast } from './ui/use-toast';
import { StatCard } from './LiveBlockData';
import { useRandomInterval } from '@/lib/animations';
import MiningPoolCard from './MiningPoolCard';

const CHIP_VALUES = [50, 100, 500, 1000, 5000, 10000, 50000];

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
    if (value >= 10000) return "bg-red-900";
    if (value >= 5000) return "bg-blue-900";
    if (value >= 1000) return "bg-green-900";
    if (value >= 500) return "bg-purple-900";
    return "bg-yellow-900";
  };

  const getChipSecondaryColor = (value: number) => {
    if (value >= 10000) return "bg-red-800";
    if (value >= 5000) return "bg-blue-800";
    if (value >= 1000) return "bg-green-800";
    if (value >= 500) return "bg-purple-800";
    return "bg-yellow-800";
  };

  const formatChipValue = (value: number) => {
    if (value >= 10000) return `${value / 1000}K`;
    if (value >= 1000) return `${value / 1000}K`;
    return value;
  };

  const renderRouletteCasualChips = (amount: number) => {
    const chipsToRender: number[] = [];
    let remainingAmount = amount;
    const sortedChips = [...CHIP_VALUES].sort((a, b) => b - a);
    while (remainingAmount > 0) {
      const chipToUse = sortedChips.find(val => val <= remainingAmount) || sortedChips[sortedChips.length - 1];
      chipsToRender.push(chipToUse);
      remainingAmount -= chipToUse;
      if (chipsToRender.length >= 5) break;
    }
    return <div className="flex -space-x-2 mr-2">
        {chipsToRender.slice(0, 3).map((chipValue, index) => <div key={index} className={cn("relative w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white border-2 border-white", getChipColor(chipValue))} style={{
        zIndex: 5 - index
      }}>
            <div className="absolute inset-0 rounded-full border-2 border-white/30 border-dashed"></div>
            {chipValue >= 1000 ? `${chipValue / 1000}K` : chipValue}
          </div>)}
        {chipsToRender.length > 3 && <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold bg-black/50 border border-white shadow-sm">
            +{chipsToRender.length - 3}
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
              <div className="absolute inset-1.5 rounded-full border border-white/30"></div>
              <div className="absolute inset-0.5 rounded-full border-4 border-dashed" style={{
            borderColor: `${getChipSecondaryColor(bet.amount)}`
          }}></div>
              <span className="relative z-10 text-white font-bold drop-shadow-md">
                {bet.amount >= 10000 ? `${bet.amount / 1000}k` : bet.amount}
              </span>
            </div>)}
        </div>
        
        {remainingCount > 0 && <div className="text-xs text-white/80 font-medium mt-1 bg-black/50 px-1 rounded">
            +{remainingCount} more
          </div>}
      </div>;
  };

  const getConsolidatedBets = () => {
    const consolidatedBets = new Map<string | null, number>();
    bets.forEach(bet => {
      const poolKey = bet.poolId !== null ? bet.poolId : 'empty';
      const currentAmount = consolidatedBets.get(poolKey) || 0;
      consolidatedBets.set(poolKey, currentAmount + bet.amount);
    });
    const result = Array.from(consolidatedBets).map(([poolKey, amount]) => ({
      poolId: poolKey === 'empty' ? null : poolKey,
      amount
    }));
    return result;
  };

  const renderChipSelection = () => {
    return (
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {CHIP_VALUES.map(value => (
          <div 
            key={value} 
            className={cn(
              "relative w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110", 
              selectedChip === value 
                ? "transform scale-110" 
                : "transform scale-100"
            )} 
            onClick={() => handleSelectChip(value)}
          >
            {selectedChip === value && (
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-btc-orange/60 to-yellow-500/60 animate-pulse blur-md -z-10 scale-110"></div>
            )}
            
            {selectedChip === value && (
              <div className="absolute inset-0 rounded-full border-2 border-btc-orange animate-pulse-subtle"></div>
            )}
            
            <div 
              className={cn(
                "relative w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-xl", 
                getChipColor(value)
              )}
            >
              <div 
                className="absolute inset-0 rounded-full border-4 border-dashed" 
                style={{
                  borderColor: `${getChipSecondaryColor(value)}`
                }}
              ></div>
              
              <div className="absolute inset-1.5 rounded-full border-2 border-white/30"></div>
              
              <span className="relative z-10 text-white font-bold drop-shadow-md">
                {formatChipValue(value)}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return <div className="w-full">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-5xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-btc-orange to-yellow-500">
          Place Your Bets
        </h1>
        <p className="text-white/80 text-lg mb-4 animate-pulse-subtle">
          Predict which mining pool will mine the next Bitcoin block
        </p>
      </div>
      
      <div className="flex flex-wrap justify-center items-center gap-2 mb-6">
        <StatCard icon={<Zap className="h-3 w-3 text-btc-orange" />} title="Next block" value={`#${currentBlock + 1}`} secondaryText="" />
        
        <StatCard icon={<Clock className="h-3 w-3 text-btc-orange" />} title="Est. Next Block" value={estimatedTime} secondaryText="avg" />
        
        <StatCard icon={<Server className="h-3 w-3 text-btc-orange" />} title="Pending Transactions" value={pendingTxCount.toLocaleString()} secondaryText="mempool" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
        {miningPools.map(pool => <MiningPoolCard key={pool.id} pool={pool} onSelect={handleSelectPool} isSelected={selectedPool?.id === pool.id} bets={getBetsOnPool(pool.id)} />)}
        
        <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-black/80 to-black/40 border border-white/5 p-4 flex flex-col items-center justify-center min-h-[220px]">
          <div className="absolute inset-0 bg-gradient-to-br from-btc-orange/20 to-purple-500/10 opacity-30"></div>
          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <h3 className="text-2xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-btc-orange via-yellow-500 to-btc-orange animate-pulse-subtle">
              Place Your Bets!
            </h3>
            <p className="text-white/70 text-sm mb-4">
              Select mining pool & win BTC
            </p>
            <div className="animate-bounce mt-2">
              <ArrowDown className="h-6 w-6 text-btc-orange" />
            </div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-btc-orange/5 to-purple-500/5 animate-pulse-slow blur-xl"></div>
          </div>
        </div>
      </div>
      
      <div className="w-full mb-6 px-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-lg font-extrabold tracking-tight text-white text-xl font-bold mb-3">Betting closes in:</span>
          <span className={cn("text-base font-mono font-bold", getUrgencyClass())}>
            {formatTimeRemaining()}
          </span>
        </div>
        <Progress value={progressPercentage} className="h-3 bg-white/10 rounded-full" indicatorClassName={cn("transition-all duration-500 ease-linear bg-gradient-to-r from-btc-orange to-orange-500")} />
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <Card className="flex-1 bg-[#0a0a0a] border-white/10 p-3 rounded-xl">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-white font-medium text-sm">Your Bets</h3>
            <Button variant="outline" size="sm" className="flex items-center gap-1 py-1 h-auto text-xs border-btc-orange/20 bg-btc-orange/5 text-white hover:bg-btc-orange/10 hover:border-btc-orange/30" onClick={handleClearBets} disabled={bets.length === 0}>
              <Trash2 className="w-3 h-3" />
              Clear All
            </Button>
          </div>
          
          {bets.length === 0 ? <div className="text-white/60 text-center py-4 text-sm">
              No bets placed yet. Select a chip and click on a mining pool to place a bet.
            </div> : <>
              <div className="mb-3 space-y-1 max-h-[150px] overflow-y-auto hide-scrollbar">
                {getConsolidatedBets().map((consolidatedBet, index) => {
              const pool = consolidatedBet.poolId ? miningPools.find(p => p.id === consolidatedBet.poolId) : null;
              return <div key={index} className="flex justify-between items-center bg-[#151515]/50 p-1.5 rounded text-xs">
                      <div className="text-white">
                        {pool ? pool.name : 'Empty Block'}
                      </div>
                      <div className="flex items-center">
                        {renderRouletteCasualChips(consolidatedBet.amount)}
                        <div className="text-btc-orange font-mono">
                          {formatSats(consolidatedBet.amount)}
                        </div>
                      </div>
                    </div>;
            })}
              </div>
              
              <div className="pt-2 border-t border-white/10">
                <div className="flex justify-between text-white font-bold text-sm">
                  <div>Total Bet:</div>
                  <div className="text-btc-orange">{formatSats(totalBet)}</div>
                </div>
              </div>
            </>}
        </Card>
        
        <Card className="bg-[#0a0a0a] border-white/10 p-3 rounded-xl min-w-[260px]">
          <h3 className="text-white font-medium text-sm mb-3">Select Chip Value</h3>
          {renderChipSelection()}
          
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="flex items-center justify-center gap-1.5 border-btc-orange/20 bg-btc-orange/5 text-white hover:bg-btc-orange/10 hover:border-btc-orange/30" onClick={handleCancelLastBet} disabled={bets.length === 0}>
              <X className="w-3.5 h-3.5" />
              Cancel Last
            </Button>
            <Button variant="outline" size="sm" className="flex items-center justify-center gap-1.5 border-btc-orange/20 bg-btc-orange/5 text-white hover:bg-btc-orange/10 hover:border-btc-orange/30" onClick={handleClearBets} disabled={bets.length === 0}>
              <Trash2 className="w-3.5 h-3.5" />
              Clear All
            </Button>
          </div>
        </Card>
      </div>
    </div>;
};

export default BettingGrid;
