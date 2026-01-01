import "dotenv/config";
import app from "./app.js";
import { connectMongo } from "./config/db.js";

const port = process.env.PORT || 3001;

async function start() {
    await connectMongo(process.env.MONGODB_URI);

    app.listen(port, () => {
        console.log(`users-service running on http://localhost:${port}`);
    });
}

start().catch((err) => {
    console.error("Failed to start users-service:", err.message);
    process.exit(1);
});
