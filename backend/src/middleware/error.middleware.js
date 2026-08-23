import { logger } from "../utils/logger.js";

export function notFoundHandler(req, res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.status = 404;
  error.code = "NOT_FOUND";
  next(error);
}

export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const code = err.code || "INTERNAL_SERVER_ERROR";
  const message = err.message || "An unexpected server error occurred.";

  if (status >= 500) {
    logger.error(`[${code}] ${message}`, { stack: err.stack, url: req.originalUrl });
  } else {
    logger.warn(`Operational error on ${req.method} ${req.originalUrl}: [${code}] ${message}`);
  }

  res.status(status).json({
    success: false,
    error: {
      code,
      message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
}
