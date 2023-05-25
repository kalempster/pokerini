import { z } from "zod";
import { isAuthorized } from "../utils/authUtils";
import { prisma } from "../utils/prisma";
import { publicProcedure, t } from "../utils/trpc";

export const gameServerRouter = t.router({
    getUser: publicProcedure
        .input(z.object({ id: z.string().cuid() }))
        .query(async ({ input: { id } }) => {
            return await prisma.user.findFirst({ where: { id } });
        }),
    isUserAuthed: publicProcedure.input(z.string()).query(async ({ input }) => {
        return await isAuthorized(input);
    })
});
