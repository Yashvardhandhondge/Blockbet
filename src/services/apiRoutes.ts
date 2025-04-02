
// API routes for the LNBits integration

import { supabase } from '@/integrations/supabase/client';
import { lnbitsService } from './lnbitsService';

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
    const paid = await lnbitsService.checkInvoice(key, hash);
    
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
