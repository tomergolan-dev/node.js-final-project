import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
    // 'info' לפעולות תקינות ו-'error' לשגיאות. מאפשר לסנן לוגים בקלות ב-Compass.
    level: { type: String, default: 'info' },

    // תיאור קצר של הפעולה (למשל: "Fetching monthly report").
    message: { type: String, required: true },

    // עוזר להבין איזה סוג בקשה בוצעה (GET/POST).
    method: { type: String },

    // הכתובת המדויקת. חשוב כדי לדעת איזה Endpoint הכי פעיל.
    url: { type: String },

    // קריטי! מאפשר לראות הצלחות (200/201) מול כישלונות (400/500) במבט חטוף.
    status: { type: Number },

    // מקשר את הפעולה למשתמש ספציפי. חיוני למעקב אחרי פעילות חשודה או תקלות של משתמש.
    userid: { type: Number },

    // נוצר אוטומטית. מאפשר לסדר את הלוגים לפי סדר כרונולוגי.
    timestamp: { type: Date, default: Date.now }
});

export const Log = mongoose.model("Log", logSchema);