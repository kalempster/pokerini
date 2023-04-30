import { z } from "zod";

export const loginFormSchema = z.object({
    username: z
        .string()
        .min(3, "Username must contain at least 3 chatacters")
        .max(16, "Username must contain at most 16 characters")
        .regex(/^\w{0,}$/, "Only alphanumeric characters are allowed"), // alphanumeric characters
    password: z
        .string()
        .min(8, "Password must contain at least 8 chatacters")
        .max(16, "Password must contain at most 16 characters")
        .regex(/^\w{0,}$/, "Only alphanumeric characters are allowed")
});
