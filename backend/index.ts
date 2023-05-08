import { PrismaClient } from "@prisma/client";
import { TRPCError, inferAsyncReturnType, initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import * as cors from "cors";
import { config } from "dotenv";
import * as express from "express";
import * as jwt from "jsonwebtoken";
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
            console.log(`Env error: ${err.path}: ${err.message}`);
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

export const isAuthed = t.middleware(async ({ ctx, next }) => {
    if (!ctx.req.headers.authorization)
        throw new TRPCError({ code: "UNAUTHORIZED" });
    const token = ctx.req.headers.authorization;

    try {
        jwt.verify(token, env.JWT_SECRET);
    } catch (error) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid jwt token"
        });
    }

    const decodedJwt = jwt.decode(token);
    const data = z.object({ id: z.string().cuid() }).safeParse(decodedJwt);
    if (!data.success)
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid jwt object"
        });

    const user = await prisma.user.findFirst({ where: { id: data.data.id } });
    if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });
    return next({ ctx: { ...ctx, user } });
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
