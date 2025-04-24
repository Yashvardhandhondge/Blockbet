
import React from 'react';
import { Github, Twitter, Instagram, Mail, Phone, Globe } from 'lucide-react';
import { GlowEffect } from './ui/glow-effect';

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-btc-orange/20 pt-12 pb-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <GlowEffect
          colors={['#FFDB85', '#8DF2FF', '#DDB4FF', '#FFD294']}
          blur="strong"
          scale={1.5}
          mode="rotate"
          className="opacity-20"
        />
      </div>
      
      <div className="container max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">About BlockBet</h3>
            <p className="text-white/70 mb-4">
              BlockBet is a Bitcoin-based prediction game where players bet on which mining pool will mine the next Bitcoin block.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-btc-orange transition-colors">
                <Github size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-btc-orange transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-btc-orange transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/how-to-play" className="text-white/70 hover:text-btc-orange transition-colors">How to Play</a>
              </li>
              <li>
                <a href="/auth" className="text-white/70 hover:text-btc-orange transition-colors">Profile</a>
              </li>
              <li>
                <a href="/wallet?tab=deposit" className="text-white/70 hover:text-btc-orange transition-colors">Deposit</a>
              </li>
              <li>
                <a href="/wallet?tab=withdraw" className="text-white/70 hover:text-btc-orange transition-colors">Withdraw</a>
              </li>
              <li>
                <a href="/leaderboard" className="text-white/70 hover:text-btc-orange transition-colors">Leaderboard</a>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-white/70">
                <Mail size={16} /> support@blockbet.com
              </li>
              <li className="flex items-center gap-2 text-white/70">
                <Phone size={16} /> +1 (123) 456-7890
              </li>
              <li className="flex items-center gap-2 text-white/70">
                <Globe size={16} /> www.blockbet.com
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white/70 hover:text-btc-orange transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-btc-orange transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-btc-orange transition-colors">Responsible Gaming</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-btc-orange/20 mt-10 pt-6 text-center text-white/50 text-sm">
          <p>
            18+ Gambling involves risk. Only gamble with funds you can afford to lose. Gambling is not a solution to financial problems.
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} BlockBet. All rights reserved. Bitcoin blockchain data provided by third-party APIs.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
