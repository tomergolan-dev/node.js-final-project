// Import the service function for retrieving the developers team list
import { getDevelopersTeam } from "../services/admin.service.js";

// Import logger utility for endpoint access logging
import { saveLog } from "../utils/logger.js";

// Handle GET /api/about (developers team)
export async function getAbout(req, res, next) {
    try {
        // Log endpoint access as required by project specification
        await saveLog("info", "Endpoint accessed", { endpoint: "GET /api/about" });

        // Fetch the developers team list from the service layer
        const team = getDevelopersTeam();

        // Return the team list as JSON (first_name + last_name only)
        return res.json(team);
    } catch (err) {
        // Forward errors to the global error handler
        return next(err);
    }
}
