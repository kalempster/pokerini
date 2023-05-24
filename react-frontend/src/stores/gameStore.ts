import { z } from "zod";
import { create } from "zustand";
import { Lobby } from "../../../gameserver/objects/Lobby";

type gameStoreType = {
    setGame(game: z.infer<typeof Lobby>): void;
} & z.infer<typeof Lobby>;

export const useGameStore = create<gameStoreType>((set) => ({
    id: "",
    players: [],
    bigBlind: 0,
    hostId: "",
    maxPlayers: 0,
    setGame(game) {
        set(game);
    }
}));
