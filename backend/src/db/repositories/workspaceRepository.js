import { pool } from "../pool.js";

export async function createWorkspace(
  {
    ownerId,
    name,
    slug,
    url = null,
    apiKey = null,
    webhookSecret = null,
    widgetSettings = { theme: "dark", accentColor: "#FF7442", mode: "floating" },
  },
  dbClient = pool
) {
  const result = await dbClient.query(
    `INSERT INTO workspaces (owner_id, name, slug, url, api_key, webhook_secret, widget_settings)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, owner_id, name, slug, url, api_key, webhook_secret, widget_settings, created_at, updated_at;`,
    [
      ownerId,
      name,
      slug.toLowerCase().trim(),
      url,
      apiKey,
      webhookSecret,
      JSON.stringify(widgetSettings),
    ]
  );
  return result.rows[0];
}

export async function findWorkspaceById(id, dbClient = pool) {
  const result = await dbClient.query(
    `SELECT id, owner_id, name, slug, url, api_key, webhook_secret, widget_settings, created_at, updated_at
     FROM workspaces
     WHERE id = $1;`,
    [id]
  );
  return result.rows[0] || null;
}

export async function findWorkspaceBySlug(slug, dbClient = pool) {
  const result = await dbClient.query(
    `SELECT id, owner_id, name, slug, url, api_key, webhook_secret, widget_settings, created_at, updated_at
     FROM workspaces
     WHERE slug = $1;`,
    [slug.toLowerCase().trim()]
  );
  return result.rows[0] || null;
}

export async function findWorkspacesByOwnerId(ownerId, dbClient = pool) {
  const result = await dbClient.query(
    `SELECT id, owner_id, name, slug, url, api_key, webhook_secret, widget_settings, created_at, updated_at
     FROM workspaces
     WHERE owner_id = $1
     ORDER BY created_at DESC;`,
    [ownerId]
  );
  return result.rows;
}

export async function findWorkspacesByUserId(userId, dbClient = pool) {
  const result = await dbClient.query(
    `SELECT w.id, w.owner_id, w.name, w.slug, w.url, w.api_key, w.webhook_secret, w.widget_settings, w.created_at, w.updated_at, wm.role
     FROM workspaces w
     INNER JOIN workspace_members wm ON w.id = wm.workspace_id
     WHERE wm.user_id = $1
     ORDER BY w.created_at DESC;`,
    [userId]
  );
  return result.rows;
}

export async function updateWorkspace(
  id,
  { name, slug, url, apiKey, webhookSecret, widgetSettings },
  dbClient = pool
) {
  const result = await dbClient.query(
    `UPDATE workspaces
     SET name = COALESCE($1, name),
         slug = COALESCE($2, slug),
         url = COALESCE($3, url),
         api_key = COALESCE($4, api_key),
         webhook_secret = COALESCE($5, webhook_secret),
         widget_settings = COALESCE($6, widget_settings),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $7
     RETURNING id, owner_id, name, slug, url, api_key, webhook_secret, widget_settings, created_at, updated_at;`,
    [
      name,
      slug ? slug.toLowerCase().trim() : null,
      url,
      apiKey,
      webhookSecret,
      widgetSettings ? JSON.stringify(widgetSettings) : null,
      id,
    ]
  );
  return result.rows[0] || null;
}

export async function deleteWorkspace(id, dbClient = pool) {
  const result = await dbClient.query(
    `DELETE FROM workspaces
     WHERE id = $1
     RETURNING id;`,
    [id]
  );
  return result.rows[0] || null;
}