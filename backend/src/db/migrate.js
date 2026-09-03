const fs = require("fs");
const path = require("path");
const pool = require("./pool");

async function runMigrations() {
  const client = await pool.connect();
  try {

    const migrationDir = path.join(__dirname, "migrations");

    const files = fs.readdirSync(migrationDir)
      .filter(file => file.endsWith(".sql"))
      .sort();


    await pool.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations(
      version VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    for (const file of files) {
      const result = await pool.query(
        "SELECT version FROM schema_migrations WHERE version = $1",
        [file]
      );

      if (result.rows.length == 0) {
        const sql = fs.readFileSync(
          path.join(migrationDir, file), "utf8"
        );

        await client.query("BEGIN");

        await client.query(sql);

        await client.query(
          "INSERT INTO schema_migrations(version) VALUES ($1)",
          [file]
        );

        await client.query("COMMIT");
      }
    }
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Migration failed: ", error.message);
    throw error;
  } finally{
    client.release();
  }
}

runMigrations()
    .then(() => {
        console.log("Migration process completed.");
    })
    .catch((error) => {
        console.error("Migration process failed:", error.message);
    });