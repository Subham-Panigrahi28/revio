import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, GitPullRequest, Layers, Clock, Eye, Sparkles, Send } from "lucide-react";
import { AppShell } from "../components/revio/app-shell.jsx";
import {
  Meta,
  Code,
  CategoryTag,
  SectionLabel,
  StatusDot,
} from "../components/revio/primitives.jsx";
import { useWorkspace } from "../context/WorkspaceContext.jsx";
import { useReleases } from "../context/ReleaseContext.jsx";
import { detectedActivity } from "../services/mockData.js";

export function DashboardPage() {
  const { workspace } = useWorkspace();
  const { draft, publishedList } = useReleases();

  return (
    <AppShell>
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-10">
        {/* WORKSPACE OPERATIONAL HEADER */}
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2">
              <StatusDot tone="live" pulse />
              <Meta>Workspace Operational Home</Meta>
            </div>
            <h1 className="text-editorial mt-2 text-3xl sm:text-4xl text-foreground">
              {workspace.name}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/changelog"
              className="inline-flex items-center gap-2 border border-border px-3.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
            >
              <Eye className="h-3.5 w-3.5" /> Public Changelog
            </Link>
            <Link
              to={`/releases/${draft.id}`}
              className="inline-flex items-center gap-2 bg-signal px-4 py-1.5 text-xs font-medium text-signal-foreground transition-opacity hover:opacity-90"
            >
              Open Active Studio <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* MAIN DASHBOARD LAYOUT */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]">
          {/* LEFT COLUMN: ACTIVE DRAFT HERO & ACTIVITY STREAM */}
          <div className="space-y-8">
            {/* DOMINANT DRAFT RELEASE HERO PANEL */}
            <div className="border border-border bg-surface p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Code>{draft.version}</Code>
                  <Meta>Active Draft Release</Meta>
                </div>
                <div className="flex items-center gap-2">
                  <StatusDot tone="signal" pulse />
                  <span className="text-meta text-signal font-medium">Draft Ready</span>
                </div>
              </div>

              <h2 className="text-editorial mt-6 text-2xl sm:text-3xl text-foreground">
                {draft.title}
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground max-w-3xl">
                {draft.summary}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-6 border-y border-border py-4 text-xs text-muted-foreground">
                <div>
                  <span className="text-meta block">Changes Detected</span>
                  <span className="mt-1 text-sm font-semibold text-foreground">
                    {draft.changes.length} items
                  </span>
                </div>
                <div className="h-6 w-px bg-border" />
                <div>
                  <span className="text-meta block">Repository Target</span>
                  <span className="text-code mt-1 block text-foreground">
                    {workspace.repository.name}@{workspace.repository.branch}
                  </span>
                </div>
                <div className="h-6 w-px bg-border hidden sm:block" />
                <div className="hidden sm:block">
                  <span className="text-meta block">Last Activity</span>
                  <span className="mt-1 block text-foreground">2 hours ago</span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-signal" />
                  <span>AI grouped 87 commits into {draft.changes.length} customer update lines</span>
                </div>
                <Link
                  to={`/releases/${draft.id}`}
                  className="inline-flex items-center gap-2 bg-signal px-5 py-2 text-sm font-medium text-signal-foreground transition-opacity hover:opacity-90"
                >
                  Review Release Notes <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* CHRONOLOGICAL DETECTED ACTIVITY STREAM */}
            <div className="border border-border bg-surface p-6 sm:p-8">
              <SectionLabel index="01">Detected repository stream</SectionLabel>
              <h3 className="mt-4 text-lg font-medium text-foreground">
                Merged Pull Requests & Commits
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Filtered engineering activity continuously grouped into active draft release candidates.
              </p>

              <ul className="mt-6 space-y-3">
                {detectedActivity.map((act) => (
                  <li
                    key={act.pr}
                    className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3 text-xs last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <GitPullRequest className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <div>
                        <span className="text-code font-semibold text-foreground">PR #{act.pr}</span>
                        <span className="ml-2 text-muted-foreground">{act.title}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Meta>{act.commits} commits</Meta>
                      <span
                        className={`text-meta text-[0.65rem] px-2 py-0.5 border ${
                          act.state === "merged"
                            ? "border-new/30 text-new"
                            : "border-border-strong text-muted-foreground"
                        }`}
                      >
                        {act.state}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN: PUBLISHED HISTORY & DISTRIBUTION QUICK ACTIONS */}
          <div className="space-y-8">
            {/* RESTRAINED PUBLISHED HISTORY */}
            <div className="border border-border bg-surface p-6">
              <SectionLabel index="02">Release timeline</SectionLabel>
              <h3 className="mt-4 text-lg font-medium text-foreground">Published Releases</h3>

              <div className="mt-6 space-y-4">
                {publishedList.map((rel) => (
                  <div
                    key={rel.id}
                    className="border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between">
                      <Code>{rel.version}</Code>
                      <Meta>{rel.date}</Meta>
                    </div>
                    <h4 className="text-editorial mt-2 text-lg text-foreground">{rel.title}</h4>
                    <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">
                      {rel.summary}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <Meta>{rel.changes.length} changes published</Meta>
                      <Link
                        to="/changelog"
                        className="text-xs text-signal hover:underline"
                      >
                        View public →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* QUICK DISTRIBUTION & SETTINGS ACTIONS */}
            <div className="border border-border bg-surface p-6">
              <Meta>Channels & Controls</Meta>
              <div className="mt-4 space-y-2.5">
                <Link
                  to="/distribution"
                  className="flex items-center justify-between border border-border p-3 text-xs transition-colors hover:bg-surface-raised"
                >
                  <div className="flex items-center gap-2">
                    <Send className="h-3.5 w-3.5 text-signal" />
                    <span>Distribution Channels</span>
                  </div>
                  <Meta>Configured</Meta>
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center justify-between border border-border p-3 text-xs transition-colors hover:bg-surface-raised"
                >
                  <div className="flex items-center gap-2">
                    <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Workspace Settings</span>
                  </div>
                  <Meta>Manage</Meta>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
