import type { userSchemaType } from "../../../backend/zod/user";
import { create } from "zustand";

type UserStoreType = {
    user: userSchemaType;
    setUser(user: userSchemaType): any;
    setChips(points: number): any;
};
export const useUserStore = create<UserStoreType>((set) => ({
    user: {
        username: "",
        createdAt: new Date(),
        email: "",
        id: "",
        chips: 0,
        updatedAt: new Date()
    },
    setUser(user) {
        set({ user });
    },
    setChips(chips) {
        set({ user: { ...this.user, chips } });
    }
}));
