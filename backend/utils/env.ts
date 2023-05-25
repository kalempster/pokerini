import { config } from "dotenv";
import { ZodError, z } from "zod";
import { envSchema } from "../zod/env";

const envs = config();

export let env: z.infer<typeof envSchema>;

try {
    env = envSchema.parse(envs.parsed);
} catch (error) {
    if (error instanceof ZodError) {
        for (const err of error.errors) {
            console.log(`Env error: ${err.path}: ${err.message}`);
        }
    }
    process.exit(1);
}
