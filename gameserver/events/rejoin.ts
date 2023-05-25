import { EventObject } from "../types/EventObject";
import { lobbies, players } from "../utils/caches";
import { convertToSafeLobby } from "../utils/safeLobby";

export default {
    name: "rejoin",
    callback({ connection }) {
        const player = players.get(connection.id);
        if (!player) return;

        for (const lobby of lobbies)
            if (lobby[1].players.find((p) => p.id == player.id))
                return convertToSafeLobby(lobby[1]);
    }
} satisfies EventObject;
