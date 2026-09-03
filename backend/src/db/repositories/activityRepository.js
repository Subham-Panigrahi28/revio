import { pool } from "../pool.js";

export async function createActivity(
  {
    repositoryId,
    type,
    externalId,
    title,
    description = null,
    url = null,
    authorName = null,
    occurredAt = new Date(),
    isIgnored = false,
    ignoreReason = null,
    trustBadge = "High confidence",
    branch = null,
    commitsCount = 1,
    metadata = {},
  },
  dbClient = pool
) {
  const result = await dbClient.query(
    `INSERT INTO activities
        (repository_id, type, external_id, title, description, url,
         author_name, occurred_at, is_ignored, ignore_reason,
         trust_badge, branch, commits_count, metadata)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
     ON CONFLICT (repository_id, type, external_id)
     DO UPDATE SET title = EXCLUDED.title,
                   description = EXCLUDED.description,
                   url = EXCLUDED.url,
                   author_name = EXCLUDED.author_name,
                   occurred_at = EXCLUDED.occurred_at,
                   branch = EXCLUDED.branch,
                   commits_count = EXCLUDED.commits_count,
                   metadata = EXCLUDED.metadata
     RETURNING id, repository_id, type, external_id, title, description,
               url, author_name, occurred_at, is_ignored, ignore_reason,
               trust_badge, branch, commits_count, metadata, created_at, release_id;`,
    [
      repositoryId,
      type,
      String(externalId),
      title,
      description,
      url,
      authorName,
      occurredAt,
      isIgnored,
      ignoreReason,
      trustBadge,
      branch,
      commitsCount,
      JSON.stringify(metadata),
    ]
  );
  return result.rows[0];
}

export async function findActivityById(id, dbClient = pool) {
  const result = await dbClient.query(
    `SELECT id, repository_id, type, external_id, title, description,
            url, author_name, occurred_at, is_ignored, ignore_reason,
            trust_badge, branch, commits_count, metadata, created_at, release_id
     FROM activities
     WHERE id = $1;`,
    [id]
  );
  return result.rows[0] || null;
}

export async function findActivityByExternalId(
  repositoryId,
  type,
  externalId,
  dbClient = pool
) {
  const result = await dbClient.query(
    `SELECT id, repository_id, type, external_id, title, description,
            url, author_name, occurred_at, is_ignored, ignore_reason,
            trust_badge, branch, commits_count, metadata, created_at, release_id
     FROM activities
     WHERE repository_id = $1 AND type = $2 AND external_id = $3;`,
    [repositoryId, type, String(externalId)]
  );
  return result.rows[0] || null;
}

export async function findActivitiesByRepositoryId(repositoryId, dbClient = pool) {
  const result = await dbClient.query(
    `SELECT id, repository_id, type, external_id, title, description,
            url, author_name, occurred_at, is_ignored, ignore_reason,
            trust_badge, branch, commits_count, metadata, created_at, release_id
     FROM activities
     WHERE repository_id = $1
     ORDER BY occurred_at DESC;`,
    [repositoryId]
  );
  return result.rows;
}

export async function findUnreleasedActivities(repositoryId, dbClient = pool) {
  const result = await dbClient.query(
    `SELECT id, repository_id, type, external_id, title, description,
            url, author_name, occurred_at, is_ignored, ignore_reason,
            trust_badge, branch, commits_count, metadata, created_at, release_id
     FROM activities
     WHERE repository_id = $1 AND release_id IS NULL AND is_ignored = false
     ORDER BY occurred_at DESC;`,
    [repositoryId]
  );
  return result.rows;
}

export async function findIgnoredActivities(repositoryId, dbClient = pool) {
  const result = await dbClient.query(
    `SELECT id, repository_id, type, external_id, title, description,
            url, author_name, occurred_at, is_ignored, ignore_reason,
            trust_badge, branch, commits_count, metadata, created_at, release_id
     FROM activities
     WHERE repository_id = $1 AND is_ignored = true
     ORDER BY occurred_at DESC;`,
    [repositoryId]
  );
  return result.rows;
}

export async function assignActivityToRelease(activityId, releaseId, dbClient = pool) {
  const result = await dbClient.query(
    `UPDATE activities
     SET release_id = $1
     WHERE id = $2
     RETURNING id, repository_id, type, external_id, title, description,
               url, author_name, occurred_at, is_ignored, ignore_reason,
               trust_badge, branch, commits_count, metadata, created_at, release_id;`,
    [releaseId, activityId]
  );
  return result.rows[0] || null;
}

export async function removeActivityFromRelease(activityId, dbClient = pool) {
  const result = await dbClient.query(
    `UPDATE activities
     SET release_id = NULL
     WHERE id = $1
     RETURNING id, repository_id, type, external_id, title, description,
               url, author_name, occurred_at, is_ignored, ignore_reason,
               trust_badge, branch, commits_count, metadata, created_at, release_id;`,
    [activityId]
  );
  return result.rows[0] || null;
}

export async function toggleActivityIgnore(
  activityId,
  isIgnored,
  ignoreReason = null,
  dbClient = pool
) {
  const result = await dbClient.query(
    `UPDATE activities
     SET is_ignored = $1,
         ignore_reason = $2
     WHERE id = $3
     RETURNING id, repository_id, type, external_id, title, description,
               url, author_name, occurred_at, is_ignored, ignore_reason,
               trust_badge, branch, commits_count, metadata, created_at, release_id;`,
    [isIgnored, ignoreReason, activityId]
  );
  return result.rows[0] || null;
}

export async function deleteActivity(id, dbClient = pool) {
  const result = await dbClient.query(
    `DELETE FROM activities
     WHERE id = $1
     RETURNING id;`,
    [id]
  );
  return result.rows[0] || null;
}