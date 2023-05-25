import { useMemo, useState } from "react";
import { Colors } from "../../enums/Colors";

const Card = ({ value, color }: { value: number; color: Colors }) => {
    const [displayedValue, setDisplayedValue] = useState("");
    useMemo(() => {
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
