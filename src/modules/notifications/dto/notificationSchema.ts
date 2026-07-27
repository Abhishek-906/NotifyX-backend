import { z  } from 'zod';

export const createNotificationSchema = z.object({
   title: z.string().trim().min(1, "Title is required").max(100),
   message: z.string().trim().min(1, "Message is required").max(100),
   receiverUserId: z.string().regex(
     /^[0-9a-fA-F]{24}$/,
     "Invalid receiver user id"
   ),
 });