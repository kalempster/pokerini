import { TRPCError, inferAsyncReturnType, initTRPC } from "@trpc/server";
import { PrismaClient } from "@prisma/client";
import * as express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import { config } from "dotenv";
import { envSchema } from "./zod/env";
import { TypeOf, ZodError, z } from "zod";
import * as jwt from "jsonwebtoken";
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

const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) => ({ req, res });
type Context = inferAsyncReturnType<typeof createContext>;
export const t = initTRPC.context<Context>().create({
    errorFormatter: ({ shape, error }) => {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError:
                    error.code === "BAD_REQUEST" && error.cause instanceof ZodError
                        ? error.cause.flatten()
                        : null,
            },
        };
    },
});

export const isAuthed = t.middleware(async ({ ctx, next }) => {
    if (!ctx.req.headers.authorization) throw new TRPCError({ code: "UNAUTHORIZED" });
    const token = ctx.req.headers.authorization;

    try {
        jwt.verify(token, env.JWT_SECRET);
    } catch (error) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid jwt token",
        });
    }

    const decodedJwt = jwt.decode(token);
    const data = z.object({ id: z.string().cuid() }).safeParse(decodedJwt);
    if (!data.success)
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid jwt object",
        });

    const user = await prisma.user.findFirst({ where: { id: data.data.id } });
    if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });
    return next({ ctx: { ...ctx, user } });
});
const lockOut = t.middleware(async ({ ctx, next }) => {
    console.log(ctx.req.headers["api-version"]);

    if (!ctx.req.headers["api-version"]) throw new TRPCError({ code: "PRECONDITION_FAILED" });

    if (ctx.req.headers["api-version"] != "1.0.0")
        throw new TRPCError({ code: "PRECONDITION_FAILED" });

    return next({ ctx });
});

export const lockedOutProcedure = t.procedure.use(lockOut);

