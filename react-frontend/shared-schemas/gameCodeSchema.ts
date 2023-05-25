import { z } from "zod";
export const gameCodeSchema = z
    .string()
    .length(9)
    .regex(/[A-Z0-9]{4}-[A-Z0-9]{4}/);
