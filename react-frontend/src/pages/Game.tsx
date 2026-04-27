import Cards from "src/components/Player/Cards";
import Header from "../components/Header/Header";
import { useEffect, useState } from "react";
import {
    ChipSyncPaused,
    ChipSyncResumed,
    LeaveLobby,
    PlayerAction,
    SyncLobby
} from "@gameserver/shared/messages";
import { useGameStore } from "src/stores/gameStore";
import Card, { convertIndexToCard } from "src/components/Player/Card";
import GamePlayer from "src/components/Player/GamePlayer";
import { useUserStore } from "src/stores/userStore";
import { useSocket } from "src/utils/wsclient";
import { useNavigate } from "@tanstack/react-router";
import z from "zod";
import Dialog from "src/components/Dialog/Dialog";

const Game = () => {
    const gameStore = useGameStore();
    const userStore = useUserStore();
    const client = useSocket();
    const nav = useNavigate();

    const [raiseAmount, setRaiseAmount] = useState(0);

    const localPlayerIndex = gameStore.players.findIndex(
        (player) => player.id == userStore.user.id
    );

    const isMyTurn = gameStore.turnIndex === localPlayerIndex;
    const localPlayer = gameStore.players[localPlayerIndex];

    const leaveLobby = () => {
        client.send(LeaveLobby, { lobbyId: gameStore.id }, undefined);
    };

    useEffect(() => {
        const syncPaused = client.on(ChipSyncPaused, () => {
            gameStore.setGame({ paused: true });
        });
        const syncResumed = client.on(ChipSyncResumed, () => {
            gameStore.setGame({ paused: false });
        });

        return () => {
            syncPaused();
            syncResumed();
        };
    }, []);

    useEffect(() => {
        if (gameStore.stage == "LOBBY") {
            nav({ to: "/lobby" });
            return;
        }

        setRaiseAmount(gameStore.highestBet + gameStore.bigBlind);
    }, [gameStore, nav]);

    const sendAction = ({
        type,
        amount
    }: Omit<z.infer<typeof PlayerAction>["payload"], "turnId">) => {
        client.send(PlayerAction, {
            turnId: gameStore.turnId,
            type,
            amount
        });
    };

    return (
        <>
            <Dialog visible={gameStore.paused}>
                <Dialog.Title>Game paused!</Dialog.Title>
                <Dialog.Content>
                    Chips persistence failed. Pausing the game to keep your
                    balance safe. Retrying...
                </Dialog.Content>
            </Dialog>
            <Header />
            <div className="flex h-[100lvh] flex-col items-center justify-center bg-gray-900">
                <div className="3xl:w-7/12 relative flex w-full items-center justify-center xl:w-10/12 ">
                    <div className="absolute flex flex-col items-center gap-2">
                        <Cards>
                            {gameStore.communityCards.map((card, i) => (
                                <Card
                                    key={i}
                                    {...convertIndexToCard(card)}
                                    hidden={false}
                                />
                            ))}
                        </Cards>
                        <div className="font-mono text-xl text-primary">
                            {gameStore.pot}
                        </div>
                    </div>

                    {gameStore.players.map((player, index) => (
                        <GamePlayer
                            lobbyId={gameStore.id}
                            id={player.id}
                            kickable={
                                gameStore.hostId == userStore.user.id &&
                                player.id != userStore.user.id
                            }
                            turnEnabled={gameStore.stage != "BETWEEN_HANDS"}
                            hasFolded={player.folded}
                            currentBet={player.currentBet}
                            isDealer={gameStore.dealerIndex == index}
                            key={player.id}
                            username={player.username}
                            currentChips={player.chips}
                            index={index}
                            localPlayerIndex={localPlayerIndex}
                            isTurn={gameStore.turnIndex === index}
                            turnDeadline={gameStore.turnDeadline}
                            communityCards={gameStore.communityCards}
                            cards={player.cards}
                        />
                    ))}

                    {/* Table SVG code here */}
                    <svg
                        className="aspect-[1194/544] w-full "
                        viewBox="0 0 1194 544"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M13 189.654C13 92.0905 92.0574 13 189.58 13H1004.42C1101.94 13 1181 92.0905 1181 189.654V354.346C1181 451.909 1101.94 531 1004.42 531H189.58C92.0574 531 13 451.909 13 354.346V189.654Z"
                            fill="#222643"
                        />
                        <path
                            d="M975.773 60.0642H215.468C130.634 60.0642 61.8628 123.322 61.8628 201.355V342.645C61.8628 420.678 130.634 483.936 215.468 483.936H975.773C1060.61 483.936 1129.38 420.678 1129.38 342.645V201.355C1129.38 123.322 1060.61 60.0642 975.773 60.0642Z"
                            fill="#222643"
                        />
                        <path
                            d="M13 189.654C13 92.0905 92.0574 13 189.58 13H1004.42C1101.94 13 1181 92.0905 1181 189.654V354.346C1181 451.909 1101.94 531 1004.42 531H189.58C92.0574 531 13 451.909 13 354.346V189.654Z"
                            stroke="#1E2139"
                            strokeWidth="26"
                        />
                        <path
                            d="M975.773 60.0642H215.468C130.634 60.0642 61.8628 123.322 61.8628 201.355V342.645C61.8628 420.678 130.634 483.936 215.468 483.936H975.773C1060.61 483.936 1129.38 420.678 1129.38 342.645V201.355C1129.38 123.322 1060.61 60.0642 975.773 60.0642Z"
                            stroke="#1E2139"
                            strokeWidth="26"
                        />
                    </svg>
                </div>

                {/* ACTION CONTROLS */}
                {isMyTurn && gameStore.stage != "BETWEEN_HANDS" && (
                    <div className="fixed bottom-10 z-50 flex flex-col items-center gap-4 rounded-xl bg-black/60 p-6 backdrop-blur-md">
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min={gameStore.highestBet + 10} // Example min raise
                                max={localPlayer?.chips || 1000}
                                value={raiseAmount}
                                onChange={(e) =>
                                    setRaiseAmount(Number(e.target.value))
                                }
                                className="w-64 accent-primary"
                            />
                            <span className="w-20 font-mono text-lg text-white">
                                ${raiseAmount}
                            </span>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => sendAction({ type: "fold" })}
                                className="w-32 rounded-lg bg-red-600 py-3 font-bold text-white hover:bg-red-700">
                                FOLD
                            </button>
                            <button
                                onClick={() =>
                                    sendAction(
                                        gameStore.highestBet > 0
                                            ? { type: "call" }
                                            : { type: "check" }
                                    )
                                }
                                className="w-32 rounded-lg bg-gray-600 py-3 font-bold text-white hover:bg-gray-700">
                                {gameStore.highestBet >
                                gameStore.players.find(
                                    (p) => p.id == userStore.user.id
                                )?.currentBet!
                                    ? `CALL ${
                                          gameStore.highestBet -
                                          gameStore.players.find(
                                              (p) => p.id == userStore.user.id
                                          )?.currentBet!
                                      }`
                                    : "CHECK"}
                            </button>
                            <button
                                onClick={() =>
                                    sendAction({
                                        type: "raise",
                                        amount: raiseAmount
                                    })
                                }
                                className="w-32 rounded-lg bg-primary py-3 font-bold text-black hover:bg-primary/80">
                                RAISE
                            </button>
                        </div>
                    </div>
                )}

                <button
                    onClick={leaveLobby}
                    className="md:text-md text-md absolute bottom-10 right-10 rounded-md bg-secondary px-10 py-2 font-bold text-primary xl:px-10">
                    Leave lobby
                </button>
            </div>
        </>
    );
};

export default Game;
