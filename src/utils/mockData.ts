
import { MiningPool } from './types';

export const miningPools: MiningPool[] = [
  {
    id: 'foundry',
    name: 'Foundry USA',
    hashRate: 118.4,
    hashRatePercent: 35.8,
    blocksLast24h: 51,
    colorClass: 'bg-foundry',
    odds: 2.8,
    region: 'North America',
    logoUrl: '/pool-logos/foundryusa.png',
    gradient: 'linear-gradient(135deg, #6056C7, #4538B8)'
  },
  {
    id: 'antpool',
    name: 'Antpool',
    hashRate: 50.2,
    hashRatePercent: 15.2,
    blocksLast24h: 20,
    colorClass: 'bg-antpool',
    odds: 6.5,
    region: 'Asia',
    logoUrl: '/Antpool Bitcoin Explorer.svg',
    gradient: 'linear-gradient(135deg, #10AC7C, #0E8D65)'
  },
  {
    id: 'f2pool',
    name: 'F2Pool',
    hashRate: 37.5,
    hashRatePercent: 11.4,
    blocksLast24h: 18,
    colorClass: 'bg-f2pool',
    odds: 8.9,
    region: 'Asia',
    logoUrl: '/Bitcoin Explorer f2pool.svg',
    gradient: 'linear-gradient(135deg, #4062FF, #3555D9)'
  },
  {
    id: 'binance',
    name: 'Binance Pool',
    hashRate: 29.6,
    hashRatePercent: 9.0,
    blocksLast24h: 14,
    colorClass: 'bg-binance',
    odds: 10.5,
    region: 'Global',
    logoUrl: '/Binance Pool.svg',
    gradient: 'linear-gradient(135deg, #F0B90B, #DBA60A)'
  },
  {
    id: 'viabtc',
    name: 'ViaBTC',
    hashRate: 27.5,
    hashRatePercent: 8.3,
    blocksLast24h: 12,
    colorClass: 'bg-viabtc',
    odds: 11.0,
    region: 'Asia',
    logoUrl: '/Viabtc Bitcoin Explorer.svg',
    gradient: 'linear-gradient(135deg, #52CBCA, #429D9C)'
  },
  {
    id: 'slushpool',
    name: 'Slush Pool',
    hashRate: 11.6,
    hashRatePercent: 3.5,
    blocksLast24h: 5,
    colorClass: 'bg-slushpool',
    odds: 30.0,
    region: 'Europe',
    logoUrl: '/Mempool Bitcoin Explorer.svg',
    gradient: 'linear-gradient(135deg, #FF8200, #E16A00)'
  },
  {
    id: 'poolin',
    name: 'Poolin',
    hashRate: 10.5,
    hashRatePercent: 3.2,
    blocksLast24h: 5,
    colorClass: 'bg-poolin',
    odds: 32.0,
    region: 'Asia',
    logoUrl: '/pool-logos/poolin.svg',
    gradient: 'linear-gradient(135deg, #FF5A5A, #E13F3F)'
  },
  {
    id: 'btc-com',
    name: 'BTC.com',
    hashRate: 8.9,
    hashRatePercent: 2.7,
    blocksLast24h: 3,
    colorClass: 'bg-btccom',
    odds: 38.0,
    region: 'Asia',
    logoUrl: '/Bitcoin Explorer.svg',
    gradient: 'linear-gradient(135deg, #1F4079, #15325D)'
  },
  {
    id: 'unknown',
    name: 'Unknown',
    hashRate: 36.2,
    hashRatePercent: 11.0,
    blocksLast24h: 16,
    colorClass: 'bg-unknown',
    odds: 8.0,
    region: 'Global',
    logoUrl: '/Mempool Bitcoin Explorer (2).svg',
    gradient: 'linear-gradient(135deg, #444444, #222222)'
  }
];

export const nextBlockEstimate = {
  estimatedTimeMinutes: 10,
  difficulty: '66.5 T',
  estimatedHashRate: '483.5 EH/s'
};

export const recentBlocks = [
  {
    height: 843310,
    minedBy: 'foundry',
    txCount: 3245,
    size: 2.7,
    timestamp: Date.now() - 1000 * 60 * 8
  },
  {
    height: 843309,
    minedBy: 'viabtc',
    txCount: 2980,
    size: 2.5,
    timestamp: Date.now() - 1000 * 60 * 18
  },
  {
    height: 843308,
    minedBy: 'unknown',
    txCount: 3120,
    size: 2.6,
    timestamp: Date.now() - 1000 * 60 * 26
  },
  {
    height: 843307,
    minedBy: 'antpool',
    txCount: 2840,
    size: 2.3,
    timestamp: Date.now() - 1000 * 60 * 34
  },
  {
    height: 843306,
    minedBy: 'binance',
    txCount: 3050,
    size: 2.8,
    timestamp: Date.now() - 1000 * 60 * 42
  }
];
