
import { useState } from 'react';
import { nextBlockEstimate } from '@/utils/mockData';
import { useRandomInterval } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { Clock, Timer } from 'lucide-react';

export const LiveBlockData = () => {
  const [timeVariation, setTimeVariation] = useState(0);
  const [avgBlockTime, setAvgBlockTime] = useState(9.8); // Average block time in minutes
  
  // Random updates to simulate live data
  useRandomInterval(() => {
    setTimeVariation(Math.random() * 1.5 - 0.75); // -0.75 to +0.75 minutes
    
    // Slightly randomize average block time
    setAvgBlockTime(prev => {
      const variation = (Math.random() * 0.4) - 0.2; // -0.2 to +0.2 minutes
      return Math.max(9.2, Math.min(10.5, prev + variation));
    });
  }, 3000, 8000);
  
  // Calculate next block estimate with variation
  const estimatedTime = (() => {
    const totalMinutes = nextBlockEstimate.estimatedTimeMinutes + timeVariation;
    const minutes = Math.floor(totalMinutes);
    const seconds = Math.floor((totalMinutes - minutes) * 60);
    return `${minutes}m ${seconds}s`;
  })();
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <StatCard 
        icon={<Clock className="h-5 w-5 text-btc-orange" />}
        title="Est. Next Block"
        value={estimatedTime}
        secondaryText="average time"
      />
      
      <StatCard 
        icon={<Timer className="h-5 w-5 text-btc-orange" />}
        title="Average Block Time"
        value={`${avgBlockTime.toFixed(1)}m`}
        secondaryText="last 24h"
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

export const StatCard = ({ icon, title, value, secondaryText, isHighlighted = false }: StatCardProps) => {
  return (
    <div className={cn(
      "rounded-lg px-3 py-1 flex items-center",
      isHighlighted 
        ? "bg-gradient-to-r from-[#8B5CF6]/30 to-[#0EA5E9]/30 border border-[#8B5CF6]/40" 
        : "bg-gradient-to-r from-[#121212] to-[#1a1a1a] border border-white/10"
    )}>
      <div className="flex items-center">
        <div className="mr-1">
          {icon}
        </div>
        <div>
          <span className="text-xs mr-1">{title}: </span>
          <span className={cn(
            "font-mono font-medium text-xs",
            isHighlighted ? "text-btc-orange" : "text-white"
          )}>
            {value}
          </span>
          <span className="text-xs text-white/60 ml-1">{secondaryText}</span>
        </div>
      </div>
    </div>
  );
};

export default LiveBlockData;
