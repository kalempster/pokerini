import { Server } from "socket.io";
import create from "./events/create";
const server = new Server();

export type EventObject = {
    name: string;
    callback(...args: any[]): any;
};

const events = new Map<string, EventObject>();
events.set(create.name, create);

server.on("connection", (s) => {
    for (const event of events) {
        s.on(event[0], event[1].callback);
    }
});

server.listen(3000);
