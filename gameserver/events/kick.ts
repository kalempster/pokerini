import { z } from "zod";
import { EventObject } from "../types/EventObject";
import { lobbies, players } from "../utils/caches";
import { convertToSafeLobby } from "../utils/safeLobby";

const schema = z.object({ id: z.string().cuid(), code: z.string() });

export default {
    name: "kick",
    inputSchema: schema,
    callback({ connection, data: { code, id } }) {
        const player = players.get(connection.id);
        if (!player) return;

        const lobby = lobbies.get(code.toLowerCase());
        if (!lobby) return;

        if (lobby.hostId != player.id) return;

        if(lobby.hostId == id) return;


        lobby.players.find((p) => p.id == id)?.connection.emit("kick");

        const newLobby = {
            ...lobby,
            players: lobby.players.filter((p) => p.id != id)
        };

        lobbies.set(code.toLowerCase(), newLobby);

        for (const lobbyPlayer of newLobby.players) {
            lobbyPlayer.connection.emit("update", convertToSafeLobby(newLobby));
        }
    }
} satisfies EventObject<typeof schema>;
