import { pool } from "../pool.js";

export async function addMember(
  { workspaceId, userId, role = "member" },
  dbClient = pool
) {
  const result = await dbClient.query(
    `INSERT INTO workspace_members (workspace_id, user_id, role)
     VALUES ($1, $2, $3)
     ON CONFLICT (workspace_id, user_id)
     DO UPDATE SET role = EXCLUDED.role
     RETURNING workspace_id, user_id, role, joined_at;`,
    [workspaceId, userId, role]
  );
  return result.rows[0];
}

export async function findMembersByWorkspaceId(workspaceId, dbClient = pool) {
  const result = await dbClient.query(
    `SELECT wm.workspace_id, wm.user_id, wm.role, wm.joined_at, u.name, u.email, u.avatar_url
     FROM workspace_members wm
     INNER JOIN users u ON wm.user_id = u.id
     WHERE wm.workspace_id = $1
     ORDER BY wm.joined_at ASC;`,
    [workspaceId]
  );
  return result.rows;
}

export async function findMember(workspaceId, userId, dbClient = pool) {
  const result = await dbClient.query(
    `SELECT wm.workspace_id, wm.user_id, wm.role, wm.joined_at, u.name, u.email, u.avatar_url
     FROM workspace_members wm
     INNER JOIN users u ON wm.user_id = u.id
     WHERE wm.workspace_id = $1 AND wm.user_id = $2;`,
    [workspaceId, userId]
  );
  return result.rows[0] || null;
}

export async function updateMemberRole(
  workspaceId,
  userId,
  role,
  dbClient = pool
) {
  const result = await dbClient.query(
    `UPDATE workspace_members
     SET role = $1
     WHERE workspace_id = $2 AND user_id = $3
     RETURNING workspace_id, user_id, role, joined_at;`,
    [role, workspaceId, userId]
  );
  return result.rows[0] || null;
}

export async function removeMember(workspaceId, userId, dbClient = pool) {
  const result = await dbClient.query(
    `DELETE FROM workspace_members
     WHERE workspace_id = $1 AND user_id = $2
     RETURNING workspace_id, user_id;`,
    [workspaceId, userId]
  );
  return result.rows[0] || null;
}
