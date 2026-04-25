import type { Lobby } from "../shared/poker";
import { advanceTurnOrStage } from "./gameLoop";

export async function applyAction(
    lobby: Lobby,
    userId: string,
    payload: {
        turnId: number;
        type: "fold" | "check" | "call" | "raise";
        amount?: number;
    }
): Promise<{ ok: boolean; error?: string }> {
    if (lobby.stage === "LOBBY" || lobby.stage === "SHOWDOWN")
        return { ok: false, error: "No active game" };

    // Race condition guard: stale turnId means timer or another event already acted
    if (payload.turnId !== lobby.turnId)
        return { ok: false, error: "Stale action" };

    const player = lobby.players[lobby.turnIndex];
    if (!player || player.id !== userId)
        return { ok: false, error: "Not your turn" };

    const { type, amount = 0 } = payload;

    if (type === "fold") {
        player.folded = true;
    } else if (type === "check") {
        if (player.currentBet < lobby.highestBet)
            return { ok: false, error: "Cannot check — must call or raise" };
    } else {
        const target = type === "raise" ? amount : lobby.highestBet;

        if (type === "raise" && target <= lobby.highestBet)
            return {
                ok: false,
                error: `Raise must exceed ${lobby.highestBet}`,
            };

        let diff = target - player.currentBet;
        if (diff > player.chips) diff = player.chips; // all-in cap

        player.chips -= diff;
        player.currentBet += diff;
        player.totalContribution += diff;
        lobby.pot += diff;

        if (player.currentBet > lobby.highestBet)
            lobby.highestBet = player.currentBet;
        if (player.chips === 0) player.isAllIn = true;
    }

    await advanceTurnOrStage(lobby);
    return { ok: true };
}