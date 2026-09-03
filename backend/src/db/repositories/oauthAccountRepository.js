import { pool } from "../pool.js";

export async function createOAuthAccount(
  { userId, provider, providerUserId, username, avatarUrl = null, accessToken = null },
  dbClient = pool
) {
  const result = await dbClient.query(
    `INSERT INTO oauth_accounts (user_id, provider, provider_user_id, username, avatar_url, access_token)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (provider, provider_user_id)
     DO UPDATE SET username = EXCLUDED.username,
                   avatar_url = EXCLUDED.avatar_url,
                   access_token = EXCLUDED.access_token,
                   updated_at = CURRENT_TIMESTAMP
     RETURNING id, user_id, provider, provider_user_id, username, avatar_url, created_at, updated_at;`,
    [userId, provider, String(providerUserId), username, avatarUrl, accessToken]
  );
  return result.rows[0];
}

export async function findOAuthAccount(provider, providerUserId, dbClient = pool) {
  const result = await dbClient.query(
    `SELECT id, user_id, provider, provider_user_id, username, avatar_url, created_at, updated_at
     FROM oauth_accounts
     WHERE provider = $1 AND provider_user_id = $2;`,
    [provider, String(providerUserId)]
  );
  return result.rows[0] || null;
}

export async function findOAuthAccountsByUserId(userId, dbClient = pool) {
  const result = await dbClient.query(
    `SELECT id, user_id, provider, provider_user_id, username, avatar_url, created_at, updated_at
     FROM oauth_accounts
     WHERE user_id = $1
     ORDER BY created_at ASC;`,
    [userId]
  );
  return result.rows;
}
