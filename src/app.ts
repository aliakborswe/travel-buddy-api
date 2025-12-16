import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Request, type Response } from "express";
import { envVars } from "./app/config/env";
import { router } from "./app/routes";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: envVars.FRONTEND_URL,
    credentials: true,
  })
);

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to Travel Buddy Backend",
  });
});

// check health route
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK", message: "Service is healthy" });
});

export default app;
