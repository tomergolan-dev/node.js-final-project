import { saveLog } from "../utils/logger.js";

// Log every incoming HTTP request and its response status code
export function requestLogger(req, res, next) {
    // Log request arrival (required by project)
    saveLog("info", "HTTP request received", {
        method: req.method,
        url: req.originalUrl
    }).catch(() => {});

    // Log response status once the request is finished
    res.on("finish", () => {
        saveLog("info", "HTTP response sent", {
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode
        }).catch(() => {});
    });

    return next();
}
