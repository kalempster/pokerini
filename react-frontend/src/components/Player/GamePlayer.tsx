import { useEffect, useState } from "react";
import { MdMonetizationOn } from "react-icons/md";
import Cards from "./Cards";
import Card from "./Card";
import { Colors } from "src/enums/Colors";

const MAX_PLAYERS = 5;

const TurnTimer = ({ deadline }: { deadline: number }) => {
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
            <div
                className="h-full bg-primary"
                style={{ 
                    width: `${progress}%`,
                    // Disable transitions so requestAnimationFrame is responsible for the smoothness
                    transition: 'none' 
                }}
            />
        </div>
    );
};

const GamePlayer = ({
    username,
    currentChips,
    index,
    localPlayerIndex,
    cards,
    isTurn,
    turnDeadline
}: {
    username: string;
    currentChips: number;
    index: number;
    localPlayerIndex: number;
    cards?: { value: number; color: Colors }[];
    isTurn: boolean;
    turnDeadline: number;
}) => {
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

    return (
        <>
            <div className={positioningClass}>
                <div className="flex flex-col justify-center gap-1">
                    {isTurn && <TurnTimer deadline={turnDeadline} />}
                    <div className="flex items-center gap-2 text-white">
                        <div className="flex aspect-square w-7 items-center justify-center rounded-full border-2 border-white bg-twojstary font-mono uppercase">
                            {username.at(0)}
                        </div>
                        <div className="">{username}</div>
                    </div>
                    <div className="flex items-center font-mono text-primary">
                        <MdMonetizationOn className="text-primary" />
                        {currentChips}
                    </div>
                </div>
            </div>
            <div className={cardsPositionClass + " text-white"}>
                <Cards>
                    {!cards ? (
                        <>
                            <Card hidden />
                            <Card hidden />
                        </>
                    ) : (
                        cards.map((card, i) => (
                            <Card
                                key={i}
                                color={card.color}
                                value={card.value}
                                hidden={false}
                            />
                        ))
                    )}
                </Cards>
            </div>
        </>
    );
};

export default GamePlayer;
