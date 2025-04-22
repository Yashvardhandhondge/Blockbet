
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, ChevronUp, CircleDollarSign, X } from 'lucide-react';
import { MiningPool } from '@/utils/types';
import { miningPools, updateMiningPoolsWithApiData } from '@/utils/miningPools';
import { fetchMiningPoolStats } from '@/api/miningPoolStatsApi';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AuroraContainer } from '@/components/ui/aurora-container';
import WinConfetti from '@/components/WinConfetti';
import MiningPoolCard from '@/components/MiningPoolCard';
import { useAuth } from '@/context/AuthContext';
import { placeBet, getBetHistory } from '@/services/betHistoryService';

const CARD_GRID_CLASSES = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-4',
  5: 'grid-cols-1 md:grid-cols-5',
  6: 'grid-cols-2 md:grid-cols-3',
  8: 'grid-cols-2 md:grid-cols-4',
  9: 'grid-cols-3',
  10: 'grid-cols-2 md:grid-cols-5',
  12: 'grid-cols-3 md:grid-cols-4',
  15: 'grid-cols-3 md:grid-cols-5',
  16: 'grid-cols-4',
  20: 'grid-cols-4 md:grid-cols-5',
  all: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7'
};

type BetChip = {
  id: number;
  amount: number;
  poolId: string;
};

type BetResult = {
  winningPool: MiningPool | null;
  wonAmount: number;
  betAmount: number;
  multiplier: number;
  timestamp: number;
};

