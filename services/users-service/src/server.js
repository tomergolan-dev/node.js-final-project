// Load environment variables from the .env file
import "dotenv/config";

// Import the configured Express application
import app from "./app.js";

// Import the MongoDB connection function
import { connectMongo } from "./config/db.js";

// Define the port on which the service will listen
const port = process.env.PORT || 3002;

// Start the server and initialize required resources
async function start() {
    // Establish a connection to the MongoDB database
    await connectMongo(process.env.MONGODB_URI);

    // Start listening for incoming HTTP requests
    app.listen(port, () => {
        console.log(`users-service running on http://localhost:${port}`);
    });
}

// Execute the server startup process and handle startup failures
start().catch((err) => {
    // Log startup errors to the console
    console.error("Failed to start users-service:", err.message);

    // Exit the process with a failure code
    process.exit(1);
});
