import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Github, Lock, CheckCircle2 } from "lucide-react";
import { RevioWordmark } from "../components/brand/logo.jsx";
import { Meta, StatusDot } from "../components/revio/primitives.jsx";

export function ConnectPage() {
  const [connecting, setConnecting] = useState(false);
  const navigate = useNavigate();

  const handleConnect = () => {
    setConnecting(true);
    setTimeout(() => {
      navigate("/onboarding");
    }, 1400);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-signal selection:text-signal-foreground">
      <header className="border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between px-4 sm:px-6">
          <Link to="/">
            <RevioWordmark subtitle="authorization" />
          </Link>
          <div className="flex items-center gap-2">
            <StatusDot tone="live" pulse />
            <Meta>GitHub Gateway</Meta>
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md border border-border bg-surface p-6 sm:p-8">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center border border-border-strong bg-surface-raised text-foreground">
              <Github className="h-4 w-4" />
            </span>
            <Meta className="text-signal">OAuth Authorization</Meta>
          </div>

          <h1 className="text-editorial mt-5 text-3xl sm:text-4xl text-foreground">
            Connect your engineering activity to customer updates.
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Grant Revio read-only metadata access to your repository merged pull requests, tags,
            and commits. Nothing is ever written back to your code.
          </p>

          <div className="my-6 space-y-2.5 border-y border-border py-4">
            <div className="flex items-center gap-2.5 text-[0.8125rem] text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-new" />
              <span>Read-only metadata access to commits & PRs</span>
            </div>
            <div className="flex items-center gap-2.5 text-[0.8125rem] text-muted-foreground">
              <Lock className="h-4 w-4 text-signal" />
              <span>SOC2 compliant token encryption</span>
            </div>
            <div className="flex items-center gap-2.5 text-[0.8125rem] text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-improved" />
              <span>No write access requested to source code</span>
            </div>
          </div>

          <button
            onClick={handleConnect}
            disabled={connecting}
            className="flex w-full items-center justify-center gap-2.5 bg-signal px-5 py-3 text-sm font-medium text-signal-foreground transition-opacity hover:opacity-90 disabled:opacity-75 cursor-pointer"
          >
            {connecting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>Connecting GitHub Account...</span>
              </>
            ) : (
              <>
                <Github className="h-4 w-4" />
                <span>Continue with GitHub</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <p className="mt-4 text-center text-meta text-muted-foreground">
            By continuing, you authorize Revio to inspect public and private metadata.
          </p>
        </div>
      </main>

      <footer className="border-t border-border py-4 text-center">
        <Meta>© 2026 Revio Release Intelligence Platform</Meta>
      </footer>
    </div>
  );
}
