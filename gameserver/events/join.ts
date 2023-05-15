import { z } from "zod";
import { lobbies, players } from "..";
import { EventObject } from "../types/EventObject";

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
