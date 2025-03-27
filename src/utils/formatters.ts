
/**
 * Formats a BTC amount with appropriate precision
 * @param amount BTC amount to format
 * @returns Formatted BTC string
 */
export const formatBTC = (amount: number): string => {
  if (amount < 0.001) {
    return `${amount.toFixed(8)} BTC`;
  } else if (amount < 0.1) {
    return `${amount.toFixed(5)} BTC`;
  } else {
    return `${amount.toFixed(3)} BTC`;
  }
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
