import { Router } from "express";
import * as activityController from "../controllers/activity.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createActivitySchema,
  updateActivitySchema,
  assignActivitySchema,
} from "../validators/activity.validator.js";

export const activityRouter = Router();

// Repository activity streams
activityRouter.get(
  "/api/repositories/:repositoryId/activities",
  requireAuth,
  activityController.getActivities
);

activityRouter.get(
  "/api/repositories/:repositoryId/activities/unreleased",
  requireAuth,
  activityController.getUnreleasedActivities
);

activityRouter.get(
  "/api/repositories/:repositoryId/activities/ignored",
  requireAuth,
  activityController.getIgnoredActivities
);

activityRouter.post(
  "/api/repositories/:repositoryId/activities",
  requireAuth,
  validate(createActivitySchema),
  activityController.createActivity
);

// Individual activity actions
activityRouter.patch(
  "/api/activities/:id",
  requireAuth,
  validate(updateActivitySchema),
  activityController.updateActivity
);

activityRouter.post(
  "/api/activities/:id/assign",
  requireAuth,
  validate(assignActivitySchema),
  activityController.assignActivity
);

activityRouter.post(
  "/api/activities/:id/unassign",
  requireAuth,
  activityController.unassignActivity
);
