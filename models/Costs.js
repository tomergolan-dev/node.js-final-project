/*
 * Model: Cost
 * Description: This file defines the schema for the "costs" collection in MongoDB using Mongoose.
 * It maps the cost item properties as required: description, category, userid, and sum.
 */

const mongoose = require('mongoose');

// Define the Schema
const costSchema = new mongoose.Schema({
    // The description of the cost (e.g., "Choco")
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    // Category must be one of the specified allowed values
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['food', 'health', 'housing', 'sports', 'education']
    },
    // The ID of the user who owns this cost item
    userid: {
        type: Number,
        required: [true, 'User ID is required']
    },
    // The amount spent. Double is represented as Number in JavaScript/Mongoose.
    sum: {
        type: Number,
        required: [true, 'Sum is required']
    },
    // Created_at is used to handle the month/year reporting
    created_at: {
        type: Date,
        default: Date.now
    }
}, {
    // This ensures that the collection name is exactly 'costs' in MongoDB
    collection: 'costs',
    versionKey: false
});

// Create the model based on the schema
const Cost = mongoose.model('Cost', costSchema);

module.exports = Cost;