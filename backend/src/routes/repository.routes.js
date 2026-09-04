import { Router } from "express";
import * as repoController from "../controllers/repository.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireWorkspaceMember } from "../middleware/workspace.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createRepositorySchema } from "../validators/repository.validator.js";

export const repositoryRouter = Router();

// Workspace-scoped repository routes
repositoryRouter.get(
  "/api/workspaces/:workspaceId/repositories",
  requireAuth,
  requireWorkspaceMember(),
  repoController.getRepositories
);

repositoryRouter.post(
  "/api/workspaces/:workspaceId/repositories",
  requireAuth,
  requireWorkspaceMember(["owner", "admin"]),
  validate(createRepositorySchema),
  repoController.createRepository
);

// Direct repository routes
repositoryRouter.get(
  "/api/repositories/:id",
  requireAuth,
  repoController.getRepository
);

repositoryRouter.delete(
  "/api/repositories/:id",
  requireAuth,
  repoController.deleteRepository
);
