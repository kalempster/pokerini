import { TRPCError } from "@trpc/server";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "./env";
import { prisma } from "./prisma";
import { t } from "./trpc";

export async function isAuthorized(token: string) {
    try {
        jwt.verify(token, env.JWT_SECRET);
    } catch (error) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid jwt token"
        });
    }

    const decodedJwt = jwt.decode(token);
    if (typeof decodedJwt == "string")
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const data = z
        .object({ id: z.string().cuid(), exp: z.number() })
        .safeParse(decodedJwt);
    if (!data.success)
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid jwt object"
        });

    const user = await prisma.user.findFirst({ where: { id: data.data.id } });
    if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });

    return { user, expMs: data.data.exp * 1000 };
}

export const isAuthed = t.middleware(async ({ ctx, next }) => {
    if (!ctx.req.headers.authorization)
        throw new TRPCError({ code: "UNAUTHORIZED" });

    const user = await isAuthorized(ctx.req.headers.authorization);

    return next({
        ctx: {
            ...ctx,
            user: user.user,
            expMs: user.expMs
        }
    });
});
