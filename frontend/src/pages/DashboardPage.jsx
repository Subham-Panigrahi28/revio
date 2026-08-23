import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Activity, Archive, Eye, Send, CheckCircle2, Sparkles, RefreshCw } from "lucide-react";
import { AppShell } from "../components/revio/app-shell.jsx";
import { Meta, Code, CategoryTag, SectionLabel, StatusDot } from "../components/revio/primitives.jsx";
import { useWorkspace } from "../context/WorkspaceContext.jsx";
import { useReleases } from "../context/ReleaseContext.jsx";

export function DashboardPage() {
  const { workspace } = useWorkspace();
  const { draft, unassignedList, publishedList } = useReleases();

  const [workspaceState, setWorkspaceState] = useState("A"); // "A" | "B" | "C" | "D"

  return (
    <AppShell>
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-10">
        {/* TOP BAR / STATE SELECTOR FOR AUDIT DEMO */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2">
              <StatusDot tone="live" pulse />
              <Meta className="text-signal">Workspace Overview</Meta>
            </div>
            <h1 className="text-editorial mt-2 text-3xl sm:text-4xl text-foreground">
              {workspace.name}
            </h1>
          </div>

          {/* STATE DEMO SWITCHER */}
          <div className="flex items-center gap-1 border border-border bg-surface p-1 text-xs rounded-[3px]">
            <span className="text-meta px-2 text-muted-foreground/70">Demo State:</span>
            {[
              { id: "A", label: "Release Ready" },
              { id: "B", label: "New Activity" },
              { id: "C", label: "Up to Date" },
              { id: "D", label: "Empty" },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setWorkspaceState(st.id)}
                className={`px-2.5 py-1 font-mono cursor-pointer transition-subtle rounded-[2px] ${
                  workspaceState === st.id
                    ? "bg-signal text-signal-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-raised"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* DYNAMIC STATE-DRIVEN HERO BANNER */}
        <div className="mt-8 space-y-8">
          {/* STATE A: RELEASE READY FOR REVIEW */}
          {workspaceState === "A" && (
            <div className="border border-signal/50 bg-surface p-6 sm:p-8 space-y-4 rounded-[4px] shadow-sm animate-rise">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Code>{draft.version}</Code>
                  <StatusDot tone="signal" pulse />
                  <span className="text-meta text-signal font-semibold">Release Ready for Review</span>
                </div>
                <Meta>Updated 4m ago</Meta>
              </div>

              <h2 className="text-editorial text-3xl sm:text-4xl text-foreground">
                Your next release is ready for review.
              </h2>
              <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
                Revio grouped 87 commits across 7 pull requests into {draft.changes.length} customer-facing update lines for {draft.version}.
              </p>

              <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-signal" />
                  <span>High confidence change grouping complete</span>
                </div>
                <Link
                  to={`/releases/${draft.id}`}
                  className="inline-flex items-center gap-2 bg-signal px-6 py-2.5 text-sm font-medium text-signal-foreground hover:opacity-90 rounded-[2px] transition-subtle"
                >
                  <span>Continue Release {draft.version}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}

          {/* STATE B: NEW ACTIVITY REQUIRES ATTENTION */}
          {workspaceState === "B" && (
            <div className="border border-border bg-surface p-6 sm:p-8 space-y-4 rounded-[4px] animate-rise">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity className="h-4 w-4 text-signal" />
                  <span className="text-meta text-signal font-semibold">New Activity Detected</span>
                </div>
                <Meta>{unassignedList.length} unassigned PRs</Meta>
              </div>

              <h2 className="text-editorial text-3xl sm:text-4xl text-foreground">
                {unassignedList.length} new changes need your attention.
              </h2>
              <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
                Pull requests #1876, #1881, and #1884 were merged into main since your last release check.
              </p>

              <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-border">
                <Meta>3 PRs waiting for assignment or noise filtering</Meta>
                <Link
                  to="/activity"
                  className="inline-flex items-center gap-2 bg-signal px-6 py-2.5 text-sm font-medium text-signal-foreground hover:opacity-90 rounded-[2px] transition-subtle"
                >
                  <span>Review {unassignedList.length} Changes</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}

          {/* STATE C: UP TO DATE */}
          {workspaceState === "C" && (
            <div className="border border-border bg-surface p-6 sm:p-8 space-y-4 rounded-[4px] animate-rise">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-new" />
                  <span className="text-meta text-new font-semibold">Workspace Up to Date</span>
                </div>
                <Meta>Latest tag: v2.13.0</Meta>
              </div>

              <h2 className="text-editorial text-3xl sm:text-4xl text-foreground">
                No new customer-facing changes detected.
              </h2>
              <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
                All recent repository activity has been categorized, published, or auto-filtered as internal noise.
              </p>

              <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-border">
                <Link
                  to="/activity"
                  className="text-xs text-muted-foreground hover:text-foreground transition-subtle"
                >
                  View Filtered Activity →
                </Link>
                <a
                  href={`/c/${workspace.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs text-foreground hover:bg-surface-raised rounded-[2px] transition-subtle"
                >
                  <span>View Public Changelog</span>
                  <Eye className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* STATE D: EMPTY WORKSPACE */}
          {workspaceState === "D" && (
            <div className="border border-border bg-surface p-6 sm:p-8 space-y-4 rounded-[4px] animate-rise">
              <SectionLabel index="01">Monitoring Active</SectionLabel>
              <h2 className="text-editorial text-3xl sm:text-4xl text-foreground">
                Revio is watching <Code>{workspace.repository.name}</Code>
              </h2>
              <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
                Merge pull requests into main or push release tags to trigger automatic change classification and note generation.
              </p>

              <div className="pt-4 flex items-center justify-end">
                <Link
                  to="/onboarding"
                  className="inline-flex items-center gap-2 bg-signal px-5 py-2 text-xs font-medium text-signal-foreground hover:opacity-90 rounded-[2px] transition-subtle"
                >
                  <span>Re-run Activity Scan</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* SUPPORTING ACTIVITY STREAM & QUICK LINKS */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="border border-border bg-surface p-6 space-y-4 rounded-[4px]">
              <SectionLabel index="01">Recent Pipeline Merges</SectionLabel>
              <div className="space-y-3 text-xs">
                {unassignedList.slice(0, 3).map((item) => (
                  <div key={item.pr} className="flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0">
                    <span className="font-semibold text-foreground">PR #{item.pr} · {item.title}</span>
                    <Meta>{item.mergedAt}</Meta>
                  </div>
                ))}
              </div>
              <Link to="/activity" className="text-xs text-signal hover:underline inline-block transition-subtle">
                View all activity →
              </Link>
            </div>

            <div className="border border-border bg-surface p-6 space-y-4 rounded-[4px]">
              <SectionLabel index="02">Public Publication Surface</SectionLabel>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your changelog is published on warm paper surface with search, RSS, and embedded in-app widget CDN.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <a
                  href={`/c/${workspace.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 text-xs text-foreground hover:bg-surface-raised rounded-[2px] transition-subtle"
                >
                  <span>Public Feed</span>
                  <Eye className="h-3.5 w-3.5" />
                </a>
                <Link
                  to="/distribution"
                  className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground rounded-[2px] transition-subtle"
                >
                  <Send className="h-3.5 w-3.5 text-signal" />
                  <span>Channels</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
