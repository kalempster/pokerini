export function generateLobbyCode(length = 6) {
    // Characters selected to avoid confusion:
    // No 0/O, 1/I/L, and no vowels to prevent accidental words.
    const charset = "BCDFGHJKLMNPQRSTVWXYZ23456789";
    let result = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        result += charset[randomIndex];
    }

    return result;
}
