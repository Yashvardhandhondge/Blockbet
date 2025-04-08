
import { MiningPool } from './types';

export const formatSatsToBTC = (sats: number): string => {
  return (sats / 100000000).toFixed(8);
};

export const formatSats = (sats: number): string => {
  if (sats >= 1000000) {
    return `${(sats / 100000000).toFixed(4)} BTC`;
  } else if (sats >= 100000) {
    return `${(sats / 100000).toFixed(5)} BTC`;
  }
  return `${sats} sats`;
};

// Function to emit a player win event
export const emitPlayerWin = () => {
  console.log('Emitting player win event');
  const event = new CustomEvent('playerWin', { detail: { timestamp: Date.now() } });
  window.dispatchEvent(event);
};
