import pino from "pino";
import Log from "../models/log.model.js";

const SERVICE_NAME = process.env.SERVICE_NAME || "logs-service";

// Create a Pino logger instance (used to generate log messages)
export const logger = pino({
    base: { service: SERVICE_NAME },
    timestamp: () => `,"time":"${new Date().toISOString()}"`
});

// Persist a log record into MongoDB logs collection
export async function saveLog(level, msg, extra = {}) {
    // Create a Pino log object (for consistent formatting)
    logger[level]({ ...extra }, msg);

    // Save the same log message into MongoDB (logs collection)
    await Log.create({
        time: new Date(),
        level,
        msg,
        service: SERVICE_NAME,
        ...extra
    });
}