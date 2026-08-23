import React, { useState } from "react";
import { Layers, GitBranch, Users, Bell, CreditCard, Check, Save } from "lucide-react";
import { AppShell } from "../components/revio/app-shell.jsx";
import { Meta, Code, StatusDot, SectionLabel } from "../components/revio/primitives.jsx";
import { useWorkspace } from "../context/WorkspaceContext.jsx";

export function SettingsPage() {
  const { workspace, updateWorkspace } = useWorkspace();

  const [activeTab, setActiveTab] = useState("workspace"); // "workspace" | "repository" | "team" | "notifications" | "billing"
  const [name, setName] = useState(workspace.name);
  const [slug, setSlug] = useState(workspace.slug);
  const [url, setUrl] = useState(workspace.url);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateWorkspace({ name, slug, url });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
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
              { id: "workspace", label: "Workspace", icon: Layers },
              { id: "repository", label: "Repository", icon: GitBranch },
              { id: "team", label: "Team Members", icon: Users },
              { id: "notifications", label: "Notifications", icon: Bell },
              { id: "billing", label: "Billing Plan", icon: CreditCard },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full items-center gap-3 border p-3 text-xs font-medium transition-colors cursor-pointer ${
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
          </nav>

          {/* TAB CONTENT AREA */}
          <div className="border border-border bg-surface p-6 sm:p-8">
            {/* WORKSPACE TAB */}
            {activeTab === "workspace" && (
              <form onSubmit={handleSave} className="space-y-6 max-w-xl">
                <SectionLabel index="01">Workspace identity</SectionLabel>

                <div>
                  <label className="text-meta text-muted-foreground block mb-2">
                    Product / Workspace Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-input bg-surface-sunken px-3.5 py-2.5 text-sm text-foreground focus:border-signal focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-meta text-muted-foreground block mb-2">
                    Changelog URL Slug
                  </label>
                  <div className="flex items-center border border-input bg-surface-sunken px-3.5 py-2.5 text-sm">
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
                    className="w-full border border-input bg-surface-sunken px-3.5 py-2.5 text-sm text-foreground focus:border-signal focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-signal px-5 py-2.5 text-sm font-medium text-signal-foreground hover:opacity-90 cursor-pointer"
                >
                  {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                  <span>{saved ? "Saved Changes" : "Save Changes"}</span>
                </button>
              </form>
            )}

            {/* REPOSITORY TAB */}
            {activeTab === "repository" && (
              <div className="space-y-6 max-w-xl">
                <SectionLabel index="02">Connected GitHub repository</SectionLabel>
                <div className="border border-border bg-surface-sunken p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-foreground">
                        {workspace.repository.name}
                      </span>
                      <p className="text-meta mt-1">Branch: {workspace.repository.branch}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusDot tone="live" pulse />
                      <span className="text-xs text-new font-medium">Connected</span>
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
              <div className="space-y-6 max-w-xl">
                <SectionLabel index="03">Workspace members</SectionLabel>
                <div className="space-y-3">
                  {workspace.team.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between border border-border bg-surface-sunken p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center border border-border-strong bg-surface-raised text-xs font-semibold text-foreground">
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
              <div className="space-y-6 max-w-xl">
                <SectionLabel index="04">Delivery alerts</SectionLabel>
                <div className="space-y-4 text-sm">
                  <label className="flex items-center justify-between border border-border bg-surface-sunken p-4 cursor-pointer">
                    <div>
                      <span className="font-medium text-foreground">Email Subscriber Digest</span>
                      <p className="text-xs text-muted-foreground">Send published release updates to subscribers</p>
                    </div>
                    <input type="checkbox" defaultChecked className="accent-signal" />
                  </label>
                  <label className="flex items-center justify-between border border-border bg-surface-sunken p-4 cursor-pointer">
                    <div>
                      <span className="font-medium text-foreground">Webhook Failure Retry Alerts</span>
                      <p className="text-xs text-muted-foreground">Notify team when webhook delivery requires retry</p>
                    </div>
                    <input type="checkbox" defaultChecked className="accent-signal" />
                  </label>
                </div>
              </div>
            )}

            {/* BILLING TAB */}
            {activeTab === "billing" && (
              <div className="space-y-6 max-w-xl">
                <SectionLabel index="05">Subscription & Usage</SectionLabel>
                <div className="border border-border bg-surface-sunken p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-editorial text-2xl text-foreground">Pro Workspace Plan</span>
                    <Code>Active</Code>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Includes unlimited releases, public changelog hosting, and embedded widget CDN.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
