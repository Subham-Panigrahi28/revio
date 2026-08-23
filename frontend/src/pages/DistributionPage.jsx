import React, { useState } from "react";
import { Copy, Check, Send, Sun, Moon, Palette } from "lucide-react";
import { AppShell } from "../components/revio/app-shell.jsx";
import { Meta, Code, CategoryTag, SectionLabel } from "../components/revio/primitives.jsx";
import { useWorkspace } from "../context/WorkspaceContext.jsx";
import { useReleases } from "../context/ReleaseContext.jsx";

export function DistributionPage() {
  const { workspace, updateWidgetSettings } = useWorkspace();
  const { publishedList } = useReleases();

  const [widgetMode, setWidgetMode] = useState("floating"); // "floating" | "inline" | "popover"
  const [copied, setCopied] = useState(false);

  const theme = workspace.widgetSettings?.theme || "dark";
  const accentColor = workspace.widgetSettings?.accentColor || "#FF7442";

  const snippet = `<script
  src="https://cdn.revio.app/widget.js"
  data-workspace="${workspace.slug}"
  data-mode="${widgetMode}"
  data-theme="${theme}"
  data-accent="${accentColor}"
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
              <Meta className="text-signal">Channels & Share</Meta>
            </div>
            <h1 className="text-editorial mt-2 text-3xl sm:text-4xl text-foreground">
              In-App Embeddable Widget Customizer
            </h1>
          </div>
        </div>

        {/* DISTRIBUTION CONTENT GRID */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_24rem]">
          {/* LEFT: WIDGET STYLES & LIVE PREVIEW CONTAINER */}
          <div className="space-y-8">
            {/* WIDGET MODE SELECTION */}
            <div className="border border-border bg-surface p-6 sm:p-8 space-y-6 rounded-[4px]">
              <SectionLabel index="01">Presentation Style & Customization</SectionLabel>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { id: "floating", label: "Floating Button", desc: "Bottom corner trigger badge" },
                  { id: "inline", label: "Inline Feed", desc: "Embedded updates container" },
                  { id: "popover", label: "Announcement Popover", desc: "Header dropdown panel" },
                ].map((mode) => (
                  <div
                    key={mode.id}
                    onClick={() => setWidgetMode(mode.id)}
                    className={`cursor-pointer border p-4 transition-subtle rounded-[3px] ${
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

              {/* THEME & ACCENT COLOR PICKER CONTROLS */}
              <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground">Widget Theme:</span>
                  {["dark", "light", "auto"].map((t) => (
                    <button
                      key={t}
                      onClick={() => updateWidgetSettings({ theme: t })}
                      className={`px-3 py-1 border capitalize cursor-pointer font-mono rounded-[2px] transition-subtle ${
                        theme === t
                          ? "border-signal bg-signal/10 text-signal font-bold"
                          : "border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Palette className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Accent Color:</span>
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => updateWidgetSettings({ accentColor: e.target.value })}
                    className="h-6 w-8 border border-border bg-transparent cursor-pointer rounded-[2px]"
                  />
                  <Code>{accentColor}</Code>
                </div>
              </div>
            </div>

            {/* LIVE SIMULATED WEBSITE PREVIEW */}
            <div className="border border-border bg-surface p-6 sm:p-8 space-y-4 rounded-[4px]">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <Meta>Interactive Live Preview</Meta>
                <Code>Theme: {theme}</Code>
              </div>

              <div className={`relative min-h-[360px] border border-border p-6 transition-colors rounded-[3px] ${
                theme === "light" ? "bg-white text-slate-900" : "bg-background text-foreground"
              }`}>
                <div className="flex items-center justify-between border-b border-border/50 pb-4">
                  <span className="text-xs font-semibold">Your Web Application</span>
                  <div className="flex items-center gap-3 text-xs opacity-70">
                    <span>Dashboard</span>
                    <span>Docs</span>
                  </div>
                </div>

                <div className="mt-8 space-y-3 opacity-20">
                  <div className="h-5 w-48 bg-current rounded" />
                  <div className="h-3.5 w-96 bg-current rounded" />
                  <div className="h-3.5 w-64 bg-current rounded" />
                </div>

                {/* RENDERED WIDGET BASED ON MODE */}
                {widgetMode === "floating" && (
                  <div
                    className="absolute bottom-6 right-6 flex items-center gap-2 rounded-full border px-4 py-2 text-xs shadow-xl font-medium transition-subtle"
                    style={{ borderColor: accentColor, color: theme === "light" ? "#0f172a" : "#f8fafc" }}
                  >
                    <span className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
                    <span>What's New</span>
                    <Code>v2.13.0</Code>
                  </div>
                )}

                {widgetMode === "inline" && (
                  <div className="mt-8 border p-5 bg-surface/50 rounded-[3px]" style={{ borderColor: accentColor }}>
                    <div className="flex items-center justify-between border-b pb-3">
                      <span className="text-xs font-semibold">Product Updates</span>
                      <Meta>v2.13.0</Meta>
                    </div>
                    {publishedList.slice(0, 1).map((rel) => (
                      <div key={rel.id} className="mt-3 space-y-1">
                        <h4 className="text-xs font-medium">{rel.title}</h4>
                        <p className="text-[0.75rem] opacity-70">{rel.summary}</p>
                      </div>
                    ))}
                  </div>
                )}

                {widgetMode === "popover" && (
                  <div className="absolute top-14 right-6 w-72 border p-4 shadow-2xl bg-surface rounded-[3px]" style={{ borderColor: accentColor }}>
                    <div className="flex items-center justify-between border-b border-border pb-2">
                      <span className="text-xs font-semibold">Latest Update</span>
                      <CategoryTag category="new" />
                    </div>
                    <p className="mt-3 text-xs font-medium">Public changelog search</p>
                    <p className="mt-1 text-[0.75rem] opacity-70">
                      Readers can now search everything you have ever shipped.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: SCRIPT EMBED SNIPPET */}
          <div className="space-y-6">
            <div className="border border-border bg-surface p-6 space-y-4 rounded-[4px]">
              <SectionLabel index="02">Embed Script</SectionLabel>
              <h3 className="text-sm font-medium text-foreground">Drop into your application</h3>
              <p className="text-xs text-muted-foreground">
                Paste this script before the closing <Code>&lt;/body&gt;</Code> tag.
              </p>

              <div className="relative border border-border bg-surface-sunken p-4 font-mono text-xs text-foreground overflow-x-auto rounded-[3px]">
                <pre>{snippet}</pre>
                <button
                  onClick={handleCopy}
                  className="absolute top-3 right-3 flex items-center gap-1 bg-surface-raised border border-border-strong px-2.5 py-1 text-[0.7rem] text-foreground hover:bg-surface cursor-pointer rounded-[2px] transition-subtle"
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
          </div>
        </div>
      </div>
    </AppShell>
  );
}
