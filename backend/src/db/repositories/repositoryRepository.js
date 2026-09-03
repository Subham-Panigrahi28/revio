import { pool } from "../pool.js";

export async function createRepository(
  { workspaceId, githubRepoId, name, fullName, defaultBranch = "main" },
  dbClient = pool
) {
  const result = await dbClient.query(
    `INSERT INTO repositories (workspace_id, github_repo_id, name, full_name, default_branch)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (workspace_id, github_repo_id)
     DO UPDATE SET name = EXCLUDED.name,
                   full_name = EXCLUDED.full_name,
                   default_branch = EXCLUDED.default_branch,
                   updated_at = CURRENT_TIMESTAMP
     RETURNING id, workspace_id, github_repo_id, name, full_name, default_branch, created_at, updated_at;`,
    [workspaceId, githubRepoId, name, fullName, defaultBranch]
  );
  return result.rows[0];
}

export async function findRepositoryById(id, dbClient = pool) {
  const result = await dbClient.query(
    `SELECT id, workspace_id, github_repo_id, name, full_name, default_branch, created_at, updated_at
     FROM repositories
     WHERE id = $1;`,
    [id]
  );
  return result.rows[0] || null;
}

export async function findRepositoriesByWorkspaceId(workspaceId, dbClient = pool) {
  const result = await dbClient.query(
    `SELECT id, workspace_id, github_repo_id, name, full_name, default_branch, created_at, updated_at
     FROM repositories
     WHERE workspace_id = $1
     ORDER BY created_at DESC;`,
    [workspaceId]
  );
  return result.rows;
}

export async function findRepositoryByGithubId(workspaceId, githubRepoId, dbClient = pool) {
  const result = await dbClient.query(
    `SELECT id, workspace_id, github_repo_id, name, full_name, default_branch, created_at, updated_at
     FROM repositories
     WHERE workspace_id = $1 AND github_repo_id = $2;`,
    [workspaceId, githubRepoId]
  );
  return result.rows[0] || null;
}

export async function deleteRepository(id, dbClient = pool) {
  const result = await dbClient.query(
    `DELETE FROM repositories
     WHERE id = $1
     RETURNING id;`,
    [id]
  );
  return result.rows[0] || null;
}