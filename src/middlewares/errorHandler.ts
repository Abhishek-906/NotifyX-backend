import { Request, Response, NextFunction } from "express";

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
    message = err.errors;
  }

  return res.status(statusCode).json({
    success: false,
    message,
  });
};










