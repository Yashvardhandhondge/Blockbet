
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
  
  // Window dimensions for the confetti
  const [dimensions, setDimensions] = useState({ 
    width: typeof window !== 'undefined' ? window.innerWidth : 0, 
    height: typeof window !== 'undefined' ? window.innerHeight : 0 
  });

  // Update dimensions on window resize
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

  // Control confetti visibility
  useEffect(() => {
    if (isActive) {
      setShowConfetti(true);
      
      // Hide confetti after duration
      const timer = setTimeout(() => {
        setShowConfetti(false);
        if (onComplete) onComplete();
      }, duration);
      
      return () => clearTimeout(timer);
    }
    
    return undefined;
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
    />
  );
};

export default WinConfetti;
