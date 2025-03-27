
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { Trophy, Download, Upload, History } from 'lucide-react';
import { format } from 'date-fns';

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

// Combined transactions list for mobile view
const CombinedTransactionsList = ({ deposits, withdrawals }: { 
  deposits: BetHistoryProps['deposits'], 
  withdrawals: BetHistoryProps['withdrawals'] 
}) => {
  // Combine deposits and withdrawals into one list and sort by timestamp (newest first)
  const combinedTransactions = [
    ...deposits.map(d => ({ ...d, type: 'deposit' as const })),
    ...withdrawals.map(w => ({ ...w, type: 'withdrawal' as const }))
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <div className="space-y-2">
      {combinedTransactions.map(transaction => (
        <div 
          key={`${transaction.type}-${transaction.id}`} 
          className="flex items-center justify-between bg-[#0f0f0f] rounded-lg p-2 text-xs"
        >
          <div className="flex items-center">
            {transaction.type === 'deposit' ? (
              <Download className="h-3 w-3 text-green-400 mr-2" />
            ) : (
              <Upload className="h-3 w-3 text-btc-orange mr-2" />
            )}
            <div>
              <div className="text-white font-medium">
                {transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'} 
                {transaction.type === 'withdrawal' && transaction.status !== 'completed' && (
                  <span className={`ml-1 px-1 py-0.5 rounded text-[10px] ${
                    transaction.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {transaction.status.toUpperCase()}
                  </span>
                )}
              </div>
              <div className="text-white/60 text-[10px]">
                {format(transaction.timestamp, 'MMM d, h:mm a')}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className={transaction.type === 'deposit' ? 'text-green-400' : 'text-btc-orange'}>
              {transaction.type === 'deposit' ? '+' : '-'}{(transaction.amount / 100000000).toFixed(8)} BTC
            </div>
            <div className="text-white/40 text-[10px] truncate max-w-28">
              {transaction.txId.substring(0, 8)}...{transaction.txId.substring(transaction.txId.length - 8)}
            </div>
          </div>
        </div>
      ))}
      
      {combinedTransactions.length === 0 && (
        <div className="text-center text-white/40 py-4">
          No transaction history
        </div>
      )}
    </div>
  );
};

const BetHistory: React.FC<BetHistoryProps> = ({ betHistory, deposits, withdrawals }) => {
  const [activeTab, setActiveTab] = useState("bets");
  const isMobile = useIsMobile();
  
  const formatAmount = (amount: number) => {
    return amount.toLocaleString() + " sats";
  };
  
  const formatBTC = (amount: number) => {
    return (amount / 100000000).toFixed(8) + " BTC";
  };
  
  // Generating the content for each tab
  const betsContent = (
    <ScrollArea className="h-60">
      <div className="space-y-2">
        {betHistory.map(bet => (
          <div 
            key={`bet-${bet.id}`} 
            className="flex items-center justify-between bg-[#0f0f0f] rounded-lg p-2 text-xs"
          >
            <div className="flex items-center">
              <div className={`p-1 rounded ${bet.isWin ? 'bg-green-500/20' : 'bg-red-500/20'} mr-2`}>
                <Trophy className={`h-3 w-3 ${bet.isWin ? 'text-green-400' : 'text-red-400'}`} />
              </div>
              <div>
                <div className="text-white font-medium">
                  {bet.poolName}
                </div>
                <div className="text-white/60 text-[10px]">
                  {format(bet.timestamp, 'MMM d, h:mm a')} · Block #{bet.blockHeight}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className={bet.isWin ? 'text-green-400' : 'text-white/80'}>
                {bet.isWin ? 'WIN' : 'LOSS'}
              </div>
              <div className="text-btc-orange font-mono">
                {formatAmount(bet.amount)}
              </div>
            </div>
          </div>
        ))}
        
        {betHistory.length === 0 && (
          <div className="text-center text-white/40 py-4">
            No betting history
          </div>
        )}
      </div>
    </ScrollArea>
  );
  
  const depositsContent = (
    <ScrollArea className="h-60">
      <div className="space-y-2">
        {deposits.map(deposit => (
          <div 
            key={`deposit-${deposit.id}`} 
            className="flex items-center justify-between bg-[#0f0f0f] rounded-lg p-2 text-xs"
          >
            <div className="flex items-center">
              <div className="p-1 rounded bg-green-500/10 mr-2">
                <Download className="h-3 w-3 text-green-400" />
              </div>
              <div>
                <div className="text-white font-medium">
                  Deposit
                </div>
                <div className="text-white/60 text-[10px]">
                  {format(deposit.timestamp, 'MMM d, h:mm a')}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-green-400">
                +{formatBTC(deposit.amount)}
              </div>
              <div className="text-white/40 text-[10px] truncate max-w-24">
                {deposit.txId.substring(0, 6)}...{deposit.txId.substring(deposit.txId.length - 6)}
              </div>
            </div>
          </div>
        ))}
        
        {deposits.length === 0 && (
          <div className="text-center text-white/40 py-4">
            No deposit history
          </div>
        )}
      </div>
    </ScrollArea>
  );
  
  const withdrawalsContent = (
    <ScrollArea className="h-60">
      <div className="space-y-2">
        {withdrawals.map(withdrawal => (
          <div 
            key={`withdrawal-${withdrawal.id}`} 
            className="flex items-center justify-between bg-[#0f0f0f] rounded-lg p-2 text-xs"
          >
            <div className="flex items-center">
              <div className="p-1 rounded bg-btc-orange/10 mr-2">
                <Upload className="h-3 w-3 text-btc-orange" />
              </div>
              <div>
                <div className="text-white font-medium">
                  Withdrawal
                  {withdrawal.status !== 'completed' && (
                    <span className={`ml-1 px-1 py-0.5 rounded text-[10px] ${
                      withdrawal.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {withdrawal.status.toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="text-white/60 text-[10px]">
                  {format(withdrawal.timestamp, 'MMM d, h:mm a')}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-btc-orange">
                -{formatBTC(withdrawal.amount)}
              </div>
              <div className="text-white/40 text-[10px] truncate max-w-24">
                {withdrawal.txId.substring(0, 6)}...{withdrawal.txId.substring(withdrawal.txId.length - 6)}
              </div>
            </div>
          </div>
        ))}
        
        {withdrawals.length === 0 && (
          <div className="text-center text-white/40 py-4">
            No withdrawal history
          </div>
        )}
      </div>
    </ScrollArea>
  );
  
  // For mobile, we'll show a different tabs structure
  if (isMobile) {
    return (
      <Tabs defaultValue="bets" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-2">
          <TabsTrigger value="bets" className="text-xs">
            <Trophy className="h-3 w-3 mr-1.5" />
            Bets
          </TabsTrigger>
          <TabsTrigger value="wallet" className="text-xs">
            <History className="h-3 w-3 mr-1.5" />
            Wallet
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="bets" className="mt-0">
          {betsContent}
        </TabsContent>
        
        <TabsContent value="wallet" className="mt-0">
          <CombinedTransactionsList deposits={deposits} withdrawals={withdrawals} />
        </TabsContent>
      </Tabs>
    );
  }

  // Desktop view
  return (
    <Tabs defaultValue="bets" className="w-full" onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-3 mb-2">
        <TabsTrigger value="bets" className="text-xs">
          <Trophy className="h-3 w-3 mr-1.5" />
          Bets
        </TabsTrigger>
        <TabsTrigger value="deposits" className="text-xs">
          <Download className="h-3 w-3 mr-1.5" />
          Deposits
        </TabsTrigger>
        <TabsTrigger value="withdrawals" className="text-xs">
          <Upload className="h-3 w-3 mr-1.5" />
          Withdrawals
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="bets" className="mt-0">
        {betsContent}
      </TabsContent>
      
      <TabsContent value="deposits" className="mt-0">
        {depositsContent}
      </TabsContent>
      
      <TabsContent value="withdrawals" className="mt-0">
        {withdrawalsContent}
      </TabsContent>
    </Tabs>
  );
};

export default BetHistory;
