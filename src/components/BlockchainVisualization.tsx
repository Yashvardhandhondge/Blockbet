
import { useEffect, useState } from 'react';
import { Block, recentBlocks, miningPools, getRandomMiningPool, formatTimeAgo } from '@/utils/mockData';
import { useRandomInterval } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { ArrowUpDown, ArrowDown, RefreshCw } from 'lucide-react';

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
      fees: parseFloat((Math.random() * 0.5 + 0.1).toFixed(2)),
      feeRate: Math.floor(Math.random() * 5) + 1,
      amount: parseFloat((Math.random() * 0.05 + 0.01).toFixed(3))
    };
    
    // Update blocks state
    setTimeout(() => {
      setBlocks(prev => [newBlock, ...prev.slice(0, 4)]);
      setIsNewBlockAppearing(false);
    }, 500);
  };
  
  // Function to get pool color class based on fee rate
  const getBlockColorClass = (feeRate: number): string => {
    if (feeRate >= 4) return 'bg-gradient-to-r from-cyan-600 to-cyan-500';
    if (feeRate >= 3) return 'bg-gradient-to-r from-blue-700 to-blue-600';
    if (feeRate >= 2) return 'bg-gradient-to-r from-purple-700 to-purple-600';
    return 'bg-gradient-to-r from-green-700 to-green-600';
  };

  const getFeeLabelText = (feeRate: number): string => {
    return `~${feeRate} sat/vB`;
  };

  const getFeeLabelDetailText = (feeRate: number): string => {
    if (feeRate >= 4) return `2 - 1,000 sat/vB`;
    if (feeRate >= 3) return `2 - 500 sat/vB`;
    if (feeRate >= 2) return `2 - 40 sat/vB`;
    return `1 - ${Math.floor(Math.random() * 300) + 1} sat/vB`;
  };
  
  return (
    <div className="w-full">
      {/* Blockchain visualization header */}
      <div className="flex justify-center items-center mb-1 text-white/60 py-3 relative">
        <ArrowUpDown className="h-4 w-4 absolute left-0" />
        {blocks.map((block, index) => (
          <div key={`height-${block.height}`} className="px-10 text-cyan-400 font-mono text-lg">
            {block.height}
          </div>
        ))}
        <div className="absolute right-0 flex items-center">
          <RefreshCw className="h-4 w-4 mr-2" />
          <ArrowDown className="h-4 w-4" />
        </div>
      </div>
      
      {/* Blocks visualization */}
      <div className="flex space-x-1 mb-4 overflow-x-auto pb-2">
        {blocks.map((block, index) => (
          <div 
            key={block.hash} 
            className="flex-shrink-0 min-w-44 w-44"
          >
            <div className={cn(
              "rounded-md overflow-hidden",
              getBlockColorClass(block.feeRate)
            )}>
              <div className="px-3 pt-3 pb-1 text-white/90">
                <div className="text-sm font-medium">{getFeeLabelText(block.feeRate)}</div>
                <div className="text-xs opacity-80">{getFeeLabelDetailText(block.feeRate)}</div>
              </div>
              
              <div className="px-3 pt-2 pb-2 flex flex-col">
                <div className="text-2xl font-semibold text-white/95">{block.amount} BTC</div>
                <div className="text-sm text-white/80">{block.transactionCount.toLocaleString()} transactions</div>
              </div>
              
              <div className="px-3 py-1 bg-black/20 text-white/90">
                <div className="text-sm">
                  {index === 0 ? 'In ~9 minutes' : `${Math.floor(index * 10) + 4} minutes ago`}
                </div>
              </div>
            </div>
            
            {/* Mining pool label */}
            <div className="mt-2 flex items-center justify-center">
              <div className="h-4 w-4 rounded-full bg-orange-500 mr-1 flex items-center justify-center text-xs">
                ⚡
              </div>
              <span className="text-sm text-white/70">
                {block.minedBy}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Transaction fees section */}
      <div className="flex flex-col bg-btc-darker/70 rounded-md border border-white/5 p-4 mb-3">
        <div className="uppercase text-xs text-white/50 mb-2 tracking-wider">Transaction Fees</div>
        
        <div className="flex w-full">
          <div className="h-10 bg-green-700 text-white text-center flex items-center justify-center px-2 rounded-l-md text-sm w-1/4">
            No Priority
          </div>
          <div className="h-10 bg-gradient-to-r from-green-700 via-yellow-700 to-orange-700 flex-grow rounded-r-md flex">
            <div className="w-1/3 text-white text-center flex items-center justify-center text-sm">
              Low Priority
            </div>
            <div className="w-1/3 text-white text-center flex items-center justify-center text-sm">
              Medium Priority
            </div>
            <div className="w-1/3 text-white text-center flex items-center justify-center text-sm">
              High Priority
            </div>
          </div>
        </div>
        
        <div className="flex mt-4 justify-between">
          <div className="text-center">
            <div className="text-xl font-semibold flex items-baseline">
              <span className="text-white">2</span>
              <span className="text-xs text-white/50 ml-1">sat/vB</span>
            </div>
            <div className="text-green-500 text-sm font-medium">$0.24</div>
          </div>
          
          <div className="text-center">
            <div className="text-xl font-semibold flex items-baseline">
              <span className="text-white">2</span>
              <span className="text-xs text-white/50 ml-1">sat/vB</span>
            </div>
            <div className="text-green-500 text-sm font-medium">$0.24</div>
          </div>
          
          <div className="text-center">
            <div className="text-xl font-semibold flex items-baseline">
              <span className="text-white">2</span>
              <span className="text-xs text-white/50 ml-1">sat/vB</span>
            </div>
            <div className="text-green-500 text-sm font-medium">$0.24</div>
          </div>
          
          <div className="text-center">
            <div className="text-xl font-semibold flex items-baseline">
              <span className="text-white">2</span>
              <span className="text-xs text-white/50 ml-1">sat/vB</span>
            </div>
            <div className="text-green-500 text-sm font-medium">$0.24</div>
          </div>
        </div>
      </div>
      
      {/* Block time section */}
      <div className="flex flex-col bg-btc-darker/70 rounded-md border border-white/5 p-4">
        <div className="uppercase text-xs text-white/50 mb-2 tracking-wider">Difficulty Adjustment</div>
        
        <div className="w-full h-3 bg-btc-dark rounded overflow-hidden mb-4">
          <div className="h-full bg-gradient-to-r from-blue-600 to-blue-500" style={{ width: '75%' }}></div>
        </div>
        
        <div className="flex justify-between">
          <div>
            <div className="text-xl font-semibold text-white">~9.9 minutes</div>
            <div className="text-sm text-white/50">Average block time</div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center justify-end">
              <div className="text-green-500 mr-1">▲</div>
              <div className="text-xl font-semibold text-green-500">1.23 %</div>
            </div>
            <div className="text-sm text-white/50">Previous: <span className="text-green-500">▲ 1.43 %</span></div>
          </div>
          
          <div className="text-right">
            <div className="text-xl font-semibold text-white">In ~3 days</div>
            <div className="text-sm text-white/50">March 23 at 8:06 AM</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainVisualization;
