import { stringifyCardCode } from "@pokertools/evaluator";
import { Colors } from "../../enums/Colors";

// This should point to your sprite sheet in the public folder
const SPRITE_PATH = "/cards/cards.svg";

const SUIT_MAP: { [key: string]: Colors } = {
    s: Colors.SPADES,
    h: Colors.HEARTS,
    d: Colors.DIAMONDS,
    c: Colors.CLUBS
} as const;

export function convertIndexToCard(index: number): {
    value: string;
    color: Colors;
} {
    const cardCode = stringifyCardCode(index);

    return {
        value: cardCode.at(0) == "T" ? "10" : cardCode.at(0)!,
        color: SUIT_MAP[cardCode.at(1)!]
    };
}


type CardProps =
    | {
          hidden: false;
          value: string;
          color: Colors;
      }
    | {
          hidden: true;
          value?: string;
          color?: Colors;
      };

const Card = ({ value, color, hidden }: CardProps) => {
    // 1. Map your game data to the SVG ID
    const getCardData = () => {
        if (hidden) return { id: "card_back", x: 0, y: 0 }; // Adjust based on your SVG back ID

        const suitMap: Record<string, { name: string; row: number }> = {
            [Colors.CLUBS]:    { name: "club",    row: 0 },
            [Colors.DIAMONDS]: { name: "diamond", row: 1 },
            [Colors.HEARTS]:   { name: "heart",   row: 2 },
            [Colors.SPADES]:   { name: "spade",   row: 3 },
        };

        const rankMap: Record<string, { val: string; col: number }> = {
            "A":  { val: "1",     col: 0 },
            "2":  { val: "2",     col: 1 },
            "3":  { val: "3",     col: 2 },
            "4":  { val: "4",     col: 3 },
            "5":  { val: "5",     col: 4 },
            "6":  { val: "6",     col: 5 },
            "7":  { val: "7",     col: 6 },
            "8":  { val: "8",     col: 7 },
            "9":  { val: "9",     col: 8 },
            "10": { val: "10",    col: 9 },
            "J":  { val: "jack",  col: 10 },
            "Q":  { val: "queen", col: 11 },
            "K":  { val: "king",  col: 12 },
        };

        const suitData = suitMap[color!];
        const rankData = rankMap[value!];

        return {
            id: `${suitData.name}_${rankData.val}`,
            // Calculate how much the card is shifted in the original SVG
            offsetX: rankData.col * 202.5, 
            offsetY: suitData.row * 315,
        };
    };

    const { id, offsetX, offsetY } = getCardData();

    return (
        <div className="flex aspect-[202/314] h-32 items-center justify-center overflow-hidden">
            <svg
                // The "Window" through which we see one card
                viewBox="0 0 202.5 315"
                className="h-full w-full"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* 
                  The <g> transform moves the entire coordinate system backwards.
                  If the card is naturally at x=405, we translate -405 to bring it 
                  into the 0,0 - 202,315 viewport.
                */}
                <g transform={`translate(${-offsetX!}, ${-offsetY!})`}>
                    <use href={`${SPRITE_PATH}#${id}`} />
                </g>
            </svg>
        </div>
    );
};

export default Card;