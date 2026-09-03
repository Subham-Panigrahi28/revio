import { Pool } from "pg";
import { env } from "../config/env.js";

const sslConfig =
  env.DB_SSL === "true" || env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false;

const poolConfig = env.DATABASE_URL
  ? {
      connectionString: env.DATABASE_URL,
      ssl: sslConfig,
    }
  : {
      host: env.DB_HOST,
      port: parseInt(env.DB_PORT, 10),
      database: env.DB_NAME,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      ssl: sslConfig,
    };

export const pool = new Pool(poolConfig);
export default pool;