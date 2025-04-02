
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { extractUrlParams } from '@/utils/lnurlAuth';
import { useAuth } from '@/context/AuthContext';
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation';
import { Loader2 } from 'lucide-react';
import { toast } from "sonner";

const LnurlCallback: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { lnurlAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setLoading(true);
        
        const params = extractUrlParams();
        const { k1, sig, key } = params;
        
        if (!k1 || !sig || !key) {
          throw new Error('Missing required parameters for LNURL authentication');
        }
        
        // Process LNURL auth with our context
        const success = await lnurlAuth(k1, sig, key);
        
        if (success) {
          toast.success('Lightning authentication successful!');
          navigate('/');
        } else {
          throw new Error('Lightning authentication failed');
        }
      } catch (error: any) {
        console.error('LNURL callback error:', error);
        setError(error.message || 'Authentication failed');
        toast.error(error.message || 'Authentication failed');
      } finally {
        setLoading(false);
      }
    };
    
    handleCallback();
  }, [location, lnurlAuth, navigate]);
  
  return (
    <BackgroundGradientAnimation
      gradientBackgroundStart="rgb(0, 0, 0)" 
      gradientBackgroundEnd="rgb(7, 7, 7)" 
      firstColor="#FFCC66" 
      secondColor="#D19CFF" 
      thirdColor="#7AE5FF" 
      fourthColor="#FFBB7A" 
      fifthColor="#FFDF7A"
      pointerColor="rgba(255, 190, 60, 0.4)"
      blendingValue="hard-light"
      className="w-full h-full"
      containerClassName="min-h-screen"
    >
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-btc-darker/40 backdrop-blur-md border border-white/5 rounded-2xl p-8 max-w-md w-full text-center">
          {loading ? (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-12 w-12 text-btc-orange animate-spin" />
              <h2 className="text-xl font-semibold text-white">Verifying your Lightning authentication...</h2>
            </div>
          ) : error ? (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-red-500">Authentication Failed</h2>
              <p className="text-white/60">{error}</p>
              <button
                onClick={() => navigate('/auth')}
                className="bg-btc-orange hover:bg-btc-orange/80 text-btc-darker font-semibold px-4 py-2 rounded-full"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-green-500">Authentication Successful</h2>
              <p className="text-white/60">You're being redirected...</p>
            </div>
          )}
        </div>
      </div>
    </BackgroundGradientAnimation>
  );
};

export default LnurlCallback;
