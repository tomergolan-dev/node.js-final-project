// Import mongoose for defining MongoDB schemas and models
import mongoose from "mongoose";

/*
 Define the schema for the users collection.
 This schema represents application users and maps directly
 to documents stored in the MongoDB users collection.
*/
const userSchema = new mongoose.Schema(
    {
        // Application-level user identifier (different from MongoDB _id)
        id: {
            type: Number,
            required: true,
            unique: true
        },

        // User first name
        first_name: {
            type: String,
            required: true
        },

        // User last name
        last_name: {
            type: String,
            required: true
        },

        // User date of birth
        birthday: {
            type: Date,
            required: true
        }
    },
    {
        // Disable the automatic __v version field
        versionKey: false
    }
);

// Create the User model and bind it to the users collection
const User = mongoose.model("User", userSchema, "users");

// Export the User model for use in services and controllers
export default User;
