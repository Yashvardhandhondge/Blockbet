
/**
 * Helper function to handle API request errors
 * @param error Error object
 * @returns Formatted error message
 */
export const handleApiError = (error: any): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
};

/**
 * Attempts to fetch data with retry logic
 * @param fetchFn Async function to fetch data
 * @param retries Number of retry attempts
 * @param delay Delay between retries in ms
 * @returns Promise with the fetched data
 */
export const fetchWithRetry = async <T>(
  fetchFn: () => Promise<T>,
  retries: number = 2,
  delay: number = 500
): Promise<T> => {
  try {
    return await fetchFn();
  } catch (error) {
    if (retries <= 0) {
      console.error(`All retry attempts failed:`, error);
      throw error;
    }
    
    console.log(`Retry attempt ${retries} after ${delay}ms`);
    // Wait for the specified delay
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Retry the fetch with one less retry attempt, slightly increased delay
    return fetchWithRetry(fetchFn, retries - 1, delay * 1.5); // Exponential backoff
  }
};

/**
 * Formats a timestamp to a relative time string (e.g., "2 minutes ago")
 * @param timestamp Timestamp in milliseconds
 * @returns Formatted relative time string
 */
export const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffSecs = Math.floor(diffMs / 1000);
  
  if (diffSecs < 60) return 'just now';
  
  const diffMins = Math.floor(diffSecs / 60);
  if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
};

/**
 * Compare two arrays of blocks to check if there is a new block
 * @param currentBlocks Current array of blocks
 * @param newBlocks New array of blocks
 * @returns Boolean indicating if there is a new block
 */
export const hasNewBlock = (currentBlocks: any[], newBlocks: any[]): boolean => {
  if (currentBlocks.length === 0 || newBlocks.length === 0) return false;
  return newBlocks[0]?.height > currentBlocks[0]?.height;
};
