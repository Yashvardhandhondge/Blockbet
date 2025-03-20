
import { useMemo, useState, useEffect } from 'react';
import { nextBlockEstimate } from '@/utils/mockData';
import { useRandomInterval } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { BarChart2, Clock, Zap, Server } from 'lucide-react';

const LiveBlockData = () => {
  const [difficulty, setDifficulty] = useState(nextBlockEstimate.difficulty);
  const [feeRate, setFeeRate] = useState(nextBlockEstimate.feeRate);
  const [timeVariation, setTimeVariation] = useState(0);
  const [pendingTxCount, setPendingTxCount] = useState(12483);
  
  // Random updates to simulate live data
  useRandomInterval(() => {
    setFeeRate(prev => {
      const variation = (Math.random() * 6) - 3; // -3 to +3
      return Math.max(1, Math.floor(prev + variation));
    });
    
    setPendingTxCount(prev => {
      const variation = (Math.random() * 100) - 20; // more coming in than going out
      return Math.max(1000, Math.floor(prev + variation));
    });
    
    setTimeVariation(Math.random() * 1.5 - 0.75); // -0.75 to +0.75 minutes
  }, 3000, 8000);
  
  // Calculate next block estimate with variation
  const estimatedTime = useMemo(() => {
    const totalMinutes = nextBlockEstimate.estimatedTimeMinutes + timeVariation;
    const minutes = Math.floor(totalMinutes);
    const seconds = Math.floor((totalMinutes - minutes) * 60);
    return `${minutes}m ${seconds}s`;
  }, [timeVariation]);
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
      <StatCard 
        icon={<Clock className="h-5 w-5 text-btc-orange" />}
        title="Est. Next Block"
        value={estimatedTime}
        secondaryText="average time"
      />
      
      <StatCard 
        icon={<BarChart2 className="h-5 w-5 text-btc-orange" />}
        title="Network Difficulty"
        value={difficulty.toFixed(3)}
        secondaryText="T"
      />
      
      <StatCard 
        icon={<Zap className="h-5 w-5 text-btc-orange" />}
        title="Fee Rate"
        value={feeRate.toString()}
        secondaryText="sat/vB"
        isHighlighted={feeRate > 40}
      />
      
      <StatCard 
        icon={<Server className="h-5 w-5 text-btc-orange" />}
        title="Pending Transactions"
        value={pendingTxCount.toLocaleString()}
        secondaryText="in mempool"
      />
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  secondaryText: string;
  isHighlighted?: boolean;
}

const StatCard = ({ icon, title, value, secondaryText, isHighlighted = false }: StatCardProps) => {
  return (
    <div className={cn(
      "glass-panel rounded-xl p-4 border",
      isHighlighted 
        ? "border-btc-orange/30 shadow-[0_0_15px_rgba(247,147,26,0.15)]" 
        : "border-white/10"
    )}>
      <div className="flex items-center mb-3">
        <div className="rounded-lg bg-btc-dark p-1.5 mr-2">
          {icon}
        </div>
        <div className="text-sm text-white/70">{title}</div>
      </div>
      
      <div className="flex items-end">
        <div className={cn(
          "text-xl font-bold mr-1",
          isHighlighted ? "text-btc-orange" : "text-white"
        )}>
          {value}
        </div>
        <div className="text-xs text-white/60 mb-0.5">{secondaryText}</div>
      </div>
    </div>
  );
};

export default LiveBlockData;
