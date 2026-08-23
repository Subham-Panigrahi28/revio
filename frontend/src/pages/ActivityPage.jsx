import React, { useState } from "react";
import { Activity, GitPullRequest, Check, Plus, Eye, Filter, ArrowRight } from "lucide-react";
import { AppShell } from "../components/revio/app-shell.jsx";
import { Meta, Code, TrustBadge, SectionLabel } from "../components/revio/primitives.jsx";
import { useReleases } from "../context/ReleaseContext.jsx";
import { useWorkspace } from "../context/WorkspaceContext.jsx";

export function ActivityPage() {
  const {
    draft,
    unassignedList,
    ignoredList,
    toggleActivityIgnore,
    includeActivityInDraft,
  } = useReleases();
  const { workspace } = useWorkspace();

  const [activeTab, setActiveTab] = useState("unassigned"); // "unassigned" | "included" | "ignored"

  return (
    <AppShell>
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-10">
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-signal" />
              <Meta className="text-signal">Repository Decision Pipeline</Meta>
            </div>
            <h1 className="text-editorial mt-2 text-3xl sm:text-4xl text-foreground">
              Repository Activity Stream
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Inspecting merged pull requests from <Code>{workspace.repository.name}@{workspace.repository.branch}</Code>.
            </p>
          </div>
        </div>

        {/* TABBED SEGMENTED CONTROLS */}
        <div className="mt-8 flex flex-wrap items-center border-b border-border text-xs font-medium gap-1">
          <button
            onClick={() => setActiveTab("unassigned")}
            className={`flex items-center gap-2 px-4 py-2.5 transition-subtle cursor-pointer rounded-t-[2px] ${
              activeTab === "unassigned"
                ? "border-b-2 border-signal text-foreground font-semibold bg-surface-raised/50"
                : "text-muted-foreground hover:text-foreground hover:bg-surface/50"
            }`}
          >
            <span>Needs Review</span>
            <span className="rounded-full bg-signal/15 px-2 py-0.5 text-[0.65rem] text-signal font-mono">
              {unassignedList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("included")}
            className={`flex items-center gap-2 px-4 py-2.5 transition-subtle cursor-pointer rounded-t-[2px] ${
              activeTab === "included"
                ? "border-b-2 border-signal text-foreground font-semibold bg-surface-raised/50"
                : "text-muted-foreground hover:text-foreground hover:bg-surface/50"
            }`}
          >
            <span>Included in {draft.version}</span>
            <span className="rounded-full bg-new/15 px-2 py-0.5 text-[0.65rem] text-new font-mono">
              {draft.changes.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("ignored")}
            className={`flex items-center gap-2 px-4 py-2.5 transition-subtle cursor-pointer rounded-t-[2px] ${
              activeTab === "ignored"
                ? "border-b-2 border-signal text-foreground font-semibold bg-surface-raised/50"
                : "text-muted-foreground hover:text-foreground hover:bg-surface/50"
            }`}
          >
            <span>Filtered Noise</span>
            <span className="rounded-full bg-surface-raised px-2 py-0.5 text-[0.65rem] text-muted-foreground font-mono">
              {ignoredList.length}
            </span>
          </button>
        </div>

        {/* TAB CONTENT AREA */}
        <div className="mt-6">
          {/* TAB 1: NEEDS REVIEW */}
          {activeTab === "unassigned" && (
            <div className="space-y-4 animate-rise">
              {unassignedList.map((item) => (
                <div
                  key={item.pr}
                  className="flex flex-wrap items-center justify-between gap-4 border border-border bg-surface p-5 transition-subtle hover:border-border-strong rounded-[4px]"
                >
                  <div className="flex items-start gap-3.5">
                    <GitPullRequest className="h-4 w-4 text-signal mt-1 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          PR #{item.pr} · {item.title}
                        </span>
                        <TrustBadge badge={item.trustBadge} />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.reason} · <Code>{item.branch}</Code> · @{item.author} ({item.commits} commits)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => toggleActivityIgnore(item.pr)}
                      className="border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-surface-raised hover:text-foreground cursor-pointer transition-subtle rounded-[2px]"
                    >
                      Ignore Noise
                    </button>
                    <button
                      onClick={() => includeActivityInDraft(item.pr)}
                      className="inline-flex items-center gap-1.5 bg-signal px-4 py-1.5 text-xs font-medium text-signal-foreground hover:opacity-90 cursor-pointer transition-subtle rounded-[2px]"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Include in Draft</span>
                    </button>
                  </div>
                </div>
              ))}

              {unassignedList.length === 0 && (
                <div className="border border-border bg-surface p-8 text-center text-xs text-muted-foreground rounded-[4px]">
                  No unassigned pull requests currently awaiting review. All detected changes have been grouped into active releases or noise filters.
                </div>
              )}
            </div>
          )}

          {/* TAB 2: INCLUDED IN RELEASE */}
          {activeTab === "included" && (
            <div className="space-y-4 animate-rise">
              {draft.changes.map((item) => (
                <div
                  key={item.id}
                  className="border border-border bg-surface p-5 space-y-3 rounded-[4px]"
                >
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-xs font-semibold text-foreground">{item.title}</span>
                    <Code>{draft.version}</Code>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.body}</p>
                  {item.evidence && item.evidence.length > 0 && (
                    <div className="flex items-center gap-3 text-[0.7rem] font-mono text-muted-foreground">
                      <span>Linked PR: #{item.evidence[0].pr}</span>
                      <span>Branch: {item.evidence[0].branch}</span>
                      <span>Author: @{item.evidence[0].contributors?.[0]}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: FILTERED NOISE */}
          {activeTab === "ignored" && (
            <div className="space-y-4 animate-rise">
              {ignoredList.map((item) => (
                <div
                  key={item.pr}
                  className="flex flex-wrap items-center justify-between gap-4 border border-border bg-surface-sunken p-5 opacity-75 hover:opacity-100 transition-subtle rounded-[4px]"
                >
                  <div className="flex items-start gap-3.5">
                    <Filter className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          PR #{item.pr} · {item.title}
                        </span>
                        <TrustBadge badge={item.trustBadge} />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Why ignored: {item.reason} · @{item.author}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleActivityIgnore(item.pr)}
                    className="border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-surface-raised hover:text-foreground cursor-pointer transition-subtle rounded-[2px]"
                  >
                    Re-include in Activity
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
