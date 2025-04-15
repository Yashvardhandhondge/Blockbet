import React, { useState, useEffect } from 'react';
import ReactConfetti from 'react-confetti';
import { useIsMobile } from '@/hooks/use-mobile';

interface WinConfettiProps {
  isActive: boolean;
  duration?: number;
  onComplete?: () => void;
}

const WinConfetti: React.FC<WinConfettiProps> = ({ 
  isActive,
  duration = 5000,
  onComplete
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const isMobile = useIsMobile();
  
  const [dimensions, setDimensions] = useState({ 
    width: typeof window !== 'undefined' ? window.innerWidth : 0, 
    height: typeof window !== 'undefined' ? window.innerHeight : 0 
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    console.log('WinConfetti component state change:', {
      isActive,
      showConfetti,
      dimensions,
      timestamp: new Date().toISOString()
    });
    
    if (isActive) {
      console.log('Activating confetti animation');
      setShowConfetti(true);
      
      const timer = setTimeout(() => {
        console.log('Confetti animation complete');
        setShowConfetti(false);
        if (onComplete) {
          onComplete();
        }
      }, duration);
      
      return () => {
        console.log('Cleaning up confetti timer');
        clearTimeout(timer);
      };
    }
  }, [isActive, duration, onComplete]);

  if (!showConfetti) return null;

  return (
    <ReactConfetti
      width={dimensions.width}
      height={dimensions.height}
      numberOfPieces={isMobile ? 100 : 200}
      recycle={false}
      colors={['#f7931a', '#ffffff', '#ffcc66', '#ffd27a', '#ffdf7a']}
      gravity={0.25}
      onConfettiComplete={() => {
        console.log('Confetti animation physically complete');
      }}
    />
  );
};

export default WinConfetti;
