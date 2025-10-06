import express from "express";
import { auth } from "../middleware/auth.js";
import {
  controlRegistedUser,
  controlUserData,
  controlLoginUser,
} from "../controllers/ControllerUsers.js";

const router = express.Router();

router.post("/login", controlLoginUser);

router.get("/userData", auth, controlUserData);

router.post("/users", controlRegistedUser);

export default router
