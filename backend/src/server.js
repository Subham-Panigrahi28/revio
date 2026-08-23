import { app } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";

const server = app.listen(env.PORT, () => {
  logger.info(`Revio Backend API listening on port ${env.PORT} [${env.NODE_ENV}]`);
});

function handleShutdown(signal) {
  logger.info(`Received ${signal}. Gracefully shutting down Express server...`);
  server.close(() => {
    logger.info("Express HTTP server closed cleanly.");
    process.exit(0);
  });

  setTimeout(() => {
    logger.error("Forced shutdown after 10s timeout.");
    process.exit(1);
  }, 10000);
}

process.on("SIGTERM", () => handleShutdown("SIGTERM"));
process.on("SIGINT", () => handleShutdown("SIGINT"));
