import { createRouter, withPubSub, withZod } from "@ws-kit/zod";
import { withRpc } from "@ws-kit/plugins";
import { serve } from "@ws-kit/bun";
import { memoryPubSub } from "@ws-kit/memory";

import { client } from "./utils/client";
import type { Lobby } from "./shared/poker";
import {
    CreateLobbyRpc,
    JoinLobbyRpc,
    ReauthenticateRpc,
    GetHandRpc,
    PlayerAction,
    SyncLobby,
    StartGame,
    ReauthNeeded,
    KickPlayer,
    YouWereKicked,
    CloseLobby,
    LeaveLobby,
} from "./shared/messages";
import { sanitizeLobby, startHand } from "./engine/core";
import { applyAction } from "./engine/actionHandler";
import {
    lobbies,
    pendingJoins,
    pendingLeaves,
    disconnectedSessions,
    pendingKicks,
} from "./utils/caches";
import {
    getLobbyMutex,
    setBroadcast,
    setUnicast,
    clearTurnTimer,
    setNotifyPlayer,
} from "./engine/gameLoop";
import { generateLobbyCode } from "./utils/generateLobbyCode";
import { setPublish, shutdownLobby } from "./utils/lobby";

// ─── Types ───────────────────────────────────────────────────────────────────

type AppData = {
    userId: string;
    username: string;
    chips: number;
    tokenExpiry: number;
    reauthed: boolean;
    lobbyId?: string;
    // True when this connection is a reconnect that needs a sync pushed on open
    pendingReconnectSync: boolean;
};

// ─── Router ──────────────────────────────────────────────────────────────────

const router = createRouter<AppData>()
    .plugin(withZod())
    .plugin(withRpc())
    .plugin(withPubSub({ adapter: memoryPubSub() }));


// ─── Broadcast helpers ───────────────────────────────────────────────────────

async function broadcastLobby(lobbyId: string) {
    const lobby = lobbies.get(lobbyId);
    if (!lobby) return;
    for (const player of lobby.players) {
        await router.publish(`player:${player.id}`, SyncLobby, sanitizeLobby(lobby, player.id));
    }
    for (const spectator of lobby.spectators) {
        await router.publish(`player:${spectator.id}`, SyncLobby, sanitizeLobby(lobby, spectator.id));
    }
}

async function unicastLobby(userId: string, lobbyId: string) {
    const lobby = lobbies.get(lobbyId);
    if (!lobby) return;
    await router.publish(`player:${userId}`, SyncLobby, sanitizeLobby(lobby, userId));
}

setBroadcast(broadcastLobby);
setUnicast(unicastLobby);
setPublish((topic, msg, payload) => router.publish(topic, msg, payload));
setNotifyPlayer((userId, msg, payload) =>
    router.publish(`player:${userId}`, msg, payload as never),
);

// ─── Auth middleware ──────────────────────────────────────────────────────────

router.use(async (ctx, next) => {
    if (ctx.type === ReauthenticateRpc.type) return next();

    const now = Date.now();
    if (now >= ctx.data.tokenExpiry) return ctx.error("UNAUTHENTICATED", "Session expired");

    const twoMins = 2 * 60 * 1000;
    if (!ctx.data.reauthed && ctx.data.tokenExpiry - now < twoMins) {
        ctx.assignData({ reauthed: true });
        await router.publish(`player:${ctx.data.userId}`, ReauthNeeded, {
            expiresAt: ctx.data.tokenExpiry,
        });
    }

    return next();
});

// ─── On connect ──────────────────────────────────────────────────────────────

router.onOpen(async (ctx) => {
    // Always subscribe to the private player topic
    await ctx.topics.subscribe(`player:${ctx.data.userId}`);

    if (!ctx.data.pendingReconnectSync || !ctx.data.lobbyId) return;

    // Re-subscribe to lobby topic and push current state
    await ctx.topics.subscribe(ctx.data.lobbyId);
    ctx.assignData({ pendingReconnectSync: false });

    await unicastLobby(ctx.data.userId, ctx.data.lobbyId);
});

// ─── RPCs ────────────────────────────────────────────────────────────────────

router.rpc(ReauthenticateRpc, async (ctx) => {
    try {
        const { user, expMs } = await client.gameserver.isUserAuthed.query(ctx.payload.token);
        ctx.assignData({ tokenExpiry: expMs, chips: user.chips, reauthed: false });
        ctx.reply({ success: true, expiry: expMs });
    } catch {
        ctx.error("AUTH_FAILED", "Invalid token");
    }
});

