
import React, { useState, useEffect } from 'react';
import { AuroraContainer } from '@/components/ui/aurora-container';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { miningPools } from '@/utils/mockData';
import { useIsMobile } from '@/hooks/use-mobile';

const BlockchainVisualization = () => {
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <AuroraContainer className="w-full h-24 rounded-xl overflow-hidden flex items-center justify-center">
        <div className="animate-pulse flex space-x-2">
          <div className="w-3 h-3 bg-btc-orange/70 rounded-full"></div>
          <div className="w-3 h-3 bg-btc-orange/70 rounded-full animation-delay-200"></div>
          <div className="w-3 h-3 bg-btc-orange/70 rounded-full animation-delay-400"></div>
        </div>
      </AuroraContainer>
    );
  }
  
  return (
    <AuroraContainer className="w-full rounded-xl overflow-hidden p-3">
      <div className="flex flex-col">
        <h2 className="text-lg font-medium text-white mb-3">Bitcoin Blockchain Visualization</h2>
        <div className="flex overflow-x-auto pb-2 hide-scrollbar">
          {miningPools.slice(0, 6).map((pool, index) => (
            <div key={pool.id} className="flex-shrink-0 w-16 md:w-20 mx-1 first:ml-0 last:mr-0">
              <div 
                className="w-full aspect-square rounded-lg flex items-center justify-center text-center p-1 text-xs text-white"
                style={{ background: pool.gradient }}
              >
                <span>{pool.name.split(' ')[0]}</span>
              </div>
              <p className="text-center text-[10px] text-white/70 mt-1">Block #{843210 + index}</p>
            </div>
          ))}
        </div>
      </div>
    </AuroraContainer>
  );
};

export default BlockchainVisualization;
