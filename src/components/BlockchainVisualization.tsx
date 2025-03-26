import { useEffect, useState, useRef } from 'react';
import { Block, recentBlocks, miningPools, getRandomMiningPool, formatTimeAgo } from '@/utils/mockData';
import { useRandomInterval } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';
import { AuroraContainer } from '@/components/ui/aurora-container';
import { SparklesText } from '@/components/ui/sparkles-text';
import { Confetti } from '@/components/ui/confetti';

const BlockchainVisualization = () => {
  const [blocks, setBlocks] = useState<Block[]>(recentBlocks);
  const [pendingBlock, setPendingBlock] = useState<number>(50); // Animation progress 0-100
  const [isNewBlockAppearing, setIsNewBlockAppearing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPendingBlock(prev => {
        const newValue = prev + (Math.random() * 2);
        if (newValue >= 100) {
          setTimeout(() => addNewBlock(), 500);
          return 0;
        }
        return newValue;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const addNewBlock = () => {
    setIsNewBlockAppearing(true);
    setShowConfetti(true);
    
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
    
    setTimeout(() => {
      setBlocks(prev => [newBlock, ...prev.slice(0, 9)]);
      setIsNewBlockAppearing(false);
    }, 500);
  };

  const getPoolLogo = (poolName: string): string => {
    const normalizedName = poolName.toLowerCase()
      .replace(/\s+/g, '')
      .replace(/\./g, '')
      .replace(/-/g, '');
    
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
    
    return '/pool-logos/default.svg';
  };

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

  const handleConfettiComplete = () => {
    setShowConfetti(false);
  };
  
  return (
    <AuroraContainer 
      className={cn(
        "w-full group hover:border-white/20 transition-colors rounded-xl overflow-hidden relative",
        showConfetti && "border-2 border-yellow-500/50 shadow-[0_0_15px_2px_rgba(255,215,0,0.5)]"
      )}
    >
      {showConfetti && (
        <Confetti 
          onAnimationComplete={handleConfettiComplete}
          config={{
            elementCount: 150,
            spread: 160,
            startVelocity: 45,
            duration: 4000,
            origin: "left",
            colors: [
              "#FEDA78", "#FFD700", "#FFF4CF", "#D4AF37", "#FFDF00",
              "#f44336", "#e91e63", "#9c27b0", "#2196f3", "#03a9f4", 
              "#4CAF50", "#8BC34A", "#FFEB3B", "#FFC107", "#FF9800"
            ]
          }}
        />
      )}
      
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
        <div className="hidden">
          <div className="p-3 border-b border-white/5 bg-btc-dark/50 flex items-center">
            <div className="flex-shrink-0 mr-4 relative">
              <div className="h-12 w-12 rounded-lg bg-btc-card flex items-center justify-center overflow-hidden">
                <div className="font-mono text-xs text-white/70 animate-pulse">
                  ?
                </div>
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
        
        <div className={cn(
          "absolute inset-0 bg-btc-orange/10 flex items-center justify-center transition-all duration-500",
          isNewBlockAppearing ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
          <div className="bg-btc-dark glass-panel rounded-xl p-4 transform transition-all duration-500 animate-block-appear">
            <h3 className="text-base font-medium text-white mb-1">New Block Found!</h3>
            <p className="text-xs text-white/70">Block #{blocks[0].height + 1} has been mined.</p>
          </div>
        </div>
        
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto hide-scrollbar py-4 pl-4 pr-4 space-x-4 border-b border-white/5 bg-gradient-to-b from-[#0a0a0a] to-[#070707] rounded-b-xl"
          style={{ scrollbarWidth: 'none' }}
        >
          {blocks.map((block, index) => {
            const isLatestBlock = index === 0;
            
            return (
              <div 
                key={`${block.height}-${block.hash.substring(0, 10)}`} 
                className={cn(
                  "flex-shrink-0 w-32 relative group transition-all duration-300 hover:transform hover:scale-[1.03]",
                  index === 0 ? "animate-block-appear" : ""
                )}
              >
                {isLatestBlock && (
                  <div className="absolute -inset-2 pointer-events-none opacity-70 z-10">
                    <SparklesText 
                      text="" 
                      colors={{ first: "#FFD700", second: "#FFF8E1" }}
                      className="absolute inset-0 w-full h-full"
                      sparklesCount={30}
                    />
                  </div>
                )}
                
                <div className={cn(
                  "h-4 w-full bg-[#141420] skew-x-[-25deg] origin-top-right absolute -top-3 left-2",
                  isLatestBlock && "bg-[#2A2000]"
                )}></div>
                
                <div className={cn(
                  "h-full w-4 bg-[#070710] skew-y-[30deg] origin-bottom-left absolute -left-4 top-0",
                  isLatestBlock && "bg-[#1A1500]"
                )}></div>
                
                <div className={cn(
                  "h-6 flex items-center justify-center text-sm font-bold",
                  isLatestBlock ? "bg-black text-yellow-300" : "bg-black text-[#7EB5FF]"
                )}>
                   {block.height}
                </div>
                
                <div 
                  className={cn(
                    "p-3 flex flex-col h-24 relative overflow-hidden text-center",
                    isLatestBlock 
                      ? "bg-gradient-to-b from-yellow-500/90 via-yellow-600/80 to-amber-700/80" 
                      : "bg-gradient-to-b from-purple-600/90 via-indigo-700/80 to-blue-700/80"
                  )}
                >
                  {isLatestBlock && (
                    <div className="absolute inset-0 pointer-events-none opacity-80">
                      <SparklesText 
                        text="" 
                        colors={{ first: "#FFD700", second: "#FFF8E1" }}
                        className="absolute inset-0 w-full h-full"
                        sparklesCount={25}
                      />
                    </div>
                  )}
                  
                  <div className="text-white text-xs font-medium mb-1">{block.feesRangeText}</div>
                  <div className="text-yellow-300 text-[10px] font-medium mb-1">{block.feeRange}</div>
                  
                  <div className="text-white font-bold text-sm mb-1">{block.totalBtc} BTC</div>
                  
                  <div className="text-white/90 text-[10px] mb-1">{block.transactionCount.toLocaleString()} txs</div>
                  <div className="mt-auto text-white/80 text-[10px]">{formatTimeAgo(block.timestamp)}</div>
                </div>
                
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
