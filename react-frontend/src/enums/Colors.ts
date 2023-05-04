export const Colors = {
    SPADES: "SPADES",
    HEARTS: "HEARTS",
    DIAMONDS: "DIAMONDS",
    CLUBS: "CLUBS"
} as const;

export type Colors = keyof typeof Colors;
