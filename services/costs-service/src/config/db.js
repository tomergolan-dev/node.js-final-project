// Import the mongoose library for MongoDB connectivity
import mongoose from "mongoose";

// Connect to MongoDB using the provided connection URI
export async function connectMongo(mongoUri) {
    // Validate that a MongoDB connection string was provided
    if (!mongoUri) {
        throw new Error("Missing MONGODB_URI");
    }

    try {
        // Establish a connection to the MongoDB database
        await mongoose.connect(mongoUri);

        // Log successful database connection
        console.log("MongoDB connected successfully");

        // Return the active mongoose connection
        return mongoose.connection;
    } catch (error) {
        // Log database connection errors
        console.error("MongoDB connection failed:", error.message);

        // Re-throw the error so the caller can handle startup failure
        throw error;
    }
}
