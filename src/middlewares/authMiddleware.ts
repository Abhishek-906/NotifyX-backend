import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";
import { User } from "../modules/users/userModel";

export const authMiddleware = async(
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized", 401));
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    if (typeof decoded === "string" || !decoded.userId) {
      return next(new AppError("Invalid token", 401));
    }

    const user = await User.findById(decoded.userId).select("_id role parentId isBlocked");
    if (!user || user.isBlocked) {
      return next(new AppError("Your account is blocked or no longer available", 403));
    }

    if (user.role === "USER" && user.parentId) {
      const parent = await User.findById(user.parentId).select("isBlocked");
      if (!parent || parent.isBlocked) {
        return next(new AppError("Your account is currently unavailable", 403));
      }
    }

    (req as any).user = { userId: user._id.toString(), role: user.role };
    next ();
  } catch (error) {
    return next(new AppError("Invalid or expired token", 401));
  }
};







