import { useState } from 'react';
import { MiningPool, mockUserBalance, formatBTC } from '@/utils/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { Bitcoin, ChevronUp, ChevronDown, Wallet, Info, Trophy } from 'lucide-react';

interface PlaceBetFormProps {
  selectedPool: MiningPool;
}

const PlaceBetForm = ({ selectedPool }: PlaceBetFormProps) => {
  const { toast } = useToast();
  const [betAmount, setBetAmount] = useState(0.001);
  const [isPending, setIsPending] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  const maxBet = mockUserBalance.availableBalance;
  const potentialWin = betAmount * selectedPool.odds;
  
  const handleBetChange = (value: number) => {
    if (value > maxBet) {
      value = maxBet;
    } else if (value < 0) {
      value = 0;
    }
    
    setBetAmount(value);
  };
  
  const handleQuickAmount = (percent: number) => {
    const amount = maxBet * (percent / 100);
    handleBetChange(amount);
  };
  
  const handlePlaceBet = () => {
    if (betAmount <= 0) {
      toast({
        title: "Invalid bet amount",
        description: "Please enter a bet amount greater than 0.",
        variant: "destructive"
      });
      return;
    }
    
    setIsPending(true);
    
    setTimeout(() => {
      toast({
        title: "Bet placed successfully!",
        description: `You placed ${formatBTC(betAmount)} on ${selectedPool.name}.`,
      });
      setIsPending(false);
    }, 1500);
  };
  
  const getPoolDarkGradient = () => {
    switch(selectedPool.id) {
      case 'antpool':
        return 'bg-gradient-to-br from-[#661919] to-[#2a0808]';
      case 'binance':
        return 'bg-gradient-to-br from-[#553c00] to-[#2a1c00]';
      case 'f2pool':
        return 'bg-gradient-to-br from-[#143a4d] to-[#081c24]';
      case 'foundry':
        return 'bg-gradient-to-br from-[#662900] to-[#2a1200]';
      case 'slushpool':
        return 'bg-gradient-to-br from-[#0d3b56] to-[#091e2a]';
      case 'poolin':
        return 'bg-gradient-to-br from-[#0d3b30] to-[#061c17]';
      case 'viabtc':
        return 'bg-gradient-to-br from-[#28401a] to-[#101a0a]';
      default:
        return 'bg-gradient-to-br from-[#3a3a3a] to-[#1a1a1a]';
    }
  };
  
  return (
    <div className="glass-panel rounded-xl p-5 border border-white/10">
      <div className="flex items-center mb-4">
        <div className={cn(
          "h-8 w-8 rounded-lg flex items-center justify-center mr-3",
          getPoolDarkGradient()
        )}>
          <span className="text-xs font-medium text-white">
            {Math.round(selectedPool.hashRatePercent)}%
          </span>
        </div>
        <h3 className="text-xl font-medium text-white">
          Betting on {selectedPool.name}
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <label className="block text-sm text-white/70 mb-1">Bet Amount</label>
            <div className="relative">
              <Input
                type="number"
                value={betAmount}
                onChange={(e) => handleBetChange(parseFloat(e.target.value))}
                className="pr-16 bg-[#121212]/80 border-white/10 focus:border-btc-orange focus:ring-btc-orange/20"
                step={0.0001}
                min={0}
                max={maxBet}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Bitcoin className="h-4 w-4 text-btc-orange" />
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <Slider
              value={[betAmount]}
              max={maxBet}
              step={0.0001}
              onValueChange={(values) => handleBetChange(values[0])}
              className="my-4"
            />
            
            <div className="flex justify-between gap-2 mb-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-white/10 hover:border-btc-orange/50 hover:bg-btc-orange/5"
                onClick={() => handleQuickAmount(25)}
              >
                25%
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-white/10 hover:border-btc-orange/50 hover:bg-btc-orange/5"
                onClick={() => handleQuickAmount(50)}
              >
                50%
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-white/10 hover:border-btc-orange/50 hover:bg-btc-orange/5"
                onClick={() => handleQuickAmount(75)}
              >
                75%
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-white/10 hover:border-btc-orange/50 hover:bg-btc-orange/5"
                onClick={() => handleQuickAmount(100)}
              >
                Max
              </Button>
            </div>
            
            <div className="flex items-center text-xs text-white/60">
              <Wallet className="h-3.5 w-3.5 mr-1 text-white/40" />
              <span>Available: {formatBTC(maxBet)}</span>
            </div>
          </div>
          
          <Button
            className="w-full bg-btc-orange hover:bg-btc-orange/90 text-btc-dark py-6 text-lg font-medium hover-glow"
            onClick={handlePlaceBet}
            disabled={betAmount <= 0 || isPending}
          >
            {isPending ? (
              <div className="flex items-center">
                <div className="h-4 w-4 border-2 border-btc-dark border-r-transparent rounded-full animate-spin mr-2"></div>
                Processing...
              </div>
            ) : (
              <>Place Bet</>
            )}
          </Button>
        </div>
        
        <div className="bg-[#121212]/40 rounded-xl p-4">
          <div className="mb-4">
            <div className="text-sm text-white/70 mb-1">Potential Win</div>
            <div className="flex items-end">
              <span className="text-2xl font-bold text-white">{potentialWin.toFixed(8)}</span>
              <span className="text-sm text-white/70 ml-1">BTC</span>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="text-sm text-white/70 mb-1">Odds</div>
            <div className="text-lg font-medium text-white">{selectedPool.odds.toFixed(2)}x</div>
          </div>
          
          <div className="mb-4">
            <div className="text-sm text-white/70 mb-1">Mining Pool Hashrate</div>
            <div className="text-lg font-medium text-white">
              {selectedPool.hashRate.toFixed(1)} EH/s 
              <span className="text-sm text-white/70 ml-1">
                ({selectedPool.hashRatePercent.toFixed(1)}%)
              </span>
            </div>
          </div>
          
          <div className="flex justify-between items-center border-t border-white/10 pt-3 mt-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-white/5"
              onClick={() => setShowDetails(!showDetails)}
            >
              <Info className="h-3.5 w-3.5 mr-1.5" />
              Bet Details
              {showDetails ? (
                <ChevronUp className="h-4 w-4 ml-1.5" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-1.5" />
              )}
            </Button>
            
            <div className="flex items-center text-btc-orange text-sm font-medium">
              <Trophy className="h-4 w-4 mr-1.5" />
              #{selectedPool.blocksLast24h} last 24h
            </div>
          </div>
          
          {showDetails && (
            <div className="mt-3 text-sm text-white/70 space-y-2 animate-slide-down">
              <p>
                You are betting that the mining pool <strong className="text-white">{selectedPool.name}</strong> will
                mine the next Bitcoin block.
              </p>
              <p>
                The odds are based on the current hashrate distribution. Higher pool hashrate means lower odds
                but higher probability of winning.
              </p>
              <p>
                If you win, you will receive <strong className="text-white">{potentialWin.toFixed(8)} BTC</strong> to
                your balance.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaceBetForm;
