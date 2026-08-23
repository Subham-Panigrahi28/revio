import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { requestLogger } from "./middleware/logger.middleware.js";
import { notFoundHandler, errorHandler } from "./middleware/error.middleware.js";
import { healthRouter } from "./routes/health.routes.js";

export const app = express();

app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(requestLogger);

app.use(healthRouter);

app.use(notFoundHandler);
app.use(errorHandler);
