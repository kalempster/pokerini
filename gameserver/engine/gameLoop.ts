import { ChipSyncPaused, ChipSyncResumed } from "../shared/messages";
import type { Lobby } from "../shared/poker";
import {
    lobbies,
    pendingJoins,
    pendingLeaves,
    disconnectedSessions,
    pendingKicks,
} from "../utils/caches";
import { persistChips, type ChipRecord } from "../utils/chips";
import { shutdownLobby } from "../utils/lobby";
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

// ─── Acted-this-street registry ───────────────────────────────────────────────
//
// Tracks which players have voluntarily acted in the current betting street.
// Street ends when every non-folded, non-all-in player has acted AND all their
// bets equal highestBet.
//
// On raise: clear the set and add only the raiser — everyone else must respond.
// On new street / new hand: clear the set entirely.

const actedThisStreet = new Map<string, Set<string>>();

export function clearActed(lobbyId: string) {
    actedThisStreet.set(lobbyId, new Set());
}

export function markActed(lobbyId: string, playerId: string) {
    const set = actedThisStreet.get(lobbyId) ?? new Set<string>();
    set.add(playerId);
    actedThisStreet.set(lobbyId, set);
}

/** Called on raise — reopens action for everyone except the raiser. */
export function markRaise(lobbyId: string, raiserId: string) {
    actedThisStreet.set(lobbyId, new Set([raiserId]));
}

function isStreetOver(lobby: Lobby): boolean {
    const nonFolded = lobby.players.filter((p) => !p.folded);
    if (nonFolded.length <= 1) return true;

    const active = nonFolded.filter((p) => !p.isAllIn);
    if (active.length === 0) return true; // everyone all-in

    const acted = actedThisStreet.get(lobby.id) ?? new Set<string>();

    console.log(
        `[isStreetOver] stage=${lobby.stage} active=${active.map((p) => p.id)} acted=${[...acted]} highestBet=${lobby.highestBet}`,
    );

    // Every active player must have voluntarily acted AND matched the highest bet
    return active.every((p) => acted.has(p.id) && p.currentBet === lobby.highestBet);
}

// ─── Broadcast/Unicast (injected from index.ts) ───────────────────────────────

type BroadcastFn = (lobbyId: string) => Promise<void>;
let _broadcast: BroadcastFn = async () => {};
export function setBroadcast(fn: BroadcastFn) {
    _broadcast = fn;
}

type UnicastFn = (userId: string, lobbyId: string) => Promise<void>;
let _unicast: UnicastFn = async () => {};
export function setUnicast(fn: UnicastFn) {
    _unicast = fn;
}

type NotifyPlayerFn = (
    userId: string,
    msg: typeof ChipSyncPaused | typeof ChipSyncResumed,
    payload: Record<string, unknown>,
) => Promise<any>;

let _notifyPlayer: NotifyPlayerFn = async () => {};
export function setNotifyPlayer(fn: NotifyPlayerFn) {
    _notifyPlayer = fn;
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
                    current.stage === "BETWEEN_HANDS" ||
                    current.stage === "SHOWDOWN"
                )
                    return;

                const player = current.players[current.turnIndex];
                if (player) {
                    markActed(lobbyId, player.id);
                    player.folded = true;
                }

                const shouldBroadcast = await advanceTurnOrStage(current);
                if (shouldBroadcast) await _broadcast(lobbyId);
                // if false: endHand already broadcast — do nothing
            });
        }, TURN_MS),
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

export async function advanceTurnOrStage(lobby: Lobby): Promise<boolean> {
    const nonFolded = lobby.players.filter((p) => !p.folded);

    // Everyone else folded — award pot immediately
    if (nonFolded.length === 1) {
        nonFolded[0]!.chips += lobby.pot;
        await endHand(lobby);
        return false;
    }

    if (isStreetOver(lobby)) {
        await advanceStage(lobby);
        return false;
    }
    const next = nextActivePlayer(lobby, lobby.turnIndex);
    lobby.turnIndex = next;
    lobby.turnId++;
    lobby.turnDeadline = Date.now() + TURN_MS;
    scheduleTurnTimer(lobby);
    return true;
}

