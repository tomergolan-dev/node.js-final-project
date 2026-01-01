import { z } from "zod";

/* -----------------------------
   Helpers
------------------------------ */

const requiredString = (fieldName) =>
    z.preprocess(
        (v) => (v === undefined || v === null ? "" : v),
        z
            .string({ invalid_type_error: `${fieldName} must be a string` })
            .trim()
            .min(1, `${fieldName} is required`)
    );

const requiredPositiveInt = (fieldName) =>
    z
        .any()
        // 1) Missing
        .refine((v) => v !== undefined && v !== null && v !== "", `${fieldName} is required`)
        // 2) Convert to number (without Zod coercion that creates NaN confusion)
        .transform((v) => Number(v))
        // 3) Must be a real number
        .refine((n) => Number.isFinite(n), `${fieldName} must be a number`)
        // 4) Must be integer
        .refine((n) => Number.isInteger(n), `${fieldName} must be an integer`)
        // 5) Must be positive
        .refine((n) => n > 0, `${fieldName} must be a positive integer`);

const requiredIsoDate = (fieldName) =>
    z
        .any()
        // Missing
        .refine((v) => v !== undefined && v !== null && v !== "", `${fieldName} is required`)
        // Must be string
        .refine((v) => typeof v === "string", `${fieldName} must be a valid date`)
        // Must match YYYY-MM-DD exactly
        .refine((s) => /^\d{4}-\d{2}-\d{2}$/.test(s), `${fieldName} must be a valid date`)
        // Must be a real calendar date (e.g., not 2025-02-30)
        .transform((s) => {
            const [y, m, d] = s.split("-").map(Number);
            const dt = new Date(Date.UTC(y, m - 1, d));
            const ok =
                dt.getUTCFullYear() === y &&
                dt.getUTCMonth() === m - 1 &&
                dt.getUTCDate() === d;

            if (!ok) throw new Error("INVALID_DATE");
            return new Date(s); // store as Date
        })
        .catch(() => {
            // If transform threw, force a Zod-style error message
            throw new Error(`${fieldName} must be a valid date`);
        });

/* -----------------------------
   Schemas
------------------------------ */

export const addUserSchema = z.object({
    id: requiredPositiveInt("id"),
    first_name: requiredString("first_name"),
    last_name: requiredString("last_name"),
    birthday: requiredIsoDate("birthday"),
});

export const userIdParamSchema = z.object({
    id: requiredPositiveInt("id"),
});
