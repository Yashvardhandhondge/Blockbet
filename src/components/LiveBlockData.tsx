
import { useState, useEffect } from 'react';
import { Clock, Zap, Server } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from './ui/card';
import StatCard from './StatCard';

interface LiveBlockDataProps {
  currentBlock: number;
  avgBlockTime: number;
  pendingTxCount: number;
  estimatedTime: string;
}

const LiveBlockData = ({ currentBlock, avgBlockTime, pendingTxCount, estimatedTime }: LiveBlockDataProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-[#0f0f0f] border-white/5 rounded-xl p-3 hover:border-white/10 transition-all duration-200">
        <StatCard
          icon={<Server className="h-5 w-5 text-btc-orange" />}
          title="Current Block"
          value={currentBlock}
        />
      </Card>
      
      <Card className="bg-[#0f0f0f] border-white/5 rounded-xl p-3 hover:border-white/10 transition-all duration-200">
        <StatCard
          icon={<Clock className="h-5 w-5 text-btc-orange" />}
          title="Avg. Block Time"
          value={`${avgBlockTime.toFixed(1)} min`}
        />
      </Card>
      
      <Card className="bg-[#0f0f0f] border-white/5 rounded-xl p-3 hover:border-white/10 transition-all duration-200">
        <StatCard
          icon={<Zap className="h-5 w-5 text-btc-orange" />}
          title="Pending TX"
          value={pendingTxCount.toLocaleString()}
        />
      </Card>
      
      <Card className="bg-[#0f0f0f] border-white/5 rounded-xl p-3 hover:border-white/10 transition-all duration-200">
        <StatCard
          icon={<Clock className="h-5 w-5 text-btc-orange" />}
          title="Next block est."
          value={estimatedTime}
        />
      </Card>
    </div>
  );
};

export default LiveBlockData;