async function advanceStage(lobby: Lobby) {
    // New street — reset bets and clear acted set
    lobby.players.forEach((p) => (p.currentBet = 0));
    lobby.highestBet = 0;
    clearActed(lobby.id);

    if (lobby.stage === "PRE_FLOP") {
        lobby.stage = "FLOP";
        lobby.communityCards.push(lobby.deck!.pop()!, lobby.deck!.pop()!, lobby.deck!.pop()!);
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

    // Post-flop: first active player after the dealer acts first
    const first = nextActivePlayer(lobby, lobby.dealerIndex);
    if (first === -1) {
        // All remaining players are all-in — run out the board
        await advanceStage(lobby);
        return;
    }

    lobby.turnIndex = first;
    lobby.turnId++;
    lobby.turnDeadline = Date.now() + TURN_MS;
    scheduleTurnTimer(lobby);
    await _broadcast(lobby.id);
}

async function endHand(lobby: Lobby) {
    clearTurnTimer(lobby.id);
    actedThisStreet.delete(lobby.id);

    lobby.stage = "BETWEEN_HANDS";

    await _broadcast(lobby.id);


    const chipSnapshot: ChipRecord[] = lobby.players.map((p) => ({
        playerId: p.id,
        chips: p.chips,
    }));


    // ── 1. Move busted players to spectators ──────────────────────────────────
    const busted: string[] = [];
    for (const p of lobby.players) {
        if (p.chips === 0) busted.push(p.id);
    }
    for (const uid of busted) {
        const idx = lobby.players.findIndex((p) => p.id === uid);
        if (idx === -1) continue;
        const [removed] = lobby.players.splice(idx, 1) as [(typeof lobby.players)[0]];
        if (idx <= lobby.dealerIndex && lobby.dealerIndex > 0) lobby.dealerIndex--;
        // Keep them subscribed to the lobby topic — they just become a spectator
        lobby.spectators.push({ id: removed.id, username: removed.username });
    }

    // ── 2. Eject kicked players ───────────────────────────────────────────────
    const kicks = pendingKicks.get(lobby.id) ?? new Set<string>();
    for (const uid of kicks) {
        const idx = lobby.players.findIndex((p) => p.id === uid);
        if (idx !== -1) {
            lobby.players.splice(idx, 1);
            if (idx <= lobby.dealerIndex && lobby.dealerIndex > 0) lobby.dealerIndex--;
        }
        // Also remove from spectators if they were busted + kicked this hand
        lobby.spectators = lobby.spectators.filter((s) => s.id !== uid);
        disconnectedSessions.delete(uid);
    }
    pendingKicks.delete(lobby.id);

    // ── 3. Flush disconnected/leaving ─────────────────────────────────────────
    const leaving = pendingLeaves.get(lobby.id) ?? new Set<string>();
    for (const [userId, lid] of disconnectedSessions) {
        if (lid === lobby.id) {
            leaving.add(userId);
            disconnectedSessions.delete(userId);
        }
    }
    for (const uid of leaving) {
        const idx = lobby.players.findIndex((p) => p.id === uid);
        if (idx === -1) continue;
        lobby.players.splice(idx, 1);
        if (idx <= lobby.dealerIndex && lobby.dealerIndex > 0) lobby.dealerIndex--;
        // Leavers don't spectate — remove from spectators too if they busted
        lobby.spectators = lobby.spectators.filter((s) => s.id !== uid);
    }
    pendingLeaves.delete(lobby.id);

    // ── 4. Flush pending joins ────────────────────────────────────────────────
    const joining = pendingJoins.get(lobby.id) ?? [];
    for (const player of joining) lobby.players.push(player);
    pendingJoins.delete(lobby.id);

   

    await persistChips(lobby.id, chipSnapshot, {
        onPause: (lobbyId) => {
            const l = lobbies.get(lobbyId);
            if (l) l.paused = true;
        },
        onResume: async (lobbyId) => {
            await getLobbyMutex(lobbyId).run(async () => {
                const l = lobbies.get(lobbyId);
                if (!l || l.stage !== "BETWEEN_HANDS") return;
                l.paused = false;
                startHand(l);
                await _broadcast(lobbyId);
            });
        },
        notifyPaused: async (playerIds) => {
            for (const id of playerIds) {
                await _notifyPlayer(id, ChipSyncPaused, {
                    lobbyId: lobby.id,
                    reason: "Balance sync failed. Next hand is paused until your chips are secured.",
                });
            }
        },
        notifyResumed: async (playerIds) => {
            for (const id of playerIds) {
                await _notifyPlayer(id, ChipSyncResumed, { lobbyId: lobby.id });
            }
        },
    });

    // ── 6. Close if pending ───────────────────────────────────────────────────
    if (lobby.pendingClose) {
        await shutdownLobby(lobby);
        return; // shutdownLobby sends LobbyClosed to everyone — no broadcast needed
    }

    // ── 7. Single broadcast ───────────────────────────────────────────────────
    // Spectators also receive this via their player: topic subscription
   

    // ── 8. Drop to lobby if not enough seated players ─────────────────────────
    if (lobby.players.length < 2) {
        setTimeout(async () => {
            lobby.stage = "LOBBY";
            lobby.communityCards = [];
            lobby.pot = 0;
            lobby.deck = [];
            await _broadcast(lobby.id);
           
        }, BETWEEN_HANDS_MS);

        return;
    }

    // ── 9. Schedule next hand ─────────────────────────────────────────────────
    const lobbyId = lobby.id;
    setTimeout(async () => {
        await getLobbyMutex(lobbyId).run(async () => {
            const current = lobbies.get(lobbyId);
            if (!current || current.stage !== "BETWEEN_HANDS") return;
            if (current.paused) return;
            startHand(current);
            await _broadcast(lobbyId);
        });
    }, BETWEEN_HANDS_MS);
}
