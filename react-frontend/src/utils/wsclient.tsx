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

// Replace 'any' with the specific client type exported by your library if available
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
                getToken: () => jwtStore.accessToken,
                attach: "protocol"
            }
        })
    );

    useEffect(() => {
        if (jwtStore.accessToken.length == 0) return;

        const expiry = jwtStore.expMs; // Assuming you store this
        const reauthWindow = 2 * 60 * 1000;

        const timer = setTimeout(async () => {
            // Call your ReauthenticateRpc logic here
            const response = await mutateAsync({
                refreshToken: jwtStore.refreshToken
            });

            jwtStore.setAccessToken(response.ACCESS_TOKEN);
            jwtStore.setExpMs(response.expMs);
        }, expiry - Date.now() - reauthWindow);

        return () => clearTimeout(timer);
    }, [jwtStore.accessToken]);

    useEffect(() => {
        const connectWs = async () => {
            try {
                await client.connect();
            } catch (err) {
                console.error("WS Connection Error:", err);
            }
        };

        connectWs();

        return () => {
            client.close();
        };
    }, [client]);

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
