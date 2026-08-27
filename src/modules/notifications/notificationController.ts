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

      const { receiverUserId, title, message } = (req as any).validated;

      const notification = await notificationService.createNotification({
        receiverUserId,
        title,
        message,
        senderUserId,
      });

      const io = getIO();
      const sockets = getUserSocketMap();

      const socketId = sockets.get(receiverUserId);

      const sendMessage = {
        _id: notification._id,
        title: notification.title,
        message: notification.message,
        senderUserId: notification.senderUserId,
        createdAt: notification.createdAt
      }
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
  createNotificationForMultiUser: asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const senderUserId = (req as any).user?.userId;
      if (!senderUserId) {
        return next(new AppError("Unauthorized", 401));
      }
      const { receiverUserIds , title, message, includeHierarchy } = (req as any).validated;

      const notifications = await notificationService.createNotificationForMultiUser({
        receiverUserIds,
        title,
        message,
        senderUserId,
        includeHierarchy
      });

      const io = getIO();
      const sockets = getUserSocketMap();

      notifications.forEach((notification) => {
    
     const receiverUserId =  notification.receiverUserId.toString();
      const socketId = sockets.get(receiverUserId);

      const sendMessage = {
        _id: notification._id,
        title: notification.title,
        message: notification.message,
        senderUserId: notification.senderUserId,
        createdAt: notification.createdAt
      }
      // only emit if online
      if (socketId) {
        io.to(socketId).emit("new_notification", sendMessage);
        console.log(`Notification emitted to ${receiverUserId}`);
      } else {
        console.log(`User ${receiverUserId} is offline`);
      }
      })

      return sendResponse(
        res,
        200,
        true,
        "Notification send successfully",
        notifications,
      );
    },
  ),
  getMyNotifications: asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = (req as any).user.userId;

      if (!userId) {
        throw new AppError("Unauthorized", 401);
      }
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const q = req.query.q as string;
      const status = req.query.status as string;

      const notifications = await notificationService.getMyNotifications(
        userId,
        {
          page,
          limit,
          q,
          status,
        }
      );

      return sendResponse(
        res,
        200,
        true,
        "User Notifications",
        notifications
      );
    }
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
