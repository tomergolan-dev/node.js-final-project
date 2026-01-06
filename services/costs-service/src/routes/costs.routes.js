// Import the Express Router for defining API routes
import { Router } from "express";

// Import cost-related controller functions
import { addCostItem, getReport } from "../controllers/costs.controller.js";

// Create a new router instance for cost endpoints
const router = Router();

// Handle POST requests for adding a new cost item
router.post("/add", addCostItem);

// Handle GET requests for retrieving a monthly report
router.get("/report", getReport);

// Export the configured router
export default router;
