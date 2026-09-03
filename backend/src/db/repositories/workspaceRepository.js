const pool = require("../pool");

async function createWorkspace(ownerId, name, slug) {
    const result = await pool.query(
        `INSERT INTO workspaces (owner_id, name, slug)
         VALUES ($1, $2, $3)
         RETURNING id, owner_id, name, slug, created_at, updated_at`,
        [ownerId, name, slug]
    );

    return result.rows[0];
}

async function findWorkspaceById(id) {
    const result = await pool.query(
        `SELECT id, owner_id, name, slug, created_at, updated_at
         FROM workspaces
         WHERE id = $1`,
        [id]
    );

    return result.rows[0] || null;
}

async function findWorkspaceBySlug(slug) {
    const result = await pool.query(
        `SELECT id, owner_id, name, slug, created_at, updated_at
         FROM workspaces
         WHERE slug = $1`,
        [slug]
    );

    return result.rows[0] || null;
}

async function findWorkspacesByOwnerId(ownerId) {
    const result = await pool.query(
        `SELECT id, owner_id, name, slug, created_at, updated_at
         FROM workspaces
         WHERE owner_id = $1
         ORDER BY created_at DESC`,
        [ownerId]
    );

    return result.rows;
}

module.exports = {
    createWorkspace,
    findWorkspaceById,
    findWorkspaceBySlug,
    findWorkspacesByOwnerId
};