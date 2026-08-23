import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Plus,
  Trash2,
  Eye,
  Edit3,
  GitPullRequest,
  Sparkles,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import { AppShell } from "../components/revio/app-shell.jsx";
import {
  Meta,
  Code,
  CategoryTag,
  SectionLabel,
  StatusDot,
  TrustBadge,
} from "../components/revio/primitives.jsx";
import { PublishModal } from "../components/revio/publish-modal.jsx";
import { useReleases } from "../context/ReleaseContext.jsx";
import { useWorkspace } from "../context/WorkspaceContext.jsx";

export function ReleaseEditorPage() {
  const {
    draft,
    aiTone,
    regenerateSummary,
    updateReleaseTitle,
    updateReleaseSummary,
    updateChangeItem,
    changeCategory,
    addChangeItem,
    deleteChangeItem,
    publishDraftRelease,
  } = useReleases();
  const { workspace } = useWorkspace();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [mode, setMode] = useState("edit"); // "edit" | "preview"
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showEvidenceDrawer, setShowEvidenceDrawer] = useState(false); // Collapsed by default for calm focus
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newCategory, setNewCategory] = useState("new");
  const [savedStatus, setSavedStatus] = useState("Saved");

  // Handle URL query parameter ?publish=true
  useEffect(() => {
    if (searchParams.get("publish") === "true") {
      setShowPublishModal(true);
    }
  }, [searchParams]);

  const handleTitleChange = (val) => {
    updateReleaseTitle(val);
    triggerAutoSave();
  };

  const handleSummaryChange = (val) => {
    updateReleaseSummary(val);
    triggerAutoSave();
  };

  const triggerAutoSave = () => {
    setSavedStatus("Saving...");
    setTimeout(() => setSavedStatus("Saved"), 600);
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

  const handleConfirmPublish = () => {
    publishDraftRelease();
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-10">
        {/* EDITOR TOP BAR */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <div className="flex items-center gap-3">
            <Link
              to="/releases"
              className="text-xs text-muted-foreground transition-subtle hover:text-foreground"
            >
              ← Releases
            </Link>
            <div className="h-4 w-px bg-border" />
            <Code>{draft.version}</Code>
            <StatusDot tone="signal" pulse />
            <span className="text-xs text-muted-foreground font-mono">{savedStatus}</span>
          </div>

          <div className="flex items-center gap-3">
            {/* EDIT VS CUSTOMER PREVIEW SWITCH */}
            <div className="flex items-center border border-border bg-surface p-1 text-xs rounded-[3px]">
              <button
                onClick={() => setMode("edit")}
                className={`flex items-center gap-1.5 px-3 py-1 font-medium transition-subtle cursor-pointer rounded-[2px] ${
                  mode === "edit"
                    ? "bg-surface-raised text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Edit3 className="h-3.5 w-3.5" /> Edit
              </button>
              <button
                onClick={() => setMode("preview")}
                className={`flex items-center gap-1.5 px-3 py-1 font-medium transition-subtle cursor-pointer rounded-[2px] ${
                  mode === "preview"
                    ? "bg-signal text-signal-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Eye className="h-3.5 w-3.5" /> Preview
              </button>
            </div>

            {/* EVIDENCE TOGGLE */}
            <button
              onClick={() => setShowEvidenceDrawer(!showEvidenceDrawer)}
              className={`flex items-center gap-1.5 border px-3 py-1.5 text-xs transition-subtle cursor-pointer rounded-[2px] ${
                showEvidenceDrawer
                  ? "border-signal bg-signal/10 text-signal font-semibold"
                  : "border-border text-muted-foreground hover:bg-surface hover:text-foreground"
              }`}
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>{showEvidenceDrawer ? "Hide Evidence" : "Evidence"}</span>
            </button>

            {/* PRIMARY PUBLISH ACTION */}
            <button
              onClick={() => setShowPublishModal(true)}
              className="inline-flex items-center gap-2 bg-signal px-5 py-2 text-xs font-medium text-signal-foreground transition-subtle hover:opacity-90 cursor-pointer rounded-[2px]"
            >
              <span>Publish Release</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* MODE 1: EDIT MODE (EDITORIAL CANVAS DOMINATES) */}
        {mode === "edit" && (
          <div
            className={`mt-8 grid gap-8 transition-layer ${
              showEvidenceDrawer ? "lg:grid-cols-[1fr_22rem]" : "grid-cols-1 max-w-4xl mx-auto"
            }`}
          >
            {/* PRIMARY EDITORIAL CANVAS */}
            <div className="space-y-8">
              {/* EDITABLE TITLE & SUMMARY */}
              <div className="border border-border bg-surface p-6 sm:p-8 space-y-5 rounded-[4px]">
                <SectionLabel index="01">Customer Release Notes</SectionLabel>

                <div>
                  <label className="text-meta text-muted-foreground block mb-1.5">
                    Release Headline
                  </label>
                  <input
                    type="text"
                    value={draft.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full border border-input bg-surface-sunken px-4 py-2.5 text-editorial text-2xl sm:text-3xl text-foreground focus:border-signal focus:outline-none rounded-[2px] transition-subtle"
                  />
                </div>

                <div>
                  <label className="text-meta text-muted-foreground block mb-1.5">
                    Customer Summary
                  </label>
                  <textarea
                    rows={3}
                    value={draft.summary}
                    onChange={(e) => handleSummaryChange(e.target.value)}
                    className="w-full border border-input bg-surface-sunken p-4 text-sm leading-relaxed text-foreground focus:border-signal focus:outline-none rounded-[2px] transition-subtle"
                  />
                </div>
              </div>

              {/* CATEGORIZED CHANGE ITEMS */}
              <div className="border border-border bg-surface p-6 sm:p-8 space-y-6 rounded-[4px]">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <SectionLabel index="02">Grouped Changes</SectionLabel>
                    <h3 className="mt-1 text-lg font-medium text-foreground">
                      Customer Update Lines ({draft.changes.length})
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="inline-flex items-center gap-1.5 border border-border-strong px-3 py-1.5 text-xs text-foreground transition-subtle hover:bg-surface-raised cursor-pointer rounded-[2px]"
                  >
                    <Plus className="h-3.5 w-3.5 text-signal" /> Add Manual Change
                  </button>
                </div>

                <div className="space-y-5">
                  {draft.changes.map((item) => (
                    <div
                      key={item.id}
                      className="border border-border bg-surface-sunken p-5 space-y-3 transition-subtle hover:border-border-strong rounded-[3px]"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-meta">Category:</span>
                          {["new", "improved", "fixed"].map((cat) => (
                            <button
                              key={cat}
                              onClick={() => changeCategory(item.id, cat)}
                              className={`text-meta px-2 py-0.5 border cursor-pointer transition-subtle rounded-[2px] ${
                                item.category === cat
                                  ? cat === "new"
                                    ? "border-new text-new bg-new/10 font-bold"
                                    : cat === "improved"
                                      ? "border-improved text-improved bg-improved/10 font-bold"
                                      : "border-fixed text-fixed bg-fixed/10 font-bold"
                                  : "border-border-strong text-muted-foreground opacity-60 hover:opacity-100"
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => deleteChangeItem(item.id)}
                          className="text-xs text-muted-foreground hover:text-destructive cursor-pointer transition-subtle p-1"
                          title="Remove change line"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) =>
                          updateChangeItem(item.id, { title: e.target.value })
                        }
                        className="w-full border-b border-transparent bg-transparent text-base font-medium text-foreground hover:border-border focus:border-signal focus:outline-none transition-subtle py-1"
                      />
                      <textarea
                        rows={2}
                        value={item.body}
                        onChange={(e) =>
                          updateChangeItem(item.id, { body: e.target.value })
                        }
                        className="w-full border-b border-transparent bg-transparent text-sm leading-relaxed text-muted-foreground hover:border-border focus:border-signal focus:outline-none transition-subtle py-1"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT TECHNICAL EVIDENCE & REWRITE CONTROLS (COLLAPSIBLE DRAWER) */}
            {showEvidenceDrawer && (
              <div className="space-y-6 animate-rise">
                {/* REWRITE SUMMARY CONTROLS */}
                <div className="border border-border bg-surface p-6 space-y-4 rounded-[4px]">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-signal" />
                    <span className="text-xs font-semibold text-foreground">Rewrite Summary</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Adjust customer summary length and tone based on linked PR evidence.
                  </p>

                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    {[
                      { id: "short", label: "Short" },
                      { id: "detailed", label: "Detailed" },
                      { id: "technical", label: "Technical" },
                    ].map((tn) => (
                      <button
                        key={tn.id}
                        onClick={() => regenerateSummary(tn.id)}
                        className={`py-1.5 border text-center cursor-pointer transition-subtle rounded-[2px] ${
                          aiTone === tn.id
                            ? "border-signal bg-signal/10 text-signal font-bold"
                            : "border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {tn.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* LINKED PR EVIDENCE */}
                <div className="border border-border bg-surface p-6 space-y-4 rounded-[4px]">
                  <SectionLabel index="03">Linked Evidence</SectionLabel>
                  <p className="text-xs text-muted-foreground">
                    Engineering pull requests linked to active release items.
                  </p>

                  <div className="space-y-3">
                    {draft.changes.map((item) => (
                      <div key={item.id} className="border-b border-border pb-3 last:border-0">
                        <span className="text-xs font-semibold text-foreground block mb-1">
                          {item.title}
                        </span>
                        {item.evidence && item.evidence.length > 0 ? (
                          <div className="space-y-1 text-xs font-mono text-muted-foreground">
                            {item.evidence.map((ev) => (
                              <div key={ev.pr} className="space-y-0.5">
                                <div className="flex items-center justify-between">
                                  <span className="text-foreground">PR #{ev.pr}</span>
                                  <TrustBadge badge={ev.trustBadge || "High confidence"} />
                                </div>
                                <div className="text-[0.7rem]">
                                  {ev.branch} · {ev.commits} commits · @{ev.contributors?.[0]}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <Meta className="text-[0.7rem]">Manual entry (No PR linked)</Meta>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODE 2: CUSTOMER PREVIEW MODE */}
        {mode === "preview" && (
          <div className="mt-8 mx-auto max-w-3xl border border-paper-border bg-paper p-8 sm:p-12 text-paper-foreground shadow-xl rounded-[4px] animate-rise">
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

      {/* INTEGRATED PUBLICATION CHECKPOINT MODAL */}
      {showPublishModal && (
        <PublishModal
          draft={draft}
          onClose={() => {
            setShowPublishModal(false);
            navigate(`/releases/${draft.id}`, { replace: true });
          }}
          onConfirm={handleConfirmPublish}
        />
      )}

      {/* ADD MANUAL CHANGE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs animate-rise">
          <div className="w-full max-w-lg border border-border bg-surface p-6 sm:p-8 space-y-4 rounded-[4px] shadow-2xl">
            <h3 className="text-editorial text-2xl text-foreground">Add Manual Change</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="text-meta text-muted-foreground block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full border border-input bg-surface-sunken px-3 py-2 text-sm text-foreground focus:outline-none rounded-[2px]"
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
                  className="w-full border border-input bg-surface-sunken px-3 py-2 text-sm text-foreground focus:outline-none rounded-[2px]"
                  placeholder="e.g. Hardware key passkey authentication"
                />
              </div>

              <div>
                <label className="text-meta text-muted-foreground block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  className="w-full border border-input bg-surface-sunken px-3 py-2 text-sm text-foreground focus:outline-none rounded-[2px]"
                  placeholder="Customer facing description of the update..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-subtle"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-signal px-5 py-2 text-xs font-medium text-signal-foreground hover:opacity-90 cursor-pointer rounded-[2px] transition-subtle"
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
