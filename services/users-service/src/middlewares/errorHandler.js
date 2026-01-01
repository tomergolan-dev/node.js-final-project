/*
 * Global error handling middleware
 * This function is responsible for catching and formatting
 * all errors that occur in the server-side application.
 * It ensures that every error is returned to the client
 * in a consistent JSON structure.
 */
export function errorHandler(err, req, res, next) {

    // Check for MongoDB duplicate key error
    // Error code 11000 is returned when a unique constraint is violated
    // (for example, when trying to insert a user with an existing id)
    if (err.code === 11000) {
        return res.status(409).json({
            // Application-level error identifier
            id: "ERR-DUPLICATE",

            // Human-readable error message for the client
            message: "User id already exists"
        });
    }

    // Fallback for all other unexpected errors
    // Returns a generic internal server error response
    res.status(500).json({
        // Generic error identifier
        id: "ERR-INTERNAL",

        // Use the original error message if available,
        // otherwise return a default internal error message
        message: err.message || "Internal server error"
    });
}
