import { Socket } from "socket.io";
import { z } from "zod";

export const Player = z.object({ username: z.string(), chips: z.number() });

export type PlayerType = {
    username: string;
    chips: number;
    connection: Socket;
};
