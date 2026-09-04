import { verifyToken, sanitizeUser } from "../utils/auth.util.js";
import { findUserById } from "../db/repositories/userRepository.js";

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.slice(7).trim();
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication token required. Please log in.",
        },
      });
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (tokenErr) {
      return res.status(401).json({
        success: false,
        error: {
          code: "INVALID_TOKEN",
          message:
            tokenErr.name === "TokenExpiredError"
              ? "Session expired. Please log in again."
              : "Invalid authentication token.",
        },
      });
    }

    const user = await findUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: "USER_NOT_FOUND",
          message: "The user account associated with this token no longer exists.",
        },
      });
    }

    req.user = sanitizeUser(user);
    next();
  } catch (err) {
    next(err);
  }
}
