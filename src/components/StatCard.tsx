
import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  pulseColor?: string;
}

export const StatCard = ({ 
  icon, 
  title, 
  value, 
  subtitle, 
  pulseColor = "bg-btc-orange" 
}: StatCardProps) => {
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

export default StatCard;
