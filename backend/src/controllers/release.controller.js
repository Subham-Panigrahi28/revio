import * as releaseService from "../services/release.service.js";

export async function createRelease(req, res, next) {
  try {
    const { repositoryId } = req.params;
    const release = await releaseService.createNewRelease(
      repositoryId,
      req.body,
      req.user.id
    );

    res.status(201).json({
      success: true,
      data: { release },
    });
  } catch (err) {
    next(err);
  }
}

export async function getReleases(req, res, next) {
  try {
    const { repositoryId } = req.params;
    const { status } = req.query;

    const releases = await releaseService.getReleasesByRepository(
      repositoryId,
      status || null,
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: { releases },
    });
  } catch (err) {
    next(err);
  }
}

export async function getRelease(req, res, next) {
  try {
    const { id } = req.params;
    const release = await releaseService.getReleaseById(id, req.user.id);

    res.status(200).json({
      success: true,
      data: { release },
    });
  } catch (err) {
    next(err);
  }
}

export async function updateRelease(req, res, next) {
  try {
    const { id } = req.params;
    const release = await releaseService.updateReleaseMetadata(
      id,
      req.body,
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: { release },
    });
  } catch (err) {
    next(err);
  }
}

export async function publishRelease(req, res, next) {
  try {
    const { id } = req.params;
    const release = await releaseService.publishReleaseDraft(id, req.user.id);

    res.status(200).json({
      success: true,
      data: { release },
      message: "Release published successfully.",
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteRelease(req, res, next) {
  try {
    const { id } = req.params;
    await releaseService.removeRelease(id, req.user.id);

    res.status(200).json({
      success: true,
      message: "Release deleted successfully.",
    });
  } catch (err) {
    next(err);
  }
}

// --- Release Changes Handlers ---

export async function createReleaseChange(req, res, next) {
  try {
    const { releaseId } = req.params;
    const change = await releaseService.addChangeToRelease(
      releaseId,
      req.body,
      req.user.id
    );

    res.status(201).json({
      success: true,
      data: { change },
    });
  } catch (err) {
    next(err);
  }
}

export async function updateReleaseChange(req, res, next) {
  try {
    const { releaseId, changeId } = req.params;
    const change = await releaseService.updateChangeItem(
      releaseId,
      changeId,
      req.body,
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: { change },
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteReleaseChange(req, res, next) {
  try {
    const { releaseId, changeId } = req.params;
    await releaseService.removeChangeItem(
      releaseId,
      changeId,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message: "Release change removed successfully.",
    });
  } catch (err) {
    next(err);
  }
}

export async function batchAssignActivities(req, res, next) {
  try {
    const { id } = req.params;
    const { activityIds } = req.body;

    const assigned = await releaseService.batchAssignActivitiesToRelease(
      id,
      activityIds,
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: { assigned },
    });
  } catch (err) {
    next(err);
  }
}
