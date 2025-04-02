
import React, { createContext, useState, useContext, useEffect } from "react";
import { User, Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { lnbitsService, walletManager } from "@/services/lnbitsService";
import { generateK1, createCallbackUrl } from "@/utils/lnurlAuth";
import { Profile } from "@/types/supabase";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  generateLnurlAuth: () => Promise<string>;
  lnurlAuth: (k1: string, sig: string, key: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Store active LNURL auth challenges
  const [authChallenges, setAuthChallenges] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          toast.success("Successfully signed in!");
          
          // Set up user wallet if needed
          if (session?.user) {
            setTimeout(async () => {
              const username = session.user.email?.split('@')[0] || `user_${session.user.id.substring(0, 8)}`;
              await walletManager.setupUserWallet(session.user.id, username);
            }, 0);
          }
        } else if (event === 'SIGNED_OUT') {
          toast.info("Signed out");
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Registration successful! Please check your email to verify your account.");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign up");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out");
    } finally {
      setIsLoading(false);
    }
  };

  // Generate an LNURL auth challenge
  const generateLnurlAuth = async (): Promise<string> => {
    // Generate a random k1 challenge
    const k1 = generateK1();
    
    // Store the challenge in state
    setAuthChallenges(prev => ({ ...prev, [k1]: true }));
    
    // Create the callback URL for our app
    const callbackUrl = createCallbackUrl(k1);
    
    // Generate the LNURL auth URL
    const lnurlAuthUrl = await lnbitsService.generateLnurlAuthUrl(callbackUrl, k1);
    
    return lnurlAuthUrl;
  };
  
  // Handle LNURL auth callback
  const lnurlAuth = async (k1: string, sig: string, key: string): Promise<boolean> => {
    try {
      // Verify that this is a challenge we issued
      if (!authChallenges[k1]) {
        throw new Error('Invalid challenge');
      }
      
      // Clear this challenge from the state
      setAuthChallenges(prev => {
        const newChallenges = { ...prev };
        delete newChallenges[k1];
        return newChallenges;
      });
      
      // Verify the LNURL auth signature
      const isValid = await lnbitsService.verifyLnurlAuth(k1, sig, key);
      
      if (!isValid) {
        throw new Error('Failed to verify Lightning authentication');
      }
      
      // Find if there's a user with this lnbits_auth_key
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('lnbits_auth_key', key)
        .single();
      
      if (existingUser) {
        // User exists, sign in with their account
        const { error } = await supabase.auth.signInWithPassword({
          // Use a placeholder email based on the Lightning key
          email: `lightning_${key.substring(0, 12)}@blockbet.app`,
          password: `lightning_${key}` // This is just a placeholder for now
        });
        
        if (error) {
          // If the user exists in profiles but no auth record, create a new auth account
          await createLightningUser(key);
        }
      } else {
        // No existing user, create a new account
        await createLightningUser(key);
      }
      
      return true;
    } catch (error: any) {
      console.error('LNURL auth error:', error);
      toast.error(error.message || "Lightning authentication failed");
      return false;
    }
  };
  
  // Helper function to create a new Lightning user
  const createLightningUser = async (key: string): Promise<void> => {
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
        await supabase.from('profiles').update({
          lnbits_auth_key: key,
        }).eq('id', data.user.id);
        
        // Create a LNBits wallet for the user
        const username = `lightning_${data.user.id.substring(0, 8)}`;
        await walletManager.setupUserWallet(data.user.id, username);
      }
    } catch (error) {
      console.error('Error creating Lightning user:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isLoading, 
      signIn, 
      signUp, 
      signOut,
      generateLnurlAuth,
      lnurlAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
