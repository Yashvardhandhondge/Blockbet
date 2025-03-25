
import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle, Undo } from 'lucide-react';

interface BetAlertProps {
  title: string;
  description: string;
  isVisible: boolean;
  onUndo: () => void;
  onClose: () => void;
  className?: string;
}

const BetAlert = ({
  title,
  description,
  isVisible,
  onUndo,
  onClose,
  className,
}: BetAlertProps) => {
  if (!isVisible) return null;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [isVisible, onClose]);

  return (
    <div 
      className={cn(
        "fixed bottom-4 right-4 z-50 max-w-md transition-all duration-300",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none",
        className
      )}
    >
      <Alert className="bg-btc-dark border-btc-orange/30 p-0 overflow-hidden shadow-lg">
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-3 p-4 bg-btc-orange/20">
            <CheckCircle className="h-5 w-5 text-btc-orange shrink-0" />
            <div className="flex-1">
              <AlertTitle className="text-white font-medium">{title}</AlertTitle>
              <AlertDescription className="text-white/70 text-sm mt-0.5">
                {description}
              </AlertDescription>
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-2 p-2 px-4 bg-btc-dark border-t border-white/5">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs border-btc-orange/20 bg-btc-orange/10 text-white hover:bg-btc-orange/20 hover:border-btc-orange/30"
              onClick={onUndo}
            >
              <Undo className="h-3 w-3 mr-1" />
              Undo
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs text-white/70 border-white/10 hover:bg-white/5 hover:text-white"
              onClick={onClose}
            >
              Dismiss
            </Button>
          </div>
        </div>
      </Alert>
    </div>
  );
};

export default BetAlert;
