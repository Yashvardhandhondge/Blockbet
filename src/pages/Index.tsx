import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import BettingGrid from '@/components/BettingGrid';
import Footer from '@/components/Footer';
import { useElementAppear } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation';
import LatestMiningPool from '@/components/LatestMiningPool';
import { useIsMobile } from '@/hooks/use-mobile';
import WinConfetti from '@/components/WinConfetti';
import LiveBlockData from '@/components/LiveBlockData';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const isMobile = useIsMobile();

  // Simulate initial loading
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  // Listen for player win events from BettingGrid
// Listen for player win events from BettingGrid
useEffect(() => {
  const handlePlayerWin = (e: CustomEvent<any>) => {
    console.log('Player win event received in Index:', {
      timestamp: new Date().toISOString(),
      eventDetail: e.detail
    });
    
    // Trigger the confetti effect
    setShowConfetti(true);
    
    // For debugging
    setTimeout(() => {
      console.log('Confetti effect should now be visible');
    }, 100);
  };

  console.log('Adding playerWin event listener');
  // Event listener for player winning
  window.addEventListener('playerWin', handlePlayerWin as EventListener);
  
  return () => {
    console.log('Cleaning up win event listener');
    window.removeEventListener('playerWin', handlePlayerWin as EventListener);
  };
}, []);

  // Animation for sections
  const headerAnimation = useElementAppear(!isLoading, {
    delay: 300
  });
  const miningPoolAnimation = useElementAppear(!isLoading, {
    delay: 675
  });
  const bettingGridAnimation = useElementAppear(!isLoading, {
    delay: 900
  });

  return <BackgroundGradientAnimation gradientBackgroundStart="rgb(0, 0, 0)" gradientBackgroundEnd="rgb(7, 7, 7)" firstColor="#FFCC66" secondColor="#D19CFF" thirdColor="#7AE5FF" fourthColor="#FFBB7A" fifthColor="#FFDF7A" pointerColor="rgba(255, 190, 60, 0.4)" blendingValue="hard-light" className="w-full h-full" containerClassName="min-h-screen">
      <div className="min-h-screen pb-20">
        {/* Win Confetti Effect */}
        <WinConfetti 
          isActive={showConfetti} 
          duration={5000}
          onComplete={() => setShowConfetti(false)}
        />
        
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
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              <span className="text-gradient">Bitcoin</span>
              <span className="text-white"> Roulette</span>
            </h1>
            <div className="inline-block px-3 py-1 rounded-full bg-btc-orange/10 border border-btc-orange/20 text-btc-orange text-sm font-medium">
              Bitcoin Mining Pool Prediction Game
            </div>
          </div>

          {/* Latest mining pool display */}
          <div style={miningPoolAnimation.style} className="mb-5">
            <LatestMiningPool />
            {/* Add LiveBlockData component to trigger block mining events */}
            <div className="hidden">
              <LiveBlockData />
            </div>
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
