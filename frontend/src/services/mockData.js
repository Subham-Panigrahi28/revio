export const repository = {
  name: "northwind/platform",
  branch: "main",
  lastSync: "4 minutes ago",
  commitsSinceRelease: 87,
  openPRs: 5,
};

export const categoryLabel = {
  new: "New",
  improved: "Improved",
  fixed: "Fixed",
};

export const draftRelease = {
  id: "v2-14-0",
  version: "v2.14.0",
  status: "draft",
  date: "Pending",
  title: "Workspace permissions and a faster release history",
  summary:
    "This release focuses on control and speed. Administrators can now shape exactly who can do what inside a shared workspace, and release history loads in a fraction of the time it used to.",
  changes: [
    {
      id: "c1",
      category: "new",
      title: "Team workspace access controls",
      body: "Administrators can now assign granular roles and permissions across shared workspaces. Roles apply per workspace, so a person can review releases in one product and only read in another.",
      internalNote:
        "Ships behind the `workspace_rbac` flag for self-serve accounts until the migration backfill completes.",
      evidence: [
        {
          pr: 1842,
          title: "feat: add granular workspace permissions",
          commits: 8,
          branch: "feat/workspace-rbac",
          contributors: ["mkrause", "ana.ferreira", "dpatel"],
          mergedAt: "Aug 19, 14:02",
          hashes: ["4f0c1ab", "9de4471", "c118a2e"],
        },
        {
          pr: 1851,
          title: "feat: permission matrix in settings",
          commits: 3,
          branch: "feat/permission-matrix",
          contributors: ["ana.ferreira"],
          mergedAt: "Aug 20, 09:41",
          hashes: ["77bb019", "2ac66f3"],
        },
      ],
    },
    {
      id: "c2",
      category: "new",
      title: "Subscriber preferences",
      body: "Customers following your changelog can choose which categories they hear about, and whether updates arrive immediately or as a weekly digest.",
      evidence: [
        {
          pr: 1866,
          title: "feat: subscriber category preferences",
          commits: 6,
          branch: "feat/subscriber-prefs",
          contributors: ["jlindqvist"],
          mergedAt: "Aug 21, 11:15",
          hashes: ["ba01c7d", "31f9e08"],
        },
      ],
    },
    {
      id: "c3",
      category: "improved",
      title: "Release history loads up to 6× faster",
      body: "Release history is now paginated on the server and cached per workspace. Workspaces with several hundred releases open almost instantly.",
      evidence: [
        {
          pr: 1858,
          title: "perf: paginate and cache release history",
          commits: 11,
          branch: "perf/release-history",
          contributors: ["dpatel", "mkrause"],
          mergedAt: "Aug 20, 17:33",
          hashes: ["e5510cc", "0aa7b31", "9c2f4de"],
        },
      ],
    },
    {
      id: "c4",
      category: "improved",
      title: "More accurate change grouping",
      body: "Related pull requests that belong to the same piece of work are now grouped into a single customer-facing change instead of appearing as separate lines.",
      evidence: [
        {
          pr: 1870,
          title: "chore: tune grouping heuristics for stacked PRs",
          commits: 4,
          branch: "chore/grouping-heuristics",
          contributors: ["ana.ferreira"],
          mergedAt: "Aug 22, 08:07",
          hashes: ["18cc902"],
        },
      ],
    },
    {
      id: "c5",
      category: "fixed",
      title: "Webhook retries no longer stall after a failed delivery",
      body: "A failed delivery could leave the retry queue paused for the rest of the hour. Retries now resume with exponential backoff and report their state in Distribution.",
      evidence: [
        {
          pr: 1849,
          title: "fix: resume webhook retry queue after failure",
          commits: 2,
          branch: "fix/webhook-retry",
          contributors: ["jlindqvist"],
          mergedAt: "Aug 19, 19:58",
          hashes: ["7d3ba15"],
        },
      ],
    },
    {
      id: "c6",
      category: "fixed",
      title: "Duplicate releases when a tag is pushed twice",
      body: "Pushing the same tag from two CI jobs created two drafts. Revio now reconciles on tag identity rather than push event.",
      evidence: [
        {
          pr: 1861,
          title: "fix: dedupe release detection on tag identity",
          commits: 3,
          branch: "fix/duplicate-release",
          contributors: ["dpatel"],
          mergedAt: "Aug 21, 16:24",
          hashes: ["cf2210b", "50a7f9d"],
        },
      ],
    },
  ],
};

export const publishedReleases = [
  {
    id: "v2-13-0",
    version: "v2.13.0",
    status: "published",
    date: "August 4, 2026",
    title: "Public changelog search and quieter notifications",
    summary:
      "Readers can now search everything you have ever shipped, and notification volume is under your control.",
    changes: [
      {
        id: "p1",
        category: "new",
        title: "Public changelog search",
        body: "Every published release is indexed. Readers can search by keyword, category, or version directly from your public page.",
        evidence: [],
      },
      {
        id: "p2",
        category: "improved",
        title: "Repository synchronization is incremental",
        body: "Revio only pulls activity since the last sync, which removes the long initial pause on large repositories.",
        evidence: [],
      },
      {
        id: "p3",
        category: "fixed",
        title: "Notification delivery edge cases",
        body: "Updates addressed to subscribers with plus-addressed emails are delivered correctly.",
        evidence: [],
      },
    ],
  },
  {
    id: "v2-12-1",
    version: "v2.12.1",
    status: "published",
    date: "July 18, 2026",
    title: "Embeddable changelog widget",
    summary:
      "A compact product update panel you can drop into your own application in a single line.",
    changes: [
      {
        id: "p4",
        category: "new",
        title: "Embeddable changelog widget",
        body: "A compact “What's new” panel that inherits your application's typography and adapts to light or dark surfaces.",
        evidence: [],
      },
      {
        id: "p5",
        category: "improved",
        title: "Draft preparation is roughly twice as fast",
        body: "Change grouping now runs in parallel across pull requests instead of sequentially.",
        evidence: [],
      },
    ],
  },
  {
    id: "v2-12-0",
    version: "v2.12.0",
    status: "published",
    date: "June 29, 2026",
    title: "Review assignments and release approvals",
    summary:
      "Releases can require an approver before publishing, so nothing customer-facing goes out unread.",
    changes: [
      {
        id: "p6",
        category: "new",
        title: "Release approvals",
        body: "Require one or more approvals on a draft before the publish action unlocks.",
        evidence: [],
      },
      {
        id: "p7",
        category: "fixed",
        title: "Stale draft state after a force push",
        body: "Force-pushed branches no longer leave orphaned changes attached to an open draft.",
        evidence: [],
      },
    ],
  },
];

export const detectedActivity = [
  { pr: 1842, title: "feat: add granular workspace permissions", commits: 8, state: "merged" },
  { pr: 1849, title: "fix: resume webhook retry queue after failure", commits: 2, state: "merged" },
  { pr: 1851, title: "feat: permission matrix in settings", commits: 3, state: "merged" },
  { pr: 1858, title: "perf: paginate and cache release history", commits: 11, state: "merged" },
  { pr: 1861, title: "fix: dedupe release detection on tag identity", commits: 3, state: "merged" },
  { pr: 1866, title: "feat: subscriber category preferences", commits: 6, state: "merged" },
  { pr: 1870, title: "chore: tune grouping heuristics for stacked PRs", commits: 4, state: "merged" },
  { pr: 1874, title: "chore: bump lockfile", commits: 1, state: "ignored" },
];

export function categoryColor(c) {
  return c === "new"
    ? "text-new"
    : c === "improved"
      ? "text-improved"
      : "text-fixed";
}
