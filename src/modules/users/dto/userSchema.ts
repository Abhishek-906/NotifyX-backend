import { z } from "zod";


export const childCountSchema = z.object({
    userId: z.string(),
    role: z.enum(["SUPERADMIN", "ADMIN", "USER"]),
})