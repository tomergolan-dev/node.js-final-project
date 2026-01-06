// Import Zod for request validation
import { z } from "zod";

/* -----------------------------
   Helpers
------------------------------ */

// Validate a required trimmed string (non-empty)
const requiredString = (fieldName) =>
    z.preprocess(
        (v) => (v === undefined || v === null ? "" : v),
        z
            .string({ invalid_type_error: `${fieldName} must be a string` })
            .trim()
            .min(1, `${fieldName} is required`)
    );

// Validate a required positive integer (accepts numbers and numeric strings)
const requiredPositiveInt = (fieldName) =>
    z
        .any()
        .refine((v) => v !== undefined && v !== null && String(v).trim() !== "", `${fieldName} is required`)
        .transform((v) => Number(String(v).trim()))
        .refine((n) => Number.isFinite(n), `${fieldName} must be a number`)
        .refine((n) => Number.isInteger(n), `${fieldName} must be an integer`)
        .refine((n) => n > 0, `${fieldName} must be a positive integer`);

// Validate a required positive number (supports integers and decimals)
const requiredPositiveNumber = (fieldName) =>
    z
        .any()
        .refine((v) => v !== undefined && v !== null && String(v).trim() !== "", `${fieldName} is required`)
        .transform((v) => Number(String(v).trim()))
        .refine((n) => Number.isFinite(n), `${fieldName} must be a number`)
        .refine((n) => n > 0, `${fieldName} must be a positive number`);

// Validate an optional date input and normalize it into a Date object
// - If the field is not provided, validation passes
// - If provided, the value must represent a real calendar date
const optionalDate = (fieldName) =>
    z
        // Accept any input type and allow the field to be optional
        .any()
        .optional()

        // Normalize empty / missing values to undefined and trim strings
        .transform((v) =>
            v === undefined || v === null || String(v).trim() === ""
                ? undefined
                : String(v).trim()
        )

        // Perform validation without changing the value
        .superRefine((s, ctx) => {
            // Skip all checks if the date was not provided
            if (s === undefined) {
                return;
            }

            // Handle the simple YYYY-MM-DD format explicitly
            // This allows detecting non-existent calendar dates (e.g. 2025-02-30)
            if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
                const [y, m, d] = s.split("-").map(Number);

                // Create a Date object using UTC to avoid timezone side effects
                const dt = new Date(Date.UTC(y, m - 1, d));

                // Verify that JavaScript did not auto-correct the date
                const ok =
                    dt.getUTCFullYear() === y &&
                    dt.getUTCMonth() === m - 1 &&
                    dt.getUTCDate() === d;

                // Reject the value if the constructed date does not match the input
                if (!ok) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: `${fieldName} must be a valid date`
                    });
                }

                return;
            }

            // For non-YYYY-MM-DD values, accept only valid ISO timestamps
            // Date.parse returns NaN for invalid date strings
            if (!Number.isFinite(Date.parse(s))) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `${fieldName} must be a valid date`
                });
            }
        })

        // Convert the validated value into a Date object for downstream usage
        .transform((s) => {
            // Preserve undefined for optional values
            if (s === undefined) {
                return undefined;
            }

            // Normalize YYYY-MM-DD values to UTC midnight
            if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
                const [y, m, d] = s.split("-").map(Number);
                return new Date(Date.UTC(y, m - 1, d));
            }

            // Convert valid ISO timestamps into Date objects
            return new Date(s);
        });

/* -----------------------------
   Schemas
------------------------------ */

// Validate POST /api/add payload for adding a cost item
export const addCostSchema = z.object({
    userid: requiredPositiveInt("userid"),
    description: requiredString("description"),
    category: z
        .string({ invalid_type_error: "category must be a string" })
        .trim()
        .min(1, "category is required")
        .refine(
            (v) => ["food", "health", "housing", "sports", "education"].includes(v),
            "category must be one of: food, health, housing, sports, education"
        ),
    sum: requiredPositiveNumber("sum"),
    date: optionalDate("date"),
});

// Validate GET /api/report query parameters
export const reportQuerySchema = z.object({
    userid: requiredPositiveInt("userid"),
    year: requiredPositiveInt("year"),
    month: requiredPositiveInt("month")
        .refine((m) => m >= 1 && m <= 12, "month must be between 1 and 12"),
});
