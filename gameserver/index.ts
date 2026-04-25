import * as http from "http";
import { Server } from "socket.io";

import close from "./events/close";
import create from "./events/create";
import join from "./events/join";
import kick from "./events/kick";
import rejoin from "./events/rejoin";
import { events, lobbies, players } from "./utils/caches";
import { client } from "./utils/client";
import { GameStage, LobbyType } from "./objects/Lobby";
import { broadcastUpdate } from "./utils/poker";
import start from "./events/start";
import action from "./events/action";

const httpServer = http.createServer();
const server = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173"
    }
});

//https://stackoverflow.com/questions/76236346/infer-type-from-object-value

events.set(create.name, create);
events.set(join.name, join);
events.set(rejoin.name, rejoin);
events.set(close.name, close);
events.set(kick.name, kick);
events.set(start.name, start);
events.set(action.name, action);


server.use(async (connection, next) => {
    if (!connection.handshake.auth.token) return connection.disconnect();
    if (!(typeof connection.handshake.auth.token == "string"))
        return connection.disconnect(true);
    // Why wouldn't I use zod here????
    // Wth was 2023 me thinking

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

            console.log(returnValue);
            

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
        // 1. Find the player
        const user = players.get(connection.id);
        if (!user) return;

        // 2. Find their lobby
        const lobby = Array.from(
            lobbies.values() as IterableIterator<LobbyType>
        ).find((l) => l.players.some((p) => p.id === user.id));

        if (lobby) {
            const pIdx = lobby.players.findIndex((p) => p.id === user.id);
            if (lobby.stage !== GameStage.LOBBY) {
                // Fold them so the game isn't stuck
                lobby.players[pIdx].folded = true;
                broadcastUpdate(lobby);
            } else {
                // If just in lobby, remove them
                lobby.players.splice(pIdx, 1);
            }
        }
        players.delete(connection.id);
    });
});


httpServer.listen(3000, undefined, undefined, () => {
    console.log("listenin on 3000");
});
