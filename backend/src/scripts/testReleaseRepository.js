const userRepository = require("../src/db/repositories/userRepository");
const workspaceRepository = require("../src/db/repositories/workspaceRepository");
const repositoryRepository = require("../src/db/repositories/repositoryRepository");
const releaseRepository = require("../src/db/repositories/releaseRepository");

async function test() {
    try {
        // 1. Create test user
        const user = await userRepository.createUser(
            "Release Test User",
            "release-test@revio.com",
            "test_hash_123"
        );

        console.log("Created test user:");
        console.log(user);

        // 2. Create test workspace
        const workspace = await workspaceRepository.createWorkspace(
            user.id,
            "Release Test Workspace",
            "release-test-workspace"
        );

        console.log("Created test workspace:");
        console.log(workspace);

        // 3. Create test repository
        const repository = await repositoryRepository.createRepository(
            workspace.id,
            555555555,
            "revio",
            "testuser/revio",
            "main"
        );

        console.log("Created test repository:");
        console.log(repository);

        // 4. Create release
        const release = await releaseRepository.createRelease(
            repository.id,
            "v1.0.0",
            "Authentication Improvements",
            "Added JWT authentication",
            "Full release notes for authentication improvements."
        );

        console.log("Created release:");
        console.log(release);

        // 5. Find release by ID
        const foundById = await releaseRepository.findReleaseById(
            release.id
        );

        console.log("Found release by ID:");
        console.log(foundById);

        // 6. Find releases by repository
        const releases =
            await releaseRepository.findReleasesByRepositoryId(
                repository.id
            );

        console.log("Releases in repository:");
        console.log(releases);

        // 7. Find releases by status
        const drafts = await releaseRepository.findReleasesByStatus(
            repository.id,
            "draft"
        );

        console.log("Draft releases:");
        console.log(drafts);

        // 8. Update release
        const updatedRelease = await releaseRepository.updateRelease(
            release.id,
            "Authentication & Security Improvements",
            "Improved authentication and security",
            "Updated release notes after human review.",
            "review"
        );

        console.log("Updated release:");
        console.log(updatedRelease);

        // 9. Publish release
        const publishedRelease =
            await releaseRepository.publishRelease(release.id);

        console.log("Published release:");
        console.log(publishedRelease);

    } catch (error) {
        console.error(
            "Release repository test failed:",
            error.message
        );
    }
}

test();