
import React, { useState, useEffect } from 'react';
import { Wallet, ArrowDownToLine, ArrowUpFromLine, Bitcoin, RefreshCw, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';
import { formatSats } from '@/utils/formatters';
import { walletManager } from '@/services/lnbitsService';
import { toast } from "sonner";
import LightningDeposit from '@/components/LightningDeposit';
import LightningWithdraw from '@/components/LightningWithdraw';
import { supabase } from '@/integrations/supabase/client';

const WalletPage: React.FC = () => {
  const { user } = useAuth();
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  
  const fetchWalletBalance = async () => {
    if (!user?.id) return;
    
    try {
      setIsRefreshing(true);
      const balanceSats = await walletManager.getWalletBalanceSats(user.id);
      
      if (balanceSats !== null) {
        setWalletBalance(balanceSats);
        
        // Update wallet_balance in the user's profile
        await supabase
          .from('profiles')
          .update({
            wallet_balance: balanceSats / 100000000,
          })
          .eq('id', user.id);
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      toast.error("Failed to fetch wallet balance");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  useEffect(() => {
    fetchWalletBalance();
    
    // Poll for balance updates every 30 seconds
    const intervalId = setInterval(() => {
      fetchWalletBalance();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [user]);

  return (
    <BackgroundGradientAnimation
      gradientBackgroundStart="rgb(0, 0, 0)" 
      gradientBackgroundEnd="rgb(7, 7, 7)" 
      firstColor="#FFCC66" 
      secondColor="#D19CFF" 
      thirdColor="#7AE5FF" 
      fourthColor="#FFBB7A" 
      fifthColor="#FFDF7A"
      pointerColor="rgba(255, 190, 60, 0.4)"
      blendingValue="hard-light"
      className="w-full h-full"
      containerClassName="min-h-screen"
    >
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <div className="container max-w-md mx-auto px-4 pt-32 pb-20 flex-grow">
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <div className="bg-btc-darker/80 p-4 rounded-full border border-btc-orange/20">
                <Wallet size={32} className="text-btc-orange" />
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              <span className="text-white">Lightning Wallet</span>
            </h1>
            <p className="text-white/60">
              Deposit and withdraw using the Lightning Network
            </p>
          </div>
          
          <div className="bg-btc-darker/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-white/60 font-medium">Your Balance</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={fetchWalletBalance} 
                disabled={isRefreshing}
                className="text-white/60 hover:text-white"
              >
                {isRefreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <div className="flex items-center justify-center py-6">
              {isLoading ? (
                <Loader2 size={32} className="animate-spin text-btc-orange" />
              ) : (
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Bitcoin className="h-5 w-5 text-btc-orange mr-2" />
                    <span className="text-3xl font-bold text-white">
                      {walletBalance !== null ? formatSats(walletBalance) : "0"}
                    </span>
                  </div>
                  <p className="text-white/40 text-sm">sats</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-btc-darker/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl">
            <Tabs defaultValue="deposit" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger 
                  value="deposit"
                  className="data-[state=active]:bg-btc-orange/20 data-[state=active]:text-btc-orange"
                >
                  <ArrowDownToLine className="h-4 w-4 mr-2" />
                  Deposit
                </TabsTrigger>
                <TabsTrigger 
                  value="withdraw"
                  className="data-[state=active]:bg-btc-orange/20 data-[state=active]:text-btc-orange"
                >
                  <ArrowUpFromLine className="h-4 w-4 mr-2" />
                  Withdraw
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="deposit">
                <LightningDeposit />
              </TabsContent>
              
              <TabsContent value="withdraw">
                <LightningWithdraw availableBalance={walletBalance || 0} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <Footer />
      </div>
    </BackgroundGradientAnimation>
  );
};

export default WalletPage;
