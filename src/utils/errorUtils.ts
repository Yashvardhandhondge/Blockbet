
/**
 * Utility function to fetch data with retry logic
 * @param fetchFn Function that returns a promise
 * @param maxRetries Maximum number of retry attempts
 * @param retryDelay Delay between retries in milliseconds
 * @returns Promise with the fetch result
 */
export async function fetchWithRetry<T>(
  fetchFn: () => Promise<T>,
  maxRetries: number = 3,
  retryDelay: number = 1000
): Promise<T> {
  let retries = 0;
  
  while (true) {
    try {
      return await fetchFn();
    } catch (error) {
      retries++;
      
      if (retries >= maxRetries) {
        console.error(`Failed after ${maxRetries} retries:`, error);
        throw error;
      }
      
      console.warn(`Retry attempt ${retries}/${maxRetries} after error:`, error);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay * retries));
    }
  }
}

/**
 * Format helper for pretty printing errors
 * @param error Error object
 * @returns Formatted error message
 */
export const formatError = (error: any): string => {
  if (error?.message) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unknown error occurred';
};
