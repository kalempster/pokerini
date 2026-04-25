import { GameStage, LobbyType, PlayerType } from "../objects/Lobby";

export function broadcastUpdate(lobby: LobbyType) {
    lobby.players.forEach((recipient) => {
        // 1. Create a sanitized list of players for this specific recipient
        const sanitizedPlayers = lobby.players.map((player) => {
            // Determine if this player's cards should be visible to the recipient
            // Cards are visible if:
            // - It's the recipient's own cards
            // - The game is in the SHOWDOWN stage (end of game)
            // - The game has returned to the LOBBY stage (after a winner is picked)
            const showCards =
                player.id === recipient.id ||
                lobby.stage === GameStage.SHOWDOWN ||
                lobby.stage === GameStage.LOBBY;

            return {
                id: player.id,
                username: player.username,
                chips: player.chips,
                currentBet: player.currentBet,
                folded: player.folded,
                isAllIn: player.isAllIn,
                totalContribution: 0,
                cards: showCards ? player.cards : [] // Hide cards with empty array if not allowed
            } as PlayerType;
        });

        // 2. Prepare the final lobby object
        // We omit 'deck' (don't want players seeing next cards)
        // and replace 'players' with our sanitized version.
        const { deck, players, ...publicLobbyState } = lobby;

        const payload = {
            ...publicLobbyState,
            players: sanitizedPlayers,
            // Provide a count of cards in deck instead of the actual cards if needed for UI
            cardsInDeck: deck?.length ?? 0
        };

        // 3. Emit to this specific player
        recipient.connection.emit("update", payload);
    });
}
