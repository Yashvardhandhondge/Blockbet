
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ConfettiConfig {
  angle?: number;
  spread?: number;
  startVelocity?: number;
  elementCount?: number;
  dragFriction?: number;
  duration?: number;
  stagger?: number;
  width?: string;
  height?: string;
  perspective?: string;
  colors?: string[];
  origin?: "left" | "right" | "top" | "bottom" | "center";
}

const defaultConfettiConfig: ConfettiConfig = {
  angle: 90,
  spread: 360,
  startVelocity: 40,
  elementCount: 70,
  dragFriction: 0.12,
  duration: 3000,
  stagger: 3,
  width: "10px",
  height: "10px",
  perspective: "500px",
  origin: "center",
  colors: [
    "#FEDA78", // Gold
    "#FFD700", // Yellow Gold
    "#FFF4CF", // Light Gold
    "#D4AF37", // Metallic Gold 
    "#FFDF00", // Golden Yellow
    "#f44336", // Red 
    "#e91e63", // Pink
    "#9c27b0", // Purple
    "#673ab7", // Deep Purple
    "#3f51b5", // Indigo
    "#2196f3", // Blue
    "#03a9f4", // Light Blue
    "#00bcd4", // Cyan
    "#009688", // Teal
    "#4CAF50", // Green
    "#8BC34A", // Light Green
    "#CDDC39", // Lime
    "#FFF9C4", // Light Yellow
    "#FFEB3B", // Yellow
    "#FFC107", // Amber
    "#FF9800", // Orange
    "#FF5722", // Deep Orange
  ],
};

export function Confetti({
  config = {},
  className,
  onAnimationComplete,
  ...props
}: {
  config?: ConfettiConfig;
  className?: string;
  onAnimationComplete?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [confetti, setConfetti] = useState<HTMLDivElement[]>([]);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  const mergedConfig = { ...defaultConfettiConfig, ...config };

  const createConfetti = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const confettiElements: HTMLDivElement[] = [];

    const {
      elementCount,
      colors,
      width,
      height,
      perspective,
      duration,
      angle,
      spread,
      startVelocity,
      dragFriction,
      stagger,
      origin
    } = mergedConfig;

    // Reset animation state
    setIsAnimationComplete(false);

    // Create new confetti elements
    for (let i = 0; i < (elementCount || 50); i++) {
      const confettiElement = document.createElement("div");
      
      const color = colors?.[Math.floor(Math.random() * (colors.length || 0))] || "#" + ((Math.random() * 0xffffff) << 0).toString(16);
      
      confettiElement.style.backgroundColor = color;
      confettiElement.style.width = width || "10px";
      confettiElement.style.height = height || "10px";
      confettiElement.style.perspective = perspective || "500px";
      confettiElement.style.position = "absolute";
      confettiElement.style.willChange = "transform, opacity";
      confettiElement.style.visibility = "hidden";
      confettiElement.style.zIndex = "999";
      confettiElement.style.borderRadius = "50%";
      
      container.appendChild(confettiElement);
      confettiElements.push(confettiElement);
    }

    setConfetti(confettiElements);

    // Determine starting position based on origin
    let initialX: number;
    let initialY: number;

    switch (origin) {
      case "left":
        initialX = 0;
        initialY = container.clientHeight / 2;
        break;
      case "right":
        initialX = container.clientWidth;
        initialY = container.clientHeight / 2;
        break;
      case "top":
        initialX = container.clientWidth / 2;
        initialY = 0;
        break;
      case "bottom":
        initialX = container.clientWidth / 2;
        initialY = container.clientHeight;
        break;
      case "center":
      default:
        initialX = container.clientWidth / 2;
        initialY = container.clientHeight / 2;
        break;
    }

    // Initial position
    confettiElements.forEach((confettiElement) => {
      confettiElement.style.visibility = "visible";
      confettiElement.style.transform = `translate3d(${initialX}px, ${initialY}px, 0) rotate(0deg)`;
    });
    
    // Animate
    setTimeout(() => {
      confettiElements.forEach((confettiElement, index) => {
        const staggerDelay = index * (stagger || 0);
        const randomAngle = ((angle || 0) - (spread || 0) / 2) + Math.random() * (spread || 0);
        const velocity = (startVelocity || 0) + Math.random() * ((startVelocity || 0) * 0.5);
        
        const spinValue = Math.random() > 0.5 ? 360 : -360;
        
        // Calculate the end position based on the angle and velocity
        const radians = randomAngle * (Math.PI / 180);
        const maxDist = Math.min(container.clientWidth, container.clientHeight);
        const x = Math.cos(radians) * maxDist * (Math.random() * 0.6 + 0.5);
        const y = Math.sin(radians) * maxDist * (Math.random() * 0.6 + 0.5) * -1;
        
        // Create the animation
        confettiElement.animate(
          [
            {
              transform: `translate3d(${initialX}px, ${initialY}px, 0) rotate(0deg)`,
              opacity: 1,
            },
            {
              transform: `translate3d(${initialX + x}px, ${initialY + y}px, 0) rotate3d(1, 1, 1, ${spinValue}deg)`,
              opacity: 0,
            },
          ],
          {
            duration: (duration || 0) + staggerDelay,
            delay: staggerDelay,
            fill: "forwards",
            easing: `cubic-bezier(${0.5 + Math.random() * 0.2}, ${0.1 + Math.random() * 0.3}, ${0.5 + Math.random() * 0.2}, ${0.9 + Math.random() * 0.1})`,
          }
        );
      });

      // Set animation completion state after animations complete
      setTimeout(() => {
        setIsAnimationComplete(true);
        if (onAnimationComplete) onAnimationComplete();
        
        // Clean up elements
        confettiElements.forEach((el) => {
          el.remove();
        });
        setConfetti([]);
      }, (duration || 0) + (elementCount || 0) * (stagger || 0));
    }, 50);
  }, [mergedConfig]);

  // Start animation on mount
  useEffect(() => {
    createConfetti();
  }, [createConfetti]);

  return (
    <div
      ref={containerRef}
      className={cn("absolute inset-0 pointer-events-none overflow-hidden", className)}
      {...props}
    />
  );
}
