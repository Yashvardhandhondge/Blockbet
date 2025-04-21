-- This is the SQL migration script to create the bet_history table
-- Create this file at: supabase/migrations/20250421123456_create_bet_history_table.sql

-- Create the bet_history table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.bet_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pool_id TEXT NOT NULL,
  pool_name TEXT NOT NULL,
  amount BIGINT NOT NULL,
  is_win BOOLEAN NOT NULL DEFAULT false,
  block_height BIGINT NOT NULL,
  win_amount BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bet_history_user_id ON public.bet_history(user_id);
CREATE INDEX IF NOT EXISTS idx_bet_history_created_at ON public.bet_history(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.bet_history ENABLE ROW LEVEL SECURITY;

-- Create a policy to restrict users to only see their own data
CREATE POLICY "Users can view their own bet history"
  ON public.bet_history
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create a policy to allow users to insert their own data
CREATE POLICY "Users can insert their own bet history"
  ON public.bet_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Grant necessary permissions
GRANT SELECT, INSERT ON public.bet_history TO authenticated;