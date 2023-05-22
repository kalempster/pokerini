import io, { Socket } from "socket.io-client";
import { useJwtStore } from "../stores/jwtStore";
import { useEffect } from "react";

export let socket: Socket;

export const useGameServer = () => {
    const jwtStore = useJwtStore();

    useEffect(() => {
        if (!jwtStore.isLoggedIn()) return;
        if (!socket)
            socket = io("http://localhost:3000", {
                auth: {
                    token: jwtStore.accessToken
                }
            });
    }, []);
};
