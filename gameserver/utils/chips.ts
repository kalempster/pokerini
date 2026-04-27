import { writeFile, readFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { client } from "./client";

// ─── State file (safety net on disk) ─────────────────────────────────────────

const STATE_DIR = "./data";
const STATE_FILE = join(STATE_DIR, "chip-recovery.json");

export interface ChipRecord {
    playerId: string;
    chips: number;
}

interface PendingEntry {
    timestamp: number;
    players: ChipRecord[];
}

async function writeStateFile(
    lobbyId: string,
    players: ChipRecord[]
): Promise<void> {
    try {
        if (!existsSync(STATE_DIR))
            await mkdir(STATE_DIR, { recursive: true });

        let state: Record<string, PendingEntry> = {};
        try {
            state = JSON.parse(await readFile(STATE_FILE, "utf-8"));
        } catch {
            // File doesn't exist yet — start fresh
        }

        state[lobbyId] = { timestamp: Date.now(), players };
        await writeFile(STATE_FILE, JSON.stringify(state, null, 2), "utf-8");
        console.log(`[chips] Wrote recovery state for lobby ${lobbyId}`);
    } catch (err) {
        console.error("[chips] Failed to write state file:", err);
    }
}

async function clearStateFile(lobbyId: string): Promise<void> {
    try {
        const state: Record<string, PendingEntry> = JSON.parse(
            await readFile(STATE_FILE, "utf-8")
        );
        delete state[lobbyId];
        await writeFile(STATE_FILE, JSON.stringify(state, null, 2), "utf-8");
    } catch {
        // File may not exist — nothing to clear
    }
}

// ─── Recovery on startup ──────────────────────────────────────────────────────
//
// Call this once when the server boots. If the process crashed mid-retry,
// the state file will have unresolved entries — attempt to flush them now.

export async function flushRecoveryState(): Promise<void> {
    let state: Record<string, PendingEntry>;
    try {
        state = JSON.parse(await readFile(STATE_FILE, "utf-8"));
    } catch {
        return; // No recovery file — nothing to do
    }

    const entries = Object.entries(state);
    if (entries.length === 0) return;

    console.warn(
        `[chips] Found ${entries.length} unresolved chip entries from previous session — flushing`
    );

    for (const [lobbyId, { players, timestamp }] of entries) {
        const age = Math.round((Date.now() - timestamp) / 1000);
        console.warn(
            `[chips] Recovery: lobby ${lobbyId} (${age}s old) — ${players.length} players`
        );
        try {
            await client.gameserver.updateChips.mutate({ players });
            await clearStateFile(lobbyId);
            console.log(`[chips] Recovery succeeded for lobby ${lobbyId}`);
        } catch (err) {
            console.error(
                `[chips] Recovery failed for lobby ${lobbyId} — will need manual review`,
                err
            );
        }
    }
}

// ─── Core update ──────────────────────────────────────────────────────────────

async function tryUpdate(players: ChipRecord[]): Promise<boolean> {
    try {
        await client.gameserver.updateChips.mutate({ players });
        return true;
    } catch {
        return false;
    }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface PersistChipsCallbacks {
    /** Called synchronously when all initial retries are exhausted. */
    onPause: (lobbyId: string) => void;
    /**
     * Called after the background retry eventually succeeds.
     * Should clear the paused flag and start the next hand.
     */
    onResume: (lobbyId: string) => Promise<void>;
    /** Notify players that the game is paused due to a persistence failure. */
    notifyPaused: (playerIds: string[]) => Promise<void>;
    /** Notify players that persistence recovered and the game will continue. */
    notifyResumed: (playerIds: string[]) => Promise<void>;
}

export async function persistChips(
    lobbyId: string,
    players: ChipRecord[],
    callbacks: PersistChipsCallbacks
): Promise<void> {
    const playerIds = players.map((p) => p.playerId);

    // ── Initial 3 attempts ────────────────────────────────────────────────────
    for (let attempt = 1; attempt <= 3; attempt++) {
        if (await tryUpdate(players)) {
            console.log(
                `[chips] Lobby ${lobbyId}: persisted on attempt ${attempt}`
            );
            return;
        }
        console.error(
            `[chips] Lobby ${lobbyId}: attempt ${attempt}/3 failed`
        );
        if (attempt < 3)
            await new Promise((r) => setTimeout(r, 500 * attempt));
    }

    // ── All 3 failed — pause the game ─────────────────────────────────────────
    console.error(
        `[chips] Lobby ${lobbyId}: all retries exhausted — pausing game`
    );

    await writeStateFile(lobbyId, players);
    callbacks.onPause(lobbyId);
    await callbacks.notifyPaused(playerIds);

    // ── Background retry — exponential backoff, capped at 30s ─────────────────
    (async () => {
        let delay = 2_000;
        while (true) {
            await new Promise((r) => setTimeout(r, delay));
            delay = Math.min(delay * 2, 30_000);

            console.log(`[chips] Lobby ${lobbyId}: background retry...`);
            if (await tryUpdate(players)) {
                console.log(
                    `[chips] Lobby ${lobbyId}: background retry succeeded`
                );
                await clearStateFile(lobbyId);
                await callbacks.notifyResumed(playerIds);
                await callbacks.onResume(lobbyId);
                return;
            }
            console.error(
                `[chips] Lobby ${lobbyId}: retry failed, next in ${delay}ms`
            );
        }
    })();
}