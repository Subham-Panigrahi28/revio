import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Archive, Eye, Copy, Check, Send, Rss, Plus } from "lucide-react";
import { AppShell } from "../components/revio/app-shell.jsx";
import { Meta, Code, CategoryTag, SectionLabel, StatusDot } from "../components/revio/primitives.jsx";
import { useReleases } from "../context/ReleaseContext.jsx";
import { useWorkspace } from "../context/WorkspaceContext.jsx";

export function ReleasesPage() {
  const { draft, publishedList } = useReleases();
  const { workspace } = useWorkspace();
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyPermalink = (version) => {
    const url = `https://revio.app/c/${workspace.slug}/v/${version}`;
    navigator.clipboard.writeText(url);
    setCopiedId(version);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-10">
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2">
              <Archive className="h-4 w-4 text-signal" />
              <Meta className="text-signal">Release Management</Meta>
            </div>
            <h1 className="text-editorial mt-2 text-3xl sm:text-4xl text-foreground">
              Releases & History
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/distribution"
              className="inline-flex items-center gap-2 border border-border px-3.5 py-1.5 text-xs text-muted-foreground transition-subtle hover:bg-surface hover:text-foreground rounded-[2px]"
            >
              <Send className="h-3.5 w-3.5 text-signal" /> Channels & Share
            </Link>
            <Link
              to={`/releases/${draft.id}`}
              className="inline-flex items-center gap-2 bg-signal px-4 py-1.5 text-xs font-medium text-signal-foreground transition-subtle hover:opacity-90 rounded-[2px]"
            >
              <span>Continue Release {draft.version}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* RELEASES MAIN CONTENT */}
        <div className="mt-8 space-y-10">
          {/* SECTION 1: ACTIVE DRAFT RELEASE HERO */}
          <div className="border border-border bg-surface p-6 sm:p-8 rounded-[4px]">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <Code>{draft.version}</Code>
                <StatusDot tone="signal" pulse />
                <Meta>Active Draft Candidate</Meta>
              </div>
              <span className="text-meta text-signal font-semibold">Ready for Review</span>
            </div>

            <h2 className="text-editorial mt-6 text-2xl sm:text-3xl text-foreground">
              {draft.title}
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-muted-foreground max-w-3xl">
              {draft.summary}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
              <Meta>{draft.changes.length} customer updates grouped from recent commits</Meta>
              <Link
                to={`/releases/${draft.id}`}
                className="inline-flex items-center gap-2 bg-signal px-5 py-2 text-xs font-medium text-signal-foreground hover:opacity-90 rounded-[2px] transition-subtle"
              >
                <span>Open Release Studio</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* SECTION 2: PUBLISHED RELEASE HISTORY TIMELINE */}
          <div className="border border-border bg-surface p-6 sm:p-8 rounded-[4px]">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <SectionLabel index="02">Publication History</SectionLabel>
                <h3 className="mt-1 text-lg font-medium text-foreground">Published Releases</h3>
              </div>
              <a
                href={`/c/${workspace.slug}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-signal hover:underline flex items-center gap-1 transition-subtle"
              >
                <span>View Public Feed</span>
                <Eye className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="mt-6 space-y-8">
              {publishedList.map((rel) => (
                <article
                  key={rel.id}
                  className="border-b border-border pb-8 last:border-0 last:pb-0 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <Code>{rel.version}</Code>
                      <Meta>{rel.date}</Meta>
                    </div>
                    <button
                      onClick={() => handleCopyPermalink(rel.version)}
                      className="inline-flex items-center gap-1.5 border border-border px-2.5 py-1 text-[0.7rem] text-muted-foreground hover:bg-surface-raised hover:text-foreground cursor-pointer transition-subtle rounded-[2px]"
                    >
                      {copiedId === rel.version ? (
                        <>
                          <Check className="h-3 w-3 text-new" /> Copied Link!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" /> Permalink
                        </>
                      )}
                    </button>
                  </div>

                  <h4 className="text-editorial text-2xl text-foreground">{rel.title}</h4>
                  <p className="text-xs leading-relaxed text-muted-foreground max-w-3xl">
                    {rel.summary}
                  </p>

                  <div className="pt-2 space-y-2">
                    {rel.changes.map((c) => (
                      <div key={c.id} className="flex items-start gap-2.5 text-xs">
                        <CategoryTag category={c.category} />
                        <span className="font-medium text-foreground/90">{c.title}</span>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
