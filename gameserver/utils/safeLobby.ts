import { LobbyType } from "../objects/Lobby";

export const convertToSafeLobby = (lobby: LobbyType) => {
    const safeLobby = lobby;
    return {
        ...safeLobby,
        players: safeLobby.players.map((p) => ({
            ...p,
            connection: undefined
        }))
    };
};
