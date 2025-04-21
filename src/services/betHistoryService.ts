// src/services/betHistoryService.ts

import { supabase } from '@/integrations/supabase/client';

export interface BetHistoryRecord {
  id: number;
  poolId: string;
  poolName: string;
  amount: number;
  timestamp: Date;
  isWin: boolean;
  blockHeight: number;
  winAmount?: number;
}

export const betHistoryService = {
  // Save a new bet history entry
  async saveBetHistory(bet: Omit<BetHistoryRecord, 'id' | 'timestamp'>): Promise<string | null> {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        console.error('No authenticated user found');
        return null;
      }

      const { data, error } = await supabase
        .from('bet_history')
        .insert({
          user_id: session.session.user.id,
          pool_id: bet.poolId,
          pool_name: bet.poolName,
          amount: bet.amount,
          is_win: bet.isWin,
          block_height: bet.blockHeight,
          win_amount: bet.winAmount || null
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error saving bet history:', error);
        return null;
      }

      return data?.id || null;
    } catch (error) {
      console.error('Error in saveBetHistory:', error);
      return null;
    }
  },

  // Get bet history for current user
  async getUserBetHistory(): Promise<BetHistoryRecord[]> {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        console.log('No authenticated user found');
        return [];
      }

      const { data, error } = await supabase
        .from('bet_history')
        .select('*')
        .eq('user_id', session.session.user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching bet history:', error);
        return [];
      }

      // Convert to application format
      return (data || []).map(item => ({
        id: typeof item.id === 'string' ? parseInt(item.id.replace(/-/g, '').substring(0, 8), 16) : Math.floor(Math.random() * 100000),
        poolId: item.pool_id,
        poolName: item.pool_name,
        amount: item.amount,
        timestamp: new Date(item.created_at),
        isWin: item.is_win,
        blockHeight: item.block_height,
        winAmount: item.win_amount || undefined
      }));
    } catch (error) {
      console.error('Error in getUserBetHistory:', error);
      return [];
    }
  },

  // Clear bet history for testing purposes only
  async clearBetHistory(): Promise<boolean> {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        return false;
      }

      const { error } = await supabase
        .from('bet_history')
        .delete()
        .eq('user_id', session.session.user.id);

      if (error) {
        console.error('Error clearing bet history:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in clearBetHistory:', error);
      return false;
    }
  }
};