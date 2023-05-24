import { z } from "zod";
import { Player, PlayerType } from "./Player";

export const Lobby = z.object({
    id: z.string(),
    players: z.array(Player),
    hostId: z.string().cuid(),
    maxPlayers: z.number(),
    bigBlind: z.number()
});

export type LobbyType = {
    id: string;
    players: PlayerType[];
    hostId: string;
    maxPlayers: number;
    bigBlind: number;
};
