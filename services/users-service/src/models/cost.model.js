import mongoose from "mongoose";

const costSchema = new mongoose.Schema(
    {
        description: String,
        category: String,
        userid: Number,
        sum: Number
    },
    { versionKey: false }
);

const Cost = mongoose.model("Cost", costSchema, "costs");

export default Cost;
