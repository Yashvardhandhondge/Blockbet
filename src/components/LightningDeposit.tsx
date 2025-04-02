
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import QRCode from '@/components/QRCode';
import { ArrowDownToLine, Copy, Loader2, RefreshCw } from 'lucide-react';
import { toast } from "sonner";
import { walletManager } from '@/services/lnbitsService';
import { useAuth } from '@/context/AuthContext';

const LightningDeposit: React.FC = () => {
  const { user } = useAuth();
  const [amount, setAmount] = useState<number>(0);
  const [invoice, setInvoice] = useState<{ paymentHash: string; paymentRequest: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState<boolean>(false);
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) || 0;
    setAmount(Math.max(0, value));
  };
  
  const handleGenerateInvoice = async () => {
    if (!user?.id || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    try {
      setIsLoading(true);
      const result = await walletManager.createDepositInvoice(
        user.id,
        amount,
        "BlockBet Deposit"
      );
      
      if (result) {
        setInvoice(result);
        toast.success("Invoice generated successfully");
      } else {
        toast.error("Failed to generate invoice");
      }
    } catch (error) {
      toast.error("An error occurred while generating the invoice");
    } finally {
      setIsLoading(false);
    }
  };
  
  const copyToClipboard = () => {
    if (invoice?.paymentRequest) {
      navigator.clipboard.writeText(invoice.paymentRequest);
      toast.success("Invoice copied to clipboard");
    }
  };
  
  const checkPaymentStatus = async () => {
    if (!user?.id || !invoice?.paymentHash) return;
    
    try {
      setIsCheckingPayment(true);
      // Get profile to check wallet invoice key
      const { data: profile } = await fetch(`/api/profile?userId=${user.id}`).then(res => res.json());
      
      if (!profile?.lnbits_invoice_key) {
        toast.error("Could not find wallet information");
        return;
      }
      
      const paid = await fetch(`/api/check-payment?key=${profile.lnbits_invoice_key}&hash=${invoice.paymentHash}`).then(res => res.json());
      
      if (paid) {
        toast.success("Payment received!");
        setInvoice(null);
        // Trigger balance refresh in the parent component
      } else {
        toast.info("Payment not detected yet");
      }
    } catch (error) {
      toast.error("An error occurred while checking payment");
    } finally {
      setIsCheckingPayment(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center mb-4">
        <div className="bg-btc-darker/80 p-3 rounded-full">
          <ArrowDownToLine size={24} className="text-btc-orange" />
        </div>
      </div>
      
      {invoice ? (
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <QRCode
              value={invoice.paymentRequest}
              size={200}
              bgColor="transparent"
              fgColor="#ffffff"
              className="bg-btc-darker/40 p-4 rounded-xl"
            />
            <div className="flex flex-col items-center">
              <p className="text-white font-medium">{amount} sats</p>
              <div className="mt-2 flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={copyToClipboard}
                  className="bg-btc-darker border-white/10 text-white hover:bg-white/5"
                >
                  <Copy className="mr-1 h-4 w-4" /> Copy Invoice
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={checkPaymentStatus}
                  disabled={isCheckingPayment}
                  className="bg-btc-darker border-white/10 text-white hover:bg-white/5"
                >
                  {isCheckingPayment ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-1" />
                  )}
                  Check Status
                </Button>
              </div>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInvoice(null)}
            className="w-full bg-btc-darker border-white/10 text-white"
          >
            Cancel
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="depositAmount" className="text-white">Amount (sats)</Label>
            <Input
              id="depositAmount"
              type="number"
              min="1"
              placeholder="Enter amount in sats"
              value={amount || ''}
              onChange={handleAmountChange}
              className="bg-btc-darker/90 border-white/10 text-white"
            />
          </div>
          
          <Button
            onClick={handleGenerateInvoice}
            className="w-full bg-btc-orange hover:bg-btc-orange/80 text-btc-darker font-semibold"
            disabled={isLoading || amount <= 0}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Generate Invoice
          </Button>
        </div>
      )}
    </div>
  );
};

export default LightningDeposit;
