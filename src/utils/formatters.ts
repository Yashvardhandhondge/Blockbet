
import { MiningPool } from './types';

export const formatSatsToBTC = (sats: number): string => {
  return (sats / 100000000).toFixed(8);
};

export const formatSats = (sats: number): string => {
  // Always display in sats now, no conversion to BTC
  return `${sats.toLocaleString()} sats`;
};

// Function to emit a player win event
export const emitPlayerWin = () => {
  console.log('Emitting player win event');
  const event = new CustomEvent('playerWin', { detail: { timestamp: Date.now() } });
  window.dispatchEvent(event);
};
