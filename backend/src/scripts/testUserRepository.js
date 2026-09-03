const userRepository = require("../src/db/repositories/userRepository");
async function test() {
    try {
        const user = await userRepository.createUser(
            "Test User",
            "test@revio.com",
            "test_hash_123"
        );

        console.log("Created user:");
        console.log(user);

        const foundById = await userRepository.findUserById(user.id);

        console.log("Found by ID:");
        console.log(foundById);

        const foundByEmail = await userRepository.findUserByEmail(
            "test@revio.com"
        );

        console.log("Found by email:");
        console.log(foundByEmail);

    } catch (error) {
        console.error("Repository test failed:", error.message);
    }
}

test();