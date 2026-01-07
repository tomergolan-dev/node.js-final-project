// Import validation schemas for request validation
import { addUserSchema, userIdParamSchema } from "../validations/user.validation.js";

// Import service functions for user operations
import { createUser, getUserDetailsWithTotal, listUsers } from "../services/users.service.js";

// Import logger utility for endpoint access logging
import { saveLog } from "../utils/logger.js";

/*
 Send a consistent validation error response.
 This function formats Zod validation issues into a single message
 and returns the required JSON error format (id + message).
*/
function sendValidationError(res, parsed) {
    // Convert Zod issues into a readable message string
    const message = parsed.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ");

    // Return a standardized validation error response
    return res.status(400).json({
        id: "ERR-VALIDATION",
        message,
    });
}

// Handle GET /api/users (list all users)
export async function getAllUsers(req, res, next) {
    // Log endpoint access as required by project specification
    await saveLog("info", "Endpoint accessed", { endpoint: "GET /api/users" });

    try {
        // Fetch all users from the service layer
        const users = await listUsers();

        // Return the users list as JSON
        return res.json(users);
    } catch (err) {
        // Forward errors to the global error handler
        return next(err);
    }
}

// Handle POST /api/add when the payload represents a user
export async function addUser(req, res, next) {
    // Log endpoint access as required by project specification
    await saveLog("info", "Endpoint accessed", { endpoint: "POST /api/add" });

    // Validate the request body using the Zod schema
    const parsed = addUserSchema.safeParse(req.body);

    // Return validation error response on invalid input
    if (!parsed.success) {
        return sendValidationError(res, parsed);
    }

    try {
        // Create the user using the validated payload
        const user = await createUser(parsed.data);

        // Return 201 Created with the created user
        return res.status(201).json(user);
    } catch (err) {
        // Forward errors to the global error handler
        return next(err);
    }
}

// Handle GET /api/users/:id (user details + total costs)
export async function getUserDetails(req, res, next) {
    // Log endpoint access as required by project specification
    await saveLog("info", "Endpoint accessed", { endpoint: "GET /api/users/:id" });

    // Validate route params using the Zod schema
    const parsed = userIdParamSchema.safeParse(req.params);

    // Return validation error response on invalid input
    if (!parsed.success) {
        return sendValidationError(res, parsed);
    }

    try {
        // Fetch user details and computed total costs
        const data = await getUserDetailsWithTotal(parsed.data.id);

        // Return the user details JSON
        return res.json(data);
    } catch (err) {
        // Forward errors to the global error handler
        return next(err);
    }
}
