import { withTransaction } from "../db/transaction.js";
import {
  createWorkspace,
  findWorkspaceById,
  findWorkspaceBySlug,
  findWorkspacesByUserId,
  updateWorkspace,
  deleteWorkspace,
} from "../db/repositories/workspaceRepository.js";
import {
  addMember,
  findMembersByWorkspaceId,
  updateMemberRole,
  removeMember,
} from "../db/repositories/workspaceMemberRepository.js";
import { createSubscription } from "../db/repositories/subscriptionRepository.js";
import { findUserByEmail } from "../db/repositories/userRepository.js";

export async function createNewWorkspace(userId, workspaceData) {
  const existingBySlug = await findWorkspaceBySlug(workspaceData.slug);
  if (existingBySlug) {
    const error = new Error("A workspace with this URL slug already exists.");
    error.status = 409;
    error.code = "SLUG_ALREADY_EXISTS";
    throw error;
  }

  return withTransaction(async (client) => {
    const workspace = await createWorkspace(
      {
        ownerId: userId,
        ...workspaceData,
      },
      client
    );

    // Auto-add creator as owner in workspace_members
    await addMember(
      {
        workspaceId: workspace.id,
        userId,
        role: "owner",
      },
      client
    );

    // Initialize default free subscription
    await createSubscription(
      {
        workspaceId: workspace.id,
        plan: "free",
        status: "active",
      },
      client
    );

    return workspace;
  });
}

export async function getUserWorkspaces(userId) {
  return findWorkspacesByUserId(userId);
}

export async function getWorkspaceById(workspaceId) {
  const workspace = await findWorkspaceById(workspaceId);
  if (!workspace) {
    const error = new Error("Workspace not found.");
    error.status = 404;
    error.code = "WORKSPACE_NOT_FOUND";
    throw error;
  }
  return workspace;
}

export async function updateWorkspaceSettings(workspaceId, updateData) {
  if (updateData.slug) {
    const existing = await findWorkspaceBySlug(updateData.slug);
    if (existing && String(existing.id) !== String(workspaceId)) {
      const error = new Error("A workspace with this URL slug already exists.");
      error.status = 409;
      error.code = "SLUG_ALREADY_EXISTS";
      throw error;
    }
  }

  const updated = await updateWorkspace(workspaceId, updateData);
  if (!updated) {
    const error = new Error("Workspace not found.");
    error.status = 404;
    error.code = "WORKSPACE_NOT_FOUND";
    throw error;
  }
  return updated;
}

export async function getWorkspaceMembers(workspaceId) {
  return findMembersByWorkspaceId(workspaceId);
}

export async function addWorkspaceMember(workspaceId, email, role = "member") {
  const user = await findUserByEmail(email);
  if (!user) {
    const error = new Error("No registered user found with this email address.");
    error.status = 404;
    error.code = "USER_NOT_FOUND";
    throw error;
  }

  return addMember({
    workspaceId,
    userId: user.id,
    role,
  });
}

export async function changeMemberRole(workspaceId, targetUserId, newRole) {
  const workspace = await findWorkspaceById(workspaceId);
  if (!workspace) {
    const error = new Error("Workspace not found.");
    error.status = 404;
    error.code = "WORKSPACE_NOT_FOUND";
    throw error;
  }

  if (String(workspace.owner_id) === String(targetUserId)) {
    const error = new Error("The workspace owner role cannot be modified.");
    error.status = 400;
    error.code = "CANNOT_MODIFY_OWNER";
    throw error;
  }

  const updated = await updateMemberRole(workspaceId, targetUserId, newRole);
  if (!updated) {
    const error = new Error("Member not found in this workspace.");
    error.status = 404;
    error.code = "MEMBER_NOT_FOUND";
    throw error;
  }
  return updated;
}

export async function removeWorkspaceMember(workspaceId, targetUserId) {
  const workspace = await findWorkspaceById(workspaceId);
  if (!workspace) {
    const error = new Error("Workspace not found.");
    error.status = 404;
    error.code = "WORKSPACE_NOT_FOUND";
    throw error;
  }

  if (String(workspace.owner_id) === String(targetUserId)) {
    const error = new Error("The workspace owner cannot be removed.");
    error.status = 400;
    error.code = "CANNOT_REMOVE_OWNER";
    throw error;
  }

  const removed = await removeMember(workspaceId, targetUserId);
  if (!removed) {
    const error = new Error("Member not found in this workspace.");
    error.status = 404;
    error.code = "MEMBER_NOT_FOUND";
    throw error;
  }
  return removed;
}
