import { z } from "zod";

export const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(64),
    JWT_REFRESH_SECRET: z.string().min(64)
});
