// Import the service function for fetching logs
import { listLogs } from "../services/logs.service.js";

// Import logger utility for endpoint access logging
import { saveLog } from "../utils/logger.js";

// Handle GET /api/logs (list all logs)
export async function getAllLogs(req, res, next) {
    // Log endpoint access as required by project specification
    await saveLog("info", "Endpoint accessed", { endpoint: "GET /api/logs" });

    try {
        // Fetch all logs from the service layer
        const logs = await listLogs();

        // Return the logs list as JSON
        return res.json(logs);
    } catch (err) {
        // Forward errors to the global error handler
        return next(err);
    }
}
