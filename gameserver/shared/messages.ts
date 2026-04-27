import { z, rpc, message } from "@ws-kit/zod";
import { SafeLobbySchema } from "./poker";

// ─── RPCs ─────────────────────────────────────────────────────────────────────

export const CreateLobbyRpc = rpc(
    "CREATE_LOBBY",
    z.object({ maxPlayers: z.number().min(2), bigBlind: z.number() }),
    "LOBBY_CREATED",
    SafeLobbySchema
);

export const JoinLobbyRpc = rpc(
    "JOIN_LOBBY",
    z.object({ lobbyId: z.string() }),
    "LOBBY_JOINED",
    SafeLobbySchema
);

export const ReauthenticateRpc = rpc(
    "REAUTHENTICATE",
    z.object({ token: z.string() }),
    "AUTH_SUCCESS",
    z.object({ success: z.boolean(), expiry: z.number() })
);

export const GetHandRpc = rpc(
    "GET_HAND",
    z.object({ lobbyId: z.string() }),
    "HAND_DEALT",
    z.object({
        cards: z.tuple([z.number(), z.number()]).optional(),
    })
);

// ─── Client → server ──────────────────────────────────────────────────────────

export const StartGame = message(
    "START_GAME",
    z.object({ lobbyId: z.string() })
);

export const PlayerAction = message(
    "PLAYER_ACTION",
    z.object({
        turnId: z.number(),
        type: z.enum(["fold", "check", "call", "raise"]),
        amount: z.number().optional(),
    })
);

export const KickPlayer = message(
    "KICK_PLAYER",
    z.object({ lobbyId: z.string(), targetUserId: z.string() })
);

export const CloseLobby = message(
    "CLOSE_LOBBY",
    z.object({ lobbyId: z.string() })
);

export const LeaveLobby = message(
    "LEAVE_LOBBY",
    z.object({ lobbyId: z.string() })
);

// ─── Server → client ──────────────────────────────────────────────────────────

export const SyncLobby = message("SYNC_LOBBY", SafeLobbySchema);

export const ReauthNeeded = message(
    "REAUTH_NEEDED",
    z.object({ expiresAt: z.number() })
);

export const YouWereKicked = message(
    "YOU_WERE_KICKED",
    z.object({ lobbyId: z.string() })
);

export const LobbyClosed = message(
    "LOBBY_CLOSED",
    z.object({ lobbyId: z.string() })
);

/** Sent when chip persistence fails — next hand is held until resolved. */
export const ChipSyncPaused = message(
    "CHIP_SYNC_PAUSED",
    z.object({
        lobbyId: z.string(),
        reason: z.string(),
    })
);

/** Sent when chip persistence recovers and the next hand will start. */
export const ChipSyncResumed = message(
    "CHIP_SYNC_RESUMED",
    z.object({ lobbyId: z.string() })
);