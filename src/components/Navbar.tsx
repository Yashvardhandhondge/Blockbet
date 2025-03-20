
import { Bitcoin, Wallet, ArrowDownToLine, ArrowUpFromLine, LogIn, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
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
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-sm text-white/80 hover:text-btc-orange transition-colors">Home</a>
          <a href="#" className="text-sm text-white/80 hover:text-btc-orange transition-colors">How to Play</a>
          <a href="#" className="text-sm text-white/80 hover:text-btc-orange transition-colors">Leaderboard</a>
          <a href="#" className="text-sm text-white/80 hover:text-btc-orange transition-colors">FAQ</a>
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
                  <Button variant="outline" size="sm" className="bg-btc-darker/80 border-white/10 hover:bg-btc-darker hover:border-white/20">
                    <Wallet className="mr-1 h-4 w-4 text-btc-orange" />
                    <span>Wallet</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-btc-darker border-white/10">
                  <DropdownMenuItem className="flex items-center gap-2 text-white/80 hover:text-btc-orange focus:text-btc-orange">
                    <ArrowDownToLine className="h-4 w-4" />
                    <span>Deposit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 text-white/80 hover:text-btc-orange focus:text-btc-orange">
                    <ArrowUpFromLine className="h-4 w-4" />
                    <span>Withdraw</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {/* Login button */}
              <Button 
                variant="ghost" 
                size="sm"
                className="text-white/80 hover:text-btc-orange hover:bg-btc-darker/40"
              >
                <LogIn className="mr-1 h-4 w-4" />
                <span>Login</span>
              </Button>
              
              {/* Signup button */}
              <Button 
                variant="outline" 
                size="sm"
                className="bg-btc-orange text-btc-darker border-btc-orange hover:bg-btc-orange/80 hover:text-btc-darker"
              >
                <UserPlus className="mr-1 h-4 w-4" />
                <span>Sign Up</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
