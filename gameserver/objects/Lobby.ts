import { Player } from "./Player";

export type Lobby = {
    id: string;
    players: Player[];
    hostConnectionId: string;
};
