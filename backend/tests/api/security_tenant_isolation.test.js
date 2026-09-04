import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";

describe("Strict Tenant Isolation & RBAC Security Suite", () => {
  let userAToken;
  let userBToken;
  let userAMemberToken;

  let workspaceAId;
  let workspaceBId;

  let repoAId;
  let repoBId;

  let activityBId;
  let releaseBId;
  let releaseChangeBId;

  beforeAll(async () => {
    // 1. User A (Owner of Workspace A)
    const resA = await request(app)
      .post("/api/auth/register")
      .send({
        name: "User A Owner",
        email: `usera_${Date.now()}@revio.app`,
        password: "password123!",
      });
    userAToken = resA.body.data.token;

    // 2. User B (Owner of Workspace B)
    const resB = await request(app)
      .post("/api/auth/register")
      .send({
        name: "User B Owner",
        email: `userb_${Date.now()}@revio.app`,
        password: "password123!",
      });
    userBToken = resB.body.data.token;

    // 3. User A Member (Member in Workspace A)
    const resMember = await request(app)
      .post("/api/auth/register")
      .send({
        name: "User A Member",
        email: `member_a_${Date.now()}@revio.app`,
        password: "password123!",
      });
    userAMemberToken = resMember.body.data.token;

    // Create Workspace A
    const wsARes = await request(app)
      .post("/api/workspaces")
      .set("Authorization", `Bearer ${userAToken}`)
      .send({
        name: "Workspace A",
        slug: `workspace-a-${Date.now()}`,
      });
    workspaceAId = wsARes.body.data.workspace.id;

    // Add Member to Workspace A
    await request(app)
      .post(`/api/workspaces/${workspaceAId}/members`)
      .set("Authorization", `Bearer ${userAToken}`)
      .send({
        email: resMember.body.data.user.email,
        role: "member",
      });

    // Create Workspace B
    const wsBRes = await request(app)
      .post("/api/workspaces")
      .set("Authorization", `Bearer ${userBToken}`)
      .send({
        name: "Workspace B",
        slug: `workspace-b-${Date.now()}`,
      });
    workspaceBId = wsBRes.body.data.workspace.id;

    // Create Repository B in Workspace B
    const repoBRes = await request(app)
      .post(`/api/workspaces/${workspaceBId}/repositories`)
      .set("Authorization", `Bearer ${userBToken}`)
      .send({
        githubRepoId: 998811,
        name: "repo-b",
        fullName: "tenant-b/repo-b",
      });
    repoBId = repoBRes.body.data.repository.id;

    // Create Activity B in Repo B
    const actBRes = await request(app)
      .post(`/api/repositories/${repoBId}/activities`)
      .set("Authorization", `Bearer ${userBToken}`)
      .send({
        type: "pull_request",
        externalId: "9001",
        title: "Confidential feature for Tenant B",
      });
    activityBId = actBRes.body.data.activity.id;

    // Create Release B in Repo B
    const relBRes = await request(app)
      .post(`/api/repositories/${repoBId}/releases`)
      .set("Authorization", `Bearer ${userBToken}`)
      .send({
        version: "v1.0.0-b",
        title: "Confidential Release B",
        changes: [
          {
            category: "new",
            title: "Tenant B Secret Feature",
            displayOrder: 1,
          },
        ],
      });
    releaseBId = relBRes.body.data.release.id;
    releaseChangeBId = relBRes.body.data.release.changes[0].id;
  });

  describe("Cross-Tenant IDOR Protection", () => {
    it("User A cannot read Tenant B repository", async () => {
      const res = await request(app)
        .get(`/api/repositories/${repoBId}`)
        .set("Authorization", `Bearer ${userAToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("FORBIDDEN");
    });

    it("User A cannot delete Tenant B repository", async () => {
      const res = await request(app)
        .delete(`/api/repositories/${repoBId}`)
        .set("Authorization", `Bearer ${userAToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("FORBIDDEN");
    });

    it("User A cannot read Tenant B activities", async () => {
      const res = await request(app)
        .get(`/api/repositories/${repoBId}/activities`)
        .set("Authorization", `Bearer ${userAToken}`);

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe("FORBIDDEN");
    });

    it("User A cannot modify Tenant B activity ignore state", async () => {
      const res = await request(app)
        .patch(`/api/activities/${activityBId}`)
        .set("Authorization", `Bearer ${userAToken}`)
        .send({ isIgnored: true });

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe("FORBIDDEN");
    });

    it("User A cannot read Tenant B release", async () => {
      const res = await request(app)
        .get(`/api/releases/${releaseBId}`)
        .set("Authorization", `Bearer ${userAToken}`);

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe("FORBIDDEN");
    });

    it("User A cannot modify Tenant B release changes", async () => {
      const res = await request(app)
        .patch(`/api/releases/${releaseBId}/changes/${releaseChangeBId}`)
        .set("Authorization", `Bearer ${userAToken}`)
        .send({ title: "Hacked change title" });

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe("FORBIDDEN");
    });

    it("User A cannot publish Tenant B release", async () => {
      const res = await request(app)
        .post(`/api/releases/${releaseBId}/publish`)
        .set("Authorization", `Bearer ${userAToken}`);

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe("FORBIDDEN");
    });
  });

  describe("Role-Based Access Control (RBAC)", () => {
    let repoAId;
    let releaseAId;

    beforeAll(async () => {
      const repoARes = await request(app)
        .post(`/api/workspaces/${workspaceAId}/repositories`)
        .set("Authorization", `Bearer ${userAToken}`)
        .send({
          githubRepoId: 112233,
          name: "repo-a",
          fullName: "tenant-a/repo-a",
        });
      repoAId = repoARes.body.data.repository.id;

      const relARes = await request(app)
        .post(`/api/repositories/${repoAId}/releases`)
        .set("Authorization", `Bearer ${userAToken}`)
        .send({
          version: "v1.0.0-a",
          title: "Release Draft A",
        });
      releaseAId = relARes.body.data.release.id;
    });

    it("Member CAN create change item on release draft in their workspace", async () => {
      const res = await request(app)
        .post(`/api/releases/${releaseAId}/changes`)
        .set("Authorization", `Bearer ${userAMemberToken}`)
        .send({
          category: "improved",
          title: "Speed improvement by member",
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it("Member CANNOT publish a release (Admin/Owner required)", async () => {
      const res = await request(app)
        .post(`/api/releases/${releaseAId}/publish`)
        .set("Authorization", `Bearer ${userAMemberToken}`);

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe("INSUFFICIENT_PERMISSIONS");
    });

    it("Member CANNOT delete a release (Admin/Owner required)", async () => {
      const res = await request(app)
        .delete(`/api/releases/${releaseAId}`)
        .set("Authorization", `Bearer ${userAMemberToken}`);

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe("INSUFFICIENT_PERMISSIONS");
    });

    it("Owner CAN publish release successfully", async () => {
      const res = await request(app)
        .post(`/api/releases/${releaseAId}/publish`)
        .set("Authorization", `Bearer ${userAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.release.status).toBe("published");
    });
  });

  describe("Malformed Parameter & Error Protection", () => {
    it("GET /api/releases/invalid-string-id returns 400 Bad Request instead of leaking 500 SQL error", async () => {
      const res = await request(app)
        .get("/api/releases/invalid-string-id")
        .set("Authorization", `Bearer ${userAToken}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe("INVALID_PARAMETER_FORMAT");
    });
  });
});