router.rpc(CreateLobbyRpc, async (ctx) => {
    // Already in a valid lobby → just sync them
    if (ctx.data.lobbyId) {
        const existing = lobbies.get(ctx.data.lobbyId);
        if (existing) return ctx.reply(sanitizeLobby(existing, ctx.data.userId));
        // Lobby gone (closed) — clear stale id and fall through to create
        ctx.assignData({ lobbyId: undefined });
    }

    let id = generateLobbyCode();
    while (lobbies.has(id)) id = generateLobbyCode();

    const lobby: Lobby = {
        id,
        hostId: ctx.data.userId,
        maxPlayers: ctx.payload.maxPlayers,
        bigBlind: ctx.payload.bigBlind,
        stage: "LOBBY",
        players: [
            {
                id: ctx.data.userId,
                username: ctx.data.username,
                chips: ctx.data.chips,
                cards: [0, 0],
                currentBet: 0,
                totalContribution: 0,
                folded: false,
                isAllIn: false,
            },
        ],
        communityCards: [],
        highestBet: 0,
        pot: 0,
        dealerIndex: 0,
        turnIndex: 0,
        turnId: 0,
        turnDeadline: 0,
        deck: [],
        bannedPlayers: [],
        pendingClose: false,
        paused: false,
        spectators: [],
    };

    lobbies.set(id, lobby);
    ctx.assignData({ lobbyId: id });
    await ctx.topics.subscribe(id);
    ctx.reply(sanitizeLobby(lobby, ctx.data.userId));
});

router.rpc(JoinLobbyRpc, async (ctx) => {
    const lobby = lobbies.get(ctx.payload.lobbyId);
    if (!lobby) return ctx.error("NOT_FOUND", "Lobby not found");
    if (lobby.bannedPlayers.includes(ctx.data.userId))
        return ctx.error("FORBIDDEN", "You have been kicked from this lobby");
    if (
        lobby.players.some((p) => p.id === ctx.data.userId) ||
        lobby.spectators.some((s) => s.id === ctx.data.userId)
    )
        return ctx.error("ERROR", "Already in this lobby");
    if (lobby.pendingClose) return ctx.error("ERROR", "This lobby is closing");

    await ctx.topics.subscribe(lobby.id);
    ctx.assignData({ lobbyId: lobby.id });

    // No chips → spectate only
    if (ctx.data.chips === 0) {
        lobby.spectators.push({
            id: ctx.data.userId,
            username: ctx.data.username,
        });
        await ctx.publish(lobby.id, SyncLobby, sanitizeLobby(lobby, ""));
        return ctx.reply(sanitizeLobby(lobby, ctx.data.userId));
    }

    if (lobby.players.length >= lobby.maxPlayers) return ctx.error("ERROR", "Table is full");

    const player = {
        id: ctx.data.userId,
        username: ctx.data.username,
        chips: ctx.data.chips,
        cards: [0, 0] as [number, number],
        currentBet: 0,
        totalContribution: 0,
        folded: false,
        isAllIn: false,
    };

    if (lobby.stage === "LOBBY") {
        lobby.players.push(player);
        await ctx.publish(lobby.id, SyncLobby, sanitizeLobby(lobby, ""));
    } else {
        const queue = pendingJoins.get(lobby.id) ?? [];
        queue.push(player);
        pendingJoins.set(lobby.id, queue);
    }

    ctx.reply(sanitizeLobby(lobby, ctx.data.userId));
});

router.rpc(GetHandRpc, async (ctx) => {
    const lobby = lobbies.get(ctx.payload.lobbyId);
    if (!lobby) return ctx.error("NOT_FOUND", "Lobby not found");
    const player = lobby.players.find((p) => p.id === ctx.data.userId);
    ctx.reply({ cards: player?.cards });
});

// ─── Messages ────────────────────────────────────────────────────────────────

router.on(StartGame, async (ctx) => {
    const lobbyId = ctx.payload.lobbyId;

    await getLobbyMutex(lobbyId).run(async () => {
        const lobby = lobbies.get(lobbyId);
        if (!lobby) return;
        if (lobby.hostId !== ctx.data.userId) return;
        if (lobby.stage !== "LOBBY") return;
        if (lobby.players.length < 2)
            return ctx.error("FAILED_PRECONDITION", "Need at least 2 players");

        startHand(lobby);
        await broadcastLobby(lobbyId);
    });
});

router.on(PlayerAction, async (ctx) => {
    const lobbyId = ctx.data.lobbyId;
    if (!lobbyId) return;

    await getLobbyMutex(lobbyId).run(async () => {
        const lobby = lobbies.get(lobbyId);
        if (!lobby) return;

        const result = await applyAction(lobby, ctx.data.userId, ctx.payload);
        if (!result.ok) return;

        // Only broadcast if endHand didn't already handle it
        if (result.shouldBroadcast) await broadcastLobby(lobbyId);
    });
});

