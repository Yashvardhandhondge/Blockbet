
/**
 * Format satoshis to BTC with 8 decimal places
 * @param sats Amount in satoshis
 * @returns Formatted BTC string
 */
export const formatSatsToBTC = (sats: number): string => {
  return (sats / 100000000).toFixed(8);
};

/**
 * Format satoshis with thousands separators
 * @param sats Amount in satoshis
 * @returns Formatted satoshi string
 */
export const formatSats = (sats: number): string => {
  return `${sats.toLocaleString()} sats`;
};

/**
 * Emit a player win event
 */
export const emitPlayerWin = () => {
  const event = new CustomEvent('playerWin');
  window.dispatchEvent(event);
};
