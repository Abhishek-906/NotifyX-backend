import { z  } from 'zod';

export const createNotificationSchema  = z.object({
   title: z.string().min(1,"Enter atleast one character"),
   message: z.string().min(1, "enter atlease 1 character"),
   receiverUserId: z.string(),
});
