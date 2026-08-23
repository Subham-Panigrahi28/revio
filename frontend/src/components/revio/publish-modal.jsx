import React, { useState } from "react";
import { ArrowRight, Lock, Globe, ShieldCheck, Check, Copy, ExternalLink, X } from "lucide-react";
import { Meta, Code, CategoryTag } from "./primitives.jsx";
import { useWorkspace } from "../../context/WorkspaceContext.jsx";

export function PublishModal({ draft, onClose, onConfirm }) {
  const { workspace } = useWorkspace();
  const [publishing, setPublishing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handlePublish = () => {
    setPublishing(true);
    setTimeout(() => {
      setPublishing(false);
      setSuccess(true);
      onConfirm();
    }, 1100);
  };

  const publicUrl = `https://revio.app/c/${workspace.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-6 backdrop-blur-xs overflow-y-auto animate-rise">
      <div className="relative w-full max-w-4xl border border-border bg-surface shadow-2xl my-8 rounded-[4px] overflow-hidden">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between border-b border-border p-5 sm:p-6 bg-surface-raised/40">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-4 w-4 text-signal" />
            <span className="text-sm font-semibold text-foreground">
              Publication Checkpoint — {draft.version}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground cursor-pointer p-1.5 transition-subtle rounded-[2px]"
            aria-label="Close checkpoint"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* MODAL BODY */}
        {!success ? (
          <div className="p-6 sm:p-8">
            <p className="text-xs text-muted-foreground mb-6">
              Review what customers will read versus linked private internal evidence before publishing.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              {/* PUBLIC VIEW (LEFT) */}
              <div className="border border-paper-border bg-paper p-5 sm:p-6 text-paper-foreground rounded-[3px] shadow-sm">
                <div className="flex items-center justify-between border-b border-paper-border pb-3">
                  <div className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5 text-paper-muted" />
                    <span className="text-meta text-paper-muted">PUBLIC CUSTOMER VIEW</span>
                  </div>
                  <Code className="bg-paper-border/20 text-paper-foreground font-semibold">
                    {draft.version}
                  </Code>
                </div>

                <h3 className="text-editorial mt-4 text-xl sm:text-2xl font-medium">
                  {draft.title}
                </h3>

                <p className="mt-2 text-xs leading-relaxed text-paper-muted border-b border-paper-border pb-4">
                  {draft.summary}
                </p>

                <div className="mt-4 space-y-4 max-h-60 overflow-y-auto pr-1">
                  {draft.changes.map((item) => (
                    <div key={item.id} className="space-y-1">
                      <CategoryTag category={item.category} />
                      <h4 className="text-xs font-medium">{item.title}</h4>
                      <p className="text-[0.75rem] text-paper-muted">{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* PRIVATE EVIDENCE VIEW (RIGHT) */}
              <div className="border border-border bg-surface-sunken p-5 sm:p-6 rounded-[3px]">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <Lock className="h-3.5 w-3.5 text-signal" />
                    <Meta className="text-signal">INTERNAL AUDIT EVIDENCE</Meta>
                  </div>
                  <Code>Stays Private</Code>
                </div>

                <h4 className="mt-4 text-xs font-semibold text-foreground">
                  Linked PRs & Team Notes
                </h4>

                <div className="mt-4 space-y-3 max-h-64 overflow-y-auto pr-1 text-xs">
                  {draft.changes.map((item) => (
                    <div key={item.id} className="border-b border-border pb-3 last:border-0">
                      <span className="font-semibold text-foreground">{item.title}</span>
                      {item.evidence && item.evidence.length > 0 && (
                        <div className="mt-1 space-y-1 font-mono text-[0.7rem] text-muted-foreground">
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

            {/* MODAL FOOTER */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
              <button
                onClick={onClose}
                className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-subtle"
              >
                ← Back to Editing
              </button>
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="inline-flex items-center gap-2 bg-signal px-6 py-2.5 text-xs font-medium text-signal-foreground transition-subtle hover:opacity-90 disabled:opacity-50 cursor-pointer rounded-[2px]"
              >
                {publishing ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span>Publishing Release...</span>
                  </>
                ) : (
                  <>
                    <span>Publish {draft.version} Now</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* SUCCESS STATE (RESTRAINED CELEBRATION) */
          <div className="p-8 text-center space-y-6 animate-rise">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-new bg-new/10 text-new">
              <Check className="h-6 w-6" />
            </div>

            <div>
              <Meta className="text-new font-semibold">PUBLICATION SUCCESS</Meta>
              <h2 className="text-editorial mt-2 text-3xl sm:text-4xl text-foreground">
                {draft.version} is live on your public changelog!
              </h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                Your release notes are now published to your customers and ready for in-app widget distribution.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-2 border border-border bg-surface-raised px-4 py-2 text-xs text-foreground hover:bg-surface cursor-pointer rounded-[2px] transition-subtle"
              >
                {copiedLink ? <Check className="h-3.5 w-3.5 text-new" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedLink ? "Link Copied!" : "Copy Public Link"}</span>
              </button>
              <a
                href={`/c/${workspace.slug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-signal px-5 py-2 text-xs font-medium text-signal-foreground hover:opacity-90 rounded-[2px] transition-subtle"
              >
                <span>View Public Feed</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="border-t border-border pt-4">
              <button
                onClick={onClose}
                className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-subtle"
              >
                Close Studio
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
