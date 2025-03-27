
/**
 * Formats a BTC amount with appropriate precision
 * @param amount BTC amount to format
 * @returns Formatted BTC string
 */
export const formatBTC = (amount: number | undefined | null): string => {
  if (amount === undefined || amount === null) {
    return "0.00000000 BTC";
  }
  
  if (amount < 0.001) {
    return `${amount.toFixed(8)} BTC`;
  } else if (amount < 0.1) {
    return `${amount.toFixed(5)} BTC`;
  } else {
    return `${amount.toFixed(3)} BTC`;
  }
};

/**
 * Formats a satoshi amount to BTC with 8 decimal places
 * @param satoshis Satoshi amount to format
 * @returns Formatted BTC string
 */
export const formatSatsToBTC = (satoshis: number | undefined | null): string => {
  if (satoshis === undefined || satoshis === null) {
    return "0.00000000 BTC";
  }
  
  const btcValue = satoshis / 100000000;
  return `${btcValue.toFixed(8)} BTC`;
};

/**
 * Formats a satoshi amount to a readable string
 * @param satoshis Satoshi amount to format
 * @returns Formatted sats string
 */
export const formatSats = (satoshis: number | undefined | null): string => {
  if (satoshis === undefined || satoshis === null) {
    return "0 sats";
  }
  
  return `${satoshis.toLocaleString()} sats`;
};

/**
 * Formats a timestamp as a time ago string
 * @param timestamp Timestamp in milliseconds
 * @returns Formatted time ago string
 */
export const formatTimeAgo = (timestamp: number): string => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) return `${seconds} seconds ago`;
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? 's' : ''} ago`;
};
