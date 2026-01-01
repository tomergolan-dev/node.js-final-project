const mongoose = require('mongoose');

// הגדרת הסכימה לפי דרישות הפרויקט
const userSchema = new mongoose.Schema({
    id: {
        type: Number, // חובה לפי ההנחיות
        required: true,
        unique: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        required: true
    }
});

// יצירת המודל - האוסף יקרא 'users' ב-MongoDB
const Users = mongoose.model('Users', userSchema, 'users');

module.exports = Users;