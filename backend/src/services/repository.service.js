import {
  createRepository,
  findRepositoriesByWorkspaceId,
  deleteRepository,
} from "../db/repositories/repositoryRepository.js";
import {
  ensureWorkspaceAccess,
  ensureRepositoryAccess,
} from "./authorization.helper.js";

export async function addRepositoryToWorkspace(workspaceId, repoData, userId) {
  await ensureWorkspaceAccess(workspaceId, userId, ["owner", "admin"]);
  return createRepository({
    workspaceId,
    ...repoData,
  });
}

export async function getRepositoriesForWorkspace(workspaceId, userId) {
  await ensureWorkspaceAccess(workspaceId, userId);
  return findRepositoriesByWorkspaceId(workspaceId);
}

export async function getRepositoryById(repositoryId, userId) {
  const { repository } = await ensureRepositoryAccess(repositoryId, userId);
  return repository;
}

export async function removeRepository(repositoryId, userId) {
  await ensureRepositoryAccess(repositoryId, userId, ["owner", "admin"]);
  return deleteRepository(repositoryId);
}
