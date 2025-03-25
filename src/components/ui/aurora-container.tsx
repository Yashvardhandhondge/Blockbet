
"use client"

import * as React from "react";
import { cn } from "@/lib/utils";

interface AuroraContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
  glowClassName?: string;
}

export function AuroraContainer({
  className,
  children,
  glowClassName,
  ...props
}: AuroraContainerProps) {
  return (
    <div className="relative" {...props}>
      {/* Gradient border container */}
      <div
        className={cn(
          "absolute -inset-[2px] rounded-xl bg-gradient-to-r from-purple-500 via-cyan-300 to-emerald-400 opacity-75 blur-lg transition-all",
          "group-hover:opacity-100 group-hover:blur-xl",
          glowClassName
        )}
      />

      {/* Content container */}
      <div
        className={cn(
          "relative rounded-xl bg-btc-darker/90 shadow-xl",
          "group border border-slate-800",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