const BettingGrid = () => {
  const [availablePools, setAvailablePools] = useState<MiningPool[]>([]);
  const [selectedPool, setSelectedPool] = useState<MiningPool | null>(null);
  const [betAmount, setBetAmount] = useState<number>(1000);
  const [userBalance, setUserBalance] = useState<number>(100000);
  const [bets, setBets] = useState<BetChip[]>([]);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [spinResult, setSpinResult] = useState<BetResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [previousWins, setPreviousWins] = useState<BetResult[]>([]);
  const [isLoadingPools, setIsLoadingPools] = useState<boolean>(true);
  const spinTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resultTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();

  // Fetch and update pools from API
  useEffect(() => {
    const fetchPoolData = async () => {
      try {
        setIsLoadingPools(true);
        const apiPoolStats = await fetchMiningPoolStats();
        const updatedPools = updateMiningPoolsWithApiData(apiPoolStats);
        console.log('Updated pools with dynamic multipliers:', updatedPools);
        setAvailablePools(updatedPools);
      } catch (error) {
        console.error('Error fetching pool data:', error);
        // Fallback to static data if API fails
        setAvailablePools(miningPools);
      } finally {
        setIsLoadingPools(false);
      }
    };

    fetchPoolData();
    
    // Set up interval to periodically refresh pool data
    const intervalId = setInterval(fetchPoolData, 60000); // Refresh every minute
    
    // Listen for new block events to update pool data
    const handleNewBlock = () => {
      console.log('New block detected, updating pool data');
      fetchPoolData();
    };
    
    window.addEventListener('new-block', handleNewBlock);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('new-block', handleNewBlock);
      
      if (spinTimeoutRef.current) {
        clearTimeout(spinTimeoutRef.current);
      }
      
      if (resultTimeoutRef.current) {
        clearTimeout(resultTimeoutRef.current);
      }
    };
  }, []);

  // Load user balance and bet history when authenticated
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      // Load user balance
      const fetchUserBalance = async () => {
        try {
          // In a real implementation, this would be an API call to get user balance
          // For now, we're just using a mock value
          setUserBalance(100000);
        } catch (error) {
          console.error('Error fetching user balance:', error);
        }
      };
      
      // Load previous bets
      const fetchPreviousBets = async () => {
        try {
          const history = await getBetHistory();
          const formattedHistory = history.map(bet => ({
            winningPool: availablePools.find(p => p.id === bet.winningPoolId) || null,
            wonAmount: bet.winAmount,
            betAmount: bet.betAmount,
            multiplier: bet.odds,
            timestamp: new Date(bet.timestamp).getTime()
          }));
          setPreviousWins(formattedHistory);
        } catch (error) {
          console.error('Error fetching bet history:', error);
        }
      };
      
      fetchUserBalance();
      fetchPreviousBets();
    }
  }, [isAuthenticated, currentUser, availablePools]);

  const handlePoolSelect = (pool: MiningPool) => {
    if (isSpinning) return;
    setSelectedPool(pool);
  };

  const handleBetAmountChange = (value: string) => {
    setBetAmount(Number(value));
  };

  const placeBetOnPool = () => {
    if (!selectedPool || isSpinning || isSubmitting) return;
    
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to place bets",
        variant: "destructive"
      });
      
      navigate('/auth');
      return;
    }
    
    if (betAmount > userBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance to place this bet",
        variant: "destructive"
      });
      return;
    }
    
    // Add new bet
    const newBet = {
      id: Date.now(),
      amount: betAmount,
      poolId: selectedPool.id
    };
    
    setBets(prev => [...prev, newBet]);
    setUserBalance(prev => prev - betAmount);
    
    toast({
      title: "Bet Placed",
      description: `${betAmount} sats on ${selectedPool.name}`,
      variant: "default"
    });
  };

  const removeBet = (betId: number) => {
    if (isSpinning) return;
    
    const betToRemove = bets.find(bet => bet.id === betId);
    if (betToRemove) {
      setBets(prev => prev.filter(bet => bet.id !== betId));
      setUserBalance(prev => prev + betToRemove.amount);
      
      toast({
        title: "Bet Removed",
        description: `${betToRemove.amount} sats returned to balance`,
        variant: "default"
      });
    }
  };

  const spinWheel = async () => {
    if (bets.length === 0 || isSpinning) return;
    
    try {
      setIsSpinning(true);
      setIsSubmitting(true);
      
      // Calculate total bet amount
      const totalBetAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);
      
      // Get a random winning pool
      const winningPool = availablePools[Math.floor(Math.random() * availablePools.length)];
      
      // Calculate winnings
      const winningBets = bets.filter(bet => bet.poolId === winningPool.id);
      const totalWinAmount = winningBets.reduce(
        (sum, bet) => sum + bet.amount * winningPool.odds, 0
      );
      
      console.log(`Spin result: ${winningPool.name} (${winningPool.odds}x)`);
      console.log(`Winning bets: ${winningBets.length}, total win: ${totalWinAmount}`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Store result before spinning animation
      const result: BetResult = {
        winningPool,
        wonAmount: totalWinAmount,
        betAmount: totalBetAmount,
        multiplier: winningPool.odds,
        timestamp: Date.now()
      };
      
      // Record bet in history if authenticated
      if (isAuthenticated && currentUser) {
        try {
          await placeBet({
            userId: currentUser.id,
            betAmount: totalBetAmount,
            winAmount: totalWinAmount,
            odds: winningPool.odds,
            winningPoolId: winningPool.id,
            timestamp: new Date().toISOString()
          });
        } catch (error) {
          console.error('Error recording bet history:', error);
        }
      }
      
      setIsSubmitting(false);
      
      // Start the spinning animation (3 seconds)
      spinTimeoutRef.current = setTimeout(() => {
        // Set the result and update user balance
        setSpinResult(result);
        setShowResult(true);
        setUserBalance(prev => prev + totalWinAmount);
        
        if (totalWinAmount > 0) {
          setPreviousWins(prev => [result, ...prev]);
        }
        
        // Reset after showing result (5 seconds)
        resultTimeoutRef.current = setTimeout(() => {
          setIsSpinning(false);
          setShowResult(false);
          setSpinResult(null);
          setBets([]);
        }, 5000);
      }, 3000);
    } catch (error) {
      console.error('Error during spin:', error);
      setIsSpinning(false);
      setIsSubmitting(false);
      
      toast({
        title: "Error",
        description: "Something went wrong while spinning. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Get all pools that have bets placed on them
  const poolsWithBets = bets.reduce<Record<string, BetChip[]>>((acc, bet) => {
    if (!acc[bet.poolId]) {
      acc[bet.poolId] = [];
    }
    acc[bet.poolId].push(bet);
    return acc;
  }, {});

  // Get all unique pool IDs that have bets
  const poolIdsWithBets = Object.keys(poolsWithBets);

  // Group bets by pool for rendering
  const getBetsForPool = (poolId: string): BetChip[] => {
    return poolsWithBets[poolId] || [];
  };

  // Calculate total bet amount
  const totalBetAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);

  // Calculate potential win amount
  const calculatePotentialWin = () => {
    if (!selectedPool) return 0;
    
    const betsOnSelectedPool = bets.filter(bet => bet.poolId === selectedPool.id);
    return betsOnSelectedPool.reduce(
      (sum, bet) => sum + bet.amount * selectedPool.odds, 0
    );
  };

  return (
    <div className="h-full w-full">
      <WinConfetti active={showResult && (spinResult?.wonAmount || 0) > 0} />
      
      <div className="flex flex-col md:flex-row gap-4 h-full">
        <div className="w-full md:w-3/4 h-full flex flex-col">
          <div className="relative flex-grow p-1">
            <div className="absolute inset-0 bg-gradient-to-b from-btc-dark/20 to-btc-dark/0 rounded-xl"></div>
            
            {/* Mining Pools Grid */}
            <div className={cn(
              "grid gap-3 p-2",
              isLoadingPools ? "grid-cols-2" : CARD_GRID_CLASSES.all
            )}>
              {isLoadingPools ? (
                // Loading skeleton
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={`skeleton-${i}`} className="h-52 bg-btc-dark/40 rounded-xl animate-pulse">
                    <div className="h-full flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-btc-dark/60 rounded-full mb-2"></div>
                      <div className="w-24 h-4 bg-btc-dark/60 rounded mb-1"></div>
                      <div className="w-16 h-3 bg-btc-dark/60 rounded"></div>
                    </div>
                  </div>
                ))
              ) : (
                // Actual mining pool cards
                availablePools.map(pool => (
                  <MiningPoolCard
                    key={pool.id}
                    pool={pool}
                    onSelect={handlePoolSelect}
                    isSelected={selectedPool?.id === pool.id}
                    bets={getBetsForPool(pool.id)}
                    disabled={isSpinning}
                    isWinningPool={spinResult?.winningPool?.id === pool.id && showResult}
                  />
                ))
              )}
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-1/4 md:max-w-xs flex flex-col gap-4">
          {/* Balance Card */}
          <AuroraContainer className="p-4 rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <CircleDollarSign className="h-5 w-5 text-btc-orange" />
              <h3 className="text-lg font-medium text-white">Your Balance</h3>
            </div>
            <div className="text-2xl font-bold text-white">{userBalance.toLocaleString()} sats</div>
            <div className="mt-2 text-xs text-white/60">
              ~${(userBalance * 0.00048 / 1000).toFixed(2)} USD
            </div>
          </AuroraContainer>
          
          {/* Betting Form */}
          <AuroraContainer className="p-4 rounded-xl overflow-hidden">
            <div className="space-y-4">
              <div>
                <label className="block text-white mb-1 text-sm">Selected Pool</label>
                <div className="p-2 bg-white/5 rounded border border-white/10 text-white">
                  {selectedPool ? selectedPool.name : 'Select a mining pool'}
                </div>
              </div>
              
              <div>
                <label className="block text-white mb-1 text-sm">Bet Amount (sats)</label>
                <Select
                  value={betAmount.toString()}
                  onValueChange={handleBetAmountChange}
                  disabled={isSpinning}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select amount" />
                  </SelectTrigger>
                  <SelectContent className="bg-btc-dark border-white/10">
                    <SelectItem value="1000">1,000</SelectItem>
                    <SelectItem value="5000">5,000</SelectItem>
                    <SelectItem value="10000">10,000</SelectItem>
                    <SelectItem value="20000">20,000</SelectItem>
                    <SelectItem value="50000">50,000</SelectItem>
                    <SelectItem value="100000">100,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {selectedPool && (
                <div className="p-3 bg-white/5 rounded border border-white/10">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Potential Win:</span>
                    <span className="font-medium text-btc-orange">
                      {(selectedPool.odds * betAmount).toLocaleString()} sats
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-white/70">Multiplier:</span>
                    <span className="font-medium text-btc-orange">{selectedPool.odds.toFixed(2)}x</span>
                  </div>
                </div>
              )}
              
              <Button 
                variant="default" 
                className="w-full bg-btc-orange hover:bg-btc-orange/90 text-white" 
                onClick={placeBetOnPool}
                disabled={!selectedPool || isSpinning || isSubmitting}
              >
                Place Bet
              </Button>
            </div>
          </AuroraContainer>
          
          {/* Bets Summary */}
          <AuroraContainer className="p-4 rounded-xl overflow-hidden flex-grow">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium text-white">Current Bets</h3>
              <div className="text-sm font-medium text-white/70">
                {bets.length} bet{bets.length !== 1 ? 's' : ''}
              </div>
            </div>
            
            <div className="space-y-2 max-h-32 overflow-y-auto mb-3">
              {bets.length > 0 ? (
                bets.map(bet => {
                  const pool = availablePools.find(p => p.id === bet.poolId);
                  return pool ? (
                    <div key={bet.id} className="flex justify-between items-center p-2 bg-white/5 rounded">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full overflow-hidden">
                          <img src={pool.logoUrl} alt={pool.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-white text-sm">{pool.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-white/90 text-sm mr-2">{bet.amount.toLocaleString()} sats</span>
                        <button 
                          onClick={() => removeBet(bet.id)}
                          disabled={isSpinning}
                          className="text-red-500 hover:text-red-400 disabled:opacity-50"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : null;
                })
              ) : (
                <div className="text-center py-2 text-white/50 text-sm">
                  No bets placed yet
                </div>
              )}
            </div>
            
            <div className="mt-4 border-t border-white/10 pt-3">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/70">Total Bet Amount:</span>
                <span className="font-medium text-white">{totalBetAmount.toLocaleString()} sats</span>
              </div>
              
              {selectedPool && (
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-white/70">Potential Win:</span>
                  <span className="font-medium text-btc-orange">
                    {calculatePotentialWin().toLocaleString()} sats
                  </span>
                </div>
              )}
              
              <Button 
                variant="default" 
                className="w-full bg-gradient-to-r from-btc-orange to-yellow-500 hover:from-btc-orange/90 hover:to-yellow-500/90 text-white"
                onClick={spinWheel}
                disabled={bets.length === 0 || isSpinning || isSubmitting}
              >
                {isSpinning 
                  ? "Spinning..." 
                  : isSubmitting 
                    ? "Submitting..." 
                    : "SPIN THE WHEEL"
                }
              </Button>
            </div>
          </AuroraContainer>
          
          {/* Previous Wins */}
          <AuroraContainer className="p-4 rounded-xl overflow-hidden">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium text-white">Previous Results</h3>
              <button 
                className="text-xs text-white/60 hover:text-white transition-colors"
                onClick={() => navigate('/history')}
              >
                View All
              </button>
            </div>
            
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {previousWins.length > 0 ? (
                previousWins.slice(0, 5).map((win, index) => (
                  <div key={`win-${index}`} className="flex justify-between items-center p-2 bg-white/5 rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full overflow-hidden">
                        <img 
                          src={win.winningPool?.logoUrl || '/placeholder.svg'} 
                          alt={win.winningPool?.name || 'Unknown'} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <span className="text-white text-sm">{win.winningPool?.name || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className={cn(
                        "text-sm mr-2",
                        win.wonAmount > 0 ? "text-green-500" : "text-red-500"
                      )}>
                        {win.wonAmount > 0 
                          ? `+${win.wonAmount.toLocaleString()}` 
                          : `-${win.betAmount.toLocaleString()}`
                        } sats
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-2 text-white/50 text-sm">
                  No previous results
                </div>
              )}
            </div>
          </AuroraContainer>
        </div>
      </div>
      
      {/* Result overlay */}
      <AnimatePresence>
        {showResult && spinResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-btc-dark border border-white/10 rounded-xl p-6 shadow-xl max-w-md w-full mx-4"
            >
              <h2 className="text-xl font-bold text-center mb-4 text-white">
                {spinResult.wonAmount > 0 ? "You Won!" : "You Lost"}
              </h2>
              
              <div className="flex justify-center mb-6">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white/10">
                  <img 
                    src={spinResult.winningPool?.logoUrl || '/placeholder.svg'} 
                    alt={spinResult.winningPool?.name || 'Unknown'} 
                    className="w-full h-full object-cover" 
                  />
                  {spinResult.wonAmount > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-green-500/40">
                      <Check className="h-10 w-10 text-white" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-center mb-4">
                <div className="text-lg text-white">
                  {spinResult.winningPool?.name || 'Unknown'} ({spinResult.multiplier.toFixed(2)}x)
                </div>
              </div>
              
              <div className="border-t border-b border-white/10 py-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-white/70">Total Bet:</span>
                  <span className="font-medium text-white">{spinResult.betAmount.toLocaleString()} sats</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-white/70">Result:</span>
                  <span className={`font-bold ${spinResult.wonAmount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {spinResult.wonAmount > 0 
                      ? `+${spinResult.wonAmount.toLocaleString()}` 
                      : `-${spinResult.betAmount.toLocaleString()}`
                    } sats
                  </span>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-white/50 text-sm">
                  Auto-closing in a few seconds...
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BettingGrid;
