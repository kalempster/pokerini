import { TRPCClientError, httpBatchLink } from "@trpc/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { z } from "zod";
import { trpc } from "../utils/trpc";
type JwtStore = {
    accessToken: string;
    refreshToken: string;
    setAccessToken: (token: string) => any;
    setRefreshToken: (token: string) => any;
    isLoggedIn: () => boolean;
    getAccessToken: () => string;
};

export const useJwtStore = create<JwtStore>()(
    persist(
        (set, get) => ({
            accessToken: "",
            refreshToken: "",
            setAccessToken: (token) => set(() => ({ accessToken: token })),
            setRefreshToken: (token) => set(() => ({ refreshToken: token })),
            isLoggedIn: () => get().refreshToken.length > 0,
            getAccessToken: () => get().accessToken
        }),
        {
            name: "jwt-store"
        }
    )
);
