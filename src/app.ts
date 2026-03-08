import express from "express";
import cors from "cors";
import type { Request, Response } from "express";

const app = express();

app.use(cors());
app.use(express.json()); 

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "OK", service: "NotifyX" });
});

export default app;
