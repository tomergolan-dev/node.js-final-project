import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js'; // אם הקובץ בתיקיית config, שנה ל- './config/database.js'

dotenv.config();
const app = express();

// הפעלת החיבור למסד הנתונים
connectDB();

// הגדרות בסיסיות (Middlewares)
app.use(express.json());

// ייצוא ה-app בשיטת ESM
export default app;