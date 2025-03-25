
import { Github, Twitter, Discord, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-12 pb-8 border-t border-white/10 pt-10">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Bitcoin Roulette</h3>
            <p className="text-white/70 mb-4">
              The premier Bitcoin-based mining pool prediction game. 
              Place your bets on which mining pool will mine the next block and win BTC rewards.
            </p>
          </div>
          
          {/* Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/70 hover:text-btc-orange transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/how-to-play" className="text-white/70 hover:text-btc-orange transition-colors">
                  How to Play
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-white/70 hover:text-btc-orange transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-white/70 hover:text-btc-orange transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Connect */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Connect With Us</h3>
            <div className="flex space-x-4 mb-4">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-btc-darker hover:bg-btc-orange/20 hover-glow text-white/80 hover:text-btc-orange p-2 rounded-full transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="https://discord.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-btc-darker hover:bg-btc-orange/20 hover-glow text-white/80 hover:text-btc-orange p-2 rounded-full transition-all duration-300"
                aria-label="Discord"
              >
                <Discord size={20} />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-btc-darker hover:bg-btc-orange/20 hover-glow text-white/80 hover:text-btc-orange p-2 rounded-full transition-all duration-300"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-btc-darker hover:bg-btc-orange/20 hover-glow text-white/80 hover:text-btc-orange p-2 rounded-full transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
            <p className="text-white/70">
              Questions? <a href="mailto:support@bitcoinroulette.com" className="text-btc-orange hover:underline">support@bitcoinroulette.com</a>
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/50 text-sm mb-4 md:mb-0">
            © {currentYear} Bitcoin Roulette. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-white/50">
            <span>This site is for entertainment purposes only</span>
            <span className="hidden md:inline">|</span>
            <span>18+ Gamble responsibly</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
