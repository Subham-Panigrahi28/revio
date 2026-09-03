import { pool } from "../pool.js";

export async function createRelease(
  {
    repositoryId,
    version,
    title,
    summary = null,
    content = null,
    status = "draft",
    generatedAt = new Date(),
  },
  dbClient = pool
) {
  const result = await dbClient.query(
    `INSERT INTO releases (repository_id, version, title, summary, content, status, generated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, repository_id, version, title, summary, content, status, generated_at, published_at, created_at, updated_at;`,
    [repositoryId, version, title, summary, content, status, generatedAt]
  );
  return result.rows[0];
}

export async function findReleaseById(id, dbClient = pool) {
  const releaseResult = await dbClient.query(
    `SELECT id, repository_id, version, title, summary, content, status, generated_at, published_at, created_at, updated_at
     FROM releases
     WHERE id = $1;`,
    [id]
  );

  const release = releaseResult.rows[0] || null;
  if (!release) return null;

  const changesResult = await dbClient.query(
    `SELECT id, release_id, category, title, body, display_order, created_at, updated_at
     FROM release_changes
     WHERE release_id = $1
     ORDER BY display_order ASC, created_at ASC;`,
    [id]
  );

  release.changes = changesResult.rows;
  return release;
}

export async function findReleasesByRepositoryId(repositoryId, dbClient = pool) {
  const result = await dbClient.query(
    `SELECT id, repository_id, version, title, summary, content, status, generated_at, published_at, created_at, updated_at
     FROM releases
     WHERE repository_id = $1
     ORDER BY created_at DESC;`,
    [repositoryId]
  );
  return result.rows;
}

export async function findReleasesByStatus(repositoryId, status, dbClient = pool) {
  const result = await dbClient.query(
    `SELECT id, repository_id, version, title, summary, content, status, generated_at, published_at, created_at, updated_at
     FROM releases
     WHERE repository_id = $1 AND status = $2
     ORDER BY created_at DESC;`,
    [repositoryId, status]
  );
  return result.rows;
}

export async function updateRelease(
  id,
  { title, summary, content, status },
  dbClient = pool
) {
  const result = await dbClient.query(
    `UPDATE releases
     SET title = COALESCE($1, title),
         summary = COALESCE($2, summary),
         content = COALESCE($3, content),
         status = COALESCE($4, status),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $5
     RETURNING id, repository_id, version, title, summary, content, status, generated_at, published_at, created_at, updated_at;`,
    [title, summary, content, status, id]
  );
  return result.rows[0] || null;
}

export async function publishRelease(id, dbClient = pool) {
  const result = await dbClient.query(
    `UPDATE releases
     SET status = 'published',
         published_at = CURRENT_TIMESTAMP,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING id, repository_id, version, title, summary, content, status, generated_at, published_at, created_at, updated_at;`,
    [id]
  );
  return result.rows[0] || null;
}

export async function deleteRelease(id, dbClient = pool) {
  const result = await dbClient.query(
    `DELETE FROM releases
     WHERE id = $1
     RETURNING id;`,
    [id]
  );
  return result.rows[0] || null;
}

// --- Release Changes Sub-Entity Operations ---

export async function createReleaseChange(
  { releaseId, category, title, body = null, displayOrder = 0 },
  dbClient = pool
) {
  const result = await dbClient.query(
    `INSERT INTO release_changes (release_id, category, title, body, display_order)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, release_id, category, title, body, display_order, created_at, updated_at;`,
    [releaseId, category, title, body, displayOrder]
  );
  return result.rows[0];
}

export async function updateReleaseChange(
  id,
  { category, title, body, displayOrder },
  dbClient = pool
) {
  const result = await dbClient.query(
    `UPDATE release_changes
     SET category = COALESCE($1, category),
         title = COALESCE($2, title),
         body = COALESCE($3, body),
         display_order = COALESCE($4, display_order),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $5
     RETURNING id, release_id, category, title, body, display_order, created_at, updated_at;`,
    [category, title, body, displayOrder, id]
  );
  return result.rows[0] || null;
}

export async function deleteReleaseChange(id, dbClient = pool) {
  const result = await dbClient.query(
    `DELETE FROM release_changes
     WHERE id = $1
     RETURNING id, release_id;`,
    [id]
  );
  return result.rows[0] || null;
}

export async function findReleaseChangesByReleaseId(releaseId, dbClient = pool) {
  const result = await dbClient.query(
    `SELECT id, release_id, category, title, body, display_order, created_at, updated_at
     FROM release_changes
     WHERE release_id = $1
     ORDER BY display_order ASC, created_at ASC;`,
    [releaseId]
  );
  return result.rows;
}