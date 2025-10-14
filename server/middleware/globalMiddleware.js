import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";

export function applyGlobalMiddleware(app) {
  app.use(cors({ origin: "http://localhost:5173", credentials: true }));
  app.use(express.json());
  app.use(cookieParser());
}
