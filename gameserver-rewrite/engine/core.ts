import { evaluate } from "@pokertools/evaluator";
import type { Lobby, SafeLobby } from "../shared/poker";
import { scheduleTurnTimer, TURN_MS } from "../engine/gameLoop";

export const createDeck = (): number[] =>
    Array.from({ length: 52 }, (_, i) => i).sort(() => Math.random() - 0.5);

export function sanitizeLobby(lobby: Lobby, recipientId: string): SafeLobby {
    return {
        ...lobby,
        deck: undefined,
        players: lobby.players.map((p) => ({
            ...p,
            cards:
                p.id === recipientId ||
                lobby.stage === "SHOWDOWN" ||
                lobby.stage === "LOBBY"
                    ? p.cards
                    : undefined,
        })),
    } as SafeLobby;
}

export function nextActivePlayer(lobby: Lobby, startIndex: number): number {
    let idx = startIndex;
    for (let i = 0; i < lobby.players.length; i++) {
        idx = (idx + 1) % lobby.players.length;
        if (!lobby.players[idx]!.folded && !lobby.players[idx]!.isAllIn)
            return idx;
    }
    return -1;
}

function postBlind(lobby: Lobby, idx: number, amount: number) {
    const p = lobby.players[idx]!;
    const actual = Math.min(amount, p.chips);
    p.chips -= actual;
    p.currentBet = actual;
    p.totalContribution = actual;
    lobby.pot += actual;
    lobby.highestBet = Math.max(lobby.highestBet, actual);
    if (p.chips === 0) p.isAllIn = true;
}

export function startHand(lobby: Lobby) {
    const deck = createDeck();
    lobby.deck = deck;
    lobby.stage = "PRE_FLOP";
    lobby.communityCards = [];
    lobby.pot = 0;
    lobby.highestBet = 0;
    lobby.dealerIndex = (lobby.dealerIndex + 1) % lobby.players.length;

    lobby.players.forEach((p) => {
        p.currentBet = 0;
        p.totalContribution = 0;
        p.folded = false;
        p.isAllIn = false;
        p.cards = [deck.pop()!, deck.pop()!];
    });

    const n = lobby.players.length;
    const sbIdx = (lobby.dealerIndex + 1) % n;
    const bbIdx = (lobby.dealerIndex + 2) % n;

    postBlind(lobby, sbIdx, Math.floor(lobby.bigBlind / 2));
    postBlind(lobby, bbIdx, lobby.bigBlind);

    // UTG acts first (player after BB)
    lobby.turnIndex = nextActivePlayer(lobby, bbIdx);
    lobby.turnId++;
    lobby.turnDeadline = Date.now() + TURN_MS;
    scheduleTurnTimer(lobby);
}

function calculatePots(lobby: Lobby) {
    let contributions = lobby.players
        .filter((p) => p.totalContribution > 0)
        .map((p) => ({
            id: p.id,
            amount: p.totalContribution,
            folded: p.folded,
        }));

    const pots = [];
    while (contributions.length > 0) {
        const smallest = Math.min(...contributions.map((c) => c.amount));
        const potAmount = smallest * contributions.length;
        const eligible = contributions
            .filter((c) => !c.folded)
            .map((c) => c.id);
        pots.push({ amount: potAmount, eligible });
        contributions = contributions
            .map((c) => ({ ...c, amount: c.amount - smallest }))
            .filter((c) => c.amount > 0);
    }
    return pots;
}

/** Calculates and distributes winnings. Does NOT reset lobby state — endHand() does that. */
export function resolveHand(lobby: Lobby) {
    const pots = calculatePots(lobby);
    for (const pot of pots) {
        const eligible = lobby.players.filter((p) =>
            pot.eligible.includes(p.id)
        );
        if (eligible.length === 0) continue;

        const scores = eligible.map((p) => ({
            id: p.id,
            val: evaluate([...p.cards, ...lobby.communityCards]),
        }));

        const best = Math.min(...scores.map((s) => s.val));
        const winners = scores.filter((s) => s.val === best);
        const share = Math.floor(pot.amount / winners.length);

        winners.forEach((w) => {
            const p = lobby.players.find((pl) => pl.id === w.id);
            if (p) p.chips += share;
        });
    }
}