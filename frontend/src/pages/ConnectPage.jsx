import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Github, Lock, CheckCircle2, XCircle } from "lucide-react";
import { RevioWordmark } from "../components/brand/logo.jsx";
import { Meta, StatusDot } from "../components/revio/primitives.jsx";

export function ConnectPage() {
  const [connecting, setConnecting] = useState(false);
  const navigate = useNavigate();

  const handleConnect = () => {
    setConnecting(true);
    setTimeout(() => {
      navigate("/onboarding");
    }, 1000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-signal selection:text-signal-foreground">
      <header className="border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between px-4 sm:px-6">
          <Link to="/" className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal">
            <RevioWordmark subtitle="authorization" />
          </Link>
          <div className="flex items-center gap-2">
            <StatusDot tone="live" pulse />
            <Meta className="text-signal">GitHub Gateway</Meta>
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md border border-border bg-surface p-6 sm:p-8 space-y-6 rounded-[4px] shadow-xl animate-rise">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center border border-border-strong bg-surface-raised text-foreground rounded-[2px]">
              <Github className="h-4 w-4" />
            </span>
            <Meta className="text-signal font-semibold">Read-Only Permission Scope</Meta>
          </div>

          <div>
            <h1 className="text-editorial text-3xl sm:text-4xl text-foreground">
              Connect your repository.
            </h1>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Revio inspects merged pull requests, tags, and commits to prepare clear customer updates.
            </p>
          </div>

          {/* EXPLICIT PERMISSION SCOPE BREAKDOWN CARD */}
          <div className="space-y-3.5 border-y border-border py-4 text-xs">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-new shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-foreground block">Read-only metadata access</span>
                <p className="text-[0.75rem] text-muted-foreground">Merged PR titles, commit messages, and tag timestamps.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <XCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-foreground block">Zero write permissions</span>
                <p className="text-[0.75rem] text-muted-foreground">Revio will never modify, push, or commit code to your repository.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Lock className="h-4 w-4 text-signal shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-foreground block">SOC2 encrypted storage</span>
                <p className="text-[0.75rem] text-muted-foreground">Tokens are encrypted at rest with AES-256 GCM.</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleConnect}
            disabled={connecting}
            className="flex w-full items-center justify-center gap-2.5 bg-signal px-5 py-3 text-sm font-medium text-signal-foreground transition-subtle hover:opacity-90 disabled:opacity-75 cursor-pointer rounded-[2px]"
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

          <p className="text-center text-meta text-muted-foreground text-[0.7rem]">
            By continuing, you authorize Revio to inspect public and private metadata.
          </p>
        </div>
      </main>

      <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        <Meta>© 2026 Revio Release Intelligence</Meta>
      </footer>
    </div>
  );
}
