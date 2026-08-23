import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Eye,
  Edit3,
  GitPullRequest,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { AppShell } from "../components/revio/app-shell.jsx";
import {
  Meta,
  Code,
  CategoryTag,
  SectionLabel,
  StatusDot,
} from "../components/revio/primitives.jsx";
import { useReleases } from "../context/ReleaseContext.jsx";
import { useWorkspace } from "../context/WorkspaceContext.jsx";

export function ReleaseEditorPage() {
  const {
    draft,
    updateReleaseTitle,
    updateReleaseSummary,
    updateChangeItem,
    changeCategory,
    addChangeItem,
    deleteChangeItem,
  } = useReleases();
  const { workspace } = useWorkspace();
  const navigate = useNavigate();

  const [mode, setMode] = useState("edit"); // "edit" | "preview"
  const [expandedEvidence, setExpandedEvidence] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newCategory, setNewCategory] = useState("new");

  const toggleEvidence = (id) => {
    setExpandedEvidence((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addChangeItem({
      category: newCategory,
      title: newTitle,
      body: newBody,
      evidence: [],
    });
    setNewTitle("");
    setNewBody("");
    setShowAddModal(false);
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-10">
        {/* TOP BAR / EDITOR HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              ← Dashboard
            </Link>
            <div className="h-4 w-px bg-border" />
            <Code>{draft.version}</Code>
            <StatusDot tone="signal" pulse />
            <Meta>Draft Studio Workspace</Meta>
          </div>

          <div className="flex items-center gap-3">
            {/* MODE SWITCH: EDIT VS PREVIEW */}
            <div className="flex items-center border border-border bg-surface p-1 text-xs">
              <button
                onClick={() => setMode("edit")}
                className={`flex items-center gap-1.5 px-3 py-1 font-medium transition-colors cursor-pointer ${
                  mode === "edit"
                    ? "bg-surface-raised text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Edit3 className="h-3.5 w-3.5" /> Edit
              </button>
              <button
                onClick={() => setMode("preview")}
                className={`flex items-center gap-1.5 px-3 py-1 font-medium transition-colors cursor-pointer ${
                  mode === "preview"
                    ? "bg-signal text-signal-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Eye className="h-3.5 w-3.5" /> Customer Preview
              </button>
            </div>

            <button
              onClick={() => navigate(`/publish/${draft.id}`)}
              className="inline-flex items-center gap-2 bg-signal px-4 py-2 text-xs font-medium text-signal-foreground transition-opacity hover:opacity-90 cursor-pointer"
            >
              Review & Publish <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* MODE 1: EDIT MODE */}
        {mode === "edit" && (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]">
            {/* MAIN EDITING AREA */}
            <div className="space-y-8">
              {/* EDITABLE RELEASE IDENTITY PANEL */}
              <div className="border border-border bg-surface p-6 sm:p-8">
                <SectionLabel index="01">Release Identity</SectionLabel>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="text-meta text-muted-foreground block mb-1.5">
                      Release Title
                    </label>
                    <input
                      type="text"
                      value={draft.title}
                      onChange={(e) => updateReleaseTitle(e.target.value)}
                      className="w-full border border-input bg-surface-sunken px-4 py-2.5 text-editorial text-2xl sm:text-3xl text-foreground focus:border-signal focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-meta text-muted-foreground block mb-1.5">
                      Customer Summary
                    </label>
                    <textarea
                      rows={3}
                      value={draft.summary}
                      onChange={(e) => updateReleaseSummary(e.target.value)}
                      className="w-full border border-input bg-surface-sunken p-4 text-sm leading-relaxed text-foreground focus:border-signal focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* DETECTED CHANGES LIST */}
              <div className="border border-border bg-surface p-6 sm:p-8">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <SectionLabel index="02">Grouped Changes</SectionLabel>
                    <h3 className="mt-1 text-lg font-medium text-foreground">
                      Customer-Facing Update Lines
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center gap-1.5 border border-border-strong px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-surface-raised cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5 text-signal" /> Add Manual Change
                  </button>
                </div>

                <div className="mt-6 space-y-6">
                  {draft.changes.map((item) => {
                    const isExpanded = !!expandedEvidence[item.id];
                    return (
                      <div
                        key={item.id}
                        className="border border-border bg-surface-sunken p-5 transition-colors hover:border-border-strong"
                      >
                        {/* ITEM HEADER & CATEGORY SWITCHER */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-meta">Category:</span>
                            {["new", "improved", "fixed"].map((cat) => (
                              <button
                                key={cat}
                                onClick={() => changeCategory(item.id, cat)}
                                className={`text-meta px-2 py-0.5 border cursor-pointer ${
                                  item.category === cat
                                    ? cat === "new"
                                      ? "border-new text-new bg-new/10"
                                      : cat === "improved"
                                        ? "border-improved text-improved bg-improved/10"
                                        : "border-fixed text-fixed bg-fixed/10"
                                    : "border-border-strong text-muted-foreground opacity-60 hover:opacity-100"
                                }`}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>

                          <button
                            onClick={() => deleteChangeItem(item.id)}
                            className="text-xs text-muted-foreground hover:text-destructive cursor-pointer"
                            title="Remove change"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* EDITABLE CHANGE TITLE & BODY */}
                        <div className="mt-4 space-y-3">
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) =>
                              updateChangeItem(item.id, { title: e.target.value })
                            }
                            className="w-full border-b border-transparent bg-transparent text-base font-medium text-foreground hover:border-border focus:border-signal focus:outline-none"
                          />
                          <textarea
                            rows={2}
                            value={item.body}
                            onChange={(e) =>
                              updateChangeItem(item.id, { body: e.target.value })
                            }
                            className="w-full border-b border-transparent bg-transparent text-sm leading-relaxed text-muted-foreground hover:border-border focus:border-signal focus:outline-none"
                          />
                        </div>

                        {/* PROGRESSIVE TECHNICAL EVIDENCE DISCLOSURE */}
                        {item.evidence && item.evidence.length > 0 && (
                          <div className="mt-4 border-t border-border pt-3">
                            <button
                              onClick={() => toggleEvidence(item.id)}
                              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                              <GitPullRequest className="h-3.5 w-3.5 text-signal" />
                              <span>
                                Technical Evidence ({item.evidence.length} PR
                                {item.evidence.length > 1 ? "s" : ""})
                              </span>
                              {isExpanded ? (
                                <ChevronUp className="h-3.5 w-3.5" />
                              ) : (
                                <ChevronDown className="h-3.5 w-3.5" />
                              )}
                            </button>

                            {isExpanded && (
                              <div className="mt-3 space-y-2.5 border-l-2 border-signal pl-4 text-xs">
                                {item.evidence.map((ev) => (
                                  <div key={ev.pr} className="space-y-1">
                                    <div className="flex items-center gap-2 font-mono">
                                      <span className="text-foreground">PR #{ev.pr}</span>
                                      <span className="text-muted-foreground">• {ev.title}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-muted-foreground">
                                      <Code>{ev.branch}</Code>
                                      <span>{ev.commits} commits</span>
                                      <span>Merged {ev.mergedAt}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* CONTEXTUAL SIDEBAR */}
            <div className="space-y-6">
              <div className="border border-border bg-surface p-6">
                <SectionLabel index="03">Release Metadata</SectionLabel>
                <dl className="mt-4 space-y-3 text-xs">
                  <div className="flex justify-between border-b border-border pb-2">
                    <dt className="text-muted-foreground">Target Branch</dt>
                    <dd className="font-mono text-foreground">{workspace.repository.branch}</dd>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <dt className="text-muted-foreground">Repository</dt>
                    <dd className="font-mono text-foreground">{workspace.repository.name}</dd>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <dt className="text-muted-foreground">Total Changes</dt>
                    <dd className="text-foreground">{draft.changes.length} items</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Review State</dt>
                    <dd className="text-signal">In Review</dd>
                  </div>
                </dl>
              </div>

              <div className="border border-border bg-surface p-6">
                <Meta>AI Classification</Meta>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Changes were automatically grouped from merged PRs and commit hashes using Revio classification rules.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: CUSTOMER PREVIEW MODE */}
        {mode === "preview" && (
          <div className="mt-8 mx-auto max-w-3xl border border-paper-border bg-paper p-8 sm:p-12 text-paper-foreground shadow-lg">
            <div className="flex items-center justify-between border-b border-paper-border pb-4">
              <Code className="bg-paper-border/20 text-paper-foreground font-semibold">
                {draft.version}
              </Code>
              <span className="text-code text-paper-muted">Customer Preview</span>
            </div>

            <h1 className="text-editorial mt-6 text-3xl sm:text-4xl">
              {draft.title}
            </h1>

            <p className="mt-4 text-sm leading-relaxed text-paper-muted border-b border-paper-border pb-6">
              {draft.summary}
            </p>

            <div className="mt-8 space-y-6">
              {draft.changes.map((item) => (
                <div key={item.id} className="space-y-2">
                  <CategoryTag category={item.category} />
                  <h3 className="text-lg font-medium">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-paper-muted">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ADD MANUAL CHANGE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-lg border border-border bg-surface p-6">
            <h3 className="text-editorial text-2xl text-foreground">Add Manual Change Line</h3>
            <form onSubmit={handleAddSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-meta text-muted-foreground block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full border border-input bg-surface-sunken px-3 py-2 text-sm text-foreground focus:outline-none"
                >
                  <option value="new">New</option>
                  <option value="improved">Improved</option>
                  <option value="fixed">Fixed</option>
                </select>
              </div>

              <div>
                <label className="text-meta text-muted-foreground block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full border border-input bg-surface-sunken px-3 py-2 text-sm text-foreground focus:outline-none"
                  placeholder="e.g. Passkey Sign-in Support"
                />
              </div>

              <div>
                <label className="text-meta text-muted-foreground block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  className="w-full border border-input bg-surface-sunken px-3 py-2 text-sm text-foreground focus:outline-none"
                  placeholder="Customer facing description of the update..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-signal px-5 py-2 text-xs font-medium text-signal-foreground hover:opacity-90 cursor-pointer"
                >
                  Add Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
