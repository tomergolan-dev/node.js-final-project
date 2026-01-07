// Import the Express Router for defining API routes
import { Router } from "express";

// Import logs-related controller functions
import { getAllLogs } from "../controllers/logs.controller.js";

// Create a new router instance for logs endpoints
const router = Router();

// Handle GET requests for retrieving all logs
router.get("/logs", getAllLogs);

// Export the configured router
export default router;
