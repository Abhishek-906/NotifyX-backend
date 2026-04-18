import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(3, "Username should atlease 3 characters ").trim(),
  email: z.string().email({ message: "Invalid email" }),
  password: z.string(),
});



