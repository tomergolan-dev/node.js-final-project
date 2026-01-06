// Import the Cost model for costs collection access
import Cost from "../models/cost.model.js";

// Import the User model to verify the userid exists
import User from "../models/user.model.js";

// Import the Report model for computed (cached) monthly reports
import Report from "../models/report.model.js";

/*
 Create a standardized application error.
 The global error handler converts this error into a JSON response
 that includes "id" and "message".
*/
function makeAppError(id, message, statusCode = 400) {
    // Create a native Error object with the provided message
    const err = new Error(message);

    // Attach an application-specific error identifier
    err.id = id;

    // Attach the HTTP status code to be used by the error handler
    err.statusCode = statusCode;

    // Return the configured error object
    return err;
}

/*
 Determine if a (year, month) pair belongs to a past month.
 Reports for past months are cached (Computed pattern).
*/
function isPastMonth(year, month) {
    // Get current date in server time
    const now = new Date();

    // Extract current year and month (month is 1-12)
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    // Determine if requested month is earlier than the current month
    if (year < currentYear) return true;
    if (year > currentYear) return false;
    return month < currentMonth;
}

/*
 Check if a provided date is in the past by comparing date-only values.
 The server does not allow adding costs with dates that belong to the past.
*/
function isPastDate(date) {
    // Get today's date at local midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get the provided date at local midnight
    const candidate = new Date(date);
    candidate.setHours(0, 0, 0, 0);

    // Dates strictly before today are considered past dates
    return candidate < today;
}

/*
 Build the monthly report JSON format required by the project document.
 Costs are grouped by category and each entry includes sum, description, and day.
*/
function buildReportObject(userid, year, month, costsDocs) {
    // Prepare empty category buckets in the required order
    const buckets = {
        food: [],
        education: [],
        health: [],
        housing: [],
        sports: []
    };

    // Map each cost document into the required entry format
    for (const c of costsDocs) {
        // Extract the day of month from the creation date
        const created = c.createdAt ? new Date(c.createdAt) : new Date();
        const day = created.getDate();

        // Push the entry into its category bucket
        buckets[c.category].push({
            sum: Number(c.sum),
            description: c.description,
            day
        });
    }

    // Return the report object in the required structure
    return {
        userid,
        year,
        month,
        costs: [
            { food: buckets.food },
            { education: buckets.education },
            { health: buckets.health },
            { housing: buckets.housing },
            { sports: buckets.sports }
        ]
    };
}

/*
 Add a new cost item.
 If a date is not provided, the server uses the request time (now).
 Costs with past dates are rejected as required by the project.
*/
export async function addCost(costData) {
    // Verify that the user exists (required by the project)
    const user = await User.findOne({ id: costData.userid }, { _id: 0 }).lean();

    // Reject the request if the user does not exist
    if (!user) {
        throw makeAppError("ERR-NOT-FOUND", "User not found", 404);
    }

    // Determine the creation date for the cost item
    const createdAt = costData.date ? new Date(costData.date) : new Date();

    // Reject costs that belong to past dates
    if (isPastDate(createdAt)) {
        throw makeAppError("ERR-VALIDATION", "date must not be in the past", 400);
    }

    // Prepare the document to insert
    const doc = {
        userid: costData.userid,
        description: costData.description,
        category: costData.category,
        sum: costData.sum,
        createdAt
    };

    // Create the cost document in the database
    const created = await Cost.create(doc);

    // Convert mongoose document into a plain object
    const obj = created.toObject ? created.toObject() : created;

    // Remove MongoDB internal _id from the returned object
    const { _id, ...safe } = obj;

    // Return the newly created cost item
    return safe;
}

/*
 Get a monthly report for a specific user.
 Implements the Computed design pattern by caching reports for past months only.
*/
export async function getMonthlyReport(userid, year, month) {
    // Verify that the user exists (required by the project)
    const user = await User.findOne({ id: userid }, { _id: 0 }).lean();

    // Reject the request if the user does not exist
    if (!user) {
        throw makeAppError("ERR-NOT-FOUND", "User not found", 404);
    }

    // Use computed cache only for past months
    const shouldCache = isPastMonth(year, month);

    // Attempt to read a cached report for past months
    if (shouldCache) {
        const cached = await Report.findOne({ userid, year, month }, { _id: 0 }).lean();
        if (cached) {
            // Debug log: indicates that the report result was returned from cache
            console.log("return from cache:", cached);
            return cached;
        }
    }

    // Create the month date range [start, end)
    const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    const end = new Date(Date.UTC(year, month, 1, 0, 0, 0));

    // Fetch all costs for the user within the requested month
    const costsDocs = await Cost.find(
        { userid, createdAt: { $gte: start, $lt: end } },
        { _id: 0, userid: 1, description: 1, category: 1, sum: 1, createdAt: 1 }
    ).lean();

    // Build the report in the required JSON format
    const report = buildReportObject(userid, year, month, costsDocs);

    /*
     Computed pattern:
     Reports for past months are saved and returned from the cache in future requests.
     Reports for the current or future months are not cached because data may still change.
    */
    if (shouldCache) {
        try {
            await Report.create(report);
        } catch (err) {
            // Ignore duplicate cache creation and return the computed report
            if (err?.code !== 11000) {
                throw err;
            }
        }
    }

    // Return the report object
    return report;
}
