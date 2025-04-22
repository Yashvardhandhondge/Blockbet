
import { PoolPayout } from '@/services/mempoolService';

export interface MiningPool {
  id: string;
  name: string;
  hashRate: number;
  hashRatePercent: number;
  blocksLast24h: number;
  colorClass: string;
  odds: number;
  region: string;
  logoUrl?: string;
  gradient?: string;
}

// Mining pools with default values (will be updated dynamically)
export const miningPools: MiningPool[] = [
  {
    id: 'empty',
    name: 'Empty Block',
    hashRate: 0,
    hashRatePercent: 0,
    blocksLast24h: 0,
    colorClass: 'bg-gray-600',
    odds: 35.0, // Static 35x payout for Empty Block
    region: 'Global',
    logoUrl: '/pool-logos/unknown.svg',
    gradient: 'linear-gradient(135deg, #333333, #222222)'
  },
  {
    id: 'foundry',
    name: 'Foundry USA',
    hashRate: 156.2,
    hashRatePercent: 28.9,
    blocksLast24h: 38,
    colorClass: 'bg-orange-600',
    odds: 2.0,
    region: 'North America',
    logoUrl: '/pool-logos/foundryusa.svg',
    gradient: 'linear-gradient(135deg, #F97316, #EA580C)'
  },
  {
    id: 'antpool',
    name: 'AntPool',
    hashRate: 94.3,
    hashRatePercent: 14.8,
    blocksLast24h: 24,
    colorClass: 'bg-red-600',
    odds: 2.5,
    region: 'Asia',
    logoUrl: '/pool-logos/antpool.svg',
    gradient: 'linear-gradient(135deg, #E74C3C, #C0392B)'
  },
  {
    id: 'f2pool',
    name: 'F2Pool',
    hashRate: 75.8,
    hashRatePercent: 12.1,
    blocksLast24h: 18,
    colorClass: 'bg-blue-600',
    odds: 3.0,
    region: 'Asia',
    logoUrl: '/pool-logos/f2pool.svg',
    gradient: 'linear-gradient(135deg, #3498DB, #2980B9)'
  },
  {
    id: 'viabtc',
    name: 'ViaBTC',
    hashRate: 58.5,
    hashRatePercent: 8.4,
    blocksLast24h: 14,
    colorClass: 'bg-amber-600',
    odds: 3.5,
    region: 'Asia',
    logoUrl: '/pool-logos/viabtc.svg',
    gradient: 'linear-gradient(135deg, #E67E22, #D35400)'
  },
  {
    id: 'binance',
    name: 'Binance Pool',
    hashRate: 45.1,
    hashRatePercent: 7.2,
    blocksLast24h: 12,
    colorClass: 'bg-yellow-500',
    odds: 4.0,
    region: 'Global',
    logoUrl: '/pool-logos/binancepool.svg',
    gradient: 'linear-gradient(135deg, #F1C40F, #F39C12)'
  },
  {
    id: 'poolin',
    name: 'Poolin',
    hashRate: 37.6,
    hashRatePercent: 6.0,
    blocksLast24h: 10,
    colorClass: 'bg-green-600',
    odds: 4.5,
    region: 'Asia',
    logoUrl: '/pool-logos/poolin.svg',
    gradient: 'linear-gradient(135deg, #2ECC71, #27AE60)'
  },
  {
    id: 'braiinspool',
    name: 'Braiins Pool',
    hashRate: 31.5,
    hashRatePercent: 5.0,
    blocksLast24h: 8,
    colorClass: 'bg-teal-500',
    odds: 5.0,
    region: 'Europe',
    logoUrl: '/pool-logos/braiinspool.svg',
    gradient: 'linear-gradient(135deg, #1ABC9C, #16A085)'
  },
  {
    id: 'sbicrypto',
    name: 'SBI Crypto',
    hashRate: 25.1,
    hashRatePercent: 4.0,
    blocksLast24h: 6,
    colorClass: 'bg-blue-800',
    odds: 5.5,
    region: 'Asia',
    logoUrl: '/pool-logos/sbicrypto.svg',
    gradient: 'linear-gradient(135deg, #0065F5, #004BB2)'
  },
  {
    id: 'luxor',
    name: 'Luxor',
    hashRate: 18.8,
    hashRatePercent: 3.0,
    blocksLast24h: 5,
    colorClass: 'bg-amber-500',
    odds: 6.0,
    region: 'North America',
    logoUrl: '/pool-logos/luxor.svg',
    gradient: 'linear-gradient(135deg, #F0BB31, #D69F1E)'
  },
  {
    id: 'bitcoincom',
    name: 'Bitcoin.com',
    hashRate: 16.3,
    hashRatePercent: 2.4,
    blocksLast24h: 4,
    colorClass: 'bg-purple-600',
    odds: 6.5,
    region: 'Global',
    logoUrl: '/pool-logos/bitcoincom.svg',
    gradient: 'linear-gradient(135deg, #9B59B6, #8E44AD)'
  },
  {
    id: 'spiderpool',
    name: 'SpiderPool',
    hashRate: 12.6,
    hashRatePercent: 1.8,
    blocksLast24h: 3,
    colorClass: 'bg-amber-600',
    odds: 7.0,
    region: 'Asia',
    logoUrl: '/pool-logos/spiderpool.svg',
    gradient: 'linear-gradient(135deg, #D6A300, #B58600)'
  },
  {
    id: 'ultimuspool',
    name: 'Ultimus Pool',
    hashRate: 10.0,
    hashRatePercent: 1.4,
    blocksLast24h: 3,
    colorClass: 'bg-blue-700',
    odds: 7.5,
    region: 'North America',
    logoUrl: '/pool-logos/ultimuspool.svg',
    gradient: 'linear-gradient(135deg, #3E59DC, #1652EE)'
  },
  {
    id: 'oceam',
    name: 'Ocean',
    hashRate: 8.8,
    hashRatePercent: 1.2,
    blocksLast24h: 2,
    colorClass: 'bg-blue-400',
    odds: 8.0,
    region: 'Europe',
    logoUrl: '/pool-logos/Ocean.svg',
    gradient: 'linear-gradient(135deg, #72BBFF, #5A99D3)'
  },
  {
    id: 'secpool',
    name: 'SecPool',
    hashRate: 7.5,
    hashRatePercent: 1.0,
    blocksLast24h: 2,
    colorClass: 'bg-purple-700',
    odds: 8.5,
    region: 'Asia',
    logoUrl: '/pool-logos/secpool.svg',
    gradient: 'linear-gradient(135deg, #9333EA, #7C21D2)'
  },
  {
    id: 'carbonnegative',
    name: 'Carbon Negative',
    hashRate: 6.3,
    hashRatePercent: 0.8,
    blocksLast24h: 2,
    colorClass: 'bg-green-700',
    odds: 9.0,
    region: 'Europe',
    logoUrl: '/pool-logos/carbonnegative.svg',
    gradient: 'linear-gradient(135deg, #15803D, #166534)'
  },
  {
    id: 'bitfufu',
    name: 'BitFuFu Pool',
    hashRate: 5.0,
    hashRatePercent: 0.6,
    blocksLast24h: 1,
    colorClass: 'bg-pink-600',
    odds: 9.5,
    region: 'Asia',
    logoUrl: '/pool-logos/BitFuFuPool.svg',
    gradient: 'linear-gradient(135deg, #DB2777, #BE185D)'
  },
  {
    id: 'unknown',
    name: 'Unknown',
    hashRate: 7.5,
    hashRatePercent: 1.2,
    blocksLast24h: 2,
    colorClass: 'bg-gray-500',
    odds: 10.0,
    region: 'Global',
    logoUrl: '/pool-logos/unknown.svg',
    gradient: 'linear-gradient(135deg, #6B7280, #4B5563)'
  }
];

