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
} from "./shared/messages";
import { sanitizeLobby, startHand } from "./engine/core";
import { applyAction } from "./engine/actionHandler";
import {
    lobbies,
    pendingJoins,
    pendingLeaves,
    disconnectedSessions,
} from "./utils/caches";
import {
    getLobbyMutex,
    setBroadcast,
    setUnicast,
    clearTurnTimer,
} from "./engine/gameLoop";
import { generateLobbyCode } from "./utils/generateLobbyCode";

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
        await router.publish(
            `player:${player.id}`,
            SyncLobby,
            sanitizeLobby(lobby, player.id)
        );
    }
}

async function unicastLobby(userId: string, lobbyId: string) {
    const lobby = lobbies.get(lobbyId);
    if (!lobby) return;
    await router.publish(
        `player:${userId}`,
        SyncLobby,
        sanitizeLobby(lobby, userId)
    );
}

setBroadcast(broadcastLobby);
setUnicast(unicastLobby);

// ─── Auth middleware ──────────────────────────────────────────────────────────

router.use(async (ctx, next) => {
    if (ctx.type === ReauthenticateRpc.type) return next();

    const now = Date.now();
    if (now >= ctx.data.tokenExpiry)
        return ctx.error("UNAUTHENTICATED", "Session expired");

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
        const { user, expMs } = await client.gameserver.isUserAuthed.query(
            ctx.payload.token
        );
        ctx.assignData({ tokenExpiry: expMs, chips: user.chips, reauthed: false });
        ctx.reply({ success: true, expiry: expMs });
    } catch {
        ctx.error("AUTH_FAILED", "Invalid token");
    }
});

router.rpc(CreateLobbyRpc, async (ctx) => {
    if (ctx.data.lobbyId) {
        const existing = lobbies.get(ctx.data.lobbyId);
        if (existing) return ctx.reply(sanitizeLobby(existing, ctx.data.userId));
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
    };

    lobbies.set(id, lobby);
    ctx.assignData({ lobbyId: id });
    await ctx.topics.subscribe(id);

    ctx.reply(sanitizeLobby(lobby, ctx.data.userId));
});

router.rpc(JoinLobbyRpc, async (ctx) => {
    const lobby = lobbies.get(ctx.payload.lobbyId);
    if (!lobby) return ctx.error("NOT_FOUND", "Lobby not found");
    if (lobby.players.some((p) => p.id === ctx.data.userId))
        return ctx.error("ERROR", "Already at this table");
    if (lobby.players.length >= lobby.maxPlayers)
        return ctx.error("ERROR", "Table is full");

    await ctx.topics.subscribe(lobby.id);
    ctx.assignData({ lobbyId: lobby.id });

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
            return ctx.error(
                "FAILED_PRECONDITION",
                "Need at least 2 players"
            );

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

        await broadcastLobby(lobbyId);
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
                if (idx <= lobby.dealerIndex && lobby.dealerIndex > 0)
                    lobby.dealerIndex--;
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
            const { user, expMs } =
                await client.gameserver.isUserAuthed.query(token);

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