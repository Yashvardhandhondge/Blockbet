import { Sparkles } from 'lucide-react';
import { MiningPool, Block, UserBalance } from './types';

export const mockUserBalance: UserBalance = {
  availableBalance: 0.15,
  totalBet: 0.02,
  totalWin: 0.05,
};

export const nextBlockEstimate = {
  estimatedTimeMinutes: 9.8,
};

export const miningPools: MiningPool[] = [
  {
    id: 'foundry',
    name: 'Foundry USA',
    hashRate: 83.2,
    hashRatePercent: 21.3,
    odds: 4.69,
    region: 'North America',
    blocksLast24h: 135,
    logoUrl: '/pool-logos/foundryusa.svg',
    gradient: 'linear-gradient(135deg, #4f1a00 0%, #3d1500 100%)',
    colorClass: 'bg-orange-700'
  },
  {
    id: 'antpool',
    name: 'Antpool',
    hashRate: 68.1,
    hashRatePercent: 17.4,
    odds: 5.75,
    region: 'Asia',
    blocksLast24h: 110,
    logoUrl: '/pool-logos/antpool.svg',
    gradient: 'linear-gradient(135deg, #4a0e0e 0%, #2a0606 100%)',
    colorClass: 'bg-red-800'
  },
  {
    id: 'f2pool',
    name: 'F2Pool',
    hashRate: 51.3,
    hashRatePercent: 13.1,
    odds: 7.63,
    region: 'Asia',
    blocksLast24h: 83,
    logoUrl: '/pool-logos/f2pool.svg',
    gradient: 'linear-gradient(135deg, #0a3a4f 0%, #051b24 100%)',
    colorClass: 'bg-blue-800'
  },
  {
    id: 'binance',
    name: 'Binance Pool',
    hashRate: 34.2,
    hashRatePercent: 8.7,
    odds: 11.49,
    region: 'Asia',
    blocksLast24h: 55,
    logoUrl: '/pool-logos/binancepool.svg',
    gradient: 'linear-gradient(135deg, #4a3f0e 0%, #241f05 100%)',
    colorClass: 'bg-amber-600'
  },
  {
    id: 'viabtc',
    name: 'ViaBTC',
    hashRate: 25.7,
    hashRatePercent: 6.6,
    odds: 15.15,
    region: 'Asia',
    blocksLast24h: 42,
    logoUrl: '/pool-logos/viabtc.svg',
    gradient: 'linear-gradient(135deg, #4a2e0e 0%, #221605 100%)',
    colorClass: 'bg-orange-600'
  },
  {
    id: 'slushpool',
    name: 'Slush Pool',
    hashRate: 18.5,
    hashRatePercent: 4.7,
    odds: 21.28,
    region: 'Europe',
    blocksLast24h: 30,
    logoUrl: '/pool-logos/slushpool.svg',
    gradient: 'linear-gradient(135deg, #0a2e4f 0%, #041424 100%)',
    colorClass: 'bg-blue-700'
  },
  {
    id: 'poolin',
    name: 'Poolin',
    hashRate: 15.2,
    hashRatePercent: 3.9,
    odds: 25.64,
    region: 'Asia',
    blocksLast24h: 25,
    logoUrl: '/pool-logos/poolin.svg',
    gradient: 'linear-gradient(135deg, #0a4a30 0%, #052218 100%)',
    colorClass: 'bg-green-800'
  },
  {
    id: 'sbicrypto',
    name: 'SBI Crypto',
    hashRate: 14.1,
    hashRatePercent: 3.6,
    odds: 27.78,
    region: 'Asia',
    blocksLast24h: 22,
    logoUrl: '/pool-logos/sbicrypto.svg',
    gradient: 'linear-gradient(135deg, #1a3366 0%, #0d1b33 100%)',
    colorClass: 'bg-blue-900'
  },
  {
    id: 'braiinspool',
    name: 'Braiins Pool',
    hashRate: 13.3,
    hashRatePercent: 3.4,
    odds: 29.41,
    region: 'Europe',
    blocksLast24h: 21,
    logoUrl: '/pool-logos/braiinspool.svg',
    gradient: 'linear-gradient(135deg, #0a2e4f 0%, #041424 100%)',
    colorClass: 'bg-cyan-700'
  },
  {
    id: 'marapool',
    name: 'Mara Pool',
    hashRate: 12.5,
    hashRatePercent: 3.2,
    odds: 31.25,
    region: 'North America',
    blocksLast24h: 4,
    logoUrl: '/pool-logos/marapool.svg',
    gradient: 'linear-gradient(135deg, #4f1a00 0%, #2d0f00 100%)',
    colorClass: 'bg-amber-800'
  },
  {
    id: 'emcd',
    name: 'EMCD',
    hashRate: 11.8,
    hashRatePercent: 3.0,
    odds: 33.33,
    region: 'Europe',
    blocksLast24h: 19,
    logoUrl: '/pool-logos/emcdpool.svg',
    gradient: 'linear-gradient(135deg, #4a2e0e 0%, #221605 100%)',
    colorClass: 'bg-yellow-800'
  },
  {
    id: 'luxor',
    name: 'Luxor',
    hashRate: 9.2,
    hashRatePercent: 2.4,
    odds: 41.67,
    region: 'North America',
    blocksLast24h: 15,
    logoUrl: '/pool-logos/luxor.svg',
    gradient: 'linear-gradient(135deg, #4a2e0e 0%, #221605 100%)',
    colorClass: 'bg-yellow-700'
  },
  {
    id: 'titan.io',
    name: 'Titan.io',
    hashRate: 8.5,
    hashRatePercent: 2.2,
    odds: 45.45,
    region: 'North America',
    blocksLast24h: 14,
    logoUrl: '/pool-logos/titan.svg',
    gradient: 'linear-gradient(135deg, #4a2e0e 0%, #221605 100%)',
    colorClass: 'bg-stone-700'
  },
  {
    id: 'okex',
    name: 'Okex',
    hashRate: 7.8,
    hashRatePercent: 2.0,
    odds: 50.00,
    region: 'Asia',
    blocksLast24h: 12,
    logoUrl: '/pool-logos/okexpool.svg',
    gradient: 'linear-gradient(135deg, #4a2e0e 0%, #221605 100%)',
    colorClass: 'bg-blue-600'
  },
  {
    id: 'huobi pool',
    name: 'Huobi Pool',
    hashRate: 7.1,
    hashRatePercent: 1.8,
    odds: 55.56,
    region: 'Asia',
    blocksLast24h: 11,
    logoUrl: '/pool-logos/huobipool.svg',
    gradient: 'linear-gradient(135deg, #4a2e0e 0%, #221605 100%)',
    colorClass: 'bg-sky-600'
  },
  {
    id: 'btc.com',
    name: 'BTC.com',
    hashRate: 6.4,
    hashRatePercent: 1.6,
    odds: 62.50,
    region: 'Asia',
    blocksLast24h: 10,
    logoUrl: '/pool-logos/btccom.svg',
    gradient: 'linear-gradient(135deg, #4a2e0e 0%, #221605 100%)',
    colorClass: 'bg-red-600'
  },
  {
    id: 'bitfury',
    name: 'Bitfury',
    hashRate: 5.7,
    hashRatePercent: 1.5,
    odds: 66.67,
    region: 'Europe',
    blocksLast24h: 9,
    logoUrl: '/pool-logos/bitfury.svg',
    gradient: 'linear-gradient(135deg, #4a2e0e 0%, #221605 100%)',
    colorClass: 'bg-slate-700'
  },
  {
    id: 'kano pool',
    name: 'Kano Pool',
    hashRate: 5.0,
    hashRatePercent: 1.3,
    odds: 76.92,
    region: 'North America',
    blocksLast24h: 8,
    logoUrl: '/pool-logos/kucoinpool.svg',
    gradient: 'linear-gradient(135deg, #4a2e0e 0%, #221605 100%)',
    colorClass: 'bg-emerald-700'
  },
  {
    id: 'pega pool',
    name: 'Pega Pool',
    hashRate: 4.3,
    hashRatePercent: 1.1,
    odds: 90.91,
    region: 'Asia',
    blocksLast24h: 7,
    logoUrl: '/pool-logos/pegapool.svg',
    gradient: 'linear-gradient(135deg, #4a2e0e 0%, #221605 100%)',
    colorClass: 'bg-indigo-600'
  },
  {
    id: 'ultimuspool',
    name: 'Ultimuspool',
    hashRate: 3.6,
    hashRatePercent: 0.9,
    odds: 111.11,
    region: 'Europe',
    blocksLast24h: 6,
    logoUrl: '/pool-logos/ultimuspool.svg',
    gradient: 'linear-gradient(135deg, #4a2e0e 0%, #221605 100%)',
    colorClass: 'bg-violet-700'
  },
  {
    id: 'minerium',
    name: 'Minerium',
    hashRate: 2.9,
    hashRatePercent: 0.7,
    odds: 142.86,
    region: 'Europe',
    blocksLast24h: 5,
    logoUrl: '/pool-logos/minerium.svg',
    gradient: 'linear-gradient(135deg, #4a2e0e 0%, #221605 100%)',
    colorClass: 'bg-purple-700'
  },
  {
    id: 'whitepool',
    name: 'Whitepool',
    hashRate: 2.1,
    hashRatePercent: 0.5,
    odds: 200.00,
    region: 'Europe',
    blocksLast24h: 4,
    logoUrl: '/pool-logos/whitepool.svg',
    gradient: 'linear-gradient(135deg, #4a2e0e 0%, #221605 100%)',
    colorClass: 'bg-white/30'
  },
  {
    id: 'carbon negative',
    name: 'Carbon Negative',
    hashRate: 0.7,
    hashRatePercent: 0.2,
    odds: 571.43,
    region: 'North America',
    blocksLast24h: 2,
    logoUrl: '/pool-logos/default.svg',
    gradient: 'linear-gradient(135deg, #4a2e0e 0%, #221605 100%)',
    colorClass: 'bg-green-700'
  },
  {
    id: 'secpool',
    name: 'Secpool',
    hashRate: 0.0,
    hashRatePercent: 0.0,
    odds: 833.33,
    region: 'Asia',
    blocksLast24h: 0,
    logoUrl: '/pool-logos/default.svg',
    gradient: 'linear-gradient(135deg, #4a2e0e 0%, #221605 100%)',
    colorClass: 'bg-gray-700'
  },
];

export const formatTimeAgo = (timestamp: number): string => {
  const now = new Date().getTime();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} days ago`;
};

export const formatBTC = (btc: number): string => {
  return btc.toFixed(8);
};
