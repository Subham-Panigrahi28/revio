import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDir = path.resolve(__dirname, "../../src/db/migrations");

describe("Database Migration Files Integrity", () => {
  it("should have all migration files named with 3-digit sorted prefixes", () => {
    const files = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    expect(files.length).toBeGreaterThanOrEqual(13);

    // Verify sequential ordering
    files.forEach((file, index) => {
      const prefix = parseInt(file.slice(0, 3), 10);
      expect(prefix).toBe(index + 1);
    });
  });

  it("should contain valid SQL commands in every migration file", () => {
    const files = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".sql"));

    for (const file of files) {
      const content = fs.readFileSync(path.join(migrationsDir, file), "utf8");
      expect(content.trim().length).toBeGreaterThan(0);
      expect(
        content.includes("CREATE TABLE") ||
          content.includes("ALTER TABLE") ||
          content.includes("CREATE INDEX")
      ).toBe(true);
    }
  });

  it("should include critical Phase 2 schema migrations 009 through 013", () => {
    const files = fs.readdirSync(migrationsDir);

    expect(files).toContain("009_correct_foreign_keys_and_indexes.sql");
    expect(files).toContain("010_create_release_changes.sql");
    expect(files).toContain("011_add_activity_metadata.sql");
    expect(files).toContain("012_add_workspace_configuration.sql");
    expect(files).toContain("013_prepare_oauth_identity.sql");
  });
});
