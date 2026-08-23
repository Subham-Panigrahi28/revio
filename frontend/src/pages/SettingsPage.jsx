import React, { useState } from "react";
import { Layers, GitBranch, Users, Bell, Key, Save, Check, RefreshCw, Copy, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { AppShell } from "../components/revio/app-shell.jsx";
import { Meta, Code, StatusDot, SectionLabel } from "../components/revio/primitives.jsx";
import { useWorkspace } from "../context/WorkspaceContext.jsx";

export function SettingsPage() {
  const { workspace, updateWorkspace, rotateApiKey } = useWorkspace();

  const [activeTab, setActiveTab] = useState("workspace"); // "workspace" | "repository" | "team" | "notifications" | "developer"
  const [name, setName] = useState(workspace.name);
  const [slug, setSlug] = useState(workspace.slug);
  const [url, setUrl] = useState(workspace.url);
  const [saved, setSaved] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateWorkspace({ name, slug, url });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(workspace.developerSettings.apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-10">
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-signal" />
              <Meta className="text-signal">System Configuration</Meta>
            </div>
            <h1 className="text-editorial mt-2 text-3xl sm:text-4xl text-foreground">
              Workspace Settings
            </h1>
          </div>
        </div>

        {/* SETTINGS LAYOUT WITH TABS */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[16rem_1fr]">
          {/* TAB SIDEBAR */}
          <nav className="space-y-1">
            {[
              { id: "workspace", label: "Workspace Identity", icon: Layers },
              { id: "repository", label: "Repository", icon: GitBranch },
              { id: "team", label: "Team Members", icon: Users },
              { id: "notifications", label: "Notifications", icon: Bell },
              { id: "developer", label: "Developer & API Keys", icon: Key },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full items-center gap-3 border p-3 text-xs font-medium transition-subtle cursor-pointer rounded-[3px] ${
                    isActive
                      ? "border-signal bg-surface-raised text-foreground"
                      : "border-transparent text-muted-foreground hover:bg-surface hover:text-foreground"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-signal" : ""}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            <div className="pt-4 border-t border-border mt-4">
              <Link
                to="/distribution"
                className="flex w-full items-center gap-3 border border-border p-3 text-xs text-muted-foreground hover:bg-surface hover:text-foreground transition-subtle rounded-[3px]"
              >
                <Send className="h-4 w-4 text-signal" />
                <span>Channels & Share</span>
              </Link>
            </div>
          </nav>

          {/* TAB CONTENT AREA */}
          <div className="border border-border bg-surface p-6 sm:p-8 rounded-[4px]">
            {/* WORKSPACE TAB */}
            {activeTab === "workspace" && (
              <form onSubmit={handleSave} className="space-y-6 max-w-xl animate-rise">
                <SectionLabel index="01">Workspace Identity</SectionLabel>

                <div>
                  <label className="text-meta text-muted-foreground block mb-2">
                    Product / Workspace Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-input bg-surface-sunken px-3.5 py-2.5 text-sm text-foreground focus:border-signal focus:outline-none rounded-[2px] transition-subtle"
                  />
                </div>

                <div>
                  <label className="text-meta text-muted-foreground block mb-2">
                    Changelog URL Slug
                  </label>
                  <div className="flex items-center border border-input bg-surface-sunken px-3.5 py-2.5 text-sm rounded-[2px]">
                    <span className="text-muted-foreground/60">revio.app/c/</span>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full bg-transparent text-foreground focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-meta text-muted-foreground block mb-2">
                    Product Web URL
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full border border-input bg-surface-sunken px-3.5 py-2.5 text-sm text-foreground focus:border-signal focus:outline-none rounded-[2px] transition-subtle"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-signal px-5 py-2.5 text-sm font-medium text-signal-foreground hover:opacity-90 cursor-pointer rounded-[2px] transition-subtle"
                >
                  {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                  <span>{saved ? "Saved Changes" : "Save Changes"}</span>
                </button>
              </form>
            )}

            {/* REPOSITORY TAB */}
            {activeTab === "repository" && (
              <div className="space-y-6 max-w-xl animate-rise">
                <SectionLabel index="02">Connected Repository</SectionLabel>
                <div className="border border-border bg-surface-sunken p-4 rounded-[3px]">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-foreground">
                        {workspace.repository.name}
                      </span>
                      <p className="text-meta mt-1">Branch: {workspace.repository.branch}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusDot tone="live" pulse />
                      <span className="text-xs text-new font-medium">Healthy Sync</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Revio receives read-only webhook events when pull requests are merged or release tags are pushed.
                </p>
              </div>
            )}

            {/* TEAM TAB */}
            {activeTab === "team" && (
              <div className="space-y-6 max-w-xl animate-rise">
                <SectionLabel index="03">Workspace Members</SectionLabel>
                <div className="space-y-3">
                  {workspace.team.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between border border-border bg-surface-sunken p-4 rounded-[3px]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center border border-border-strong bg-surface-raised text-xs font-semibold text-foreground rounded-full">
                          {member.avatar}
                        </div>
                        <div>
                          <span className="text-sm font-medium text-foreground">{member.name}</span>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <Meta>{member.role}</Meta>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === "notifications" && (
              <div className="space-y-6 max-w-xl animate-rise">
                <SectionLabel index="04">Delivery Alerts</SectionLabel>
                <div className="space-y-4 text-sm">
                  <label className="flex items-center justify-between border border-border bg-surface-sunken p-4 cursor-pointer rounded-[3px] transition-subtle hover:border-border-strong">
                    <div>
                      <span className="font-medium text-foreground">Email Subscriber Digest</span>
                      <p className="text-xs text-muted-foreground">Send published release updates to subscribers</p>
                    </div>
                    <input type="checkbox" defaultChecked className="accent-signal h-4 w-4" />
                  </label>
                  <label className="flex items-center justify-between border border-border bg-surface-sunken p-4 cursor-pointer rounded-[3px] transition-subtle hover:border-border-strong">
                    <div>
                      <span className="font-medium text-foreground">Webhook Failure Alerts</span>
                      <p className="text-xs text-muted-foreground">Notify team when webhook delivery fails</p>
                    </div>
                    <input type="checkbox" defaultChecked className="accent-signal h-4 w-4" />
                  </label>
                </div>
              </div>
            )}

            {/* DEVELOPER TAB */}
            {activeTab === "developer" && (
              <div className="space-y-6 max-w-xl animate-rise">
                <SectionLabel index="05">Developer API & Webhooks</SectionLabel>

                <div className="space-y-4">
                  <div>
                    <label className="text-meta text-muted-foreground block mb-1">
                      API Access Key
                    </label>
                    <div className="flex items-center gap-2">
                      <Code className="w-full py-2 px-3 text-xs">
                        {workspace.developerSettings.apiKey}
                      </Code>
                      <button
                        onClick={handleCopyKey}
                        className="inline-flex items-center gap-1 border border-border bg-surface-raised px-3 py-2 text-xs text-foreground hover:bg-surface cursor-pointer rounded-[2px] transition-subtle"
                      >
                        {copiedKey ? <Check className="h-3.5 w-3.5 text-new" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copiedKey ? "Copied" : "Copy"}</span>
                      </button>
                      <button
                        onClick={rotateApiKey}
                        className="inline-flex items-center gap-1 border border-border px-3 py-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer rounded-[2px] transition-subtle"
                        title="Rotate Key"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-meta text-muted-foreground block mb-1">
                      Webhook Signing Secret
                    </label>
                    <Code className="w-full py-2 px-3 text-xs">
                      {workspace.developerSettings.webhookSecret}
                    </Code>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
