
import { useEffect, useState, useRef } from 'react';
import { Block, recentBlocks, miningPools, getRandomMiningPool, formatTimeAgo } from '@/utils/mockData';
import { useRandomInterval } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';

const BlockchainVisualization = () => {
  const [blocks, setBlocks] = useState<Block[]>(recentBlocks);
  const [pendingBlock, setPendingBlock] = useState<number>(50); // Animation progress 0-100
  const [isNewBlockAppearing, setIsNewBlockAppearing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
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
    
    // Create new block with unique hash
    const randomHash = `000000000000000000${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 30)}`;
    
    const newBlock: Block = {
      height: blocks[0].height + 1,
      hash: randomHash,
      minedBy: getRandomMiningPool().name,
      timestamp: Date.now(),
      size: Math.floor(Math.random() * 2000000) + 500000,
      transactionCount: Math.floor(Math.random() * 3000) + 1000,
      fees: parseFloat((Math.random() * 0.5 + 0.1).toFixed(2)),
      feesRangeText: `~${Math.floor(Math.random() * 3) + 1} sat/vB`,
      feeRange: `${Math.floor(Math.random() * 100) + 1} - ${Math.floor(Math.random() * 300) + 100} sat/vB`,
      totalBtc: parseFloat((Math.random() * 0.02 + 0.01).toFixed(3))
    };
    
    // Update blocks state
    setTimeout(() => {
      setBlocks(prev => [newBlock, ...prev.slice(0, 9)]);
      setIsNewBlockAppearing(false);
    }, 500);
  };
  
  // Function to get pool color class
  const getPoolColorClass = (poolName: string): string => {
    const pool = miningPools.find(p => p.name === poolName);
    return pool?.colorClass || 'bg-pool-unknown';
  };

  // Function to get pool logo
  const getPoolLogo = (poolName: string): string => {
    const pool = miningPools.find(p => p.name === poolName);
    return pool?.logoUrl || '';
  };

  // Scroll handlers
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };
  
  return (
    <div className="w-full bg-btc-darker rounded-xl overflow-hidden border border-white/5 shadow-xl">
      <div className="p-4 border-b border-white/5 flex justify-between items-center">
        <h2 className="text-lg font-medium text-white">Latest Blocks</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button 
              onClick={scrollLeft}
              className="p-1.5 rounded-full hover:bg-white/5 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-white/60" />
            </button>
            <button 
              onClick={scrollRight}
              className="p-1.5 rounded-full hover:bg-white/5 transition-colors"
            >
              <ArrowRight className="h-5 w-5 text-white/60" />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-btc-orange animate-pulse"></div>
            <span className="text-xs text-white/60">Live</span>
          </div>
        </div>
      </div>
      
      <div className="relative">
        {/* Pending blocks are now left side in screenshot */}
        <div className="hidden"> {/* Hidden for now as per screenshot */}
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
        
        {/* Horizontal blocks scrolling area */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto hide-scrollbar py-4 pl-4 pr-4 space-x-3 border-b border-white/5"
          style={{ scrollbarWidth: 'none' }}
        >
          {blocks.map((block, index) => (
            <div 
              key={`${block.height}-${block.hash.substring(0, 10)}`} 
              className={cn(
                "flex-shrink-0 w-56 rounded-md overflow-hidden",
                index === 0 ? "animate-block-appear" : ""
              )}
            >
              {/* Block header with height */}
              <div className="bg-blue-500 pt-3 pb-3 px-4 text-center text-white font-medium">
                {block.height}
              </div>
              
              {/* Block content */}
              <div className={cn(
                "p-3 bg-blue-600 flex flex-col h-40",
                getPoolColorClass(block.minedBy)
              )}>
                <div className="text-white font-medium mb-1">{block.feesRangeText}</div>
                <div className="text-yellow-300 text-sm mb-1">{block.feeRange}</div>
                <div className="text-white font-bold text-xl mb-2">{block.totalBtc} BTC</div>
                <div className="text-white text-sm">{block.transactionCount.toLocaleString()} transactions</div>
                <div className="mt-auto text-white text-sm">{formatTimeAgo(block.timestamp)}</div>
              </div>
              
              {/* Pool info */}
              <div className="bg-gray-900 py-2 px-3 flex items-center space-x-2">
                <img 
                  src={getPoolLogo(block.minedBy)} 
                  alt={block.minedBy}
                  className="w-5 h-5 object-contain"
                />
                <span className="text-white text-sm">{block.minedBy}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlockchainVisualization;
