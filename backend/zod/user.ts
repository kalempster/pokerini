import { z } from "zod";
import { User } from "@prisma/client/index";
//jak juz piotrus przegladasz ten kod to pewnie dawno sie  zorientowales ze podjebalem
//z twoj przyjaciel robot, staralem sie myslec, wiekszosc rzeczy rozumiem,
//ale robi sie ciezko jak pojawia sie trpc
const loginData = {
    username: z
        .string({
            description: "Nazwa użytkownika",
            invalid_type_error: "Nazwa użytkownika musi być tekstem",
            required_error: "Nazwa użytkownika jest wymagana",
        })
        .regex(/^\w+$/, {
            message: "Nazwa użytkownika może zawierać tylko znaki alfanumeryczne",
        })
        .max(16, { message: "Nazwa użytkownika może zawierać maksymalnie 16 znaków" })
        .min(3, { message: "Nazwa użytkownika musi zawierać minimum 3 znaki" }),

    password: z
        .string({
            description: "Hasło użytkownika",
            invalid_type_error: "Hasło musi być tekstem",
            required_error: "Hasło jest wymagane",
        })
        .min(8, { message: "Hasło musi zawierać przynajmniej 8 znaków" })
        .max(16, { message: "Hasło może zawirać maksymalnie 16 znaków" })
        .regex(/^\S*$/, { message: "Hasło nie może zawierać spacji" }),
};
export const userRegisterInput = z.object({
    ...loginData,
    email: z
        .string({
            description: "Email",
            invalid_type_error: "Email musi być tekstem",
            required_error: "Email jest wymagany",
        })
        .email({
            message: "Tekst musi być poprawnym emailem",
        }),
});
export const userLoginInput = z.object(loginData);

type AnyObj = Record<PropertyKey, unknown>;

type ZodObj<T extends AnyObj> = {
    [key in keyof T]: z.ZodType<T[key]>;
};

const zObject = <T extends AnyObj>(arg: ZodObj<T>) => z.object(arg);

export const userSchema = zObject<Omit<User, "password">>({
    id: z.string().cuid(),
    username: z.string(),
    email: z.string().email(),
    chips: z.number(),
    createdAt: z.date(),
    updatedAt: z.date()
});

export type userSchemaType = z.infer<typeof userSchema>;
