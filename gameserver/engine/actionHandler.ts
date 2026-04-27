import type { Lobby } from "../shared/poker";
import { advanceTurnOrStage, markActed, markRaise } from "./gameLoop";

export async function applyAction(
    lobby: Lobby,
    userId: string,
    payload: {
        turnId: number;
        type: "fold" | "check" | "call" | "raise";
        amount?: number;
    },
): Promise<{ ok: boolean; error?: string; shouldBroadcast: boolean }> {
    if (
        lobby.stage === "LOBBY" ||
        lobby.stage === "BETWEEN_HANDS" ||
        lobby.stage === "SHOWDOWN"
    )
        return { ok: false, error: "No active game", shouldBroadcast: false };

    if (payload.turnId !== lobby.turnId)
        return { ok: false, error: "Stale action", shouldBroadcast: false };

    const player = lobby.players[lobby.turnIndex];
    if (!player || player.id !== userId)
        return { ok: false, error: "Not your turn", shouldBroadcast: false };

    const { type, amount = 0 } = payload;

    if (type === "fold") {
        player.folded = true;
        markActed(lobby.id, player.id);
    } else if (type === "check") {
        if (player.currentBet < lobby.highestBet)
            return {
                ok: false,
                error: "Cannot check — must call or raise",
                shouldBroadcast: false,
            };
        markActed(lobby.id, player.id);
    } else {
        const target = type === "raise" ? amount : lobby.highestBet;

        if (type === "raise" && target <= lobby.highestBet)
            return {
                ok: false,
                error: `Raise must exceed current bet of ${lobby.highestBet}`,
                shouldBroadcast: false,
            };

        let diff = target - player.currentBet;
        if (diff > player.chips) diff = player.chips;

        player.chips -= diff;
        player.currentBet += diff;
        player.totalContribution += diff;
        lobby.pot += diff;

        if (player.currentBet > lobby.highestBet)
            lobby.highestBet = player.currentBet;
        if (player.chips === 0) player.isAllIn = true;

        if (type === "raise") {
            markRaise(lobby.id, player.id);
        } else {
            markActed(lobby.id, player.id);
        }
    }

    const shouldBroadcast = await advanceTurnOrStage(lobby);
    return { ok: true, shouldBroadcast };
}