import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  GitPullRequest,
  Check,
  ShieldCheck,
  Sparkles,
  Sliders,
  ExternalLink,
  ChevronRight,
  Layers,
} from "lucide-react";
import { RevioWordmark, RevioMark } from "../components/brand/logo.jsx";
import {
  Meta,
  Code,
  CategoryTag,
  SectionLabel,
  StatusDot,
  TrustBadge,
} from "../components/revio/primitives.jsx";

function InteractiveProductDemo() {
  const [activeStep, setActiveStep] = useState(0); // 0: detect, 1: group, 2: review, 3: publish

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="border border-border/80 bg-surface shadow-2xl overflow-hidden rounded-[4px]">
      {/* DEMO TOP CONTROLS */}
      <div className="flex flex-wrap items-center justify-between border-b border-border bg-surface-sunken/90 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <StatusDot tone="live" pulse />
          <span className="text-xs font-medium text-foreground/90 font-mono">
            northwind/platform@main
          </span>
        </div>
        <div className="flex items-center gap-1">
          {[
            { id: 0, label: "01 Detect" },
            { id: 1, label: "02 Group" },
            { id: 2, label: "03 Review" },
            { id: 3, label: "04 Publish" },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveStep(s.id)}
              className={`px-3 py-1 text-xs font-mono transition-subtle cursor-pointer rounded-[2px] ${
                activeStep === s.id
                  ? "bg-signal text-signal-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-raised"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* DEMO STAGE CANVAS */}
      <div className="p-6 sm:p-8 min-h-[340px] flex flex-col justify-center">
        {/* STAGE 0: DETECT */}
        {activeStep === 0 && (
          <div className="space-y-4 animate-rise">
            <div className="flex items-center justify-between">
              <SectionLabel index="01">DETECTING MERGED ACTIVITY</SectionLabel>
              <Code>87 commits scanned</Code>
            </div>
            <h3 className="text-editorial text-2xl sm:text-3xl text-foreground">
              Revio listens for merged PRs and filters internal noise.
            </h3>
            <div className="space-y-2.5 pt-2">
              <div className="border-l-2 border-signal bg-surface-sunken p-3.5 text-xs rounded-r-[2px]">
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <GitPullRequest className="h-3.5 w-3.5 text-signal" />
                  <span>PR #1842 · feat: add granular workspace permissions</span>
                </div>
                <p className="mt-1 text-muted-foreground">8 commits by @mkrause, @ana.ferreira · High confidence</p>
              </div>
              <div className="border-l-2 border-signal bg-surface-sunken p-3.5 text-xs rounded-r-[2px]">
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <GitPullRequest className="h-3.5 w-3.5 text-signal" />
                  <span>PR #1851 · feat: permission matrix in settings</span>
                </div>
                <p className="mt-1 text-muted-foreground">3 commits by @ana.ferreira · High confidence</p>
              </div>
              <div className="border-l-2 border-border-strong bg-surface-sunken p-3 text-xs opacity-50 rounded-r-[2px]">
                <span className="text-muted-foreground font-mono">PR #1874 · chore: bump lockfile (Auto-filtered noise)</span>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 1: GROUP */}
        {activeStep === 1 && (
          <div className="space-y-4 animate-rise">
            <div className="flex items-center justify-between">
              <SectionLabel index="02">GROUPING RELATED WORK</SectionLabel>
              <Code>2 PRs combined</Code>
            </div>
            <h3 className="text-editorial text-2xl sm:text-3xl text-foreground">
              Related pull requests become one customer-facing update.
            </h3>
            <div className="border border-border bg-surface-sunken p-5 space-y-3 rounded-[3px]">
              <div className="flex items-center justify-between">
                <CategoryTag category="new" />
                <TrustBadge badge="High confidence" />
              </div>
              <h4 className="text-base font-semibold text-foreground">Team workspace access controls</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Administrators can now assign granular roles across shared workspaces.
              </p>
              <div className="pt-2 border-t border-border flex items-center gap-3 text-[0.7rem] font-mono text-muted-foreground">
                <span>Linked: PR #1842 & PR #1851</span>
                <span>•</span>
                <span>11 total commits</span>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 2: REVIEW */}
        {activeStep === 2 && (
          <div className="space-y-4 animate-rise">
            <div className="flex items-center justify-between">
              <SectionLabel index="03">2-MINUTE EDITORIAL REVIEW</SectionLabel>
              <Code>v2.14.0 draft</Code>
            </div>
            <h3 className="text-editorial text-2xl sm:text-3xl text-foreground">
              Your team polishes the release notes in the Studio.
            </h3>
            <div className="border border-signal/35 bg-surface-sunken p-5 space-y-3 rounded-[3px]">
              <input
                type="text"
                readOnly
                value="Workspace permissions and a faster release history"
                className="w-full bg-transparent font-medium text-foreground text-sm focus:outline-none"
              />
              <p className="text-xs text-muted-foreground leading-relaxed">
                This release focuses on control and speed. Administrators can now shape exactly who can do what inside a shared workspace.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-meta text-new font-semibold">✓ 6 updates ready for review</span>
                <span className="text-meta text-signal">Auto-saved</span>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 3: PUBLISH */}
        {activeStep === 3 && (
          <div className="space-y-4 animate-rise">
            <div className="flex items-center justify-between">
              <SectionLabel index="04">PUBLIC CHANGELOG PUBLICATION</SectionLabel>
              <Code>Published</Code>
            </div>
            <div className="border border-paper-border bg-paper p-5 text-paper-foreground rounded-[3px] shadow-sm">
              <div className="flex items-center justify-between border-b border-paper-border pb-2">
                <span className="text-xs font-semibold font-mono">v2.14.0 · Published</span>
                <span className="text-xs text-paper-muted">August 24, 2026</span>
              </div>
              <h4 className="text-editorial text-xl font-medium mt-3">
                Workspace permissions and a faster release history
              </h4>
              <p className="text-xs text-paper-muted mt-1.5 leading-relaxed">
                Administrators can now assign granular roles and permissions across shared workspaces.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-signal selection:text-signal-foreground">
      {/* GLOBAL HEADER */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between px-4 sm:px-6">
          <RevioWordmark subtitle="release intelligence" />
          <nav className="flex items-center gap-5">
            <Link
              to="/changelog"
              className="hidden text-[0.8125rem] text-muted-foreground transition-subtle hover:text-foreground sm:block"
            >
              Public Changelog
            </Link>
            <Link
              to="/dashboard"
              className="hidden text-[0.8125rem] text-muted-foreground transition-subtle hover:text-foreground sm:block"
            >
              Demo Workspace
            </Link>
            <Link
              to="/connect"
              className="bg-signal px-4 py-1.5 text-[0.8125rem] font-medium text-signal-foreground transition-subtle hover:opacity-90 cursor-pointer rounded-[2px]"
            >
              Connect Repository
            </Link>
          </nav>
        </div>
      </header>

      {/* SECTION 1 — THE HERO */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1280px] px-4 pt-16 pb-14 sm:px-6 sm:pt-24 sm:pb-20">
          <div className="flex items-center gap-2">
            <StatusDot tone="live" pulse />
            <Meta>Continuous Release Communication</Meta>
          </div>

          <h1 className="mt-6 max-w-4xl text-[2.5rem] leading-[1.02] font-medium tracking-[-0.035em] sm:text-6xl lg:text-[4.25rem]">
            Turn what you ship into updates
            <span className="text-editorial block text-muted-foreground">
              customers actually understand.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-[0.9375rem] leading-relaxed text-muted-foreground">
            Revio turns your team's merged pull requests and commits into a clear release draft—so you can review what matters in 2 minutes and publish without digging through Git history.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              to="/connect"
              className="inline-flex items-center gap-2 bg-signal px-6 py-3 text-sm font-medium text-signal-foreground transition-subtle hover:opacity-90 cursor-pointer rounded-[2px]"
            >
              <span>Connect Your Repository</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 border border-border-strong px-5 py-3 text-sm transition-subtle hover:bg-surface rounded-[2px]"
            >
              <span>See Workspace Demo</span>
            </Link>
          </div>

          <div className="mt-14 sm:mt-20">
            <InteractiveProductDemo />
          </div>
        </div>
      </section>

      {/* SECTION 2 — THE CONTRAST */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-24">
          <SectionLabel index="01">The Contrast</SectionLabel>
          <h2 className="mt-5 max-w-2xl text-3xl leading-tight font-medium tracking-[-0.03em] sm:text-4xl">
            What your team sees vs. what your customers need.
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {/* WHAT YOUR TEAM SEES */}
            <div className="border border-border bg-surface-sunken p-6 sm:p-8 space-y-4 rounded-[4px]">
              <Meta className="text-muted-foreground font-semibold">WHAT YOUR TEAM SEES</Meta>
              <h3 className="text-lg font-medium text-foreground">Dense Engineering Activity</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                47 commits, 8 pull requests, lockfile bumps, CI updates, stacked branches, and technical jargon.
              </p>
              <div className="space-y-2 pt-2 font-mono text-[0.75rem] text-muted-foreground opacity-80">
                <div className="border-l-2 border-border-strong pl-3">PR #1842 feat: add granular workspace permissions</div>
                <div className="border-l-2 border-border-strong pl-3">PR #1849 fix: resume webhook retry queue after failure</div>
                <div className="border-l-2 border-border-strong pl-3">PR #1874 chore: bump lockfile dependencies</div>
              </div>
            </div>

            {/* WHAT YOUR CUSTOMERS NEED */}
            <div className="border border-signal/50 bg-surface p-6 sm:p-8 space-y-4 rounded-[4px]">
              <Meta className="text-signal font-semibold">WHAT YOUR CUSTOMERS NEED</Meta>
              <h3 className="text-editorial text-2xl text-foreground">A Clear, Readable Product Update</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Categorized release highlights explaining what is new, what got faster, and what got fixed.
              </p>
              <div className="space-y-3 pt-2">
                <div>
                  <CategoryTag category="new" />
                  <p className="text-sm font-medium text-foreground mt-1">Team workspace access controls</p>
                </div>
                <div>
                  <CategoryTag category="improved" />
                  <p className="text-sm font-medium text-foreground mt-1">Release history loads up to 6× faster</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — THREE STEPS */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-24">
          <SectionLabel index="02">Three Steps</SectionLabel>
          <h2 className="mt-5 max-w-2xl text-3xl leading-tight font-medium tracking-[-0.03em] sm:text-4xl">
            From repository merge to customer update.
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                num: "01",
                title: "Connect",
                desc: "Revio monitors merged pull requests and tags with read-only metadata permissions.",
              },
              {
                num: "02",
                title: "Review",
                desc: "Revio groups changes and drafts a release note for your team to polish in 2 minutes.",
              },
              {
                num: "03",
                title: "Share",
                desc: "Publish directly to your public changelog feed and embedded in-app widget.",
              },
            ].map((step) => (
              <div key={step.num} className="border border-border bg-surface p-6 sm:p-8 space-y-3 rounded-[4px] transition-subtle hover:border-border-strong">
                <span className="text-meta text-signal font-mono font-bold">{step.num}</span>
                <h3 className="text-lg font-medium text-foreground">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — TRUST THROUGH TRANSPARENCY */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="space-y-4">
              <SectionLabel index="03">Grounded Evidence</SectionLabel>
              <h2 className="text-3xl sm:text-4xl leading-tight font-medium">
                Simple by default. Detailed when you need it.
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Customer updates remain clean and readable. When developers want to verify why an update was drafted, PR numbers, commit SHAs, and author metadata are available in one click.
              </p>
              <div className="pt-2">
                <Link
                  to="/releases/v2-14-0"
                  className="inline-flex items-center gap-2 text-xs text-signal hover:underline font-medium"
                >
                  <span>Open Release Studio</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="border border-border bg-surface p-6 space-y-4 rounded-[4px]">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-xs font-semibold text-foreground">Linked Evidence Traceability</span>
                <TrustBadge badge="High confidence" />
              </div>
              <div className="space-y-2 text-xs font-mono text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span className="text-foreground">PR #1842</span>
                  <span>8 commits</span>
                </div>
                <div>Branch: feat/workspace-rbac</div>
                <div>Contributors: @mkrause, @ana.ferreira</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — FINAL OUTCOME CTA */}
      <section>
        <div className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6 sm:py-28 text-center max-w-3xl">
          <h2 className="text-editorial text-4xl sm:text-5xl font-medium text-foreground">
            Your next release already has a story.
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            Let Revio turn your repository activity into release notes your customers actually understand.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/connect"
              className="inline-flex items-center gap-2 bg-signal px-8 py-3 text-sm font-medium text-signal-foreground hover:opacity-90 cursor-pointer rounded-[2px] transition-subtle"
            >
              <span>Connect Your Repository</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-8 text-xs text-muted-foreground">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between px-4 sm:px-6">
          <RevioWordmark />
          <Meta>© 2026 Revio Release Intelligence</Meta>
        </div>
      </footer>
    </div>
  );
}
