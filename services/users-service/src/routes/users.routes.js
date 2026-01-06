// Import the Express Router for defining API routes
import { Router } from "express";

// Import user-related controller functions
import { addUser, getAllUsers, getUserDetails } from "../controllers/users.controller.js";

// Create a new router instance for user endpoints
const router = Router();

// Handle GET requests for retrieving all users
router.get("/users", getAllUsers);

// Handle POST requests for adding a new user
router.post("/add", addUser);

// Handle GET requests for retrieving a specific user by id
router.get("/users/:id", getUserDetails);

// Export the configured router
export default router;
