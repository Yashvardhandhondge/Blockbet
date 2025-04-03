
// Format satoshis to BTC
export const formatSatsToBTC = (sats: number): string => {
  return (sats / 100000000).toFixed(8);
};

// Format satoshis with comma separators
export const formatSats = (satoshis: number): string => {
  return satoshis.toLocaleString() + " sats";
};

// Emit player win event
export const emitPlayerWin = (): void => {
  const winEvent = new CustomEvent('playerWin', {
    detail: { timestamp: new Date() }
  });
  window.dispatchEvent(winEvent);
};
