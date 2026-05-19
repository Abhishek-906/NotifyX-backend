import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/sendResponse";
import { createNotificationSchema } from "./dto/notificationSchema";
import { notificationService } from "./notificationService";
import { AppError } from "../../utils/AppError";
import { userService } from "../users/userService";
import { getIO, getUserSocketMap } from "../../utils/socket";

export const notificationController = {
  createNotification: asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const senderUserId = (req as any).user?.userId;
      if (!senderUserId) {
        return next(new AppError("Unauthorized", 401));
      }

      const { receiverUserId, title, message } = req.body;

      const sendMessage = await notificationService.createNotification({
        receiverUserId,
        title,
        message,
        senderUserId,
      });

      const io = getIO();
      const sockets = getUserSocketMap();

      const socketId = sockets.get(receiverUserId);

      // only emit if online
      if (socketId) {
        io.to(socketId).emit("new_notification", sendMessage);

        console.log(`Notification emitted to ${receiverUserId}`);
      } else {
        console.log(`User ${receiverUserId} is offline`);
      }

      return sendResponse(
        res,
        200,
        true,
        "Notification send successfully",
        sendMessage,
      );
    },
  ),
  getMyNotifications: asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = (req as any).user.userId;
      if (!userId) {
        throw new AppError("Unauthorized", 401);
      }

      const notifications =
        await notificationService.getMyNotifications(userId);
      return sendResponse(res, 200, true, "User Notifications", notifications);
    },
  ),
  markAsRead: asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = (req as any).user.userId;
      const { id } = req.params as { id: string };
      if (!id) {
        throw new AppError("Id not found", 400);
      }
      const marked = await notificationService.markAsRead(id, userId);
      return sendResponse(res, 200, true, "Notification marked as read");
    },
  ),
  markAllAsRead: asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = (req as any).user.userId;
      const result = await notificationService.markAllAsRead(userId);
      return sendResponse(
        res,
        200,
        true,
        result.modifiedCount > 0
          ? "All notifications marked as read"
          : "No unread notifications",
        result,
      );
    },
  ),
};
