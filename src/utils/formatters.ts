import { MiningPool } from './types';
import JSConfetti from 'js-confetti';

export const formatSatsToBTC = (sats: number): string => {
  return (sats / 100000000).toFixed(8);
};

export const formatSats = (sats: number): string => {
  // Always display in sats now, no conversion to BTC
  return `${sats.toLocaleString()} sats`;
};

// Function to emit a player win event
export const emitPlayerWin = () => {
  // Ensure JSConfetti is loaded
  try {
    const jsConfetti = new JSConfetti();
    jsConfetti.addConfetti({
      emojis: ['🎉', '💰', '🎊', '⚡', '🏆'],
      confettiNumber: 100,
      emojiSize: 32,
      confettiRadius: 6,
    });
    
    // Add double burst for more impact
    setTimeout(() => {
      jsConfetti.addConfetti({
        emojis: ['₿', '✨', '🌟', '💫', '🔥'],
        confettiNumber: 50,
        emojiSize: 24,
        confettiRadius: 8,
      });
    }, 300);
  } catch (error) {
    console.error('Failed to trigger confetti:', error);
  }

  const winEvent = new CustomEvent('playerWin', { 
    detail: { 
      timestamp: Date.now(),
      source: 'betting-grid'
    } 
  });
  
  console.log('Emitting playerWin event:', {
    timestamp: new Date().toISOString(),
    eventDetail: winEvent.detail
  });
  
  window.dispatchEvent(winEvent);
};
