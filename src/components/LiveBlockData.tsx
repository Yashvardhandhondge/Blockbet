import { useState, useEffect } from 'react';
import { Clock, Zap, Server } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from './ui/card';
import { StatCard } from './LiveBlockData';

interface LiveBlockDataProps {
  currentBlock: number;
  avgBlockTime: number;
  pendingTxCount: number;
  estimatedTime: string;
}

export const StatCard = ({ icon, title, value, subtitle, pulseColor = "bg-btc-orange" }: { 
  icon: React.ReactNode; 
  title: string; 
  value: React.ReactNode; 
  subtitle?: React.ReactNode;
  pulseColor?: string;
}) => {
  return (
    <div className="flex">
      <div className="flex-shrink-0 h-10 w-10 rounded-lg overflow-hidden flex items-center justify-center bg-white/5 border border-white/10">
        {icon}
      </div>
      <div className="ml-3">
        <div className="flex items-center">
          <span className="text-xs text-white/60">{title}</span>
          {title.toLowerCase() === 'live' && (
            <span className="relative flex h-2 w-2 ml-1">
              <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          )}
        </div>
        <div className="text-lg font-bold text-white">{value}</div>
        {subtitle && <div className="text-xs text-white/60">{subtitle}</div>}
      </div>
    </div>
  );
};

const LiveBlockData = ({ currentBlock, avgBlockTime, pendingTxCount, estimatedTime }: LiveBlockDataProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <StatCard
        icon={<Server className="h-5 w-5 text-btc-orange" />}
        title="Current Block"
        value={currentBlock}
      />
      <StatCard
        icon={<Clock className="h-5 w-5 text-btc-orange" />}
        title="Avg. Block Time"
        value={`${avgBlockTime.toFixed(1)} min`}
      />
      <StatCard
        icon={<Zap className="h-5 w-5 text-btc-orange" />}
        title="Pending TX"
        value={pendingTxCount.toLocaleString()}
      />
      <StatCard
        icon={<Clock className="h-5 w-5 text-btc-orange" />}
        title="Live"
        value={estimatedTime}
        subtitle="Next block est."
      />
    </div>
  );
};

export default LiveBlockData;
