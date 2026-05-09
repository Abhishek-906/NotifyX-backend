import { Notification } from "./notificationModel";
import { createNotificationSchema } from "./dto/notificationSchema";
import { z } from "zod";
import { AppError } from "../../utils/AppError";

type CreateNotificationInput = z.infer<typeof createNotificationSchema>;

export const notificationService = {
  createNotification: async (data: CreateNotificationInput) => {
    const newNotification = await Notification.create(data);
    return newNotification;
  },
  getMyNotifications: async (userId: string) => {
    return await Notification.find({ userId });
  },
  markAsRead: async (id: string, userId: string) => {
    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { isRead: true },
      { new: true },
    );
    if (!notification) {
      throw new AppError("Notification not found", 404);
    }
    return notification;
  },
  markAllAsRead: async (userId: string) => {
    console.log("userId in service", userId);
    const result = await Notification.updateMany({ userId,isRead: false }, { isRead: true });
    return result;
  },
};
