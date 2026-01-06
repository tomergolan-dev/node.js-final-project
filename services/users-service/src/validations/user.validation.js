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

// Validate a required date in YYYY-MM-DD format and convert to a Date object (UTC)
const requiredIsoDate = (fieldName) =>
    z
        .string({ invalid_type_error: `${fieldName} must be a valid date` })
        .trim()
        .min(1, `${fieldName} is required`)
        .superRefine((s, ctx) => {
            // Enforce YYYY-MM-DD format
            if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `${fieldName} must be a valid date`
                });
                return;
            }

            // Validate that the date exists in the calendar
            const [y, m, d] = s.split("-").map(Number);
            const dt = new Date(Date.UTC(y, m - 1, d));
            const ok =
                dt.getUTCFullYear() === y &&
                dt.getUTCMonth() === m - 1 &&
                dt.getUTCDate() === d;

            if (!ok) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: `${fieldName} must be a valid date`
                });
            }
        })
        .transform((s) => {
            const [y, m, d] = s.split("-").map(Number);
            return new Date(Date.UTC(y, m - 1, d));
        });

/* -----------------------------
   Schemas
------------------------------ */

// Validate POST /api/add payload for adding a user
export const addUserSchema = z.object({
    id: requiredPositiveInt("id"),
    first_name: requiredString("first_name"),
    last_name: requiredString("last_name"),
    birthday: requiredIsoDate("birthday"),
});

// Validate /api/users/:id route parameter
export const userIdParamSchema = z.object({
    id: requiredPositiveInt("id"),
});
