import { z  } from 'zod';

export const createNotificationSchema  = z.object({
   title: z.string(),
   message: z.string()
});