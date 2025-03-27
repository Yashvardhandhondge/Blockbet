
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatDistanceToNow } from 'date-fns';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

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

const BetHistory = ({ betHistory, deposits, withdrawals }: BetHistoryProps) => {
  const [activeTab, setActiveTab] = useState("bets");
  const isMobile = useIsMobile();
  
  const formatSats = (satoshis: number) => {
    return satoshis.toLocaleString() + " sats";
  };
  
  const formatTxId = (txId: string) => {
    return txId.substring(0, 6) + '...' + txId.substring(txId.length - 6);
  };
  
  const formatTimeAgo = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };
  
  const getStatusColor = (status: 'completed' | 'pending' | 'failed') => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-400';
      case 'failed':
        return 'text-red-400';
      default:
        return 'text-white';
    }
  };
  
  return (
    <Tabs defaultValue="bets" className="w-full" onValueChange={setActiveTab}>
      <TabsList className={cn(
        "bg-[#151515] border-b border-white/10 w-full rounded-md p-0 h-auto flex",
        isMobile ? "flex-wrap justify-start gap-1" : ""
      )}>
        <TabsTrigger 
          value="bets" 
          className={cn(
            "rounded-md py-1.5 px-3 text-xs data-[state=active]:bg-btc-orange/20 data-[state=active]:text-btc-orange data-[state=active]:shadow",
            isMobile ? "flex-1 min-w-0 max-w-[33%]" : ""
          )}
        >
          Bets History
        </TabsTrigger>
        <TabsTrigger 
          value="deposits" 
          className={cn(
            "rounded-md py-1.5 px-3 text-xs data-[state=active]:bg-btc-orange/20 data-[state=active]:text-btc-orange data-[state=active]:shadow",
            isMobile ? "flex-1 min-w-0 max-w-[33%]" : ""
          )}
        >
          Deposits
        </TabsTrigger>
        <TabsTrigger 
          value="withdrawals" 
          className={cn(
            "rounded-md py-1.5 px-3 text-xs data-[state=active]:bg-btc-orange/20 data-[state=active]:text-btc-orange data-[state=active]:shadow",
            isMobile ? "flex-1 min-w-0 max-w-[33%]" : ""
          )}
        >
          Withdrawals
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="bets" className="p-0 mt-3">
        <div className="space-y-2 max-h-[200px] overflow-y-auto hide-scrollbar">
          {betHistory.map(bet => (
            <div 
              key={bet.id} 
              className="bg-[#151515]/50 p-2 rounded flex justify-between items-center text-xs"
            >
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className={bet.isWin ? 'text-green-400' : 'text-red-400'}>
                    {bet.isWin ? 'Won' : 'Lost'}
                  </span>
                  <span className="mx-1">·</span>
                  <span className="text-white/60">Block #{bet.blockHeight}</span>
                </div>
                <div className="text-white/80">{bet.poolName}</div>
                <div className="text-white/60 text-[10px]">{formatTimeAgo(bet.timestamp)}</div>
              </div>
              <div className="font-mono text-right">
                <div className={bet.isWin ? 'text-green-400' : 'text-white/80'}>
                  {formatSats(bet.amount)}
                </div>
              </div>
            </div>
          ))}
          
          {betHistory.length === 0 && (
            <div className="text-center text-white/60 py-4 text-sm">
              No bet history available.
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="deposits" className="p-0 mt-3">
        <div className="space-y-2 max-h-[200px] overflow-y-auto hide-scrollbar">
          {deposits.map(deposit => (
            <div 
              key={deposit.id} 
              className="bg-[#151515]/50 p-2 rounded flex justify-between items-center text-xs"
            >
              <div className="flex flex-col">
                <div className="text-green-400">Deposit</div>
                <div className="text-white/80">{formatTxId(deposit.txId)}</div>
                <div className="text-white/60 text-[10px]">{formatTimeAgo(deposit.timestamp)}</div>
              </div>
              <div className="font-mono text-right text-green-400">
                +{formatSats(deposit.amount)}
              </div>
            </div>
          ))}
          
          {deposits.length === 0 && (
            <div className="text-center text-white/60 py-4 text-sm">
              No deposit history available.
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="withdrawals" className="p-0 mt-3">
        <div className="space-y-2 max-h-[200px] overflow-y-auto hide-scrollbar">
          {withdrawals.map(withdrawal => (
            <div 
              key={withdrawal.id} 
              className="bg-[#151515]/50 p-2 rounded flex justify-between items-center text-xs"
            >
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="text-btc-orange">Withdrawal</span>
                  <span className="mx-1">·</span>
                  <span className={getStatusColor(withdrawal.status)}>
                    {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                  </span>
                </div>
                <div className="text-white/80">{formatTxId(withdrawal.txId)}</div>
                <div className="text-white/60 text-[10px]">{formatTimeAgo(withdrawal.timestamp)}</div>
              </div>
              <div className="font-mono text-right text-btc-orange">
                -{formatSats(withdrawal.amount)}
              </div>
            </div>
          ))}
          
          {withdrawals.length === 0 && (
            <div className="text-center text-white/60 py-4 text-sm">
              No withdrawal history available.
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default BetHistory;
