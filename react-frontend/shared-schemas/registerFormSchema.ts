import { z } from "zod";

export const registerFormSchema = z
    .object({
        username: z
            .string()
            .min(3, "Username must contain at least 3 characters")
            .max(16, "Username must contain at most 16 characters")
            .regex(/^\w{0,}$/, "Only alphanumeric characters are allowed"), // alphanumeric characters
        email: z
            .string()
            .min(1, "This field has to be filled.")
            .email("This is not a valid email."),
        password: z
            .string()
            .min(8, "Password must contain at least 8 characters")
            .max(50, "Password must contain at most 16 characters")
            .regex(/^\w{0,}$/, "Only alphanumeric characters are allowed"),
        confirmPassword: z
            .string()
            .min(8, "Password must contain at least 8 characters")
            .max(50, "Password must contain at most 16 characters")
            .regex(/^\w{0,}$/, "Only alphanumeric characters are allowed")
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
        if (confirmPassword !== password) {
            ctx.addIssue({
                code: "custom",
                message: "The passwords did not match"
            });
        }
    });
