// Import mongoose for defining MongoDB schemas and models
import mongoose from "mongoose";

/*
 Define the schema for the costs collection.
 Each document represents a single cost item created by a user.
*/
const costSchema = new mongoose.Schema(
    {
        // Identifier of the user who created the cost item
        userid: {
            type: Number,
            required: true
        },

        // Description of the cost item
        description: {
            type: String,
            required: true
        },

        // Category of the cost item (restricted to predefined values)
        category: {
            type: String,
            required: true,
            enum: ["food", "health", "housing", "sports", "education"]
        },

        // Monetary value of the cost item
        sum: {
            type: Number,
            required: true
        }
    },
    {
        // Automatically add createdAt and updatedAt timestamps
        timestamps: true
    }
);

// Create the Cost model and bind it to the costs collection
const Cost = mongoose.model("Cost", costSchema, "costs");

// Export the Cost model for use in services and controllers
export default Cost;
