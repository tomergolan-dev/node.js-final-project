/*
 * Model: Log
 * Description: This file defines the schema for the "logs" collection.
 * It stores application logs, including HTTP requests and errors,
 * typically populated by the Pino logger integration.
 */

const mongoose = require('mongoose');

// Define the Schema for Logs
const logSchema = new mongoose.Schema({
    // Level of the log (e.g., 30 for info, 40 for warn, 50 for error in Pino)
    level: {
        type: Number,
        required: true
    },
    // The timestamp of the log entry
    time: {
        type: Date,
        default: Date.now
    },
    // The main log message (e.g., "Request to /api/add received")
    msg: {
        type: String,
        required: true
    },
    // Meta information: which endpoint was accessed
    endpoint: {
        type: String,
        required: false
    },
    // Meta information: HTTP method (GET, POST, etc.)
    method: {
        type: String,
        required: false
    },
    // Any error details if applicable
    error: {
        type: Object,
        required: false
    }
}, {
    collection: 'logs',
    versionKey: false
});

const Logs = mongoose.model('Log', logSchema);

module.exports = Logs;