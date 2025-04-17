import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/supabase';

// LNBits API configuration
const LNBITS_API_URL = process.env.NEXT_PUBLIC_LNBITS_API_URL || 'https://c687a80746.d.voltageapp.io';
const LNBITS_ADMIN_KEY = process.env.NEXT_PUBLIC_LNBITS_ADMIN_KEY || '';

// Define types for LNBits API responses
export type LNBitsUser = {
  id: string;
  email?: string;
  username?: string;
  admin: boolean;
  superuser: boolean;
};

export type LNBitsWallet = {
  id: string;
  admin: string; // Admin key
  inkey: string; // Invoice/read key
  name: string;
  user: string; // User ID
  balance: number;
};

export type LNBitsInvoice = {
  payment_hash: string;
  payment_request: string;
  checking_id: string;
  lnurl_response?: string;
  success?: boolean;
  paid?: boolean;
};

export type LNBitsPayment = {
  payment_hash: string;
  checking_id: string;
  fee?: number;
  preimage?: string;
  bolt11?: string;
  success?: boolean;
  pending?: boolean;
};

// Service for handling LNBits operations
export class LNBitsService {
  // Create a new LNBits user
  async createUser(username: string): Promise<LNBitsUser | null> {
    try {
      const response = await fetch(`${LNBITS_API_URL}/api/v1/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': LNBITS_ADMIN_KEY,
        },
        body: JSON.stringify({
          admin_id: LNBITS_ADMIN_KEY, // Add admin_id
          user_name: username, // Change username to user_name
          wallet_name: 'default', // Add wallet_name
          admin: false,
          email: "",
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('LNBits error:', error);
        throw new Error(`Failed to create LNBits user: ${response.status} - ${error}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating LNBits user:', error);
      return null;
    }
  }

  // Create a new wallet for a user
  async createWallet(userId: string, walletName: string): Promise<LNBitsWallet | null> {
    try {
      const response = await fetch(`${LNBITS_API_URL}/api/v1/usermanager/wallets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': LNBITS_ADMIN_KEY,
        },
        body: JSON.stringify({
          user_id: userId,
          name: walletName,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create wallet: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating wallet:', error);
      return null;
    }
  }

  // Create an invoice for a user's wallet
  async createInvoice(walletInvoiceKey: string, amountSats: number, memo: string): Promise<LNBitsInvoice | null> {
    try {
      const response = await fetch(`${LNBITS_API_URL}/api/v1/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': walletInvoiceKey,
        },
        body: JSON.stringify({
          out: false,
          amount: amountSats,
          memo: memo,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create invoice: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating invoice:', error);
      return null;
    }
  }

  // Check if an invoice has been paid
  async checkInvoice(walletInvoiceKey: string, paymentHash: string): Promise<boolean> {
    try {
      const response = await fetch(`${LNBITS_API_URL}/api/v1/payments/${paymentHash}`, {
        headers: {
          'X-Api-Key': walletInvoiceKey,
        },
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data?.paid || false;
    } catch (error) {
      console.error('Error checking invoice:', error);
      return false;
    }
  }

  // Pay an invoice from a user's wallet
  async payInvoice(walletAdminKey: string, bolt11: string): Promise<LNBitsPayment | null> {
    try {
      const response = await fetch(`${LNBITS_API_URL}/api/v1/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': walletAdminKey,
        },
        body: JSON.stringify({
          out: true,
          bolt11: bolt11,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to pay invoice: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error paying invoice:', error);
      return null;
    }
  }

  // Get wallet details including balance
  async getWallet(walletInvoiceKey: string): Promise<{ balance: number } | null> {
    try {
      const response = await fetch(`${LNBITS_API_URL}/api/v1/wallet`, {
        headers: {
          'X-Api-Key': walletInvoiceKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get wallet: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting wallet:', error);
      return null;
    }
  }

  // Generate LNURL-auth login URL
  async generateLnurlAuthUrl(callbackUrl: string, k1: string): Promise<string> {
    // Construct the LNURL-auth URL for LNBits
    return `${LNBITS_API_URL}/api/v1/lnurlauth?tag=login&action=login&k1=${k1}&callback=${encodeURIComponent(callbackUrl)}`;
  }

  // Verify LNURL-auth signature
  async verifyLnurlAuth(k1: string, sig: string, key: string): Promise<boolean> {
    try {
      const response = await fetch(`${LNBITS_API_URL}/api/v1/lnurlauth/verify?k1=${k1}&sig=${sig}&key=${key}`, {
        method: 'GET',
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data?.verified || false;
    } catch (error) {
      console.error('Error verifying LNURL-auth:', error);
      return false;
    }
  }
}

// Functions for managing user wallets in our app
export const walletManager = {
  // Create or get a LNBits user and wallet for a Supabase user
  async setupUserWallet(supabaseUserId: string, username: string): Promise<boolean> {
    try {
      // Check if user already has a wallet
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('lnbits_user_id, lnbits_wallet_id')
        .eq('id', supabaseUserId)
        .single();
        
      // Early return if there's an error or the user already has wallet IDs
      if (error) {
        console.error('Error fetching profile:', error);
        return false;
      }
      
      if (profile?.lnbits_user_id && profile?.lnbits_wallet_id) {
        // User already has a wallet
        return true;
      }

      // Create new LNBits user
      const lnbitsService = new LNBitsService();
      const lnbitsUser = await lnbitsService.createUser(username);
      if (!lnbitsUser) return false;

      // Create new wallet for the user
      const wallet = await lnbitsService.createWallet(
        lnbitsUser.id,
        `${username}'s Wallet`
      );
      if (!wallet) return false;

      // Store wallet info in Supabase
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          lnbits_user_id: lnbitsUser.id,
          lnbits_wallet_id: wallet.id,
          lnbits_admin_key: wallet.admin,
          lnbits_invoice_key: wallet.inkey,
          // We'll store the auth key later if LNURL-auth is used
        })
        .eq('id', supabaseUserId);

      if (updateError) {
        console.error('Error updating profile with wallet info:', updateError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error setting up user wallet:', error);
      return false;
    }
  },

  // Generate a deposit invoice for a user
  async createDepositInvoice(
    userId: string,
    amountSats: number,
    memo: string = 'BlockBet Deposit'
  ): Promise<{ paymentHash: string; paymentRequest: string } | null> {
    try {
      // Get user's wallet invoice key
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('lnbits_invoice_key')
        .eq('id', userId)
        .single();

      if (error || !profile?.lnbits_invoice_key) {
        console.error('Error getting profile or invoice key:', error);
        return null;
      }

      // Create invoice
      const lnbitsService = new LNBitsService();
      const invoice = await lnbitsService.createInvoice(
        profile.lnbits_invoice_key,
        amountSats,
        memo
      );
      if (!invoice) return null;

      try {
        // Store invoice in the database
        await supabase
          .from('lightning_deposits')
          .insert({
            user_id: userId,
            payment_hash: invoice.payment_hash,
            payment_request: invoice.payment_request,
            amount_sats: amountSats,
            status: 'pending',
          });
      } catch (error) {
        console.error('Error storing deposit:', error);
        // Continue even if storing fails - we can check the payment status directly
      }

      return {
        paymentHash: invoice.payment_hash,
        paymentRequest: invoice.payment_request,
      };
    } catch (error) {
      console.error('Error creating deposit invoice:', error);
      return null;
    }
  },

  // Process a withdrawal
  async processWithdrawal(
    userId: string,
    bolt11: string,
    amountSats: number
  ): Promise<boolean> {
    try {
      // Get user's wallet admin key
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('lnbits_admin_key, wallet_balance')
        .eq('id', userId)
        .single();

      if (error || !profile?.lnbits_admin_key) {
        console.error('Error getting profile or admin key:', error);
        return false;
      }

      // Check if user has enough balance
      if ((profile.wallet_balance || 0) < amountSats / 100000000) {
        return false;
      }

      // Pay invoice
      const lnbitsService = new LNBitsService();
      const payment = await lnbitsService.payInvoice(
        profile.lnbits_admin_key,
        bolt11
      );
      if (!payment || !payment.success) return false;

      try {
        // Store withdrawal record
        await supabase
          .from('lightning_withdrawals')
          .insert({
            user_id: userId,
            payment_hash: payment.payment_hash,
            payment_request: bolt11,
            amount_sats: amountSats,
            status: 'completed',
          });
      } catch (error) {
        console.error('Error storing withdrawal:', error);
        // Continue even if storing fails
      }

      // Update user's wallet balance
      await supabase
        .from('profiles')
        .update({
          wallet_balance: (profile.wallet_balance || 0) - amountSats / 100000000,
        })
        .eq('id', userId);

      return true;
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      return false;
    }
  },

  // Get a user's wallet balance in satoshis
  async getWalletBalanceSats(userId: string): Promise<number | null> {
    try {
      // Get user's wallet invoice key
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('lnbits_invoice_key')
        .eq('id', userId)
        .single();

      if (error || !profile?.lnbits_invoice_key) {
        console.error('Error getting profile or invoice key:', error);
        return null;
      }

      // Get wallet details from LNBits
      const lnbitsService = new LNBitsService();
      const wallet = await lnbitsService.getWallet(profile.lnbits_invoice_key);
      if (!wallet) return null;

      return wallet.balance;
    } catch (error) {
      console.error('Error getting wallet balance:', error);
      return null;
    }
  },
};
