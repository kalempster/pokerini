import { useMemo, useState } from "react";
import { Colors } from "../../enums/Colors";

export function convertIndexToCard(index: number): {
    value: number;
    color: Colors;
} {
    if (index < 0 || index > 51) {
        throw new Error("Index must be between 0 and 51");
    }

    const suitOrder: Colors[] = [
        Colors.CLUBS,
        Colors.DIAMONDS,
        Colors.HEARTS,
        Colors.SPADES
    ];

    // Determine the suit (0, 1, 2, or 3)
    const suitIndex = Math.floor(index / 13);

    // Determine the rank (1-13)
    // index % 13 gives 0-12, so we add 1 to get 1-13
    const value = (index % 13) + 1;

    return {
        color: suitOrder[suitIndex],
        value
    };
}

type CardProps =
    | {
          hidden: false;
          value: number;
          color: Colors;
      }
    | {
          hidden: true;
          value?: number;
          color?: Colors;
      };

const Card = ({
    value,
    color,
    hidden
}: CardProps) => {
    const [displayedValue, setDisplayedValue] = useState("");
    useMemo(() => {
        if (hidden) return setDisplayedValue("");

        if (value > 10 || value == 1) {
            /* eslint-disable indent */
            switch (value) {
                case 1:
                    setDisplayedValue("A");
                    break;

                case 11:
                    setDisplayedValue("J");

                    break;
                case 12:
                    setDisplayedValue("Q");

                    break;
                case 13:
                    setDisplayedValue("K");
                    break;

                default:
                    break;
            }
            /* eslint-enable indent */
            return;
        }
        setDisplayedValue(`${value}`);
    }, [value]);

    return (
        <div className="flex aspect-[2/3] h-16 items-center justify-center rounded-md border border-white text-lg font-bold text-primary">
            {displayedValue}
        </div>
    );
};

export default Card;
