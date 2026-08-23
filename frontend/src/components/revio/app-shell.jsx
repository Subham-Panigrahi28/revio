import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, RefreshCw } from "lucide-react";
import { RevioWordmark } from "../brand/logo.jsx";
import { repository } from "../../services/mockData.js";
import { StatusDot } from "./primitives.jsx";
import { cn } from "../../utils/cn.js";

const nav = [
  { to: "/releases", label: "Releases" },
  { to: "/changelog", label: "Public Changelog" },
  { to: "/distribution", label: "Distribution" },
  { to: "/settings", label: "Settings" },
];

export function AppShell({ children }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-6 px-4 sm:px-6">
          <Link to="/" className="shrink-0">
            <RevioWordmark />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((n) => {
              const active = pathname.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={cn(
                    "relative px-3 py-4 text-[0.8125rem] transition-colors",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {n.label}
                  {active ? (
                    <span className="absolute inset-x-3 bottom-0 h-px bg-signal" />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-4">
            <div className="hidden items-center gap-2 lg:flex">
              <StatusDot tone="live" pulse />
              <span className="text-code text-muted-foreground">{repository.name}</span>
              <span className="text-code text-muted-foreground/60">
                @{repository.branch}
              </span>
              <span className="text-meta flex items-center gap-1">
                <RefreshCw className="h-3 w-3" /> {repository.lastSync}
              </span>
            </div>
            <div className="hidden h-6 w-px bg-border lg:block" />
            <div className="hidden h-7 w-7 items-center justify-center border border-border-strong bg-surface-raised text-[0.6875rem] font-medium sm:flex">
              MK
            </div>
            <button
              className="-mr-1 p-2 text-muted-foreground md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open ? (
          <nav className="border-t border-border bg-surface md:hidden">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b border-border px-4 py-3.5 text-sm last:border-0"
              >
                {n.label}
                {pathname.startsWith(n.to) ? <StatusDot /> : null}
              </Link>
            ))}
            <div className="flex items-center gap-2 px-4 py-3">
              <StatusDot tone="live" pulse />
              <span className="text-code text-muted-foreground">
                {repository.name}@{repository.branch}
              </span>
            </div>
          </nav>
        ) : null}
      </header>

      <main>{children}</main>
    </div>
  );
}
