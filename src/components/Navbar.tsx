
import { Bitcoin } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
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
      </div>
    </header>
  );
};

export default Navbar;
