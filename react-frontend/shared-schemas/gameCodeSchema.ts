import { z } from "zod";
export const gameCodeSchema = z
    .string()
    .length(9)
    .regex(/[A-Z]{4}-[A-Z]{4}/);
