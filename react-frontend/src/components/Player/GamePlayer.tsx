import { useEffect, useState } from "react";
import { MdMonetizationOn } from "react-icons/md";
import Cards from "./Cards";
import Card, { convertIndexToCard } from "./Card";
import { Colors } from "src/enums/Colors";
import {
    rankDescription,
    rank,
    stringifyCardCode
} from "@pokertools/evaluator";
import { useSocket } from "src/utils/wsclient";
import { KickPlayer } from "@gameserver/shared/messages";

const MAX_PLAYERS = 5;

function rankTwoCards(card1: string, card2: string): string {
    // Extract the rank (the first character, e.g., '6' from '6d')
    const rank1 = card1[0];
    const rank2 = card2[0];

    if (rank1 === rank2) {
        return "Pair";
    } else {
        return "High Card";
    }
}

console.log(rankTwoCards("6d", "6h")); // "Pair"
console.log(rankTwoCards("Ah", "Kd")); // "High Card"

const TurnTimer = ({
    deadline,
    enabled
}: {
    deadline: number;
    enabled: boolean;
}) => {
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        // This is the total time available FROM THE MOMENT THE TIMER APPEARS
        const totalTime = deadline - Date.now();
        if (totalTime <= 0) return;

        let frame: number;
        const update = () => {
            const now = Date.now();
            const remaining = deadline - now;
            const percentage = Math.max(0, (remaining / totalTime) * 100);

            setProgress(percentage);

            if (remaining > 0) {
                frame = requestAnimationFrame(update);
            }
        };

        frame = requestAnimationFrame(update);
        return () => cancelAnimationFrame(frame);
    }, [deadline]);

    return (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-700">
            {enabled && (
                <div
                    className="h-full bg-primary"
                    style={{
                        width: `${progress}%`,
                        // Disable transitions so requestAnimationFrame is responsible for the smoothness
                        transition: "none"
                    }}
                />
            )}
        </div>
    );
};

const GamePlayer = ({
    id,
    lobbyId,
    username,
    currentChips,
    index,
    localPlayerIndex,
    cards,
    isTurn,
    turnDeadline,
    isDealer,
    currentBet,
    hasFolded,
    communityCards,
    turnEnabled,
    kickable
}: {
    id: string;
    username: string;
    currentChips: number;
    index: number;
    localPlayerIndex: number;
    cards?: number[];
    isTurn: boolean;
    turnDeadline: number;
    isDealer: boolean;
    currentBet: number;
    hasFolded: boolean;
    communityCards: number[];
    turnEnabled: boolean;
    kickable: boolean;
    lobbyId: string;
}) => {
    const client = useSocket();
    // Logic moved inside component
    const uiIndex = (index - localPlayerIndex + 2 + MAX_PLAYERS) % MAX_PLAYERS;

    const positioningClasses = [
        "absolute left-0 top-0",
        "absolute left-0 bottom-0",
        "absolute bottom-0",
        "absolute right-0 bottom-0",
        "absolute right-0 top-0"
    ];

    const cardsPositioningClasses = [
        "absolute left-28 top-28",
        "absolute left-28 bottom-28",
        "absolute bottom-28",
        "absolute right-28 bottom-28",
        "absolute right-28 top-28"
    ];

    const positioningClass = positioningClasses[uiIndex];
    const cardsPositionClass = cardsPositioningClasses[uiIndex];

    const kickPlayer = () => {
        client.send(
            KickPlayer,
            { lobbyId: lobbyId, targetUserId: id },
            undefined
        );
    };
    return (
        <>
            <div
                className={
                    positioningClass + " " + `${hasFolded ? "opacity-35" : ""}`
                }>
                <div className="flex flex-col justify-center gap-1">
                    <div className="flex items-center justify-center font-mono text-primary">
                        <MdMonetizationOn className="text-primary" />
                        {currentBet}
                    </div>
                    {isTurn && (
                        <TurnTimer
                            enabled={turnEnabled}
                            deadline={turnDeadline}
                        />
                    )}
                    <div className="flex items-center gap-2 text-white">
                        <div className="flex aspect-square w-7 items-center justify-center rounded-full border-2 border-white bg-twojstary font-mono uppercase">
                            {username.at(0)}
                        </div>
                        <div className={`${isDealer ? "text-red-500" : ""}`}>
                            {username}
                        </div>
                        {kickable && (
                            <button
                                onClick={kickPlayer}
                                className="select-none font-mono">
                                X
                            </button>
                        )}
                    </div>
                    <div className="flex items-center font-mono text-primary">
                        <MdMonetizationOn className="text-primary" />
                        {currentChips}
                    </div>
                </div>
            </div>
            <div className={cardsPositionClass + " flex flex-col text-white"}>
                {cards && (
                    <div className="flex items-center justify-center text-white">
                        {communityCards.length != 0
                            ? rankDescription(
                                  rank([...communityCards, ...cards])
                              )
                            : rankTwoCards(
                                  stringifyCardCode(cards[0]),
                                  stringifyCardCode(cards[1])
                              )}
                    </div>
                )}
                <Cards>
                    {!cards ? (
                        <>
                            <Card hidden />
                            <Card hidden />
                        </>
                    ) : (
                        cards.map((card, i) => {
                            const { color, value } = convertIndexToCard(card);

                            return (
                                <Card
                                    key={i}
                                    color={color}
                                    value={value}
                                    hidden={false}
                                />
                            );
                        })
                    )}
                </Cards>
            </div>
        </>
    );
};

export default GamePlayer;
