
import React, { createContext, useState, useContext, useEffect } from "react";
import { User, Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { lnbitsService, walletManager } from "@/services/lnbitsService";
import { generateK1, createCallbackUrl } from "@/utils/lnurlAuth";
import { AuthContextType, AuthChallenges } from "./authTypes";
import { signInWithEmailPassword, signUpWithEmailPassword, signOut as authSignOut } from "./emailPasswordAuth";
import { handleLnurlAuth } from "./lightningAuth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Store active LNURL auth challenges
  const [authChallenges, setAuthChallenges] = useState<AuthChallenges>({});

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
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
    setIsLoading(true);
    try {
      await signInWithEmailPassword(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await signUpWithEmailPassword(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  const signOutUser = async () => {
    setIsLoading(true);
    try {
      await authSignOut();
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
    return await lnbitsService.generateLnurlAuthUrl(callbackUrl, k1);
  };
  
  // Handle LNURL auth callback
  const lnurlAuth = async (k1: string, sig: string, key: string): Promise<boolean> => {
    try {
      // Clear this challenge from the state regardless of outcome
      setAuthChallenges(prev => {
        const newChallenges = { ...prev };
        delete newChallenges[k1];
        return newChallenges;
      });
      
      return await handleLnurlAuth(k1, sig, key, authChallenges);
    } catch (error) {
      console.error("LNURL auth failed:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isLoading, 
      signIn, 
      signUp, 
      signOut: signOutUser,
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
