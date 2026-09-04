import * as activityService from "../services/activity.service.js";

export async function createActivity(req, res, next) {
  try {
    const { repositoryId } = req.params;
    const activity = await activityService.createRepositoryActivity(
      repositoryId,
      req.body,
      req.user.id
    );

    res.status(201).json({
      success: true,
      data: { activity },
    });
  } catch (err) {
    next(err);
  }
}

export async function getActivities(req, res, next) {
  try {
    const { repositoryId } = req.params;
    const activities = await activityService.getActivitiesByRepository(
      repositoryId,
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: { activities },
    });
  } catch (err) {
    next(err);
  }
}

export async function getUnreleasedActivities(req, res, next) {
  try {
    const { repositoryId } = req.params;
    const activities = await activityService.getUnreleasedActivities(
      repositoryId,
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: { activities },
    });
  } catch (err) {
    next(err);
  }
}

export async function getIgnoredActivities(req, res, next) {
  try {
    const { repositoryId } = req.params;
    const activities = await activityService.getIgnoredActivities(
      repositoryId,
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: { activities },
    });
  } catch (err) {
    next(err);
  }
}

export async function updateActivity(req, res, next) {
  try {
    const { id } = req.params;
    const { isIgnored, ignoreReason } = req.body;

    const activity = await activityService.updateActivityIgnoreState(
      id,
      isIgnored,
      ignoreReason,
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: { activity },
    });
  } catch (err) {
    next(err);
  }
}

export async function assignActivity(req, res, next) {
  try {
    const { id } = req.params;
    const { releaseId } = req.body;

    const activity = await activityService.assignActivity(
      id,
      releaseId,
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: { activity },
    });
  } catch (err) {
    next(err);
  }
}

export async function unassignActivity(req, res, next) {
  try {
    const { id } = req.params;
    const activity = await activityService.unassignActivity(
      id,
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: { activity },
    });
  } catch (err) {
    next(err);
  }
}
