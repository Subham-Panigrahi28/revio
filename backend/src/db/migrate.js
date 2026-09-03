import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { pool } from "./pool.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Executes pending SQL migrations in deterministic alphabetical sequence.
 * Tracks applied migrations in `schema_migrations`.
 *
 * @param {import('pg').Pool} [targetPool=pool] - Optional target pool instance
 * @returns {Promise<string[]>} List of newly applied migration file names
 */
export async function runMigrations(targetPool = pool) {
  const client = await targetPool.connect();
  const appliedMigrations = [];

  try {
    const migrationDir = path.join(__dirname, "migrations");

    if (!fs.existsSync(migrationDir)) {
      throw new Error(`Migration directory not found at: ${migrationDir}`);
    }

    const files = fs
      .readdirSync(migrationDir)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    // Ensure schema_migrations table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Fetch already applied migrations
    const appliedResult = await client.query("SELECT version FROM schema_migrations;");
    const appliedSet = new Set(appliedResult.rows.map((row) => row.version));

    for (const file of files) {
      if (!appliedSet.has(file)) {
        const sql = fs.readFileSync(path.join(migrationDir, file), "utf8");

        await client.query("BEGIN");
        try {
          await client.query(sql);
          await client.query(
            "INSERT INTO schema_migrations (version) VALUES ($1);",
            [file]
          );
          await client.query("COMMIT");
          appliedMigrations.push(file);
        } catch (migrationError) {
          await client.query("ROLLBACK");
          throw new Error(`Migration ${file} failed: ${migrationError.message}`);
        }
      }
    }

    return appliedMigrations;
  } finally {
    client.release();
  }
}

// CLI entry-point execution guard
const isDirectExecution =
  process.argv[1] &&
  (import.meta.url === pathToFileURL(process.argv[1]).href ||
    import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/")));

if (isDirectExecution) {
  runMigrations()
    .then((applied) => {
      if (applied.length === 0) {
        console.log("Database schema is up to date (0 pending migrations).");
      } else {
        console.log(`Successfully applied ${applied.length} migration(s):`, applied);
      }
      return pool.end();
    })
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error("Migration runner failed:", error.message);
      pool.end().finally(() => process.exit(1));
    });
}