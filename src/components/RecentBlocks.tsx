
import React from 'react';
import { recentBlocks } from '@/utils/mockData';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface RecentBlocksProps {
  className?: string;
}

export function RecentBlocks({ className }: RecentBlocksProps) {
  const getPoolLogo = (poolName: string): string => {
    // Convert pool name to lowercase and remove spaces for matching with filenames
    const normalized = poolName.toLowerCase().replace(/\s+/g, '');
    
    // Map of special cases where the pool name doesn't directly match the file name
    const specialCases: Record<string, string> = {
      'foundryusa': 'foundryusa',
      'antpool': 'antpool',
      'f2pool': 'f2pool',
      'binancepool': 'binancepool',
      'viabtc': 'viabtc',
      'slushpool': 'slushpool',
      'poolin': 'poolin',
      'btc.com': 'btccom',
      'sbicrypto': 'sbicrypto',
      'whitepool': 'default',
      'unknown': 'default'
    };
    
    const logoName = specialCases[normalized] || normalized;
    return `/pool-logos/${logoName}.svg`;
  };

  return (
    <div className={cn("bg-black/20 backdrop-blur-sm rounded-xl p-4", className)}>
      <h2 className="text-xl font-bold mb-4">Recent Blocks</h2>
      
      <div className="space-y-3">
        {recentBlocks.map((block) => (
          <div key={block.height} className="bg-black/40 rounded-xl p-3">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 relative mr-2">
                <Image
                  src={getPoolLogo(block.minedBy)}
                  alt={block.minedBy}
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-medium text-sm block">{block.minedBy}</span>
                <span className="text-xs text-gray-400">{formatDistanceToNow(block.timestamp)} ago</span>
              </div>
            </div>
            
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Block #{block.height}</span>
              <span>{(block.size / 1000000).toFixed(2)} MB</span>
            </div>
            
            <div className="flex justify-between text-xs text-gray-400">
              <span>{block.transactionCount} transactions</span>
              <span>{block.fees.toFixed(2)} BTC in fees</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
