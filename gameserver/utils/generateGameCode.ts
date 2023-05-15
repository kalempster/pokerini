import { random } from "lodash";
import { lobbies } from "..";

const AVAILABLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export const generateGameCode = (): string => {
    let code = "";
    for (let index = 0; index < 9; index++) {
        if (index == 4) {
            code += "-";
            continue;
        }
        code += AVAILABLE_CHARS[random(0, AVAILABLE_CHARS.length)];
    }
    if (lobbies.has(code)) return generateGameCode();

    return code;
};
