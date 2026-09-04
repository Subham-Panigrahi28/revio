import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";

describe("Workspace & Tenant Isolation API Endpoints", () => {
  let userAToken;
  let userBToken;
  let userAId;
  let userBId;
  let workspaceAId;

  const emailA = `user_a_${Date.now()}@revio.app`;
  const emailB = `user_b_${Date.now()}@revio.app`;

  beforeAll(async () => {
    // Register User A
    const resA = await request(app)
      .post("/api/auth/register")
      .send({
        name: "User A",
        email: emailA,
        password: "password123!",
      });
    userAToken = resA.body.data.token;
    userAId = resA.body.data.user.id;

    // Register User B
    const resB = await request(app)
      .post("/api/auth/register")
      .send({
        name: "User B",
        email: emailB,
        password: "password123!",
      });
    userBToken = resB.body.data.token;
    userBId = resB.body.data.user.id;
  });

  it("POST /api/workspaces should create a workspace for authenticated user", async () => {
    const slug = `workspace-a-${Date.now()}`;
    const res = await request(app)
      .post("/api/workspaces")
      .set("Authorization", `Bearer ${userAToken}`)
      .send({
        name: "Workspace A",
        slug,
        url: "https://workspace-a.dev",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.workspace.name).toBe("Workspace A");
    workspaceAId = res.body.data.workspace.id;
  });

  it("GET /api/workspaces should list workspaces for authenticated user", async () => {
    const res = await request(app)
      .get("/api/workspaces")
      .set("Authorization", `Bearer ${userAToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.workspaces.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data.workspaces.some((w) => w.id === workspaceAId)).toBe(true);
  });

  it("GET /api/workspaces/:id should allow access to workspace owner", async () => {
    const res = await request(app)
      .get(`/api/workspaces/${workspaceAId}`)
      .set("Authorization", `Bearer ${userAToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.workspace.id).toBe(workspaceAId);
  });

  it("GET /api/workspaces/:id should BLOCK unrelated User B from accessing Workspace A (Cross-Tenant Isolation)", async () => {
    const res = await request(app)
      .get(`/api/workspaces/${workspaceAId}`)
      .set("Authorization", `Bearer ${userBToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("FORBIDDEN");
  });

  it("POST /api/workspaces/:id/members should allow owner to add team member", async () => {
    const res = await request(app)
      .post(`/api/workspaces/${workspaceAId}/members`)
      .set("Authorization", `Bearer ${userAToken}`)
      .send({
        email: emailB,
        role: "member",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.member.role).toBe("member");
  });

  it("GET /api/workspaces/:id should now allow access to newly added member User B", async () => {
    const res = await request(app)
      .get(`/api/workspaces/${workspaceAId}`)
      .set("Authorization", `Bearer ${userBToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.workspace.id).toBe(workspaceAId);
  });

  it("PATCH /api/workspaces/:id should BLOCK member User B from editing workspace settings (Role Permissions)", async () => {
    const res = await request(app)
      .patch(`/api/workspaces/${workspaceAId}`)
      .set("Authorization", `Bearer ${userBToken}`)
      .send({
        name: "Hacked Name by Member",
      });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("INSUFFICIENT_PERMISSIONS");
  });

  it("PATCH /api/workspaces/:id should allow owner User A to update workspace settings", async () => {
    const res = await request(app)
      .patch(`/api/workspaces/${workspaceAId}`)
      .set("Authorization", `Bearer ${userAToken}`)
      .send({
        name: "Workspace A Updated",
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.workspace.name).toBe("Workspace A Updated");
  });
});
