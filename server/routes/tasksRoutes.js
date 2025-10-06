import express from "express";
import { auth } from "../middleware/auth.js";
import {
  ControltaskId,
  controlPostTask,
  controlTask,
  controlPatchTask,
  controlDeleteTask,
  controlDashboard,
} from "../controllers/ControllerTasks.js";

const router = express.Router();

router.get("/tasks/:id", auth, ControltaskId);

router.get("/tasks", auth, controlTask);

router.post("/tasks", auth, controlPostTask);

router.patch("/tasks/:id", auth, controlPatchTask);

router.delete("/tasks/:id", auth, controlDeleteTask);

router.get("/dashboard", auth, controlDashboard)

export default router;
