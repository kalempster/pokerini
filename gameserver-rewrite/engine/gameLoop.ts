import type { Lobby } from "../shared/poker";
import {
    lobbies,
    pendingJoins,
    pendingLeaves,
    disconnectedSessions,
} from "../utils/caches";
import { Mutex } from "../utils/mutex";
import { resolveHand, startHand, nextActivePlayer } from "./core";

// ─── Per-lobby mutex + timer ──────────────────────────────────────────────────

const mutexes = new Map<string, Mutex>();
const timers = new Map<string, Timer>();

export const TURN_MS = 30_000;
export const BETWEEN_HANDS_MS = 5_000;

export function getLobbyMutex(lobbyId: string): Mutex {
    if (!mutexes.has(lobbyId)) mutexes.set(lobbyId, new Mutex());
    return mutexes.get(lobbyId)!;
}

// ─── Broadcast (injected from index.ts to avoid circular deps) ───────────────

type BroadcastFn = (lobbyId: string) => Promise<void>;
let _broadcast: BroadcastFn = async () => {};
export function setBroadcast(fn: BroadcastFn) {
    _broadcast = fn;
}

// Also injected — used to push a one-off sync to a single reconnecting user
type UnicastFn = (userId: string, lobbyId: string) => Promise<void>;
let _unicast: UnicastFn = async () => {};
export function setUnicast(fn: UnicastFn) {
    _unicast = fn;
}

// ─── Timer ───────────────────────────────────────────────────────────────────

export function scheduleTurnTimer(lobby: Lobby) {
    clearTurnTimer(lobby.id);

    const { id: lobbyId, turnId } = lobby;

    timers.set(
        lobbyId,
        setTimeout(async () => {
            await getLobbyMutex(lobbyId).run(async () => {
                const current = lobbies.get(lobbyId);
                if (!current || current.turnId !== turnId) return;
                if (
                    current.stage === "LOBBY" ||
                    current.stage === "SHOWDOWN"
                )
                    return;

                const player = current.players[current.turnIndex];
                if (player) player.folded = true;

                await advanceTurnOrStage(current);
                await _broadcast(lobbyId);
            });
        }, TURN_MS)
    );
}

export function clearTurnTimer(lobbyId: string) {
    const t = timers.get(lobbyId);
    if (t) {
        clearTimeout(t);
        timers.delete(lobbyId);
    }
}

// ─── Core game loop ──────────────────────────────────────────────────────────

export async function advanceTurnOrStage(lobby: Lobby) {
    const nonFolded = lobby.players.filter((p) => !p.folded);

    if (nonFolded.length === 1) {
        nonFolded[0]!.chips += lobby.pot;
        await endHand(lobby);
        return;
    }

    const active = lobby.players.filter((p) => !p.folded && !p.isAllIn);
    const betsSettled =
        active.length === 0 ||
        active.every((p) => p.currentBet === lobby.highestBet);

    if (betsSettled) {
        await advanceStage(lobby);
    } else {
        const next = nextActivePlayer(lobby, lobby.turnIndex);
        lobby.turnIndex = next;
        lobby.turnId++;
        lobby.turnDeadline = Date.now() + TURN_MS;
        scheduleTurnTimer(lobby);
    }
}

async function advanceStage(lobby: Lobby) {
    lobby.players.forEach((p) => (p.currentBet = 0));
    lobby.highestBet = 0;

    if (lobby.stage === "PRE_FLOP") {
        lobby.stage = "FLOP";
        lobby.communityCards.push(
            lobby.deck!.pop()!,
            lobby.deck!.pop()!,
            lobby.deck!.pop()!
        );
    } else if (lobby.stage === "FLOP") {
        lobby.stage = "TURN";
        lobby.communityCards.push(lobby.deck!.pop()!);
    } else if (lobby.stage === "TURN") {
        lobby.stage = "RIVER";
        lobby.communityCards.push(lobby.deck!.pop()!);
    } else if (lobby.stage === "RIVER") {
        lobby.stage = "SHOWDOWN";
        resolveHand(lobby);
        await endHand(lobby);
        return;
    }

    const first = nextActivePlayer(lobby, lobby.dealerIndex);
    if (first === -1) {
        await advanceStage(lobby);
        return;
    }

    lobby.turnIndex = first;
    lobby.turnId++;
    lobby.turnDeadline = Date.now() + TURN_MS;
    scheduleTurnTimer(lobby);
}

async function endHand(lobby: Lobby) {
    clearTurnTimer(lobby.id);

    // Remove players who disconnected and never came back
    const leaving = pendingLeaves.get(lobby.id) ?? new Set<string>();

    // Also collect any who are still in disconnectedSessions at hand end
    for (const [userId, lobbyId] of disconnectedSessions) {
        if (lobbyId === lobby.id) {
            leaving.add(userId);
            disconnectedSessions.delete(userId);
        }
    }

    for (const uid of leaving) {
        const idx = lobby.players.findIndex((p) => p.id === uid);
        if (idx === -1) continue;
        lobby.players.splice(idx, 1);
        if (idx <= lobby.dealerIndex && lobby.dealerIndex > 0)
            lobby.dealerIndex--;
    }
    pendingLeaves.delete(lobby.id);

    // Flush pending joins
    const joining = pendingJoins.get(lobby.id) ?? [];
    for (const player of joining) lobby.players.push(player);
    pendingJoins.delete(lobby.id);

    if (lobby.players.length < 2) {
        lobby.stage = "LOBBY";
        lobby.communityCards = [];
        lobby.pot = 0;
        lobby.deck = [];
        return;
    }

    const lobbyId = lobby.id;
    setTimeout(async () => {
        await getLobbyMutex(lobbyId).run(async () => {
            const current = lobbies.get(lobbyId);
            if (!current) return;
            startHand(current);
            await _broadcast(lobbyId);
        });
    }, BETWEEN_HANDS_MS);
}