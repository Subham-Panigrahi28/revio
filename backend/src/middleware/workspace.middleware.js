import { findWorkspaceById } from "../db/repositories/workspaceRepository.js";
import { findMember } from "../db/repositories/workspaceMemberRepository.js";

/**
 * Middleware that guarantees the authenticated user is an authorized member
 * of the workspace referenced by req.params.workspaceId (or req.params.id for workspace routes).
 *
 * @param {Array<string>} [allowedRoles] - Optional allowed roles (e.g. ['owner', 'admin'])
 */
export function requireWorkspaceMember(allowedRoles = null) {
  return async (req, res, next) => {
    try {
      const workspaceId =
        req.params.workspaceId || req.params.id || req.body?.workspaceId;

      if (!workspaceId) {
        return res.status(400).json({
          success: false,
          error: {
            code: "MISSING_WORKSPACE_ID",
            message: "Workspace ID parameter is required.",
          },
        });
      }

      const workspace = await findWorkspaceById(workspaceId);
      if (!workspace) {
        return res.status(404).json({
          success: false,
          error: {
            code: "WORKSPACE_NOT_FOUND",
            message: "The requested workspace does not exist.",
          },
        });
      }

      // Check membership
      const membership = await findMember(workspace.id, req.user.id);
      const isOwner = String(workspace.owner_id) === String(req.user.id);

      if (!membership && !isOwner) {
        return res.status(403).json({
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "You do not have access to this workspace.",
          },
        });
      }

      const effectiveRole = isOwner ? "owner" : membership?.role || "member";

      if (allowedRoles && !allowedRoles.includes(effectiveRole)) {
        return res.status(403).json({
          success: false,
          error: {
            code: "INSUFFICIENT_PERMISSIONS",
            message: `This action requires one of the following roles: ${allowedRoles.join(", ")}.`,
          },
        });
      }

      req.workspace = workspace;
      req.workspaceMembership = {
        role: effectiveRole,
      };

      next();
    } catch (err) {
      next(err);
    }
  };
}
