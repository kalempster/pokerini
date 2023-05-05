import { PrismaClient } from "@prisma/client";
import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import * as cors from "cors";
import { config } from "dotenv";
import * as express from "express";
import { ZodError, z } from "zod";
import { envSchema } from "./zod/env";

export const prisma = new PrismaClient();

const envs = config();

export let env: z.infer<typeof envSchema>;

try {
    env = envSchema.parse(envs.parsed);
} catch (error) {
    if (error instanceof ZodError) {
        for (const err of error.errors) {
            console.log(`Env missing: ${err.path}`);
        }
    }
    process.exit(1);
}

const app = express();

const createContext = ({
    req,
    res
}: trpcExpress.CreateExpressContextOptions) => ({ req, res });
type Context = inferAsyncReturnType<typeof createContext>;
export const t = initTRPC.context<Context>().create({
    errorFormatter(opts) {
        const { shape, error } = opts;
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError:
                    error.code === "BAD_REQUEST" &&
                    error.cause instanceof ZodError
                        ? error.cause.flatten()
                        : null
            }
        };
    }
});
export const publicProcedure = t.procedure;

import { authRouter } from "./routers/auth";

export const appRouter = t.router({
    auth: authRouter
});

export type AppRouter = typeof appRouter;

app.use(cors({ origin: "*" }));

app.use(
    "/api",
    trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext
    })
);

app.listen(3001, () => console.log("listening"));
