import type { Lobby, Player } from "../shared/poker";

export const lobbies = new Map<string, Lobby>();

// Players queued to join at end of current hand
export const pendingJoins = new Map<string, Player[]>();

// Player IDs queued to leave at end of current hand
export const pendingLeaves = new Map<string, Set<string>>();

// userId -> lobbyId for players who disconnected mid-hand
// cleared on reconnect; if still present at endHand they get removed
export const disconnectedSessions = new Map<string, string>();
