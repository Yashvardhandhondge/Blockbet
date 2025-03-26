
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { CheckCircle, XCircle, Trophy, DollarSign, Calendar, FileBarChart, Upload, Download } from 'lucide-react';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

interface BetHistoryProps {
  betHistory: Array<{
    id: number;
    poolId: string;
    poolName: string;
    amount: number;
    timestamp: Date;
    isWin: boolean;
    blockHeight: number;
  }>;
}

interface WalletActivityProps {
  deposits: Array<{
    id: number;
    amount: number;
    timestamp: Date;
    txId: string;
  }>;
  withdrawals: Array<{
    id: number;
    amount: number;
    timestamp: Date;
    txId: string;
    status: 'completed' | 'pending' | 'failed';
  }>;
}

const BetHistory: React.FC<BetHistoryProps & WalletActivityProps> = ({ 
  betHistory, 
  deposits = [], 
  withdrawals = [] 
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'wins' | 'losses' | 'deposits' | 'withdrawals'>('all');
  
  const filteredHistory = activeTab === 'all' 
    ? betHistory 
    : activeTab === 'wins' 
      ? betHistory.filter(bet => bet.isWin) 
      : activeTab === 'losses'
        ? betHistory.filter(bet => !bet.isWin)
        : betHistory;
  
  const totalBets = betHistory.length;
  const totalWins = betHistory.filter(bet => bet.isWin).length;
  const totalLosses = betHistory.filter(bet => !bet.isWin).length;
  const totalDeposits = deposits.length;
  const totalWithdrawals = withdrawals.length;
  const winRate = totalBets > 0 ? Math.round((totalWins / totalBets) * 100) : 0;
  
  const totalBetAmount = betHistory.reduce((sum, bet) => sum + bet.amount, 0);
  const totalWinAmount = betHistory
    .filter(bet => bet.isWin)
    .reduce((sum, bet) => sum + bet.amount * 2, 0); // Simplified calculation
  
  const profitLoss = totalWinAmount - totalBetAmount;
  
  const formatSats = (satoshis: number) => {
    return satoshis.toLocaleString() + " sats";
  };
  
  const getPoolLogo = (poolId: string) => {
    const logoPath = `/pool-logos/${poolId}.svg`;
    return (
      <div className="w-6 h-6 flex items-center justify-center bg-white rounded-full overflow-hidden p-0.5">
        <img 
          src={logoPath} 
          alt={`${poolId} logo`} 
          className="w-full h-full object-contain"
          onError={(e) => {
            e.currentTarget.src = '/pool-logos/default.svg';
          }} 
        />
      </div>
    );
  };
  
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="bg-[#121212]/50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <FileBarChart className="h-4 w-4 text-btc-orange/80" />
            <div className="text-xs text-white/60">Total Bets</div>
          </div>
          <div className="text-lg font-bold text-white">{totalBets}</div>
        </div>
        
        <div className="bg-[#121212]/50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="h-4 w-4 text-green-500/80" />
            <div className="text-xs text-white/60">Win Rate</div>
          </div>
          <div className="text-lg font-bold text-white">{winRate}%</div>
        </div>
        
        <div className="bg-[#121212]/50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-4 w-4 text-btc-orange/80" />
            <div className="text-xs text-white/60">Total Wagered</div>
          </div>
          <div className="text-lg font-bold text-white">{formatSats(totalBetAmount)}</div>
        </div>
        
        <div className="bg-[#121212]/50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-4 w-4 text-white/80" />
            <div className="text-xs text-white/60">Profit/Loss</div>
          </div>
          <div className={cn(
            "text-lg font-bold",
            profitLoss > 0 ? "text-green-500" : profitLoss < 0 ? "text-red-500" : "text-white"
          )}>
            {profitLoss > 0 ? "+" : ""}{formatSats(profitLoss)}
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid grid-cols-5 mb-4 bg-[#121212]/40">
          <TabsTrigger value="all" className="data-[state=active]:bg-btc-orange/20 data-[state=active]:text-btc-orange">
            All ({totalBets})
          </TabsTrigger>
          <TabsTrigger value="wins" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-500">
            Wins ({totalWins})
          </TabsTrigger>
          <TabsTrigger value="losses" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-500">
            Losses ({totalLosses})
          </TabsTrigger>
          <TabsTrigger value="deposits" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-500">
            Deposits ({totalDeposits})
          </TabsTrigger>
          <TabsTrigger value="withdrawals" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-500">
            Withdrawals ({totalWithdrawals})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <ScrollArea className="h-[300px]">
            <BetHistoryList betHistory={filteredHistory} />
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="wins" className="mt-0">
          <ScrollArea className="h-[300px]">
            <BetHistoryList betHistory={filteredHistory} />
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="losses" className="mt-0">
          <ScrollArea className="h-[300px]">
            <BetHistoryList betHistory={filteredHistory} />
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="deposits" className="mt-0">
          <ScrollArea className="h-[300px]">
            <DepositsList deposits={deposits} />
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="withdrawals" className="mt-0">
          <ScrollArea className="h-[300px]">
            <WithdrawalsList withdrawals={withdrawals} />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const BetHistoryList: React.FC<BetHistoryProps> = ({ betHistory }) => {
  const formatSats = (satoshis: number) => {
    return satoshis.toLocaleString() + " sats";
  };
  
  return (
    <div className="space-y-2 pr-1">
      {betHistory.length === 0 ? (
        <div className="text-center py-8 text-white/60">
          No bets matching this filter
        </div>
      ) : (
        betHistory.map((bet) => (
          <div 
            key={bet.id} 
            className={cn(
              "flex items-center justify-between p-3 rounded-lg",
              bet.isWin ? "bg-green-950/30 border border-green-800/30" : "bg-red-950/20 border border-red-900/20"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center",
                bet.isWin ? "bg-green-500/20" : "bg-red-500/20"
              )}>
                {bet.isWin ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <div className="font-medium text-white">{bet.poolName}</div>
                  {bet.isWin && <Trophy className="h-3.5 w-3.5 text-yellow-500" />}
                </div>
                <div className="text-xs text-white/60 flex items-center">
                  <Calendar className="h-3 w-3 mr-1 inline" />
                  {format(bet.timestamp, 'MMM d, yyyy HH:mm')}
                  <span className="mx-1">•</span>
                  Block #{bet.blockHeight}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className={cn(
                "font-mono font-medium",
                bet.isWin ? "text-green-500" : "text-red-500"
              )}>
                {bet.isWin ? "+" : "-"}{formatSats(bet.amount)}
              </div>
              {bet.isWin && (
                <div className="text-xs text-green-400/60">
                  x2.0 odds
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

interface DepositsListProps {
  deposits: Array<{
    id: number;
    amount: number;
    timestamp: Date;
    txId: string;
  }>;
}

const DepositsList: React.FC<DepositsListProps> = ({ deposits }) => {
  const formatSats = (satoshis: number) => {
    return satoshis.toLocaleString() + " sats";
  };
  
  return (
    <div className="space-y-2 pr-1">
      {deposits.length === 0 ? (
        <div className="text-center py-8 text-white/60">
          No deposits yet
        </div>
      ) : (
        deposits.map((deposit) => (
          <div 
            key={deposit.id} 
            className="flex items-center justify-between p-3 rounded-lg bg-blue-950/30 border border-blue-800/30"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full flex items-center justify-center bg-blue-500/20">
                <Download className="h-5 w-5 text-blue-500" />
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <div className="font-medium text-white">Deposit</div>
                </div>
                <div className="text-xs text-white/60 flex items-center">
                  <Calendar className="h-3 w-3 mr-1 inline" />
                  {format(deposit.timestamp, 'MMM d, yyyy HH:mm')}
                  <span className="mx-1">•</span>
                  <span className="text-blue-400/80 font-mono text-xs">{deposit.txId.slice(0, 8)}...{deposit.txId.slice(-8)}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-mono font-medium text-blue-500">
                +{formatSats(deposit.amount)}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

interface WithdrawalsListProps {
  withdrawals: Array<{
    id: number;
    amount: number;
    timestamp: Date;
    txId: string;
    status: 'completed' | 'pending' | 'failed';
  }>;
}

const WithdrawalsList: React.FC<WithdrawalsListProps> = ({ withdrawals }) => {
  const formatSats = (satoshis: number) => {
    return satoshis.toLocaleString() + " sats";
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-white';
    }
  };
  
  return (
    <div className="space-y-2 pr-1">
      {withdrawals.length === 0 ? (
        <div className="text-center py-8 text-white/60">
          No withdrawals yet
        </div>
      ) : (
        withdrawals.map((withdrawal) => (
          <div 
            key={withdrawal.id} 
            className="flex items-center justify-between p-3 rounded-lg bg-purple-950/30 border border-purple-800/30"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full flex items-center justify-center bg-purple-500/20">
                <Upload className="h-5 w-5 text-purple-500" />
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <div className="font-medium text-white">Withdrawal</div>
                  <span className={cn("text-xs font-medium px-1.5 py-0.5 rounded-full", 
                    withdrawal.status === 'completed' ? 'bg-green-900/40 text-green-400' : 
                    withdrawal.status === 'pending' ? 'bg-yellow-900/40 text-yellow-400' : 
                    'bg-red-900/40 text-red-400'
                  )}>
                    {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                  </span>
                </div>
                <div className="text-xs text-white/60 flex items-center">
                  <Calendar className="h-3 w-3 mr-1 inline" />
                  {format(withdrawal.timestamp, 'MMM d, yyyy HH:mm')}
                  <span className="mx-1">•</span>
                  <span className="text-purple-400/80 font-mono text-xs">{withdrawal.txId.slice(0, 8)}...{withdrawal.txId.slice(-8)}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-mono font-medium text-purple-500">
                -{formatSats(withdrawal.amount)}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default BetHistory;
