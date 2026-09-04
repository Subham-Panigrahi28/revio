import * as workspaceService from "../services/workspace.service.js";

export async function createWorkspace(req, res, next) {
  try {
    const workspace = await workspaceService.createNewWorkspace(
      req.user.id,
      req.body
    );

    res.status(201).json({
      success: true,
      data: { workspace },
    });
  } catch (err) {
    next(err);
  }
}

export async function getWorkspaces(req, res, next) {
  try {
    const workspaces = await workspaceService.getUserWorkspaces(req.user.id);
    res.status(200).json({
      success: true,
      data: { workspaces },
    });
  } catch (err) {
    next(err);
  }
}

export async function getWorkspace(req, res, next) {
  try {
    res.status(200).json({
      success: true,
      data: { workspace: req.workspace },
    });
  } catch (err) {
    next(err);
  }
}

export async function updateWorkspace(req, res, next) {
  try {
    const updated = await workspaceService.updateWorkspaceSettings(
      req.workspace.id,
      req.body
    );

    res.status(200).json({
      success: true,
      data: { workspace: updated },
    });
  } catch (err) {
    next(err);
  }
}

export async function getMembers(req, res, next) {
  try {
    const members = await workspaceService.getWorkspaceMembers(req.workspace.id);
    res.status(200).json({
      success: true,
      data: { members },
    });
  } catch (err) {
    next(err);
  }
}

export async function addMember(req, res, next) {
  try {
    const { email, role } = req.body;
    const member = await workspaceService.addWorkspaceMember(
      req.workspace.id,
      email,
      role
    );

    res.status(201).json({
      success: true,
      data: { member },
    });
  } catch (err) {
    next(err);
  }
}

export async function updateMember(req, res, next) {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    const member = await workspaceService.changeMemberRole(
      req.workspace.id,
      userId,
      role
    );

    res.status(200).json({
      success: true,
      data: { member },
    });
  } catch (err) {
    next(err);
  }
}

export async function removeMember(req, res, next) {
  try {
    const { userId } = req.params;
    await workspaceService.removeWorkspaceMember(req.workspace.id, userId);

    res.status(200).json({
      success: true,
      message: "Member removed successfully from workspace.",
    });
  } catch (err) {
    next(err);
  }
}
