import mongoose from "mongoose";

// MongoDB document schema for the logs collection
const logSchema = new mongoose.Schema(
    {
        time: { type: Date, required: true },
        level: { type: String, required: true },
        msg: { type: String, required: true },

        service: { type: String, required: true },

        method: { type: String },
        url: { type: String },
        endpoint: { type: String },

        statusCode: { type: Number }
    },
    { versionKey: false }
);

const Log = mongoose.model("Log", logSchema, "logs");

export default Log;
