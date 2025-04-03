
// Format satoshis to BTC
export const formatSatsToBTC = (sats: number): string => {
  return (sats / 100000000).toFixed(8);
};

// Format BTC value to string with 8 decimal places
export const formatBTC = (btc: number): string => {
  return btc.toFixed(8);
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

// Format time ago function for showing relative time
export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
};
