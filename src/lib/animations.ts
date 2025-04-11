import { useEffect, useState, useCallback, useRef } from 'react';

interface AnimationOptions {
  duration?: number;
  delay?: number;
  easing?: string;
}

export const useElementAppear = (
  isVisible = true,
  options: AnimationOptions = {}
) => {
  const [hasAppeared, setHasAppeared] = useState(false);
  
  const {
    duration = 400,
    delay = 0,
    easing = 'cubic-bezier(0.16, 1, 0.3, 1)',
  } = options;
  
  useEffect(() => {
    if (isVisible && !hasAppeared) {
      const timer = setTimeout(() => {
        setHasAppeared(true);
      }, delay);
      
      return () => clearTimeout(timer);
    }
    
    if (!isVisible && hasAppeared) {
      setHasAppeared(false);
    }
  }, [isVisible, hasAppeared, delay]);
  
  return {
    style: {
      opacity: hasAppeared ? 1 : 0,
      transform: hasAppeared ? 'translateY(0)' : 'translateY(20px)',
      transition: `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`,
    },
    hasAppeared,
  };
};

export const useCountUp = (
  targetValue: number,
  duration = 1000,
  startDelay = 0
) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    let startTime: number | null = null;
    const startValue = displayValue;
    const valueToAdd = targetValue - startValue;
    let rafId: number;
    
    const delay = setTimeout(() => {
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease out
        
        setDisplayValue(startValue + valueToAdd * easeProgress);
        
        if (progress < 1) {
          rafId = requestAnimationFrame(animate);
        }
      };
      
      rafId = requestAnimationFrame(animate);
    }, startDelay);
    
    return () => {
      clearTimeout(delay);
      cancelAnimationFrame(rafId);
    };
  }, [targetValue, duration, startDelay]);
  
  return displayValue;
};

// Updated useRandomInterval to prevent unexpected re-renders and side effects
export const useRandomInterval = (
  callback: () => void,
  minDelay: number,
  maxDelay: number
) => {
  // Use useRef to store the callback function to avoid re-creating the interval on every render
  const savedCallback = useRef(callback);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Update the ref whenever the callback changes
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  
  // Setup the interval
  useEffect(() => {
    const runInterval = () => {
      const randomDelay = 
        Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
      
      timeoutRef.current = setTimeout(() => {
        savedCallback.current();
        runInterval();
      }, randomDelay);
    };
    
    runInterval();
    
    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [minDelay, maxDelay]); // Only re-run if delay ranges change
};
