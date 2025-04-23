
import { Bitcoin, Wallet, ArrowDownToLine, ArrowUpFromLine, LogIn, Menu, X, User, LogOut, Award, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const isLoggedIn = !!user;
  const walletBalance = isLoggedIn ? '0.00125' : '0.00000000';
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const walletBalanceInSats = Math.floor(parseFloat(walletBalance) * 100000000).toLocaleString();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-btc-darker/80 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
            <Bitcoin className="h-6 w-6 text-btc-orange" />
            <h1 className="text-xl font-bold tracking-tight">
              <span className="text-gradient">Block</span>
              <span className="text-white">Bet</span>
            </h1>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={cn(
              "text-sm font-semibold transition-colors duration-200 transform hover:scale-105",
              location.pathname === "/" ? "text-btc-orange" : "text-white hover:text-btc-orange"
            )}
          >
            Play
          </Link>
          <Link 
            to="/how-to-play" 
            className={cn(
              "text-sm font-semibold transition-colors duration-200 transform hover:scale-105",
              location.pathname === "/how-to-play" ? "text-btc-orange" : "text-white hover:text-btc-orange"
            )}
          >
            How to Play
          </Link>
          <Link 
            to="/leaderboard" 
            className={cn(
              "text-sm font-semibold transition-colors duration-200 transform hover:scale-105",
              location.pathname === "/leaderboard" ? "text-btc-orange" : "text-white hover:text-btc-orange"
            )}
          >
            <span className="flex items-center">
              <Award className="mr-1 h-4 w-4" />
              Leaderboard
            </span>
          </Link>
        </nav>

        <div className="flex items-center space-x-3">
          {isLoggedIn ? (
            <>
              <Link to="/wallet">
                <div className="bg-btc-darker/90 border border-white/10 rounded-full py-1.5 px-3 flex items-center gap-1.5">
                  <Wallet className="h-4 w-4 text-btc-orange" />
                  <span className="text-white font-medium text-sm">{walletBalance} BTC</span>
                </div>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="bg-btc-darker/80 border-white/10 hover:bg-btc-darker hover:border-white/20 font-semibold rounded-full">
                    <User className="mr-1 h-4 w-4 text-btc-orange" />
                    <span className="sr-md:inline">Account</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-btc-darker border-white/10">
                  <DropdownMenuItem 
                    className="flex items-center gap-2 text-white/80 hover:text-btc-orange focus:text-btc-orange font-medium cursor-pointer"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="bg-btc-darker/80 border-white/10 hover:bg-btc-darker hover:border-white/20 font-semibold rounded-full">
                    <Zap className="mr-1 h-4 w-4 text-btc-orange" />
                    <span>Wallet</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-btc-darker border-white/10">
                  <DropdownMenuItem 
                    className="flex items-center gap-2 text-white/80 hover:text-btc-orange focus:text-btc-orange font-medium cursor-pointer"
                    asChild
                  >
                    <Link to="/wallet">
                      <Wallet className="h-4 w-4" />
                      <span>Manage Wallet</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="flex items-center gap-2 text-white/80 hover:text-btc-orange focus:text-btc-orange font-medium cursor-pointer"
                    asChild
                  >
                    <Link to="/wallet?tab=deposit">
                      <ArrowDownToLine className="h-4 w-4" />
                      <span>Deposit</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="flex items-center gap-2 text-white/80 hover:text-btc-orange focus:text-btc-orange font-medium cursor-pointer"
                    asChild
                  >
                    <Link to="/wallet?tab=withdraw">
                      <ArrowUpFromLine className="h-4 w-4" />
                      <span>Withdraw</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <div className="hidden md:flex bg-btc-darker/90 border border-white/10 rounded-full py-1.5 px-3 items-center gap-1.5">
                <Wallet className="h-4 w-4 text-btc-orange" />
                <span className="text-white font-medium text-sm">{walletBalanceInSats} sats</span>
              </div>
            
              <Link to="/auth">
                <Button 
                  variant="outline" 
                  size="sm"
                  className={cn(
                    "bg-btc-orange text-btc-darker border-btc-orange hover:bg-btc-orange/80 hover:text-btc-darker font-semibold tracking-wide rounded-full",
                    isMobile ? "text-xs px-2.5 py-1 h-8" : ""
                  )}
                >
                  <LogIn className={cn("mr-1", isMobile ? "h-3 w-3" : "h-4 w-4")} />
                  <span>Sign / Login</span>
                </Button>
              </Link>
              
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
      
      {mobileMenuOpen && !isLoggedIn && (
        <div className="md:hidden bg-btc-darker border-t border-white/5 animate-in slide-in-from-top-5 duration-200">
          <div className="container mx-auto px-4 py-3 flex flex-col">
            <nav className="flex flex-col space-y-4 py-4 border-b border-white/5">
              <Link 
                to="/" 
                className={cn(
                  "text-sm font-semibold",
                  location.pathname === "/" ? "text-btc-orange" : "text-white hover:text-btc-orange"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                Play
              </Link>
              <Link 
                to="/how-to-play" 
                className={cn(
                  "text-sm font-semibold",
                  location.pathname === "/how-to-play" ? "text-btc-orange" : "text-white hover:text-btc-orange"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                How to Play
              </Link>
              <Link 
                to="/leaderboard" 
                className={cn(
                  "text-sm font-semibold flex items-center",
                  location.pathname === "/leaderboard" ? "text-btc-orange" : "text-white hover:text-btc-orange"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Award className="mr-2 h-4 w-4" />
                Leaderboard
              </Link>
              <Link 
                to="/auth" 
                className={cn(
                  "text-sm font-semibold",
                  location.pathname === "/auth" ? "text-btc-orange" : "text-white hover:text-btc-orange"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign / Login
              </Link>
            </nav>
            
            <div className="py-4 space-y-3">
              <div className="bg-btc-darker/90 border border-white/10 rounded-full py-2 px-4 flex items-center justify-center gap-2">
                <Wallet className="h-4 w-4 text-btc-orange" />
                <span className="text-white font-medium">{walletBalanceInSats} sats</span>
              </div>
              
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