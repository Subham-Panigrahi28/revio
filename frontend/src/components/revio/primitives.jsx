import React from "react";
import { cn } from "../../utils/cn.js";
import { categoryColor, categoryLabel } from "../../services/mockData.js";
import { ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";

export function Meta({ children, className }) {
  return (
    <span className={cn("text-meta text-muted-foreground", className)}>
      {children}
    </span>
  );
}

export function Code({ children, className }) {
  return (
    <code className={cn("text-code bg-surface-sunken/80 border border-border px-1.5 py-0.5 text-xs text-foreground font-mono rounded-[2px]", className)}>
      {children}
    </code>
  );
}

export function CategoryTag({ category, className }) {
  const color = categoryColor(category);
  const label = categoryLabel[category] || category;
  return (
    <span className={cn("text-meta inline-flex items-center font-semibold uppercase tracking-wider text-[0.6875rem]", color, className)}>
      {label}
    </span>
  );
}

export function StatusDot({ tone = "signal", pulse = false, className }) {
  const toneClass =
    tone === "live"
      ? "bg-new"
      : tone === "improved"
        ? "bg-improved"
        : tone === "fixed"
          ? "bg-fixed"
          : "bg-signal";

  return (
    <span className={cn("relative flex h-2 w-2 items-center justify-center", className)}>
      {pulse && (
        <span
          className={cn(
            "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
            toneClass
          )}
        />
      )}
      <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", toneClass)} />
    </span>
  );
}

export function TrustBadge({ badge, className }) {
  const isHigh = badge === "High confidence";
  const isReview = badge === "Needs review";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[0.6875rem] font-medium px-2 py-0.5 border font-mono rounded-[2px] transition-subtle",
        isHigh
          ? "border-new/25 bg-new/8 text-new"
          : isReview
            ? "border-signal/25 bg-signal/8 text-signal"
            : "border-border-strong bg-surface-sunken text-muted-foreground",
        className
      )}
    >
      {isHigh ? (
        <CheckCircle2 className="h-3 w-3 text-new" />
      ) : isReview ? (
        <AlertCircle className="h-3 w-3 text-signal" />
      ) : (
        <ShieldCheck className="h-3 w-3 text-muted-foreground" />
      )}
      <span>{badge}</span>
    </span>
  );
}

export function SectionLabel({ index, children, className }) {
  return (
    <div className={cn("flex items-center gap-2 text-meta text-muted-foreground/90 uppercase tracking-widest text-[0.6875rem] font-medium", className)}>
      {index && <span className="text-signal font-bold">[{index}]</span>}
      <span>{children}</span>
    </div>
  );
}

export function Panel({ children, className }) {
  return (
    <div className={cn("border border-border bg-surface p-6 sm:p-8 transition-subtle", className)}>
      {children}
    </div>
  );
}

export function StepRail({ currentStep, totalSteps = 3 }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
        <span
          key={s}
          className={cn(
            "h-1 w-6 transition-subtle rounded-full",
            s <= currentStep ? "bg-signal" : "bg-border-strong"
          )}
        />
      ))}
    </div>
  );
}
