import { z } from "zod";
import { isAuthorized } from "../utils/authUtils";
import { prisma } from "../utils/prisma";
import { publicProcedure, t } from "../utils/trpc";

const gameServerProcedure = publicProcedure.use(({ ctx, next }) => {
    if (ctx.req.header("authorization") == process.env.AUTH) {
        return next({ ctx });
    }
    throw new Error();
});

export const gameServerRouter = t.router({
    getUser: gameServerProcedure
        .input(z.object({ id: z.string().cuid() }))
        .query(async ({ input: { id } }) => {
            return await prisma.user.findFirst({ where: { id } });
        }),
    isUserAuthed: gameServerProcedure.input(z.string()).query(async ({ input }) => {
        return await isAuthorized(input);
    })
});
