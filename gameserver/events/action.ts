import { z } from "zod";
import { EventObject } from "../types/EventObject";
import { lobbies } from "../utils/caches";
import { LobbyType, GameStage } from "../objects/Lobby";
import { broadcastUpdate } from "../utils/broadcastUpdate";
import { calculatePots } from "../utils/calculatePots";
import { evaluate } from "@pokertools/evaluator";

const schema = z.object({
    action: z.enum(["fold", "check", "call", "raise"]),
    amount: z.number().min(0).optional()
});

export default {
    name: "action",
    inputSchema: schema,
    callback({ connection, data }) {
        const lobby = Array.from(lobbies.values() as IterableIterator<LobbyType>)
            .find(l => l.players.some(p => p.connection.id === connection.id));

        if (!lobby || lobby.stage === GameStage.LOBBY) return; // Not started
        const player = lobby.players[lobby.turnIndex];
        if (player.connection.id !== connection.id) return; // Not our turn

        // 1. EXECUTE ACTION
        if (data.action === "fold") {
            player.folded = true;
        } else if (data.action === "call" || data.action === "check") {
            let diff = lobby.highestBet - player.currentBet;
            
            if (diff > player.chips) {
                diff = player.chips;
                player.isAllIn = true;
            }

            player.chips -= diff;
            player.currentBet += diff;
            player.totalContribution += diff; // TRACK TOTAL FOR SIDE POTS
            lobby.pot += diff;

            if (player.chips === 0) player.isAllIn = true;
        } else if (data.action === "raise" && data.amount) {
            const totalBet = data.amount;
            if (totalBet < lobby.highestBet || totalBet > player.chips + player.currentBet) return;
            
            const diff = totalBet - player.currentBet;
            player.chips -= diff;
            player.currentBet = totalBet;
            player.totalContribution += diff; // TRACK TOTAL FOR SIDE POTS
            lobby.highestBet = totalBet;
            lobby.pot += diff;

            if (player.chips === 0) player.isAllIn = true;
        }

        // 2. CHECK IF HAND ENDED (Everyone folded)
        const active = lobby.players.filter(p => !p.folded);
        if (active.length === 1) return resolvePot(lobby);

        // 3. PROGRESS TURN OR STAGE
        // Someone can only act if they aren't folded and aren't all-in
        const needsToAct = active.filter(p => !p.isAllIn);
        const everyoneActed = needsToAct.every(p => p.currentBet === lobby.highestBet);
        
        if (everyoneActed || needsToAct.length === 0) {
            advanceStage(lobby);
        } else {
            do {
                lobby.turnIndex = (lobby.turnIndex + 1) % lobby.players.length;
            } while (lobby.players[lobby.turnIndex].folded || lobby.players[lobby.turnIndex].isAllIn);
        }

        broadcastUpdate(lobby);
    }
} satisfies EventObject<typeof schema>;

function advanceStage(lobby: LobbyType) {
    lobby.players.forEach(p => p.currentBet = 0);
    lobby.highestBet = 0;

    if (lobby.stage === GameStage.PRE_FLOP) {
        lobby.stage = GameStage.FLOP;
        lobby.communityCards.push(...lobby.deck.splice(0, 3));
    } else if (lobby.stage === GameStage.FLOP) {
        lobby.stage = GameStage.TURN;
        lobby.communityCards.push(lobby.deck.splice(0, 1)[0]);
    } else if (lobby.stage === GameStage.TURN) {
        lobby.stage = GameStage.RIVER;
        lobby.communityCards.push(lobby.deck.splice(0, 1)[0]);
    } else if (lobby.stage === GameStage.RIVER) {
        return resolvePot(lobby);
    }

    // After a stage advances, the first non-folded, non-all-in player after the dealer starts
    const active = lobby.players.filter(p => !p.folded && !p.isAllIn);
    
    // If everyone is all-in, just skip straight to next stage or resolution
    if (active.length < 2 && lobby.stage !== GameStage.SHOWDOWN) {
        return advanceStage(lobby);
    }

    lobby.turnIndex = (lobby.dealerIndex + 1) % lobby.players.length;
    while (lobby.players[lobby.turnIndex].folded || lobby.players[lobby.turnIndex].isAllIn) {
        lobby.turnIndex = (lobby.turnIndex + 1) % lobby.players.length;
    }
}

function resolvePot(lobby: LobbyType) {
    // 1. Calculate the actual side pots based on contributions
    const pots = calculatePots(lobby);

    // 2. Iterate through every pot and find winners
    for (const pot of pots) {
        const eligiblePlayers = lobby.players.filter(p => 
            pot.eligiblePlayerIds.includes(p.id)
        );

        if (eligiblePlayers.length === 0) continue;

        const scores = eligiblePlayers.map(p => ({
            id: p.id,
            score: evaluate([...p.cards, ...lobby.communityCards])
        }));

        const minScore = Math.min(...scores.map(s => s.score));
        const winners = scores.filter(s => s.score === minScore);

        const share = Math.floor(pot.amount / winners.length);
        winners.forEach(w => {
            const p = lobby.players.find(pl => pl.id === w.id);
            if (p) p.chips += share;
        });
    }
    
    // 3. Reset Table
    lobby.stage = GameStage.PRE_FLOP;
    lobby.pot = 0;
    lobby.communityCards = [];
    lobby.players.forEach(p => {
        p.totalContribution = 0;
        p.currentBet = 0;
        p.folded = false;
        p.isAllIn = false;
    });
    lobby.dealerIndex = (lobby.dealerIndex + 1) % lobby.players.length;
    broadcastUpdate(lobby);
}