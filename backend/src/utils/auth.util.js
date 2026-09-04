import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const SALT_ROUNDS = 12;

export async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password, hash) {
  if (!hash) return false;
  return bcrypt.compare(password, hash);
}

export function generateToken(user) {
  const payload = {
    userId: String(user.id),
    email: user.email,
  };
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

export function verifyToken(token) {
  return jwt.verify(token, env.JWT_SECRET);
}

export function sanitizeUser(user) {
  if (!user) return null;
  const { password_hash, ...sanitized } = user;
  return sanitized;
}
