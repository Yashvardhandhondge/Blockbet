
import React from 'react';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
  tooltip?: string;
}

const StatCard = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  tooltip
}: StatCardProps) => {
  return (
    <div className="bg-black/20 rounded-lg p-2.5 flex justify-between" title={tooltip}>
      <div className="flex items-center">
        {icon && (
          <div className="bg-btc-orange/10 p-1.5 rounded mr-2">
            {icon}
          </div>
        )}
        <div>
          <div className="text-xs text-white/60">{title}</div>
          <div className="text-sm font-medium text-white">{value}</div>
        </div>
      </div>
      
      {change && (
        <div className="flex items-center">
          <div
            className={cn("flex items-center text-xs rounded-full px-1.5 py-0.5", {
              "bg-green-500/10 text-green-500": changeType === 'positive',
              "bg-red-500/10 text-red-500": changeType === 'negative',
              "bg-white/10 text-white/70": changeType === 'neutral',
            })}
          >
            {changeType === 'positive' && <ArrowUpIcon className="h-3 w-3 mr-0.5" />}
            {changeType === 'negative' && <ArrowDownIcon className="h-3 w-3 mr-0.5" />}
            {change}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatCard;
