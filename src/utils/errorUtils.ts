
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
  retries: number = 3,
  delay: number = 1000
): Promise<T> => {
  try {
    return await fetchFn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    
    // Wait for the specified delay
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Retry the fetch with one less retry attempt
    return fetchWithRetry(fetchFn, retries - 1, delay);
  }
};
