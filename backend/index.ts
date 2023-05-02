import { TRPCError, inferAsyncReturnType, initTRPC } from "@trpc/server";
import { PrismaClient } from "@prisma/client";
import * as express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import { config } from "dotenv";
import { envSchema } from "./zod/env";
import { TypeOf, ZodError, z } from "zod";


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
  res,
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
          error.code === "BAD_REQUEST" && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  },
  
});
import { authRouter } from "./routers/auth";
export const appRouter = t.router({
    auth: authRouter,
});
export const publicProcedure = t.procedure
app.use(
    "/api",
    trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext,
    })
);