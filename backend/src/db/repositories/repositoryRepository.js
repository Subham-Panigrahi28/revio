const pool = require("../pool");

async function createRepository(
    workspaceId,
    githubRepoId,
    name,
    fullName,
    defaultBranch
) {
    const result = await pool.query(
        `INSERT INTO repositories
            (workspace_id, github_repo_id, name, full_name, default_branch)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, workspace_id, github_repo_id, name,
                   full_name, default_branch, created_at, updated_at`,
        [workspaceId, githubRepoId, name, fullName, defaultBranch]
    );

    return result.rows[0];
}

async function findRepositoryById(id) {
    const result = await pool.query(
        `SELECT id, workspace_id, github_repo_id, name,
                full_name, default_branch, created_at, updated_at
         FROM repositories
         WHERE id = $1`,
        [id]
    );

    return result.rows[0] || null;
}

async function findRepositoriesByWorkspaceId(workspaceId) {
    const result = await pool.query(
        `SELECT id, workspace_id, github_repo_id, name,
                full_name, default_branch, created_at, updated_at
         FROM repositories
         WHERE workspace_id = $1
         ORDER BY created_at DESC`,
        [workspaceId]
    );

    return result.rows;
}

async function findRepositoryByGithubId(workspaceId, githubRepoId) {
    const result = await pool.query(
        `SELECT id, workspace_id, github_repo_id, name,
                full_name, default_branch, created_at, updated_at
         FROM repositories
         WHERE workspace_id = $1
           AND github_repo_id = $2`,
        [workspaceId, githubRepoId]
    );

    return result.rows[0] || null;
}

module.exports = {
    createRepository,
    findRepositoryById,
    findRepositoriesByWorkspaceId,
    findRepositoryByGithubId
};