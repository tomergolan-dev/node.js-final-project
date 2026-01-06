// Import Express for building the REST API server
import express from "express";

// Import the API routes
import costsRoutes from "./routes/costs.routes.js";

// Import the central error handler (returns JSON errors)
import { errorHandler } from "./middlewares/errorHandler.js";

// Create the Express application instance
const app = express();

// Parse JSON request bodies (req.body)
app.use(express.json());

// Mount API routes under /api
app.use("/api", costsRoutes);

// Handle errors in a single place
app.use(errorHandler);

// Export app for server startup and unit testing
export default app;
