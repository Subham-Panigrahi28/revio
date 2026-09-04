import { withTransaction } from "../db/transaction.js";
import {
  createRelease,
  findReleasesByRepositoryId,
  findReleasesByStatus,
  updateRelease,
  publishRelease,
  deleteRelease,
  createReleaseChange,
  updateReleaseChange,
  deleteReleaseChange,
} from "../db/repositories/releaseRepository.js";
import { assignActivityToRelease } from "../db/repositories/activityRepository.js";
import {
  ensureRepositoryAccess,
  ensureReleaseAccess,
  ensureReleaseChangeAccess,
  ensureActivityAccess,
} from "./authorization.helper.js";

export async function createNewRelease(repositoryId, releaseData, userId) {
  await ensureRepositoryAccess(repositoryId, userId);

  const { changes, ...headerData } = releaseData;

  return withTransaction(async (client) => {
    const release = await createRelease(
      {
        repositoryId,
        ...headerData,
      },
      client
    );

    const createdChanges = [];
    if (changes && Array.isArray(changes) && changes.length > 0) {
      for (let i = 0; i < changes.length; i++) {
        const change = changes[i];
        const createdChange = await createReleaseChange(
          {
            releaseId: release.id,
            category: change.category,
            title: change.title,
            body: change.body,
            displayOrder: change.displayOrder ?? i + 1,
          },
          client
        );
        createdChanges.push(createdChange);
      }
    }

    release.changes = createdChanges;
    return release;
  });
}

export async function getReleaseById(releaseId, userId) {
  const { release } = await ensureReleaseAccess(releaseId, userId);
  return release;
}

export async function getReleasesByRepository(repositoryId, status, userId) {
  await ensureRepositoryAccess(repositoryId, userId);
  if (status) {
    return findReleasesByStatus(repositoryId, status);
  }
  return findReleasesByRepositoryId(repositoryId);
}

export async function updateReleaseMetadata(releaseId, updateData, userId) {
  await ensureReleaseAccess(releaseId, userId);
  return updateRelease(releaseId, updateData);
}

export async function publishReleaseDraft(releaseId, userId) {
  const { release } = await ensureReleaseAccess(releaseId, userId, ["owner", "admin"]);
  if (release.status === "published") {
    return release;
  }
  return publishRelease(releaseId);
}

export async function removeRelease(releaseId, userId) {
  await ensureReleaseAccess(releaseId, userId, ["owner", "admin"]);
  return deleteRelease(releaseId);
}

// --- Release Changes Operations ---

export async function addChangeToRelease(releaseId, changeData, userId) {
  await ensureReleaseAccess(releaseId, userId);
  return createReleaseChange({
    releaseId,
    ...changeData,
  });
}

export async function updateChangeItem(releaseId, changeId, updateData, userId) {
  await ensureReleaseChangeAccess(releaseId, changeId, userId);
  return updateReleaseChange(changeId, updateData);
}

export async function removeChangeItem(releaseId, changeId, userId) {
  await ensureReleaseChangeAccess(releaseId, changeId, userId);
  return deleteReleaseChange(changeId);
}

// --- Batch Activity Assignment with Atomic Transaction ---

export async function batchAssignActivitiesToRelease(releaseId, activityIds, userId) {
  await ensureReleaseAccess(releaseId, userId);

  // Pre-validate that user has access to all activities before transaction
  for (const activityId of activityIds) {
    await ensureActivityAccess(activityId, userId);
  }

  return withTransaction(async (client) => {
    const assigned = [];
    for (const activityId of activityIds) {
      const result = await assignActivityToRelease(activityId, releaseId, client);
      if (result) assigned.push(result);
    }
    return assigned;
  });
}
