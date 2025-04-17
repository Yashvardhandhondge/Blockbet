
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { LNBitsService, walletManager } from "@/services/lnbitsService";

// Helper function to create a new Lightning user
export const createLightningUser = async (key: string): Promise<boolean> => {
  try {
    // Create a unique email based on the Lightning key
    const email = `lightning_${key.substring(0, 12)}@blockbet.app`;
    const password = `lightning_${key}`; // This is just a placeholder
    
    // Create a new user in Supabase auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    
    if (error) throw error;
    
    // Store the Lightning key in the user's profile
    if (data.user) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          lnbits_auth_key: key,
        })
        .eq('id', data.user.id);

      if (updateError) {
        console.error('Error updating profile with Lightning key:', updateError);
        return false;
      }
      
      // Create a LNBits wallet for the user
      const username = `lightning_${data.user.id.substring(0, 8)}`;
      await walletManager.setupUserWallet(data.user.id, username);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error creating Lightning user:', error);
    return false;
  }
};

// Handle LNURL auth verification and login
export const handleLnurlAuth = async (
  k1: string, 
  sig: string, 
  key: string, 
  authChallenges: Record<string, boolean>
): Promise<boolean> => {
  try {
    // Verify that this is a challenge we issued
    if (!authChallenges[k1]) {
      throw new Error('Invalid challenge');
    }
    
    // Verify the LNURL auth signature
    const isValid = await LNBitsService.verifyLnurlAuth(k1, sig, key);
    
    if (!isValid) {
      throw new Error('Failed to verify Lightning authentication');
    }
    
    // Find if there's a user with this lnbits_auth_key
    const { data: existingUser, error: queryError } = await supabase
      .from('profiles')
      .select('id')
      .eq('lnbits_auth_key', key)
      .maybeSingle();
    
    if (existingUser) {
      // User exists, sign in with their account using custom credentials
      const { error } = await supabase.auth.signInWithPassword({
        // Use a placeholder email based on the Lightning key
        email: `lightning_${key.substring(0, 12)}@blockbet.app`,
        password: `lightning_${key}` // This is just a placeholder for now
      });
      
      if (error) {
        // If the user exists in profiles but no auth record, create a new auth account
        return await createLightningUser(key);
      }
    } else {
      // No existing user, create a new account
      return await createLightningUser(key);
    }
    
    return true;
  } catch (error: any) {
    console.error('LNURL auth error:', error);
    toast.error(error.message || "Lightning authentication failed");
    return false;
  }
};
