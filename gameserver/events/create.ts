import { z } from "zod";
import { EventObject } from "../types/EventObject";
import { lobbies, players } from "../utils/caches";
import { generateGameCode } from "../utils/generateGameCode";
import { convertToSafeLobby } from "../utils/safeLobby";

const schema = z.object({
    players: z.number().min(2).max(5),
    bigBlind: z.number().min(100).max(10000)
});

export default {
    name: "create",
    inputSchema: schema,
    callback({ connection, data }) {
        const player = players.get(connection.id);

        if (!player) return;

        for (const lobby of lobbies) {
            if (lobby[1].hostId == player.id)
                return convertToSafeLobby(lobby[1]);

            const index = lobby[1].players.findIndex((p) => p.id == player.id);

            if (index == -1) continue;

            lobby[1].players.splice(index, 1);

            if (lobby[1].players.length == 0) {
                lobbies.delete(lobby[0]);
                continue;
            }

            lobbies.set(lobby[0], lobby[1]);

            for (const loopedPlayer of lobby[1].players)
                loopedPlayer.connection.emit(
                    "update",
                    convertToSafeLobby(lobby[1])
                );
        }

        const gameCode = generateGameCode().toLowerCase();

        lobbies.set(gameCode, {
            id: gameCode,
            hostId: player.id,
            players: [
                {
                    id: player.id,
                    username: player.username,
                    chips: player.chips,
                    connection: connection
                }
            ],
            maxPlayers: data.players,
            bigBlind: data.bigBlind
        });
        return {
            id: gameCode,
            hostId: player.id,
            players: [
                {
                    id: player.id,
                    username: player.username,
                    chips: player.chips
                }
            ],
            maxPlayers: data.players,
            bigBlind: data.bigBlind
        };
    }
} satisfies EventObject<typeof schema>;
