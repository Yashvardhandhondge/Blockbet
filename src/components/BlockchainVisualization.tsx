import { useEffect, useState, useRef } from 'react';
import { Block, recentBlocks, miningPools, getRandomMiningPool, formatTimeAgo } from '@/utils/mockData';
import { useRandomInterval } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';
import { AuroraContainer } from '@/components/ui/aurora-container';

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
  
  // Function to get pool gradient style based on the pool name
  const getPoolGradientStyle = (poolName: string): React.CSSProperties => {
    const pool = miningPools.find(p => p.name === poolName);
    if (pool) {
      return { background: pool.gradient };
    }
    return { background: 'linear-gradient(135deg, #333, #000000)' };
  };

  // Function to get pool color class (for header)
  const getPoolColorClass = (poolName: string): string => {
    const pool = miningPools.find(p => p.name === poolName);
    return pool?.colorClass || 'bg-gray-600';
  };

  // Function to get pool logo
  const getPoolLogo = (poolName: string): string => {
    // Lowercase the pool name and remove spaces, special characters
    const normalizedName = poolName.toLowerCase()
      .replace(/\s+/g, '')
      .replace(/\./g, '')
      .replace(/-/g, '');
    
    // Check common mining pool names and return the correct SVG path
    if (poolName === 'Foundry USA') return '/pool-logos/foundryusa.svg';
    if (poolName === 'AntPool') return '/pool-logos/antpool.svg';
    if (poolName === 'F2Pool') return '/pool-logos/f2pool.svg';
    if (poolName === 'Binance Pool') return '/pool-logos/binancepool.svg';
    if (poolName === 'ViaBTC') return '/pool-logos/viabtc.svg';
    if (poolName === 'SlushPool') return '/pool-logos/braiinspool.svg';
    if (poolName === 'Poolin') return '/pool-logos/poolin.svg';
    if (poolName === 'BTC.com') return '/pool-logos/btccom.svg';
    if (poolName === 'SBI Crypto') return '/pool-logos/sbicrypto.svg';
    if (poolName === 'EMCD') return '/pool-logos/emcdpool.svg';
    if (poolName === 'Luxor') return '/pool-logos/luxor.svg';
    if (poolName === 'KanoPool') return '/pool-logos/kucoinpool.svg';
    if (poolName === 'PEGA Pool') return '/pool-logos/pegapool.svg';
    if (poolName === 'WhitePool') return '/pool-logos/ultimuspool.svg';
    if (poolName === 'Minerium') return '/pool-logos/minerium.svg';
    if (poolName === 'Titan') return '/pool-logos/titan.svg';
    if (poolName === 'Bitfury') return '/pool-logos/bitfury.svg';
    
    // Return a default logo if no match is found
    return '/pool-logos/default.svg';
  };

  // Scroll handlers
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };
  
  return (
    <AuroraContainer className="w-full group hover:border-white/20 transition-colors rounded-xl overflow-hidden">
      <div className="p-3 border-b border-white/10 flex justify-between items-center">
        <h2 className="text-lg font-medium text-white">Latest Blocks</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button 
              onClick={scrollLeft}
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 text-white/70" />
            </button>
            <button 
              onClick={scrollRight}
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
            >
              <ArrowRight className="h-4 w-4 text-white/70" />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-white/70">Live</span>
          </div>
        </div>
      </div>
      
      <div className="relative">
        {/* Hidden pending blocks section */}
        <div className="hidden">
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
          <div className="bg-btc-dark glass-panel rounded-xl p-4 transform transition-all duration-500 animate-block-appear">
            <h3 className="text-base font-medium text-white mb-1">New Block Found!</h3>
            <p className="text-xs text-white/70">Block #{blocks[0].height + 1} has been mined.</p>
          </div>
        </div>
        
        {/* Horizontal blocks scrolling area */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto hide-scrollbar py-4 pl-4 pr-4 space-x-4 border-b border-white/5 bg-gradient-to-b from-[#0a0a0a] to-[#070707] rounded-b-xl"
          style={{ scrollbarWidth: 'none' }}
        >
          {blocks.map((block, index) => {
            // Get the mining pool info for this block
            const pool = miningPools.find(p => p.name === block.minedBy);
            
            return (
              <div 
                key={`${block.height}-${block.hash.substring(0, 10)}`} 
                className={cn(
                  "flex-shrink-0 w-32 relative group transition-all duration-300 hover:transform hover:scale-[1.03]",
                  index === 0 ? "animate-block-appear" : ""
                )}
              >
                {/* 3D Box Effect - Top */}
                <div className="h-4 w-full bg-[#141420] skew-x-[-25deg] origin-top-right absolute -top-3 left-2"></div>
                
                {/* 3D Box Effect - Side */}
                <div className="h-full w-4 bg-[#070710] skew-y-[30deg] origin-bottom-left absolute -left-4 top-0"></div>
                
                {/* Block header with height - cyan color */}
                <div className="h-6 flex items-center justify-center bg-black text-[#7EB5FF] text-sm font-bold">
                  {block.height}
                </div>
                
                {/* Block content with gradient based on pool */}
                <div 
                  className="p-3 flex flex-col h-24 relative overflow-hidden text-center"
                  style={getPoolGradientStyle(block.minedBy)}
                >
                  {/* Content layout with centered text */}
                  <div className="text-white text-xs font-medium mb-1">{block.feesRangeText}</div>
                  <div className="text-yellow-300 text-[10px] font-medium mb-1">{block.feeRange}</div>
                  
                  <div className="text-white font-bold text-sm mb-1">{block.totalBtc} BTC</div>
                  
                  <div className="text-white/90 text-[10px] mb-1">{block.transactionCount.toLocaleString()} txs</div>
                  <div className="mt-auto text-white/80 text-[10px]">{formatTimeAgo(block.timestamp)}</div>
                </div>
                
                {/* Pool info with black background */}
                <div className="bg-black py-1 px-2 flex items-center justify-center space-x-1 border-t border-black/50">
                  <div className="w-3 h-3 rounded-full overflow-hidden flex items-center justify-center">
                    <img 
                      src={getPoolLogo(block.minedBy)} 
                      alt={block.minedBy}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-white text-[10px] font-medium truncate">{block.minedBy}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AuroraContainer>
  );
};

export default BlockchainVisualization;
