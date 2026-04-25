import type { Socket } from "socket.io";
import { z } from "zod";

export const GameStage = {
    LOBBY: "LOBBY",
    PRE_FLOP: "PRE_FLOP",
    FLOP: "FLOP",
    TURN: "TURN",
    RIVER: "RIVER",
    SHOWDOWN: "SHOWDOWN"
} as const;

export type Pot = {
    amount: number;
    eligiblePlayerIds: string[];
};

export const Player = z.object({
    id: z.string().cuid(),
    username: z.string(),
    chips: z.number(),
    cards: z.array(z.number()),
    currentBet: z.number(),
    folded: z.boolean(),
    isAllIn: z.boolean(),
    totalContribution: z.number()
});

export type PlayerType = z.infer<typeof Player> & {
    connection: Socket;
};

export const Lobby = z.object({
    id: z.string(),
    players: z.array(Player),
    hostId: z.string().cuid(),
    maxPlayers: z.number(),
    bigBlind: z.number(),
    stage: z.nativeEnum(GameStage),
    communityCards: z.array(z.number()),
    pot: z.number(),
    highestBet: z.number(),
    dealerIndex: z.number(),
    turnIndex: z.number(),
    deck: z.array(z.number()),
    pots: z.array(
        z.object({
            amount: z.number(),
            eligiblePlayerIds: z.array(z.string())
        })
    )
});

export type LobbyType = Omit<z.infer<typeof Lobby>, "players"> & {
    players: PlayerType[];
};
