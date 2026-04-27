import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode
} from "react";
import { wsClient } from "@ws-kit/client/zod";
import { useJwtStore } from "../stores/jwtStore";
import { trpc } from "./trpc";
import { ReauthenticateRpc, SyncLobby } from "@gameserver/shared/messages";
import { useGameStore } from "src/stores/gameStore";

type WsClientType = ReturnType<typeof wsClient>;

const SocketContext = createContext<WsClientType | null>(null);

interface SocketProviderProps {
    children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
    const jwtStore = useJwtStore();

    const { mutateAsync } = trpc.auth.regenerateAccessToken.useMutation();

    const [client] = useState(() =>
        wsClient({
            url: "ws://localhost:3000/",
            auth: {
                getToken: () => jwtStore.getAccessToken(),
                attach: "protocol"
            },
            reconnect: {
                enabled: true
            }
        })
    );

    useEffect(() => {
        client.on(SyncLobby, (lobby) => {
            useGameStore.setState(lobby.payload);
        });
    }, []);

    useEffect(() => {
        if (jwtStore.accessToken.length == 0) return;

        const expiry = jwtStore.expMs; 
        const reauthWindow = 2 * 60 * 1000;

        const timer = setTimeout(async () => {
            const response = await mutateAsync({
                refreshToken: jwtStore.refreshToken
            });

            jwtStore.setAccessToken(response.ACCESS_TOKEN);
            jwtStore.setExpMs(response.expMs);

            const reauthResponse = await client.request(
                ReauthenticateRpc,
                { token: response.ACCESS_TOKEN },
                ReauthenticateRpc.response
            );

            if (!reauthResponse.payload.success)
                throw new Error("Reauth error");
        }, expiry - Date.now() - reauthWindow);

        return () => clearTimeout(timer);
    }, [jwtStore.accessToken]);

    useEffect(() => {
        const connectWs = async () => {
            try {
                if (!client.isConnected && jwtStore.isLoggedIn())
                    await client.connect();
            } catch (err) {
                console.error("WS Connection Error:", err);
            }
        };

        connectWs();

        return () => {
            client.close();
        };
    }, [client, jwtStore.refreshToken]);

    return (
        <SocketContext.Provider value={client}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};
