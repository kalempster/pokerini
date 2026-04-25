import { create } from "zustand";
import type { Lobby, SafeLobby } from "@gameserver/shared/poker";

type GameStoreType = {
    setGame(game: Partial<SafeLobby>): void;
} & SafeLobby;

export const useGameStore = create<GameStoreType>((set) => ({
    id: "",
    bigBlind: 0,
    communityCards: [],
    dealerIndex: 0,
    highestBet: 0,
    hostId: "",
    maxPlayers: 0,
    players: [],
    pot: 0,
    stage: "LOBBY",
    turnDeadline: 0,
    turnId: 0,
    turnIndex: 0,
    deck: undefined,
    setGame(game) {
        set(game);
    }
}));
