import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";

describe("Authentication API Endpoints", () => {
  const uniqueEmail = `test_${Date.now()}@revio.app`;

  it("POST /api/auth/register should register a new user and return a JWT token", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Alex Krause",
        email: uniqueEmail,
        password: "securePassword123!",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(uniqueEmail);
    expect(res.body.data.user.password_hash).toBeUndefined();
    expect(res.body.data.token).toBeDefined();
  });

  it("POST /api/auth/register should reject duplicate email with 409 Conflict", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Duplicate User",
        email: uniqueEmail,
        password: "securePassword123!",
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("EMAIL_ALREADY_EXISTS");
  });

  it("POST /api/auth/register should reject weak password with 400 Bad Request", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Weak Password User",
        email: "weak@revio.app",
        password: "short",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("POST /api/auth/login should authenticate with valid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: uniqueEmail,
        password: "securePassword123!",
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(uniqueEmail);
    expect(res.body.data.token).toBeDefined();
  });

  it("POST /api/auth/login should reject invalid password with 401 Unauthorized", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: uniqueEmail,
        password: "wrongPassword!",
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("INVALID_CREDENTIALS");
  });

  it("GET /api/auth/me should return current user profile with valid Bearer token", async () => {
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: uniqueEmail,
        password: "securePassword123!",
      });

    const token = loginRes.body.data.token;

    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(uniqueEmail);
    expect(res.body.data.user.password_hash).toBeUndefined();
  });

  it("GET /api/auth/me should reject unauthenticated requests with 401 Unauthorized", async () => {
    const res = await request(app).get("/api/auth/me");

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("UNAUTHORIZED");
  });

  it("GET /api/auth/me should reject invalid tokens with 401 Unauthorized", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", "Bearer invalid-token-string");

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("INVALID_TOKEN");
  });
});
