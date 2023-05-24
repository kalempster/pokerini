import { Link, useNavigate } from "@tanstack/react-router";
import {
    MdAccountCircle,
    MdMonetizationOn,
    MdRemoveRedEye,
    MdVisibility,
    MdVisibilityOff
} from "react-icons/md/index";
import Section from "../components/Section/Section";
import LobbyPlayer from "../components/Player/LobbyPlayer";
import { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import { useGameStore } from "../stores/gameStore";
import GamePlayer from "../components/Player/GamePlayer";
import { socket } from "../hooks/useGameServer";
import { Lobby as LobbySchema } from "../../../gameserver/objects/Lobby";

const Lobby = () => {
    const [codeVisible, setCodeVisible] = useState(false);

    const gameStore = useGameStore();

    const navigation = useNavigate();

    useEffect(() => {
        if (gameStore.id.length == 0) navigation({ to: "/dashboard" });
    }, [gameStore]);

    useEffect(() => {
        const onUpdate = (args: unknown) => {
            const result = LobbySchema.safeParse(args);

            if (!result.success) return console.log(args);

            gameStore.setGame(result.data);
        };

        socket.on("update", onUpdate);

        return () => {
            socket.off("update", onUpdate);
        };
    }, []);

    return (
        <div className="h-[100lvh]">
            <Header />
            <Section className="flex flex-col items-center justify-center gap-5 pt-[calc(var(--header-height)*1.5)] tall:pt-0">
                <div className="flex flex-col items-center gap-1">
                    <div className="text-6xl font-semibold text-primary">
                        Lobby
                    </div>
                    <div className="flex items-center gap-2 rounded-md bg-twojstary px-3 font-mono text-lg text-white">
                        <input
                            readOnly
                            type={!codeVisible ? "password" : "text"}
                            value={gameStore.id.toUpperCase()}
                            className="flex items-center justify-center  bg-twojstary  py-2 pt-3 font-thin  shadow-2xl outline-none"
                        />
                        <button
                            className="text-2xl"
                            onClick={() => setCodeVisible(!codeVisible)}>
                            {!codeVisible ? (
                                <MdVisibility />
                            ) : (
                                <MdVisibilityOff />
                            )}
                        </button>
                    </div>

                    <div className="flex items-center gap-4 text-xl text-secondary text-opacity-70">
                        <div className="flex items-center gap-1 font-mono">
                            <MdMonetizationOn />
                            {gameStore.bigBlind}
                        </div>
                        <div className="flex items-center gap-1 font-mono">
                            <MdAccountCircle />
                            {gameStore.players.length}/{gameStore.maxPlayers}
                        </div>
                    </div>
                </div>
                <div className="flex w-1/3 flex-col items-center justify-center gap-4">
                    {gameStore.players.map((p, index) => (
                        <LobbyPlayer
                            username={p.username}
                            chips={p.chips}
                            key={index}
                        />
                    ))}
                </div>

                <button className="rounded-md bg-secondary px-20 py-2 text-2xl font-bold text-primary md:text-2xl xl:px-10">
                    Start
                </button>
            </Section>
        </div>
    );
};

export default Lobby;
