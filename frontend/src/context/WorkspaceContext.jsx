import React, { createContext, useContext, useState } from "react";
import { repository } from "../services/mockData.js";

const WorkspaceContext = createContext(null);

export function WorkspaceProvider({ children }) {
  const [workspace, setWorkspace] = useState({
    name: "Northwind Platform",
    slug: "northwind",
    url: "https://northwind.dev",
    connected: true,
    repository: repository,
    repositories: [
      { name: "northwind/platform", branch: "main", activity: "Active · 87 commits since release", openPRs: 5, visibility: "Public" },
      { name: "northwind/mobile", branch: "main", activity: "Active · 14 commits this week", openPRs: 2, visibility: "Private" },
      { name: "northwind/api", branch: "main", activity: "Idle · 3 days ago", openPRs: 0, visibility: "Private" },
      { name: "northwind/dashboard", branch: "main", activity: "Active · 22 commits this week", openPRs: 1, visibility: "Public" },
    ],
    onboardingCompleted: true,
    team: [
      { id: "u1", name: "Alex Morgan", email: "alex@northwind.dev", role: "Owner", avatar: "AM", status: "Active" },
      { id: "u2", name: "Maya Chen", email: "maya@northwind.dev", role: "Product Manager", avatar: "MC", status: "Active" },
      { id: "u3", name: "Daniel Patel", email: "dpatel@northwind.dev", role: "Engineer", avatar: "DP", status: "Active" },
    ],
    notifications: {
      emailDigest: true,
      webhookAlerts: true,
      slackIntegration: false,
    },
  });

  const updateWorkspace = (fields) => {
    setWorkspace((prev) => ({ ...prev, ...fields }));
  };

  const selectRepository = (repoName) => {
    const selected = workspace.repositories.find((r) => r.name === repoName);
    if (selected) {
      setWorkspace((prev) => ({
        ...prev,
        repository: {
          ...prev.repository,
          name: selected.name,
          branch: selected.branch,
        },
      }));
    }
  };

  return (
    <WorkspaceContext.Provider value={{ workspace, updateWorkspace, selectRepository }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
