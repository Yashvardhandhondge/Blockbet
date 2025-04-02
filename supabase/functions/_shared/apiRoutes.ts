
// API routes for the LNBits integration
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.14.0';

// LNBits API configuration
const LNBITS_API_URL = 'https://c687a80746.d.voltageapp.io/api/v1';
const LNBITS_ADMIN_KEY = 'e11b4d2b815343e9b8d26a773be430ab';

// Create a Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Check if an invoice has been paid
async function checkInvoice(walletInvoiceKey: string, paymentHash: string): Promise<boolean> {
  try {
    const response = await fetch(`${LNBITS_API_URL}/payments/${paymentHash}`, {
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

// API endpoint to check payment status
export const checkPaymentStatus = async (req: Request): Promise<Response> => {
  try {
    // Get key and hash from query params
    const url = new URL(req.url);
    const key = url.searchParams.get('key');
    const hash = url.searchParams.get('hash');
    
    if (!key || !hash) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Check payment status in LNBits
    const paid = await checkInvoice(key, hash);
    
    // If paid, update the deposit status and user's wallet balance
    if (paid) {
      // Get the deposit record
      const { data: deposit } = await supabase
        .from('lightning_deposits')
        .select('user_id, amount_sats, status')
        .eq('payment_hash', hash)
        .single();
      
      if (deposit && deposit.status === 'pending') {
        // Get the user's current balance
        const { data: profile } = await supabase
          .from('profiles')
          .select('wallet_balance')
          .eq('id', deposit.user_id)
          .single();
        
        const currentBalance = profile?.wallet_balance || 0;
        const newBalance = currentBalance + (deposit.amount_sats / 100000000);
        
        // Update the deposit status
        await supabase
          .from('lightning_deposits')
          .update({ status: 'completed' })
          .eq('payment_hash', hash);
        
        // Update the user's wallet balance
        await supabase
          .from('profiles')
          .update({ wallet_balance: newBalance })
          .eq('id', deposit.user_id);
      }
    }
    
    return new Response(JSON.stringify({ paid }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error checking payment:', error);
    return new Response(JSON.stringify({ error: 'Failed to check payment' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// API endpoint to get user profile with wallet info
export const getUserProfile = async (req: Request): Promise<Response> => {
  try {
    // Get user ID from query params
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Missing user ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Get user profile from Supabase
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('lnbits_user_id, lnbits_wallet_id, lnbits_admin_key, lnbits_invoice_key, wallet_balance')
      .eq('id', userId)
      .single();
    
    if (error) {
      return new Response(JSON.stringify({ error: 'Failed to get profile' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify({ data: profile }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error getting profile:', error);
    return new Response(JSON.stringify({ error: 'Failed to get profile' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
