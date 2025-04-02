
import { User, Session } from '@supabase/supabase-js';

export type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  generateLnurlAuth: () => Promise<string>;
  lnurlAuth: (k1: string, sig: string, key: string) => Promise<boolean>;
};

export type AuthChallenges = Record<string, boolean>;
