
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ToastContentProps {
  title: string;
  description?: string;
  poolName?: string;
  variant?: "default" | "destructive";
}

const getPoolLogo = (poolName: string): string => {
  if (!poolName) return '/pool-logos/unknown.svg';
  
  // Convert pool name to lowercase for case-insensitive matching
  const normalizedName = poolName.toLowerCase().trim();
  
  // Map of known pool names to their logo paths
  const poolLogoMap: { [key: string]: string } = {
    'foundry usa': '/pool-logos/foundryusa.svg',
    'antpool': '/pool-logos/antpool.svg',
    'f2pool': '/pool-logos/f2pool.svg',
    'binance pool': '/pool-logos/binancepool.svg',
    'viabtc': '/pool-logos/viabtc.svg',
    'slushpool': '/pool-logos/slushpool.svg',
    'braiins pool': '/pool-logos/braiinspool.svg',
    'poolin': '/pool-logos/poolin.svg',
    'btc.com': '/pool-logos/btccom.svg',
    'sbi crypto': '/pool-logos/sbicrypto.svg',
    'emcd': '/pool-logos/emcdpool.svg',
    'luxor': '/pool-logos/luxor.svg',
    'kano pool': '/pool-logos/kucoinpool.svg',
    'pega pool': '/pool-logos/pegapool.svg',
    'ultimuspool': '/pool-logos/ultimuspool.svg',
    'minerium': '/pool-logos/minerium.svg',
    'titan.io': '/pool-logos/titan.svg',
    'bitfury': '/pool-logos/bitfury.svg',
    'okex': '/pool-logos/okexpool.svg',
    'huobi pool': '/pool-logos/huobipool.svg',
    'mara pool': '/pool-logos/marapool.svg',
    'whitepool': '/pool-logos/whitepool.svg',
    'spiderpool': '/pool-logos/spiderpool.svg',
    'rawpool': '/pool-logos/rawpool.svg',
    'sigmapool': '/pool-logos/sigmapoolcom.svg',
    'secpool': '/pool-logos/secpool.svg', // Adding explicit mapping for SECPOOL
  };
  
  // Check if we have a logo for this pool
  for (const [key, value] of Object.entries(poolLogoMap)) {
    if (normalizedName.includes(key)) {
      return value;
    }
  }
  
  // Return default logo if no match found
  return '/pool-logos/default.svg';
};

export function ToastContent({ title, description, poolName, variant = "default" }: ToastContentProps) {
  return (
    <div className={cn(
      "flex items-center gap-3 py-1", 
      variant === "destructive" ? "text-red-400" : "text-white"
    )}>
      {poolName && (
        <Avatar className="h-8 w-8 border-2 border-btc-orange/20 bg-[#0a0a0a]">
          <AvatarImage src={getPoolLogo(poolName)} alt={poolName} />
          <AvatarFallback className="bg-btc-dark text-white text-xs">
            {poolName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
      <div>
        <div className="font-medium text-base text-btc-orange">{title}</div>
        {description && <div className="text-sm text-white/90">{description}</div>}
      </div>
    </div>
  );
}
