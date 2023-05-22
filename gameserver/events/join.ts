import { z } from "zod";
import { EventObject } from "../types/EventObject";
import { lobbies, players } from "../utils/caches";

const schema = z.object({ code: z.string() });

export default {
    name: "join",
    inputSchema: schema,
    callback({ connection, data: { code } }) {
        const player = players.get(connection.id);
        if (!player) return;
        let lobby = lobbies.get(code);
        if (!lobby) return;

        if (lobby.players.length + 1 > lobby.maxPlayers) return;

        const updatedLobby = {
            ...lobby,
            players: [
                ...lobby.players,
                { username: player.username, chips: player.chips, connection }
            ]
        };

        lobbies.set(code, updatedLobby);

        for (const player of lobby.players) {
            player.connection.emit("update", {
                lobby: {
                    ...updatedLobby,
                    players: updatedLobby.players.map((p) => ({
                        ...p,
                        connection: undefined
                    }))
                }
            });
        }

        const safePlayers = updatedLobby.players.map((p) => ({
            ...p,
            connection: undefined
        }));

        return { ...updatedLobby, players: safePlayers };
    }
} satisfies EventObject<typeof schema>;
