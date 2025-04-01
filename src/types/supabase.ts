
export type Profile = {
  id: string;
  username: string;
  wallet_balance: number;
  created_at: string;
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
