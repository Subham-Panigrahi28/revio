const pool = require("../pool");

async function createRelease(
    repositoryId,
    version,
    title,
    summary,
    content,
    status = "draft"
) {
    const result = await pool.query(
        `INSERT INTO releases
            (repository_id, version, title, summary, content, status)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, repository_id, version, title, summary,
                   content, status, generated_at, published_at,
                   created_at, updated_at`,
        [
            repositoryId,
            version,
            title,
            summary,
            content,
            status
        ]
    );

    return result.rows[0];
}

async function findReleaseById(id) {
    const result = await pool.query(
        `SELECT id, repository_id, version, title, summary,
                content, status, generated_at, published_at,
                created_at, updated_at
         FROM releases
         WHERE id = $1`,
        [id]
    );

    return result.rows[0] || null;
}

async function findReleasesByRepositoryId(repositoryId) {
    const result = await pool.query(
        `SELECT id, repository_id, version, title, summary,
                content, status, generated_at, published_at,
                created_at, updated_at
         FROM releases
         WHERE repository_id = $1
         ORDER BY created_at DESC`,
        [repositoryId]
    );

    return result.rows;
}

async function findReleasesByStatus(repositoryId, status) {
    const result = await pool.query(
        `SELECT id, repository_id, version, title, summary,
                content, status, generated_at, published_at,
                created_at, updated_at
         FROM releases
         WHERE repository_id = $1
           AND status = $2
         ORDER BY created_at DESC`,
        [repositoryId, status]
    );

    return result.rows;
}

async function updateRelease(
    id,
    title,
    summary,
    content,
    status
) {
    const result = await pool.query(
        `UPDATE releases
         SET title = $1,
             summary = $2,
             content = $3,
             status = $4,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $5
         RETURNING id, repository_id, version, title,
                   summary, content, status, generated_at,
                   published_at, created_at, updated_at`,
        [title, summary, content, status, id]
    );

    return result.rows[0] || null;
}

async function publishRelease(id) {
    const result = await pool.query(
        `UPDATE releases
         SET status = 'published',
             published_at = CURRENT_TIMESTAMP,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING id, repository_id, version, title,
                   summary, content, status, generated_at,
                   published_at, created_at, updated_at`,
        [id]
    );

    return result.rows[0] || null;
}

module.exports = {
    createRelease,
    findReleaseById,
    findReleasesByRepositoryId,
    findReleasesByStatus,
    updateRelease,
    publishRelease
};