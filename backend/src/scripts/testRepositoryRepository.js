const userRepository = require("../src/db/repositories/userRepository");
const workspaceRepository = require("../src/db/repositories/workspaceRepository");
const repositoryRepository = require("../src/db/repositories/repositoryRepository");

async function test() {
    try {
        // Create test user
        const user = await userRepository.createUser(
            "Repository Test User",
            "repository-test@revio.com",
            "test_hash_123"
        );
        

        console.log("Created test user:");
        console.log(user);

        // Create test workspace
        const workspace = await workspaceRepository.createWorkspace(
            user.id,
            "Repository Test Workspace",
            "repository-test-workspace"
        );

        console.log("Created test workspace:");
        console.log(workspace);

        // Create GitHub repository
        const repository = await repositoryRepository.createRepository(
            workspace.id,
            123456789,
            "revio",
            "testuser/revio",
            "main"
        );

        console.log("Created repository:");
        console.log(repository);

        // Find repository by Revio ID
        const foundById = await repositoryRepository.findRepositoryById(
            repository.id
        );

        console.log("Found repository by ID:");
        console.log(foundById);

        // Find repositories by workspace ID
        const repositories =
            await repositoryRepository.findRepositoriesByWorkspaceId(
                workspace.id
            );

        console.log("Repositories in workspace:");
        console.log(repositories);

        // Find repository by GitHub ID
        const foundByGithubId =
            await repositoryRepository.findRepositoryByGithubId(
                workspace.id,
                123456789
            );

        console.log("Found repository by GitHub ID:");
        console.log(foundByGithubId);

    } catch (error) {
        console.error(
            "Repository repository test failed:",
            error.message
        );
    }
}

test();