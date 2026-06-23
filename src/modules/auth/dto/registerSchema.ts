import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(3, "fullName should atlease 3 characters ").trim(),
  email: z.string().email({ message: "Invalid email" }),
  password: z.string(),
});



