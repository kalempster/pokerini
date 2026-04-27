import { TRPCError } from "@trpc/server";
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
    isUserAuthed: gameServerProcedure
        .input(z.string())
        .query(async ({ input }) => {
            return await isAuthorized(input);
        }),
    updateChips: gameServerProcedure
        .input(
            z.object({
                players: z.array(
                    z.object({ playerId: z.string().cuid(), chips: z.number() })
                )
            })
        )
        .mutation(async ({ input }) => {
            try {
                const updated = await prisma.$transaction(
                    input.players.map((p) =>
                        prisma.user.update({
                            where: {
                                id: p.playerId
                            },
                            data: {
                                chips: p.chips
                            }
                        })
                    )
                );

                for (const update of updated) {
                    console.log({
                        username: update.username,
                        chips: update.chips
                    });
                }
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Updating chips failed"
                });
            }
        })
});
