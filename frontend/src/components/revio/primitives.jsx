import React from "react";
import { cn } from "../../utils/cn.js";
import { categoryLabel } from "../../services/mockData.js";

export function Meta({ children, className }) {
  return <span className={cn("text-meta", className)}>{children}</span>;
}

export function Code({ children, className }) {
  return (
    <span
      className={cn(
        "text-code rounded-sm bg-surface-sunken px-1.5 py-0.5 text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function CategoryTag({ category, className }) {
  const tone =
    category === "new"
      ? "text-new"
      : category === "improved"
        ? "text-improved"
        : "text-fixed";
  return (
    <span
      className={cn(
        "text-meta inline-flex items-center gap-1.5 whitespace-nowrap",
        tone,
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {categoryLabel[category] || category}
    </span>
  );
}

export function StatusDot({ tone = "signal", pulse }) {
  const color =
    tone === "signal" ? "bg-signal" : tone === "live" ? "bg-new" : "bg-muted-foreground";
  return (
    <span className="relative inline-flex h-2 w-2">
      <span className={cn("h-2 w-2 rounded-full", color, pulse && "animate-signal-pulse")} />
    </span>
  );
}

export function SectionLabel({ index, children, className }) {
  return (
    <div className={cn("flex items-baseline gap-3", className)}>
      {index ? <span className="text-meta text-signal">{index}</span> : null}
      <span className="text-meta">{children}</span>
    </div>
  );
}

export function Panel({ children, className, flush }) {
  return (
    <div
      className={cn(
        "border border-border bg-surface",
        flush ? "" : "p-5 sm:p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function StepRail({ current }) {
  const steps = ["connect", "detect", "prepare", "review", "publish", "distribute"];
  const activeIndex = steps.indexOf(current);
  return (
    <ol className="flex flex-wrap items-center gap-x-3 gap-y-2">
      {steps.map((s, i) => (
        <li key={s} className="flex items-center gap-3">
          <span
            className={cn(
              "text-meta transition-colors",
              i === activeIndex
                ? "text-signal"
                : i < activeIndex
                  ? "text-foreground/70"
                  : "text-muted-foreground/50",
            )}
          >
            {String(i + 1).padStart(2, "0")} {s}
          </span>
          {i < steps.length - 1 ? (
            <span
              className={cn(
                "h-px w-5",
                i < activeIndex ? "bg-signal/60" : "bg-border-strong",
              )}
            />
          ) : null}
        </li>
      ))}
    </ol>
  );
}
