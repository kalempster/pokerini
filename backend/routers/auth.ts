import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { loginFormSchema } from "../../react-frontend/shared-schemas/loginFormSchema";
import { registerFormSchema } from "../../react-frontend/shared-schemas/registerFormSchema";
import { isAuthed } from "../utils/authUtils";
import { env } from "../utils/env";
import { prisma } from "../utils/prisma";
import { publicProcedure, t } from "../utils/trpc";
import { userSchema } from "../zod/user";

export const authRouter = t.router({
    register: publicProcedure
        .input(registerFormSchema)
        .mutation(async ({ input }) => {
            try {
                const hashedPassword = await hash(input.password, 10);

                await prisma.user.create({
                    data: {
                        username: input.username,
                        password: hashedPassword,
                        email: input.email
                    }
                });
            } catch (error) {
                if (error instanceof Prisma.PrismaClientKnownRequestError) {
                    if (error.code == "P2002") {
                        if (error.meta && Array.isArray(error.meta.target)) {
                            if (error.meta.target[0] == "email")
                                throw new TRPCError({
                                    code: "BAD_REQUEST",
                                    message: "That email already exists"
                                });

                            if (error.meta.target[0] == "username")
                                throw new TRPCError({
                                    code: "BAD_REQUEST",
                                    message: "That username already exists"
                                });
                        }
                    }
                }
            }
        }),

    me: publicProcedure.use(isAuthed).query(async ({ ctx }) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...safeUser } = ctx.user;
        return safeUser;
    }),
    login: publicProcedure
        .input(loginFormSchema)
        .output(
            z.object({
                ACCESS_TOKEN: z.string(),
                REFRESH_TOKEN: z.string(),
                user: userSchema
            })
        )
        .mutation(async ({ input }) => {
            const user = await prisma.user.findFirst({
                where: { username: input.username }
            });

            if (!user)
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid username or password"
                });

            const { password, ...safeUser } = user;

            if (!(await compare(input.password, password)))
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Invalid username or password"
                });
            const ACCESS_TOKEN = jwt.sign({ id: user.id }, env.JWT_SECRET, {
                expiresIn: "20m"
            });
            const REFRESH_TOKEN = jwt.sign(
                { id: user.id },
                env.JWT_REFRESH_SECRET
            );

            const sessionsCount = await prisma.token.count({
                where: { userId: user.id }
            });
            if (sessionsCount >= 50)
                await prisma.token.deleteMany({ where: { userId: user.id } });

            await prisma.token.create({
                data: {
                    token: REFRESH_TOKEN,
                    userId: user.id
                }
            });
            return {
                ACCESS_TOKEN,
                REFRESH_TOKEN,
                user: safeUser
            };
        }),
    logout: publicProcedure
        .input(z.object({ refreshToken: z.string() }))
        .mutation(async ({ input }) => {
            if (!jwt.verify(input.refreshToken, env.JWT_REFRESH_SECRET))
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Invalid refresh token"
                });
            try {
                await prisma.token.delete({
                    where: { token: input.refreshToken }
                });
            } catch (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Couldn't delete refresh token"
                });
            }
        }),
    regenerateAccessToken: publicProcedure
        .input(z.object({ refreshToken: z.string() }))
        .mutation(async ({ input }) => {
            try {
                jwt.verify(input.refreshToken, env.JWT_REFRESH_SECRET);
            } catch (error) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Refresh token is invalid"
                });
            }
            const token = await prisma.token.findFirst({
                where: { token: input.refreshToken }
            });
            if (!token)
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Refresh token not found"
                });

            return {
                ACCESS_TOKEN: jwt.sign({ id: token.userId }, env.JWT_SECRET, {
                    expiresIn: "20m"
                })
            };
        })
});
