
import { useState } from 'react';
import { MiningPool, miningPools, nextBlockEstimate } from '@/utils/mockData';
import MiningPoolCard from './MiningPoolCard';
import PlaceBetForm from './PlaceBetForm';
import { Clock, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const BettingGrid = () => {
  const [selectedPool, setSelectedPool] = useState<MiningPool | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(nextBlockEstimate.estimatedTimeMinutes * 60);
  
  // Update time remaining for simulated countdown
  useState(() => {
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
  });
  
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
  
  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-white">Place Your Bets</h2>
          <p className="text-white/60 mt-1">Predict which mining pool will mine the next block</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="glass-panel rounded-lg px-4 py-2 flex items-center">
            <Clock className="h-4 w-4 text-btc-orange mr-2" />
            <span className="text-sm">Betting closes in </span>
            <span className={cn("ml-1 font-mono font-bold", getUrgencyClass())}>
              {formatTimeRemaining()}
            </span>
          </div>
          
          <div className="glass-panel rounded-lg px-4 py-2 flex items-center">
            <Zap className="h-4 w-4 text-btc-orange mr-2" />
            <span className="text-sm">Next block: </span>
            <span className="ml-1 font-mono font-medium">#{miningPools[0].blocksLast24h + 1}</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {miningPools.map(pool => (
          <MiningPoolCard
            key={pool.id}
            pool={pool}
            onSelect={setSelectedPool}
            isSelected={selectedPool?.id === pool.id}
          />
        ))}
      </div>
      
      {selectedPool && (
        <div className="mt-8 animate-slide-up">
          <PlaceBetForm selectedPool={selectedPool} />
        </div>
      )}
    </div>
  );
};

export default BettingGrid;
