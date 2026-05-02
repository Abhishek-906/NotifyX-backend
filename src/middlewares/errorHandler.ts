import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../utils/sendResponse";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // ✅ Zod validation error
  if (err.name === "ZodError") {
    statusCode = 400;
    message = err.issues.map((e: any) => e.message);
  }
  return res.status(statusCode).json({
    success: false,
    message,
  });
};
