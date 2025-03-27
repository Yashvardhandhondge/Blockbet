
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import LatestMiningPool from '@/components/LatestMiningPool';
import MiningPoolStats from '@/components/MiningPoolStats';
import BettingGrid from '@/components/BettingGrid';
import PlaceBetForm from '@/components/PlaceBetForm';
import BetHistory from '@/components/BetHistory';
import Footer from '@/components/Footer';
import LiveBlockData from '@/components/LiveBlockData';
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation';
import { mockMiningPools, mockBetHistory, mockDeposits, mockWithdrawals } from '@/utils/mockData';

const Index = () => {
  const [selectedPool, setSelectedPool] = useState(mockMiningPools[0]);

  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-btc-darker">
      <BackgroundGradientAnimation>
        <Navbar />
        <div className="container mx-auto px-4 py-6 flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-3">
              <LatestMiningPool />
            </div>
            <div className="md:col-span-2">
              <MiningPoolStats />
            </div>
            <div className="md:col-span-1">
              <LiveBlockData />
            </div>
            <div className="md:col-span-3">
              <BettingGrid />
            </div>
            <div className="md:col-span-1">
              <PlaceBetForm selectedPool={selectedPool} />
            </div>
            <div className="md:col-span-2">
              <BetHistory 
                betHistory={mockBetHistory} 
                deposits={mockDeposits} 
                withdrawals={mockWithdrawals} 
              />
            </div>
          </div>
        </div>
        <Footer />
      </BackgroundGradientAnimation>
    </div>
  );
};

export default Index;
