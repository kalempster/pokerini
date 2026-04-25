import { evaluate } from "@pokertools/evaluator";
import { LobbyType, GameStage } from "../objects/Lobby";

export const createDeck = () => 
    Array.from({ length: 52 }, (_, i) => i).sort(() => Math.random() - 0.5);

export function getWinners(lobby: LobbyType): string[] {
    const active = lobby.players.filter(p => !p.folded);
    const scores = active.map(p => ({
        id: p.id,
        value: evaluate([...p.cards, ...lobby.communityCards])
    }));
    const best = Math.min(...scores.map(s => s.value));
    return scores.filter(s => s.value === best).map(s => s.id);
}

