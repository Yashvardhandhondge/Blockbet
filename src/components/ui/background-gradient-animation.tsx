
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
    document.body.style.setProperty("background", `linear-gradient(to bottom, ${gradientBackgroundStart}, ${gradientBackgroundEnd})`);
    document.body.style.setProperty("background-repeat", "no-repeat");
    document.body.style.setProperty("overflow-x", "hidden");
    
    // Clean up when component unmounts
    return () => {
      document.body.style.removeProperty("background");
      document.body.style.removeProperty("background-repeat");
      document.body.style.removeProperty("overflow-x");
    };
  }, [gradientBackgroundStart, gradientBackgroundEnd]);
  
  useEffect(() => {
    function move() {
      if (!interactiveRef.current) return;
      
      setCurX(curX => curX + (tgX - curX) * 0.1);
      setCurY(curY => curY + (tgY - curY) * 0.1);
      
      if (interactiveRef.current) {
        interactiveRef.current.style.transform = `translate(${curX}px, ${curY}px)`;
      }
      
      requestAnimationFrame(move);
    }
    
    function handleMouseMove(e: MouseEvent) {
      const { clientX, clientY } = e;
      if (!interactiveRef.current) return;
      
      const rect = interactiveRef.current.getBoundingClientRect();
      setTgX(clientX - rect.left - rect.width / 2);
      setTgY(clientY - rect.top - rect.height / 2);
    }
    
    if (interactive) {
      window.addEventListener("mousemove", handleMouseMove);
      
      move();
    }
    
    return () => {
      if (interactive) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [interactive, tgX, tgY]);
  
  const sizeClasses = {
    small: "w-[250px] h-[250px] md:w-[500px] md:h-[500px]",
    medium: "w-[350px] h-[350px] md:w-[700px] md:h-[700px]",
    large: "w-full h-screen",
  };
  
  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      <div
        className={cn(
          "fixed -z-10 transform-gpu overflow-hidden blur-3xl",
          sizeClasses[size],
          className
        )}
        aria-hidden="true"
      >
        <div
          ref={interactiveRef}
          className={cn(
            "relative w-[200%] h-[200%] left-[-50%] top-[-50%]",
            "bg-transparent opacity-40"
          )}
        >
          <div
            className="absolute top-0 left-[calc(50%-11rem)] z-[-10] transform-gpu rotate-[30deg] blur-3xl opacity-50"
            style={{
              width: "48rem",
              height: "48rem",
              background: `radial-gradient(circle, ${firstColor} 0%, transparent 70%)`,
              mixBlendMode: blendingValue as any,
              animation: "moveBackground 10s linear infinite",
              animationDelay: "0s",
            }}
          />
          <div
            className="absolute top-0 left-[calc(50%+13rem)] z-[-10] transform-gpu rotate-[170deg] blur-3xl opacity-40"
            style={{
              width: "40rem",
              height: "40rem",
              background: `radial-gradient(circle, ${secondColor} 0%, transparent 70%)`,
              mixBlendMode: blendingValue as any,
              animation: "moveBackground 15s linear infinite",
              animationDelay: "-2s",
            }}
          />
          <div
            className="absolute top-[calc(50%-40rem)] right-[calc(50%-11rem)] z-[-10] transform-gpu rotate-[10deg] blur-3xl opacity-30"
            style={{
              width: "44rem",
              height: "44rem",
              background: `radial-gradient(circle, ${thirdColor} 0%, transparent 70%)`,
              mixBlendMode: blendingValue as any,
              animation: "moveBackground 13s linear infinite",
              animationDelay: "-5s",
            }}
          />
          <div
            className="absolute bottom-[calc(50%-15rem)] right-[calc(50%+8rem)] z-[-10] transform-gpu rotate-[60deg] blur-3xl opacity-50"
            style={{
              width: "35rem",
              height: "35rem",
              background: `radial-gradient(circle, ${fourthColor} 0%, transparent 70%)`,
              mixBlendMode: blendingValue as any,
              animation: "moveBackground 18s linear infinite",
              animationDelay: "-7s",
            }}
          />
          <div
            className="absolute bottom-[20%] left-[30%] z-[-10] transform-gpu rotate-[230deg] blur-3xl opacity-40"
            style={{
              width: "38rem",
              height: "38rem",
              background: `radial-gradient(circle, ${fifthColor} 0%, transparent 70%)`,
              mixBlendMode: blendingValue as any,
              animation: "moveBackground 16s linear infinite",
              animationDelay: "-10s",
            }}
          />
        </div>
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};
