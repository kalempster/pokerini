import { User } from "@prisma/client";
import { z } from "zod";


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
