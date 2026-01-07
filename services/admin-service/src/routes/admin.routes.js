// Import the Express Router for defining API routes
import { Router } from "express";

// Import admin-related controller functions
import { getAbout } from "../controllers/admin.controller.js";

// Create a new router instance for admin endpoints
const router = Router();

// Handle GET requests for retrieving developers team information
router.get("/about", getAbout);

// Export the configured router
export default router;
