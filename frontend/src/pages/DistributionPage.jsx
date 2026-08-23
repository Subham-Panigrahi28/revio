import React, { useState } from "react";
import { Copy, Check, Sparkles, Send, Layout, MessageSquare, ExternalLink } from "lucide-react";
import { AppShell } from "../components/revio/app-shell.jsx";
import { Meta, Code, CategoryTag, SectionLabel } from "../components/revio/primitives.jsx";
import { useWorkspace } from "../context/WorkspaceContext.jsx";
import { useReleases } from "../context/ReleaseContext.jsx";

export function DistributionPage() {
  const { workspace } = useWorkspace();
  const { publishedList } = useReleases();

  const [widgetMode, setWidgetMode] = useState("floating"); // "floating" | "inline" | "popover"
  const [copied, setCopied] = useState(false);

  const snippet = `<script
  src="https://cdn.revio.app/widget.js"
  data-workspace="${workspace.slug}"
  data-mode="${widgetMode}"
  async>
</script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-10">
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2">
              <Send className="h-4 w-4 text-signal" />
              <Meta className="text-signal">Multi-Channel Distribution System</Meta>
            </div>
            <h1 className="text-editorial mt-2 text-3xl sm:text-4xl text-foreground">
              Embeddable Widget & Channels
            </h1>
          </div>
        </div>

        {/* DISTRIBUTION CONTENT GRID */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_24rem]">
          {/* LEFT: WIDGET STYLES & LIVE PREVIEW CONTAINER */}
          <div className="space-y-8">
            {/* WIDGET MODE SELECTION */}
            <div className="border border-border bg-surface p-6 sm:p-8">
              <SectionLabel index="01">Widget presentation style</SectionLabel>
              <h2 className="mt-4 text-xl font-medium text-foreground">
                Select your in-app widget format
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  { id: "floating", label: "Floating Button", desc: "Bottom corner trigger badge" },
                  { id: "inline", label: "Inline Feed", desc: "Embedded updates container" },
                  { id: "popover", label: "Announcement Popover", desc: "Header dropdown panel" },
                ].map((mode) => (
                  <div
                    key={mode.id}
                    onClick={() => setWidgetMode(mode.id)}
                    className={`cursor-pointer border p-4 transition-all ${
                      widgetMode === mode.id
                        ? "border-signal bg-surface-raised"
                        : "border-border bg-surface-sunken hover:border-border-strong"
                    }`}
                  >
                    <span className="text-sm font-medium text-foreground">{mode.label}</span>
                    <p className="mt-1 text-xs text-muted-foreground">{mode.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* LIVE SIMULATED WEBSITE PREVIEW */}
            <div className="border border-border bg-surface p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <Meta>Interactive Live Preview</Meta>
                <Code>Mode: {widgetMode}</Code>
              </div>

              <div className="relative mt-6 min-h-[360px] border border-border bg-background p-6">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <span className="text-xs font-semibold text-foreground">Your Application</span>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Navigation</span>
                    <span>Docs</span>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <div className="h-6 w-48 bg-surface" />
                  <div className="h-4 w-96 bg-surface-sunken" />
                  <div className="h-4 w-64 bg-surface-sunken" />
                </div>

                {/* RENDERED WIDGET BASED ON MODE */}
                {widgetMode === "floating" && (
                  <div className="absolute bottom-6 right-6 flex items-center gap-2 rounded-full border border-border bg-surface-raised px-4 py-2 text-xs shadow-xl">
                    <span className="h-2 w-2 rounded-full bg-signal animate-pulse" />
                    <span className="font-medium text-foreground">What's New</span>
                    <Code>v2.13.0</Code>
                  </div>
                )}

                {widgetMode === "inline" && (
                  <div className="mt-8 border border-border bg-surface p-5">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <span className="text-xs font-semibold text-foreground">Product Updates</span>
                      <Meta>v2.13.0</Meta>
                    </div>
                    {publishedList.slice(0, 1).map((rel) => (
                      <div key={rel.id} className="mt-3 space-y-2">
                        <h4 className="text-sm font-medium text-foreground">{rel.title}</h4>
                        <p className="text-xs text-muted-foreground">{rel.summary}</p>
                      </div>
                    ))}
                  </div>
                )}

                {widgetMode === "popover" && (
                  <div className="absolute top-14 right-6 w-72 border border-border bg-surface p-4 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <span className="text-xs font-semibold text-foreground">Latest Update</span>
                      <CategoryTag category="new" />
                    </div>
                    <p className="mt-3 text-xs font-medium text-foreground">
                      Public changelog search and quieter notifications
                    </p>
                    <p className="mt-1 text-[0.75rem] text-muted-foreground">
                      Readers can now search everything you have ever shipped.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: SCRIPT EMBED SNIPPET & CHANNEL STATUS */}
          <div className="space-y-6">
            <div className="border border-border bg-surface p-6">
              <SectionLabel index="02">Embed Code</SectionLabel>
              <h3 className="mt-3 text-sm font-medium text-foreground">
                Drop into your web app
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Paste before the closing <Code>&lt;/body&gt;</Code> tag.
              </p>

              <div className="relative mt-4 border border-border bg-surface-sunken p-4 font-mono text-xs text-foreground overflow-x-auto">
                <pre>{snippet}</pre>
                <button
                  onClick={handleCopy}
                  className="absolute top-3 right-3 flex items-center gap-1 bg-surface-raised border border-border-strong px-2.5 py-1 text-[0.7rem] text-foreground hover:bg-surface cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 text-new" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" /> Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="border border-border bg-surface p-6">
              <Meta>Channel Delivery Status</Meta>
              <div className="mt-4 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Public Changelog</span>
                  <span className="text-new font-medium">Live</span>
                </div>
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Widget CDN</span>
                  <span className="text-new font-medium">Healthy</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Email Subscriber Delivery</span>
                  <span className="text-foreground font-medium">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
