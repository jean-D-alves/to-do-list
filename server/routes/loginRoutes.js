import express from "express";
import { auth } from "../middleware/auth.js";
import {
  controlRegistedUser,
  controlUserData,
  controlLoginUser,
  controlCheckToken,
} from "../controllers/ControllerUsers.js";

const router = express.Router();

router.post("/login", controlLoginUser);

router.get("/userData", auth, controlUserData);

router.get("/check-token", auth, controlCheckToken);

router.post("/users", controlRegistedUser);

export default router
