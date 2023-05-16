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
    const data = z.object({ id: z.string().cuid() }).safeParse(decodedJwt);
    if (!data.success)
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid jwt object"
        });

    const user = await prisma.user.findFirst({ where: { id: data.data.id } });
    if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });
    return user;
}

export const isAuthed = t.middleware(async ({ ctx, next }) => {
    if (!ctx.req.headers.authorization)
        throw new TRPCError({ code: "UNAUTHORIZED" });

    return next({
        ctx: { ...ctx, user: await isAuthorized(ctx.req.headers.authorization) }
    });
});
