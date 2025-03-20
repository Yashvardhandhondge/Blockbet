import { useEffect, useState } from 'react';
import { Block, recentBlocks, miningPools, getRandomMiningPool, formatTimeAgo } from '@/utils/mockData';
import { useRandomInterval } from '@/lib/animations';
import { cn } from '@/lib/utils';

const BlockchainVisualization = () => {
  const [blocks, setBlocks] = useState<Block[]>(recentBlocks);
  const [pendingBlock, setPendingBlock] = useState<number>(50); // Animation progress 0-100
  const [isNewBlockAppearing, setIsNewBlockAppearing] = useState(false);
  
  // Simulate pending block progress
  useEffect(() => {
    const interval = setInterval(() => {
      setPendingBlock(prev => {
        const newValue = prev + (Math.random() * 2);
        if (newValue >= 100) {
          // When it reaches 100%, trigger a new block
          setTimeout(() => addNewBlock(), 500);
          return 0;
        }
        return newValue;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Function to add a new block
  const addNewBlock = () => {
    setIsNewBlockAppearing(true);
    
    // Create new block
    const newBlock: Block = {
      height: blocks[0].height + 1,
      hash: `000000000000000000${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 30)}`,
      minedBy: getRandomMiningPool().name,
      timestamp: Date.now(),
      size: Math.floor(Math.random() * 2000000) + 500000,
      transactionCount: Math.floor(Math.random() * 3000) + 1000,
      fees: parseFloat((Math.random() * 0.5 + 0.1).toFixed(2))
    };
    
    // Update blocks state
    setTimeout(() => {
      setBlocks(prev => [newBlock, ...prev.slice(0, 4)]);
      setIsNewBlockAppearing(false);
    }, 500);
  };
  
  // Function to get pool color class
  const getPoolColorClass = (poolName: string): string => {
    const pool = miningPools.find(p => p.name === poolName);
    return pool?.colorClass || 'bg-pool-unknown';
  };
  
  return (
    <div className="w-full bg-btc-darker rounded-xl overflow-hidden border border-white/5 shadow-xl">
      <div className="p-4 border-b border-white/5 flex justify-between items-center">
        <h2 className="text-lg font-medium text-white">Latest Blocks</h2>
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-btc-orange animate-pulse"></div>
          <span className="text-xs text-white/60">Live</span>
        </div>
      </div>
      
      <div className="relative">
        {/* Pending block animation */}
        <div className="p-3 border-b border-white/5 bg-btc-dark/50 flex items-center">
          <div className="flex-shrink-0 mr-4 relative">
            <div className="h-12 w-12 rounded-lg bg-btc-card flex items-center justify-center overflow-hidden">
              <div className="font-mono text-xs text-white/70 animate-pulse">
                ?
              </div>
              {/* Progress overlay */}
              <div 
                className="absolute bottom-0 left-0 right-0 bg-btc-orange/30 transition-all duration-500 ease-out"
                style={{ height: `${pendingBlock}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex-grow">
            <div className="flex items-center">
              <span className="text-sm font-medium text-white/90">Pending Block #{blocks[0].height + 1}</span>
              <div className="ml-2 px-2 py-0.5 rounded bg-btc-orange/10 border border-btc-orange/20">
                <span className="text-xs text-btc-orange">Mining...</span>
              </div>
            </div>
            <div className="mt-1 flex items-center space-x-3 text-xs text-white/60">
              <span>~{Math.floor(100 - pendingBlock)} blocks until found</span>
              <span>•</span>
              <span>Unknown pool</span>
            </div>
          </div>
        </div>
        
        {/* New block appearing animation */}
        <div className={cn(
          "absolute inset-0 bg-btc-orange/10 flex items-center justify-center transition-all duration-500",
          isNewBlockAppearing ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
          <div className="bg-btc-dark glass-panel rounded-xl p-6 transform transition-all duration-500 animate-block-appear">
            <h3 className="text-lg font-medium text-white mb-2">New Block Found!</h3>
            <p className="text-sm text-white/70">Block #{blocks[0].height + 1} has been mined.</p>
          </div>
        </div>
        
        {/* Existing blocks */}
        <div className="overflow-x-auto">
          {blocks.map((block, index) => (
            <div 
              key={block.hash} 
              className={cn(
                "p-3 border-b border-white/5 flex items-center hover:bg-white/[0.02] transition-colors",
                index === 0 && "animate-block-appear"
              )}
            >
              <div className="flex-shrink-0 mr-4">
                <div className={cn(
                  "h-12 w-12 rounded-lg flex items-center justify-center",
                  getPoolColorClass(block.minedBy)
                )}>
                  <div className="font-mono text-xs text-white">
                    {block.height}
                  </div>
                </div>
              </div>
              
              <div className="flex-grow min-w-0">
                <div className="flex items-center mb-1">
                  <span className="text-sm font-medium text-white/90 truncate mr-2 max-w-[150px] md:max-w-none">
                    {block.hash.substring(0, 16)}...
                  </span>
                  <div className="px-2 py-0.5 rounded bg-white/5 border border-white/10">
                    <span className="text-xs text-white/70">{formatTimeAgo(block.timestamp)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 md:space-x-3 text-xs text-white/60 overflow-hidden">
                  <span className="whitespace-nowrap">{block.transactionCount.toLocaleString()} transactions</span>
                  <span className="hidden md:inline">•</span>
                  <span className="whitespace-nowrap hidden md:inline">{(block.size / 1000000).toFixed(2)} MB</span>
                  <span className="hidden md:inline">•</span>
                  <span className="whitespace-nowrap truncate">
                    Mined by <span className="text-white/80">{block.minedBy}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlockchainVisualization;
