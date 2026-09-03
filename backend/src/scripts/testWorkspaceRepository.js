const userRepository = require("../src/db/repositories/userRepository");
const workspaceRepository = require("../src/db/repositories/workspaceRepository");

async function test() {
    try {
        // First create a test user
        const user = await userRepository.createUser(
            "Workspace Test User",
            "workspace-test@revio.com",
            "test_hash_123"
        );

        console.log("Created test user:");
        console.log(user);

        // Create workspace for that user
        const workspace = await workspaceRepository.createWorkspace(
            user.id,
            "My Test Workspace",
            "my-test-workspace"
        );

        console.log("Created workspace:");
        console.log(workspace);

        // Find workspace by ID
        const foundById = await workspaceRepository.findWorkspaceById(
            workspace.id
        );

        console.log("Found workspace by ID:");
        console.log(foundById);

        // Find workspace by slug
        const foundBySlug = await workspaceRepository.findWorkspaceBySlug(
            "my-test-workspace"
        );

        console.log("Found workspace by slug:");
        console.log(foundBySlug);

        // Find all workspaces owned by user
        const workspaces = await workspaceRepository.findWorkspacesByOwnerId(
            user.id
        );

        console.log("Workspaces owned by user:");
        console.log(workspaces);

    } catch (error) {
        console.error("Workspace repository test failed:", error.message);
    }
}

test();