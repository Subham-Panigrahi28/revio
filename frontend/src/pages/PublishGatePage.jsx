import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, Lock, ShieldCheck, Globe, Eye } from "lucide-react";
import { AppShell } from "../components/revio/app-shell.jsx";
import { Meta, Code, CategoryTag, SectionLabel } from "../components/revio/primitives.jsx";
import { useReleases } from "../context/ReleaseContext.jsx";
import { useWorkspace } from "../context/WorkspaceContext.jsx";

export function PublishGatePage() {
  const { draft, publishDraftRelease } = useReleases();
  const { workspace } = useWorkspace();
  const navigate = useNavigate();
  const [publishing, setPublishing] = useState(false);

  const handlePublish = () => {
    setPublishing(true);
    setTimeout(() => {
      publishDraftRelease();
      navigate(`/c/${workspace.slug}`);
    }, 1200);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-10">
        {/* PUBLICATION HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-signal" />
              <Meta className="text-signal">Deliberate Publication Checkpoint</Meta>
            </div>
            <h1 className="text-editorial mt-2 text-3xl sm:text-4xl text-foreground">
              Publication Gate — {draft.version}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/releases/${draft.id}`}
              className="border border-border px-4 py-2 text-xs text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
            >
              ← Back to Editing
            </Link>
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="inline-flex items-center gap-2 bg-signal px-6 py-2 text-xs font-medium text-signal-foreground transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
            >
              {publishing ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Publishing Release...</span>
                </>
              ) : (
                <>
                  <span>Publish Release Now</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* SIDE-BY-SIDE COMPARISON: PUBLIC VS PRIVATE */}
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* PUBLIC COLUMN */}
          <div className="border border-paper-border bg-paper p-6 sm:p-8 text-paper-foreground">
            <div className="flex items-center justify-between border-b border-paper-border pb-3">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-paper-muted" />
                <span className="text-meta text-paper-muted">PUBLIC CUSTOMER VIEW</span>
              </div>
              <Code className="bg-paper-border/20 text-paper-foreground font-semibold">
                Visible to Customers
              </Code>
            </div>

            <h2 className="text-editorial mt-6 text-2xl sm:text-3xl">
              {draft.title}
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-paper-muted border-b border-paper-border pb-6">
              {draft.summary}
            </p>

            <div className="mt-6 space-y-5">
              {draft.changes.map((item) => (
                <div key={item.id} className="space-y-1.5">
                  <CategoryTag category={item.category} />
                  <h4 className="text-base font-medium">{item.title}</h4>
                  <p className="text-xs leading-relaxed text-paper-muted">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* PRIVATE COLUMN */}
          <div className="border border-border bg-surface p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-signal" />
                <Meta className="text-signal">INTERNAL TEAM EVIDENCE</Meta>
              </div>
              <Code>Stays Private</Code>
            </div>

            <h3 className="mt-6 text-lg font-medium text-foreground">
              Internal Notes & PR Evidence
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Technical evidence linked for audit verification. None of this data is rendered on your public changelog.
            </p>

            <div className="mt-6 space-y-4">
              {draft.changes.map((item) => (
                <div key={item.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                  <span className="text-xs font-semibold text-foreground">{item.title}</span>
                  {item.internalNote && (
                    <p className="mt-1 text-xs text-signal font-mono">
                      Note: {item.internalNote}
                    </p>
                  )}
                  {item.evidence && item.evidence.length > 0 && (
                    <div className="mt-2 space-y-1 text-xs font-mono text-muted-foreground">
                      {item.evidence.map((ev) => (
                        <div key={ev.pr}>
                          PR #{ev.pr} · {ev.commits} commits · @{ev.contributors?.[0]}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
