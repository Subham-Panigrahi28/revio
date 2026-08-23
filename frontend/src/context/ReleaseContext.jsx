import React, { createContext, useContext, useState } from "react";
import { draftRelease, publishedReleases } from "../services/mockData.js";

const ReleaseContext = createContext(null);

export function ReleaseProvider({ children }) {
  const [draft, setDraft] = useState(draftRelease);
  const [publishedList, setPublishedList] = useState(publishedReleases);

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
      title: "Upcoming performance and webhook queue optimizations",
      summary: "Draft automatically generated from recent repository activity.",
      changes: [
        {
          id: "c-next-1",
          category: "new",
          title: "Real-time webhook health telemetry",
          body: "Inspect delivery metrics directly inside Distribution.",
          evidence: [
            {
              pr: 1890,
              title: "feat: add telemetry metrics endpoint",
              commits: 4,
              branch: "feat/telemetry",
              contributors: ["ana.ferreira"],
              mergedAt: "Just now",
              hashes: ["8e11a2f"],
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
        updateReleaseTitle,
        updateReleaseSummary,
        updateChangeItem,
        changeCategory,
        addChangeItem,
        deleteChangeItem,
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
