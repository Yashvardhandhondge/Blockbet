
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Email/password sign in
export const signInWithEmailPassword = async (email: string, password: string): Promise<void> => {
  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      throw error;
    }
  } catch (error: any) {
    toast.error(error.message || "Failed to sign in");
    throw error;
  }
};

// Email/password sign up
export const signUpWithEmailPassword = async (email: string, password: string): Promise<void> => {
  try {
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
  }
};

// Sign out
export const signOut = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }
  } catch (error: any) {
    toast.error(error.message || "Failed to sign out");
  }
};
