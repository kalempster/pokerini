import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { ZodError } from "zod";

export const createContext = ({ req, res }: CreateExpressContextOptions) => ({
    req,
    res
});
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
