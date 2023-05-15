/* eslint-disable @typescript-eslint/no-explicit-any */
import * as http from "http";
import { Server } from "socket.io";

import create from "./events/create";
import { events, players } from "./utils/caches";
import { client } from "./utils/client";

const httpServer = http.createServer();
const server = new Server(httpServer);

//https://stackoverflow.com/questions/76236346/infer-type-from-object-value

events.set(create.name, create);

server.use(async (connection, next) => {
    if (!connection.handshake.query.token) return connection.disconnect();
    if (!(typeof connection.handshake.query.token == "string"))
        return connection.disconnect();
    try {
        const user = await client.gameserver.isUserAuthed.query(
            connection.handshake.query.token
        );
        players.set(connection.id, user);

        next();
    } catch (error) {
        connection.disconnect();
    }
});

server.on("connection", (connection) => {
    for (const event of events) {
        connection.on(event[0], async (args) => {
            const parsed = event[1].inputSchema
                ? event[1].inputSchema.safeParse(args)
                : { success: true, data: {} };
            if (!parsed.success) return;

            const returnValue = event[1].callback({
                data: event[1].inputSchema ? parsed.data : undefined,
                connection: connection
            });

            if (!returnValue) return;

            if (returnValue instanceof Promise) {
                const awaitedReturnValue = await returnValue;

                if (!awaitedReturnValue) return;

                return JSON.stringify(awaitedReturnValue);
            }

            return JSON.stringify(returnValue);
        });
    }
});

httpServer.listen(3000, undefined, undefined, () => {
    console.log("listenin");
});
