import { Notification } from "./notificationModel";
import { AppError } from "../../utils/AppError";

type CreateNotificationServiceInput = {
  senderUserId: string;
  receiverUserId: string;
  title: string;
  message: string;
};

export const notificationService = {
  createNotification: async (data: CreateNotificationServiceInput) => {
    const newNotification = await Notification.create(data);
    return newNotification;
  },
  getMyNotifications: async (userId: string) => {
    return await Notification.find({ receiverUserId: userId });
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
