const pool = require("../pool");

async function createActivity(
    repositoryId,
    type,
    externalId,
    title,
    description,
    url,
    authorName,
    occurredAt
) {
    const result = await pool.query(
        `INSERT INTO activities
            (repository_id, type, external_id, title, description,
             url, author_name, occurred_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id, repository_id, type, external_id, title,
                   description, url, author_name, occurred_at,
                   created_at, release_id`,
        [
            repositoryId,
            type,
            externalId,
            title,
            description,
            url,
            authorName,
            occurredAt
        ]
    );

    return result.rows[0];
}

async function findActivityById(id) {
    const result = await pool.query(
        `SELECT id, repository_id, type, external_id, title,
                description, url, author_name, occurred_at,
                created_at, release_id
         FROM activities
         WHERE id = $1`,
        [id]
    );

    return result.rows[0] || null;
}

async function findActivityByExternalId(
    repositoryId,
    type,
    externalId
) {
    const result = await pool.query(
        `SELECT id, repository_id, type, external_id, title,
                description, url, author_name, occurred_at,
                created_at, release_id
         FROM activities
         WHERE repository_id = $1
           AND type = $2
           AND external_id = $3`,
        [repositoryId, type, externalId]
    );

    return result.rows[0] || null;
}

async function findActivitiesByRepositoryId(repositoryId) {
    const result = await pool.query(
        `SELECT id, repository_id, type, external_id, title,
                description, url, author_name, occurred_at,
                created_at, release_id
         FROM activities
         WHERE repository_id = $1
         ORDER BY occurred_at DESC`,
        [repositoryId]
    );

    return result.rows;
}

async function findUnreleasedActivities(repositoryId) {
    const result = await pool.query(
        `SELECT id, repository_id, type, external_id, title,
                description, url, author_name, occurred_at,
                created_at, release_id
         FROM activities
         WHERE repository_id = $1
           AND release_id IS NULL
         ORDER BY occurred_at DESC`,
        [repositoryId]
    );

    return result.rows;
}

async function assignActivityToRelease(activityId, releaseId) {
    const result = await pool.query(
        `UPDATE activities
         SET release_id = $1
         WHERE id = $2
         RETURNING id, repository_id, type, external_id,
                   title, description, url, author_name,
                   occurred_at, created_at, release_id`,
        [releaseId, activityId]
    );

    return result.rows[0] || null;
}

module.exports = {
    createActivity,
    findActivityById,
    findActivityByExternalId,
    findActivitiesByRepositoryId,
    findUnreleasedActivities,
    assignActivityToRelease
};