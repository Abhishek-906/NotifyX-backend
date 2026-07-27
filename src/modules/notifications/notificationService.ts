import { Notification } from "./notificationModel";
import { AppError } from "../../utils/AppError";
import { User } from "../users/userModel";

type CreateNotificationServiceInput = {
  senderUserId: string;
  receiverUserId: string;
  title: string;
  message: string;
};

export const notificationService = {
  createNotification: async (data: CreateNotificationServiceInput) => {
    console.log("data before", data);
    const receiver = await User.findById(data.receiverUserId);
    console.log("Data weeeee get", receiver);

    if (!receiver) {
      throw new AppError("Receiver not found", 404);
    }

    if (data.senderUserId === data.receiverUserId) {
      throw new AppError("Cannot send notification to yourself", 400);
  }

    const newNotification = await Notification.create(data);
    const notification = await Notification.findById(newNotification._id)
      .populate("senderUserId", "fullName email role");

    if (!notification) {
      throw new AppError("Notification not found", 404);
    }

    return notification;
  },

  getMyNotifications: async (userId: string) => {
    return await Notification.find({
      receiverUserId: userId
    }).populate("senderUserId", "fullName email role")
      .sort({ createdAt: -1 });
  },
  markAsRead: async (id: string, userId: string) => {
    console.log("id, userId", { id, userId });
    const notification = await Notification.findOneAndUpdate(
      { _id: id, receiverUserId: userId },
      { isRead: true },
      { new: true },
    );
    if (!notification) {
      throw new AppError("Notification not found", 404);
    }
    return notification;
  },
  markAllAsRead: async (userId: string) => {
    const result = await Notification.updateMany({ receiverUserId: userId, isRead: false }, { isRead: true });
    return result;
  },
};
