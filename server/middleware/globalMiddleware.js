import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import dotenv from  "dotenv"

dotenv.config()

const frontend = process.env.FRONTEND

export function applyGlobalMiddleware(app) {
  app.use(cors({ origin: `${frontend}`, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());
}
