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
  const winEvent = new CustomEvent('playerWin', { 
    detail: { 
      timestamp: Date.now(),
      source: 'betting-grid'
    } 
  });
  
  console.log('Emitting playerWin event:', {
    timestamp: new Date().toISOString(),
    eventDetail: winEvent.detail
  });
  
  window.dispatchEvent(winEvent);
};
