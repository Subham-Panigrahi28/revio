import React from "react";
import { cn } from "../../utils/cn.js";

/**
 * Revio mark: three ragged input signals on the left resolving into one
 * continuous published line on the right — engineering activity becoming
 * communication.
 */
export function RevioMark({ className, animated = false }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={cn("h-7 w-7", className)}
      role="img"
      aria-label="Revio"
    >
      <g stroke="currentColor" strokeWidth="2.1" strokeLinecap="square">
        <path d="M3 8h6" opacity="0.45" />
        <path d="M3 16h4" opacity="0.7" />
        <path d="M3 24h6" opacity="0.45" />
      </g>
      <path
        d="M9 8c5 0 4 8 9 8s4-8 9-8"
        stroke="currentColor"
        strokeWidth="2.1"
        opacity="0.28"
        fill="none"
      />
      <path
        d="M9 24c5 0 4-8 9-8s4 8 9 8"
        stroke="currentColor"
        strokeWidth="2.1"
        opacity="0.28"
        fill="none"
      />
      <path
        d="M7 16h22"
        stroke="var(--signal)"
        strokeWidth="2.6"
        strokeLinecap="square"
        strokeDasharray={animated ? "220" : undefined}
        style={animated ? { animation: "revio-trace 1.4s ease-out both" } : undefined}
      />
    </svg>
  );
}

export function RevioWordmark({ className, markClassName, subtitle }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <RevioMark className={cn("h-6 w-6 text-foreground", markClassName)} />
      <span className="flex items-baseline gap-2">
        <span className="text-[1.0625rem] font-semibold tracking-[-0.03em]">Revio</span>
        {subtitle ? (
          <span className="text-meta hidden sm:inline">{subtitle}</span>
        ) : null}
      </span>
    </span>
  );
}
