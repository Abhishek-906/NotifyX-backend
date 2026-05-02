import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";
import { createNotificationSchema } from "./dto/notificationSchema";
import { notificationService } from "./notificationService";
import { AppError } from "../../utils/AppError";
import { userService } from "../users/userService";

export const notificationController = {
  createNotification: asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = (req as any).user?.userId;
      if (!userId) {
        return next(new AppError("Unauthorized", 401));
      }

      const { title, message } = req.body;
      const sendMessage = await notificationService.createNotification({
        userId,
        title,
        message,
      });
      return sendResponse(
        res,
        200,
        true,
        "Notification send successfully",
        sendMessage,
      );
    },
  ),
  getMyNotifications: asyncHandler(async(req: Request, res: Response, next:NextFunction)=>{
      const userId = (req as any).user.userId;
      if(!userId){
        throw new AppError("Unauthorized", 401);
      }
     
      const notifications = await notificationService.getMyNotifications(userId);
      return sendResponse(res, 200, true, "User Notifications", notifications);
  })
  
};
