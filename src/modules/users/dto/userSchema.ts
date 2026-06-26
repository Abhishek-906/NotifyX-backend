import { z } from "zod";


export const childCountSchema = z.object({
    userId: z.string()
})

export const userCreateSchema = z.object({
    fullName: z.string().min(4, 'Full name should be at least 4 characters long'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters long')
});