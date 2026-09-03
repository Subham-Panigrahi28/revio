import { pool } from "../pool.js";

export async function createSubscription(
  { workspaceId, plan = "free", status = "active", startedAt = new Date(), endsAt = null },
  dbClient = pool
) {
  const result = await dbClient.query(
    `INSERT INTO subscriptions (workspace_id, plan, status, started_at, ends_at)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, workspace_id, plan, status, started_at, ends_at, created_at, updated_at;`,
    [workspaceId, plan, status, startedAt, endsAt]
  );
  return result.rows[0];
}

export async function findSubscriptionByWorkspaceId(workspaceId, dbClient = pool) {
  const result = await dbClient.query(
    `SELECT id, workspace_id, plan, status, started_at, ends_at, created_at, updated_at
     FROM subscriptions
     WHERE workspace_id = $1
     ORDER BY created_at DESC
     LIMIT 1;`,
    [workspaceId]
  );
  return result.rows[0] || null;
}

export async function updateSubscription(
  id,
  { plan, status, endsAt },
  dbClient = pool
) {
  const result = await dbClient.query(
    `UPDATE subscriptions
     SET plan = COALESCE($1, plan),
         status = COALESCE($2, status),
         ends_at = COALESCE($3, ends_at),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $4
     RETURNING id, workspace_id, plan, status, started_at, ends_at, created_at, updated_at;`,
    [plan, status, endsAt, id]
  );
  return result.rows[0] || null;
}
