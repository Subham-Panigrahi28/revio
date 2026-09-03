const userRepository = require("../src/db/repositories/userRepository");
const workspaceRepository = require("../src/db/repositories/workspaceRepository");
const repositoryRepository = require("../src/db/repositories/repositoryRepository");
const activityRepository = require("../src/db/repositories/activityRepository");
async function test() {
    try {
        // 1. Create test user
        const user = await userRepository.createUser(
            "Activity Test User",
            "activity-test@revio.com",
            "test_hash_123"
        );

        console.log("Created test user:");
        console.log(user);

        // 2. Create test workspace
        const workspace = await workspaceRepository.createWorkspace(
            user.id,
            "Activity Test Workspace",
            "activity-test-workspace"
        );

        console.log("Created test workspace:");
        console.log(workspace);

        // 3. Create test repository
        const repository = await repositoryRepository.createRepository(
            workspace.id,
            987654321,
            "revio",
            "testuser/revio",
            "main"
        );

        console.log("Created test repository:");
        console.log(repository);

        // 4. Create activity
        const activity = await activityRepository.createActivity(
            repository.id,
            "pull_request",
            "42",
            "Add authentication",
            "Added JWT authentication to the backend",
            "https://github.com/testuser/revio/pull/42",
            "Test User",
            new Date()
        );

        console.log("Created activity:");
        console.log(activity);

        // 5. Find activity by Revio ID
        const foundById = await activityRepository.findActivityById(
            activity.id
        );

        console.log("Found activity by ID:");
        console.log(foundById);

        // 6. Find activity using GitHub information
        const foundByExternalId =
            await activityRepository.findActivityByExternalId(
                repository.id,
                "pull_request",
                "42"
            );

        console.log("Found activity by external ID:");
        console.log(foundByExternalId);

        // 7. Find all activities for repository
        const activities =
            await activityRepository.findActivitiesByRepositoryId(
                repository.id
            );

        console.log("Activities in repository:");
        console.log(activities);

        // 8. Find unreleased activities
        const unreleased =
            await activityRepository.findUnreleasedActivities(
                repository.id
            );

        console.log("Unreleased activities:");
        console.log(unreleased);

    } catch (error) {
        console.error(
            "Activity repository test failed:",
            error.message
        );
    }
}

test();

