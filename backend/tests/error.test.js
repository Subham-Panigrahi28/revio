import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";

describe("Backend Error Handling", () => {
  it("should return standardized 404 response for unknown routes", async () => {
    const res = await request(app).get("/api/v1/unknown-endpoint");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("NOT_FOUND");
    expect(res.body.error.message).toContain("Route not found");
  });
});
