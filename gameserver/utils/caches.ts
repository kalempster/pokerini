import type { Lobby, Player } from "../shared/poker";

export const lobbies = new Map<string, Lobby>();
export const pendingJoins = new Map<string, Player[]>();
export const pendingLeaves = new Map<string, Set<string>>();
export const pendingKicks = new Map<string, Set<string>>(); // lobbyId → userIds to eject at endHand
export const disconnectedSessions = new Map<string, string>(); // userId → lobbyId