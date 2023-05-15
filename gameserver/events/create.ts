import { lobbies, players } from "..";
import { EventObject } from "../types/EventObject";
import { generateGameCode } from "../utils/generateGameCode";

export default {
    name: "create",
    async callback({ connection }) {
        for (const lobby of lobbies)
            if (lobby[1].hostConnectionId == connection.id) return; //Can't host 2 lobbies at the same time

        const user = players.get(connection.id);
        if (!user) return;

        const gameCode = generateGameCode().toLowerCase();

        lobbies.set(gameCode, {
            id: gameCode,
            hostConnectionId: connection.id,
            players: [
                {
                    username: user.username,
                    connection: connection
                }
            ]
        });
        return { gameCode };
    }
} satisfies EventObject;
