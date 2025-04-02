
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowUpFromLine, Loader2, QrCode } from 'lucide-react';
import { toast } from "sonner";
import { walletManager } from '@/services/lnbitsService';
import { useAuth } from '@/context/AuthContext';

const LightningWithdraw: React.FC<{ availableBalance: number }> = ({ availableBalance }) => {
  const { user } = useAuth();
  const [amount, setAmount] = useState<number>(0);
  const [invoice, setInvoice] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showScanner, setShowScanner] = useState<boolean>(false);
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) || 0;
    setAmount(Math.max(0, Math.min(availableBalance, value)));
  };
  
  const handleInvoiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvoice(e.target.value);
  };
  
  const handleWithdraw = async () => {
    if (!user?.id || !invoice || amount <= 0) {
      toast.error("Please enter a valid invoice and amount");
      return;
    }
    
    if (amount > availableBalance) {
      toast.error("Withdrawal amount exceeds available balance");
      return;
    }
    
    try {
      setIsLoading(true);
      const success = await walletManager.processWithdrawal(
        user.id,
        invoice,
        amount
      );
      
      if (success) {
        toast.success("Withdrawal successful!");
        setInvoice("");
        setAmount(0);
      } else {
        toast.error("Withdrawal failed");
      }
    } catch (error) {
      toast.error("An error occurred during withdrawal");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center mb-4">
        <div className="bg-btc-darker/80 p-3 rounded-full">
          <ArrowUpFromLine size={24} className="text-btc-orange" />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="withdrawAmount" className="text-white">Amount (sats)</Label>
          <Input
            id="withdrawAmount"
            type="number"
            min="1"
            max={availableBalance}
            placeholder="Enter amount in sats"
            value={amount || ''}
            onChange={handleAmountChange}
            className="bg-btc-darker/90 border-white/10 text-white"
          />
          <p className="text-xs text-white/40">Available: {availableBalance} sats</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="invoiceInput" className="text-white">Lightning Invoice</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowScanner(!showScanner)}
              className="text-btc-orange hover:text-btc-orange/80"
            >
              <QrCode className="h-4 w-4" />
            </Button>
          </div>
          <Input
            id="invoiceInput"
            placeholder="Enter or paste a Lightning invoice"
            value={invoice}
            onChange={handleInvoiceChange}
            className="bg-btc-darker/90 border-white/10 text-white"
          />
        </div>
        
        {showScanner && (
          <div className="bg-btc-darker/40 p-4 rounded-lg border border-white/5">
            <p className="text-white/60 text-sm text-center">QR Scanner functionality would go here</p>
            {/* In a real implementation, we'd integrate a QR scanner component here */}
          </div>
        )}
        
        <Button
          onClick={handleWithdraw}
          className="w-full bg-btc-orange hover:bg-btc-orange/80 text-btc-darker font-semibold"
          disabled={isLoading || amount <= 0 || !invoice || amount > availableBalance}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Withdraw
        </Button>
      </div>
    </div>
  );
};

export default LightningWithdraw;
