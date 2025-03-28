
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import MiningPoolCard from './MiningPoolCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PlaceBetForm from './PlaceBetForm';
import BetHistory from './BetHistory';

const poolOptions = [
  { id: 'foundry', name: 'Foundry USA', probability: 0.34 },
  { id: 'antpool', name: 'AntPool', probability: 0.21 },
  { id: 'f2pool', name: 'F2Pool', probability: 0.14 },
  { id: 'binance', name: 'Binance Pool', probability: 0.09 },
  { id: 'viabtc', name: 'ViaBTC', probability: 0.08 },
  { id: 'braiins', name: 'Braiins Pool', probability: 0.06 },
  { id: 'poolin', name: 'Poolin', probability: 0.03 },
  { id: 'btccom', name: 'BTC.com', probability: 0.02 },
  { id: 'sbicrypto', name: 'SBI Crypto', probability: 0.015 },
  { id: 'luxor', name: 'Luxor', probability: 0.01 },
  { id: 'ultimuspool', name: 'Ultimus Pool', probability: 0.005 },
  { id: 'whitepool', name: 'White Pool', probability: 0.005 }
];

const betHistoryData = [
  {
    id: 1,
    poolId: "foundry",
    poolName: "Foundry USA",
    amount: 50000,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    isWin: true,
    blockHeight: 809455
  },
  {
    id: 2,
    poolId: "antpool",
    poolName: "AntPool",
    amount: 25000,
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
    isWin: false,
    blockHeight: 809390
  },
  {
    id: 3,
    poolId: "binance",
    poolName: "Binance Pool",
    amount: 10000,
    timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000), // 3 days ago
    isWin: false,
    blockHeight: 809325
  }
];

const BettingGrid: React.FC = () => {
  const [selectedPools, setSelectedPools] = useState<string[]>([]);
  const [selectedChip, setSelectedChip] = useState<number>(10000);
  
  const handlePoolClick = (poolId: string) => {
    if (selectedPools.includes(poolId)) {
      setSelectedPools(selectedPools.filter(id => id !== poolId));
    } else {
      setSelectedPools([...selectedPools, poolId]);
    }
  };
  
  const clearSelection = () => {
    setSelectedPools([]);
  };
  
  const handlePlaceBet = () => {
    console.log('Placing bet on:', selectedPools, 'with', selectedChip, 'sats');
    
    const betAmount = selectedPools.length * selectedChip;
    
    // Dispatch a custom event that is listened for by the LatestMiningPool component
    // to trigger checking if user won when a new block arrives
    const event = new CustomEvent('betPlaced', { 
      detail: { 
        poolIds: selectedPools,
        amount: betAmount
      } 
    });
    window.dispatchEvent(event);
    
    // Clear selection after placing bet
    setSelectedPools([]);
  };
  
  return (
    <div className="bg-btc-dark rounded-xl p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold mb-6">
        <span className="text-gradient">Bitcoin</span> Mining Pool Betting
      </h2>
      
      <Tabs defaultValue="bet" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-black/50">
          <TabsTrigger value="bet" className="text-sm">Place Bets</TabsTrigger>
          <TabsTrigger value="history" className="text-sm">Bet History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bet" className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-white">Step 1: Choose Amount</h3>
            <PlaceBetForm 
              selectedChip={selectedChip}
              setSelectedChip={setSelectedChip}
            />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-white">Step 2: Select Number of Mining Pools</h3>
            <div className="bg-btc-darker rounded-lg p-3 text-sm text-white/80">
              <p>You can select multiple pools to increase your chance of winning, but this will 
                 split your bet equally between each pool. <span className="text-btc-orange">Select 1 pool for highest payout.</span>
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <div className="px-2 py-1 bg-black rounded flex items-center gap-1">
                  <span className="text-xs text-white/60">Selected:</span>
                  <span className="font-medium text-white">{selectedPools.length || "None"}</span>
                </div>
                
                <div className="px-2 py-1 bg-black rounded flex items-center gap-1">
                  <span className="text-xs text-white/60">Bet per pool:</span>
                  <span className="font-medium text-white">{selectedPools.length ? 
                    `${(selectedChip).toLocaleString()} sats` : "0 sats"}</span>
                </div>
                
                <div className="px-2 py-1 bg-black rounded flex items-center gap-1">
                  <span className="text-xs text-white/60">Total bet:</span>
                  <span className="font-medium text-white">{selectedPools.length ? 
                    `${(selectedPools.length * selectedChip).toLocaleString()} sats` : "0 sats"}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">Step 3: Place Your Bets On Mining Pools</h3>
              
              <div className="flex gap-2">
                <button 
                  onClick={clearSelection}
                  className="px-3 py-1 text-xs bg-black/50 text-white/70 hover:bg-black/80 hover:text-white rounded-full transition-colors"
                  disabled={selectedPools.length === 0}
                >
                  Clear
                </button>
                
                <button 
                  onClick={handlePlaceBet}
                  className={cn(
                    "px-3 py-1 text-xs rounded-full transition-colors",
                    selectedPools.length > 0 
                      ? "bg-btc-orange text-white hover:bg-btc-orange/80" 
                      : "bg-btc-orange/20 text-btc-orange/50 cursor-not-allowed"
                  )}
                  disabled={selectedPools.length === 0}
                >
                  Place Bet
                </button>
              </div>
            </div>
            
            <div className="mining-pool-grid">
              {poolOptions.map((pool) => (
                <MiningPoolCard
                  key={pool.id}
                  id={pool.id}
                  name={pool.name}
                  probability={pool.probability}
                  isSelected={selectedPools.includes(pool.id)}
                  onClick={() => handlePoolClick(pool.id)}
                  selectedChip={selectedChip}
                />
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <BetHistory bets={betHistoryData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BettingGrid;
