import { Socket } from "socket.io";

export type Player = {
    username: string;
    chips: number;
    connection: Socket;
};
