import express from "express";
import loginRoutes from "./routes/loginRoutes.js";
import tasksRoutes from "./routes/tasksRoutes.js";
import { applyGlobalMiddleware } from "./middleware/globalMiddleware.js";
import { initDb , opendb} from "./models/tasks.js";

export const app = express();

applyGlobalMiddleware(app);

await initDb();
app.use(async (req, res, next) => {
  req.db = await opendb();
  next();
});

app.use("/", loginRoutes);
app.use("/", tasksRoutes);

export default app;
