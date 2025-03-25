import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import BlockchainVisualization from '@/components/BlockchainVisualization';
import BettingGrid from '@/components/BettingGrid';
import Footer from '@/components/Footer';
import { useElementAppear } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation';
const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial loading
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  // Animation for sections
  const headerAnimation = useElementAppear(!isLoading, {
    delay: 300
  });
  const blockchainAnimation = useElementAppear(!isLoading, {
    delay: 600
  });
  const bettingGridAnimation = useElementAppear(!isLoading, {
    delay: 900
  });
  return <BackgroundGradientAnimation gradientBackgroundStart="rgb(0, 0, 0)" gradientBackgroundEnd="rgb(7, 7, 7)" firstColor="#FFCC66" secondColor="#D19CFF" thirdColor="#7AE5FF" fourthColor="#FFBB7A" fifthColor="#FFDF7A" pointerColor="rgba(255, 190, 60, 0.4)" blendingValue="hard-light" className="w-full h-full" containerClassName="min-h-screen">
      <div className="min-h-screen pb-20">
        {/* Loading screen */}
        <div className={cn("fixed inset-0 bg-btc-darker z-50 flex flex-col items-center justify-center transition-opacity duration-500", isLoading ? "opacity-100" : "opacity-0 pointer-events-none")}>
          <div className="relative h-20 w-20 mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-btc-orange/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-btc-orange border-r-transparent animate-spin-slow"></div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-center px-4">
            <span className="text-gradient">Block</span>
            <span className="text-white">Bet</span>
          </h1>
          <p className="mt-2 text-white/60 text-center px-4">
            Loading Bitcoin Mining Pool Roulette
          </p>
        </div>
        
        {/* Main content */}
        <Navbar />
        
        <main className="container max-w-7xl mx-auto px-4 pt-24">
          {/* Header */}
          <div style={headerAnimation.style} className="mb-8 text-center">
            <div className="inline-block px-3 py-1 rounded-full bg-btc-orange/10 border border-btc-orange/20 text-btc-orange text-sm font-medium mb-4">
              Bitcoin Mining Pool Prediction Game
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              <span className="text-gradient">Bitcoin</span>
              <span className="text-white">Roulette</span>
              
            </h1>
            <p className="text-white/70 max-w-2xl mx-auto text-sm font-semibold">Predict which mining pool will mine the next Bitcoin block and win up to 83x your bet in Sats!</p>
          </div>
          
          {/* Blockchain visualization */}
          <div style={blockchainAnimation.style} className="mb-8">
            <BlockchainVisualization />
          </div>
          
          {/* Betting grid */}
          <div style={bettingGridAnimation.style}>
            <BettingGrid />
          </div>
        </main>
        
        <Footer />
      </div>
    </BackgroundGradientAnimation>;
};
export default Index;