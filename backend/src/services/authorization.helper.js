import { findWorkspaceById } from "../db/repositories/workspaceRepository.js";
import { findMember } from "../db/repositories/workspaceMemberRepository.js";
import { findRepositoryById } from "../db/repositories/repositoryRepository.js";
import { findActivityById } from "../db/repositories/activityRepository.js";
import {
  findReleaseById,
  findReleaseChangesByReleaseId,
} from "../db/repositories/releaseRepository.js";

/**
 * Validates that a user has membership access and required role on a workspace.
 */
export async function ensureWorkspaceAccess(
  workspaceId,
  userId,
  allowedRoles = null
) {
  const workspace = await findWorkspaceById(workspaceId);
  if (!workspace) {
    const err = new Error("Workspace not found.");
    err.status = 404;
    err.code = "WORKSPACE_NOT_FOUND";
    throw err;
  }

  const isOwner = String(workspace.owner_id) === String(userId);
  const membership = await findMember(workspace.id, userId);

  if (!membership && !isOwner) {
    const err = new Error("You do not have access to this workspace.");
    err.status = 403;
    err.code = "FORBIDDEN";
    throw err;
  }

  const effectiveRole = isOwner ? "owner" : membership?.role || "member";

  if (allowedRoles && !allowedRoles.includes(effectiveRole)) {
    const err = new Error(
      `This action requires one of the following roles: ${allowedRoles.join(", ")}.`
    );
    err.status = 403;
    err.code = "INSUFFICIENT_PERMISSIONS";
    throw err;
  }

  return { workspace, role: effectiveRole };
}

/**
 * Validates that a user has access to the workspace that owns the repository.
 */
export async function ensureRepositoryAccess(
  repositoryId,
  userId,
  allowedRoles = null
) {
  const repository = await findRepositoryById(repositoryId);
  if (!repository) {
    const err = new Error("Repository not found.");
    err.status = 404;
    err.code = "REPOSITORY_NOT_FOUND";
    throw err;
  }

  const { workspace, role } = await ensureWorkspaceAccess(
    repository.workspace_id,
    userId,
    allowedRoles
  );

  return { repository, workspace, role };
}

/**
 * Validates that a user has access to the workspace that owns the repository that owns the activity.
 */
export async function ensureActivityAccess(
  activityId,
  userId,
  allowedRoles = null
) {
  const activity = await findActivityById(activityId);
  if (!activity) {
    const err = new Error("Activity not found.");
    err.status = 404;
    err.code = "ACTIVITY_NOT_FOUND";
    throw err;
  }

  const { repository, workspace, role } = await ensureRepositoryAccess(
    activity.repository_id,
    userId,
    allowedRoles
  );

  return { activity, repository, workspace, role };
}

/**
 * Validates that a user has access to the workspace that owns the repository that owns the release.
 */
export async function ensureReleaseAccess(
  releaseId,
  userId,
  allowedRoles = null
) {
  const release = await findReleaseById(releaseId);
  if (!release) {
    const err = new Error("Release not found.");
    err.status = 404;
    err.code = "RELEASE_NOT_FOUND";
    throw err;
  }

  const { repository, workspace, role } = await ensureRepositoryAccess(
    release.repository_id,
    userId,
    allowedRoles
  );

  return { release, repository, workspace, role };
}

/**
 * Validates that a user has access to a specific release change sub-resource.
 */
export async function ensureReleaseChangeAccess(
  releaseId,
  changeId,
  userId,
  allowedRoles = null
) {
  const { release, repository, workspace, role } = await ensureReleaseAccess(
    releaseId,
    userId,
    allowedRoles
  );

  const changes = await findReleaseChangesByReleaseId(releaseId);
  const change = changes.find((c) => String(c.id) === String(changeId));

  if (!change) {
    const err = new Error("Release change not found.");
    err.status = 404;
    err.code = "CHANGE_NOT_FOUND";
    throw err;
  }

  return { change, release, repository, workspace, role };
}
