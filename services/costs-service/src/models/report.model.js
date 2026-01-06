// Import mongoose for defining MongoDB schemas and models
import mongoose from "mongoose";

/*
 Define the schema for cached monthly reports (Computed pattern).
 Each document stores the report result for a specific userid, year, and month.
*/
const reportSchema = new mongoose.Schema(
    {
        // Identifier of the user for whom the report was generated
        userid: {
            type: Number,
            required: true
        },

        // Report year (e.g., 2025)
        year: {
            type: Number,
            required: true
        },

        // Report month (1-12)
        month: {
            type: Number,
            required: true
        },

        // Report payload in the required JSON structure
        costs: {
            type: Array,
            required: true
        }
    },
    {
        // Disable the automatic __v version field
        versionKey: false
    }
);

// Enforce uniqueness so a report is cached once per userid/year/month
reportSchema.index({ userid: 1, year: 1, month: 1 }, { unique: true });

// Create the Report model and bind it to the reports collection
const Report = mongoose.model("Report", reportSchema, "reports");

// Export the Report model for use in services
export default Report;
