import { z } from "zod";

export const CardSchema = z.number().min(0).max(51);

export const GameStageSchema = z.enum([
    "LOBBY",
    "BETWEEN_HANDS", // <-- new
    "PRE_FLOP",
    "FLOP",
    "TURN",
    "RIVER",
    "SHOWDOWN",
]);

const SpectatorSchema = z.object({
    id: z.string(),
    username: z.string()
});


export const PlayerSchema = z.object({
    id: z.string(),
    username: z.string(),
    chips: z.number(),
    currentBet: z.number(),
    totalContribution: z.number(),
    folded: z.boolean(),
    isAllIn: z.boolean(),
    cards: z.tuple([z.number().min(0).max(51), z.number().min(0).max(51)]),
});

export const SafePlayerSchema = PlayerSchema.extend({
    cards: z.tuple([z.number(), z.number()]).optional(),
});

export const LobbySchema = z.object({
    id: z.string(),
    hostId: z.string(),
    maxPlayers: z.number(),
    bigBlind: z.number(),
    stage: GameStageSchema,
    communityCards: z.array(CardSchema),
    highestBet: z.number(),
    dealerIndex: z.number(),
    turnIndex: z.number(),
    turnId: z.number(),
    turnDeadline: z.number(),
    pot: z.number(),
    deck: z.array(CardSchema).optional(),
    bannedPlayers: z.array(z.string()),
    pendingClose: z.boolean(),
    paused: z.boolean(),
    spectators: z.array(SpectatorSchema)
});

export const SafeLobbySchema = LobbySchema.extend({
    players: z.array(SafePlayerSchema),
    deck: z.undefined(),
});

export type Player = z.infer<typeof PlayerSchema>;
export type Lobby = Omit<z.infer<typeof LobbySchema>, "players"> & {
    players: Player[];
};
export type SafeLobby = z.infer<typeof SafeLobbySchema>;
export type Spectator = z.infer<typeof SpectatorSchema>;
