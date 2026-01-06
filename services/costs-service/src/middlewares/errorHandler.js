/*
 Global error handling middleware.
 This middleware catches all errors passed using next(err)
 and returns a consistent JSON error response to the client.
*/
export function errorHandler(err, req, res, next) {
    // Handle application-specific errors created in the services layer
    if (err?.statusCode && err?.id) {
        return res.status(err.statusCode).json({
            id: err.id,
            message: err.message,
        });
    }

    // Handle MongoDB duplicate key errors
    if (err?.code === 11000) {
        return res.status(409).json({
            id: "ERR-DUPLICATE",
            message: "Duplicate value",
        });
    }

    // Log unexpected or unhandled errors
    console.error("Unhandled error:", err);

    // Return a generic internal server error response
    return res.status(500).json({
        id: "ERR-INTERNAL",
        message: "Internal server error",
    });
}
