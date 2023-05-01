import { env,lockedOutProcedure, prisma, t } from "..";
import { userSchema, userLoginInput, userRegisterInput } from "../zod/user";

export const authRouter = t.router({
    register: lockedOutProcedure.input(userRegisterInput).mutation(async ({ input }) => {
        try {
            const hashedPassword = await hash(input.password, 10);

            const user = await prisma.user.create({
                data: {
                    username: input.username,
                    password: hashedPassword,
                    email: input.email,
                },
            });

            const confirmationToken = jwt.sign({ id: user.id }, env.JWT_EMAIL_SECRET);

            postmarkClient.sendEmail({
                From: env.SENDING_EMAIL,
                To: input.email,
                HtmlBody: `Hej ${input.username}! Witaj w aplikacji Mój Przyjaciel Robot!<br/> Aby potwierdzić email kliknij <a href="${env.APP_ROOT_URL}/confirmation/${confirmationToken}">tutaj</a>.`,
                Subject: "Potwierdź swój email",
            }); 
            //TODO: Email adjustment
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code == "P2002") {
                    if (error.meta && Array.isArray(error.meta.target)) {
                        if (error.meta.target[0] == "email")
                            throw new TRPCError({
                                code: "BAD_REQUEST",
                                message: "Konto z takim emailem już istnieje",
                            });

                        if (error.meta.target[0] == "username")
                            throw new TRPCError({
                                code: "BAD_REQUEST",
                                message: "Konto z taką nazwą użytkownika już istnieje",
                            });
                    }
                }
            }
        }
    }),
});
