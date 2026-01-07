// Import validation schemas for request validation
import { addCostSchema, reportQuerySchema } from "../validations/cost.validation.js";

// Import service functions for cost operations
import { addCost, getMonthlyReport } from "../services/costs.service.js";

// Import logger utility for endpoint access logging
import { saveLog } from "../utils/logger.js";

/*
 Send a consistent validation error response.
 This function formats Zod validation issues into a single message
 and returns the required JSON error format (id + message).
*/
function sendValidationError(res, parsed) {
    // Convert Zod issues into a readable message string
    const message = parsed.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ");

    // Return a standardized validation error response
    return res.status(400).json({
        id: "ERR-VALIDATION",
        message,
    });
}

// Handle POST /api/add for adding a cost item
export async function addCostItem(req, res, next) {
    // Log endpoint access as required by project specification
    await saveLog("info", "Endpoint accessed", { endpoint: "POST /api/add" });

    // Validate the request body using the Zod schema
    const parsed = addCostSchema.safeParse(req.body);

    // Return validation error response on invalid input
    if (!parsed.success) {
        return sendValidationError(res, parsed);
    }

    try {
        // Create the cost item using the validated payload
        const cost = await addCost(parsed.data);

        // Return 201 Created with the created cost item
        return res.status(201).json({
            description: cost.description,
            category: cost.category,
            userid: cost.userid,
            sum: Number(cost.sum),
            createdAt: cost.createdAt
        });

    } catch (err) {
        // Forward errors to the global error handler
        return next(err);
    }
}

// Handle GET /api/report for retrieving a monthly report
export async function getReport(req, res, next) {
    // Log endpoint access as required by project specification
    await saveLog("info", "Endpoint accessed", { endpoint: "GET /api/report" });

    // Validate query parameters using the Zod schema
    const parsed = reportQuerySchema.safeParse(req.query);

    // Return validation error response on invalid input
    if (!parsed.success) {
        return sendValidationError(res, parsed);
    }

    try {
        // Convert validated query parameters into the required types
        const userid = parsed.data.userid;
        const year = parsed.data.year;
        const month = parsed.data.month;

        // Generate the monthly report (cached for past months)
        const report = await getMonthlyReport(userid, year, month);

        // Return the report JSON
        return res.json(report);
    } catch (err) {
        // Forward errors to the global error handler
        return next(err);
    }
}
