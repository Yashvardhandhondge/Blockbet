
"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface BackgroundGradientAnimationProps {
  gradientBackgroundStart?: string;
  gradientBackgroundEnd?: string;
  firstColor?: string;
  secondColor?: string;
  thirdColor?: string;
  fourthColor?: string;
  fifthColor?: string;
  pointerColor?: string;
  size?: "small" | "medium" | "large";
  blendingValue?: string;
  children?: React.ReactNode;
  className?: string;
  interactive?: boolean;
  containerClassName?: string;
}

export const BackgroundGradientAnimation = ({
  gradientBackgroundStart = "rgb(0, 0, 0)",
  gradientBackgroundEnd = "rgb(7, 7, 7)",
  firstColor = "#FFCC66",   // Further brightened from #FFB347 (20% brighter)
  secondColor = "#D19CFF",  // Further brightened from #B885FF (20% brighter)
  thirdColor = "#7AE5FF",   // Further brightened from #4EDCFF (20% brighter)
  fourthColor = "#FFBB7A",  // Further brightened from #FFA04D (20% brighter)
  fifthColor = "#FFDF7A",   // Further brightened from #FFD54F (20% brighter)
  pointerColor = "rgba(255, 190, 60, 0.4)", // Further brightened pointer color
  size = "large",
  blendingValue = "hard-light",
  children,
  className,
  interactive = true,
  containerClassName,
}: BackgroundGradientAnimationProps) => {
  const interactiveRef = useRef<HTMLDivElement>(null);
  const [curX, setCurX] = useState(0);
  const [curY, setCurY] = useState(0);
  const [tgX, setTgX] = useState(0);
  const [tgY, setTgY] = useState(0);
  
  useEffect(() => {
    document.documentElement.style.background = `linear-gradient(to bottom, ${gradientBackgroundStart}, ${gradientBackgroundEnd})`;
    document.documentElement.style.backgroundAttachment = "fixed";
    document.documentElement.style.height = "100%";
    document.body.style.margin = "0";
    document.body.style.minHeight = "100vh";
    document.body.style.overflowX = "hidden";
    
    return () => {
      document.documentElement.style.removeProperty("background");
      document.documentElement.style.removeProperty("backgroundAttachment");
      document.documentElement.style.removeProperty("height");
      document.body.style.removeProperty("margin");
      document.body.style.removeProperty("minHeight");
      document.body.style.removeProperty("overflowX");
    };
  }, [gradientBackgroundStart, gradientBackgroundEnd]);
  
  useEffect(() => {
    if (!interactive) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactiveRef.current) return;
      
      const rect = interactiveRef.current.getBoundingClientRect();
      setTgX(clientX - rect.left - rect.width / 2);
      setTgY(clientY - rect.top - rect.height / 2);
    };
    
    const handleFrame = () => {
      setCurX(prevX => prevX + (tgX - prevX) * 0.1);
      setCurY(prevY => prevY + (tgY - prevY) * 0.1);
      
      if (interactiveRef.current) {
        interactiveRef.current.style.transform = `translate(${curX}px, ${curY}px)`;
      }
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    
    const intervalId = setInterval(handleFrame, 1000 / 60);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(intervalId);
    };
  }, [interactive, tgX, tgY, curX, curY]);
  
  const sizeClasses = {
    small: "w-[250px] h-[250px] md:w-[500px] md:h-[500px]",
    medium: "w-[350px] h-[350px] md:w-[700px] md:h-[700px]",
    large: "w-full h-screen",
  };
  
  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      <div
        className={cn(
          "fixed inset-0 -z-10 transform-gpu overflow-hidden",
          sizeClasses[size],
          className
        )}
        aria-hidden="true"
      >
        <div
          ref={interactiveRef}
          className={cn(
            "absolute inset-0",
            "opacity-40"
          )}
        >
          <div
            className="absolute -left-[100%] top-[calc(50%-30rem)] z-[-10] transform-gpu blur-3xl sm:-top-[10rem]"
            style={{
              width: "60rem",
              height: "60rem",
              background: `radial-gradient(circle, ${firstColor} 0%, transparent 70%)`,
              mixBlendMode: blendingValue as any,
              animation: "moveBackground 15s linear infinite",
              animationDelay: "0s",
            }}
            aria-hidden="true"
          />
          <div
            className="absolute -right-[100%] top-[calc(50%-30rem)] z-[-10] transform-gpu blur-3xl sm:top-[-15rem]"
            style={{
              width: "60rem",
              height: "60rem",
              background: `radial-gradient(circle, ${secondColor} 0%, transparent 70%)`,
              mixBlendMode: blendingValue as any,
              animation: "moveBackground 20s linear infinite",
              animationDelay: "-5s",
            }}
            aria-hidden="true"
          />
          <div
            className="absolute left-[25%] bottom-0 z-[-10] transform-gpu blur-3xl"
            style={{
              width: "50rem",
              height: "50rem",
              background: `radial-gradient(circle, ${thirdColor} 0%, transparent 70%)`,
              mixBlendMode: blendingValue as any,
              animation: "moveBackground 25s linear infinite",
              animationDelay: "-10s",
            }}
            aria-hidden="true"
          />
          <div
            className="absolute right-[50%] bottom-[20%] z-[-10] transform-gpu blur-3xl"
            style={{
              width: "45rem",
              height: "45rem",
              background: `radial-gradient(circle, ${fourthColor} 0%, transparent 70%)`,
              mixBlendMode: blendingValue as any,
              animation: "moveBackground 30s linear infinite",
              animationDelay: "-15s",
            }}
            aria-hidden="true"
          />
          <div
            className="absolute top-[20%] left-[30%] z-[-10] transform-gpu blur-3xl"
            style={{
              width: "40rem",
              height: "40rem",
              background: `radial-gradient(circle, ${fifthColor} 0%, transparent 70%)`,
              mixBlendMode: blendingValue as any,
              animation: "moveBackground 35s linear infinite",
              animationDelay: "-7s",
            }}
            aria-hidden="true"
          />
        </div>
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};
