import express from "express";
import cors from "cors";
import type { Request, Response } from "express";
import  routers from "./routes";
import { Router } from "express";
import { globalErrorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(cors());
app.use(express.json()); 

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "OK", service: "NotifyX" });
});

app.use("/api/v1", routers );
app.use(globalErrorHandler);

export default app;
