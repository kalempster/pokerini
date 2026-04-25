import { GameStage, LobbyType } from "../objects/Lobby";
import { EventObject } from "../types/EventObject";
import { lobbies } from "../utils/caches";
import { broadcastUpdate, createDeck } from "../utils/poker";

export default {
    name: "start",
    callback({ connection }) {
        const lobby = Array.from(
            lobbies.values() as IterableIterator<LobbyType>
        ).find((l) => l.hostId === connection.id);

        if (!lobby || lobby.players.length < 2) return;

        lobby.deck = createDeck();
        lobby.stage = GameStage.PRE_FLOP;
        lobby.communityCards = [];

        lobby.players.forEach((p) => {
            p.cards = [lobby.deck.pop()!, lobby.deck.pop()!];
            p.folded = false;
            p.isAllIn = false;
            p.currentBet = 0;
        });

        const sbIdx = (lobby.dealerIndex + 1) % lobby.players.length;
        const bbIdx = (lobby.dealerIndex + 2) % lobby.players.length;

        // Take Blinds
        const sb = lobby.bigBlind / 2;
        lobby.players[sbIdx].chips -= sb;
        lobby.players[sbIdx].currentBet = sb;

        lobby.players[bbIdx].chips -= lobby.bigBlind;
        lobby.players[bbIdx].currentBet = lobby.bigBlind;

        lobby.pot = sb + lobby.bigBlind;
        lobby.highestBet = lobby.bigBlind;
        lobby.turnIndex = (bbIdx + 1) % lobby.players.length;

        broadcastUpdate(lobby);
    }
} satisfies EventObject;
