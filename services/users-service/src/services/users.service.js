// Import the User model for users collection access
import User from "../models/user.model.js";

// Import the Cost model for costs collection access
import Cost from "../models/cost.model.js";

/*
 Create a standardized application error.
 The global error handler converts this error into a JSON response
 that includes "id" and "message".
*/
function makeAppError(id, message, statusCode = 400) {
    // Create a native Error object with the provided message
    const err = new Error(message);

    // Attach an application-specific error identifier
    err.id = id;

    // Attach the HTTP status code to be used by the error handler
    err.statusCode = statusCode;

    // Return the configured error object
    return err;
}

// Fetch and return all users (excluding MongoDB internal _id)
export async function listUsers() {
    // Query all user documents and exclude the internal _id field
    return User.find({}, { _id: 0 }).lean();
}

// Create a new user document and return a clean JSON object
export async function createUser(userData) {
    try {
        // Insert the new user document into the database
        const created = await User.create(userData);

        // Convert mongoose document into a plain object
        const obj = created.toObject ? created.toObject() : created;

        // Remove MongoDB internal _id from the returned object
        const { _id, ...safe } = obj;

        // Return the sanitized user object
        return safe;
    } catch (err) {
        // Handle MongoDB duplicate key errors (unique constraint)
        if (err?.code === 11000) {
            // Try to identify which field caused the duplicate error
            const dupField = err?.keyPattern ? Object.keys(err.keyPattern)[0] : null;

            // Handle a duplicate user id as a conflict
            if (dupField === "id") {
                throw makeAppError("ERR-DUPLICATE", "User id already exists", 409);
            }

            // Fallback duplicate error handling
            throw makeAppError("ERR-DUPLICATE", "Duplicate value", 409);
        }

        // Re-throw unexpected errors for the global error handler
        throw err;
    }
}

// Fetch a specific user and compute their total costs
export async function getUserDetailsWithTotal(userId) {
    // Find the user by application-level id and exclude MongoDB _id
    const user = await User.findOne({ id: userId }, { _id: 0 }).lean();

    // Return 404 if the user does not exist
    if (!user) {
        throw makeAppError("ERR-NOT-FOUND", "User not found", 404);
    }

    // Aggregate all costs for the user and compute the total sum
    const result = await Cost.aggregate([
        { $match: { userid: userId } },
        { $group: { _id: null, total: { $sum: "$sum" } } },
    ]);

    // Convert aggregation result into a numeric total (default to 0)
    const total = result?.length ? Number(result[0].total) : 0;

    // Return the user details in the required response format
    return {
        first_name: user.first_name,
        last_name: user.last_name,
        id: user.id,
        total,
    };
}
