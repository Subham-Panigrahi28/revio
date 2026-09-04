import {
  createActivity,
  findActivitiesByRepositoryId,
  findUnreleasedActivities,
  findIgnoredActivities,
  assignActivityToRelease,
  removeActivityFromRelease,
  toggleActivityIgnore,
} from "../db/repositories/activityRepository.js";
import {
  ensureRepositoryAccess,
  ensureActivityAccess,
  ensureReleaseAccess,
} from "./authorization.helper.js";

export async function createRepositoryActivity(repositoryId, activityData, userId) {
  await ensureRepositoryAccess(repositoryId, userId);
  return createActivity({
    repositoryId,
    ...activityData,
  });
}

export async function getActivitiesByRepository(repositoryId, userId) {
  await ensureRepositoryAccess(repositoryId, userId);
  return findActivitiesByRepositoryId(repositoryId);
}

export async function getUnreleasedActivities(repositoryId, userId) {
  await ensureRepositoryAccess(repositoryId, userId);
  return findUnreleasedActivities(repositoryId);
}

export async function getIgnoredActivities(repositoryId, userId) {
  await ensureRepositoryAccess(repositoryId, userId);
  return findIgnoredActivities(repositoryId);
}

export async function getActivityById(activityId, userId) {
  const { activity } = await ensureActivityAccess(activityId, userId);
  return activity;
}

export async function updateActivityIgnoreState(activityId, isIgnored, ignoreReason, userId) {
  await ensureActivityAccess(activityId, userId);
  return toggleActivityIgnore(activityId, isIgnored, ignoreReason);
}

export async function assignActivity(activityId, releaseId, userId) {
  await ensureActivityAccess(activityId, userId);
  await ensureReleaseAccess(releaseId, userId);
  return assignActivityToRelease(activityId, releaseId);
}

export async function unassignActivity(activityId, userId) {
  await ensureActivityAccess(activityId, userId);
  return removeActivityFromRelease(activityId);
}
