import { Notification } from "./notificationModel";
import { createNotificationSchema  } from "./dto/notificationSchema";
import {z} from 'zod';

type CreateNotificationInput = z.infer<typeof createNotificationSchema>;

export const notificationService = {
  createNotification: async (data : CreateNotificationInput) => {
    const newNotification = await Notification.create(data);
    return newNotification;
  },
  getMyNotifications: async (userId : string)=>{
     return await Notification.find({userId});
  }
};
