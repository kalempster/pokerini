import { z } from "zod";
import { EventObject } from "../types/EventObject";
import { lobbies, players } from "../utils/caches";

const schema = z.object({ code: z.string() });

export default {
    name: "join",
    inputSchema: schema,
    callback({ connection, data: { code } }) {
        if (!players.get(connection.id)) return;
        const lobby = lobbies.get(code);
        if (!lobby) return;
    }
} satisfies EventObject<typeof schema>;
