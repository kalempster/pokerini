import { LobbyType, Pot } from "../objects/Lobby";

export function calculatePots(lobby: LobbyType): Pot[] {
    const players = [...lobby.players];
    // Only players who put money in
    let contributions = players
        .filter((p) => p.totalContribution > 0)
        .map((p) => ({
            id: p.id,
            amount: p.totalContribution,
            folded: p.folded
        }));

    const pots: Pot[] = [];

    while (contributions.length > 0) {
        // 1. Find the smallest contribution
        const smallest = Math.min(...contributions.map((c) => c.amount));

        // 2. Create a pot from this level
        const potAmount = smallest * contributions.length;
        const eligible = contributions
            .filter((c) => !c.folded)
            .map((c) => c.id);

        pots.push({ amount: potAmount, eligiblePlayerIds: eligible });

        // 3. Subtract this level from all players and remove those who are 'tapped out'
        contributions = contributions
            .map((c) => ({ ...c, amount: c.amount - smallest }))
            .filter((c) => c.amount > 0);
    }

    return pots;
}
