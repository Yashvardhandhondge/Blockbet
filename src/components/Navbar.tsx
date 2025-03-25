
import { Bitcoin, Wallet, ArrowDownToLine, ArrowUpFromLine, LogIn, UserPlus, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  // This would typically come from an auth context
  const isLoggedIn = false;
  const walletBalance = '0.00125';
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // New wallet counter in sats (1 BTC = 100,000,000 sats)
  const walletBalanceInSats = Math.floor(parseFloat(walletBalance) * 100000000).toLocaleString();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-btc-darker/80 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bitcoin className="h-6 w-6 text-btc-orange" />
          <h1 className="text-xl font-bold tracking-tight">
            <span className="text-gradient">Block</span>
            <span className="text-white">Bet</span>
          </h1>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-sm font-semibold text-white hover:text-btc-orange transition-colors duration-200 transform hover:scale-105">Home</a>
          <a href="#" className="text-sm font-semibold text-white hover:text-btc-orange transition-colors duration-200 transform hover:scale-105">How to Play</a>
          <a href="#" className="text-sm font-semibold text-white hover:text-btc-orange transition-colors duration-200 transform hover:scale-105">Leaderboard</a>
          <a href="#" className="text-sm font-semibold text-white hover:text-btc-orange transition-colors duration-200 transform hover:scale-105">FAQ</a>
        </nav>

        <div className="flex items-center space-x-3">
          {isLoggedIn ? (
            <>
              {/* Wallet display */}
              <div className="bg-btc-darker/90 border border-white/10 rounded-full py-1.5 px-3 flex items-center gap-1.5">
                <Wallet className="h-4 w-4 text-btc-orange" />
                <span className="text-white font-medium text-sm">{walletBalance} BTC</span>
              </div>
              
              {/* Deposit/Withdraw dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="bg-btc-darker/80 border-white/10 hover:bg-btc-darker hover:border-white/20 font-semibold rounded-full">
                    <Wallet className="mr-1 h-4 w-4 text-btc-orange" />
                    <span>Wallet</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-btc-darker border-white/10">
                  <DropdownMenuItem className="flex items-center gap-2 text-white/80 hover:text-btc-orange focus:text-btc-orange font-medium">
                    <ArrowDownToLine className="h-4 w-4" />
                    <span>Deposit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 text-white/80 hover:text-btc-orange focus:text-btc-orange font-medium">
                    <ArrowUpFromLine className="h-4 w-4" />
                    <span>Withdraw</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {/* Wallet amount counter - Desktop only */}
              <div className="hidden md:flex bg-btc-darker/90 border border-white/10 rounded-full py-1.5 px-3 items-center gap-1.5">
                <Wallet className="h-4 w-4 text-btc-orange" />
                <span className="text-white font-medium text-sm">{walletBalanceInSats} sats</span>
              </div>
            
              {/* Desktop buttons */}
              <div className="hidden md:flex space-x-2">
                {/* Deposit button - Updated with rounded corners */}
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-btc-orange text-btc-darker border-btc-orange hover:bg-btc-orange/80 hover:text-btc-darker font-semibold tracking-wide rounded-full"
                >
                  <ArrowDownToLine className="mr-1 h-4 w-4" />
                  <span>Deposit</span>
                </Button>
                
                {/* Withdraw button */}
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-white hover:text-btc-orange hover:bg-btc-darker/40 font-semibold tracking-wide rounded-full"
                >
                  <ArrowUpFromLine className="mr-1 h-4 w-4" />
                  <span>Withdraw</span>
                </Button>
              </div>
              
              {/* Mobile menu toggle button */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="md:hidden text-white hover:text-btc-orange rounded-full"
                onClick={toggleMobileMenu}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && !isLoggedIn && (
        <div className="md:hidden bg-btc-darker border-t border-white/5 animate-in slide-in-from-top-5 duration-200">
          <div className="container mx-auto px-4 py-3 flex flex-col">
            {/* Navigation links */}
            <nav className="flex flex-col space-y-4 py-4 border-b border-white/5">
              <a href="#" className="text-sm font-semibold text-white hover:text-btc-orange">Home</a>
              <a href="#" className="text-sm font-semibold text-white hover:text-btc-orange">How to Play</a>
              <a href="#" className="text-sm font-semibold text-white hover:text-btc-orange">Leaderboard</a>
              <a href="#" className="text-sm font-semibold text-white hover:text-btc-orange">FAQ</a>
            </nav>
            
            {/* Wallet and buttons */}
            <div className="py-4 space-y-3">
              {/* Wallet counter */}
              <div className="bg-btc-darker/90 border border-white/10 rounded-full py-2 px-4 flex items-center justify-center gap-2">
                <Wallet className="h-4 w-4 text-btc-orange" />
                <span className="text-white font-medium">{walletBalanceInSats} sats</span>
              </div>
              
              {/* Buttons - Updated with rounded corners */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-btc-orange text-btc-darker border-btc-orange hover:bg-btc-orange/80 hover:text-btc-darker font-semibold tracking-wide w-full rounded-full"
                >
                  <ArrowDownToLine className="mr-1 h-4 w-4" />
                  <span>Deposit</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-btc-darker border-white/10 text-white hover:text-btc-orange hover:border-btc-orange/40 font-semibold tracking-wide w-full rounded-full"
                >
                  <ArrowUpFromLine className="mr-1 h-4 w-4" />
                  <span>Withdraw</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
