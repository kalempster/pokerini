import { Player } from "./Player";

export type Lobby = {
    id: string;
    players: Player[];
    hostId: string;
    maxPlayers: number;
    bigBlind: number;
};
