import { pool } from "./pool.js";

/**
 * Execute a callback within an isolated database transaction.
 * Automatically handles BEGIN, COMMIT, ROLLBACK, and client release.
 *
 * @param {Function} callback - Async function receiving (client) as argument
 * @param {import('pg').Pool} [dbPool=pool] - Optional pool instance
 * @returns {Promise<any>} Result returned by callback
 */
export async function withTransaction(callback, dbPool = pool) {
  const client = await dbPool.connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackError) {
      // Ignore rollback errors if connection was severed
    }
    throw error;
  } finally {
    client.release();
  }
}
