
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bitcoin, Menu, X, Wallet, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatBTC } from '@/utils/mockData';

interface NavbarProps {
  balance: number;
}

const Navbar = ({ balance }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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
        
        <div className="hidden md:flex items-center space-x-3">
          <div className="px-3 py-1.5 bg-btc-card rounded-lg flex items-center">
            <Wallet className="h-4 w-4 text-btc-orange mr-2" />
            <span className="text-sm font-medium">{formatBTC(balance)}</span>
          </div>
          
          <Button
            variant="outline" 
            size="sm"
            className="border-btc-orange/40 hover:border-btc-orange text-btc-orange hover:bg-btc-orange/10"
          >
            Deposit
          </Button>
          
          <Button
            size="sm"
            className="bg-btc-orange hover:bg-btc-orange/90 text-btc-dark"
          >
            <User className="h-4 w-4 mr-1.5" />
            Sign In
          </Button>
        </div>
        
        <button 
          className="md:hidden text-white/80 hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>
      
      {/* Mobile menu */}
      <div className={cn(
        "fixed inset-0 bg-btc-darker/95 backdrop-blur-md flex flex-col z-40 transition-transform duration-300 ease-in-out pt-16",
        mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
      )}>
        <div className="container mx-auto px-4 py-8 flex flex-col space-y-6">
          <a href="#" className="text-lg text-white hover:text-btc-orange transition-colors">Home</a>
          <a href="#" className="text-lg text-white hover:text-btc-orange transition-colors">How to Play</a>
          <a href="#" className="text-lg text-white hover:text-btc-orange transition-colors">Leaderboard</a>
          <a href="#" className="text-lg text-white hover:text-btc-orange transition-colors">FAQ</a>
          
          <div className="border-t border-white/10 pt-6 flex flex-col space-y-4">
            <div className="p-3 bg-btc-card rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                <Wallet className="h-5 w-5 text-btc-orange mr-2" />
                <span className="font-medium">{formatBTC(balance)}</span>
              </div>
              <Button
                variant="outline" 
                size="sm"
                className="border-btc-orange/40 hover:border-btc-orange text-btc-orange hover:bg-btc-orange/10"
              >
                Deposit
              </Button>
            </div>
            
            <Button
              className="w-full bg-btc-orange hover:bg-btc-orange/90 text-btc-dark"
            >
              <User className="h-4 w-4 mr-1.5" />
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
