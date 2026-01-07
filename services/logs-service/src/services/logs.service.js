// Import the Log model for logs collection access
import Log from "../models/log.model.js";

/*
 Fetch and return all log documents.
 The response must include the same property names that exist in the logs collection.
*/
export async function listLogs() {
    // Query all log documents and exclude MongoDB internal _id field
    // This keeps the output clean and consistent for the project requirements
    return Log.find({}, { _id: 0 }).lean();
}
