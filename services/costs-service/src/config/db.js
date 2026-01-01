import mongoose from "mongoose";

export async function connectMongo(mongoUri) {
    if (!mongoUri) {
        throw new Error("Missing MONGODB_URI");
    }

    try {
        await mongoose.connect(mongoUri);

        console.log("✅ MongoDB connected successfully");

        return mongoose.connection;
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        throw error;
    }
}
