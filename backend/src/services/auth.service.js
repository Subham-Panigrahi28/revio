import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../db/repositories/userRepository.js";
import {
  hashPassword,
  comparePassword,
  generateToken,
  sanitizeUser,
} from "../utils/auth.util.js";

export async function register({ name, email, password }) {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    const error = new Error("An account with this email address already exists.");
    error.status = 409;
    error.code = "EMAIL_ALREADY_EXISTS";
    throw error;
  }

  const passwordHash = await hashPassword(password);
  const user = await createUser({
    name,
    email,
    passwordHash,
  });

  const token = generateToken(user);

  return {
    user: sanitizeUser(user),
    token,
  };
}

export async function login({ email, password }) {
  const user = await findUserByEmail(email);
  if (!user || !user.password_hash) {
    const error = new Error("Invalid email or password.");
    error.status = 401;
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  const isMatch = await comparePassword(password, user.password_hash);
  if (!isMatch) {
    const error = new Error("Invalid email or password.");
    error.status = 401;
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  const token = generateToken(user);

  return {
    user: sanitizeUser(user),
    token,
  };
}

export async function getCurrentUser(userId) {
  const user = await findUserById(userId);
  if (!user) {
    const error = new Error("User not found.");
    error.status = 404;
    error.code = "USER_NOT_FOUND";
    throw error;
  }
  return sanitizeUser(user);
}
