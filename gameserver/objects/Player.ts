import { Socket } from "socket.io";

export type Player = {
    username: string;
    connection: Socket;
};
