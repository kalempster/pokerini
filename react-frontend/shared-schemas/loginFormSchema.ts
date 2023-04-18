import { z } from "zod";

export const loginFormSchema = z.object({
    username: z
        .string()
        .min(3)
        .max(16)
        .regex(/^\w{0,}$/, "Only alphanumeric characters are allowed"), //alphanumeric characters
    password: z
        .string()
        .min(8)
        .max(50)
        .regex(/^\w{0,}$/, "Only alphanumeric characters are allowed")
});