router.on(KickPlayer, async (ctx) => {
    const { lobbyId, targetUserId } = ctx.payload;

    await getLobbyMutex(lobbyId).run(async () => {
        const lobby = lobbies.get(lobbyId);
        if (!lobby) return;
        if (lobby.hostId !== ctx.data.userId) return;
        if (targetUserId === ctx.data.userId) return; // can't kick yourself

        // Always ban immediately so they can't rejoin
        if (!lobby.bannedPlayers.includes(targetUserId)) lobby.bannedPlayers.push(targetUserId);

        // Notify the kicked player regardless of stage
        await router.publish(`player:${targetUserId}`, YouWereKicked, { lobbyId });

        if (lobby.stage === "LOBBY") {
            const idx = lobby.players.findIndex((p) => p.id === targetUserId);
            if (idx !== -1) {
                lobby.players.splice(idx, 1);
                if (idx <= lobby.dealerIndex && lobby.dealerIndex > 0) lobby.dealerIndex--;
            }
            await broadcastLobby(lobbyId);
        } else {
            // Mid-hand: queue for ejection at endHand
            const kicks = pendingKicks.get(lobbyId) ?? new Set<string>();
            kicks.add(targetUserId);
            pendingKicks.set(lobbyId, kicks);
        }
    });
});

router.on(CloseLobby, async (ctx) => {
    const { lobbyId } = ctx.payload;

    await getLobbyMutex(lobbyId).run(async () => {
        const lobby = lobbies.get(lobbyId);
        if (!lobby) return;
        if (lobby.hostId !== ctx.data.userId) return;

        if (lobby.stage === "LOBBY") {
            await shutdownLobby(lobby);
        } else {
            lobby.pendingClose = true;
        }
    });
});

router.on(LeaveLobby, async (ctx) => {
    const { lobbyId } = ctx.payload;
    const { userId } = ctx.data;

    await getLobbyMutex(lobbyId).run(async () => {
        const lobby = lobbies.get(lobbyId);
        if (!lobby) return;

        ctx.assignData({ lobbyId: undefined });

        if (lobby.hostId === userId) {
            // Host leaving = close the lobby
            if (lobby.stage === "LOBBY") {
                await shutdownLobby(lobby);
            } else {
                lobby.pendingClose = true;
            }
        } else {
            if (lobby.stage === "LOBBY") {
                const idx = lobby.players.findIndex((p) => p.id === userId);
                if (idx !== -1) {
                    lobby.players.splice(idx, 1);
                    if (idx <= lobby.dealerIndex && lobby.dealerIndex > 0) lobby.dealerIndex--;
                }
                await broadcastLobby(lobbyId);
            } else {
                // Mid-hand: treat same as disconnect
                const leaves = pendingLeaves.get(lobby.id) ?? new Set<string>();
                leaves.add(userId);
                pendingLeaves.set(lobby.id, leaves);
            }
        }
    });
});

// ─── Disconnect ───────────────────────────────────────────────────────────────

router.onClose(async (ctx) => {
    const { userId, lobbyId } = ctx.data;
    if (!lobbyId) return;

    const lobby = lobbies.get(lobbyId);
    if (!lobby) return;

    await getLobbyMutex(lobbyId).run(async () => {
        if (lobby.stage === "LOBBY") {
            // No ongoing hand — remove immediately
            const idx = lobby.players.findIndex((p) => p.id === userId);
            if (idx !== -1) {
                lobby.players.splice(idx, 1);
                if (idx <= lobby.dealerIndex && lobby.dealerIndex > 0) lobby.dealerIndex--;
            }

            if (lobby.players.length === 0) {
                lobbies.delete(lobbyId);
                clearTurnTimer(lobbyId);
                return;
            }

            if (lobby.hostId === userId) lobby.hostId = lobby.players[0]!.id;
            await router.publish(lobbyId, SyncLobby, sanitizeLobby(lobby, ""));
        } else {
            // Mid-hand: park the player, let the turn timer handle their turns
            // They'll be ejected at endHand() if they haven't reconnected by then
            disconnectedSessions.set(userId, lobbyId);
        }
    });
});

// ─── Server ──────────────────────────────────────────────────────────────────

serve(router, {
    port: Number(process.env.PORT ?? 3000),

    async authenticate(req) {
        console.log("auth");

        const token = req.headers
            .get("sec-websocket-protocol")
            ?.split(".")
            .toSpliced(0, 1)
            .join(".");

        if (!token) return undefined;

        try {
            const { user, expMs } = await client.gameserver.isUserAuthed.query(token);
            // Check if this is a reconnect for an ongoing hand
            const reconnectLobbyId = disconnectedSessions.get(user.id);
            const isReconnect = !!reconnectLobbyId;

            if (isReconnect) {
                // Remove from disconnected — they're back
                disconnectedSessions.delete(user.id);
                // Also remove from pendingLeaves if endHand hasn't fired yet
                const leaves = pendingLeaves.get(reconnectLobbyId!);
                leaves?.delete(user.id);
            }
            console.log(expMs);

            return {
                userId: user.id,
                username: user.username,
                chips: user.chips,
                tokenExpiry: expMs,
                reauthed: false,
                lobbyId: reconnectLobbyId ?? undefined,
                pendingReconnectSync: isReconnect,
            };
        } catch (error) {
            console.error(error);
            return undefined;
        }
    },
});
