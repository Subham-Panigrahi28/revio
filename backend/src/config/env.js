import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("5000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  CLIENT_URL: z.string().default("http://localhost:5173"),

  // Authentication
  JWT_SECRET: z.string().default("revio-dev-jwt-secret-key-32-chars-long"),
  JWT_EXPIRES_IN: z.string().default("7d"),

  // Database Connection
  DATABASE_URL: z.string().optional(),
  DB_HOST: z.string().default("localhost"),
  DB_PORT: z.string().default("5432"),
  DB_NAME: z.string().default("revio"),
  DB_USER: z.string().default("postgres"),
  DB_PASSWORD: z.string().default(""),
  DB_SSL: z.string().default("false"),
});

export const env = envSchema.parse(process.env);
