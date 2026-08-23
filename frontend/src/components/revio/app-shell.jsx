import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Layers,
  GitBranch,
  Settings,
  ExternalLink,
  Menu,
  X,
  Send,
  Activity,
  Archive,
} from "lucide-react";
import { RevioWordmark } from "../brand/logo.jsx";
import { StatusDot, Meta, Code } from "./primitives.jsx";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";

export function AppShell({ children }) {
  const { workspace } = useWorkspace();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: "Overview", path: "/dashboard", icon: Layers },
    { label: "Activity", path: "/activity", icon: Activity },
    { label: "Releases", path: "/releases", icon: Archive },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-signal selection:text-signal-foreground">
      {/* GLOBAL HEADER BAR */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-4 sm:px-6">
          {/* BRAND LOGO & WORKSPACE SWITCHER */}
          <div className="flex items-center gap-7">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal"
            >
              <RevioWordmark subtitle="workspace" />
            </Link>

            {/* DESKTOP 3-HUB PRIMARY NAVIGATION */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive =
                  location.pathname === item.path ||
                  (item.path === "/releases" && location.pathname.startsWith("/releases"));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative px-3.5 py-1.5 text-xs transition-subtle rounded-[2px] ${
                      isActive
                        ? "text-foreground font-semibold bg-surface-raised/80 shadow-xs"
                        : "text-muted-foreground hover:bg-surface/70 hover:text-foreground"
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-3.5 right-3.5 h-[1.5px] bg-signal" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* RIGHT METADATA & CONTEXTUAL ACTIONS */}
          <div className="flex items-center gap-3">
            {/* CONNECTED REPO BADGE */}
            <div className="hidden sm:flex items-center gap-2 border border-border/80 bg-surface px-2.5 py-1 text-xs rounded-[2px]">
              <GitBranch className="h-3 w-3 text-muted-foreground" />
              <Code className="border-0 bg-transparent p-0 text-[0.725rem]">
                {workspace.repository.name}@{workspace.repository.branch}
              </Code>
              <StatusDot tone="live" pulse />
            </div>

            {/* PUBLIC CHANGELOG LINK */}
            <a
              href={`/c/${workspace.slug}`}
              target="_blank"
              rel="noreferrer"
              className="hidden lg:inline-flex items-center gap-1.5 border border-border px-3 py-1.5 text-xs text-muted-foreground transition-subtle hover:bg-surface hover:text-foreground rounded-[2px]"
            >
              <span>View Changelog</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>

            {/* SETTINGS ICON */}
            <Link
              to="/settings"
              className={`p-2 text-muted-foreground transition-subtle hover:text-foreground rounded-[2px] ${
                location.pathname === "/settings" ? "text-signal bg-surface-raised" : "hover:bg-surface"
              }`}
              title="Workspace Settings"
              aria-label="Workspace Settings"
            >
              <Settings className="h-4 w-4" />
            </Link>

            {/* MOBILE MENU TOGGLE (MIN 44PX HIT TARGET) */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex h-10 w-10 items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer rounded-[2px]"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* MOBILE NAVIGATION DRAWER */}
        {mobileOpen && (
          <div className="md:hidden border-b border-border bg-surface p-4 space-y-3 animate-rise">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex min-h-[44px] items-center gap-3 px-3 text-sm font-medium transition-subtle rounded-[2px] ${
                    location.pathname === item.path
                      ? "bg-surface-raised text-signal font-semibold"
                      : "text-muted-foreground hover:bg-surface-raised hover:text-foreground"
                  }`}
                >
                  <span>{item.label}</span>
                </Link>
              ))}
              <Link
                to="/distribution"
                onClick={() => setMobileOpen(false)}
                className="flex min-h-[44px] items-center gap-3 px-3 text-sm text-muted-foreground hover:bg-surface-raised hover:text-foreground transition-subtle rounded-[2px]"
              >
                <span>Channels & Share</span>
              </Link>
              <Link
                to="/settings"
                onClick={() => setMobileOpen(false)}
                className="flex min-h-[44px] items-center gap-3 px-3 text-sm text-muted-foreground hover:bg-surface-raised hover:text-foreground transition-subtle rounded-[2px]"
              >
                <span>Settings</span>
              </Link>
              <a
                href={`/c/${workspace.slug}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => setMobileOpen(false)}
                className="flex min-h-[44px] items-center justify-between px-3 text-sm text-muted-foreground hover:bg-surface-raised hover:text-foreground transition-subtle rounded-[2px]"
              >
                <span>Public Changelog</span>
                <ExternalLink className="h-3.5 w-3.5 opacity-60" />
              </a>
            </nav>
            <div className="border-t border-border pt-3 flex items-center justify-between text-xs px-1">
              <span className="font-mono text-muted-foreground">{workspace.repository.name}</span>
              <StatusDot tone="live" pulse />
            </div>
          </div>
        )}
      </header>

      {/* MAIN WORKSPACE CANVAS */}
      <main className="flex-1">{children}</main>

      {/* QUIET SYSTEM FOOTER */}
      <footer className="border-t border-border/70 py-4 text-xs text-muted-foreground/80">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 sm:px-6">
          <Meta className="text-muted-foreground/60">© 2026 Revio Release Intelligence</Meta>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-new inline-block" />
            <span className="text-[0.7rem] font-mono text-muted-foreground/60">{workspace.repository.branch}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
