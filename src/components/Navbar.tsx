import { Bitcoin, Wallet, ArrowDownToLine, ArrowUpFromLine, Menu, X, User, LogOut, Award } from 'lucide-react';
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
import { useBalance } from '@/context/BalanceContext';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const {walletBalance} = useBalance();
  const isLoggedIn = !!user;
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const walletBalanceInSats = Math.floor(walletBalance).toLocaleString();
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
              "text-sm font-semibold flex items-center transition-colors duration-200 transform hover:scale-105",
              location.pathname === "/leaderboard" ? "text-btc-orange" : "text-white hover:text-btc-orange"
            )}
          >
            <Award className="mr-1 h-4 w-4" />
            Leaderboard
          </Link>
          <Link 
            to="/wallet?tab=deposit" 
            className={cn(
              "text-sm font-semibold flex items-center transition-colors duration-200 transform hover:scale-105",
              location.pathname === "/wallet" && location.search.includes("tab=deposit") ? "text-btc-orange" : "text-white hover:text-btc-orange"
            )}
          >
            <ArrowDownToLine className="mr-1 h-4 w-4 text-btc-orange" /> {/* Added text-btc-orange */}
            Deposit
          </Link>
          <Link 
            to="/wallet?tab=withdraw" 
            className={cn(
              "text-sm font-semibold flex items-center transition-colors duration-200 transform hover:scale-105",
              location.pathname === "/wallet" && location.search.includes("tab=withdraw") ? "text-btc-orange" : "text-white hover:text-btc-orange"
            )}
          >
            <ArrowUpFromLine className="mr-1 h-4 w-4 text-btc-orange" /> {/* Added text-btc-orange */}
            Withdraw
          </Link>
          <Link 
            to="/auth" 
            className={cn(
              "text-sm font-semibold flex items-center transition-colors duration-200 transform hover:scale-105",
              location.pathname === "/auth" ? "text-btc-orange" : "text-white hover:text-btc-orange"
            )}
          >
            <User className="mr-1 h-4 w-4" />
            Profile
          </Link>
        </nav>

        <div className="flex items-center space-x-3">
          {isLoggedIn ? (
            <>
              <div className="bg-btc-darker/90 border border-white/10 rounded-full py-1.5 px-3 flex items-center gap-1.5">
                <Wallet className="h-4 w-4 text-btc-orange" />
                <span className="text-white font-medium text-sm">{walletBalance} BTC</span>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="bg-btc-darker/80 border-white/10 hover:bg-btc-darker hover:border-white/20 font-semibold rounded-full">
                    <User className="mr-1 h-4 w-4 text-btc-orange" />
                    <span className="sr-md:inline">Profile</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-btc-darker border-white/10">
                  <DropdownMenuItem 
                    className="flex items-center gap-2 text-white/80 hover:text-btc-orange focus:text-btc-orange font-medium cursor-pointer"
                    asChild
                  >
                    <Link to="/auth">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="flex items-center gap-2 text-white/80 hover:text-btc-orange focus:text-btc-orange font-medium cursor-pointer"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Link to="/wallet?tab=deposit">
                <Button variant="outline" size="sm" className="bg-btc-darker/80 border-white/10 hover:bg-btc-darker hover:border-white/20 font-semibold rounded-full">
                  <ArrowDownToLine className="mr-1 h-4 w-4 text-btc-orange" />
                  <span>Deposit</span>
                </Button>
              </Link>

              <Link to="/wallet?tab=withdraw">
                <Button variant="outline" size="sm" className="bg-btc-darker/80 border-white/10 hover:bg-btc-darker hover:border-white/20 font-semibold rounded-full">
                  <ArrowUpFromLine className="mr-1 h-4 w-4 text-btc-orange" />
                  <span>Withdraw</span>
                </Button>
              </Link>
            </>
          ) : (
            <>
              <div className="bg-btc-darker/90 border border-white/10 rounded-full py-1.5 px-3 flex items-center gap-1.5">
                <Wallet className="h-4 w-4 text-btc-orange" />
                <span className="text-white font-medium text-sm">{walletBalanceInSats} sats</span>
              </div>

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
                  "text-sm font-semibold flex items-center",
                  location.pathname === "/auth" ? "text-btc-orange" : "text-white hover:text-btc-orange"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
              <Link 
                to="/wallet?tab=deposit" 
                className={cn(
                  "text-sm font-semibold flex items-center",
                  location.pathname === "/wallet" && location.search.includes("tab=deposit") ? "text-btc-orange" : "text-white hover:text-btc-orange"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <ArrowDownToLine className="mr-2 h-4 w-4 text-btc-orange" />
                Deposit
              </Link>
              <Link 
                to="/wallet?tab=withdraw" 
                className={cn(
                  "text-sm font-semibold flex items-center",
                  location.pathname === "/wallet" && location.search.includes("tab=withdraw") ? "text-btc-orange" : "text-white hover:text-btc-orange"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <ArrowUpFromLine className="mr-2 h-4 w-4 text-btc-orange" />
                Withdraw
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
