import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";

describe("Release & Activity Domain API Endpoints", () => {
  let authToken;
  let workspaceId;
  let repositoryId;
  let releaseId;
  let activityId;

  beforeAll(async () => {
    // 1. Register user
    const regRes = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Release Tester",
        email: `tester_${Date.now()}@revio.app`,
        password: "password123!",
      });
    authToken = regRes.body.data.token;

    // 2. Create workspace
    const wsRes = await request(app)
      .post("/api/workspaces")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        name: "Test Platform Workspace",
        slug: `test-platform-${Date.now()}`,
      });
    workspaceId = wsRes.body.data.workspace.id;

    // 3. Create repository
    const repoRes = await request(app)
      .post(`/api/workspaces/${workspaceId}/repositories`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        githubRepoId: 554433,
        name: "platform",
        fullName: "test/platform",
        defaultBranch: "main",
      });
    repositoryId = repoRes.body.data.repository.id;
  });

  it("POST /api/repositories/:repoId/activities should create an activity record", async () => {
    const res = await request(app)
      .post(`/api/repositories/${repositoryId}/activities`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        type: "pull_request",
        externalId: "201",
        title: "feat: granular workspace RBAC",
        description: "Adds workspace access roles",
        url: "https://github.com/test/platform/pull/201",
        authorName: "mkrause",
        isIgnored: false,
        trustBadge: "High confidence",
        branch: "feat/rbac",
        commitsCount: 6,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.activity.title).toBe("feat: granular workspace RBAC");
    expect(res.body.data.activity.trust_badge).toBe("High confidence");
    activityId = res.body.data.activity.id;
  });

  it("GET /api/repositories/:repoId/activities/unreleased should return unreleased activities", async () => {
    const res = await request(app)
      .get(`/api/repositories/${repositoryId}/activities/unreleased`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.activities.some((a) => a.id === activityId)).toBe(true);
  });

  it("PATCH /api/activities/:id should toggle noise ignore state", async () => {
    const res = await request(app)
      .patch(`/api/activities/${activityId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        isIgnored: true,
        ignoreReason: "Marked as internal noise",
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.activity.is_ignored).toBe(true);
    expect(res.body.data.activity.ignore_reason).toBe("Marked as internal noise");

    // Unignore for subsequent release assignment
    await request(app)
      .patch(`/api/activities/${activityId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({ isIgnored: false });
  });

  it("POST /api/repositories/:repoId/releases should create a release with categorized changes", async () => {
    const res = await request(app)
      .post(`/api/repositories/${repositoryId}/releases`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        version: "v3.0.0",
        title: "Workspace Roles & Permissions",
        summary: "Granular access control across shared team workspaces.",
        changes: [
          {
            category: "new",
            title: "Team workspace access controls",
            body: "Administrators can now assign granular roles.",
            displayOrder: 1,
          },
          {
            category: "improved",
            title: "Release history performance",
            body: "Loads up to 6x faster.",
            displayOrder: 2,
          },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.release.version).toBe("v3.0.0");
    expect(res.body.data.release.changes).toHaveLength(2);
    expect(res.body.data.release.changes[0].category).toBe("new");
    releaseId = res.body.data.release.id;
  });

  it("POST /api/releases/:id/assign-activities should batch assign activities to a release", async () => {
    const res = await request(app)
      .post(`/api/releases/${releaseId}/assign-activities`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        activityIds: [activityId],
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.assigned).toHaveLength(1);

    // Verify activity is no longer in unreleased queue
    const unreleasedRes = await request(app)
      .get(`/api/repositories/${repositoryId}/activities/unreleased`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(unreleasedRes.body.data.activities.some((a) => a.id === activityId)).toBe(false);
  });

  it("POST /api/releases/:id/changes should add a manual change item to release", async () => {
    const res = await request(app)
      .post(`/api/releases/${releaseId}/changes`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        category: "fixed",
        title: "Fixed webhook retry backoff calculation",
        body: "Retries now back off exponentially.",
        displayOrder: 3,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.change.category).toBe("fixed");
  });

  it("POST /api/releases/:id/publish should publish the release atomically", async () => {
    const res = await request(app)
      .post(`/api/releases/${releaseId}/publish`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.release.status).toBe("published");
    expect(res.body.data.release.published_at).toBeDefined();
  });

  it("DELETE /api/releases/:id should delete release and reset assigned activity to unreleased (SET NULL)", async () => {
    const res = await request(app)
      .delete(`/api/releases/${releaseId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    // Activity should now be back in the unreleased list
    const unreleasedRes = await request(app)
      .get(`/api/repositories/${repositoryId}/activities/unreleased`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(unreleasedRes.body.data.activities.some((a) => a.id === activityId)).toBe(true);
  });
});
