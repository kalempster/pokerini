import { Socket } from "socket.io";
import { z } from "zod";

export const Player = z.object({
    id: z.string().cuid(),
    username: z.string(),
    chips: z.number()
});

export type PlayerType = {
    id: string;
    username: string;
    chips: number;
    connection: Socket;
};
