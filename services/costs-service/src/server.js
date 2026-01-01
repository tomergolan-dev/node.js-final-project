import "dotenv/config";
import app from "./app.js";
import { connectMongo } from "./config/db.js";

const port = process.env.PORT || 3002;

async function start() {
    await connectMongo(process.env.MONGODB_URI);

    app.listen(port, () => {
        console.log(`costs-service running on http://localhost:${port}`);
    });
}

start().catch((err) => {
    console.error("Failed to start costs-service:", err.message);
    process.exit(1);
});
