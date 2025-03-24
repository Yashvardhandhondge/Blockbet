
import { useState, useEffect } from 'react';
import { MiningPool, miningPools, nextBlockEstimate } from '@/utils/mockData';
import { Clock, Zap, Trash2, Server, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { toast } from './ui/use-toast';
import { StatCard } from './LiveBlockData';
import { useRandomInterval } from '@/lib/animations';

const CHIP_VALUES = [1000, 5000, 10000, 50000, 100000, 500000, 1000000];

const BettingGrid = () => {
  const [selectedChip, setSelectedChip] = useState<number | null>(null);
  const [bets, setBets] = useState<{ poolId: string | null; amount: number; id: number }[]>([]);
  const [nextBetId, setNextBetId] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(nextBlockEstimate.estimatedTimeMinutes * 60);
  const [totalBet, setTotalBet] = useState(0);
  
  const [timeVariation, setTimeVariation] = useState(0);
  const [pendingTxCount, setPendingTxCount] = useState(12483);
  
  const totalTime = nextBlockEstimate.estimatedTimeMinutes * 60;
  const progressPercentage = 100 - ((timeRemaining / totalTime) * 100);
  
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
      const variation = (Math.random() * 100) - 20;
      return Math.max(1000, Math.floor(prev + variation));
    });
    
    setTimeVariation(Math.random() * 1.5 - 0.75);
  }, 3000, 8000);
  
  useEffect(() => {
    setTotalBet(bets.reduce((sum, bet) => sum + bet.amount, 0));
  }, [bets]);
  
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
    const percentageLeft = (timeRemaining / totalTime) * 100;
    
    if (percentageLeft < 20) return "text-btc-orange";
    if (percentageLeft < 50) return "text-btc-orange";
    return "text-btc-orange";
  };
  
  const handlePlaceBet = (poolId: string | null) => {
    if (!selectedChip) {
      toast({
        title: "Select a chip first",
        description: "Please select a chip value before placing a bet",
        variant: "destructive",
      });
      return;
    }
    
    setBets([...bets, { poolId, amount: selectedChip, id: nextBetId }]);
    setNextBetId(prev => prev + 1);
    
    toast({
      title: "Bet placed!",
      description: `${(selectedChip / 100000).toFixed(5)} BTC on ${poolId ? miningPools.find(p => p.id === poolId)?.name : 'Empty Block'}`,
      variant: "default",
    });
  };
  
  const handleClearBets = () => {
    setBets([]);
    toast({
      title: "Bets cleared",
      description: "All your bets have been cleared",
      variant: "default",
    });
  };
  
  const handleCancelLastBet = () => {
    if (bets.length === 0) {
      toast({
        title: "No bets to cancel",
        description: "You haven't placed any bets yet",
        variant: "destructive",
      });
      return;
    }
    
    const lastBet = bets[bets.length - 1];
    const newBets = bets.slice(0, -1);
    setBets(newBets);
    
    const poolName = lastBet.poolId 
      ? miningPools.find(p => p.id === lastBet.poolId)?.name 
      : 'Empty Block';
    
    toast({
      title: "Last bet cancelled",
      description: `Removed bet of ${(lastBet.amount / 100000).toFixed(5)} BTC on ${poolName}`,
      variant: "default",
    });
  };
  
  const handleSelectChip = (value: number) => {
    setSelectedChip(value);
  };
  
  const getPoolGradientStyle = (poolId: string): React.CSSProperties => {
    const pool = miningPools.find(p => p.id === poolId);
    if (pool) {
      return { background: pool.gradient };
    }
    return { background: 'linear-gradient(135deg, #3a3a3a, #1a1a1a)' };
  };
  
  const getBetsOnPool = (poolId: string | null) => {
    return bets.filter(bet => bet.poolId === poolId);
  };
  
  const formatBTC = (satoshis: number) => {
    return (satoshis / 100000000).toFixed(8);
  };
  
  const getPlaceholderImage = (poolId: string) => {
    const pool = miningPools.find(p => p.id === poolId);
    const firstLetter = pool?.name.charAt(0) || '?';
    
    const textColor = poolId === 'unknown' ? '#FFFFFF' : '#FFFFFF';
    
    return (
      <div className="w-full h-full flex items-center justify-center bg-white text-sm font-bold" 
           style={{ color: textColor }}>
        {firstLetter}
      </div>
    );
  };
  
  const getChipGradient = (value: number) => {
    if (value >= 500000) return "bg-gradient-to-r from-[#661919] to-[#3d1010]";
    if (value >= 50000) return "bg-gradient-to-r from-[#1e1e66] to-[#141438]";
    if (value >= 10000) return "bg-gradient-to-r from-[#1e6652] to-[#143d32]";
    return "bg-gradient-to-r from-[#7a6624] to-[#3d3312]";
  };
  
  // Function to render stacked chips on a pool
  const renderStackedChips = (bets: Array<{ id: number; amount: number }>) => {
    if (bets.length === 0) return null;
    
    // Take at most 5 chips to display (to avoid overcrowding)
    const displayBets = bets.slice(-5);
    const remainingCount = bets.length > 5 ? bets.length - 5 : 0;
    
    return (
      <div className="absolute bottom-1 right-1 flex flex-col items-end">
        {/* Stack of chips - now bottom to top */}
        <div className="relative h-12 w-8">
          {displayBets.map((bet, index) => (
            <div 
              key={bet.id}
              className={cn(
                "absolute w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg",
                getChipGradient(bet.amount)
              )}
              style={{ 
                bottom: `${index * 4}px`, 
                right: `${index % 2 === 0 ? 0 : 2}px`,
                zIndex: index,
                transform: `rotate(${(index * 5) - 10}deg)`
              }}
            >
              {bet.amount >= 1000000 ? "1M" : 
               bet.amount >= 100000 ? "100k" :
               `${bet.amount/1000}k`}
            </div>
          ))}
        </div>
        
        {/* Show count of additional chips if more than 5 */}
        {remainingCount > 0 && (
          <div className="text-xs text-white/80 font-medium mt-1 bg-black/50 px-1 rounded">
            +{remainingCount} more
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="w-full">
      <div className="flex flex-col items-center mb-6">
        <div className="px-6 py-3 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white text-xl font-bold mb-3 shadow-[0_0_15px_rgba(139,92,246,0.5)]">
          Place Your Bets
        </div>
        <p className="text-white/80 text-lg mb-4 animate-pulse-subtle">
          Predict which mining pool will mine the next block
        </p>
      </div>
      
      <div className="flex flex-wrap justify-center items-center gap-2 mb-6">
        <StatCard 
          icon={<Zap className="h-3 w-3 text-btc-orange" />}
          title="Next block"
          value={`#${miningPools[0].blocksLast24h + 1}`}
          secondaryText=""
        />
        
        <StatCard 
          icon={<Clock className="h-3 w-3 text-btc-orange" />}
          title="Est. Next Block"
          value={estimatedTime}
          secondaryText="avg"
        />
        
        <StatCard 
          icon={<Server className="h-3 w-3 text-btc-orange" />}
          title="Pending Transactions"
          value={pendingTxCount.toLocaleString()}
          secondaryText="mempool"
        />
      </div>
      
      {/* Linear buffer with label for betting time */}
      <div className="w-full mb-6 px-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-btc-orange to-orange-500 bg-clip-text text-transparent">
            BETTING CLOSES IN
          </span>
          <span className={cn("text-base font-mono font-bold", getUrgencyClass())}>
            {formatTimeRemaining()}
          </span>
        </div>
        <Progress 
          value={progressPercentage} 
          className="h-3 bg-white/10 rounded-full"
          indicatorClassName={cn(
            "transition-all duration-500 ease-linear bg-gradient-to-r from-btc-orange to-orange-500",
          )}
        />
      </div>
      
      <div className="mb-6">
        <Card className="bg-[#121212] border-white/10 p-4 rounded-xl">
          <div className="mb-4 relative">
            <div 
              className="h-16 w-full bg-gradient-to-r from-[#1c322c] to-[#0f1a18] rounded-lg flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity border-2 border-white/20"
              onClick={() => handlePlaceBet(null)}
            >
              <div className="text-white text-xl font-bold">Empty Block</div>
              
              {/* Render stacked chips for Empty Block */}
              {renderStackedChips(getBetsOnPool(null))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {miningPools.map((pool) => (
              <div 
                key={pool.id}
                className="relative h-24 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity border-2 border-white/20"
                style={{ background: pool.gradient }}
                onClick={() => handlePlaceBet(pool.id)}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                  <div className="w-8 h-8 rounded-full bg-white p-1 mb-1 overflow-hidden">
                    {getPlaceholderImage(pool.id)}
                  </div>
                  <div className="text-white font-bold text-sm">{pool.name}</div>
                  <div className="text-white/80 text-xs">{pool.hashRatePercent.toFixed(1)}% Hash</div>
                  <div className="text-yellow-300 text-xs font-bold mt-0.5">{pool.odds.toFixed(2)}x</div>
                </div>
                
                {/* Render stacked chips for each pool */}
                {renderStackedChips(getBetsOnPool(pool.id))}
              </div>
            ))}
          </div>
        </Card>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <Card className="bg-[#0a0a0a] border-white/10 p-3 rounded-xl min-w-[260px]">
          <h3 className="text-white font-medium text-sm mb-3">Select Chip Value</h3>
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {CHIP_VALUES.map(value => (
              <div
                key={value}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110",
                  selectedChip === value 
                    ? "ring-3 ring-btc-orange ring-offset-2 ring-offset-[#0a0a0a] transform scale-110" 
                    : "transform scale-100"
                )}
                onClick={() => handleSelectChip(value)}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg",
                  getChipGradient(value)
                )}>
                  {value >= 1000000 ? "1M" : 
                   value >= 100000 ? "100k" :
                   value >= 10000 ? `${value/1000}k` : 
                   value}
                </div>
              </div>
            ))}
          </div>
          
          {/* New buttons for cancelling bets */}
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center justify-center gap-1.5 border-white/10 hover:border-btc-orange/50 hover:bg-btc-orange/5"
              onClick={handleCancelLastBet}
              disabled={bets.length === 0}
            >
              <X className="w-3.5 h-3.5" />
              Cancel Last
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              className="flex items-center justify-center gap-1.5"
              onClick={handleClearBets}
              disabled={bets.length === 0}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All
            </Button>
          </div>
        </Card>
        
        <Card className="flex-1 bg-[#0a0a0a] border-white/10 p-3 rounded-xl">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-white font-medium text-sm">Your Bets</h3>
            <Button 
              variant="destructive" 
              size="sm" 
              className="flex items-center gap-1 py-1 h-auto text-xs"
              onClick={handleClearBets}
              disabled={bets.length === 0}
            >
              <Trash2 className="w-3 h-3" />
              Clear All
            </Button>
          </div>
          
          {bets.length === 0 ? (
            <div className="text-white/60 text-center py-4 text-sm">
              No bets placed yet. Select a chip and click on a mining pool to place a bet.
            </div>
          ) : (
            <>
              <div className="mb-3 space-y-1 max-h-[150px] overflow-y-auto hide-scrollbar">
                {bets.map(bet => {
                  const pool = bet.poolId ? miningPools.find(p => p.id === bet.poolId) : null;
                  return (
                    <div key={bet.id} className="flex justify-between bg-[#151515]/50 p-1.5 rounded text-xs">
                      <div className="text-white">
                        {pool ? pool.name : 'Empty Block'}
                      </div>
                      <div className="text-btc-orange font-mono">
                        {formatBTC(bet.amount)} BTC
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="pt-2 border-t border-white/10">
                <div className="flex justify-between text-white font-bold text-sm">
                  <div>Total Bet:</div>
                  <div className="text-btc-orange">{formatBTC(totalBet)} BTC</div>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default BettingGrid;
