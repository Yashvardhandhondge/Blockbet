
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bitcoin, Home, HelpCircle, Medal, HelpingHand, LogIn, UserPlus, Wallet, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';

const navItems = [
  { name: "Home", url: "/", icon: Home },
  { name: "How to Play", url: "/how-to-play", icon: HelpingHand },
  { name: "Leaderboard", url: "/leaderboard", icon: Medal },
  { name: "FAQ", url: "/faq", icon: HelpCircle },
];

const Navbar = () => {
  // This would typically come from an auth context
  const isLoggedIn = false;
  const walletBalance = '0.00125';
  
  const [activeTab, setActiveTab] = useState(navItems[0].name);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-btc-darker/80 backdrop-blur-md border-b border-white/5 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Bitcoin className="h-6 w-6 text-btc-orange" />
          <h1 className="text-xl font-bold tracking-tight">
            <span className="text-gradient">Block</span>
            <span className="text-white">Bet</span>
          </h1>
        </div>
        
        {/* Navigation - New Style */}
        <div className="fixed bottom-0 sm:top-0 left-1/2 -translate-x-1/2 z-50 mb-6 sm:mt-2 sm:mb-0">
          <div className="flex items-center gap-3 bg-background/5 border border-white/10 backdrop-blur-lg py-1 px-1 rounded-full shadow-lg">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;

              return (
                <Link
                  key={item.name}
                  to={item.url}
                  onClick={() => setActiveTab(item.name)}
                  className={cn(
                    "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors",
                    "text-white/80 hover:text-btc-orange",
                    isActive && "bg-btc-darker/80 text-btc-orange"
                  )}
                >
                  <span className="hidden md:inline">{item.name}</span>
                  <span className="md:hidden">
                    <Icon size={18} strokeWidth={2.5} />
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="lamp"
                      className="absolute inset-0 w-full bg-btc-orange/5 rounded-full -z-10"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-btc-orange rounded-t-full">
                        <div className="absolute w-12 h-6 bg-btc-orange/20 rounded-full blur-md -top-2 -left-2" />
                        <div className="absolute w-8 h-6 bg-btc-orange/20 rounded-full blur-md -top-1" />
                        <div className="absolute w-4 h-4 bg-btc-orange/20 rounded-full blur-sm top-0 left-2" />
                      </div>
                    </motion.div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Auth/Wallet Section */}
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
                  <Button variant="outline" size="sm" className="bg-btc-darker/80 border-white/10 hover:bg-btc-darker hover:border-white/20 font-semibold">
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
              {/* Login button */}
              <Button 
                variant="ghost" 
                size="sm"
                className="text-white hover:text-btc-orange hover:bg-btc-darker/40 font-semibold tracking-wide"
              >
                <LogIn className="mr-1 h-4 w-4" />
                <span>Login</span>
              </Button>
              
              {/* Signup button */}
              <Button 
                variant="outline" 
                size="sm"
                className="bg-btc-orange text-btc-darker border-btc-orange hover:bg-btc-orange/80 hover:text-btc-darker font-semibold tracking-wide"
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
