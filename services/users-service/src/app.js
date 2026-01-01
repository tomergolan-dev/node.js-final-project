import express from "express";
import usersRoutes from "./routes/users.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());
app.use(usersRoutes);
app.use(errorHandler);

export default app;
