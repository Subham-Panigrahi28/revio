import { pool } from "../pool.js";

/**
 * Creates a new user record.
 * Supports both password-based and passwordless OAuth users.
 */
export async function createUser(
  { name, email, passwordHash = null, avatarUrl = null },
  dbClient = pool
) {
  const result = await dbClient.query(
    `INSERT INTO users (name, email, password_hash, avatar_url)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, password_hash, avatar_url, created_at;`,
    [name, email.toLowerCase().trim(), passwordHash, avatarUrl]
  );
  return result.rows[0];
}

export async function findUserById(id, dbClient = pool) {
  const result = await dbClient.query(
    `SELECT id, name, email, password_hash, avatar_url, created_at
     FROM users
     WHERE id = $1;`,
    [id]
  );
  return result.rows[0] || null;
}

export async function findUserByEmail(email, dbClient = pool) {
  const result = await dbClient.query(
    `SELECT id, name, email, password_hash, avatar_url, created_at
     FROM users
     WHERE email = $1;`,
    [email.toLowerCase().trim()]
  );
  return result.rows[0] || null;
}

export async function updateUser(id, { name, avatarUrl }, dbClient = pool) {
  const result = await dbClient.query(
    `UPDATE users
     SET name = COALESCE($1, name),
         avatar_url = COALESCE($2, avatar_url)
     WHERE id = $3
     RETURNING id, name, email, password_hash, avatar_url, created_at;`,
    [name, avatarUrl, id]
  );
  return result.rows[0] || null;
}