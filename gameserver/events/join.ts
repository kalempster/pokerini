import { z } from "zod";
import { EventObject } from "../types/EventObject";
import { lobbies, players } from "../utils/caches";
import { convertToSafeLobby } from "../utils/safeLobby";

const schema = z.object({ code: z.string() });

export default {
    name: "join",
    inputSchema: schema,
    callback({ connection, data: { code } }) {
        const player = players.get(connection.id);
        if (!player) return;
        let lobby = lobbies.get(code);
        if (!lobby) return;

        if (lobby.players.find((p) => p.id == player.id))
            return convertToSafeLobby(lobby);

        if (lobby.players.length + 1 > lobby.maxPlayers) return;

        for (const lobby of lobbies) {
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

        const updatedLobby = {
            ...lobby,
            players: [
                ...lobby.players,
                {
                    id: player.id,
                    username: player.username,
                    chips: player.chips,
                    connection
                }
            ]
        };

        lobbies.set(code, updatedLobby);

        const safeUpdatedLobby = convertToSafeLobby(updatedLobby);

        for (const loopedPlayer of lobby.players)
            loopedPlayer.connection.emit("update", safeUpdatedLobby);

        return safeUpdatedLobby;
    }
} satisfies EventObject<typeof schema>;
