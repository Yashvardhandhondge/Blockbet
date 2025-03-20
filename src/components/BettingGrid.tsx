
import { useState, useEffect } from 'react';
import { MiningPool, miningPools, nextBlockEstimate } from '@/utils/mockData';
import { Clock, Zap, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { toast } from './ui/use-toast';

// Chip denominations in satoshis
const CHIP_VALUES = [1000, 5000, 10000, 50000, 100000, 500000, 1000000];

const BettingGrid = () => {
  const [selectedChip, setSelectedChip] = useState<number | null>(null);
  const [bets, setBets] = useState<{ poolId: string | null; amount: number; id: number }[]>([]);
  const [nextBetId, setNextBetId] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(nextBlockEstimate.estimatedTimeMinutes * 60);
  const [totalBet, setTotalBet] = useState(0);
  
  // Update time remaining for simulated countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          // Reset timer when it reaches zero
          return nextBlockEstimate.estimatedTimeMinutes * 60;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Update total bet amount when bets change
  useEffect(() => {
    setTotalBet(bets.reduce((sum, bet) => sum + bet.amount, 0));
  }, [bets]);
  
  // Format remaining time
  const formatTimeRemaining = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Calculate urgency based on time remaining
  const getUrgencyClass = () => {
    const totalTime = nextBlockEstimate.estimatedTimeMinutes * 60;
    const percentageLeft = (timeRemaining / totalTime) * 100;
    
    if (percentageLeft < 20) return "text-red-500";
    if (percentageLeft < 50) return "text-yellow-500";
    return "text-green-500";
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
  
  const handleSelectChip = (value: number) => {
    setSelectedChip(value);
  };
  
  const getPoolGradientStyle = (poolId: string): React.CSSProperties => {
    const pool = miningPools.find(p => p.id === poolId);
    switch (poolId) {
      case 'foundry':
        return { background: 'linear-gradient(135deg, #ff8a00, #da1b60)' };
      case 'antpool':
        return { background: 'linear-gradient(135deg, #ff416c, #ff4b2b)' };
      case 'sbicrypto':
        return { background: 'linear-gradient(135deg, #4776e6, #8e54e9)' };
      case 'f2pool':
        return { background: 'linear-gradient(135deg, #2193b0, #6dd5ed)' };
      case 'binance':
        return { background: 'linear-gradient(135deg, #f7971e, #ffd200)' };
      case 'viabtc':
        return { background: 'linear-gradient(135deg, #56ab2f, #a8e063)' };
      case 'whitepool':
        return { background: 'linear-gradient(135deg, #9b87f5, #7e69ab)' };
      case 'slushpool':
        return { background: 'linear-gradient(135deg, #0ea5e9, #1eaedb)' };
      case 'poolin':
        return { background: 'linear-gradient(135deg, #16a085, #2ecc71)' };
      case 'unknown':
      default:
        return { background: 'linear-gradient(135deg, #485563, #29323c)' };
    }
  };
  
  // Calculate total number of chips placed on a pool
  const getBetsOnPool = (poolId: string | null) => {
    return bets.filter(bet => bet.poolId === poolId);
  };
  
  // Format satoshis to BTC
  const formatBTC = (satoshis: number) => {
    return (satoshis / 100000000).toFixed(8);
  };
  
  // Get placeholder image based on pool id
  const getPlaceholderImage = (poolId: string) => {
    // Return a colored circle with the first letter of the pool name
    const pool = miningPools.find(p => p.id === poolId);
    const firstLetter = pool?.name.charAt(0) || '?';
    
    return (
      <div className="w-full h-full flex items-center justify-center bg-white text-sm font-bold" 
           style={{ color: poolId === 'foundry' ? '#ff8a00' : 
                          poolId === 'antpool' ? '#ff416c' :
                          poolId === 'sbicrypto' ? '#4776e6' :
                          poolId === 'f2pool' ? '#2193b0' :
                          poolId === 'binance' ? '#f7971e' :
                          poolId === 'viabtc' ? '#56ab2f' :
                          poolId === 'whitepool' ? '#9b87f5' :
                          poolId === 'slushpool' ? '#0ea5e9' :
                          poolId === 'poolin' ? '#16a085' : '#485563' }}>
        {firstLetter}
      </div>
    );
  };
  
  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-2 md:space-y-0">
        <div>
          <h2 className="text-xl font-bold text-white">Place Your Bets</h2>
          <p className="text-white/60 text-sm mt-1">Predict which mining pool will mine the next block</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="glass-panel rounded-lg px-3 py-1 flex items-center">
            <Clock className="h-3 w-3 text-btc-orange mr-1" />
            <span className="text-xs">Betting closes in </span>
            <span className={cn("ml-1 font-mono font-bold text-xs", getUrgencyClass())}>
              {formatTimeRemaining()}
            </span>
          </div>
          
          <div className="glass-panel rounded-lg px-3 py-1 flex items-center">
            <Zap className="h-3 w-3 text-btc-orange mr-1" />
            <span className="text-xs">Next block: </span>
            <span className="ml-1 font-mono font-medium text-xs">#{miningPools[0].blocksLast24h + 1}</span>
          </div>
        </div>
      </div>
      
      {/* Roulette table */}
      <div className="mb-6">
        <Card className="bg-btc-dark border-white/10 p-4 rounded-xl">
          {/* Zero slot */}
          <div className="mb-4 relative">
            <div 
              className="h-16 w-full bg-gradient-to-r from-green-600 to-green-800 rounded-lg flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity border-2 border-white/20"
              onClick={() => handlePlaceBet(null)}
            >
              <div className="text-white text-xl font-bold">Empty Block</div>
              
              {/* Show chips placed on empty block */}
              <div className="absolute top-1 right-1 flex flex-wrap justify-end gap-1 max-w-[120px]">
                {getBetsOnPool(null).map((bet) => (
                  <div 
                    key={bet.id}
                    className="w-6 h-6 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg"
                  >
                    {bet.amount / 1000}k
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Mining pool slots */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {miningPools.map((pool) => (
              <div 
                key={pool.id}
                className="relative h-24 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity border-2 border-white/20"
                style={getPoolGradientStyle(pool.id)}
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
                
                {/* Show chips placed on this pool */}
                <div className="absolute top-1 right-1 flex flex-wrap justify-end gap-1 max-w-[60px]">
                  {getBetsOnPool(pool.id).map((bet) => (
                    <div 
                      key={bet.id}
                      className="w-6 h-6 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg"
                    >
                      {bet.amount / 1000}k
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      
      {/* Chip rack and bet controls */}
      <div className="flex flex-col md:flex-row gap-4 items-start">
        {/* Chip rack */}
        <Card className="bg-btc-darker border-white/10 p-3 rounded-xl min-w-[260px]">
          <h3 className="text-white font-medium text-sm mb-3">Select Chip Value</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {CHIP_VALUES.map(value => (
              <div
                key={value}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110",
                  selectedChip === value 
                    ? "ring-3 ring-btc-orange ring-offset-2 ring-offset-btc-darker transform scale-110" 
                    : "transform scale-100"
                )}
                onClick={() => handleSelectChip(value)}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold bg-gradient-to-r border-2 border-white shadow-lg",
                  value >= 500000 ? "from-red-500 to-red-700" :
                  value >= 50000 ? "from-blue-500 to-blue-700" :
                  value >= 10000 ? "from-green-500 to-green-700" :
                  "from-yellow-400 to-yellow-600"
                )}>
                  {value >= 1000000 ? "1M" : 
                   value >= 100000 ? "100k" :
                   value >= 10000 ? `${value/1000}k` : 
                   value}
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        {/* Bet summary */}
        <Card className="flex-1 bg-btc-darker border-white/10 p-3 rounded-xl">
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
                    <div key={bet.id} className="flex justify-between bg-btc-dark/50 p-1.5 rounded text-xs">
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
