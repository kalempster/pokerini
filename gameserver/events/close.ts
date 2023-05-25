import { z } from "zod";
import { EventObject } from "../types/EventObject";
import { lobbies, players } from "../utils/caches";

const schema = z.object({ code: z.string() });

export default {
    name: "close",
    inputSchema: schema,
    callback({ connection, data: { code } }) {
        const player = players.get(connection.id);
        if (!player) return;

        const lobby = lobbies.get(code.toLowerCase());
        if(!lobby) return;

        if(lobby.hostId != player.id) return;

        for (const lobbyPlayer of lobby.players) {
            lobbyPlayer.connection.emit("close");
        }

        lobbies.delete(code.toLowerCase());

    }
} satisfies EventObject<typeof schema>;
