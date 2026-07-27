import { z } from "zod";


export const childCountSchema = z.object({
    userId: z.string()
})

export const userCreateSchema = z.object({
    fullName: z.string().min(4, 'Full name should be at least 4 characters long'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    parentId: z.string().optional()
});

export const getChildrenSchema = z.object({
   parentId: z.string().optional(),
   q: z.string().optional(),
   page: z.coerce.number().default(1),
   limit: z.coerce.number().default(10),
   status: z.enum(["active", "blocked"]).optional(),
});