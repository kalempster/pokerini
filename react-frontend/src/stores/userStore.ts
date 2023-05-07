import type { userSchemaType } from "../../../backend/zod/user";
import { persist, createJSONStorage } from "zustand/middleware";
import { create } from "zustand";

type userStoreType = {
    user: userSchemaType;
    setUser(user: userSchemaType): any;
    setChips(points: number): any;
};
export const useUserStore = create<userStoreType>()(
    persist(
        (set) => ({
            user: {
                username: "",
                createdAt: new Date(),
                email: "",
                id: "",
                chips: 100000,
                updatedAt: new Date()
            },
            setUser(user) {
                set({ user });
            },
            setChips(chips) {
                set({ user: { ...this.user, chips } });
            }
        }),
        {
            name: "user-store"
        }
    )
);
