import { z } from "zod";
import { EventObject } from "../types/EventObject";
import { lobbies, players } from "../utils/caches";
import { generateGameCode } from "../utils/generateGameCode";

const schema = z.object({
    players: z.number().min(2).max(5),
    bigBlind: z.number().min(100).max(10000)
});

export default {
    name: "create",
    inputSchema: schema,
    async callback({ connection, data }) {
        const user = players.get(connection.id);

        if (!user) return;

        for (const lobby of lobbies) if (lobby[1].hostId == user.id) return; //Can't host 2 lobbies at the same time

        const gameCode = generateGameCode().toLowerCase();

        lobbies.set(gameCode, {
            id: gameCode,
            hostId: user.id,
            players: [
                {
                    username: user.username,
                    chips: user.chips,
                    connection: connection
                }
            ],
            maxPlayers: data.players,
            bigBlind: data.bigBlind
        });
        return {
            gameCode,
            game: {
                id: gameCode,
                hostId: user.id,
                players: [
                    {
                        username: user.username,
                        chips: user.chips
                    }
                ],
                maxPlayers: data.players,
                bigBlind: data.bigBlind
            }
        };
    }
} satisfies EventObject<typeof schema>;
