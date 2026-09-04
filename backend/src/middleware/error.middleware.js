import { logger } from "../utils/logger.js";

export function notFoundHandler(req, res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.status = 404;
  error.code = "NOT_FOUND";
  next(error);
}

export function errorHandler(err, req, res, next) {
  let status = err.status || 500;
  let code = err.code || "INTERNAL_SERVER_ERROR";
  let message = err.message || "An unexpected server error occurred.";

  // PostgreSQL Error Mapping
  if (err.code === "23505") {
    // Unique violation
    status = 409;
    code = "DUPLICATE_RESOURCE";
    message = "A resource with these unique parameters already exists.";
  } else if (err.code === "23503") {
    // Foreign key violation
    status = 400;
    code = "INVALID_REFERENCE";
    message = "Referenced parent resource does not exist.";
  } else if (err.code === "22P02") {
    // Invalid input syntax (e.g. invalid integer/UUID)
    status = 400;
    code = "INVALID_PARAMETER_FORMAT";
    message = "One or more request parameters have an invalid format.";
  }

  if (status >= 500) {
    logger.error(`[${code}] ${message}`, {
      stack: err.stack,
      url: req.originalUrl,
      code: err.code,
    });
  } else {
    logger.warn(
      `Operational error on ${req.method} ${req.originalUrl}: [${code}] ${message}`
    );
  }

  res.status(status).json({
    success: false,
    error: {
      code,
      message,
      ...(process.env.NODE_ENV === "development" &&
        status >= 500 && { stack: err.stack }),
    },
  });
}
