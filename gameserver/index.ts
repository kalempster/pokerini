import * as http from "http";
import { Server } from "socket.io";

import create from "./events/create";
import join from "./events/join";
import { events, players } from "./utils/caches";
import { client } from "./utils/client";

const httpServer = http.createServer();
const server = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173"
    }
});

//https://stackoverflow.com/questions/76236346/infer-type-from-object-value

events.set(create.name, create);
events.set(join.name, join);

server.use(async (connection, next) => {
    if (!connection.handshake.auth.token) return connection.disconnect();
    if (!(typeof connection.handshake.auth.token == "string"))
        return connection.disconnect(true);
    try {
        const user = await client.gameserver.isUserAuthed.query(
            connection.handshake.auth.token
        );
        players.set(connection.id, user);

        next();
    } catch (error) {
        connection.disconnect(true);
    }
});

server.on("connection", (connection) => {
    for (const event of events) {
        connection.on(event[0], async (args) => {
            let parsed;

            if (event[1].inputSchema) {
                parsed = event[1].inputSchema.safeParse(args);

                if (!parsed.success)
                    return connection.emit(event[0], {
                        zodError: parsed.error
                    });
            }

            const returnValue = event[1].callback({
                data: parsed ? parsed.data : undefined,
                connection: connection
            });

            if (!returnValue) return;

            if (returnValue instanceof Promise) {
                const awaitedReturnValue = await returnValue;

                if (!awaitedReturnValue) return;

                return connection.emit(event[1].name, awaitedReturnValue);
            }

            connection.emit(event[1].name, returnValue);
        });
    }
    connection.on("disconnect", () => {
        players.delete(connection.id);
    });
});

httpServer.listen(3000, undefined, undefined, () => {
    console.log("listenin on 3000");
});
