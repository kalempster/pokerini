import type { Lobby } from "../shared/poker";
import { lobbies, pendingKicks, pendingJoins, pendingLeaves } from "./caches";
import { clearTurnTimer } from "../engine/gameLoop";
import { persistChips } from "./chips";
import { LobbyClosed } from "../shared/messages";

// Injected from index.ts to avoid circular dependency
type PublishFn = (
    topic: string,
    message: typeof LobbyClosed,
    payload: { lobbyId: string }
) => Promise<any>;

let _publish: PublishFn = async () => {};
export function setPublish(fn: PublishFn) {
    _publish = fn;
}

export async function shutdownLobby(lobby: Lobby) {
    clearTurnTimer(lobby.id);

    // Notify all players
    for (const player of lobby.players) {
        await _publish(`player:${player.id}`, LobbyClosed, {
            lobbyId: lobby.id,
        });
    }

    lobbies.delete(lobby.id);
    pendingKicks.delete(lobby.id);
    pendingJoins.delete(lobby.id);
    pendingLeaves.delete(lobby.id);
}