import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { requestLogger } from "./middleware/logger.middleware.js";
import { notFoundHandler, errorHandler } from "./middleware/error.middleware.js";
import { healthRouter } from "./routes/health.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { workspaceRouter } from "./routes/workspace.routes.js";
import { repositoryRouter } from "./routes/repository.routes.js";
import { activityRouter } from "./routes/activity.routes.js";
import { releaseRouter } from "./routes/release.routes.js";

export const app = express();

app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

// System Health & Liveness
app.use(healthRouter);

// Domain Application Routes
app.use(authRouter);
app.use(workspaceRouter);
app.use(repositoryRouter);
app.use(activityRouter);
app.use(releaseRouter);

// Error Handling Lifecycle
app.use(notFoundHandler);
app.use(errorHandler);
