import { Notification } from "./notificationModel";
import { AppError } from "../../utils/AppError";
import { User } from "../users/userModel";

type CreateNotificationServiceInput = {
  senderUserId: string;
  receiverUserId: string;
  title: string;
  message: string;
};

type createNotificationForMultiUserServiceInput = {
  senderUserId: string;
  receiverUserIds: string[];
  title: string;
  message: string;
  includeHierarchy: boolean;
};

type GetNotificationOptions = {
  page?: number;
  limit?: number;
  q?: string;
  status?: string;
};

export const notificationService = {
  createNotification: async (data: CreateNotificationServiceInput) => {
    const receiver = await User.findById(data.receiverUserId);

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

  createNotificationForMultiUser: async (data: createNotificationForMultiUserServiceInput) => {

    const { senderUserId, receiverUserIds, title, message, includeHierarchy } = data;

    const uniqueReceiverIds = [...new Set(receiverUserIds)];
    if (uniqueReceiverIds.includes(senderUserId)) {
      throw new AppError(
        "Cannot send notification to yourself",
        400
      );
    }

    const childUsers = await User.find({
      parentId: senderUserId
    }).select("_id");

    const childUsersId = childUsers.map(user => user._id.toString());

    const unauthorized = uniqueReceiverIds.some(
      id => !childUsersId.includes(id)
    );

    if (unauthorized) {
      throw new AppError(
        "You can only send notifications to users in your hierarchy",
        403
      );
    }

    const receivers = await User.find({
      _id: { $in: uniqueReceiverIds }
    }).select("_id");

    // Checking that is  every requested user exists
    if (receivers.length !== uniqueReceiverIds.length) {
      throw new AppError(
        "One or more receivers were not found",
        404
      );
    }

    let finalReceiverIds = uniqueReceiverIds;

    if (includeHierarchy) {
      const hierarchyChildUsers = await User.find({
        parentId: { $in: uniqueReceiverIds }
      }).select("_id");

      const childUserIds = hierarchyChildUsers.map(
        user => user._id.toString()
      );

      finalReceiverIds = [
        ...new Set([
          ...uniqueReceiverIds,
          ...childUserIds,
        ]),
      ];
    }

    // Creating one notification document for every  receiver
    const notificationData = finalReceiverIds.map((receiverUserId) => ({
      senderUserId,
      receiverUserId,
      title,
      message,
    }));

    const notifications = await Notification.insertMany(notificationData);

    const populatedNotifications = await Notification.find({
      _id: { $in: notifications.map((notification) => notification._id) },
    }).populate(
      "senderUserId",
      "fullName email role"
    );

    return populatedNotifications;
  },

  getMyNotifications: async (
    userId: string,
    options: GetNotificationOptions = {}
  ) => {
    const {
      page = 1,
      limit = 10,
      q = "",
      status = "",
    } = options;

    const filter: any = {
      receiverUserId: userId,
    };

    // Search
    if (q) {
      filter.$or = [
        {
          title: {
            $regex: q,
            $options: "i",
          },
        },
        {
          message: {
            $regex: q,
            $options: "i",
          },
        },
      ];
    }

    // Read / Unread filter
    if (status === "read") {
      filter.isRead = true;
    }

    if (status === "unread") {
      filter.isRead = false;
    }

    const skip = (page - 1) * limit;

    const notifications = await Notification.find(filter)
      .populate("senderUserId", "fullName email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notification.countDocuments(filter);

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  markAsRead: async (id: string, userId: string) => {
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
