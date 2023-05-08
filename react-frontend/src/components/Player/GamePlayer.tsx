import { useMemo, useState } from "react";
import { MdMonetizationOn } from "react-icons/md";
import Cards from "./Cards";
import Card from "./Card";

const GamePlayer = ({
    username,
    currentChips,
    playerIndex
}: {
    username: string;
    currentChips: number;
    playerIndex: number;
}) => {
    const [positioningClass, setPostitioningClass] = useState("");
    const [cardsPositionClass, setCardsPositioningClass] = useState("");

    useMemo(() => {
        /* eslint-disable indent  */ // buggy with switch statements
        switch (playerIndex) {
            case 0:
                setPostitioningClass("absolute left-0 top-0");
                break;
            case 1:
                setPostitioningClass("absolute left-0 bottom-0");
                break;
            case 2:
                setPostitioningClass("absolute bottom-0");
                break;
            case 3:
                setPostitioningClass("absolute right-0 bottom-0");
                break;
            case 4:
                setPostitioningClass("absolute right-0 top-0");
                break;

            default:
                break;
        }
        /* eslint-enable indent */
    }, [playerIndex]);

    useMemo(() => {
        /* eslint-disable indent  */ // buggy with switch statements
        switch (playerIndex) {
            case 0:
                setCardsPositioningClass("absolute left-28 top-28");
                break;
            case 1:
                setCardsPositioningClass("absolute left-28 bottom-28");
                break;
            case 2:
                setCardsPositioningClass("absolute bottom-28");
                break;
            case 3:
                setCardsPositioningClass("absolute right-28 bottom-28");
                break;
            case 4:
                setCardsPositioningClass("absolute right-28 top-28");
                break;

            default:
                break;
        }
        /* eslint-enable indent */
    }, [playerIndex]);

    return (
        <>
            <div className={positioningClass}>
                <div className="flex flex-col justify-center gap-1">
                    <div className="flex items-center gap-2 text-white">
                        <div className="flex aspect-square w-7 items-center justify-center rounded-full border-2 border-white bg-twojstary font-mono uppercase">
                            {username.at(0)}
                            {/* tu ma byc image zamiast A */}
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
                    <Card color="CLUBS" value={9} />
                    <Card color="CLUBS" value={13} />
                </Cards>
            </div>
        </>
    );
};

export default GamePlayer;
