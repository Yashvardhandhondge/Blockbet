
import { useState } from 'react';
import { mockUserBalance, formatBTC } from '@/utils/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { Bitcoin, ChevronUp, ChevronDown, Wallet, Info } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface PlaceBetFormProps {
  selectedChip: number;
  setSelectedChip: React.Dispatch<React.SetStateAction<number>>;
}

const PlaceBetForm = ({ selectedChip, setSelectedChip }: PlaceBetFormProps) => {
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const isMobile = useIsMobile();
  
  const maxBet = mockUserBalance.availableBalance;
  
  const handleChipChange = (value: number) => {
    setSelectedChip(value);
  };
  
  const chipOptions = [100, 500, 1000, 5000, 10000, 50000, 100000];
  
  return (
    <div className="glass-panel rounded-xl p-4 border border-white/10">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-white mb-2">
          Select Bet Amount
        </h3>
        <p className="text-sm text-white/70 mb-4">
          Choose how many sats to bet on each mining pool you select
        </p>
      </div>
      
      <div>
        <div className="mb-4">
          <div className="relative">
            <Input
              type="number"
              value={selectedChip}
              onChange={(e) => handleChipChange(Number(e.target.value))}
              className="pr-16 bg-[#121212]/80 border-white/10 focus:border-btc-orange focus:ring-btc-orange/20"
              step={100}
              min={100}
              max={maxBet}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-xs text-white/60 mr-1">sats</span>
              <Bitcoin className="h-4 w-4 text-btc-orange" />
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {chipOptions.map((amount) => (
            <button
              key={amount}
              onClick={() => handleChipChange(amount)}
              className={cn(
                "rounded-full w-14 h-14 flex items-center justify-center font-bold text-white shadow relative",
                selectedChip === amount 
                  ? "ring-2 ring-btc-orange ring-offset-1 ring-offset-black" 
                  : "opacity-80 hover:opacity-100"
              )}
              style={{
                background: getChipColor(amount),
                boxShadow: "0 3px 6px rgba(0,0,0,0.4)",
              }}
            >
              <span className="text-xs">{formatChipValue(amount)}</span>
            </button>
          ))}
        </div>
        
        <div className="flex items-center text-xs text-white/60 mb-2">
          <Wallet className="h-3.5 w-3.5 mr-1 text-white/40" />
          <span>Available: {formatBTC(maxBet)} BTC</span>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const getChipColor = (value: number): string => {
  switch(value) {
    case 100:
      return "linear-gradient(135deg, #3b82f6, #1d4ed8)";
    case 500:
      return "linear-gradient(135deg, #10b981, #047857)";
    case 1000:
      return "linear-gradient(135deg, #8b5cf6, #6d28d9)";
    case 5000:
      return "linear-gradient(135deg, #ec4899, #be185d)";
    case 10000:
      return "linear-gradient(135deg, #f97316, #c2410c)";
    case 50000:
      return "linear-gradient(135deg, #ef4444, #b91c1c)";
    case 100000:
      return "linear-gradient(135deg, #eab308, #a16207)";
    default:
      return "linear-gradient(135deg, #6b7280, #374151)";
  }
};

const formatChipValue = (value: number): string => {
  if (value >= 1000) {
    return `${value / 1000}K`;
  }
  return value.toString();
};

export default PlaceBetForm;
