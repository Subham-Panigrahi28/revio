import React, { createContext, useContext, useState } from "react";
import {
  draftRelease,
  publishedReleases,
  unassignedActivity as initialUnassigned,
  ignoredActivity as initialIgnored,
} from "../services/mockData.js";

const ReleaseContext = createContext(null);

export function ReleaseProvider({ children }) {
  const [draft, setDraft] = useState(draftRelease);
  const [publishedList, setPublishedList] = useState(publishedReleases);
  const [unassignedList, setUnassignedList] = useState(initialUnassigned);
  const [ignoredList, setIgnoredList] = useState(initialIgnored);
  const [aiTone, setAiTone] = useState("standard");

  // Regenerate release summary based on tone selection
  const regenerateSummary = (tone) => {
    setAiTone(tone);
    let newSummary = draft.summary;
    if (tone === "short") {
      newSummary = "v2.14.0 adds workspace permissions and faster release history loading.";
    } else if (tone === "detailed") {
      newSummary =
        "This release focuses on enterprise workspace security and performance optimizations. Administrators can assign per-workspace RBAC permissions, subscriber category preferences are now customizable, and release history loading speed is improved up to 6×.";
    } else if (tone === "technical") {
      newSummary =
        "v2.14.0 introduces RBAC authorization endpoints (`workspace_rbac`), subscriber delivery preference hooks, server-side paginated release caching, deduplicated tag reconciliation, and exponential backoff retry queues.";
    } else {
      newSummary = draftRelease.summary;
    }
    setDraft((prev) => ({ ...prev, summary: newSummary }));
  };

  // Update release title
  const updateReleaseTitle = (title) => {
    setDraft((prev) => ({ ...prev, title }));
  };

  // Update release summary
  const updateReleaseSummary = (summary) => {
    setDraft((prev) => ({ ...prev, summary }));
  };

  // Update a specific change item
  const updateChangeItem = (changeId, fields) => {
    setDraft((prev) => ({
      ...prev,
      changes: prev.changes.map((item) =>
        item.id === changeId ? { ...item, ...fields } : item
      ),
    }));
  };

  // Change category of an item
  const changeCategory = (changeId, category) => {
    setDraft((prev) => ({
      ...prev,
      changes: prev.changes.map((item) =>
        item.id === changeId ? { ...item, category } : item
      ),
    }));
  };

  // Add a new manual change
  const addChangeItem = (newChange) => {
    const createdItem = {
      id: `c-${Date.now()}`,
      category: newChange.category || "new",
      title: newChange.title || "New change entry",
      body: newChange.body || "",
      internalNote: newChange.internalNote || "",
      evidence: newChange.evidence || [],
    };
    setDraft((prev) => ({
      ...prev,
      changes: [createdItem, ...prev.changes],
    }));
  };

  // Delete a change item
  const deleteChangeItem = (changeId) => {
    setDraft((prev) => ({
      ...prev,
      changes: prev.changes.filter((item) => item.id !== changeId),
    }));
  };

  // Move PR item between unassigned and ignored lists
  const toggleActivityIgnore = (prId) => {
    const unassignedItem = unassignedList.find((i) => i.pr === prId);
    if (unassignedItem) {
      setUnassignedList((prev) => prev.filter((i) => i.pr !== prId));
      setIgnoredList((prev) => [
        { ...unassignedItem, trustBadge: "Auto-filtered", reason: "Manually marked as ignored noise" },
        ...prev,
      ]);
    } else {
      const ignoredItem = ignoredList.find((i) => i.pr === prId);
      if (ignoredItem) {
        setIgnoredList((prev) => prev.filter((i) => i.pr !== prId));
        setUnassignedList((prev) => [
          { ...ignoredItem, trustBadge: "Needs review", reason: "Re-included from noise filter" },
          ...prev,
        ]);
      }
    }
  };

  // Include unassigned activity PR into active release draft
  const includeActivityInDraft = (prId) => {
    const item = unassignedList.find((i) => i.pr === prId);
    if (item) {
      setUnassignedList((prev) => prev.filter((i) => i.pr !== prId));
      addChangeItem({
        category: "improved",
        title: item.title,
        body: item.reason || "Update added from repository activity stream.",
        evidence: [
          {
            pr: item.pr,
            title: item.title,
            commits: item.commits,
            branch: item.branch,
            contributors: [item.author],
            mergedAt: item.mergedAt,
            hashes: ["8a9b2c3"],
            trustBadge: item.trustBadge,
          },
        ],
      });
    }
  };

  // Publish active draft
  const publishDraftRelease = () => {
    const formattedDate = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const newPublished = {
      id: draft.id,
      version: draft.version,
      status: "published",
      date: formattedDate,
      title: draft.title,
      summary: draft.summary,
      changes: draft.changes.map((c) => ({
        id: c.id,
        category: c.category,
        title: c.title,
        body: c.body,
        evidence: c.evidence,
      })),
    };

    setPublishedList((prev) => [newPublished, ...prev]);

    // Create next draft placeholder
    setDraft({
      id: "v2-15-0",
      version: "v2.15.0",
      status: "draft",
      date: "Pending",
      title: "Passkey sign-in fallback and mobile navigation performance",
      summary: "Draft automatically generated from recent repository activity.",
      changes: [
        {
          id: "c-next-1",
          category: "new",
          title: "Passkey authentication sign-in fallback",
          body: "Users can now sign in with hardware passkeys or biometric security keys as an alternative to email tokens.",
          evidence: [
            {
              pr: 1876,
              title: "feat: passkey authentication sign-in fallback",
              commits: 5,
              branch: "feat/passkey-fallback",
              contributors: ["alex"],
              mergedAt: "Just now",
              hashes: ["8e11a2f"],
              trustBadge: "High confidence",
            },
          ],
        },
      ],
    });
  };

  return (
    <ReleaseContext.Provider
      value={{
        draft,
        publishedList,
        unassignedList,
        ignoredList,
        aiTone,
        regenerateSummary,
        updateReleaseTitle,
        updateReleaseSummary,
        updateChangeItem,
        changeCategory,
        addChangeItem,
        deleteChangeItem,
        toggleActivityIgnore,
        includeActivityInDraft,
        publishDraftRelease,
      }}
    >
      {children}
    </ReleaseContext.Provider>
  );
}

export function useReleases() {
  const context = useContext(ReleaseContext);
  if (!context) {
    throw new Error("useReleases must be used within a ReleaseProvider");
  }
  return context;
}