/**
 * Gets a random mining pool (for simulation purposes)
 */
export const getRandomMiningPool = (): MiningPool => {
  const randomIndex = Math.floor(Math.random() * miningPools.length);
  return miningPools[randomIndex];
};

/**
 * Updates mining pool data with real-time block counts and payout multipliers
 * @param payouts The calculated payout data from the mempool.space API
 */
export const updateMiningPoolData = (payouts: PoolPayout[]): void => {
  if (!payouts || payouts.length === 0) {
    console.warn('No payout data available to update mining pools');
    return;
  }
  
  console.log('Updating mining pool data with real-time payouts:', {
    poolCount: payouts.length,
    timestamp: new Date().toISOString()
  });
  
  // Update each mining pool with calculated payout multipliers
  miningPools.forEach(pool => {
    // Skip Empty Block (which has a static payout)
    if (pool.id === 'empty') return;
    
    // Find matching payout data
    const payout = payouts.find(p => 
      p.poolId.toLowerCase() === pool.id.toLowerCase() || 
      p.poolName.toLowerCase().includes(pool.id.toLowerCase()) ||
      pool.name.toLowerCase().includes(p.poolName.toLowerCase())
    );
    
    if (payout) {
      // Update the pool with real-time data
      pool.blocksLast24h = payout.blocksCount;
      pool.odds = payout.payoutMultiplier;
      
      console.log(`Updated pool ${pool.name}:`, {
        blocks: pool.blocksLast24h,
        multiplier: pool.odds.toFixed(1) + 'x'
      });
    } else {
      console.log(`No payout data found for pool ${pool.name}`);
    }
  });
};

/**
 * Gets the mining pool by ID
 * @param id The pool ID
 * @returns The mining pool or undefined if not found
 */
export const getMiningPoolById = (id: string): MiningPool | undefined => {
  return miningPools.find(pool => pool.id === id);
};
