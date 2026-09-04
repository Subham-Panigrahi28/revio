import { Router } from "express";
import * as workspaceController from "../controllers/workspace.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireWorkspaceMember } from "../middleware/workspace.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
  addMemberSchema,
  updateMemberRoleSchema,
} from "../validators/workspace.validator.js";

export const workspaceRouter = Router();

// All workspace routes require authentication
workspaceRouter.use("/api/workspaces", requireAuth);

workspaceRouter.get(
  "/api/workspaces",
  workspaceController.getWorkspaces
);

workspaceRouter.post(
  "/api/workspaces",
  validate(createWorkspaceSchema),
  workspaceController.createWorkspace
);

workspaceRouter.get(
  "/api/workspaces/:id",
  requireWorkspaceMember(),
  workspaceController.getWorkspace
);

workspaceRouter.patch(
  "/api/workspaces/:id",
  requireWorkspaceMember(["owner", "admin"]),
  validate(updateWorkspaceSchema),
  workspaceController.updateWorkspace
);

// Members
workspaceRouter.get(
  "/api/workspaces/:id/members",
  requireWorkspaceMember(),
  workspaceController.getMembers
);

workspaceRouter.post(
  "/api/workspaces/:id/members",
  requireWorkspaceMember(["owner", "admin"]),
  validate(addMemberSchema),
  workspaceController.addMember
);

workspaceRouter.patch(
  "/api/workspaces/:id/members/:userId",
  requireWorkspaceMember(["owner", "admin"]),
  validate(updateMemberRoleSchema),
  workspaceController.updateMember
);

workspaceRouter.delete(
  "/api/workspaces/:id/members/:userId",
  requireWorkspaceMember(["owner", "admin"]),
  workspaceController.removeMember
);
