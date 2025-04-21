
export type Profile = {
  id: string;
  username: string;
  wallet_balance: number;
  created_at: string;
  lnbits_user_id?: string;
  lnbits_wallet_id?: string;
  lnbits_admin_key?: string;
  lnbits_invoice_key?: string;
  lnbits_auth_key?: string;
};

export type LeaderboardEntry = {
  id: string;
  username: string;
  rank: number;
  wins: number;
  bets: number;
  winRate: string;
  totalWinnings: number;
  avatar?: string;
};

export type LightningDeposit = {
  id: string;
  user_id: string;
  payment_hash: string;
  payment_request: string;
  amount_sats: number;
  status: 'pending' | 'completed' | 'expired';
  created_at: string;
};

export type LightningWithdrawal = {
  id: string;
  user_id: string;
  payment_hash?: string;
  payment_request: string;
  amount_sats: number;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
};

export type BetHistoryEntry = {
  id: string;
  user_id: string;
  pool_id: string;
  pool_name: string;
  amount: number;
  created_at: string;
  is_win: boolean;
  block_height: number;
  win_amount?: number; 
};