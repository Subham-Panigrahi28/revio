import * as repoService from "../services/repository.service.js";

export async function createRepository(req, res, next) {
  try {
    const { workspaceId } = req.params;
    const repository = await repoService.addRepositoryToWorkspace(
      workspaceId,
      req.body,
      req.user.id
    );

    res.status(201).json({
      success: true,
      data: { repository },
    });
  } catch (err) {
    next(err);
  }
}

export async function getRepositories(req, res, next) {
  try {
    const { workspaceId } = req.params;
    const repositories = await repoService.getRepositoriesForWorkspace(
      workspaceId,
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: { repositories },
    });
  } catch (err) {
    next(err);
  }
}

export async function getRepository(req, res, next) {
  try {
    const { id } = req.params;
    const repository = await repoService.getRepositoryById(id, req.user.id);

    res.status(200).json({
      success: true,
      data: { repository },
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteRepository(req, res, next) {
  try {
    const { id } = req.params;
    await repoService.removeRepository(id, req.user.id);

    res.status(200).json({
      success: true,
      message: "Repository removed successfully.",
    });
  } catch (err) {
    next(err);
  }
}
