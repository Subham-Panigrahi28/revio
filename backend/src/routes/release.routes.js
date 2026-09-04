import { Router } from "express";
import * as releaseController from "../controllers/release.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createReleaseSchema,
  updateReleaseSchema,
  createReleaseChangeSchema,
  updateReleaseChangeSchema,
  assignMultipleActivitiesSchema,
} from "../validators/release.validator.js";

export const releaseRouter = Router();

// Repository release list & draft creation
releaseRouter.get(
  "/api/repositories/:repositoryId/releases",
  requireAuth,
  releaseController.getReleases
);

releaseRouter.post(
  "/api/repositories/:repositoryId/releases",
  requireAuth,
  validate(createReleaseSchema),
  releaseController.createRelease
);

// Release details & Studio operations
releaseRouter.get(
  "/api/releases/:id",
  requireAuth,
  releaseController.getRelease
);

releaseRouter.patch(
  "/api/releases/:id",
  requireAuth,
  validate(updateReleaseSchema),
  releaseController.updateRelease
);

releaseRouter.delete(
  "/api/releases/:id",
  requireAuth,
  releaseController.deleteRelease
);

// Publish action (domain operation)
releaseRouter.post(
  "/api/releases/:id/publish",
  requireAuth,
  releaseController.publishRelease
);

// Batch assign activities to release (transactional)
releaseRouter.post(
  "/api/releases/:id/assign-activities",
  requireAuth,
  validate(assignMultipleActivitiesSchema),
  releaseController.batchAssignActivities
);

// Release change items sub-resource
releaseRouter.post(
  "/api/releases/:releaseId/changes",
  requireAuth,
  validate(createReleaseChangeSchema),
  releaseController.createReleaseChange
);

releaseRouter.patch(
  "/api/releases/:releaseId/changes/:changeId",
  requireAuth,
  validate(updateReleaseChangeSchema),
  releaseController.updateReleaseChange
);

releaseRouter.delete(
  "/api/releases/:releaseId/changes/:changeId",
  requireAuth,
  releaseController.deleteReleaseChange
);
