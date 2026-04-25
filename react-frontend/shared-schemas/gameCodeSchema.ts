import { z } from "zod";

export const gameCodeSchema = z
    .string()
    .length(6)
