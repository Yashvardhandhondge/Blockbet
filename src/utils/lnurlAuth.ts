
// Utility functions for LNURL-auth

// Generate a random string for k1 challenge
export const generateK1 = (): string => {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Create a callback URL for LNURL-auth
export const createCallbackUrl = (k1: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/auth/lnurl-callback?k1=${k1}`;
};

// Generate a QR code value for LNURL-auth
export const generateLnurlAuthQrValue = (lnurlAuthUrl: string): string => {
  return lnurlAuthUrl;
};

// Extract parameters from URL
export const extractUrlParams = (): Record<string, string> => {
  const params: Record<string, string> = {};
  const query = window.location.search.substring(1);
  const vars = query.split('&');
  
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=');
    params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
  }
  
  return params;
};
